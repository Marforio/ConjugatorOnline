<template>
  <div class="w-100 h-100 d-flex flex-column text-center">
    <div class="d-flex justify-space-between align-center mb-3">
      <div class="text-caption text-uppercase text-grey-darken-1 font-weight-medium">
        {{ prompt.condition ? 'Condition (if clause)' : 'Consequence (main clause)' }}
      </div>
      <v-chip color="secondary" size="x-small" class="text-uppercase font-weight-bold">{{ prompt.conditional_type }} conditional</v-chip>
    </div>
    <v-card variant="outlined" class="pa-4 bg-white">
      <div class="d-flex justify-center align-center ga-2 mb-3 flex-wrap">
        <v-chip color="primary" variant="flat" size="small" class="text-uppercase font-weight-bold">{{ prompt.verb }}</v-chip>
        <v-chip v-if="prompt.negative" color="error" variant="flat" size="small">NEGATIVE</v-chip>
        <v-chip variant="outlined" size="small" class="font-italic">{{ kind }}</v-chip>
      </div>
      <div class="text-h6 font-italic">{{ prompt.sentence }}</div>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ prompt: any; settings?: Record<string, any> }>();
const kind = computed(() =>
  ({ first: 'reality', second: 'unreal present/future' } as any)[props.prompt.conditional_type] ?? 'unreal past');
</script>