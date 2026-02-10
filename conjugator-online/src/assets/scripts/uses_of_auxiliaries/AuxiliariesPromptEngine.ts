/* ------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------ */

export type AuxMode = "echo" | "tag" | "agreement";

export interface AuxiliariesExercise {
  id: number | string;
  mode: AuxMode;
  prompt: string;
  tense: string;
  answer: string[];
  highlight: string;
  negative: boolean;
}

export interface NormalizedPrompts {
  arr: AuxiliariesExercise[];
  byTense: Record<string, AuxiliariesExercise[]>;
  byMode: Record<AuxMode, AuxiliariesExercise[]>;
}

export interface BuildPoolSettings {
  modes?: {
    echo: boolean;
    agreement: boolean;
    tag: boolean;
  };
  // no tense filters for this game
}

/* ------------------------------------------------------------------
 * NORMALIZE PROMPTS
 * Turns raw array/object → { arr, byTense, byMode }
 * ------------------------------------------------------------------ */

export function normalizePrompts(rawPrompts: any): NormalizedPrompts {
  const arr: AuxiliariesExercise[] = (Array.isArray(rawPrompts)
    ? rawPrompts.map((p: any, i: number) => ({
        id: p.id ?? i,
        mode: (p.mode ?? "echo") as AuxMode,
        prompt: p.prompt ?? "",
        tense: String(p.tense ?? "").toLowerCase(),
        answer: Array.isArray(p.answer)
          ? p.answer.map((s: any) => String(s))
          : typeof p.answer === "string"
            ? [p.answer]
            : [],
        highlight: p.highlight ?? "",
        negative: Boolean(p.negative),
      }))
    : Object.entries(rawPrompts).map(([id, p]: any) => ({
        id,
        mode: (p.mode ?? "echo") as AuxMode,
        prompt: p.prompt ?? "",
        tense: String(p.tense ?? "").toLowerCase(),
        answer: Array.isArray(p.answer)
          ? p.answer.map((s: any) => String(s))
          : typeof p.answer === "string"
            ? [p.answer]
            : [],
        highlight: p.highlight ?? "",
        negative: Boolean(p.negative),
      })));

  const byTense: Record<string, AuxiliariesExercise[]> = {};
  const byMode: Record<AuxMode, AuxiliariesExercise[]> = {
    echo: [],
    agreement: [],
    tag: [],
  };

  arr.forEach((p) => {
    const tense = (p.tense || "").toLowerCase();
    if (!byTense[tense]) byTense[tense] = [];
    byTense[tense].push(p);

    const mode = (p.mode || "echo") as AuxMode;
    if (!byMode[mode]) byMode[mode] = [];
    byMode[mode].push(p);
  });

  return { arr, byTense, byMode };
}

/* ------------------------------------------------------------------
 * BUILD POOL
 * Filter prompts based on enabled modes only.
 * ------------------------------------------------------------------ */

export function buildPool(
  normalized: NormalizedPrompts,
  settings: BuildPoolSettings
): AuxiliariesExercise[] {
  const { modes = { echo: true, agreement: true, tag: true } } = settings;

  const allowedModes: AuxMode[] = [];
  if (modes.echo) allowedModes.push("echo");
  if (modes.agreement) allowedModes.push("agreement");
  if (modes.tag) allowedModes.push("tag");

  return (normalized.arr || []).filter((p) =>
    allowedModes.includes((p.mode || "echo") as AuxMode)
  );
}

/* ------------------------------------------------------------------
 * SAMPLE n PROMPTS (with repeat if pool smaller)
 * ------------------------------------------------------------------ */

export function samplePrompts(
  pool: AuxiliariesExercise[],
  n: number = 30
): AuxiliariesExercise[] {
  if (!Array.isArray(pool) || pool.length === 0) return [];

  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  const out: AuxiliariesExercise[] = [];
  let idx = 0;

  while (out.length < n) {
    out.push({ ...a[idx % a.length] });
    idx++;
  }

  return out;
}

/* ------------------------------------------------------------------
 * CHECK ANSWER
 * ------------------------------------------------------------------ */

export function checkAnswer(
  prompt: AuxiliariesExercise,
  userAnswer: string
): boolean {
  const normalize = (s: string) =>
    String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[?]+$/g, "");

  const user = normalize(userAnswer);
  const acceptable = Array.isArray(prompt.answer) ? prompt.answer : [];

  return acceptable.some((a) => normalize(a) === user);
}