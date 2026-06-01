<template>
  <v-container fluid class="pa-6 max-width-game-container min-vh-80 d-flex align-center justify-center">
    
    <div v-if="!gameStarted && !gameComplete" class="text-center w-100" style="max-width: 680px;">
      <v-card variant="flat" border class="pa-6 rounded-xl bg-slate-50 border-slate-200">
        <div class="d-flex justify-center mb-4">
          <v-img src="/images/banners/GraphGenerator.png" class="tile-image" cover max-width="400" />
        </div>
        <p class="text-body-2 font-weight-bold text-indigo mb-2">Graph Generator Challenge</p>
        <span class="text-caption text-slate-400 d-block mb-6">Self-Guided Practice</span>

        <v-divider class="mb-6 border-slate-200" />

        <div class="text-left mb-6">
          <label class="text-overline font-weight-black text-slate-400 d-block mb-2 tracking-wider">Select a verb set</label>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-card variant="flat" border :class="selectedLevel === 'easy' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white'" class="pa-3 rounded-lg cursor-pointer transition-all d-flex align-center" @click="selectedLevel = 'easy'">
                <v-icon :color="selectedLevel === 'easy' ? 'indigo' : 'slate-400'" class="mr-2">
                  {{ selectedLevel === 'easy' ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank' }}
                </v-icon>
                <span class="text-caption font-weight-bold text-slate-700 leading-tight">Intermediate Mode</span>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card variant="flat" border :class="selectedLevel === 'hard' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white'" class="pa-3 rounded-lg cursor-pointer transition-all d-flex align-center" @click="selectedLevel = 'hard'">
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

        <v-btn block color="indigo-darken-1" size="large" elevation="1" class="text-white font-weight-black rounded-xl text-none" @click="startGame">
          Launch Practice
        </v-btn>
      </v-card>
    </div>

    <div v-else-if="gameStarted" class="w-100 py-2" style="max-width: 850px;">
      
      <div class="d-flex flex-column sm-flex-row align-start sm-align-center justify-space-between mb-3 px-2 ga-2">
        <div v-if="useTimer" class="d-flex align-center">
          <v-progress-circular :model-value="timerProgress" :size="40" :width="4" :color="timeLeft <= 4 ? 'error' : 'indigo'" class="font-weight-black font-monospace text-caption">
            {{ timeLeft }}
          </v-progress-circular>
        </div>
      </div>

      <div class="d-flex justify-center mb-3">
        <v-chip
          link
          color="indigo-darken-1"
          variant="tonal"
          class="font-weight-black px-4 py-2 text-none rounded-xl tracking-wide tap-hint-badge animate-pulse"
          prepend-icon="mdi-rotate-3d-variant"
          @click="isFlipped = !isFlipped"
        >
          {{ isFlipped ? 'Click card to view chart graph' : 'Click card to flip & check solution' }}
        </v-chip>
      </div>

      <div class="flashcard-scene" @click="isFlipped = !isFlipped">
        <div class="flashcard-card" :class="{ 'is-card-flipped': isFlipped }">
          
          <div class="flashcard-face flashcard-front mx-auto rounded-2xl border border-slate-200 overflow-hidden elevation-4 bg-white">
            <v-row no-gutters class="fill-height">
              <v-col cols="12" md="9" class="pa-6 bg-white d-flex flex-column justify-center align-center position-relative" style="min-height: 380px;">
                <div class="w-100 position-relative" style="height: 280px;">
                  <canvas ref="chartCanvasRef"></canvas>
                </div>
                <div class="w-100 mt-2 bg-slate-900 text-white py-2 px-4 rounded-xl d-flex align-center justify-between shadow-sm">
                  <span class="text-xxs font-weight-black uppercase tracking-wider text-slate-400">Time frame:</span>
                  <span class="font-monospace font-weight-black text-body-2 text-amber-lighten-2 tracking-wide uppercase">{{ activeTimelineLabel }}</span>
                </div>
              </v-col>
              
              <v-col cols="12" md="3" class="pa-6 bg-slate-50 border-s border-slate-100 d-flex flex-column justify-center">
                <div class="text-overline font-weight-bold text-slate-400 tracking-widest mb-2">Prompt</div>
                <div class="mb-5">
                  <span class="text-xxs font-weight-black text-slate-400 uppercase d-block mb-2">Verb</span>
                  <v-chip color="indigo-darken-1" size="large" class="text-white font-weight-black px-4 shadow-sm font-monospace">{{ prompt?.verb }}</v-chip>
                </div>
                <div class="mb-5">
                  <span class="text-xxs font-weight-black text-slate-400 uppercase d-block mb-2">Time frame</span>
                  <v-chip color="amber-darken-2" size="large" class="text-white font-weight-black px-4 shadow-sm">{{ prompt?.category }}</v-chip>
                </div>
              </v-col>
            </v-row>
          </div>

          <div class="flashcard-face flashcard-back mx-auto rounded-2xl border border-slate-200 overflow-hidden elevation-4 bg-slate-50 pa-6 d-flex flex-column justify-center">
            <div class="text-center w-100" style="max-width: 600px; margin: 0 auto;">
              <h4 class="text-subtitle-1 font-weight-black text-slate-900 mb-1">Target Sentence</h4>
              <p class="text-caption text-slate-400 mb-3">Compare your answer to this example:</p>

              <v-card variant="flat" border class="pa-4 bg-indigo-50 border-indigo-200 rounded-xl text-left mb-3" @click.stop>
                <span class="text-xxs font-weight-black text-indigo-700 uppercase tracking-wider d-block mb-1">Target answer</span>
                <p class="text-body-1 font-weight-bold text-slate-900 font-monospace leading-normal mb-0">"{{ structuredRemediationSentence }}"</p>
              </v-card>

              <v-card variant="flat" border class="pa-3 bg-white rounded-lg border-slate-200 text-left mb-1" @click.stop>
                <div class="d-flex justify-space-between mb-1"><span class="text-caption text-slate-400">Infinitive:</span><span class="font-monospace text-body-2 font-weight-bold text-slate-800">{{ prompt?.verbMetadata.inf }}</span></div>
                <div v-if="prompt?.category === 'FINISHED'" class="d-flex justify-space-between"><span class="text-caption text-slate-400">Correct conjugation:</span><span class="font-monospace text-body-2 font-weight-bold text-indigo-darken-1">{{ prompt?.verbMetadata.ps }} (Past Simple)</span></div>
                <div v-else class="d-flex justify-space-between"><span class="text-caption text-slate-400">Correct conjugation:</span><span class="font-monospace text-body-2 font-weight-bold text-amber-darken-3">has/have {{ prompt?.verbMetadata.pp }} (Present Perfect)</span></div>
              </v-card>
            </div>
          </div>

        </div>
      </div>

      <v-row class="mt-4 align-center px-1" dense>
        <v-col cols="4" class="text-left">
          <div class="text-caption font-weight-bold text-slate-400 tracking-wider uppercase">
            Progress: <span class="font-monospace text-slate-700 font-weight-black ml-1">{{ promptCounter }} / {{ totalRounds }}</span>
          </div>
        </v-col>
        
        <v-col cols="8" class="text-right d-flex justify-end ga-2">
          <v-btn variant="outlined" color="indigo" class="rounded-xl font-weight-black text-none" size="large" :prepend-icon="'mdi-rotate-3d-variant'" @click.stop="isFlipped = !isFlipped">
            {{ 'Flip Card' }}
          </v-btn>
          
          <v-btn color="indigo" size="large" class="text-white font-weight-black rounded-xl text-none px-6" append-icon="mdi-arrow-right" @click.stop="advanceStudentPractice">
            Next Card
          </v-btn>
        </v-col>

        <v-col cols="12" class="mt-2">
          <v-progress-linear :model-value="progressValue" height="6" color="indigo" bg-color="slate-100" rounded />
        </v-col>
      </v-row>
    </div>

    <div v-node v-else class="text-center w-100" style="max-width: 500px; margin-top: 10vh;">
      <v-card variant="flat" border class="pa-6 rounded-xl border-slate-200 bg-white">
        <v-avatar color="indigo-lighten-5" size="64" class="mb-4"><v-icon icon="mdi-emoticon-happy-outline" color="indigo" size="32" /></v-avatar>
        <h2 class="text-h5 font-weight-black text-slate-800 mb-2">Practice Session Finished!</h2>
        <p class="text-caption text-slate-400 mb-6">Remember that reviewing irregular verb forms is a key part of mastering this exercise!</p>
        <v-divider class="mb-6" />
        <v-btn block color="indigo" size="large" class="text-white font-weight-black rounded-xl text-none" @click="resetGame">Practice Again</v-btn>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onBeforeUnmount } from "vue"
import Chart from "chart.js/auto"
import { TIME_FRAMES, STRUCTURAL_VERBS, CHART_THEMES } from "@/assets/data/graphGameData"

const selectedLevel = ref<"easy" | "hard">("easy")
const gameStarted = ref(false)
const gameComplete = ref(false)
const promptCounter = ref(0)
const totalRounds = ref(15)
const remainingCount = ref(totalRounds.value)
const isFlipped = ref(false)

const chartCanvasRef = ref<HTMLCanvasElement | null>(null)
let activeChartInstance: Chart | null = null
const prompt = ref<any>(null)
const promptQueue = ref<any[]>([])

const useTimer = ref(false)
const timeLeft = ref(25)
let timerInterval: ReturnType<typeof setInterval> | null = null

const timerProgress = computed(() => (timeLeft.value / 25) * 100)
const progressValue = computed(() => (promptCounter.value / totalRounds.value) * 100)
const activeTimelineLabel = computed(() => prompt.value?.correctAnswers[1] || "")

const structuredRemediationSentence = computed(() => {
  if (!prompt.value) return ""
  const subject = prompt.value.themeMetadata.subject || "the values"
  const v = prompt.value.verbMetadata
  const val1 = prompt.value.plottedValues.initial
  const val2 = prompt.value.plottedValues.terminal
  const timeline = activeTimelineLabel.value

  if (prompt.value.category === "FINISHED") {
    return `${capitalize(subject)} ${v.ps} from ${val1} to ${val2} ${timeline}.`
  } else {
    const finalVerb = v.inf === "go up" ? "gone up" : v.inf === "go down" ? "gone down" : (v.inf === "rise" ? "risen" : `${v.inf === "shoot up" ? "shot up" : (v.inf === "shrink" ? "shrunk" : (v.inf === "slide" ? "slid" : v.pp))}`)
    const verbPhrase = ["increase","go up","climb","explode","rise","grow","jump","shoot up","skyrocket"].includes(v.inf) && v.inf !== "go up" && v.inf !== "rise" && v.inf !== "grow" ? `${v.ps}` : finalVerb
    const perfectInflection = v.inf.includes("remain") || v.inf.includes("stay") || v.inf.includes("fluctuate") || v.inf.includes("range") || v.inf.includes("drop") || v.inf.includes("plunge") || v.inf.includes("collapse") || v.inf.includes("decrease") || v.inf.includes("fall") ? v.pp : verbPhrase
    return `${capitalize(subject)} has ${perfectInflection} from ${val1} to ${val2} ${timeline}.`
  }
})

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

function generateIsolatedChartData(vectorType: string) {
  const data = Array(6).fill(null)
  let val1 = Math.floor(Math.random() * 40) + 45, val2 = val1
  if (vectorType === "verbs_up") val2 = val1 + Math.floor(Math.random() * 25) + 15
  else if (vectorType === "verbs_down") val2 = val1 - Math.floor(Math.random() * 25) - 15
  else val2 = val1 + (Math.floor(Math.random() * 10) - 5)
  if (val2 < 5) val2 = 12
  data[1] = val1; data[4] = val2
  return { dataset: data, initial: val1, terminal: val2 }
}

async function renderDynamicGraph(theme: any, verb: string, chartType: 'line' | 'bar') {
  await nextTick(); if (!chartCanvasRef.value) return
  if (activeChartInstance) { activeChartInstance.destroy(); activeChartInstance = null }
  const ctx = chartCanvasRef.value.getContext("2d"); if (!ctx) return

  const backgroundColors = theme.generatedPoints.map((v: any) => v !== null ? "#f43f5e" : "rgba(99, 102, 241, 0.15)")
  const borderColors = theme.generatedPoints.map((v: any) => v !== null ? "#e11d48" : "#6366f1")

  activeChartInstance = new Chart(ctx, {
    type: chartType,
    data: {
      labels: theme.xAxisLabels,
      datasets: [{
        label: theme.yAxis, data: theme.generatedPoints.map((v: any) => v === null && chartType === 'bar' ? 0 : v),
        borderColor: chartType === 'line' ? "#6366f1" : borderColors, backgroundColor: chartType === 'line' ? "transparent" : backgroundColors,
        borderWidth: 4, tension: 0, spanGaps: chartType === 'line', pointBackgroundColor: "#f43f5e", pointRadius: chartType === 'line' ? 9 : 0
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { title: { display: true, text: theme.title, font: { size: 15, weight: "bold" }, color: "#0f172a" }, legend: { display: false } },
      scales: { y: { grid: { color: "#f1f5f9" }, ticks: { color: "#64748b" }, beginAtZero: true }, x: { grid: { display: false }, ticks: { display: false } } }
    }
  })
}

function startGame() { gameStarted.value = true; gameComplete.value = false; buildPromptQueue(); loadNextPrompt() }

function buildPromptQueue() {
  const queue = []; const randomizedThemes = shuffle([...CHART_THEMES])
  for (let i = 0; i < totalRounds.value; i++) {
    const theme = randomizedThemes[i % randomizedThemes.length]
    const vectorGroup = (STRUCTURAL_VERBS as any)[theme.vector]
    const list = vectorGroup[selectedLevel.value] || vectorGroup["easy"]
    const verbObj = list[Math.floor(Math.random() * list.length)]
    const isFinishedTime = Math.random() > 0.5
    const categoryKey = isFinishedTime ? "finished" : "unfinished"
    const chosenTimeFrameLabel = TIME_FRAMES[categoryKey][Math.floor(Math.random() * TIME_FRAMES[categoryKey].length)]
    const chartCalculations = generateIsolatedChartData(theme.vector)
    const targetedChartType = Math.random() > 0.5 ? 'line' : 'bar'

    queue.push({
      question: theme.title, verb: verbObj.inf, correctAnswers: [theme.yAxis, chosenTimeFrameLabel], category: categoryKey.toUpperCase(),
      verbMetadata: verbObj, themeMetadata: { ...theme, xAxisLabels: ["A", "Initial", "C", "D", "Current", "F"], generatedPoints: chartCalculations.dataset },
      plottedValues: { initial: chartCalculations.initial, terminal: chartCalculations.terminal }, chartType: targetedChartType
    })
  }
  promptQueue.value = queue
}

function loadNextPrompt() {
  isFlipped.value = false
  if (!promptQueue.value.length || promptCounter.value >= totalRounds.value) { gameComplete.value = true; gameStarted.value = false; return }
  prompt.value = promptQueue.value.shift() || null
  promptCounter.value++; remainingCount.value--
  if (prompt.value) renderDynamicGraph(prompt.value.themeMetadata, prompt.value.verb, prompt.value.chartType)
  if (useTimer.value) startTimer()
}

function advanceStudentPractice() { loadNextPrompt() }

function startTimer() {
  stopTimer(); timeLeft.value = 25
  timerInterval = setInterval(() => { timeLeft.value--; if (timeLeft.value <= 0) { stopTimer(); isFlipped.value = true } }, 1000)
}
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null } }
function resetGame() { gameStarted.value = false; gameComplete.value = false; promptCounter.value = 0; }
// Knuth shuffle alignment sequence
function shuffle<T>(array: T[]): T[] { const a = [...array]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }; return a }

onBeforeUnmount(() => { stopTimer(); if (activeChartInstance) activeChartInstance.destroy() })
</script>

<style scoped>
.max-width-game-container { max-width: 1200px; margin: 0 auto; }
.max-width-checklist { max-width: 440px; }

/* 🌟 EXTENDED 3D FLIP ARENA PLATFORM INTERFACES */
.flashcard-scene { 
  width: 100%; 
  perspective: 2000px; 
  cursor: pointer;
}
.flashcard-card { 
  width: 100%; 
  height: 460px;
  position: relative; 
  transform-style: preserve-3d; 
  transition: transform 0.75s cubic-bezier(0.19, 1, 0.22, 1); 
}
.flashcard-card.is-card-flipped { 
  transform: rotateY(180deg); 
}
.flashcard-face { 
  width: 100%; 
  height: 460px;
  backface-visibility: hidden; 
  -webkit-backface-visibility: hidden; 
}
.flashcard-back { 
  position: absolute; 
  top: 0; 
  left: 0; 
  right: 0; 
  bottom: 0; 
  z-index: 2; 
  transform: rotateY(180deg); 
}

/* UI Micro Animations */
.tap-hint-badge {
  transition: transform 0.2s ease;
}
.tap-hint-badge:hover {
  transform: scale(1.04);
}
.animate-pulse {
  animation: pulse 2.5s infinite ease-in-out;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
.text-xxs { font-size: 0.7rem !important; }
</style>