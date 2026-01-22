<!-- RegretMachineScene00_Start.vue (fix) -->
<template>
  <v-container class="pa-6">
    <v-card class="mx-auto my-auto px-3 py-1" max-width="720">
      <v-card-title class="mb-4">
        <div>
          <div class="d-flex justify-center">
            <v-img src="/images/banners/RegretMachine.png" max-width="420" />
          </div>
          <h2 class="text-h4 ms-2 text-wrap">Settings</h2>
          <div class="text-h6 ms-2 font-weight-light">Choose verb set</div>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium mt-4">Verb set</v-card-title>

            <v-select
              v-model="selections.level"
              :items="levelOptions"
              item-title="title"
              item-value="value"
              label="Choose set"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Rounds</v-card-title>
            <div class="ms-4">Fixed to <strong>24 rounds</strong></div>
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

          <v-btn color="primary" @click="start">Start</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "startGame", payload: { level: "essential" | "advanced" | "both"; numRounds: number }): void;
}>();

const levelOptions = [
  { title: "Essential verbs", value: "essential" },
  { title: "Advanced verbs", value: "advanced" },
  { title: "All", value: "both" },
] as const;

const selections = ref({
  level: "essential" as "essential" | "advanced" | "both",
  numRounds: 24,
});

function start() {
  emit("startGame", { ...selections.value });
}
</script>
