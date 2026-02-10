<!-- src/components/comparison/comparison_scenes/ComparisonScene01_Game.vue -->
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

    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="pt-3 px-4 pb-1" width="450" min-height="600" elevation="2">
      <div class="game-layout">
        <!-- TOP -->
        <div class="game-top">
          <div class="d-flex justify-space-between">
            <div>Round {{ currentRound + 1 }} / {{ numRounds }}</div>
            <div class="text-subtitle-2 timer-pill" :class="timerClass">⏱ {{ timeLeft }} s</div>
          </div>
        </div>

        <!-- MIDDLE -->
        <div class="game-middle mb-5">
          <v-card class="pa-3 my-2" elevation="0" variant="flat">
            <div class="d-flex justify-center ga-6 mt-2">
              <div class="d-flex flex-column align-center">
                <v-avatar
                    size="150"
                    rounded="0"
                  >
                    <img
                      :src="getPicPath(currentPrompt.person_A)"
                      alt="Person A"
                      style="object-fit: contain; width: 100%; height: 100%;"
                    />
                  </v-avatar>
                <div class="text-caption mt-2">{{ currentPrompt.person_A }}</div>
              </div>

              <div v-if="displayedCompSecondChip" class="d-flex flex-column align-center justify-center">
                <v-icon size="x-large"> {{ displayedCompSecondChip }}</v-icon>
              </div>

              <div v-if="showSecondPerson" class="d-flex flex-column align-center">
                <v-avatar
                    size="150"
                    rounded="0"
                  >
                    <img
                      :src="getPicPath(currentPrompt.person_B)"
                      alt="Person B"
                      style="object-fit: contain; width: 100%; height: 100%;"
                    />
                  </v-avatar>
                <div class="text-caption mt-2">{{ currentPrompt.person_B }}</div>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="px-3 text-subtitle-2 text-center mb-2">
              <v-chip
                v-if="gameSettings?.intensifiers && displayedTargetForm !== 'equality'"
                class="mx-2"
                size="x-small"
                color="red-lighten-4"
                variant="flat"
                label
              >
                INTENSIFY
              </v-chip>
              <v-chip class="mx-2" v-if="displayedCompSecondChip"><v-icon>{{ displayedCompSecondChip }}</v-icon> </v-chip>
              <v-chip class="mx-2" v-if="displayedSuperSecondChip"> {{ displayedSuperSecondChip }} </v-chip>
              <v-chip class="mx-2 text-uppercase" variant="elevated" color="info" size="large">{{ currentPrompt.word }}</v-chip>
            </div>

            <div class="text-center text-body-2 my-5">
              <div v-if="currentPrompt.part_of_speech === 'adverb'"  style="font-size: 1.1rem;">
                <span v-if="targetForm === 'comparative' || targetForm === 'comparison_less'">
                  <span class="text-capitalize">{{ currentPrompt.person_A }}</span> {{ currentPrompt.prompt }} ________ <span>{{ currentPrompt.person_B }}</span> .
                </span>
                <span v-else-if="targetForm === 'equality'">
                  <span class="text-capitalize">{{ currentPrompt.person_A }}</span> {{ currentPrompt.prompt }} ________ <span>{{ currentPrompt.person_B }}</span> .
                </span>
                <span v-else>
                  <span class="text-capitalize">{{ currentPrompt.person_A }}</span> {{ currentPrompt.prompt }} ________ .
                </span>
              </div>
              <div v-else  style="font-size: 1.1rem;">
                <!-- adjective -->
                <span v-if="targetForm === 'comparative' || targetForm === 'comparison_less'">
                  <span class="text-capitalize">{{ currentPrompt.person_A }}</span> is ________ <span>{{ currentPrompt.person_B }}</span> .
                </span>
                <span v-else-if="targetForm === 'equality'">
                  <span class="text-capitalize">{{ currentPrompt.person_A }}</span> is ________ <span>{{ currentPrompt.person_B }}</span> .
                </span>
                <span v-else>
                  <span class="text-capitalize">{{ currentPrompt.person_A }}</span> is ________ .
                </span>
              </div>
            </div>

            <div class="d-flex justify-center mt-2">
              <v-text-field
                ref="answerField"
                v-model="userAnswer"
                label="Type the missing form"
                hide-details
                density="compact"
                :disabled="inputLocked"
                @keydown.enter.prevent="handleEnter"
                max-width="250"
              />
            </div>
          </v-card>

          <div class="d-flex justify-center mt-4 mb-4">
            <v-btn color="primary" @click="submit" :disabled="inputLocked">Submit</v-btn>
          </div>
        </div>

        <!-- BOTTOM -->
        <div class="game-bottom">
          <v-progress-linear :model-value="progressValue" height="10" class="mb-3" color="primary" />

          <div class="d-flex justify-space-between">
            <div>✅ {{ rightCount }}</div>
            <div>❌ {{ wrongCount }}</div>
            <div>Remaining: {{ remaining }}</div>
          </div>

          <div class="mt-5 d-flex justify-center align-center w-100">
            <RouterLink :to="{ name: 'games' }">
              <v-btn icon elevation="0" size="large">
                <v-icon color="grey-darken-3" size="large">mdi-arrow-left-circle</v-icon>
              </v-btn>
            </RouterLink>
          </div>
        </div>
      </div>
    </v-card>

    <!-- WRONG ANSWER DIALOG -->
    <v-dialog v-model="showWrongDialog" persistent max-width="460">
      <v-card @keydown.enter.prevent.stop="handleEnter" color="yellow-lighten-2 pa-3">
        <v-card-title class="text-h6 mt-4">
          {{ lastOutOfTime ? "Time ran out" : "Wrong" }}
          <v-icon :icon="lastOutOfTime ? 'mdi-timer-off-outline' : 'mdi-emoticon-sad-outline'" />
        </v-card-title>

        <v-card-text>
          <p class="mb-2">
            Word: <strong>{{ currentPrompt.word }}</strong>
          </p>
          <p class="mb-2">
            Target: <strong class="text-capitalize">{{ targetForm }}</strong>
          </p>
          <p class="mb-2">
            Your answer: <strong>{{ lastUserAnswer || "—" }}</strong>
          </p>
          <p class="mb-0">
            Correct answer(s):
            <strong>{{ lastCorrectAnswers }}</strong>
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

import {
  chooseTargetForm,
  checkAnswer,
  buildCorrectAnswerLabel,
} from "@/assets/scripts/comparison/ComparisonPromptEngine";

const ROUND_SECONDS = 25;
const WARN_SECONDS = 10;
const DANGER_SECONDS = 4;

const ignoreEnterUntil = ref(0);
const ENTER_GUARD_MS = 850;

const props = defineProps({
  prompts: { type: Array, required: true },
  gameSettings: { type: Object, default: null },
});
const emit = defineEmits(["gameOver"]);

const numRounds = props.prompts.length;
const currentRound = ref(0);
const currentPrompt = computed(() => props.prompts[currentRound.value]);

const targetForm = ref("");

const showSecondPerson = computed(() =>
  targetForm.value === "comparative" ||
  targetForm.value === "comparison_less" ||
  targetForm.value === "equality"
);

const displayedTargetForm = computed(() => {
  if (targetForm.value === "comparison_less") return "comparative";
  if (targetForm.value === "equality") return "equality";
  if (targetForm.value === "superlative_least") return "superlative";
  if (targetForm.value === "superlative") return "superlative";
  return targetForm.value;
});

const displayedCompSecondChip = computed(() => {
  if (targetForm.value === "comparison_less") return "mdi-code-less-than";
  if (targetForm.value === "comparative") return "mdi-code-greater-than";
  if (targetForm.value === "equality") return "mdi-equal";
  return null;
});

const displayedSuperSecondChip = computed(() => {
  if (targetForm.value === "superlative_least") return "MIN";
  if (targetForm.value === "superlative") return "MAX";
  return null;
});

// chip color mapping
const targetChipColor = computed(() => {
  const tf = targetForm.value;
  if (tf === "comparative" || tf === "comparison_less") return "orange";
  if (tf === "equality") return "green";
  return "blue";
});

const timeLeft = ref(ROUND_SECONDS);
let timer = null;

const startTime = ref(null);
const userAnswer = ref("");

const rightCount = ref(0);
const wrongCount = ref(0);
const remaining = ref(numRounds);

const inputLocked = ref(false);

const finishing = ref(false);

function guardEnterFor(ms = ENTER_GUARD_MS) {
  ignoreEnterUntil.value = Date.now() + ms;
}

function isEnterGuarded() {
  return Date.now() < ignoreEnterUntil.value;
}

const resultsStore = ref([]);

const showFloatingFeedback = ref(false);
const showWrongDialog = ref(false);
const wrongOkButton = ref(null);

const lastUserAnswer = ref("");
const lastCorrectAnswers = ref("");
const lastOutOfTime = ref(false);

const progressValue = computed(() => (currentRound.value / numRounds) * 100);

function initials(name) {
  const parts = String(name || "").split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

/* Focus */
const answerField = ref(null);
async function focusAnswerField() {
  await nextTick();
  const el = answerField.value;
  el?.focus?.();
  const root = el?.$el || el;
  root?.querySelector?.("input")?.focus?.();
}

const getPicPath = (item) => {
  return `/images/vocab/${item.toLowerCase()}.jpg`;
};

/* Timer */
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

function handleTimeOut() {
  if (inputLocked.value) return;
  inputLocked.value = true;
  stopTimer();

  const user = userAnswer.value.trim();

  lastUserAnswer.value = user || "—";
  lastCorrectAnswers.value = buildCorrectAnswerLabel(
    currentPrompt.value,
    targetForm.value,
    props.gameSettings
  );
  lastOutOfTime.value = true;

  recordRound(user, false, true);
  showWrongDialog.value = true;
}

const timerClass = computed(() => {
  if (timeLeft.value <= DANGER_SECONDS) return "timer-danger";
  if (timeLeft.value <= WARN_SECONDS) return "timer-warn";
  return "timer-ok";
});

watch(showWrongDialog, async (visible, wasVisible) => {
  if (visible) {
    await nextTick();
    wrongOkButton.value?.$el?.focus();
  } else if (wasVisible) {
    // dialog just closed: block Enter briefly + refocus input
    guardEnterFor();
    await focusAnswerField();
  }
});

function beginRound() {
  targetForm.value = chooseTargetForm();
  userAnswer.value = "";
  inputLocked.value = false;

  startTimer();
  focusAnswerField();
}

function submit() {
  if (inputLocked.value) return;
  inputLocked.value = true;

  stopTimer();

  const user = userAnswer.value.trim();
  const correct = checkAnswer(currentPrompt.value, targetForm.value, user, props.gameSettings);

  recordRound(user, correct, false);

  if (correct) {
    showFloatingFeedback.value = true;
    setTimeout(() => (showFloatingFeedback.value = false), 900);
    next();
  } else {
    lastUserAnswer.value = user || "—";
    lastCorrectAnswers.value = buildCorrectAnswerLabel(
      currentPrompt.value,
      targetForm.value,
      props.gameSettings
    );
    lastOutOfTime.value = false;
    showWrongDialog.value = true;
  }
}

function next() {
  if (currentRound.value >= numRounds - 1) {
    finishGame();
    return;
  }

  currentRound.value++;
  remaining.value--;
  beginRound();
}

function acknowledgeWrong() {
  guardEnterFor(1200);     // slightly longer if you want
  inputLocked.value = true;

  // Close dialog
  showWrongDialog.value = false;

  // Wait for dialog transition / DOM update, then go next round.
  // This reduces the chance that the keyup lands on the input as "submit".
  nextTick(() => {
    setTimeout(() => {
      next();
    }, 0);
  });
}

function recordRound(user, correct, outOfTime = false) {
  const roundNumber = resultsStore.value.length + 1;
  const secondsUsed = ROUND_SECONDS - timeLeft.value;

  resultsStore.value.push({
    question: `${currentPrompt.value.word} (${targetForm.value})`,
    correct_answer: buildCorrectAnswerLabel(currentPrompt.value, targetForm.value, props.gameSettings),
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
}

function buildGameName(settings) {
  const variant = settings?.partOfSpeech || "mix";
  return `Comparison Challenge - ${variant}`;
}

async function finishGame() {
  stopTimer();
  finishing.value = true; 

  const finishedAt = new Date();
  const totalSeconds = Math.floor((finishedAt.getTime() - startTime.value.getTime()) / 1000);
  const avgTime = resultsStore.value.length > 0 ? totalSeconds / resultsStore.value.length : 0;

  const payload = {
    game_name: buildGameName(props.gameSettings),
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

function handleEnter(e) {
  // Swallow Enter if we're in the guard window
  if (isEnterGuarded()) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    return;
  }

  // If dialog is open, Enter means "OK"
  if (showWrongDialog.value) {
    acknowledgeWrong();
    return;
  }

  // Otherwise, Enter means "Submit"
  submit();
}

onMounted(() => {
  startTime.value = new Date();
  beginRound();
 
});

onBeforeUnmount(stopTimer);
</script>

<style scoped>
.game-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.game-middle {
  flex: 1;
  margin-top: 2%;
}

.avatar-initials {
  font-weight: 700;
  color: rgba(0, 0, 0, 0.65);
}

/* Floating feedback */
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

/* Timer */
.timer-pill {
  padding: 2px 8px;
  border-radius: 999px;
  transition: background-color 150ms ease, color 150ms ease;
}
.timer-ok { background: transparent; }
.timer-warn { background: rgba(255, 193, 7, 0.25); }
.timer-danger { background: rgba(244, 67, 54, 0.22); }
</style>