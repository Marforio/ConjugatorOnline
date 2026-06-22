<!-- src/views/games/PassivePartyView.vue -->
<template>
  <div class="passive-party-view-container flex-grow-1">
    
    <!-- Central configuration settings board launcher -->
    <OtherGameStart 
      v-if="!sessionData" 
      gameName="Passive Party" 
      @initialized="handleSessionAllocation" 
    />
    
    <!-- Central game operation loop panel module -->
    <OtherGamePlay 
      v-else 
      :session_id="sessionData.session_id" 
      :prompts="sessionData.prompts" 
      gameName="Passive Party"^
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

function handleSessionAllocation(payload: { session_id: number; prompts: any[] }) {
  sessionData.value = payload;
}
</script>