<!-- src/components/idea_linker/idea_linker_scenes/IdeaLinkerScene00_Start.vue -->
<template>
  <v-container fluid class="py-4 px-1 d-flex justify-center">
    <v-card class="p-4" width="450" min-height="600" elevation="2">
      <div class="p-3">
        <div class="d-flex justify-center mb-2">
          <v-img src="/images/banners/IdeaLinker.png" max-width="260" />
        </div>

        <v-list density="compact">
          <v-list-item>
            <template #prepend><v-icon icon="mdi-counter" /></template>
            <v-list-item-title>{{ selections.numRounds }} prompts</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-timer-sand" /></template>
            <v-list-item-title class="text-wrap">15 seconds per round</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-lightbulb-on-outline" /></template>
            <v-list-item-title class="text-wrap">
              Write the missing linking word
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-book-open-outline" /></template>
            <v-list-item-title class="text-wrap">
              Study <a href="https://book.language-labs.ch/ch6" target="_blank">linking words</a> in the grammar book
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider class="my-4" />
        <div class="d-flex justify-center">
        <v-switch
          v-model="selections.showTranslations"
          inset
          class="mt-2"
          label="Show translation hints"
          color="primary"
          density="compact"
        />
        </div>


        <div class="d-flex justify-center mt-6">
          <v-btn color="success" @click="start">Start</v-btn>
        </div>

        <div class="d-flex justify-center mt-6">
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
  numRounds: 30,
  showTranslations: false,
});

function start() {
  emit("startGame", selections.value);
}
</script>