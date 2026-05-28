<template>
  <v-container fluid class="pa-6 text-slate-800 bg-slate-50 min-vh-100">
    <v-card class="pa-6 mb-6 data-header text-white shadow-sm" rounded="xl">
      <div class="d-flex align-center justify-space-between flex-wrap ga-4">
        <div>
          <div class="text-h4 font-weight-bold text-white">Student Achievements Workspace</div>
          <div class="text-subtitle-1 opacity-90 mt-1">
            Audit obtained competence milestones, monitor classroom cohorts, and review cross-session vocabulary retention tallies.
          </div>
        </div>
        <v-avatar color="white" variant="tonal" size="56">
          <v-icon size="32">mdi-trophy-variant-outline</v-icon>
        </v-avatar>
      </div>
    </v-card>

    <v-card class="pa-5 mb-6 border bg-white shadow-xs" rounded="lg" elevation="0">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="selectedStudent"
            :items="filteredStudentsDropdown"
            item-title="display_name"
            item-value="id"
            label="Focus Singular Student"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            @update:model-value="onStudentFilterChange"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar color="teal-lighten-5" size="32" class="mr-2 text-teal-darken-3 text-caption font-weight-black">
                    {{ item.raw.initials }}
                  </v-avatar>
                </template>
                <template v-slot:subtitle>
                  <span class="text-caption text-slate-400">{{ item.raw.web_id }}</span>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="dateRange"
            :items="dateRangeOptions"
            label="Temporal Date Range"
            prepend-inner-icon="mdi-calendar-range"
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="fetchAchievements"
          />
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <v-col cols="12">
        <v-card class="border bg-white" rounded="lg" elevation="0">
          <v-tabs v-model="achievementView" color="teal-darken-1" align-tabs="start" class="border-b bg-slate-50">
            <v-tab value="by-student" class="text-none font-weight-bold">
              <v-icon start>mdi-account-search-outline</v-icon> Inspection Hub (Per Student)
            </v-tab>
            <v-tab value="by-achievement" class="text-none font-weight-bold">
              <v-icon start>mdi-medal-outline</v-icon> Competence Matrix Lookup (Per Achievement)
            </v-tab>
          </v-tabs>

          <v-progress-linear v-if="loadingAchievements" indeterminate color="teal" />

          <v-window v-model="achievementView" class="pa-4 flex-grow-1">
            
            <v-window-item value="by-student">
              <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-2">
                Search or Select Student to View Profile Achievements
              </div>
              <v-row class="mb-4" dense>
                <v-col cols="12" md="6" lg="4">
                  <v-autocomplete
                    v-model="searchStudentQueryId"
                    :items="filteredStudentsDropdown"
                    item-title="display_name"
                    item-value="id"
                    placeholder="Type student name or Web ID..."
                    prepend-inner-icon="mdi-account-search"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                  />
                </v-col>
              </v-row>

              <div v-if="targetedStudentProfile" class="mt-4">
                <v-card class="border rounded-xl bg-slate-50 overflow-hidden" elevation="0">
                  <div class="pa-4 bg-white border-b d-flex align-center justify-space-between flex-wrap ga-3">
                    <div class="d-flex align-center">
                      <v-avatar color="teal-darken-1" size="40" class="mr-3 font-weight-black text-white text-body-2">
                        {{ targetedStudentProfile.initials }}
                      </v-avatar>
                      <div>
                        <div class="text-h6 font-weight-bold text-slate-900 line-height-tight">
                          {{ targetedStudentProfile.initials }}
                        </div>
                        <div class="text-caption text-slate-500">System Identifier: {{ targetedStudentProfile.web_id }}</div>
                      </div>
                    </div>

                    <div class="d-flex align-center ga-2 flex-wrap">
                      <v-chip size="small" color="indigo-darken-1" variant="flat" class="text-white font-weight-bold px-3">
                        Vocabulary 1x Run Complete: {{ targetedStudentProfile.vocab1xCount }}
                      </v-chip>
                      <v-chip size="small" color="purple-darken-1" variant="flat" class="text-white font-weight-bold px-3">
                        Vocabulary 3x Run Mastery: {{ targetedStudentProfile.vocab3xCount }}
                      </v-chip>
                      <v-chip size="small" color="amber-darken-3" variant="flat" class="text-white font-weight-black px-3">
                        Total Earned Milestones: {{ targetedStudentProfile.totalCount }}
                      </v-chip>
                    </div>
                  </div>

                  <div class="pa-4">
                    <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-3">
                      Chronological Milestone Activity Stream Log
                    </div>
                    
                    <v-list density="compact" class="bg-transparent py-0 ga-2 d-flex flex-column item-scroll-container">
                      <v-list-item
                        v-for="achievement in targetedStudentProfile.achievements"
                        :key="achievement.id"
                        class="border rounded-xl bg-white pa-3 shadow-xs-complete"
                      >
                        <template v-slot:prepend>
                          <v-avatar color="amber-lighten-5" size="32" class="mr-3">
                            <v-icon color="amber-darken-2" size="18">mdi-trophy-outline</v-icon>
                          </v-avatar>
                        </template>
                        
                        <v-list-item-title class="text-body-2 font-weight-bold text-slate-800">
                          {{ achievement.description }}
                        </v-list-item-title>
                        
                        <v-list-item-subtitle class="text-caption text-slate-400 mt-0.5">
                          Obtained: {{ formatDate(achievement.achieved_on) }}
                          <v-chip v-if="achievement.manually_created" size="x-small" color="info" variant="flat" class="text-white ml-2">
                            Manual Override
                          </v-chip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-card>
              </div>

              <div v-else class="text-center text-slate-400 py-12 border border-dashed rounded-xl bg-white mt-4">
                <v-icon size="48" class="text-slate-200 mb-2">mdi-account-question-outline</v-icon>
                <div class="text-body-2">Please select an individual student profile using the search bar above to audit earned accomplishments.</div>
              </div>
            </v-window-item>

            <v-window-item value="by-achievement">
              <v-row class="fill-height min-vh-50" dense>
                <v-col cols="12" md="5" class="border-r pr-md-4">
                  <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-2">Available Class Milestones</div>
                  <v-list class="bg-transparent py-0 ga-1 d-flex flex-column list-scroll-box">
                    <v-list-item
                      v-for="opt in achievementTypeOptions"
                      :key="opt.value"
                      class="border rounded-xl pa-3 cursor-pointer alignment-node"
                      :class="selectedAchievementType === opt.value ? 'bg-teal-light text-teal-darken-4 border-teal-soft' : 'bg-white'"
                      @click="selectedAchievementType = opt.value"
                    >
                      <div class="d-flex align-center justify-space-between w-100 ga-2">
                        <span class="text-body-2 font-weight-medium text-slate-800 line-clamp-2">{{ opt.title }}</span>
                        <v-chip size="x-small" :color="selectedAchievementType === opt.value ? 'teal' : 'slate-500'" variant="flat" class="text-white font-weight-bold">
                          {{ opt.globalCount }}
                        </v-chip>
                      </div>
                    </v-list-item>
                  </v-list>
                </v-col>

                <v-col cols="12" md="7" class="pl-md-4 mt-4 mt-md-0">
                  <div class="text-caption font-weight-bold text-slate-500 uppercase tracking-wider mb-2">Awarded Students Roster</div>
                  
                  <div v-if="selectedAchievementType">
                    <div class="bg-slate-50 border rounded-xl pa-4 mb-3 shadow-xs">
                      <div class="text-subtitle-2 font-weight-bold text-slate-700 line-height-tight mb-2">{{ selectedAchievementType }}</div>
                      
                      <v-text-field
                        v-model="searchInternalHoldersQuery"
                        placeholder="Filter awardee list by name or initials..."
                        prepend-inner-icon="mdi-account-filter-outline"
                        variant="outlined"
                        density="compact"
                        bg-color="white"
                        clearable
                        hide-details
                        class="text-body-2"
                      />
                    </div>

                    <v-list v-if="studentsWithSelectedAchievement.length > 0" class="bg-transparent py-0 ga-1 d-flex flex-column list-scroll-box">
                      <v-list-item
                        v-for="student in studentsWithSelectedAchievement"
                        :key="student.student_id"
                        class="border rounded-xl bg-white pa-3 shadow-xs-complete"
                      >
                        <template v-slot:prepend>
                          <v-avatar color="teal-lighten-5" size="32" class="mr-3 font-weight-black text-teal-darken-3 text-caption">
                            {{ student.initials }}
                          </v-avatar>
                        </template>
                        <v-list-item-title class="text-body-2 font-weight-bold text-slate-800">
                          {{ student.initials }} <span class="text-caption text-slate-400">({{ student.web_id }})</span>
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-caption text-slate-400">
                          Certified on: {{ formatDate(student.achieved_on) }}
                          <v-chip v-if="student.manually_created" size="x-small" color="info" variant="flat" class="text-white ml-2">Manual</v-chip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                    
                    <div v-else class="text-center text-slate-400 py-8 bg-white border border-dashed rounded-xl">
                      No matching student name matches found holding this achievement.
                    </div>
                  </div>
                  
                  <div v-else class="text-center text-slate-400 py-12 border border-dashed rounded-xl bg-white fill-height d-flex flex-column align-center justify-center">
                    <v-icon size="48" class="text-slate-200 mb-2">mdi-gesture-tap</v-icon>
                    <div class="text-body-2">Select an action milestone descriptor from the left column to populate cohort data.</div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" sm="6">
        <v-card class="pa-4 border bg-white shadow-xs d-flex align-center justify-space-between" rounded="lg" elevation="0">
          <div>
            <div class="text-caption text-slate-500 font-weight-bold uppercase tracking-wider">Total Aggregated System Milestones</div>
            <div class="text-h4 font-weight-black text-slate-900 mt-1">{{ totalAchievements }}</div>
          </div>
          <v-avatar color="amber-lighten-5" size="48">
            <v-icon color="amber-darken-2" size="28">mdi-trophy-outline</v-icon>
          </v-avatar>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card class="pa-4 border bg-white shadow-xs d-flex align-center justify-space-between" rounded="lg" elevation="0">
          <div>
            <div class="text-caption text-slate-500 font-weight-bold uppercase tracking-wider">Active Certified Roster Footprint</div>
            <div class="text-h4 font-weight-black text-slate-900 mt-1">{{ activeStudentCount }}</div>
          </div>
          <v-avatar color="teal-lighten-5" size="48">
            <v-icon color="teal-darken-2" size="28">mdi-account-badge-outline</v-icon>
          </v-avatar>
        </v-card>
      </v-col>
    </v-row>
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

interface Student {
  id: number;
  initials: string;
  web_id: string;
  display_name?: string;
}

interface Achievement {
  id: number;
  student: number;
  student_initials?: string;
  student_web_id?: string;
  description: string;
  achieved_on: string;
  manually_created: boolean;
  criteria_key: string;
}

interface StudentAchievements {
  student_id: number;
  initials: string;
  web_id: string;
  achievements: Achievement[];
  totalCount: number;
  vocab1xCount: number;
  vocab3xCount: number;
}

interface StudentWithAchievement {
  student_id: number;
  initials: string;
  web_id: string;
  achieved_on: string;
  manually_created: boolean;
}

const userStore = useUserStore();

const loadingAchievements = ref(false);
const courseOptions = ref<{ id: string; name: string }[]>([]);
const selectedCourse = ref<string>('all');
const selectedStudent = ref<number | null>(null);

// Search Query Variables
const searchStudentQueryId = ref<number | null>(null); // 🌟 Tab A: Dedicated Single Student Inspection Tracker
const searchInternalHoldersQuery = ref('');            // 🌟 Tab B: Text Filter for current achievement holders
const dateRange = ref('all');

const dateRangeOptions = [
  { title: 'All Time Records', value: 'all' },
  { title: 'Last 7 Days', value: '7days' },
  { title: 'Last 30 Days', value: '30days' },
  { title: 'Last 90 Days', value: '90days' },
];

const achievements = ref<Achievement[]>([]);
const achievementView = ref<'by-student' | 'by-achievement'>('by-student');
const selectedAchievementType = ref<string | null>(null);

// Cross-wire top global search field with inside tab selector
watch(selectedStudent, (newVal) => {
  searchStudentQueryId.value = newVal;
});
watch(searchStudentQueryId, (newVal) => {
  selectedStudent.value = newVal;
  if (newVal) fetchAchievements();
});

const filteredStudentsDropdown = computed<Student[]>(() => {
  const sourceList = userStore.isStaff ? userStore.teacherRoster : [];
  return sourceList.map(s => ({
    id: s.id,
    initials: s.initials,
    web_id: s.web_id,
    display_name: `${s.initials} (${s.web_id})`
  }));
});

const filteredAchievements = computed(() => {
  let filtered = [...achievements.value];
  if (dateRange.value !== 'all') {
    const now = new Date();
    const daysAgo = dateRange.value === '7days' ? 7 : dateRange.value === '30days' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    filtered = filtered.filter(a => new Date(a.achieved_on) >= cutoffDate);
  }
  return filtered;
});

function checkIsVocab3x(ach: Achievement): boolean {
  const key = (ach.criteria_key || '').toLowerCase();
  const desc = (ach.description || '').toLowerCase();
  const has3xMarkers = desc.includes('three times') || desc.includes('x 3') || desc.includes('x3');
  const isVocab = key.startsWith('vw_') || desc.includes('vocab') || desc.includes('vocabulary');
  return isVocab && has3xMarkers;
}

function checkIsVocab1x(ach: Achievement): boolean {
  const key = (ach.criteria_key || '').toLowerCase();
  const desc = (ach.description || '').toLowerCase();
  const isVocab = key.startsWith('vw_') || desc.includes('vocab') || desc.includes('vocabulary');
  return isVocab && !checkIsVocab3x(ach);
}

// 🌟 REWORKED: High-Fidelity Focused Inspection Compute (No bulk mapping array bloat)
const targetedStudentProfile = computed<StudentAchievements | null>(() => {
  if (!searchStudentQueryId.value) return null;
  
  const studentRecords = filteredAchievements.value.filter(a => Number(a.student) === Number(searchStudentQueryId.value));
  if (studentRecords.length === 0) {
    const referenceMeta = filteredStudentsDropdown.value.find(s => s.id === searchStudentQueryId.value);
    return {
      student_id: searchStudentQueryId.value,
      initials: referenceMeta?.initials || 'ST',
      web_id: referenceMeta?.web_id || 'Unknown',
      achievements: [],
      totalCount: 0,
      vocab1xCount: 0,
      vocab3xCount: 0
    };
  }

  const base = {
    student_id: studentRecords[0].student,
    initials: studentRecords[0].student_initials || 'ST',
    web_id: studentRecords[0].student_web_id || '',
    achievements: [...studentRecords].sort((a, b) => new Date(b.achieved_on).getTime() - new Date(a.achieved_on).getTime()),
    totalCount: studentRecords.length,
    vocab1xCount: studentRecords.filter(checkIsVocab1x).length,
    vocab3xCount: studentRecords.filter(checkIsVocab3x).length
  };

  return base;
});

// Structural helper configuration mapping used exclusively for general overview counters layout references
const achievementsByStudent = computed(() => {
  const grouped: Record<number, any> = {};
  filteredAchievements.value.forEach(ach => {
    if (!grouped[ach.student]) grouped[ach.student] = true;
  });
  return Object.keys(grouped);
});

const achievementTypeOptions = computed(() => {
  const counts: Record<string, number> = {};
  filteredAchievements.value.forEach(a => {
    if (a.description) counts[a.description] = (counts[a.description] || 0) + 1;
  });
  return Object.keys(counts).sort().map(t => ({
    title: t,
    value: t,
    globalCount: counts[t]
  }));
});

// 🌟 REWORKED: Pull holders checking against inner search string query criteria parameters sets
const studentsWithSelectedAchievement = computed(() => {
  if (!selectedAchievementType.value) return [];
  const query = searchInternalHoldersQuery.value?.trim().toLowerCase();
  const results: StudentWithAchievement[] = [];
  
  filteredAchievements.value.forEach(a => {
    if (a.description === selectedAchievementType.value) {
      const initials = a.student_initials || `Student ${a.student}`;
      const webId = a.student_web_id || '';
      
      const matchesSearch = !query || 
                            initials.toLowerCase().includes(query) || 
                            webId.toLowerCase().includes(query);
                            
      if (matchesSearch) {
        results.push({
          student_id: a.student,
          initials: initials,
          web_id: webId,
          achieved_on: a.achieved_on,
          manually_created: a.manually_created,
        });
      }
    }
  });
  return results.sort((a, b) => new Date(b.achieved_on).getTime() - new Date(a.achieved_on).getTime());
});

const totalAchievements = computed(() => filteredAchievements.value.length);
const activeStudentCount = computed(() => achievementsByStudent.value.length);

async function fetchCourses() {
  try {
    const response = await api.get<Course[]>('/courses/');
    courseOptions.value = [
      { id: 'all', name: 'All Class Courses' },
      ...response.data.map(c => ({ id: c.slug, name: c.slug })),
    ];
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }
}

async function fetchAchievements() {
  loadingAchievements.value = true;
  try {
    const params: any = { limit: 1000 };
    if (selectedStudent.value) {
      params.student = selectedStudent.value;
    }
    const response = await api.get('/achievements/', { params });
    const responseData: any = response.data;
    const data = responseData.results || responseData;
    
    if (Array.isArray(data)) {
      achievements.value = data.map((ach: any) => ({
        id: ach.id,
        student: ach.student,
        student_initials: ach.student_initials || `Student ${ach.student}`,
        student_web_id: ach.student_web_id || '',
        description: ach.description,
        achieved_on: ach.achieved_on,
        manually_created: ach.manually_created,
        criteria_key: ach.criteria_key,
      })).sort((a, b) => new Date(b.achieved_on).getTime() - new Date(a.achieved_on).getTime());
    } else {
      achievements.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    achievements.value = [];
  } finally {
    loadingAchievements.value = false;
  }
}

async function onStudentFilterChange() {
  await fetchAchievements();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

onMounted(async () => {
  if (userStore.isStaff && userStore.teacherRoster.length === 0) {
    await userStore.fetchTeacherRoster();
  }
  await fetchCourses();
  await fetchAchievements();
});
</script>

<style scoped>
.data-header {
  background: linear-gradient(135deg, #0f172a 0%, #0f766e 100%);
  position: relative;
  overflow: hidden;
}
.data-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-10deg);
  pointer-events: none;
}
.item-scroll-container {
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
}
.list-scroll-box {
  max-height: 520px;
  overflow-y: auto;
  padding-right: 4px;
}
.border-b { border-bottom: 1px solid #f1f5f9 !important; }
.border-r { border-right: 1px solid #e2e8f0 !important; }
.bg-teal-light { background-color: #f0fdfa !important; }
.border-teal-soft { border-color: #99f6e4 !important; }
.shadow-xs-complete { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02) !important; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-height-tight { line-height: 1.3; }
.min-vh-50 { min-height: 52vh; }
</style>