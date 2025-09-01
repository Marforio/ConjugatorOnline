<template>
  <v-sheet height="100vh" class="pa-6" color="grey-lighten-4">
    <!-- Large screens: side-by-side layout -->
    <v-row v-if="$vuetify.display.lgAndUp" dense>
      <!-- Quick Play Section -->
      <v-col cols="12" lg="6">
        <v-card class="pa-6" color="white" elevation="2">
          <h2 class="text-h5 mb-3">Quick Play</h2>
          <p class="text-body-1 mb-6">Choose a predefined game package</p>

          <v-row dense>
            <v-col cols="12" sm="6" v-for="btn in quickPlayButtons" :key="btn.label">
              <v-btn
                block
                :color="btn.color"
                class="quick-play-btn"
                @click="startGame(btn.settings)"
              >
                {{ btn.label }}
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
        <v-btn block color="primary" :disabled="!optionsLoaded" class="mt-2" @click="() => startGame(selections)">
          Start with custom settings
        </v-btn>
      </v-card>
    </v-col>

    </v-row>

    <!-- Mid and lower screens: expansion panels -->
    <v-container v-else>
      <div class="text-h4 mb-4">Game settings</div>

      <v-expansion-panels accordion class="m-2">
        <!-- Quick Play -->
        <v-expansion-panel>
          <v-expansion-panel-title class="text-subtitle-2">Quick Play</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row dense>
              <v-col cols="6" xs="6" sm="6" v-for="btn in quickPlayButtons" :key="btn.label">
                <v-btn
                  block
                  color="primary"
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
                <div class="text-caption font-weight-medium mb-1">Choose Verb Set</div>
                <v-radio-group v-model="selectedVerbSet" row density="compact">
                  <v-radio
                    v-for="set in options.verb_sets"
                    :key="set"
                    :label="set"
                    :value="set"
                    density="compact"
                  />
                </v-radio-group>
              </v-col>
            </v-row>

            <div class="text-caption font-weight-medium mt-3 mb-1">Sentence Types</div>
            <v-row dense>
              <v-col cols="4" v-for="type in options.sentence_types" :key="type">
                <v-checkbox
                  v-model="selectedSentenceTypes"
                  :label="type"
                  :value="type"
                  hide-details
                  density="compact"
                />
              </v-col>
            </v-row>

            <div class="text-caption font-weight-medium mt-3 mb-1">Tenses</div>
            <v-row dense>
              <v-col cols="4" v-for="tense in options.tenses" :key="tense">
                <v-checkbox
                  v-model="selectedTenses"
                  :label="tense"
                  :value="tense"
                  hide-details
                  density="compact"
                />
              </v-col>
            </v-row>

            <v-row justify="start" class="mt-2">
              <v-col cols="6">
                <v-text-field
                  v-model.number="numPrompts"
                  type="number"
                  min="3"
                  max="50"
                  label="Questions"
                  density="compact"
                  hide-details
                  style="max-width: 120px"
                />
              </v-col>
            </v-row>

            <v-btn block color="success" class="mt-2" :disabled="!optionsLoaded" @click="() => startGame(selections)">
              Start with custom settings
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
        { label: 'Irregular verbs basic', color: 'success', settings: { verbSet: 'Irregular verbs only', sentenceTypes: ['Positive'], tenses: ['Past simple'], numPrompts: 25 } },
        { label: 'Irregular verbs advanced', color: 'warning', settings: { verbSet: 'Irregular verbs only', sentenceTypes: ['Positive'], tenses: ['Past simple', 'Present perfect'], numPrompts: 25 } },
        { label: 'Past simple', color: 'info', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Past simple'], numPrompts: 20 } },
        { label: 'Past simple vs present perfect', color: 'secondary', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative'], tenses: ['Past simple', 'Present perfect'], numPrompts: 20 } },
        { label: 'Present simple and continuous', color: 'primary', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Positive', 'Negative', 'Questions'], tenses: ['Present simple', 'Present continuous'], numPrompts: 25 } },
        { label: 'All negatives', color: 'error', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Negative'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 25 } },
        { label: 'All questions', color: 'grey', settings: { verbSet: 'Common verbs (Reg + Irreg)', sentenceTypes: ['Questions'], tenses: ['Present simple','Past simple','Future simple','Recommendation','Present continuous','Present perfect'], numPrompts: 25 } },
      ];
    },
  },
  async created() {
    try {
      const res = await fetch('/data/set_options.json');
      const opts = await res.json();
      this.options = opts;
      this.selectedVerbSet = opts.verb_sets[0];
      this.selectedSentenceTypes = opts.sentence_types;
      this.selectedTenses = opts.tenses;
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
