<template>
  <v-container fluid class="pa-0 d-flex" style="height: 100vh;">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
    v-if="$vuetify.display.smAndUp"  
    permanent
      width="280"
      class="pa-4 d-flex flex-column align-center ml-3 align-self-center"
    >
      <v-img
        src="/images/banners/Conjugator3.png"
        alt="Logo"
        class="rounded-lg w-100 mb-5 mt-4"
        min-width="250"
        cover
      />

      <h2 class="text-h6 text-center font-weight-bold">Game Settings</h2>

      <v-list density="compact" lines="one">
        <v-list-item>
          <v-list-item-title v-if="isAuthenticated"><span class="font-weight-medium">Name:</span> <InitialsText /></v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title style="text-wrap: wrap;"><span class="font-weight-medium">Verb set:</span> {{ gameSettings.verbSet }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
            <span class="font-weight-medium">Rounds: </span>{{ remainingCount }} <v-chip v-if="isSmartList" size="x-small" color="primary" class="ms-5">smart list</v-chip>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title style="text-wrap: wrap;">
            <span class="font-weight-medium">Sentence type(s):</span> {{ gameSettings?.sentenceTypes?.join(', ') || '' }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title style="text-wrap: wrap;">
            <span class="font-weight-medium">Tense(s): </span>{{ gameSettings?.tenses?.join(', ') || '' }}
          </v-list-item-title>
        </v-list-item>
        <v-switch :label="showKeyword ? 'See time reference' : 'See tense name'" v-model="showKeyword" class="ms-6" />
      </v-list>
      <v-divider></v-divider>

      <div class="mt-auto d-flex justify-space-between align-center w-100 px-3">
        <v-btn icon elevation="1" class="ms-3" @click="goBack">
          <v-icon size="large">mdi-arrow-left-circle</v-icon>
        </v-btn>
        <v-tooltip text="Summary of tense keywords" location="top">
          <template v-slot:activator="{ props }">
            <v-btn icon elevation="1" class="me-3" v-bind="props" href="https://book.language-labs.ch/ch4#tense-keyword-summary" target='_blank'>
              <v-icon size="large">mdi-lifebuoy</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        
        <v-btn v-if="gameStarted" color="error" variant="flat" class="me-3" @click="quitGame">QUIT</v-btn>
      </div>
    </v-navigation-drawer>

    <!-- Main game area -->
    <v-container fluid class="pa-2 d-flex justify-center align-center">
      <div v-if="!gameStarted">
        <!-- Instructions -->
        <h1 class="text-h3 mb-6">Game Instructions</h1>
        <ol>
          <li>You must write {{ remainingCount }} conjugations ({{ remainingCount }}  rounds).</li>
          <li>Every round, you will see:</li>
          <ul>
            <li>a verb</li>
            <li>a person (subject)</li>
            <li>a sentence type or temporal reference</li>
            <li>a tense</li>
          </ul>
          <li>Write the correct conjugation for that combination</li>
          <li>REMEMBER:</li>
          <ul>
            <li>Include both subject and verb</li>
            <li>Contractions are allowed</li>
            <li>Don't press BACK during the game</li>
            <li>Game details are shown at the end and in your dashboard</li>
          </ul>
        </ol>

        <div class="d-flex justify-center align-center mt-6 pa-3">
          <span class="text-h6">Can't remember tense names? Need a conjugation refresher?</span>
          <span class="ms-4 me-4">→ → →</span>
          <v-tooltip text="Summary of tense keywords" location="top">
          <template v-slot:activator="{ props }">
            <v-btn size="x-large" icon v-bind="props" href="https://book.language-labs.ch/ch4#tense-keyword-summary" target='_blank'>
              <v-icon size="x-large">mdi-lifebuoy</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        </div>

        <div class="d-flex justify-center mt-12">
          <v-btn color="success" large @click="startGame">START THE GAME</v-btn>
        </div>

        <div v-if="$vuetify.display.xs" class="d-flex justify-center mt-6">
          <v-btn size="x-large" icon elevation="1" large @click="goBack">
            <v-icon size="x-large">mdi-arrow-left-circle</v-icon>
          </v-btn>
        </div>
      </div>

      <div v-else>
        <!-- Active Game -->
         <v-card v-if="$vuetify.display.smAndUp" class="pa-6 mb-6 d-flex justify-center align-center rounded-lg" height="50px" :style="{ width: $vuetify.display.mdAndUp ? '450px' : '280px',
                                                                                                        gap: $vuetify.display.mdAndUp ? '40px' : '20px'}
            " elevation="2" color="grey-lighten-4">
          <span class="text-subtitle-2" style="text-align: align-center"><v-icon>mdi-timer-sand</v-icon style="text-align: align-center"> Round  {{ roundTimer }}</span>
          <v-divider vertical v-if="$vuetify.display.mdAndUp" color="white"></v-divider>
          <span class="text-subtitle-2" style="text-align: align-center"><v-icon>mdi-timer</v-icon style="text-align: align-center"> Total  {{ overallTimer }}</span>

        </v-card>

        <v-card class="mb-6" height="350px" :style="{ width: $vuetify.display.mdAndUp ? '450px' : '280px',
                                                          height: $vuetify.display.mdAndUp ? '280px' : '350px'
         }" :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-2'" elevation="2" color="grey-lighten-4">
          <v-card-title class="text-h5 text-center text-primary">Verb</v-card-title>
          <v-card-text class="text-center">
            <div v-if="$vuetify.display.mdAndUp" class="text-h2 font-weight-bold mb-6">{{ currentPrompt.verb }}</div>
            <div v-else="$vuetify.display.mdAndUp" class="text-h4 font-weight-bold mb-6">{{ currentPrompt.verb }}</div>
            
            <v-row justify="center" align="center">
              <v-col cols="12" md="4">
                <div class="text-subtitle-2 text-grey-darken-1">Person</div>
                <div class="text-body-1">{{ currentPrompt.person }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-subtitle-2 text-grey-darken-1">Sentence Type</div>
                <div class="text-body-1">{{ currentPrompt.sentenceType }}</div>
              </v-col>
              <v-col v-if="$vuetify.display.smAndUp" cols="12" md="4">
                <div class="text-subtitle-2 text-grey-darken-1">{{ displayedTenseHeader }}</div>
                <v-tooltip :text="currentPrompt.tense" location="right" :disabled="!showKeyword">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props" class="text-body-1 text-center">
                      {{ randomTenseDisplay }}
                    </div>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col v-else cols="12" md="4">
                <div class="d-flex flex-column align-center">
                  <div class="d-flex align-center justify-center mb-2" style="gap: 25px;">
                    <div class="text-subtitle-2 text-grey-darken-1">{{ displayedTenseHeader }}</div>
                    <v-switch
                      v-model="showKeyword"
                      density="compact"
                      hide-details
                      class="ma-0 pa-0"
                      style="margin-bottom: -4px;"
                    />
                  </div>
                  <div class="text-body-1 text-center">{{ randomTenseDisplay }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-row justify="center" align="center" class="mb-6">
          <v-col cols="12" md="8">
            <v-text-field
              v-model="userAnswer"
              @keyup.enter="submitAnswer"
              label="Answer"
              placeholder="Include person + verb"
              variant="outlined"
              density="comfortable"
            ></v-text-field>

            <!-- Submit Button -->
            <div
              class="d-flex justify-center"
              :class="$vuetify.display.xs ? 'mt-2' : 'mt-4'"
            >
              <v-btn color="primary" large @click="submitAnswer">
                {{ submitButtontext }}
              </v-btn>
            </div>
          </v-col>
        </v-row>


        <v-progress-linear
          :model-value="progressValue"
          height="10"
          color="primary"
          class="my-4"
        ></v-progress-linear>

        <v-footer class="pa-4 game-footer rounded-lg" color="grey-lighten-3" elevation="2">
          <v-row justify="center" align="center">
            <v-col cols="12" md="6">
              <div class="scoreboard d-flex justify-center align-center" :style="{ 
                                                        gap: $vuetify.display.mdAndUp ? '50px' : '15px',
                                                        height: $vuetify.display.xs ? '20px' : 'auto'
                                                        }">
                <!-- Correct -->
                <transition name="flash-green" mode="out-in">
                  <span :key="rightCount" class="text-success text-h6 text-center">✅ {{ rightCount }}</span>
                </transition>

                <!-- Incorrect -->
                <transition name="flash-red" mode="out-in">
                  <span :key="wrongCount" class="text-error text-h6 text-center">❌ {{ wrongCount }}</span>
                </transition>

                <v-divider vertical></v-divider>

                <!-- Remaining -->
                <transition name="flash-black" mode="out-in">
                  <v-tooltip text="Remaining" location="right">
                    <template #activator="{ props }">
                      <span :key="remainingCount" class="text-black text-h6 text-center" v-bind="props">
                        <v-icon color="black">mdi-tray-full</v-icon> {{ remainingCount }}
                      </span>
                    </template>
                  </v-tooltip>
                </transition>

                <!-- Completed -->
                <transition name="flash-black" mode="out-in">
                  <v-tooltip text="Completed" location="right">
                    <template #activator="{ props }">
                      <span :key="promptCounter" class="text-black text-h6 text-center" v-bind="props">
                        <v-icon color="black">mdi-archive-check</v-icon> {{ promptCounter }}
                      </span>
                    </template>
                  </v-tooltip>
                </transition>
              </div>
            </v-col>
          </v-row>

        </v-footer>
        <div v-if="$vuetify.display.xs" class="d-flex justify-center mt-6">
          <v-btn icon elevation="1" large @click="goBack">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
        </div>
      </div>
    </v-container>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="2500"
      location="top"
      elevation="4"
    >
      {{ snackbar.message }}
    </v-snackbar>


    <!-- Blocking dialog while loading -->
    <v-dialog v-model="showBlockingDialog" persistent fullscreen transition="fade-transition">
      <v-card class="d-flex align-center justify-center" color="transparent" elevation="0">
        <v-progress-circular indeterminate color="primary" size="64" />
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

// ---------------- props / emits ----------------
type GameSettings = {
  verbSet: string;
  sentenceTypes: string[];
  tenses: string[];
  numPrompts: number;
  smartVerbPool: any; // SmartVerbPoolByTense | null (kept as any to match existing code)
  isSmart: boolean;
};

const props = defineProps<{
  gameSettings: GameSettings;
}>();

const emit = defineEmits<{
  (e: "changeScene", scene: string): void;
  (e: "gameOver", payload: any): void;
}>();

// ---------------- store ----------------
const userStore = useUserStore();

// ---------------- state ----------------
const userName = ref("Player");
const game = shallowRef<any>(null);

const gameStarted = ref(false);

// ✅ local clone instead of mutating props
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

// results are an array in your Game class; keep flexible
const results = ref<any[]>([]);

const startTime = ref<number | null>(null);
const roundStartTime = ref<number | null>(null);

let timerInterval: ReturnType<typeof window.setInterval> | null = null;
let roundIntervalId: ReturnType<typeof window.setInterval> | null = null;

const showBlockingDialog = ref(false);

const snackbar = reactive({
  show: false,
  message: "",
  color: "success",
});

const showKeyword = ref(true);
const randomTenseDisplay = ref("");

const keywords = ref<Record<string, string[]>>({});

// ---------------- helpers ----------------
function deepClone<T>(obj: T): T {
  const raw = isProxy(obj as any) ? (toRaw(obj as any) as any) : (obj as any);
  // Also ensure nested arrays/objects are raw:
  return JSON.parse(JSON.stringify(raw));
}

function mapUiVerbSetToApiVerbSet(ui: string): string {
  // must match backend expectation: "Basic 75" | "Master 110" | "All Irregular"
  if (ui === "Basic 75 Irregs") return "Basic 75";
  if (ui === "Master 110 Irregs") return "Master 110";
  if (ui === "Shakespeare 130 Irregs") return "All Irregular";
  if (ui === "GOAT 50 Hard Irregs Only") return "All Irregular";
  return "All Irregular";
}

function isIrregularSmartCapable(ui: string) {
  return (
    ui === "Basic 75 Irregs" ||
    ui === "Master 110 Irregs" ||
    ui === "Shakespeare 130 Irregs" ||
    ui === "GOAT 50 Hard Irregs Only"
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ---------------- computed ----------------
const progressValue = computed(() => {
  const total = localGameSettings.value?.numPrompts ?? props.gameSettings.numPrompts ?? 0;
  if (!total) return 0;
  return (promptCounter.value / total) * 100;
});

const isAuthenticated = computed(() => !!getAccessToken());

const displayedTenseHeader = computed(() => (showKeyword.value ? "Time reference" : "Tense"));

const isSmartList = computed(() => {
  const settings = localGameSettings.value;
  if (!settings) return false;

  if (!isIrregularSmartCapable(settings.verbSet)) return false;

  const pool = settings.smartVerbPool;
  if (!pool || typeof pool !== "object") return false;

  const ps = Array.isArray(pool["Past simple"]) ? pool["Past simple"] : [];
  const pp = Array.isArray(pool["Present perfect"]) ? pool["Present perfect"] : [];
  return ps.length > 0 || pp.length > 0;
});

// ---------------- API / loading ----------------
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
  if (!showKeyword.value) {
    randomTenseDisplay.value = currentPrompt.tense;
    return;
  }

  const tenseKey = currentPrompt.tense.toLowerCase().replace(/\s/g, "_");
  const options = keywords.value[tenseKey];

  if (Array.isArray(options) && options.length > 0) {
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * options.length);
    } while (options.length > 1 && options[randomIndex] === randomTenseDisplay.value);

    randomTenseDisplay.value = options[randomIndex];
  } else {
    randomTenseDisplay.value = currentPrompt.tense;
  }
}

function updatePrompt() {
  const prompt = game.value?.getCurrentPrompt?.();
  if (!prompt) return;

  currentPrompt.person = prompt.getPerson();
  currentPrompt.verb = prompt.getVerb();
  currentPrompt.tense = prompt.getTense();
  currentPrompt.sentenceType = prompt.getSentenceType();

  updateRandomTense();

  // ✅ Only run the per-round timer while actually playing
  if (gameStarted.value) startRoundTimer();
}

// ---------------- timers ----------------
function updateTimers() {
  if (!startTime.value) return;
  const now = Date.now();
  const elapsed = Math.floor((now - startTime.value) / 1000);
  overallTimer.value = formatTime(elapsed);
}

function startOverallTimer() {
  stopOverallTimer();
  timerInterval = window.setInterval(updateTimers, 1000);
}

function stopOverallTimer() {
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startRoundTimer() {
  roundStartTime.value = Date.now();
  if (roundIntervalId) window.clearInterval(roundIntervalId);

  roundIntervalId = window.setInterval(() => {
    if (!roundStartTime.value) return;
    const now = Date.now();
    const elapsed = Math.floor((now - roundStartTime.value) / 1000);
    roundTimer.value = formatTime(elapsed);
  }, 1000);
}

function endRoundTimer() {
  if (roundIntervalId) {
    window.clearInterval(roundIntervalId);
    roundIntervalId = null;
  }
}

// ---------------- lifecycle ----------------
onMounted(async () => {
  await loadTenseKeywords();

  // ✅ Build local settings (safe to mutate)
  const baseSettings = deepClone(props.gameSettings);

  // ✅ New smart pool source (per-tense)
  // Only fetch for irregular verb sets; otherwise leave null (fallback will work in ConjugationSet)
  if (isIrregularSmartCapable(baseSettings.verbSet)) {
    const apiVerbSet = mapUiVerbSetToApiVerbSet(baseSettings.verbSet);

    // ask server for a pool sized to this game
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

  // ✅ Create game instance
  game.value = markRaw(new Game(localGameSettings.value));


  // ✅ Preload prompts so the pre-game screen can immediately show the first prompt when user clicks Start,
  // without a flash / delay. This does NOT start timers or advance the gameStarted state.
  await game.value.start();

  // Pre-fill currentPrompt for display (safe even before start)
  updatePrompt();
});

onBeforeUnmount(() => {
  stopOverallTimer();
  endRoundTimer();
});

// ---------------- UI actions ----------------
function goBack() {
  emit("changeScene", "Scene02_Settings");
}

function quitGame() {
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
  startRoundTimer();
  updatePrompt();
}

async function endGame() {
  showBlockingDialog.value = true;

  results.value = game.value?.getResults?.() ?? [];

  const totalRounds = results.value.length || (localGameSettings.value?.numPrompts ?? 0) || 1;

  const avgTime =
    startTime.value != null
      ? ((Date.now() - startTime.value) / 1000 / totalRounds).toFixed(1)
      : "0.0";

  const rounds = results.value.map((r: any, index: number) => ({
    prompt_number: index + 1,
    person: r.prompt.person,
    verb: r.prompt.verb,
    tense: r.prompt.tense,
    sentence_type: r.prompt.sentenceType,
    user_answer: r.userAnswer,
    is_correct: !!r.correct,
    acceptable_answers: Array.isArray(r.correctAnswers) ? r.correctAnswers : [],
    elapsed_time: parseFloat(r.elapsedTime ?? 0),
  }));

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
    await api.post("/conj-game-sessions/", payload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Conj game submit failed.");
    console.error("Status:", error?.response?.status);
    console.error("Response data:", error?.response?.data);
  }

  // UI wrap-up
  setTimeout(() => {
    showBlockingDialog.value = false;
    emit("gameOver", payload);
    stopOverallTimer();
    endRoundTimer();
  }, 600);
}

async function submitAnswer() {
  if (!gameStarted.value || !game.value) return;

  const now = Date.now();
  const elapsedMs = roundStartTime.value ? now - roundStartTime.value : 0;
  const elapsedSecondsDecimal = (elapsedMs / 1000).toFixed(1);

  // attach elapsed time to current prompt object (your existing design)
  const realPrompt = game.value.getCurrentPrompt?.();
  if (realPrompt) realPrompt.elapsedTime = elapsedSecondsDecimal;

  const isCorrect = game.value.submitAnswer(userAnswer.value);

  snackbar.message = isCorrect
    ? `Yes! "${userAnswer.value}" is correct!`
    : `Sorry, "${userAnswer.value}" is wrong!`;
  snackbar.color = isCorrect ? "success" : "warning";
  snackbar.show = false;
  await nextTick();
  snackbar.show = true;

  // sync counts from Game
  rightCount.value = game.value.getRightCount?.() ?? rightCount.value;
  wrongCount.value = game.value.getWrongCount?.() ?? wrongCount.value;

  promptCounter.value += 1;
  remainingCount.value = Math.max(0, remainingCount.value - 1);

  userAnswer.value = "";
  endRoundTimer();

  if (remainingCount.value === 1) submitButtontext.value = "FINISH";

  if (remainingCount.value === 0) {
    await endGame();
    return;
  }

  // advance
  game.value.nextPrompt();
  updatePrompt();
  startRoundTimer();
}
</script>



<style scoped>
.scoreboard {
  gap: 24px;
}

.text-black {
  color: #000;
}


</style>
