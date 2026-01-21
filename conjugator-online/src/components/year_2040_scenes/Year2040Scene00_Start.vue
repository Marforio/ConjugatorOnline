<!-- src/components/year_2040/year_2040_scenes/Year2040Scene00_Start.vue -->
<template>
  <v-container class="pa-6">
    <v-card class="mx-auto my-auto px-3 py-1" max-width="720">
      <v-card-title class="mb-4">
        <div>
          <div class="d-flex justify-center">
            <v-img src="/images/banners/Year2040.png" max-width="420" />
          </div>
          <h2 class="text-h4 ms-2 text-wrap">Settings</h2>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Prompt set</v-card-title>

            <v-radio-group v-model="selections.mode" class="ms-2">
              <v-radio
                label="Regular + Essential irregulars"
                value="essential_mix"
              />
              <v-radio
                label="Regular + Advanced irregulars"
                value="advanced_mix"
              />
              <v-radio
                label="All prompts"
                value="all"
              />
            </v-radio-group>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Rounds</v-card-title>
            <div class="ms-4">Fixed to <strong>24 rounds</strong></div>

            <v-card-title class="font-weight-medium mt-4">Timer</v-card-title>
            <div class="ms-4"><strong>20 seconds</strong> per round</div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <div class="d-flex justify-space-between align-center w-100">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="x-large" class="ms-3">
              <v-icon color="grey-darken-3" size="x-large">mdi-arrow-left-circle</v-icon>
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
  mode: "essential_mix", // essential_mix | advanced_mix | all
  numRounds: 24,
});

const valid = computed(() => !!selections.value.mode);

function start() {
  if (!valid.value) return;
  emit("startGame", { ...selections.value });
}
</script>
