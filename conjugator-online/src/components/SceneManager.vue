<!-- src/components/SceneManager.vue -->
<template>
  <component :is="currentSceneComponent" @changeScene="changeScene" @startGame="handleStartGame" @gameOver="handleGameOver" :gameSettings="gameSettings" :results="results" :total-time="totalTime" :avg-time="avgTime" />
</template>

<script>
import { markRaw } from 'vue';
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
      this.changeScene('Scene03_Game');
    },
    handleGameOver(payload) {
      this.results = payload;
      this.changeScene('Scene04_Results');
      }
  },
};
</script>
