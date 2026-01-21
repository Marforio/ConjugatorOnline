/* ------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------ */

export type IrregLevel = "regular" | "essential" | "advanced";
export type ConditionalType = "first" | "second" | "third";

export interface RawParallelUniversePrompt {
  verb: string;
  irreg_level: IrregLevel;
  conditional_type: ConditionalType;
  sentence: string;
  condition: boolean; // true => missing phrase is in IF clause, false => main clause
  answers: string[];
  negative: boolean;
}

export type RawParallelUniverseDataset = Record<number | string, RawParallelUniversePrompt>;

export interface ParallelUniverseExercise {
  id: number | string;
  verb: string;
  irreg_level: IrregLevel;
  conditional_type: ConditionalType;
  sentence: string;
  condition: boolean;
  answers: string[];
  negative: boolean;
}

/* ------------------------------------------------------------------
 * NORMALIZATION FOR CHECKING
 * - lowercase
 * - trim
 * - collapse spaces
 * - remove apostrophes (straight + curly)
 * ------------------------------------------------------------------ */

export function normalizeForCheck(s: any): string {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/\s+/g, " ");
}

/* ------------------------------------------------------------------
 * NORMALIZE PROMPTS (raw -> array)
 * ------------------------------------------------------------------ */

export function normalizePrompts(raw: RawParallelUniverseDataset): ParallelUniverseExercise[] {
  const arr: ParallelUniverseExercise[] = [];

  Object.entries(raw || {}).forEach(([id, p]) => {
    const answers = Array.isArray(p?.answers) ? p.answers : [];
    arr.push({
      id,
      verb: String(p?.verb ?? ""),
      irreg_level: (p?.irreg_level ?? "regular") as IrregLevel,
      conditional_type: (p?.conditional_type ?? "first") as ConditionalType,
      sentence: String(p?.sentence ?? ""),
      condition: !!p?.condition,
      answers: answers.map((a) => String(a ?? "")).filter(Boolean),
      negative: !!p?.negative,
    });
  });

  return arr;
}

/* ------------------------------------------------------------------
 * CHECK ANSWER
 * - accepts any answer in prompt.answers
 * - apostrophes ignored
 * ------------------------------------------------------------------ */

export function getAcceptedAnswers(p: ParallelUniverseExercise): string[] {
  const answers = Array.isArray(p?.answers) ? p.answers : [];
  return answers.map((x) => String(x ?? "").trim()).filter(Boolean);
}

export function checkAnswer(p: ParallelUniverseExercise, userAnswer: string): boolean {
  const user = normalizeForCheck(userAnswer);
  if (!user) return false;

  const accepted = getAcceptedAnswers(p).map(normalizeForCheck);
  return accepted.includes(user);
}
