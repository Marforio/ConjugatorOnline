<template>
  <v-container class="pa-2">
    <v-card class="mx-auto" max-width="920" elevation="3">
      <v-card-title class="mb-2">
        <div>
          <div class="d-flex justify-center">
            <v-img src="/images/banners/QuantifierQuest.png" max-width="300" ></v-img>
          </div>
          <h2 class="text-h4 ms-5 text-wrap">Settings</h2>
          <div class="text-h6 ms-5 font-weight-light">Choose the set of nouns to play with</div>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <!-- SIDEBAR -->
          <v-col cols="12" md="4">
            <v-card variant="tonal" class="pa-1 ms-5">
              <v-card-title class="text-subtitle-1 font-weight-medium">
                Quick info
              </v-card-title>

              <v-list density="compact">
                <v-list-item>
                  <template #prepend><v-icon icon="mdi-pencil" /></template>
                  <v-list-item-title class="text-wrap">Write the quantifier + noun</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend><v-icon icon="mdi-school-outline" /></template>
                  <v-list-item-title class="text-wrap">Mixed nouns = hardest</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend><v-icon icon="mdi-counter" /></template>
                  <v-list-item-title class="text-wrap">
                    Fixed to <strong>{{ selections.numRounds }}</strong> rounds
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <!-- MAIN -->
          <v-col cols="12" md="8">
            <v-card class="pa-2 ms-5 me-6" elevation="3" max-width="450px">
              <v-card-title class="font-weight-medium">
                Noun set
              </v-card-title>

              <!-- Option A: radio buttons -->
              <v-radio-group v-model="selections.variant" class="ms-2">
                <v-radio
                  label="Countable nouns only — for practice"
                  value="countable"
                />
                <v-radio
                  label="Uncountable nouns only — for practice"
                  value="uncountable"
                />
                <v-radio
                  label="All nouns (mixed) — the real challenge"
                  value="all"
                />
              </v-radio-group>

              <v-divider class="my-4" />

              <v-card-title class="font-weight-medium">
                Rounds
              </v-card-title>
              <div class="ms-4">
                Fixed to <strong>{{ selections.numRounds }}</strong> rounds
              </div>
            </v-card>
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
           <v-btn color="primary" @click="start" :disabled="!valid">
            Start Game
            </v-btn> 
        </div>
        
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['startGame'])

const selections = ref({
  variant: 'all',   // "countable" | "uncountable" | "all"
  numRounds: 24,
})

const valid = computed(() => !!selections.value.variant)

function start() {
  if (!valid.value) return
  emit('startGame', { ...selections.value })
}
</script>
