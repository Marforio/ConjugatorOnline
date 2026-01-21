// src/assets/scripts/regret_machine/RegretMachinePoolBuilder.ts

import type { NormalizedPrompts, RegretExercise, RegretLevel } from "./RegretMachinepromptEngine";

export const ROUND_COUNT = 20;

export interface BuildPoolSettings {
  level: "essential" | "advanced" | "both";
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
 * - essential: essential only
 * - advanced: advanced only (fallback to essential if none)
 * - both: essential + advanced (if no advanced, only essential)
 * ------------------------------------------------------------------ */

export function buildPool(
  normalized: NormalizedPrompts,
  settings: BuildPoolSettings
): RegretExercise[] {
  const level = settings?.level ?? "essential";

  const essentials = normalized.byCategory.essential || [];
  const advs = normalized.byCategory.advanced || [];

  if (level === "essential") return [...essentials];

  if (level === "advanced") {
    return advs.length > 0 ? [...advs] : [...essentials];
  }

  // both
  return advs.length > 0 ? [...essentials, ...advs] : [...essentials];
}

/* ------------------------------------------------------------------
 * SAMPLE n (repeat if pool smaller)
 * Same behavior as your other games.
 * ------------------------------------------------------------------ */

export function samplePrompts(pool: RegretExercise[], n: number = ROUND_COUNT): RegretExercise[] {
  if (!Array.isArray(pool) || pool.length === 0) return [];

  const shuffled = shuffle(pool);
  const out: RegretExercise[] = [];
  let idx = 0;

  while (out.length < n) {
    out.push({ ...shuffled[idx % shuffled.length] });
    idx++;
  }

  return out;
}
