<template>
  <v-container fluid class="cast-bg pa-6">
    <div class="mx-auto" style="max-width: 1200px">
      <!-- Connection banner for the host -->
      <v-slide-y-transition>
        <v-alert v-if="store.wsStatus !== 'open'" type="warning" variant="tonal" class="mb-4" rounded="xl">
          <v-progress-circular size="16" width="2" indeterminate class="mr-2" />
          {{ store.wsStatus === 'closed' ? 'Disconnected. ' + (store.lastError ?? '') : 'Connecting to live feed…' }}
        </v-alert>
      </v-slide-y-transition>

      <div class="text-center mb-6">
        <h1 class="text-h2 font-weight-black text-white cast-title">🎮 LIVE GAMECAST</h1>
        <p class="text-h5 text-white opacity-80">{{ gameMeta(store.gameName).label }} Arena</p>
      </div>

      <!-- Live Prompt (Synchronized Mode Only) -->
      <v-expand-transition>
        <div v-if="store.mode === 'synchronized' && store.gameStatus === 'in_progress' && currentPrompt" class="d-flex justify-center mb-8">
          <v-card rounded="xl" class="pa-6" elevation="8" width="100%" max-width="600">
            <div class="text-overline mb-4 text-center text-medium-emphasis">
              Prompt {{ displayIndex + 1 }} of {{ totalPrompts }}
            </div>
            
            <component :is="PromptBody" :prompt="currentPrompt" :settings="store.gameSettings" />
            
            <!-- Round Progress -->
            <div v-if="!roundFeedback" class="mt-6 text-center">
              <v-progress-linear :model-value="syncPct" height="10" rounded color="primary" striped />
              <div class="text-caption mt-2 font-weight-bold">
                {{ store.roundProgress.answered }} / {{ store.roundProgress.total }} answers submitted
              </div>
            </div>

            <!-- Round Feedback (Flashes between rounds) -->
            <v-expand-transition>
              <div v-if="roundFeedback" class="mt-6 text-center">
                <v-divider class="mb-4" />
                <div class="text-subtitle-2 font-weight-black mb-3">Round Results</div>
                <div class="d-flex flex-wrap ga-2 justify-center">
                  <v-chip v-for="r in roundFeedback" :key="r.user_id" 
                          :color="r.is_correct ? 'success' : 'error'" variant="flat" size="large">
                    {{ r.is_correct ? '✅' : '❌' }} {{ r.username }}
                  </v-chip>
                </div>
              </div>
            </v-expand-transition>
          </v-card>
        </div>
      </v-expand-transition>

      <!-- Status (Race mode or Lobby/Finished) -->
      <v-card v-if="store.mode === 'race' || store.gameStatus !== 'in_progress'" rounded="xl" class="pa-5 mb-6 text-center" elevation="6">
        <div class="text-h4 font-weight-black">{{ statusText }}</div>
        <template v-if="store.gameStatus === 'in_progress' && store.mode === 'race'">
          <div class="text-subtitle-1 mt-1">Leader progress: {{ leaderProgress }} / {{ totalPrompts }}</div>
          <v-progress-linear :model-value="progressPct" height="14" rounded color="primary" class="mt-3" striped />
        </template>
      </v-card>

      <!-- Leaderboard -->
      <TransitionGroup name="rank" tag="div" class="v-row">
        <v-col v-for="(player, idx) in leaderboard" :key="player.user_id" cols="12" sm="6" md="4" lg="3">
          <v-card class="pa-5 text-center leader-card h-100" rounded="xl" elevation="8"
                  :class="{ first: idx === 0, second: idx === 1, third: idx === 2 }">
            <div class="text-h3 mb-2">{{ MEDALS[idx] ?? idx + 1 }}</div>
            <div class="text-h5 font-weight-black mb-3 text-truncate">{{ player.username }}</div>
            <div class="d-flex ga-3 justify-center">
              <div class="score-box">
                <div class="score-label">CORRECT</div>
                <div class="score-value text-success">{{ player.correct }}</div>
              </div>
              <div class="score-box">
                <div class="score-label">WRONG</div>
                <div class="score-value text-error">{{ player.wrong }}</div>
              </div>
            </div>
            <v-divider class="my-3" />
            <div class="text-h6 font-weight-black">Score: {{ player.correct }}</div>
          </v-card>
        </v-col>
      </TransitionGroup>

      <div class="text-center mt-8 text-white opacity-70 text-body-2">🔴 Live WebSocket Feed</div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useMultiplayerStore } from '@/stores/multiplayer';
import { gameMeta, MEDALS } from './multiplayerMeta';
import { promptBodyFor } from './prompts';

const route = useRoute();
const store = useMultiplayerStore();
const arenaId = route.params.arenaId as string;

// Synchronized mode state
const displayIndex = ref(0);
const roundFeedback = ref<any[] | null>(null);
let feedbackTimer: ReturnType<typeof setTimeout> | null = null;

const PromptBody = computed(() => promptBodyFor(store.gameName));
const currentPrompt = computed(() => store.prompts[displayIndex.value]);
const syncPct = computed(() => store.roundProgress.total ? (store.roundProgress.answered / store.roundProgress.total) * 100 : 0);

const leaderboard = computed(() => {
  return Object.keys(store.playerNames)
    .map((id) => {
      const s = store.scores[id] ?? { correct: 0, wrong: 0 };
      return {
        user_id: id,
        username: store.playerNames[id],
        correct: s.correct,
        wrong: s.wrong,
      };
    })
    .sort((a, b) => b.correct - a.correct || a.wrong - b.wrong);
});

const totalPrompts = computed(() => store.prompts.length || 0);
const leaderProgress = computed(() => leaderboard.value.reduce((max, p) => Math.max(max, p.correct + p.wrong), 0));
const progressPct = computed(() => totalPrompts.value ? (leaderProgress.value / totalPrompts.value) * 100 : 0);

const statusText = computed(() => {
  switch (store.gameStatus) {
    case 'waiting': return '⏳ Waiting for the game to start';
    case 'in_progress': return store.mode === 'race' ? '🏃 Race in progress' : '⏱️ Synchronized mode';
    case 'finished': return '✅ Game finished';
    default: return 'Loading…';
  }
});

// Sync the local display index based on player scores if joining mid-game
function syncIndexFromScores() {
  const scores = Object.values(store.scores);
  if (scores.length) {
    // In synchronized mode, everyone's answered count is the current round index
    displayIndex.value = Math.max(0, ...scores.map(s => s.correct + s.wrong));
  }
}

const unsubscribe = store.subscribe((msg) => {
  if (msg.type === 'arena_state') {
    syncIndexFromScores();
  } else if (msg.type === 'game_started') {
    displayIndex.value = 0;
    roundFeedback.value = null;
  } else if (msg.type === 'round_complete') {
    // Show the results (✅ / ❌) for 3.5 seconds before advancing the Gamecast view
    roundFeedback.value = msg.results;
    if (feedbackTimer) clearTimeout(feedbackTimer);
    
    feedbackTimer = setTimeout(() => {
      roundFeedback.value = null;
      displayIndex.value = (msg.prompt_index ?? 0) + 1;
    }, 3500);
  }
});

onMounted(async () => {
  if (!store.prompts.length || store.arenaId !== arenaId) {
    await store.hydrateFromRest(arenaId).catch(() => {});
  }
  await store.connect(arenaId);
  store.requestState();
});

onBeforeUnmount(() => {
  unsubscribe();
  if (feedbackTimer) clearTimeout(feedbackTimer);
  store.disconnect();
});
</script>

<style scoped>
.cast-bg { min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.cast-title { text-shadow: 0 4px 24px rgba(0, 0, 0, .35); }
.leader-card { background: #fff; transition: transform .3s; }
.leader-card:hover { transform: translateY(-8px); }
.first { background: linear-gradient(135deg, #ffd700, #ffed4e) !important; border: 3px solid #ffc700; }
.second { background: linear-gradient(135deg, #c0c0c0, #e8e8e8) !important; border: 3px solid #a8a8a8; }
.third { background: linear-gradient(135deg, #cd7f32, #e6a857) !important; border: 3px solid #b8860b; }
.score-box { flex: 1; background: rgba(255, 255, 255, .65); padding: 10px; border-radius: 12px; }
.score-label { font-size: 11px; font-weight: 700; color: #666; }
.score-value { font-size: 28px; font-weight: 900; }
.rank-move, .rank-enter-active, .rank-leave-active { transition: all .6s ease; }
.rank-enter-from, .rank-leave-to { opacity: 0; transform: translateY(30px); }
</style>