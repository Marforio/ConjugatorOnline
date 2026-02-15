<!-- src/components/idea_linker/idea_linker_scenes/IdeaLinkerSceneManager.vue -->
<template>
  <IdeaLinkerScene00_Start v-if="scene === 0" @startGame="startGame" />
  <IdeaLinkerScene01_Game
    v-else-if="scene === 1"
    :rounds="rounds"
    :gameSettings="gameSettings"
    @gameOver="handleGameOver"
  />
  <IdeaLinkerScene02_Results
    v-else
    :payload="payload"
  />
</template>

<script setup>
import { ref } from "vue";

import IdeaLinkerScene00_Start from "./idea_linker_scenes/IdeaLinkerScene00_Start.vue";
import IdeaLinkerScene01_Game from "./idea_linker_scenes/IdeaLinkerScene01_Game.vue";
import IdeaLinkerScene02_Results from "./idea_linker_scenes/IdeaLinkerScene02_Results.vue";

import { ideaLinkerPrompts } from "@/assets/scripts/idea_linker/IdeaLinkerPrompts";
import { flattenDataset, sampleRoundsEvenly } from "@/assets/scripts/idea_linker/IdeaLinkerPromptEngine";

const scene = ref(0);
const rounds = ref([]);
const gameSettings = ref(null);
const payload = ref(null);

function startGame(settings) {
  gameSettings.value = settings;

  const flat = flattenDataset(ideaLinkerPrompts);
  rounds.value = sampleRoundsEvenly(flat, settings.numRounds);

  payload.value = null;
  scene.value = 1;
}

function handleGameOver(p) {
  payload.value = p;
  scene.value = 2;
}
</script>