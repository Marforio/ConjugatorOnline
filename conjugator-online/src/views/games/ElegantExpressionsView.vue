<template>
  <div class="flex-grow-1">
    <OtherGameStart
      v-if="!sessionData"
      gameName="Elegant Expressions"
      @initialized="sessionData = $event"
    />

    <OtherGamePlay
      v-else
      :session_id="sessionData.session_id"
      :prompts="sessionData.prompts"
      :gameName="sessionData.game_name"
      :gameSettings="sessionData.settings"
      @restart="sessionData = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import OtherGameStart from "@/components/games/OtherGameStart.vue";
import OtherGamePlay from "@/components/games/OtherGamePlay.vue";

type SessionData = {
  session_id: number;
  prompts: Record<string, unknown>[];
  settings: Record<string, unknown>;
  game_name: string;
};

const sessionData = ref<SessionData | null>(null);
</script>