<template>
  <v-container fluid class="cast-bg pa-6">
    <div class="mx-auto" style="max-width: 1200px">
      <div class="text-center mb-6">
        <h1 class="text-h2 font-weight-black text-white cast-title">🎮 LIVE GAMECAST</h1>
        <p class="text-h5 text-white opacity-80">{{ gameMeta(gamecast?.game_name).label }} Arena</p>
      </div>

      <v-alert v-if="error" type="error" variant="tonal" class="mb-4" rounded="xl">{{ error }}</v-alert>

      <!-- Status -->
      <v-card rounded="xl" class="pa-5 mb-6 text-center" elevation="6">
        <div class="text-h4 font-weight-black">{{ statusText }}</div>
        <template v-if="gamecast?.status === 'in_progress'">
          <div class="text-subtitle-1 mt-1">Leader progress: {{ leaderProgress }} / {{ gamecast?.total_prompts }}</div>
          <v-progress-linear :model-value="progressPct" height="14" rounded color="primary" class="mt-3" striped />
        </template>
      </v-card>

      <!-- Leaderboard -->
      <TransitionGroup name="rank" tag="div" class="v-row">
        <v-col v-for="(player, idx) in players" :key="player.user_id" cols="12" sm="6" md="4" lg="3">
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
            <div class="text-h6 font-weight-black">Score: {{ Number(player.score ?? 0).toFixed(1) }}</div>
          </v-card>
        </v-col>
      </TransitionGroup>

      <div class="text-center mt-8 text-white opacity-70 text-body-2">🔄 Auto-refreshing every 2 seconds</div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/axios';
import { gameMeta, MEDALS } from './multiplayerMeta';

const route = useRoute();
const arenaId = route.params.arenaId as string;

const gamecast = ref<any>(null);
const error = ref('');

const players = computed<any[]>(() => gamecast.value?.players ?? []);
const leaderProgress = computed(() =>
  players.value.reduce((m, p) => Math.max(m, (p.correct ?? 0) + (p.wrong ?? 0)), 0)
);
const progressPct = computed(() => {
  const t = gamecast.value?.total_prompts;
  return t ? (leaderProgress.value / t) * 100 : 0;
});
const statusText = computed(() => {
  switch (gamecast.value?.status) {
    case 'waiting': return '⏳ Waiting for the game to start';
    case 'in_progress': return '🎮 Game in progress';
    case 'finished': return '✅ Game finished';
    default: return 'Loading…';
  }
});

async function fetchGamecast() {
  try {
    const res = await api.get(`/multiplayer-gamecast/${arenaId}/`);
    gamecast.value = res.data;
    error.value = '';
  } catch (err) {
    console.error('Failed to fetch gamecast:', err);
    error.value = 'Could not load live data. Retrying…';
  }
}

let interval: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  fetchGamecast();
  interval = setInterval(fetchGamecast, 2000);
});
onUnmounted(() => {
  if (interval) clearInterval(interval);
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