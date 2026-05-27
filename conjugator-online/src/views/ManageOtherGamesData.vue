<template>
  <div class="container-fluid py-4" style="max-width: 1600px;">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-1 text-dark fw-bold">
          <i class="bi bi-controller me-2 text-success"></i>
          Other Games Analytics
        </h1>
        <p class="text-muted mb-0">Track participation and performance for all non-conjugator mini-games.</p>
      </div>
      <button @click="loadDashboardData" class="btn btn-outline-success d-flex align-items-center gap-2" :disabled="loading">
        <i class="bi" :class="loading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'"></i>
        {{ loading ? 'Syncing...' : 'Refresh Statistics' }}
      </button>
    </div>

    <div v-if="error" class="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
      <i class="bi bi-exclamation-triangle-fill"></i>
      <div>{{ error }}</div>
    </div>

    <div v-if="loading && !dashboard" class="text-center py-5">
      <div class="spinner-border text-success mb-3" style="width: 3rem; height: 3rem;" role="status"></div>
      <p class="text-muted fw-semibold">Parsing module telemetry fields...</p>
    </div>

    <div v-else-if="dashboard" class="animate-fade-in">
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card h-100 border-0 shadow-sm metric-card border-start border-4 border-primary">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted text-uppercase small fw-bold mb-1">Total Sessions</h6>
                <h3 class="fw-bold mb-0 text-dark">{{ dashboard.summary.total_sessions.toLocaleString() }}</h3>
              </div>
              <div class="icon-shape bg-primary-subtle text-primary rounded-3 p-3">
                <i class="bi bi-play-circle-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100 border-0 shadow-sm metric-card border-start border-4 border-success">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted text-uppercase small fw-bold mb-1">Active Today (24h)</h6>
                <h3 class="fw-bold mb-0 text-dark">{{ dashboard.summary.active_today }}</h3>
              </div>
              <div class="icon-shape bg-success-subtle text-success rounded-3 p-3">
                <i class="bi bi-lightning-charge-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100 border-0 shadow-sm metric-card border-start border-4 border-info">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted text-uppercase small fw-bold mb-1">Active This Week</h6>
                <h3 class="fw-bold mb-0 text-dark">{{ dashboard.summary.active_this_week }}</h3>
              </div>
              <div class="icon-shape bg-info-subtle text-info rounded-3 p-3">
                <i class="bi bi-calendar-check-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card h-100 border-0 shadow-sm metric-card border-start border-4 border-warning">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted text-uppercase small fw-bold mb-1">Active Profiles (90d)</h6>
                <h3 class="fw-bold mb-0 text-dark">{{ dashboard.summary.recent_players_count }}</h3>
              </div>
              <div class="icon-shape bg-warning-subtle text-warning rounded-3 p-3">
                <i class="bi bi-people-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white border-0 py-3">
          <h5 class="card-title mb-0 fw-bold text-dark">
            <i class="bi bi-clock-history me-2 text-secondary"></i>Recent Activity
            <span class="badge bg-light text-muted border ms-2 font-monospace fw-normal" style="font-size: 0.75rem;">Rolling 90 Days</span>
          </h5>
        </div>
        <div class="card-body py-1 px-3">
          <div class="d-flex flex-row overflow-auto pb-3 gap-3 custom-scrollbar">
            <div v-for="student in dashboard.recent_active_students" :key="student.username" class="d-flex align-items-center gap-2 p-2.5 border rounded bg-light hover-bg cursor-default style-box">
              <div class="avatar-circle bg-success text-white fw-bold text-uppercase">{{ student.initials || student.username.charAt(0) }}</div>
              <div style="min-width: 140px;">
                <div class="fw-bold text-dark text-truncate small" style="max-width: 150px;">{{ student.username }}</div>
                <small class="text-muted font-monospace" style="font-size: 0.7rem;">{{ student.time_ago }}</small>
              </div>
            </div>
            <div v-if="!dashboard.recent_active_students?.length" class="text-muted p-3 text-center w-100 small">
              No student activity in this time frame.
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-0 py-3">
          <h5 class="card-title mb-0 fw-bold text-dark">
            <i class="bi bi-collection-play-fill me-2 text-success"></i>Performance Standings by Game
          </h5>
        </div>
        <div class="card-body p-0">
          <div class="accordion accordion-flush" id="gamesSummaryAccordion">
            <div v-for="(rows, gameName, idx) in dashboard.grouped_stats" :key="gameName" class="accordion-item border-bottom">
              <h2 class="accordion-header">
                <button class="accordion-button py-3.5 px-4" :class="{ collapsed: idx !== 0 }" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-' + cleanSelector(gameName)">
                  <div class="d-flex justify-content-between align-items-center w-100 me-3">
                    <span class="fs-5 fw-bold text-dark d-flex align-items-center gap-2">
                      <i class="bi bi-folder-symlink text-muted"></i>
                      {{ gameName }}
                    </span>
                    <span class="badge bg-success-subtle text-success border border-success px-2.5 py-1 fw-bold">{{ rows.length }} Active Players</span>
                  </div>
                </button>
              </h2>
              <div :id="'collapse-' + cleanSelector(gameName)" class="accordion-collapse collapse" :class="{ show: idx === 0 }" data-bs-parent="#gamesSummaryAccordion">
                <div class="accordion-body p-0 bg-light-subtle">
                  <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                      <thead class="table-light">
                        <tr>
                          <th class="ps-4" style="width: 80px;">Rank</th>
                          <th>Student Profile</th>
                          <th class="text-center">Sessions</th>
                          <th class="text-center">Total Rounds</th>
                          <th class="text-center">Correct</th>
                          <th class="text-center">Precision</th>
                          <th class="text-end pe-4">Last Date Played</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(student, sIdx) in rows" :key="student.username">
                          <td class="ps-4 text-center fw-bold text-secondary">
                            <span v-if="sIdx === 0" class="fs-5">🥇</span>
                            <span v-else-if="sIdx === 1" class="fs-5">🥈</span>
                            <span v-else-if="sIdx === 2" class="fs-5">🥉</span>
                            <span v-else class="small text-muted font-monospace">{{ sIdx + 1 }}</span>
                          </td>
                          <td>
                            <div class="d-flex align-items-center gap-2.5">
                              <div class="avatar-circle bg-secondary-subtle text-secondary fw-bold text-uppercase small">{{ student.initials || student.username.slice(0, 2) }}</div>
                              <div>
                                <div class="fw-bold text-dark small mb-0">{{ student.username }}</div>
                                <small class="text-muted" style="font-size: 0.75rem;">ID Reference: #{{ student.student_id }}</small>
                              </div>
                            </div>
                          </td>
                          <td class="text-center font-monospace fw-semibold text-dark">{{ student.total_sessions }}</td>
                          <td class="text-center font-monospace text-muted">{{ student.total_rounds }}</td>
                          <td class="text-center font-monospace text-success fw-bold">{{ student.total_correct }}</td>
                          <td class="text-center">
                            <div class="d-flex align-items-center justify-content-center gap-2" style="min-width: 110px;">
                              <span class="badge px-2 py-1.5 fw-bold" :class="getAccuracyBadgeClass(student.accuracy)">{{ student.accuracy.toFixed(1) }}%</span>
                              <div class="progress flex-grow-1 d-none d-md-flex" style="height: 6px; max-width: 60px;">
                                <div class="progress-bar" :class="getAccuracyProgressBarClass(student.accuracy)" :style="{ width: student.accuracy + '%' }"></div>
                              </div>
                            </div>
                          </td>
                          <td class="text-end pe-4 text-muted font-monospace small">{{ student.last_played }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="Object.keys(dashboard.grouped_stats).length === 0" class="text-center py-5 text-muted">
            <i class="bi bi-clipboard-data-fill display-4 mb-2 d-block text-muted opacity-50"></i>
            No stats available yet.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/axios';

interface GamePerformanceRow {
  student_id: number;
  username: string;
  initials: string | null;
  game_name: string;
  total_sessions: number;
  total_rounds: number;
  total_correct: number;
  accuracy: number;
  last_played: string;
}

interface DashboardPayload {
  summary: {
    total_sessions: number;
    active_today: number;
    active_this_week: number;
    recent_players_count: number;
  };
  recent_active_students: Array<{ username: string; initials: string | null; time_ago: string }>;
  grouped_stats: Record<string, GamePerformanceRow[]>;
}

const dashboard = ref<DashboardPayload | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadDashboardData() {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get<DashboardPayload>('/other-games-dashboard/summary/');
    // Handle framework configuration wrappers safely
    dashboard.value = response.data;
  } catch (err: any) {
    console.error('Failed syncing with alternative modules summary views:', err);
    error.value = err.response?.data?.detail || 'Failed to successfully gather alternative module metric aggregates.';
  } finally {
    loading.value = false;
  }
}

// Replaces whitespace/special characters from string inputs to construct valid template ID tags selectors
function cleanSelector(gameName: string): string {
  return gameName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

function getAccuracyBadgeClass(pct: number): string {
  if (pct >= 90) return 'bg-success-subtle text-success border border-success';
  if (pct >= 75) return 'bg-info-subtle text-info border border-info';
  if (pct >= 60) return 'bg-warning-subtle text-warning border border-warning';
  return 'bg-secondary-subtle text-secondary border border-secondary';
}

function getAccuracyProgressBarClass(pct: number): string {
  if (pct >= 90) return 'bg-success';
  if (pct >= 75) return 'bg-info';
  if (pct >= 60) return 'bg-warning';
  return 'bg-secondary';
}

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.metric-card {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
}
.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
}
.icon-shape {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}
.style-box {
  min-width: 220px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.hover-bg:hover {
  background-color: #f1f5f9 !important;
}
.spin {
  animation: spinTransform 1s linear infinite;
}
@keyframes spinTransform {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.custom-scrollbar::-webkit-scrollbar {
  height: 5px;
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
}
.animate-fade-in {
  animation: componentFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes componentFade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.accordion-button:not(.collapsed) {
  background-color: #f8fafc;
  color: inherit;
  box-shadow: none;
}
.accordion-button:focus {
  box-shadow: none;
}
.table th {
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
</style>