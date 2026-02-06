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

        <RouterLink :to="{ name: 'dashboard', query: { tab: 'vocabulary' } }">
          <v-btn variant="outlined">Go to dashboard</v-btn>
        </RouterLink>
        <v-btn @click="goToSettings">New session</v-btn>

      </v-card-title>

      <v-divider />

      <v-card-text>
        <div class="d-flex justify-space-between mb-3">
          <div class="d-flex justify-center">
            <div>This game: </div>
             <div>Correct: ✅ <strong>{{ results?.correct_count ?? 0 }}</strong></div>
              <div>Wrong: ❌ <strong>{{ results?.wrong_count ?? 0 }}</strong></div>
          </div>
         
          <div>Session total: <strong>{{ results?.total_items ?? 0 }} terms</strong></div>
          <v-btn>Show entire session results</v-btn>
        </div>

        <v-divider class="my-3" />

        <div class="text-subtitle-2 mb-2">This game's rounds</div>

        <v-table density="compact">
          <thead>
            <tr>
              <th>#</th>
              <th>Term</th>
              <th>Prompt</th>
              <th>Attempts</th>
              <th>Results</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(g, i) in groupedRounds" :key="i">
              <td>{{ i + 1 }}</td>

              <td><strong>{{ g.term }}</strong></td>

              <td class="text-wrap" style="max-width: 260px;">
                {{ g.prompt }}
              </td>

              <!-- Attempts: show user answers side by side -->
              <td>
                <div class="d-flex ga-2 flex-wrap">
                  <span
                    v-for="(a, j) in g.attempts"
                    :key="j"
                    class="text-caption"
                  >
                    {{ a.user_answer }}
                  </span>
                </div>
              </td>

              <!-- Correctness icons -->
              <td>
                <div class="d-flex ga-2">
                  <span
                    v-for="(a, j) in g.attempts"
                    :key="j"
                  >
                    <span v-if="a.is_correct === true">✅</span>
                    <span v-else-if="a.is_correct === false">❌</span>
                    <span v-else>—</span>
                  </span>
                </div>
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

const emit = defineEmits(["changeScene"]);

function goToSettings() {
  emit("changeScene", "VocabWorkoutScene00_Settings");
}

const groupedRounds = computed(() => {
  const rounds = Array.isArray(props.results?.rounds)
    ? props.results.rounds
    : [];

  const map = new Map();

  for (const r of rounds) {
    const key = r.prompt; // or r.item_id if you prefer grouping by item

    if (!map.has(key)) {
      map.set(key, {
        term: r.term,
        prompt: r.prompt,
        attempts: []
      });
    }

    map.get(key).attempts.push({
      user_answer: r.user_answer,
      expected: r.expected,
      is_correct: r.is_correct
    });
  }

  return Array.from(map.values());
});


const rounds = computed(() => Array.isArray(props.results?.rounds) ? props.results.rounds : []);
</script>
