<template>
  <v-card class="pa-4" rounded="lg" elevation="3">
    <div class="d-flex align-center justify-space-between">
      <div>
        <div class="text-h6 font-weight-medium">Mastered 3x</div>
        <div class="text-caption text-medium-emphasis">
          Tracks you've completed three times at 3-week intervals.
        </div>
      </div>

      <v-chip color="amber-darken-2" variant="tonal" class="font-weight-medium">
        {{ items.length }}
      </v-chip>
    </div>

    <v-divider class="my-3" />

    <div v-if="items.length === 0" class="text-caption text-medium-emphasis">
      No “3×” completions yet — keep going!
    </div>

    <div v-else class="d-flex flex-wrap ga-2" style="max-height: 200px; overflow-y: auto;">
      <v-chip
        v-for="it in items"
        :key="it.key"
        color="amber-darken-2"
        variant="outlined"
        class="text-caption"
      >
        🏆 {{ it.title }}
      </v-chip>
    </div>
  </v-card>
</template>

<script setup lang="ts">
export type TrackBadgeItem = {
  key: string;
  title: string;
};

defineProps<{
  items: TrackBadgeItem[];
}>();
</script>
