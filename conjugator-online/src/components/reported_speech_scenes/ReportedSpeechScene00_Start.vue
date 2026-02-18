<!-- src/components/reported_speech/reported_speech_scenes/ReportedSpeechScene00_Start.vue -->
<template>
  <v-container class="pa-4">
    <v-card class="mx-auto my-auto px-3 py-1" max-width="720">
      <v-card-title class="mb-2">
        <div>
          <div class="d-flex justify-center">
            <v-img src="/images/banners/ReportedSpeech.png" max-width="400" />
          </div>
          <h2 class="text-h4 ms-2 text-wrap">Settings</h2>

        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
        <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Rounds</v-card-title>
            <div class="ms-4">
              Fixed to <strong>{{ selections.numRounds }}</strong> rounds
            </div>
            <v-card-title class="font-weight-medium mt-8">Grammar review</v-card-title>
            <div class="ms-4">
              Before you play, do you need to review the grammar rules for <a href="https://book.language-labs.ch/ch4#reported-speech" target="_blank">reported speech</a>?
            </div>


          </v-col>
          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Verb sets</v-card-title>
            <v-card-text>
                Prompts will contain a mix of regular verbs and :
            </v-card-text>

            <v-radio-group v-model="selections.irregMode" class="ms-2">
              <v-radio label="Essential irregular verbs" value="essential" />
              <v-radio label="Advanced irregular verbs" value="advanced" />
              <v-radio label="Both essential and advanced irregular verbs" value="both" />
            </v-radio-group>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <div class="d-flex justify-space-between align-center w-100">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" class="ms-3">
              <v-icon color="grey-darken-3">
                mdi-arrow-left-circle
              </v-icon>
            </v-btn>
          </RouterLink>

          <v-btn color="primary" @click="start" :disabled="!valid">
            Start Game
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["startGame"]);

const selections = ref({
  irregMode: "essential", 
  numRounds: 24,
});

const valid = computed(() => !!selections.value.irregMode);

function start() {
  if (!valid.value) return;
  emit("startGame", { ...selections.value });
}
</script>
