// GrammarPromptEngine.ts

/* ------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------ */

export type GrammarCategory =
  | "infinitive_only"
  | "gerund_only"
  | "causative_bare_infinitive"
  | "special_expressions"
  | "no_change_meaning"
  | "change_meaning"
  | "prepositions"
  | "adjectives"
  | "gerund_subject"
  | "gerund_purpose"
  | "infinitive_purpose";

export interface RawPrompt {
  sentence: string;
  "answer verb": string;
  "answer forms": string[];
  "allowed typos": string[] | null;
}

export interface RawEntry {
  prompts: Record<number | string, RawPrompt>;
  complement: string;
  type: string;
}

export type RawDataset = Record<string, RawEntry>;

export interface GrammarExercise {
  id: string; // `${key}::${promptId}`
  key: string;
  promptId: string;
  sentence: string;
  answerVerb: string;
  answerForms: string[];
  allowedTypos: string[] | null;
  complement: string;
  type: string;
  category: GrammarCategory; // distribution category (NOT user option)
}

export interface NormalizedPrompts {
  arr: GrammarExercise[];
  byCategory: Record<GrammarCategory, GrammarExercise[]>;
}

/* ------------------------------------------------------------------
 * CATEGORY DETECTION (distribution category)
 * ------------------------------------------------------------------ */

function normalizeStr(s: any): string {
  return String(s ?? "").trim().toLowerCase();
}

export function categorizeEntry(entry: RawEntry): GrammarCategory {
  const complement = normalizeStr(entry?.complement);
  const type = normalizeStr(entry?.type);

  // Purpose (functional)
  if (type.includes("infinitive of purpose") || complement.includes("purpose")) {
    if (type.includes("for + gerund")) return "gerund_purpose";
    if (type.includes("infinitive")) return "infinitive_purpose";
  }

  // Special expressions
  if (type.includes("special expression")) return "special_expressions";

  // Gerund subject
  if (type.includes("gerund subject")) return "gerund_subject";

  // Causatives (bare infinitive)
  if (complement.includes("bare")) return "causative_bare_infinitive";

  // Prepositions
  if (type.includes("preposition + gerund")) return "prepositions";

  // Adjectives + infinitive
  if (type.includes("adjective + infinitive")) return "adjectives";

  // Dual complement: no meaning change
  if (type.includes("dual-complement") && type.includes("no meaning change")) {
    return "no_change_meaning";
  }

  // Meaning change verbs
  if (type.includes("meaning-change")) return "change_meaning";

  // Plain complement buckets
  if (complement === "infinitive") return "infinitive_only";
  if (complement === "gerund") return "gerund_only";

  // Fallbacks: infer from complement text
  if (complement.includes("infinitive")) return "infinitive_only";
  return "gerund_only";
}

/* ------------------------------------------------------------------
 * NORMALIZE PROMPTS
 * Turns raw object → { arr, byCategory }
 * ------------------------------------------------------------------ */

export function normalizePrompts(raw: RawDataset): NormalizedPrompts {
  const arr: GrammarExercise[] = [];

  // init byCategory
  const byCategory: Record<GrammarCategory, GrammarExercise[]> = {
    infinitive_only: [],
    gerund_only: [],
    causative_bare_infinitive: [],
    special_expressions: [],
    no_change_meaning: [],
    change_meaning: [],
    prepositions: [],
    adjectives: [],
    gerund_subject: [],
    gerund_purpose: [],
    infinitive_purpose: [],
  };

  Object.entries(raw || {}).forEach(([key, entry]) => {
    const category = categorizeEntry(entry);
    const promptsObj = entry?.prompts || {};

    Object.entries(promptsObj).forEach(([promptId, p]) => {
      const sentence = p?.sentence ?? "";
      const answerVerb = p?.["answer verb"] ?? "";
      const answerForms = Array.isArray(p?.["answer forms"]) ? p["answer forms"] : [];

      const allowedTypos =
        p?.["allowed typos"] === null || Array.isArray(p?.["allowed typos"])
          ? (p["allowed typos"] as string[] | null)
          : null;

      const ex: GrammarExercise = {
        id: `${key}::${promptId}`,
        key,
        promptId: String(promptId),
        sentence,
        answerVerb,
        answerForms,
        allowedTypos,
        complement: entry?.complement ?? "",
        type: entry?.type ?? "",
        category,
      };

      arr.push(ex);
      byCategory[category].push(ex);
    });
  });

  return { arr, byCategory };
}
