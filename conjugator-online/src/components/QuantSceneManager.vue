<!-- src/components/PronounSceneManager.vue -->
<template>
  <component :is="currentSceneComponent" @changeScene="changeScene" @startGame="handleStartGame" @gameOver="handleGameOver" :gameSettings="gameSettings" :results="results" :total-time="totalTime" :avg-time="avgTime" />
</template>

<script>
import { markRaw } from 'vue';
import QuantScene01_Game from './quant_scenes/QuantScene01_Game.vue';
import QuantScene02_Results from './quant_scenes/QuantScene02_Results.vue';

export default {
  data() {
    return {
      scenes: { QuantScene01_Game, QuantScene02_Results },
      currentScene: 'QuantScene01_Game',
      gameSettings: null,
      results: null,
      totalTime: '',
      avgTime: ''
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
    handleStartGame(selections) {
      this.gameSettings = markRaw(selections);
      this.changeScene('QuantScene01_Game');
    },
    handleGameOver(payload) {
      this.results = payload;
      this.changeScene('QuantScene02_Results');
      }
  },
};
</script>
