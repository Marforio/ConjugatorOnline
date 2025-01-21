<template>
  <div class="settings-scene">
    <h1>VOCAB AND CONJUGATION TESTER</h1>

      <label>Verb Sets:</label>
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

    <div class="form-group">
      <label>Sentence Types:</label>
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

    <div class="form-group">
      <label>Tenses:</label>
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

    <div class="form-group">
      <label for="numPrompts">Number of Prompts:</label>
      <input 
        id="numPrompts" 
        type="number" 
        v-model.number="numPrompts" 
        min="3" 
        max="50" 
        class="form-control" 
        required>
    </div>

    <button @click="startGame">START</button>
    <button @click="goToScene('Scene01_Landing')">BACK</button>
  </div>
</template>


<script>
import options from '@/assets/data/set_options.json';

export default {
  data() {
    return {
      options,
      selectedVerbSet: options.verb_sets[0],
      selectedSentenceTypes: options.sentence_types,
      selectedTenses: options.tenses,
      numPrompts: 10
    };
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
    background-color: gray;
    padding: 20px;
  }
  .settings-scene h1 {
    color: white;
    font-size: 36px;
  }
  .settings-scene label {
    display: block;
    margin-bottom: 5px;
    font-size: 16px;
    color: white;
  }
  .settings-scene button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
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