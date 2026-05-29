<template>
  <v-container fluid class="pa-6 text-slate-800 bg-slate-50 min-vh-100">


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

    <div v-if="viewMode === 'course'">
      <v-row dense class="mb-4">
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedCourse"
            :items="courseOptions"
            label="Select Active Classroom Course"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-school-outline"
            hide-details
          />
        </v-col>
      </v-row>

      <v-card variant="outlined" class="rounded-xl bg-white overflow-hidden border-light" elevation="0">
        <v-table density="comfortable" class="table-fixed">
          <thead class="bg-slate-50">
            <tr>
              <th class="font-weight-bold text-slate-700" style="width: 240px; padding-left: 20px;">Students</th>
              <th class="font-weight-bold text-slate-700">Completed Grammar Units (Best Accuracy Score)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in studentStats" :key="student.id" class="matrix-row-tr">
              <td class="font-weight-bold text-slate-900 border-r" style="padding-left: 20px;">
                <v-avatar size="28" color="teal-lighten-5" class="mr-2 text-teal-darken-3 font-weight-black text-caption">
                  {{ student.initials }}
                </v-avatar>
                {{ student.initials }} 
                <span class="text-caption text-slate-400 ml-1">({{ student.web_id }})</span>
              </td>
              <td class="py-3 px-4">
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="session in student.sessions"
                    :key="session.session_id"
                    size="small"
                    variant="tonal"
                    :color="getScoreColor(session.accuracy)"
                    class="font-weight-bold"
                  >
                    Code {{ session.error_code }}: {{ session.accuracy }}%
                  </v-chip>
                  <span v-if="student.sessions.length === 0" class="text-caption text-slate-400 italic">
                    No grammar unit targets submitted yet.
                  </span>
                </div>
              </td>
            </tr>
            <tr v-if="studentStats.length === 0">
              <td colspan="2" class="text-center text-slate-400 py-8">No matching students linked to this selected course context block.</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>

    <div v-if="viewMode === 'code'">
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
            Correct and incorrect answers for this Excercise Unit
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
              <v-table>
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

// Navigation isolated panel state tracker
const viewMode = ref<'course' | 'code'>('course');
const loading = ref(false);

// Panel A (Course/Cohort) Parameters State
const selectedCourse = ref('all');
const courseOptions = ref<{ title: string; value: string }[]>([]);
const rawSessions = ref<any[]>([]);
const enrollments = ref<any[]>([]);

// Panel B (Error Code) Parameters State
const focusedCode = ref<string | null>(null);
const searchCodeQuery = ref('');
const codeStats = ref<any[]>([]);

// 🌟 PANEL A LOGIC ENGINE: Filtered matrix mapping rows by course roster boundaries
const studentStats = computed(() => {
  const enrolledStudentWebIds = enrollments.value
    .filter(e => selectedCourse.value === 'all' || e.course === selectedCourse.value)
    .map(e => String(e.student || e.student_id));

  const targetStudents = userStore.teacherRoster.filter(s => 
    s.web_id && enrolledStudentWebIds.includes(String(s.web_id))
  );

  return targetStudents.map(student => {
    const studentSessions = rawSessions.value.filter(s => s.student === student.id);
    
    // Group execution blocks by error_code picking the highest accuracy score run pass
    const bestScoresMap: Record<string, { error_code: string; accuracy: number; session_id: number }> = {};
    
    studentSessions.forEach(s => {
      const acc = Math.round((s.correct_count * 100) / (s.total_rounds || 1));
      if (!bestScoresMap[s.error_code] || acc > bestScoresMap[s.error_code].accuracy) {
        bestScoresMap[s.error_code] = { 
          error_code: s.error_code, 
          accuracy: acc, 
          session_id: s.session_id 
        };
      }
    });

    return {
      id: student.id,
      initials: student.initials,
      web_id: student.web_id,
      sessions: Object.values(bestScoresMap).sort((a, b) => a.error_code.localeCompare(b.error_code))
    };
  }).sort((a, b) => a.initials.localeCompare(b.initials));
});

// 🌟 PANEL B LOGIC ENGINE: Sorted alphanumeric error code catalog directory links
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

// Watcher triggers backend optimized aggregation fetch queries on code updates
watch(focusedCode, async (newVal) => {
  if (!newVal) {
    codeStats.value = [];
    return;
  }
  
  loading.value = true;
  try {
    const res = await api.get('/exercise-sessions/code-analytics/', {
      params: { error_code: newVal }
    });
    codeStats.value = res.data || [];
  } catch (err) {
    console.error("Failed to run code-analytics retrieval loops on endpoint:", err);
    codeStats.value = [];
  } finally {
    loading.value = false;
  }
});

// Color logic rules flags thresholds for chip layouts mapping
function getScoreColor(acc: number) {
  if (acc >= 85) return 'success';
  if (acc >= 65) return 'warning';
  return 'error';
}

// Single multi-transaction parallel baseline data bootstrap aggregator
async function initializeExercisesDashboardDataset() {
  loading.value = true;
  try {
    const [coursesRes, sessionsRes, enrollmentRes] = await Promise.all([
      api.get('/courses/'),
      api.get('/exercise-sessions/'),
      api.get('/enrollment/')
    ]);
    
    const coursesPayload = coursesRes.data?.results || coursesRes.data || [];
    courseOptions.value = [
      { title: 'All Active Courses', value: 'all' },
      ...coursesPayload.map((c: any) => ({ title: c.slug, value: c.slug }))
    ];
    
    rawSessions.value = sessionsRes.data?.results || sessionsRes.data || [];
    enrollments.value = enrollmentRes.data?.results || enrollmentRes.data || [];
    
    console.log("⚡ Standalone Exercises Dashboard Bootstrapped shapes initialized:", {
      sessionsCount: rawSessions.value.length,
      enrollmentsCount: enrollments.value.length
    });
  } catch (err) {
    console.error("Failed to execute background bootstrap parallel data pulls on data tab component:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (userStore.teacherRoster.length === 0) {
    userStore.fetchTeacherRoster();
  }
  initializeExercisesDashboardDataset();
});
</script>

<style scoped>
.exercise-dashboard-hero {
  background: linear-gradient(135deg, #1e293b 0%, #0369a1 100%);
  position: relative;
  overflow: hidden;
}
.exercise-dashboard-hero::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%),
    radial-gradient(circle at 80% 75%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 50%);
  transform: rotate(-4deg);
  pointer-events: none;
}
.pane-scroll-box {
  max-height: 540px;
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
.italic {
  font-style: italic;
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
</style>