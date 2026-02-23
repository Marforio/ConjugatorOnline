<template>
    <v-overlay
      :model-value="resumeHydrating"
      persistent
      scrim="black"
      class="d-flex align-center justify-center"
    >
      <v-card class="pa-8" elevation="8">
        <div class="d-flex flex-column align-center ga-4">
          <v-progress-circular indeterminate size="64" color="primary" />
          <div class="text-h6 text-center">Loading your session...</div>
          <div class="text-caption text-medium-emphasis text-center">
            Checking your progress and position
          </div>
        </div>
      </v-card>
    </v-overlay>
  <v-container fluid class="pa-6 d-flex flex-column justify-center align-center">
    <!-- Floating feedback -->
    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="p-4" width="760" min-height="600" elevation="3">
      <!-- PRE-GAME -->
      <div v-if="!gameStarted" class="p-3">
        <div class="d-flex justify-center mb-3">
          <v-img src="/images/banners/VocabWorkout1.png" max-width="420" />
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
              List: {{ prettyListKey }} <strong v-if="prettyListKey === 'Irregular verbs'">{{ levelLabel }}</strong>
            </v-list-item-title>
          </v-list-item>

          <v-list-item v-if="isPersistedMode && gameSettings?.resumeIndex != null">
            <template #prepend><v-icon icon="mdi-playlist-play" /></template>
            <v-list-item-title>
              Resume at: <strong>{{ resumeIndexDisplay }}</strong>
              <span class="text-medium-emphasis"> of {{ roundCount }}</span>
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
          <!-- TOP HEADER -->
          <div class="d-flex justify-space-between align-start mb-3">
            <!-- Left: list coverage (set coverage) -->
            <div v-if="mode === 'write'" class="d-flex flex-column justify-center ga-2">
              <div class="d-flex justify-center text-caption">
                <div class="d-flex justify-center text-caption">
                  <div>This session:</div>
                  <div>✅ {{ isPersistedMode ? sessionCounters.correct : rightCount }}</div>
                  <div>❌ {{ isPersistedMode ? sessionCounters.wrong : wrongCount }}</div>
                </div>
              </div>
              
              <v-btn v-if="selectedSessionId" @click="showSessionAttempts = true" size="small" class="mt-2">Session data</v-btn>
            </div>

            <!-- Center: list chip -->
            <div class="d-flex flex-column align-center">
              <v-chip v-if="currentItem?.level" size="small" color="info" variant="tonal">
                {{ prettyListKey }}
                <span
                  v-if="prettyListKey === 'Irregular verbs'"
                  class="text-capitalize"
                >
                  : {{ props.gameSettings.level }}
                </span>
              </v-chip>
            </div>

            <!-- Right -->
            <div class="d-flex flex-column align-end">
              <div v-if="!isPersistedMode">{{ currentIndex + 1 }} / {{ roundCount }}</div>
              <div class="d-flex ga-2 mt-1">
                <v-chip
                  v-if="isPersistedMode"
                  size="small"
                  variant="tonal"
                  color="primary"
                >
                  Unseen: <strong class="ms-1">{{ serverUnseenCount }}</strong>
                </v-chip>

                <v-chip
                  v-if="isPersistedMode"
                  size="small"
                  variant="tonal"
                  color="orange"
                >
                  Review: <strong class="ms-1">{{ serverReviewCount }}</strong>
                </v-chip>
              </div>
            </div>
          </div>

          <!-- CONTENT -->
          <div class="game-middle">
            <v-card class="pa-3" elevation="0">
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

                    <Transition :name="slideName" mode="out-in">
                      <div :key="currentItem?.id || currentIndex">
                        <div class="flip-wrap" @click="toggleSide">
                          <div class="flip-inner" :class="{ 'is-back': shownSide === 'back' }">
                            <!-- FRONT -->
                            <v-card class="flip-face flip-front pa-4" elevation="2" width="540" height="400">
                              <!-- Hidden loader (front) -->
                              <v-img
                                :src="currentItem?.image"
                                cover
                                :eager="true"
                                class="invisible-loader"
                                @load="frontImageLoaded = true"
                                @error="frontImageLoaded = false"
                              />

                              <div
                                v-if="frontImageReady"
                                class="d-flex align-center ga-4 pa-3 w-100 mx-8"
                                style="margin-top: 15%;"
                              >
                                <div class="flex-third d-flex align-center justify-center">
                                  <v-avatar size="150" rounded="lg">
                                    <v-img v-if="currentItem" :src="currentItem.image" cover />
                                  </v-avatar>
                                </div>

                                <div class="flex-two-thirds d-flex align-center justify-start">
                                  <div
                                      class="text-h5 ms-4 mb-2 font-weight-regular font-italic"
                                      style="margin-right: 20%;"
                                    >
                                      {{ frontPreview }}
                                    </div>
                                </div>
                              </div>

                              <div v-else class="d-flex justify-center align-center text-center h-100">
                                <div :class="frontCardClass">
                                  {{ frontPreview }}
                                </div>
                              </div>
                            </v-card>

                            <!-- BACK -->
                            <v-card class="flip-face flip-back pa-4" elevation="2" width="540" height="400">
                              <!-- Hidden loader (back) -->
                              <v-img
                                :src="currentItem?.image"
                                cover
                                :eager="true"
                                class="invisible-loader"
                                @load="backImageLoaded = true"
                                @error="backImageLoaded = false"
                              />

                              <div
                                v-if="backImageReady"
                                class="d-flex flex-column justify-center align-center ga-4 mx-10"
                                style="margin-top: 10%;"
                              >
                                <v-avatar size="200" rounded="lg">
                                  <v-img v-if="currentItem" :src="currentItem.image" cover />
                                </v-avatar>

                                <div class="flex-1">
                                  <div class="text-h4 mb-2">{{ backPreview }}</div>
                                </div>
                              </div>

                              <div v-else class="d-flex justify-center align-center text-center h-100">
                                <div class="text-h4 mb-2 mx-4">
                                  {{ backPreview }}
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
                <div class="d-flex flex-column align-center justify-center" style="height: 260px;">
                  <!-- Hidden loader for write (reuse backImageLoaded as "prompt image") -->
                  <v-img
                    :src="currentItem?.image"
                    cover
                    :eager="true"
                    class="d-none"
                    @load="backImageLoaded = true"
                    @error="backImageLoaded = false"
                  />

                  <template v-if="hasImage && backImageLoaded">
                    <v-avatar size="200" rounded="lg">
                      <v-img v-if="currentItem" :src="currentItem.image" cover />
                    </v-avatar>

                    <h5 class="mt-3 text-h5 text-center font-italic" style="margin-bottom: 3.5rem;">
                      {{ frontPreview }}
                    </h5>
                  </template>

                  <template v-else>
                    <h4 class="text-h4 text-center font-italic">
                      {{ frontPreview }}
                    </h4>
                  </template>
                </div>

                <div class="d-flex justify-center align-center">
                  <span class="text-caption me-2">Write the</span>
                  <v-chip size="small" color="red" class="text-uppercase font-weight-bold">
                    {{ prettyBackField }}
                  </v-chip>
                </div>

                <div ref="answerWrap" class="d-flex justify-center" style="margin-top: 1rem;">
                  <v-text-field
                    v-model="userAnswer"
                    :disabled="!canSubmitNow()"
                    label="Your answer"
                    max-width="400px"
                    hide-details
                    density="comfortable"
                    @keydown.enter.prevent="submitWrite($event)"
                  />
                </div>

                <div class="d-flex justify-center mt-4" style="margin-bottom: 1.5rem;">
                  <v-btn
                    color="primary"
                    :disabled="!canSubmitNow()"
                    :loading="isAdvancing || isSubmitting"
                    @click="submitWrite"
                  >
                    Submit
                  </v-btn>
                </div>
              </template>

              <!-- MULTIPLE CHOICE -->
              <template v-else-if="mode === 'multiple_choice'">
                <div class="text-caption text-medium-emphasis mb-2">
                  Choose the correct <strong>{{ backLabel }}</strong> for
                  <span class="text-subtitle-1">{{ frontPreview }}</span>.
                </div>

                <div class="d-flex flex-wrap ga-2 justify-center">
                  <v-chip
                    v-for="opt in mcOptions"
                    :key="opt"
                    class="ma-1"
                    variant="outlined"
                    :disabled="!canSubmitNow()"
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

          <!-- BOTTOM: PHASE PROGRESS BAR (changes meaning by phase) -->
          <div class="mt-4">
            <div v-if="isPersistedMode" class="d-flex justify-space-between align-center mb-1">
              <div class="text-caption text-medium-emphasis">
                {{ phaseLabel }}
              </div>
              <div class="text-caption text-medium-emphasis">
                <strong>Progress: {{ phaseProgressPct }}% ({{ sessionCounters.correct }} / {{ serverTotalCount }})</strong>
              </div>
            </div>

            <!-- Cards mode seek bar -->
            <div v-if="mode === 'cards'" class="d-flex align-center ga-3 mt-3">
              <!-- optional: jump back/forward by 5 -->
              <v-btn variant="text" size="small" :disabled="currentIndex === 0" @click="jumpCards(-5)">
                -5
              </v-btn>

              <v-slider
                v-model="cardSeekIndex"
                :min="0"
                :max="Math.max(0, roundCount - 1)"
                :step="5"
                color="info"
                track-color="grey-lighten-2"
                thumb-color="info"
                hide-details
                show-ticks
                thumb-label="always"
                @update:model-value="() => {}"  
                @end="commitCardSeek"          
              >
                <template #thumb-label>
                  {{ cardThumbLabel }}
                </template>
              </v-slider>

              <v-btn
                variant="text"
                size="small"
                :disabled="currentIndex >= roundCount - 1"
                @click="jumpCards(5)"
              >
                +5
              </v-btn>
            </div>

            <!-- Other modes: existing progress bar -->
            <v-progress-linear
              v-else
              :model-value="isPersistedMode && serverCountsReady ? phaseProgressPct : listCoveragePct"
              height="10"
              class="mb-2"
              :color="phase === 'review' ? 'orange' : (phase === 'done' ? 'success' : 'success')"
            />
          </div>
        </template>
      </div>
    </v-card>

    <div class="mt-3">
      <v-btn @click="goToSettings" icon elevation="0" class="ms-3">
        <v-icon color="grey-darken-3">mdi-arrow-left-circle</v-icon>
      </v-btn>
    </div>

    <!-- WRONG DIALOG -->
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
            Accepted: <strong>{{ lastAcceptedAnswers || "—" }}</strong>
          </p>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn
            ref="wrongOkButton"
            color="secondary"
            @click="acknowledgeWrong()"
            @keydown.enter.prevent.stop="acknowledgeWrong($event)"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- COMPLETE DIALOG -->
    <v-dialog v-model="showCompleteDialog" max-width="520">
      <v-card class="pa-4">
        <div class="text-h6">✅ Session complete!</div>
        <div class="text-body-2 mt-2">
          You answered every item correctly at least once.
        </div>
        <v-card-actions class="justify-end mt-4">
          <v-btn color="primary" @click="showCompleteDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Session attempts DIALOG -->
    <v-dialog v-model="showSessionAttempts" max-width="1100">
      <v-card class="pa-4">
        <VWSessionAttemptsTable :session-id="selectedSessionId" :auto="true" />

        <v-card-actions class="justify-end mt-4">
          <v-btn variant="text" @click="showSessionAttempts = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>




<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount, watchEffect } from "vue";

import type { VocabItem, BackField, FrontField } from "@/assets/scripts/vocab_workout/VocabWorkoutPromptEngine";
import { getFrontText, getAcceptedAnswers } from "@/assets/scripts/vocab_workout/VocabWorkoutPromptEngine";

import { buildMultipleChoiceOptions, checkUserAnswer } from "@/assets/scripts/vocab_workout/VocabWorkoutGameLogic";

import { useVocabWorkoutStore } from "@/stores/vocabWorkout";
import type { VWAttempt } from "@/stores/vocabWorkout";
import VWSessionAttemptsTable from "@/components/vocab_workout_scenes/VWSessionAttemptsTable.vue"

/* =========================================================
   Props / Emits
========================================================= */
const props = defineProps<{
  planItems: VocabItem[];
  gameSettings: any;
}>();

const emit = defineEmits<{
  (e: "gameOver", payload: any): void;
  (e: "changeScene", sceneName: string): void;
}>();

function goToSettings(): void {
  emit("changeScene", "VocabWorkoutScene00_Settings");
}

const vw = useVocabWorkoutStore();

const resumeHydrating = ref(false);
/* =========================================================
   Session / Mode
========================================================= */
const sessionId = computed<number | null>(() =>
  props.gameSettings?.sessionId != null ? Number(props.gameSettings.sessionId) : null
);

const resumeIndex = computed<number>(() => Number(props.gameSettings?.resumeIndex ?? 0));

const mode = computed<string>(() => props.gameSettings?.mode || "cards");
const level = computed<string>(() => props.gameSettings?.level || "all");
const frontField = computed<FrontField>(() => props.gameSettings?.frontField || "definition");
const backField = computed<BackField>(() => props.gameSettings?.backField || "past_simple");

const isPersistedMode = computed<boolean>(() => mode.value === "write" || mode.value === "quiz");


const sessionMeta = ref<null | { total_attempts: number; correct_count: number; wrong_count: number; status: string }>(null);
function syncSessionMetaFromState(state: any) {
  const s = state?.session;
  if (!s) return;
  sessionMeta.value = {
    total_attempts: Number(s.total_attempts ?? 0),
    correct_count: Number(s.correct_count ?? 0),
    wrong_count: Number(s.wrong_count ?? 0),
    status: String(s.status ?? "active"),
  };
}
/* =========================================================
   Local plan / cursor
========================================================= */
const roundCount = computed<number>(() => props.planItems?.length ?? 0);
const hasAnyItems = computed<boolean>(() => roundCount.value > 0);

const currentIndex = ref<number>(0);
const currentItem = computed<VocabItem | null>(() => props.planItems?.[currentIndex.value] ?? null);
const hasItem = computed<boolean>(() => !!currentItem.value);

const remaining = ref<number>(0);
const rightCount = ref<number>(0);
const wrongCount = ref<number>(0);

const resultsStore = ref<LocalRoundRow[]>([]);
const gameStarted = ref(false);

type Counters = { total: number; correct: number; wrong: number };

const baselineCounters = ref<Counters | null>(null);
const deltaCounters = ref<Counters>({ total: 0, correct: 0, wrong: 0 });

const sessionCounters = computed<Counters>(() => {
  const base = baselineCounters.value ?? { total: 0, correct: 0, wrong: 0 };
  return {
    total: base.total + deltaCounters.value.total,
    correct: base.correct + deltaCounters.value.correct,
    wrong: base.wrong + deltaCounters.value.wrong,
  };
});
async function initBaselineFromAttempts(sessionId: number) {
  const data = await vw.fetchSessionAttempts(sessionId);
  baselineCounters.value = {
    total: Number(data.total_attempts ?? 0),
    correct: Number(data.correct_count ?? 0),
    wrong: Number(data.wrong_count ?? 0),
  };
  deltaCounters.value = { total: 0, correct: 0, wrong: 0 };
}
function bumpDelta(isCorrect: boolean | null) {
  // ignore null attempts if you don't want them counted
  if (isCorrect === null) return;

  deltaCounters.value.total += 1;
  if (isCorrect === true) deltaCounters.value.correct += 1;
  if (isCorrect === false) deltaCounters.value.wrong += 1;
}
function maybeResyncBaselineFromSession(session: any) {
  if (!session) return;

  baselineCounters.value = {
    total: Number(session.total_attempts ?? 0),
    correct: Number(session.correct_count ?? 0),
    wrong: Number(session.wrong_count ?? 0),
  };
  // server now includes everything it knows; reset local delta
  deltaCounters.value = { total: 0, correct: 0, wrong: 0 };
}
/* =========================================================
   Locks / anti-double-submit
========================================================= */
const isAdvancing = ref(false);   // locks server next()
const isSubmitting = ref(false);  // locks submit on current prompt
const completing = ref(false);    // locks finish flow

function canSubmitNow() {
  return (
    !resumeHydrating.value &&
    gameStarted.value &&
    hasItem.value &&
    !showWrongDialog.value &&
    !showCompleteDialog.value &&
    !isAdvancing.value &&
    !isSubmitting.value &&
    !completing.value
  );
}

/* =========================================================
   Enter suppression (prevents dialog/enter spam)
========================================================= */
const suppressEnterUntil = ref<number>(0);

function suppressEnter(ms = 250) {
  suppressEnterUntil.value = Date.now() + ms;
}

function isEnterSuppressed() {
  return Date.now() < suppressEnterUntil.value;
}

/* =========================================================
   Types
========================================================= */
type LocalRoundRow = {
  item_id: string;
  term: string;
  mode: string;
  front_field: string;
  back_field: string;
  prompt: string;
  expected: string; // joined string for UI
  user_answer: string;
  is_correct: boolean | null;
  at_index: number;
};

/* =========================================================
   Pretty labels
========================================================= */
const frontCardClass = computed(() =>
  prettyListKey.value === "ProgrammingSymbols" ? 'text-h4 mx-4 mb-2 font-weight-regular' : 'text-h4 mx-4 mb-2 font-weight-regular font-italic'
)

const resumeIndexDisplay = computed(() => {
  const idx = Number(props.gameSettings?.resumeIndex ?? 0);
  if (!Number.isFinite(idx)) return "1";
  return String(Math.min(roundCount.value, Math.max(1, idx + 1)));
});

const prettyListKey = computed(() => {
  const k = String(props.gameSettings?.listKey ?? "");
  if (!k) return "";
  const withSpaces = k.replace(/_/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
});

const prettyBackField = computed(() => {
  const k = String(props.gameSettings?.backField ?? "");
  if (!k) return "";
  const withSpaces = k.replace(/_/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
});

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

const frontLabel = computed(() => (frontField.value === "term" ? "Term" : String(frontField.value)));
const backLabel = computed(() => {
  if (backField.value === "term") return "Term";
  if (backField.value === "past_simple") return "Past simple";
  if (backField.value === "present_perfect") return "Present perfect";
  return String(backField.value);
});

/* =========================================================
   Local coverage progress (list position)
========================================================= */
const listCoveragePct = computed(() => {
  if (!roundCount.value) return 0;
  return Math.round((currentIndex.value / roundCount.value) * 100);
});


/* =========================================================
   Slider
========================================================= */
const cardSeekIndex = ref<number>(0);

// Keep slider in sync when user navigates with arrows/buttons
watch(
  [gameStarted, mode, currentIndex, roundCount],
  () => {
    if (!gameStarted.value) return;
    if (mode.value !== "cards") return;

    const total = roundCount.value ?? 0;
    if (total <= 0) {
      cardSeekIndex.value = 0;
      return;
    }

    const idx = Math.min(total - 1, Math.max(0, currentIndex.value));
    const cardNum = idx + 1; // 1-based

    // Slider positions represent milestones: 0 ("1"), 5, 10, 15...
    // We want: 1-4 => 0, 5-9 => 5, 10-14 => 10, ...
    let milestone: number;

    if (cardNum < 5) milestone = 0;
    else milestone = Math.floor(cardNum / 5) * 5; // 5-9=>5, 10-14=>10, ...

    // Clamp in case list shorter than milestone
    milestone = Math.min(milestone, total);

    cardSeekIndex.value = milestone;
  },
  { immediate: true }
);

const cardThumbLabel = computed(() => {
  const total = roundCount.value ?? 0;
  if (total <= 0) return "0";

  // Always show the actual current card number (1-based)
  const n = Math.min(total, Math.max(1, Math.trunc(currentIndex.value) + 1));
  return String(n);
});

// Called when user finishes interacting (mouse up / touch end)
function commitCardSeek() {
  if (!gameStarted.value) return;
  if (mode.value !== "cards") return;

  const total = roundCount.value ?? 0;
  if (total <= 0) return;

  const maxIdx = total - 1;

  // Slider value is 0,5,10... but you want that to mean card 1,5,10...
  const raw = Math.trunc(cardSeekIndex.value);

  const target =
    raw === 0
      ? 0
      : Math.min(maxIdx, Math.max(0, raw - 1)); // 5->4, 10->9, ...

  if (target === currentIndex.value) return;

  slideName.value = target > currentIndex.value ? "slide-left" : "slide-right";
  currentIndex.value = target;
}

// Optional: if you want keyboard-accessible "jump 5" buttons
function jumpCards(delta: number) {
  if (!gameStarted.value) return;
  if (mode.value !== "cards") return;

  const max = Math.max(0, roundCount.value - 1);
  const target = Math.min(max, Math.max(0, currentIndex.value + delta));

  if (target === currentIndex.value) return;

  slideName.value = target > currentIndex.value ? "slide-left" : "slide-right";
  currentIndex.value = target;
}
const cardSliderTicks = computed<Record<number, string>>(() => {
  const total = roundCount.value ?? 0;
  const maxIdx = Math.max(0, total - 1);

  const ticks: Record<number, string> = {};
  if (total <= 0) return ticks;

  // Always show "1" at the start (index 0)
  ticks[0] = "1";

  // Show 5,10,15,... as labels at indices 4,9,14,... (every 5th card)
  // i is 1-based card number
  for (let i = 5; i <= total; i += 5) {
    const idx = i - 1;
    if (idx >= 0 && idx <= maxIdx) ticks[idx] = String(i);
  }

  // Ensure last card number is shown if not already (nice for non-multiple-of-5 totals)
  if (!ticks[maxIdx]) ticks[maxIdx] = String(total);

  return ticks;
});


/* =========================================================
   Mastery-phase progress (server-driven)
========================================================= */
const phase = ref<"first_pass" | "review" | "done">("first_pass");

const serverTotalCount = ref<number | null>(null);
const serverUnseenCount = ref<number | null>(null);
const serverReviewCount = ref<number | null>(null);
const serverSource = ref<string | null>(null);

// Review denominator snapshot
const reviewStartSize = ref<number>(0);

function applyServerState(state: any) {
  serverSource.value = state?.source ?? null;

  const session = state?.session ?? {};

  const total =
    Number(session?.total_count ?? 0) ||
    (Array.isArray(session?.all_item_ids) ? session.all_item_ids.length : 0);

  const unseen =
    Number(state?.unseen_count ?? NaN);
  const review =
    Number(state?.review_count ?? NaN);

  // Fallback to session arrays if wrapper counts missing
  const unseenFallback = Array.isArray(session?.unseen_item_ids) ? session.unseen_item_ids.length : 0;
  const reviewFallback = Array.isArray(session?.review_item_ids) ? session.review_item_ids.length : 0;

  serverTotalCount.value = Number.isFinite(total) ? total : 0;
  serverUnseenCount.value = Number.isFinite(unseen) ? unseen : unseenFallback;
  serverReviewCount.value = Number.isFinite(review) ? review : reviewFallback;

  if (state?.done || (serverUnseenCount.value === 0 && serverReviewCount.value === 0)) {
    phase.value = "done";
    return;
  }
  if (serverUnseenCount.value != null && serverUnseenCount.value > 0) {
    phase.value = "first_pass";
    return;
  }

  if (phase.value !== "review") {
    reviewStartSize.value = Math.max(1, serverReviewCount.value ?? 0);
  } else {
    reviewStartSize.value = Math.max(reviewStartSize.value, serverReviewCount.value ?? 0);
  }
  phase.value = "review";
}

const phaseLabel = computed(() => {
  if (phase.value === "first_pass") return "First pass through list + automatic reviewing";
  if (phase.value === "review") return "Finish reviewing difficult words";
  return "Session complete";
});

const phaseProgressPct = computed(() => {
  if (!isPersistedMode.value) return 0;
  if (!serverCountsReady.value) return 0; // ✅ prevents the “fake 100%”

  if (phase.value === "first_pass") {
    return Math.max(0, Math.min(100, Math.round((sessionCounters.value.correct / serverTotalCount.value!) * 100)));
  }

  if (phase.value === "review") {
    const start = Math.max(1, reviewStartSize.value);
    const doneCount = start - (serverReviewCount.value ?? 0);
    return Math.max(0, Math.min(100, Math.round((doneCount / start) * 100)));
  }

  return 0;
});


const frontImageLoaded = ref(false);
const backImageLoaded = ref(false);

const hasImage = computed(() => !!currentItem.value?.image);

const frontImageReady = computed(() => hasImage.value && frontImageLoaded.value);
const backImageReady = computed(() => hasImage.value && backImageLoaded.value);

// If you ever want a single indicator:
const bothSidesImageReady = computed(() => frontImageReady.value && backImageReady.value);

/* =========================================================
   Initialize server counts (once per mount/begin)
========================================================= */
const countsInitDone = ref(false);
let countsInitPromise: Promise<void> | null = null;

function hasCountsInGameSettings(gs: any) {
  return (
    gs &&
    gs.session_total_count != null &&
    gs.unseen_count != null &&
    gs.review_count != null
  );
}

async function initServerCountsIfNeeded(force = false) {
  if (!isPersistedMode.value || !sessionId.value) return;

  if (!force && countsInitDone.value) return;

  // Prevent duplicate simultaneous requests
  if (countsInitPromise) return countsInitPromise;

  countsInitPromise = (async () => {
    try {
      const gs = props.gameSettings ?? {};

      // ✅ FAST PATH: already provided by SceneManager / settings
      if (hasCountsInGameSettings(gs)) {
        applyServerState({
          session: { total_count: gs.session_total_count },
          unseen_count: gs.unseen_count,
          review_count: gs.review_count,
          source: gs.source ?? null,
          done: gs.done ?? false,
        });

        // keep these synced (optional)
        props.gameSettings.promptNumber =
          gs.promptNumber ?? props.gameSettings.promptNumber;
        props.gameSettings.currentItemId =
          gs.currentItemId ?? props.gameSettings.currentItemId;

        countsInitDone.value = true;
        return;
      }

      // ✅ NETWORK PATH: fetch the wrapper once
      let state: any = null;
      if (sessionId.value !== null) {
        state = await vw.continueSession(sessionId.value);
        applyServerState(state);
      }

      // keep these synced (optional)
      if (state) {
        props.gameSettings.promptNumber =
          state?.session?.prompt_number ?? props.gameSettings.promptNumber;
        props.gameSettings.currentItemId =
          state?.session?.current_item_id ?? props.gameSettings.currentItemId;

        // If you want to avoid later fetches, you can also cache these into gameSettings:
        props.gameSettings.session_total_count = state?.session?.total_count ?? null;
        props.gameSettings.unseen_count = state?.unseen_count ?? null;
        props.gameSettings.review_count = state?.review_count ?? null;
        props.gameSettings.source = state?.source ?? null;
        props.gameSettings.done = state?.done ?? false;
      }

      countsInitDone.value = true;
    } finally {
      countsInitPromise = null;
    }
  })();

  return countsInitPromise;
}

const serverCountsReady = computed(() => {
  if (!isPersistedMode.value) return true;
  return (
    serverTotalCount.value != null &&
    serverUnseenCount.value != null &&
    serverReviewCount.value != null
  );
});
/* =========================================================
   Card mode helpers
========================================================= */
const isIrregularList = computed(() => {
  const domain = props.gameSettings?.domain;
  const listKey = props.gameSettings?.listKey;
  return domain === "Irregular verbs" || listKey === "irregular_verbs";
});

const effectiveCardBackField = computed(() => {
  if (mode.value !== "cards") return backField.value;
  if (!isIrregularList.value) return backField.value;

  if (backField.value === "past_simple" || backField.value === "present_perfect") {
    return "past_forms" as any;
  }
  return backField.value;
});

const shownSide = ref<"front" | "back">("front");
const defaultSide = computed<"front" | "back">(() => "front");

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

  if (effectiveCardBackField.value === "past_forms") {
    const ps = getAcceptedAnswers(currentItem.value, "past_simple");
    const pp = getAcceptedAnswers(currentItem.value, "present_perfect");
    const psText = ps.length ? ps.join(" / ") : "—";
    const ppText = pp.length ? pp.join(" / ") : "—";
    return `${psText} • ${ppText}`;
  }

  const accepted = getAcceptedAnswers(currentItem.value, effectiveCardBackField.value as any);
  return accepted.join(" / ") || "—";
});

/* =========================================================
   Write / MC helpers
========================================================= */
const userAnswer = ref("");
const answerWrap = ref<HTMLElement | null>(null);

async function focusAnswer() {
  await nextTick();
  requestAnimationFrame(() => {
    const input = answerWrap.value?.querySelector?.("input") as HTMLInputElement | null;
    input?.focus?.();
    input?.select?.();
  });
}

const mcOptions = ref<string[]>([]);
function refreshMcOptions() {
  const it = currentItem.value;
  if (!it) {
    mcOptions.value = [];
    return;
  }
  mcOptions.value = buildMultipleChoiceOptions(it, backField.value as any, props.planItems, 4);
}

/* =========================================================
   Dialogs / feedback
========================================================= */
const showWrongDialog = ref(false);
const showCompleteDialog = ref(false);
const showSessionAttempts = ref(false);
const selectedSessionId = computed<number | null>(() => {
  return sessionId.value;
});


const wrongOkButton = ref<any>(null);
const lastUserAnswer = ref("");
const lastAcceptedAnswers = ref("");

watch(showWrongDialog, async (vis) => {
  if (vis) {
    await nextTick();
    wrongOkButton.value?.$el?.focus?.();
  }
});

const showFloatingFeedback = ref(false);

/* =========================================================
   Persisted mode: batching / checkpointing
========================================================= */
const pendingAttempts = ref<VWAttempt[]>([]);
let checkpointTimer: ReturnType<typeof window.setInterval> | null = null;
const lastFlushAt = ref<number>(Date.now());

const CHECKPOINT_EVERY_ROUNDS = 5;
const CHECKPOINT_EVERY_MS = 15000;

function queueAttempt(attempt: VWAttempt) {
  if (!isPersistedMode.value) return;
  if (!sessionId.value) return;

  pendingAttempts.value.push(attempt);

  if (pendingAttempts.value.length >= CHECKPOINT_EVERY_ROUNDS) {
    void flushCheckpoint();
  }
}

async function flushCheckpoint() {
  if (!isPersistedMode.value) return;
  if (!sessionId.value) return;
  if (pendingAttempts.value.length === 0) return;

  const batch = pendingAttempts.value.splice(0, pendingAttempts.value.length);

  try {
    const updated = await vw.appendAttempts(sessionId.value, batch, { last_index: resultsStore.value.length });
    lastFlushAt.value = Date.now();

    // ✅ resync baseline to server truth and reset delta
    if (updated) {
      maybeResyncBaselineFromSession(updated);

      // also keep optional sessionMeta in sync
      sessionMeta.value = {
        total_attempts: updated.total_attempts,
        correct_count: updated.correct_count,
        wrong_count: updated.wrong_count,
        status: updated.status,
      };
    }
  } catch (e) {
    // restore if failed
    pendingAttempts.value.unshift(...batch);
    console.error("[VocabWorkout] checkpoint flush failed:", e);
  }
}

function startCheckpointTimer() {
  stopCheckpointTimer();
  checkpointTimer = window.setInterval(() => {
    const age = Date.now() - lastFlushAt.value;
    if (pendingAttempts.value.length > 0 && age >= CHECKPOINT_EVERY_MS) {
      void flushCheckpoint();
    }
  }, 1000);
}

function stopCheckpointTimer() {
  if (checkpointTimer) {
    window.clearInterval(checkpointTimer);
    checkpointTimer = null;
  }
}

/* =========================================================
   Persisted mode: advance (server-driven next item)
========================================================= */
async function advancePersisted() {
  if (!sessionId.value) return;
  if (isAdvancing.value) return;

  isAdvancing.value = true;

  try {
    await flushCheckpoint();

    const state = await vw.nextItem(sessionId.value);
    applyServerState(state);

    if (state.done || !state.next_item_id) {
      await finishGame();
      return;
    }

    const nextId = String(state.next_item_id).includes("::")
      ? String(state.next_item_id)
      : `${props.gameSettings.listKey}::${state.next_item_id}`;

    const idx = props.planItems.findIndex((it) => it.id === nextId);

    if (idx >= 0) currentIndex.value = idx;
    else {
      console.error("Next item not found in planItems:", nextId);
      await finishGame();
    }

    props.gameSettings.promptNumber = state.session.prompt_number;
    props.gameSettings.currentItemId = state.session.current_item_id;
  } catch (e: any) {
    console.error("[VocabWorkout] advancePersisted failed:", e);
  } finally {
    isAdvancing.value = false;
  }
}

/* =========================================================
   Cards navigation
========================================================= */
const slideName = ref("slide-left");

function goNextCard() {
  slideName.value = "slide-left";
  recordRound({ user_answer: `(cards) viewed ${shownSide.value}`, is_correct: null });

  if (currentIndex.value >= roundCount.value - 1) {
    void finishGame();
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

/* =========================================================
   Begin / resume positioning
========================================================= */
function setIndexFromCurrentItemId() {
  const idRaw = props.gameSettings?.currentItemId;
  if (!idRaw) return false;

  const nextId = String(idRaw).includes("::") ? String(idRaw) : `${props.gameSettings.listKey}::${idRaw}`;
  const idx = props.planItems.findIndex((it) => it.id === nextId);

  if (idx >= 0) {
    currentIndex.value = idx;
    return true;
  }
  return false;
}

function setIndexFromServerState(state: any): boolean {
  const idRaw = state?.session?.current_item_id ?? state?.next_item_id;
  if (!idRaw) return false;

  const nextId = String(idRaw).includes("::")
    ? String(idRaw)
    : `${props.gameSettings.listKey}::${idRaw}`;

  const idx = props.planItems.findIndex((it) => it.id === nextId);
  if (idx >= 0) {
    currentIndex.value = idx;
    return true;
  }

  console.warn("[VocabWorkout] server item id not found in planItems:", nextId);
  return false;
}

async function begin() {
  if (!hasAnyItems.value) return;

  rightCount.value = 0;
  wrongCount.value = 0;
  resultsStore.value = [];
  pendingAttempts.value = [];

  if (isPersistedMode.value && sessionId.value) {
    resumeHydrating.value = true;
    try {
      const state = await vw.continueSession(sessionId.value);

      applyServerState(state);
      syncSessionMetaFromState(state); // optional if you still use sessionMeta elsewhere

      // ✅ baseline for counters (one-time fetch)
      await initBaselineFromAttempts(sessionId.value);

      props.gameSettings.promptNumber =
        state?.session?.prompt_number ?? props.gameSettings.promptNumber;
      props.gameSettings.currentItemId =
        state?.session?.current_item_id ?? props.gameSettings.currentItemId;

      const aligned = setIndexFromServerState(state);

      if (!aligned) {
        const usedCurrent = setIndexFromCurrentItemId();
        const startAt = usedCurrent
          ? currentIndex.value
          : Math.max(0, Math.min(resumeIndex.value, Math.max(0, roundCount.value - 1)));
        currentIndex.value = startAt;
      }
    } finally {
      resumeHydrating.value = false;
    }
  } else {
    currentIndex.value = 0;
  }

  remaining.value = roundCount.value - currentIndex.value;
  gameStarted.value = true;

  userAnswer.value = "";
  resetToDefaultSide();

  if (mode.value === "write") void focusAnswer();
  if (mode.value === "multiple_choice") refreshMcOptions();

  if (isPersistedMode.value && sessionId.value) startCheckpointTimer();
}

/* =========================================================
   Watch index changes
========================================================= */
watch(currentIndex, async () => {
  if (!gameStarted.value) return;

  resetToDefaultSide();
  userAnswer.value = "";

  if (mode.value === "write") await focusAnswer();
  if (mode.value === "multiple_choice") refreshMcOptions();
});

/* =========================================================
   Submit handlers
========================================================= */
async function submitWrite(e?: KeyboardEvent) {
  const it = currentItem.value;
  if (!it) return;

  if (e?.key === "Enter") {
    if (isEnterSuppressed() || !canSubmitNow()) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }

  if (!canSubmitNow()) return;

  isSubmitting.value = true;

  try {
    const user = String(userAnswer.value || "").trim();
    let acceptedArr;
    if (backField.value === "past_forms") {
      const ps = getAcceptedAnswers(it, "past_simple");
      const pp = getAcceptedAnswers(it, "present_perfect");
      acceptedArr = [
        `PS: ${ps.join(" / ") || "—"}`,
        `PP: ${pp.join(" / ") || "—"}`
      ];
    } else {
      acceptedArr = getAcceptedAnswers(it, backField.value);
    }

    const correct = checkUserAnswer(it, backField.value as any, user);

    recordRound({
      user_answer: user,
      expected: acceptedArr.join(" / "),
      is_correct: correct,
    });

    if (correct) {
      showFloatingFeedback.value = true;
      setTimeout(() => (showFloatingFeedback.value = false), 800);

      if (isPersistedMode.value) {
        await advancePersisted();
      } else {
        goNext();
      }
      return;
    }

    // wrong path
    lastUserAnswer.value = user || "—";
    lastAcceptedAnswers.value = acceptedArr.join(" / ") || "—";
    showWrongDialog.value = true;
    suppressEnter(350);
  } finally {
    // Keep locked during wrong-dialog until user clicks OK
    if (!showWrongDialog.value) isSubmitting.value = false;
  }
}

function submitChoice(choice: string) {
  const it = currentItem.value;
  if (!it) return;

  if (!canSubmitNow()) return;
  isSubmitting.value = true;

  try {
    const acceptedArr = getAcceptedAnswers(it, backField.value);
    const correct = checkUserAnswer(it, backField.value as any, choice);

    recordRound({
      user_answer: choice,
      expected: acceptedArr.join(" / "),
      is_correct: correct,
    });

    if (correct) {
      showFloatingFeedback.value = true;
      setTimeout(() => (showFloatingFeedback.value = false), 800);

      if (isPersistedMode.value) {
        void advancePersisted();
      } else {
        goNext();
      }
      return;
    }

    lastUserAnswer.value = choice || "—";
    lastAcceptedAnswers.value = acceptedArr.join(" / ") || "—";
    showWrongDialog.value = true;
    suppressEnter(350);
  } finally {
    if (!showWrongDialog.value) isSubmitting.value = false;
  }
}

async function acknowledgeWrong(e?: KeyboardEvent) {
  if (e?.key === "Enter" && isEnterSuppressed()) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  showWrongDialog.value = false;
  suppressEnter(250);

  // unlock submit when leaving dialog
  isSubmitting.value = false;

  if (isPersistedMode.value) {
    await advancePersisted();
  } else {
    goNext();
  }

  if (mode.value === "write") await focusAnswer();
}

function goNext() {
  remaining.value = Math.max(0, remaining.value - 1);

  if (currentIndex.value >= roundCount.value - 1) {
    void finishGame();
    return;
  }
  currentIndex.value++;
}

/* =========================================================
   Record round -> local store + queued attempt
========================================================= */
function recordRound(extra: { user_answer: string; expected?: string; is_correct: boolean | null }) {
  const it = currentItem.value;
  if (!it) return;

  const serverPromptNumber = Number(props.gameSettings?.promptNumber ?? 0);

  const row: LocalRoundRow = {
    item_id: it.id,
    term: it.term,
    mode: mode.value,
    front_field: String(frontField.value),
    back_field: String(backField.value),
    prompt: getFrontText(it, frontField.value),
    expected: extra.expected ?? "",
    user_answer: extra.user_answer ?? "",
    is_correct: extra.is_correct ?? null,
    at_index: currentIndex.value,
  };

  const expectedPastSimple = getAcceptedAnswers(it, "past_simple");
  const expectedPastPart = getAcceptedAnswers(it, "present_perfect");

  const expectedForAttempt =
    backField.value === "past_forms"
      ? [
          `PS: ${expectedPastSimple.join(" / ") || "—"}`,
          `PP: ${expectedPastPart.join(" / ") || "—"}`,
        ]
      : (row.expected ? row.expected.split(" / ").map(s => s.trim()).filter(Boolean) : []);


  resultsStore.value.push(row);

  if (row.is_correct === true) rightCount.value++;  
  if (row.is_correct === false) wrongCount.value++;
  bumpDelta(row.is_correct);


  if (isPersistedMode.value && sessionId.value) {
    const attempt: VWAttempt = {
      attempt_id: crypto.randomUUID(),
      prompt_number: serverPromptNumber > 0 ? serverPromptNumber : resultsStore.value.length,
      item_key: it.id, // expects `${listKey}::${term}`
      term: it.term,
      prompt_field: String(frontField.value),
      answer_field: String(backField.value),
      prompt_text: row.prompt,
      expected: expectedForAttempt,
      user_answer: row.user_answer,
      is_correct: row.is_correct,
    };
    console.log(attempt.expected)
    queueAttempt(attempt);
  }
}

/* =========================================================
   Finish
========================================================= */
async function finishGame() {
  if (completing.value) return;
  completing.value = true;

  try {
    await flushCheckpoint();

    if (isPersistedMode.value && sessionId.value) {
      await vw.finishSession(sessionId.value);
    }

    showCompleteDialog.value = true;
    setTimeout(() => {
      showCompleteDialog.value = false;
    }, 5000);

  } catch (e) {
    console.error("[VocabWorkout] finishGame failed:", e);
  } finally {
    stopCheckpointTimer();

    emit("gameOver", {
      game_name: "VocabWorkout",
      mode: mode.value,
      level: level.value,
      front_field: frontField.value,
      back_field: backField.value,
      total_items: roundCount.value,
      correct_count: rightCount.value,
      wrong_count: wrongCount.value,
      rounds: resultsStore.value,
      session_id: sessionId.value ?? null,
      finished: true,
    });

    completing.value = false;
    isSubmitting.value = false;
    isAdvancing.value = false;
  }
}

/* =========================================================
   Global listeners
========================================================= */
function onKeydown(e: KeyboardEvent) {
  if (!gameStarted.value) return;
  if (showWrongDialog.value) return;
  if (showCompleteDialog.value) return;

  const tag = (document.activeElement?.tagName || "").toLowerCase();
  const isTyping = tag === "input" || tag === "textarea";
  if (isTyping && mode.value !== "cards") return;

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
}

async function onBeforeUnload() {
  await flushCheckpoint();
}

/* =========================================================
   Mount / Unmount
========================================================= */
onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("beforeunload", onBeforeUnload as any);

  // If your template calls begin() explicitly, remove this.
  // Otherwise, this makes the scene start automatically once mounted.
  // begin();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("beforeunload", onBeforeUnload as any);
  stopCheckpointTimer();
  void flushCheckpoint();
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
  height: 400px;
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

.nav-left { left: -75px; }
.nav-right { right: -75px; }

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
  height: 400px;
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

/* ---------- for the vocab card ---------- */

.flex-third {
  flex: 0 0 33.33%;
}

.flex-two-thirds {
  flex: 0 0 66.66%;
}

.invisible-loader {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}


</style>
