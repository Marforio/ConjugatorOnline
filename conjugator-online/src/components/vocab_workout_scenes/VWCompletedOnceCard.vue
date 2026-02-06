<template>
  <v-card class="pa-4" rounded="lg" elevation="3">
    <div class="d-flex align-center justify-space-between">
      <div>
        <div class="text-h6 font-weight-medium">Completed 1×</div>
        <div class="text-caption text-medium-emphasis">
          Tracks you’ve finished at least once.
        </div>
      </div>

      <v-chip color="success" variant="tonal" class="font-weight-medium">
        {{ items.length }}
      </v-chip>
    </div>

    <v-divider class="my-3" />

    <div v-if="items.length === 0" class="text-caption text-medium-emphasis">
      Nothing completed yet — you’re getting started.
    </div>

    <div v-else class="d-flex flex-wrap ga-2" style="max-height: 200px; overflow-y: auto;">
      <v-chip
        v-for="it in items"
        :key="it.key"
        color="success"
        variant="outlined"
        class="text-caption"
      >
        {{ it.title }}
      </v-chip>
    </div>
  </v-card>
</template>

<script setup lang="ts">
export type TrackBadgeItem = {
  key: string;   // unique: e.g. `${listKey}::${mode}::${level ?? "null"}::${trackKey ?? "default"}`
  title: string; // human label shown in chip
};

defineProps<{
  items: TrackBadgeItem[];
}>();
</script>
