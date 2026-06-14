<template>
  <v-dialog v-model="internalDialogValue" fullscreen transition="dialog-bottom-transition">
    <v-card class="bg-slate-50">
      <!-- Top Action Bar -->
      <v-toolbar color="slate-900" class="px-6 text-white" flat>
        <v-icon icon="mdi-palette-swatch-outline" class="mr-3" />
        <v-toolbar-title class="font-weight-black text-h6">
          Blueprint Studio: Feedback Template Configurator
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" color="white" @click="internalDialogValue = false" />
      </v-toolbar>

      <v-container fluid class="pa-6 max-width-container">
        <v-row>
          <!-- LEFT UTILITY PANEL: FIELD SELECTION INGREDIENTS -->
          <v-col cols="12" md="3">
            <v-card class="pa-5 mb-4 rounded-xl border" variant="flat" color="white">
              <div class="text-subtitle-1 font-weight-bold text-slate-800 mb-2">1. Template Blueprint Basics</div>
              <v-text-field 
                v-model="templateName" 
                label="Template Name (e.g., Final Presentation Review)" 
                variant="outlined" 
                class="mb-4" 
                hide-details 
              />
              
              <v-divider class="my-4" />
              
              <div class="text-subtitle-1 font-weight-bold text-slate-800 mb-1">2. Add Component Blocks</div>
              <p class="text-caption text-slate-400 mb-4">Click an ingredient item to push it down into your interactive form draft layout.</p>
              
              <v-row dense>
                <v-col cols="12">
                  <v-btn block variant="tonal" color="slate-700" prepend-icon="mdi-card-text-outline" class="text-none justify-start rounded-lg text-body-2 font-weight-bold" @click="addComponent('paragraph')">Static Instruction Paragraph</v-btn>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <v-btn block variant="tonal" color="indigo" prepend-icon="mdi-form-textbox" class="text-none justify-start rounded-lg text-body-2 font-weight-bold" @click="addComponent('text_input')">Short Text String Entry</v-btn>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <v-btn block variant="tonal" color="indigo" prepend-icon="mdi-form-textarea" class="text-none justify-start rounded-lg text-body-2 font-weight-bold" @click="addComponent('textarea')">Long Text Area Comment Block</v-btn>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <v-btn block variant="tonal" color="teal" prepend-icon="mdi-form-select" class="text-none justify-start rounded-lg text-body-2 font-weight-bold" @click="addComponent('select')">Dropdown Selector Menu</v-btn>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <v-btn block variant="tonal" color="purple" prepend-icon="mdi-checkbox-multiple-marked-outline" class="text-none justify-start rounded-lg text-body-2 font-weight-bold" @click="addComponent('checkbox_group')">Multiple Checkbox Group Selection</v-btn>
                </v-col>
                
                <v-col cols="12" class="mt-4">
                  <v-divider class="mb-3" />
                  <div class="text-xxs font-weight-bold text-slate-400 text-uppercase tracking-wider mb-2">ERROS AND VOCAB FIELDS</div>
                </v-col>
                
                <v-col cols="12">
                  <v-btn block variant="flat" color="amber-darken-3" prepend-icon="mdi-alert-circle-outline" class="text-white text-none justify-start rounded-lg text-body-2 font-weight-bold" @click="addComponent('error_matrix')">Systemic Error Fields</v-btn>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <v-btn block variant="flat" color="indigo-darken-2" prepend-icon="mdi-notebook-outline" class="text-white text-none justify-start rounded-lg text-body-2 font-weight-bold" @click="addComponent('vocab_notebook')">Vocab Fields</v-btn>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <v-btn block variant="flat" color="emerald-darken-2" class="bg-emerald text-white text-none justify-start rounded-lg text-body-2 font-weight-bold" prepend-icon="mdi-star-circle-outline" @click="addComponent('impressive_matrix')">Impressive Language Tracker</v-btn>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <v-btn block variant="flat" color="blue-grey-darken-2" class="text-white text-none justify-start rounded-lg text-body-2 font-weight-bold" prepend-icon="mdi-comment-text-multiple-outline" @click="addComponent('comment_block')">Freeform Teacher Remarks</v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <!-- MIDDLE PANEL: WORKSPACE CANVAS VIEW -->
          <v-col cols="12" :md="previewBlobUrl ? '5' : '9'">
            <v-card class="pa-6 rounded-xl border" variant="flat" color="white" min-height="650">
              <div class="d-flex align-center justify-space-between border-b pb-4 mb-4">
                <div>
                  <div class="text-h6 font-weight-black text-slate-900">3. Canvas Layout Composition View</div>
                  <div class="text-caption text-slate-400 mt-0.5">Configure individual attributes parameters on your loaded template fields.</div>
                </div>
                <div class="d-flex gap-2">
                  <v-btn
                    color="teal-darken-1" variant="tonal" class="font-weight-bold text-none px-4 rounded-lg mr-2"
                    prepend-icon="mdi-eye-refresh-outline" :disabled="!componentsList.length"
                    @click="generateLiveDummyPdfPreview"
                  >
                    {{ previewBlobUrl ? 'Update Preview' : 'Preview Sample PDF' }}
                  </v-btn>
                  
                  <v-btn
                    color="indigo-darken-1" variant="elevated" class="text-white font-weight-black rounded-lg text-none px-5"
                    prepend-icon="mdi-content-save-move" :loading="saving" :disabled="!componentsList.length || !templateName.trim()"
                    @click="saveTemplateBlueprint"
                  >
                    Save Template
                  </v-btn>
                </div>
              </div>

              <div v-if="!componentsList.length" class="d-flex flex-column align-center justify-center py-12 text-slate-400">
                <v-icon icon="mdi-toy-brick-plus-outline" size="64" class="mb-3 text-slate-200" />
                <div class="text-body-2 font-weight-bold">Your Template Blueprint Workspace is Blank</div>
                <div class="text-caption text-slate-400">Click elements in the left selector panel to add items.</div>
              </div>

              <div v-else>
                <div v-for="(item, idx) in componentsList" :key="item.id" class="pa-4 bg-slate-50 border rounded-xl mb-4 relative">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <v-chip size="small" variant="flat" color="slate-800" class="font-weight-black text-none font-monospace text-xxs">
                      ELEMENT_TYPE: {{ item.type.toUpperCase() }}
                    </v-chip>
                    <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click="componentsList.splice(idx, 1)" />
                  </div>

                  <v-textarea v-if="item.type === 'paragraph'" v-model="item.text" label="Boilerplate Context or Instructions Paragraph Text" variant="outlined" rows="2" bg-color="white" hide-details />

                  <v-text-field v-if="['text_input', 'textarea', 'select', 'checkbox_group'].includes(item.type)" v-model="item.label" label="Form Label Text String" variant="outlined" density="compact" bg-color="white" hide-details />

                  <v-text-field 
                    v-if="['select', 'checkbox_group'].includes(item.type)" 
                    v-model="item.rawOptionsString" 
                    label="Choice Options (separate options using a semicolon)" 
                    placeholder="Excellent; Fair; Review Needed" 
                    variant="outlined" 
                    density="compact" 
                    class="mt-3" 
                    bg-color="white" 
                    hide-details 
                  />

                  <div v-if="item.type === 'error_matrix'" class="text-caption font-weight-bold text-amber-darken-3 pa-2 bg-amber-50 rounded-lg border border-amber-200">
                    <v-icon icon="mdi-lock-outline" class="mr-1" size="x-small" /> Systemic Errors Tracker Row Matrix connected. Injects error tracking interfaces and telemetry feeds cleanly.
                  </div>
                  <div v-if="item.type === 'vocab_notebook'" class="text-caption font-weight-bold text-indigo-darken-3 pa-2 bg-indigo-50 rounded-lg border border-indigo-200">
                    <v-icon icon="mdi-lock-outline" class="mr-1" size="x-small" /> Vocabulary Feedback Feed assigned. Maps student vocab tracking items straight back to database profiles tables.
                  </div>
                  <div v-if="item.type === 'impressive_matrix'" class="text-caption font-weight-bold text-emerald border border-emerald-lighten-3 pa-2 bg-emerald-lighten-5 rounded-lg">
                    <v-icon icon="mdi-star-circle-outline" class="mr-1" size="x-small" /> Impressive Language Matrix active. Pushes captured records directly to the <strong>Impressive</strong> table.
                  </div>
                  <div v-if="item.type === 'comment_block'" class="text-caption font-weight-bold text-slate-600 border border-slate-200 pa-2 bg-slate-100 rounded-lg">
                    <v-icon icon="mdi-comment-text-multiple-outline" class="mr-1" size="x-small" /> Custom Evaluation Comment Block active. Captures high-priority freeform commentary text data pointing to the <strong>Comment</strong> table endpoint.
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- RIGHT PANEL: MODERNISED HIGH-STABILITY PDF EMBED PORTAL -->
          <v-col cols="12" md="4" v-if="previewBlobUrl">
            <v-card class="pa-4 rounded-xl border fill-height d-flex flex-column" variant="flat" color="slate-100" style="min-height: 650px;">
              <div class="d-flex align-center justify-space-between mb-3 flex-none">
                <div class="text-overline font-weight-black text-slate-600 tracking-wider">
                  <v-icon icon="mdi-file-find-outline" class="mr-1" size="small" /> Simulated Report Preview
                </div>
                <v-btn icon="mdi-close-circle-outline" size="small" variant="text" color="slate-400" @click="previewBlobUrl = null" />
              </div>
              
              <div class="flex-grow-1 border rounded-xl overflow-hidden bg-white relative shadow-inner">
                <object 
                  :data="previewBlobUrl" 
                  type="application/pdf" 
                  width="100%" 
                  height="100%" 
                  style="position: absolute; top: 0; left: 0;"
                >
                  <embed :src="previewBlobUrl" type="application/pdf" />
                </object>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import api from '@/axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'template-created'])

const templateName = ref('')
const componentsList = ref<any[]>([])
const saving = ref(false)
const previewBlobUrl = ref<string | null>(null)

const internalDialogValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function addComponent(type: string) {
  const uniqId = `field_${type}_${Math.random().toString(36).substring(2, 7)}`
  const schemaBlock: Record<string, any> = {
    id: uniqId,
    type,
    label: `Custom ${type.replace('_', ' ').toUpperCase()} Field Node`
  }

  if (type === 'paragraph') schemaBlock.text = "Instruction boilerplate copy text placeholder data."
  if (type === 'select' || type === 'checkbox_group') schemaBlock.rawOptionsString = "Option Alpha; Option Beta; Option Gamma"

  componentsList.value.push(schemaBlock)
}

const saveTemplateBlueprint = async () => {
  if (!templateName.value.trim() || !componentsList.value.length) return

  saving.value = true
  try {
    const finalizedComponents = componentsList.value.map(comp => {
      const copy = { ...comp }
      if (['select', 'checkbox_group'].includes(copy.type) && copy.rawOptionsString) {
        copy.options = copy.rawOptionsString.split(';').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        delete copy.rawOptionsString
      }
      return copy
    })

    const apiPayload = {
      name: templateName.value.trim(),
      structure: {
        version: "1.0",
        components: finalizedComponents
      }
    }

    const res = await api.post('/feedback-templates/', apiPayload)
    emit('template-created', res.data)
    
    templateName.value = ''
    componentsList.value = []
    internalDialogValue.value = false
  } catch (err) {
    console.error("Operational crash processing layout builder write:", err)
    alert("Operational validation crash reported by template manager server view.")
  } finally {
    saving.value = false
  }
}

function generateLiveDummyPdfPreview() {
  if (!componentsList.value.length) return

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const margin = 40
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - (margin * 2)
  let currentY = 50

  doc.setFillColor(63, 81, 181) 
  doc.rect(margin, currentY, contentWidth, 8, 'F')
  currentY += 30

  doc.setFontSize(22); doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'bold')
  doc.text(templateName.value.trim() || "Draft Layout Template Title", margin, currentY)
  
  currentY += 18
  doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(148, 163, 184)
  doc.text(`[SIMULATED PREVIEW] Student: ST (SAMPLE_WEB_ID) | Date: ${new Date().toLocaleDateString()}`, margin, currentY)
  currentY += 25

  componentsList.value.forEach((comp: any) => {
    if (currentY > doc.internal.pageSize.getHeight() - 80) { doc.addPage(); currentY = 50; }

    if (comp.type === 'paragraph') {
      doc.setFontSize(10); doc.setFont('helvetica', 'italic'); doc.setTextColor(100, 116, 139)
      const mockTxt = comp.text || "Instruction boilerplate copy text placeholder data."
      const lines = doc.splitTextToSize(mockTxt, contentWidth)
      lines.forEach((l: string) => { doc.text(l, margin, currentY); currentY += 14; })
      currentY += 10
    }

    else if (comp.type === 'text_input' || comp.type === 'textarea') {
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 41, 59)
      doc.text(comp.label || "Untitled Input Field", margin, currentY)
      currentY += 15

      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(71, 85, 105)
      const sampleAnswer = comp.type === 'text_input'
        ? "Sample quick text response string parameter."
        : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip."
      
      const lines = doc.splitTextToSize(sampleAnswer, contentWidth)
      lines.forEach((l: string) => { doc.text(l, margin + 5, currentY); currentY += 14; })
      currentY += 12
    }

    else if (comp.type === 'select') {
      doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(71, 85, 105)
      const optionsArray = comp.rawOptionsString ? comp.rawOptionsString.split(';').map((s: string) => s.trim()) : ["Default Choice"]
      doc.text(`${comp.label || 'Selector Field'}: ${optionsArray[0]}`, margin, currentY)
      currentY += 18
    }

    else if (comp.type === 'checkbox_group') {
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 41, 59)
      doc.text(comp.label || "Multi Selection Group", margin, currentY)
      currentY += 15

      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(71, 85, 105)
      const optionsArray = comp.rawOptionsString ? comp.rawOptionsString.split(';').map((s: string) => s.trim()).slice(0, 2) : ["Sample Option"]
      optionsArray.forEach((opt: string) => {
        doc.text(`• [X] ${opt}`, margin + 10, currentY)
        currentY += 14
      })
      currentY += 10
    }

    else if (comp.type === 'error_matrix') {
      currentY += 10
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(185, 28, 28)
      doc.text("Grammatical Telemetry & Errors (Sample Grid Data)", margin, currentY)
      currentY += 10

      const dummyErrors = [
        ["TNS_1 Past Simple Choice", "2x", '• "Yesterday I have gone to class instead of went."\n• "She has seen him last Tuesday."'],
        ["PREP_4 Incorrect Preposition", "1x", '• "He arrived on Switzerland at midnight."']
      ]

      autoTable(doc, {
        startY: currentY, margin: { left: margin, right: margin },
        head: [['Error Category Code', 'Count', 'Evidence Strings Log']],
        body: dummyErrors, theme: 'grid',
        headStyles: { fillColor: [239, 68, 68] }, styles: { fontSize: 9 }
      })
      currentY = (doc as any).lastAutoTable.finalY + 20
    }

    else if (comp.type === 'vocab_notebook') {
      if (currentY > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); currentY = 50; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(63, 81, 181)
      doc.text("Vocabulary Diagnostic Recommendations (Sample Grid Data)", margin, currentY)
      currentY += 10

      const dummyVocab = [
        ["Implement a blueprint", "Make an architecture design", "Use the specialized verb form we reviewed in Unit 2."],
        ["Pioneering framework", "Very old antique classic layout", "Advanced contextual descriptor option alternative."]
      ]

      autoTable(doc, {
        startY: currentY, margin: { left: margin, right: margin },
        head: [['Recommended Usage', 'Incorrect Form Overridden', 'Contextual Instructions / Notes']],
        body: dummyVocab, theme: 'striped',
        headStyles: { fillColor: [63, 81, 181] }, styles: { fontSize: 9 }
      })
      currentY = (doc as any).lastAutoTable.finalY + 20
    }

    else if (comp.type === 'impressive_matrix') {
      if (currentY > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); currentY = 50; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(16, 185, 129)
      doc.text("Impressive Language Implementations (Sample Grid Data)", margin, currentY)
      currentY += 10

      const dummyImpressive = [
        ["Conspicuous structural transformation", "Excellent use of sophisticated passive formatting descriptive adjectives."]
      ]

      autoTable(doc, {
        startY: currentY, margin: { left: margin, right: margin },
        head: [['Advanced Language Structure Highlight', 'Teacher Praise Analysis']],
        body: dummyImpressive, theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] }, styles: { fontSize: 9 }
      })
      currentY = (doc as any).lastAutoTable.finalY + 20
    }

    else if (comp.type === 'comment_block') {
      if (currentY > doc.internal.pageSize.getHeight() - 100) { doc.addPage(); currentY = 50; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(71, 85, 105)
      doc.text("Evaluation Diagnostic Remarks (Sample)", margin, currentY)
      currentY += 12

      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(51, 65, 85)
      const textLines = doc.splitTextToSize("• This is an example of a core standalone teacher commentary remark paragraph block printed onto the output document layout.", contentWidth)
      textLines.forEach((l: string) => { doc.text(l, margin, currentY); currentY += 14; })
      currentY += 10
    }
  })

  try {
    previewBlobUrl.value = doc.output('datauristring')
  } catch (pdfStringErr) {
    console.error("Failed encoding inline base64 preview frame stream:", pdfStringErr)
  }
}

watch(internalDialogValue, (isOpen) => {
  if (!isOpen) {
    previewBlobUrl.value = null
  }
})
</script>

<style scoped>
.max-width-container { max-width: 1400px; margin: 0 auto; }
.relative { position: relative; }
</style>