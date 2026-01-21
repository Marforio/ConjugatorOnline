<template>
  <v-container class="pa-6">
    <v-card class="mx-auto my-auto px-3 py-1" max-width="760">
      <v-card-title class="mb-3">
        <div>
          <div class="d-flex justify-center">
            <v-img src="/images/banners/ParallelUniverse.png" max-width="400" />
          </div>
          <h2 class="text-h4 ms-2 text-wrap">Settings</h2>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Verb set</v-card-title>
            <v-radio-group v-model="selections.verbSet" class="ms-2">
              <v-radio label="Regular + Essential irregs" value="regular_essential" />
              <v-radio label="Regular + Advanced irregs" value="regular_advanced" />
              <v-radio label="All prompts" value="all" />
            </v-radio-group>

          </v-col>

          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Conditional types</v-card-title>
            <div class="d-flex flex-column gap-0">
            <v-checkbox
              v-model="selections.types.first"
              label="First conditional"
              density="compact"
              class="ms-6 ma-0 pa-0"
              style="font-size: 0.9rem;"
              hide-details
            />
            <v-checkbox
              v-model="selections.types.second"
              label="Second conditional"
              density="compact"
              class="ms-6 ma-0 pa-0"
              style="font-size: 0.9rem;"
              hide-details
            />
            <v-checkbox
              v-model="selections.types.third"
              label="Third conditional"
              density="compact"
              class="ms-6 ma-0 pa-0"
              style="font-size: 0.9rem;"
              hide-details
            />
            </div>
            <v-card-title class="font-weight-medium mt-4">Rounds</v-card-title>
            <div class="ms-4">Fixed to <strong>24 rounds</strong></div>
            
          </v-col>
        </v-row>

        <div v-if="!valid" class="text-caption text-error mt-3 ms-2">
          Select at least one conditional type.
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <div class="d-flex justify-space-between align-center w-100">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="x-large" class="ms-3">
              <v-icon color="grey-darken-3" size="x-large">mdi-arrow-left-circle</v-icon>
            </v-btn>
          </RouterLink>

          <v-btn color="primary" @click="start" :disabled="!valid">Start Game</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["startGame"]);

const selections = ref({
  verbSet: "regular_essential", // regular_essential | regular_advanced | all
  types: {
    first: true,
    second: true,
    third: true,
  },
  numRounds: 24,
});

const conditionalTypes = computed(() => {
  const out = [];
  if (selections.value.types.first) out.push("first");
  if (selections.value.types.second) out.push("second");
  if (selections.value.types.third) out.push("third");
  return out;
});

const valid = computed(() => conditionalTypes.value.length > 0);

function start() {
  if (!valid.value) return;
  emit("startGame", {
    verbSet: selections.value.verbSet,
    conditionalTypes: conditionalTypes.value,
    numRounds: 24,
  });
}
</script>
