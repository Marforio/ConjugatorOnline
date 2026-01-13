<!-- src/components/passive/PassiveSceneManager.vue -->
<template>
  <component
    :is="currentSceneComponent"
    @changeScene="changeScene"
    @startGame="handleStartGame"
    @gameOver="handleGameOver"
    :gameSettings="gameSettings"
    :prompts="promptsForGame"
    :results="results"
    :total-time="totalTime"
    :avg-time="avgTime"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { markRaw } from 'vue';
import PassiveScene00_Start from './passive_scenes/PassiveScene00_Start.vue';
import PassiveScene01_Game from './passive_scenes/PassiveScene01_Game.vue';
import PassiveScene02_Results from './passive_scenes/PassiveScene02_Results.vue';

import { normalizePrompts, buildPool, samplePrompts } from '@/assets/scripts/passive/PassivePromptEngine';
import { passivePrompts } from '@/assets/scripts/passive/PassivePrompts'; // your large data

const scenes = {
  PassiveScene00_Start,
  PassiveScene01_Game,
  PassiveScene02_Results,
};

const currentScene = ref('PassiveScene00_Start');
const gameSettings = ref(null);
const results = ref(null);
const totalTime = ref('');
const avgTime = ref('');
const promptsForGame = ref([]);

const currentSceneComponent = computed(() => scenes[currentScene.value]);

function changeScene(sceneName) {
  if (scenes[sceneName]) currentScene.value = sceneName;
}

function handleStartGame(selections) {
  gameSettings.value = markRaw(selections);

  // build prompt pool
  const normalized = normalizePrompts(passivePrompts);
  const pool = buildPool(normalized, {
    level: selections.level,
    tenseGroups: {
      group1: selections.tenseGroup === 'group1' || selections.tenseGroup === 'both',
      group2: selections.tenseGroup === 'group2' || selections.tenseGroup === 'both',
    },
  });

  // sample 24 prompts (may repeat if pool smaller)
  promptsForGame.value = samplePrompts(pool, selections.numRounds || 24);

  // go to game
  changeScene('PassiveScene01_Game');
}

function handleGameOver(payload) {
  results.value = payload;
  changeScene('PassiveScene02_Results');
}
</script>
