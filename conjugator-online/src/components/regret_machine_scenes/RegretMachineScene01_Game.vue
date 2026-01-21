<!-- src/components/regret_machine/regret_machine_scenes/RegretMachineScene01_Game.vue -->
<template>
  <v-container fluid class="pa-4 d-flex justify-center">

    <!-- Floating feedback -->
    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="p-4" width="520" min-height="650" elevation="3">

      <!-- START SCREEN -->
      <div v-if="!gameStarted" class="p-3">
        <div class="d-flex justify-center mb-4">
          <v-img src="/images/banners/RegretMachine.png" max-width="420" />
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
              Type only the <strong>modal verb phrase</strong> (e.g. <strong>should have gone</strong>)
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-eye-outline" /></template>
            <v-list-item-title class="text-wrap">
              Watch out! Answers may be positive or negative (e.g. <strong>could have helped</strong> vs. <strong>shouldn't have helped</strong>) depending on the situation.
            </v-list-item-title>
            </v-list-item>
        </v-list>

        <div class="d-flex justify-center mt-6">
          <v-btn color="success" @click="begin" :disabled="!hasAnyPrompts">Start</v-btn>
        </div>

        <div v-if="!hasAnyPrompts" class="text-caption text-center mt-4">
          No prompts loaded. Go back and try again.
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
              <v-card-title class="d-flex justify-space-between align-center">
                <span>Situation:</span>
              </v-card-title>

              <v-card-text class="text-wrap my-3 text-center font-italic" v-html="highlightedSentence" style="font-size: 1.2rem;"/>

              <v-divider class="my-2" />
              <v-card-title class="d-flex justify-space-between align-center">
                <span>Regret:</span>
              </v-card-title>
                <div class="d-flex flex-column my-2">
                  <div class="d-flex flex-row justify-center align-center my-3" style="gap: 25px;">
                    <v-chip color="primary" variant="flat">
                      <span class="text-uppercase" style="font-size: 1rem;">{{ currentPrompt.modal }}</span>
                    </v-chip>

                    <v-chip color="secondary" variant="flat">
                      <span class="text-uppercase" style="font-size: 1rem;">{{ currentPrompt.verb }}</span>
                    </v-chip>
                  </div>
                  <v-card-title class="text-wrap font-italic text-center text-h6 mt-2" style="font-size: 1.3rem;">
                    "{{ currentPrompt.sentence }}"
                  </v-card-title>
                </div>

              <div class="answer-spacing" ref="answerWrap">
                <v-text-field
                  v-model="userAnswer"
                  label="Type the missing modal verb phrase"
                  hide-details
                  :disabled="inputLocked"
                  @keyup.enter="submit"
                />
              </div>

              <div class="d-flex justify-center mt-4">
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
            <strong>{{ lastPromptText }}</strong>
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
import { checkAnswer, getAcceptedAnswers } from "@/assets/scripts/regret_machine/RegretMachinepromptEngine";


const ROUND_SECONDS = 25;
const WARN_SECONDS = 10;
const DANGER_SECONDS = 4;

const timeLeft = ref(ROUND_SECONDS);
let timer = null;

const props = defineProps({
  prompts: { type: Array, required: true },
});

const emit = defineEmits(["gameOver"]);

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

/* ---------------- Highlight helper (like Passive) ---------------- */

function highlightSubstring(text, highlight) {
  if (!text || !highlight) return text;
  // escape for regex safety
  const esc = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return String(text).replace(new RegExp(esc, "g"), `<span class="font-weight-bold">${highlight}</span>`);
}

const highlightedSentence = computed(() => {
  const p = currentPrompt.value;
  if (!p) return "";
  return highlightSubstring(p.prompt, p.highlight);
});

/* ---------------- Focus ---------------- */

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

  lastOutOfTime.value = true;
  setWrongDialogData(userAnswer.value.trim() || "—");
  recordRound(userAnswer.value.trim(), false, true);

  showWrongDialog.value = true;
}

const timerClass = computed(() => {
  if (!gameStarted.value) return "";
  if (timeLeft.value <= DANGER_SECONDS) return "timer-danger";
  if (timeLeft.value <= WARN_SECONDS) return "timer-warn";
  return "timer-ok";
});

/* ---------------- UI state ---------------- */

const showFloatingFeedback = ref(false);
const showWrongDialog = ref(false);
const wrongOkButton = ref(null);

const lastOutOfTime = ref(false);
const lastPromptText = ref("");
const lastUserAnswer = ref("");
const lastAcceptedAnswers = ref("");

watch(showWrongDialog, async (visible) => {
  if (visible) {
    await nextTick();
    wrongOkButton.value?.$el?.focus();
  }
});

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

function setWrongDialogData(user) {
  const p = currentPrompt.value;
  if (!p) return;

  lastPromptText.value = p.prompt;
  lastUserAnswer.value = user || "—";
  lastAcceptedAnswers.value = (getAcceptedAnswers(p) || []).join(" / ") || "—";
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
    lastOutOfTime.value = false;
    setWrongDialogData(user);
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

/* ---------------- Recording + API payload ---------------- */

function recordRound(user, correct, outOfTime = false) {
  const p = currentPrompt.value;
  if (!p) return;

  const roundNumber = resultsStore.value.length + 1;
  const secondsUsed = ROUND_SECONDS - timeLeft.value;

  const accepted = getAcceptedAnswers(p);
  const correctJoined = accepted.join(" / ");

  // API-compatible round object
  resultsStore.value.push({
    question: `${p.prompt} || ${p.sentence}`,     // join prompt + sentence
    correct_answer: correctJoined,               // joined accepted answers
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
  const totalSeconds = Math.floor((finishedAt.getTime() - startTime.value.getTime()) / 1000);
  const avgTime = resultsStore.value.length > 0 ? totalSeconds / resultsStore.value.length : 0;

  const payload = {
    game_name: "Regret Machine",
    total_rounds: numRounds.value,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: startTime.value.toISOString(),
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

    // keep your behavior: Enter submits; when dialog open, Enter OKs
    e.preventDefault();

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
.answer-spacing {
  margin-top: 16px;
}

.game-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game-middle {
  flex: 1;
}

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
</style>
