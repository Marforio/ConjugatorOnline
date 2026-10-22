<template>
  <div class="w-100 h-100 d-flex flex-column text-center">
    <div class="text-right mb-3"><v-chip color="primary" size="x-small" label>BASE: {{ prompt.key }}</v-chip></div>
    <v-card variant="outlined" class="pa-4 bg-white">
      <v-chip color="blue-darken-3" variant="tonal" size="large" class="mb-3 font-weight-medium">{{ prompt.answer_verb }}</v-chip>
      <div class="text-h6 font-italic">{{ prompt.sentence }}</div>
    </v-card>
  </div>
</template>
<script setup lang="ts">
defineProps<{ prompt: any; settings?: Record<string, any> }>();
</script>