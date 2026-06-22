<template>
  <div class="comparison-view-container flex-grow-1">
    
    <OtherGameStart 
      v-if="!sessionData" 
      gameName="Comparison" 
      @initialized="handleSessionAllocation" 
    />
    
    <OtherGamePlay 
      v-else 
      :session_id="sessionData.session_id" 
      :prompts="sessionData.prompts" 
      :gameSettings="sessionData.settings"
      gameName="Comparison"
      @restart="sessionData = null" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import OtherGameStart from "@/components/games/OtherGameStart.vue";
import OtherGamePlay from "@/components/games/OtherGamePlay.vue";

interface GameSessionState {
  session_id: number;
  prompts: any[];
  settings: any;
}

const sessionData = ref<GameSessionState | null>(null);

onMounted(() => {
  console.log("[DEBUG-VIEW] ComparisonView mounted successfully.");
});

function handleSessionAllocation(payload: any) {
  console.log("[DEBUG-VIEW] Processing incoming data payload packet...", payload);
  
  // Clean parameter assignment triggers immediate UI repaints safely
  sessionData.value = {
    session_id: parseInt(payload.session_id, 10) || Date.now(),
    prompts: payload.prompts || [],
    settings: payload.settings || {}
  };

  console.log("[DEBUG-VIEW] sessionData state mutated successfully. Swapping card scenes.");
}
</script>