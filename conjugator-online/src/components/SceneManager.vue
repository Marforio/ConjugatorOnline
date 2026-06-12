<template>
  <!-- Show loading spinner while fetching game data -->
  <v-progress-circular 
    v-if="isLoading" 
    indeterminate 
    size="64"
    class="d-flex justify-center align-center"
    style="height: 100vh;"
  />
  
  <!-- Only render scene component when not loading -->
  <component 
    v-else
    :is="currentSceneComponent" 
    @changeScene="changeScene" 
    @startGame="handleStartGame" 
    @gameOver="handleGameOver" 
    :gameSettings="gameSettings"
    :gameSessionData="gameSessionData"
    :results="results" 
    :total-time="totalTime" 
    :avg-time="avgTime"
    :loading="isLoading"
  />
</template>

<script>
import { markRaw } from 'vue';
import api from '@/axios';
import Scene01_Landing from './scenes/Scene01_Landing.vue';
import Scene02_Settings from './scenes/Scene02_Settings.vue';
import Scene03_Game from './scenes/Scene03_Game.vue';
import Scene04_Results from './scenes/Scene04_Results.vue';

export default {
  data() {
    return {
      scenes: { Scene01_Landing, Scene02_Settings, Scene03_Game, Scene04_Results },
      currentScene: 'Scene01_Landing',
      gameSettings: null,
      gameSessionData: null,
      results: null,
      totalTime: '',
      avgTime: '',
      isLoading: false,
    };
  },
  computed: {
    currentSceneComponent() {
      return this.scenes[this.currentScene];
    }
  },
  methods: {
    changeScene(sceneName) {
      if (this.scenes[sceneName]) {
        this.currentScene = sceneName;
      }
    },
    
    async handleStartGame(selections) {
      this.isLoading = true;
      
      try {
        console.log("DEBUG: Starting game with selections:", selections);
        
        const response = await api.post('/conj-game/start/', {
          verb_set: selections.verbSet,
          sentence_types: selections.sentenceTypes,
          tenses: selections.tenses,
          num_prompts: selections.numPrompts,
        });
        
        console.log("DEBUG: Backend response:", response.data);
        
        // Store response from backend BEFORE changing scene
        this.gameSessionData = markRaw({
          session_id: response.data.session_id,
          prompts: response.data.prompts,
          answer_hashes: response.data.answer_hashes,
          typo_detector_version: response.data.typo_detector_version,
          error_classifier_version: response.data.error_classifier_version,
          started_at: response.data.started_at,
        });
        
        // Store settings for reference
        this.gameSettings = markRaw(selections);
        
        // Wait for Vue to update before changing scene
        await this.$nextTick();
        
        // NOW change to game scene
        this.currentScene = 'Scene03_Game';
        
      } catch (error) {
        console.error('Full error object:', error);
        console.error('Error response:', error.response?.data);
        alert(`Failed to start game: ${error.response?.data?.error || error.message}`);
        
        // Reset loading state
        this.isLoading = false;
      } finally {
        this.isLoading = false;
      }
    },
    
    async handleGameOver(payload) {
      this.isLoading = true;
      
      try {
        // Submit rounds to backend first
        const response = await api.post('/conj-game/submit-results/', {
          session_id: payload.session_id,
          rounds: payload.rounds,
        });
        
        // Store both local and backend results
        this.results = markRaw({
          session_id: payload.session_id,
          results: response.data.results,
          final_stats: response.data.final_stats,
          local_stats: payload,
        });
        
        await this.$nextTick();
        this.currentScene = 'Scene04_Results';
        
      } catch (error) {
        console.error('Error submitting game results:', error);
        alert(`Failed to submit results: ${error.message}`);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.d-flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
</style>