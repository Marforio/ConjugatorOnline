// src/assets/scripts/year_2040/Year2040PoolBuilder.ts

import type { Year2040Exercise, IrregLevel } from "./Year2040PromptEngine";

export const ROUND_COUNT = 24;

export type Year2040Mode = "essential_mix" | "advanced_mix" | "all";

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
 * - essential_mix: regular + essential
 * - advanced_mix: regular + advanced
 * - all: everything
 * If requested irreg group is empty, fallback to "regular + whatever exists"
 * ------------------------------------------------------------------ */

export interface BuildPoolSettings {
  mode?: Year2040Mode;
}

export function buildPool(all: Year2040Exercise[], settings?: BuildPoolSettings): Year2040Exercise[] {
  const mode: Year2040Mode = settings?.mode ?? "all";

  if (!Array.isArray(all) || all.length === 0) return [];

  if (mode === "all") return all;

  const wantIrreg: IrregLevel = mode === "essential_mix" ? "essential" : "advanced";

  const regular = all.filter((p) => p.irreg_level === "regular");
  const irreg = all.filter((p) => p.irreg_level === wantIrreg);

  // If the requested irreg bucket is empty (e.g. advanced not yet added),
  // just use regular + any irregs you *do* have (so game still starts).
  if (irreg.length === 0) {
    const anyIrregs = all.filter((p) => p.irreg_level !== "regular");
    return [...regular, ...anyIrregs];
  }

  return [...regular, ...irreg];
}

/* ------------------------------------------------------------------
 * BUILD ROUND SET (exactly 24, repeat if needed)
 * ------------------------------------------------------------------ */

export function buildRoundSet(pool: Year2040Exercise[], n: number = ROUND_COUNT): Year2040Exercise[] {
  if (!Array.isArray(pool) || pool.length === 0 || n <= 0) return [];

  const shuffled = shuffle(pool);
  const out: Year2040Exercise[] = [];

  let idx = 0;
  while (out.length < n) {
    const p = shuffled[idx % shuffled.length];
    out.push({ ...p }); // shallow clone
    idx++;
  }

  return shuffle(out).slice(0, n);
}
