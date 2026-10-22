<template>
  <div class="w-100 h-100 d-flex flex-column text-center">
    <div class="d-flex align-center justify-center mb-4 text-body-1 text-uppercase text-grey-darken-1 font-weight-bold">
      ⏱ Tense: {{ prompt.tense }}
      <v-progress-circular v-if="continuous" indeterminate size="20" width="2" color="purple" class="ms-3" />
      <v-icon v-else icon="mdi-check-circle-outline" size="20" color="success" class="ms-3" />
    </div>
    <v-card variant="outlined" class="pa-4 bg-white">
      <div class="d-flex justify-center ga-2 mb-3">
        <v-chip color="secondary" size="small" variant="flat" class="text-uppercase font-weight-bold">{{ prompt.verb }}</v-chip>
        <v-chip v-if="prompt.negative" color="error" size="small" variant="flat">NEGATIVE</v-chip>
      </div>
      <div class="text-h6 font-italic">" {{ continuous ? 'In' : 'By' }} 2040, {{ prompt.sentence }} "</div>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ prompt: any; settings?: Record<string, any> }>();
const continuous = computed(() => !!props.prompt.tense?.includes('continuous'));
</script>