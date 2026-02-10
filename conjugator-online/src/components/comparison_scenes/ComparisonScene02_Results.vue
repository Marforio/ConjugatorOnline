<!-- src/components/comparison/comparison_scenes/ComparisonScene02_Results.vue -->
<template>
  <v-container class="pa-4" v-if="results">
    <v-card class="mx-auto" max-width="900">
      <v-card-text>
        <h3 class="mb-2">Results</h3>

        <p class="mb-1">
          Score:
          <strong>{{ percent }}%</strong>
          ({{ results.correct_count }} / {{ results.total_rounds }})
        </p>

        <p class="text-caption">
          ⏱ Avg response time:
          <strong>{{ avgTime }} s</strong>
        </p>

        <v-divider class="my-4" />

        <div class="results-scroll">
          <div
            v-for="(r, i) in results.rounds"
            :key="i"
            class="mb-3 pa-3 result-card"
            :class="r.is_correct ? 'success-card' : 'error-card'"
          >
            <div><strong>Prompt {{ r.prompt_number }}:</strong> {{ r.question }}</div>
            <div>Correct: <strong>{{ r.correct_answer }}</strong></div>
            <div>Your answer: <strong>{{ r.user_answer || "—" }}</strong></div>
          </div>
        </div>

        <v-divider class="my-4" />

        <div class="d-flex justify-center align-center mt-4 gap-5">
          <v-btn @click="goToScene('ComparisonScene00_Start')">▶️ Play Again</v-btn>

          <router-link :to="{ path: '/dashboard', query: { tab: 'other-games', game: 'Comparison Challenge' } }">
            <v-btn>Go to Dashboard</v-btn>
          </router-link>

          <HomeButton />
        </div>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else class="text-center pa-6">
    <v-progress-circular indeterminate />
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import HomeButton from "@/components/HomeButton.vue";

const props = defineProps({
  results: { type: Object, default: null },
});

const emit = defineEmits(["changeScene"]);

function goToScene(sceneName) {
  emit("changeScene", sceneName);
}

const percent = computed(() => {
  if (!props.results) return 0;
  return Math.round((props.results.correct_count / props.results.total_rounds) * 100);
});

const avgTime = computed(() => {
  if (!props.results?.avg_time_per_prompt) return "—";
  return Number(props.results.avg_time_per_prompt).toFixed(2);
});
</script>

<style scoped>
.results-scroll {
  max-height: 360px;
  overflow-y: auto;
  padding-right: 8px;
}
.result-card {
  border-radius: 6px;
}
.success-card {
  border-left: 4px solid #4caf50;
  background: #f1f8f1;
}
.error-card {
  border-left: 4px solid #f44336;
  background: #fff4f4;
}
</style>