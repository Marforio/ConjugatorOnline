<!-- src/components/reported_speech/ReportedSpeechSceneManager.vue -->
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
import { ref, computed } from "vue";
import { markRaw } from "vue";

import ReportedSpeechScene00_Start from "./reported_speech_scenes/ReportedSpeechScene00_Start.vue";
import ReportedSpeechScene01_Game from "./reported_speech_scenes/ReportedSpeechScene01_Game.vue";
import ReportedSpeechScene02_Results from "./reported_speech_scenes/ReportedSpeechScene02_Results.vue";

import { normalizePrompts } from "@/assets/scripts/reported_speech/ReportedSpeechPromptEngine";
import { buildPool, samplePrompts } from "@/assets/scripts/reported_speech/ReportedSpeechPoolBuilder";
import { reportedSpeechPrompts } from "@/assets/scripts/reported_speech/ReportedSpeechPrompts";

const scenes = {
  ReportedSpeechScene00_Start,
  ReportedSpeechScene01_Game,
  ReportedSpeechScene02_Results,
};

const currentScene = ref("ReportedSpeechScene00_Start");
const gameSettings = ref(null);
const results = ref(null);
const promptsForGame = ref([]);

const currentSceneComponent = computed(() => scenes[currentScene.value]);

function changeScene(sceneName) {
  if (scenes[sceneName]) currentScene.value = sceneName;
}

function handleStartGame(selections) {
  gameSettings.value = markRaw(selections);

  const normalized = normalizePrompts(reportedSpeechPrompts);

  // Build pool based on irregular-verb setting (always includes "none")
  const pool = buildPool(normalized, {
    irregMode: selections.irregMode, // "essential" | "advanced" | "both" | "all"
  });

  // Sample prompts (may repeat if pool smaller)
  promptsForGame.value = samplePrompts(pool, selections.numRounds || 30);

  changeScene("ReportedSpeechScene01_Game");
}

function handleGameOver(payload) {
  results.value = payload;
  changeScene("ReportedSpeechScene02_Results");
}
</script>
