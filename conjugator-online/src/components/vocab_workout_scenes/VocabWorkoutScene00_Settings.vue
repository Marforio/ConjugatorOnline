<template>
  <v-container class="pa-6">
    <v-card class="mx-auto my-auto px-3 py-1" max-width="780">
      <v-card-title class="mb-2">
        <div>
          <div class="d-flex justify-center">
            <v-img src="/images/banners/VocabWorkout1.png" max-width="420" />
          </div>
          <h2 class="text-h4 ms-2 text-wrap">VocabWorkout</h2>
          <div class="text-h6 ms-2 font-weight-light">Choose mode + study pair</div>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-card-title class="font-weight-medium">Mode</v-card-title>
            <v-radio-group v-model="selections.mode" class="ms-2" density="compact">
              <v-radio label="Cards (flip)" value="cards" />
              <v-radio label="Writing" value="write" />
              <v-radio label="Multiple choice" value="multiple_choice" />
              <v-radio label="Quiz (subset)" value="quiz" />
            </v-radio-group>

            <div v-if="selections.mode === 'quiz'" class="ms-2 mt-2">
              <div class="text-caption mb-1">Quiz size</div>
              <v-slider
                v-model="selections.quizCount"
                min="5"
                max="30"
                step="1"
                density="compact"
                hide-details
              />
              <div class="text-caption">Questions: <strong>{{ selections.quizCount }}</strong></div>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-card-title class="font-weight-medium">Verb set</v-card-title>
            <v-radio-group v-model="selections.level" class="ms-2" density="compact">
              <v-radio label="All" value="all" />
              <v-radio label="Essential" value="essential" />
              <v-radio label="Advanced" value="advanced" />
            </v-radio-group>
          </v-col>

          <v-col cols="12" md="4">
            <v-card-title class="font-weight-medium">Study pair</v-card-title>

            <v-select
              v-model="selections.frontField"
              :items="frontOptions"
              label="Show (front)"
              density="compact"
              class="mb-3"
            />

            <v-select
              v-model="selections.backField"
              :items="backOptions"
              label="Answer (back)"
              density="compact"
            />

            <div class="text-caption text-medium-emphasis mt-3 ms-1">
              Example: show <strong>Definition</strong>, answer <strong>Past simple</strong>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="pb-4">
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

const frontOptions = [
  { title: "Term (infinitive)", value: "term" },
  { title: "Definition", value: "definition" },
  { title: "French", value: "French" },
  { title: "German", value: "German" },
  { title: "Italian", value: "Italian" },
];

const backOptions = [
  { title: "Term (headword)", value: "term" },
  { title: "Definition", value: "definition" },
  { title: "French", value: "French" },
  { title: "German", value: "German" },
  { title: "Italian", value: "Italian" },
  { title: "Past simple", value: "past_simple" },
  { title: "Present perfect", value: "present_perfect" },
];


const selections = ref({
  mode: "cards",
  level: "all",
  frontField: "definition",
  backField: "past_simple",
  quizCount: 15,
});

const valid = computed(() => {
  if (!selections.value.mode) return false;
  if (!selections.value.level) return false;
  if (!selections.value.frontField) return false;
  if (!selections.value.backField) return false;
  return true;
});

function start() {
  if (!valid.value) return;
  emit("startGame", { ...selections.value });
}
</script>
