<!-- src/components/VerbMixerSceneManager.vue -->
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

import GrammarScene00_Start from './verbmixer_scenes/VerbMixerScene00_Start.vue';
import GrammarScene01_Game from './verbmixer_scenes/VerbMixerScene01_Game.vue';
import GrammarScene02_Results from './verbmixer_scenes/VerbMixerScene02_Results.vue';

import { normalizePrompts } from '@/assets/scripts/verb_mixer/VerbMixerPromptEngine';
import { buildRoundSet } from '@/assets/scripts/verb_mixer/VerbMixerPoolBuilder';
import { verbMixerData } from '@/assets/scripts/verb_mixer/VerbMixerData'; // your large data

const scenes = {
  GrammarScene00_Start,
  GrammarScene01_Game,
  GrammarScene02_Results,
};

const currentScene = ref('GrammarScene00_Start');
const currentSceneComponent = computed(() => scenes[currentScene.value]);

const gameSettings = ref(null);
const results = ref(null);
const totalTime = ref('');
const avgTime = ref('');
const promptsForGame = ref([]);

function changeScene(sceneName) {
  if (scenes[sceneName]) currentScene.value = sceneName;
}

function handleStartGame(selections) {
  gameSettings.value = markRaw(selections);

  // normalize dataset
  const normalized = normalizePrompts(verbMixerData);

  // fixed 30 rounds with required distribution
const mode = selections.mode === 'mixed' ? 'mixed' : selections.singleCategory;
promptsForGame.value = buildRoundSet(normalized, { mode });



  // go to game
  changeScene('GrammarScene01_Game');
}

function handleGameOver(payload) {
  // payload could include results + totalTime + avgTime from your Game scene
  // Keep the same pattern as passive:
  results.value = payload?.results ?? payload ?? null;
  totalTime.value = payload?.totalTime ?? '';
  avgTime.value = payload?.avgTime ?? '';
  changeScene('GrammarScene02_Results');
}
</script>
