<template>
  <div class="w-100 h-100 d-flex flex-column">
    <div class="text-caption text-center font-weight-medium text-grey-darken-2 mb-3">
      💡 {{ String(prompt.mode).toUpperCase() }}: {{ label }}
    </div>
    <div class="d-flex align-center ga-3 mb-2" :class="{ 'justify-center': prompt.mode === 'tag' }">
      <div class="text-center flex-shrink-0">
        <v-avatar :size="prompt.mode === 'tag' ? 110 : 80" class="border"><v-img src="/images/speaker_pics_resized/bob.jpg" cover /></v-avatar>
        <div class="text-caption font-weight-bold mt-1">Bob</div>
      </div>
      <v-card v-if="prompt.mode !== 'tag'" variant="outlined" class="pa-3 bg-white rounded-xl flex-grow-1 font-italic">
        {{ prompt.prompt }}
      </v-card>
    </div>
    <v-divider class="my-3" variant="dashed" />
    <v-card variant="outlined" class="pa-3 bg-white rounded-xl text-center">
      <span v-if="prompt.mode === 'echo'" class="font-italic">Really? </span>
      <span v-else-if="prompt.mode === 'agreement'" class="font-italic">What a coincidence! </span>
      <span v-else>"{{ prompt.prompt }}" </span>
      <span class="text-primary font-weight-black">________</span>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ prompt: any; settings?: Record<string, any> }>();
const label = computed(() => ({
  echo: "Echo Bob's comment to show interest or surprise",
  agreement: "Use 'so' or 'neither' to agree with Bob",
  tag: 'Add the missing tag to your question to Bob',
} as any)[props.prompt.mode] ?? '');
</script>