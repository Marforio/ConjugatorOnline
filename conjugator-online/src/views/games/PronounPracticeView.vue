<template>
  <div class="pronoun-practice-view-container flex-grow-1">
    
    <OtherGameStart 
      v-if="!sessionData" 
      gameName="Pronoun Practice" 
      @initialized="handleSessionAllocation" 
    />
    
    <OtherGamePlay 
      v-else 
      :session_id="sessionData.session_id" 
      :prompts="sessionData.prompts" 
      gameName="Pronoun Practice"
      :gameSettings="sessionData.settings"
      @restart="sessionData = null" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import OtherGameStart from "@/components/games/OtherGameStart.vue";
import OtherGamePlay from "@/components/games/OtherGamePlay.vue";

// Holds session_id, prompts array, and timestamp meta packages from the backend
const sessionData = ref<{ session_id: number; prompts: any[]; settings?: any } | null>(null);

function handleSessionAllocation(payload: { session_id: number; prompts: any[] }) {
  sessionData.value = payload;
}
</script>