// src/assets/scripts/regret_machine/RegretMachinePromptEngine.ts

/* ------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------ */

export type RegretLevel = "essential" | "advanced";

export interface RawRegretEntry {
  prompt: string;
  verb: string;
  highlight: string;
  sentence: string;
  category: RegretLevel; // "essential" now; later also "advanced"
  modal: "should" | "could";
  answers: string[]; // accepted user inputs
}

export type RawDataset = Record<string | number, RawRegretEntry>;

export interface RegretExercise {
  id: string; // original key as string
  prompt: string;
  verb: string;
  highlight: string;
  sentence: string;
  category: RegretLevel;
  modal: "should" | "could";
  answers: string[];
}

export interface NormalizedPrompts {
  arr: RegretExercise[];
  byCategory: {
    essential: RegretExercise[];
    advanced: RegretExercise[];
  };
}

/* ------------------------------------------------------------------
 * NORMALIZATION
 * ------------------------------------------------------------------ */

export function normalizePrompts(raw: RawDataset): NormalizedPrompts {
  const arr: RegretExercise[] = [];

  Object.entries(raw || {}).forEach(([id, p]) => {
    const category =
      String(p?.category ?? "essential").toLowerCase() === "advanced"
        ? "advanced"
        : "essential";

    arr.push({
      id: String(id),
      prompt: String(p?.prompt ?? ""),
      verb: String(p?.verb ?? ""),
      highlight: String(p?.highlight ?? ""),
      sentence: String(p?.sentence ?? ""),
      category,
      modal: p?.modal === "could" ? "could" : "should",
      answers: Array.isArray(p?.answers) ? p.answers.map(String) : [],
    });
  });

  const byCategory = {
    essential: [] as RegretExercise[],
    advanced: [] as RegretExercise[],
  };

  arr.forEach((ex) => {
    byCategory[ex.category].push(ex);
  });

  return { arr, byCategory };
}

/* ------------------------------------------------------------------
 * ANSWER CHECKING
 * - case-insensitive
 * - trims + collapses spaces
 * - strips trailing punctuation
 * ------------------------------------------------------------------ */

function norm(s: any): string {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ");
}

export function getAcceptedAnswers(ex: RegretExercise): string[] {
  const out = new Set<string>();

  (ex.answers || []).forEach((a) => {
    const n = norm(a);
    if (n) out.add(n);
  });

  return Array.from(out);
}

export function checkAnswer(ex: RegretExercise, userAnswer: string): boolean {
  const user = norm(userAnswer);
  if (!user) return false;

  const accepted = getAcceptedAnswers(ex);
  return accepted.includes(user);
}
