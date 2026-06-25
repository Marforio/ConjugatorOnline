<template>
  <v-container fluid class="mt-5 pa-4 px-6 max-width-container">
    <v-row class="mb-2 align-center">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-black text-slate-900 d-flex align-center">
          <v-icon icon="mdi-comment-quote" color="indigo" class="mr-5" />
          Give Feedback
        </h1>
        <p class="text-caption text-slate-500 mt-1">
          Select a student, load a feedback template, and make feedback PDFs.
        </p>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-end px-3">
      <v-col cols="12" md="5">
        <v-btn
          color="indigo-lighten-5" variant="flat" size="large" block
          class="text-indigo-darken-3 font-weight-black rounded-xl text-none"
          prepend-icon="mdi-playlist-plus" @click="showBuilderStudio = true"
        >
          Create a New Template
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <div class="text-h5 font-weight-bold mx-4 mb-4">
          Give feedback using a template
        </div>
      </v-col>
    </v-row>

    <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
      <v-row no-gutters class="mb-4">
        <v-col cols="12" md="6">
          <div class="text-h6">Select Student</div>
        </v-col>
        <v-col cols="12" md="6" class="d-none d-md-block pl-md-4">
          <div class="text-h6">Feedback Template</div>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col cols="12" md="6" class="d-flex flex-column pr-md-4">
          <div class="text-h6 mb-2 d-md-none">Select Student</div>

          <v-menu
            v-model="dropdownOpen"
            :close-on-content-click="false"
            location="bottom start"
            max-width="500"
            offset="8"
          >
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="searchQuery"
                label="Search active student rosters..."
                prepend-inner-icon="mdi-account-search"
                append-inner-icon="mdi-chevron-down"
                variant="outlined"
                clearable
                hide-details
                @input="onSearchInput"
                @click:clear="clearSelection"
              >
                <template #prepend-inner v-if="selectedStudent">
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
              <v-list
                v-if="filteredStudents.length > 0"
                max-height="300"
                class="overflow-y-auto"
              >
                <v-list-item
                  v-for="student in filteredStudents"
                  :key="student.id"
                  @click="handleStudentSelect(student)"
                  :active="selectedStudent?.id === student.id"
                  color="primary"
                  class="mx-2 my-1 rounded-lg"
                >
                  <v-list-item-title class="font-weight-bold">
                    {{ student.initials }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-monospace text-caption">
                    {{ student.web_id }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-col>

        <v-col cols="12" md="6" class="d-flex flex-column pl-md-4">
          <div class="text-h6 mb-2 d-md-none">Feedback Template</div>

          <v-select
            v-model="activeTemplateId"
            :items="availableTemplates"
            item-title="name"
            item-value="template_id"
            label="Load Template"
            variant="outlined"
            prepend-inner-icon="mdi-file-layers-outline"
            hide-details
          />
        </v-col>
      </v-row>
    </v-card>

    <v-card v-if="selectedStudent && loadedTemplateStructure" class="pa-6 mb-6 animate-fade-in" elevation="2" rounded="lg">
      <div class="text-overline font-weight-bold text-primary mb-4 tracking-wider">Feedback for {{ selectedStudent.initials }}</div>
      
      <form @submit.prevent>
        <div v-for="comp in loadedTemplateStructure.components" :key="comp.id" class="mb-5">
          
          <div v-if="comp.type === 'paragraph'" class="pa-4 bg-slate-50 border rounded-xl text-body-2 text-slate-700 mb-2">
            <v-icon icon="mdi-information-outline" color="indigo" class="mr-2" size="small" />
            {{ comp.text }}
          </div>

          <v-text-field v-if="comp.type === 'text_input'" v-model="formDataValues[comp.id]" :label="comp.label" variant="outlined" density="comfortable" />

          <v-textarea v-if="comp.type === 'textarea'" v-model="formDataValues[comp.id]" :label="comp.label" :rows="comp.rows || 3" variant="outlined" auto-grow />

          <v-select v-if="comp.type === 'select'" v-model="formDataValues[comp.id]" :items="comp.options" :label="comp.label" variant="outlined" />

          <div v-if="comp.type === 'checkbox_group'" class="pa-4 border rounded-xl bg-slate-50">
            <div class="text-subtitle-2 font-weight-black text-slate-800 mb-2">{{ comp.label }}</div>
            <v-checkbox v-for="(opt, oIdx) in comp.options" :key="oIdx" v-model="formDataValues[comp.id]" :label="opt" :value="opt" color="indigo" density="compact" hide-details />
          </div>

          <div v-if="comp.type === 'error_matrix'" class="pa-4 border rounded-xl border-amber-lighten-3 bg-amber-lighten-5">
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="text-subtitle-1 font-weight-bold text-amber-darken-4"><v-icon icon="mdi-alert-circle-outline" class="mr-2"/>ERRORS</div>
              <v-btn size="small" color="amber-darken-3" class="text-white font-weight-bold" prepend-icon="mdi-plus" @click="addErrorRow">Add Error Entry</v-btn>
            </div>
            <v-row v-for="(err, eIdx) in errorsList" :key="eIdx" dense class="mb-2 align-center">
              <v-col cols="12" md="4"><v-select v-model="err.code" :items="errorCodes" label="Error Code" variant="outlined" density="compact" bg-color="white" hide-details /></v-col>
              <v-col cols="12" md="6"><v-textarea v-model="err.evidence" @input="calculateAutoErrorCount(eIdx)" label="Evidence (separate items with semicolons)" variant="outlined" rows="1" auto-grow density="compact" bg-color="white" hide-details /></v-col>
              <v-col cols="12" md="1" class="text-center font-weight-black text-amber-darken-4">{{ err.times }}x</v-col>
              <v-col cols="12" md="1" class="text-center"><v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="errorsList.splice(eIdx, 1)" /></v-col>
            </v-row>
          </div>

          <div v-if="comp.type === 'vocab_notebook'" class="pa-4 border rounded-xl border-indigo-lighten-4 bg-indigo-lighten-5">
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="text-subtitle-1 font-weight-bold text-indigo-darken-4"><v-icon icon="mdi-notebook-outline" class="mr-2"/>Vocabulary</div>
              <v-btn size="small" color="indigo" class="font-weight-bold" prepend-icon="mdi-plus" @click="addVocabRow">Add Vocabulary Term</v-btn>
            </div>
            <v-row v-for="(vRow, vIdx) in vocabList" :key="vIdx" dense class="mb-2 align-center">
              <v-col cols="12" md="3"><v-textarea v-model="vRow.correct" label="Correct Form" variant="outlined" rows="1" auto-grow density="compact" bg-color="white" hide-details /></v-col>
              <v-col cols="12" md="3"><v-textarea v-model="vRow.incorrect" label="Incorrect Form" variant="outlined" rows="1" auto-grow density="compact" bg-color="white" hide-details /></v-col>
              <v-col cols="12" md="5"><v-textarea v-model="vRow.comment" label="Teacher Usage Notes / Context" variant="outlined" rows="1" auto-grow density="compact" bg-color="white" hide-details /></v-col>
              <v-col cols="12" md="1" class="text-center"><v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="vocabList.splice(vIdx, 1)" /></v-col>
            </v-row>
          </div>

          <div v-if="comp.type === 'impressive_matrix'" class="pa-4 border rounded-xl border-emerald-lighten-3 bg-emerald-lighten-5">
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="text-subtitle-1 font-weight-bold text-emerald-darken-4">
                <v-icon icon="mdi-star-circle-outline" class="mr-2"/>Impressive Language Structures
              </div>
              <v-btn size="small" color="emerald-darken-2" class="text-white font-weight-bold" prepend-icon="mdi-plus" @click="addImpressiveRow">
                Add Impressive Item
              </v-btn>
            </div>
            <v-row v-for="(imp, iIdx) in impressiveList" :key="iIdx" dense class="mb-2 align-center">
              <v-col cols="12" md="5">
                <v-textarea v-model="imp.content" label="Advanced Phrase / Nuanced Construction used" variant="outlined" rows="1" auto-grow density="compact" bg-color="white" hide-details />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea v-model="imp.comment" label="Praise Notes / Semantic Context Details" variant="outlined" rows="1" auto-grow density="compact" bg-color="white" hide-details />
              </v-col>
              <v-col cols="12" md="1" class="text-center">
                <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="impressiveList.splice(iIdx, 1)" />
              </v-col>
            </v-row>
          </div>

          <div v-if="comp.type === 'comment_block'" class="pa-4 border rounded-xl border-blue-grey-lighten-4 bg-blue-grey-lighten-5">
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-subtitle-1 font-weight-bold text-blue-grey-darken-4">
                <v-icon icon="mdi-comment-text-multiple-outline" class="mr-2"/>Evaluation Remarks
              </div>
              <v-btn size="small" color="blue-grey" class="text-white font-weight-bold" prepend-icon="mdi-plus" @click="addCommentRow">
                Add Remark Node
              </v-btn>
            </div>
            <v-row v-for="(comm, cIdx) in commentsList" :key="cIdx" dense class="mb-2">
              <v-col cols="12" md="11">
                <v-textarea v-model="comm.comment" label="Enter freeform evaluation commentary note..." variant="outlined" rows="2" auto-grow bg-color="white" hide-details />
              </v-col>
              <v-col cols="12" md="1" class="d-flex align-center justify-center">
                <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="commentsList.splice(cIdx, 1)" />
              </v-col>
            </v-row>
          </div>
        </div>

        <v-divider class="my-6" />
        <div class="d-flex gap-3 flex-wrap">
          <v-btn color="indigo-darken-1" size="large" class="text-white font-weight-bold rounded-xl" :loading="submitting" prepend-icon="mdi-send-check" @click="executeSubmitFeedback">
            Submit & Save
          </v-btn>
          <v-btn color="indigo" size="large" variant="outlined" class="font-weight-bold rounded-xl" prepend-icon="mdi-file-pdf-box" @click="generateClientSidePdfReport(null)">
            Preview Live PDF
          </v-btn>
        </div>
      </form>
    </v-card>

    <v-card class="pa-6 mt-6" elevation="2" rounded="lg">
  <v-row class="align-center mb-2">
    <v-col cols="12" sm="5">
      <div class="text-h5 font-weight-bold">Issued Feedback</div>
      <div class="text-caption text-slate-500">Track feedback and recreate PDFs.</div>
    </v-col>
    
    <v-col cols="12" sm="5">
      <v-text-field
        v-model="historySearchQuery"
        label="Filter history by student initials or username..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        clearable
        hide-details
      />
    </v-col>
    
    <v-col cols="12" sm="2" class="text-sm-right">
      <v-btn prepend-icon="mdi-refresh" variant="text" color="primary" size="small" :loading="loadingHistory" @click="fetchIssuedFeedbackHistory">
        Refresh
      </v-btn>
    </v-col>
  </v-row>

  <v-progress-linear v-if="loadingHistory" indeterminate color="indigo" class="mb-4" />

  <div v-else-if="filteredFeedbackHistoryLog.length > 0" class="scrollable-history-container border rounded-lg mt-2">
    <v-table class="w-100">
      <thead class="sticky-thead bg-slate-50">
        <tr>
          <th class="text-left font-weight-bold text-slate-700">Feedback ID Reference</th>
          <th class="text-left font-weight-bold text-slate-700">Student Target</th>
          <th class="text-left font-weight-bold text-slate-700">Course Track</th>
          <th class="text-left font-weight-bold text-slate-700">Date Committed</th>
          <th class="text-center font-weight-bold text-slate-700">Action Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredFeedbackHistoryLog" :key="item.feedback_id">
          <td class="font-weight-medium text-indigo-darken-3 text-body-2">{{ item.feedback_id }}</td>
          <td>
          <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold">
            {{ resolveStudentDisplayName(item.student) }}
          </v-chip>
        </td>
          <td><v-chip size="small" variant="outlined">{{ item.course.toUpperCase() }}</v-chip></td>
          <td class="text-body-2 text-slate-600">{{ item.date }}</td>
          <td class="text-center">
            <v-btn
              icon="mdi-file-pdf-box"
              size="small"
              color="error"
              variant="text"
              title="Regenerate Report PDF"
              @click="recreatePdfFromHistoricalLogs(item)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <div v-else class="text-center text-medium-emphasis pa-8 bg-slate-50 rounded-lg border border-dashed mt-2">
    <v-icon size="36" color="slate-400" class="mb-2">mdi-comment-text-multiple-outline</v-icon>
    <div v-if="historySearchQuery">No results match your search filters.</div>
    <div v-else>No historical feedback submissions logged under your profile yet.</div>
  </div>
</v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">{{ snackbarMessage }}</v-snackbar>
  </v-container>

  <FeedbackTemplateBuilderDialog v-model="showBuilderStudio" @template-created="handleNewTemplateDeployment" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import api from '@/axios'
import { useUserStore } from '@/stores/user'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import FeedbackTemplateBuilderDialog from '@/components/FeedbackTemplateBuilderDialog.vue'
import { errorsData } from '@/assets/scripts/errorsData'

// --- Interfaces ---
interface Student { id: number; initials: string; web_id: string; }
interface Course { slug: string; name: string; }
interface TemplateBlueprint { template_id: string; name: string; structure: any; }
interface ErrorSelectOption { title: string; value: string; }
interface HistoricalFeedback {
  feedback_id: string;
  student: string; // web_id from slug related response configuration
  course: string;  // slug from response mapping
  date: string;
  content: any;    // JSON dictionary structure mapping
}

const userStore = useUserStore()

// UI Control States
const dropdownOpen = ref(false)
const submitting = ref(false)
const loadingHistory = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Data Repositories
const studentsRawPool = ref<Student[]>([])
const filteredStudents = ref<Student[]>([])
const searchQuery = ref('')
const selectedStudent = ref<Student | null>(null)
const studentCourses = ref<Course[]>([])
const selectedCourse = ref('')

const availableTemplates = ref<TemplateBlueprint[]>([])
const activeTemplateId = ref<string | null>(null)
const errorCodes = ref<ErrorSelectOption[]>([])
const feedbackHistoryLog = ref<HistoricalFeedback[]>([])

// Dynamic State Containers
const formDataValues = ref<Record<string, any>>({})
const errorsList = ref<any[]>([])
const vocabList = ref<any[]>([])
const impressiveList = ref<any[]>([])
const commentsList = ref<any[]>([])

const loadedTemplateStructure = computed(() => {
  const match = availableTemplates.value.find(t => t.template_id === activeTemplateId.value)
  return match ? match.structure : null
})

const showBuilderStudio = ref(false)

function handleNewTemplateDeployment(newTemplateRecord: any) {
  availableTemplates.value.push({
    template_id: newTemplateRecord.template_id,
    name: newTemplateRecord.name,
    structure: newTemplateRecord.structure
  })
  activeTemplateId.value = newTemplateRecord.template_id
  showToast(`Template layout framework "${newTemplateRecord.name}" successfully deployed and loaded!`, 'success')
}

// Looks up the student profile in memory to create a friendly text label
function resolveStudentDisplayName(username: string): string {
  if (!username) return '—';
  
  const match = studentsRawPool.value.find(
    s => s.web_id.toLowerCase() === username.toLowerCase()
  );
  
  // Returns "ST (username)" or just "username" if the student is no longer in the active roster
  return match ? `${match.initials} (${username})` : username;
}

watch(loadedTemplateStructure, (newStruct) => {
  const initialValues: Record<string, any> = {}
  if (newStruct && Array.isArray(newStruct.components)) {
    newStruct.components.forEach((comp: any) => {
      if (comp.type === 'checkbox_group') initialValues[comp.id] = []
      else if (comp.type === 'error_matrix' || comp.type === 'vocab_notebook' || comp.type === 'impressive_matrix' || comp.type === 'comment_block') return
      else initialValues[comp.id] = ''
    })
  }
  formDataValues.value = initialValues
  errorsList.value = []
  vocabList.value = []
  impressiveList.value = []
  commentsList.value = []
})

function onSearchInput() {
  dropdownOpen.value = true
  const query = searchQuery.value?.toLowerCase() || ''
  filteredStudents.value = studentsRawPool.value.filter(s => 
    s.initials.toLowerCase().includes(query) || s.web_id.toLowerCase().includes(query)
  )
}

async function handleStudentSelect(student: Student) {
  selectedStudent.value = student
  searchQuery.value = student.initials
  dropdownOpen.value = false
  
  try {
    const res = await api.get('/enrollment/', { params: { student: student.id } })
    const data = res.data?.results || res.data || []
    studentCourses.value = data.map((e: any) => ({
      slug: e.course?.slug || String(e.course),
      name: (e.course?.slug || String(e.course)).toUpperCase()
    }))
    if (studentCourses.value.length > 0) selectedCourse.value = studentCourses.value[0].slug
  } catch (err) {
    console.error("Failed loading course assignments track:", err)
  }
}

function clearSelection() {
  selectedStudent.value = null; searchQuery.value = ''; studentCourses.value = []; selectedCourse.value = ''
}

function calculateAutoErrorCount(idx: number) {
  const row = errorsList.value[idx]
  if (!row.evidence || !row.evidence.trim()) { row.times = 0; return; }
  row.times = row.evidence.split(';').map((s: string) => s.trim()).filter((s: string) => s.length > 0).length
}

function addErrorRow() { errorsList.value.push({ code: '', evidence: '', times: 0 }) }
function addVocabRow() { vocabList.value.push({ correct: '', incorrect: '', times: 1, comment: '' }) }
function addImpressiveRow() { impressiveList.value.push({ content: '', comment: '', times: 1 }) }
function addCommentRow() { commentsList.value.push({ comment: '' }) }

// Fetch the history list from the active endpoint stream
async function fetchIssuedFeedbackHistory() {
  loadingHistory.value = true
  try {
    const response = await api.get<HistoricalFeedback[]>('/feedback/')
    feedbackHistoryLog.value = response.data || []
  } catch (err) {
    console.error("Failed to recover historical feedback streams:", err)
    showToast("Could not synchronize historical feedback tables.", "error")
  } finally {
    loadingHistory.value = false
  }
}

async function executeSubmitFeedback() {
  if (!selectedStudent.value || !selectedCourse.value || !activeTemplateId.value) {
    showToast("Ensure Student, Course Track, and Blueprint are populated.", "error")
    return
  }

  submitting.value = true
  try {
    // Encapsulate full context elements right into the JSON payload bundle
    const comprehensiveJSONContent = {
      template_id: activeTemplateId.value,
      form_data_snapshot: formDataValues.value,
      errors: errorsList.value.filter(e => e.code && e.evidence),
      vocab: vocabList.value.filter(v => v.correct),
      impressive: impressiveList.value.filter(i => i.content),
      comments: commentsList.value.filter(c => c.comment.trim())
    }

    const payload = {
      student_web_id: selectedStudent.value.web_id,
      course_slug: selectedCourse.value,
      date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
      content: comprehensiveJSONContent // Submitted directly into Django's upgraded JSONField
    }

    await api.post('/feedback/', payload)
    showToast("Feedback record saved successfully.", "success")
    resetFormState()
    await fetchIssuedFeedbackHistory() // Refresh listing tracking rows
  } catch (err) {
    console.error(err)
    showToast("Operational exception writing evaluation parameters.", "error")
  } finally { submitting.value = false }
}


// 🌟 ADDED: Reactive string binding for the history search field query
const historySearchQuery = ref('');

// 🌟 ADDED: Computed property that filters rows by student ID / initials, pointing the template table to this dataset
// 🌟 UPGRADED: Resolves initials from your active student roster pool to search by both metrics
const filteredFeedbackHistoryLog = computed(() => {
  const query = historySearchQuery.value?.toLowerCase().trim() || '';
  if (!query) return feedbackHistoryLog.value;
  
  return feedbackHistoryLog.value.filter((item: HistoricalFeedback) => {
    const username = item.student.toLowerCase();
    
    // Cross-reference the username against the pre-loaded student pool to find their initials
    const match = studentsRawPool.value.find(
      s => s.web_id.toLowerCase() === username
    );
    const initials = match ? match.initials.toLowerCase() : '';

    // Returns the element if either the username or resolved initials match your query
    return username.includes(query) || initials.includes(query);
  });
});

// Unified client-side generation pipeline engine
function generateClientSidePdfReport(historicalItem: HistoricalFeedback | null = null) {
  let targetInitials = ""
  let targetWebId = ""
  let targetCourse = ""
  let targetDate = ""
  let targetStructureComponents: any[] = []
  let activeDataSnapshot: Record<string, any> = {}
  let activeErrors: any[] = []
  let activeVocab: any[] = []
  let activeImpressive: any[] = []
  let activeComments: any[] = []

  if (historicalItem) {
    // Reading data from the backend JSON object matrix logs
    targetInitials = historicalItem.student
    targetWebId = historicalItem.student
    targetCourse = historicalItem.course.toUpperCase()
    targetDate = historicalItem.date

    const contents = historicalItem.content || {}
    activeDataSnapshot = contents.form_data_snapshot || {}
    activeErrors = contents.errors || []
    activeVocab = contents.vocab || []
    activeImpressive = contents.impressive || []
    activeComments = contents.comments || []

    const templateMatch = availableTemplates.value.find(t => t.template_id === contents.template_id)
    targetStructureComponents = templateMatch ? templateMatch.structure.components : [
      { id: 'errors', type: 'error_matrix' },
      { id: 'vocab', type: 'vocab_notebook' },
      { id: 'impressive', type: 'impressive_matrix' },
      { id: 'comments', type: 'comment_block' }
    ]
  } else {
    // Fetch live parameters out of active component memory bounds tracking fields
    if (!selectedStudent.value || !loadedTemplateStructure.value) return
    targetInitials = selectedStudent.value.initials
    targetWebId = selectedStudent.value.web_id
    targetCourse = selectedCourse.value.toUpperCase()
    targetDate = new Date().toLocaleDateString()
    targetStructureComponents = loadedTemplateStructure.value.components
    
    activeDataSnapshot = formDataValues.value
    activeErrors = errorsList.value.filter(e => e.code)
    activeVocab = vocabList.value.filter(v => v.correct)
    activeImpressive = impressiveList.value.filter(i => i.content)
    activeComments = commentsList.value.filter(c => c.comment.trim())
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const margin = 40
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - (margin * 2)
  let currentY = 50

  // Header design rules
  doc.setFillColor(63, 81, 181) 
  doc.rect(margin, currentY, contentWidth, 6, 'F')
  currentY += 25

  doc.setFontSize(20)
  doc.setTextColor(30, 41, 59)
  doc.setFont('helvetica', 'bold')
  doc.text(`Performance Feedback Report`, margin, currentY)
  
  currentY += 16
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text(`Student ID: ${targetInitials} (${targetWebId}) | Course: ${targetCourse} | Issued: ${targetDate}`, margin, currentY)
  currentY += 25

  targetStructureComponents.forEach((comp: any) => {
    if (currentY > doc.internal.pageSize.getHeight() - 80) { doc.addPage(); currentY = 50; }

    if (comp.type === 'paragraph') {
      doc.setFontSize(9.5)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(71, 85, 105)
      const lines = doc.splitTextToSize(comp.text, contentWidth)
      lines.forEach((l: string) => { doc.text(l, margin, currentY); currentY += 14; })
      currentY += 8
    }

    else if (comp.type === 'textarea' || comp.type === 'text_input') {
      const value = activeDataSnapshot[comp.id]
      if (!value) return
      
      doc.setFontSize(10.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 41, 59)
      doc.text(comp.label, margin, currentY)
      currentY += 14

      doc.setFontSize(9.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(51, 65, 85)
      const textLines = doc.splitTextToSize(value, contentWidth)
      textLines.forEach((l: string) => { doc.text(l, margin + 5, currentY); currentY += 13; })
      currentY += 10
    }

    else if (comp.type === 'select') {
      const value = activeDataSnapshot[comp.id]
      if (!value) return
      doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(51, 65, 85)
      doc.text(`${comp.label}: ${value}`, margin, currentY)
      currentY += 16
    }

    else if (comp.type === 'checkbox_group') {
      const checked: string[] = activeDataSnapshot[comp.id] || []
      if (checked.length === 0) return

      doc.setFontSize(10.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 41, 59)
      doc.text(comp.label, margin, currentY)
      currentY += 14

      doc.setFontSize(9.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(51, 65, 85)
      checked.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 10)
        lines.forEach((l: string) => { doc.text(l, margin + 10, currentY); currentY += 13; })
      })
      currentY += 8
    }

    else if (comp.type === 'error_matrix' && activeErrors.length > 0) {
      currentY += 10
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(185, 28, 28)
      doc.text("Grammar Errors Identified", margin, currentY)
      currentY += 10

      const rows = activeErrors.map(e => [e.code, `${e.times}x`, e.evidence])
      autoTable(doc, {
        startY: currentY, margin: { left: margin, right: margin },
        head: [['Error Code', 'Frequency', 'Evidence Snippets from Transcripts']],
        body: rows, theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] }, styles: { fontSize: 8.5 }
      })
      currentY = (doc as any).lastAutoTable.finalY + 18
    }

    else if (comp.type === 'vocab_notebook' && activeVocab.length > 0) {
      if (currentY > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); currentY = 50; }
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(63, 81, 181)
      doc.text("Vocabulary Practice Recommendations", margin, currentY)
      currentY += 10

      const rows = activeVocab.map(v => [v.correct, v.incorrect || '—', v.comment || '—'])
      autoTable(doc, {
        startY: currentY, margin: { left: margin, right: margin },
        head: [['Recommended Usage', 'Incorrect Form used', 'Usage Context Notes']],
        body: rows, theme: 'striped',
        headStyles: { fillColor: [63, 81, 181] }, styles: { fontSize: 8.5 }
      })
      currentY = (doc as any).lastAutoTable.finalY + 18
    }

    else if (comp.type === 'impressive_matrix' && activeImpressive.length > 0) {
      if (currentY > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); currentY = 50; }
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(16, 185, 129)
      doc.text("Advanced Language & Phrases Highlighted", margin, currentY)
      currentY += 10

      const rows = activeImpressive.map(i => [i.content, i.comment || '—'])
      autoTable(doc, {
        startY: currentY, margin: { left: margin, right: margin },
        head: [['Advanced Language / Structures', 'Analysis & Commendations']],
        body: rows, theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }, styles: { fontSize: 8.5 }
      })
      currentY = (doc as any).lastAutoTable.finalY + 18
    }

    else if (comp.type === 'comment_block' && activeComments.length > 0) {
      if (currentY > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); currentY = 50; }
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(71, 85, 105)
      doc.text("Teacher Feedback Remarks", margin, currentY)
      currentY += 12

      doc.setFontSize(9.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(51, 65, 85)
      activeComments.forEach(item => {
        const textLines = doc.splitTextToSize(`• ${item.comment}`, contentWidth)
        textLines.forEach((l: string) => { 
          if (currentY > doc.internal.pageSize.getHeight() - 40) { doc.addPage(); currentY = 50; }
          doc.text(l, margin, currentY); currentY += 13; 
        })
      })
      currentY += 8
    }
  })

  doc.save(`Feedback_Report_${targetInitials}_${targetCourse}.pdf`)
}

function recreatePdfFromHistoricalLogs(item: HistoricalFeedback) {
  generateClientSidePdfReport(item)
}

function resetFormState() {
  formDataValues.value = {}
  errorsList.value = []
  vocabList.value = []
  impressiveList.value = []  
  commentsList.value = []   
  clearSelection()
}

function showToast(m: string, color = 'success') {
  snackbarMessage.value = m; snackbarColor.value = color; snackbar.value = true
}

function seedMockTemplateBlueprints() {
  availableTemplates.value = [
    {
      template_id: "tpl_presentation_v1",
      name: "Standard Oral Presentation",
      structure: {
        components: [
          { id: "p1", type: "paragraph", text: "Teacher evaluation parameters matrix context logs." },
          { id: "topic", type: "select", label: "Project Topic", options: ["My professional project", "Story of a startup", "Present a research paper"] },
          { id: "positives", type: "checkbox_group", label: "Demonstrated Skills", options: ["Excellent use of target vocabulary.", "Good visual support.", "Good use of target grammar."] },
          { id: "notes", type: "textarea", label: "Comments" },
          { id: "errors", type: "error_matrix" },
          { id: "vocab", type: "vocab_notebook" },
          { id: "impressive", type: "impressive_matrix" },
          { id: "comments", type: "comment_block" }
        ]
      }
    },
    {
      template_id: "tpl_midterm_v1",
      name: "Mid-Semester Performance",
      structure: {
        components: [
          { id: "p1", type: "paragraph", text: "Use this form matrix to give feedback." },
          { id: "overall_assessment", type: "textarea", label: "General Summary", rows: 4 },
          { id: "errors", type: "error_matrix" }
        ]
      }
    }
  ]
  if (availableTemplates.value.length > 0) activeTemplateId.value = availableTemplates.value[0].template_id
}

onMounted(async () => {
  await fetchStudents()
  seedMockTemplateBlueprints()
  await fetchIssuedFeedbackHistory() // Build table items upon component initialization
  
  errorCodes.value = Object.entries(errorsData).map(([code, details]) => {
    return {
      title: `${code} — ${details.description}`, 
      value: code                                
    };
  });
})

async function fetchStudents() {
  await userStore.ensureUserLoaded()
  studentsRawPool.value = userStore.teacherRoster.map(s => ({ id: s.id, initials: s.initials, web_id: s.web_id }))
  filteredStudents.value = [...studentsRawPool.value]
}
</script>

<style scoped>
.max-width-container { max-width: 1200px; margin: 0 auto; }
.gap-3 { gap: 12px; }
.animate-fade-in { animation: fadeInEffect 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInEffect { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.evidence-list, .achievements-container { max-height: 300px; overflow-y: auto; }
/* Sets vertical boundaries for roughly 10 rows and handles internal Y-axis scrolling */
.scrollable-history-container {
  max-height: 440px; 
  overflow-y: auto;
  position: relative;
}

/* Freezes the table row headers at the top edge of the active scroll view context */
.sticky-thead th {
  position: sticky;
  top: 0;
  background-color: #f8fafc !important;
  z-index: 2;
  box-shadow: inset 0 -1px 0 #e2e8f0;
}
</style>