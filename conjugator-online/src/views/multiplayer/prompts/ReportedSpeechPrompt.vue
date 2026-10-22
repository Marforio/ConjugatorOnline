<template>
  <div class="w-100 h-100 d-flex flex-column">
    <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1 mb-2">🗣 Yesterday's statement</div>
    <v-card variant="flat" class="pa-3 bg-grey-lighten-4 border mb-3">
      <div class="d-flex align-center ga-3">
        <div class="text-center flex-shrink-0">
          <v-avatar size="90" class="border"><v-img :src="speakerPic(prompt.speaker)" cover /></v-avatar>
          <div class="text-caption font-weight-bold text-uppercase mt-1">{{ prompt.speaker }}</div>
        </div>
        <div class="flex-grow-1 bg-white border pa-3 rounded-xl font-italic" v-html="bubble" />
      </div>
    </v-card>
    <div class="text-caption text-uppercase font-weight-bold text-grey-darken-1 mb-1">📰 Today's news</div>
    <v-card variant="outlined" class="pa-4 bg-white text-center">
      <div class="text-h6 font-italic">" Yesterday, {{ prompt.speaker }} {{ prompt.reporting_verb }} {{ prompt.reported }} "</div>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { highlight, speakerPic } from './promptUtils';
const props = defineProps<{ prompt: any; settings?: Record<string, any> }>();
const bubble = computed(() => `" ${highlight(props.prompt.direct, props.prompt.highlight)} "`);
</script>