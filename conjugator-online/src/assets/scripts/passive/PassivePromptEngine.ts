// PassivePromptEngine.ts

/* ------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------ */

export interface PassiveExercise {
  id: number | string;
  active: string;
  passive: string;
  tense: string;
  answer: string;
  level: "essential" | "advanced";
}

export interface NormalizedPrompts {
  arr: PassiveExercise[];
  byLevel: {
    essential: PassiveExercise[];
    advanced: PassiveExercise[];
  };
  byTense: Record<string, PassiveExercise[]>;
}

export interface BuildPoolSettings {
  level?: "essential" | "advanced";
  tenseGroups?: {
    group1: boolean;
    group2: boolean;
  };
}

/* ------------------------------------------------------------------
 * TENSE GROUPS
 * ------------------------------------------------------------------ */

export const GROUP_1 = [
  "present simple",
  "past simple",
  "recommendation",
  "ability",
  "obligation",
  "future",
];

export const GROUP_2 = [
  "present continuous",
  "present perfect",
];

/* ------------------------------------------------------------------
 * NORMALIZE PROMPTS
 * Turns raw array/object → { arr, byLevel, byTense }
 * ------------------------------------------------------------------ */

export function normalizePrompts(rawPrompts: any): NormalizedPrompts {
  // rawPrompts may be object keyed by id OR an array
  const arr: PassiveExercise[] = Array.isArray(rawPrompts)
    ? rawPrompts
    : Object.entries(rawPrompts).map(([id, p]: any) => ({
        id,
        active: p.active ?? "",
        passive: p.passive ?? "",
        tense: (p.tense ?? "").toLowerCase(),
        answer: p.answer ?? "",
        level: (p.level ?? "essential").toLowerCase(),
      }));

  const byLevel = {
    essential: [] as PassiveExercise[],
    advanced: [] as PassiveExercise[],
  };

  const byTense: Record<string, PassiveExercise[]> = {};

  arr.forEach((p) => {
    const lvl = (p.level || "essential").toLowerCase() as
      | "essential"
      | "advanced";
    byLevel[lvl] = byLevel[lvl] || [];
    byLevel[lvl].push(p);

    const tense = (p.tense || "").toLowerCase();
    if (!byTense[tense]) byTense[tense] = [];
    byTense[tense].push(p);
  });

  return { arr, byLevel, byTense };
}

/* ------------------------------------------------------------------
 * BUILD POOL
 * Filter + combine prompts based on:
 *   - level: essential or advanced
 *   - tenseGroups: GROUP_1 / GROUP_2 enabled or disabled
 *
 * EXACT JS LOGIC preserved.
 * ------------------------------------------------------------------ */

export function buildPool(
  normalized: NormalizedPrompts,
  settings: BuildPoolSettings
): PassiveExercise[] {
  const {
    level = "essential",
    tenseGroups = { group1: true, group2: true },
  } = settings;

  // Build allowed tenses
  let allowedTenses: string[] = [];
  if (tenseGroups.group1) allowedTenses = allowedTenses.concat(GROUP_1);
  if (tenseGroups.group2) allowedTenses = allowedTenses.concat(GROUP_2);

  // Filter function
  const filterByTense = (list: PassiveExercise[]) =>
    list.filter((p) => allowedTenses.includes((p.tense || "").toLowerCase()));

  if (level === "essential") {
    // Only essential prompts
    return filterByTense(normalized.byLevel.essential || []);
  }

  // ADVANCED level → 50% essential, 50% advanced
  const essentials = filterByTense(normalized.byLevel.essential || []);
  const advs = filterByTense(normalized.byLevel.advanced || []);

  // Edge cases
  if (essentials.length === 0 && advs.length === 0) return [];
  if (essentials.length === 0) return [...advs];
  if (advs.length === 0) return [...essentials];

  // Alternate essential/advanced → approximate 50/50
  const out: PassiveExercise[] = [];
  const max = Math.max(essentials.length, advs.length);

  for (let i = 0; i < max; i++) {
    if (i < advs.length) out.push(advs[i]);
    if (i < essentials.length) out.push(essentials[i]);
  }

  return out;
}

/* ------------------------------------------------------------------
 * SAMPLE n PROMPTS (with repeat if pool smaller)
 * EXACT behavior preserved from JS version.
 * ------------------------------------------------------------------ */

export function samplePrompts(
  pool: PassiveExercise[],
  n: number = 30
): PassiveExercise[] {
  if (!Array.isArray(pool) || pool.length === 0) return [];

  // Shuffle copy
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  const out: PassiveExercise[] = [];
  let idx = 0;

  while (out.length < n) {
    // clone to avoid mutating original objects later
    out.push({ ...a[idx % a.length] });
    idx++;
  }

  return out;
}

/* ------------------------------------------------------------------
 * CHECK ANSWER
 * User types only verb phrase → compare to prompt.answer
 * Case-insensitive, trimmed
 * ------------------------------------------------------------------ */

export function checkAnswer(
  prompt: PassiveExercise,
  userAnswer: string
): boolean {
  const correct = String(prompt.answer || "").trim().toLowerCase();
  const user = String(userAnswer || "").trim().toLowerCase();
  return user === correct;
}
