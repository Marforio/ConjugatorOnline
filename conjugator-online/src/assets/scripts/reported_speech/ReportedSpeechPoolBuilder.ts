// src/assets/scripts/reported_speech/ReportedSpeechPoolBuilder.ts

import type {
  NormalizedPrompts,
  ReportedSpeechExercise,
} from "./ReportedSpeechPromptEngine";

/* ------------------------------------------------------------------
 * SETTINGS
 * ------------------------------------------------------------------ */

export type IrregMode = "essential" | "advanced" | "both" | "all";

export interface BuildPoolSettings {
  irregMode?: IrregMode; // which irregular verb prompts to include
}

/* ------------------------------------------------------------------
 * UTIL: shuffle
 * ------------------------------------------------------------------ */

export function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------
 * BUILD POOL
 * Always includes "none" (irreg_category === null).
 * Then includes essential/advanced depending on settings.
 * ------------------------------------------------------------------ */

export function buildPool(
  normalized: NormalizedPrompts,
  settings: BuildPoolSettings = {}
): ReportedSpeechExercise[] {
  const { irregMode = "both" } = settings;

  const none = normalized.byIrregCategory.none || [];
  const essential = normalized.byIrregCategory.essential || [];
  const advanced = normalized.byIrregCategory.advanced || [];

  if (irregMode === "essential") return [...none, ...essential];
  if (irregMode === "advanced") return [...none, ...advanced];

  // "both" and "all" behave the same
  return [...none, ...essential, ...advanced];
}

/* ------------------------------------------------------------------
 * SAMPLE n PROMPTS (with repeat if pool smaller)
 * Mirrors your passive sampler behavior.
 * ------------------------------------------------------------------ */

export function samplePrompts(pool: ReportedSpeechExercise[], n: number = 30): ReportedSpeechExercise[] {
  if (!Array.isArray(pool) || pool.length === 0) return [];

  const a = shuffle(pool);
  const out: ReportedSpeechExercise[] = [];
  let idx = 0;

  while (out.length < n) {
    out.push({ ...a[idx % a.length] });
    idx++;
  }

  return out;
}
