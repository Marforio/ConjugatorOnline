<template>
  <div class="idea-linker-view-container flex-grow-1">
    
    <OtherGameStart 
      v-if="!sessionData" 
      gameName="Idea Linker" 
      @initialized="handleSessionAllocation" 
    />
    
    <OtherGamePlay 
      v-else 
      :session_id="sessionData.session_id" 
      :prompts="sessionData.prompts" 
      :gameSettings="sessionData.settings"
      gameName="Idea Linker"
      @restart="sessionData = null" 
    />

  </div>
</template>

<script setup>
import { ref } from "vue";
import OtherGameStart from "@/components/games/OtherGameStart.vue";
import OtherGamePlay from "@/components/games/OtherGamePlay.vue";

const sessionData = ref(null);

function handleSessionAllocation(payload) {
  sessionData.value = {
    session_id: parseInt(payload.session_id, 10) || Date.now(),
    prompts: payload.prompts || [],
    settings: payload.settings || {}
  };
}
</script>