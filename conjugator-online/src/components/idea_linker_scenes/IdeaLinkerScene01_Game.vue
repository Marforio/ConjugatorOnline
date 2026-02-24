<!-- src/components/idea_linker/idea_linker_scenes/IdeaLinkerScene01_Game.vue -->
<template>
  <v-container fluid class="pa-4 d-flex justify-center">
    <v-overlay v-model="finishing" class="align-center justify-center" persistent>
      <div class="text-center">
        <v-progress-circular indeterminate size="48" />
        <div class="mt-3 text-subtitle-2">Saving your results…</div>
      </div>
    </v-overlay>

    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="pt-2 px-4" width="900" height="700" elevation="2">
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
          <v-card class="pa-3 my-1" elevation="2" variant="flat">
            <div class="d-flex ga-4">
              <!-- Prompt + input -->
              <div class="flex-grow-1">
                <div class="d-flex justify-center align-end" style="margin-bottom: 10%;">

                  <!-- LEFT BOX -->
                  <div class="d-flex flex-column align-center pa-3 rounded-lg" style="border: 1px solid #ccc;">
                    <v-img
                      :src="round.imagePath"
                      :alt="round.imageKey"
                      width="100"
                      aspect-ratio="4/3"
                      cover
                      class="rounded-lg mb-2"
                    />

                    <v-chip
                      color="primary"
                      variant="flat"
                      class="text-uppercase mt-1"
                    >
                      {{ round.variant || round.category }}
                    </v-chip>
                  </div>

                  <!-- RIGHT CHIP -->
                  <v-chip
                    :color="behaviorColor"
                    variant="flat"
                    class="text-capitalize ms-4 my-3"
                  >
                    {{ round.behavior }}
                  </v-chip>

                </div>
                <div class="text-subtitle-1 text-center mb-3 mx-4">{{ round.promptText }}</div>



                <div v-if="gameSettings?.showTranslations && round.translations" class="text-caption text-center mb-3">
                  <strong>Hint:</strong> {{ translationsHint }}
                </div>
                <div class="d-flex justify-center my-5">
                  <v-text-field
                    ref="answerField"
                    v-model="userAnswer"
                    label="Type a linking word"
                    hide-details
                    density="compact"
                    :disabled="inputLocked"
                    @keydown.enter.prevent="handleEnter"
                    style="margin-top: 2rem;"
                    max-width="200"
                  />
                </div>

              

                <div class="d-flex justify-center mt-3">
                  <v-btn color="primary" @click="submit" :disabled="inputLocked">Submit</v-btn>
                </div>
              </div>

              <!-- Used linkers column -->
              <div class="used-linkers-col">
                <div class="text-subtitle-2 mb-2">Used linkers</div>

                <div v-if="usedLinkersList.length === 0" class="text-caption text-medium-emphasis">
                  None yet.
                </div>

                <div v-else class="used-linkers-scroll d-flex flex-column ga-2">
                  <v-card
                    v-for="g in groupStats"
                    :key="g.key"
                    variant="outlined"
                    class="pa-2"
                    :class="{ 'group-complete': g.used >= g.needed }"
                  >
                    <div class="d-flex justify-space-between align-center used-group-header">
                      <div class="text-caption font-weight-medium text-uppercase">
                        {{ g.key }}
                      </div>
                      <div class="text-caption">
                        ({{ g.used }} / {{ g.needed }})
                      </div>
                    </div>

                    <div v-if="g.usedArr.length === 0" class="text-caption text-medium-emphasis">
                      —
                    </div>

                    <div v-else class="d-flex flex-wrap ga-1">
                      <v-chip
                        v-for="l in g.usedArr"
                        :key="l"
                        size="x-small"
                        color="grey-lighten-2"
                        variant="flat"
                      >
                        {{ l }}
                      </v-chip>
                    </div>
                  </v-card>
                </div>
              </div>
            </div>
          </v-card>
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
    <v-dialog v-model="showWrongDialog" persistent max-width="520">
      <v-card @keydown.enter.prevent.stop="handleEnter" color="yellow-lighten-2 pa-3">
        <v-card-title class="text-h6 mt-4">
          {{ lastOutOfTime ? "Time ran out" : "Wrong" }}
          <v-icon :icon="lastOutOfTime ? 'mdi-timer-off-outline' : 'mdi-emoticon-sad-outline'" />
        </v-card-title>

        <v-card-text>
          <p class="mb-2">
            Prompt:
            <strong>{{ round.promptText }}</strong>
          </p>
          <p class="mb-2">
            Your answer:
            <strong>{{ lastUserAnswer || "—" }}</strong>
          </p>
          <p class="mb-0">
            Accepted (unused) answers:
            <strong>{{ lastCorrectAnswers || "—" }}</strong>
          </p>
          <p v-if="wrongReasonLabel" class="mt-2 mb-0 text-caption">
            Note: {{ wrongReasonLabel }}
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
  ROUND_SECONDS,
  buildCorrectAnswersLabel,
  checkIdeaLinkerAnswer,
  getEligibleLinkers,
  translationsLabel,
} from "@/assets/scripts/idea_linker/IdeaLinkerPromptEngine";

const props = defineProps({
  rounds: { type: Array, required: true },
  gameSettings: { type: Object, default: null },
});

const behaviorColor = computed(() => {
  const b = round.value?.behavior
  switch (b) {
    case "sentence modifier":
      return "red"
    case "+ noun phrase":
      return "light-blue"
    case "+ subordinate clause":
      return "light-green"
    default:
      return "grey"
  }
})


const emit = defineEmits(["gameOver"]);

const numRounds = props.rounds.length;
const currentRound = ref(0);
const round = computed(() => props.rounds[currentRound.value]);

const timeLeft = ref(ROUND_SECONDS);
let timer = null;

const startTime = ref(null);
const userAnswer = ref("");

const rightCount = ref(0);
const wrongCount = ref(0);
const remaining = ref(numRounds);

const inputLocked = ref(false);
const finishing = ref(false);

const progressValue = computed(() => ((currentRound.value) / numRounds) * 100);

/* used linkers */
const usedLinkers = ref(new Set());
const usedLinkersList = computed(() => Array.from(usedLinkers.value));

/* feedback + dialog */
const showFloatingFeedback = ref(false);
const showWrongDialog = ref(false);
const wrongOkButton = ref(null);

const lastUserAnswer = ref("");
const lastCorrectAnswers = ref("");
const lastOutOfTime = ref(false);
const lastWrongReason = ref("");

const translationsHint = computed(() => translationsLabel(round.value.translations ?? null));

/* Enter guard */
const ignoreEnterUntil = ref(0);
const ENTER_GUARD_MS = 900;

function guardEnterFor(ms = ENTER_GUARD_MS) {
  ignoreEnterUntil.value = Date.now() + ms;
}
function isEnterGuarded() {
  return Date.now() < ignoreEnterUntil.value;
}

/* Focus */
const answerField = ref(null);
async function focusAnswerField() {
  await nextTick();
  const el = answerField.value;
  el?.focus?.();
  const root = el?.$el || el;
  root?.querySelector?.("input")?.focus?.();
  root?.querySelector?.("input")?.select?.();
}

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

const WARN_SECONDS = 10;
const DANGER_SECONDS = 5;
const timerClass = computed(() => {
  if (timeLeft.value <= DANGER_SECONDS) return "timer-danger";
  if (timeLeft.value <= WARN_SECONDS) return "timer-warn";
  return "timer-ok";
});

function groupKeyForRound(r) {
  return String(r?.variant || r?.category || "Other");
}

// Map: groupKey -> number of rounds in this game for that group (needed)
const neededByGroup = computed(() => {
  const out = new Map();
  for (const r of props.rounds || []) {
    const k = groupKeyForRound(r);
    out.set(k, (out.get(k) || 0) + 1);
  }
  return out;
});

// Map: groupKey -> array of linkers the user has used in that group
const usedLinkersByGroup = ref(new Map());

// Helper: ensure group exists
function ensureGroup(k) {
  if (!usedLinkersByGroup.value.has(k)) usedLinkersByGroup.value.set(k, []);
  return usedLinkersByGroup.value.get(k);
}

// Derive a stable array for rendering (sorted by needed desc, then name)
const groupStats = computed(() => {
  const needed = neededByGroup.value;

  const keys = Array.from(needed.keys()).sort((a, b) => {
    const na = needed.get(a) || 0;
    const nb = needed.get(b) || 0;
    if (nb !== na) return nb - na;
    return a.localeCompare(b);
  });

  return keys.map((k) => {
    const usedArr = usedLinkersByGroup.value.get(k) || [];
    return {
      key: k,
      needed: needed.get(k) || 0,
      used: usedArr.length,
      usedArr,
    };
  });
});


function beginRound() {
  userAnswer.value = "";
  inputLocked.value = false;
  startTimer();
  focusAnswerField();
}

function submit() {
  if (isEnterGuarded()) return;
  if (inputLocked.value) return;

  inputLocked.value = true;
  stopTimer();

  const user = userAnswer.value.trim();

  if (timeLeft.value <= 0) {
    // already timed out
    return;
  }

  const result = checkIdeaLinkerAnswer(round.value, user, usedLinkers.value);
  const correct = result.correct;

  recordRound(user, correct, false, result.correctAnswers, correct ? "" : result.reason);

  if (correct) {
    usedLinkers.value.add(result.chosenLinker);

    const k = groupKeyForRound(round.value);
    const arr = ensureGroup(k);

    // avoid duplicates in the per-group list (shouldn't happen, but safe)
    if (!arr.includes(result.chosenLinker)) arr.push(result.chosenLinker);

    showFloatingFeedback.value = true;
    setTimeout(() => (showFloatingFeedback.value = false), 900);
    next();
  } else {
      lastUserAnswer.value = user || "—";
      lastCorrectAnswers.value = buildCorrectAnswersLabel(result.correctAnswers);
      lastOutOfTime.value = false;
      lastWrongReason.value = result.reason;
      showWrongDialog.value = true;
    }
  }

function handleTimeOut() {
  if (inputLocked.value) return;

  inputLocked.value = true;
  stopTimer();

  const user = userAnswer.value.trim();

  const eligible = getEligibleLinkers(round.value, usedLinkers.value);

  recordRound(user, false, true, eligible, "timeout");

  lastUserAnswer.value = user || "—";
  lastCorrectAnswers.value = buildCorrectAnswersLabel(eligible);
  lastOutOfTime.value = true;
  lastWrongReason.value = "timeout";
  showWrongDialog.value = true;
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
  // guard BEFORE dialog closes
  guardEnterFor(900);

  // lock input during transition
  inputLocked.value = true;

  showWrongDialog.value = false;

  nextTick(() => {
    setTimeout(() => {
      next();
    }, 0);
  });
}


const wrongReasonLabel = computed(() => {
  if (lastWrongReason.value === "excluded") return "That linker is explicitly excluded in this set.";
  if (lastWrongReason.value === "already_used") return "You already used that linker earlier in this game.";
  if (lastWrongReason.value === "not_in_list") return "That linker is not accepted for this set.";
  if (lastWrongReason.value === "timeout") return "No answer in time.";
  return "";
});

watch(showWrongDialog, async (visible, wasVisible) => {
  if (visible) {
    await nextTick();
    wrongOkButton.value?.$el?.focus();
  } else if (wasVisible) {
    guardEnterFor();
    setTimeout(() => focusAnswerField(), 50);
  }
});

/* results store + api */
const resultsStore = ref([]);

function recordRound(user, correct, outOfTime, eligibleAnswers, wrongReason) {
  const roundNumber = resultsStore.value.length + 1;
  const secondsUsed = ROUND_SECONDS - timeLeft.value;

  resultsStore.value.push({
    question: round.value.promptText,
    correct_answer: buildCorrectAnswersLabel(eligibleAnswers),
    prompt_number: roundNumber,
    user_answer: user,
    is_correct: correct,
    out_of_time: outOfTime,
    elapsed_time: secondsUsed,
    // extra metadata (optional)
    category: round.value.category,
    variant: round.value.variant,
    behavior: round.value.behavior,
    used_linkers: Array.from(usedLinkers.value),
    wrong_reason: wrongReason || null,
    typo: false,
    typo_requested: false,
    typo_accepted: null,
  });

  correct ? rightCount.value++ : wrongCount.value++;
}

function buildGameName(settings) {
  return `Idea Linker`;
}

async function finishGame() {
  stopTimer();
  finishing.value = true;

  const finishedAt = new Date();
  const startedAt = startTime.value instanceof Date ? startTime.value : finishedAt;
  startTime.value = startedAt;

  const totalSeconds = Math.floor((finishedAt.getTime() - startedAt.getTime()) / 1000);
  const avgTime = resultsStore.value.length > 0 ? totalSeconds / resultsStore.value.length : 0;

  const payload = {
    game_name: buildGameName(props.gameSettings),
    total_rounds: numRounds,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: startedAt.toISOString(),
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

/* unified Enter */
function handleEnter(e) {
  if (isEnterGuarded()) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    return;
  }

  // if dialog visible → Enter confirms
  if (showWrongDialog.value) {
    acknowledgeWrong();
    return;
  }

  if (inputLocked.value) {
    e?.preventDefault?.();
    return;
  }

  submit();
}


/* Mount */
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

/* B) fixed width column that never changes during the game */
.used-linkers-col {
  flex: 0 0 400px;       /* fixed column width in flex row */
  width: 400px;
  max-width: 400px;
}

/* A) scrollable area */
.used-linkers-scroll {
  max-height: 500px;     /* adjust to taste */
  overflow-y: auto;
  padding-right: 6px;    /* keep chips from hiding under scrollbar */
}

/* Optional: nicer scrollbar spacing on WebKit */
.used-linkers-scroll::-webkit-scrollbar {
  width: 8px;
}
.used-linkers-scroll::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.18);
  border-radius: 8px;
}

/* C) completed group background */
.group-complete {
  background: #e8f5e9;          /* light green */
  border-color: #66bb6a !important;
}
.group-complete .used-group-header {
  color: #1b5e20;
}

</style>