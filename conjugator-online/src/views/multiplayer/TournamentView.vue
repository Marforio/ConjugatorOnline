<template>
  <v-container class="pa-6 lobby-bg" fluid>
    <div v-if="!t" class="text-center pa-10"><v-progress-circular indeterminate /></div>

    <div v-else class="mx-auto" style="max-width: 1300px">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-4">
        <div>
          <h1 class="text-h4 font-weight-black">🏆 {{ t.name || gameMeta(t.game_name).label }}</h1>
          <div class="text-body-2 text-medium-emphasis">
            {{ gameMeta(t.game_name).label }} · {{ prettySlug(t.course) }} · host {{ t.creator_username }}
          </div>
        </div>
        <div class="d-flex ga-2 align-center">
          <v-chip :color="statusColor(t.status)">{{ statusLabel(t.status) }}</v-chip>
          <v-btn variant="tonal" rounded="lg" :to="{ name: 'TournamentList' }">All tournaments</v-btn>
        </div>
      </div>

      <v-alert v-if="msg" :type="msgType" variant="tonal" class="mb-4" closable @click:close="msg = ''">{{ msg }}</v-alert>

      <!-- Champion -->
      <v-card v-if="t.status === 'finished' && t.champion_username" rounded="xl" class="pa-6 mb-4 text-center champion">
        <div class="text-h2">🥇</div>
        <div class="text-h4 font-weight-black">{{ t.champion_username }}</div>
        <div class="text-body-2">Tournament champion</div>
      </v-card>

      <!-- My next match -->
      <v-card v-if="myLiveMatch" rounded="xl" class="pa-4 mb-4" color="primary" variant="tonal">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <div>
            <div class="text-overline">Your match is live</div>
            <div class="text-h6 font-weight-black">
              vs {{ opponentName(myLiveMatch) }} (Round {{ myLiveMatch.round }})
            </div>
          </div>
          <v-btn color="primary" size="large" rounded="lg" @click="joinMatch(myLiveMatch)">Join match</v-btn>
        </div>
      </v-card>
      <v-alert v-else-if="amEliminated" type="info" variant="tonal" class="mb-4">
        You were eliminated in round {{ me?.eliminated_in_round }}. Watch the remaining matches below.
      </v-alert>

      <!-- Creator controls -->
      <v-card v-if="isCreator && !['finished', 'cancelled'].includes(t.status)" rounded="xl" class="pa-4 mb-4">
        <div class="text-subtitle-2 font-weight-bold mb-2">Host controls</div>
        <div class="d-flex flex-wrap ga-2">
          <v-btn v-if="t.status === 'registration'" color="primary" :loading="busy" :disabled="t.entrants.length < 4"
                 @click="act('start')">Start tournament (draw bracket)</v-btn>
          <v-btn v-if="t.status === 'registration'" variant="tonal" prepend-icon="mdi-account-plus"
                 @click="openAdd">Add players</v-btn>
          <v-btn v-if="['ready', 'awaiting_round'].includes(t.status)" color="success" :loading="busy"
                 @click="act('start-round')">Start round {{ t.current_round + 1 }}</v-btn>
          <v-btn color="error" variant="text" :loading="busy" @click="confirmCancel = true">Cancel tournament</v-btn>
        </div>
        <div v-if="t.status === 'registration' && t.entrants.length < 4" class="text-caption mt-2">
          Need at least 4 players ({{ t.entrants.length }} so far).
        </div>
      </v-card>

      <!-- Registration roster -->
      <v-card v-if="t.status === 'registration'" rounded="xl" class="pa-4 mb-4">
        <div class="text-subtitle-2 font-weight-bold mb-2">Players ({{ t.entrants.length }}/16)</div>
        <div class="d-flex flex-wrap ga-2">
          <v-chip v-for="e in t.entrants" :key="e.id" :closable="canRemove(e)" @click:close="removePlayer(e.user_id)">
            {{ e.username }}
          </v-chip>
        </div>
        <v-btn v-if="isEntrant && !isCreator" class="mt-3" variant="text" color="error" size="small"
               @click="removePlayer(userStore.user?.id)">Leave tournament</v-btn>
      </v-card>

      <!-- Bracket -->
      <div v-if="rounds.length" class="bracket">
        <div v-for="r in rounds" :key="r.round" class="bracket-col">
          <div class="text-overline text-center mb-2">{{ roundTitle(r.round) }}</div>
          <div class="bracket-matches">
            <v-card v-for="m in r.matches" :key="m.id" rounded="lg" class="match pa-2"
                    :class="{ 'match-mine': isMine(m), 'match-live': m.status === 'live' }" variant="outlined">
              <div class="player" :class="playerClass(m, 'a')">
                {{ m.player_a_username || 'TBD' }}
                <v-icon v-if="m.winner_id && m.winner_id === m.player_a_id" size="14">mdi-check-circle</v-icon>
              </div>
              <v-divider />
              <div class="player" :class="playerClass(m, 'b')">
                {{ m.status === 'bye' ? 'BYE' : (m.player_b_username || 'TBD') }}
                <v-icon v-if="m.winner_id && m.winner_id === m.player_b_id" size="14">mdi-check-circle</v-icon>
              </div>
              <div class="d-flex align-center justify-space-between mt-1">
                <v-chip size="x-small" :color="matchColor(m.status)">{{ m.status }}</v-chip>
                <span v-if="m.decided_by && m.status === 'finished'" class="text-caption">by {{ m.decided_by }}</span>
                <v-btn v-if="m.status === 'live' && !isMine(m)" size="x-small" variant="text" @click="watchMatch(m)">Watch</v-btn>
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Add players -->
    <v-dialog v-model="showAdd" max-width="480">
      <v-card rounded="xl" class="pa-5">
        <v-card-title class="px-0">Add players</v-card-title>
        <v-list density="compact" max-height="300" class="overflow-y-auto border rounded-lg">
          <v-list-item v-for="s in addable" :key="s.user_id" :disabled="blockedStudent(s)">
            <template #prepend>
              <v-checkbox-btn v-model="addIds" :value="s.user_id" :disabled="blockedStudent(s)" />
            </template>
            <v-list-item-title>{{ s.username }}</v-list-item-title>
            <v-list-item-subtitle v-if="blockedStudent(s)">Unavailable</v-list-item-subtitle>
          </v-list-item>
          <div v-if="!addable.length" class="pa-3 text-caption">No one left to add.</div>
        </v-list>
        <div class="d-flex justify-end ga-2 mt-4">
          <v-btn variant="text" @click="showAdd = false">Cancel</v-btn>
          <v-btn color="primary" :disabled="!addIds.length" :loading="busy" @click="addPlayers">Add</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmCancel" max-width="400">
      <v-card rounded="xl" class="pa-5">
        <v-card-title class="px-0">Cancel this tournament?</v-card-title>
        <div class="text-body-2 mb-4">Everyone will be released. This can't be undone.</div>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" @click="confirmCancel = false">Keep</v-btn>
          <v-btn color="error" @click="confirmCancel = false; act('cancel')">Cancel tournament</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/axios';
import { useUserStore } from '@/stores/user';
import { gameMeta } from './multiplayerMeta';
import { prettySlug, statusLabel, statusColor } from './tournamentMeta';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const id = route.params.id as string;

const t = ref<any>(null);
const busy = ref(false);
const msg = ref('');
const msgType = ref<'error' | 'success'>('error');
const showAdd = ref(false);
const confirmCancel = ref(false);
const addable = ref<any[]>([]);
const addIds = ref<number[]>([]);

const myId = computed(() => userStore.user?.id);
const isCreator = computed(() => t.value?.creator_id === myId.value);
const me = computed(() => t.value?.entrants.find((e: any) => e.user_id === myId.value));
const isEntrant = computed(() => !!me.value);
const amEliminated = computed(() => me.value?.status === 'eliminated');

const rounds = computed(() => {
  const by: Record<number, any[]> = {};
  for (const m of t.value?.matches ?? []) (by[m.round] ||= []).push(m);
  return Object.keys(by).map(Number).sort((a, b) => a - b)
    .map((r) => ({ round: r, matches: by[r].sort((a, b) => a.position - b.position) }));
});

const isMine = (m: any) => m.player_a_id === myId.value || m.player_b_id === myId.value;
const myLiveMatch = computed(() =>
  (t.value?.matches ?? []).find((m: any) => m.status === 'live' && isMine(m)) ?? null
);
const opponentName = (m: any) => (m.player_a_id === myId.value ? m.player_b_username : m.player_a_username);
const canRemove = (e: any) => isCreator.value && e.user_id !== myId.value;

function roundTitle(r: number) {
  const total = t.value.total_rounds;
  if (!total) return `Round ${r}`;
  if (r === total) return 'Final';
  if (r === total - 1) return 'Semifinal';
  return `Round ${r}`;
}
const matchColor = (s: string) =>
  ({ live: 'success', finished: 'grey', ready: 'primary', bye: 'default', pending: 'default' } as any)[s] ?? 'default';

function playerClass(m: any, side: 'a' | 'b') {
  const pid = side === 'a' ? m.player_a_id : m.player_b_id;
  return {
    'player-win': m.winner_id && pid === m.winner_id,
    'player-lose': m.winner_id && pid && pid !== m.winner_id,
    'player-me': pid && pid === myId.value,
  };
}

function joinMatch(m: any) {
  router.push({ name: 'MultiplayerArena', params: { arenaId: m.arena_id } });
}
function watchMatch(m: any) {
  router.push({ name: 'MultiplayerGamecast', params: { arenaId: m.arena_id } });
}

function fail(e: any) {
  msgType.value = 'error';
  msg.value = e.response?.data?.error || e.response?.data?.detail || 'Something went wrong.';
}

async function load() {
  try { t.value = (await api.get(`/tournaments/${id}/`)).data; }
  catch (e: any) { if (e.response?.status === 404) router.replace({ name: 'TournamentList' }); }
}

async function act(path: string) {
  busy.value = true;
  try { t.value = (await api.post(`/tournaments/${id}/${path}/`)).data; msg.value = ''; }
  catch (e) { fail(e); }
  finally { busy.value = false; }
}

async function openAdd() {
  try {
    const res = await api.get('/tournaments/eligible-classmates/', { params: { course: t.value.course } });
    const inside = new Set(t.value.entrants.map((e: any) => e.user_id));
    addable.value = res.data.students.filter((s: any) => !inside.has(s.user_id) && !s.is_me);
    addIds.value = [];
    showAdd.value = true;
  } catch (e) { fail(e); }
}
const blockedStudent = (s: any) => s.blocked_active_tournament || s.blocked_active_arena;

async function addPlayers() {
  busy.value = true;
  try {
    t.value = (await api.post(`/tournaments/${id}/add-entrants/`, { user_ids: addIds.value })).data;
    showAdd.value = false;
  } catch (e) { fail(e); }
  finally { busy.value = false; }
}

async function removePlayer(userId?: number) {
  if (!userId) return;
  try {
    t.value = (await api.post(`/tournaments/${id}/remove-entrant/`, { user_id: userId })).data;
    if (userId === myId.value) router.replace({ name: 'TournamentList' });
  } catch (e) { fail(e); }
}

let poll: ReturnType<typeof setInterval>;
onMounted(() => { load(); poll = setInterval(load, 3000); });
onUnmounted(() => clearInterval(poll));
</script>

<style scoped>
.lobby-bg { min-height: 100vh; background: radial-gradient(circle at 10% 0%, #eef2ff 0%, #fff 45%, #fdf2f8 100%); }
.champion { background: linear-gradient(135deg, #fde68a, #f59e0b); }
.bracket { display: flex; gap: 32px; overflow-x: auto; padding-bottom: 16px; }
.bracket-col { min-width: 210px; display: flex; flex-direction: column; }
.bracket-matches { display: flex; flex-direction: column; justify-content: space-around; flex: 1; gap: 16px; }
.match { background: #fff; }
.match-mine { border-color: #6366f1 !important; border-width: 2px; }
.match-live { box-shadow: 0 0 0 3px rgba(34, 197, 94, .25); }
.player { padding: 4px 6px; font-weight: 600; font-size: 14px; display: flex; justify-content: space-between; align-items: center; }
.player-win { color: #15803d; }
.player-lose { opacity: .45; text-decoration: line-through; }
.player-me { background: #eef2ff; border-radius: 6px; }
</style>