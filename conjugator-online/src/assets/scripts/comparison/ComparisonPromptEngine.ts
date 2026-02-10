// src/assets/scripts/comparison/ComparisonPromptEngine.ts
//
// Update: target forms are now 5 total:
// - "comparative"         (from dataset answer.comparative)
// - "superlative"         (from dataset answer.superlative)
// - "equality"            (from dataset answer.equality)
// - "comparison_less"     (generated: `less ${word}` [+ "than" if your dataset expects it])
// - "superlative_least"   (generated: `the least ${word}`)
//
// Also includes Auxiliaries-style typo reduction: ignore spaces/punctuation/apostrophes.

export type PartOfSpeech = "adjective" | "adverb";
export type PracticeMode = "adjectives" | "adverbs" | "mix";

export type TargetForm =
  | "comparative"
  | "superlative"
  | "equality"
  | "comparison_less"
  | "superlative_least";

export type ComparisonAnswerSet = {
  comparative: string[];
  superlative: string[];
  equality?: string[]; // allow older prompts missing it
};

export type ComparisonPrompt = {
  id: number;
  word: string;
  person_A: string;
  person_B: string;
  answer: ComparisonAnswerSet;
  negative: boolean;
  part_of_speech: PartOfSpeech;
  prompt: string | null;
};

export type ComparisonPromptRaw = Omit<ComparisonPrompt, "id"> & { id?: number };

export type ComparisonSettings = {
  partOfSpeech: PracticeMode;
  numRounds: number;
  intensifiers: boolean;
};

// Intensifiers (still supported). If ON, user must include an allowed intensifier.
// Comparative/equality/"less": use comparative list.
// Superlative/"least": use superlative list.
export const COMPARATIVE_INTENSIFIERS: readonly string[] = [
  "so much",
  "much",
  "a lot",
  "incredibly",
  "far",
  "really",
  "even",
] as const;

export const SUPERLATIVE_INTENSIFIERS: readonly string[] = ["by far", "easily"] as const;

/* -----------------------------
 * Auxiliaries-style normalization
 * (removes spaces, punctuation, apostrophes)
 * ----------------------------- */
export function normalizeForCompare(s: string): string {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[?!.]+$/g, "")
    .replace(/[\s.,!;:"()\-–—_/\\]+/g, "") // remove separators
    .replace(/'/g, ""); // remove apostrophes
}

/* -----------------------------
 * Dataset -> prompt list
 * ----------------------------- */
export function normalizePrompts(raw: unknown): ComparisonPrompt[] {
  if (!raw) return [];
  const arr: any[] = Array.isArray(raw) ? raw : Object.values(raw as any);

  return arr
    .filter(Boolean)
    .map((p, idx): ComparisonPrompt => {
      const id = Number(p.id ?? p.prompt_number ?? idx + 1);

      return {
        id,
        word: String(p.word ?? ""),
        person_A: String(p.person_A ?? ""),
        person_B: String(p.person_B ?? ""),
        answer: {
          comparative: Array.isArray(p?.answer?.comparative) ? p.answer.comparative.map(String) : [],
          superlative: Array.isArray(p?.answer?.superlative) ? p.answer.superlative.map(String) : [],
          equality: Array.isArray(p?.answer?.equality) ? p.answer.equality.map(String) : [],
        },
        negative: !!p.negative,
        part_of_speech: p.part_of_speech === "adverb" ? "adverb" : "adjective",
        prompt: p.prompt == null ? null : String(p.prompt),
      };
    });
}

/* -----------------------------
 * Pool building + sampling
 * ----------------------------- */
export function buildPool(
  normalized: ComparisonPrompt[],
  opts: { partOfSpeech?: PracticeMode } = {}
): ComparisonPrompt[] {
  const mode = opts.partOfSpeech ?? "mix";
  if (mode === "mix") return normalized;
  if (mode === "adjectives") return normalized.filter((p) => p.part_of_speech === "adjective");
  if (mode === "adverbs") return normalized.filter((p) => p.part_of_speech === "adverb");
  return normalized;
}

export function samplePrompts(pool: ComparisonPrompt[], count: number): ComparisonPrompt[] {
  const copy = pool.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  const n = Math.max(0, Number(count) || 0);
  return copy.slice(0, n);
}

/* -----------------------------
 * Target form selection
 * ----------------------------- */
export function chooseTargetForm(): TargetForm {
  // tweak weights as you like:
  // comparative (standard) more common
  const r = Math.random();
  if (r < 0.34) return "comparative";
  if (r < 0.52) return "comparison_less";
  if (r < 0.70) return "equality";
  if (r < 0.86) return "superlative";
  return "superlative_least";
}

function allowedIntensifiersForForm(targetForm: TargetForm): readonly string[] {
  const isSuperFamily = targetForm === "superlative" || targetForm === "superlative_least";
  return isSuperFamily ? SUPERLATIVE_INTENSIFIERS : COMPARATIVE_INTENSIFIERS;
}

function hasAllowedIntensifier(userAnswer: string, targetForm: TargetForm): boolean {
  const u = String(userAnswer || "").trim().toLowerCase();
  const allowed = allowedIntensifiersForForm(targetForm);
  return allowed.some((x) => u === x || u.startsWith(x + " "));
}

function stripLeadingIntensifier(userAnswer: string, targetForm: TargetForm): string {
  const u = String(userAnswer || "").trim().toLowerCase();
  const allowed = [...allowedIntensifiersForForm(targetForm)].sort((a, b) => b.length - a.length);

  for (const x of allowed) {
    if (u === x) return "";
    if (u.startsWith(x + " ")) return u.slice(x.length).trim();
  }
  return u;
}


/* -----------------------------
 * Generated answers for new target forms
 * ----------------------------- */
export function generatedAnswersFor(prompt: ComparisonPrompt, targetForm: TargetForm): string[] {
  if (targetForm === "comparison_less") {
    // You asked: "word field preceded by 'less '"
    // Since your dataset comparatives now include "than", we include it too so it matches your UI.
    // If you ever want it without "than", remove it here.
    return [`less ${prompt.word} than`];
  }

  if (targetForm === "superlative_least") {
    return [`the least ${prompt.word}`];
  }

  return [];
}

export function expectedAnswersFor(prompt: ComparisonPrompt, targetForm: TargetForm): string[] {
  if (targetForm === "comparison_less" || targetForm === "superlative_least") {
    return generatedAnswersFor(prompt, targetForm);
  }

  if (targetForm === "equality") {
    return (prompt?.answer?.equality || []).slice();
  }

  return (prompt?.answer?.[targetForm] || []).slice();
}

/* -----------------------------
 * Answer checking + labels
 * ----------------------------- */
export function checkAnswer(
  prompt: ComparisonPrompt,
  targetForm: TargetForm,
  userAnswer: string,
  settings?: Pick<ComparisonSettings, "intensifiers">
): boolean {
  const expected = expectedAnswersFor(prompt, targetForm).map(normalizeForCompare);
  const intensifiersOn = !!settings?.intensifiers;

  // ✅ Equality never uses intensifiers (even if intensifiers mode is ON)
  if (targetForm === "equality") {
    // If user typed an intensifier anyway, reject it explicitly.
    // (prevents "much as fast as" etc. from being accidentally accepted)
    const usedComparativeInt = hasAllowedIntensifier(userAnswer, "comparative");
    const usedSuperlativeInt = hasAllowedIntensifier(userAnswer, "superlative");
    if (intensifiersOn && (usedComparativeInt || usedSuperlativeInt)) return false;

    return expected.some((e) => e === normalizeForCompare(userAnswer));
  }

  // ✅ All other forms: intensifier required when mode is ON
  if (intensifiersOn) {
    if (!hasAllowedIntensifier(userAnswer, targetForm)) return false;
    const rest = stripLeadingIntensifier(userAnswer, targetForm);
    return expected.some((e) => e === normalizeForCompare(rest));
  }

  return expected.some((e) => e === normalizeForCompare(userAnswer));
}

export function buildCorrectAnswerLabel(
  prompt: ComparisonPrompt,
  targetForm: TargetForm,
  settings?: Pick<ComparisonSettings, "intensifiers">
): string {
  const base = expectedAnswersFor(prompt, targetForm);
  const intensifiersOn = !!settings?.intensifiers;

  // ✅ Equality: never show intensifier versions
  if (!intensifiersOn || targetForm === "equality") return base.join(" / ");

  const preview =
    targetForm === "superlative" || targetForm === "superlative_least"
      ? ["by far", "easily"]
      : ["much", "a lot", "so much", "incredibly"];

  const out: string[] = [];
  for (const intensifier of preview) {
    for (const a of base) out.push(`${intensifier} ${a}`);
  }
  return out.join(" / ");
}