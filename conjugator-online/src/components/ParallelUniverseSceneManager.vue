<template>
  <component
    :is="currentSceneComponent"
    @changeScene="changeScene"
    @startGame="handleStartGame"
    @gameOver="handleGameOver"
    :gameSettings="gameSettings"
    :prompts="promptsForGame"
    :results="results"
  />
</template>

<script setup>
import { ref, computed, markRaw } from "vue";

import ParallelUniverseScene00_Start from "./parallel_universe_scenes/ParallelUniverseScene00_Start.vue";
import ParallelUniverseScene01_Game from "./parallel_universe_scenes/ParallelUniverseScene01_Game.vue";
import ParallelUniverseScene02_Results from "./parallel_universe_scenes/ParallelUniverseScene02_Results.vue";

import { parallelUniversePrompts } from "@/assets/scripts/parallel_universe/ParallelUniversePrompts";
import { normalizePrompts } from "@/assets/scripts/parallel_universe/ParallelUniversePromptEngine";
import { buildPool, buildRoundSet } from "@/assets/scripts/parallel_universe/ParallelUniversePoolBuilder";

const scenes = {
  ParallelUniverseScene00_Start,
  ParallelUniverseScene01_Game,
  ParallelUniverseScene02_Results,
};

const currentScene = ref("ParallelUniverseScene00_Start");
const currentSceneComponent = computed(() => scenes[currentScene.value]);

const gameSettings = ref(null);
const promptsForGame = ref([]);
const results = ref(null);

function changeScene(sceneName) {
  if (scenes[sceneName]) currentScene.value = sceneName;
}

function handleStartGame(selections) {
  try {
    gameSettings.value = markRaw(selections);

    const all = normalizePrompts(parallelUniversePrompts);
    const pool = buildPool(all, {
      verbSet: selections.verbSet,
      conditionalTypes: selections.conditionalTypes,
    });

    const rounds = buildRoundSet(pool, 24);
    promptsForGame.value = rounds;

    changeScene("ParallelUniverseScene01_Game");
  } catch (e) {
    console.error("[ParallelUniverse] start failed:", e);
    promptsForGame.value = [];
    changeScene("ParallelUniverseScene01_Game");
  }
}

function handleGameOver(payload) {
  results.value = payload;
  changeScene("ParallelUniverseScene02_Results");
}
</script>
