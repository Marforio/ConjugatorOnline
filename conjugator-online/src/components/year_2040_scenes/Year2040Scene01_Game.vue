<!-- src/components/year_2040/year_2040_scenes/Year2040Scene01_Game.vue -->
<template>
  <v-container fluid class="pa-4 d-flex justify-center">

    <!-- Floating feedback -->
    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="p-4" width="560" min-height="640" elevation="3">

      <!-- START SCREEN -->
      <div v-if="!gameStarted" class="p-3">
        <div class="d-flex justify-center mb-4">
          <v-img src="/images/banners/Year2040.png" max-width="420" />
        </div>

        <v-list density="compact">
          <v-list-item>
            <template #prepend><v-icon icon="mdi-counter" /></template>
            <v-list-item-title>{{ numRounds }} rounds</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-timer-outline" /></template>
            <v-list-item-title>{{ ROUND_SECONDS }} seconds per round</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-pencil" /></template>
            <v-list-item-title class="text-wrap">
              Type the missing future verb phrase (e.g. <strong>will have left</strong>)
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-list-item>
            <template #prepend><v-icon icon="mdi-book-open-blank-variant" /></template>
                <v-list-item-title class="text-wrap">
                </v-list-item-title>
                Do you need to review the <a href="https://book.language-labs.ch/ch4#future-tenses" target="_blank">future tenses</a>?
        </v-list-item>

        <div class="d-flex justify-center mt-8 mb-8">
          <v-btn color="success" @click="begin" :disabled="!hasAnyPrompts">Start</v-btn>
        </div>

        <div v-if="!hasAnyPrompts" class="text-caption text-center mt-4">
          No prompts loaded. Go back and try again.
        </div>
        <div class="d-flex justify-center align-center w-100">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="large" class="ms-3">
              <v-icon color="grey-darken-3" size="large">mdi-arrow-left-circle</v-icon>
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
              <div class="text-subtitle-2 timer-pill" :class="timerClass">
                ⏱ {{ timeLeft }} s
              </div>
            </div>
          </div>

          <!-- MIDDLE -->
          <div class="game-middle mb-5">
            <v-card class="pa-3 my-4" elevation="3">
              <v-card-title class="d-flex justify-space-between align-center font-weight-medium" style="font-size: 0.9rem;">
                <span class="text-capitalize">tense = {{ currentPrompt.tense }} </span> 
                
                <div class="d-flex align-center ga-3">
                    <span>
                    State in 2040 = </span>
                    <div class="tense-indicator">
                    <v-progress-circular
                        v-if="isFutureContinuous"
                        indeterminate
                        :size="50"
                        :width="5"
                    />
                    <v-icon
                        v-else
                        icon="mdi-check-circle"
                        class="check-anim"
                        size="50"
                    />
                    </div>      
                
                
                    
                    
                </div>
                </v-card-title>
                <div class="d-flex justify-center mb-8" style="margin-top: 3rem;">
                        <v-chip
                            color="secondary"
                            variant="flat"
                            class="text-uppercase"
                            >
                            {{ currentPrompt.verb }}
                            </v-chip>
                            <!-- ✅ negative chip -->
                            <v-chip
                            v-if="currentPrompt.negative"
                            color="error"
                            variant="flat"
                            class="text-uppercase ms-5"
                            >
                            Negative
                            </v-chip>
                    </div>
              <v-card-text class="text-wrap text-center font-italic" style="font-size: 1.2rem;">
               "<span v-if="currentPrompt.tense === 'future continuous'">In</span><span v-else>By</span> 2040, {{ currentPrompt.sentence }}"
              </v-card-text>

              

              <div class="answer-spacing d-flex justify-center m-6" ref="answerWrap">
                <v-text-field
                  v-model="userAnswer"
                  label="Your answer"
                  max-width="320px"
                  hide-details
                  :disabled="inputLocked"
                  @keyup.enter="submit"
                />
              </div>

              <div class="d-flex justify-center mt-6 mb-6">
                <v-btn color="primary" @click="submit" :disabled="inputLocked">
                  Submit
                </v-btn>
              </div>
            </v-card>
          </div>

          <!-- BOTTOM -->
          <div class="game-bottom">
            <v-progress-linear
              :model-value="progressValue"
              height="10"
              class="mb-3"
              color="primary"
            />
            <div class="d-flex justify-space-between">
              <div>✅ {{ rightCount }}</div>
              <div>❌ {{ wrongCount }}</div>
              <div>Remaining: {{ remaining }}</div>
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
            Sentence: <span class="font-italic">{{ lastSentence }}</span>
          </p>
          <p class="mb-2">
            Your answer: <strong>{{ lastUserAnswer || "—" }}</strong>
          </p>
          <p class="mb-0">
            Accepted answers:
            <strong>{{ lastAcceptedAnswers }}</strong>
          </p>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn ref="wrongOkButton" color="secondary" @click="acknowledgeWrong">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from "vue";
import api from "@/axios";

import { checkAnswer, getAcceptedAnswers } from "@/assets/scripts/year_2040/Year2040PromptEngine";

const ROUND_SECONDS = 20;
const WARN_SECONDS = 9;
const DANGER_SECONDS = 3;

const props = defineProps({
  prompts: { type: Array, required: true },
});
const emit = defineEmits(["gameOver"]);

const numRounds = computed(() => (Array.isArray(props.prompts) ? props.prompts.length : 0));
const hasAnyPrompts = computed(() => numRounds.value > 0);

const currentRound = ref(0);
const currentPrompt = computed(() => props.prompts?.[currentRound.value] || null);
const hasPrompt = computed(() => !!currentPrompt.value);

const gameStarted = ref(false);
const startTime = ref(null);

const userAnswer = ref("");

const rightCount = ref(0);
const wrongCount = ref(0);
const remaining = ref(0);

const INPUT_COOLDOWN_MS = 600;
const inputLocked = ref(false);

/* ---------------- Focus (EVERY round) ---------------- */

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
  // focus AFTER we unlock (handled in unlockInputWithDelay), but also try here
  focusAnswer();
});

/* ---------------- Timer ---------------- */

const timeLeft = ref(ROUND_SECONDS);
let timer = null;

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

/* ---------------- Wrong dialog ---------------- */

const showFloatingFeedback = ref(false);
const showWrongDialog = ref(false);
const wrongOkButton = ref(null);

const lastUserAnswer = ref("");
const lastSentence = ref("");
const lastAcceptedAnswers = ref("");
const lastOutOfTime = ref(false);

watch(showWrongDialog, async (visible) => {
  if (visible) {
    await nextTick();
    wrongOkButton.value?.$el?.focus?.();
  }
});

function setWrongDialogData(user, outOfTimeFlag) {
  const p = currentPrompt.value;
  if (!p) return;

  lastUserAnswer.value = user || "—";
  lastSentence.value = p.sentence;
  lastOutOfTime.value = !!outOfTimeFlag;
  lastAcceptedAnswers.value = (getAcceptedAnswers(p) || []).join(" / ") || "—";
}

/* ---------------- Game flow ---------------- */

const isFutureContinuous = computed(() => {
  const t = String(currentPrompt.value?.tense ?? "").toLowerCase();
  return t.includes("continuous");
});

const isFuturePerfect = computed(() => {
  const t = String(currentPrompt.value?.tense ?? "").toLowerCase();
  return t.includes("perfect");
});


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
    await focusAnswer(); // ✅ guarantees focus AFTER unlock
  }, delay);
}

function acknowledgeWrong() {
  showWrongDialog.value = false;
  next();
  unlockInputWithDelay();
}

/* ---------------- Recording + API payload ---------------- */

const resultsStore = ref([]);

function recordRound(user, correct, outOfTime = false) {
  const p = currentPrompt.value;
  if (!p) return;

  const roundNumber = resultsStore.value.length + 1;
  const secondsUsed = ROUND_SECONDS - timeLeft.value;

  resultsStore.value.push({
    question: p.sentence,
    correct_answer: (getAcceptedAnswers(p) || []).join(" / "),
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

  const avgTime = resultsStore.value.length
    ? totalSeconds / resultsStore.value.length
    : 0;

  const payload = {
    game_name: "Year 2040",
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
    if (!gameStarted.value) return;
    if (inputLocked.value) return;

    if (showWrongDialog.value) acknowledgeWrong();
    else submit();
  };

  window.addEventListener("keydown", handler);
  onBeforeUnmount(() => window.removeEventListener("keydown", handler));
});

onBeforeUnmount(stopTimer);
</script>

<style scoped>
.answer-spacing { margin-top: 22px; }

.game-layout { display: flex; flex-direction: column; height: 100%; }
.game-middle { flex: 1; margin-top: 2%; }

.floating-feedback {
  position: fixed;
  top: 8vh;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 16px;
  border-radius: 8px;
  background: #4caf50;
  color: white;
  z-index: 2000;
}

.timer-pill {
  padding: 2px 8px;
  border-radius: 999px;
  transition: background-color 150ms ease, color 150ms ease;
}
.timer-ok { background: transparent; }
.timer-warn { background: rgba(255, 193, 7, 0.25); }
.timer-danger { background: rgba(244, 67, 54, 0.22); }

.tense-indicator {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
}

.check-anim {
  animation: pop 550ms ease-in-out infinite alternate;
}

@keyframes pop {
  from { transform: scale(1); opacity: 0.85; }
  to   { transform: scale(1.08); opacity: 1; }
}

</style>
