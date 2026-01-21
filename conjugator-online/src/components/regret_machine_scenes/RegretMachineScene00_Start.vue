<!-- src/components/word_families/word_families_scenes/WordFamiliesScene00_Start.vue -->
<template>
  <v-container class="pa-6">
    <v-card class="mx-auto my-auto px-3 py-1" max-width="720">
      <v-card-title class="mb-4">
        <div>
          <div class="d-flex justify-center">
            <v-img src="/images/banners/WordFamilies.png" max-width="420" />
          </div>
          <h2 class="text-h4 ms-2 text-wrap">Settings</h2>
          <div class="text-h6 ms-2 font-weight-light">Choose mode and category</div>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Mode</v-card-title>
            <v-radio-group v-model="selections.mode" class="ms-2">
              <v-radio label="Writing (type answers)" value="writing" />
              <v-radio label="Matching (drag or tap chips)" value="matching" />
            </v-radio-group>

            <v-card-title class="font-weight-medium mt-4">Category</v-card-title>
            <v-select
              v-model="selections.category"
              :items="categoryOptions"
              label="Choose category"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Rounds</v-card-title>
            <div class="ms-4">Fixed to <strong>20 rounds</strong></div>

            <v-card-text class="text-caption mt-3">
              Matching mode is for discovery and does not count as an achievement.
            </v-card-text>
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

          <v-btn color="primary" @click="start" :disabled="!valid">Start</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
const emit = defineEmits(["startGame"]);

const props = defineProps({
  categoryOptions: { type: Array, default: () => ["all"] },
});

const selections = ref({
  mode: "matching",      // ✅ writing | matching
  category: "all",
  numRounds: 20,
});

const valid = computed(() => !!selections.value.mode && !!selections.value.category);

function start() {
  if (!valid.value) return;
  emit("startGame", { ...selections.value });
}
</script>
