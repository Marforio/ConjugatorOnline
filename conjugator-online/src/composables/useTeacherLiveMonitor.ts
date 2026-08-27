import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

type PresenceStudent = {
  student_id: number;
  initials: string;
  web_id: string;
  last_activity_type: string;
  last_activity_name: string;
  page?: string;
  seconds_ago: number;
  last_seen?: number;
};

type ActivityEvent = {
  teacher_id?: number;
  student_id: number;
  student_initials: string;
  activity_type: string;
  activity_name: string;
  description: string;
  timestamp?: string | null;
  durable?: boolean;
};

// module-level singleton state (shared across all composable consumers)
let socket: WebSocket | null = null;
let reconnectTimer: number | null = null;
let reconnectAttempts = 0;
let authBlocked = false;
let intentionalClose = false;
let lastTokenUsed = "";
let tokenRefreshListenerBound = false;
let tokenRefreshListener: ((e: Event) => void) | null = null;

// single-flight guards
let connectInFlight: Promise<void> | null = null;
let refreshInFlight: Promise<string | null> | null = null;
let lastAuthFailureAt = 0;

const isWsConnected = ref(false);
const wsError = ref<string | null>(null);
const presenceMap = ref<Record<number, PresenceStudent>>({});
const liveEvents = ref<ActivityEvent[]>([]);

const maxEvents = 200;
const AUTH_FAILURE_COOLDOWN_MS = 15000;

function wsBase(): string {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}`;
}

function nowMs() {
  return Date.now();
}

function markAuthFailure(reason: string) {
  lastAuthFailureAt = nowMs();
  stopReconnect(reason);
}

function inAuthCooldown() {
  return nowMs() - lastAuthFailureAt < AUTH_FAILURE_COOLDOWN_MS;
}

function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function cleanupSocketOnly() {
  if (!socket) return;
  socket.onopen = null;
  socket.onmessage = null;
  socket.onclose = null;
  socket.onerror = null;
  try {
    intentionalClose = true;
    socket.close(1000, "cleanup");
  } catch {}
  socket = null;
}

function stopReconnect(reason: string) {
  authBlocked = true;
  clearReconnectTimer();
  wsError.value = reason;
}

function scheduleReconnect(connectFn: () => Promise<void> | void) {
  if (authBlocked || intentionalClose) return;
  if (reconnectTimer) return;
  if (inAuthCooldown()) return;

  reconnectAttempts += 1;
  const backoff = Math.min(10000, 1000 * Math.pow(2, Math.min(reconnectAttempts, 4)));
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null;
    void connectFn();
  }, backoff);
}

export function useTeacherLiveMonitor() {
  const auth = useAuthStore();

  async function ensureFreshAccessSingleFlight(): Promise<string | null> {
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
      const current = auth.access || "";
      if (!current) return null;

      // If token is still valid, use it immediately.
      if (!auth.isAccessTokenExpired()) return current;

      // Expired -> refresh once
      try {
        await auth.refreshAccessToken();
        return auth.access || null;
      } catch {
        return null;
      }
    })();

    try {
      return await refreshInFlight;
    } finally {
      refreshInFlight = null;
    }
  }

  async function connectInternal() {
    // duplicate guard
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (inAuthCooldown()) {
      wsError.value = "Auth cooldown active; waiting before reconnect";
      return;
    }

    intentionalClose = false;

    const token = await ensureFreshAccessSingleFlight();
    if (!token) {
      markAuthFailure("No valid teacher auth token (refresh/validate failed)");
      return;
    }

    const url = `${wsBase()}/ws/teacher/live/?token=${encodeURIComponent(token)}`;
    lastTokenUsed = token;
    socket = new WebSocket(url);

    socket.onopen = () => {
      isWsConnected.value = true;
      wsError.value = null;
      reconnectAttempts = 0;
      authBlocked = false;
      lastAuthFailureAt = 0;
      console.log("TEACHER_WS open:", url);
    };

    socket.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);

        if (msg.type === "presence.snapshot") {
          const next: Record<number, PresenceStudent> = {};
          for (const s of msg.students || []) next[s.student_id] = s;
          presenceMap.value = next;
          return;
        }

        if (msg.type === "presence.upsert" && msg.presence) {
          presenceMap.value[msg.presence.student_id] = msg.presence;
          return;
        }

        if (msg.type === "presence.remove" && typeof msg.student_id === "number") {
          delete presenceMap.value[msg.student_id];
          return;
        }

        if (msg.type === "activity.event" && msg.event) {
          liveEvents.value.unshift(msg.event);
          if (liveEvents.value.length > maxEvents) {
            liveEvents.value = liveEvents.value.slice(0, maxEvents);
          }
          return;
        }
      } catch {
        // ignore malformed messages
      }
    };

    socket.onerror = () => {
      wsError.value = "Teacher WebSocket error";
    };

    socket.onclose = (evt) => {
      isWsConnected.value = false;
      socket = null;

      // Stop on explicit auth/policy closures
      if (evt.code === 4403 || evt.code === 1008) {
        markAuthFailure(`Teacher websocket rejected (${evt.code})`);
        return;
      }

      // Browsers report handshake fail as 1006; treat as potential auth failure if we just refreshed/validated
      if (evt.code === 1006 && auth.isAccessTokenExpired()) {
        markAuthFailure("Teacher websocket abnormal close (1006) with expired auth state");
        return;
      }

      scheduleReconnect(connect);
    };
  }

  async function connect() {
    if (connectInFlight) return connectInFlight;
    connectInFlight = (async () => {
      await connectInternal();
    })();
    try {
      await connectInFlight;
    } finally {
      connectInFlight = null;
    }
  }

  function disconnect() {
    intentionalClose = true;
    clearReconnectTimer();
    cleanupSocketOnly();
    isWsConnected.value = false;
  }

  function requestSnapshot() {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "presence.snapshot.request" }));
    }
  }

  function bindTokenRefreshListenerOnce() {
    if (tokenRefreshListenerBound) return;
    tokenRefreshListenerBound = true;

    tokenRefreshListener = async () => {
      const current = auth.access || "";
      if (!current) return;

      // clear auth block only when we actually have a token
      authBlocked = false;

      // reconnect only when token actually changed
      if (current !== lastTokenUsed) {
        disconnect();
        await connect();
      }
    };

    window.addEventListener("auth:token-refreshed", tokenRefreshListener as EventListener);
  }

  function unbindTokenRefreshListener() {
    if (!tokenRefreshListenerBound || !tokenRefreshListener) return;
    window.removeEventListener("auth:token-refreshed", tokenRefreshListener as EventListener);
    tokenRefreshListenerBound = false;
    tokenRefreshListener = null;
  }

  // expose for root layout lifecycle control
  function init() {
    bindTokenRefreshListenerOnce();
  }

  function destroy() {
    unbindTokenRefreshListener();
    disconnect();
  }

  return {
    isWsConnected,
    wsError,
    presenceMap,
    liveEvents,
    connect,
    disconnect,
    requestSnapshot,
    init,
    destroy,
  };
}