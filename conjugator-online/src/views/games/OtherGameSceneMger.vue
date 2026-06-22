<template>
  <OtherGameStart 
    v-if="!sessionData" 
    :gameName="gameName" 
    @initialized="handleGameStart" 
  />
  <OtherGamePlay 
    v-else 
    :session_id="sessionData.session_id" 
    :prompts="sessionData.prompts" 
    :gameName="gameName"
    @restart="sessionData = null" 
  />
</template>

<script setup>
import { ref } from "vue";
import OtherGameStart from "./OtherGameStart.vue";
import OtherGamePlay from "./OtherGamePlay.vue";

defineProps({
  gameName: { type: String, required: true } // Handed down via router mapping params
});

const sessionData = ref(null);

function handleGameStart(payload) {
  sessionData.value = payload;
}
</script>