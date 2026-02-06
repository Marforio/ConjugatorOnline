<!-- src/components/passive/passive_scenes/PassiveScene00_Start.vue -->
<template>
  <v-container class="pa-6">
    <v-card class="mx-auto my-auto px-3 py-1" max-width="720" c>
      <v-card-title class="mb-4">
        <div>
          <div class="d-flex justify-center">
            <v-img src="/images/banners/PassiveParty.png" max-width="400" ></v-img>
          </div>
          <h2 class="text-h4 ms-2 text-wrap">Settings</h2>
          <div class="text-h6 ms-2 font-weight-light">Choose the verb set and tenses</div>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Verb set</v-card-title>
            <v-radio-group v-model="selections.level" class="ms-2">
              <v-radio label="Essential verbs" value="essential"></v-radio>
              <v-radio label="Advanced verbs" value="advanced"></v-radio>
              <v-card-text class="text-caption">Advanced verbs will actually pick ~50% essential and ~50% advanced</v-card-text>
            </v-radio-group>
            
          </v-col>

          <v-col cols="12" md="6">
            <v-card-title class="font-weight-medium">Tenses</v-card-title>
            <v-select
              v-model="selections.tenseGroup"
              :items="tenseOptions"A
              label="Choose tense group"
              density="compact"
            ></v-select>

            <v-card-title class="font-weight-medium mt-4">Rounds</v-card-title>
            <div class="ms-4">Fixed to <strong>24 rounds</strong></div>
          </v-col>
        </v-row>

      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <div class="d-flex justify-space-between align-center w-100">
            <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="x-large" class="ms-3" @click="goBack">
          <v-icon color="grey-darken-3" size="x-large">mdi-arrow-left-circle</v-icon></v-btn>
        </RouterLink>
           <v-btn style="justify-self: center;" color="primary" @click="start" :disabled="!valid">Start Game</v-btn>
        </div>
        
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
const emit = defineEmits(['startGame']);

const tenseOptions = [
  { title: 'Group 1 (present simple, past simple, recommendation, ability, obligation, future)', value: 'group1' },
  { title: 'Group 2 (present continuous, present perfect)', value: 'group2' },
  { title: 'All tenses', value: 'both' },
];

const selections = ref({
  level: 'essential',
  tenseGroup: 'both',
  numRounds: 24,
});

const valid = computed(() => !!selections.value.level && !!selections.value.tenseGroup);

function start() {
  if (!valid.value) return;
  emit('startGame', { ...selections.value });
}
</script>
