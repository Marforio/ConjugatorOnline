<template>
  <v-container fluid class="pa-6 text-slate-800 bg-slate-50 min-vh-100">
    <v-card class="pa-6 mb-6 vocab-header text-white shadow-sm" rounded="xl">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
        <div>
          <div class="text-h4 font-weight-bold">Vocab Workout Data</div>
          <div class="text-subtitle-1 opacity-90 mt-1">
            Inspect student performance in Vocab Workout
          </div>
        </div>
        <v-avatar color="white" variant="tonal" size="56">
          <v-icon size="32">mdi-google-analytics</v-icon>
        </v-avatar>
      </div>
    </v-card>

    <div class="d-flex ga-3 mb-6 w-100">
      <v-btn
        :variant="panelViewMode === 'course' ? 'flat' : 'outlined'"
        :color="panelViewMode === 'course' ? 'teal' : 'slate-500'"
        size="large"
        class="text-none font-weight-bold flex-grow-1 rounded-xl"
        prepend-icon="mdi-school"
        @click="panelViewMode = 'course'"
      >
        Course View
      </v-btn>
      <v-btn
        :variant="panelViewMode === 'list' ? 'flat' : 'outlined'"
        :color="panelViewMode === 'list' ? 'indigo' : 'slate-500'"
        size="large"
        class="text-none font-weight-bold flex-grow-1 rounded-xl"
        prepend-icon="mdi-format-list-bulleted-type"
        @click="panelViewMode = 'list'"
      >
        Vocab List View
      </v-btn>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="teal" class="mb-6 rounded-pill" />

    <div v-if="panelViewMode === 'course'">
      <v-row dense class="mb-4">
        <v-col cols="12" md="4">
          <v-select
            v-model="courseModeSlug"
            :items="courseOptions"
            item-title="name"
            item-value="slug"
            label="Select Course"
            prepend-inner-icon="mdi-school-outline"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>
      </v-row>

      <v-card v-if="courseModeSlug && courseModeSlug !== 'all'" class="border bg-white" rounded="lg" elevation="0">
        <div class="pa-4 bg-slate-50 border-b font-weight-bold text-slate-700">
          Student Activity and Progress by List (Showing list completion % > 0)
        </div>
        
        <v-table density="comfortable" class="bg-white table-fixed">
          <thead class="bg-slate-50">
            <tr>
              <th class="font-weight-bold text-slate-700" style="width: 200px;">Students</th>
              <th class="font-weight-bold text-slate-700">Vocabulary List Progress</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in studentProgressByCourse" :key="student.id">
              <td class="font-weight-bold text-slate-900 border-r">
                <v-avatar color="teal-lighten-5" size="28" class="mr-2 text-teal-darken-3 text-caption font-weight-black">
                  {{ student.initials }}
                </v-avatar>
                {{ student.initials }} <span class="text-caption text-slate-400">({{ student.web_id }})</span>
              </td>
              <td class="pa-3">
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="list in student.completedLists"
                    :key="list.list_key"
                    size="small"
                    color="teal-darken-1"
                    variant="tonal"
                    class="font-weight-bold bg-teal-tight"
                  >
                    <span class="text-slate-800 font-weight-black mr-1">{{ list.list_key }}:</span>
                    {{ list.pct }}% Mastered
                  </v-chip>
                  <span v-if="student.completedLists.length === 0" class="text-caption text-slate-400 italic">
                    No vocabulary lists studied yet.
                  </span>
                </div>
              </td>
            </tr>
            <tr v-if="studentProgressByCourse.length === 0">
              <td colspan="2" class="text-center text-slate-400 py-8">No students linked to this course.</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
      
      <div v-else class="text-center text-slate-400 py-12 border border-dashed rounded-xl bg-white">
        <v-icon size="48" class="text-slate-200 mb-2">mdi-arrow-up-bold-box-outline</v-icon>
        <div class="text-body-2">Please select a course from the dropdown.</div>
      </div>
    </div>

    <div v-if="panelViewMode === 'list'">
      <v-row class="fill-height min-vh-60" dense>
        <v-col cols="12" md="4" class="border-r pr-md-4">
          <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-2">
            Vocabulary Lists
          </div>
          <v-text-field
            v-model="searchListQuery"
            placeholder="Search for a list"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="mb-3 bg-white"
            clearable
            hide-details
          />

          <v-list class="bg-transparent py-0 ga-1 d-flex flex-column list-scroll-box mt-1">
            <v-list-item
              v-for="listKey in filteredListKeysDirectory"
              :key="listKey"
              class="border rounded-xl pa-3 cursor-pointer alignment-node"
              :class="focusedListKey === listKey ? 'bg-indigo-light text-indigo-darken-4 border-indigo-soft' : 'bg-white'"
              @click="focusedListKey = listKey"
            >
              <div class="d-flex align-center justify-space-between w-100">
                <span class="text-body-2 font-weight-black text-slate-800">{{ listKey }}</span>
                <v-icon size="16" :color="focusedListKey === listKey ? 'indigo' : 'slate-300'">
                  {{ focusedListKey === listKey ? 'mdi-circle' : 'mdi-chevron-right' }}
                </v-icon>
              </div>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="12" md="8" class="pl-md-4 mt-4 mt-md-0">
          <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-2">
            Vocabulary Diagnostics
          </div>

          <div v-if="focusedListKey">
            <div class="bg-indigo-lighten-5 border border-indigo-lighten-4 rounded-xl pa-4 mb-4">
              <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4">
                Vocab List: <span class="font-weight-black underline">{{ focusedListKey }}</span>
              </div>
              <div class="text-caption text-indigo-darken-3 mt-0.5">
                Displaying terminal number of errors and accuracy rate by term.
              </div>
            </div>

            <v-table density="comfortable" class="bg-white border rounded-xl overflow-hidden shadow-xs">
              <thead class="bg-slate-50">
                <tr>
                  <th class="font-weight-bold text-slate-700">Vocabulary Term</th>
                  <th class="font-weight-bold text-slate-700 text-center" style="width: 140px;">Total errors</th>
                  <th class="font-weight-bold text-slate-700 text-center" style="width: 140px;">Success rate</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in computedHighErrorTermsForSelectedList" :key="item.item_key" class="matrix-tr">
                  <td class="font-weight-bold text-slate-900">
                    <v-icon start size="16" color="red-lighten-1">mdi-close-circle-outline</v-icon>
                    {{ item.term_readable }}
                  </td>
                  <td class="text-center font-weight-bold text-red-darken-4 bg-red-tight">
                    {{ item.wrong_count }}
                  </td>
                  <td class="text-center font-weight-black">
                    <span :class="item.accuracy_pct >= 65 ? 'text-green-darken-2' : (item.accuracy_pct >= 45 ? 'text-orange-darken-2' : 'text-red-darken-2')">
                      {{ item.accuracy_pct }}%
                    </span>
                  </td>
                </tr>
                <tr v-if="computedHighErrorTermsForSelectedList.length === 0">
                  <td colspan="3" class="text-center text-slate-400 py-8">
                    No failed entry attempts recorded on this module word list structure yet.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <div v-else class="text-center text-slate-400 py-12 border border-dashed rounded-xl bg-white fill-height d-flex flex-column align-center justify-center">
            <v-icon size="48" class="text-slate-200 mb-2">mdi-gesture-tap</v-icon>
            <div class="text-body-2">Select a vocabulary list key directory node from the left panel to execute terminal diagnostic traces.</div>
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

interface Course {
  slug: string;
  name?: string;
}

interface StudentProgressNode {
  id: number;
  initials: string;
  web_id: string;
  course_slugs: string[];
  completedLists: Array<{ list_key: string; pct: number }>;
}

const userStore = useUserStore();

// Isolated Panel Controller State
const panelViewMode = ref<'course' | 'list'>('course');

// Functional Properties
const loading = ref(false);
const courseModeSlug = ref<string | null>(null);
const focusedListKey = ref<string | null>(null);
const searchListQuery = ref('');

const courseOptions = ref<{ slug: string; name: string }[]>([]);
const rawSessionsPool = ref<any[]>([]);
const rawProgressPool = ref<any[]>([]);
const enrollments = ref<any[]>([]);
const computedHighErrorTermsForSelectedList = ref<any[]>([]);

// 🌟 PANEL A ENGINE: Course List Completion Percentage Tracker Matrix
const studentProgressByCourse = computed<StudentProgressNode[]>(() => {
  if (!courseModeSlug.value || courseModeSlug.value === 'all') return [];

  // Filter out students enrolled in this course via the web_id links table
  const enrolledStudentWebIds = enrollments.value
    .filter(e => e.course === courseModeSlug.value)
    .map(e => String(e.student || e.student_id));

  const targetCourseStudents = userStore.teacherRoster.filter(s => 
    s.web_id && enrolledStudentWebIds.includes(String(s.web_id))
  );

  return targetCourseStudents.map(student => {
    // Cross-examine matching session master metrics for this student
    const studentSessions = rawSessionsPool.value.filter(s => s.student === student.id);
    const listMap: Record<string, number> = {};

    studentSessions.forEach(s => {
      const tCount = s.total_count || s.all_item_ids?.length || 0;
      const mCount = s.mastered_count || s.mastered_item_ids?.length || 0;
      
      if (tCount > 0) {
        const pct = Math.round((mCount * 100) / tCount);
        // Retain the highest recorded completion metric block pass
        listMap[s.list_key] = Math.max(listMap[s.list_key] || 0, pct);
      }
    });

    const completedLists = Object.keys(listMap)
      .filter(k => listMap[k] > 0) // Requirement: Only show percentages above 0%
      .map(k => ({
        list_key: k,
        pct: listMap[k]
      }));

    return {
      id: student.id,
      initials: student.initials,
      web_id: student.web_id,
      course_slugs: (student as any).courses ? (student as any).courses.map((c: any) => c.slug || c) : [],
      completedLists
    };
  });
});

// PANEL B ENGINE: Searchable Vocabulary List Directory
//  Sorts vocabulary keys alphabetically
const directoryMasterListKeys = computed<string[]>(() => {
  const keysSet = new Set<string>();
  rawSessionsPool.value.forEach(s => { if (s.list_key) keysSet.add(s.list_key); });
  rawProgressPool.value.forEach(p => { if (p.list_key) keysSet.add(p.list_key); });
  
  return Array.from(keysSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
});

const filteredListKeysDirectory = computed<string[]>(() => {
  const query = searchListQuery.value?.trim().toLowerCase();
  if (!query) return directoryMasterListKeys.value;
  return directoryMasterListKeys.value.filter(k => k.toLowerCase().includes(query));
});

// 2. Watcher hits the dedicated endpoint whenever a list key node is selected
watch(focusedListKey, async (newKey) => {
  if (!newKey) {
    computedHighErrorTermsForSelectedList.value = [];
    return;
  }

  loading.value = true;
  console.log(`%c--- 📡 FETCHING BACKEND AGGREGATED ERRORS FOR LIST: [${newKey}] ---`, "color: #10b981; font-weight: bold;");
  
  try {
    // Single request directly targeted at our optimized endpoint!
    const response = await api.get('/vocab-workout-sessions/list-errors/', {
      params: { list_key: newKey }
    });
    
    // Save the array payload directly to the view state
    computedHighErrorTermsForSelectedList.value = response.data || [];
  } catch (err) {
    console.error("Failed to fetch optimized list metrics summary logs:", err);
    computedHighErrorTermsForSelectedList.value = [];
  } finally {
    loading.value = false;
  }
});


// Core API Aggregator Request Handlers
async function initializeDashboardContextData() {
  loading.value = true;
  try {
    const [coursesRes, enrollmentsRes, sessionsRes, progressRes] = await Promise.all([
      api.get('/courses/'),
      api.get('/enrollment/'),
      api.get('/vocab-workout-sessions/'),
      api.get('/vocab-workout-sessions/my-work/').catch(() => ({ data: { progress: [] } }))
    ]);

    // Forces alphabetical sorting directly during initialization mapping
      const coursesPayload = coursesRes.data?.results || coursesRes.data || [];
      courseOptions.value = coursesPayload
        .map((c: any) => ({ slug: c.slug, name: `Course Cohort: ${c.slug}` }))
        .sort((a: any, b: any) => a.slug.localeCompare(b.slug)); // Alphabetical Sort Pass

      if (courseOptions.value.length > 0) {
        courseModeSlug.value = courseOptions.value[0].slug;
      }

    enrollments.value = enrollmentsRes.data?.results || enrollmentsRes.data || [];
    rawSessionsPool.value = sessionsRes.data?.results || sessionsRes.data || [];
    rawProgressPool.value = progressRes.data?.progress || [];

    console.log("📊 API Loading Complete. Data shapes initialized:", {
      coursesCount: courseOptions.value.length,
      enrollmentsCount: enrollments.value.length,
      sessionsPoolCount: rawSessionsPool.value.length
    });

  } catch (err) {
    console.error("Dashboard context boot cycle exception caught:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (userStore.isStaff && userStore.teacherRoster.length === 0) {
    await userStore.fetchTeacherRoster();
  }
  await initializeDashboardContextData();
});
</script>

<style scoped>
.vocab-header {
  background: linear-gradient(135deg, #0f172a 0%, #115e59 100%);
  position: relative;
  overflow: hidden;
}
.vocab-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-6deg);
  pointer-events: none;
}
.list-scroll-box {
  max-height: 520px;
  overflow-y: auto;
  padding-right: 4px;
}
.matrix-tr:hover {
  background-color: #fff1f2 !important;
}
.bg-red-tight {
  background-color: #fef2f2 !important;
  color: #991b1b !important;
}
.bg-teal-tight { background-color: #f0fdfa !important; }
.bg-indigo-light { background-color: #e0e7ff !important; }
.bg-indigo-lighten-5 { background-color: #f5f3ff !important; }
.border-indigo-soft { border-color: #c7d2fe !important; }
.border-b { border-bottom: 1px solid #f1f5f9 !important; }
.border-r { border-right: 1px solid #e2e8f0 !important; }
.min-vh-60 { min-height: 60vh; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.table-fixed { table-layout: fixed; width: 100%; }
</style>