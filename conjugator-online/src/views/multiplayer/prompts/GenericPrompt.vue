<template>
  <div class="d-flex flex-column align-center w-100 h-100 text-center">
    <v-chip v-if="prompt.verb" color="primary" class="font-weight-black mb-2">{{ prompt.verb }}</v-chip>
    <div class="flex-grow-1 d-flex align-center text-h6 font-italic">{{ main }}</div>
    <div class="d-flex flex-wrap ga-2 justify-center">
      <v-chip v-for="t in tags" :key="t" size="x-small" variant="tonal">{{ t }}</v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ prompt: any; settings?: Record<string, any> }>();
const main = computed(() => props.prompt.sentence ?? props.prompt.direct ?? props.prompt.active ?? props.prompt.question ?? '');
const tags = computed(() =>
  [props.prompt.tense, props.prompt.conditional_type, props.prompt.modal, props.prompt.speaker, props.prompt.category]
    .filter(Boolean).map(String)
);
</script>