<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-card class="pa-6 mb-6 feedback-header" elevation="4" rounded="xl">
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-h4 font-weight-bold text-white">Feedback Manager</div>
          <div class="text-subtitle-1 text-white text-opacity-90 mt-1">
            Create and manage student feedback
          </div>
        </div>
        <v-icon size="56" class="text-white">mdi-comment-edit</v-icon>
      </div>
    </v-card>

    <!-- Student Selection -->
    <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
      <div class="text-h6 mb-4">Select Student</div>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            label="Search students"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            @input="filterStudents"
          />
        </v-col>
      </v-row>
      
      <v-list v-if="filteredStudents.length > 0" max-height="300" class="overflow-y-auto">
        <v-list-item
          v-for="student in filteredStudents"
          :key="student.id"
          @click="selectStudent(student)"
          :active="selectedStudent?.id === student.id"
        >
          <template v-slot:prepend>
            <v-avatar color="primary" size="40">
              <span class="text-white font-weight-bold">{{ student.initials }}</span>
            </v-avatar>
          </template>
          <v-list-item-title>{{ student.initials }}</v-list-item-title>
          <v-list-item-subtitle>{{ student.web_id }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <div v-else-if="searchQuery" class="text-center pa-4 text-medium-emphasis">
        No students found
      </div>
    </v-card>

    <!-- Feedback Form (shows after student selected) -->
    <v-card v-if="selectedStudent" class="pa-6 mb-6" elevation="2" rounded="lg">
      <div class="text-h6 mb-4">
        Create Feedback for {{ selectedStudent.initials }} ({{ selectedStudent.web_id }})
      </div>

      <!-- Feedback Type Selection -->
      <v-radio-group v-model="feedbackType" inline>
        <v-radio label="Presentation" value="presentation" />
        <v-radio label="Exercises" value="exercises" />
      </v-radio-group>

      <!-- Course Selection -->
      <v-select
        v-model="selectedCourse"
        :items="studentCourses"
        item-title="name"
        item-value="slug"
        label="Course"
        variant="outlined"
        class="mb-4"
      />

      <!-- Presentation-specific fields -->
      <div v-if="feedbackType === 'presentation'" class="mb-6">
        <v-text-field
          v-model="presentationDate"
          label="Presentation Date"
          variant="outlined"
          class="mb-4"
        />
        
        <v-select
          v-model="presentationTopic"
          :items="presentationTopics"
          label="Presentation Topic"
          variant="outlined"
          class="mb-4"
        />

        <div class="text-subtitle-2 mb-2">Positive Comments (select applicable)</div>
        <v-checkbox
          v-for="(comment, index) in presentationPositiveOptions"
          :key="index"
          v-model="selectedPositiveComments"
          :label="comment"
          :value="comment"
          density="compact"
          hide-details
        />

        <v-textarea
          v-model="additionalPositive"
          label="Additional Positive Comments"
          variant="outlined"
          rows="3"
          class="mt-4 mb-4"
        />

        <v-textarea
          v-model="improvementComments"
          label="Improvement Comments"
          variant="outlined"
          rows="3"
          class="mb-4"
        />

        <div class="text-subtitle-2 mb-2">Requirements Fulfillment</div>
        <v-radio-group v-model="requirementsFulfilled">
          <v-radio
            label="All requirements successfully fulfilled"
            value="complete"
          />
          <v-radio
            label="Some requirements missing"
            value="incomplete"
          />
        </v-radio-group>

        <v-textarea
          v-if="requirementsFulfilled === 'incomplete'"
          v-model="missingRequirements"
          label="Missing Requirements"
          variant="outlined"
          rows="2"
          class="mb-4"
        />
      </div>

      <!-- Exercises-specific fields -->
      <div v-if="feedbackType === 'exercises'" class="mb-6">
        <v-text-field
          v-model="exerciseNames"
          label="Exercise Names"
          variant="outlined"
          class="mb-4"
        />

        <v-text-field
          v-model="timePeriod"
          label="Time Period"
          variant="outlined"
          class="mb-4"
        />

        <div class="text-subtitle-2 mb-2">Positive Comments (select applicable)</div>
        <v-checkbox
          v-for="(comment, index) in exercisesPositiveOptions"
          :key="index"
          v-model="selectedPositiveComments"
          :label="comment"
          :value="comment"
          density="compact"
          hide-details
        />

        <v-textarea
          v-model="additionalPositive"
          label="Additional Positive Comments"
          variant="outlined"
          rows="3"
          class="mt-4 mb-4"
        />

        <v-textarea
          v-model="improvementComments"
          label="Improvement Comments"
          variant="outlined"
          rows="3"
          class="mb-4"
        />
      </div>

      <!-- Error Entries (Common to both types) -->
      <v-divider class="my-6" />
      
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="text-h6">Error Entries</div>
        <v-btn
          color="primary"
          size="small"
          @click="addErrorRow"
          prepend-icon="mdi-plus"
        >
          Add Error
        </v-btn>
      </div>

      <v-row
  v-for="(error, index) in errors"
  :key="index"
  dense
  class="mb-2"
>
  <v-col cols="12" md="4">
    <v-select
      v-model="error.code"
      :items="errorCodes"
      label="Error Code"
      variant="outlined"
      density="compact"
    />
  </v-col>
  <v-col cols="12" md="7">
    <v-textarea
      v-model="error.evidence"
      @input="updateErrorCount(index)"
      label="Evidence (separate with semicolons)"
      variant="outlined"
      rows="2"
      density="compact"
    />
  </v-col>
  <v-col cols="12" md="1" class="d-flex flex-column align-center justify-center">
    <!-- Auto Count Display (prominent) -->
    <v-tooltip location="top">
      <template v-slot:activator="{ props }">
        <div v-bind="props" class="auto-count-display">
          <div class="text-h6 font-weight-bold" :class="error.manualOverride ? 'text-warning' : 'text-primary'">
            {{ error.times }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ error.manualOverride ? 'Manual' : 'Auto' }}
          </div>
        </div>
      </template>
      <span v-if="error.manualOverride">
        Click to reset to auto-count ({{ error.autoCount }})
      </span>
      <span v-else>
        Click to manually override
      </span>
    </v-tooltip>

    <!-- Manual Override Button (only visible when hovering or active) -->
<v-menu v-model="error.showMenu" location="bottom" :close-on-content-click="false">
  <template v-slot:activator="{ props: menuProps }">
    <v-btn
      v-bind="menuProps"
      icon
      size="x-small"
      variant="text"
      class="manual-override-btn"
    >
      <v-icon size="16">{{ error.manualOverride ? 'mdi-lock' : 'mdi-pencil' }}</v-icon>
    </v-btn>
  </template>

  <!-- Manual input popup -->
  <v-card min-width="150">
    <v-card-text class="pa-3">
      <div class="text-caption mb-2">Manual Count</div>
      <v-text-field
        v-model.number="error.times"
        type="number"
        variant="outlined"
        density="compact"
        min="1"
        hide-details
        autofocus
        @keyup.enter="confirmManualOverride(index)"
      />
      <div class="d-flex gap-2 mt-2">
        <v-btn
          size="small"
          color="primary"
          variant="flat"
          @click="confirmManualOverride(index)"
        >
          Set
        </v-btn>
        <v-btn
          size="small"
          variant="text"
          @click="resetToAutoCount(index)"
        >
          Reset to Auto
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</v-menu>
  </v-col>
  <v-col cols="12" md="12" class="d-flex align-center justify-end">
    <v-btn
      icon="mdi-delete"
      size="small"
      color="error"
      variant="text"
      @click="removeErrorRow(index)"
    />
  </v-col>
</v-row>

      <!-- Vocabulary Entries (Common to both types) -->
      <v-divider class="my-6" />
      
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="text-h6">Vocabulary Entries</div>
        <v-btn
          color="primary"
          size="small"
          @click="addVocabRow"
          prepend-icon="mdi-plus"
        >
          Add Vocab
        </v-btn>
      </div>

      <v-row
        v-for="(vocab, index) in vocabulary"
        :key="index"
        dense
        class="mb-2"
      >
        <v-col cols="12" md="3">
          <v-textarea
            v-model="vocab.correct"
            label="Correct"
            variant="outlined"
            rows="2"
            density="compact"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-textarea
            v-model="vocab.incorrect"
            label="Incorrect"
            variant="outlined"
            rows="2"
            density="compact"
          />
        </v-col>
        <v-col cols="12" md="1">
          <v-text-field
            v-model.number="vocab.times"
            label="#"
            type="number"
            variant="outlined"
            density="compact"
            min="1"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea
            v-model="vocab.comment"
            label="Comment"
            variant="outlined"
            rows="2"
            density="compact"
          />
        </v-col>
        <v-col cols="12" md="1" class="d-flex align-center">
          <v-btn
            icon="mdi-delete"
            size="small"
            color="error"
            variant="text"
            @click="removeVocabRow(index)"
          />
        </v-col>
      </v-row>

      <!-- Additional Fields (Common) -->
      <v-divider class="my-6" />

      <v-textarea
        v-model="additionalComments"
        label="Additional Comments"
        variant="outlined"
        rows="3"
        class="mb-4"
      />

      <v-textarea
        v-model="summary"
        label="Summary"
        variant="outlined"
        rows="3"
        class="mb-4"
      />

      <v-text-field
        v-model="grade"
        label="Grade (optional)"
        variant="outlined"
        class="mb-4"
      />

      <!-- Action Buttons -->
      <div class="d-flex gap-3 mt-6">
        <v-btn
          color="primary"
          size="large"
          :loading="submitting"
          @click="submitFeedback"
          prepend-icon="mdi-send"
        >
          Submit Feedback
        </v-btn>
        
        <v-btn
          color="secondary"
          size="large"
          variant="outlined"
          @click="previewPDF"
          prepend-icon="mdi-eye"
        >
          Preview PDF
        </v-btn>

        <v-btn
          color="error"
          size="large"
          variant="outlined"
          @click="resetForm"
          prepend-icon="mdi-refresh"
        >
          Reset
        </v-btn>
      </div>
    </v-card>

    <!-- Success/Error Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>

    <!-- PDF Preview Dialog -->
    <v-dialog v-model="pdfPreviewDialog" max-width="900">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>PDF Preview</span>
          <v-btn icon="mdi-close" variant="text" @click="pdfPreviewDialog = false" />
        </v-card-title>
        <v-card-text>
          <iframe
            v-if="pdfPreviewUrl"
            :src="pdfPreviewUrl"
            width="100%"
            height="600"
            style="border: none;"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/axios';

// Types
interface Student {
  id: number;
  initials: string;
  web_id: string;
}

interface Course {
  slug: string;
  name: string;
}

interface ErrorEntry {
  code: string;
  evidence: string;
  times: number;
  autoCount: number; // Always track auto count
  manualOverride: boolean; // Flag for manual override
  showMenu?: boolean; // For popup menu
}

interface VocabEntry {
  correct: string;
  incorrect: string;
  times: number;
  comment: string;
}

// State
const students = ref<Student[]>([]);
const searchQuery = ref('');
const filteredStudents = ref<Student[]>([]);
const selectedStudent = ref<Student | null>(null);
const studentCourses = ref<Course[]>([]);

const feedbackType = ref<'presentation' | 'exercises'>('exercises');
const selectedCourse = ref('');

// Presentation fields
const presentationDate = ref('');
const presentationTopic = ref('');
const presentationTopics = [
  'A professional project',
  'Documentary report',
  'A startup and their pitch deck',
  'A corporate annual report',
  'A recent financial episode',
  'Run a workshop',
  'Learning project',
  'A research paper',
  'Bridge collapse case study',
  'Analyze a sustainability concept',
  'Meeting simulation',
];

const presentationPositiveOptions = [
  'Thank you for your presentation/exam.',
  'Thank you for your well-prepared presentation/exam. It was very interesting.',
  'Your illustrations and visual support were very helpful.',
  'I appreciated the fact that you followed my instructions carefully.',
  'I noticed an effort to use the vocabulary we have studied in class.',
  'You demonstrated good accuracy in your conjugations.',
  'You did a good job with pronunciation.',
];

// Exercises fields
const exerciseNames = ref('');
const timePeriod = ref('');

const exercisesPositiveOptions = [
  'You have a good level of fluency.',
  'You have good communication skills.',
  'You use a wide range of general vocabulary.',
  'I also noticed your efforts to apply the vocabulary and grammar we are learning in class.',
  'In general, your verb conjugations are accurate. You have good conjugation mechanics.',
  'In general, your pronunciation of the English language is quite good.',
  'I would also like to thank you for the positive energy with which you approach our activities.',
];

// Common fields
const selectedPositiveComments = ref<string[]>([]);
const additionalPositive = ref('');
const improvementComments = ref('');
const requirementsFulfilled = ref('complete');
const missingRequirements = ref('');

// Initialize with 8 error rows and 4 vocab rows
const errors = ref<ErrorEntry[]>([
  { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
  { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
  { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
  { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
  { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
  { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
  { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
  { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
]);

const vocabulary = ref<VocabEntry[]>([
  { correct: '', incorrect: '', times: 1, comment: '' },
  { correct: '', incorrect: '', times: 1, comment: '' },
  { correct: '', incorrect: '', times: 1, comment: '' },
  { correct: '', incorrect: '', times: 1, comment: '' },
]);

const additionalComments = ref('');
const summary = ref('');
const grade = ref('');

const errorCodes = ref<string[]>([]);
const submitting = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

const pdfPreviewDialog = ref(false);
const pdfPreviewUrl = ref('');

// Methods
async function fetchStudents() {
  try {
    const response = await api.get('/students/');
    students.value = response.data;
    filteredStudents.value = response.data;
  } catch (error) {
    console.error('Failed to fetch students:', error);
  }
}

async function fetchErrorCodes() {
  try {
    const response = await api.get('/static/data/errors.json');
    const errorsData = response.data;
    errorCodes.value = Object.keys(errorsData).map(key => 
      `${key} ${errorsData[key].short_slug}`
    );
  } catch (error) {
    console.error('Failed to fetch error codes:', error);
  }
}

function filterStudents() {
  if (!searchQuery.value) {
    filteredStudents.value = students.value;
    return;
  }

  const query = searchQuery.value.toLowerCase();
  filteredStudents.value = students.value.filter(s => 
    s.initials.toLowerCase().includes(query) ||
    s.web_id.toLowerCase().includes(query)
  );
}

async function selectStudent(student: Student) {
  selectedStudent.value = student;
  
  // Fetch student's courses
  try {
    const response = await api.get('/enrollment/', {
      params: { student: student.id }
    });
    studentCourses.value = response.data.map((e: any) => ({
      slug: e.course.slug || e.course,
      name: e.course.slug || e.course,
    }));
  } catch (error) {
    console.error('Failed to fetch student courses:', error);
  }
}

/**
 * Count semicolon-separated items in evidence string
 */
function countEvidenceItems(evidence: string): number {
  if (!evidence || !evidence.trim()) return 0;
  
  const items = evidence
    .split(';')
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  return items.length;
}

/**
 * Reset to auto count
 */
function resetToAutoCount(index: number) {
  const error = errors.value[index];
  error.times = error.autoCount;
  error.manualOverride = false;
  error.showMenu = false;
}

/**
 * Update error count based on semicolon-separated evidence
 */
function updateErrorCount(index: number) {
  const error = errors.value[index];
  const autoCount = countEvidenceItems(error.evidence);
  
  error.autoCount = autoCount;
  
  // Only update times if not manually overridden
  if (!error.manualOverride) {
    error.times = autoCount;
  }
}

function addErrorRow() {
  errors.value.push({
    code: '',
    evidence: '',
    times: 0,
    autoCount: 0,
    manualOverride: false,
  });
}

function removeErrorRow(index: number) {
  errors.value.splice(index, 1);
}

/**
 * Confirm manual override
 */
function confirmManualOverride(index: number) {
  const error = errors.value[index];
  error.manualOverride = true;
  error.showMenu = false;
}


function addVocabRow() {
  vocabulary.value.push({
    correct: '',
    incorrect: '',
    times: 1,
    comment: '',
  });
}

function removeVocabRow(index: number) {
  vocabulary.value.splice(index, 1);
}

async function submitFeedback() {
  if (!selectedStudent.value || !selectedCourse.value) {
    showSnackbar('Please select a student and course', 'error');
    return;
  }

  submitting.value = true;

  try {
    const payload = {
      feedback_type: feedbackType.value,
      student_web_id: selectedStudent.value.web_id,
      student_initials: selectedStudent.value.initials, // Use initials instead of name
      course_slug: selectedCourse.value,
      errors: errors.value.filter(e => e.code && e.evidence),
      vocabulary: vocabulary.value.filter(v => v.correct && v.incorrect),
      additional_comments: additionalComments.value,
      summary: summary.value,
      grade: grade.value,
    };

    // Add type-specific fields
    if (feedbackType.value === 'presentation') {
      Object.assign(payload, {
        presentation_date: presentationDate.value,
        presentation_topic: presentationTopic.value,
        positive_remarks: selectedPositiveComments.value.join(' '),
        additional_positive: additionalPositive.value,
        improvement_comments: improvementComments.value,
        complete: requirementsFulfilled.value === 'complete' 
          ? 'You successfully fulfilled all of the language requirements for this presentation/exam'
          : `However, your presentation/exam did not include all of the required language elements. In particular, you did not demonstrate ${missingRequirements.value}`,
      });
    } else {
      Object.assign(payload, {
        exercise_names: exerciseNames.value,
        time_period: timePeriod.value,
        positive_remarks: selectedPositiveComments.value.join(' '),
        additional_positive: additionalPositive.value,
        improvement_comments: improvementComments.value,
      });
    }

    const response = await api.post('/feedback/create/', payload);
    
    showSnackbar('Feedback created successfully!', 'success');
    resetForm();
    
    // Optionally download PDF
    if (response.data.pdf_url) {
      window.open(response.data.pdf_url, '_blank');
    }
  } catch (error: any) {
    console.error('Failed to submit feedback:', error);
    showSnackbar(error.response?.data?.error || 'Failed to submit feedback', 'error');
  } finally {
    submitting.value = false;
  }
}

async function previewPDF() {
  showSnackbar('PDF preview coming soon', 'info');
}

function resetForm() {
  feedbackType.value = 'exercises';
  selectedCourse.value = '';
  presentationDate.value = '';
  presentationTopic.value = '';
  exerciseNames.value = '';
  timePeriod.value = '';
  selectedPositiveComments.value = [];
  additionalPositive.value = '';
  improvementComments.value = '';
  requirementsFulfilled.value = 'complete';
  missingRequirements.value = '';
  
  // Reset to 8 error rows and 4 vocab rows
    errors.value = [
    { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
    { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
    { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
    { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
    { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
    { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
    { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
    { code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false },
  ];
  
  vocabulary.value = [
    { correct: '', incorrect: '', times: 1, comment: '' },
    { correct: '', incorrect: '', times: 1, comment: '' },
    { correct: '', incorrect: '', times: 1, comment: '' },
    { correct: '', incorrect: '', times: 1, comment: '' },
  ];
  
  additionalComments.value = '';
  summary.value = '';
  grade.value = '';
}

function showSnackbar(message: string, color: string) {
  snackbarMessage.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

onMounted(() => {
  fetchStudents();
  fetchErrorCodes();
});
</script>

<style scoped>
.feedback-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.feedback-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-10deg);
  pointer-events: none;
}

.feedback-header > * {
  position: relative;
}

.feedback-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.feedback-header::before {
  content: "";
  position: absolute;
  inset: -45%;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 45%),
    radial-gradient(circle at 85% 25%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%);
  transform: rotate(-10deg);
  pointer-events: none;
}


.auto-count-display {
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
  min-width: 50px;
  cursor: pointer;
  transition: all 0.2s;
}

.auto-count-display:hover {
  background: rgba(0, 0, 0, 0.05);
}

.manual-override-btn {
  opacity: 0;
  transition: opacity 0.2s;
}

.v-col:hover .manual-override-btn {
  opacity: 1;
}

.manual-override-btn:focus {
  opacity: 1;
}
</style>