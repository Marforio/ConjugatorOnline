<!-- src/components/word_families/WordFamiliesSceneManager.vue -->
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

import WordFamiliesScene00_Start from "./word_family_scenes/WordFamilyScene00_Start.vue";
import WordFamiliesScene01_Game from "./word_family_scenes/WordFamilyScene01_Game.vue";
import WordFamiliesScene02_Results from "./word_family_scenes/WordFamilyScene02_Results.vue";

import { wordFamilyPrompts } from "@/assets/scripts/word_families/WordFamilyPrompts";
import { normalizeWordFamilyPrompts } from "@/assets/scripts/word_families/WordFamilyPromptEngine";
import { buildPool, buildRoundSet } from "@/assets/scripts/word_families/WordFamilyPoolBuilder";

const scenes = {
  WordFamiliesScene00_Start,
  WordFamiliesScene01_Game,
  WordFamiliesScene02_Results,
};

const currentScene = ref("WordFamiliesScene00_Start");
const currentSceneComponent = computed(() => scenes[currentScene.value]);

const gameSettings = ref(null);
const promptsForGame = ref([]);
const results = ref(null);

function changeScene(sceneName) {
  if (scenes[sceneName]) currentScene.value = sceneName;
}

function handleStartGame(selections) {
  try {
    console.log("[WordFamilies] start selections:", selections);

    gameSettings.value = markRaw(selections);

    const bases = normalizeWordFamilyPrompts(wordFamilyPrompts);

    // ✅ NEW: use track (All / Architecture / Business / ...)
    const pool = buildPool(bases, {
      track: selections?.track ?? "all",
    });

    const rounds = buildRoundSet(pool, selections?.numRounds ?? 20);

    console.log(
      "[WordFamilies] bases:", bases.length,
      "pool:", pool.length,
      "rounds:", rounds.length
    );

    promptsForGame.value = rounds;
    results.value = null;

    changeScene("WordFamiliesScene01_Game");
  } catch (e) {
    console.error("[WordFamilies] Failed to start game:", e);
    promptsForGame.value = [];
    results.value = null;
    changeScene("WordFamiliesScene01_Game"); // still navigate so you see “no prompts”
  }
}

function handleGameOver(payload) {
  results.value = payload;
  changeScene("WordFamiliesScene02_Results");
}
</script>
