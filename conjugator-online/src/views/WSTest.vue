<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const health = ref<any>(null);
const healthErr = ref<string>("");

async function runHealth() {
  healthErr.value = "";
  try {
    const { data } = await axios.get("/api/ws-health/");
    health.value = data;
  } catch (e: any) {
    healthErr.value = e?.response?.data?.detail || e?.message || "health failed";
  }
}
</script>

<template>
  <div style="padding:12px;border:1px solid #ccc;border-radius:8px">
    <h3>WS/Redis Diagnostics</h3>
    <button @click="runHealth">Run backend WS health</button>
    <pre v-if="health">{{ health }}</pre>
    <pre v-if="healthErr" style="color:#b00">{{ healthErr }}</pre>
  </div>
</template>