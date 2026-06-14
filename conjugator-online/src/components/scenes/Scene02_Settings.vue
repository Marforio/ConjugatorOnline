<template>
  <v-sheet class="bg-white min-height-view pa-4 pa-md-6 text-slate-800">
    
    <!-- Error Alert -->
    <v-alert
      v-if="startGameError"
      type="error"
      variant="tonal"
      closable
      class="rounded-xl mb-4"
      @click:close="startGameError = null"
    >
      <div class="font-weight-bold">Failed to Start Game</div>
      <div class="text-caption mt-1">{{ startGameError }}</div>
    </v-alert>

    <!-- Loading Overlay -->
    <v-overlay v-model="isStartingGame" class="align-center justify-center">
      <v-card class="pa-6 rounded-xl" flat>
        <div class="text-center">
          <v-progress-circular indeterminate color="primary" size="48" class="mb-4"></v-progress-circular>
          <div class="text-body-2 font-weight-bold text-slate-800">Starting Game...</div>
          <div class="text-caption text-slate-500 mt-1">Connecting to game server</div>
        </div>
      </v-card>
    </v-overlay>

    <!-- 🖥️ DESKTOP & TABLET PROFILE VIEWPORT (smAndUp) -->
    <v-container v-if="$vuetify.display.smAndUp" class="pa-0 max-width-wrapper">
      <div class="d-flex align-center mb-4">
        <v-btn icon="mdi-arrow-left" variant="text" color="slate-600" class="mr-2" @click="goToScene('Scene01_Landing')" />
        <h1 class="text-h5 font-weight-black tracking-tight text-slate-900">Game Setup</h1>
      </div>

      <v-row class="ga-0">
        <!-- ⚡ Left Side: Quick Play Grid -->
        <v-col cols="12" md="6" class="pr-md-4">
          <div class="border rounded-xl pa-4 bg-slate-50 h-100">
            <div class="d-flex align-center mb-1">
              <v-icon color="primary" size="18" class="mr-2">mdi-lightning-bolt</v-icon>
              <h2 class="text-subtitle-1 font-weight-black text-slate-900">Quick Play</h2>
            </div>
            <p class="text-caption text-slate-500 mb-4">Jump straight into a predefined game</p>

            <v-row dense>
              <v-col cols="12" sm="6" v-for="(btn, index) in quickPlayButtons" :key="btn.label">
                <v-btn
                  block
                  variant="tonal"
                  :color="colors[index % colors.length]"
                  height="44"
                  class="quick-pill-btn rounded-lg text-none font-weight-bold"
                  :disabled="isStartingGame"
                  @click="handleStartGame(btn.settings)"
                >
                  <span class="text-wrap px-1" :title="btn.label">{{ btn.label }}</span>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <!-- ⚙️ Right Side: Custom Formula Matrix -->
        <v-col cols="12" md="6" class="pl-md-4 mt-6 mt-md-0">
          <div class="border rounded-xl pa-4 h-100 d-flex flex-column">
            <div class="d-flex align-center mb-1">
              <v-icon color="slate-600" size="18" class="mr-2">mdi-tune-variant</v-icon>
              <h2 class="text-subtitle-1 font-weight-black text-slate-900">Custom Settings</h2>
            </div>
            <p class="text-caption text-slate-500 mb-2">Design your own game</p>

            <!-- Parameters Module A: Verb Set -->
            <div class="mb-4">
              <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-1">1. Verb Set</div>
              <v-radio-group v-model="selectedVerbSet" density="compact" hide-details class="ma-0 pa-0">
                <v-row dense class="bg-slate-50 rounded-lg pa-1 border mx-0">
                  <v-col v-for="set in options.verb_sets" :key="set" cols="6">
                    <v-radio :label="set" :value="set" density="compact" color="primary" class="compact-radio" />
                  </v-col>
                </v-row>
              </v-radio-group>
            </div>

            <!-- Parameters Module B: Sentence Constraints -->
            <div class="mb-4">
              <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-1">2. Sentence Types</div>
              <div class="bg-slate-50 rounded-lg pa-2 border">
                <v-row dense>
                  <v-col v-for="type in options.sentence_types" :key="type" cols="6" sm="4">
                    <v-checkbox v-model="selectedSentenceTypes" :label="type" :value="type" hide-details density="compact" color="primary" class="compact-checkbox" />
                  </v-col>
                </v-row>
              </div>
            </div>

            <!-- Parameters Module C: Grammatical Tenses -->
            <div class="mb-4">
              <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-1">3. Tenses</div>
              <div class="bg-slate-50 rounded-lg pa-2 border">
                <v-row dense>
                  <v-col v-for="tense in options.tenses" :key="tense" cols="6" sm="4">
                    <v-checkbox v-model="selectedTenses" :label="tense" :value="tense" hide-details density="compact" color="primary" class="compact-checkbox" />
                  </v-col>
                </v-row>
              </div>
            </div>

            <!-- Parameters Module D: Size Boundaries -->
            <div class="mb-6 mt-auto">
              <div class="text-overline font-weight-bold text-slate-400 tracking-wider mb-1 d-flex justify-space-between">
                <span>4. Workout Length</span>
                <span class="text-primary font-weight-black text-lowercase">{{ numPrompts }} items</span>
              </div>
              <div class="bg-slate-50 rounded-lg px-4 py-2 border d-flex align-center">
                <v-slider
                  v-model.number="numPrompts"
                  @change="validateNumPrompts"
                  :min="5"
                  :max="50"
                  step="5"
                  density="compact"
                  hide-details
                  color="primary"
                  track-color="slate-200"
                  class="flex-grow-1"
                />
              </div>
            </div>

            <!-- Validation Submission Runway -->
            <v-tooltip
              v-if="selectedTenses.length === 0 || selectedSentenceTypes.length === 0"
              location="top"
              text="Select at least 1 sentence type and 1 tense"
            >
              <template v-slot:activator="{ props: tipProps }">
                <div v-bind="tipProps" class="w-100">
                  <v-btn block disabled height="44" class="rounded-xl text-none font-weight-bold">
                    Confirm Custom Settings
                  </v-btn>
                </div>
              </template>
            </v-tooltip>

            <v-btn
              v-else
              block
              color="primary"
              height="44"
              class="rounded-xl text-none font-weight-bold elevation-1"
              :disabled="isStartingGame"
              @click="handleStartGame(selections)"
            >
              Confirm Custom Formula
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- 📱 COMPACT MOBILE PHONE PROFILE VIEWPORT (xs / fallback) -->
    <v-container v-else class="pa-0">
      <div class="d-flex align-center mb-4">
        <v-btn icon="mdi-arrow-left" variant="text" color="slate-600" class="mr-1" @click="goToScene('Scene01_Landing')" />
        <h1 class="text-subtitle-1 font-weight-black text-slate-900">Game Setup</h1>
      </div>

      <v-expansion-panels accordion variant="accordion" class="sleek-panels">
        <!-- Panel Block A: Quick Play -->
        <v-expansion-panel class="border mb-2 rounded-xl overflow-hidden" elevation="0">
          <v-expansion-panel-title class="bg-slate-50 font-weight-bold text-slate-800 py-3">
            <v-icon color="primary" class="mr-2" size="18">mdi-lightning-bolt</v-icon> Quick Play Options
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-2">
            <v-row dense>
              <v-col v-for="(btn, index) in quickPlayButtons" :key="btn.label" cols="6">
                <v-btn
                  block
                  variant="tonal"
                  :color="colors[index % colors.length]"
                  height="40"
                  class="quick-pill-btn rounded-lg text-none font-weight-bold"
                  :disabled="isStartingGame"
                  @click="handleStartGame(btn.settings)"
                >
                  <span class="text-wrap text-caption px-1" :title="btn.label">{{ btn.label }}</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Panel Block B: Custom Tuning Selectors -->
        <v-expansion-panel class="border rounded-xl overflow-hidden" elevation="0">
          <v-expansion-panel-title class="bg-slate-50 font-weight-bold text-slate-800 py-3">
            <v-icon color="slate-600" class="mr-2" size="18">mdi-tune-variant</v-icon>
            Custom settings
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pt-3 px-1">
            <div class="space-stack d-flex flex-column ga-3">
              <v-select
                v-model="selectedVerbSet"
                :items="options.verb_sets"
                label="1. Verb set dataset"
                density="compact"
                variant="outlined"
                color="primary"
                hide-details
                class="rounded-lg"
              />
              <v-select
                v-model="selectedSentenceTypes"
                :items="options.sentence_types"
                label="2. Sentence syntax styles"
                multiple
                density="compact"
                variant="outlined"
                color="primary"
                hide-details
                class="rounded-lg"
              />
              <v-select
                v-model="selectedTenses"
                :items="options.tenses"
                label="3. Grammatical tenses"
                multiple
                density="compact"
                variant="outlined"
                color="primary"
                hide-details
                class="rounded-lg"
              />
              
              <div class="border rounded-lg pa-3 bg-slate-50 mt-1">
                <div class="text-caption font-weight-bold text-slate-500 mb-1 d-flex justify-space-between">
                  <span>Questions limit:</span>
                  <span class="text-primary font-weight-bold">{{ numPrompts }} total</span>
                </div>
                <v-text-field
                  v-model.number="numPrompts"
                  @change="validateNumPrompts"
                  type="number"
                  min="5"
                  max="50"
                  density="compact"
                  variant="plain"
                  hide-details
                  class="text-body-2 font-weight-bold mx-1"
                />
              </div>

              <v-btn 
                block 
                color="success" 
                height="44"
                class="mt-2 rounded-xl text-none font-weight-bold" 
                :disabled="!optionsLoaded || selectedTenses.length === 0 || selectedSentenceTypes.length === 0 || isStartingGame" 
                @click="handleStartGame(selections)"
              >
                Launch Custom Lab
              </v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const colors = ["blue lighten-2", "green darken-2", "purple lighten-2", "red lighten-3", "orange lighten-2", "brown lighten-2", "pink lighten-2", "grey darken-2"];

interface GameOptions {
  sentence_types: string[];
  verb_sets: string[];
  tenses: string[];
}

const options = ref<GameOptions>({ 
  sentence_types: [], 
  verb_sets: [], 
  tenses: [] 
});

const selectedVerbSet = ref<string>('');
const selectedSentenceTypes = ref<string[]>([]);
const selectedTenses = ref<string[]>([]);
const numPrompts = ref<number>(20);
const optionsLoaded = ref<boolean>(false);
const isStartingGame = ref<boolean>(false);
const startGameError = ref<string | null>(null);


const emit = defineEmits<{
  (e: "changeScene", scene: string): void;
  (e: "startGame", settings: any): void;
}>();

const selections = computed(() => ({
  verbSet: selectedVerbSet.value,
  sentenceTypes: selectedSentenceTypes.value,
  tenses: selectedTenses.value,
  numPrompts: numPrompts.value,
}));

const quickPlayButtons = computed(() => [
  { label: 'Present simple and continuous', color: 'magenta lighten-2', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Question'], tenses: ['Present simple', 'Present continuous'], numPrompts: 20 } },
  { label: 'Past simple training', color: 'info', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Question'], tenses: ['Past simple'], numPrompts: 20 } },
  { label: 'Irregs Basic 20x past simple', color: 'blue lighten-2', settings: { verbSet: 'Basic 75 Irregs', sentenceTypes: ['Positive'], tenses: ['Past simple'], numPrompts: 20 } },
  { label: 'Irregs Basic 20x pres. perf.', color: 'brown lighten-2', settings: { verbSet: 'Basic 75 Irregs', sentenceTypes: ['Positive', 'Negative', 'Question'], tenses: ['Present perfect'], numPrompts: 20 } },
  { label: 'Irregs Master 20x past simple', color: 'green lighten-2', settings: { verbSet: 'Master 110 Irregs', sentenceTypes: ['Positive'], tenses: ['Past simple'], numPrompts: 20 } },
  { label: 'Irregs Master 20x pres. perf.', color: 'red lighten-2', settings: { verbSet: 'Master 110 Irregs', sentenceTypes: ['Positive', 'Negative', 'Question'], tenses: ['Present perfect'], numPrompts: 20 } },
  { label: 'Past simple vs present perfect', color: 'pink', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Question'], tenses: ['Past simple', 'Present perfect'], numPrompts: 20 } },
  { label: 'All tenses and sentences', color: 'green', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Question'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 25 } },
  { label: 'Negatives training', color: 'error', settings: { verbSet: 'Regular verbs only', sentenceTypes: ['Negative'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 20 } },
  { label: 'Questions training', color: 'grey', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Question'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 20 } },
]);

function goToScene(name: string) {
  emit('changeScene', name);
}

async function handleStartGame(settings: any) {
  isStartingGame.value = true;
  startGameError.value = null;

  try {
    emit('startGame', settings);
    // Parent (SceneManager) handles the actual start
    // If it fails, parent will show error - we just track loading state
  } catch (error: any) {
    startGameError.value = error.message || 'Failed to start game. Please try again.';
    isStartingGame.value = false;
  }
}

function validateNumPrompts() {
  if (numPrompts.value < 5) numPrompts.value = 5;
  if (numPrompts.value > 50) numPrompts.value = 50;
}

onMounted(async () => {
  try {
    const res = await fetch('/data/set_options.json');
    const opts = await res.json();
    options.value = opts;
    selectedVerbSet.value = opts.verb_sets[0];
    selectedSentenceTypes.value = [];
    selectedTenses.value = [];
    optionsLoaded.value = true;
  } catch (e) {
    console.error('Error loading options:', e);
  }
});
</script>

<style scoped>
.min-height-view {
  min-height: 100vh;
}

.max-width-wrapper {
  max-width: 1000px;
}

.quick-pill-btn {
  height: 80px !important; 
  background-color: rgba(59, 130, 246, 0.05) !important;
  border: 1px solid rgba(59, 130, 246, 0.12) !important;
  font-size: 0.8rem !important;
  letter-spacing: 0.1px !important;
  text-transform: none !important;
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.quick-pill-btn:hover:not(:disabled) {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
  border-color: #3b82f6 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -4px rgba(59, 130, 246, 0.3) !important;
}

.compact-radio :deep(.v-selection-control) {
  min-height: 28px !important;
}
.compact-radio :deep(.v-label) {
  font-size: 0.75rem !important;
  color: #334155;
}

.compact-checkbox :deep(.v-selection-control) {
  min-height: 28px !important;
}
.compact-checkbox :deep(.v-label) {
  font-size: 0.75rem !important;
  color: #334155;
}

.sleek-panels :deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 12px !important;
}

.space-stack {
  gap: 10px !important;
}

.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc !important; }
</style>