<!-- src/components/UsesOfAuxiliariesSceneManager.vue -->
<template>
  <component
    :is="currentSceneComponent"
    @changeScene="changeScene"
    @startGame="handleStartGame"
    @gameOver="handleGameOver"
    @playAgain="handlePlayAgain"
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

import AuxiliariesScene00_Start from "./auxiliaries_scenes/AuxiliariesScene00_Start.vue";
import AuxiliariesScene01_Game from "./auxiliaries_scenes/AuxiliariesScene01_Game.vue";
import AuxiliariesScene02_Results from "./auxiliaries_scenes/AuxiliariesScene02_Results.vue";

import {
  normalizePrompts,
  buildPool,
  samplePrompts,
} from "@/assets/scripts/uses_of_auxiliaries/AuxiliariesPromptEngine";

import { auxiliariesPrompts } from "@/assets/scripts/uses_of_auxiliaries/AuxiliariesPrompts";

const scenes = {
  AuxiliariesScene00_Start,
  AuxiliariesScene01_Game,
  AuxiliariesScene02_Results,
};

const currentScene = ref("AuxiliariesScene00_Start");
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

  const normalized = normalizePrompts(auxiliariesPrompts);

  const pool = buildPool(normalized, {
    modes: selections.modes, // <-- only setting now
  });

  promptsForGame.value = samplePrompts(pool, selections.numRounds || 30);

  changeScene("AuxiliariesScene01_Game");
}

function handlePlayAgain() {
  // If for some reason settings are missing, fall back to start scene
  if (!gameSettings.value) {
    changeScene("AuxiliariesScene00_Start");
    return;
  }

  // ✅ Re-run sampling with the same settings to get a fresh prompt set
  handleStartGame(gameSettings.value);
}

function handleGameOver(payload) {
  results.value = payload;
  totalTime.value = payload?.totalTime ?? totalTime.value;
  avgTime.value = payload?.avgTime ?? avgTime.value;
  changeScene("AuxiliariesScene02_Results");
}
</script>