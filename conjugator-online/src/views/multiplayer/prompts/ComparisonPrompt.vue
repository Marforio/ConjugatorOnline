<template>
  <div class="d-flex flex-column align-center w-100 h-100 text-center">
    <div class="d-flex justify-center align-center ga-3">
      <div class="d-flex flex-column align-center">
        <v-avatar size="110" rounded="lg" class="border bg-white">
          <v-img :src="pic(prompt.person_A)" cover />
        </v-avatar>
        <div class="text-caption font-weight-bold mt-1">{{ prompt.person_A }}</div>
      </div>

      <v-avatar v-if="symbol" color="primary-lighten-5" size="40" class="border">
        <v-icon color="primary">{{ symbol }}</v-icon>
      </v-avatar>

      <div v-if="hasSecond" class="d-flex flex-column align-center">
        <v-avatar size="110" rounded="lg" class="border bg-white">
          <v-img :src="pic(prompt.person_B)" cover />
        </v-avatar>
        <div class="text-caption font-weight-bold mt-1">{{ prompt.person_B }}</div>
      </div>
    </div>

    <div class="d-flex justify-center align-center ga-2 my-2 flex-wrap">
      <v-chip v-if="settings?.intensifiers && prompt.target_form !== 'equality'" size="x-small" color="error" label class="font-weight-black">INTENSIFY</v-chip>
      <v-chip v-if="superChip" size="small" color="amber-darken-2" class="text-white font-weight-bold">{{ superChip }}</v-chip>
      <v-chip size="small" color="info" class="text-uppercase font-weight-bold">{{ prompt.word }}</v-chip>
    </div>

    <div class="text-body-1 font-italic mt-auto">
      <span class="text-capitalize">{{ prompt.person_A }}</span>
      <template v-if="prompt.part_of_speech === 'adverb'"> {{ prompt.prompt }}</template>
      <template v-else> is</template>
      ________<template v-if="hasSecond"> {{ prompt.person_B }}</template>.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ prompt: any; settings?: Record<string, any> }>();

const pic = (n?: string) => (n ? `/images/vocab/${n.toLowerCase()}.jpg` : '');
const form = computed(() => props.prompt.target_form);
const hasSecond = computed(() => ['comparative', 'comparison_less', 'equality'].includes(form.value));
const symbol = computed(() =>
  ({ comparison_less: 'mdi-code-less-than', comparative: 'mdi-code-greater-than', equality: 'mdi-equal' } as any)[form.value] ?? null
);
const superChip = computed(() => ({ superlative_least: 'MIN', superlative: 'MAX' } as any)[form.value] ?? null);
</script>