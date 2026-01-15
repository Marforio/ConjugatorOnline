// VerbMixerPoolBuilder.ts

import type {
  GrammarCategory,
  GrammarExercise,
  NormalizedPrompts,
} from "./VerbMixerPromptEngine";

/* ------------------------------------------------------------------
 * SETTINGS
 * ------------------------------------------------------------------ */

export const ROUND_COUNT = 30;

export type ComplementMode = "infinitive" | "gerund" | "mixed";

export interface BuildRoundSetSettings {
  mode?: ComplementMode; // default "mixed"
}

/* ------------------------------------------------------------------
 * MASTER DISTRIBUTION WEIGHTS (for 30 rounds)
 * These are the SAME percentages you originally used.
 * We will apply them to the selected pool by:
 *   1) filtering prompts by mode (inf/ger/mixed)
 *   2) keeping only categories that exist in that filtered pool
 *   3) renormalizing weights over the remaining categories
 *   4) allocating integer counts using Largest Remainder method
 * ------------------------------------------------------------------ */

export const DISTRIBUTION_WEIGHTS: Record<GrammarCategory, number> = {
  infinitive_only: 0.22,
  gerund_only: 0.22,
  causative_bare_infinitive: 0.05,
  special_expressions: 0.08,
  no_change_meaning: 0.10,
  change_meaning: 0.10,
  prepositions: 0.10,
  adjectives: 0.05,
  gerund_subject: 0.04,
  gerund_purpose: 0.02,
  infinitive_purpose: 0.02,
};

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
 * UTIL: sample n from a list (repeat if needed)
 * ------------------------------------------------------------------ */

export function samplePrompts(pool: GrammarExercise[], n: number): GrammarExercise[] {
  if (!Array.isArray(pool) || pool.length === 0 || n <= 0) return [];

  const a = shuffle(pool);
  const out: GrammarExercise[] = [];
  let idx = 0;

  while (out.length < n) {
    out.push({ ...a[idx % a.length] });
    idx++;
  }

  return out;
}

/* ------------------------------------------------------------------
 * COMPLEMENT FILTER
 * mode:
 *   - "infinitive": include anything whose complement contains "infinitive"
 *                   (includes "bare infinitive" + "infinitive or gerund")
 *   - "gerund": include anything whose complement contains "gerund"
 *               (includes "gerund (purpose)" + "infinitive or gerund")
 *   - "mixed": include everything
 * ------------------------------------------------------------------ */

function normalizeStr(s: any): string {
  return String(s ?? "").trim().toLowerCase();
}

export function matchesMode(ex: GrammarExercise, mode: ComplementMode): boolean {
  if (mode === "mixed") return true;

  const comp = normalizeStr(ex.complement);

  if (mode === "infinitive") return comp.includes("infinitive");
  return comp.includes("gerund");
}

/* ------------------------------------------------------------------
 * BUILD FILTERED POOLS BY CATEGORY
 * ------------------------------------------------------------------ */

export function buildCategoryPools(
  normalized: NormalizedPrompts,
  mode: ComplementMode
): Record<GrammarCategory, GrammarExercise[]> {
  const out = {} as Record<GrammarCategory, GrammarExercise[]>;

  (Object.keys(DISTRIBUTION_WEIGHTS) as GrammarCategory[]).forEach((cat) => {
    const pool = normalized.byCategory?.[cat] || [];
    out[cat] = pool.filter((p) => matchesMode(p, mode));
  });

  return out;
}

/* ------------------------------------------------------------------
 * ALLOCATE COUNTS (Largest Remainder / Hamilton method)
 * Steps:
 *  1) Keep only categories with pool length > 0 AND weight > 0
 *  2) Renormalize weights among remaining categories
 *  3) Compute exact = weight * ROUND_COUNT
 *  4) floor them and distribute remaining by largest fractional parts
 * ------------------------------------------------------------------ */

export function allocateCounts(
  poolsByCat: Record<GrammarCategory, GrammarExercise[]>,
  total: number = ROUND_COUNT
): Record<GrammarCategory, number> {
  const cats = (Object.keys(DISTRIBUTION_WEIGHTS) as GrammarCategory[])
    .filter((cat) => (DISTRIBUTION_WEIGHTS[cat] ?? 0) > 0)
    .filter((cat) => (poolsByCat[cat]?.length ?? 0) > 0);

  // If nothing is available, return all zeros
  const counts: Record<GrammarCategory, number> = {} as any;
  (Object.keys(DISTRIBUTION_WEIGHTS) as GrammarCategory[]).forEach((c) => (counts[c] = 0));

  if (cats.length === 0) return counts;

  // Renormalize weights
  const sumW = cats.reduce((acc, c) => acc + DISTRIBUTION_WEIGHTS[c], 0);
  const normW = cats.map((c) => ({
    cat: c,
    w: DISTRIBUTION_WEIGHTS[c] / sumW,
  }));

  // Largest remainder allocation
  const exact = normW.map(({ cat, w }) => ({ cat, exact: w * total }));
  const base = exact.map(({ cat, exact }) => ({ cat, base: Math.floor(exact), frac: exact - Math.floor(exact) }));

  let used = base.reduce((acc, x) => acc + x.base, 0);
  let remaining = total - used;

  // Initialize with base
  base.forEach((x) => (counts[x.cat] = x.base));

  // Distribute remaining by highest fractional part
  base
    .sort((a, b) => b.frac - a.frac)
    .forEach((x) => {
      if (remaining <= 0) return;
      counts[x.cat] += 1;
      remaining -= 1;
    });

  // Safety: ensure total is exactly 'total'
  const finalSum = cats.reduce((acc, c) => acc + counts[c], 0);
  if (finalSum !== total) {
    // If we somehow overshot/undershot, patch the biggest pool category
    const biggest = cats.slice().sort((a, b) => (poolsByCat[b].length - poolsByCat[a].length))[0];
    counts[biggest] += (total - finalSum);
  }

  return counts;
}

/* ------------------------------------------------------------------
 * BUILD ROUND SET
 * 1) Filter to mode
 * 2) Allocate counts using the distribution weights (renormalized)
 * 3) Sample per category (repeat allowed)
 * 4) Shuffle final 30
 * ------------------------------------------------------------------ */

export function buildRoundSet(
  normalized: NormalizedPrompts,
  settings?: BuildRoundSetSettings
): GrammarExercise[] {
  const mode: ComplementMode = settings?.mode ?? "mixed";

  const poolsByCat = buildCategoryPools(normalized, mode);
  const countsByCat = allocateCounts(poolsByCat, ROUND_COUNT);

  const out: GrammarExercise[] = [];

  (Object.keys(DISTRIBUTION_WEIGHTS) as GrammarCategory[]).forEach((cat) => {
    const n = countsByCat[cat] || 0;
    if (n <= 0) return;
    const pool = poolsByCat[cat] || [];
    out.push(...samplePrompts(pool, n));
  });

  return shuffle(out).slice(0, ROUND_COUNT);
}
