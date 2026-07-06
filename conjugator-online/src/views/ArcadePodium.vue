<template>
  <v-container class="pa-4 pa-md-6 bg-white text-slate-800 min-h-screen">
    <div class="max-w-1200 mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <router-link to="/" class="d-flex align-center ga-2 text-decoration-none mb-12">
          <v-icon icon="mdi-arrow-left" color="slate-600" />
          <span class="text-caption font-weight-bold text-slate-600">Back to Vocab Training</span>
        </router-link>
        
        <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6">
          <div>
            <h1 class="text-h3 font-weight-black text-slate-900 mb-2">
              <v-icon icon="mdi-podium" size="x-large" color="amber" class="mr-8" />
              Vocab Arcade Podium
            </h1>
            <p class="text-body-2 text-slate-500">Top 25 all-time scores</p>
          </div>
          
          <!-- Game Type Filter -->
          <v-btn-group divided variant="outlined" color="primary" class="rounded-lg">
            <v-btn 
              value="asteroidz"
              :variant="selectedGame === 'asteroidz' ? 'flat' : 'outlined'"
              @click="selectedGame = 'asteroidz'; fetchScores()"
              class="text-none font-weight-bold"
            >
              Asteroidz
            </v-btn>
            <v-btn 
              value="space_invaders"
              :variant="selectedGame === 'space_invaders' ? 'flat' : 'outlined'"
              @click="selectedGame = 'space_invaders'; fetchScores()"
              class="text-none font-weight-bold"
            >
              Space Invaderz
            </v-btn>
          </v-btn-group>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-center align-center py-12">
        <v-progress-circular indeterminate color="primary" size="48" />
      </div>

      <!-- Scores Table -->
      <v-card v-else-if="scores.length > 0" class="border rounded-xl shadow-sm" flat>
        <v-table class="podium-table">
          <thead>
            <tr class="bg-slate-50 border-b">
              <th class="text-left pa-4 font-weight-black text-slate-900" width="60">Rank</th>
              <th class="text-left pa-4 font-weight-black text-slate-900">Player</th>
              <th class="text-center pa-4 font-weight-black text-slate-900" width="120">Score</th>
              <th class="text-center pa-4 font-weight-black text-slate-900" width="100">Accuracy</th>
              <th class="text-center pa-4 font-weight-black text-slate-900" width="120">Difficulty</th>
              <th class="text-center pa-4 font-weight-black text-slate-900" width="100">Status</th>
              <th class="text-center pa-4 font-weight-black text-slate-900" width="140">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(score, idx) in scores"
              :key="score.id"
              :class="getPodiumRowClass(idx)"
              class="border-b transition-colors hover:bg-slate-50"
            >
              <!-- Rank with Medal -->
              <td class="pa-4 text-center font-weight-black">
                <div class="d-flex align-center justify-center ga-2">
                  <v-icon 
                    v-if="idx === 0" 
                    icon="mdi-medal" 
                    color="amber" 
                    size="large"
                  />
                  <v-icon 
                    v-else-if="idx === 1" 
                    icon="mdi-medal" 
                    color="slate-400"
                    size="large"
                  />
                  <v-icon 
                    v-else-if="idx === 2" 
                    icon="mdi-medal" 
                    color="orange-darken-4"
                    size="large"
                  />
                  <span v-else class="text-h6">{{ idx + 1 }}</span>
                </div>
              </td>

              <!-- Player Name -->
              <td class="pa-4">
                <span class="font-weight-bold text-slate-900">{{ score.username }}</span>
              </td>

              <!-- Score -->
              <td class="pa-4 text-center">
                <v-chip 
                  :color="getScoreColor(score.score)"
                  variant="flat"
                  class="font-weight-black"
                >
                  {{ score.score }}
                </v-chip>
              </td>

              <!-- Accuracy -->
              <td class="pa-4 text-center">
                <span class="font-weight-bold">{{ score.accuracy }}%</span>
              </td>

              <!-- Difficulty -->
              <td class="pa-4 text-center">
                <span class="text-caption font-weight-bold text-primary">{{ score.difficulty_reached }}</span>
              </td>

              <!-- Won Status -->
              <td class="pa-4 text-center">
                <v-icon 
                  v-if="score.won"
                  icon="mdi-check-circle"
                  color="success"
                  size="large"
                />
                <v-icon 
                  v-else
                  icon="mdi-close-circle"
                  color="error"
                  size="large"
                />
              </td>

              <!-- Date -->
              <td class="pa-4 text-center text-caption text-slate-500">
                {{ formatDate(score.created_at) }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- Empty State -->
      <v-card v-else class="pa-12 text-center rounded-xl border" flat>
        <v-icon icon="mdi-inbox" size="64" color="slate-300" class="d-block mb-4" />
        <p class="text-body-2 text-slate-500 font-weight-bold">No scores yet for this game.</p>
        <p class="text-caption text-slate-400">Be the first to claim the podium!</p>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/axios";

interface Score {
  id: number;
  username: string;
  rank: number;
  score: number;
  accuracy: number;
  total_items: number;
  rounds_won: number;
  difficulty_reached: string;
  vocab_list_name: string;
  won: boolean;
  created_at: string;
}

const route = useRoute();

const scores = ref<Score[]>([]);
const loading = ref(false);
const selectedGame = ref<'asteroidz' | 'space_invaders'>(
  (route.query.game as 'asteroidz' | 'space_invaders') || 'space_invaders'
);

async function fetchScores() {
  loading.value = true;
  try {
    const response = await api.get(`/arcade-scores/top_scores/`, {
      params: {
        game_type: selectedGame.value,
      },
    });
    scores.value = response.data;
  } catch (error) {
    console.error("Failed to fetch scores:", error);
    scores.value = [];
  } finally {
    loading.value = false;
  }
}

function getPodiumRowClass(idx: number): string {
  if (idx === 0) return "bg-amber-50 border-amber-200";
  if (idx === 1) return "bg-slate-50 border-slate-200";
  if (idx === 2) return "bg-orange-50 border-orange-100";
  return "";
}

function getScoreColor(score: number): string {
  if (score >= 5000) return "success";
  if (score >= 3000) return "info";
  if (score >= 1000) return "warning";
  return "slate-400";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

onMounted(() => {
  fetchScores();
});
</script>

<style scoped>
.max-w-1200 {
  max-width: 1200px;
}

.podium-table :deep(tr:first-child) {
  background-color: #f8fafc;
}

.podium-table :deep(th) {
  background-color: #f8fafc !important;
}

.min-h-screen {
  min-height: 100vh;
}
</style>