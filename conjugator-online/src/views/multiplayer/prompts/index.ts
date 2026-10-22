import type { Component } from 'vue';
import ConjugationPrompt from './ConjugationPrompt.vue';
import PronounPrompt from './PronounPrompt.vue';
import ComparisonPrompt from './ComparisonPrompt.vue';
import GenericPrompt from './GenericPrompt.vue';

const BODIES: Record<string, Component> = {
  Conjugator: ConjugationPrompt,
  'Pronoun Practice': PronounPrompt,
  Comparison: ComparisonPrompt,
};

export const promptBodyFor = (game: string): Component => BODIES[game] ?? GenericPrompt;