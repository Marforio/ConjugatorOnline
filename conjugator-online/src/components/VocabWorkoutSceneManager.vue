<template>
  <component
    :is="currentSceneComponent"
    @startGame="handleStartGame"
    @gameOver="handleGameOver"
    @changeScene="changeScene"
    :gameSettings="gameSettings"
    :planItems="planItems"
    :results="results"
  />
</template>

<script setup>
import { ref, computed, markRaw } from "vue";

import VocabWorkoutScene00_Settings from "./vocab_workout_scenes/VocabWorkoutScene00_Settings.vue";
import VocabWorkoutScene01_Game from "./vocab_workout_scenes/VocabWorkoutScene01_Game.vue";
import VocabWorkoutScene02_Results from "./vocab_workout_scenes/VocabWorkoutScene02_Results.vue";

// ✅ use your dataset (example path; adjust to your real file)
import { irregularVerbs } from "@/assets/scripts/vocab_workout/IrregularVerbs";

import { normalizeVocabDataset } from "@/assets/scripts/vocab_workout/VocabWorkoutPromptEngine";
import { buildPool, buildRoundPlan } from "@/assets/scripts/vocab_workout/VocabWorkoutPoolBuilder";

const scenes = {
  VocabWorkoutScene00_Settings,
  VocabWorkoutScene01_Game,
  VocabWorkoutScene02_Results,
};

const currentScene = ref("VocabWorkoutScene00_Settings");
const currentSceneComponent = computed(() => scenes[currentScene.value]);

const gameSettings = ref(null);
const planItems = ref([]);
const results = ref(null);

function changeScene(sceneName) {
  if (scenes[sceneName]) currentScene.value = sceneName;
}

function handleStartGame(selections) {
  try {
    gameSettings.value = markRaw(selections);

    const normalized = normalizeVocabDataset(irregularVerbs);
    const pool = buildPool(normalized.items, { level: selections.level });

    const plan = buildRoundPlan(pool, selections.mode, { quizCount: selections.quizCount });
    planItems.value = plan.items;

    changeScene("VocabWorkoutScene01_Game");
  } catch (e) {
    console.error("[VocabWorkout] Failed to start:", e);
    planItems.value = [];
    changeScene("VocabWorkoutScene01_Game");
  }
}

function handleGameOver(payload) {
  results.value = payload;
  changeScene("VocabWorkoutScene02_Results");
}
</script>
