<!-- src/components/verbmixer_scenes/VerbMixerScene00_Start.vue -->
<template>
  <v-container class="pa-6">
    <v-card class="mx-auto my-auto px-3 py-1" max-width="720">
      <v-card-title class="mb-2">
        <div>
          <div class="d-flex justify-center">
            <v-img src="/images/banners/VerbMixer.png" max-width="400"></v-img>
          </div>
          <h2 class="text-h4 ms-2 text-wrap">Settings</h2>
          <div class="text-h6 ms-2 font-weight-light">
            Choose your game options
          </div>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
            <v-col cols="12" md="6">
                <v-card-text>
                    <p>Verb Mixer is about choosing the right type of verb complement (infintive or gerund).</p>
                    <p>A verb complement is a verb used to complement another verb, a preposition or an adjective. You can read more about <a href="https://book.language-labs.ch/ch11" target="_blank">Verb complements</a> in chapter 11 of the grammar book.</p>
                </v-card-text>
            </v-col>
            <v-col cols="12" md="6">
            <v-card elevation="3">
                <v-card-title class="font-weight-medium">Options</v-card-title>
            <v-radio-group v-model="selections.mode" class="ms-2">
              <v-radio label="Both categories (recommended)" value="mixed"></v-radio>
              <v-radio label="One category (for practice only)" value="single"></v-radio>
            </v-radio-group>
            </v-card>
            <v-select
              v-if="selections.mode === 'single'"
              v-model="selections.singleCategory"
              :items="categoryOptions"
              label="Choose category"
              density="compact"
              class="mt-2"
            ></v-select>
          </v-col>

        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <div class="d-flex justify-space-between align-center w-100">
          <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="x-large" class="ms-3">
              <v-icon color="grey-darken-3" size="x-large">
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
import { ref, computed } from 'vue';
const emit = defineEmits(['startGame']);

const categoryOptions = [
  { title: 'Infinitive', value: 'infinitive' },
  { title: 'Gerund (-ing)', value: 'gerund' },
];


const selections = ref({
  mode: 'mixed', // "mixed" uses fixed 30-round distribution
  singleCategory: 'infinitive', // only used when mode === 'single'
  ignorePunctuation: true,
  numRounds: 30,
});

const valid = computed(() => {
  if (!selections.value.mode) return false;
  if (selections.value.mode === 'single' && !selections.value.singleCategory) return false;
  return true;
});

function start() {
  if (!valid.value) return;
  emit('startGame', { ...selections.value });
}
</script>
