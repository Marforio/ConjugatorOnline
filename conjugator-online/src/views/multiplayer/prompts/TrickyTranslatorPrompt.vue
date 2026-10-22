<template>
  <div class="w-100 h-100 d-flex flex-column">
    <div class="d-flex justify-space-between align-center mb-2">
      <div class="text-caption text-uppercase font-weight-bold text-grey">📂 {{ prompt.category }}</div>
      <v-chip size="x-small" color="purple" variant="flat" class="text-uppercase font-weight-bold">{{ prompt.source_language }}</v-chip>
    </div>
    <v-card variant="flat" color="purple-lighten-5" class="pa-4 border text-center mb-3">
      <div class="text-caption text-purple font-weight-bold mb-1">TRANSLATE THE UNDERLINED PART</div>
      <div class="text-h6" v-html="html" />
    </v-card>
    <v-card variant="outlined" class="pa-4 bg-white text-center">
      <div class="text-caption text-grey font-weight-bold mb-1">TARGET SENTENCE</div>
      <div class="text-h6 font-italic">" {{ prompt.target_sentence }} "</div>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { esc } from './promptUtils';
const props = defineProps<{ prompt: any; settings?: Record<string, any> }>();
const U = 'text-decoration-underline font-weight-black text-purple-darken-3';
const html = computed(() => {
  const s: string = props.prompt.source_sentence ?? '';
  const h: string = props.prompt.source_highlight ?? '';
  if (!h) return esc(s);
  let out = esc(s);
  for (const part of h.split('...').map((x) => x.trim()).filter(Boolean)) {
    const e = esc(part);
    out = out.replace(e, `<span class="${U}">${e}</span>`);
  }
  return out;
});
</script>