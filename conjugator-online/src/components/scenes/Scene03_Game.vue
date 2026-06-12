<template>
  <v-container fluid class="pa-0 d-flex bg-white" style="height: 100vh;">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
  v-if="$vuetify.display.smAndUp"  
  permanent
  width="300"
  class="border-r border-slate-200 bg-white d-flex flex-column"
  elevation="0"
>
  <div class="pa-4 border-b d-flex align-center bg-slate-50" style="height: 64px;">
    <v-icon color="primary" size="20" class="mr-2">mdi-tune-variant</v-icon>
    <span class="text-body-2 font-weight-black text-slate-800">Game Settings</span>
  </div>

  <v-list density="compact" class="bg-white pa-3 flex-grow-1">
    
    <v-list-item v-if="isAuthenticated" class="px-2 mb-2 bg-slate-50 rounded-lg border" min-height="36">
      <template v-slot:prepend>
        <v-icon size="16" color="slate-400" class="mr-2">mdi-account-circle</v-icon>
      </template>
      <div class="text-caption font-weight-medium text-slate-500 d-flex align-center">
        Player: <span class="font-weight-black text-slate-800 ml-1"><InitialsText /></span>
      </div>
    </v-list-item>

    <div class="px-2 py-1 mb-2">
      <div class="text-overline font-weight-bold text-slate-400 tracking-wider leading-none">Verb Set</div>
      <div class="text-body-2 font-weight-bold text-slate-800 text-truncate">{{ gameSettings.verbSet }}</div>
    </div>

    <div class="px-2 py-1 mb-2 d-flex align-center justify-space-between">
      <div>
        <div class="text-overline font-weight-bold text-slate-400 tracking-wider leading-none">Game Length</div>
        <div class="text-body-2 font-weight-bold text-slate-800">{{ remainingCount }} Rounds</div>
      </div>
      <v-tooltip text="Prioritizes verbs you haven't mastered yet" location="top">
        <template #activator="{ props }">
          <v-chip
            v-bind="props"
            v-if="isSmartList"
            size="x-small"
            color="primary"
            variant="flat"
            class="font-weight-bold"
          >
            Smart Pool
          </v-chip>
        </template>
      </v-tooltip>

    </div>

    <div class="px-2 py-1 mb-2">
      <div class="text-overline font-weight-bold text-slate-400 tracking-wider leading-none">Sentence Types</div>
      <div class="text-caption font-weight-medium text-slate-700 text-wrap mt-0.5">
        {{ gameSettings?.sentenceTypes?.join(', ') || 'None specified' }}
      </div>
    </div>

    <div class="px-2 py-1 mb-3">
      <div class="text-overline font-weight-bold text-slate-400 tracking-wider leading-none">Tenses</div>
      <div class="text-caption font-weight-medium text-slate-600 mt-0.5 text-wrap line-height-tight">
        {{ gameSettings?.tenses?.join(', ') || 'None active' }}
      </div>
    </div>

    <v-divider class="my-2 border-opacity-40"></v-divider>

    <div class="px-2">
      <v-switch 
        v-model="showKeyword" 
        :label="showKeyword ? 'Displaying Time References' : 'Displaying Tense Names'" 
        color="primary"
        density="compact"
        hide-details
        class="compact-sidebar-switch text-caption font-weight-bold text-slate-600"
      />
    </div>
  </v-list>

  <template v-slot:append>
    <div class="pa-3 border-t bg-slate-50 d-flex ga-2 align-center justify-space-between" style="height: 60px;">
      <v-btn icon="mdi-arrow-left" variant="tonal" size="small" color="slate-600" class="rounded-lg bg-white border" @click="goBack" />
      
      <v-tooltip text="Summary of tense keywords" location="top">
        <template v-slot:activator="{ props: helperProps }">
          <v-btn icon="mdi-lifebuoy" variant="tonal" size="small" color="slate-600" class="rounded-lg bg-white border" v-bind="helperProps" href="https://book.language-labs.ch/ch4#tense-keyword-summary" target='_blank' />
        </template>
      </v-tooltip>

      <v-btn v-if="gameStarted" color="error" variant="flat" size="small" height="34" class="px-4 font-weight-bold rounded-lg text-none flex-grow-1" @click="quitGame">
        Abandon Game
      </v-btn>
    </div>
  </template>
</v-navigation-drawer>


    <!-- Main game area -->
    <v-container fluid class="pa-2 d-flex justify-center align-center bg-white content-viewframe-layer">
      
      <!-- Scene Phase A: Instructions -->
      <div v-if="!gameStarted" class="max-width-instructions-panel">
        <h1 class="text-h3 mb-6 font-weight-black text-slate-800">Game Instructions</h1>
        <ol class="text-slate-700 pl-4 text-body-1">
          <li class="mb-2">You must write {{ remainingCount }} conjugations ({{ remainingCount }} rounds).</li>
          <li class="mb-1">Every round, you will see:</li>
          <ul class="mb-3 pl-4" style="list-style-type: circle;">
            <li>a verb</li>
            <li>a person (subject)</li>
            <li>a sentence type or temporal reference</li>
            <li>a tense</li>
          </ul>
          <li class="mb-1">Write the correct conjugation for that combination</li>
          <li class="mb-1">REMEMBER:</li>
          <ul class="pl-4" style="list-style-type: circle;">
            <li>Include both subject and verb</li>
            <li>Contractions are allowed</li>
            <li>Don't press BACK during the game</li>
            <li>Game details are shown at the end and in your data dashboard</li>
          </ul>
        </ol>

        <div class="d-flex align-center mt-8 pa-4 rounded-xl bg-slate-50 border">
          <span class="text-body-1 font-weight-medium text-slate-700">Can't remember tense names? Need a conjugation refresher?</span>
          <v-spacer />
          <v-tooltip text="Summary of tense keywords" location="top">
            <template v-slot:activator="{ props: helpProps }">
              <v-btn size="large" icon class="bg-white border elevation-1" v-bind="helpProps" href="https://book.language-labs.ch/ch4#tense-keyword-summary" target='_blank'>
                <v-icon color="primary">mdi-lifebuoy</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>

        <div class="d-flex justify-center mt-10">
          <v-btn color="success" size="x-large" height="54" class="px-8 rounded-xl font-weight-bold elevation-2" @click="startGame">START THE GAME</v-btn>
        </div>

        <div v-if="$vuetify.display.xs" class="d-flex justify-center mt-6">
          <v-btn size="large" icon elevation="1" class="bg-white border" @click="goBack">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Scene Phase B: Active Game -->
      <div v-else class="d-flex flex-column align-center justify-center game-runtime-deck">
        
        <!-- Timer Readout Strip -->
        <v-card v-if="$vuetify.display.smAndUp" class="pa-4 mb-6 d-flex justify-center align-center rounded-xl border" flat height="48" :style="{ width: $vuetify.display.mdAndUp ? '460px' : '320px', gap: '30px' }" color="slate-50">
          <span class="text-caption font-weight-bold text-slate-600 d-flex align-center"><v-icon size="16" class="mr-1" color="primary">mdi-timer-sand</v-icon> Round: {{ roundTimer }}</span>
          <v-divider vertical class="border-opacity-20"></v-divider>
          <span class="text-caption font-weight-bold text-slate-600 d-flex align-center"><v-icon size="16" class="mr-1" color="primary">mdi-timer</v-icon> Total: {{ overallTimer }}</span>
        </v-card>

        <!-- 🚀 3D CARD ANIMATION FLIPSTAGE WORKSPACE -->
        <div class="card-deal-scene-viewport mb-6" :style="{ width: $vuetify.display.mdAndUp ? '460px' : '320px' }">
          <Transition name="deal-card" @after-enter="revealCardContents">
            <div v-if="cardInFlight" class="card-animation-container-box">
              <div class="card-3d-flipper-axis" :class="{ 'card-face-revealed': cardFlippedOpen }">
                
                <!-- CARD BACK (Visible during flying translation animation) -->
                <v-card class="card-hull card-reverse-side d-flex flex-column align-center justify-center rounded-xl" elevation="3" color="primary">
                  <v-icon size="48" color="white" class="floating-icon-pulse">mdi-school</v-icon>
                  <span class="text-overline text-white font-weight-bold mt-2 tracking-wider">Language Labs</span>
                </v-card>

                <!-- CARD FRONT (Flipped open smoothly once card arrives in center) -->
                <v-card class="card-hull card-obverse-side pa-6 d-flex flex-column align-center rounded-xl border bg-slate-50" elevation="2">
                  <v-card-title class="text-subtitle-2 text-uppercase font-weight-black tracking-widest text-primary pb-0">Target Verb</v-card-title>
                  
                  <div class="d-flex align-center my-auto justify-center w-100">
                    <div class="text-center font-weight-black text-slate-900 line-height-tight" :class="$vuetify.display.mdAndUp ? 'text-h3' : 'text-h4'">
                      {{ currentPrompt.verb }}
                    </div>

                    <!-- AI Assistant Hook Anchored inside layout right margin border -->
                    <div class="position-absolute d-flex justify-end pr-4" style="right: 0;">
                      <AiTutorHintDialog v-model="hintOpen" :context="hintContext" api-url="/llm/chat/">
                        <template #activator="{ open }">
                          <v-tooltip text="What does this verb mean?" location="top">
                            <template #activator="{ props: hintProps }">
                              <v-btn
                                icon
                                size="x-small"
                                variant="tonal"
                                color="primary"
                                v-bind="hintProps"
                                @click.stop="open"
                              >
                                <v-icon size="18">mdi-robot-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-tooltip>
                        </template>
                      </AiTutorHintDialog>
                    </div>
                  </div>

                  <v-divider class="w-100 my-3 border-opacity-40"></v-divider>
                
                  <!-- Grid Parameter Row Sets -->
                  <v-row no-gutters justify="center" align="start" class="w-100 text-center mt-auto">
                    <v-col cols="4" class="border-r px-1">
                      <div class="text-overline font-weight-bold text-slate-400 d-flex align-center justify-center">
                        Person
                      </div>
                      <div class="text-body-2 font-weight-bold text-slate-700 text-truncate d-flex flex-column align-center mt-0.5">
                        <span class="w-100 text-truncate">{{ currentPrompt.person }}</span>
                        <v-icon size="18" color="slate-600" class="mt-1">
                          {{ getPersonIcon(currentPrompt.person) }}
                        </v-icon>
                      </div>
                    </v-col>

                    <v-col cols="4" class="border-r px-1">
                      <div class="text-overline font-weight-bold text-slate-400 d-flex align-center justify-center">
                        Type
                      </div>
                      <div class="text-body-2 font-weight-bold text-slate-700 text-truncate d-flex flex-column align-center mt-0.5">
                        <span class="w-100 text-truncate">{{ currentPrompt.sentenceType }}</span>
                        <v-icon size="18" color="slate-600" class="mt-1">
                          {{ getSyntaxIcon(currentPrompt.sentenceType) }}
                        </v-icon>
                      </div>
                    </v-col>

                    <v-col cols="4" class="px-1">
                      <div class="text-overline font-weight-bold text-slate-400 d-flex align-center justify-center">
                        {{ displayedTenseHeader }}
                      </div>
                      <v-tooltip :text="currentPrompt.tense" location="top" :disabled="!showKeyword">
                        <template v-slot:activator="{ props: tenseProps }">
                          <div v-bind="tenseProps" class="text-body-2 font-weight-bold text-slate-700 text-truncate d-flex flex-column align-center mt-0.5">
                            <span class="w-100 text-wrap">{{ randomTenseDisplay }}</span>
                            <v-icon size="18" color="slate-600" class="mt-1">
                              {{ getTenseTimelineIcon(currentPrompt.tense) }}
                            </v-icon>
                          </div>
                        </template>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-card>

              </div>
            </div>
          </Transition>
        </div>

        <!-- Input Response Interface Row Block -->
        <div class="gameB-container" style="display: none; visibility: hidden; position: absolute; left: -9999px;">

          <input 
            v-model="gameB.Answer" 
            type="text" 
            name="answer" 
            placeholder="Answer goes here"
            tabindex="-1"
            autocomplete="off"
          />
          
          <!-- Honeypot 5: Fake submit button (bots might click) -->
          <v-btn 
            @click="gameB.onClick"
            name="submit_answer"
            style="display: none;"
          >
            Submit Answer
          </v-btn>
        </div>

        <v-row no-gutters justify="center" align="center" class="w-100 load-input-row" :style="{ maxWidth: $vuetify.display.mdAndUp ? '460px' : '320px' }">
          <v-col cols="12">
            <!-- ⌨️ Targeted Template Reference binding for execution injections -->
            <v-text-field
              ref="answerFieldRef"
              v-model="userAnswer"
              @keyup.enter="submitAnswer"
              label="Conjugation Answer"
              placeholder="Include person + verb pair"
              variant="outlined"
              density="comfortable"
              color="primary"
              class="rounded-xl font-weight-medium"
              hide-details
            ></v-text-field>

            <!-- Submit trigger button -->
            <div class="d-flex justify-center mt-4">
              <v-btn color="primary" size="large" height="46" width="160" class="rounded-xl font-weight-bold elevation-1" @click="submitAnswer">
                {{ submitButtontext }}
              </v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Progress Tracking Bar metrics line -->
        <v-progress-linear
          :model-value="progressValue"
          height="8"
          color="primary"
          rounded
          class="mt-8 mb-4"
          :style="{ maxWidth: $vuetify.display.mdAndUp ? '460px' : '320px' }"
        ></v-progress-linear>

        <!-- Dynamic Flash Scoreboard Status Footer panel -->
        <v-footer class="pa-3 rounded-xl border bg-slate-50" flat :style="{ width: $vuetify.display.mdAndUp ? '460px' : '320px' }">
          <v-row no-gutters justify="center" align="center" class="w-100">
            <div class="scoreboard d-flex justify-space-around align-center w-100">
              <transition name="flash-green" mode="out-in">
                <span :key="rightCount" class="text-subtitle-2 font-weight-black text-success">✅ {{ rightCount }}</span>
              </transition>

              <transition name="flash-red" mode="out-in">
                <span :key="wrongCount" class="text-subtitle-2 font-weight-black text-error">❌ {{ wrongCount }}</span>
              </transition>

              <v-divider vertical class="mx-1"></v-divider>

              <transition name="flash-black" mode="out-in">
                <v-tooltip text="Remaining Tasks" location="top">
                  <template #activator="{ props: remainingProps }">
                    <span :key="remainingCount" class="text-subtitle-2 font-weight-black text-slate-700 d-flex align-center" v-bind="remainingProps">
                      <v-icon size="16" class="mr-1" color="slate-600">mdi-tray-full</v-icon> {{ remainingCount }}
                    </span>
                  </template>
                </v-tooltip>
              </transition>

              <transition name="flash-black" mode="out-in">
                <v-tooltip text="Completed Tasks" location="top">
                  <template #activator="{ props: completedProps }">
                    <span :key="promptCounter" class="text-subtitle-2 font-weight-black text-slate-700 d-flex align-center" v-bind="completedProps">
                      <v-icon size="16" class="mr-1" color="slate-600">mdi-archive-check</v-icon> {{ promptCounter }}
                    </span>
                  </template>
                </v-tooltip>
              </transition>
            </div>
          </v-row>
        </v-footer>

        <div v-if="$vuetify.display.xs" class="d-flex justify-center mt-4">
          <v-btn icon elevation="1" class="bg-white border" @click="goBack">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
        </div>
      </div>
    </v-container>

    <!-- UI Overlay elements -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2500" location="top" elevation="3" class="mt-4">
      {{ snackbar.message }}
    </v-snackbar>

    <v-dialog v-model="showBlockingDialog" persistent fullscreen transition="fade-transition">
      <v-card class="d-flex align-center justify-center" color="transparent" elevation="0">
        <v-progress-circular indeterminate color="primary" size="56" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, shallowRef, markRaw, isProxy, toRaw } from "vue";
import api from "@/axios";
import { getAccessToken } from "@/services/auth";
import InitialsText from "../InitialsText.vue";
import { useUserStore } from "@/stores/user";
import { useGameCompletion } from '@/composables/useGameCompletion';
import AiTutorHintDialog from "../AiTutorHintDialog.vue";
import CryptoJS from 'crypto-js';

const { onGameCompleted } = useGameCompletion();
const userStore = useUserStore();

type GameSettings = {
  verbSet: string;
  sentenceTypes: string[];
  tenses: string[];
  numPrompts: number;
  smartVerbPool: any;
  isSmart: boolean;
};

const gameB = reactive({
  Answer: "",
  onClick: 0,
  formInteractionTime: 0, 
  mouseMovements: 0,
  keystrokes: 0,
  focusEvents: 0,
});

let formStartTime = 0;

const props = defineProps<{
  gameSessionData?: {
    session_id: number;
    prompts: any[];
    answer_hashes: string[];
    typo_detector_version: string;
    error_classifier_version: string;
    started_at: string;
  };
  gameSettings: GameSettings;
}>();

const emit = defineEmits<{
  (e: "changeScene", scene: string): void;
  (e: "gameOver", payload: any): void;
}>();

// ============================================================================
// STATE: Backend vs Local Game Mode
// ============================================================================

const isBackendMode = computed(() => !!props.gameSessionData?.session_id);
const sessionId = ref<number | null>(props.gameSessionData?.session_id || null);
const promptDefinitions = ref<any[]>(props.gameSessionData?.prompts || []);
const acceptableAnswersCache = ref<Map<number, string[]>>(new Map());

// Local game state (for offline mode / backward compatibility)
const game = shallowRef<any>(null);

// ============================================================================
// SHARED STATE
// ============================================================================

const gameStarted = ref(false);
const localGameSettings = ref<GameSettings | null>(null);
const answerFieldRef = ref<any>(null);

const currentPrompt = reactive({
  person: "",
  verb: "",
  tense: "",
  sentenceType: "",
});

const userAnswer = ref("");
const overallTimer = ref("00:00");
const roundTimer = ref("00:00");
const rightCount = ref(0);
const wrongCount = ref(0);
const remainingCount = ref<number>(props.gameSettings?.numPrompts ?? 0);
const promptCounter = ref(0);
const submitButtontext = ref("SUBMIT");
const pendingRounds = ref<any[]>([]);

const cardInFlight = ref(false);
const cardFlippedOpen = ref(false);
const showBlockingDialog = ref(false);
const snackbar = reactive({ show: false, message: "", color: "success" });
const showKeyword = ref(true);
const currentKeywordIndex = ref<number | null>(null);
const keywords = ref<Record<string, string[]>>({});

let timerInterval: ReturnType<typeof window.setInterval> | null = null;
let roundIntervalId: ReturnType<typeof window.setInterval> | null = null;
let roundStartTime: number | null = null;
let startTime: number | null = null;

const isSmartList = computed(() => {
  const settings = localGameSettings.value;
  if (!settings || !isIrregularSmartCapable(settings.verbSet)) return false;
  const pool = settings.smartVerbPool;
  if (!pool || typeof pool !== "object") return false;
  return Array.isArray(pool["Past simple"]) || Array.isArray(pool["Present perfect"]);
});
// ============================================================================
// HELPER: SIMPLE ANSWER MATCHING (for local UI feedback only)
// ============================================================================

/**
 * Simple answer validation for instant UI feedback.
 * The REAL validation happens on the backend.
 * 
 * This is just for showing "Correct!" or "Wrong!" immediately to the student.
 */
function validateAnswerLocally(userAnswer: string, acceptableAnswers: string[]): boolean {
  const normalized = userAnswer.toLowerCase().trim();
  return acceptableAnswers.some(ans => ans.toLowerCase().trim() === normalized);
}

// ============================================================================
// TIMER FUNCTIONS
// ============================================================================

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimers() {
  if (!startTime) return;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  overallTimer.value = formatTime(elapsed);
}

function startOverallTimer() {
  stopOverallTimer();
  startTime = Date.now();
  timerInterval = window.setInterval(updateTimers, 1000);
}

function stopOverallTimer() {
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startRoundTimer() {
  roundStartTime = Date.now();
  if (roundIntervalId) window.clearInterval(roundIntervalId);
  roundIntervalId = window.setInterval(() => {
    if (!roundStartTime) return;
    const elapsed = Math.floor((Date.now() - roundStartTime) / 1000);
    roundTimer.value = formatTime(elapsed);
  }, 1000);
}

function endRoundTimer() {
  if (roundIntervalId) {
    window.clearInterval(roundIntervalId);
    roundIntervalId = null;
  }
}

// ============================================================================
// FOCUS & INPUT
// ============================================================================

async function focusInput() {
  await nextTick();
  setTimeout(() => {
    if (answerFieldRef.value) {
      const nativeInput = answerFieldRef.value.$el.querySelector('input');
      if (nativeInput) nativeInput.focus();
    }
  }, 120);
}

// ============================================================================
// KEYWORD DISPLAY (unchanged)
// ============================================================================

async function loadTenseKeywords() {
  try {
    const res = await fetch("/data/tenseKeywords.json");
    keywords.value = await res.json();
  } catch (e) {
    console.error("Error loading tense keywords:", e);
    keywords.value = {};
  }
}

const randomTenseDisplay = computed(() => {
  if (!showKeyword.value) {
    return currentPrompt.tense;
  }

  const tenseKey = currentPrompt.tense.toLowerCase().replace(/\s/g, "_");
  const options = keywords.value[tenseKey];

  if (Array.isArray(options) && options.length > 0) {
    if (currentKeywordIndex.value !== null && options[currentKeywordIndex.value]) {
      return options[currentKeywordIndex.value];
    }
    return options[0];
  }
  
  return currentPrompt.tense;
});

function updateRandomTense() {
  const tenseKey = currentPrompt.tense.toLowerCase().replace(/\s/g, "_");
  const options = keywords.value[tenseKey];
  
  if (Array.isArray(options) && options.length > 0) {
    currentKeywordIndex.value = Math.floor(Math.random() * options.length);
  } else {
    currentKeywordIndex.value = null;
  }
}

function isIrregularSmartCapable(ui: string) {
  return [
    "Basic 75 Irregs",
    "Master 110 Irregs",
    "Shakespeare 130 Irregs",
    "GOAT 50 Hard Irregs Only"
  ].includes(ui);
}

function mapUiVerbSetToApiVerbSet(ui: string): string {
  if (ui === "Basic 75 Irregs") return "Basic 75";
  if (ui === "Master 110 Irregs") return "Master 110";
  if (ui === "Shakespeare 130 Irregs") return "All Irregular";
  if (ui === "GOAT 50 Hard Irregs Only") return "All Irregular";
  return "All Irregular";
}

function deepClone<T>(obj: T): T {
  const raw = isProxy(obj as any) ? (toRaw(obj as any) as any) : (obj as any);
  return JSON.parse(JSON.stringify(raw));
}
// ============================================================================
// CARD ANIMATION
// ============================================================================

function processCardDealingSequence() {
  cardFlippedOpen.value = false;
  cardInFlight.value = false;

  setTimeout(() => {
    if (isBackendMode.value) {
      displayNextPrompt();
    } else {
      const prompt = game.value?.getCurrentPrompt?.();
      if (!prompt) return;

      currentPrompt.person = prompt.getPerson();
      currentPrompt.verb = prompt.getVerb();
      currentPrompt.tense = prompt.getTense();
      currentPrompt.sentenceType = prompt.getSentenceType();
    }

    updateRandomTense();
    cardInFlight.value = true;

    if (gameStarted.value) startRoundTimer();
  }, 60);
}

function revealCardContents() {
  cardFlippedOpen.value = true;
  focusInput();
}

// ============================================================================
// BACKEND MODE: Display Prompts
// ============================================================================

function displayNextPrompt() {
  if (promptCounter.value >= promptDefinitions.value.length) {
    return;
  }

  const prompt = promptDefinitions.value[promptCounter.value];
  currentPrompt.person = prompt.person;
  currentPrompt.verb = prompt.verb;
  currentPrompt.tense = prompt.tense;
  currentPrompt.sentenceType = prompt.sentence_type;
}

// ============================================================================
// HINT SYSTEM
// ============================================================================

const hintOpen = ref(false);

const hintContext = computed(() => ({
  verb: currentPrompt.verb,
  person: currentPrompt.person,
  tense: currentPrompt.tense,
  sentence_type: currentPrompt.sentenceType,
  displayed_keyword: randomTenseDisplay.value,
  showing_keyword_mode: showKeyword.value,
  acceptable_answers: acceptableAnswersCache.value.get(promptCounter.value) || [],
}));

// ============================================================================
// ICON HELPERS
// ============================================================================

function getSyntaxIcon(type: string): string {
  const norm = type.toLowerCase();
  if (norm.includes('neg')) return 'mdi-minus-box';
  if (norm.includes('quest') || norm.includes('?')) return 'mdi-help-box';
  return 'mdi-plus-box'; // Fallback Default: Positive
}

function getPersonIcon(person: string): string {
  const norm = person.toLowerCase();
  if (norm === "i") return "mdi-information-variant"; // No icon for first person singular
  if (norm === "you") return 'mdi-hand-pointing-down';
  if (norm === "he") return 'mdi-face-man';
  if (norm === "she") return 'mdi-face-woman';
  if (norm === "it") return 'mdi-car';  
  if (norm === "we") return 'mdi-account-group';
  if (norm === "they") return 'mdi-human-male-female-child';
  return 'mdi-account-cowboy-hat'; // Fallback Default: Unknown
}

function getTenseTimelineIcon(tense: string): string {
  const norm = tense.toLowerCase();
  if (norm.includes('present simple')) return 'mdi-repeat-variant';
  if (norm.includes('continuous')) return 'mdi-progress-helper';
  if (norm.includes('past simple')) return 'mdi-timer-sand-complete'; 
  if (norm.includes('perfect')) return 'mdi-arrow-collapse-right';      
  if (norm.includes('future')) return 'mdi-fast-forward';
  if (norm.includes('recommendation')) return 'mdi-lightbulb-on-outline';
  return 'mdi-timeline-text-outline';
}

// ============================================================================
// INITIALIZATION
// ============================================================================

onMounted(async () => {
  await loadTenseKeywords();
  formStartTime = Date.now();
  focusInput();
  document.addEventListener('mousemove', () => {
    gameB.mouseMovements++;
  });
  document.addEventListener('keydown', () => {
    gameB.keystrokes++;
  });
  // Track focus on answer field
  if (answerFieldRef.value) {
    const nativeInput = answerFieldRef.value.$el.querySelector('input');
    if (nativeInput) {
      nativeInput.addEventListener('focus', () => {
        gameB.focusEvents++;
      });
    }
  }

  if (isBackendMode.value) {
    localGameSettings.value = props.gameSettings;
    promptCounter.value = 0;
    remainingCount.value = promptDefinitions.value.length;
  } else {
    // Local mode - initialize Game.js as before
    const baseSettings = { ...props.gameSettings };
    localGameSettings.value = baseSettings;
    // Initialize local game engine...
  }
});

onBeforeUnmount(() => {
  stopOverallTimer();
  endRoundTimer();
});

// ============================================================================
// ANSWER SUBMISSION
// ============================================================================
/**
 * Check gameB answers
 */
function checkGameB(): { flagged: boolean; score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  if (gameB.Answer.trim()) {
    reasons.push("hp_answer_field_filled");
    score += 50;
  }

  // 2. Fake button clicked
  if (gameB.onClick > 0) {
    reasons.push("hp_button_clicked");
    score += 50;
  }

  // 3. No mouse movements (bots often don't move mouse)
  if (gameB.mouseMovements === 0) {
    reasons.push("no_mouse_movements");
    score += 15;
  }

  // 4. No keystrokes before submission
  if (gameB.keystrokes === 0) {
    reasons.push("no_keystroke_events");
    score += 30;
  }

  // 5. Form filled too quickly (< 1.2 seconds total)
  const timeTaken = Date.now() - formStartTime;
  if (timeTaken < 1200) {
    reasons.push("form_filled_too_fast");
    score += 30;
  }

  // 6. No focus events on answer field
  if (gameB.focusEvents === 0) {
    reasons.push("no_focus_on_answer_field");
    score += 10;
  }

  return {
    flagged: score >= 50, 
    score: score,
    reasons,
  };
}

async function submitAnswer() {
  if (!gameStarted.value || !cardFlippedOpen.value) return;

  const gameBResult = checkGameB();

  const now = Date.now();
  const elapsedMs = roundStartTime ? now - roundStartTime : 0;
  const elapsedSeconds = (elapsedMs / 1000).toFixed(1);

  let isCorrect = false;

  if (isBackendMode.value) {
    // Backend mode: compare hashed answer
    const userAnswerHash = hashAnswer(userAnswer.value);
    const currentPrompt = props.gameSessionData?.prompts[promptCounter.value];
    const acceptableHashes = currentPrompt?.answer_hashes || [];
    
    console.log(`[DEBUG] Round ${promptCounter.value + 1}:`);
    console.log(`  User answer: "${userAnswer.value}"`);
    console.log(`  User hash: ${userAnswerHash}`);
    console.log(`  Acceptable hashes (${acceptableHashes.length}):`, acceptableHashes);
    
    isCorrect = acceptableHashes.includes(userAnswerHash);  // ✅ Check if IN array
  } else {
    const acceptableAnswers = game.value?.getCurrentCorrectAnswers?.() || [];
    isCorrect = validateAnswerLocally(userAnswer.value, acceptableAnswers);
  }

  if (isCorrect) {
    rightCount.value++;
  } else {
    wrongCount.value++;
  }

  // Show instant feedback
  snackbar.message = isCorrect 
    ? `Yes! "${userAnswer.value}" is correct!` 
    : `Your answer is being checked... results at the end!`;
  snackbar.color = isCorrect ? "success" : "info";
  snackbar.show = false;
  await nextTick();
  snackbar.show = true;

  // Store round for batch submission
  const promptNum = promptCounter.value + 1;
  pendingRounds.value.push({
    prompt_number: promptNum,
    user_answer: userAnswer.value,
    elapsed_time: parseFloat(elapsedSeconds),
    hp_triggered: gameBResult.flagged,
    hp_score: gameBResult.score,
    hp_reasons: gameBResult.reasons,
  });

  promptCounter.value += 1;
  remainingCount.value = Math.max(0, remainingCount.value - 1);
  userAnswer.value = "";
  endRoundTimer();

  if (remainingCount.value === 1) submitButtontext.value = "FINISH";
  if (remainingCount.value === 0) {
    await endGame();
    return;
  }

  processCardDealingSequence();
}

/**
 * Hash an answer the same way the backend does.
 * Must match: hashlib.sha256(answer.lower().strip().encode()).hexdigest()
 */
function hashAnswer(answer: string): string {
  const normalized = answer.toLowerCase().trim();
  return CryptoJS.SHA256(normalized).toString();
}

// ============================================================================
// GAME END
// ============================================================================

async function endGame() {
  showBlockingDialog.value = true;

  const totalRounds = promptDefinitions.value.length || 1;
  const avgTime = startTime ? ((Date.now() - startTime) / 1000 / totalRounds).toFixed(1) : "0.0";

  const payload = {
    session_id: sessionId.value,
    rounds: pendingRounds.value,
  };

  // Wait a bit for visual effect, then close dialog and emit
  setTimeout(() => {
    showBlockingDialog.value = false;
    emit("gameOver", payload);
    stopOverallTimer();
    endRoundTimer();
    onGameCompleted();
  }, 600);
}

// ============================================================================
// GAME CONTROLS
// ============================================================================

function startGame() {
  if (!gameStarted.value) {
    gameStarted.value = true;
    startTime = Date.now();
    roundStartTime = Date.now();
    overallTimer.value = "00:00";
    roundTimer.value = "00:00";
    promptCounter.value = 0;
    remainingCount.value = localGameSettings.value?.numPrompts ?? props.gameSettings.numPrompts ?? 0;
    rightCount.value = 0;
    wrongCount.value = 0;
    submitButtontext.value = remainingCount.value === 1 ? "FINISH" : "SUBMIT";

    startOverallTimer();
    processCardDealingSequence();
  }
}

function goBack() {
  emit("changeScene", "Scene02_Settings");
}

function quitGame() {
  stopOverallTimer();
  endRoundTimer();
  emit("changeScene", "Scene01_Landing");
}

const progressValue = computed(() => {
  const total = localGameSettings.value?.numPrompts ?? props.gameSettings.numPrompts ?? 0;
  if (!total) return 0;
  return (promptCounter.value / total) * 100;
});

const isAuthenticated = computed(() => !!getAccessToken());
const displayedTenseHeader = computed(() => (showKeyword.value ? "Time reference" : "Tense"));

</script>

<style scoped>
.content-viewframe-layer {
  min-height: 100vh;
}

.max-width-instructions-panel {
  max-width: 580px;
  width: 100%;
}

.game-runtime-deck {
  width: 100%;
}

/* ==========================================
   🎴 DESIGN INTERACTION CARD ARCHITECTURE 
   ========================================== */
.card-deal-scene-viewport {
  height: 280px; /* Locked fixed constraint box boundaries stops layout text jumps */
  perspective: 1200px; /* Injects depth into the rotate spatial grid */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-animation-container-box {
  width: 100%;
  height: 100%;
}

.card-3d-flipper-axis {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.2);
}

/* Axis rotation driver trigger */
.card-3d-flipper-axis.card-face-revealed {
  transform: rotateY(180deg);
}

.card-hull {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* Mask inverted sides safely during flip turns */
  display: flex;
  flex-direction: column;
}

.card-obverse-side {
  transform: rotateY(180deg); /* Initialize mirrored back to balance final twist flips */
  border-color: #e2e8f0 !important;
}

.card-reverse-side {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.15) !important;
  border: 6px solid #ffffff;
}

/* 🚀 FLYING CODES TRANSITION MATRIX
   Calculates entry vectors sliding down diagonally into perspective centers */
.deal-card-enter-from {
  opacity: 0;
  transform: translate3d(160px, -280px, -300px) scale(0.4) rotate(25deg);
}

.deal-card-enter-active {
  transition: all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
}

.deal-card-enter-to {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
}

.scoreboard {
  gap: 16px;
}

.line-height-tight {
  line-height: 1.15;
}

.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-700 { color: #334155; }
.text-slate-600 { color: #475569; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc !important; }

.floating-icon-pulse {
  animation: deal-float 2s infinite ease-in-out;
}

@keyframes deal-float {
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.06); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
}

.gameB-container {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  visibility: hidden;
  display: none !important;
}
</style>