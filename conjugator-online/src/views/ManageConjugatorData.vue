<template>
  <div class="mt-5 pa-4 px-6 container-fluid" style="max-width: 1600px;">
    <v-card class="pa-6 mb-6 conjugator-header text-white shadow-sm" rounded="xl">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
        <div>
          <div class="text-h4 font-weight-bold">Conjugator Game Data</div>
          <div class="text-subtitle-1 opacity-90 mt-1">
            Inspect statistics and student performance in the Conjugator Game 
          </div>
        </div>
        <div class="d-flex justify-center align-center gap-4">
          <v-btn
            color="white"
            variant="flat"
            class="text-grey-darken-4"
            :disabled="loading"
            @click="loadDashboardData"
            :prepend-icon="loading ? 'mdi-timer-sand' : 'mdi-refresh'"
          >
            {{ loading ? 'Loading...' : 'Refresh' }}
          </v-btn>

          <v-avatar color="white" variant="tonal" size="70" class="ms-6">
            <v-icon size="48">mdi-chart-arc</v-icon>
          </v-avatar>
        </div>

      </div>
    </v-card>


    <div v-if="error" class="alert alert-danger mb-4" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error }}
    </div>

    <div v-if="loading && !dashboard" class="text-center py-5">
      <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
      <p class="text-muted fw-semibold">Loading Data...</p>
    </div>

    <div v-else-if="dashboard" class="animate-fade-in">
      <div class="row g-3 mb-4">
        <div v-for="(card, key) in cardList" :key="key" class="col-md-3">
          <div class="card h-100 border-0 shadow-sm metric-card border-start border-4" :class="card.color">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted text-uppercase small fw-bold mb-1">{{ card.title }}</h6>
                <h3 class="fw-bold mb-0 text-dark">{{ card.value }}</h3>
              </div>
              <div class="icon-shape rounded-3 p-3" :class="card.bgColor">
                <i class="bi fs-4" :class="card.icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3">
              <h5 class="card-title mb-0 fw-bold text-dark"><i class="bi bi-activity me-2 text-primary"></i>Total rounds played per month</h5>
            </div>
            <div class="card-body">
              <div style="position: relative; height: 260px; width: 100%;">
                <canvas id="velocityChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3">
              <h5 class="card-title mb-0 fw-bold text-dark"><i class="bi bi-pie-chart-fill me-2 text-info"></i>Error types</h5>
            </div>
            <div class="card-body d-flex align-items-center justify-content-center">
              <div style="position: relative; height: 240px; width: 100%;">
                <canvas id="distributionChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3">
              <h5 class="card-title mb-0 fw-bold text-dark"><i class="bi bi-shield-check me-2 text-secondary"></i>Accuracy Profiles</h5>
            </div>
            <div class="card-body custom-scrollbar" style="max-height: 460px; overflow-y: auto;">
              <h6 class="fw-bold text-secondary text-uppercase small mb-3 tracking-wider">Accuracy by Tense</h6>
              <div v-for="item in dashboard.accuracy_by_tense" :key="item.label" class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-semibold text-dark fs-6">{{ item.label }}</span>
                  <span class="badge bg-light text-dark border fw-bold">{{ item.accuracy_pct }}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar" :class="getAccuracyClass(item.accuracy_pct)" :style="{ width: item.accuracy_pct + '%' }"></div>
                </div>
              </div>
              <hr class="my-4 text-muted opacity-25">
              <h6 class="fw-bold text-secondary text-uppercase small mb-3 tracking-wider">Accuracy by Sentence Type</h6>
              <div v-for="item in dashboard.accuracy_by_sentence_type" :key="item.label" class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-semibold text-dark fs-6">{{ item.label }}</span>
                  <span class="badge bg-light text-dark border fw-bold">{{ item.accuracy_pct }}%</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar" :class="getAccuracyClass(item.accuracy_pct)" :style="{ width: item.accuracy_pct + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0 fw-bold text-dark"><i class="bi bi-trophy-fill me-2 text-warning"></i>Leaderboards</h5>
              <div class="btn-group btn-group-sm">
                <button @click="leaderboardTab = 'volume'" class="btn" :class="leaderboardTab === 'volume' ? 'btn-primary' : 'btn-outline-primary'">Raw Volume</button>
                <button @click="leaderboardTab = 'accuracy'" class="btn" :class="leaderboardTab === 'accuracy' ? 'btn-primary' : 'btn-outline-primary'">Precision</button>
                <button @click="leaderboardTab = 'health'" class="btn" :class="leaderboardTab === 'health' ? 'btn-primary' : 'btn-outline-primary'">Health Score</button>
              </div>
            </div>
            <div class="card-body p-0 custom-scrollbar" style="max-height: 460px; overflow-y: auto;">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light sticky-top">
                  <tr>
                    <th class="ps-4" style="width: 70px;">Rank</th>
                    <th>Student Profile</th>
                    <th class="text-end pe-4">Score Metric</th>
                  </tr>
                </thead>
                <tbody v-if="leaderboardTab === 'volume'">
                  <tr v-for="(row, idx) in dashboard.leaderboard_volume" :key="row.username">
                    <td class="ps-4 fw-bold text-center">{{ idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1 }}</td>
                    <td><div class="fw-bold text-dark">{{ row.username }}</div><small class="text-muted">Initials: {{ row.initials }}</small></td>
                    <td class="text-end pe-4"><span class="badge bg-success-subtle text-success border border-success fw-bold">{{ row.correct_total }} rounds</span></td>
                  </tr>
                </tbody>
                <tbody v-else-if="leaderboardTab === 'accuracy'">
                  <tr v-for="(row, idx) in dashboard.leaderboard_accuracy" :key="row.username">
                    <td class="ps-4 fw-bold text-center">{{ idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1 }}</td>
                    <td><div class="fw-bold text-dark">{{ row.username }}</div><small class="text-muted">{{ row.total }} total targets</small></td>
                    <td class="text-end pe-4"><span class="badge fw-bold" :class="getAccuracyBadgeClass(row.accuracy)">{{ row.accuracy.toFixed(1) }}%</span></td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-for="(row, idx) in dashboard.leaderboard_health" :key="row.username">
                    <td class="ps-4 fw-bold text-center">{{ idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1 }}</td>
                    <td><div class="fw-bold text-dark">{{ row.username }}</div><small class="text-muted">Initials: {{ row.initials }}</small></td>
                    <td class="text-end pe-4"><span class="badge fw-bold" :class="getAccuracyBadgeClass(row.health)">Score: {{ row.health }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-lg-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 py-3">
              <h5 class="card-title mb-0 fw-bold text-dark"><i class="bi bi-broadcast me-2 text-pulse"></i>Latest Activity</h5>
            </div>
            <div class="card-body p-0 custom-scrollbar" style="max-height: 460px; overflow-y: auto;">
              <div v-for="user in uniqueRecentActive" :key="user.username" class="d-flex align-items-center gap-3 p-3 border-bottom hover-bg transition-all">
                <div class="avatar-circle-sm bg-secondary-subtle text-secondary fw-bold text-uppercase">{{ user.initials }}</div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-dark small mb-0">{{ user.username }}</div>
                  <small class="text-muted d-block" style="font-size: 0.75rem;"><i class="bi bi-clock me-1"></i>Active: {{ user.time_ago }}</small>
                </div>
              </div>
              <div v-if="!uniqueRecentActive.length" class="text-center text-muted py-5 small">No players active today.</div>
            </div>
          </div>
        </div>
      </div>

      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="border-grey-lighten-2 rounded-lg h-100">
            <v-card-title class="bg-grey-lighten-4 font-weight-bold text-subtitle-1 py-3">
              <v-icon icon="mdi-format-list-bulleted-type" color="info" class="mr-2"></v-icon>
              Error Types
            </v-card-title>
            <v-card-text class="pa-0 overflow-y-auto" style="max-height: 420px;">
              <v-table hover dense v-if="dashboard && dashboard.error_labels?.length">
                <thead>
                  <tr>
                    <th class="font-weight-bold">Error Type</th>
                    <th class="text-center font-weight-bold">Count</th>
                    <th class="text-center font-weight-bold">Distribution</th>
                    <th class="text-center font-weight-bold">Examples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(label, idx) in dashboard.error_labels" :key="label">
                    <td class="font-weight-bold text-blue-darken-2">{{ label }}</td>
                    <td class="text-center font-monospace">{{ dashboard.error_counts[idx] }}</td>
                    <td class="text-center font-monospace">
                      <v-chip size="small" variant="tonal" color="info" class="font-weight-bold">
                        {{ ((dashboard.error_counts[idx] / (dashboard.total_labeled_errors || 1)) * 100).toFixed(1) }}%
                      </v-chip>
                    </td>
                    <td class="text-center">
                      <v-btn size="small" color="primary" variant="outlined" prepend-icon="mdi-eye" @click="openTypeExamplesModal(label)">
                        View ({{ dashboard.error_examples?.[label]?.length || 0 }})
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <v-sheet v-else class="text-center text-muted py-8 bg-transparent">
                <v-icon icon="mdi-information-outline" class="mr-1"></v-icon>
                No classified error tracking elements calculated.
              </v-sheet>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card variant="outlined" class="border-grey-lighten-2 rounded-lg h-100">
            <v-card-title class="bg-grey-lighten-4 font-weight-bold text-subtitle-1 py-3">
              <v-icon icon="mdi-chart-bar" color="error" class="mr-2"></v-icon>
              Most Problematic Irregular Verbs (Top 20)
            </v-card-title>
            <v-card-text class="pa-4 d-flex align-center justify-center" style="height: 420px;">
              <canvas id="irregVerbChart"></canvas>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="border-grey-lighten-2 rounded-lg">
            <v-card-title class="bg-red-lighten-5 text-red-darken-3 font-weight-bold text-subtitle-1 py-3">
              <v-icon icon="mdi-trending-down" class="mr-2"></v-icon>
              Lowest Verb Success Rates (Top 20)
            </v-card-title>
            <v-card-text class="pa-4" style="height: 350px;">
              <canvas id="worstVerbsChart"></canvas>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card variant="outlined" class="border-grey-lighten-2 rounded-lg">
            <v-card-title class="bg-green-lighten-5 text-green-darken-3 font-weight-bold text-subtitle-1 py-3">
              <v-icon icon="mdi-trending-up" class="mr-2"></v-icon>
              Highest Verb Success Rates (Top 20)
            </v-card-title>
            <v-card-text class="pa-4" style="height: 350px;">
              <canvas id="bestVerbsChart"></canvas>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card variant="outlined" class="border-grey-lighten-2 rounded-lg">
            <v-card-title class="bg-grey-darken-3 text-white font-weight-bold text-subtitle-1 py-3">
              <v-icon icon="mdi-magnify" class="mr-2"></v-icon>
              Lookup Irregular Verb Errors
            </v-card-title>
            <v-card-text class="pa-4">
              <div class="row g-3 align-center">
                <div class="col-md-5 position-relative">
                  <div class="input-group">
                    <span class="input-group-text bg-light text-muted"><i class="bi bi-search"></i></span>
                    <input type="text" v-model="verbSearchQuery" class="form-control" placeholder="Type an irregular verb (e.g. begin, see, lead)..." @keyup.enter="executeVerbMetricsLookup">
                  </div>
                  <div v-if="matchedVerbsList.length" class="list-group position-absolute shadow-sm lookup-results custom-scrollbar" style="z-index: 100; width:93%;">
                    <button v-for="v in matchedVerbsList" :key="v" @click="selectVerbLookup(v)" class="list-group-item list-group-item-action py-2 px-3 small d-flex justify-content-between align-items-center">
                      <span class="fw-bold text-primary font-monospace">{{ v }}</span>
                      <i class="bi bi-arrow-right text-muted small"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-2">
                  <button class="btn btn-secondary w-100" @click="executeVerbMetricsLookup">Query Lookup</button>
                </div>
              </div>

              <v-expand-transition>
                <div v-if="lookupResult" class="mt-4 pa-4 rounded-lg border bg-grey-lighten-5 border-grey-lighten-3">
                  <v-row class="text-center">
                    <v-col cols="4" sm="3" md="2">
                      <div class="text-caption text-grey text-uppercase">Total Attempts</div>
                      <div class="text-h5 font-weight-bold">{{ lookupResult.total }}</div>
                    </v-col>
                  </v-row>
                  
                  <div class="mt-4" v-if="verbSearchQuery && verbSearchQuery.trim() && dashboard?.error_examples?.[verbSearchQuery.trim().toLowerCase()]?.length">
                    <div class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2">Student Error Logs for this Verb:</div>
                    <v-list density="compact" variant="outlined" class="rounded-md overflow-y-auto pa-0" style="max-height: 250px;">
                      <v-list-item v-for="(ex, i) in dashboard.error_examples[verbSearchQuery.trim().toLowerCase()]" :key="i" class="border-b py-2 text-caption">
                        <div class="d-flex justify-space-between font-weight-bold">
                          <span>#{{ i+1 }} - {{ ex.tense }} ({{ ex.person }}, {{ ex.sentence_type }})</span>
                          <span class="text-grey font-monospace">{{ ex.student }}</span>
                        </div>
                        <div class="mt-1">User input: <v-chip size="x-small" color="error" label class="font-weight-bold">{{ ex.user_answer || '(blank)' }}</v-chip></div>
                        <div class="mt-1">Acceptable forms: <v-chip v-for="ans in ex.acceptable_answers" :key="ans" size="x-small" color="success" label class="mr-1 font-weight-medium">{{ ans }}</v-chip></div>
                      </v-list-item>
                    </v-list>
                  </div>
                </div>
              </v-expand-transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card variant="outlined" class="border-grey-lighten-2 rounded-lg">
            <v-card-title class="bg-red-darken-4 text-white font-weight-bold text-subtitle-1 py-3">
              <v-icon icon="mdi-alert-octagon-outline" class="mr-2"></v-icon>
              ⚠️ Most Difficult Prompt Combinations
            </v-card-title>
            <v-card-text class="pa-0">
              <v-table hover>
                <thead class="bg-grey-lighten-4">
                  <tr>
                    <th style="width: 60px;">Rank</th>
                    <th>Verb</th>
                    <th>Tense</th>
                    <th>Subject Person</th>
                    <th>Sentence Type</th>
                    <th class="text-center">Failed Counts</th>
                    <th class="text-center">Total Attempts</th>
                    <th class="text-center">Error Rate</th>
                    <th class="text-center" style="width: 160px;">Trace Elements</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(combo, idx) in dashboard?.difficult_combinations" :key="idx">
                    <td class="font-weight-bold text-center bg-grey-lighten-5">{{ idx + 1 }}</td>
                    <td><v-chip color="primary" size="small" label class="font-weight-bold font-monospace text-uppercase">{{ combo.verb }}</v-chip></td>
                    <td><v-chip color="info" size="small" label class="font-weight-bold">{{ combo.tense }}</v-chip></td>
                    <td><v-chip color="secondary" size="small" label class="font-weight-bold font-monospace">{{ combo.person }}</v-chip></td>
                    <td><v-chip color="grey-darken-3" size="small" label class="font-weight-bold text-white">{{ combo.sentence_type }}</v-chip></td>
                    <td class="text-center font-weight-bold text-error">{{ combo.error_count }}</td>
                    <td class="text-center font-monospace">{{ combo.total_attempts }}</td>
                    <td class="text-center">
                      <v-chip size="small" :color="(combo.error_rate ?? 0) >= 70 ? 'error' : (combo.error_rate ?? 0) >= 50 ? 'warning' : 'success'" class="font-weight-bold">
                        {{ (combo.error_rate ?? 0).toFixed(1) }}%
                      </v-chip>
                    </td>
                    <td class="text-center">
                      <v-btn size="small" color="primary" variant="tonal" prepend-icon="mdi-card-search" @click="fetchCombinationExamples(combo)">
                        View Logs
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="examplesDialog" max-width="750px" scrollable>
      <v-card rounded="lg">
        <v-card-title class="pa-4 bg-primary text-white font-weight-bold">
          <v-icon icon="mdi-bug" class="mr-2"></v-icon>
          {{ modalTitleText }}
        </v-card-title>
        <v-card-text class="pa-4" style="max-height: 550px;">
          <v-row v-if="loadingExamples" justify="center" class="pa-6">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-row>
          <div v-else class="d-flex flex-column gap-3">
            <div v-for="(ex, i) in targetedExamplesList" :key="i" class="pa-3 rounded-lg border bg-grey-lighten-5">
              <div class="d-flex justify-space-between align-center border-b pb-1 mb-2">
                <span class="font-weight-bold text-body-2 text-primary">#{{ i + 1 }} — {{ ex.verb }} <span class="text-grey-darken-1">({{ ex.tense }}, {{ ex.person }}, {{ ex.sentence_type }})</span></span>
                <v-chip size="x-small" color="grey" class="font-weight-bold font-monospace">Student: {{ ex.student_initials || ex.student }}</v-chip>
              </div>
              <div class="mb-1 text-body-2">
                <strong>Submitted Answer:</strong> 
                <v-chip size="small" color="error" label class="font-weight-bold ml-1 font-monospace text-danger bg-danger-subtle">{{ ex.user_answer || '(Empty Submission)' }}</v-chip>
              </div>
              <div class="text-body-2">
                <strong>Acceptable Answers:</strong>
                <v-chip v-for="ans in ex.acceptable_answers" :key="ans" size="small" color="success" label class="ml-1 font-weight-medium font-monospace text-success bg-success-subtle">{{ ans }}</v-chip>
              </div>
              <div v-if="ex.elapsed_time" class="text-caption text-grey mt-2">
                Elapsed time: {{ ex.elapsed_time }}s | Difficulty index: {{ ex.difficulty_score || 0 }}
              </div>
            </div>
            <div v-if="!targetedExamplesList.length" class="text-center py-6 text-muted">No evidence found for the query.</div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end bg-grey-lighten-4">
          <v-btn color="primary" variant="elevated" class="px-6" @click="examplesDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import api from '@/axios';

// Operational Data Contracts
interface DashboardData {
  cards: { total_sessions: number; total_rounds: number; total_time_seconds: number; active_students_7d: number };
  accuracy_by_tense: Array<{ label: string; total: number; correct: number; accuracy_pct: number }>;
  accuracy_by_sentence_type: Array<{ label: string; total: number; correct: number; accuracy_pct: number }>;
  leaderboard_volume: Array<{ username: string; initials: string; correct_total: number }>;
  leaderboard_accuracy: Array<{ username: string; initials: string; total: number; correct: number; accuracy: number }>;
  leaderboard_health: Array<{ username: string; initials: string; health: number }>;
  timeline_labels: string[];
  timeline_counts: number[];
  error_labels: string[];
  error_counts: number[];
  recent_active: Array<{ username: string; initials: string; time_ago: string }>;
  difficult_combinations: Array<{ verb: string; tense: string; person: string; sentence_type: string; error_count: number; total_attempts?: number; error_rate?: number }>;
  irreg_verb_labels: string[];
  irreg_verb_counts: number[];
  worst_verb_labels: string[];
  worst_verb_rates: number[];
  best_verb_labels: string[];
  best_verb_rates: number[];
  error_examples: Record<string, ErrorExampleInstance[]>;
  verb_stats: Record<string, VerbStatItem>;
  total_labeled_errors: number;
}

interface ErrorExampleInstance {
  verb: string;
  tense: string;
  person: string;
  sentence_type: string;
  student: string;
  student_initials?: string;
  user_answer: string;
  acceptable_answers: string[];
  elapsed_time?: number;
  difficulty_score?: number;
  confidence?: number;
}

interface VerbStatItem {
  past_simple: string;
  past_participle: string;
  success_rate: number;
  total: number;
  correct: number;
  incorrect: number;
}

// Reactive Component State
const dashboard = ref<DashboardData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const leaderboardTab = ref<'volume' | 'accuracy' | 'health'>('volume');

// Lexicon Map Local Resolution State
const globalIrregularVerbsMap = ref<Record<string, { past_simple: string; past_participle: string }>>({});
const verbSearchQuery = ref('');
const lookupResult = ref<any>(null);

// Modal Trace States
const examplesDialog = ref(false);
const loadingExamples = ref(false);
const modalTitleText = ref('');
const targetedExamplesList = ref<any[]>([]);

// Graph Context Pointers References
let playVelocityChartInstance: any = null;
let errorDistributionChartInstance: any = null;
let irregVerbChartInstance: any = null;
let worstVerbsChartInstance: any = null;
let bestVerbsChartInstance: any = null;

// Derived Cards Computations Map Array
const cardList = computed(() => {
  if (!dashboard.value) return [];
  const cards = dashboard.value.cards;
  return [
    { title: 'Total Games', value: cards.total_sessions.toLocaleString(), icon: 'bi-controller', color: 'border-primary', bgColor: 'bg-primary-subtle text-primary' },
    { title: 'Rounds Played', value: cards.total_rounds.toLocaleString(), icon: 'bi-pencil-square', color: 'border-success', bgColor: 'bg-success-subtle text-success' },
    { title: 'Aggregated Time', value: formatTime(cards.total_time_seconds), icon: 'bi-clock-history', color: 'border-info', bgColor: 'bg-info-subtle text-info' },
    { title: 'Active Students (7d)', value: cards.active_students_7d, icon: 'bi-people-fill', color: 'border-warning', bgColor: 'bg-warning-subtle text-warning' }
  ];
});

// Lexicon Suggestion Autocomplete Filter
const matchedVerbsList = computed(() => {
  const query = verbSearchQuery.value.trim().toLowerCase();
  if (!query || globalIrregularVerbsMap.value[query]) return [];
  return Object.keys(globalIrregularVerbsMap.value).filter(v => v.startsWith(query)).slice(0, 5);
});

// Deduplicate Student Log Multi-Activity Feeds
const uniqueRecentActive = computed(() => {
  if (!dashboard.value || !dashboard.value.recent_active) return [];
  const seenUsernames = new Set<string>();
  return dashboard.value.recent_active.filter(activity => {
    if (seenUsernames.has(activity.username)) return false;
    seenUsernames.add(activity.username);
    return true;
  });
});

// Core API Summary Analytics Aggregates Fetcher
async function loadDashboardData() {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get<DashboardData>('/conjugator-dashboard/summary/');
    dashboard.value = response.data;
    await nextTick();
    renderChartGraphics();
    extendRenderGraphicsMatrix();
  } catch (err: any) {
    error.value = 'Failed to load data.';
  } finally {
    loading.value = false;
  }
}

// Fetch Irregular Base Blueprint Dictionary Field Map Matcher
async function fetchLocalVerbLexicon() {
  try {
    const res = await fetch('/data/irregularVerbs.json');
    globalIrregularVerbsMap.value = await res.json();
  } catch {
    console.warn('Failed to load local verb lexicon.');
  }
}

// Select Lexicon Suggestion Suffix Anchor Click Match
function selectVerbLookup(verb: string) {
  verbSearchQuery.value = verb;
  executeVerbMetricsLookup();
}

// Real-time Dashboard Dictionary Verb Matrix Search Lookup
const executeVerbMetricsLookup = () => {
  const query = verbSearchQuery.value.trim().toLowerCase();
  if (!query || !dashboard.value?.verb_stats) {
    lookupResult.value = null;
    return;
  }
  const match = dashboard.value.verb_stats[query];
  const baseline = globalIrregularVerbsMap.value[query];

  if (match) {
    const { past_simple, past_participle, ...rest } = match;
    lookupResult.value = { 
      verb: query, 
      past_simple: past_simple || baseline?.past_simple || '—',
      past_participle: past_participle || baseline?.past_participle || '—',
      ...rest
    };
  } else if (baseline) {
    lookupResult.value = {
      verb: query,
      past_simple: baseline.past_simple,
      past_participle: baseline.past_participle,
      success_rate: 100, total: 0, correct: 0, incorrect: 0
    };
  } else {
    lookupResult.value = null;
  }
};

// Open Category List Examples Modal Instance
const openTypeExamplesModal = (errorType: string) => {
  modalTitleText.value = `Historical Incidents Trace: ${errorType}`;
  targetedExamplesList.value = dashboard.value?.error_examples?.[errorType] || [];
  loadingExamples.value = false;
  examplesDialog.value = true;
};

// Open Dynamic Structural Combination Examples AJAX Pipeline Fetcher
const fetchCombinationExamples = async (combo: any) => {
  modalTitleText.value = `Prompt Trace: ${combo.verb.toUpperCase()} (${combo.tense})`;
  targetedExamplesList.value = [];
  loadingExamples.value = true;
  examplesDialog.value = true;
  
  try {
    const res = await api.get('/conjugator-dashboard/examples/', {
      params: {
        verb: combo.verb,
        tense: combo.tense,
        person: combo.person,
        sentence_type: combo.sentence_type
      }
    });
    targetedExamplesList.value = res.data.examples || [];
  } catch {
    targetedExamplesList.value = [];
  } finally {
    loadingExamples.value = false;
  }
};

// Standard Base ChartJS Graphic Renderer
function renderChartGraphics() {
  if (!dashboard.value) return;

  if (playVelocityChartInstance) playVelocityChartInstance.destroy();
  if (errorDistributionChartInstance) errorDistributionChartInstance.destroy();

  const vCtx = document.getElementById('velocityChart') as HTMLCanvasElement;
  if (vCtx) {
    playVelocityChartInstance = new Chart(vCtx, {
      type: 'line',
      data: {
        labels: dashboard.value.timeline_labels,
        datasets: [{ label: 'Rounds Played', data: dashboard.value.timeline_counts, borderColor: '#da3316', backgroundColor: 'rgba(218, 51, 22, 0.06)', fill: true, tension: 0.2, borderWidth: 2.5 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }

  const dCtx = document.getElementById('distributionChart') as HTMLCanvasElement;
  if (dCtx && dashboard.value.error_labels?.length) {
    errorDistributionChartInstance = new Chart(dCtx, {
      type: 'doughnut',
      data: {
        labels: dashboard.value.error_labels,
        datasets: [{ data: dashboard.value.error_counts, backgroundColor: ['#ef4444', '#f97316', '#eab308', '#06b6d4', '#6366f1'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } } } }
    });
  }
}

// Secondary Extended Matrix Graphs Compilations Mapping
const extendRenderGraphicsMatrix = () => {
  if (!dashboard.value) return;

  if (irregVerbChartInstance) irregVerbChartInstance.destroy();
  if (worstVerbsChartInstance) worstVerbsChartInstance.destroy();
  if (bestVerbsChartInstance) bestVerbsChartInstance.destroy();

  const ivCtx = document.getElementById('irregVerbChart') as HTMLCanvasElement;
  if (ivCtx && dashboard.value.irreg_verb_labels?.length) {
    irregVerbChartInstance = new Chart(ivCtx, {
      type: 'bar',
      data: {
        labels: dashboard.value.irreg_verb_labels,
        datasets: [{ label: 'Error Incidents', data: dashboard.value.irreg_verb_counts, backgroundColor: 'rgba(239, 68, 68, 0.85)', borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }

  const wCtx = document.getElementById('worstVerbsChart') as HTMLCanvasElement;
  if (wCtx && dashboard.value.worst_verb_labels?.length) {
    worstVerbsChartInstance = new Chart(wCtx, {
      type: 'bar',
      data: {
        labels: dashboard.value.worst_verb_labels,
        datasets: [{ label: 'Accuracy Rating', data: dashboard.value.worst_verb_rates, backgroundColor: 'rgba(249, 115, 22, 0.85)', borderRadius: 4 }]
      },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { min: 0, max: 100, ticks: { callback: v => v + '%' } } } }
    });
  }

  const bCtx = document.getElementById('bestVerbsChart') as HTMLCanvasElement;
  if (bCtx && dashboard.value.best_verb_labels?.length) {
    bestVerbsChartInstance = new Chart(bCtx, {
      type: 'bar',
      data: {
        labels: dashboard.value.best_verb_labels,
        datasets: [{ label: 'Accuracy Rating', data: dashboard.value.best_verb_rates, backgroundColor: 'rgba(34, 197, 94, 0.85)', borderRadius: 4 }]
      },
      options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { min: 0, max: 100, ticks: { callback: v => v + '%' } } } }
    });
  }
};

// Formatting Helper Functions Primitives
function formatTime(secs: number): string { return secs ? `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m` : '0h 0m'; }
function getAccuracyClass(p: number) { return p >= 80 ? 'bg-success' : p >= 60 ? 'bg-info' : 'bg-warning'; }
function getAccuracyBadgeClass(p: number) { return p >= 80 ? 'bg-success-subtle text-success border border-success' : p >= 60 ? 'bg-info-subtle text-info border border-info' : 'bg-warning-subtle text-warning border border-warning'; }

// Lifecycle Observers Hook
watch(verbSearchQuery, (newVal) => {
  if (!newVal || !newVal.trim()) {
    lookupResult.value = null;
  }
});

onMounted(() => { 
  loadDashboardData(); 
  fetchLocalVerbLexicon(); 
});
</script>

<style scoped>
.metric-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.metric-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.05)!important; }
.icon-shape { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; }
.avatar-circle-sm { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; }
.lookup-results { width: 100%; z-index: 1050; max-height: 200px; overflow-y: auto; background: white; border: 1px solid #e2e8f0; border-radius: 0.375rem; }
.text-pulse { animation: pulseOpacity 2s infinite; }
@keyframes pulseOpacity { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.animate-fade-in { animation: fadeIn 0.35s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }


.conjugator-header {
  background: linear-gradient(
    135deg,
    #da3316 0%,     /* terracotta */
    #d89a7a 45%,    /* warm clay highlight */
    #da3316 100%    /* terracotta again */
  );
  position: relative;
  overflow: hidden;
}

.conjugator-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 25% 30%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0) 55%),
    radial-gradient(circle at 60% 80%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 50%);
  transform: rotate(-6deg);
  pointer-events: none;
}


</style>