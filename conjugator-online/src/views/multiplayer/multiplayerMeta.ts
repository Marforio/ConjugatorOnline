export interface GameMeta {
  label: string;
  icon: string;
  color: string;
  blurb: string;
  defaultSettings: Record<string, any>;
}

export const GAME_META: Record<string, GameMeta> = {
  Conjugator: {
    label: 'Conjugator', icon: 'mdi-pencil-box-multiple', color: '#6366f1',
    blurb: 'Conjugate verbs across tenses',
    defaultSettings: {
      verb_set: 'Basic 75',
      tenses: ['Present simple', 'Past simple'],
      sentence_types: ['Declarative', 'Negative', 'Question'],
    },
  },
  Comparison: {
    label: 'Comparison', icon: 'mdi-scale-balance', color: '#f59e0b',
    blurb: 'Comparatives and superlatives',
    defaultSettings: { partOfSpeech: 'mix', intensifiers: false },
  },
  'Passive Party': {
    label: 'Passive Party', icon: 'mdi-party-popper', color: '#ec4899',
    blurb: 'Active to passive voice',
    defaultSettings: { level: 'essential', tenseGroup: 'both' },
  },
  'Parallel Universe': {
    label: 'Parallel Universe', icon: 'mdi-infinity', color: '#8b5cf6',
    blurb: 'Conditional sentences',
    defaultSettings: { verbSet: 'regular_essential', conditionalTypes: ['first', 'second', 'third'] },
  },
  'Pronoun Practice': {
    label: 'Pronoun Practice', icon: 'mdi-account-switch', color: '#10b981',
    blurb: 'Pick the right pronoun',
    defaultSettings: { reviewMode: 'comprehensive' },
  },
  'Quantifier Quest': {
    label: 'Quantifier Quest', icon: 'mdi-counter', color: '#06b6d4',
    blurb: 'Many, much, few, little',
    defaultSettings: { variant: 'all' },
  },
  'Regret Machine': {
    label: 'Regret Machine', icon: 'mdi-history', color: '#ef4444',
    blurb: 'Should have, could have',
    defaultSettings: { level: 'essential' },
  },
  'Reported Speech': {
    label: 'Reported Speech', icon: 'mdi-message-reply-text', color: '#0ea5e9',
    blurb: 'Backshift direct speech',
    defaultSettings: { irregMode: 'essential' },
  },
  'Verb Mixer': {
    label: 'Verb Mixer', icon: 'mdi-shuffle-variant', color: '#84cc16',
    blurb: 'Infinitive or gerund?',
    defaultSettings: { mode: 'mixed', singleCategory: null },
  },
  'Year 2040': {
    label: 'Year 2040', icon: 'mdi-rocket-launch', color: '#14b8a6',
    blurb: 'Future continuous and perfect',
    defaultSettings: { mode: 'essential_mix' },
  },
};

export function gameMeta(name?: string | null): GameMeta {
  return (
    GAME_META[name ?? ''] ?? {
      label: name ?? 'Game', icon: 'mdi-gamepad-variant', color: '#64748b',
      blurb: '', defaultSettings: {},
    }
  );
}

export function defaultSettingsFor(name: string) {
  return JSON.parse(JSON.stringify(gameMeta(name).defaultSettings));
}

export const STATUS_META: Record<string, { label: string; color: string }> = {
  waiting: { label: 'Waiting', color: 'warning' },
  in_progress: { label: 'Live', color: 'success' },
  finished: { label: 'Finished', color: 'grey' },
};
export const statusMeta = (s?: string | null) => STATUS_META[s ?? ''] ?? { label: s ?? '?', color: 'grey' };

export const PLAYER_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];
export const playerColor = (i: number) => PLAYER_COLORS[i % PLAYER_COLORS.length];
export const MEDALS = ['🥇', '🥈', '🥉'];