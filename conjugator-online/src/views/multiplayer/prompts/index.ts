import type { Component } from 'vue';

import ConjugationPrompt from './ConjugationPrompt.vue';
import ComparisonPrompt from './ComparisonPrompt.vue';
import PronounPrompt from './PronounPrompt.vue';

import PassivePrompt from './PassivePrompt.vue';
import RegretPrompt from './RegretPrompt.vue';
import QuantifierPrompt from './QuantifierPrompt.vue';
import ParallelPrompt from './ParallelPrompt.vue';
import VerbMixerPrompt from './VerbMixerPrompt.vue';
import Year2040Prompt from './Year2040Prompt.vue';
import TrickyTranslatorPrompt from './TrickyTranslatorPrompt.vue';
import IdeaLinkerPrompt from './IdeaLinkerPrompt.vue';
import ReportedSpeechPrompt from './ReportedSpeechPrompt.vue';
import AuxiliariesPrompt from './AuxiliariesPrompt.vue';
import WordFamiliesPrompt from './WordFamiliesPrompt.vue';

import GenericPrompt from './GenericPrompt.vue';

const BODIES: Record<string, Component> = {
  Conjugator: ConjugationPrompt,
  Comparison: ComparisonPrompt,
  'Pronoun Practice': PronounPrompt,
  'Passive Party': PassivePrompt,
  'Regret Machine': RegretPrompt,
  'Quantifier Quest': QuantifierPrompt,
  'Parallel Universe': ParallelPrompt,
  'Verb Mixer': VerbMixerPrompt,
  'Year 2040': Year2040Prompt,
  'Tricky Translator': TrickyTranslatorPrompt,
  'Idea Linker': IdeaLinkerPrompt,
  'Reported Speech': ReportedSpeechPrompt,
  'Uses Of Auxiliaries': AuxiliariesPrompt,
  'Word Families': WordFamiliesPrompt,
};

export const promptBodyFor = (game: string): Component => BODIES[game] ?? GenericPrompt;