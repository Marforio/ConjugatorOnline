<template>
  <div class="w-100 h-100 d-flex flex-column text-center">
    <div class="text-subtitle-2 text-grey-darken-1 text-left">Situation:</div>
    <div class="text-body-1 font-italic my-3" v-html="html" />
    <v-divider class="my-2" />
    <div class="d-flex justify-center ga-2 my-3">
      <v-chip color="primary" variant="flat" size="small">{{ prompt.modal }}</v-chip>
      <v-chip color="secondary" variant="flat" size="small">{{ prompt.verb }}</v-chip>
      <v-chip v-if="prompt.negative" color="error" variant="flat" size="small">Negative</v-chip>
    </div>
    <div class="text-h6 font-italic mt-auto">"{{ prompt.sentence }}"</div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { highlight } from './promptUtils';
const props = defineProps<{ prompt: any; settings?: Record<string, any> }>();
const html = computed(() => highlight(props.prompt.prompt, props.prompt.highlight));
</script>