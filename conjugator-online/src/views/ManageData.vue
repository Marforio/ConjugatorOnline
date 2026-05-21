<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-card class="pa-6 mb-6 data-header" elevation="4" rounded="xl">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-h4 font-weight-bold text-white">Student Data Dashboard</div>
          <div class="text-subtitle-1 text-white text-opacity-90 mt-1">
            View errors and achievements by class
          </div>
        </div>
        <v-icon size="56" class="text-white">mdi-chart-box</v-icon>
      </div>
    </v-card>

    <!-- Filters -->
    <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedCourse"
            :items="courseOptions"
            item-title="name"
            item-value="id"
            label="Filter by Course"
            prepend-icon="mdi-book-open-variant"
            variant="outlined"
            @update:model-value="fetchAllData"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            v-model="selectedStudent"
            :items="students"
            item-title="display_name"
            item-value="id"
            label="Filter by Student"
            prepend-icon="mdi-account"
            variant="outlined"
            clearable
            @update:model-value="onStudentFilterChange"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="32" class="mr-2">
                    <span class="text-white text-caption">{{ item.raw.initials }}</span>
                  </v-avatar>
                </template>
                <template v-slot:subtitle>
                  <span class="text-caption">{{ item.raw.web_id }}</span>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="dateRange"
            :items="dateRangeOptions"
            label="Date Range"
            prepend-icon="mdi-calendar-range"
            variant="outlined"
            @update:model-value="fetchAllData"
          />
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <!-- Errors Section -->
      <v-col cols="12" lg="6">
        <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="text-h5 font-weight-bold">
              Errors ({{ selectedCourseName }})
            </div>
            <v-icon size="32" color="error">mdi-alert-circle</v-icon>
          </div>

          <!-- View Toggle for COURSES vs Students -->
          <v-btn-toggle
            v-model="errorViewMode"
            mandatory
            variant="outlined"
            color="error"
            class="mb-4 w-100"
            @update:model-value="handleErrorViewToggle"
          >
            <v-btn value="COURSES" class="flex-grow-1" size="small">
              <v-icon start>mdi-google-classroom</v-icon>
              COURSES
            </v-btn>
            <v-btn value="STUDENTS" class="flex-grow-1" size="small">
              <v-icon start>mdi-account</v-icon>
              Students
            </v-btn>
          </v-btn-toggle>

          <!-- Loading State -->
          <v-progress-linear v-if="loadingErrors" indeterminate color="primary" class="mb-4" />

          <!-- Error Chart Presentation Structure -->
          <div v-else-if="hasChartData" class="mb-4">
            <canvas ref="errorChartCanvas" height="400"></canvas>
          </div>

          <!-- No Data Messages Contextualized by Active Selection state -->
          <div v-else class="text-center text-medium-emphasis pa-8">
            <span v-if="errorViewMode === 'STUDENTS' && !selectedStudent">
              Please select a specific student from the filters above to see individual breakdown data.
            </span>
            <span v-else>
              No error data available for this criteria.
            </span>
          </div>

          <!-- Class-only Details Layout Blocks -->
          <div v-if="errorViewMode === 'COURSES'">
            <v-divider class="my-4" />
            <div class="text-h6 mb-3">Error Details</div>
            <v-select
              v-model="selectedErrorCode"
              :items="errorDropdownItems"
              label="Select an error to view details"
              variant="outlined"
              clearable
            />

            <!-- Selected Error Details View -->
            <v-card v-if="selectedErrorObj" variant="outlined" class="pa-4 mt-4">
              <div class="text-subtitle-1 font-weight-bold mb-2">
                {{ selectedErrorObj.error_code }}
              </div>
              <div class="text-body-2 mb-3">
                <strong>Total occurrences:</strong> {{ selectedErrorObj.total_times }}
              </div>
              <div class="text-body-2 mb-2">
                <strong>Evidence samples:</strong>
              </div>
              <v-list density="compact" class="evidence-list">
                <v-list-item
                  v-for="(sample, i) in selectedErrorObj.evidence_samples.slice(0, 10)"
                  :key="i"
                  class="px-0"
                >
                  <template v-slot:prepend>
                    <v-icon size="small" class="mr-2">mdi-chevron-right</v-icon>
                  </template>
                  <span v-html="sample" class="text-body-2"></span>
                </v-list-item>
              </v-list>
            </v-card>

            <div v-else-if="selectedErrorCode" class="text-center text-medium-emphasis pa-4">
              Error details not found
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Achievements Section -->
      <v-col cols="12" lg="6">
        <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="text-h5 font-weight-bold">
              Recent Achievements ({{ selectedCourseName }})
            </div>
            <v-icon size="32" color="amber">mdi-trophy</v-icon>
          </div>

          <!-- Loading State -->
          <v-progress-linear v-if="loadingAchievements" indeterminate color="primary" class="mb-4" />

          <!-- View Toggle -->
          <v-btn-toggle
            v-model="achievementView"
            mandatory
            variant="outlined"
            color="primary"
            class="mb-4"
          >
            <v-btn value="by-student" size="small">
              <v-icon start>mdi-account-group</v-icon>
              By Student
            </v-btn>
            <v-btn value="by-achievement" size="small">
              <v-icon start>mdi-trophy</v-icon>
              By Achievement
            </v-btn>
          </v-btn-toggle>

          <!-- By Student View -->
          <div v-if="achievementView === 'by-student'" class="achievements-container">
            <div v-if="achievementsByStudent.length > 0">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel
                  v-for="studentData in achievementsByStudent"
                  :key="studentData.student_id"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-items-center w-100">
                      <v-avatar color="primary" size="32" class="mr-3">
                        <span class="text-white text-caption">
                          {{ studentData.initials }}
                        </span>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="text-body-1 font-weight-medium">
                          {{ studentData.initials }} ({{ studentData.web_id }})
                        </div>
                      </div>
                      <v-chip size="small" color="amber" variant="tonal">
                        {{ studentData.achievements.length }} achievements
                      </v-chip>
                    </div>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <v-list density="compact">
                      <v-list-item
                        v-for="achievement in studentData.achievements"
                        :key="achievement.id"
                        class="px-0"
                      >
                        <template v-slot:prepend>
                          <v-icon color="amber" size="20" class="mr-2">
                            mdi-trophy
                          </v-icon>
                        </template>
                        <v-list-item-title class="text-body-2">
                          {{ achievement.description }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-caption">
                          {{ formatDate(achievement.achieved_on) }}
                          <v-chip
                            v-if="achievement.manually_created"
                            size="x-small"
                            color="info"
                            variant="tonal"
                            class="ml-2"
                          >
                            Manual
                          </v-chip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <div v-else class="text-center text-medium-emphasis pa-8">
              No achievements found for this course
            </div>
          </div>

          <!-- By Achievement View -->
          <div v-else class="achievements-container">
            <v-select
              v-model="selectedAchievementType"
              :items="achievementTypeOptions"
              label="Select achievement type"
              variant="outlined"
              class="mb-4"
              clearable
            />

            <v-card v-if="selectedAchievementType" variant="outlined" class="pa-4">
              <div class="text-subtitle-1 font-weight-bold mb-3">
                {{ selectedAchievementType }}
              </div>
              <div class="text-body-2 mb-3">
                <strong>Total students:</strong> {{ studentsWithSelectedAchievement.length }}
              </div>

              <v-list density="compact">
                <v-list-item
                  v-for="student in studentsWithSelectedAchievement"
                  :key="student.student_id"
                  class="px-0"
                >
                  <template v-slot:prepend>
                    <v-avatar color="primary" size="32" class="mr-2">
                      <span class="text-white text-caption">{{ student.initials }}</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-body-2">
                    {{ student.initials }} ({{ student.web_id }})
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    Achieved {{ formatDate(student.achieved_on) }}
                    <v-chip
                      v-if="student.manually_created"
                      size="x-small"
                      color="info"
                      variant="tonal"
                      class="ml-2"
                    >
                      Manual
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>

            <div v-else class="text-center text-medium-emphasis pa-4">
              Select an achievement type to view students who earned it
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Summary Stats -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2" rounded="lg">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis">Total Errors</div>
              <div class="text-h4 font-weight-bold">{{ totalErrorOccurrences }}</div>
            </div>
            <v-icon size="40" color="error">mdi-alert-circle</v-icon>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2" rounded="lg">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis">Total Sessions</div>
              <div class="text-h4 font-weight-bold">{{ totalSessions }}</div>
            </div>
            <v-icon size="40" color="info">mdi-play-circle</v-icon>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2" rounded="lg">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis">Total Achievements</div>
              <div class="text-h4 font-weight-bold">{{ totalAchievements }}</div>
            </div>
            <v-icon size="40" color="amber">mdi-trophy</v-icon>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2" rounded="lg">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis">Active Students</div>
              <div class="text-h4 font-weight-bold">{{ activeStudentCount }}</div>
            </div>
            <v-icon size="40" color="success">mdi-account-check</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Activity Breakdown -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="pa-6" elevation="2" rounded="lg">
          <div class="text-h6 mb-4">Activity Breakdown</div>
          <v-row>
            <v-col cols="6" sm="4" md="2">
              <div class="text-center">
                <v-icon size="32" color="blue">mdi-controller</v-icon>
                <div class="text-h5 font-weight-bold mt-2">{{ activityBreakdown.conjugation }}</div>
                <div class="text-caption text-medium-emphasis">Conjugation</div>
              </div>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <div class="text-center">
                <v-icon size="32" color="purple">mdi-gamepad-variant</v-icon>
                <div class="text-h5 font-weight-bold mt-2">{{ activityBreakdown.other_game }}</div>
                <div class="text-caption text-medium-emphasis">Games</div>
              </div>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <div class="text-center">
                <v-icon size="32" color="orange">mdi-weight-lifter</v-icon>
                <div class="text-h5 font-weight-bold mt-2">{{ activityBreakdown.exercise }}</div>
                <div class="text-caption text-medium-emphasis">Exercises</div>
              </div>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <div class="text-center">
                <v-icon size="32" color="green">mdi-card-text</v-icon>
                <div class="text-h5 font-weight-bold mt-2">{{ activityBreakdown.vocab_workout }}</div>
                <div class="text-caption text-medium-emphasis">Vocab</div>
              </div>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <div class="text-center">
                <v-icon size="32" color="amber">mdi-trophy</v-icon>
                <div class="text-h5 font-weight-bold mt-2">{{ activityBreakdown.achievement }}</div>
                <div class="text-caption text-medium-emphasis">Achievements</div>
              </div>
            </v-col>
            <v-col cols="6" sm="4" md="2">
              <div class="text-center">
                <v-icon size="32" color="teal">mdi-clipboard-check</v-icon>
                <div class="text-h5 font-weight-bold mt-2">{{ activityBreakdown.workout_drill }}</div>
                <div class="text-caption text-medium-emphasis">Drills</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import api from '@/axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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

interface ErrorData {
  error_code: string;
  total_times: number;
  evidence_samples: string[];
  course?: string;
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
}

interface StudentWithAchievement {
  student_id: number;
  initials: string;
  web_id: string;
  achieved_on: string;
  manually_created: boolean;
}

interface Activity {
  id: number;
  student: number;
  student_initials: string;
  student_web_id: string;
  activity_type: string;
  activity_name: string;
  description: string;
  timestamp: string;
  course_slug: string | null;
  details: Record<string, any>;
}

const loadingErrors = ref(false);
const loadingAchievements = ref(false);
const loadingActivity = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

const students = ref<Student[]>([]);
const courseOptions = ref<{ id: string; name: string }[]>([]);
const selectedCourse = ref<string>('all');
const selectedStudent = ref<number | null>(null);
const dateRange = ref('all');
const dateRangeOptions = [
  { title: 'All Time', value: 'all' },
  { title: 'Last 7 Days', value: '7days' },
  { title: 'Last 30 Days', value: '30days' },
  { title: 'Last 90 Days', value: '90days' },
];

const errorData = ref<ErrorData[]>([]);
const studentErrorData = ref<ErrorData[]>([]); // Separated list container for specific user records
const errorViewMode = ref<'COURSES' | 'STUDENTS'>('COURSES');

const achievements = ref<Achievement[]>([]);
const activities = ref<Activity[]>([]);
const selectedErrorCode = ref<string | null>(null);

const achievementView = ref<'by-student' | 'by-achievement'>('by-student');
const selectedAchievementType = ref<string | null>(null);

const errorChartCanvas = ref<HTMLCanvasElement | null>(null);
let errorChart: Chart | null = null;

const selectedCourseName = computed(() => {
  if (selectedCourse.value === 'all') return 'All Courses';
  const found = courseOptions.value.find(c => c.id === selectedCourse.value);
  return found ? found.name : 'Unknown Course';
});

// Computed properties mapping context lists safely depending on the current toggle state
const currentActiveErrors = computed(() => {
  return errorViewMode.value === 'COURSES' ? errorData.value : studentErrorData.value;
});

const topErrors = computed(() => {
  return [...currentActiveErrors.value]
    .sort((a, b) => b.total_times - a.total_times)
    .slice(0, 20);
});

const hasChartData = computed(() => {
  if (errorViewMode.value === 'STUDENTS') {
    return !!selectedStudent.value && topErrors.value.length > 0;
  }
  return topErrors.value.length > 0;
});

const errorDropdownItems = computed(() => {
  return errorData.value
    .sort((a, b) => b.total_times - a.total_times)
    .map(e => ({
      title: `${e.error_code} — ${e.total_times} occurrences`,
      value: e.error_code,
    }));
});

const selectedErrorObj = computed(() => {
  return errorData.value.find(e => e.error_code === selectedErrorCode.value) || null;
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

const achievementsByStudent = computed(() => {
  const grouped: Record<number, StudentAchievements> = {};
  filteredAchievements.value.forEach(ach => {
    if (!grouped[ach.student]) {
      grouped[ach.student] = {
        student_id: ach.student,
        initials: ach.student_initials || `Student ${ach.student}`,
        web_id: ach.student_web_id || '',
        achievements: [],
      };
    }
    grouped[ach.student].achievements.push(ach);
  });
  return Object.values(grouped).sort((a, b) => b.achievements.length - a.achievements.length);
});

const achievementTypeOptions = computed(() => {
  const types = new Set<string>();
  filteredAchievements.value.forEach(a => { types.add(a.description); });
  return Array.from(types).sort().map(t => ({ title: t, value: t }));
});

const studentsWithSelectedAchievement = computed(() => {
  if (!selectedAchievementType.value) return [];
  const results: StudentWithAchievement[] = [];
  filteredAchievements.value.forEach(a => {
    if (a.description === selectedAchievementType.value) {
      results.push({
        student_id: a.student,
        initials: a.student_initials || `Student ${a.student}`,
        web_id: a.student_web_id || '',
        achieved_on: a.achieved_on,
        manually_created: a.manually_created,
      });
    }
  });
  return results.sort((a, b) => new Date(b.achieved_on).getTime() - new Date(a.achieved_on).getTime());
});

const totalErrorOccurrences = computed(() => {
  return currentActiveErrors.value.reduce((sum, e) => sum + e.total_times, 0);
});

const uniqueErrorCount = computed(() => {
  return currentActiveErrors.value.length;
});

const totalAchievements = computed(() => filteredAchievements.value.length);
const activeStudentCount = computed(() => achievementsByStudent.value.length);

const totalSessions = computed(() => {
  return activities.value.filter(a => 
    ['conjugation', 'other_game', 'exercise', 'vocab_workout'].includes(a.activity_type)
  ).length;
});

const activityBreakdown = computed(() => {
  const breakdown: Record<string, number> = {
    conjugation: 0,
    other_game: 0,
    exercise: 0,
    vocab_workout: 0,
    achievement: 0,
    workout_drill: 0,
  };
  activities.value.forEach(a => {
    if (breakdown.hasOwnProperty(a.activity_type)) {
      breakdown[a.activity_type]++;
    }
  });
  return breakdown;
});

async function fetchStudents() {
  try {
    const response = await api.get<Student[]>('/students/');
    students.value = response.data.map(s => ({
      ...s,
      display_name: `${s.initials} (${s.web_id})`,
    }));
  } catch (error) {
    console.error('Failed to fetch students:', error);
  }
}

async function fetchCourses() {
  try {
    const response = await api.get<Course[]>('/courses/');
    courseOptions.value = [
      { id: 'all', name: 'All Courses' },
      ...response.data.map(c => ({ id: c.slug, name: c.slug })),
    ];
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }
}

async function fetchErrorData() {
  loadingErrors.value = true;
  try {
    const params: any = {};
    
    // 1. Apply the course filter if one is selected
    if (selectedCourse.value !== 'all') {
      params.course = selectedCourse.value;
    }

    // 2. If looking at a student profile, attach their ID to the API request
    if (errorViewMode.value === 'STUDENTS') {
      if (!selectedStudent.value) {
        // If no student is chosen yet, clear out the display data and stop
        studentErrorData.value = [];
        await nextTick();
        renderErrorChart();
        return;
      }
      params.student = selectedStudent.value;
    }

    // 3. Make the clean API call using your new Django parameters
    const response = await api.get<ErrorData[]>('/admin-error-summary/summary/', { params });
    const raw = response.data || [];

    // 4. Distribute the incoming database response to the correct tracking array
    if (errorViewMode.value === 'STUDENTS') {
      studentErrorData.value = raw;
    } else {
      // If viewing CLASSES across All Courses, aggregate matching error codes cleanly
      if (selectedCourse.value === 'all') {
        const grouped: Record<string, ErrorData> = {};
        raw.forEach(e => {
          if (!grouped[e.error_code]) {
            grouped[e.error_code] = {
              error_code: e.error_code,
              total_times: 0,
              evidence_samples: [],
            };
          }
          grouped[e.error_code].total_times += e.total_times;
          grouped[e.error_code].evidence_samples.push(...e.evidence_samples);
        });
        errorData.value = Object.values(grouped);
      } else {
        errorData.value = raw;
      }
    }

    // 5. Trigger the visual interface refresh updates seamlessly
    await nextTick();
    renderErrorChart();
  } catch (error) {
    console.error('Failed to fetch error data:', error);
    showSnackbar('Failed to load error data', 'error');
  } finally {
    loadingErrors.value = false;
  }
}

async function fetchStudentSpecificErrors() {
  if (!selectedStudent.value) {
    studentErrorData.value = [];
    renderErrorChart();
    return;
  }

  loadingErrors.value = true;
  try {
    const params: any = { student: selectedStudent.value };
    if (selectedCourse.value !== 'all') {
      params.course = selectedCourse.value;
    }

    // Hits your modified Django viewset action directly!
    const response = await api.get<ErrorData[]>('/admin-error-summary/summary/', { params });
    studentErrorData.value = response.data || [];

    await nextTick();
    renderErrorChart();
  } catch (error) {
    console.error('Failed to fetch student error records:', error);
  } finally {
    loadingErrors.value = false;
  }
}

async function fetchAchievements() {
  loadingAchievements.value = true;
  try {
    const params: any = { limit: 1000 };
    let studentIds: number[] = [];
    
    if (selectedCourse.value !== 'all') {
      const enrollmentResponse = await api.get('/enrollment/', {
        params: { course: selectedCourse.value }
      });
      studentIds = enrollmentResponse.data.map((e: any) => e.student?.id || e.student);
    }

    const response = await api.get('/achievements/', { params });
    const responseData: any = response.data;
    let data = responseData.results || responseData;
    
    if (Array.isArray(data)) {
      if (selectedCourse.value !== 'all' && studentIds.length > 0) {
        data = data.filter((ach: any) => studentIds.includes(ach.student));
      }
      if (selectedStudent.value) {
        data = data.filter((ach: any) => ach.student === selectedStudent.value);
      }
      
      const studentsResponse = await api.get('/students/');
      const studentsMap = new Map<number, { initials: string; web_id: string }>();
      studentsResponse.data.forEach((s: any) => {
        studentsMap.set(s.id, { initials: s.initials || '', web_id: s.web_id || '' });
      });
      
      const enrichedAchievements: Achievement[] = data.map((ach: any) => {
        const studentInfo = studentsMap.get(ach.student);
        return {
          id: ach.id,
          student: ach.student,
          student_initials: studentInfo ? studentInfo.initials : `Student ${ach.student}`,
          student_web_id: studentInfo ? studentInfo.web_id : '',
          description: ach.description,
          achieved_on: ach.achieved_on,
          manually_created: ach.manually_created,
          criteria_key: ach.criteria_key,
        };
      });

      achievements.value = enrichedAchievements.sort(
        (a, b) => new Date(b.achieved_on).getTime() - new Date(a.achieved_on).getTime()
      );
    } else {
      achievements.value = [];
    }
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
  } finally {
    loadingAchievements.value = false;
  }
}

async function fetchActivityData() {
  loadingActivity.value = true;
  try {
    const params: any = { limit: 500 };
    if (selectedCourse.value !== 'all') params.course = selectedCourse.value;
    if (selectedStudent.value) params.student = selectedStudent.value;
    if (dateRange.value !== 'all') {
      params.days = dateRange.value === '7days' ? 7 : dateRange.value === '30days' ? 30 : 90;
    }

    const response = await api.get<Activity[]>('/student-activities/', { params });
    activities.value = response.data;
  } catch (error) {
    console.error('Failed to fetch activity data:', error);
  } finally {
    loadingActivity.value = false;
  }
}

function renderErrorChart() {
  if (!errorChartCanvas.value || !hasChartData.value) {
    if (errorChart) {
      errorChart.destroy();
      errorChart = null;
    }
    return;
  }

  if (errorChart) {
    errorChart.destroy();
  }

  const ctx = errorChartCanvas.value.getContext('2d');
  if (!ctx) return;

  const currentToggleColor = errorViewMode.value === 'COURSES' 
    ? { fill: 'rgba(244, 67, 54, 0.6)', border: 'rgba(244, 67, 54, 1)' }
    : { fill: 'rgba(33, 150, 243, 0.6)', border: 'rgba(33, 150, 243, 1)' };

  errorChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: topErrors.value.map(e => e.error_code),
      datasets: [
        {
          label: errorViewMode.value === 'COURSES' ? 'Class Occurrences' : 'Student Occurrences',
          data: topErrors.value.map(e => e.total_times),
          backgroundColor: currentToggleColor.fill,
          borderColor: currentToggleColor.border,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Occurrences: ${context.parsed.y}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    },
  });
}

async function fetchAllData() {
  await Promise.all([
    fetchErrorData(),
    fetchAchievements(),
    fetchActivityData(),
  ]);
}

// Fired whenever the standalone autocomplete filter selection changes
async function onStudentFilterChange() {
  if (errorViewMode.value === 'STUDENTS') {
    await fetchStudentSpecificErrors();
  }
  await Promise.all([
    fetchAchievements(),
    fetchActivityData()
  ]);
}

// React to view adjustments gracefully and cycle UI renders seamlessly
async function handleErrorViewToggle(mode: 'COURSES' | 'STUDENTS') {
  if (mode === 'STUDENTS') {
    await fetchStudentSpecificErrors();
  } else {
    await nextTick();
    renderErrorChart();
  }
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

function showSnackbar(message: string, color: string = 'success') {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

watch(errorChartCanvas, () => {
  if (errorChartCanvas.value && hasChartData.value) {
    nextTick(() => renderErrorChart());
  }
});

onMounted(async () => {
  await fetchStudents();
  await fetchCourses();
  await fetchAllData();
});
</script>

<style scoped>
.data-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.data-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-10deg);
  pointer-events: none;
}

.data-header > * {
  position: relative;
}

.evidence-list {
  max-height: 300px;
  overflow-y: auto;
}

.achievements-container {
  max-height: 600px;
  overflow-y: auto;
}

canvas {
  max-height: 400px;
}
</style>