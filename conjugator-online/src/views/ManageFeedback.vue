<template>
  <v-container fluid class="mt-5 pa-4 px-6 max-width-container">
    <v-row class="mb-6 align-center">
      <v-col cols="12" sm="8">
        <h1 class="text-h4 font-weight-black text-slate-900 d-flex align-center">
          <v-comment-quote icon="mdi-comment-quote" color="indigo" class="mr-5" />
            <v-icon icon="mdi-comment-quote" color="indigo" class="mr-5" />
          Create a Feedback Template
        </h1>
        <p class="text-caption text-slate-500 mt-1">
          Select a student, load an evaluation template schema, and generate cross-relational feedback PDF records.
        </p>
      </v-col>
    </v-row>
    <v-row class="mt-4 px-3">
      <v-col cols="12">
        <v-btn
          color="indigo-lighten-5" variant="flat" size="large" block
          class="text-indigo-darken-3 font-weight-black rounded-xl text-none"
          prepend-icon="mdi-playlist-plus" @click="showBuilderStudio = true"
        >
          Open Template Creation Studio & Blueprint Builder Workshop
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="pa-6 mb-6" elevation="2" rounded="lg">
      <div class="text-h6 mb-2">Select Student</div>
      <v-row>
        <v-col cols="12" md="6">
          <v-menu v-model="dropdownOpen" :close-on-content-click="false" location="bottom start" max-width="500" offset="8">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props" v-model="searchQuery" label="Search active student rosters..."
                prepend-inner-icon="mdi-account-search" append-inner-icon="mdi-chevron-down"
                variant="outlined" clearable hide-details @input="onSearchInput" @click:clear="clearSelection"
              >
                <template v-slot:prepend-inner v-if="selectedStudent">
                  <v-chip color="primary" size="small" class="mr-2" closable @click:close="clearSelection">
                    {{ selectedStudent.initials }}
                  </v-chip>
                </template>
              </v-text-field>
            </template>
            <v-card elevation="8" rounded="lg" border>
              <v-list v-if="filteredStudents.length > 0" max-height="300" class="overflow-y-auto">
                <v-list-item v-for="student in filteredStudents" :key="student.id" @click="handleStudentSelect(student)" :active="selectedStudent?.id === student.id" color="primary" class="mx-2 my-1 rounded-lg">
                  <v-list-item-title class="font-weight-bold">{{ student.initials }}</v-list-item-title>
                  <v-list-item-subtitle class="font-monospace text-caption">{{ student.web_id }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>

    <v-card v-if="selectedStudent" class="pa-6 mb-6 animate-fade-in" elevation="2" rounded="lg">
      <div class="text-h6 mb-4">Evaluation Schema Controls</div>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-select
            v-model="activeTemplateId" :items="availableTemplates" item-title="name" item-value="template_id"
            label="Load Blueprint Template" variant="outlined" prepend-inner-icon="mdi-file-layers-outline"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="selectedCourse" :items="studentCourses" item-title="name" item-value="slug" label="Target Course Track" variant="outlined" />
        </v-col>
      </v-row>
    </v-card>

    <v-card v-if="selectedStudent && loadedTemplateStructure" class="pa-6 mb-6" elevation="2" rounded="lg">
      <div class="text-overline font-weight-bold text-primary mb-4 tracking-wider">Dynamic Form Fields</div>
      
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
              <div class="text-subtitle-1 font-weight-bold text-amber-darken-4"><v-icon icon="mdi-alert-circle-outline" class="mr-2"/>Systemic Errors Tracker</div>
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
              <div class="text-subtitle-1 font-weight-bold text-indigo-darken-4"><v-icon icon="mdi-notebook-outline" class="mr-2"/>Vocabulary Feedback Feed</div>
              <v-btn size="small" color="indigo" class="font-weight-bold" prepend-icon="mdi-plus" @click="addVocabRow">Add Vocabulary Term</v-btn>
            </div>
            <v-row v-for="(vRow, vIdx) in vocabList" :key="vIdx" dense class="mb-2 align-center">
              <v-col cols="12" md="3"><v-textarea v-model="vRow.correct" label="Correct Form" variant="outlined" rows="1" auto-grow density="compact" bg-color="white" hide-details /></v-col>
              <v-col cols="12" md="3"><v-textarea v-model="vRow.incorrect" label="Incorrect Form" variant="outlined" rows="1" auto-grow density="compact" bg-color="white" hide-details /></v-col>
              <v-col cols="12" md="5"><v-textarea v-model="vRow.comment" label="Teacher Usage Notes / Context" variant="outlined" rows="1" auto-grow density="compact" bg-color="white" hide-details /></v-col>
              <v-col cols="12" md="1" class="text-center"><v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="vocabList.splice(vIdx, 1)" /></v-col>
            </v-row>
          </div>

          <!-- INSIDE THE DYNAMIC COMPONENTS LOOP OF GiveFeedback.vue -->

          <!-- 🌟 NEW COMPONENT: IMPRESSIVE LANGUAGE MATRIX FORM -->
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

          <!-- 🌟 NEW COMPONENT: DYNAMIC EVALUATION COMMENTS -->
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
            Submit Assessment Record
          </v-btn>
          <v-btn color="indigo" size="large" variant="outlined" class="font-weight-bold rounded-xl" prepend-icon="mdi-file-pdf-box" @click="generateClientSidePdfReport">
            Compile Progress PDF Report
          </v-btn>
        </div>
      </form>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">{{ snackbarMessage }}</v-snackbar>
  </v-container>

  <FeedbackTemplateBuilderDialog 
      v-model="showBuilderStudio" 
      @template-created="handleNewTemplateDeployment" 
    />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/axios'
import { useUserStore } from '@/stores/user'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import FeedbackTemplateBuilderDialog from '@/components/FeedbackTemplateBuilderDialog.vue'

// --- Interfaces ---
interface Student { id: number; initials: string; web_id: string; }
interface Course { slug: string; name: string; }
interface TemplateBlueprint { template_id: string; name: string; structure: any; }

const userStore = useUserStore()

// UI Control States
const dropdownOpen = ref(false)
const submitting = ref(false)
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

const errorCodes = ref<string[]>([])

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

// template builder dialog
const showBuilderStudio = ref(false)

/**
 * 3. DYNAMIC REFRESH BACKDROP INTERACTION HANDLER:
 * Ingests the output snapshot generated by the child component, 
 * inserts it into your active select dropdown array cache instantly,
 * and sets it as the active selection.
 */
function handleNewTemplateDeployment(newTemplateRecord: any) {
  // Push right into your dynamic templates listing pipeline
  availableTemplates.value.push({
    template_id: newTemplateRecord.template_id,
    name: newTemplateRecord.name,
    structure: newTemplateRecord.structure
  })
  
  // Instantly focus the UI dropdown selector framework onto the teacher's newly deployed layout!
  activeTemplateId.value = newTemplateRecord.template_id
  
  showToast(`Template layout framework "${newTemplateRecord.name}" successfully deployed and loaded!`, 'success')
}



// Initialize values cleanly when template blueprint fields switch
watch(loadedTemplateStructure, (newStruct) => {
  const initialValues: Record<string, any> = {}
  if (newStruct && Array.isArray(newStruct.components)) {
    newStruct.components.forEach((comp: any) => {
      if (comp.type === 'checkbox_group') initialValues[comp.id] = []
      else if (comp.type === 'error_matrix' || comp.type === 'vocab_notebook') return
      else initialValues[comp.id] = ''
    })
  }
  formDataValues.value = initialValues
  errorsList.value = []
  vocabList.value = []
})

// --- Dropdown Search Controllers ---
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

// --- Component Action Matrix Handlers ---
function calculateAutoErrorCount(idx: number) {
  const row = errorsList.value[idx]
  if (!row.evidence || !row.evidence.trim()) { row.times = 0; return; }
  row.times = row.evidence.split(';').map((s: string) => s.trim()).filter((s: string) => s.length > 0).length
}

function addErrorRow() { errorsList.value.push({ code: '', evidence: '', times: 0 }) }
function addVocabRow() { vocabList.value.push({ correct: '', incorrect: '', times: 1, comment: '' }) }
function addImpressiveRow() { impressiveList.value.push({ content: '', comment: '', times: 1 }) }
function addCommentRow() { commentsList.value.push({ comment: '' }) }

// --- API Submissions Pipelines ---
async function executeSubmitFeedback() {
  if (!selectedStudent.value || !selectedCourse.value || !activeTemplateId.value) {
    showToast("Ensure Student, Course Track, and Blueprint are populated.", "error")
    return
  }

  submitting.value = true
  try {
    const payload = {
      student: selectedStudent.value.id,
      course_slug: selectedCourse.value,
      template_id: activeTemplateId.value,
      form_data_snapshot: formDataValues.value,
      
      // Clean cross-relational data packages filtering out unpopulated form blocks
      errors: errorsList.value.filter(e => e.code && e.evidence),
      vocab: vocabList.value.filter(v => v.correct),
      impressive: impressiveList.value.filter(i => i.content), // 🌟 Maps to your Impressive table
      comments: commentsList.value.filter(c => c.comment.trim()) // 🌟 Maps to your Comment table
    }

    await api.post('/feedback/create-templated/', payload)
    showToast("Feedback structural logging locked successfully.", "success")
    resetFormState()
  } catch (err) {
    console.error(err)
    showToast("Operational exception caught writing evaluation parameters block.", "error")
  } finally { submitting.value = false }
}

// --- 🌟 COMPLEX CLIENT-SIDE PDF COMPILER ENGINE ---
function generateClientSidePdfReport() {
  if (!selectedStudent.value || !loadedTemplateStructure.value) return

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const margin = 40
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - (margin * 2)
  let currentY = 50

  // Document Top Branding Bar Layout Line
  doc.setFillColor(63, 81, 181) // Indigo Primary Color hex representation values
  doc.rect(margin, currentY, contentWidth, 8, 'F')
  currentY += 30

  // Document Heading Banner
  doc.setFontSize(22)
  doc.setTextColor(30, 41, 59)
  doc.setFont('helvetica', 'bold')
  doc.text(`Performance Feedback Report`, margin, currentY)
  
  currentY += 18
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text(`Student: ${selectedStudent.value.initials} (${selectedStudent.value.web_id}) | Date: ${new Date().toLocaleDateString()}`, margin, currentY)
  currentY += 25

  // Iterate over dynamic schema configuration layout instructions sets loop
  loadedTemplateStructure.value.components.forEach((comp: any) => {
    // Prevent rendering overflow crashes dynamically on coordinate axis constraints bounds check
    if (currentY > doc.internal.pageSize.getHeight() - 80) { doc.addPage(); currentY = 50; }

    if (comp.type === 'paragraph') {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(71, 85, 105)
      const lines = doc.splitTextToSize(comp.text, contentWidth)
      lines.forEach((l: string) => { doc.text(l, margin, currentY); currentY += 14; })
      currentY += 10
    }

    else if (comp.type === 'textarea' || comp.type === 'text_input') {
      const value = formDataValues.value[comp.id]
      if (!value) return
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 41, 59)
      doc.text(comp.label, margin, currentY)
      currentY += 15

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(51, 65, 85)
      const textLines = doc.splitTextToSize(value, contentWidth)
      textLines.forEach((l: string) => { doc.text(l, margin + 5, currentY); currentY += 14; })
      currentY += 12
    }

    else if (comp.type === 'select') {
      const value = formDataValues.value[comp.id]
      if (!value) return
      doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(51, 65, 85)
      doc.text(`${comp.label}: ${value}`, margin, currentY)
      currentY += 18
    }

    else if (comp.type === 'checkbox_group') {
      const checked: string[] = formDataValues.value[comp.id] || []
      if (checked.length === 0) return

      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 41, 59)
      doc.text(comp.label, margin, currentY)
      currentY += 15

      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(51, 65, 85)
      checked.forEach(item => {
        const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 10)
        lines.forEach((l: string) => { doc.text(l, margin + 10, currentY); currentY += 14; })
      })
      currentY += 10
    }

    else if (comp.type === 'error_matrix' && errorsList.value.length > 0) {
      currentY += 10
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(185, 28, 28)
      doc.text("Grammatical Telemetry & Errors", margin, currentY)
      currentY += 10

      const rows = errorsList.value.filter(e => e.code).map(e => [e.code, `${e.times}x`, e.evidence])
      autoTable(doc, {
        startY: currentY, margin: { left: margin, right: margin },
        head: [['Error Category Code', 'Count', 'Evidence Manifestation Strings']],
        body: rows, theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] }, styles: { fontSize: 9 }
      })
      currentY = (doc as any).lastAutoTable.finalY + 20
    }

    else if (comp.type === 'vocab_notebook' && vocabList.value.length > 0) {
      if (currentY > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); currentY = 50; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(63, 81, 181)
      doc.text("Vocabulary Diagnostic Feedback Feed", margin, currentY)
      currentY += 10

      const rows = vocabList.value.filter(v => v.correct).map(v => [v.correct, v.incorrect || '—', v.comment || '—'])
      autoTable(doc, {
        startY: currentY, margin: { left: margin, right: margin },
        head: [['Recommended Usage', 'Incorrect Form Used', 'Contextual Instructions / Notes']],
        body: rows, theme: 'striped',
        headStyles: { fillColor: [63, 81, 181] }, styles: { fontSize: 9 }
      })
      currentY = (doc as any).lastAutoTable.finalY + 20
    }

    // APPEND TO THE COMPONENTS RENDERING FOR-EACH INSIDE generateClientSidePdfReport

    else if (comp.type === 'impressive_matrix' && impressiveList.value.length > 0) {
      if (currentY > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); currentY = 50; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(16, 185, 129) // Emerald Hex Matching Values
      doc.text("Impressive Language Implementations Captured", margin, currentY)
      currentY += 10

      const rows = impressiveList.value.filter(i => i.content).map(i => [i.content, i.comment || '—'])
      autoTable(doc, {
        startY: currentY, margin: { left: margin, right: margin },
        head: [['Advanced Language / Structures Highlight', 'Teacher Feedback / Analysis']],
        body: rows, theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }, styles: { fontSize: 9 }
      })
      currentY = (doc as any).lastAutoTable.finalY + 20
    }

    else if (comp.type === 'comment_block' && commentsList.value.length > 0) {
      if (currentY > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); currentY = 50; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(71, 85, 105)
      doc.text("Evaluation Diagnostic Remarks", margin, currentY)
      currentY += 12

      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(51, 65, 85)
      commentsList.value.filter(c => c.comment).forEach(item => {
        const textLines = doc.splitTextToSize(`• ${item.comment}`, contentWidth)
        textLines.forEach((l: string) => { 
          if (currentY > doc.internal.pageSize.getHeight() - 40) { doc.addPage(); currentY = 50; }
          doc.text(l, margin, currentY); currentY += 14; 
        })
      })
      currentY += 10
    }
  })

  doc.save(`Feedback_Report_${selectedStudent.value.initials}_${selectedCourse.value}.pdf`)
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

// Mocking Template Backend Payload Profiles Hydration on startup loop hooks
function seedMockTemplateBlueprints() {
  availableTemplates.value = [
    {
      template_id: "tpl_presentation_v1",
      name: "Standard Oral Presentation Diagnostic Review",
      structure: {
        components: [
          { id: "p1", type: "paragraph", text: "This standardized schema targets public speaking presentation metrics, technical fluency parameters, and audience design parameters." },
          { id: "topic", type: "select", label: "Presentation Evaluation Topic Focus", options: ["Professional Thesis Project", "Corporate Financial Review", "Technical System Pitch"] },
          { id: "positives", type: "checkbox_group", label: "Demonstrated Proficiencies", options: ["Excellent vocal modulation and baseline delivery speeds.", "Slide designs backed assertions efficiently with clear data.", "Demonstrated command over targeted specialized professional domain language strings."] },
          { id: "notes", type: "textarea", label: "Teacher Freeform Observational Commentary Notes" },
          { id: "errors", type: "error_matrix" },
          { id: "vocab", type: "vocab_notebook" }
        ]
      }
    },
    {
      template_id: "tpl_midterm_v1",
      name: "Mid-Semester Performance Evaluation Matrix",
      structure: {
        components: [
          { id: "p1", type: "paragraph", text: "Use this form matrix to issue comprehensive mid-semester workbook checkpoints observations rules." },
          { id: "overall_assessment", type: "textarea", label: "General Course Standing Summary Analysis", rows: 4 },
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
  
  // Simulated error codes configuration array bounds mapping elements loading
  errorCodes.value = ["TNS_1 Past Simple Choice", "PREP_4 Incorrect Spatial Preposition", "COND_2 Conditional Clause Construction Error"]
})

// Mirror store roster lists directly inside execution variables bounds maps
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
</style>