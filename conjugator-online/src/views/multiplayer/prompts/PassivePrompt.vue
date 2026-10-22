<template>
  <div class="w-100 h-100 d-flex flex-column">
    <div class="d-flex justify-space-between align-center mb-2">
      <div class="text-caption text-grey-darken-1">Convert to passive voice</div>
      <v-chip color="secondary" size="x-small" variant="flat">⏱ {{ prompt.tense }}</v-chip>
    </div>
    <v-card variant="outlined" class="pa-3 bg-white">
      <div class="text-caption text-uppercase font-weight-bold text-grey">Active</div>
      <div class="text-body-1 font-italic mb-2" v-html="html" />
      <v-divider class="my-2" />
      <div class="text-caption text-uppercase font-weight-bold text-grey">Passive</div>
      <div class="text-body-1 font-weight-medium text-blue-darken-3">"{{ prompt.passive }}"</div>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { highlight } from './promptUtils';
const props = defineProps<{ prompt: any; settings?: Record<string, any> }>();
const html = computed(() => highlight(props.prompt.active, props.prompt.highlight, 'font-weight-bold text-error'));
</script>