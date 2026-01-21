<template>
  <v-container fluid class="pa-3 d-flex justify-center">

    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="p-4" width="620" min-height="640" elevation="3">

      <!-- START SCREEN -->
      <div v-if="!gameStarted" class="p-3">
        <div class="d-flex justify-center">
          <v-img src="/images/banners/ParallelUniverse.png" max-width="400" />
        </div>
        <div class="d-flex justify-center">
            <v-list density="compact">
          <v-list-item>
            <template #prepend><v-icon icon="mdi-counter" /></template>
            <v-list-item-title><strong>{{ numRounds }}</strong> rounds</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-timer-outline" /></template>
            <v-list-item-title><strong>{{ ROUND_SECONDS }} </strong> seconds per round</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-pencil" /></template>
            <v-list-item-title class="text-wrap">
              Type only the missing verb phrase.
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-controller" /></template>
            <v-list-item-title class="text-wrap">
              <strong>{{ typesLabel }} conditional</strong> with {{ verbSetLabel }} 
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-book-open-blank-variant" /></template>
            <v-list-item-title class="text-wrap">
              Do you need to review <a href="https://book.language-labs.ch/ch4#1st-2nd-conditionals" target="_blank">1st and 2nd</a> or <a href="https://book.language-labs.ch/ch4#past-perfect" target="_blank">3rd conditionals</a>? 
            </v-list-item-title>
          </v-list-item>
        </v-list>


        </div>
        
        <div class="d-flex justify-center" style="margin-top: 3rem;">
          <v-btn color="success" @click="begin" :disabled="!hasAnyPrompts">Start</v-btn>
        </div>

        <div v-if="!hasAnyPrompts" class="text-caption text-center mt-4">
          No prompts loaded. Go back and try again.
        </div>
        <div class="d-flex justify-center align-center w-100" style="margin-top: 2rem;">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0"  class="ms-3">
              <v-icon color="grey-darken-3" >mdi-arrow-left-circle</v-icon>
            </v-btn>
          </RouterLink>
        </div>
      </div>

      <!-- GAME -->
      <div v-else class="game-layout">

        <div v-if="!hasPrompt" class="p-6 text-center">
          <v-progress-circular indeterminate />
          <div class="text-caption mt-3">Loading prompts…</div>
        </div>

        <template v-else>
          <!-- TOP -->
          <div class="game-top">
            <div class="d-flex justify-space-between mb-2">
              <div>Round {{ currentRound + 1 }} / {{ numRounds }}</div>
              <div class="text-subtitle-2 timer-pill" :class="timerClass">⏱ {{ timeLeft }} s</div>
            </div>
          </div>

          <!-- MIDDLE -->
          <div class="game-middle mb-5">
            <v-card class="pa-3 my-4" elevation="3">

              <v-card-title class="d-flex justify-space-between align-center font-weight-medium">
                
                <span>{{ currentPrompt.conditional_type }} conditional = {{ conditionalLabel }}</span>
              </v-card-title>

              <v-card-text>
                <div class="d-flex ga-2 align-center justify-center" style="margin-top: 3rem;">
                  
                  <v-chip variant="flat" size="large" color="secondary" class="text-uppercase">
                     {{ currentPrompt.verb }}
                  </v-chip>
                  <v-chip
                    v-if="currentPrompt.negative"
                    size="large"
                    variant="flat"
                    color="error"
                  >
                    NEGATIVE
                  </v-chip>
                  
                </div>
              </v-card-text>

              <v-card-text class="text-wrap text-center font-italic" style="font-size: 1.2rem;">
                {{ currentPrompt.sentence }}
              </v-card-text>


              <div class="answer-spacing d-flex justify-center" ref="answerWrap" style="margin-top: 2rem; margin-bottom: 2rem;">
                <v-text-field
                  v-model="userAnswer"
                  label="Your answer"
                  hide-details
                  max-width="300px"
                  :disabled="inputLocked"
                  @keyup.enter="submit"
                />
              </div>

              <div class="d-flex justify-center mt-4" style="margin-bottom: 2rem;">
                <v-btn color="primary" @click="submit" :disabled="inputLocked">
                  Submit
                </v-btn>
              </div>
            </v-card>
          </div>

          <!-- BOTTOM -->
          <div class="game-bottom">
            <v-progress-linear :model-value="progressValue" height="10" class="mb-3" color="primary" />
            <div class="d-flex justify-space-between">
              <RouterLink :to="{ name: 'games' }">
                <v-btn icon elevation="0" class="ms-3">
                  <v-icon color="grey-darken-3">
                    mdi-arrow-left-circle
                  </v-icon>
                </v-btn>
              </RouterLink>
              <div class="d-flex justify-space-between align-center">
                <div class="me-4">✅ {{ rightCount }}</div>
                <div class="me-4">❌ {{ wrongCount }}</div>
                <div class="me-4">Remaining: {{ remaining }}</div>
              </div>
              
            </div>
          </div>
        </template>
      </div>
    </v-card>

    <!-- WRONG ANSWER DIALOG -->
    <v-dialog v-model="showWrongDialog" persistent max-width="520">
      <v-card @keydown.enter.prevent="acknowledgeWrong" color="yellow-lighten-2 pa-3">
        <v-card-title class="text-h6 mt-4">
          {{ lastOutOfTime ? "Time ran out" : "Wrong" }}
          <v-icon :icon="lastOutOfTime ? 'mdi-timer-off-outline' : 'mdi-emoticon-sad-outline'" />
        </v-card-title>

        <v-card-text>
          <p class="mb-2">
            <strong>{{ lastSentence }}</strong>
          </p>

          <p class="mb-2">
            Your answer: <strong>{{ lastUserAnswer || "—" }}</strong>
          </p>

          <p class="mb-0">
            Accepted answers:
            <strong>{{ lastAcceptedAnswers || "—" }}</strong>
          </p>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn ref="wrongOkButton" color="secondary" @click="acknowledgeWrong">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import api from "@/axios";
import { checkAnswer, getAcceptedAnswers } from "@/assets/scripts/parallel_universe/ParallelUniversePromptEngine";

const ROUND_SECONDS = 20;
const WARN_SECONDS = 9;
const DANGER_SECONDS = 3;

const props = defineProps({
  prompts: { type: Array, required: true },
  gameSettings: { type: Object, default: null },
});

const verbSetLabel = computed(() => {
  const v = props.gameSettings?.verbSet;

  if (v === "regular_essential") return "Reg + Essential irreg verbs";
  if (v === "regular_advanced") return "Reg + Advanced irreg verbs";
  if (v === "all") return "All prompts";

  return "—";
});

const typesLabel = computed(() => {
  const t = props.gameSettings?.conditionalTypes;

  if (!Array.isArray(t) || t.length === 0) return "—";

  const pretty = {
    first: "1st",
    second: "2nd",
    third: "3rd",
  };

  return t.map((x) => pretty[x] ?? x).join(", ");
});



const emit = defineEmits(["gameOver"]);

const timeLeft = ref(ROUND_SECONDS);
let timer = null;

const INPUT_COOLDOWN_MS = 600;
const inputLocked = ref(false);

const numRounds = computed(() => (Array.isArray(props.prompts) ? props.prompts.length : 0));
const hasAnyPrompts = computed(() => numRounds.value > 0);

const currentRound = ref(0);
const currentPrompt = computed(() => props.prompts?.[currentRound.value] || null);
const hasPrompt = computed(() => !!currentPrompt.value);

const startTime = ref(null);
const gameStarted = ref(false);

const userAnswer = ref("");

const rightCount = ref(0);
const wrongCount = ref(0);
const remaining = ref(0);

const resultsStore = ref([]);

/* ---------------- Conditional label ---------------- */
const conditionalLabel = computed(() => {
  const p = currentPrompt.value;
  const LABELS = {
    "first": "REALITY",
    "second": "unreal present/future",
    "third": "unreal past"
  }
  if (!p) return "";
  return LABELS[p.conditional_type];
});

/* ---------------- Focus (every round) ---------------- */
const answerWrap = ref(null);

async function focusAnswer() {
  await nextTick();
  requestAnimationFrame(() => {
    if (inputLocked.value) return;
    const input = answerWrap.value?.querySelector?.("input");
    input?.focus?.();
    input?.select?.();
  });
}

watch(currentRound, async () => {
  if (!gameStarted.value) return;
  await nextTick();
  focusAnswer();
});

/* ---------------- Timer ---------------- */
function startTimer() {
  stopTimer();
  timeLeft.value = ROUND_SECONDS;

  timer = setInterval(() => {
    if (!hasPrompt.value) return;
    if (showWrongDialog.value || inputLocked.value) return;

    timeLeft.value--;

    if (timeLeft.value <= 0) {
      timeLeft.value = 0;
      handleTimeOut();
    }
  }, 1000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

function handleTimeOut() {
  if (!hasPrompt.value) return;
  if (inputLocked.value) return;

  inputLocked.value = true;
  stopTimer();

  const user = userAnswer.value.trim();
  setWrongDialogData(user || "—", true);
  recordRound(user, false, true);

  showWrongDialog.value = true;
}

const timerClass = computed(() => {
  if (!gameStarted.value) return "";
  if (timeLeft.value <= DANGER_SECONDS) return "timer-danger";
  if (timeLeft.value <= WARN_SECONDS) return "timer-warn";
  return "timer-ok";
});

/* ---------------- Wrong dialog / feedback ---------------- */
const showFloatingFeedback = ref(false);
const showWrongDialog = ref(false);
const wrongOkButton = ref(null);

const lastOutOfTime = ref(false);
const lastSentence = ref("");
const lastUserAnswer = ref("");
const lastAcceptedAnswers = ref("");

watch(showWrongDialog, async (visible) => {
  if (visible) {
    await nextTick();
    wrongOkButton.value?.$el?.focus?.();
  }
});

function setWrongDialogData(user, outOfTimeFlag) {
  const p = currentPrompt.value;
  if (!p) return;

  lastOutOfTime.value = !!outOfTimeFlag;
  lastSentence.value = p.sentence;
  lastUserAnswer.value = user || "—";
  lastAcceptedAnswers.value = (getAcceptedAnswers(p) || []).join(" / ") || "—";
}

/* ---------------- Game flow ---------------- */
const progressValue = computed(() => {
  if (!hasAnyPrompts.value) return 0;
  return (currentRound.value / numRounds.value) * 100;
});

function begin() {
  if (!hasAnyPrompts.value) return;

  currentRound.value = 0;
  rightCount.value = 0;
  wrongCount.value = 0;
  remaining.value = numRounds.value;
  resultsStore.value = [];

  userAnswer.value = "";
  inputLocked.value = false;

  gameStarted.value = true;
  startTime.value = new Date();

  startTimer();
  focusAnswer();
}

function submit() {
  if (!hasPrompt.value) return;
  if (inputLocked.value) return;

  inputLocked.value = true;
  stopTimer();

  const user = userAnswer.value.trim();
  const correct = checkAnswer(currentPrompt.value, user);

  recordRound(user, correct, false);

  if (correct) {
    showFloatingFeedback.value = true;
    setTimeout(() => (showFloatingFeedback.value = false), 900);
    next();
  } else {
    setWrongDialogData(user, false);
    showWrongDialog.value = true;
  }
}

function next() {
  userAnswer.value = "";

  if (currentRound.value >= numRounds.value - 1) {
    finishGame();
    return;
  }

  currentRound.value++;
  startTimer();
  unlockInputWithDelay();
}

function unlockInputWithDelay(delay = INPUT_COOLDOWN_MS) {
  setTimeout(async () => {
    inputLocked.value = false;
    await focusAnswer();
  }, delay);
}

function acknowledgeWrong() {
  showWrongDialog.value = false;
  next();
}

/* ---------------- Recording + API ---------------- */
function recordRound(user, correct, outOfTime = false) {
  const p = currentPrompt.value;
  if (!p) return;

  const roundNumber = resultsStore.value.length + 1;
  const secondsUsed = ROUND_SECONDS - timeLeft.value;

  const accepted = getAcceptedAnswers(p);
  const correctJoined = accepted.join(" / ");

  resultsStore.value.push({
    question: `${p.conditional_type} (${p.condition ? "IF" : "MAIN"}) || ${p.sentence}`,
    correct_answer: correctJoined,
    prompt_number: roundNumber,
    user_answer: user,
    is_correct: correct,
    out_of_time: outOfTime,
    elapsed_time: secondsUsed,
    typo: false,
    typo_requested: false,
    typo_accepted: null,
  });

  correct ? rightCount.value++ : wrongCount.value++;
  remaining.value--;
}

async function finishGame() {
  stopTimer();

  const finishedAt = new Date();
  const totalSeconds = startTime.value
    ? Math.floor((finishedAt.getTime() - startTime.value.getTime()) / 1000)
    : 0;

  const avgTime = resultsStore.value.length > 0 ? totalSeconds / resultsStore.value.length : 0;

  const payload = {
    game_name: "Parallel Universe",
    total_rounds: numRounds.value,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: startTime.value ? startTime.value.toISOString() : new Date().toISOString(),
    finished_at: finishedAt.toISOString(),
    total_time: totalSeconds,
    avg_time_per_prompt: parseFloat(avgTime.toFixed(2)),
    rounds: resultsStore.value,
  };

  try {
    await api.post("/other-games-sessions/", payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Status:", error.response?.status);
    console.error("Response data:", error.response?.data);
  }

  emit("gameOver", payload);
}

/* ---------------- Keyboard ---------------- */
onMounted(() => {
  const handler = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (inputLocked.value) return;
    if (!gameStarted.value) return;

    if (showWrongDialog.value) acknowledgeWrong();
    else submit();
  };

  window.addEventListener("keydown", handler);
  onBeforeUnmount(() => window.removeEventListener("keydown", handler));
});

onBeforeUnmount(stopTimer);
</script>

<style scoped>
.game-layout { display: flex; flex-direction: column; height: 100%; }
.game-middle { flex: 1; margin-top: 2%; }
.answer-spacing { margin-top: 16px; }

.floating-feedback {
  position: fixed; top: 8vh; left: 50%;
  transform: translateX(-50%);
  padding: 10px 16px; border-radius: 8px;
  background: #4caf50; color: white; z-index: 2000;
}

.timer-pill { padding: 2px 8px; border-radius: 999px; transition: background-color 150ms ease, color 150ms ease; }
.timer-ok { background: transparent; }
.timer-warn { background: rgba(255, 193, 7, 0.25); }
.timer-danger { background: rgba(244, 67, 54, 0.22); }
</style>
