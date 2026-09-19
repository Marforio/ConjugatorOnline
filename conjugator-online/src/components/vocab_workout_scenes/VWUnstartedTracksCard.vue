<template>
  <v-card class="pa-4" rounded="lg" elevation="3">
    <div class="d-flex align-center justify-space-between">
      <div>
        <span class="text-h6 font-weight-medium me-3">Still to do</span>
        <span class="text-subtitle text-medium-emphasis">Lists you haven't started yet.</span>
        <div class="mt-1 text-caption text-medium-emphasis">
          <v-icon class="me-1">mdi-alert-box</v-icon>
          check with the teacher for the best time to start each list!
        </div>
      </div>

      <v-chip color="secondary" variant="tonal" class="font-weight-medium">
        {{ normalizedItems.length }}
      </v-chip>
    </div>

    <v-divider class="my-3" />

    <div v-if="normalizedItems.length === 0" class="text-caption text-medium-emphasis">
      Everything has been started 🎉
    </div>

    <div
      v-else
      class="d-flex flex-column ga-2"
      style="max-height: 300px; overflow-y: auto;"
    >
      <div
        v-for="it in normalizedItems"
        :key="it.key"
        class="d-flex align-center justify-space-between"
      >
        <div>
          <div class="font-weight-medium">{{ it.title }}</div>
          <div class="text-caption text-medium-emphasis">{{ it.subtitle }}</div>
        </div>

        <v-btn
          color="secondary"
          variant="outlined"
          size="small"
          class="me-3"
          @click="emitStart(it)"
        >
          Start
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

export type UnstartedTrackRow = {
  key: string;
  title: string;
  subtitle: string;
  listKey: string;
  listName?: string | null;
  level: string | null; // IMPORTANT: irregular verbs uses "essential" and "advanced" as separate tracks
  trackKey: string | null;
};

export type StartGamePayload = {
  // keep old + new for compatibility
  listId: string;
  listKey: string;

  level: string | null;
  trackKey: string | null;
  mode: "write";
  frontField?: string;
  backField?: string;
  quizCount?: number;
};

const props = defineProps<{
  items: UnstartedTrackRow[];
}>();

const emit = defineEmits<{
  (e: "start", payload: StartGamePayload): void;
}>();

const normalizedItems = computed<UnstartedTrackRow[]>(() => {
  return (props.items || []).map((it) => ({
    ...it,
    trackKey: it.trackKey ?? "default",
  }));
});

function emitStart(it: UnstartedTrackRow) {
  emit("start", {
    listId: it.listKey,   // compatibility with SceneManager
    listKey: it.listKey,  // compatibility with other components
    level: it.level,
    trackKey: it.trackKey ?? "default",
    mode: "write",
    frontField: "definition",
    backField: "term",
  });
}
</script>