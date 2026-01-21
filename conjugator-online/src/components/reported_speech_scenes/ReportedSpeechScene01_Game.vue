<!-- src/components/reported_speech/reported_speech_scenes/ReportedSpeechScene01_Game.vue -->
<template>
  <v-container fluid class="pa-4 d-flex justify-center">

    <!-- Floating feedback (correct only, non-blocking) -->
    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="p-4" width="560" min-height="640" elevation="3">

      <!-- START SCREEN -->
      <div v-if="!gameStarted" class="p-3">
        <div class="d-flex justify-center mb-4">
          <v-img src="/images/banners/ReportedSpeech.png" max-width="400" />
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
            <v-list-item-title class="text-wrap">
              Type only the missing verb phrase
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-alert-circle-outline" /></template>
            <v-list-item-title class="text-wrap">
              Avoid abbreviations (write 'had not' instead of <span class="text-decoration-line-through">hadn't</span>)
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <div class="d-flex justify-center mt-6">
          <v-btn color="success" @click="begin" :disabled="!hasAnyPrompts">Start</v-btn>
        </div>

        <div v-if="!hasAnyPrompts" class="text-caption text-center mt-4">
          No prompts were loaded. Please go back and try again.
        </div>
        <div class="d-flex justify-center mt-8">
            <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="large" class="ms-3">
              <v-icon color="grey-darken-3" size="large">
                mdi-arrow-left-circle
              </v-icon>
            </v-btn>
          </RouterLink>
        </div>
        
      </div>

      <!-- GAME -->
      <div v-else class="game-layout">

        <!-- loading guard -->
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
          <div class="game-middle mb-4">

            <v-card class="pa-3" elevation="3" style="margin-bottom: 16px;">

              <!-- Direct speech area: speaker pic + speech bubble -->
              <v-card-title class="">Yesterday's event</v-card-title>
              <div class="d-flex align-center ga-3">
                <div class="speaker-col">
                  <v-avatar size="120" class="ms-2 mt-3">
                    <v-img :src="speakerImg" cover />
                  </v-avatar>
                </div>

                <div class="bubble-wrap">
                  <!-- SVG bubble -->
                  <svg class="bubble-svg" viewBox="0 0 520 200" preserveAspectRatio="none">
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

                  <!-- Text inside bubble -->
                  <div class="bubble-text text-center text-wrap" v-html="highlightedDirect" style="font-size: 1rem;"></div>
                </div>
              </div>

              <v-divider class="mb-6" variant="double" thickness="3px" />

              <!-- Reported speech -->
              <v-card-title class="py-0 mb-6">Today's news</v-card-title>
              <v-card-text class="text-wrap text-center" style="font-size: 1.1rem;">
                "Yesterday, {{ `${currentPrompt.speaker} ${reportingVerb} ${currentPrompt.reported}` }}"
              </v-card-text>

              <div class="d-flex justify-center align-center">
              <div class="d-flex justify-center me-8" ref="answerWrap">
                <v-text-field
                  v-model="userAnswer"
                  label="Your answer"
                  density="compact"
                  width="300px"
                  hide-details
                  :disabled="inputLocked"
                  @keyup.enter="submit"
                />
              </div>

              <div class="d-flex justify-center my-4">
                  <v-btn color="primary" @click="submit" :disabled="inputLocked">
                  Submit
                </v-btn>
              </div>
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
    <v-dialog v-model="showWrongDialog" persistent max-width="460">
      <v-card @keydown.enter.prevent="acknowledgeWrong" color="yellow-lighten-2 pa-3">
        <v-card-title class="text-h6 mt-4">
          {{ lastOutOfTime ? "Time ran out" : "Wrong" }}
          <v-icon :icon="lastOutOfTime ? 'mdi-timer-off-outline' : 'mdi-emoticon-sad-outline'" />
        </v-card-title>

        <v-card-text>
          <div class="d-flex align-start ga-3 mb-3">
            <v-avatar size="44">
              <v-img :src="lastSpeakerImg" cover />
            </v-avatar>
            <div class="flex-1">
              <div class="text-caption text-medium-emphasis">{{ lastSpeaker }}</div>
              <div class="font-italic" v-html="lastDirectHtml"></div>
            </div>
          </div>

          <p class="mb-2">
            Reported: <span class="font-italic">{{ lastReported }}</span>
          </p>

          <p class="mb-2">
            Your answer: <strong>{{ lastUserAnswer || "—" }}</strong>
          </p>

          <p class="mb-0">
            Correct answer: <strong>{{ lastCorrectAnswer }}</strong>
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

import { reportedSpeechSpeakers } from "@/assets/scripts/reported_speech/ReportedSpeechPrompts";
import { checkAnswer, highlightSubstringHtml } from "@/assets/scripts/reported_speech/ReportedSpeechPromptEngine";

const ROUND_SECONDS = 20;
const WARN_SECONDS =10;
const DANGER_SECONDS = 4;

const REPORTING_VERBS = ["said that", "explained that", "claimed that", "declared that", "commented that", "replied that", "told me that", "announced that", "mentioned that"]

const props = defineProps({
  prompts: { type: Array, required: true },
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
const userAnswer = ref("");

const rightCount = ref(0);
const wrongCount = ref(0);
const remaining = ref(0);

const gameStarted = ref(false);
const resultsStore = ref([]);

/* ------------------------------------------------------------------
 * Speaker image + highlighting
 * ------------------------------------------------------------------ */

const speakerImg = computed(() => {
  const sp = currentPrompt.value?.speaker;
  return (sp && reportedSpeechSpeakers?.[sp]) ? reportedSpeechSpeakers[sp] : "/images/speaker_pics_resized/team.jpg";
});

const reportingVerb = ref("said that");

function pickReportingVerb() {
  const index = Math.floor(Math.random() * REPORTING_VERBS.length);
  reportingVerb.value = REPORTING_VERBS[index];
}


const highlightedDirect = computed(() => {
  const p = currentPrompt.value;
  if (!p) return "";
  // Bold the highlighted substring in direct speech
  return highlightSubstringHtml(p.direct, p.highlight);
});

/* ------------------------------------------------------------------
 * Focus helpers (focus every round)
 * ------------------------------------------------------------------ */

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

// Focus when round changes (after DOM updates)
watch(currentRound, async () => {
  if (!gameStarted.value) return;
  await nextTick();
  focusAnswer();
});

/* ------------------------------------------------------------------
 * Timer
 * ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------
 * Wrong dialog / feedback
 * ------------------------------------------------------------------ */

const showFloatingFeedback = ref(false);
const showWrongDialog = ref(false);
const wrongOkButton = ref(null);

const lastUserAnswer = ref("");
const lastCorrectAnswer = ref("");
const lastReported = ref("");
const lastSpeaker = ref("");
const lastSpeakerImg = ref("");
const lastDirectHtml = ref("");
const lastOutOfTime = ref(false);

watch(showWrongDialog, async (visible) => {
  if (visible) {
    await nextTick();
    wrongOkButton.value?.$el?.focus();
  }
});

function setWrongDialogData(user, outOfTimeFlag) {
  const p = currentPrompt.value;
  if (!p) return;

  lastUserAnswer.value = user || "—";
  lastCorrectAnswer.value = p.answer;
  lastReported.value = p.reported;
  lastSpeaker.value = p.speaker;
  lastSpeakerImg.value = (reportedSpeechSpeakers?.[p.speaker]) ? reportedSpeechSpeakers[p.speaker] : "/images/speaker_pics_resized/team.jpg";
  lastDirectHtml.value = highlightSubstringHtml(p.direct, p.highlight);
  lastOutOfTime.value = !!outOfTimeFlag;
}

/* ------------------------------------------------------------------
 * Game flow
 * ------------------------------------------------------------------ */

const progressValue = computed(() => {
  if (!hasAnyPrompts.value) return 0;
  return (currentRound.value / numRounds.value) * 100;
});

function begin() {
  if (!hasAnyPrompts.value) return;

  currentRound.value = 0;
  rightCount.value = 0;
  wrongCount.value = 0;
  resultsStore.value = [];
  remaining.value = numRounds.value;
  userAnswer.value = "";
  inputLocked.value = false;

  gameStarted.value = true;
  startTime.value = new Date();

  pickReportingVerb();
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
  pickReportingVerb();
  startTimer();
  unlockInputWithDelay();
}

function unlockInputWithDelay(delay = INPUT_COOLDOWN_MS) {
  setTimeout(async () => {
    inputLocked.value = false;

    // wait for Vuetify to re-enable the actual input
    await nextTick();
    requestAnimationFrame(() => {
      const input = answerWrap.value?.querySelector?.("input");
      input?.focus?.();
      input?.select?.();
    });
  }, delay);
}


function acknowledgeWrong() {
  showWrongDialog.value = false;
  next();
  unlockInputWithDelay();
}

/* ------------------------------------------------------------------
 * Results payload (field names IDENTICAL to Passive Party)
 * ------------------------------------------------------------------ */

function recordRound(user, correct, outOfTime = false) {
  const p = currentPrompt.value;
  if (!p) return;

  const roundNumber = resultsStore.value.length + 1;
  const secondsUsed = ROUND_SECONDS - timeLeft.value;

  resultsStore.value.push({
    question: `${p.direct} || ${p.reported}`,
    correct_answer: p.answer,
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

  const avgTime =
    resultsStore.value.length > 0 ? totalSeconds / resultsStore.value.length : 0;

  const payload = {
    game_name: "Reported Speech",
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

/* ------------------------------------------------------------------
 * Keyboard
 * ------------------------------------------------------------------ */

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
.game-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game-middle {
  flex: 1;
  margin-top: 4%;
}

.answer-spacing {
  margin-top: 22px;
}

/* Speaker + bubble */
.speaker-col {
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bubble-wrap {
  position: relative;
  flex: 1;
  min-height: 120px;
  margin-top: -56px;
}

.bubble-svg {
  width: 100%;
  height: 120px;
  display: block;
}

.bubble-text {
  position: absolute;
  top: 18px;
  left: 26px;
  right: 18px;
  bottom: 40px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-items: center;
  font-style: italic;
  line-height: 1.3;
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
