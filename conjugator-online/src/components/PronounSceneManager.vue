<!-- src/components/PronounSceneManager.vue -->
<template>
  <component :is="currentSceneComponent" @changeScene="changeScene" @startGame="handleStartGame" @gameOver="handleGameOver" :gameSettings="gameSettings" :results="results" :total-time="totalTime" :avg-time="avgTime" />
</template>

<script>
import { markRaw } from 'vue';
import PronounScene01_Game from './pronoun_scenes/PronounScene01_Game.vue';
import PronounScene02_Results from './pronoun_scenes/PronounScene02_Results.vue';

export default {
  data() {
    return {
      scenes: { PronounScene01_Game, PronounScene02_Results },
      currentScene: 'PronounScene01_Game',
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
      this.changeScene('PronounScene01_Game');
    },
    handleGameOver(payload) {
      this.results = payload;
      this.changeScene('PronounScene02_Results');
      }
  },
};
</script>
