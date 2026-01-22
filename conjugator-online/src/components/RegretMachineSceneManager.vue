<!-- src/components/regret_machine/RegretMachineSceneManager.vue -->
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
import { ref, computed, markRaw } from "vue";

import RegretMachineScene00_Start from "./regret_machine_scenes/RegretMachineScene00_Start.vue";
import RegretMachineScene01_Game from "./regret_machine_scenes/RegretMachineScene01_Game.vue";
import RegretMachineScene02_Results from "./regret_machine_scenes/RegretMachineScene02_Results.vue";

import { regretmachineData } from "@/assets/scripts/regret_machine/RegretMachineData";
import { normalizePrompts } from "@/assets/scripts/regret_machine/RegretMachinepromptEngine";
import { buildPool, samplePrompts } from "@/assets/scripts/regret_machine/RegretMachinePoolBuilder";

const scenes = {
  RegretMachineScene00_Start,
  RegretMachineScene01_Game,
  RegretMachineScene02_Results,
};

const currentScene = ref("RegretMachineScene00_Start");
const currentSceneComponent = computed(() => scenes[currentScene.value]);

const gameSettings = ref(null);
const promptsForGame = ref([]);

const results = ref(null);
const totalTime = ref("");
const avgTime = ref("");

function changeScene(sceneName) {
  if (scenes[sceneName]) currentScene.value = sceneName;
}

function handleStartGame(selections) {
  gameSettings.value = markRaw(selections);

  const normalized = normalizePrompts(regretmachineData);

  

const pool = buildPool(normalized, { level: selections.level });
promptsForGame.value = samplePrompts(pool, selections.numRounds || 24);

  changeScene("RegretMachineScene01_Game");
}

function handleGameOver(payload) {
  results.value = payload;
  totalTime.value = payload?.total_time ?? "";
  avgTime.value = payload?.avg_time_per_prompt ?? "";
  changeScene("RegretMachineScene02_Results");
}
</script>
