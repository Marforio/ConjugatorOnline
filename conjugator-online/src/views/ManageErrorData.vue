<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-card class="pa-6 mb-6 data-header" elevation="4" rounded="xl">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-h4 font-weight-bold text-white">Student Error Dashboard</div>
          <div class="text-subtitle-1 text-white text-opacity-90 mt-1">
            View errors, breakdown statistics, and generate progress reports by class
          </div>
        </div>
        <div class="d-flex align-center gap-4">
          <!-- New navigation button to go to manage-feedback -->
          <v-btn
            color="white"
            variant="elevated"
            class="text-primary font-weight-bold"
            prepend-icon="mdi-comment-text-multiple"
            :to="{ name: 'manage-feedback' }"
          >
            Manage Feedback
          </v-btn>
          <v-icon size="56" class="text-white">mdi-chart-box</v-icon>
        </div>
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
      <v-col cols="12">
        <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="text-h5 font-weight-bold">
              Errors ({{ selectedCourseName }})
            </div>
            <div class="d-flex align-center gap-2">
              <v-btn
                :disabled="!selectedStudent || errorViewMode !== 'STUDENTS'"
                :loading="pdfLoading"
                color="secondary"
                variant="elevated"
                prepend-icon="mdi-file-pdf-box"
                class="mr-2"
                size="small"
                @click="generateStudentPdfReport"
              >
                PDF Report
              </v-btn>
              <v-icon size="32" color="error">mdi-alert-circle</v-icon>
            </div>
          </div>

          <!-- View Toggle for Courses vs Students -->
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
              Classes
            </v-btn>
            <v-btn value="STUDENTS" class="flex-grow-1" size="small">
              <v-icon start>mdi-account</v-icon>
              Students
            </v-btn>
          </v-btn-toggle>

          <!-- Loading State -->
          <v-progress-linear v-if="loadingErrors" indeterminate color="primary" class="mb-4" />

          <!-- Interactive D3 Stacked Error Bar Chart component mounting context -->
          <div v-else-if="hasChartData" class="mb-4">
            <TeacherErrorFrequencyChart 
              :errorData="topErrors" 
              :viewMode="errorViewMode"
              @open-ai-tutor="openErrorTutorFromChart" 
            />
          </div>

          <!-- No Data Fallback Messages -->
          <div v-else class="text-center text-medium-emphasis pa-8">
            <span v-if="errorViewMode === 'STUDENTS' && !selectedStudent">
              Please select a specific student from the filters above to see their individual breakdown.
            </span>
            <span v-else>
              No error data available for this criteria.
            </span>
          </div>

          <!-- Class-only Details Dropdowns -->
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

            <!-- Selected Error Details -->
            <v-card v-if="selectedErrorObj" variant="outlined" class="pa-4 mt-4">
              <div class="text-subtitle-1 font-weight-bold mb-2">
                {{ selectedErrorObj.error_code }} — 
                {{ errorsData[selectedErrorObj.error_code]?.description || 'No description available' }}
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
    </v-row>

    <!-- Summary Stats -->
    <v-row>
      <v-col cols="12" sm="6" md="4">
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
      <v-col cols="12" sm="6" md="4">
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
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2" rounded="lg">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis">Unique Errors Found</div>
              <div class="text-h4 font-weight-bold">{{ uniqueErrorCount }}</div>
            </div>
            <v-icon size="40" color="warning">mdi-gavel</v-icon>
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
            <v-col cols="6" sm="4" md="2.4">
              <div class="text-center">
                <v-icon size="32" color="blue">mdi-controller</v-icon>
                <div class="text-h5 font-weight-bold mt-2">{{ activityBreakdown.conjugation }}</div>
                <div class="text-caption text-medium-emphasis">Conjugation</div>
              </div>
            </v-col>
            <v-col cols="6" sm="4" md="2.4">
              <div class="text-center">
                <v-icon size="32" color="purple">mdi-gamepad-variant</v-icon>
                <div class="text-h5 font-weight-bold mt-2">{{ activityBreakdown.other_game }}</div>
                <div class="text-caption text-medium-emphasis">Games</div>
              </div>
            </v-col>
            <v-col cols="6" sm="4" md="2.4">
              <div class="text-center">
                <v-icon size="32" color="orange">mdi-weight-lifter</v-icon>
                <div class="text-h5 font-weight-bold mt-2">{{ activityBreakdown.exercise }}</div>
                <div class="text-caption text-medium-emphasis">Exercises</div>
              </div>
            </v-col>
            <v-col cols="6" sm="4" md="2.4">
              <div class="text-center">
                <v-icon size="32" color="green">mdi-card-text</v-icon>
                <div class="text-h5 font-weight-bold mt-2">{{ activityBreakdown.vocab_workout }}</div>
                <div class="text-caption text-medium-emphasis">Vocab</div>
              </div>
            </v-col>
            <v-col cols="6" sm="4" md="2.4">
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
import { ref, computed, onMounted } from 'vue';
import api from '@/axios';
import { errorsData } from "@/assets/scripts/errorsData";
import TeacherErrorFrequencyChart from '@/components/charts/TeacherErrorFrequencyChart.vue';
import { useUserStore } from '@/stores/user';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';

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
  feedbackId?: string;
  feedbackDate?: string | null;
  feedbackLabel?: string;
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

const userStore = useUserStore();
const pdfLoading = ref(false);
const loadingErrors = ref(false);
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
const studentErrorData = ref<ErrorData[]>([]); 
const errorViewMode = ref<'COURSES' | 'STUDENTS'>('COURSES');
const achievements = ref<Achievement[]>([]);
const activities = ref<Activity[]>([]);
const selectedErrorCode = ref<string | null>(null);

const selectedCourseName = computed(() => {
  if (selectedCourse.value === 'all') return 'All Courses';
  const found = courseOptions.value.find(c => c.id === selectedCourse.value);
  return found ? found.name : 'Unknown Course';
});

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

const totalErrorOccurrences = computed(() => {
  return currentActiveErrors.value.reduce((sum, e) => sum + e.total_times, 0);
});

const uniqueErrorCount = computed(() => {
  return currentActiveErrors.value.length;
});

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

function enrichRawErrorResponsePayload(arr: any[]): ErrorData[] {
  return arr.map(e => {
    let feedbackId = "Class Summary";
    let feedbackDate: string | null = null;
    let feedbackLabel = "General Practice Session";

    const parseDateSubstring = (s: string): string | null => {
      const match = s.match(/_(\d{8})_/);
      if (!match) return null;
      return `${match[1].slice(0, 4)}-${match[1].slice(4, 6)}-${match[1].slice(6, 8)}`;
    };

    if (e.feedback && typeof e.feedback === 'string') {
      feedbackId = e.feedback;
      feedbackDate = parseDateSubstring(e.feedback);
    } else if (e.feedback && typeof e.feedback === 'object') {
      feedbackId = e.feedback.feedback_id || "Class Summary";
      feedbackDate = e.feedback.date ? (parseDateSubstring(e.feedback.date) || parseDateSubstring(feedbackId)) : parseDateSubstring(feedbackId);
    }

    if (feedbackId.startsWith("P")) {
      feedbackLabel = "Feedback on Presentation" + (feedbackDate ? ` (${feedbackDate})` : "");
    } else if (feedbackId.startsWith("E")) {
      feedbackLabel = "Feedback on Exercises" + (feedbackDate ? ` (${feedbackDate})` : "");
    } else {
      feedbackLabel = feedbackId;
    }

    return {
      error_code: e.error_code,
      total_times: e.total_times || e.times || 0,
      evidence_samples: e.evidence_samples || (e.evidence ? [e.evidence] : []),
      course: e.course,
      feedbackId,
      feedbackDate,
      feedbackLabel
    };
  });
}

async function fetchErrorData() {
  loadingErrors.value = true;
  try {
    const params: any = {};
    if (selectedCourse.value !== 'all') {
      params.course = selectedCourse.value;
    }

    if (errorViewMode.value === 'STUDENTS') {
      if (!selectedStudent.value) {
        studentErrorData.value = [];
        return;
      }
      params.student = selectedStudent.value;
    }

    const response = await api.get<any[]>('/admin-error-summary/summary/', { params });
    const rawEnriched = enrichRawErrorResponsePayload(response.data || []);

    if (errorViewMode.value === 'STUDENTS') {
      studentErrorData.value = rawEnriched;
    } else {
      if (selectedCourse.value === 'all') {
        const grouped: Record<string, ErrorData> = {};
        rawEnriched.forEach(e => {
          if (!grouped[e.error_code]) {
            grouped[e.error_code] = {
              error_code: e.error_code,
              total_times: 0,
              evidence_samples: [],
              feedbackId: 'Combined Overview',
              feedbackLabel: 'All Classes Consolidated'
            };
          }
          grouped[e.error_code].total_times += e.total_times;
          if (e.evidence_samples) {
            grouped[e.error_code].evidence_samples.push(...e.evidence_samples);
          }
        });
        errorData.value = Object.values(grouped);
      } else {
        errorData.value = rawEnriched;
      }
    }
  } catch (error) {
    console.error('Failed to fetch error data:', error);
    showSnackbar('Failed to load error data', 'error');
  } finally {
    loadingErrors.value = false;
  }
}

async function fetchAchievementsFallbackContext() {
  try {
    const params: any = { limit: 1000 };
    let studentIds: number[] = [];
    if (selectedCourse.value !== 'all') {
      const enrollmentResponse = await api.get('/enrollment/', { params: { course: selectedCourse.value } });
      studentIds = enrollmentResponse.data.map((e: any) => e.student?.id || e.student);
    }
    const response = await api.get('/achievements/', { params });
    let data = response.data.results || response.data;
    if (Array.isArray(data)) {
      if (selectedCourse.value !== 'all' && studentIds.length > 0) data = data.filter((ach: any) => studentIds.includes(ach.student));
      if (selectedStudent.value) data = data.filter((ach: any) => ach.student === selectedStudent.value);
      achievements.value = data;
    }
  } catch (e) { console.error(e); }
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

async function fetchAllData() {
  await Promise.all([
    fetchErrorData(),
    fetchActivityData(),
    fetchAchievementsFallbackContext()
  ]);
}

async function onStudentFilterChange() {
  await fetchErrorData();
  await fetchActivityData();
  await fetchAchievementsFallbackContext();
}

function openErrorTutorFromChart(payload: any) {
  showSnackbar(`Tutor routing called for code segment: ${payload.error_code || 'General'}`, 'info');
}

async function generateStudentPdfReport() {
  if (!selectedStudent.value) return;
  pdfLoading.value = true;
  try {
    await Promise.all([
      userStore.fetchLinguisticProfile(),
      userStore.fetchCurrentWorkout(selectedStudent.value)
    ]);
    const targetStudent = students.value.find(s => s.id === selectedStudent.value);
    const initials = targetStudent ? targetStudent.initials : 'ST';
    const studentScore = userStore.student?.health_score ?? 0;
    const studentPrompts = userStore.student?.total_correct_prompts ?? 0;
    
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2); 
    let currentY = 40;

    doc.setFillColor(0, 150, 136); 
    doc.rect(margin, currentY, contentWidth, 6, 'F');
    currentY += 20;
    
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica', 'bold');
    doc.text(`Learning Progress Snapshot: ${initials}`, margin, currentY);
    
    doc.setTextColor(120, 130, 140);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    currentY += 15;
    doc.text(`Generated on ${new Date().toLocaleDateString()} for ${selectedCourseName.value}`, margin, currentY);

    currentY += 15;
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Your Key Stats', 'Current Standing']],
      body: [
        ['Language Focus Area', userStore.studentDomainLabel || 'General Practice'],
        ['Correct Answers Added', `${studentPrompts} sentences`],
        ['Overall Accuracy Score', `${studentScore}% Precision`],
        ['Practice Rounds Completed', `${totalSessions.value} sessions`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 150, 136], textColor: 255, fontStyle: 'bold' }, 
      styles: { fontSize: 9, cellPadding: 5 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 25;

    if (topErrors.value.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text('Your Top Error Types', margin, currentY);
      currentY += 12;

      try {
        const renderWidth = 1200;
        const renderHeight = 450;
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = renderWidth;
        offscreenCanvas.height = renderHeight;
        const offscreenCtx = offscreenCanvas.getContext('2d');

        if (offscreenCtx) {
          offscreenCtx.fillStyle = '#FFFFFF';
          offscreenCtx.fillRect(0, 0, renderWidth, renderHeight);

          const offscreenCtxInstance = new Chart(offscreenCtx, {
            type: 'bar',
            data: {
              labels: topErrors.value.map(e => e.error_code),
              datasets: [{
                data: topErrors.value.map(e => e.total_times),
                backgroundColor: 'rgba(255, 87, 34, 0.65)', 
                borderColor: 'rgba(255, 87, 34, 1)',
                borderWidth: 1.5
              }]
            },
            options: {
              responsive: false,
              animation: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { font: { size: 14, weight: 'bold' }, color: '#4C3E50' } },
                y: { beginAtZero: true, ticks: { stepSize: 1, color: '#888888' } }
              }
            }
          });

          const cleanChartImgBase64 = offscreenCanvas.toDataURL('image/jpeg', 1.0);
          const pdfImageHeight = 160; 
          doc.addImage(cleanChartImgBase64, 'JPEG', margin, currentY, contentWidth, pdfImageHeight);
          currentY += pdfImageHeight + 25;
          offscreenCtxInstance.destroy();
        }
      } catch (canvasErr) {
        console.error('Offscreen canvas mapping error:', canvasErr);
        currentY += 15;
      }
    }

    if (topErrors.value.length > 0) {
      if (currentY > doc.internal.pageSize.getHeight() - 120) { doc.addPage(); currentY = 40; }
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text('Error Breakdown & Explanations', margin, currentY);
      currentY += 12;

      const primaryErrors = topErrors.value.slice(0, 10);
      const remainingErrors = topErrors.value.slice(10);

      const errorRows = primaryErrors.map(e => {
        const metadata = errorsData[e.error_code];
        const descriptionText = metadata?.description || 'Review needed for this grammar item.';
        const cleanReference = (metadata?.reference || '').replace(/<[^>]*>/g, ''); 
        const samples = e.evidence_samples && e.evidence_samples.length > 0
          ? e.evidence_samples.slice(0, 2).map(sample => `• "${sample}"`).join('\n')
          : 'No direct examples saved.';

        return [
          e.error_code,
          String(e.total_times),
          `${descriptionText}${cleanReference ? '\n\nTip: ' + cleanReference : ''}`,
          samples
        ];
      });

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['Code', 'Count', 'What to watch out for', 'Your Examples']],
        body: errorRows,
        theme: 'grid',
        headStyles: { fillColor: [239, 83, 80], textColor: 255 }, 
        styles: { fontSize: 8, cellPadding: 5, overflow: 'linebreak', valign: 'top' },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 40, halign: 'center' },
          2: { cellWidth: 235 },
          3: { cellWidth: 190, fontStyle: 'italic' }
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;

      if (remainingErrors.length > 0) {
        if (currentY > doc.internal.pageSize.getHeight() - 60) { doc.addPage(); currentY = 40; }
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 110, 120);
        doc.text('Other minor items to keep an eye on:', margin, currentY);
        currentY += 12;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(110, 110, 110);
        
        remainingErrors.forEach(e => {
          const metadata = errorsData[e.error_code];
          const desc = metadata?.description || 'Grammar practice check.';
          const bulletText = `•  Code ${e.error_code} (${e.total_times}x): ${desc}`;
          const lines = doc.splitTextToSize(bulletText, contentWidth);
          lines.forEach((line: string) => {
            if (currentY > doc.internal.pageSize.getHeight() - 40) { doc.addPage(); currentY = 40; }
            doc.text(line, margin + 5, currentY);
            currentY += 12;
          });
        });
        currentY += 15;
      }
    }

    if (userStore.linguisticProfile) {
      const p = userStore.linguisticProfile;
      if (currentY > doc.internal.pageSize.getHeight() - 140) { doc.addPage(); currentY = 40; }
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text(`Your Core Communication Skills (${userStore.assessmentStageLabel || 'Latest Review'})`, margin, currentY);
      currentY += 12;

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['Skill Area', 'Score', 'Teacher Feedback & Notes']],
        body: [
          ['Grammar & Structural Precision', p.linguistic_precision ? `${p.linguistic_precision}/10` : '—', p.linguistic_precision_comment || 'Keep going!'],
          ['Pronunciation & Clarity', p.phonetic_clarity ? `${p.phonetic_clarity}/10` : '—', p.phonetic_clarity_comment || 'Looking good.'],
          ['Conversation Flow & Speed', p.communicative_flow ? `${p.communicative_flow}/10` : '—', p.communicative_flow_comment || 'Nicely paced.'],
          ['Vocabulary Range', p.expressive_range ? `${p.expressive_range}/10` : '—', p.expressive_range_comment || 'Great choice of words.']
        ],
        theme: 'grid',
        headStyles: { fillColor: [120, 135, 150] }, 
        styles: { fontSize: 8.5, cellPadding: 5, overflow: 'linebreak' },
        columnStyles: { 0: { cellWidth: 140 }, 1: { cellWidth: 55 }, 2: { cellWidth: 320 } }
      });
      currentY = (doc as any).lastAutoTable.finalY + 25;
    }

    if (userStore.currentWorkout) {
      if (currentY > doc.internal.pageSize.getHeight() - 120) { doc.addPage(); currentY = 40; }
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text(`Active Study Plan: ${userStore.currentWorkout.focus_area}`, margin, currentY);
      currentY += 12;

      const drillRows = (userStore.currentWorkout.drills || []).map(d => [
        d.name,
        d.type.toUpperCase(),
        `${d.completed_sessions} / ${d.target_sessions || '∞'}`,
        d.notes || '—'
      ]);

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['Practice Activity Name', 'Type', 'Sessions Done', 'Goal Details']],
        body: drillRows.length > 0 ? drillRows : [['No current practice drills assigned yet.', '', '', '']],
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] }, 
        styles: { fontSize: 8.5, cellPadding: 4 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 25;
    }

    const studentAchievements = achievements.value.filter(a => a.student === selectedStudent.value);
    if (studentAchievements.length > 0) {
      if (currentY > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); currentY = 40; }
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text('Unlocked Achievements & Badges!', margin, currentY);
      currentY += 12;

      const achievementRows = studentAchievements.map(a => [
        new Date(a.achieved_on).toLocaleDateString(),
        a.description,
        a.manually_created ? 'Awarded by Teacher' : 'System Milestone'
      ]);

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['Date Earned', 'What You Accomplished', 'Award Type']],
        body: achievementRows,
        theme: 'striped',
        headStyles: { fillColor: [241, 196, 15] }, 
        styles: { fontSize: 8.5, cellPadding: 4 }
      });
    }

    const sanitizedFilename = `Student_Progress_${initials}_${selectedCourse.value}.pdf`.replace(/[^a-z0-9_.-]/gi, '_');
    doc.save(sanitizedFilename);
    showSnackbar('Your custom progress report has been saved!', 'success');
  } catch (err) {
    console.error('PDF export crashed:', err);
    showSnackbar('Could not build the PDF report.', 'error');
  } finally {
    pdfLoading.value = false;
  }
}

async function handleErrorViewToggle(mode: 'COURSES' | 'STUDENTS') {
  await fetchErrorData();
}

function showSnackbar(message: string, color: string = 'success') {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

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
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
</style>