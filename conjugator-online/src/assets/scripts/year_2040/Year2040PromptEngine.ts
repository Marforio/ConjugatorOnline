// src/assets/scripts/year_2040/Year2040PromptEngine.ts

/* ------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------ */

export type IrregLevel = "regular" | "essential" | "advanced";

export type FutureTense = "future continuous" | "future perfect" | string;

export interface RawYear2040Prompt {
  verb: string;
  irreg_level: IrregLevel;
  tense: FutureTense;
  sentence: string;
  answers: string[]; 
  negative?: boolean;
}

export type RawYear2040Dataset = Record<number | string, RawYear2040Prompt>;

export interface Year2040Exercise {
  id: number | string;
  verb: string;
  irreg_level: IrregLevel;
  tense: FutureTense;
  sentence: string;
  answers: string[];
  negative: boolean;
}

/* ------------------------------------------------------------------
 * NORMALIZATION FOR CHECK
 * - Lowercase
 * - Trim
 * - Collapse whitespace
 * - Remove apostrophes so missing apostrophes are not penalized
 * ------------------------------------------------------------------ */

export function normalizeForCheck(s: any): string {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "") // ignore apostrophes
    .replace(/\s+/g, " ");
}

/* ------------------------------------------------------------------
 * NORMALIZE PROMPTS
 * ------------------------------------------------------------------ */

export function normalizePrompts(raw: RawYear2040Dataset): Year2040Exercise[] {
  const arr: Year2040Exercise[] = [];

  Object.entries(raw || {}).forEach(([id, p]) => {
    const answers = Array.isArray(p?.answers) ? p.answers : [];
    arr.push({
      id,
      verb: String(p?.verb ?? "").trim(),
      irreg_level:
        p?.irreg_level === "essential" || p?.irreg_level === "advanced" || p?.irreg_level === "regular"
          ? p.irreg_level
          : "regular",
      tense: String(p?.tense ?? "").trim(),
      sentence: String(p?.sentence ?? "").trim(),
      answers: answers.map((a) => String(a ?? "").trim()).filter(Boolean),
      negative: !!p?.negative,
    });
  });

  return arr;
}

/* ------------------------------------------------------------------
 * CHECK ANSWER
 * ------------------------------------------------------------------ */

export function getAcceptedAnswers(p: Year2040Exercise): string[] {
  return Array.isArray(p?.answers) ? p.answers : [];
}

export function checkAnswer(p: Year2040Exercise, userAnswer: string): boolean {
  const user = normalizeForCheck(userAnswer);
  const accepted = getAcceptedAnswers(p).map(normalizeForCheck);
  return accepted.includes(user);
}
