<template>
  <v-container fluid class="mt-5 pa-4 px-6 text-slate-800 bg-slate-50 min-vh-100">
    <v-card class="pa-6 mb-6 vocab-header text-white shadow-sm" rounded="xl">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
        <div>
          <div class="text-h4 font-weight-bold">Vocab Workout Data</div>
          <div class="text-subtitle-1 opacity-90 mt-1">
            Inspect student performance in Vocab Workout
          </div>
        </div>
        <v-avatar color="white" variant="tonal" size="70">
          <v-icon size="48">mdi-chart-timeline-variant-shimmer</v-icon>
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
            Vocab Workout Data
          </div>

          <div v-if="focusedListKey">
  <div class="bg-indigo-lighten-5 border border-indigo-lighten-4 rounded-xl pa-4 mb-4 d-flex align-center justify-space-between flex-wrap ga-3">
    <div>
      <div class="text-subtitle-2 font-weight-bold text-indigo-darken-4">
        Vocab List: <span class="font-weight-black underline">{{ focusedListKey }}</span>
      </div>
      <div class="text-caption text-indigo-darken-3 mt-0.5">
        Displaying vocabulary performance and typical mistake patterns across student sessions.
      </div>
    </div>
    
    <v-chip color="indigo-darken-2" variant="flat" class="text-white font-weight-bold">
      <v-icon start size="16">mdi-checkbox-multiple-marked-circle-outline</v-icon>
      Total Completions: {{ listMetadataWrapper.total_completions }}
    </v-chip>
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
      <template v-for="item in listMetadataWrapper.terms" :key="item.item_key">
        <tr class="matrix-tr">
          <td class="font-weight-bold text-slate-900 pb-1">
            <v-icon start size="16" color="red-lighten-1">mdi-close-circle-outline</v-icon>
            {{ item.term_readable }}
            
            <div v-if="item.wrong_submissions && item.wrong_submissions.length > 0" class="mt-1 ps-5 block-errors-tray">
              <span class="text-slate-400 font-weight-medium uppercase mr-1" style="font-size: 9px; letter-spacing: 0.5px;">Submitted Errors:</span>
              <v-chip 
                v-for="(sub, idx) in item.wrong_submissions" 
                :key="idx" 
                size="x-small" 
                color="red-darken-1" 
                variant="tonal" 
                class="font-weight-bold mr-1 mb-1 bg-red-lighten-5 font-mono"
              >
                "{{ sub }}"
              </v-chip>
            </div>
          </td>
          <td class="text-center font-weight-bold text-red-darken-4 bg-red-tight vertical-middle">
            {{ item.wrong_count }}
          </td>
          <td class="text-center font-weight-black vertical-middle">
            <span :class="item.accuracy_pct >= 65 ? 'text-green-darken-2' : (item.accuracy_pct >= 45 ? 'text-orange-darken-2' : 'text-red-darken-2')">
              {{ item.accuracy_pct }}%
            </span>
          </td>
        </tr>
      </template>
      
      <tr v-if="!listMetadataWrapper.terms || listMetadataWrapper.terms.length === 0">
        <td colspan="3" class="text-center text-slate-400 py-8">
          No failed entry attempts recorded on this list yet.
        </td>
      </tr>
    </tbody>
  </v-table>
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

// View Management Toggle States
const panelViewMode = ref<'course' | 'list'>('course');

// Reactive Functional Modifiers
const loading = ref(false);
const courseModeSlug = ref<string | null>(null);
const focusedListKey = ref<string | null>(null);
const searchListQuery = ref('');

const rawSessionsPool = ref<any[]>([]);
const rawProgressPool = ref<any[]>([]);
const listMetadataWrapper = ref<{ total_completions: number; terms: any[] }>({
  total_completions: 0,
  terms: []
});

// 🌟 REWRITTEN SELECTOR: Derive options cleanly straight from store memory allocations
const courseOptions = computed(() => userStore.availableTeacherCourses);

// Automatically keep selection anchor synchronized with the store array sequences
watch(courseOptions, (newOptions) => {
  if (newOptions.length > 0 && !courseModeSlug.value) {
    courseModeSlug.value = newOptions[0].slug;
  }
}, { immediate: true });

/**
 * 🌟 HIGHLY OPTIMIZED PROGRESS MATRIX ENGINE
 * Strips out loop lookups using an indexed lookup map strategy
 */
const studentProgressByCourse = computed<StudentProgressNode[]>(() => {
  const activeCourse = courseModeSlug.value;
  if (!activeCourse || activeCourse === 'all' || !userStore.teacherRoster.length) return [];

  // 1. Create an indexed set of students enrolled in this course from userStore enrollments
  const targetStudentWebIds = new Set<string>();
  userStore.enrollments.forEach(e => {
    const enrollmentCourseSlug = e.course?.slug || String(e.course);
    if (enrollmentCourseSlug.trim().toLowerCase() === activeCourse.trim().toLowerCase()) {
      const webId = e.student && typeof e.student === 'object' ? e.student.web_id : String(e.student);
      if (webId) targetStudentWebIds.add(webId);
    }
  });

  // Filter students based on our indexed lookup set
  const targetCourseStudents = userStore.teacherRoster.filter(s => 
    s.web_id && targetStudentWebIds.has(String(s.web_id))
  );

  // 2. Pre-index raw session data by student ID to eliminate O(N) array filtering within loops
  const sessionsByStudentMap = new Map<number, any[]>();
  rawSessionsPool.value.forEach(session => {
    if (session.student) {
      if (!sessionsByStudentMap.has(session.student)) {
        sessionsByStudentMap.set(session.student, []);
      }
      sessionsByStudentMap.get(session.student)!.push(session);
    }
  });

  // 3. Map progress snapshots with O(1) lookups
  return targetCourseStudents.map(student => {
    const studentSessions = sessionsByStudentMap.get(student.id) || [];
    const maxProgressMap = new Map<string, number>();

    studentSessions.forEach(s => {
      if (!s.list_key) return;
      const totalCount = s.total_count || s.all_item_ids?.length || 0;
      const masteredCount = s.mastered_count || s.mastered_item_ids?.length || 0;
      
      if (totalCount > 0) {
        const percentage = Math.round((masteredCount * 100) / totalCount);
        const currentMax = maxProgressMap.get(s.list_key) || 0;
        if (percentage > currentMax) {
          maxProgressMap.set(s.list_key, percentage);
        }
      }
    });

    // Format maps smoothly back into layout schemas
    const completedLists = Array.from(maxProgressMap.entries())
      .filter(([_, percentage]) => percentage > 0) // Hide lists with 0% progress
      .map(([listKey, percentage]) => ({
        list_key: listKey,
        pct: percentage
      }));

    return {
      id: student.id,
      initials: student.initials,
      web_id: student.web_id,
      // Fallback safely to current enrollments data references
      course_slugs: userStore.enrollments
        .filter(e => {
          const webId = e.student && typeof e.student === 'object' ? e.student.web_id : String(e.student);
          return webId === student.web_id;
        })
        .map(e => e.course?.slug || String(e.course)),
      completedLists
    };
  });
});

// PANEL B DIRECTORY ENGINE
const directoryMasterListKeys = computed<string[]>(() => {
  const keysSet = new Set<string>();
  rawSessionsPool.value.forEach(s => { if (s.list_key) keysSet.add(s.list_key); });
  rawProgressPool.value.forEach(p => { if (p.list_key) keysSet.add(p.list_key); });
  
  return Array.from(keysSet).sort((a, b) => 
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );
});

const filteredListKeysDirectory = computed<string[]>(() => {
  const query = searchListQuery.value?.trim().toLowerCase();
  if (!query) return directoryMasterListKeys.value;
  return directoryMasterListKeys.value.filter(k => k.toLowerCase().includes(query));
});

// Fetch detailed error analytics when a list row is clicked
watch(focusedListKey, async (newKey) => {
  if (!newKey) {
    listMetadataWrapper.value = { total_completions: 0, terms: [] };
    return;
  }

  loading.value = true;
  try {
    const response = await api.get('/vocab-workout-sessions/list-errors/', {
      params: { list_key: newKey }
    });
    listMetadataWrapper.value = response.data || { total_completions: 0, terms: [] };
  } catch (err) {
    console.error("Failed to fetch custom aggregated error maps summary data:", err);
    listMetadataWrapper.value = { total_completions: 0, terms: [] };
  } finally {
    loading.value = false;
  }
});

/**
 * 🌟 OPTIMIZED CORE REQUEST CONTEXT HANDLER
 * Removed redundant courses API calls, falling back entirely to userStore cache profiles.
 */
async function initializeDashboardContextData() {
  loading.value = true;
  try {
    // 🚀 Fetch game states in parallel, omitting redundant endpoints
    const [sessionsRes, progressRes] = await Promise.all([
      api.get('/vocab-workout-sessions/'),
      api.get('/vocab-workout-sessions/my-work/').catch(() => ({ data: { progress: [] } }))
    ]);

    rawSessionsPool.value = sessionsRes.data?.results || sessionsRes.data || [];
    rawProgressPool.value = progressRes.data?.progress || [];

    console.log("📊 Vocab Analytics Engine initialized successfully:", {
      sessionsPoolCount: rawSessionsPool.value.length,
      progressNodesTracked: rawProgressPool.value.length
    });

  } catch (err) {
    console.error("Dashboard context boot cycle exception caught:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    // Coordinate store hydration sequences smoothly before processing analytics
    await userStore.ensureUserLoaded();
    
    // Supplement fallback if enrollments array metadata isn't completely resolved
    if (!userStore.enrollments.length) {
      await userStore.fetchEnrollments();
    }
    
    await initializeDashboardContextData();
  } catch (err) {
    console.error("Dashboard mount execution sequence caught:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.vocab-header {
  background: linear-gradient(
    135deg,
    #1a4f55 0%,    /* deep teal */
    #3c9ea3 45%,   /* lighter teal highlight */
    #1a4f55 100%   /* deep teal again */
  );
  position: relative;
  overflow: hidden;
}

.vocab-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 25% 30%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 55%),
    radial-gradient(circle at 60% 80%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 50%);
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
.block-errors-tray {
  display: block;
  line-height: 1.6;
}
.font-mono {
  font-family: monospace !important;
}
.vertical-middle {
  vertical-align: middle !important;
}
</style>