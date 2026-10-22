<template>
  <div>
    <!-- Conjugator -->
    <div v-if="gameName === 'Conjugator'">
      <v-select v-model="s.verb_set" :items="verbSets" label="Verb set" variant="outlined" class="mb-3" />
      <v-select v-model="s.tenses" :items="allTenses" label="Tenses" multiple chips variant="outlined" class="mb-3" />
      <v-select v-model="s.sentence_types" :items="sentenceTypes" label="Sentence types" multiple chips variant="outlined" />
    </div>

    <!-- Comparison -->
    <div v-else-if="gameName === 'Comparison'">
      <div class="text-subtitle-2 mb-1">Categories</div>
      <v-radio-group v-model="s.partOfSpeech" density="compact">
        <v-radio label="Adjectives only" value="adjectives" />
        <v-radio label="Adverbs only" value="adverbs" />
        <v-radio label="Mix" value="mix" />
      </v-radio-group>
      <v-switch v-model="s.intensifiers" label="Require grammatical intensifiers" color="primary" inset density="compact" hide-details />
    </div>

    <!-- Passive Party -->
    <div v-else-if="gameName === 'Passive Party'">
      <div class="text-subtitle-2 mb-1">Verb difficulty</div>
      <v-radio-group v-model="s.level" inline class="mb-2">
        <v-radio label="Essential" value="essential" />
        <v-radio label="Advanced" value="advanced" />
      </v-radio-group>
      <v-select v-model="s.tenseGroup" variant="outlined" density="compact" label="Tense group"
                :items="[{ title: 'Group 1 (Simple, Modals, Future)', value: 'group1' },
                         { title: 'Group 2 (Continuous, Perfect)', value: 'group2' },
                         { title: 'All tenses', value: 'both' }]" />
    </div>

    <!-- Parallel Universe -->
    <div v-else-if="gameName === 'Parallel Universe'">
      <div class="text-subtitle-2 mb-1">Verb set</div>
      <v-radio-group v-model="s.verbSet" density="compact">
        <v-radio label="Regular + Essential" value="regular_essential" />
        <v-radio label="Regular + Advanced" value="regular_advanced" />
        <v-radio label="All prompts" value="all" />
      </v-radio-group>
      <div class="text-subtitle-2 mb-1">Conditionals</div>
      <v-checkbox v-model="s.conditionalTypes" value="first" label="First (present reality)" density="compact" hide-details />
      <v-checkbox v-model="s.conditionalTypes" value="second" label="Second (unreal present)" density="compact" hide-details />
      <v-checkbox v-model="s.conditionalTypes" value="third" label="Third (unreal past)" density="compact" hide-details />
    </div>

    <!-- Pronoun Practice -->
    <div v-else-if="gameName === 'Pronoun Practice'" class="text-body-2 text-medium-emphasis">
      Nothing to configure. Questions cover all pronoun categories.
    </div>

    <!-- Quantifier Quest -->
    <v-radio-group v-else-if="gameName === 'Quantifier Quest'" v-model="s.variant">
      <v-radio label="Countable nouns only" value="countable" />
      <v-radio label="Uncountable nouns only" value="uncountable" />
      <v-radio label="All nouns (the real challenge)" value="all" />
    </v-radio-group>

    <!-- Regret Machine -->
    <v-select v-else-if="gameName === 'Regret Machine'" v-model="s.level" variant="outlined" density="compact" label="Verb set"
              :items="[{ title: 'Essential verbs', value: 'essential' },
                       { title: 'Advanced verbs', value: 'advanced' },
                       { title: 'All', value: 'both' }]" />

    <!-- Reported Speech -->
    <v-radio-group v-else-if="gameName === 'Reported Speech'" v-model="s.irregMode" density="compact">
      <v-radio label="Essential irregular verbs" value="essential" />
      <v-radio label="Advanced irregular verbs" value="advanced" />
      <v-radio label="Both" value="both" />
    </v-radio-group>

    <!-- Verb Mixer -->
    <div v-else-if="gameName === 'Verb Mixer'">
      <v-radio-group v-model="s.mode" density="compact">
        <v-radio label="Both categories" value="mixed" />
        <v-radio label="One category (warm-up)" value="single" />
      </v-radio-group>
      <v-select v-if="s.mode === 'single'" v-model="s.singleCategory" variant="outlined" density="compact" label="Category"
                :items="[{ title: 'Infinitive forms', value: 'infinitive' }, { title: 'Gerund (-ing) forms', value: 'gerund' }]" />
    </div>

    <!-- Year 2040 -->
    <v-radio-group v-else-if="gameName === 'Year 2040'" v-model="s.mode" density="compact">
      <v-radio label="Regular + Essential irregulars" value="essential_mix" />
      <v-radio label="Regular + Advanced irregulars" value="advanced_mix" />
      <v-radio label="All verbs" value="all" />
    </v-radio-group>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';

const props = defineProps<{ modelValue: Record<string, any>; gameName: string }>();
const emit = defineEmits<{ (e: 'validity', ok: boolean): void }>();

// Mutates the parent's reactive settings object in place
const s = computed(() => props.modelValue);

const verbSets = ['Basic 75', 'Advanced 100', 'All Verbs']; // must match backend VERB_SET_UNIVERSES keys
const allTenses = ['Present simple', 'Past simple', 'Future simple', 'Present continuous', 'Present perfect', 'Recommendation'];
const sentenceTypes = ['Declarative', 'Negative', 'Question'];

const valid = computed(() => {
  const v = props.modelValue;
  if (props.gameName === 'Conjugator') return !!v.tenses?.length && !!v.sentence_types?.length;
  if (props.gameName === 'Parallel Universe') return !!v.conditionalTypes?.length;
  return true;
});
watch(valid, (ok) => emit('validity', ok), { immediate: true });

watch(
  () => props.modelValue?.mode,
  (m) => {
    if (props.gameName !== 'Verb Mixer') return;
    props.modelValue.singleCategory = m === 'single' ? props.modelValue.singleCategory || 'infinitive' : null;
  }
);
</script>