// src/assets/scripts/word_families/WordFamilyPoolBuilder.ts

import type { WordFamilyRound } from "./WordFamilyPromptEngine";

export const ROUND_COUNT = 20;

/** What the UI selects */
export type TrackOption =
  | "all"
  | "architecture"
  | "business"
  | "chemical"
  | "civil"
  | "computer_science"
  | "mechanical"
  | "electrical";

/**
 * Map UI track -> dataset categories to include.
 * ✅ You said you'll finish defining this; here's a starter mapping that matches your examples.
 */
export const TRACK_CATEGORY_MAP: Record<TrackOption, string[]> = {
  all: [],
  architecture: ["arch", "dimensions and properties"],
  business: ["business", "general"],
  chemical: ["math and science", "dimensions and properties"],
  civil: ["arch", "dimensions and properties", "math and science"],
  computer_science: ["tech", "math and science"],
  mechanical: ["tech", "math and science", "dimensions and properties"],
  electrical: ["tech", "math and science", "dimensions and properties"],
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
 * Sample ALL available items (2–4)
 * ------------------------------------------------------------------ */
export function sampleRoundItems(base: WordFamilyRound): WordFamilyRound | null {
  if (!base?.items || base.items.length < 2) return null;

  return {
    ...base,
    id: `${base.key}::${Math.random().toString(36).slice(2, 9)}`,
    items: [...base.items], // ✅ keep all items
  };
}

/* ------------------------------------------------------------------
 * Build pool by track (or all)
 * ------------------------------------------------------------------ */
export interface BuildPoolSettings {
  track?: TrackOption; // UI selection
}

function normalizeCat(s: any) {
  return String(s ?? "").trim().toLowerCase();
}

export function buildPool(
  allBases: WordFamilyRound[],
  settings?: BuildPoolSettings
): WordFamilyRound[] {
  const track = settings?.track ?? "all";

  // All = no filtering (except ">=2 items")
  if (track === "all") {
    return allBases.filter((r) => Array.isArray(r.items) && r.items.length >= 2);
  }

  const allowed = new Set(
    (TRACK_CATEGORY_MAP[track] || []).map(normalizeCat)
  );

  const filtered = allBases.filter((r) =>
    allowed.has(normalizeCat(r.category))
  );

  return filtered.filter((r) => Array.isArray(r.items) && r.items.length >= 2);
}

/* ------------------------------------------------------------------
 * Build 20 rounds, with repeat if pool small
 * ------------------------------------------------------------------ */
export function buildRoundSet(
  basePool: WordFamilyRound[],
  n: number = ROUND_COUNT
): WordFamilyRound[] {
  if (!Array.isArray(basePool) || basePool.length === 0) return [];

  const shuffledBases = shuffle(basePool);
  const out: WordFamilyRound[] = [];
  let idx = 0;

  while (out.length < n) {
    const base = shuffledBases[idx % shuffledBases.length];
    const sampled = sampleRoundItems(base);
    if (sampled) out.push(sampled);
    idx++;
  }

  return out;
}

/* ------------------------------------------------------------------
 * UI options (exact labels you want)
 * ------------------------------------------------------------------ */
export const TRACK_OPTIONS: { title: string; value: TrackOption }[] = [
  { title: "All", value: "all" },
  { title: "Architecture", value: "architecture" },
  { title: "Business", value: "business" },
  { title: "Chemical", value: "chemical" },
  { title: "Civil", value: "civil" },
  { title: "Computer Science", value: "computer_science" },
  { title: "Mechanical", value: "mechanical" },
  { title: "Electrical", value: "electrical" },
];
