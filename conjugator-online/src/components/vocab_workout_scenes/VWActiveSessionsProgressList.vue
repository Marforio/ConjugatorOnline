<template>
  <v-card class="pa-4 m-2" rounded="lg" elevation="3">
    <div class="d-flex align-center justify-space-between">
      <div>
        <div class="text-h6 font-weight-medium">Active sessions in 'write' mode</div>
        <div class="text-caption text-medium-emphasis">
          Continue where you left off.
        </div>
      </div>

      <v-btn variant="text" @click="$emit('refresh')" :loading="loading">
        Refresh
      </v-btn>
    </div>

    <v-divider class="my-4" />

    <div v-if="error" class="text-error text-caption mb-2">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center py-6">
      <v-progress-circular indeterminate />
    </div>

    <div v-else>
      <div v-if="rows.length === 0" class="text-caption text-medium-emphasis">
        No active sessions right now.
      </div>

      <v-expansion-panels multiple class="w-100">
        <v-expansion-panel
          v-for="[title, subtitleMap] in grouped"
          :key="title"
          class="w-100"
        >
          <v-expansion-panel-title>
            <span class="text-h6">{{ title }}</span>
          </v-expansion-panel-title>

          <v-expansion-panel-text class="pa-4">
          <div
            v-for="[subtitle, group] in subtitleMap"
            :key="subtitle"
            class="mb-6"
          >
            <div class="text-subtitle-1 mb-1 text-center">
              {{ subtitle }}
            </div>

            <!-- Display subgroup stats ONCE -->
            <div class="text-caption text-medium-emphasis text-center mb-3">
              <span class="me-2">✅ {{ group.stats.correct }}</span>
              <span class="me-2">❌ {{ group.stats.wrong }}</span>
              ({{ group.stats.accuracy }}% acc.)
            </div>
            <div>There <span v-if="group.rows.length === 1">is </span><span v-else>are </span>{{ group.rows.length }} active <span v-if="group.rows.length === 1">session </span><span v-else>sessions </span> for this list.</div>
            <div>This list has been completed {{ group.stats.completed }} times.</div>

            <!-- Now list the individual session cards -->
            <div class="d-flex flex-column align-center ga-4 w-100">
              <div
                v-for="row in group.rows"
                :key="row.key"
                class="session-card w-100"
              >
                <v-progress-linear
              :model-value="row.progressPct"
              height="10"
              class="mt-2"
              rounded-bar
              striped
              color="info"
            />
            <div class="text-caption text-medium-emphasis">
                  This session is {{ row.progressPct }}% finished
              </div>

            <div class="d-flex justify-end ga-2 mt-2">
              <v-btn
                v-if="row.canContinue"
                color="primary"
                variant="flat"
                @click="$emit('continue', row.continueSessionId!)"
              >
                Continue session
              </v-btn>

              <v-btn
                color="secondary"
                variant="outlined"
                @click="$emit('start', row.listKey, row.level, row.trackKey)"
              >
                Start new session
              </v-btn>
            </div>

            <v-divider class="mt-4" />
          </div>
              </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type ActiveWorkRow = {
  key: string;
  title: string;
  subtitle: string;
  correct: number;
  wrong: number;
  accuracy: number;
  completed: number;
  progressPct: number;
  canContinue: boolean;
  continueSessionId: number | null;
  listKey: string;
  level: string | null;
  trackKey: string | null;
};

const props = defineProps<{
  rows: ActiveWorkRow[];
  loading: boolean;
  error: string | null;
  completionTarget: number;
}>();

defineEmits<{
  (e: "refresh"): void;
  (e: "continue", sessionId: number): void;
  (e: "start", listKey: string, level: string | null, trackKey: string | null ): void;
}>();

const grouped = computed(() => {
  const groups = new Map<
    string, // title
    Map<
      string, // subtitle
      {
        stats: {
          correct: number;
          wrong: number;
          accuracy: number;
          completed: number;
        };
        rows: ActiveWorkRow[];
      }
    >
  >();

  for (const row of props.rows) {
    if (!groups.has(row.title)) {
      groups.set(row.title, new Map());
    }

    const subtitleMap = groups.get(row.title)!;

    if (!subtitleMap.has(row.subtitle)) {
      subtitleMap.set(row.subtitle, {
        stats: {
          correct: row.correct,
          wrong: row.wrong,
          accuracy: row.accuracy,
          completed: row.completed
        },
        rows: [],
      });
    }

    subtitleMap.get(row.subtitle)!.rows.push(row);
  }

  return groups;
});

</script>

<style scoped>
/* Prevent horizontal scroll */
.v-expansion-panel-text {
  overflow-x: hidden;
}

/* Ensure cards never overflow */
.session-card {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  overflow-x: hidden;
}
</style>
