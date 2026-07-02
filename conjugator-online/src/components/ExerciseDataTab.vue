<template>
  <v-container fluid class="pa-6 text-slate-800 bg-slate-50 min-vh-100">
    
    <v-card class="pa-6 mb-6 student-exercise-hero text-white shadow-sm" rounded="xl">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
        <div>
          <div class="text-h4 font-weight-medium">Grammar Exercise Data</div>
          <div class="text-subtitle-1 opacity-90 mt-1">
            Analyze your results from completing targeted grammar practices.
          </div>
        </div>
        <v-avatar color="white" variant="tonal" size="56">
          <v-icon size="32">mdi-chart-box-multiple-outline</v-icon>
        </v-avatar>
      </div>
    </v-card>

    <div class="d-flex ga-3 mb-6 w-100">
      <v-btn
        :variant="viewMode === 'course' ? 'flat' : 'outlined'"
        :color="viewMode === 'course' ? 'teal' : 'slate-500'"
        size="large"
        class="text-none font-weight-bold flex-grow-1 rounded-xl"
        prepend-icon="mdi-account-group-outline"
        @click="viewMode = 'course'"
      >
        By Course
      </v-btn>
      <v-btn
        :variant="viewMode === 'code' ? 'flat' : 'outlined'"
        :color="viewMode === 'code' ? 'indigo' : 'slate-500'"
        size="large"
        class="text-none font-weight-bold flex-grow-1 rounded-xl"
        prepend-icon="mdi-code-braces-box"
        @click="viewMode = 'code'"
      >
        By Error Code
      </v-btn>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="teal" class="mb-6 rounded-pill" />

    <div v-if="viewMode === 'course'" class="fade-in">

      <v-card variant="outlined" class="rounded-xl bg-white overflow-hidden border-light" elevation="0">
        <v-table density="comfortable" class="table-fixed">
          <thead class="bg-slate-50">
            <tr>
              <th class="font-weight-bold text-slate-700" style="width: 200px; padding-left: 20px;"></th>
              <th class="font-weight-bold text-slate-700">Completed Grammar Units (Best Accuracy Score)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="matrix-row-tr">
              <td class="font-weight-bold text-slate-900 border-r" style="padding-left: 20px;">
                <v-avatar size="28" color="teal-lighten-5" class="mr-2 text-teal-darken-3 font-weight-black text-caption">
                  {{ userStore.student?.initials || 'ME' }}
                </v-avatar>
                {{ userStore.student?.initials || 'My Progress' }}
                <span class="text-caption text-slate-400 ml-1">({{ userStore.student?.web_id }})</span>
              </td>
              <td class="py-3 px-4">
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="session in computedBestScoresList"
                    :key="session.session_id"
                    size="small"
                    variant="tonal"
                    :color="getScoreColor(session.accuracy)"
                    class="font-weight-bold"
                  >
                    Code {{ session.error_code }}: {{ session.accuracy }}%
                  </v-chip>
                  <span v-if="computedBestScoresList.length === 0" class="text-caption text-slate-400 italic">
                    No grammar unit targets submitted yet under this course module filter.
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>

    <div v-if="viewMode === 'code'" class="fade-in">
      <v-row class="fill-height min-vh-60" dense>
        
        <v-col cols="12" md="3" class="border-r pr-md-4">
          <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-2">
            Exercise Units (by error code)
          </div>
          <v-text-field
            v-model="searchCodeQuery"
            placeholder="Search error codes..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            class="mb-3 bg-white"
            clearable
            hide-details
          />
          <v-list class="bg-transparent py-0 ga-1 d-flex flex-column pane-scroll-box mt-1">
            <v-list-item
              v-for="code in filteredCodes"
              :key="code"
              class="border rounded-xl pa-3 cursor-pointer alignment-node"
              :class="focusedCode === code ? 'bg-indigo-lighten-5 text-indigo-darken-4 border-indigo-soft' : 'bg-white'"
              @click="focusedCode = code"
            >
              <div class="d-flex align-center justify-space-between w-100">
                <span class="font-weight-black font-mono text-body-2">{{ code }}</span>
                <v-icon size="16" :color="focusedCode === code ? 'indigo' : 'slate-300'">
                  {{ focusedCode === code ? 'mdi-circle' : 'mdi-chevron-right' }}
                </v-icon>
              </div>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" md="9" class="pl-md-4 mt-4 mt-md-0">
          <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-2">
            Correct and incorrect answers for this Exercise Unit
          </div>

          <div v-if="focusedCode">
            <div class="bg-indigo-lighten-5 border border-indigo-lighten-4 rounded-xl pa-4 mb-4">
              <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4">
                Active Audit Unit: Error Code <span class="font-mono font-weight-black underline">{{ focusedCode }}</span>
              </div>
              <div class="text-caption text-indigo-darken-3 mt-0.5">
                Reviewing question performance and bad response strings extracted from historical assignment tracks.
              </div>
            </div>

            <v-table density="comfortable" class="bg-white border rounded-xl overflow-hidden shadow-xs">
              <thead class="bg-slate-50">
                <tr>
                  <th class="font-weight-bold text-slate-700">Prompt Question Structure</th>
                  <th class="font-weight-bold text-slate-700 text-center" style="width: 140px;">Accuracy Success</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(q, idx) in codeStats" :key="idx" class="matrix-tr">
                  <td class="py-4 px-4">
                    <div class="text-body-2 font-weight-bold text-slate-900">{{ q.question }}</div>
                    <div class="text-caption text-green-darken-3 font-weight-medium mt-1">
                      <v-icon start size="14" color="green">mdi-check-circle-outline</v-icon>
                      Expected: {{ q.expected }}
                    </div>
                    
                    <div v-if="q.wrong_submissions && q.wrong_submissions.length > 0" class="mt-2 block-errors-tray">
                      <span class="text-slate-400 uppercase font-weight-bold mr-1" style="font-size: 8px; letter-spacing: 0.5px;">Wrong answers:</span>
                      <div class="d-flex flex-wrap ga-1 mt-1">
                        <v-chip v-for="err in q.wrong_submissions" :key="err" size="x-small" color="red-darken-1" variant="tonal" class="font-mono bg-red-lighten-5 font-weight-bold">
                          "{{ err }}"
                        </v-chip>
                      </div>
                    </div>
                  </td>
                  <td class="text-center vertical-middle border-l">
                    <div class="text-h6 font-weight-black font-mono" :class="q.accuracy_pct < 65 ? 'text-red-darken-2' : 'text-green-darken-2'">
                      {{ q.accuracy_pct }}%
                    </div>
                    <div class="text-caption text-slate-400 mt-0.5 font-weight-medium">{{ q.wrong_count }} errors / {{ q.total_attempts }} tries</div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <div v-else class="fill-height d-flex flex-column align-center justify-center text-slate-400 py-12 border border-dashed rounded-xl bg-white min-vh-60">
            <v-icon size="48" class="text-slate-200 mb-2">mdi-gesture-tap</v-icon>
            <div class="text-body-2">Select an exercise unit from the left panel.</div>
          </div>
        </v-col>
      </v-row>
    </div>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import api from '@/axios';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const viewMode = ref<'course' | 'code'>('course');
const loading = ref(false);

// Course Filter Coordinates
const selectedCourse = ref('all');
const courseOptions = ref<{ title: string; value: string }[]>([]);
const rawSessions = ref<any[]>([]);
const enrollments = ref<any[]>([]);

// Error Code Diagnosis State
const focusedCode = ref<string | null>(null);
const searchCodeQuery = ref('');
const codeStats = ref<any[]>([]);

// --- COMPUTED: PANEL 1 (By Course Best Accuracy Map) ---
const computedBestScoresList = computed(() => {
  // 1. Gather all unique list IDs corresponding to chosen course parameter boundaries
  const validCourseFilterKeys = enrollments.value
    .filter(e => selectedCourse.value === 'all' || e.course === selectedCourse.value)
    .map(e => String(e.course));

  // If filtered down by a course but student has zero assignments there, return gracefully
  if (selectedCourse.value !== 'all' && validCourseFilterKeys.length === 0) {
    return [];
  }

  // 2. Map, clean, and deduplicate student's highest accuracy score run pass per code
  const bestScoresMap: Record<string, { error_code: string; accuracy: number; session_id: number }> = {};

  rawSessions.value.forEach(s => {
    const acc = Math.round((s.correct_count * 100) / (s.total_rounds || 1));
    if (!bestScoresMap[s.error_code] || acc > bestScoresMap[s.error_code].accuracy) {
      bestScoresMap[s.error_code] = { 
        error_code: s.error_code, 
        accuracy: acc, 
        session_id: s.session_id 
      };
    }
  });

  return Object.values(bestScoresMap).sort((a, b) => a.error_code.localeCompare(b.error_code));
});

// --- COMPUTED: PANEL 2 (Alphanumeric Error Codes Array) ---
const masterCodeList = computed<string[]>(() => {
  const codesSet = new Set<string>();
  rawSessions.value.forEach(s => { if (s.error_code) codesSet.add(s.error_code); });
  return Array.from(codesSet).sort();
});

const filteredCodes = computed<string[]>(() => {
  const query = searchCodeQuery.value?.trim();
  if (!query) return masterCodeList.value;
  return masterCodeList.value.filter(c => c.includes(query));
});

// --- WATCHERS: Fetch Question Metadata Breakdown on Node Change ---
watch(focusedCode, async (newVal) => {
  if (!newVal) {
    codeStats.value = [];
    return;
  }
  
  loading.value = true;
  try {
    // Endpoints handle user scoping invisibly on non-staff requests
    const res = await api.get('/exercise-sessions/code-analytics/', {
      params: { error_code: newVal }
    });
    codeStats.value = res.data || [];
  } catch (err) {
    console.error("Failed to fetch detailed code metrics for student context window:", err);
    codeStats.value = [];
  } finally {
    loading.value = false;
  }
});

function getScoreColor(acc: number) {
  if (acc >= 85) return 'success';
  if (acc >= 65) return 'warning';
  return 'error';
}

// Baseline parallel initialization fetch operations loop
async function loadStudentExercisesDashboard() {
  loading.value = true;
  try {
    const [coursesRes, sessionsRes, enrollmentRes] = await Promise.all([
      api.get('/courses/'),
      api.get('/exercise-sessions/'), // Backend views automatically filter down to request.user records
      api.get('/enrollment/')
    ]);
    
    const coursesPayload = coursesRes.data?.results || coursesRes.data || [];
    courseOptions.value = [
      { title: 'All Active Courses', value: 'all' },
      ...coursesPayload.map((c: any) => ({ title: c.slug, value: c.slug }))
    ];
    
    rawSessions.value = sessionsRes.data?.results || sessionsRes.data || [];
    enrollments.value = enrollmentRes.data?.results || enrollmentRes.data || [];
  } catch (err) {
    console.error("Error setting up student exercise tracking metrics profiles:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadStudentExercisesDashboard();
});
</script>

<style scoped>
.student-exercise-hero {
  background: linear-gradient(135deg, #0d9488 0%, #0b5345 100%);
  position: relative;
  overflow: hidden;
}
.student-exercise-hero::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 45%);
  transform: rotate(-3deg);
  pointer-events: none;
}
.pane-scroll-box {
  max-height: 520px;
  overflow-y: auto;
  padding-right: 4px;
}
.matrix-row-tr:hover {
  background-color: #f8fafc !important;
}
.matrix-tr:hover {
  background-color: #fafafa !important;
}
.bg-red-lighten-5 {
  background-color: #fef2f2 !important;
}
.bg-indigo-lighten-5 {
  background-color: #f5f3ff !important;
}
.border-indigo-soft {
  border-color: #c7d2fe !important;
}
.block-errors-tray {
  display: block;
}
.font-mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
}
.vertical-middle {
  vertical-align: middle !important;
}
.underline {
  text-decoration: underline;
}
.border-light {
  border-color: #e2e8f0 !important;
}
.border-r {
  border-right: 1px solid #e2e8f0 !important;
}
.border-l {
  border-left: 1px solid #e2e8f0 !important;
}
.min-vh-60 {
  min-height: 60vh;
}
.min-vh-100 {
  min-height: 100vh;
}
.table-fixed {
  table-layout: fixed;
  width: 100%;
}
.fade-in {
  animation: viewSlideUp 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes viewSlideUp {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>