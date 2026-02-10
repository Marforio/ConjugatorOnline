<!-- src/components/auxiliaries/auxiliaries_scenes/AuxiliariesScene01_Game.vue -->
<template>
  <v-container fluid class="pa-4 d-flex justify-center">
    <v-overlay
      v-model="finishing"
      class="align-center justify-center"
      persistent
    >
      <div class="text-center">
        <v-progress-circular indeterminate size="48" />
        <div class="mt-3 text-subtitle-2">Saving your results…</div>
      </div>
    </v-overlay>

    <!-- Floating feedback (correct only, non-blocking) -->
    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="pt-4 px-4 pb-1" width="450" min-height="600" elevation="2">
      <!-- START SCREEN -->
      <div v-if="!gameStarted" class="p-3">
        <div class="d-flex justify-center mb-4">
          <v-img src="/images/banners/UsesOfAuxiliaries.png" max-width="400" />
        </div>

        <v-list density="compact">
          <v-list-item>
            <template #prepend><v-icon icon="mdi-counter" /></template>
            <v-list-item-title>{{ numRounds }} prompts</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-timer-outline" /></template>
            <v-list-item-title>{{ ROUND_SECONDS }} seconds per prompt</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-pencil" /></template>
            <v-list-item-title>Type the missing auxiliary / response</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-book-open-blank-variant" /></template>
            <v-list-item-title class="text-wrap">
              Do you need to review the
              <a href="https://book.language-labs.ch/ch13" target="_blank">
                special uses of auxiliaries
              </a>
              ?
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <div class="d-flex justify-center mt-6">
          <v-btn color="success" @click="begin">Start</v-btn>
        </div>

        <div class="d-flex justify-center mt-6">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="large" class="ms-3">
              <v-icon color="grey-darken-3" size="large">mdi-arrow-left-circle</v-icon>
            </v-btn>
          </RouterLink>
        </div>
      </div>

      <!-- GAME -->
      <div v-else class="game-layout">
        <!-- TOP -->
        <div class="game-top">
          <div class="d-flex justify-space-between">
            <div>Round {{ currentRound + 1 }} / {{ numRounds }}</div>
            <div class="text-subtitle-2 timer-pill" :class="timerClass">
              ⏱ {{ timeLeft }} s
            </div>
          </div>
        </div>

        <!-- MIDDLE -->
        <div class="game-middle mb-5">
          <v-card
            class="pa-3 my-4"
            elevation="2"
            variant="flat"
            style="margin-bottom: 20px"
          >
            <!-- Bob row (avatar always shown; Bob bubble hidden in tag mode) -->
            <div class="d-flex align-center ga-3">
              <div class="speaker-col">
                <v-avatar size="90" class="ms-2 mt-3">
                  <v-img src="/images/speaker_pics_resized/bob.jpg" cover />
                </v-avatar>
                <div class="text-subtitle mt-3">Bob</div>
              </div>

              <div class="bubble-wrap">
                <svg
                  class="bubble-svg"
                  viewBox="0 0 520 200"
                  preserveAspectRatio="none"
                >
                  <!-- Tail LEFT (default) -->
                  <path
                    d="M40 18
                       H480
                       Q502 18 502 40
                       V130
                       Q502 152 480 152
                       H170
                       L120 182
                       L125 152
                       H40
                       Q18 152 18 130
                       V40
                       Q18 18 40 18 Z"
                    fill="#ffffff"
                    stroke="rgba(0,0,0,0.15)"
                    stroke-width="3"
                  />
                </svg>

                <div  v-if="currentPrompt?.mode !== 'tag'" class="bubble-text">{{ currentPrompt?.prompt }}</div>
                <div v-else class="bubble-text" >Go ahead, I'm listening...</div>
              </div>
              
            </div>

            <v-divider class="mt-2 mb-3" variant="double" thickness="3px" />

            <div v-if="currentPrompt.mode !== 'tag'" class="text-subtitle-2 text-center mb-2">
              <v-chip
                v-if="currentPrompt"
                variant="flat"
                :color="
                  currentPrompt.mode === 'tag'
                    ? 'red'
                    : currentPrompt.mode === 'echo'
                      ? 'orange'
                      : 'yellow-darken-1'
                "
                size="small"
                class="mb-1 text-uppercase"
              >
                {{ currentPrompt.mode }}
              </v-chip>
              <span class="ms-4">{{ modeLabel }}</span>
            </div>
            <div v-else class="text-subtitle-2 text-center mb-2">
                    <v-chip
                      v-if="currentPrompt"
                      variant="flat"
                      :color="
                        currentPrompt.mode === 'tag'
                          ? 'red'
                          : currentPrompt.mode === 'echo'
                            ? 'orange'
                            : 'yellow-darken-1'
                      "
                      size="small"
                      class="mb-1 text-uppercase"
                    >
                      {{ currentPrompt.mode }}
                    </v-chip>
                    <span class="ms-4">{{ modeLabel }}</span>
                  </div>

            <!-- Player response bubble (text field inside) -->
            <div class="player-area mt-2">
              <div class="player-bubble-wrap">
                <svg
                  class="player-bubble-svg"
                  viewBox="0 0 520 200"
                  preserveAspectRatio="none"
                >
                  <!-- Bubble tail points down-right (towards player) -->
                  <path
                    d="M40 18
                       H480
                       Q502 18 502 40
                       V130
                       Q502 152 480 152
                       H250
                       L310 188
                       L300 152
                       H40
                       Q18 152 18 130
                       V40
                       Q18 18 40 18 Z"
                    fill="#ffffff"
                    stroke="rgba(0,0,0,0.15)"
                    stroke-width="3"
                  />
                </svg>

                <div class="player-bubble-content">
                  <div
                    v-if="currentPrompt?.mode === 'tag'"
                    class="d-flex justify-center align-center mx-2"
                  >
                    {{ currentPrompt?.prompt }}
                  </div>

                  <div v-else>
                    <div
                      v-if="currentPrompt?.mode !== 'tag'"
                      class="d-flex justify-center align-center"
                    >
                      <div class="py-3 pe-3 font-italic">
                        <span v-if="currentPrompt?.mode === 'echo'">Really?</span><span v-if="currentPrompt?.mode === 'agreement'" >Right. </span>
                      </div>
                      <div class="d-flex justify-center">
                        <v-text-field
                          ref="answerField"
                          v-model="userAnswer"
                          label="Your answer"
                          hide-details
                          density="compact"
                          min-width="180px"
                          :disabled="inputLocked"
                          @keyup.enter="submit"
                          justify="center"
                        />
                      </div>
                    </div>

                    <!-- non-echo: single centered text field -->
                    <div
                      v-else
                      class="d-flex justify-center align-center w-100"
                    >
                      <v-text-field
                        ref="answerField"
                        v-model="userAnswer"
                        label="Your answer"
                        hide-details
                        density="compact"
                        min-width="180px"
                        :disabled="inputLocked"
                        @keyup.enter="submit"
                        style="max-width: 260px;"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </v-card>
            <div v-if="currentPrompt.mode === 'tag'" class="d-flex justify-center">
              <v-text-field
              ref="answerField"
              v-model="userAnswer"
              label="Your answer"
              hide-details
              density="compact"
              :disabled="inputLocked"
              @keyup.enter="submit"
              max-width="220px"
            />
            </div>

          <div class="d-flex justify-center mt-4 mb-4">
            <v-btn color="primary" @click="submit" :disabled="inputLocked">
              Submit
            </v-btn>
          </div>
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

          <div class="mt-5 d-flex justify-center align-center w-100">
            <RouterLink :to="{ name: 'games' }">
              <v-btn icon elevation="0" size="large">
                <v-icon color="grey-darken-3" size="large">
                  mdi-arrow-left-circle
                </v-icon>
              </v-btn>
            </RouterLink>
          </div>
        </div>
      </div>
    </v-card>

    <!-- WRONG ANSWER DIALOG -->
    <v-dialog v-model="showWrongDialog" persistent max-width="420">
      <v-card @keydown.enter.prevent="acknowledgeWrong" color="yellow-lighten-2 pa-3">
        <v-card-title class="text-h6 mt-4">
          {{ lastOutOfTime ? "Time ran out" : "Wrong" }}
          <v-icon :icon="lastOutOfTime ? 'mdi-timer-off-outline' : 'mdi-emoticon-sad-outline'" />
        </v-card-title>

        <v-card-text>
          <p class="font-italic">{{ currentPrompt?.prompt }}</p>
          <p>
            Mode:
            <strong class="text-capitalize">{{ currentPrompt?.mode || "—" }}</strong>
          </p>
          <p>
            Tense: <strong class="text-capitalize">{{ lastTense }}</strong>
          </p>
          <p>
            Your answer: <strong>{{ lastUserAnswer || "—" }}</strong>
          </p>
          <p>
            Correct answer(s):
            <strong>{{ lastCorrectAnswers }}</strong>
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import api from "@/axios";

const ROUND_SECONDS = 25;
const WARN_SECONDS = 10;
const DANGER_SECONDS = 4;

const finishing = ref(false);

const timeLeft = ref(ROUND_SECONDS);
let timer = null;

const props = defineProps({ prompts: Array, gameSettings: Object });
const emit = defineEmits(["gameOver"]);

const inputLocked = ref(false);
const INPUT_COOLDOWN_MS = 600;

const numRounds = props.prompts.length;
const currentRound = ref(0);
const currentPrompt = computed(() => props.prompts[currentRound.value]);

const startTime = ref(null);

const userAnswer = ref("");
const lastUserAnswer = ref("");
const lastTense = ref("");
const lastCorrectAnswers = ref("");

const rightCount = ref(0);
const wrongCount = ref(0);
const remaining = ref(numRounds);

const gameStarted = ref(false);
const resultsStore = ref([]);

const modeLabel = computed(() => {
  const m = String(currentPrompt.value?.mode || "").toLowerCase();
  if (m === "echo") return "Echo Bob's comment to show interest or surprise";
  if (m === "agreement") return "Use 'so' or 'neither' to agree with Bob";
  if (m === "tag") return "Add the missing tag to your question to Bob";
  return m || "—";
});

/* ------------------------------------------------------------------
 * ANSWER NORMALIZATION (typo filtering)
 * ------------------------------------------------------------------ */
function normalizeForCompare(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[?]+$/g, "")
    .replace(/[\s.,!;:"()\-–—_/\\]+/g, "")
    .replace(/'/g, "");
}

function isCorrectAnswer(prompt, user) {
  const userNorm = normalizeForCompare(user);
  const acceptable = Array.isArray(prompt?.answer) ? prompt.answer : [];
  return acceptable.some((a) => normalizeForCompare(a) === userNorm);
}

/* ------------------------------------------------------------------
 * REFOCUS INPUT EACH ROUND
 * ------------------------------------------------------------------ */

const answerField = ref(null)

function getRefTarget(refValue) {
  // If the same ref is used multiple times, Vue may give an array.
  if (Array.isArray(refValue)) return refValue[refValue.length - 1] ?? null;
  return refValue ?? null;
}

async function focusAnswerField() {
  // Wait for DOM update
  await nextTick();

  // If input is disabled, focusing will often fail (and feels buggy anyway).
  // Wait a tiny bit so unlockInputWithDelay can run first.
  if (inputLocked.value) return;

  const target = getRefTarget(answerField.value);
  if (!target) return;

  // Try Vuetify focus() first
  target.focus?.();

  // Fallback: focus the native input
  const root = target.$el ?? target;
  const input = root?.querySelector?.("input");
  input?.focus();
  input?.select?.();
}


/* TIMER and handling TIMEOUT */
function startTimer() {
  stopTimer();
  timeLeft.value = ROUND_SECONDS;

  timer = setInterval(() => {
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

const lastOutOfTime = ref(false);

function handleTimeOut() {
  if (inputLocked.value) return;
  inputLocked.value = true;

  stopTimer();

  const user = userAnswer.value.trim();

  lastUserAnswer.value = user || "—";
  lastCorrectAnswers.value = (currentPrompt.value.answer || []).join(" / ");
  lastTense.value = currentPrompt.value.tense;
  lastOutOfTime.value = true;

  recordRound(user, false, true);
  showWrongDialog.value = true;
}

const timerClass = computed(() => {
  if (!gameStarted.value) return "";
  if (timeLeft.value <= DANGER_SECONDS) return "timer-danger";
  if (timeLeft.value <= WARN_SECONDS) return "timer-warn";
  return "timer-ok";
});

/* FEEDBACK */
const showFloatingFeedback = ref(false);
const showWrongDialog = ref(false);
const wrongOkButton = ref(null);

watch(showWrongDialog, async (visible) => {
  if (visible) {
    await nextTick();
    wrongOkButton.value?.$el?.focus();
  }
});

/* GAME FLOW */
async function begin() {
  gameStarted.value = true;
  startTime.value = new Date();
  startTimer();
  await focusAnswerField();
}

const progressValue = computed(() => (currentRound.value / numRounds) * 100);

function submit() {
  if (inputLocked.value) return;
  inputLocked.value = true;

  stopTimer();

  const user = userAnswer.value.trim();
  const correct = isCorrectAnswer(currentPrompt.value, user);

  recordRound(user, correct, false);

  if (correct) {
    showFloatingFeedback.value = true;
    setTimeout(() => (showFloatingFeedback.value = false), 900);
    next();
  } else {
    lastUserAnswer.value = user;
    lastCorrectAnswers.value = (currentPrompt.value.answer || []).join(" / ");
    lastTense.value = currentPrompt.value.tense;
    lastOutOfTime.value = false;
    showWrongDialog.value = true;
  }
}

async function next() {
  userAnswer.value = "";

  if (currentRound.value === numRounds - 1) {
    finishGame();
    return;
  }

  currentRound.value++;
  startTimer();
  unlockInputWithDelay(); 
}

function recordRound(user, correct, outOfTime = false) {
  const roundNumber = resultsStore.value.length + 1;
  const secondsUsed = ROUND_SECONDS - timeLeft.value;

  resultsStore.value.push({
    question: currentPrompt.value.prompt,
    correct_answer: (currentPrompt.value.answer || []).join(" / "),
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

async function acknowledgeWrong() {
  showWrongDialog.value = false;

  // Wait for the dialog to actually close and the next round to render,
  // then focus the input.
  await nextTick();
  await next();
  await focusAnswerField();

  unlockInputWithDelay();
}

function unlockInputWithDelay(delay = INPUT_COOLDOWN_MS) {
  setTimeout(async () => {
    inputLocked.value = false;
    await focusAnswerField();
  }, delay);
}

function buildUsesOfAuxiliariesGameName(modes) {
  const all = !!(modes?.echo && modes?.agreement && modes?.tag);
  return all ? "Uses Of Auxiliaries - all" : "Uses Of Auxiliaries";
}

async function finishGame() {
  stopTimer();
  finishing.value = true; 

  const finishedAt = new Date();
  const totalSeconds = Math.floor(
    (finishedAt.getTime() - startTime.value.getTime()) / 1000
  );

  const avgTime =
    resultsStore.value.length > 0 ? totalSeconds / resultsStore.value.length : 0;

  const payload = {
    game_name: buildUsesOfAuxiliariesGameName(props.gameSettings?.modes),
    total_rounds: numRounds,
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

/* Keyboard */
onMounted(() => {
  const handler = (e) => {
    if (e.key !== "Enter") return;
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
  margin-top: 32px;
}

.game-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game-middle {
  flex: 1;
  margin-top: 2%;
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
.timer-ok {
  background: transparent;
}
.timer-warn {
  background: rgba(255, 193, 7, 0.25);
}
.timer-danger {
  background: rgba(244, 67, 54, 0.22);
}

/* Speaker + bubble */
.speaker-col {
  width: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bubble-wrap {
  position: relative;
  flex: 1;
  min-height: 120px;
  margin-top: -30px;
}

.bubble-svg {
  width: 100%;
  height: 120px;
  display: block;
}

/* Vertically center bubble text */
.bubble-text {
  position: absolute;
  top: 18px;
  left: 26px;
  right: 18px;
  bottom: 40px;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-style: italic;
  line-height: 1.3;
  padding: 0 6px;

  white-space: normal;
  word-break: normal;
}

/* Player response bubble */
.player-area {
  display: flex;
  justify-content: flex-end;
}

.player-bubble-wrap {
  position: relative;
  width: 280px;
  height: 120px;
}

.player-bubble-svg {
  width: 100%;
  height: 120px;
  display: block;
}

.player-bubble-content {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 40px;

  display: flex;
  align-items: center;
}
</style>