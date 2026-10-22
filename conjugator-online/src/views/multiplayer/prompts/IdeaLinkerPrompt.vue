<template>
  <div class="w-100 h-100 d-flex flex-column">
    <div class="d-flex justify-space-between align-center mb-2 flex-wrap ga-1">
      <div class="d-flex ga-1">
        <v-chip size="x-small" color="primary" class="font-weight-bold text-uppercase">⛓ {{ prompt.variant || prompt.category }}</v-chip>
        <v-chip size="x-small" :color="color" class="font-weight-bold text-uppercase">{{ prompt.behavior }}</v-chip>
      </div>
      <v-chip v-if="prompt.excluded_linkers?.length" size="x-small" color="red-lighten-4" class="text-red-darken-4 font-weight-bold">
        🚫 {{ prompt.excluded_linkers.join(', ') }}
      </v-chip>
    </div>
    <v-card variant="flat" class="pa-5 bg-grey-lighten-4 border rounded-xl text-center">
      <div class="text-h6 font-italic">" {{ prompt.sentence }} "</div>
      <div v-if="prompt.translations" class="mt-3 d-flex justify-center flex-wrap ga-3 text-caption text-grey-darken-1">
        <span v-if="prompt.translations.French">🇫🇷 {{ prompt.translations.French.join(', ') }}</span>
        <span v-if="prompt.translations.German">🇩🇪 {{ prompt.translations.German.join(', ') }}</span>
        <span v-if="prompt.translations.Italian">🇮🇹 {{ prompt.translations.Italian.join(', ') }}</span>
      </div>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ prompt: any; settings?: Record<string, any> }>();
const color = computed(() => ({ 'sentence modifier': 'error', '+ noun phrase': 'info' } as any)[props.prompt.behavior] ?? 'success');
</script>