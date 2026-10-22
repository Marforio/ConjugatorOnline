// stores/multiplayer.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/axios';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';

export type WsStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed';
export type ServerMessage = { type: string; [key: string]: any };
type Listener = (msg: ServerMessage) => void;

const FATAL_CLOSE_CODES = new Set([4001, 4003, 4004]); // unauthenticated / no arena / not participant
const MAX_RETRIES = 8;

function wsBase() {
  const env = (import.meta.env.VITE_WS_BASE_URL || '').replace(/\/+$/, '');
  if (env) return env;
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}`;
}

function tokenNeedsRefresh(token?: string | null) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp * 1000 - Date.now() < 30_000;
  } catch {
    return true;
  }
}

export const useMultiplayerStore = defineStore('multiplayer', () => {
  // ---------- reactive state ----------
  const userStore = useUserStore();
  const myId = computed(() => (userStore.user?.id != null ? String(userStore.user.id) : ''));
  const arenaId = ref<string | null>(null);
  const wsStatus = ref<WsStatus>('idle');
  const gameStatus = ref<'waiting' | 'in_progress' | 'finished'>('waiting');
  const gameName = ref<string>('');
  const gameSettings = ref<Record<string, any>>({});
  const mode = ref<'race' | 'synchronized'>('race');
  const players = ref<{ user_id: number; username: string }[]>([]); // live-connected (Redis)
  const prompts = ref<any[]>([]);
  const scores = ref<Record<string, { correct: number; wrong: number }>>({});
  const playerNames = ref<Record<string, string>>({});
  const finishedPlayers = ref<string[]>([]);
  const roundProgress = ref({ answered: 0, total: 0 });
  const finalRankings = ref<any[]>([]);
  const countdownEndsAt = ref<number | null>(null);
  const lastError = ref<string | null>(null);

  const wsConnected = computed(() => wsStatus.value === 'open');

  const currentPromptIndexByUser = ref<Record<string, number>>({});
  const gameHydrated = ref(false);

  const myPromptIndex = computed(() => currentPromptIndexByUser.value[myId.value] ?? 0);

  // ---------- non-reactive internals ----------
  let socket: WebSocket | null = null;
  let retries = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let intentionalClose = false;
  const listeners = new Set<Listener>();

  function subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function setMyPromptIndex(userId: string, index: number) {
    currentPromptIndexByUser.value[userId] = Math.max(0, index);
  }

  function resetState() {
    gameStatus.value = 'waiting';
    gameName.value = '';
    gameSettings.value = {};
    mode.value = 'race';
    players.value = [];
    prompts.value = [];
    scores.value = {};
    playerNames.value = {};
    finishedPlayers.value = [];
    roundProgress.value = { answered: 0, total: 0 };
    finalRankings.value = [];
    gameHydrated.value = false;
    currentPromptIndexByUser.value = {};
    countdownEndsAt.value = null;
    lastError.value = null;
  }

  // ---------- message handling ----------
  function handleMessage(msg: ServerMessage) {
    switch (msg.type) {
      case 'arena_state':
        players.value = msg.players ?? [];
        if (msg.game_status) gameStatus.value = msg.game_status;
        (msg.players ?? []).forEach((p: any) => (playerNames.value[String(p.user_id)] = p.username));
        if (Array.isArray(msg.prompts) && msg.prompts.length) {
          prompts.value = msg.prompts;
        }
        if (msg.mode) mode.value = msg.mode;
        if (typeof msg.current_prompt_index === 'number') {
            if (myId.value) setMyPromptIndex(myId.value, msg.current_prompt_index);
            gameHydrated.value = true;
          }
        break;

      case 'game_started':
        mode.value = msg.mode;
        prompts.value = msg.prompts ?? [];
        gameStatus.value = 'in_progress';
        finishedPlayers.value = [];
        finalRankings.value = [];
        roundProgress.value = { answered: 0, total: msg.num_players ?? 0 };
        Object.keys(playerNames.value).forEach((id) => (scores.value[id] = { correct: 0, wrong: 0 }));
        countdownEndsAt.value = Date.now() + 3000;
        currentPromptIndexByUser.value = {}; // reset per-player progress at fresh start
        gameHydrated.value = true;
        break;

      case 'answer_submitted': {
        if (msg.scores) scores.value = msg.scores;
        playerNames.value[String(msg.user_id)] = msg.username;
        const uid = String(msg.user_id);
        currentPromptIndexByUser.value[uid] = Math.max(
          currentPromptIndexByUser.value[uid] ?? 0,
          (msg.prompt_index ?? 0) + 1,
        );
        break;
      }

      case 'round_progress':
        roundProgress.value = { answered: msg.num_answered, total: msg.num_players };
        break;

      case 'round_complete': {
        if (msg.scores) scores.value = msg.scores;
        (msg.results ?? []).forEach((r: any) => {
          const uid = String(r.user_id);
          playerNames.value[uid] = r.username;
          currentPromptIndexByUser.value[uid] = (msg.prompt_index ?? 0) + 1;
        });
        roundProgress.value = { answered: 0, total: roundProgress.value.total };
        break;
      }

      case 'player_finished':
        if (!finishedPlayers.value.includes(String(msg.user_id))) {
          finishedPlayers.value.push(String(msg.user_id));
        }
        break;

      case 'game_finished':
        gameStatus.value = 'finished';
        finalRankings.value = msg.final_rankings ?? [];
        if (msg.scores) scores.value = msg.scores;
        break;

      case 'out_of_sync': {
        if (myId.value && typeof msg.expected_prompt_index === 'number') {
          setMyPromptIndex(myId.value, msg.expected_prompt_index);
        }
        requestState();
        break;
      }
      
        case 'error':
        lastError.value = msg.message ?? 'Unknown error';
        break;
    }
  }

  // ---------- connection ----------
  async function openSocket() {
    if (!arenaId.value) return;
    const auth = useAuthStore();
    wsStatus.value = retries > 0 ? 'reconnecting' : 'connecting';

    if (tokenNeedsRefresh(auth.access)) {
      try {
        await auth.refreshAccessToken();
      } catch {
        /* fall through: the handshake will fail and we retry */
      }
    }

    const url = `${wsBase()}/ws/multiplayer-arena/${arenaId.value}/?token=${encodeURIComponent(auth.access || '')}`;
    const ws = new WebSocket(url);
    socket = ws;

    ws.onopen = () => {
      if (ws !== socket) return;
      retries = 0;
      wsStatus.value = 'open';
      ws.send(JSON.stringify({ action: 'get_state' }));
    };

    ws.onmessage = (event) => {
      if (ws !== socket) return;
      let msg: ServerMessage;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      handleMessage(msg);
      listeners.forEach((fn) => fn(msg));
    };

    ws.onerror = () => {
      /* onclose always follows; handled there */
    };

    ws.onclose = (event) => {
      if (ws !== socket) return; // stale socket
      if (intentionalClose || event.code === 1000) {
        wsStatus.value = 'closed';
        return;
      }
      if (FATAL_CLOSE_CODES.has(event.code)) {
        wsStatus.value = 'closed';
        lastError.value = `Connection refused (code ${event.code})`;
        listeners.forEach((fn) => fn({ type: '_fatal', code: event.code }));
        return;
      }
      if (retries >= MAX_RETRIES) {
        wsStatus.value = 'closed';
        lastError.value = 'Connection lost. Please reload the page.';
        return;
      }
      wsStatus.value = 'reconnecting';
      const delay = Math.min(1000 * 2 ** retries, 8000);
      retries++;
      reconnectTimer = setTimeout(openSocket, delay);
    };
  }

  async function connect(id: string) {
    if (
      socket &&
      arenaId.value === id &&
      (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
    ) {
      requestState();
      return;
    }
    if (arenaId.value && arenaId.value !== id) {
      disconnect();
    }
    arenaId.value = id;
    intentionalClose = false;
    retries = 0;
    await openSocket();
  }

  function disconnect(keepState = false) {
    intentionalClose = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = null;
    const s = socket;
    socket = null;
    if (s) {
      s.onclose = null;
      s.onmessage = null;
      s.close(1000);
    }
    wsStatus.value = 'idle';
    arenaId.value = null;
    if (!keepState) resetState();
  }

  function send(payload: Record<string, any>): boolean {
    if (socket?.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify(payload));
    return true;
  }

  // ---------- actions ----------
  const startGame = () => send({ action: 'start_game' });
  const requestState = () => send({ action: 'get_state' });
  const sendAnswer = (promptIndex: number, answer: string, elapsedSeconds: number) =>
    send({
      action: 'submit_answer',
      prompt_index: promptIndex,
      user_answer: answer,
      elapsed_time: elapsedSeconds,
    });

  /** Load prompts / participants from REST (page reload, late join). */
  async function hydrateFromRest(id: string) {
    const res = await api.get(`/multiplayer-arenas/${id}/`);
    const a = res.data;
    mode.value = a.game_mode;
    gameStatus.value = a.status;
    gameName.value = a.game_name;
    gameSettings.value = a.game_settings ?? {}; 
    if (!prompts.value.length && a.prompts?.length) prompts.value = a.prompts;
    (a.participants ?? []).forEach((p: any) => {
      const uid = String(p.user.id);
      playerNames.value[uid] = p.user.username;
      if (!scores.value[uid]) {
        scores.value[uid] = { correct: p.correct_count ?? 0, wrong: p.wrong_count ?? 0 };
      }
    });
    return a;
  }

  return {
    arenaId, wsStatus, wsConnected, gameStatus, mode, players, prompts, scores,
    playerNames, finishedPlayers, roundProgress, finalRankings, countdownEndsAt, lastError,
    subscribe, connect, disconnect, resetState, send, startGame, requestState,
    sendAnswer, hydrateFromRest, currentPromptIndexByUser, gameHydrated, setMyPromptIndex, myPromptIndex, gameName, gameSettings,
  };
});