<!-- src/components/auxiliaries/auxiliaries_scenes/AuxiliariesScene00_Start.vue -->
<template>
  <v-container class="pa-6">
    <v-card class="mx-auto my-auto px-3 py-1" max-width="720">
      <v-card-title class="mb-4">
        <div>
          <div class="d-flex justify-center">
            <v-img
              src="/images/banners/UsesOfAuxiliaries.png"
              max-width="400"
            ></v-img>
          </div>
          <h2 class="text-h4 ms-2 text-wrap">Settings</h2>
          <v-card-subtitle class="">Practice other uses of auxiliary verbs
          </v-card-subtitle>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="8">
            <v-card-title class="font-weight-medium">Modes</v-card-title>

            <div class="ms-5">
              <v-checkbox
                v-model="selections.modes.echo"
                label="Echo questions to show interest (do you? are you?)"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="selections.modes.agreement"
                label="Agreement (so do I / neither do I)"
                density="compact"
                hide-details
              />
              <v-checkbox
                v-model="selections.modes.tag"
                label="Tag questions for confirmation (..., isn't it?)"
                density="compact"
                hide-details
              />
            </div>
            <div class="text-caption mt-2 ms-5">
              Reminder: to get the achievement for this game, you need to play with all three modes.
            </div>
          </v-col>
          <v-col cols="4">
            <v-card-title class="font-weight-medium mt-4">Rounds</v-card-title>
            <div class="ms-4">
              Fixed to <strong>30 rounds</strong>
            </div>
            <v-card-title class="mt-6">Review</v-card-title>
            <div class="ms-4">
              Have you studied the <a href="https://book.language-labs.ch/ch13" target="_blank">special uses of auxiliaries</a>?</div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <div class="d-flex justify-space-between align-center w-100">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="x-large" class="ms-3">
              <v-icon color="grey-darken-3" size="x-large"
                >mdi-arrow-left-circle</v-icon
              >
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
  modes: {
    echo: true,
    agreement: true,
    tag: true,
  },
  numRounds: 30,
});

const valid = computed(() => {
  const m = selections.value.modes;
  return !!(m.echo || m.agreement || m.tag);
});

function start() {
  if (!valid.value) return;

  // SceneManager expects either selections.mode OR selections.modes.
  // We'll send only selections.modes for this simplified UI.
  emit("startGame", {
    modes: { ...selections.value.modes },
    numRounds: 30,
  });
}
</script>