<template>
  <div class="settings-scene">
    <div class="settings-layout">
      <div class="quick-play-settings-layout">
        <h2 id="quick-play-header" class="display-3 mb-3">Quick Play</h2>
        <p class="lead mb-4">Choose a predefined game package.</p>
        <div class="settings-card-container">
          <button class="btn btn-lg btn-success mb-3" 
          @click="startGame({
            verbSet: 'Irregular verbs only',
            sentenceTypes: ['Positive'],
            tenses: ['Past simple'],
            numPrompts: 25
          })">
          Irregular verbs basic
          </button>
          <button class="btn btn-lg btn-warning mb-3" 
                  @click="startGame({
                    verbSet: 'Irregular verbs only',
                    sentenceTypes: ['Positive'],
                    tenses: ['Past simple', 'Present perfect'],
                    numPrompts: 25
                  })">
            Irregular verbs advanced
          </button>

          <button class="btn btn-lg btn-info mb-3" 
                  @click="startGame({
                    verbSet: 'Common verbs (Reg + Irreg)',
                    sentenceTypes: ['Positive', 'Negative', 'Questions'],
                    tenses: ['Past simple'],
                    numPrompts: 20
                  })">
            Past simple
          </button>

          <button class="btn btn-lg btn-dark mb-3" 
                  @click="startGame({
                    verbSet: 'Common verbs (Reg + Irreg)',
                    sentenceTypes: ['Positive', 'Negative'],
                    tenses: ['Past simple', 'Present perfect'],
                    numPrompts: 20
                  })">
            Past simple vs present perfect
          </button>

          <button class="btn btn-lg btn-primary mb-3" 
                  @click="startGame({
                    verbSet: 'Common verbs (Reg + Irreg)',
                    sentenceTypes: ['Positive', 'Negative', 'Questions'],
                    tenses: ['Present simple', 'Present continuous'],
                    numPrompts: 25
                  })">
            Present simple and continuous
          </button>

          <button class="btn btn-lg btn-danger mb-3" 
                  @click="startGame({
                    verbSet: 'Common verbs (Reg + Irreg)',
                    sentenceTypes: ['Negative'],
                    tenses: ['Present simple', 'Past simple', 'Future simple', 'Recommendation', 'Present continuous', 'Present perfect'],
                    numPrompts: 25
                  })">
            All negatives
          </button>

          <button class="btn btn-lg btn-light mb-3" 
                  @click="startGame({
                    verbSet: 'Common verbs (Reg + Irreg)',
                    sentenceTypes: ['Questions'],
                    tenses:['Present simple', 'Past simple', 'Future simple', 'Recommendation', 'Present continuous', 'Present perfect'],
                    numPrompts: 25
                  })">
            All questions
          </button>
        </div>
      </div>

      <div custom-play-settings-layout>
        <h2 id="custom-play-header" class="display-3 mb-3">Custom Play</h2>
        <p class="lead mb-4">Define your own settings!</p>
        <div class="settings-card-container">
          <!-- Verb Sets Card -->
          <div class="card mb-3 bg-secondary">
            <div class="card-body">
              <h5 class="card-title mb-3">Verb set</h5>
              <div class="d-flex flex-wrap align-items-center checkbox-container">
                <div 
                  v-for="set in options.verb_sets" 
                  :key="set" 
                  class="form-check form-check-inline me-3">
                  <input 
                    class="form-check-input" 
                    type="radio" 
                    :id="set" 
                    :value="set" 
                    v-model="selectedVerbSet">
                  <label class="form-check-label" :for="set">{{ set }}</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Sentence Types Card -->
          <div class="card mb-3 bg-secondary">
            <div class="card-body">
              <h5 class="card-title mb-3">Sentence types</h5>
              <div class="d-flex flex-wrap align-items-center checkbox-container">
                <div 
                  v-for="type in options.sentence_types" 
                  :key="type" 
                  class="form-check form-check-inline me-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :id="type" 
                    :value="type" 
                    v-model="selectedSentenceTypes">
                  <label class="form-check-label" :for="type">{{ type }}</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Tenses Card -->
          <div class="card mb-3 bg-secondary">
            <div class="card-body">
              <h5 class="card-title mb-3">Tenses</h5>
              <div class="d-flex flex-wrap align-items-center checkbox-container">
                <div 
                  v-for="tense in options.tenses" 
                  :key="tense" 
                  class="form-check form-check-inline me-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :id="tense" 
                    :value="tense" 
                    v-model="selectedTenses">
                  <label class="form-check-label" :for="tense">{{ tense }}</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Number of Prompts Card -->
          <div class="card mb-3 bg-secondary">
            <div class="card-body">
              <h5 class="card-title mb-3" for="numPrompts">Number of questions</h5>
              <div class="d-flex flex-wrap align-items-center justify-content-center py-5">
                <input style="width: 80px;"
                    id="numPrompts" 
                    type="number" 
                    v-model.number="numPrompts" 
                    min="3" 
                    max="50" 
                    class="form-control" 
                    required>
              </div>
            </div>
          </div>
        </div>
        <button :disabled="!optionsLoaded" @click="() => startGame(selections)" class="btn btn-lg btn-primary">Start with custom settings</button>
      </div>
    </div>
    <div id="buttons-container">
      <button @click="goToScene('Scene01_Landing')" class="btn btn-sm btn-secondary">BACK</button>
    </div>
  </div>
</template>


<script>
import '@/assets/styles/global_conjugator_styles.css';

export default {
  data() {
    return {
      options: {
        sentence_types: [],
        verb_sets: [],
        tenses: []
        },
      selectedVerbSet: '',
      selectedSentenceTypes: [],
      selectedTenses: [],
      numPrompts: 10,
      optionsLoaded: false
    };
  },
  async created() {
    try {
      // Fetch the JSON file from the public folder
      const response = await fetch('/data/set_options.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch set_options.json: ${response.statusText}`);
      }
      const options = await response.json();
      this.options = options;
      this.selectedVerbSet = options.verb_sets[0];
      this.selectedSentenceTypes = options.sentence_types;
      this.selectedTenses = options.tenses;
      this.optionsLoaded = true
    } catch (error) {
      console.error('Error loading options:', error);
    }
  },
  methods: {
    goToScene(sceneName) {
      this.$emit('changeScene', sceneName);
    },
    startGame(predefinedSettings = null) {
      console.log("Ok")
      console.log(this.selectedVerbSet)
      const selections = predefinedSettings || {
        verbSet: this.selectedVerbSet,
        sentenceTypes: this.selectedSentenceTypes,
        tenses: this.selectedTenses,
        numPrompts: this.numPrompts
      };
      console.log(selections);
      this.$emit('startGame', selections);
      this.goToScene('Scene03_Game');
    }
  }
}
</script>


<style scoped>

  .settings-scene {
    text-align: center;
    padding: 40px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    gap: 20px;
    color: white;
    background-image: url("/images/conjugator.png");
    background-size: cover;      /* Makes the image cover the whole div */
    background-position: center; /* Centers the image */
    background-repeat: no-repeat; /* Prevents tiling */
    width: 100%;
  }
  .settings-layout {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 0;
    overflow: hidden;
    margin-bottom: 2rem;
  }
  .quick-play-settings-layout,
  .custom-play-settings-layout {
    flex: 1 1 50%;
    padding: 50px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.5)
  }
  #buttons-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
  }
  .settings-card-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    padding: 5%;
    justify-content: center;
    gap: 20px;
    width: 100%;
    color: white;
  }
  .settings-card-container > * {
  width: 100%;
}

#settings-header {
  font-size: 4rem; 
}

#quick-play-header,
#custom-play-header {
  font-size: 2.2rem;
}

.lead {
  font-size: 1.5rem; /* tighten spacing */
}
.card-body {
  padding: 15px;
}

.btn-lg {
  padding: 8px 16px;
  font-size: 1rem;
}


@media (max-width: 576px) {
  #settings-header {
    font-size: 2rem; /* Smaller font size for smartphone-sized screens */
    }
  }
  @media (max-width: 768px) {
  .settings-layout {
    flex-direction: column;
  }

  .quick-play-settings-layout {
    border-right: none;
    border-bottom: 2px solid #666;
  }
}
  
  /* Custom styles for checkbox containers */
  .checkbox-container {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10px; /* Adjusts spacing between items */
  }
  
  .checkbox-item {
    display: inline-flex;
    align-items: center;
  }
  
  .checkbox-item input {
    margin-right: 5px;
  }

  
  </style>