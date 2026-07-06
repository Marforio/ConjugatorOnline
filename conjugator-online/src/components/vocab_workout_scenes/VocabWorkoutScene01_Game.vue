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

  <div class="vw-shell text-slate-800">
    <v-container fluid class="pa-4 pa-sm-6">
      <!-- Floating feedback alert segment -->
      <div v-if="showFloatingFeedback" class="floating-feedback success">
        <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
      </div>

      <!-- ==========================================
           🎮 LIVE WORKOUT WORKSPACE RUNWAY
           ========================================== -->
      <div class="game-layout">
        <div v-if="!hasItem" class="pa-10 text-center d-flex flex-column align-center justify-center">
          <v-progress-circular indeterminate color="primary" size="36" />
          <div class="text-caption text-slate-500 mt-3 font-weight-bold">Synchronizing session state matrices...</div>
        </div>

        <template v-else>
          <!-- 🔝 DYNAMIC INSTRUMENTATION PANEL (SETTINGS READOUT + CONTROLS) -->
          <v-card class="border rounded-xl bg-slate-50 pa-4 mb-6 max-width-card-hub mx-auto w-100" flat>
            <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between ga-3 border-b pb-3 mb-3">
              <div>
                <div class="text-caption font-weight-black text-slate-400 text-uppercase tracking-wider">Vocab list</div>
                <div class="text-subtitle-1 font-weight-black text-slate-900 leading-tight d-flex align-center mt-0.5">
                  {{ prettyListKey }}
                </div>
              </div>

              <!-- Vector Direction Metadata Badge Runway -->
              <div class="bg-white border rounded-lg px-3 py-2 w-100 w-sm-auto">
                <div class="text-xxs font-weight-black text-slate-400 text-uppercase tracking-wider leading-none mb-1">Transformation</div>
                <div class="text-caption font-weight-black text-primary d-flex align-center leading-none">
                  {{ currentVectorDirectionLabel }}
                </div>
              </div>
            </div>

            <div class="d-flex align-center justify-space-between">
              <!-- Left: Mode Metadata Markers & Stats Logs -->
              <div class="d-flex align-center">
                <v-chip size="small" variant="text" color="primary-lighten-5" class="text-primary font-weight-black text-capitalize mr-2">
                  <v-icon size="14" start>mdi-layers-outline</v-icon>
                  {{ modeLabel }} Mode
                </v-chip>
                
                <div v-if="mode === 'write'" class="d-flex align-center ga-1 text-caption font-weight-black">
                  <span class="text-success mr-1">✅ {{ isPersistedMode ? sessionCounters.correct : rightCount }}</span>
                  <span class="text-error">❌ {{ isPersistedMode ? sessionCounters.wrong : wrongCount }}</span>
                </div>
              </div>

              <!-- Right: Target Counters & Interactive Drawer Toggle -->
              <div class="d-flex align-center ga-2">
                <v-btn
                  v-if="mode === 'cards'"
                  variant="flat"
                  :color="showEntireList ? 'primary' : 'white'"
                  height="30"
                  class="rounded-lg text-none font-weight-black text-caption border px-3"
                  prepend-icon="mdi-format-list-bulleted"
                  @click="showEntireList = !showEntireList"
                >
                  {{ showListLabel }}
                </v-btn>

                <div class="text-caption font-weight-black text-slate-600 bg-white border px-2.5 py-1 rounded-lg leading-none">
                  <span v-if="!isPersistedMode" class="px-3">{{ currentIndex + 1 }} / {{ roundCount }}</span>
                  <span v-else><v-btn v-if="selectedSessionId" variant="text" size="small" color="primary" class="font-weight-bold text-none px-1 h-auto min-w-0" @click="showSessionAttempts = true">Session log</v-btn></span>
                </div>
              </div>
            </div>
          </v-card>

          <!-- Extra Server Tracking Progress -->
          <div v-if="isPersistedMode" class="d-flex justify-end ga-2 max-width-card-hub mx-auto w-100 mt-n4 mb-4 px-2">
            <v-chip size="small" variant="text" color="slate-100" class="text-slate-600 font-weight-bold">Unseen Items: {{ serverUnseenCount }}</v-chip>
            <v-chip size="small" variant="flat" color="orange-lighten-5" class="text-orange-darken-3 font-weight-bold">To Review: {{ serverReviewCount }}</v-chip>
            
          </div>

          <!-- ==========================================
               🔄 MIDDLE MAIN STAGE WORKSPACE 
               ========================================== -->
          <div class="game-middle max-width-card-hub mx-auto w-100 px-1">
            
            <!-- MODE MODULE CONTEXT A: DISCOVER BLOCKS (FLIP CARDS LAB) -->
            <template v-if="mode === 'cards'">
              <div class="d-flex flex-column align-center position-relative my-4">
                
                <!-- STANDALONE CENTER CARD STAGE CANVAS -->
                <div class="card-stage-canvas-box">
                  <v-btn class="swiper-paddle-nav left-paddle shadow-md border bg-white" icon="mdi-chevron-left" size="large" variant="elevated" :disabled="currentIndex === 0" @click.stop="goPrevCard" />
                  <v-btn class="swiper-paddle-nav right-paddle shadow-md border bg-white" icon="mdi-chevron-right" size="large" variant="elevated" :disabled="currentIndex >= roundCount - 1" @click.stop="goNextCard" />

                  <Transition :name="slideName" mode="out-in">
                    <div :key="currentItem?.id || currentIndex" class="w-100 h-100">
                      <div class="flip-wrap-capsule" @click="toggleSide">
                        <div class="flip-inner-axis" :class="{ 'is-flipped-back-side': shownSide === 'back' }">
                          
                          <!-- CARD FACE FRONT -->
                          <v-card class="flip-sheet-face face-front-hull border rounded-xl pa-5 bg-white shadow-sm" flat>
                            <v-img :src="currentItem?.image" cover :eager="true" class="invisible-loader" @load="frontImageLoaded = true" @error="frontImageLoaded = false" />
                            <div v-if="frontImageReady" class="d-flex align-center ga-5 h-100 w-100 px-4">
                              <v-avatar size="140" rounded="xl" class="border shadow-sm flex-shrink-0"><v-img v-if="currentItem" :src="currentItem.image" cover /></v-avatar>
                              <div class="flex-grow-1 min-width-0">
                                <div class="text-h5 font-weight-black text-slate-900 leading-tight tracking-tight">{{ frontPreview }}</div>
                                <div class="text-caption text-slate-400 mt-1 font-weight-bold">Tap to flip card</div>
                              </div>
                            </div>
                            <div v-else class="d-flex flex-column justify-center align-center text-center h-100 w-100 pa-4">
                              <div :class="frontCardClass" class="text-slate-900 tracking-tight font-weight-black px-4 leading-tight">{{ frontPreview }}</div>
                              <div class="text-caption text-slate-400 mt-4 font-weight-bold d-flex align-center"><v-icon size="12" class="mr-1">mdi-rotate-3d-variant</v-icon> Tap anywhere to flip card</div>
                            </div>
                          </v-card>

                          <!-- CARD FACE BACK -->
                          <v-card class="flip-sheet-face face-back-hull border rounded-xl pa-5 bg-slate-50 shadow-sm" flat>
                            <v-img :src="currentItem?.image" cover :eager="true" class="invisible-loader" @load="backImageLoaded = true" @error="backImageLoaded = false" />
                            <div class="vw-back-face h-100 w-100">
                              <div class="absolute-card-toolbar d-flex ga-1.5">
                                <v-tooltip v-if="contextEnabledForThisList" text="Show Examples" location="top"><template #activator="{ props: eprops }"><v-btn v-bind="eprops" icon="mdi-text-box-search-outline" size="small" variant="elevated" color="white" class="border text-slate-600 rounded-lg shadow-sm" @click.stop="openContextExamples(currentItem?.term)" /></template></v-tooltip>
                                <v-tooltip text="AI-generated examples" location="top"><template #activator="{ props: aprops }"><v-btn v-bind="aprops" icon="mdi-robot-outline" size="small" variant="elevated" color="white" class="me-2 border text-info rounded-lg shadow-sm" @click.stop="openTutor(currentItem?.term)" /></template></v-tooltip>
                                <v-tooltip text="Wiktionary" location="top"><template #activator="{ props: tprops }"><v-btn v-bind="tprops" icon="mdi-book-open-variant" size="small" variant="elevated" color="white" class="border text-primary rounded-lg shadow-sm" @click.stop="openWiktionary(currentItem?.term)" /></template></v-tooltip>
                              </div>
                              <div v-if="backImageReady" class="d-flex align-center ga-5 h-100 w-100 px-4">
                                <v-avatar size="140" rounded="xl" class="border shadow-sm flex-shrink-0 bg-white"><v-img v-if="currentItem" :src="currentItem.image" cover /></v-avatar>
                                <div class="flex-grow-1 min-width-0 pr-10">
                                  <div class="text-h5 font-weight-black text-primary leading-tight tracking-tight">{{ backPreview }}</div>
                                </div>
                              </div>
                              <div v-else class="d-flex flex-column justify-center align-center text-center h-100 w-100 pa-6 pr-14">
                                <div class="text-h4 font-weight-black text-primary px-2 leading-tight tracking-tight">{{ backPreview }}</div>
                              </div>
                            </div>
                          </v-card>

                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>

                <!-- BOTTOM PROGRESS SEEK BAR RUNWAY -->
                <div class="vw-discover-slider d-flex align-center ga-3 mt-8 w-100 px-2">
                  <v-btn variant="tonal" size="small" color="slate-600" class="rounded-lg font-weight-bold" :disabled="currentIndex === 0" @click="jumpCards(-5)">-5</v-btn>
                  <v-slider v-model="cardSeekIndex" :min="0" :max="Math.max(0, roundCount - 1)" :step="5" color="primary" track-color="slate-200" hide-details show-ticks thumb-label="always" class="flex-grow-1" @end="commitCardSeek"><template #thumb-label>{{ cardThumbLabel }}</template></v-slider>
                  <v-btn variant="tonal" size="small" color="slate-600" class="rounded-lg font-weight-bold" :disabled="currentIndex >= roundCount - 1" @click="jumpCards(5)">+5</v-btn>
                </div>
              </div>

              <!-- ==========================================
                   📁 OVERLAY LIST INDEX SIDE NAVIGATION DRAWER
                   ========================================== -->
              <v-navigation-drawer v-model="showEntireList" location="right" temporary width="360" class="border-l border-slate-200 bg-white shadow-xl" elevation="0">
                <div class="pa-4 border-b d-flex align-center justify-space-between bg-slate-50" style="height: 64px;">
                  <div class="d-flex align-center">
                    <v-icon color="slate-500" class="mr-2" size="18">mdi-format-list-bulleted</v-icon>
                    <span class="text-body-2 font-weight-black text-slate-900 text-uppercase tracking-wider">{{ prettyListKey }}</span>
                  </div>
                  <v-btn icon="mdi-close" variant="text" size="small" color="slate-400" @click="showEntireList = false" />
                </div>

                <!-- Scrolling container wrapper node -->
                <div ref="termListWrap" class="pa-3 h-calc-drawer overflow-y-auto style-custom-scroll">
                  <div v-for="(t, i) in discoverRows" :key="t.id" class="discover-term-row mb-1.5 border" :class="{ 'active-row-highlight': i === currentIndex }" :data-term-index="i">
                    <button class="discover-term-btn px-2 py-1.5" type="button" @click="jumpToCardIndex(i)" :aria-current="i === currentIndex ? 'true' : 'false'">
                      <span class="discover-term-index font-weight-bold text-xxs">{{ i + 1 }}.</span>
                      <div class="d-flex flex-column text-left leading-tight pr-1">
                        <span class="discover-term-text text-body-2 font-weight-black text-slate-800">{{ t.term }}</span>
                        <span class="discover-front-text text-xxs text-slate-500 font-italic mt-0.5 text-wrap">{{ t.frontText }}</span>
                      </div>
                    </button>

                    <div class="d-flex align-center pr-1 opacity-actions-group">
                      <v-btn v-if="contextEnabledForThisList" icon="mdi-text-box-search-outline" size="x-small" variant="text" color="slate-400" @click.stop="openContextExamples(t.term)" />
                      <v-btn icon="mdi-robot-outline" size="x-small" variant="text" color="slate-400" @click.stop="openTutor(t.term)" />
                      <v-btn icon="mdi-book-open-variant" size="x-small" variant="text" color="slate-400" @click.stop="openWiktionary(t.term)" />
                    </div>
                  </div>
                </div>
              </v-navigation-drawer>
            </template>

            <template v-else-if="mode === 'write'">
              <div class="d-flex justify-center my-4 animate-fade-in">
                <v-card class="border rounded-xl pa-5 bg-white w-100 max-width-card-hub" flat>
                  <div class="d-flex flex-column align-center justify-center bg-slate-50 rounded-xl border pa-4 mb-4" style="height: 240px;">
                    <div class="d-flex justify-space-between mt-1" style="width: 95%;">
                    
                      <v-chip variant="tonal" color="info" size="small" class="font-weight-medium">hint<v-tooltip activator="parent" location="bottom">{{ maskedHint }}</v-tooltip></v-chip>

                      <v-chip v-if="frontField === 'definition'" variant="tonal" color="info" size="small" class="font-weight-medium">tran.<v-tooltip activator="parent" location="bottom">{{ formattedTranslations }}</v-tooltip></v-chip>
                  </div>
                    <v-img :src="currentItem?.image" cover :eager="true" class="d-none" @load="backImageLoaded = true" @error="backImageLoaded = false" />
                    
                    <template v-if="hasImage && backImageLoaded">
                      <v-avatar size="110" rounded="xl" class="border shadow-sm bg-white flex-shrink-0 mb-3">
                        <v-img v-if="currentItem" :src="currentItem.image" cover />
                      </v-avatar>
                      <h5 class="text-subtitle-1 text-center font-weight-bold text-slate-900 tracking-tight px-4 leading-tight text-wrap w-100 max-w-500">
                        {{ frontPreview }}
                      </h5>
                    </template>
                    <template v-else>
                      <h4 class="text-h5 text-center font-weight-black text-slate-900 tracking-tight px-4 leading-snug max-w-500">
                        {{ frontPreview }}
                      </h4>
                    </template>
                  </div>

                  <div class="d-flex justify-center align-center mb-4">
                    <span class="text-caption font-weight-bold text-slate-400 text-uppercase tracking-wider mr-2">Target:</span>
                    <v-chip size="small" color="error" variant="flat" class="font-weight-bold text-uppercase">{{ prettyBackField }}</v-chip>
                  </div>

                  <div ref="answerWrap" class="d-flex justify-center max-w-400 mx-auto w-100 mb-4">
                    <v-text-field v-model="userAnswer" :disabled="!canSubmitNow()" label="Type your answer" variant="outlined" color="primary" hide-details density="comfortable" class="rounded-lg font-weight-bold text-center-input w-100" @keydown.enter.prevent="submitWrite($event)" />
                  </div>

                  <div class="d-flex justify-center mb-2">
                    <v-btn color="primary" height="40" class="px-8 rounded-xl font-weight-black text-none" :disabled="!canSubmitNow()" :loading="isAdvancing || isSubmitting" @click="submitWrite">
                      Submit Solution
                    </v-btn>
                  </div>
                </v-card>
              </div>
            </template>

            <template v-else-if="mode === 'multiple_choice'">
              <v-card class="border rounded-xl pa-7 bg-white text-center" flat>
                <v-img :src="currentItem?.image" cover :eager="true" class="d-none" @load="backImageLoaded = true" @error="backImageLoaded = false" />
                <template v-if="hasImage && backImageLoaded">
                      <v-avatar size="120" rounded="xl" class="border shadow-sm bg-white flex-shrink-0 mt-1 mb-6">
                        <v-img v-if="currentItem" :src="currentItem.image" cover />
                      </v-avatar>
                </template>
                <div class="text-h5 font-weight-semibold text-slate-900 mb-6 px-4">"{{ frontPreview }}"</div>

                <div class="d-flex flex-wrap justify-center mx-auto max-w-500" style="gap: 10px;">
                  <v-chip v-for="opt in mcOptions" :key="opt" filter variant="tonal" color="primary" size="large" class="font-weight-bold px-5 rounded-lg py-4 border cursor-pointer" :disabled="!canSubmitNow()" @click="submitChoice(opt)">
                    {{ opt }}
                  </v-chip>
                </div>
              </v-card>
            </template>

            <template v-else-if="mode === 'asteroidz'">
              <VWAsteroidzMode 
                :raw-vocab-items="planItems" 
                :game-settings="gameSettings"
                @go-back="goToSettings"
              />
            </template>

            <template v-else-if="mode === 'space_invaders'">
              <VWSpaceInvadersMode 
                :plan-items="planItems" 
                :game-settings="gameSettings"
                @go-back="goToSettings"
                @record-score="handleSpaceInvadersScore"
              />
            </template>

            <template v-else>
              <div class="pa-8 border rounded-xl text-center bg-slate-50 text-caption font-weight-medium text-slate-400">
                Mode template target string validation signature identity block "{{ mode }}" is currently unassigned in this session view.
              </div>
            </template>
          </div>

          <div class="d-flex justify-center mt-3">
            <v-btn @click="goToSettings" icon elevation="0" class="ms-3">
              <v-icon color="grey-darken-3">mdi-arrow-left-circle</v-icon>
            </v-btn>
          </div>
        </template>
      </div>

      <v-snackbar
        v-model="showTypoSnackbar"
        timeout="3000"
        color="amber-darken-3"
        rounded="lg"
        elevation="4"
      >
        <div class="d-flex align-center ga-2 font-weight-medium text-body-2">
          <v-icon>mdi-alert-circle-outline</v-icon>
          <span>{{ typoSnackbarMessage }}</span>
        </div>
        <template v-slot:actions>
          <v-btn variant="text" density="compact" @click="showTypoSnackbar = false">
            Dismiss
          </v-btn>
        </template>
      </v-snackbar>

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
  </div>
  <AiTutorChatDialog
  v-model="tutorOpen"
  title="AI Tutor: examples"
  :context="tutorContext"
  :build-initial-user-message="buildVocabTutorInitialUserMessage"
  :auto-send-on-open="true"
  :hide-system-message="true"
  :hide-initial-user-message="true"
/>
</template>



<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount, watchEffect } from "vue";

import type { VocabItem, BackField, FrontField } from "@/assets/scripts/vocab_workout/VocabWorkoutPromptEngine";
import { getFrontText, getAcceptedAnswers } from "@/assets/scripts/vocab_workout/VocabWorkoutPromptEngine";

import { buildMultipleChoiceOptions, checkUserAnswer, checkUserAnswerForCustomItem } from "@/assets/scripts/vocab_workout/VocabWorkoutGameLogic";

import { useVocabWorkoutStore } from "@/stores/vocabWorkout";
import type { VWAttempt } from "@/stores/vocabWorkout";
import VWSessionAttemptsTable from "@/components/vocab_workout_scenes/VWSessionAttemptsTable.vue"

import type { ContextIndex, ContextHit } from "@/assets/scripts/vocab_workout/vocabWorkoutContextRegistry";
import { contextByListKey, normalizeContextKey, contextApprovedListKeys } from "@/assets/scripts/vocab_workout/vocabWorkoutContextRegistry";
import { useGameCompletion } from '@/composables/useGameCompletion';
import AiTutorChatDialog from "@/components/AiTutorChatDialog.vue";
import VWAsteroidzMode from "@/components/vocab_workout_scenes/VWAsteroidzMode.vue";
import VWSpaceInvadersMode from "@/components/vocab_workout_scenes/VWSpaceInvadersMode.vue";

const tutorOpen = ref(false);
const tutorTerm = ref<string>("");

// optional: store the current item too (if you want prompt/definition context)
const tutorContext = computed(() => {
  const term = tutorTerm.value;
  const it = props.planItems?.find(x => x.term === term) ?? null;

  return {
    term,
    // nice extra context if available:
    front_field: String(frontField.value),
    back_field: String(backField.value),
    front_text: it ? getFrontText(it, frontField.value) : "",
    accepted_answers: it ? getAcceptedAnswers(it, backField.value as any) : [],
    mode: mode.value,
    listKey: props.gameSettings?.listKey ?? "",
  };
});

function openTutor(term?: string | null) {
  const t = String(term ?? "").trim();
  if (!t) return;
  tutorTerm.value = t;
  tutorOpen.value = true;
}

const { onGameCompleted } = useGameCompletion();


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

const showEntireList = ref(false);
const showListLabel = computed(() => (showEntireList.value ? "HIDE ENTIRE LIST" : "SHOW ENTIRE LIST"));

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
   Vocab context
========================================================= */
const contextDialogOpen = ref(false);
const contextTerm = ref<string>("");
const contextHits = ref<ContextHit[]>([]);
const contextLoading = ref(false);
const contextError = ref<string | null>(null);
const contextEmptyMessage = ref<string | null>(null);
const showTypoSnackbar = ref(false);
const typoSnackbarMessage = ref("");

// cache per listKey so we load each JSON once per page visit
const contextCache = ref<Record<string, ContextIndex>>({});

const contextEnabledForThisList = computed(() => {
  if (mode.value !== "cards") return false;
  const id = String(props.gameSettings?.listId ?? "").trim();
  // Only enable context for hardcoded irregular verb lists
  return id.startsWith("irregular_verbs");
});

async function loadContextIndex(listKey: string): Promise<ContextIndex | null> {
  const key = String(listKey ?? "").trim();
  if (!key) return null;

  if (contextCache.value[key]) return contextCache.value[key];

  const loader = contextByListKey[key];
  if (!loader) return null;

  contextLoading.value = true;
  contextError.value = null;
  try {
    const idx = await loader();
    contextCache.value[key] = idx;
    return idx;
  } catch (e) {
    console.error("[VocabWorkout] context json load failed:", e);
    contextError.value = "Could not load examples for this list.";
    return null;
  } finally {
    contextLoading.value = false;
  }
}

async function openContextExamples(term?: string | null) {
  const t = String(term ?? "").trim();
  if (!t) return;

  const id = String(props.gameSettings?.listId ?? "").trim();
  if (!id.startsWith("irregular_verbs")) {
    contextError.value = "Context examples only available for irregular verbs list.";
    return;
  }

  contextDialogOpen.value = true;
  contextTerm.value = t;
  contextHits.value = [];

  contextLoading.value = false;
  contextError.value = null;          // only for real load failures
  contextEmptyMessage.value = null;   // neutral “no results” message

  const listKey = String(props.gameSettings?.listKey ?? "").trim();
  const idx = await loadContextIndex(listKey);

  if (!idx) {
    // loadContextIndex should set contextError if fetch fails or loader missing;
    // if it didn't, set a generic one.
    if (!contextError.value) contextError.value = `Context data unavailable for list "${listKey}".`;
    return;
  }

  const key = normalizeContextKey(t);
  const hits = idx[key] ?? [];

  contextHits.value = hits.slice(0, 30);

  if (contextHits.value.length === 0) {
    contextEmptyMessage.value = "No examples found for this term.";
  }
}

async function copyToClipboard(text: string) {
  try {
    await window.navigator.clipboard.writeText(text);
  } catch (e) {
    // Fallback for older browsers / blocked clipboard permissions
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }
}

function escapeHtml(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}

function highlightInSnippet(snippet: string, term: string): string {
  const text = escapeHtml(snippet);
  const t = String(term ?? "").trim();
  if (!t) return text;

  // Escape regex chars in the term
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Highlight case-insensitively.
  // Word boundary is optional; for phrases it’s usually fine without strict \b rules.
  const re = new RegExp(`(${escaped})`, "ig");

  return text.replace(re, `<mark class="vw-context-mark">$1</mark>`);
}


/* =========================================================
   Pretty labels
========================================================= */
const frontCardClass = computed(() =>
  prettyListKey.value === "ProgrammingSymbols" ? 'text-h4 mx-4 mb-2 font-weight-regular' : 'text-h5 mx-8 mb-2 font-weight-regular font-italic'
)

const resumeIndexDisplay = computed(() => {
  const idx = Number(props.gameSettings?.resumeIndex ?? 0);
  if (!Number.isFinite(idx)) return "1";
  return String(Math.min(roundCount.value, Math.max(1, idx + 1)));
});

const prettyListKey = computed(() => {
  const id = String(props.gameSettings?.lis ?? "");
  if (id.startsWith("irregular_verbs")) {
    // Hardcoded
    const withSpaces = id.replace(/_/g, " ");
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }
  // For custom lists, find the name if available
  const found = props.gameSettings?.listName ?? null;
  return found || id.slice(0, 8); // show first 8 chars of UUID
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
   Discover mode: term list + Wiktionary
========================================================= */
const termListWrap = ref<HTMLElement | null>(null);

const discoverRows = computed(() =>
  (props.planItems ?? []).map((it) => ({
    id: it.id,
    term: it.term,
    frontText: getFrontText(it, frontField.value),
  }))
);

// Wiktionary link helper
const openWiktionary = (word?: string | null) => {
  const w = String(word ?? "").trim();
  if (!w) return;
  window.open(`https://en.wiktionary.org/wiki/${encodeURIComponent(w)}`, "_blank");
};

/* =========================================================
   📁 AUTOMATED MIDDLE DRAWER SCROLL CODES
   ========================================================= */
function scrollActiveTermIntoView() {
  if (!showEntireList.value) return;
  
  const wrap = termListWrap.value;
  if (!wrap) return;

  // Query row based on index cursor mapping attribute bounds
  const targetRow = wrap.querySelector(`[data-term-index="${currentIndex.value}"]`) as HTMLElement | null;
  if (!targetRow) return;

  // Calculate position to center the item directly in the middle of the drawer viewport
  const containerHeight = wrap.clientHeight;
  const rowOffsetTop = targetRow.offsetTop;
  const rowHeight = targetRow.offsetHeight;

  wrap.scrollTo({
    top: rowOffsetTop - (containerHeight / 2) + (rowHeight / 2),
    behavior: "smooth"
  });
}

function jumpToCardIndex(idx: number) {
  if (mode.value !== "cards") return;
  if (idx < 0 || idx >= roundCount.value) return;

  slideName.value = idx > currentIndex.value ? "slide-left" : "slide-right";
  currentIndex.value = idx;
}

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

// Ensure index scrolls dynamically when visibility state changes
watch(showEntireList, async (isVisible) => {
  if (isVisible) {
    await nextTick();
    // Microtask frame deferral allows elements to render completely before scrolling
    requestAnimationFrame(() => {
      scrollActiveTermIntoView();
    });
  }
});

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
  console.log(state)
  const unseen =
    Number(state?.unseen_item_ids?.length ?? NaN);
  const review =
    Number(state?.review_item_ids?.length ?? NaN);

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

function getFieldValueFromItem(item: any, field: string): string[] {
  if (!item) return [];

  // For standard fields
  if (field === "term") return [item.term || ""];
  if (field === "definition") return [item.definition || ""];

  // For language translations and inflections in additional_data
  const data = item.additional_data || {};
  const value = data[field];

  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === "string") {
    return [value].filter(Boolean);
  }
  return [];
}

function isHardcodedListKey(listId: string | null | undefined): boolean {
  if (!listId) return false;
  
  const id = String(listId).trim();
  
  // Hardcoded lists start with "irregular_verbs"
  if (id.startsWith("irregular_verbs")) return true;
  
  // Hardcoded lists are all lowercase with underscores (no hyphens)
  // UUIDs have hyphens or are 36 chars long
  if (id.includes("-") && id.length === 36) return false; // UUID format
  
  // If it's in the vocabLists registry, it's hardcoded
  // (This assumes you have access to vocabLists in scope)
  // import { vocabLists } from "@/assets/scripts/vocab_workout/VocabListRegistry";
  // return id in vocabLists;
  
  // Fallback: hardcoded lists follow pattern like "irregular_verbs", "houseElements", etc
  // (all lowercase, underscores, no hyphens, no UUIDs)
  return !id.includes("-") && id.length < 36;
}

const frontPreview = computed(() => {
  if (!currentItem.value) return "—";
  
  // For hardcoded lists, use the existing logic
  if (isHardcodedListKey(props.gameSettings?.listId)) {
    return getFrontText(currentItem.value, frontField.value);
  }

  // For custom lists, use the helper
  const values = getFieldValueFromItem(currentItem.value, frontField.value);
  return values.join(" / ") || "—";
});

// Update backPreview
const backPreview = computed(() => {
  if (!currentItem.value) return "—";

  // For hardcoded lists with past_forms special case
  if (isHardcodedListKey(props.gameSettings?.listId)) {
    if (effectiveCardBackField.value === "past_forms") {
      const ps = getAcceptedAnswers(currentItem.value, "past_simple");
      const pp = getAcceptedAnswers(currentItem.value, "present_perfect");
      const psText = ps.length ? ps.join(" / ") : "—";
      const ppText = pp.length ? pp.join(" / ") : "—";
      return `${psText} • ${ppText}`;
    }
    const accepted = getAcceptedAnswers(currentItem.value, effectiveCardBackField.value as any);
    return accepted.join(" / ") || "—";
  }

  // For custom lists
  const values = getFieldValueFromItem(currentItem.value, backField.value);
  return values.join(" / ") || "—";
});

/* =========================================================
   Write / Multiple Choice helpers
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

/**
 * Converted target term string to masked format:
 * "engine" -> "e _ _ _ _ _"
 * "stroke and bore" -> "s _ _ _ _ _   a _ _   b _ _ _"
 */
const maskedHint = computed(() => {
  const term = currentItem.value?.term;
  if (!term) return "—";

  // Split into words but preserve hyphens by treating them as distinct non-space splits if needed,
  // or simply mask letters while skipping non-alphanumeric characters.
  return term
    .split(" ")
    .map((word) => {
      return word
        .split("")
        .map((char, index) => {
          // Always show the first character of each word, hyphens, or punctuation marks
          if (index === 0 || char === "-" || !/[a-zA-Z0-9]/.test(char)) {
            return char;
          }
          return "_";
        })
        .join(" "); // Separate each masked underscore with a clear space
    })
    .join("    "); // Separate words with wider whitespace tracks
});

/**
 * Formatted string summarizing translations from first-class fields 
 * or additional_data blocks safely.
 */
/**
 * Formatted string summarizing translations from additional_data safely.
 */
/**
 * Formatted string summarizing translations from additional_data safely.
 */
/**
 * Formatted string summarizing translations from any active data source safely.
 */
const formattedTranslations = computed(() => {
  const item = currentItem.value as any; 
  if (!item) return "No translations available.";

  // 1. Check Custom Backend DB format (additional_data dictionary)
  const data = item.additional_data || {};
  
  // 2. Check Hardcoded Normalized format (fields array structure)
  const fields = (item as any).fields || {};

  // Resolve French
  const fr = data.French 
    || (Array.isArray(fields.French) ? fields.French[0] : null) 
    || (item as any).French 
    || null;

  // Resolve German
  const de = data.German 
    || (Array.isArray(fields.German) ? fields.German[0] : null) 
    || (item as any).German 
    || null;

  // Resolve Italian
  const it = data.Italian 
    || (Array.isArray(fields.Italian) ? fields.Italian[0] : null) 
    || (item as any).Italian 
    || null;

  // Assemble strings cleanly
  const parts: string[] = [];
  if (fr) parts.push(`${fr}`);
  if (de) parts.push(`${de}`);
  if (it) parts.push(`${it}`);

  return parts.length ? parts.join("  |  ") : "No translations configured for this item.";
});

/* =========================================================
   Space invaderz
    ========================================================= */
function handleSpaceInvadersScore(payload: any) {
  console.log("[VocabWorkout] Space Invaders score recorded:", payload);
  // Optionally emit or track this
}

/* =========================================================
   📊 COMPUTE RUNTIME TRANSLATION VECTOR LABELS
   ========================================================= */
const currentVectorDirectionLabel = computed(() => {
  // Generates a clean textual mapping (e.g., "French ➔ Term" or "Definition ➔ Past Simple")
  const from = frontLabel.value || "Unknown Source";
  const to = backLabel.value || "Target Form";
  return `${from} ➔ ${to}`;
});


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


function buildVocabTutorInitialUserMessage(ctx: any) {
  const term = String(ctx?.term ?? "").trim();
  const def = String(ctx?.front_text ?? "").trim();
  const vocabTutorSystemMessage =
  "You are a helpful vocabulary tutor.\n" +
  `Default behavior: First, say, 'Here are 5 examples of ${term}.' Then, provide exactly 5 short, natural example sentences in English using the given term. Use varied lexical contexts.\n` +
  "After the 5 examples, add exactly this final line:\n" +
  "write 'more' if you want more examples, or 'oui'/'ja'/'si' if you want translations in french/german/italian\n" +
  "\n" +
  "If the user says 'more': reply with 5 NEW examples only (no extra commentary) and include the same final line again.\n" +
  "If the user says 'oui': provide French equivalents for the last 5 examples.\n" +
  "If the user says 'ja': provide German equivalents for the last 5 examples.\n" +
  "If the user says 'si': provide Italian equivalents for the last 5 examples.\n" +
  "Keep formatting simple: numbered 1-5 for examples/translations. No long explanations.";

  return [
    `Term: ${term}`,
    def ? `Definition shown to learner: ${def}` : "",
    "",
    vocabTutorSystemMessage,
  ]
    .filter(Boolean)
    .join("\n");
}

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

      // Lowercase both strings during comparison to eliminate casing mismatches
    const idx = props.planItems.findIndex(
      (it) => String(it.id).toLowerCase() === nextId.toLowerCase()
    );

    if (idx >= 0) {
      currentIndex.value = idx;
    } else {
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

  const nextId = String(idRaw);
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

  const nextId = String(idRaw);
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

  if (mode.value === "asteroidz" || mode.value === "space_invaders") {
    gameStarted.value = true;
    return; // Exit early since Asteroidz initializes its own loop internally
  }

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

watch(
  [mode, gameStarted, currentIndex, roundCount],
  async () => {
    if (!gameStarted.value) return;
    if (mode.value !== "cards") return;
    if (!roundCount.value) return;

    await nextTick();
    requestAnimationFrame(() => {
      scrollActiveTermIntoView();
    });
  },
  { immediate: true }
);
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
    let acceptedArr: string[];
    let correct: boolean;

    if (isHardcodedListKey(props.gameSettings?.listId)) {
      // Existing hardcoded logic
      if (backField.value === "past_forms") {
        const ps = getAcceptedAnswers(it, "past_simple");
        const pp = getAcceptedAnswers(it, "present_perfect");
        acceptedArr = [
          `PS: ${ps.join(" / ") || "—"}`,
          `PP: ${pp.join(" / ") || "—"}`,
        ];
      } else {
        acceptedArr = getAcceptedAnswers(it, backField.value);
      }
      correct = checkUserAnswer(it, backField.value as any, user);
    } else {
      // Custom list logic
      acceptedArr = getFieldValueFromItem(it, backField.value);
      correct = checkUserAnswerForCustomItem(it, backField.value, user);
    }

    recordRound({
      user_answer: user,
      expected: acceptedArr.join(" / "),
      is_correct: correct,
    });

    if (correct) {
      // 🌟 TYPO MATCH EVALUATION
      // Normalize user answer vs accepted options using standard lower-case matching
      // If it passed validation, but isn't an *exact* match string, it's a typo rescue!
      const exactCorrect = acceptedArr.some(
        (a) => a.trim().toLowerCase() === user.toLowerCase()
      );
      
      if (!exactCorrect) {
        const primaryTarget = acceptedArr[0] || it.term;
        typoSnackbarMessage.value = `Typo detected! Accepted close answer for: "${primaryTarget}"`;
        showTypoSnackbar.value = true;
      }

      showFloatingFeedback.value = true;
      setTimeout(() => (showFloatingFeedback.value = false), 800);

      if (isPersistedMode.value) {
        await advancePersisted();
      } else {
        goNext();
      }
      return;
    }

    lastUserAnswer.value = user || "—";
    lastAcceptedAnswers.value = acceptedArr.join(" / ") || "—";
    showWrongDialog.value = true;
    suppressEnter(350);
  } catch {
    // catch blocks if any...
  } finally {
    if (!showWrongDialog.value) isSubmitting.value = false;
  }
}

function submitChoice(choice: string) {
  const it = currentItem.value;
  if (!it) return;

  if (!canSubmitNow()) return;
  isSubmitting.value = true;

  try {
    let acceptedArr: string[];
    let correct: boolean;

    if (isHardcodedListKey(props.gameSettings?.listId)) {
      acceptedArr = getAcceptedAnswers(it, backField.value);
      correct = checkUserAnswer(it, backField.value as any, choice);
    } else {
      acceptedArr = getFieldValueFromItem(it, backField.value);
      correct = checkUserAnswerForCustomItem(it, backField.value, choice);
    }

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
      item_key: it.id, 
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
    onGameCompleted();

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
onMounted(async () => {
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("beforeunload", onBeforeUnload as any);

  // Directly call the session initiation routine, skipping the pre-game landing page
  await begin();
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

.vw-shell {
  width: 100%;
  max-width: 1600px;  /* adjust: 1400-1800 depending on taste */
  margin: 0 auto;     /* center on huge screens */
}

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

/* Term list panel */
.discover-term-list {
  max-height: 420px;
  overflow-y: auto;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 6px;
}

.discover-term-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
}

.discover-term-row.active {
  background: rgba(76, 175, 80, 0.14);
  outline: 1px solid rgba(76, 175, 80, 0.45);
}


.discover-term-btn:focus-visible {
  outline: 2px solid rgba(25, 118, 210, 0.7);
  border-radius: 8px;
}

.discover-term-index {
  width: 2.2rem;
  color: rgba(0, 0, 0, 0.55);
  font-variant-numeric: tabular-nums;
}

.discover-term-text {
  font-weight: 500;
}

.discover-term-btn {
  all: unset;
  cursor: pointer;
  display: grid;
  grid-template-columns: 3rem 1fr 2fr; /* index, term, frontText */
  gap: 10px;
  align-items: baseline;
  width: 100%;
}

.discover-front-text {
  color: rgba(0,0,0,0.65);
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.is-blurred {
  filter: blur(10px);
  opacity: 0.35;
  pointer-events: none;
}

.blur-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vw-discover-slider {
  width: 540px;          /* match card width exactly */
  max-width: 70%;
}

.vw-back-face {
  position: relative;
  width: 100%;
  height: 100%;
}

.vw-wiki-btn {
  position: absolute;
  top: 2px;
  right: 10px;
  z-index: 20;
}

.vw-ai-btn {
  position: absolute;
  top: 55px;
  right: 10px;
  z-index: 20;
}

/* Context dialog */
.vw-context-list {
  max-height: 65vh;
  overflow: auto;
}

.vw-context-snippet {
  font-size: 0.95rem;
  line-height: 1.35rem;
  margin-top: 6px;
}

/* Back card: position examples button next to wiki button */
.vw-examples-btn {
  position: absolute;
  top: 10px;
  right: 56px; /* sits left of wiki button */
  z-index: 20;
}

.vw-context-mark {
  background: rgba(255, 235, 59, 0.55);
  padding: 0 2px;
  border-radius: 3px;
}

/* ==========================================
   🧱 SLLEK HUB CARD VIEWPORT PERSPECTIVES
   ========================================== */
.max-width-card-hub {
  max-width: 680px; /* Locked compact profile footprint avoiding split horizontal stretch */
  width: 100%;
}

.max-w-400 { max-width: 400px; }
.max-w-500 { max-width: 500px; }
.text-center-input :deep(input) { text-align: center !important; }
.h-calc-drawer { height: calc(100vh - 64px); }
.text-xxs { font-size: 0.72rem; }

.card-stage-canvas-box {
  position: relative;
  height: 380px;
  width: 100%;
  max-width: 540px; /* Card size stays locked on center stage canvas grid */
  margin: 0 auto;
}

/* ==========================================
   ⚡ ABSOLUTE FLOATING GLASS SWIPER PADDLES
   ========================================== */
.swiper-paddle-nav {
  position: absolute !important;
  top: 50%;
  transform: translateY(-50%);
  z-index: 40;
  border-color: #e2e8f0 !important;
  background-color: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(4px);
  color: #475569 !important;
  transition: all 0.2s ease;
}

.swiper-paddle-nav:hover:not(.v-btn--disabled) {
  background-color: #ffffff !important;
  color: #3b82f6 !important;
  transform: translateY(-50%) scale(1.06);
}

.left-paddle { left: -68px; }
.right-paddle { right: -68px; }

/* Responsive adjustments for paddles on tablet breakpoints */
@media (max-width: 720px) {
  .left-paddle { left: -12px; }
  .right-paddle { right: -12px; }
  .swiper-paddle-nav { opacity: 0.85; }
}

/* 3D Vertical Axis Card Turning Engine styles */
.flip-wrap-capsule {
  width: 100%;
  height: 100%;
  perspective: 1200px;
  cursor: pointer;
}

.flip-inner-axis {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.48s cubic-bezier(0.175, 0.885, 0.32, 1.15);
}

.flip-inner-axis.is-flipped-back-side {
  transform: rotateX(180deg);
}

.flip-sheet-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
  width: 100%;
  height: 100%;
}

.face-front-hull {
  border-color: #e2e8f0 !important;
}

.face-back-hull {
  transform: rotateX(180deg);
  border-color: #e2e8f0 !important;
}

.absolute-card-toolbar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 50;
}

/* ==========================================
   📁 EXTRACTED RE-INDEX OVERLAY LIST DRAWER
   ========================================== */
.discover-term-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.discover-term-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-color: #f1f5f9 !important;
  background-color: #ffffff;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.discover-term-btn {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-grow: 1;
  min-width: 0;
}

.active-row-highlight {
  background-color: rgba(59, 130, 246, 0.05) !important;
  border-color: rgba(59, 130, 246, 0.3) !important;
  outline: 1px solid rgba(59, 130, 246, 0.2);
}

.active-row-highlight .discover-term-text {
  color: #3b82f6 !important;
}

.discover-term-index {
  min-width: 22px;
  color: #94a3b8;
}

/* Global design systems tokens */
.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc !important; }

.animate-fade-in {
  animation: setup-fade 0.25s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}
@keyframes setup-fade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

