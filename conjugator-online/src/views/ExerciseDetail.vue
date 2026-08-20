<template>
  <v-container class="py-8 max-w-exercise text-slate-800">
    <div v-if="errorEntry">
      <v-window class="mt-12">
      <!-- ========================================================= -->
      <!--                   PHASE A: PRE-EXERCISE                   -->
      <!-- ========================================================= -->
      <v-window-item v-if="phase === 'pre'" class="fade-in">
        <!-- Error Hero Banner -->
        <v-card class="pa-6 mb-6 pre-hero border" rounded="xl" elevation="0">
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div>
              <v-chip color="teal-darken-2" variant="flat" class="text-white font-weight-black font-mono mb-2">
                Error {{ errorCode }}
              </v-chip>
              <h1 class="text-h5 text-capitalize font-weight-black text-slate-900 mt-1">{{ errorEntry.description }}</h1>
            </div>
            <v-avatar color="teal-lighten-5" class="text-teal-darken-2" size="56" variant="flat">
              <v-icon size="28">mdi-text-box-search-outline</v-icon>
            </v-avatar>
          </div>
        </v-card>

        <!-- Descriptive Metadata Breakdown List Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="7">
            <v-card class="pa-5 border bg-white fill-height" rounded="xl" elevation="0">
              <div class="text-subtitle-1 font-weight-black text-slate-800 mb-2">Description</div>
              <p class="text-body-2 text-slate-600 line-height-relaxed mb-4">
                <v-icon size="16" class="me-2">mdi-arrow-right</v-icon>{{ errorEntry.recommendation }}
              </p>
              
              <v-divider class="my-4 opacity-40" />
              
              <div class="text-subtitle-2 font-weight-black text-slate-800 mb-1">Reference</div>
              <div class="text-body-2 text-slate-600 d-flex align-center">
                <v-icon size="16" class="me-1 text-teal">mdi-bookmark-outline</v-icon>
                See the full grammar book explanation of <span class="ms-1 font-weight-bold text-teal-darken-3 text-underline" v-html="errorEntry.reference"></span>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card class="pa-5 border bg-slate-50-fluid fill-height" rounded="xl" elevation="0">
              <div class="text-subtitle-2 font-weight-black text-slate-500 uppercase tracking-wider mb-2">Examples</div>
              <div class="text-body-2 font-weight-medium text-slate-700 italic font-mono bg-white pa-3 border rounded-lg">
                {{ errorEntry.examples }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Navigation & CTA Button Controls -->
        <div class="d-flex align-center ga-4 flex-wrap">
          <v-btn
            v-if="hasExercises"
            color="teal"
            size="large"
            variant="flat"
            class="text-none font-weight-black text-white rounded-xl px-6"
            prepend-icon="mdi-play-circle-outline"
            @click="startExercises"
          >
            Start Practical Exercises
          </v-btn>
          <div v-else class="text-orange-darken-3 bg-orange-lighten-5 pa-3 border border-orange-lighten-4 rounded-xl font-weight-bold text-body-2 d-flex align-center">
            <v-icon start class="me-1">mdi-alert-circle-outline</v-icon> No active custom exercises mapped to this error signature block yet.
          </div>

          <v-btn to="/exercises" variant="outlined" color="slate-500" size="large" class="text-none font-weight-bold rounded-xl px-6">
            Back to Directory
          </v-btn>
        </div>
      </v-window-item>


      <!-- ========================================================= -->
      <!--                 PHASE B: DURING-EXERCISE                  -->
      <!-- ========================================================= -->
      <v-window-item v-if="phase === 'during'" class="fade-in">
        <!-- Progress Metric HUD Header -->
        <div class="d-flex align-center justify-space-between mb-2 text-caption font-weight-bold text-slate-500">
          <span class="font-mono">QUESTION {{ currentIndex + 1 }} OF {{ shuffledExercises.length }}</span>
          <span>COMPLETION: {{ Math.round(progressPercent) }}%</span>
        </div>

        <v-progress-linear
          :model-value="progressPercent"
          height="8"
          color="teal"
          rounded
          class="mb-6 shadow-xs"
        />

        <v-card class="pa-6 border bg-white shadow-xs" rounded="xl" elevation="0">
          <!-- Question Statement Segment -->
          <div class="text-h6 font-weight-bold text-slate-900 mb-6">
            {{ currentQuestion.item.question }}
          </div>

          <!-- INPUT FORM CONFIGURATOR Archetype 1: Single Mono String Input -->
          <div v-if="currentQuestion.item.type === 'text_mono' || currentQuestion.item.type === 'text_multi'" class="w-100 mb-4">
            <v-text-field
              v-model="currentAnswer"
              variant="outlined"
              density="comfortable"
              placeholder="Type your response answer here..."
              class="font-mono font-weight-bold rounded-lg"
              :disabled="showImmediateFeedback"
              hide-details
              @keyup.enter="handleEnterKeyOnInput"
            />

            <!-- 🌟 Visualized Feedback Tray for Text Inputs -->
            <v-expand-transition>
              <div v-if="showImmediateFeedback" class="mt-4">
                <div :class="result[currentIndex] ? 'bg-emerald-panel text-emerald-header border-emerald' : 'bg-red-panel text-red-header border-red'" class="pa-4 rounded-xl border d-flex align-center ga-3">
                  <v-avatar :color="result[currentIndex] ? 'green-darken-3' : 'red-darken-3'" size="28" class="text-white">
                    <v-icon size="16">{{ result[currentIndex] ? 'mdi-check' : 'mdi-close' }}</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-2 font-weight-black">{{ result[currentIndex] ? 'Excellent! Perfect response.' : 'Incorrect Entry.' }}</div>
                    <div class="text-caption opacity-90 mt-0.5">
                      Expected answer: <strong class="font-mono underline">{{ currentQuestion.item.type === 'text_mono' ? currentQuestion.item.answer : currentQuestion.item.answers.join(' / ') }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </v-expand-transition>
          </div>

          <!-- INPUT FORM CONFIGURATOR Archetype 2: Checkbox Multiselect -->
          <div v-if="currentQuestion.item.type === 'checkbox'" class="d-flex flex-column ga-3 mb-4">
            <div
              v-for="(ans, i) in currentQuestion.item.answers"
              :key="i"
              class="option-row-wrapper rounded-xl border transition-all pa-3 d-flex align-center"
              :class="showImmediateFeedback
                ? (ans[1] ? 'border-emerald bg-emerald-panel' : (currentAnswer.includes(ans[0]) ? 'border-red bg-red-panel' : 'bg-slate-50 opacity-60'))
                : (currentAnswer.includes(ans[0]) ? 'border-teal bg-teal-tight' : 'bg-white')"
            >
              <v-checkbox
                v-model="currentAnswer"
                :label="ans[0]"
                :value="ans[0]"
                density="compact"
                hide-details
                color="teal"
                :disabled="showImmediateFeedback"
                class="font-weight-medium text-slate-800 w-100"
              />
              <!-- Embedded explanation subtext strings -->
              <div v-if="showImmediateFeedback && ans[2]" class="text-caption font-weight-bold ml-auto px-4 text-slate-500">
                {{ ans[2] }}
              </div>
            </div>
          </div>

          <!-- INPUT FORM CONFIGURATOR Archetype 3: Radio Choice -->
          <v-radio-group
            v-if="currentQuestion.item.type === 'radio'"
            v-model="currentAnswer"
            density="comfortable"
            hide-details
            :disabled="showImmediateFeedback"
            class="mb-4"
          >
            <div class="d-flex flex-column ga-3 w-100">
              <div
                v-for="(label, val) in normalizeRadio(currentQuestion.item.answers)"
                :key="val"
                class="option-row-wrapper rounded-xl border transition-all pa-3"
                :class="showImmediateFeedback
                  ? (isRadioCorrect(currentQuestion.item, label) ? 'border-emerald bg-emerald-panel' : (currentAnswer === label ? 'border-red bg-red-panel' : 'bg-slate-50 opacity-60'))
                  : (currentAnswer === label ? 'border-teal bg-teal-tight' : 'bg-white')"
              >
                <div class="d-flex align-center w-100">
                  <v-radio :label="label" :value="label" color="teal" hide-details class="font-weight-medium text-slate-800" />
                  
                  <v-chip v-if="showImmediateFeedback && isRadioCorrect(currentQuestion.item, label)" color="green" size="x-small" variant="flat" class="text-white font-weight-bold ml-3">
                    Correct Option
                  </v-chip>
                </div>

                <!-- Immediate feedback explanation string -->
                <v-expand-transition>
                  <div v-if="showImmediateFeedback && currentAnswer === label && getRadioExplanation(currentQuestion.item, label)" class="text-caption text-slate-600 font-weight-medium mt-2 ps-8 border-l ml-3">
                    <v-icon size="12" class="me-1 text-slate-400">mdi-information-outline</v-icon>
                    {{ getRadioExplanation(currentQuestion.item, label) }}
                  </div>
                </v-expand-transition>
              </div>
            </div>
          </v-radio-group>

          <!-- Core Flow Execution Control CTA Button -->
          <v-btn
            :color="answered ? 'indigo' : 'teal'"
            size="large"
            variant="flat"
            class="text-none font-weight-black text-white rounded-xl px-8 mt-4 d-block"
            @click="handleButtonClick"
          >
            {{ answered ? (isLastQuestion ? "Complete & Finish" : "Next Question") : "Submit Answer" }}
            <v-icon end class="ms-1">{{ answered ? 'mdi-arrow-right' : 'mdi-checkbox-marked-circle-outline' }}</v-icon>
          </v-btn>
        </v-card>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2000" location="bottom" rounded="pill">
          <span class="font-weight-bold font-mono">{{ snackbar.text }}</span>
        </v-snackbar>
      </v-window-item>


      <!-- ========================================================= -->
      <!--                    PHASE C: POST-EXERCISE                 -->
      <!-- ========================================================= -->
      <v-window-item v-if="phase === 'post'" class="fade-in">
        <!-- Results Summary Score Dashboard Card -->
        <v-card class="pa-6 mb-8 text-center border position-relative overflow-hidden" rounded="xl" elevation="0" style="background: white;">
          <div class="bg-decoration-blob"></div>
          <div class="text-caption font-weight-bold text-slate-400 uppercase tracking-widest">Exercise Performance Profile</div>
          
          <div class="text-h1 font-weight-black mt-2 mb-1 font-mono tracking-tight" :class="scorePercent >= 70 ? 'text-green-darken-2' : 'text-orange-darken-3'">
            {{ scorePercent }}%
          </div>
          
          <v-chip :color="scorePercent >= 70 ? 'success' : 'warning'" variant="tonal" class="font-weight-bold px-4">
            {{ scorePercent >= 70 ? 'Competency Threshold Maintained' : 'Requires Structural Target Practice' }}
          </v-chip>

          <v-row class="mt-6 border-t pt-4 max-w-sm mx-auto" dense>
            <v-col cols="6" class="border-r">
              <div class="text-caption text-slate-400 font-weight-bold">CORRECT</div>
              <div class="text-h6 font-weight-black text-green-darken-3 font-mono">{{ rightCount }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption text-slate-400 font-weight-bold">ERRORS</div>
              <div class="text-h6 font-weight-black text-red-darken-3 font-mono">{{ wrongCount }}</div>
            </v-col>
          </v-row>
        </v-card>

        <h2 class="text-h5 font-weight-black text-slate-800 mb-4">Granular Verification Audit</h2>

        <div class="d-flex flex-column ga-4 mb-8">
          <v-card
            v-for="(q, idx) in shuffledExercises"
            :key="'r' + q.id"
            class="pa-5 border bg-white rounded-xl position-relative overflow-hidden"
            elevation="0"
          >
            <!-- Badge indicators left alignment bar status lines -->
            <div class="status-marker-line" :class="result[idx] ? 'bg-emerald' : 'bg-red'"></div>

            <div class="d-flex align-start justify-space-between w-100 flex-wrap ga-2">
              <div class="text-body-1 font-weight-bold text-slate-800 pr-4">
                <span class="font-mono text-slate-400 mr-2">Q{{ idx + 1 }}.</span>
                {{ q.item.question }}
              </div>
              <v-chip size="x-small" :color="result[idx] ? 'green' : 'red'" variant="flat" class="text-white font-weight-bold uppercase font-mono">
                {{ result[idx] ? 'Passed' : 'Missed' }}
              </v-chip>
            </div>

            <!-- Answer comparison matrix view block -->
            <v-row class="mt-3 bg-slate-50 pa-3 rounded-lg border mx-0" dense>
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-slate-400">YOUR SUBMISSION:</div>
                <div class="text-body-2 font-weight-black font-mono mt-0.5" :class="result[idx] ? 'text-green-darken-3' : 'text-red-darken-3'">
                  "{{ Array.isArray(userAnswers[idx]) ? userAnswers[idx].join(', ') : (userAnswers[idx] || '[Skipped / Blank]') }}"
                </div>
              </v-col>
              <v-col cols="12" sm="6" class="mt-2 mt-sm-0 ps-sm-4 border-l-sm">
                <div class="text-caption font-weight-bold text-slate-400">TARGET ANSWER:</div>
                <div class="text-body-2 font-weight-black font-mono text-slate-800 mt-0.5">
                  <span v-if="q.item.type === 'text_mono'">{{ q.item.answer }}</span>
                  <span v-else-if="q.item.type === 'text_multi'">{{ q.item.answers.join(' / ') }}</span>
                  <span v-else-if="q.item.type === 'checkbox'">
                    {{ q.item.answers.filter(a => a[1]).map(a => a[0]).join(', ') }}
                  </span>
                  <span v-else-if="q.item.type === 'radio'">
                    {{ q.item.answers.find(a => a[1])?.[0] || Object.keys(normalizeRadio(q.item.answers)).find(k => normalizeRadio(q.item.answers)[k] === true || isRadioCorrect(q.item, k)) }}
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </div>

        <!-- Restart or exit block button toggles -->
        <div class="d-flex align-center ga-4">
          <v-btn color="teal" variant="flat" size="large" class="text-none font-weight-black text-white rounded-xl px-6" prepend-icon="mdi-refresh" @click="restart">
            Practice Again
          </v-btn>
          <v-btn to="/exercises" variant="outlined" color="slate-500" size="large" class="text-none font-weight-bold rounded-xl px-6">
            Back to List Directory
          </v-btn>
        </div>
      </v-window-item>
    </v-window>
    </div>

    <!-- ERROR DEFINITION NOT FOUND IN DIRECTORY SCRIPTS -->
    <v-card v-else class="pa-8 text-center border border-dashed rounded-xl bg-white" elevation="0">
      <v-icon size="48" color="red-lighten-2" class="mb-2">mdi-database-alert-outline</v-icon>
      <h2 class="text-h5 font-weight-black text-slate-800">Linguistic Module Not Loaded</h2>
      <p class="text-body-2 text-slate-500 mt-1 mb-4">The error specification mapping key requested could not be packed into execution slots.</p>
      <v-btn to="/exercises" color="teal" variant="flat" size="small" class="text-none font-weight-bold text-white rounded-lg px-4">
        Return to Directory
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import api from "@/axios";
import { exerciseData } from "@/assets/scripts/exerciseData";
import { errorsData } from "@/assets/scripts/errorsData";

const emit = defineEmits(["exerciseOver"]);

const props = defineProps({
  errorCode: { type: String, required: true }
});

onMounted(() => {
  window.addEventListener("keydown", onEnterKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onEnterKey);
});

const roundsStore = ref([]);   
const startTime = ref(null);
const numRounds = ref(0);
const rightCount = ref(0);
const wrongCount = ref(0);

const errorEntry = errorsData[props.errorCode];

const exercises = computed(() => exerciseData[props.errorCode] || {});
const hasExercises = computed(() =>
  Object.prototype.hasOwnProperty.call(exerciseData, props.errorCode)
);

const phase = ref("pre");
const shuffledExercises = ref([]);
const userAnswers = ref({});
const result = ref({});

const currentIndex = ref(0);
const currentAnswer = ref("");

const snackbar = ref({
  show: false,
  color: "info",
  text: ""
});

const answered = ref(false); 
const showImmediateFeedback = computed(() => answered.value === true);

function shuffleArray(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const startExercises = () => {
  const entries = Object.entries(exercises.value).map(([id, item]) => ({ id, item }));
  shuffledExercises.value = shuffleArray(entries);

  userAnswers.value = {};
  result.value = {};
  currentIndex.value = 0;

  numRounds.value = shuffledExercises.value.length;
  rightCount.value = 0;
  wrongCount.value = 0;
  roundsStore.value = [];

  startTime.value = new Date();

  initializeCurrentAnswer();
  phase.value = "during";
};

const currentQuestion = computed(() => shuffledExercises.value[currentIndex.value]);

const isLastQuestion = computed(() =>
  currentIndex.value === shuffledExercises.value.length - 1
);

const progressPercent = computed(() =>
  shuffledExercises.value.length
    ? (currentIndex.value / shuffledExercises.value.length) * 100
    : 0
);

function initializeCurrentAnswer() {
  const item = currentQuestion.value.item;
  if (item.type === "checkbox") currentAnswer.value = [];
  else currentAnswer.value = "";
}

const normalizeRadio = answers => {
  if (Array.isArray(answers)) {
    const o = {};
    answers.forEach(a => (o[a[0]] = a[0]));
    return o;
  }
  return answers;
};

const isRadioCorrect = (item, value) => {
  if (Array.isArray(item.answers)) {
    return item.answers.find(a => a[0] === value)?.[1] === true;
  }
  return item.answers[value] === true;
};

const getRadioExplanation = (item, value) => {
  if (Array.isArray(item.answers)) {
    return item.answers.find(a => a[0] === value)?.[2] || "";
  }
  return "";
};

function onEnterKey(e) {
  if (e.key === "Enter") {
    // Intercept event triggers if active elements are within textarea/inputs
    const activeEl = document.activeElement;
    if (activeEl && activeEl.tagName === "INPUT") {
      e.preventDefault();
      handleButtonClick();
    }
  }
}

function handleEnterKeyOnInput() {
  handleButtonClick();
}

const handleButtonClick = () => {
  if (!answered.value) {
    submitSingleAnswer();     
    answered.value = true;
  } else {
    goToNextQuestion();       
  }
};

const submitSingleAnswer = () => {
  const { id, item } = currentQuestion.value;
  const idx = currentIndex.value;
  const ans = currentAnswer.value;

  let correct = false;

  if (item.type === "text_mono") {
    correct = String(ans).trim().toLowerCase() === String(item.answer).toLowerCase();
  } else if (item.type === "text_multi") {
    correct = item.answers.map(a => String(a).toLowerCase())
      .includes(String(ans).trim().toLowerCase());
  } else if (item.type === "checkbox") {
    const correctList = item.answers.filter(a => a[1]).map(a => a[0]);
    const user = Array.isArray(ans) ? ans.slice().sort() : [];
    correct = JSON.stringify(user) === JSON.stringify(correctList.sort());
  } else if (item.type === "radio") {
    correct = isRadioCorrect(item, ans);
  }

  result.value[idx] = correct;
  userAnswers.value[idx] = ans;

  if (correct) rightCount.value += 1;
  else wrongCount.value += 1;

  roundsStore.value.push({
    round_number: idx + 1,
    question_type: item.type,
    question_text: item.question,
    expected: item.type === "text_mono" ? item.answer : item.answers,
    user_answer: ans,
    is_correct: correct,
    out_of_time: false,
    elapsed_time: null,
  });

  snackbar.value = {
    show: true,
    color: correct ? "teal-darken-2" : "red-darken-2",
    text: correct ? "✓ Correct answer!" : "✕ Incorrect response."
  };
};

const goToNextQuestion = () => {
  if (isLastQuestion.value) {
    phase.value = "post";
    finishExercise();
    return;
  }

  currentIndex.value++;
  initializeCurrentAnswer();
  answered.value = false;
};

async function finishExercise() {
  const finishedAt = new Date();
  const totalSeconds = startTime.value
    ? Math.floor((finishedAt - startTime.value) / 1000)
    : 0;

  const avgTime = numRounds.value > 0
    ? totalSeconds / numRounds.value
    : 0;

  const payload = {
    error_code: props.errorCode,   
    total_rounds: numRounds.value,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: startTime.value ? startTime.value.toISOString() : new Date().toISOString(),
    finished_at: finishedAt.toISOString(),
    total_time: totalSeconds,
    avg_time_per_round: parseFloat(avgTime.toFixed(2)),
    rounds: roundsStore.value,
  };

  try {
    await api.post("/exercise-sessions/", payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Status error uploading execution maps:", error);
  }

  emit("exerciseOver", payload);
}

const scorePercent = computed(() => {
  const vals = Object.values(result.value);
  if (!vals.length) return 0;
  return Math.round((vals.filter(v => v).length / vals.length) * 100);
});

const restart = () => {
  phase.value = "pre";
};
</script>

<style scoped>
.max-w-exercise {
  max-width: 900px;
  margin: 0 auto;
}

.pre-hero {
  background: linear-gradient(135deg, #f8fafc 0%, #f0fdfa 100%);
  border-color: #cbd5e1 !important;
}

.bg-slate-50-fluid {
  background-color: #f8fafc !important;
}

.option-row-wrapper {
  border: 1px solid #e2e8f0 !important;
}

/* 🌟 MAXIMUM CLARITY EXERCISE LOOKUP STATES PACKS */
.border-emerald {
  border-color: #10b981 !important;
  border-width: 1.5px !important;
}
.bg-emerald-panel {
  background-color: #ecfeff !important; /* soft mint layout shade */
}
.text-emerald-header {
  color: #064e3b !important;
}

.border-red {
  border-color: #ef4444 !important;
  border-width: 1.5px !important;
}
.bg-red-panel {
  background-color: #fef2f2 !important; /* soft failure pink shade */
}
.text-red-header {
  color: #7f1d1d !important;
}

.border-teal { border-color: #0d9488 !important; }
.bg-teal-tight { background-color: #f0fdfa !important; }
.bg-red-tight { background-color: #fff5f5 !important; }

.status-marker-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 5px;
}
.bg-emerald { background-color: #10b981; }
.bg-red { background-color: #ef4444; }

.font-mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
}

.line-height-relaxed {
  line-height: 1.6;
}

.bg-decoration-blob {
  position: absolute;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(20, 184, 166, 0.06) 0%, rgba(255,255,255,0) 70%);
  top: -40px;
  right: -40px;
  pointer-events: none;
}

.vertical-middle {
  vertical-align: middle !important;
}
.text-underline {
  text-decoration: underline;
}
.border-l-sm {
  @media (min-width: 600px) {
    border-left: 1px solid #e2e8f0 !important;
  }
}
.fade-in {
  animation: easeSlideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes easeSlideUp {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>