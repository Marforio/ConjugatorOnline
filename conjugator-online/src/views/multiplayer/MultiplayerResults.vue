<template>
  <v-container class="pa-6 results-bg" fluid>
    <!-- Confetti -->
    <div v-if="iWon" class="confetti" aria-hidden="true">
      <span v-for="c in confetti" :key="c.id"
            :style="{ left: c.left + '%', animationDelay: c.delay + 's', background: c.color, animationDuration: c.dur + 's' }" />
    </div>

    <div class="mx-auto" style="max-width: 900px; position: relative; z-index: 1">
      <div class="text-center mb-6">
        <h1 class="text-h2 font-weight-black hero-title">🏆 Game Results</h1>
        <p class="text-h6 text-medium-emphasis">{{ gameMeta(gameName).label }}</p>
      </div>

      <div v-if="loading" class="text-center pa-10"><v-progress-circular indeterminate size="48" color="primary" /></div>

      <v-alert v-else-if="!rankings.length" type="warning" variant="tonal" rounded="xl">
        Results aren't available yet.
        <template #append><v-btn variant="text" @click="load">Retry</v-btn></template>
      </v-alert>

      <template v-else>
        <!-- Winner banner -->
        <v-card rounded="xl" class="pa-6 text-center mb-6 winner-card" elevation="6">
          <div class="text-h3 mb-1">{{ iWon ? '🎉' : '👑' }}</div>
          <div class="text-h4 font-weight-black">
            {{ iWon ? 'You win!' : `${rankings[0].username} wins!` }}
          </div>
        </v-card>

        <!-- Podium -->
        <div class="podium d-flex justify-center align-end ga-3 mb-8">
          <div v-for="p in podium" :key="p.user_id" class="podium-col text-center">
            <v-avatar :color="p.placement === 1 ? 'amber' : p.placement === 2 ? 'blue-grey-lighten-2' : 'brown-lighten-1'" size="64" class="mb-2">
              <span class="font-weight-black text-white text-h6">{{ p.username.slice(0, 2).toUpperCase() }}</span>
            </v-avatar>
            <div class="font-weight-black text-truncate">{{ p.username }}</div>
            <div class="text-caption mb-1">{{ p.performance_score.toFixed(1) }} pts</div>
            <div class="podium-block d-flex align-center justify-center text-h3"
                 :style="{ height: (p.placement === 1 ? 150 : p.placement === 2 ? 110 : 80) + 'px' }">
              {{ MEDALS[p.placement - 1] }}
            </div>
          </div>
        </div>

        <!-- Table -->
        <v-card rounded="xl" elevation="3" class="overflow-hidden">
          <v-table>
            <thead>
              <tr>
                <th>Rank</th><th>Player</th>
                <th class="text-center">✅</th><th class="text-center">❌</th>
                <th class="text-center">Accuracy</th><th class="text-center">Avg time</th><th class="text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rankings" :key="r.user_id" :class="{ 'me-row': r.user_id === userStore.user?.id }">
                <td class="text-h6">{{ MEDALS[r.placement - 1] ?? r.placement }}</td>
                <td class="font-weight-bold">{{ r.username }}<span v-if="r.user_id === userStore.user?.id" class="text-caption"> (you)</span></td>
                <td class="text-center text-success font-weight-bold">{{ r.correct_count }}</td>
                <td class="text-center text-error font-weight-bold">{{ r.wrong_count }}</td>
                <td class="text-center">{{ accuracy(r) }}%</td>
                <td class="text-center">{{ Number(r.avg_time_per_prompt ?? 0).toFixed(1) }}s</td>
                <td class="text-center font-weight-black text-primary">{{ Number(r.performance_score ?? 0).toFixed(1) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <div class="d-flex justify-center ga-3 mt-8 flex-wrap">
          <v-btn color="primary" size="large" rounded="xl" prepend-icon="mdi-replay"
                 @click="router.push({ name: 'MultiplayerLobby', query: { create: '1' } })">
            Play again
          </v-btn>
          <v-btn variant="outlined" size="large" rounded="xl" @click="router.push({ name: 'MultiplayerLobby' })">
            Back to lobby
          </v-btn>
        </div>
      </template>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/axios';
import { useUserStore } from '@/stores/user';
import { useMultiplayerStore } from '@/stores/multiplayer';
import { gameMeta, MEDALS } from './multiplayerMeta';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const store = useMultiplayerStore();

const arenaId = route.params.arenaId as string;
const rankings = ref<any[]>([]);
const gameName = ref<string | null>(null);
const loading = ref(true);

const podium = computed(() => {
  const top = rankings.value.slice(0, 3);
  // visual order: 2nd, 1st, 3rd
  return [top[1], top[0], top[2]].filter(Boolean);
});
const iWon = computed(() => rankings.value[0]?.user_id === userStore.user?.id);

const accuracy = (r: any) => {
  const t = (r.correct_count ?? 0) + (r.wrong_count ?? 0);
  return t ? Math.round((r.correct_count / t) * 100) : 0;
};

const confetti = Array.from({ length: 40 }, (_, id) => ({
  id,
  left: Math.random() * 100,
  delay: Math.random() * 3,
  dur: 3 + Math.random() * 3,
  color: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][id % 5],
}));

async function load() {
  loading.value = true;
  try {
    const [result, arena] = await Promise.all([
      api.get(`/multiplayer-results/${arenaId}/`).then(
        value => ({ status: 'fulfilled' as const, value }),
        reason => ({ status: 'rejected' as const, reason }),
      ),
      api.get(`/multiplayer-arenas/${arenaId}/`).then(
        value => ({ status: 'fulfilled' as const, value }),
        reason => ({ status: 'rejected' as const, reason }),
      ),
    ]);
    if (result.status === 'fulfilled') rankings.value = result.value.data.final_rankings ?? [];
    if (arena.status === 'fulfilled') gameName.value = arena.value.data.game_name;
  } catch (err) {
    console.error('Failed to fetch results:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  const cached = store.finalRankings.length ? [...store.finalRankings] : null;
  store.disconnect(); // game is over; free the socket
  await load();
  if (!rankings.value.length && cached) rankings.value = cached;
});
</script>

<style scoped>
.results-bg { min-height: 100vh; background: linear-gradient(160deg, #fffbeb, #fdf2f8 50%, #eef2ff); overflow: hidden; position: relative; }
.hero-title { background: linear-gradient(90deg, #f59e0b, #ec4899, #6366f1); -webkit-background-clip: text; background-clip: text; color: transparent; }
.winner-card { background: linear-gradient(135deg, #fde68a, #fbcfe8); }
.podium-col { width: 150px; }
.podium-block { background: linear-gradient(180deg, #818cf8, #6366f1); border-radius: 16px 16px 0 0; animation: rise .8s ease-out; }
@keyframes rise { from { transform: scaleY(0); transform-origin: bottom; } to { transform: scaleY(1); transform-origin: bottom; } }
.me-row { background: rgba(99, 102, 241, .1); }

.confetti { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.confetti span { position: absolute; top: -20px; width: 10px; height: 16px; opacity: .9; animation: fall linear infinite; }
@keyframes fall { to { transform: translateY(110vh) rotate(720deg); } }
</style>