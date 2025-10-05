<template>
  <v-sheet height="100vh" class="pa-6" color="grey-lighten-4">
    <!-- Large screens: side-by-side layout -->
    <v-container v-if="$vuetify.display.smAndUp">
      <div class="text-h3 mb-4">Game settings</div>
          <v-row dense>
            <!-- Quick Play Section -->
            <v-col cols="12" lg="6">
              <v-card class="pa-6" color="white" elevation="2">
                <h2 class="text-h5 mb-3">Quick Play</h2>
                <p class="text-body-1 mb-6">Choose a predefined game package</p>

                <v-row dense>
                  <v-col cols="12" sm="6" v-for="(btn, index) in quickPlayButtons" :key="btn.label">
                    <v-btn
                      block
                      :color="colors[index % colors.length]" 
                      class="quick-play-btn"
                      @click="startGame(btn.settings)"
                    >
                      <span class="text-wrap">{{ btn.label }}</span>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <!-- Custom Play Section -->
            <v-col cols="12" lg="6">
            <v-card class="pa-3" color="white" elevation="1">
              <h2 class="text-h5 mb-2">Custom Play</h2>
              <p class="text-body-1 mb-6">Define your own settings</p>

              <!-- Verb Set -->
              <v-card class="mb-2" color="grey-lighten-3" flat>
                <v-card-text class="py-2 px-3">
                  <h5 class="text-subtitle-2 mb-2">Verb set</h5>
                  <v-radio-group v-model="selectedVerbSet" row density="compact">
                    <v-radio
                      v-for="set in options.verb_sets"
                      :key="set"
                      :label="set"
                      :value="set"
                      density="compact"
                    />
                  </v-radio-group>
                </v-card-text>
              </v-card>

              <!-- Sentence Types -->
              <v-card class="mb-2" color="grey-lighten-3" flat>
                <v-card-text class="py-2 px-3">
                  <h5 class="text-subtitle-2 mb-2">Sentence types</h5>
                  <v-row dense>
                    <v-col cols="12" sm="6" md="4" v-for="type in options.sentence_types" :key="type">
                      <v-checkbox
                        v-model="selectedSentenceTypes"
                        :label="type"
                        :value="type"
                        hide-details
                        density="compact"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Tenses -->
              <v-card class="mb-2" color="grey-lighten-3" flat>
                <v-card-text class="py-2 px-3">
                  <h5 class="text-subtitle-2 mb-2">Tenses</h5>
                  <v-row dense>
                    <v-col cols="12" sm="6" md="4" v-for="tense in options.tenses" :key="tense">
                      <v-checkbox
                        v-model="selectedTenses"
                        :label="tense"
                        :value="tense"
                        hide-details
                        density="compact"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Number of Questions -->
              <v-card class="mb-2" color="grey-lighten-3" flat>
                <v-card-text class="py-2 px-3">
                  <span class="text-subtitle-2 mb-2">Number of questions</span>
                  <span><v-text-field
                    v-model.number="numPrompts"
                    type="number"
                    min="3"
                    max="50"
                    density="compact"
                    hide-details
                    class="mx-auto"
                    style="max-width: 100px"
                  /></span>
                </v-card-text>
              </v-card>

              <!-- Start Button -->
               <div class="d-flex justify-center mt-2">
                <v-tooltip
                  v-if="selectedTenses.length === 0 || selectedSentenceTypes.length === 0"
                  location="top"
                  text="Select at least 1 sentence type and 1 tense"
                >
                  <template #activator="{ props }">
                    <div v-bind="props">
                      <v-btn
                        color="success"
                        class="mt-2 mx-auto"
                        style="max-width: 300px; pointer-events: none; opacity: 0.6;"
                      >
                        Confirm custom settings
                      </v-btn>
                    </div>
                  </template>
                </v-tooltip>

                <!-- Fallback when button is enabled -->
                <v-btn
                  v-else
                  color="success"
                  class="mt-2 mx-auto"
                  style="max-width: 300px;"
                  @click="() => startGame(selections)"
                >
                  Confirm custom settings
                </v-btn>
              </div>

            </v-card>
          </v-col>

          </v-row>
          <div class="d-flex justify-center mt-6">
        <v-btn icon elevation="0" size="large" @click="goToScene('Scene01_Landing')">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
    </v-container>
    

    <!-- Mid and lower screens: expansion panels -->
    <v-container v-else>
      <div class="text-h4 mb-4">Game settings</div>

      <v-expansion-panels accordion class="m-2">
        <!-- Quick Play -->
        <v-expansion-panel>
          <v-expansion-panel-title class="text-subtitle-2">Quick Play</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row dense>
              <v-col
                cols="6"
                xs="6"
                sm="6"
                v-for="(btn, index) in quickPlayButtons"
                :key="btn.label"
              >
                <v-btn
                  block
                  :color="colors[index % colors.length]" 
                  class="quick-btn"
                  @click="startGame(btn.settings)"
                >
                  <div class="btn-label">
                    {{ btn.label }}
                  </div>
                </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <!-- Custom Play -->
        <v-expansion-panel>
          <v-expansion-panel-title class="text-subtitle-2">Custom Play</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="selectedVerbSet"
                  :items="options.verb_sets"
                  label="Verb set"
                  density="compact"
                  variant="outlined"
                  hide-details
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="selectedSentenceTypes"
                  :items=options.sentence_types
                  label="Sentence types"
                  hide-details
                  variant="outlined"
                  density="compact"
                  multiple
                />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="selectedTenses"
                  :items=options.tenses
                  label="Tenses"
                  hide-details
                  density="compact"
                  variant="outlined"
                  multiple
                />
              </v-col>
            </v-row>

            <v-row justify="start" class="mt-1">
              <v-col cols="6">
                <v-text-field
                  v-model.number="numPrompts"
                  type="number"
                  min="3"
                  max="50"
                  label="Questions"
                  density="compact"
                  hide-details
                  style="max-width: 180px"
                />
              </v-col>
            </v-row>

            <v-btn block color="success" class="mt-4" :disabled="!optionsLoaded" @click="() => startGame(selections)">
              Confirm settings
            </v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Back Button -->
      <div class="d-flex justify-center mt-6">
        <v-btn icon elevation="0" size="large" @click="goToScene('Scene01_Landing')">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
      </div>
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
      numPrompts: 10,
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
        { label: 'Negatives training', color: 'error', settings: { verbSet: 'Regular verbs only', sentenceTypes: ['Negative'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 20 } },
        { label: 'Questions training', color: 'grey', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Questions'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 20 } },
        { label: 'Present simple and continuous', color: 'magenta lighten-2', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Present simple', 'Present continuous'], numPrompts: 20 } },
        { label: 'Past simple training', color: 'info', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Past simple'], numPrompts: 20 } },
        { label: 'Irregs Basic 20x past simple', color: 'blue lighten-2', settings: { verbSet: 'Basic 75 Irregs', sentenceTypes: ['Positive'], tenses: ['Past simple'], numPrompts: 20 } },
        { label: 'Irregs Basic 20x pres. perf.', color: 'brown lighten-2', settings: { verbSet: 'Basic 75 Irregs', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Present perfect'], numPrompts: 20 } },
        { label: 'Irregs Master 20x past simple', color: 'green lighten-2', settings: { verbSet: 'Master 110 Irregs', sentenceTypes: ['Positive'], tenses: ['Past simple'], numPrompts: 20 } },
        { label: 'Irregs Master 20x pres. perf.', color: 'red lighten-2', settings: { verbSet: 'Master 110 Irregs', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Present perfect'], numPrompts: 20 } },
        { label: 'Past simple vs present perfect', color: 'pink', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Past simple', 'Present perfect'], numPrompts: 20 } },
        { label: 'All tenses and sentences', color: 'green', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 25 } },
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
  },
};
</script>

<style scoped>
.quick-play-btn {
  height: 100px;
  max-width: 100px;
  white-space: normal;
  text-align: center;
  font-size: 0.8rem;
  line-height: 1.1;
}
.quick-btn {
  height: auto;
  min-height: 90px;
  max-width: 100%;
  text-align: center;
  padding: 8px;
}

.quick-btn .btn-label {
  white-space: normal;
  word-break: break-word;
  font-size: 0.75rem;
  line-height: 1.2;
  display: block;
}

.v-expansion-panel-title {
  font-size: 0.9rem;
}
.v-expansion-panel-text {
  font-size: 0.8rem;
}


</style>
