<!-- src/components/comparison/comparison_scenes/ComparisonScene00_Start.vue -->
<template>
  <v-container fluid class="py-2 px-1 d-flex justify-center">
    <v-card class="px-4" width="450" min-height="600" elevation="2">
      <div class="p-3">
        <div class="d-flex justify-center mb-2">
          <v-img src="/images/banners/Comparison.png" max-width="230" />
        </div>

        <v-list density="compact">
          <v-list-item>
            <template #prepend><v-icon icon="mdi-counter" /></template>
            <v-list-item-title>{{ selections.numRounds }} prompts</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-timer-sand" /></template>
            <v-list-item-title class="text-wrap">20 seconds per round</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-book-open-outline" /></template>
            <v-list-item-title class="text-wrap">
              Before playing, study the rules for
              <a
                href="https://book.language-labs.ch/ch2#comparative-and-superlative"
                target="_blank"
              >
                comparison
              </a>
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider class="my-4" />

        <div class="text-subtitle-2 mb-2">Choose what to practice</div>
        <v-radio-group
          v-model="selections.partOfSpeech"
          class="ms-3 my-3 d-flex justify-center"
          inline
        >
          <v-radio label="Adjectives only" value="adjectives" />
          <v-radio label="Adverbs only" value="adverbs" />
          <v-radio label="Mix" value="mix" />
        </v-radio-group>
        
            <v-switch
            v-model="selections.intensifiers"
            inset
            class="ms-3"
            label="with intensifiers"
            color="primary"
            density="compact"
          />

        <div class="d-flex justify-center mt-2">
          <v-btn color="success" @click="start">Start</v-btn>
        </div>

        <div class="d-flex justify-center mt-4">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="large">
              <v-icon color="grey-darken-3" size="large">mdi-arrow-left-circle</v-icon>
            </v-btn>
          </RouterLink>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["startGame"]);

const selections = ref({
  partOfSpeech: "mix",
  numRounds: 30,
  intensifiers: false,
});

function start() {
  emit("startGame", selections.value);
}
</script>