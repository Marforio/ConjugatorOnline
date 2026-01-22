<template>
  <v-container class="pa-6">
    <v-card class="mx-auto" max-width="860">
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <div class="text-h5">VocabWorkout Results</div>
          <div class="text-caption text-medium-emphasis">
            Mode: <strong>{{ results?.mode }}</strong> • Pair:
            <strong>{{ results?.front_field }}</strong> → <strong>{{ results?.back_field }}</strong>
          </div>
        </div>

        <RouterLink :to="{ name: 'games' }">
          <v-btn variant="outlined">Back to games</v-btn>
        </RouterLink>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div class="d-flex justify-space-between mb-3">
          <div>Correct: ✅ <strong>{{ results?.correct_count ?? 0 }}</strong></div>
          <div>Wrong: ❌ <strong>{{ results?.wrong_count ?? 0 }}</strong></div>
          <div>Total: <strong>{{ results?.total_items ?? 0 }}</strong></div>
        </div>

        <v-divider class="my-3" />

        <div class="text-subtitle-2 mb-2">Rounds</div>

        <v-table density="compact">
          <thead>
            <tr>
              <th>#</th>
              <th>Term</th>
              <th>Prompt (front)</th>
              <th>Your answer</th>
              <th>Expected</th>
              <th>✓</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in rounds" :key="i">
              <td>{{ i + 1 }}</td>
              <td><strong>{{ r.term }}</strong></td>
              <td class="text-wrap" style="max-width: 260px;">{{ r.prompt }}</td>
              <td>{{ r.user_answer }}</td>
              <td class="text-wrap" style="max-width: 220px;">{{ r.expected }}</td>
              <td>
                <span v-if="r.is_correct === true">✅</span>
                <span v-else-if="r.is_correct === false">❌</span>
                <span v-else>—</span>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  results: { type: Object, default: null },
});

const rounds = computed(() => Array.isArray(props.results?.rounds) ? props.results.rounds : []);
</script>
