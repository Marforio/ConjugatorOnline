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
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, shallowRef, markRaw, toRaw, isProxy } from "vue";
import api from "@/axios";
import { getAccessToken } from "@/services/auth";
import Game from "@/assets/scripts/Game";
import InitialsText from "../InitialsText.vue";
import { useUserStore } from "@/stores/user";
import { useGameCompletion } from '@/composables/useGameCompletion';
import AiTutorHintDialog from "../AiTutorHintDialog.vue";

const { onGameCompleted } = useGameCompletion();

type GameSettings = {
  verbSet: string;
  sentenceTypes: string[];
  tenses: string[];
  numPrompts: number;
  smartVerbPool: any;
  isSmart: boolean;
};

const props = defineProps<{
  gameSettings: GameSettings;
}>();

const emit = defineEmits<{
  (e: "changeScene", scene: string): void;
  (e: "gameOver", payload: any): void;
}>();

const userStore = useUserStore();

// 🚀 Input Target Pointer Ref Slot mapping
const answerFieldRef = ref<any>(null);

// 🎴 Animation Coordination Flags
const cardInFlight = ref(false);
const cardFlippedOpen = ref(false);

const game = shallowRef<any>(null);
const gameStarted = ref(false);
const localGameSettings = ref<GameSettings | null>(null);

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
const results = ref<any[]>([]);
const startTime = ref<number | null>(null);
const roundStartTime = ref<number | null>(null);
const currentKeywordIndex = ref<number | null>(null);

let timerInterval: ReturnType<typeof window.setInterval> | null = null;
let roundIntervalId: ReturnType<typeof window.setInterval> | null = null;

const showBlockingDialog = ref(false);
const snackbar = reactive({ show: false, message: "", color: "success" });
const showKeyword = ref(true);
// 🚀 Dynamic Computed Tense Display: Updates instantly when showKeyword updates
const randomTenseDisplay = computed(() => {
  if (!showKeyword.value) {
    return currentPrompt.tense;
  }

  const tenseKey = currentPrompt.tense.toLowerCase().replace(/\s/g, "_");
  const options = keywords.value[tenseKey];

  if (Array.isArray(options) && options.length > 0) {
    // If we've already cached a keyword index for this specific round, use it
    if (currentKeywordIndex.value !== null && options[currentKeywordIndex.value]) {
      return options[currentKeywordIndex.value];
    }
    // Fallback safety in case bounds get misaligned
    return options[0];
  }
  
  return currentPrompt.tense;
});
const keywords = ref<Record<string, string[]>>({});
const hintOpen = ref(false);

const hintContext = computed(() => ({
  verb: currentPrompt.verb,
  person: currentPrompt.person,
  tense: currentPrompt.tense,
  sentence_type: currentPrompt.sentenceType,
  
  // 🚀 Pass the active keyword directly down into the AI payload!
  displayed_keyword: randomTenseDisplay.value,
  showing_keyword_mode: showKeyword.value,
  
  acceptable_answers: game.value?.getCurrentCorrectAnswers?.() ?? [],
}));

function deepClone<T>(obj: T): T {
  const raw = isProxy(obj as any) ? (toRaw(obj as any) as any) : (obj as any);
  return JSON.parse(JSON.stringify(raw));
}

function mapUiVerbSetToApiVerbSet(ui: string): string {
  if (ui === "Basic 75 Irregs") return "Basic 75";
  if (ui === "Master 110 Irregs") return "Master 110";
  if (ui === "Shakespeare 130 Irregs") return "All Irregular";
  if (ui === "GOAT 50 Hard Irregs Only") return "All Irregular";
  return "All Irregular";
}

function isIrregularSmartCapable(ui: string) {
  return [
    "Basic 75 Irregs",
    "Master 110 Irregs",
    "Shakespeare 130 Irregs",
    "GOAT 50 Hard Irregs Only"
  ].includes(ui);
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// mid icons for prompt cards
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
  if (norm.includes('past simple')) return 'mdi-timer-sand-complete'; // 📌 Disconnected line timeline
  if (norm.includes('perfect')) return 'mdi-arrow-collapse-right';      // 📌 Bridge connection link timeline
  if (norm.includes('future')) return 'mdi-fast-forward';
  if (norm.includes('recommendation')) return 'mdi-lightbulb-on-outline';
  return 'mdi-timeline-text-outline';
}


// ⌨️ Focus helper function injecting dynamic pointer capture onto the text inputs element
async function focusInput() {
  await nextTick();
  setTimeout(() => {
    if (answerFieldRef.value) {
      // Access structural native HTML input contexts inside Vuetify packaging abstractions
      const nativeInput = answerFieldRef.value.$el.querySelector('input');
      if (nativeInput) nativeInput.focus();
    }
  }, 120);
}

const progressValue = computed(() => {
  const total = localGameSettings.value?.numPrompts ?? props.gameSettings.numPrompts ?? 0;
  if (!total) return 0;
  return (promptCounter.value / total) * 100;
});

const isAuthenticated = computed(() => !!getAccessToken());
const displayedTenseHeader = computed(() => (showKeyword.value ? "Time reference" : "Tense"));

const isSmartList = computed(() => {
  const settings = localGameSettings.value;
  if (!settings || !isIrregularSmartCapable(settings.verbSet)) return false;
  const pool = settings.smartVerbPool;
  if (!pool || typeof pool !== "object") return false;
  return Array.isArray(pool["Past simple"]) || Array.isArray(pool["Present perfect"]);
});

async function loadTenseKeywords() {
  try {
    const res = await fetch("/data/tenseKeywords.json");
    keywords.value = await res.json();
  } catch (e) {
    console.error("Error loading tense keywords:", e);
    keywords.value = {};
  }
}

function updateRandomTense() {
  // Lock down a random index choice from the array for the duration of this round
  const tenseKey = currentPrompt.tense.toLowerCase().replace(/\s/g, "_");
  const options = keywords.value[tenseKey];
  
  if (Array.isArray(options) && options.length > 0) {
    currentKeywordIndex.value = Math.floor(Math.random() * options.length);
  } else {
    currentKeywordIndex.value = null;
  }
}

// 🎴 Advanced Animation Trigger Workflow Pipeline
function processCardDealingSequence() {
  cardFlippedOpen.value = false;
  cardInFlight.value = false;

  setTimeout(() => {
    const prompt = game.value?.getCurrentPrompt?.();
    if (!prompt) return;

    currentPrompt.person = prompt.getPerson();
    currentPrompt.verb = prompt.getVerb();
    currentPrompt.tense = prompt.getTense();
    currentPrompt.sentenceType = prompt.getSentenceType();

    // Lock in the choice index—the computed property handles the layout swap instantly!
    updateRandomTense();
    
    cardInFlight.value = true;

    if (gameStarted.value) startRoundTimer();
  }, 60);
}

function revealCardContents() {
  // Triggers exactly when the translate3d flying motion finishes arriving in absolute center space
  cardFlippedOpen.value = true;
  focusInput(); // Force programmatic focus onto inputs the instant the data properties display
}

function updateTimers() {
  if (!startTime.value) return;
  const elapsed = Math.floor((Date.now() - startTime.value) / 1000);
  overallTimer.value = formatTime(elapsed);
}

function startOverallTimer() {
  stopOverallTimer();
  timerInterval = window.setInterval(updateTimers, 1000);
}

function stopOverallTimer() {
  if (timerInterval) { window.clearInterval(timerInterval); timerInterval = null; }
}

function startRoundTimer() {
  roundStartTime.value = Date.now();
  if (roundIntervalId) window.clearInterval(roundIntervalId);
  roundIntervalId = window.setInterval(() => {
    if (!roundStartTime.value) return;
    const elapsed = Math.floor((Date.now() - roundStartTime.value) / 1000);
    roundTimer.value = formatTime(elapsed);
  }, 1000);
}

function endRoundTimer() {
  if (roundIntervalId) { window.clearInterval(roundIntervalId); roundIntervalId = null; }
}

onMounted(async () => {
  await loadTenseKeywords();
  
  // ⌨️ Auto focus inputs immediately upon component mounting
  focusInput();

  const baseSettings = deepClone(props.gameSettings);
  if (isIrregularSmartCapable(baseSettings.verbSet)) {
    const apiVerbSet = mapUiVerbSetToApiVerbSet(baseSettings.verbSet);
    const pool = await userStore.fetchSmartConjVerbPool({
      verbSet: apiVerbSet,
      batchSize: baseSettings.numPrompts,
    });
    baseSettings.smartVerbPool = pool ? deepClone(pool) : null;
    baseSettings.isSmart = !!(pool && (pool["Past simple"]?.length || pool["Present perfect"]?.length));
  } else {
    baseSettings.smartVerbPool = null;
    baseSettings.isSmart = false;
  }

  localGameSettings.value = baseSettings;
  game.value = markRaw(new Game(localGameSettings.value));
  await game.value.start();
  
  processCardDealingSequence();
});

onBeforeUnmount(() => {
  stopOverallTimer();
  endRoundTimer();
});

function goBack() { emit("changeScene", "Scene02_Settings"); }
// Clear active loop hooks during hard exits
function quitGame() { 
  stopOverallTimer(); 
  endRoundTimer(); 
  emit("changeScene", "Scene01_Landing"); 
}

function startGame() {
  if (!game.value) return;
  gameStarted.value = true;
  startTime.value = Date.now();
  roundStartTime.value = Date.now();
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

async function endGame() {
  showBlockingDialog.value = true;
  results.value = game.value?.getResults?.() ?? [];
  const totalRounds = results.value.length || (localGameSettings.value?.numPrompts ?? 0) || 1;
  const avgTime = startTime.value != null ? ((Date.now() - startTime.value) / 1000 / totalRounds).toFixed(1) : "0.0";

  const rounds = results.value.map((r: any, index: number) => {
    const isCorrectRound = r.correct === true;
    const typoCandidate = !isCorrectRound && r.typo?.isTypo === true && r.typo?.forceWrong === false;
    return {
      prompt_number: index + 1,
      person: r.prompt.person,
      verb: r.prompt.verb,
      tense: r.prompt.tense,
      sentence_type: r.prompt.sentenceType,
      user_answer: r.userAnswer,
      acceptable_answers: Array.isArray(r.correctAnswers) ? r.correctAnswers : [],
      elapsed_time: parseFloat(r.elapsedTime ?? 0),
      is_correct: typoCandidate ? null : isCorrectRound,
      typo_requested: typoCandidate,
      typo_lev_min: r.typo?.debug?.levMin ?? null,
      typo_best_accepted: r.typo?.debug?.bestAccepted ?? null,
      typo_detector_version: r.typo?.version ?? null,
      typo_force_wrong: r.typo?.forceWrong ?? null,
      typo_force_wrong_reason: r.typo?.forceWrongReason ?? "",
    };
  });

  const payload = {
    verb_set: localGameSettings.value?.verbSet ?? props.gameSettings.verbSet,
    sentence_types: localGameSettings.value?.sentenceTypes ?? props.gameSettings.sentenceTypes,
    tenses: localGameSettings.value?.tenses ?? props.gameSettings.tenses,
    total_rounds: localGameSettings.value?.numPrompts ?? props.gameSettings.numPrompts,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: startTime.value ? new Date(startTime.value).toISOString() : new Date().toISOString(),
    finished_at: new Date().toISOString(),
    total_time: startTime.value ? Math.floor((Date.now() - startTime.value) / 1000) : 0,
    avg_time_per_prompt: parseFloat(avgTime),
    rounds,
  };

  try {
    await api.post("/conj-game-sessions/", payload, { headers: { "Content-Type": "application/json" } });
  } catch (error: any) {
    console.error("Conj game submission exception payload tracking crash:", error);
  }

  setTimeout(() => {
    showBlockingDialog.value = false;
    emit("gameOver", payload);
    stopOverallTimer();
    endRoundTimer();
    onGameCompleted();
  }, 600);
}

async function submitAnswer() {
  if (!gameStarted.value || !game.value || !cardFlippedOpen.value) return;
  
  const now = Date.now();
  const elapsedMs = roundStartTime.value ? now - roundStartTime.value : 0;
  const realPrompt = game.value.getCurrentPrompt?.();
  if (realPrompt) realPrompt.elapsedTime = (elapsedMs / 1000).toFixed(1);

  const isCorrect = game.value.submitAnswer(userAnswer.value);
  const last = game.value?.results?.[game.value.results.length - 1];
  const typo = last?.typo;

  const shouldShowTypo = !isCorrect && typo && typo.isTypo === true && typo.forceWrong === false;
  snackbar.message = shouldShowTypo 
    ? `That looks like a typo. Your answer is very close.` 
    : (isCorrect ? `Yes! "${userAnswer.value}" is correct!` : `Sorry, "${userAnswer.value}" is wrong!`);

  snackbar.color = shouldShowTypo ? "info" : (isCorrect ? "success" : "warning");
  snackbar.show = false;
  await nextTick();
  snackbar.show = true;

  rightCount.value = game.value.getRightCount?.() ?? rightCount.value;
  wrongCount.value = game.value.getWrongCount?.() ?? wrongCount.value;
  promptCounter.value += 1;
  remainingCount.value = Math.max(0, remainingCount.value - 1);
  userAnswer.value = "";
  endRoundTimer();

  if (remainingCount.value === 1) submitButtontext.value = "FINISH";
  if (remainingCount.value === 0) { await endGame(); return; }

  game.value.nextPrompt();
  
  // 🎴 Clear out old card and deal the next prompt card out of the shoe
  processCardDealingSequence();
}
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
</style>