import type { ParallelUniverseExercise, ConditionalType } from "./ParallelUniversePromptEngine";

export const ROUND_COUNT = 24;

export type VerbSetOption = "regular_essential" | "regular_advanced" | "all";

export interface BuildPoolSettings {
  verbSet: VerbSetOption;
  conditionalTypes: ConditionalType[]; // any combination
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
 * Build pool by settings
 * - filter conditional types
 * - filter verb set
 * - fallback for regular_advanced if advanced not found
 * ------------------------------------------------------------------ */

function applyVerbSet(all: ParallelUniverseExercise[], verbSet: VerbSetOption): ParallelUniverseExercise[] {
  if (verbSet === "all") return all;

  if (verbSet === "regular_essential") {
    return all.filter((p) => p.irreg_level === "regular" || p.irreg_level === "essential");
  }

  // regular_advanced
  const adv = all.filter((p) => p.irreg_level === "regular" || p.irreg_level === "advanced");
  if (adv.length > 0) return adv;

  // fallback if no advanced in dataset
  return all.filter((p) => p.irreg_level === "regular" || p.irreg_level === "essential");
}

export function buildPool(
  allPrompts: ParallelUniverseExercise[],
  settings: BuildPoolSettings
): ParallelUniverseExercise[] {
  const types = Array.isArray(settings?.conditionalTypes) ? settings.conditionalTypes : [];
  const typeFiltered =
    types.length === 0
      ? []
      : allPrompts.filter((p) => types.includes(p.conditional_type));

  const verbFiltered = applyVerbSet(typeFiltered, settings.verbSet);

  // last-resort fallback: if still empty, just return typeFiltered (or all)
  if (verbFiltered.length > 0) return verbFiltered;
  if (typeFiltered.length > 0) return typeFiltered;
  return allPrompts;
}

/* ------------------------------------------------------------------
 * Build round set (24)
 * - repeats if pool small
 * ------------------------------------------------------------------ */
export function buildRoundSet(pool: ParallelUniverseExercise[], n: number = ROUND_COUNT): ParallelUniverseExercise[] {
  if (!Array.isArray(pool) || pool.length === 0) return [];
  const shuffled = shuffle(pool);

  const out: ParallelUniverseExercise[] = [];
  let idx = 0;
  while (out.length < n) {
    out.push({ ...shuffled[idx % shuffled.length] });
    idx++;
  }
  return out;
}
