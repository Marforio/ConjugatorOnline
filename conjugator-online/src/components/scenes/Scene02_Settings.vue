<template>
  <!-- Main layout backdrop matching your unified platform canvas -->
  <v-sheet class="bg-white min-height-view pa-4 pa-md-6 text-slate-800">
    
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
            <p class="text-caption text-slate-500 mb-4">Jump straight into a predefined gameplay package</p>

            <v-row dense>
              <!-- 🖥️ DESKTOP QUICK PLAY LOOP MODIFICATION -->
                <v-col cols="12" sm="6" v-for="(btn, index) in quickPlayButtons" :key="btn.label">
                  <v-btn
                    block
                    variant="tonal"
                    :color="colors[index % colors.length]"
                    height="44"
                    class="quick-pill-btn rounded-lg text-none font-weight-bold text-wrap"
                    @click="startGame(btn.settings)"
                  >
                    <span class="text-truncate px-1" :title="btn.label">{{ btn.label }}</span>
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
            <p class="text-caption text-slate-500 mb-4">Tailor targeted configuration properties manually</p>

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
              @click="() => startGame(selections)"
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

      <v-expansion-panels accordion variant="separated" class="sleek-panels">
        <!-- Panel Block A: Quick Play -->
        <v-expansion-panel class="border mb-2 rounded-xl overflow-hidden" elevation="0">
          <v-expansion-panel-title class="bg-slate-50 font-weight-bold text-slate-800 py-3">
            <v-icon color="primary" class="mr-2" size="18">mdi-lightning-bolt</v-icon> Quick Play Options
          </v-expansion-panel-title>
          <v-expansion-panel-text class="pa-2">
            <v-row dense>
              <!-- 📱 MOBILE QUICK PLAY LOOP MODIFICATION -->
              <v-col v-for="(btn, index) in quickPlayButtons" :key="btn.label" cols="6">
                <v-btn
                  block
                  variant="tonal"
                  :color="colors[index % colors.length]"
                  height="40"
                  class="quick-pill-btn rounded-lg text-none font-weight-bold text-wrap"
                  @click="startGame(btn.settings)"
                >
                  <span class="text-truncate text-caption px-1" :title="btn.label">{{ btn.label }}</span>
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
                :disabled="!optionsLoaded || selectedTenses.length === 0 || selectedSentenceTypes.length === 0" 
                @click="() => startGame(selections)"
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

<script>
export default {
  data() {
    return {
      options: { sentence_types: [], verb_sets: [], tenses: [] },
      selectedVerbSet: '',
      selectedSentenceTypes: [],
      selectedTenses: [],
      numPrompts: 20,
      colors: ["blue lighten-2", "green darken-2", "purple lighten-2", "red lighten-3", "orange lighten-2", "brown lighten-2", "pink lighten-2", "grey darken-2"],
      optionsLoaded: false,
    };
  },
  computed: {
    selections() {
      return {
        verbSet: this.selectedVerbSet,
        sentenceTypes: this.selectedSentenceTypes,
        tenses: this.selectedTenses,
        numPrompts: this.numPrompts,
      };
    },
    quickPlayButtons() {
      return [
        { label: 'Present simple and continuous', color: 'magenta lighten-2', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Present simple', 'Present continuous'], numPrompts: 20 } },
        { label: 'Past simple training', color: 'info', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Past simple'], numPrompts: 20 } },
        { label: 'Irregs Basic 20x past simple', color: 'blue lighten-2', settings: { verbSet: 'Basic 75 Irregs', sentenceTypes: ['Positive'], tenses: ['Past simple'], numPrompts: 20 } },
        { label: 'Irregs Basic 20x pres. perf.', color: 'brown lighten-2', settings: { verbSet: 'Basic 75 Irregs', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Present perfect'], numPrompts: 20 } },
        { label: 'Irregs Master 20x past simple', color: 'green lighten-2', settings: { verbSet: 'Master 110 Irregs', sentenceTypes: ['Positive'], tenses: ['Past simple'], numPrompts: 20 } },
        { label: 'Irregs Master 20x pres. perf.', color: 'red lighten-2', settings: { verbSet: 'Master 110 Irregs', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Present perfect'], numPrompts: 20 } },
        { label: 'Past simple vs present perfect', color: 'pink', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Past simple', 'Present perfect'], numPrompts: 20 } },
        { label: 'All tenses and sentences', color: 'green', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 25 } },
        { label: 'Negatives training', color: 'error', settings: { verbSet: 'Regular verbs only', sentenceTypes: ['Negative'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 20 } },
        { label: 'Questions training', color: 'grey', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Questions'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 20 } },
      ];
    },
  },
  async created() {
    try {
      const res = await fetch('/data/set_options.json');
      const opts = await res.json();
      this.options = opts;
      this.selectedVerbSet = opts.verb_sets[0];
      this.selectedSentenceTypes = [];
      this.selectedTenses = [];
      this.optionsLoaded = true;
    } catch (e) {
      console.error('Error loading options:', e);
    }
  },
  methods: {
    goToScene(name) { this.$emit('changeScene', name); },
    startGame(settings = null) {
      const selections = settings || this.selections;
      this.$emit('startGame', selections);
      this.goToScene('Scene03_Game');
    },
    validateNumPrompts() {
      if (this.numPrompts < 3) this.numPrompts = 3;
      if (this.numPrompts > 50) this.numPrompts = 50;
    },
  }
}
</script>

<style scoped>
.min-height-view {
  min-height: 100vh;
}

.max-width-wrapper {
  max-width: 1000px;
}

/* ==========================================
   ⚡ COMPACT QUICK PLAY BUTTON PILLS (HALF HEIGHT)
   ========================================== */
.quick-pill-btn {
  /* Reduced height by 50% to make the setup screen tighter and sleeker */
  height: 80px !important; 
  background-color: rgba(59, 130, 246, 0.05) !important;
  border: 1px solid rgba(59, 130, 246, 0.12) !important;
  font-size: 0.8rem !important;
  letter-spacing: 0.1px !important;
  text-transform: none !important;
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.quick-pill-btn:hover {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
  border-color: #3b82f6 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -4px rgba(59, 130, 246, 0.3) !important;
}

/* Micro sizing setups preventing option layouts from spilling vertical space */
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

/* Unified theme color palettes */
.text-slate-900 { color: #0f172a; }
.text-slate-800 { color: #1e293b; }
.text-slate-500 { color: #64748b; }
.text-slate-400 { color: #94a3b8; }
.bg-slate-50 { background-color: #f8fafc !important; }
</style>