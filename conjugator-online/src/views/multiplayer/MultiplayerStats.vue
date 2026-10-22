<template>
  <v-container class="pa-6 stats-bg" fluid>
    <div class="mx-auto" style="max-width: 1000px">
      <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
        <h1 class="text-h4 font-weight-black">📊 Multiplayer Stats</h1>
        <v-btn variant="tonal" rounded="lg" prepend-icon="mdi-arrow-left" :to="{ name: 'MultiplayerLobby' }">
          Back to Lobby
        </v-btn>
      </div>

      <div v-if="loading" class="text-center pa-10"><v-progress-circular indeterminate /></div>
      <v-alert v-else-if="error" type="error" variant="tonal">{{ error }}</v-alert>

      <!-- Student -->
      <template v-else-if="data?.role === 'student'">
        <v-card v-if="!data.games.length" rounded="xl" variant="tonal" class="pa-8 text-center">
          No finished multiplayer games yet. Go play one! 🎮
        </v-card>
        <template v-else>
          <v-row class="mb-4">
            <v-col cols="12" sm="4"><v-card rounded="xl" class="pa-4 text-center">
              <div class="text-overline">Record</div>
              <div class="text-h5 font-weight-black">{{ total.wins }}W – {{ total.losses }}L</div>
            </v-card></v-col>
            <v-col cols="12" sm="4"><v-card rounded="xl" class="pa-4 text-center">
              <div class="text-overline">Win rate</div>
              <div class="text-h5 font-weight-black">{{ total.win_rate }}%</div>
            </v-card></v-col>
            <v-col cols="12" sm="4"><v-card rounded="xl" class="pa-4 text-center">
              <div class="text-overline">Accuracy</div>
              <div class="text-h5 font-weight-black">{{ total.accuracy }}%</div>
            </v-card></v-col>
          </v-row>

          <v-row>
            <v-col v-for="g in data.games" :key="g.game_name" cols="12" md="6">
              <v-card rounded="xl" class="pa-4">
                <div class="d-flex align-center mb-3">
                  <v-icon :color="gameMeta(g.game_name).color" class="mr-2">{{ gameMeta(g.game_name).icon }}</v-icon>
                  <div class="text-h6 font-weight-black">{{ gameMeta(g.game_name).label }}</div>
                  <v-spacer />
                  <v-chip size="small">{{ g.games }} played</v-chip>
                </div>
                <div class="d-flex justify-space-between mb-1">
                  <span>Record</span><strong>{{ g.wins }}W – {{ g.losses }}L ({{ g.win_rate }}%)</strong>
                </div>
                <div class="text-caption mb-1">Accuracy</div>
                <v-progress-linear :model-value="g.accuracy" height="18" rounded :color="gameMeta(g.game_name).color">
                  <strong class="text-white text-caption">{{ g.accuracy }}%</strong>
                </v-progress-linear>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </template>

      <!-- Teacher -->
      <template v-else-if="data?.role === 'teacher'">
        <v-card v-if="!data.courses.length" rounded="xl" variant="tonal" class="pa-8 text-center">
          No finished multiplayer games for your classes yet.
        </v-card>
        <v-card v-for="c in data.courses" :key="c.course" rounded="xl" class="mb-6 pa-4">
          <div class="text-h6 font-weight-black mb-2">🏫 {{ prettySlug(c.course) }}</div>
          <v-table density="comfortable">
            <thead>
              <tr>
                <th>#</th><th>Student</th><th class="text-right">Games</th>
                <th class="text-right">W–L</th><th class="text-right">Win rate</th>
                <th class="text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in c.students" :key="s.user_id">
                <td>{{ medal(s.rank) }}</td>
                <td class="font-weight-bold">{{ s.name }}</td>
                <td class="text-right">{{ s.games }}</td>
                <td class="text-right">{{ s.wins }}–{{ s.losses }}</td>
                <td class="text-right">{{ s.win_rate }}%</td>
                <td class="text-right">{{ s.accuracy }}%</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </template>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/axios';
import { gameMeta, MEDALS } from './multiplayerMeta';

const data = ref<any>(null);
const loading = ref(true);
const error = ref('');

const prettySlug = (s: string) => s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const medal = (rank: number) => MEDALS[rank - 1] ?? rank;

// Student totals across games; accuracy weighted by games played
const total = computed(() => {
  const g: any[] = data.value?.games ?? [];
  const games = g.reduce((a, x) => a + x.games, 0);
  const wins = g.reduce((a, x) => a + x.wins, 0);
  const acc = games ? g.reduce((a, x) => a + x.accuracy * x.games, 0) / games : 0;
  return {
    wins,
    losses: games - wins,
    win_rate: games ? Math.round((1000 * wins) / games) / 10 : 0,
    accuracy: Math.round(acc * 10) / 10,
  };
});

onMounted(async () => {
  try {
    data.value = (await api.get('/multiplayer-stats/')).data;
  } catch {
    error.value = 'Could not load stats.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.stats-bg { min-height: 100vh; background: radial-gradient(circle at 10% 0%, #eef2ff 0%, #fff 45%, #fdf2f8 100%); }
</style>