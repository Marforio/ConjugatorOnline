<!-- src/components/year_2040/Year2040SceneManager.vue -->
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

import Year2040Scene00_Start from "./year_2040_scenes/Year2040Scene00_Start.vue";
import Year2040Scene01_Game from "./year_2040_scenes/Year2040Scene01_Game.vue";
import Year2040Scene02_Results from "./year_2040_scenes/Year2040Scene02_Results.vue";

import { year2040Prompts } from "@/assets/scripts/year_2040/Year2040Prompts";
import { normalizePrompts } from "@/assets/scripts/year_2040/Year2040PromptEngine";
import { buildPool, buildRoundSet } from "@/assets/scripts/year_2040/Year2040PoolBuilder";

const scenes = {
  Year2040Scene00_Start,
  Year2040Scene01_Game,
  Year2040Scene02_Results,
};

const currentScene = ref("Year2040Scene00_Start");
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

    const all = normalizePrompts(year2040Prompts);
    const pool = buildPool(all, { mode: selections?.mode ?? "all" });
    const rounds = buildRoundSet(pool, 24);

    promptsForGame.value = rounds;
    results.value = null;

    changeScene("Year2040Scene01_Game");
  } catch (e) {
    console.error("[Year2040] Failed to start:", e);
    promptsForGame.value = [];
    results.value = null;
    changeScene("Year2040Scene01_Game");
  }
}

function handleGameOver(payload) {
  results.value = payload;
  changeScene("Year2040Scene02_Results");
}
</script>
