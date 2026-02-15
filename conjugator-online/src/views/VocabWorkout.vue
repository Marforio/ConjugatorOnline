<!-- src/views/VocabWorkout.vue -->
<template>
  <VocabWorkoutSceneManager ref="sceneMgrRef" />
</template>

<script setup lang="ts">
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import { nextTick, onMounted, ref } from "vue";
import VocabWorkoutSceneManager from "@/components/VocabWorkoutSceneManager.vue";

const sceneMgrRef = ref<InstanceType<typeof VocabWorkoutSceneManager> | null>(null);

const START_PAYLOAD_KEY = "vw_start_payload";
const DEBUG_VW = true;
function d(...args: any[]) {
  if (DEBUG_VW) console.log("[VocabWorkoutView]", ...args);
}

onMounted(async () => {
  d("mounted. sceneMgrRef initially:", sceneMgrRef.value);

  const raw = sessionStorage.getItem(START_PAYLOAD_KEY);
  d("sessionStorage raw payload:", raw);

  if (!raw) {
    d("No payload found. Staying on default Settings scene.");
    return;
  }

  sessionStorage.removeItem(START_PAYLOAD_KEY);
  d("payload removed from sessionStorage.");

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    console.warn("[VocabWorkoutView] Invalid JSON in payload:", raw, e);
    return;
  }

  d("parsed payload:", payload);

  // Wait for child ref to exist
  await nextTick();
  d("after nextTick. sceneMgrRef:", sceneMgrRef.value);

  const mgr = sceneMgrRef.value as any;

  // Print keys to confirm defineExpose worked
  d("sceneMgrRef keys:", mgr ? Object.keys(mgr) : null);
  d("has handleStartGame?", !!mgr?.handleStartGame);

  if (!mgr?.handleStartGame) {
    console.warn(
      "[VocabWorkoutView] handleStartGame not found. Did you add defineExpose({ handleStartGame })?"
    );
    return;
  }

  try {
    d("calling handleStartGame(payload) ...");
    await mgr.handleStartGame(payload);
    d("handleStartGame returned.");
  } catch (e) {
    console.error("[VocabWorkoutView] handleStartGame threw:", e);
  }
});
</script>
