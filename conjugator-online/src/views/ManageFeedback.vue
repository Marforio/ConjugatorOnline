<template>
  <v-container fluid class="pa-6">
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

    <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
      <div class="text-h6 mb-2">Select Student</div>
      <p class="text-caption text-medium-emphasis mb-4">Find a student to give feedback to.</p>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-menu
            v-model="dropdownOpen"
            :close-on-content-click="false"
            location="bottom start"
            max-width="500"
            offset="8"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="searchQuery"
                label="Search students..."
                prepend-inner-icon="mdi-account-search"
                append-inner-icon="mdi-chevron-down"
                variant="outlined"
                clearable
                hide-details
                @input="onSearchInput"
                @click:clear="clearSelection"
              >
                <template v-slot:prepend-inner v-if="selectedStudent">
                  <v-chip
                    color="primary"
                    size="small"
                    class="mr-2"
                    closable
                    @click:close="clearSelection"
                  >
                    {{ selectedStudent.initials }}
                  </v-chip>
                </template>
              </v-text-field>
            </template>

            <v-card elevation="8" rounded="lg" border>
              <v-list v-if="filteredStudents.length > 0" max-height="300" class="overflow-y-auto custom-scrollbar">
                <v-list-item
                  v-for="student in filteredStudents"
                  :key="student.id"
                  @click="handleStudentSelect(student)"
                  :active="selectedStudent?.id === student.id"
                  color="primary"
                  class="mx-2 my-1 rounded-lg"
                >
                  <template v-slot:prepend>
                    <v-avatar color="primary-lighten-1" size="36">
                      <span class="text-white font-weight-bold text-subtitle-2">{{ student.initials }}</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-bold">{{ student.initials }}</v-list-item-title>
                  <v-list-item-subtitle class="font-monospace text-caption">{{ student.web_id }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <div v-else class="text-center pa-6 text-medium-emphasis">
                <v-icon size="28" color="disabled" class="mb-2">mdi-account-off</v-icon>
                <div class="text-body-2">No students match your query</div>
              </div>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>

    <v-card v-if="selectedStudent" class="pa-6 mb-6 animate-fade-in" elevation="2" rounded="lg">
      <div class="text-h6 mb-4">
        Create Feedback for {{ selectedStudent.initials }} ({{ selectedStudent.web_id }})
      </div>

      <v-radio-group v-model="feedbackType" inline>
        <v-radio label="Presentation" value="presentation" color="primary" />
        <v-radio label="Exercises" value="exercises" color="primary" />
      </v-radio-group>

      <v-select
        v-model="selectedCourse"
        :items="studentCourses"
        item-title="name"
        item-value="slug"
        label="Course"
        variant="outlined"
        class="mb-4"
      />

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
          color="primary"
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
            color="success"
          />
          <v-radio
            label="Some requirements missing"
            value="incomplete"
            color="warning"
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
          color="primary"
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
        class="mb-2 align-center"
      >
        <v-col cols="12" md="4">
          <v-select
            v-model="error.code"
            :items="errorCodes"
            label="Error Code"
            variant="outlined"
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea
            v-model="error.evidence"
            @input="updateErrorCount(index)"
            label="Evidence (separate with semicolons)"
            variant="outlined"
            rows="1"
            auto-grow
            density="compact"
            hide-details
          />
        </v-col>
        <v-col cols="6" md="1" class="d-flex align-center justify-center">
          <v-tooltip location="top">
            <template v-slot:activator="{ props: tooltipProps }">
              <div v-bind="tooltipProps" class="auto-count-display">
                <div class="text-h6 font-weight-bold" :class="error.manualOverride ? 'text-warning' : 'text-primary'">
                  {{ error.times }}
                </div>
                <div class="text-caption text-medium-emphasis" style="font-size: 0.65rem !important;">
                  {{ error.manualOverride ? 'Manual' : 'Auto' }}
                </div>
              </div>
            </template>
            <span v-if="error.manualOverride">Click pencil to modify or reset to auto ({{ error.autoCount }})</span>
            <span v-else>Auto count matches evidence strings.</span>
          </v-tooltip>

          <v-menu v-model="error.showMenu" location="bottom" :close-on-content-click="false">
            <template v-slot:activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                icon
                size="x-small"
                variant="text"
                class="manual-override-btn ml-1"
              >
                <v-icon size="16">{{ error.manualOverride ? 'mdi-lock-open-edit' : 'mdi-pencil' }}</v-icon>
              </v-btn>
            </template>

            <v-card min-width="180" rounded="lg">
              <v-card-text class="pa-3">
                <div class="text-caption mb-2 font-weight-bold">Override Counter</div>
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
                <div class="d-flex gap-2 mt-3">
                  <v-btn size="x-small" color="primary" variant="flat" @click="confirmManualOverride(index)">Set</v-btn>
                  <v-btn size="x-small" variant="text" @click="resetToAutoCount(index)">Reset Auto</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
        <v-col cols="6" md="1" class="d-flex align-center justify-center">
          <v-btn
            icon="mdi-delete"
            size="small"
            color="error"
            variant="text"
            @click="removeErrorRow(index)"
          />
        </v-col>
      </v-row>

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
        class="mb-2 align-center"
      >
        <v-col cols="12" md="3">
          <v-textarea v-model="vocab.correct" label="Correct" variant="outlined" rows="1" auto-grow density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="3">
          <v-textarea v-model="vocab.incorrect" label="Incorrect" variant="outlined" rows="1" auto-grow density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="1">
          <v-text-field v-model.number="vocab.times" label="#" type="number" variant="outlined" density="compact" min="1" hide-details />
        </v-col>
        <v-col cols="12" md="4">
          <v-textarea v-model="vocab.comment" label="Comment" variant="outlined" rows="1" auto-grow density="compact" hide-details />
        </v-col>
        <v-col cols="12" md="1" class="d-flex justify-center">
          <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="removeVocabRow(index)" />
        </v-col>
      </v-row>

      <v-divider class="my-6" />
      <v-textarea v-model="additionalComments" label="Additional Comments" variant="outlined" rows="3" class="mb-4" />
      <v-textarea v-model="summary" label="Summary" variant="outlined" rows="3" class="mb-4" />
      <v-text-field v-model="grade" label="Grade (optional)" variant="outlined" class="mb-4" />

      <div class="d-flex gap-3 mt-6 flex-wrap">
        <v-btn color="primary" size="large" :loading="submitting" @click="submitFeedback" prepend-icon="mdi-send">Submit Feedback</v-btn>
        <v-btn color="secondary" size="large" variant="outlined" @click="previewPDF" prepend-icon="mdi-eye">Preview PDF</v-btn>
        <v-btn color="error" size="large" variant="outlined" @click="resetForm" prepend-icon="mdi-refresh">Reset</v-btn>
      </div>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/axios';
import { useUserStore } from '@/stores/user';

// Types
interface Student { id: number; initials: string; web_id: string; }
interface Course { slug: string; name: string; }
interface ErrorEntry { code: string; evidence: string; times: number; autoCount: number; manualOverride: boolean; showMenu?: boolean; }
interface VocabEntry { correct: string; incorrect: string; times: number; comment: string; }

// Stores
const userStore = useUserStore();

// UI Dropdown Search Mechanics state
const dropdownOpen = ref(false);
const students = ref<Student[]>([]);
const searchQuery = ref('');
const filteredStudents = ref<Student[]>([]);
const selectedStudent = ref<Student | null>(null);
const studentCourses = ref<Course[]>([]);

const feedbackType = ref<'presentation' | 'exercises'>('exercises');
const selectedCourse = ref('');

// Form state parameters
const presentationDate = ref('');
const presentationTopic = ref('');
const exerciseNames = ref('');
const timePeriod = ref('');
const selectedPositiveComments = ref<string[]>([]);
const additionalPositive = ref('');
const improvementComments = ref('');
const requirementsFulfilled = ref('complete');
const missingRequirements = ref('');
const additionalComments = ref('');
const summary = ref('');
const grade = ref('');

const errors = ref<ErrorEntry[]>(Array.from({ length: 8 }, () => ({ code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false })));
const vocabulary = ref<VocabEntry[]>(Array.from({ length: 4 }, () => ({ correct: '', incorrect: '', times: 1, comment: '' })));

const errorCodes = ref<string[]>([]);
const submitting = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

const presentationTopics = ['A professional project', 'Documentary report', 'A startup and their pitch deck', 'A corporate annual report', 'A recent financial episode', 'Run a workshop', 'Learning project', 'A research paper', 'Bridge collapse case study', 'Analyze a sustainability concept', 'Meeting simulation'];
const presentationPositiveOptions = ['Thank you for your presentation/exam.', 'Thank you for your well-prepared presentation/exam. It was very interesting.', 'Your illustrations and visual support were very helpful.', 'I appreciated the fact that you followed my instructions carefully.', 'I noticed an effort to use the vocabulary we have studied in class.', 'You demonstrated good accuracy in your conjugations.', 'You did a job with pronunciation.'];
const exercisesPositiveOptions = ['You have a good level of fluency.', 'You have good communication skills.', 'You use a wide range of general vocabulary.', 'I also noticed your efforts to apply the vocabulary and grammar we are learning in class.', 'In general, your verb conjugations are accurate. You have good conjugation mechanics.', 'In general, your pronunciation of the English language is quite good.', 'I would also like to thank you for the positive energy with which you approach our activities.'];

// Fetch Methods
async function fetchStudents() {
  try {
    if (userStore.isStaff && userStore.teacherRoster.length === 0) {
      await userStore.fetchTeacherRoster();
    }
    const secureSource = userStore.isStaff ? userStore.teacherRoster : [];
    students.value = secureSource.map(s => ({ id: s.id, initials: s.initials, web_id: s.web_id }));
    filteredStudents.value = [...students.value];
  } catch (error) {
    console.error('Failed to isolate student select bounds roster:', error);
  }
}

async function fetchErrorCodes() {
  try {
    const response = await api.get('/static/data/errors.json');
    const errorsData = response.data;
    errorCodes.value = Object.keys(errorsData).map(key => `${key} ${errorsData[key].short_slug}`);
  } catch (error) {
    console.error('Failed to fetch error codes:', error);
  }
}

// 🌟 Dropdown Control Functions
function onSearchInput() {
  dropdownOpen.value = true;
  if (!searchQuery.value) {
    filteredStudents.value = students.value;
    return;
  }
  const query = searchQuery.value.toLowerCase();
  filteredStudents.value = students.value.filter(s => 
    s.initials.toLowerCase().includes(query) || s.web_id.toLowerCase().includes(query)
  );
}

async function handleStudentSelect(student: Student) {
  selectedStudent.value = student;
  searchQuery.value = student.initials; 
  dropdownOpen.value = false; // ✨ Closes dropdown smoothly on choice

  try {
    const response = await api.get('/enrollment/', { params: { student: student.id } });
    studentCourses.value = response.data.map((e: any) => ({
      slug: e.course?.slug || e.course,
      name: e.course?.slug || e.course,
    }));
  } catch (error) {
    console.error('Failed to fetch student courses:', error);
  }
}

function clearSelection() {
  selectedStudent.value = null;
  searchQuery.value = '';
  filteredStudents.value = [...students.value];
  studentCourses.value = [];
  selectedCourse.value = '';
}

// Calculations Logic 
function countEvidenceItems(evidence: string): number {
  if (!evidence || !evidence.trim()) return 0;
  return evidence.split(';').map(item => item.trim()).filter(item => item.length > 0).length;
}

function updateErrorCount(index: number) {
  const error = errors.value[index];
  const autoCount = countEvidenceItems(error.evidence);
  error.autoCount = autoCount;
  if (!error.manualOverride) error.times = autoCount;
}

function resetToAutoCount(index: number) {
  const error = errors.value[index];
  error.times = error.autoCount;
  error.manualOverride = false;
  error.showMenu = false;
}

function confirmManualOverride(index: number) {
  errors.value[index].manualOverride = true;
  errors.value[index].showMenu = false;
}

function addErrorRow() { errors.value.push({ code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false }); }
function removeErrorRow(index: number) { errors.value.splice(index, 1); }
function addVocabRow() { vocabulary.value.push({ correct: '', incorrect: '', times: 1, comment: '' }); }
function removeVocabRow(index: number) { vocabulary.value.splice(index, 1); }

// Submit Action
async function submitFeedback() {
  if (!selectedStudent.value || !selectedCourse.value) {
    showSnackbar('Please select a student and course', 'error');
    return;
  }

  submitting.value = true;

  try {
    const payload = {
      teacher: userStore.user?.id, 
      feedback_type: feedbackType.value,
      student_web_id: selectedStudent.value.web_id,
      student_initials: selectedStudent.value.initials, 
      course_slug: selectedCourse.value,
      errors: errors.value.filter(e => e.code && e.evidence),
      vocabulary: vocabulary.value.filter(v => v.correct && v.incorrect),
      additional_comments: additionalComments.value,
      summary: summary.value,
      grade: grade.value,
    };

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
    clearSelection();
    resetForm();
    
    if (response.data.pdf_url) window.open(response.data.pdf_url, '_blank');
  } catch (error: any) {
    showSnackbar(error.response?.data?.error || 'Failed to submit feedback', 'error');
  } finally {
    submitting.value = false;
  }
}

function previewPDF() { showSnackbar('PDF live preview coming soon', 'info'); }

function resetForm() {
  feedbackType.value = 'exercises';
  presentationDate.value = '';
  presentationTopic.value = '';
  exerciseNames.value = '';
  timePeriod.value = '';
  selectedPositiveComments.value = [];
  additionalPositive.value = '';
  improvementComments.value = '';
  requirementsFulfilled.value = 'complete';
  missingRequirements.value = '';
  additionalComments.value = '';
  summary.value = '';
  grade.value = '';
  errors.value = Array.from({ length: 8 }, () => ({ code: '', evidence: '', times: 0, autoCount: 0, manualOverride: false }));
  vocabulary.value = Array.from({ length: 4 }, () => ({ correct: '', incorrect: '', times: 1, comment: '' }));
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
.feedback-header > * { position: relative; }
.auto-count-display {
  text-align: center;
  padding: 4px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.03);
  min-width: 48px;
  border: 1px solid rgba(0,0,0,0.05);
}
.manual-override-btn { opacity: 0.4; transition: opacity 0.2s; }
.v-row:hover .manual-override-btn { opacity: 1; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>