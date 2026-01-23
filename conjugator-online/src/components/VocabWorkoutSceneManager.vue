<!-- src/components/vocab_workout/VocabWorkoutSceneManager.vue -->
<template>
  <component
    :is="currentSceneComponent"
    @startGame="handleStartGame"
    @gameOver="handleGameOver"
    @changeScene="changeScene"
    :gameSettings="gameSettings"
    :planItems="planItems"
    :results="results"
    :availableLists="availableLists"
  />
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from "vue";

import VocabWorkoutScene00_Settings from "./vocab_workout_scenes/VocabWorkoutScene00_Settings.vue";
import VocabWorkoutScene01_Game from "./vocab_workout_scenes/VocabWorkoutScene01_Game.vue";
import VocabWorkoutScene02_Results from "./vocab_workout_scenes/VocabWorkoutScene02_Results.vue";

import { vocabLists } from "@/assets/scripts/vocab_workout/VocabListRegistry";
import { normalizeVocabDataset } from "@/assets/scripts/vocab_workout/VocabWorkoutPromptEngine";
import { buildPool, buildRoundPlan } from "@/assets/scripts/vocab_workout/VocabWorkoutPoolBuilder";

const scenes = {
  VocabWorkoutScene00_Settings,
  VocabWorkoutScene01_Game,
  VocabWorkoutScene02_Results,
};

const currentScene = ref<keyof typeof scenes>("VocabWorkoutScene00_Settings");
const currentSceneComponent = computed(() => scenes[currentScene.value]);

const gameSettings = ref<any>(null);
const planItems = ref<any[]>([]);
const results = ref<any>(null);

function changeScene(sceneName: keyof typeof scenes) {
  if (scenes[sceneName]) currentScene.value = sceneName;
}

/**
 * Build the dropdown data from the registry:
 * {
 *   "Architecture": [{title, value}, ...],
 *   "General English": [{title, value}, ...]
 * }
 */
const availableLists = computed(() => {
  const out: Record<string, { title: string; value: string; supportsLevels: boolean }[]> = {};

  Object.entries(vocabLists).forEach(([key, meta]) => {
    const moduleName = meta.module || "General vocab";
    if (!out[moduleName]) out[moduleName] = [];
    out[moduleName].push({
      title: meta.title,
      value: key,
      supportsLevels: !!meta.supportsLevels,
    });
  });

  // sort lists inside each module for nicer UI
  Object.keys(out).forEach((k) => {
    out[k].sort((a, b) => a.title.localeCompare(b.title));
  });

  return out;
});

function handleStartGame(selections: any) {
  try {
    gameSettings.value = markRaw(selections);

    // 1) Resolve dataset from registry
    const listKey = selections.listKey;
    const listMeta = (vocabLists as any)[listKey];
    if (!listMeta) {
      throw new Error(`Unknown listKey "${listKey}". Check Start Scene values vs VocabListRegistry keys.`);
    }

    // 2) Enforce: if list supports levels, you MUST pick essential/advanced (no "all")
    if (listMeta.supportsLevels) {
      const lvl = selections.level;
      if (lvl !== "essential" && lvl !== "advanced") {
        throw new Error(`Irregular verbs requires level "essential" or "advanced" (received "${lvl}").`);
      }
    }

    // 3) Normalize dataset
    const normalized = normalizeVocabDataset(listMeta.data);

    // 4) Build pool
    //    - only filter by level if the list supports it
    const pool = buildPool(normalized.items, {
      level: listMeta.supportsLevels ? selections.level : null,
    });

    // 5) Build round plan
    const plan = buildRoundPlan(pool, selections.mode, {
      quizCount: selections.quizCount,
      // any other settings you need later
    });

    planItems.value = plan.items;

    changeScene("VocabWorkoutScene01_Game");
  } catch (e) {
    console.error("[VocabWorkout] Failed to start:", e);
    planItems.value = [];
    changeScene("VocabWorkoutScene01_Game");
  }
}

function handleGameOver(payload: any) {
  results.value = payload;
  changeScene("VocabWorkoutScene02_Results");
}
</script>
