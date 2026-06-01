<template>
  <v-container fluid class="pa-6 max-width-game-container min-vh-80 d-flex align-center justify-center">
    
    <div v-if="!gameStarted && !gameComplete" class="text-center w-100" style="max-width: 680px;">
      <v-card variant="flat" border class="pa-6 rounded-xl bg-slate-50 border-slate-200">
        <div class="d-flex justify-center mb-4">
          <v-img
            src="/images/banners/GraphGenerator.png"
            class="tile-image"
            cover
            max-width="400"
          />
        </div>
        <p class="text-body-2 font-weight-bold text-indigo mb-2">
          Classroom Challenge
        </p>
        
        <div v-if="!isStudentMode" class="text-caption text-slate-500 line-height-md mb-6">
          Student: 
          <span class="font-monospace bg-white px-2 py-1 rounded border font-weight-bold text-slate-700 ml-1">
            {{ activeStudentWebId || 'No Student Loaded' }}
          </span>
        </div>

        <v-divider class="mb-6 border-slate-200" />

        <div class="text-left mb-6">
          <label class="text-overline font-weight-black text-slate-400 d-block mb-2 tracking-wider">
            Select Challenge Tier
          </label>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-card 
                variant="flat" border 
                :class="selectedLevel === 'easy' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white'"
                class="pa-3 rounded-lg cursor-pointer transition-all d-flex align-center"
                @click="selectedLevel = 'easy'"
              >
                <v-icon :color="selectedLevel === 'easy' ? 'indigo' : 'slate-400'" class="mr-2">
                  {{ selectedLevel === 'easy' ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}
                </v-icon>
                <span class="text-caption font-weight-bold text-slate-700 leading-tight">Intermediate Mode</span>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card 
                variant="flat" border 
                :class="selectedLevel === 'hard' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white'"
                class="pa-3 rounded-lg cursor-pointer transition-all d-flex align-center"
                @click="selectedLevel = 'hard'"
              >
                <v-icon :color="selectedLevel === 'hard' ? 'indigo' : 'slate-400'" class="mr-2">
                  {{ selectedLevel === 'hard' ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}
                </v-icon>
                <span class="text-caption font-weight-bold text-slate-700 leading-tight">Advanced Mode</span>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <v-card variant="flat" border class="pa-4 bg-white border-slate-200 rounded-lg text-left mb-6">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 font-weight-bold text-slate-800">Time Pressure</div>
              <div class="text-caption text-slate-400">Max. 25 seconds per round!</div>
            </div>
            <v-switch v-model="useTimer" inset hide-details color="indigo" density="compact" />
          </div>
        </v-card>

        <div class="d-flex justify-space-between ga-3">
          <v-btn variant="outlined" color="grey-darken-2" size="large" class="font-weight-black rounded-xl text-none" :to="{ name: 'teacher-tools' }">
            Cancel
          </v-btn>
          <v-btn 
            color="indigo-darken-1" 
            size="large" 
            elevation="1" 
            class="text-white font-weight-black rounded-xl text-none" 
            @click="startGame"
          >
            Launch Challenge
          </v-btn>
        </div>
      </v-card>
    </div>

    <div v-else-if="gameStarted" class="w-100 py-4" style="max-width: 850px;">
      
      <div class="d-flex flex-column sm-flex-row align-start sm-align-center justify-space-between mb-4 px-2 ga-2">
        <div class="d-flex align-center text-caption font-weight-bold text-slate-500">
          <v-icon icon="mdi-account-circle" size="small" class="mr-1" />
          <span v-if="!isStudentMode">Student: <span class="text-indigo ml-1 font-monospace">{{ activeStudentWebId }}</span></span>
          <span v-else class="text-indigo">Self-Practice Session</span>
          <span class="text-slate-300 mx-2">|</span>
          <span class="text-xxs font-weight-bold text-slate-400 uppercase">Tier: {{ selectedLevel === 'easy' ? 'Int' : 'Adv' }}</span>
        </div>

        <div v-if="isStudentMode" class="bg-indigo-50 border border-indigo-100 rounded-lg pa-2 text-xxs text-indigo-900 font-weight-medium line-height-tight max-width-checklist">
          📌 <strong>Task Checklist:</strong> Spoken X/Y axes titles parameters verification + requested verb modified cleanly to match temporal constraint rules.
        </div>
        
        <div v-if="useTimer" class="d-flex align-center">
          <v-progress-circular :model-value="timerProgress" :size="40" :width="4" :color="timeLeft <= 4 ? 'error' : 'indigo'" class="font-weight-black font-monospace text-caption">
            {{ timeLeft }}
          </v-progress-circular>
        </div>
      </div>

      <v-card class="mx-auto rounded-2xl border border-slate-200 mb-6 overflow-hidden" elevation="3">
        <v-row no-gutters>
          <v-col cols="12" md="7" class="pa-6 bg-white d-flex align-center justify-center position-relative" style="min-height: 380px;">
            <div v-show="!isFlipped || !isStudentMode" class="w-100 position-relative" style="height: 320px;">
              <canvas ref="chartCanvasRef"></canvas>
            </div>

            <div v-if="isStudentMode && isFlipped" class="w-100 d-flex flex-column justify-center align-center text-center pa-6 bg-slate-50 absolute-fill-container animate-fade-in">
              <v-avatar color="indigo-lighten-5" size="56" class="mb-3">
                <v-icon icon="mdi-school" color="indigo" size="28" />
              </v-avatar>
              <h4 class="text-subtitle-2 font-weight-black text-slate-800 mb-2">Target Conjugation Guide</h4>
              <v-card variant="flat" border class="pa-4 bg-white rounded-xl border-slate-200 w-100 text-left mb-4">
                <div class="d-flex justify-space-between mb-1"><span class="text-caption text-slate-400">Infinitive base:</span><span class="font-monospace text-body-2 font-weight-bold text-slate-800">{{ prompt?.verbMetadata.inf }}</span></div>
                <div class="d-flex justify-space-between mb-1"><span class="text-caption text-slate-400">Past simple frame:</span><span class="font-monospace text-body-2 font-weight-bold text-indigo-darken-1">{{ prompt?.verbMetadata.ps }}</span></div>
                <div class="d-flex justify-space-between"><span class="text-caption text-slate-400">Past participle frame:</span><span class="font-monospace text-body-2 font-weight-bold text-amber-darken-3">{{ prompt?.verbMetadata.pp }}</span></div>
              </v-card>
              <span class="text-xxs font-weight-medium text-slate-400">Ensure your spoken trend description accurately integrated these parameter values.</span>
            </div>
          </v-col>

          <v-col cols="12" md="5" class="pa-6 bg-slate-50 border-s border-slate-100 d-flex flex-column justify-center position-relative">
            <div class="text-overline font-weight-bold text-slate-400 tracking-widest mb-1">Target Language</div>
            
            <div class="mb-4">
              <span class="text-xxs font-weight-black text-slate-400 uppercase d-block mb-1">Verb</span>
              <v-chip color="indigo-darken-1" size="large" class="text-white font-weight-black px-4 shadow-sm text-uppercase font-monospace">
                {{ prompt?.verb }}
              </v-chip>
            </div>

            <div class="mb-4">
              <span class="text-xxs font-weight-black text-slate-400 uppercase d-block mb-1">Time Frame</span>
              <v-chip color="amber-darken-2" size="large" class="text-white font-weight-black px-4 shadow-sm text-uppercase">
                {{ prompt?.category }}
              </v-chip>
            </div>

            <v-divider class="my-2 border-slate-200" />
            
            <div v-if="isStudentMode" class="mt-2 w-100">
              <v-btn 
                block size="large" :color="isFlipped ? 'grey-darken-1' : 'indigo-darken-1'" class="text-white font-weight-black rounded-xl text-none"
                :prepend-icon="isFlipped ? 'mdi-chart-line' : 'mdi-eye'" @click="isFlipped = !isFlipped"
              >
                {{ isFlipped ? 'Show Chart graph' : 'Reveal Answer verification' }}
              </v-btn>
              <v-btn v-if="isFlipped" block size="large" variant="outlined" color="indigo" class="font-weight-black rounded-xl text-none mt-3" append-icon="mdi-arrow-right" @click="advanceStudentPractice">
                Next Graph
              </v-btn>
            </div>
            
            <div v-else class="text-xxs text-slate-400 font-weight-medium leading-normal">
              ℹ️ Evaluate student performance parameters manually using the console board dashboard below.
            </div>
          </v-col>
        </v-row>
      </v-card>

      <div class="px-2 mb-6">
        <div class="d-flex justify-space-between align-center text-caption font-weight-bold text-slate-400 mb-1 tracking-wider">
          <span>PROGRESS</span>
          <span class="font-monospace text-slate-600">{{ promptCounter }} / {{ totalRounds }} GRAPHS</span>
        </div>
        <v-progress-linear :model-value="progressValue" height="8" color="indigo" bg-color="slate-100" rounded />
      </div>

      <v-card v-if="!isStudentMode" variant="flat" border class="pa-4 bg-slate-50 border-slate-200 rounded-xl">
        <div class="text-overline text-center font-weight-black text-slate-400 tracking-widest d-block mb-3">Teacher Controls</div>
        <div class="d-flex justify-center flex-wrap ga-3">
          <v-btn color="success" variant="elevated" size="large" min-width="140" class="font-weight-black rounded-lg text-none" prepend-icon="mdi-check-circle" @click="evaluate('right')">Correct</v-btn>
          <v-btn color="error" variant="elevated" size="large" min-width="140" class="font-weight-black rounded-lg text-none" prepend-icon="mdi-close-circle" @click="evaluate('wrong')">Incorrect</v-btn>
          <v-btn color="grey-darken-2" variant="flat" size="large" min-width="140" class="text-white font-weight-black rounded-lg text-none" prepend-icon="mdi-help-circle-outline" @click="evaluate('unclear')">Unsure</v-btn>
        </div>
      </v-card>
    </div>

    <div v-else class="text-center w-100" style="max-width: 600px;">
      <v-card variant="flat" border class="pa-6 rounded-xl border-slate-200 bg-white">
        <div class="text-overline font-weight-black text-slate-400 tracking-widest mb-1">Session Complete</div>
        <h2 class="text-h4 font-weight-black text-slate-800 mb-6">Evaluation Results</h2>

        <v-row dense class="mb-6">
          <v-col cols="12">
            <v-card variant="flat" class="pa-4 rounded-xl bg-slate-50 border d-flex align-center justify-space-between">
              <span class="text-subtitle-2 font-weight-bold text-slate-500">Overall Accuracy Rate</span>
              <span class="text-h4 font-weight-black font-monospace text-slate-900">{{ score }}%</span>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card variant="flat" border class="pa-3 rounded-lg border-emerald-100 bg-emerald-50/30 text-center">
              <div class="text-emerald-700 font-weight-black text-h5">{{ rightCount }}</div>
              <div class="text-xs font-weight-bold text-emerald-600 uppercase tracking-wide">Correct</div>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card variant="flat" border class="pa-3 rounded-lg border-rose-100 bg-rose-50/30 text-center">
              <div class="text-rose-700 font-weight-black text-h5">{{ wrongCount }}</div>
              <div class="text-xs font-weight-bold text-rose-600 uppercase tracking-wide">Incorrect</div>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card variant="flat" border class="pa-3 rounded-lg border-slate-200 bg-slate-50 text-center">
              <div class="text-slate-700 font-weight-black text-h5">{{ unclearCount }}</div>
              <div class="text-xs font-weight-bold text-slate-500 uppercase tracking-wide">Unsure</div>
            </v-card>
          </v-col>
        </v-row>

        <div v-if="flaggedPrompts.length && !isStudentMode" class="text-left mb-6">
          <div class="text-overline font-weight-black text-rose-500 tracking-wider mb-2 d-flex align-center">
            <v-icon icon="mdi-alert-circle-outline" size="small" class="mr-1" />
            Flagged Items for Immediate Review
          </div>
          <v-card variant="flat" border max-height="180" class="overflow-y-auto rounded-lg border-slate-200 bg-slate-50 pa-1">
            <v-list density="compact" bg-color="transparent">
              <v-list-item v-for="(p, i) in flaggedPrompts" :key="i" class="px-3 min-height-dense">
                <template v-slot:prepend>
                  <v-icon icon="mdi-close" color="rose-500" size="14" class="mr-2" />
                </template>
                <span class="text-caption font-weight-bold text-slate-700">
                  {{ p.question }} <span class="text-slate-400 font-weight-regular">({{ p.verb }} - {{ p.category }})</span>
                </span>
              </v-list-item>
            </v-list>
          </v-card>
        </div>

        <v-divider class="mb-6 border-slate-200" />

        <div class="d-flex flex-column sm-flex-row ga-3 justify-center">
          <v-btn color="indigo-darken-1" size="large" class="text-white font-weight-black rounded-xl text-none" prepend-icon="mdi-refresh" @click="resetGame">Replay Session</v-btn>
          <v-btn variant="outlined" color="grey-darken-2" size="large" block class="font-weight-black rounded-xl text-none" prepend-icon="mdi-account-switch" :to="{ name: 'teacher-tools' }">Back to Tools</v-btn>
        </div>
      </v-card>
    </div>

  </v-container>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="1000" class="text-center">
    <span class="font-weight-black tracking-widest uppercase text-caption">{{ snackbar.message }}</span>
  </v-snackbar>

  <v-dialog v-model="saving" persistent width="160">
    <v-card class="d-flex justify-center align-center pa-6 rounded-xl bg-white">
      <v-progress-circular indeterminate size="44" width="4" color="indigo" />
      <span class="text-xxs font-weight-black tracking-widest text-slate-400 mt-3 uppercase">Saving Log</span>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import api from "@/axios"
import Chart from "chart.js/auto"

const route = useRoute()
const userStore = useUserStore()
const props = defineProps<{
  studentMode?: boolean
  student?: string
}>()

const isStudentMode = computed(() => {
  // 1. Check if the prop was passed (for direct embedding)
  if (props.studentMode === true) return true;

  // 2. Check the URL query string (Defensive check for string "true")
  if (route.query.studentMode === "true") return true;

  // 3. Check the UserStore role
  return userStore.isStudentAccount; 
});

const activeStudentWebId = computed(() => {
  if (props.student) return props.student
  return (route.query.student as string) || ""
})

const selectedLevel = ref<"easy" | "hard">("easy")
const isFlipped = ref(false)

// Precise Control Tense Dictionaries Mappings Schema
const TIME_FRAMES = {
  finished: ["in 2022", "from 2014 to 2018", "last year"],
  unfinished: ["so far this year", "since 2022", "in the last 5 years"]
}

// Full Irregular Forms Vocabulary Matrix
const STRUCTURAL_VERBS = {
  verbs_up: {
    easy: [
      { inf: "increase", ps: "increased", pp: "increased" },
      { inf: "go up", ps: "went up", pp: "gone up" },
      { inf: "climb", ps: "climbed", pp: "climbed" },
      { inf: "explode", ps: "exploded", pp: "exploded" },
      { inf: "rise", ps: "rose", pp: "risen" },
      { inf: "grow", ps: "grew", pp: "grown" },
      { inf: "jump", ps: "jumped", pp: "jumped" }
    ],
    hard: [
      { inf: "shoot up", ps: "shot up", pp: "shot up" },
      { inf: "skyrocket", ps: "skyrocketed", pp: "skyrocketed" }
    ]
  },
  verbs_down: {
    easy: [
      { inf: "go down", ps: "went down", pp: "gone down" },
      { inf: "drop", ps: "dropped", pp: "dropped" },
      { inf: "plunge", ps: "plunged", pp: "plunged" },
      { inf: "collapse", ps: "collapsed", pp: "collapsed" },
      { inf: "fall", ps: "fell", pp: "fallen" },
      { inf: "decrease", ps: "decreased", pp: "decreased" }
    ],
    hard: [
      { inf: "shrink", ps: "shrank", pp: "shrunk" },
      { inf: "slide", ps: "slid", pp: "slid" }
    ]
  },
  verbs_flat: {
    easy: [
      { inf: "fluctuate", ps: "fluctuated", pp: "fluctuated" },
      { inf: "remain steady", ps: "remained steady", pp: "remained steady" },
      { inf: "stay the same", ps: "stayed the same", pp: "stayed the same" }
    ],
    hard: [
      { inf: "range", ps: "ranged", pp: "ranged" }
    ]
  }
}

// 20-Theme Expanded Presentation Array Configuration
const CHART_THEMES = [
  { title: "Corporate Net Revenue Metrics", yAxis: "Revenue (in USD)", vector: "verbs_up" },
  { title: "Quarterly Overhead Expenditure Run-rates", yAxis: "Expenses (in EUR)", vector: "verbs_down" },
  { title: "Aggregated Gross Steel Output", yAxis: "Volume (in Tons)", vector: "verbs_flat" },
  { title: "Weekly Commercial Cargo Shipping Weights", yAxis: "Mass (in Metric Tons)", vector: "verbs_up" },
  { title: "Monthly Software License Delivery Assets", yAxis: "Volume (in Units)", vector: "verbs_up" },
  { title: "Global Supply Chain Grain Storage Inventory", yAxis: "Weight (in Tons)", vector: "verbs_down" },
  { title: "Crude Petroleum Daily Transport Yields", yAxis: "Volume (in Barrels)", vector: "verbs_flat" },
  { title: "Raw Automotive Manufacturing Unit Assemblies", yAxis: "Output (in Units)", vector: "verbs_up" },
  { title: "International Coffee Bean Bulk Freightage", yAxis: "Weight (in Kilograms)", vector: "verbs_down" },
  { title: "Aggregated Regional Cloud Cluster Transactions", yAxis: "Operations (in Units)", vector: "verbs_flat" },
  { title: "Biomedical Vaccine Shipment Loadings", yAxis: "Volume (in Vials)", vector: "verbs_up" },
  { title: "Retail E-Commerce Finished Product Deliveries", yAxis: "Packages (in Units)", vector: "verbs_up" },
  { title: "Industrial Aluminum Extrusion Foundry Run", yAxis: "Weight (in Tons)", vector: "verbs_down" },
  { title: "Renewable Hydropower Station Current Inflow", yAxis: "Volume (in Liters)", vector: "verbs_flat" },
  { title: "Continental Consumer Electronics Distribution", yAxis: "Value (in CHF)", vector: "verbs_up" },
  { title: "Textile Spinning Cotton Raw Materials Consumption", yAxis: "Weight (in Bales)", vector: "verbs_down" },
  { title: "Urban Residential Scrap Recycling Collections", yAxis: "Mass (in Tons)", vector: "verbs_flat" },
  { title: "High-Performance Compute Server Component Batches", yAxis: "Hardware (in Units)", vector: "verbs_up" },
  { title: "Aviation Liquid Kerosene Engine Fuel Imports", yAxis: "Volume (in Gallons)", vector: "verbs_down" },
  { title: "Global Microchip Wafer Foundry Allocations", yAxis: "Silicon (in Units)", vector: "verbs_flat" }
]

const gameStarted = ref(false)
const gameComplete = ref(false)
const saving = ref(false)
const promptCounter = ref(0)
const totalRounds = ref(15)
const remainingCount = ref(totalRounds.value)

const rightCount = ref(0)
const wrongCount = ref(0)
const unclearCount = ref(0)
const hasAnyAnswer = ref(false)

const chartCanvasRef = ref<HTMLCanvasElement | null>(null)
let activeChartInstance: Chart | null = null

const prompt = ref<{ 
  question: string; 
  verb: string; 
  correctAnswers: string[]; 
  category: string;
  verbMetadata: { inf: string; ps: string; pp: string };
  themeMetadata: any
} | null>(null)

const promptQueue = ref<any[]>([])
const shownPrompts = ref<any[]>([])

const useTimer = ref(false)
const timeLeft = ref(25)
let timerInterval: ReturnType<typeof setInterval> | null = null

const timerProgress = computed(() => (timeLeft.value / 25) * 100)
const progressValue = computed(() => (promptCounter.value / totalRounds.value) * 100)
const score = computed(() => rightCount.value !== 0 ? ((rightCount.value / totalRounds.value) * 100).toFixed(1) : 0)
const flaggedPrompts = computed(() => shownPrompts.value.filter(p => p.is_correct !== true))
const snackbar = reactive({ show: false, message: "", color: "success" })

function generateChartData(vectorType: string) {
  const pointsCount = 6
  const data: number[] = []
  let currentVal = Math.floor(Math.random() * 60) + 30

  for (let i = 0; i < pointsCount; i++) {
    data.push(currentVal)
    if (vectorType === "verbs_up") {
      currentVal += Math.floor(Math.random() * 15) + 3
    } else if (vectorType === "verbs_down") {
      currentVal -= Math.floor(Math.random() * 15) + 3
    } else {
      currentVal += Math.floor(Math.random() * 24) - 12
    }
    if (currentVal < 5) currentVal = 10
  }
  return data
}

async function renderDynamicGraph(theme: any, verb: string) {
  await nextTick()
  if (!chartCanvasRef.value) return

  if (activeChartInstance) {
    activeChartInstance.destroy()
    activeChartInstance = null
  }

  const ctx = chartCanvasRef.value.getContext("2d")
  if (!ctx) return

  const datasetValues = generateChartData(theme.vector)
  const chartType = Math.random() > 0.5 ? "line" : "bar"

  activeChartInstance = new Chart(ctx, {
    type: chartType,
    data: {
      labels: theme.xAxisLabels,
      datasets: [{
        label: theme.yAxis,
        data: datasetValues,
        backgroundColor: chartType === "bar" ? "rgba(79, 70, 229, 0.75)" : "transparent",
        borderColor: "#4f46e5",
        borderWidth: 4,
        tension: 0.35,
        pointBackgroundColor: "#e11d48",
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: theme.title, font: { size: 15, weight: "bold" }, color: "#0f172a" },
        legend: { display: false }
      },
      scales: {
        y: { grid: { color: "#f1f5f9" }, ticks: { color: "#64748b" }, beginAtZero: true },
        x: { grid: { display: false }, ticks: { color: "#64748b", font: { size: 10 } } }
      }
    }
  })
}

function startGame() {

  gameStarted.value = true
  gameComplete.value = false
  buildPromptQueue()
  loadNextPrompt()
}

function buildPromptQueue() {
  const queue = []
  const randomizedThemes = shuffle([...CHART_THEMES])
  
  for (let i = 0; i < totalRounds.value; i++) {
    const theme = randomizedThemes[i % randomizedThemes.length]
    
    const vectorGroup = (STRUCTURAL_VERBS as any)[theme.vector]
    const list = vectorGroup[selectedLevel.value] || vectorGroup["easy"]
    const verbObj = list[Math.floor(Math.random() * list.length)]
    
    const isFinishedTime = Math.random() > 0.5
    const categoryKey = isFinishedTime ? "finished" : "unfinished"
    const timeFrameStrings = TIME_FRAMES[categoryKey]
    const chosenTimeFrameLabel = timeFrameStrings[Math.floor(Math.random() * timeFrameStrings.length)]

    const targetXLabels = isFinishedTime 
      ? ["Jan", "Mar", "Jun", "Sep", "Nov", chosenTimeFrameLabel]
      : ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", chosenTimeFrameLabel]

    const augmentedTheme = {
      ...theme,
      xAxisLabels: targetXLabels
    }
    
    queue.push({
      question: augmentedTheme.title,
      verb: verbObj.inf,
      correctAnswers: [augmentedTheme.yAxis, chosenTimeFrameLabel],
      category: categoryKey.toUpperCase(),
      verbMetadata: verbObj,
      themeMetadata: augmentedTheme
    })
  }
  promptQueue.value = queue
}

function loadNextPrompt() {
  isFlipped.value = false
  if (!promptQueue.value.length || promptCounter.value >= totalRounds.value) {
    endGame()
    return
  }

  prompt.value = promptQueue.value.shift() || null
  promptCounter.value++
  remainingCount.value--

  if (prompt.value) {
    renderDynamicGraph(prompt.value.themeMetadata, prompt.value.verb)
  }

  if (useTimer.value) startTimer()
}

function advanceStudentPractice() {
  rightCount.value++ 
  loadNextPrompt()
}

function startTimer() {
  stopTimer()
  timeLeft.value = 25
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      stopTimer()
      if (isStudentMode.value) loadNextPrompt()
      else evaluate('unclear')
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function evaluate(type: "right" | "wrong" | "unclear") {
  stopTimer()
  hasAnyAnswer.value = true
  if (!prompt.value) return

  shownPrompts.value.push({
    question: prompt.value.question,
    verb: prompt.value.verb,
    correctAnswers: prompt.value.correctAnswers,
    category: prompt.value.category,
    is_correct: type === "right" ? true : type === "wrong" ? false : null,
  })

  if (type === "right") rightCount.value++
  else if (type === "wrong") wrongCount.value++
  else unclearCount.value++

  snackbar.message = type === "right" ? "Correct" : type === "wrong" ? "Incorrect" : "Passed"
  snackbar.color = type === "right" ? "success" : type === "wrong" ? "error" : "grey-darken-2"
  snackbar.show = true
  loadNextPrompt()
}

function resetCounts() {
  promptCounter.value = 0
  remainingCount.value = totalRounds.value
  rightCount.value = 0
  wrongCount.value = 0
  unclearCount.value = 0
  shownPrompts.value = []
}

function resetGame() {
  gameStarted.value = false
  gameComplete.value = false
  resetCounts()
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

async function endGame() {
  stopTimer()
  if (activeChartInstance) {
    activeChartInstance.destroy()
    activeChartInstance = null
  }

  if (isStudentMode.value) {
    gameComplete.value = true
    gameStarted.value = false
    return
  }

  if (!hasAnyAnswer.value) {
    gameComplete.value = false
    gameStarted.value = false
    return
  }
  
  gameComplete.value = true
  saving.value = true

  const rounds = shownPrompts.value.map((r, index) => ({
    question: `Describe Trend: ${r.question}`,
    pronoun: null, image: null, label: r.verb, correct_answer: r.correctAnswers, prompt_number: index + 1,
    user_answer: null, is_correct: r.is_correct, out_of_time: false, elapsed_time: null, typo: false, typo_requested: false, typo_accepted: null,
  }))

  const tierSuffix = selectedLevel.value === "easy" ? "Int" : "Adv"
  const payload = {
    game_name: `Graph Generator Challenge - ${tierSuffix}`,
    student_web_id: activeStudentWebId.value,
    total_rounds: totalRounds.value,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    total_time: 0, avg_time_per_prompt: 0,
    rounds,
  }

  try {
    await api.post("/other-games-sessions/", payload, { headers: { "Content-Type": "application/json" } })
  } catch (err) {
    console.error("Session sync transaction failed:", err)
  }
  saving.value = false
  gameStarted.value = false
}

onMounted(async () => {
  // Wait for user to be loaded if the store is empty
  if (!userStore.userLoaded) {
    await userStore.ensureUserLoaded();
  }
  console.log("Verified Student Mode:", isStudentMode.value);
});

onBeforeUnmount(() => {
  stopTimer()
  if (activeChartInstance) {
    activeChartInstance.destroy()
  }
})
</script>

<style scoped>
.max-width-game-container {
  max-width: 1200px;
  margin: 0 auto;
}
.max-width-checklist {
  max-width: 440px;
}
.absolute-fill-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.line-height-md {
  line-height: 1.5 !important;
}
.min-height-dense {
  min-height: 32px !important;
}
.text-xxs {
  font-size: 0.7rem !important;
}
.min-vh-100 {
  min-height: 100vh !important;
}
</style>