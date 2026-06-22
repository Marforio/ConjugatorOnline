<template>
  <div class="regret-machine-view-container flex-grow-1">
    
    <OtherGameStart 
      v-if="!sessionData" 
      gameName="Regret Machine" 
      @initialized="handleSessionAllocation" 
    />
    
    <OtherGamePlay 
      v-else 
      :session_id="sessionData.session_id" 
      :prompts="sessionData.prompts" 
      gameName="Regret Machine"
      :gameSettings="sessionData.settings"
      @restart="sessionData = null" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import OtherGameStart from "@/components/games/OtherGameStart.vue";
import OtherGamePlay from "@/components/games/OtherGamePlay.vue";

const sessionData = ref<{ session_id: number; prompts: any[]; settings?: any } | null>(null);

// Fixed: Safely intercept the server response package cleanly
function handleSessionAllocation(payload: { session_id: number; prompts: any[]; settings?: any }) {
  console.log("[DEBUG] View intercepted start event data:", payload);
  sessionData.value = payload; // This reactive variable swap kicks off the scene change!
}
</script>