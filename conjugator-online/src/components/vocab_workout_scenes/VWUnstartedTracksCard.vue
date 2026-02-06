<template>
  <v-card class="pa-4" rounded="lg" elevation="3">
    <div class="d-flex align-center justify-space-between">
      <div>
        <span class="text-h6 font-weight-medium me-3">Still to do</span>
        <span class="text-subtitle text-medium-emphasis">Lists you haven't started yet. </span>
        <div class="mt-1 text-caption text-medium-emphasis">
          <v-icon class="me-1">mdi-alert-box</v-icon>
          check with the teacher for the best time to start each list!
        </div>
      </div>

      <v-chip color="secondary" variant="tonal" class="font-weight-medium">
        {{ items.length }}
      </v-chip>
    </div>

    <v-divider class="my-3" />

    <div v-if="items.length === 0" class="text-caption text-medium-emphasis">
      Everything has been started 🎉
    </div>

    <div
      v-else
      class="d-flex flex-column ga-2"
      style="max-height: 300px; overflow-y: auto;"
    >
      <div
        v-for="it in items"
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
export type UnstartedTrackRow = {
  key: string;
  title: string;
  subtitle: string;
  listKey: string;
  level: string | null;
  trackKey: string | null;
};

// ✅ what SettingsScene wants to receive
export type StartGamePayload = {
  listKey: string;
  level: string | null;
  trackKey: string | null;

  // ✅ enforce write-only at the source
  mode: "write";

  // ✅ defaults (SettingsScene can overwrite if it wants)
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

function emitStart(it: UnstartedTrackRow) {
  // ✅ minimal payload required to start
  // SettingsScene can merge its selected defaults if preferred
  emit("start", {
    listKey: it.listKey,
    level: it.level,
    trackKey: it.trackKey,
    mode: "write",

    // sensible defaults (optional, but prevents "missing settings" bugs)
    frontField: "definition",
    backField: "term",
  });
}
</script>
