<template>
  <div class="uses-of-auxiliaries-view-container flex-grow-1">
    
    <OtherGameStart 
      v-if="!sessionData" 
      gameName="Uses Of Auxiliaries" 
      @initialized="handleSessionAllocation" 
    />
    
    <OtherGamePlay 
      v-else 
      :session_id="sessionData.session_id" 
      :prompts="sessionData.prompts" 
      :gameSettings="sessionData.settings"
      gameName="Uses Of Auxiliaries"
      @restart="sessionData = null" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import OtherGameStart from "@/components/games/OtherGameStart.vue";
import OtherGamePlay from "@/components/games/OtherGamePlay.vue";

const sessionData = ref<{ session_id: number; prompts: any[]; settings?: any } | null>(null);

function handleSessionAllocation(payload: { session_id: number; prompts: any[]; settings?: any }) {
  sessionData.value = payload;
}
</script>