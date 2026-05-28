<template>
  <v-container fluid class="pa-6 text-slate-800 bg-slate-50 min-vh-100">
    <v-card class="pa-6 mb-6 student-vocab-header text-white shadow-sm" rounded="xl">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
        <div>
          <div class="text-h4 font-weight-bold">My Vocabulary Analytics</div>
          <div class="text-subtitle-1 opacity-90 mt-1">
            Track your list mastery goals, review session progress stats, and pin down words causing frequent mistakes.
          </div>
        </div>
        <v-avatar color="white" variant="tonal" size="56">
          <v-icon size="32">mdi-shield-star-outline</v-icon>
        </v-avatar>
      </div>
    </v-card>

    <v-progress-linear v-if="loading" indeterminate color="teal" class="mb-6 rounded-pill" />

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 border bg-white fill-height d-flex flex-column" rounded="lg" elevation="0">
          <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-3">
            My Vocabulary Training Lists
          </div>

          <v-text-field
            v-model="searchListQuery"
            placeholder="Filter lists by title..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="mb-3"
            clearable
            hide-details
          />

          <div class="scroll-box flex-grow-1 pr-1">
            <v-card
              v-for="list in filteredProgressList"
              :key="list.list_key"
              class="mb-3 pa-4 border rounded-xl cursor-pointer transition-all position-relative"
              :class="focusedListKey === list.list_key ? 'border-teal bg-teal-tight shadow-xs' : 'bg-white hover-slate'"
              elevation="0"
              @click="focusedListKey = list.list_key"
            >
              <div class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-body-1 font-weight-black text-slate-900">
                    {{ list.list_key.replace(/_/g, ' ') }}
                  </div>
                  <div class="text-caption text-slate-500 mt-0.5">
                    Domain: <span class="font-weight-bold text-slate-700">{{ list.domain || 'General' }}</span> 
                    <span v-if="list.level" class="ml-2">• Level: {{ list.level }}</span>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-body-2 font-weight-black" :class="list.accuracy >= 75 ? 'text-green-darken-2' : 'text-orange-darken-2'">
                    {{ list.accuracy }}% Accuracy
                  </div>
                  <div class="text-caption text-slate-400 mt-0.5">
                    Sessions: {{ list.sessions_finished }} finished / {{ list.sessions_started }} started
                  </div>
                </div>
              </div>

              <v-progress-linear
                :model-value="list.masteryPct"
                :color="list.masteryPct === 100 ? 'success' : 'teal'"
                height="6"
                class="mt-3 rounded-pill"
              />
              <div class="d-flex justify-space-between text-caption text-slate-500 mt-1" style="font-size: 10px !important;">
                <span>Mastered: {{ list.masteredCount }} / {{ list.totalCount }} terms</span>
                <span class="font-weight-black text-teal-darken-3">{{ list.masteryPct }}% Complete</span>
              </div>
            </v-card>

            <div v-if="filteredProgressList.length === 0 && !loading" class="text-center text-slate-400 py-12">
              <v-icon size="40" class="mb-2 text-slate-300">mdi-text-box-remove-outline</v-icon>
              <div class="text-body-2">No vocabulary progress matches found under your current filter rules.</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 border bg-white fill-height d-flex flex-column" rounded="lg" elevation="0">
          <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-3">
            My Focus Words (Error Analysis)
          </div>

          <div v-if="focusedListKey" class="flex-grow-1 d-flex flex-column">
            <div class="bg-teal-light border border-teal-soft rounded-xl pa-4 mb-4">
              <div class="text-subtitle-2 font-weight-bold text-teal-darken-4">
                List Target: <span class="font-weight-black underline">{{ focusedListKey.replace(/_/g, ' ') }}</span>
              </div>
              <div class="text-caption text-teal-darken-3 mt-0.5">
                These words represent entry values where you missed prompts during spelling/writing loops. Lower success rates require closer practice attention!
              </div>
            </div>

            <div class="scroll-box flex-grow-1">
              <v-table density="comfortable" class="bg-white border rounded-xl overflow-hidden shadow-xs">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="font-weight-bold text-slate-700">Vocabulary Word</th>
                    <th class="font-weight-bold text-slate-700 text-center" style="width: 110px;">My Errors</th>
                    <th class="font-weight-bold text-slate-700 text-center" style="width: 110px;">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in highErrorTerms" :key="item.item_key" class="item-tr">
                    <td class="font-weight-bold text-slate-900">
                      <v-icon start size="16" :color="item.accuracy_pct >= 75 ? 'success' : 'red-lighten-1'">
                        {{ item.accuracy_pct >= 75 ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
                      </v-icon>
                      {{ item.term_readable }}
                    </td>
                    <td class="text-center font-weight-bold text-red-darken-3 bg-red-tight">
                      {{ item.wrong_count }}
                    </td>
                    <td class="text-center font-weight-black">
                      <span :class="item.accuracy_pct >= 75 ? 'text-green-darken-2' : (item.accuracy_pct >= 50 ? 'text-orange-darken-2' : 'text-red-darken-2')">
                        {{ item.accuracy_pct }}%
                      </span>
                    </td>
                  </tr>
                  <tr v-if="highErrorTerms.length === 0">
                    <td colspan="3" class="text-center text-slate-400 py-8">
                      Great job! No spelling mistake history recorded on this list yet.
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>

          <div v-else class="text-center text-slate-400 py-12 border border-dashed rounded-xl bg-white fill-height d-flex flex-column align-center justify-center flex-grow-1">
            <v-icon size="48" class="text-slate-200 mb-2">mdi-gesture-tap-button</v-icon>
            <div class="text-body-2">Select any vocabulary list from the left panel to execute an automatic diagnosis of your common writing mistakes.</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import api from '@/axios';

interface ProgressListRecord {
  list_key: string;
  domain: string | null;
  mode: string;
  level: string;
  track_key: string;
  sessions_started: number;
  sessions_finished: number;
  total_attempts: number;
  correct_count: number;
  wrong_count: number;
  accuracy: number;
  masteredCount: number;
  totalCount: number;
  masteryPct: number;
}

// UI States
const loading = ref(false);
const focusedListKey = ref<string | null>(null);
const searchListQuery = ref('');

// Dynamic Data Store Arrays
const progressRecordsPool = ref<any[]>([]);
const activeSessionsPool = ref<any[]>([]);
const highErrorTerms = ref<any[]>([]);

// 🌟 PILLAR A & C: Aggregate native my-work elements into UI presentation blocks
const filteredProgressList = computed<ProgressListRecord[]>(() => {
  const query = searchListQuery.value?.trim().toLowerCase();
  
  const formattedList = progressRecordsPool.value.map(p => {
    // Cross-reference matching active/cached training session to parse deep item count metrics
    const matchSession = activeSessionsPool.value.find(s => s.list_key === p.list_key && s.level === p.level && s.track_key === p.track_key);
    
    const masteredCount = matchSession ? (matchSession.mastered_item_ids?.length || 0) : (p.correct_count || 0);
    const totalCount = matchSession ? (matchSession.all_item_ids?.length || 0) : (p.total_attempts || 0);
    const masteryPct = totalCount > 0 ? Math.round((masteredCount * 100) / totalCount) : (p.accuracy ? Math.round(p.accuracy) : 0);

    return {
      list_key: p.list_key,
      domain: p.domain,
      mode: p.mode,
      level: p.level,
      track_key: p.track_key,
      sessions_started: p.sessions_started || 0,
      sessions_finished: p.sessions_finished || 0,
      total_attempts: p.total_attempts || 0,
      correct_count: p.correct_count || 0,
      wrong_count: p.wrong_count || 0,
      accuracy: p.accuracy || 0,
      masteredCount,
      totalCount,
      masteryPct: Math.min(100, masteryPct)
    };
  });

  // Filter out lists based on search string and sort alphabetically
  return formattedList
    .filter(l => !query || l.list_key.toLowerCase().includes(query))
    .sort((a, b) => a.list_key.localeCompare(b.list_key, undefined, { numeric: true, sensitivity: 'base' }));
});

// 🌟 PILLAR B: Reach out down backend list-errors query string engine action mapping
watch(focusedListKey, async (newKey) => {
  if (!newKey) {
    highErrorTerms.value = [];
    return;
  }

  loading.value = true;
  try {
    // Leverages the identical backend SQL aggregation logic we deployed for the teacher view!
    const response = await api.get('/vocab-workout-sessions/list-errors/', {
      params: { list_key: newKey }
    });
    highErrorTerms.value = response.data || [];
  } catch (err) {
    console.error("Failed to fetch custom aggregated error breakdown metrics for student:", err);
    highErrorTerms.value = [];
  } finally {
    loading.value = false;
  }
});

// Primary network boot loop loader
async function fetchStudentWorkoutDataProfile() {
  loading.value = true;
  try {
    // Execute a fast single network transaction onto the built-in action signature
    const response = await api.get('/vocab-workout-sessions/my-work/');
    
    progressRecordsPool.value = response.data?.progress || [];
    activeSessionsPool.value = response.data?.active_sessions || [];
    
    // Auto-focus the top sorted list record if available to maximize screen footprint
    if (filteredProgressList.value.length > 0) {
      focusedListKey.value = filteredProgressList.value[0].list_key;
    }
  } catch (err) {
    console.error("Failed to unpack my-work portfolio records:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchStudentWorkoutDataProfile();
});
</script>

<style scoped>
.student-vocab-header {
  background: linear-gradient(135deg, #0284c7 0%, #0f766e 100%);
  position: relative;
  overflow: hidden;
}
.student-vocab-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-5deg);
  pointer-events: none;
}
.scroll-box {
  max-height: 600px;
  overflow-y: auto;
}
.hover-slate {
  transition: all 0.15s ease-in-out;
}
.hover-slate:hover {
  background-color: #f8fafc !important;
  border-color: #cbd5e1 !important;
}
.border-teal {
  border-color: #0d9488 !important;
}
.border-teal-soft {
  border-color: #99f6e4 !important;
}
.bg-teal-tight {
  background-color: #f0fdfa !important;
}
.teal-light {
  background-color: #f0fdfa !important;
}
.bg-red-tight {
  background-color: #fef2f2 !important;
  color: #991b1b !important;
}
.shadow-xs {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
}
.border-b {
  border-bottom: 1px solid #f1f5f9 !important;
}
.italic {
  font-style: italic;
}
.underline {
  text-decoration: underline;
}
.min-vh-100 {
  min-height: 100vh;
}
</style>