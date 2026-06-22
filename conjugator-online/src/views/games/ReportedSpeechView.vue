<!-- src/views/games/ReportedSpeechView.vue -->
<template>
  <div class="reported-speech-view-container flex-grow-1">
    
    <OtherGameStart 
      v-if="!sessionData" 
      gameName="Reported Speech" 
      @initialized="handleSessionAllocation" 
    />
    
    <OtherGamePlay 
      v-else 
      :session_id="sessionData.session_id" 
      :prompts="sessionData.prompts" 
      :gameSettings="sessionData.settings"
      gameName="Reported Speech"
      @restart="sessionData = null" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import OtherGameStart from "@/components/games/OtherGameStart.vue";
import OtherGamePlay from "@/components/games/OtherGamePlay.vue";

interface GameSessionState {
  session_id: number;
  prompts: any[];
  settings: any;
}

const sessionData = ref<GameSessionState | null>(null);

function handleSessionAllocation(payload: any) {
  sessionData.value = {
    session_id: parseInt(payload.session_id, 10) || Date.now(),
    prompts: payload.prompts || [],
    settings: payload.settings || {}
  };
}
</script>