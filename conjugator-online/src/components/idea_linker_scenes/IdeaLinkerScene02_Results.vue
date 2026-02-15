<!-- src/components/idea_linker/idea_linker_scenes/IdeaLinkerScene02_Results.vue -->
<template>
  <v-container fluid class="py-4 px-1 d-flex justify-center">
    <v-card class="p-4" width="700" min-height="600" elevation="2">
      <div class="p-3">
        <div class="d-flex justify-center mb-3">
          <v-img src="/images/banners/IdeaLinker.png" max-width="260" />
        </div>

        <div class="text-h6 text-center mb-4">Results</div>

        <v-list density="compact">
          <v-list-item>
            <template #prepend><v-icon icon="mdi-counter" /></template>
            <v-list-item-title>Total rounds: {{ payload?.total_rounds }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-check" /></template>
            <v-list-item-title>Correct: {{ payload?.correct_count }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-close" /></template>
            <v-list-item-title>Wrong: {{ payload?.wrong_count }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-timer-outline" /></template>
            <v-list-item-title>Avg time: {{ payload?.avg_time_per_prompt }} s</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider class="my-4" />

        <div class="text-subtitle-2 mb-2">Rounds</div>
        <v-table density="compact">
          <thead>
            <tr>
              <th>#</th>
              <th>Prompt</th>
              <th>Your answer</th>
              <th>Accepted answers</th>
              <th>✅/❌</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in (payload?.rounds || [])" :key="r.prompt_number">
              <td>{{ r.prompt_number }}</td>
              <td style="max-width: 280px; white-space: normal;">
                {{ r.question }}
              </td>
              <td>{{ r.user_answer }}</td>
              <td style="max-width: 220px; white-space: normal;">
                {{ r.correct_answer }}
              </td>
              <td>{{ r.is_correct ? "✅" : "❌" }}</td>
            </tr>
          </tbody>
        </v-table>

        <div class="d-flex justify-center mt-6">
          <RouterLink :to="{ name: 'games' }">
            <v-btn color="primary" variant="flat">Back to games</v-btn>
          </RouterLink>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
defineProps({
  payload: { type: Object, default: null },
});
</script>