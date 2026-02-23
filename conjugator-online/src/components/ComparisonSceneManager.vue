<!-- src/components/comparison/ComparisonSceneManager.vue -->
<template>
  <component
    :is="currentSceneComponent"
    @changeScene="changeScene"
    @startGame="handleStartGame"
    @playAgain="handlePlayAgain"
    @gameOver="handleGameOver"
    :gameSettings="gameSettings"
    :prompts="promptsForGame"
    :results="results"
    :total-time="totalTime"
    :avg-time="avgTime"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import { markRaw } from "vue";

import ComparisonScene00_Start from "./comparison_scenes/ComparisonScene00_Start.vue";
import ComparisonScene01_Game from "./comparison_scenes/ComparisonScene01_Game.vue";
import ComparisonScene02_Results from "./comparison_scenes/ComparisonScene02_Results.vue";

import {
  normalizePrompts,
  buildPool,
  samplePrompts,
} from "@/assets/scripts/comparison/ComparisonPromptEngine";

import { comparisonPrompts } from "@/assets/scripts/comparison/ComparisonPrompts";

const scenes = {
  ComparisonScene00_Start,
  ComparisonScene01_Game,
  ComparisonScene02_Results,
};

const currentScene = ref("ComparisonScene00_Start");
const gameSettings = ref(null);
const results = ref(null);
const totalTime = ref("");
const avgTime = ref("");
const promptsForGame = ref([]);

const currentSceneComponent = computed(() => scenes[currentScene.value]);

function changeScene(sceneName) {
  if (scenes[sceneName]) currentScene.value = sceneName;
}

function handleStartGame(selections) {
  gameSettings.value = markRaw(selections);

  const normalized = normalizePrompts(comparisonPrompts);

  const pool = buildPool(normalized, {
    partOfSpeech: selections.partOfSpeech, // "adjectives" | "adverbs" | "mix"
  });

  promptsForGame.value = samplePrompts(pool, selections.numRounds || 30);

  changeScene("ComparisonScene01_Game");
}

function handlePlayAgain() {
  // If for some reason settings are missing, fall back to start scene
  if (!gameSettings.value) {
    changeScene("AuxiliariesScene00_Start");
    return;
  }

  // Re-run sampling with the same settings to get a fresh prompt set
  handleStartGame(gameSettings.value);
}

function handleGameOver(payload) {
  results.value = payload;
  totalTime.value = payload?.totalTime ?? totalTime.value;
  avgTime.value = payload?.avgTime ?? avgTime.value;
  changeScene("ComparisonScene02_Results");
}
</script>