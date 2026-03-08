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

    <v-card class="pt-1 px-4" width="900" height="670" elevation="2">
      <div class="game-layout">
        <!-- MIDDLE -->
        <div class="game-middle">
          <v-card class="pa-3" elevation="0" variant="flat">
            <div class="d-flex ga-4">
              <!-- Main content area -->
              <div class="flex-grow-1">
                
                <!-- Grid layout for 7 information elements -->
                <div class="info-grid mb-4">
                  
                  <!-- ROW 1: The Two Ideas -->
                  <div class="info-section span-2">
                    <div class="section-label">Idea 1</div>
                    <div class="section-content idea-content">
                      {{ round.idea1 || 'Error loading idea 1' }}
                    </div>
                  </div>

                  <div class="info-section span-2">
                    <div class="section-label">Idea 2</div>
                    <div class="section-content idea-content">
                      {{ round.idea2 || 'Error loading idea 2' }}
                    </div>
                  </div>

                  <!-- ROW 2: Relationship and Behavior -->
                  <div class="info-section">
                    <div class="section-label">Relationship</div>
                    <div class="section-content d-flex align-center justify-center">
                      <v-img
                        :src="round.imagePath"
                        :alt="round.imageKey"
                        max-height="70"
                        aspect-ratio="4/3"
                        cover
                        class="rounded me-3"
                      />
                      <v-chip
                        color="primary"
                        variant="flat"
                        size="small"
                        class="text-uppercase"
                        style="margin-top: 2%;"
                      >
                        {{ round.variant || round.category }}
                      </v-chip>
                    </div>
                  </div>

                  <div class="info-section">
                    <div class="section-label">Behavior</div>
                    <div class="section-content d-flex align-center justify-center">
                      <v-chip
                        :color="behaviorColor"
                        variant="flat"
                        class="text-capitalize"
                        style="margin-top: 6%;"
                      >
                        {{ round.behavior }}
                      </v-chip>
                    </div>
                  </div>

                  <!-- ROW 3: Complete Sentence -->
                  <div class="info-section span-2">
                    <div class="section-label">Complete Sentence</div>
                    <div class="section-content sentence-content">
                      "{{ round.promptText }}"
                    </div>
                  </div>

                  <!-- ROW 4: Translations and Not Allowed -->
                  <div class="info-section">
                    <div class="section-label">Translations</div>
                    <div class="section-content centered-content">
                      <div class="d-flex ga-1">
                        <v-tooltip location="bottom">
                          <template v-slot:activator="{ props: tooltipProps }">
                            <v-chip
                              v-bind="tooltipProps"
                              size="small"
                              color="blue-grey-lighten-4"
                              class="translation-chip me-3"
                            >
                              FR
                            </v-chip>
                          </template>
                          <div class="translation-tooltip">
                            <div class="text-subtitle-2 mb-1">French</div>
                            <div class="text-caption">{{ frenchHint }}</div>
                          </div>
                        </v-tooltip>

                        <v-tooltip location="bottom">
                          <template v-slot:activator="{ props: tooltipProps }">
                            <v-chip
                              v-bind="tooltipProps"
                              size="small"
                              color="blue-grey-lighten-4"
                              class="translation-chip me-3"
                            >
                              DE
                            </v-chip>
                          </template>
                          <div class="translation-tooltip">
                            <div class="text-subtitle-2 mb-1">German</div>
                            <div class="text-caption">{{ germanHint }}</div>
                          </div>
                        </v-tooltip>

                        <v-tooltip location="bottom">
                          <template v-slot:activator="{ props: tooltipProps }">
                            <v-chip
                              v-bind="tooltipProps"
                              size="small"
                              color="blue-grey-lighten-4"
                              class="translation-chip"
                            >
                              IT
                            </v-chip>
                          </template>
                          <div class="translation-tooltip">
                            <div class="text-subtitle-2 mb-1">Italian</div>
                            <div class="text-caption">{{ italianHint }}</div>
                          </div>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>

                  <div class="info-section">
                    <div class="section-label">Not Allowed</div>
                    <div class="section-content centered-content">
                          <v-chip
                            v-bind="tooltipProps"
                            size="small"
                            color="red-lighten-1"
                            class="translation-chip"
                          >
                            <v-icon size="x-small" start>mdi-cancel</v-icon>
                            {{ excludedHint }}
                          </v-chip>
                    </div>
                  </div>
                </div>

                <!-- Input and Submit -->
                <div class="d-flex justify-center mb-2" style="margin-top: 10%; margin-bottom: 8%;">
                  <v-text-field
                    ref="answerField"
                    v-model="userAnswer"
                    label="Type a linking word"
                    hide-details
                    density="compact"
                    :disabled="inputLocked"
                    @keydown.enter.prevent="handleEnter"
                    max-width="250"
                  />
                  
                  <v-btn class="ms-2" color="primary" @click="submit" :disabled="inputLocked">Submit</v-btn>
                    
                  <div class="text-subtitle-2 ms-6 timer-pill" :class="timerClass">⏱ {{ timeLeft }} s</div>
                
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

          <div class="d-flex justify-space-between align-center">
            <RouterLink :to="{ name: 'games' }">
              <v-btn icon elevation="0" size="medium">
                <v-icon color="grey-darken-3" size="medium">mdi-arrow-left-circle</v-icon>
              </v-btn>
            </RouterLink>
            <div>Round {{ currentRound + 1 }} / {{ numRounds }}</div>
            <div class="d-flex justify-center align-center">
              <div class="me-3">✅ {{ rightCount }}</div>
              <div>❌ {{ wrongCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <!-- WRONG ANSWER DIALOG -->
    <v-dialog v-model="showWrongDialog" persistent max-width="600">
      <v-card color="yellow-lighten-4" class="pa-4">
        <v-card-title class="text-h5 d-flex align-center justify-space-between pa-0 mb-4">
          <span>
            <v-icon 
              :icon="lastOutOfTime ? 'mdi-timer-off-outline' : 'mdi-close-circle-outline'" 
              size="large"
              :color="lastOutOfTime ? 'orange-darken-2' : 'red-darken-1'"
              class="me-2"
            />
            {{ lastOutOfTime ? "Time's Up!" : "Incorrect Answer" }}
          </span>
        </v-card-title>

        <v-divider class="mb-4"></v-divider>

        <v-card-text class="pa-0">
          <div class="info-box mb-3">
            <div class="info-box-label">Ideas to link</div>
            <div class="info-box-content">
              <div class="mb-2">
                <strong>Idea 1:</strong> {{ round.idea1 }}
              </div>
              <div>
                <strong>Idea 2:</strong> {{ round.idea2 }}
              </div>
            </div>
          </div>

          <div class="info-box mb-3">
            <div class="info-box-label">Your answer</div>
            <div class="info-box-content">
              <v-chip color="red-lighten-3" variant="flat">
                {{ lastUserAnswer || "—" }}
              </v-chip>
            </div>
          </div>
          <v-alert 
            v-if="wrongReasonLabel" 
            type="info" 
            variant="tonal"
            density="compact"
            class="my-3"
          >
            {{ wrongReasonLabel }}
          </v-alert>

          <div class="info-box mb-3">
            <div class="info-box-label">Accepted answers (unused)</div>
            <div class="info-box-content">
              {{ lastCorrectAnswers || "—" }}
            </div>
          </div>


        </v-card-text>

        <v-card-actions class="pa-0 mt-4">
          <v-spacer></v-spacer>
          <v-btn 
            ref="wrongOkButton" 
            color="primary" 
            variant="elevated"
            size="large"
            @click="acknowledgeWrong"
          >
            Continue
          </v-btn>
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
  getTranslationsByLanguage,
  formatTranslationsForLanguage,
  formatExcludedLinkers,
  splitPromptIntoIdeas
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

// Translation hints for each language
const translations = computed(() => getTranslationsByLanguage(round.value.translations ?? null))

const frenchHint = computed(() => formatTranslationsForLanguage(translations.value.french))
const germanHint = computed(() => formatTranslationsForLanguage(translations.value.german))
const italianHint = computed(() => formatTranslationsForLanguage(translations.value.italian))

// Excluded linkers hint
const excludedHint = computed(() => formatExcludedLinkers(round.value.excludedLinkers))

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
  flex: 0 1 auto;
  margin-top: 1%;
}

/* Information Grid Layout */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-width: 650px;
  margin: 0 auto;
}

.info-section {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px 12px;
  min-height: 70px;
}

.info-section.span-2 {
  grid-column: span 2;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #1976d2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 2px;
}

.section-content {
  font-size: 0.95rem;
  line-height: 1.4;
  color: #333;
}

.idea-content {
  font-weight: 400;
  color: #1a1a1a;
  font-size: 0.85rem;
}

.sentence-content {
  font-style: italic;
  color: #666;
  font-size: 1rem;
}

.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
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
  padding: 6px 12px; /* Increased top/bottom padding */
  border-radius: 999px;
  transition: background-color 150ms ease, color 150ms ease;
  min-width: 70px;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1; /* Ensures text sits exactly in the middle */
}
.timer-ok { background: #e8f5e9; color: #2e7d32; }
.timer-warn { background: #fff3e0; color: #f57c00; }
.timer-danger { background: #ffebee; color: #c62828; }

/* Translation chips */
.translation-chip {
  cursor: help;
  font-weight: 600;
}

.translation-tooltip {
  max-width: 300px;
  padding: 8px;
}

/* Used linkers column */
.used-linkers-col {
  flex: 0 0 300px;
  width: 300px;
  max-width: 300px;
}

.used-linkers-scroll {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 6px;
}

.used-linkers-scroll::-webkit-scrollbar {
  width: 8px;
}
.used-linkers-scroll::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.18);
  border-radius: 8px;
}

.group-complete {
  background: #e8f5e9;
  border-color: #66bb6a !important;
}
.group-complete .used-group-header {
  color: #1b5e20;
}

/* Wrong Answer Dialog Styles */
.info-box {
  background: white;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #e0e0e0;
}

.info-box-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.info-box-content {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;
}
</style>