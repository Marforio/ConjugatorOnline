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

      <!-- Student View -->
      <template v-else-if="data?.role === 'student'">
        <v-card v-if="!data.games?.length" rounded="xl" variant="tonal" class="pa-8 text-center">
          No finished multiplayer games yet. Go play one! 🎮
        </v-card>
        
        <template v-else>
          <!-- Aggregated Overview -->
          <div class="text-subtitle-1 font-weight-black text-medium-emphasis mb-2">OVERALL PERFORMANCE</div>
          <v-row class="mb-6">
            <v-col cols="12" sm="4"><v-card rounded="xl" class="pa-4 text-center" elevation="2">
              <div class="text-overline">Total Record</div>
              <div class="text-h5 font-weight-black">{{ total.wins }}W – {{ total.losses }}L</div>
            </v-card></v-col>
            <v-col cols="12" sm="4"><v-card rounded="xl" class="pa-4 text-center" elevation="2">
              <div class="text-overline">Overall Win Rate</div>
              <div class="text-h5 font-weight-black">{{ total.win_rate }}%</div>
            </v-card></v-col>
            <v-col cols="12" sm="4"><v-card rounded="xl" class="pa-4 text-center" elevation="2">
              <div class="text-overline">Overall Accuracy</div>
              <div class="text-h5 font-weight-black">{{ total.accuracy }}%</div>
            </v-card></v-col>
          </v-row>

          <v-divider class="mb-6" />

          <!-- Sorted by Game -->
          <div class="text-subtitle-1 font-weight-black text-medium-emphasis mb-3">STATS BY GAME</div>
          <v-row>
            <v-col v-for="g in data.games" :key="g.game_name" cols="12" md="6">
              <v-card rounded="xl" class="pa-5 h-100" elevation="3">
                <div class="d-flex align-center mb-4">
                  <v-avatar :color="gameMeta(g.game_name).color" size="48" class="mr-3">
                    <v-icon color="white">{{ gameMeta(g.game_name).icon }}</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6 font-weight-black">{{ gameMeta(g.game_name).label }}</div>
                    <div class="text-caption text-medium-emphasis">{{ g.games }} games played</div>
                  </div>
                </div>
                
                <div class="d-flex justify-space-between mb-2 text-body-1">
                  <span class="font-weight-medium">Record</span>
                  <strong>{{ g.wins }}W – {{ g.losses }}L ({{ g.win_rate }}%)</strong>
                </div>
                
                <div class="text-caption font-weight-bold mb-1 mt-3">Accuracy</div>
                <v-progress-linear :model-value="g.accuracy" height="20" rounded :color="gameMeta(g.game_name).color">
                  <strong class="text-white text-caption">{{ g.accuracy }}%</strong>
                </v-progress-linear>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </template>

      <!-- Teacher View -->
      <template v-else-if="data?.role === 'teacher'">
        <v-card v-if="!data.courses?.length" rounded="xl" variant="tonal" class="pa-8 text-center">
          No finished multiplayer games for your classes yet.
        </v-card>
        
        <div v-for="c in data.courses" :key="c.course" class="mb-10">
          <div class="d-flex align-center mb-4">
            <h2 class="text-h5 font-weight-black">🏫 {{ prettySlug(c.course) }}</h2>
          </div>
          
          <v-row>
            <v-col v-for="g in c.games" :key="g.game_name" cols="12">
              <v-card rounded="xl" class="pa-4" elevation="3">
                <div class="d-flex align-center mb-3 pa-2">
                  <v-icon :color="gameMeta(g.game_name).color" class="mr-3" size="32">{{ gameMeta(g.game_name).icon }}</v-icon>
                  <div class="text-h6 font-weight-black">{{ gameMeta(g.game_name).label }} Leaderboard</div>
                </div>
                
                <v-table density="comfortable">
                  <thead>
                    <tr>
                      <th class="font-weight-black">Rank</th>
                      <th class="font-weight-black">Student</th>
                      <th class="text-right font-weight-black">Games</th>
                      <th class="text-right font-weight-black">W–L</th>
                      <th class="text-right font-weight-black">Win Rate</th>
                      <th class="text-right font-weight-black">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="s in g.students" :key="s.user_id">
                      <td class="text-h6">{{ medal(s.rank) }}</td>
                      <td class="font-weight-bold text-body-1">{{ s.name }}</td>
                      <td class="text-right">{{ s.games }}</td>
                      <td class="text-right">{{ s.wins }}–{{ s.losses }}</td>
                      <td class="text-right font-weight-bold">{{ s.win_rate }}%</td>
                      <td class="text-right font-weight-bold">{{ s.accuracy }}%</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>
            </v-col>
          </v-row>
        </div>
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