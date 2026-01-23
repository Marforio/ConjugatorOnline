<template>
  <v-container fluid class="pa-4 d-flex justify-center">

    <!-- Floating feedback -->
    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="p-4" width="760" min-height="660" elevation="3">

      <!-- PRE-GAME -->
      <div v-if="!gameStarted" class="p-3">
        <div class="d-flex justify-center mb-3">
          <v-img src="/images/banners/VocabWorkout.png" max-width="420" />
        </div>

        <v-list density="compact">
          <v-list-item>
            <template #prepend><v-icon icon="mdi-gamepad-variant-outline" /></template>
            <v-list-item-title>
              Mode: <strong class="text-capitalize">{{ modeLabel }}</strong>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-book-open-variant" /></template>
            <v-list-item-title>
              Verb set: <strong>{{ levelLabel }}</strong>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-swap-horizontal" /></template>
            <v-list-item-title>
              Study pair: <strong>{{ frontLabel }}</strong> → <strong>{{ backLabel }}</strong>
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-counter" /></template>
            <v-list-item-title>
              {{ roundCount }} {{ roundCount === 1 ? "item" : "items" }}
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <div class="d-flex justify-center mt-6">
          <v-btn color="success" @click="begin" :disabled="!hasAnyItems">Start</v-btn>
        </div>

        <div v-if="!hasAnyItems" class="text-caption text-center mt-4">
          No items were loaded. Please go back and try again.
        </div>
      </div>

      <!-- GAME -->
      <div v-else class="game-layout">

        <div v-if="!hasItem" class="p-6 text-center">
          <v-progress-circular indeterminate />
          <div class="text-caption mt-3">Loading…</div>
        </div>

        <template v-else>
          <!-- TOP -->
          <div class="game-top">
            <div class="d-flex justify-space-between mb-2">
              <div>Item {{ currentIndex + 1 }} / {{ roundCount }}</div>
              <div class="text-caption text-medium-emphasis">
                ✅ {{ rightCount }} • ❌ {{ wrongCount }}
              </div>
            </div>
          </div>

          <!-- CONTENT -->
          <div class="game-middle">
            <v-card class="pa-3" elevation="3">

              <div class="d-flex align-center justify-space-between">
                <div class="text-subtitle-1 font-weight-medium">
                  {{ getFrontText(currentItem, frontField) }}
                </div>

                <v-chip v-if="currentItem.level" size="small" variant="outlined">
                  {{ currentItem.level }}
                </v-chip>
              </div>

              <div class="text-caption text-medium-emphasis mt-1">
                Term: <strong>{{ currentItem.term }}</strong>
              </div>

              <v-divider class="my-3" />

              <!-- CARDS -->
              <template v-if="mode === 'cards'">
                <div class="d-flex justify-center">
                  <div class="card-stage">
                    <!-- LEFT NAV -->
                    <v-btn
                      class="nav-btn nav-left"
                      color="primary"
                      variant="flat"
                      icon
                      size="x-large"
                      :disabled="currentIndex === 0"
                      @click.stop="goPrevCard"
                      aria-label="Previous card"
                    >
                      <v-icon size="40">mdi-chevron-left</v-icon>
                    </v-btn>

                    <!-- RIGHT NAV -->
                    <v-btn
                      class="nav-btn nav-right"
                      color="primary"
                      variant="flat"
                      icon
                      size="x-large"
                      :disabled="currentIndex >= roundCount - 1"
                      @click.stop="goNextCard"
                      aria-label="Next card"
                    >
                      <v-icon size="40">mdi-chevron-right</v-icon>
                    </v-btn>

                    <!-- SLIDE transition between items -->
                    <Transition :name="slideName" mode="out-in">
                      <div :key="currentItem?.id || currentIndex">
                        <!-- FLIP card -->
                        <div class="flip-wrap" @click="toggleSide">
                          <div class="flip-inner" :class="{ 'is-back': shownSide === 'back' }">
                            <!-- FRONT -->
                            <v-card class="flip-face flip-front pa-4" elevation="2" width="540">
                              <div class="d-flex align-center ga-4">
                                <v-avatar v-if="currentItem.image" size="86" rounded="lg">
                                  <v-img :src="currentItem.image" cover />
                                </v-avatar>

                                <div class="flex-1">
                                  <div class="text-h6 mb-2">{{ frontPreview }}</div>
                                  <div class="text-caption text-medium-emphasis">
                                    Front • click / ↑↓ to flip • ←→ to navigate
                                  </div>
                                </div>
                              </div>
                            </v-card>

                            <!-- BACK -->
                            <v-card class="flip-face flip-back pa-4" elevation="2" width="540">
                              <div class="d-flex align-center ga-4">
                                <v-avatar v-if="currentItem.image" size="86" rounded="lg">
                                  <v-img :src="currentItem.image" cover />
                                </v-avatar>

                                <div class="flex-1">
                                  <div class="text-h6 mb-2">{{ backPreview }}</div>
                                  <div class="text-caption text-medium-emphasis">
                                    Back • click / ↑↓ to flip • ←→ to navigate
                                  </div>

                                  <div class="text-caption text-medium-emphasis mt-1">
                                    Default side: <strong class="text-capitalize">{{ defaultSide }}</strong>
                                  </div>
                                </div>
                              </div>
                            </v-card>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </template>



              <!-- WRITING -->
              <template v-else-if="mode === 'write'">
                <div class="text-caption text-medium-emphasis mb-2">
                  Type the answer for <strong>{{ backLabel }}</strong>.
                </div>

                <div ref="answerWrap">
                  <v-text-field
                    v-model="userAnswer"
                    label="Your answer"
                    hide-details
                    density="comfortable"
                    @keyup.enter="submitWrite"
                  />
                </div>

                <div class="d-flex justify-center mt-4">
                  <v-btn color="primary" @click="submitWrite">
                    Submit
                  </v-btn>
                </div>
              </template>

              <!-- MULTIPLE CHOICE -->
              <template v-else-if="mode === 'multiple_choice'">
                <div class="text-caption text-medium-emphasis mb-2">
                  Choose the correct <strong>{{ backLabel }}</strong>.
                </div>

                <div class="d-flex flex-wrap ga-2 justify-center">
                  <v-chip
                    v-for="opt in mcOptions"
                    :key="opt"
                    class="ma-1"
                    variant="outlined"
                    @click="submitChoice(opt)"
                  >
                    {{ opt }}
                  </v-chip>
                </div>
              </template>

              <!-- QUIZ / MATCH placeholders -->
              <template v-else>
                <div class="text-caption text-medium-emphasis">
                  Mode "{{ mode }}" is scaffolded but not implemented yet in this pass.
                </div>
              </template>

            </v-card>
          </div>

          <!-- BOTTOM -->
          <div class="game-bottom mt-4">
            <v-progress-linear
              :model-value="progressValue"
              height="10"
              class="mb-2"
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

    <!-- WRONG DIALOG (writing + MC) -->
    <v-dialog v-model="showWrongDialog" persistent max-width="520">
      <v-card color="yellow-lighten-2 pa-3">
        <v-card-title class="text-h6 mt-4">
          Wrong <v-icon icon="mdi-emoticon-sad-outline" />
        </v-card-title>

        <v-card-text>
          <div class="text-caption text-medium-emphasis mb-2">
            Item {{ currentIndex + 1 }} • Term <strong>{{ currentItem?.term }}</strong>
          </div>

          <p class="mb-2">
            Your answer: <strong>{{ lastUserAnswer || "—" }}</strong>
          </p>

          <p class="mb-0">
            Accepted:
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
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from "vue";

import {
  getFrontText,
  getAcceptedAnswers,
} from "@/assets/scripts/vocab_workout/VocabWorkoutPromptEngine";

import {
  buildMultipleChoiceOptions,
  checkUserAnswer,
} from "@/assets/scripts/vocab_workout/VocabWorkoutGameLogic";

const props = defineProps({
  planItems: { type: Array, required: true },     // VocabItem[]
  gameSettings: { type: Object, default: null },  // selections emitted by settings
});

const emit = defineEmits(["gameOver"]);

const mode = computed(() => props.gameSettings?.mode || "cards");
const level = computed(() => props.gameSettings?.level || "all");
const frontField = computed(() => props.gameSettings?.frontField || "definition");
const backField = computed(() => props.gameSettings?.backField || "past_simple");

const roundCount = computed(() => (Array.isArray(props.planItems) ? props.planItems.length : 0));
const hasAnyItems = computed(() => roundCount.value > 0);

const currentIndex = ref(0);
const currentItem = computed(() => props.planItems?.[currentIndex.value] || null);
const hasItem = computed(() => !!currentItem.value);

const remaining = ref(0);
const rightCount = ref(0);
const wrongCount = ref(0);

const resultsStore = ref([]);

const gameStarted = ref(false);

/* ---------------- labels for pre-game ---------------- */
const modeLabel = computed(() => {
  const m = mode.value;
  if (m === "cards") return "Cards";
  if (m === "write") return "Writing";
  if (m === "multiple_choice") return "Multiple choice";
  if (m === "quiz") return "Quiz";
  if (m === "match") return "Match";
  return m;
});

const levelLabel = computed(() => {
  const v = level.value;
  if (v === "all") return "All";
  if (v === "essential") return "Essential";
  if (v === "advanced") return "Advanced";
  return v;
});

const frontLabel = computed(() => {
  const f = frontField.value;
  if (f === "term") return "Term";
  return String(f);
});

const backLabel = computed(() => {
  const b = backField.value;
  if (b === "term") return "Term";
  if (b === "past_simple") return "Past simple";
  if (b === "present_perfect") return "Present perfect";
  return String(b);
});

const effectiveCardBackField = computed(() => {
  // only for cards + irregular verbs
  if (mode.value !== "cards") return backField.value;
  if (!isIrregularList.value) return backField.value;

  // force fused back if they chose either PS or PP (or later "past_forms")
  if (
    backField.value === "past_simple" ||
    backField.value === "present_perfect" ||
    backField.value === "past_forms"
  ) {
    return "past_forms";
  }
  return backField.value;
});

/* ---------------- progress ---------------- */
const progressValue = computed(() => {
  if (!roundCount.value) return 0;
  return (currentIndex.value / roundCount.value) * 100;
});

/* ---------------- cards mode ---------------- */

// identify irregular list (use whichever you actually pass)
const isIrregularList = computed(() => {
  // robust: supports either domain string OR listKey
  const domain = props.gameSettings?.domain;
  const listKey = props.gameSettings?.listKey;
  return domain === "Irregular verbs" || listKey === "irregular_verbs";
});

const isBackVerbForm = computed(() => {
  return backField.value === "past_simple" || backField.value === "present_perfect";
});

// default side rules:
// - non-irregular lists: BACK
// - irregular lists: FRONT only if back is PS/PP, else BACK
const defaultSide = computed(() => {
  if (!isIrregularList.value) return "back";
  return isBackVerbForm.value ? "front" : "back";
});

// instead of "flipped", track which side is currently shown
const shownSide = ref("front"); // "front" | "back"

function resetToDefaultSide() {
  shownSide.value = defaultSide.value;
}

function toggleSide() {
  shownSide.value = shownSide.value === "front" ? "back" : "front";
}

const frontPreview = computed(() => {
  if (!currentItem.value) return "—";
  return getFrontText(currentItem.value, frontField.value);
});

const backPreview = computed(() => {
  if (!currentItem.value) return "—";

  // fused view for irregular verbs (cards mode)
  if (effectiveCardBackField.value === "past_forms") {
    const ps = getAcceptedAnswers(currentItem.value, "past_simple");
    const pp = getAcceptedAnswers(currentItem.value, "present_perfect");

    const psText = ps.length ? ps.join(" / ") : "—";
    const ppText = pp.length ? pp.join(" / ") : "—";

    return `Past simple: ${psText}   •   Past participle: ${ppText}`;
  }

  const accepted = getAcceptedAnswers(currentItem.value, effectiveCardBackField.value);
  return accepted.join(" / ") || "—";
});


// navigation
const slideName = ref("slide-left");

function goNextCard() {
  slideName.value = "slide-left";
  recordRound({ user_answer: `(cards) viewed ${shownSide.value}`, is_correct: null });

  if (currentIndex.value >= roundCount.value - 1) {
    finishGame();
    return;
  }
  currentIndex.value++;
}

function goPrevCard() {
  slideName.value = "slide-right";
  recordRound({ user_answer: `(cards) viewed ${shownSide.value}`, is_correct: null });

  if (currentIndex.value <= 0) return;
  currentIndex.value--;
}



/* ---------------- writing mode ---------------- */
const userAnswer = ref("");
const answerWrap = ref(null);

async function focusAnswer() {
  await nextTick();
  requestAnimationFrame(() => {
    const input = answerWrap.value?.querySelector?.("input");
    input?.focus?.();
    input?.select?.();
  });
}

// focus when index changes in writing mode
watch(currentIndex, async () => {
  if (!gameStarted.value) return;

  // ALWAYS reset cards to default side when changing item
  resetToDefaultSide();

  userAnswer.value = "";

  if (mode.value === "write") {
    await focusAnswer();
  }

  if (mode.value === "multiple_choice") {
    refreshMcOptions();
  }
});


/* ---------------- multiple choice ---------------- */
const mcOptions = ref([]);

function refreshMcOptions() {
  const it = currentItem.value;
  if (!it) {
    mcOptions.value = [];
    return;
  }
  mcOptions.value = buildMultipleChoiceOptions(
    it,
    backField.value,
    props.planItems,
    4
  );
}

/* ---------------- wrong dialog ---------------- */
const showWrongDialog = ref(false);
const wrongOkButton = ref(null);
const lastUserAnswer = ref("");
const lastAcceptedAnswers = ref("");

watch(showWrongDialog, async (vis) => {
  if (vis) {
    await nextTick();
    wrongOkButton.value?.$el?.focus?.();
  }
});

/* ---------------- feedback ---------------- */
const showFloatingFeedback = ref(false);

/* ---------------- game flow ---------------- */
function begin() {
  if (!hasAnyItems.value) return;

  currentIndex.value = 0;
  remaining.value = roundCount.value;
  rightCount.value = 0;
  wrongCount.value = 0;
  resultsStore.value = [];
  gameStarted.value = true;

  userAnswer.value = "";

  // start cards on default side
  resetToDefaultSide();

  if (mode.value === "write") focusAnswer();
  if (mode.value === "multiple_choice") refreshMcOptions();
}


function submitWrite() {
  const it = currentItem.value;
  if (!it) return;

  const user = String(userAnswer.value || "").trim();
  const accepted = getAcceptedAnswers(it, backField.value);

  const correct = checkUserAnswer(it, backField.value, user);

  recordRound({
    user_answer: user,
    expected: accepted.join(" / "),
    is_correct: correct,
  });

  if (correct) {
    showFloatingFeedback.value = true;
    setTimeout(() => (showFloatingFeedback.value = false), 800);
    goNext();
  } else {
    lastUserAnswer.value = user || "—";
    lastAcceptedAnswers.value = accepted.join(" / ") || "—";
    showWrongDialog.value = true;
  }
}

function submitChoice(choice) {
  const it = currentItem.value;
  if (!it) return;

  const accepted = getAcceptedAnswers(it, backField.value);
  const correct = checkUserAnswer(it, backField.value, choice);

  recordRound({
    user_answer: choice,
    expected: accepted.join(" / "),
    is_correct: correct,
  });

  if (correct) {
    showFloatingFeedback.value = true;
    setTimeout(() => (showFloatingFeedback.value = false), 800);
    goNext();
  } else {
    lastUserAnswer.value = choice || "—";
    lastAcceptedAnswers.value = accepted.join(" / ") || "—";
    showWrongDialog.value = true;
  }
}

function acknowledgeWrong() {
  showWrongDialog.value = false;
  goNext();
}

function goNext() {
  remaining.value = Math.max(0, remaining.value - 1);

  if (currentIndex.value >= roundCount.value - 1) {
    finishGame();
    return;
  }
  currentIndex.value++;
}

function recordRound(extra) {
  const it = currentItem.value;
  if (!it) return;

  const row = {
    item_id: it.id,
    term: it.term,
    mode: mode.value,
    front_field: frontField.value,
    back_field: backField.value,
    prompt: getFrontText(it, frontField.value),
    expected: extra?.expected ?? "",
    user_answer: extra?.user_answer ?? "",
    is_correct: extra?.is_correct ?? null,
  };

  resultsStore.value.push(row);

  if (row.is_correct === true) rightCount.value++;
  if (row.is_correct === false) wrongCount.value++;
}

function finishGame() {
  const payload = {
    game_name: "VocabWorkout",
    mode: mode.value,
    level: level.value,
    front_field: frontField.value,
    back_field: backField.value,
    total_items: roundCount.value,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    rounds: resultsStore.value,
  };

  emit("gameOver", payload);
}

onMounted(() => {
  const handler = (e) => {
    if (!gameStarted.value) return;

    // don't hijack keys when typing in an input/textarea
    const tag = document.activeElement?.tagName?.toLowerCase();
    const isTyping = tag === "input" || tag === "textarea";
    if (isTyping && mode.value !== "cards") return;

    // don't handle during dialogs
    if (showWrongDialog.value) return;

    // cards mode keyboard
    if (mode.value === "cards") {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        toggleSide();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNextCard();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrevCard();
        return;
      }
    }
  };

  window.addEventListener("keydown", handler);
  onBeforeUnmount(() => window.removeEventListener("keydown", handler));
});

</script>

<style scoped>

.game-layout { display: flex; flex-direction: column; height: 100%; }
.game-middle { flex: 1; }

.flip-card { border-radius: 16px; }

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
.card-stage {
  position: relative;
  width: 540px;           /*  match the card */
  margin: 0 auto;         /*  center within its parent */
}


/* Always-visible nav buttons */
.nav-btn {
  position: absolute !important;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;

  width: 60px;
  height: 140px;            /* tall “paddle” */
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  opacity: 1;
}

.nav-left { left: -36px; }
.nav-right { right: -36px; }

/* keep them visible even disabled */
.nav-btn.v-btn--disabled {
  opacity: 0.35 !important;
}

/* ---------- FLIP animation (VERTICAL) ---------- */
.flip-wrap {
  perspective: 1200px;
  cursor: pointer;
}

.flip-inner {
  position: relative;
  width: 540px;
  min-height: 160px;
  transform-style: preserve-3d;
  transition: transform 420ms cubic-bezier(.2,.9,.2,1);
}

.flip-inner.is-back {
  transform: rotateX(180deg);
}

.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
}

/* back face rotates vertically */
.flip-back {
  transform: rotateX(180deg);
}


/* ---------- SLIDE between cards ---------- */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 220ms ease, opacity 220ms ease;
}

.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(30px);
  opacity: 0;
}


</style>
