<template>
  <div class="conjugator-container">
    <div class="settings-scene">
      <h1 id="settings-header" class="display-1 fst-italic mb-3">THE CONJUGATOR</h1>
      <div id="settings-card-container">
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
      <div id="buttons-container">
        <button @click="goToScene('Scene01_Landing')" class="btn btn-sm btn-secondary">BACK</button>
        <button @click="startGame" class="btn btn-lg btn-primary">START THE GAME</button>
      </div>
    </div>
  </div>
</template>


<script>
import '@/assets/styles/global_conjugator_styles.css';

export default {
  data() {
    return {
      options: null,
      selectedVerbSet: null,
      selectedSentenceTypes: [],
      selectedTenses: [],
      numPrompts: 10
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
    } catch (error) {
      console.error('Error loading options:', error);
    }
  },
  methods: {
    goToScene(sceneName) {
      this.$emit('changeScene', sceneName);
    },
    startGame() {
      const selections = {
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
    background-color: #333333;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    gap: 20px;
    color: white;
  }
  #buttons-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
  }
  #settings-card-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    justify-content: center;
    align-content: center;
    gap: 20px;
    width: 100%;
    max-width: 1000px; /* Ensures the container doesn't exceed the viewport width */
    margin: 0 auto; /* Centers the container itself */
    color: white;
  }
  
  @media (max-width: 576px) {
  #settings-header {
    font-size: 2rem; /* Smaller font size for smartphone-sized screens */
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