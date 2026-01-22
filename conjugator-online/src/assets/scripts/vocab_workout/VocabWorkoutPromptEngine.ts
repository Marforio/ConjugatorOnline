export type VocabLevel = "essential" | "advanced" | string;

export type StudyField =
  | "term"
  | "definition"
  | "past_simple"
  | "present_perfect"
  | "French"
  | "German"
  | "Italian";

export type FrontField = "term" | "definition" | "French" | "German" | "Italian";
export type BackField = "term" | "past_simple" | "present_perfect" | "definition" | "French" | "German" | "Italian";

export type GameMode = "cards" | "write" | "multiple_choice" | "quiz" | "match";

/**
 * UNIVERSAL RAW ITEM:
 * - values can be string OR string[]
 * - multiple_choice can be generic OR field-specific
 */
export type RawVocabItem = {
  definition?: string;
  past_simple?: string[];          // irregular verbs list
  present_perfect?: string[];      // irregular verbs list
  French?: string;
  German?: string;
  Italian?: string;
  level?: VocabLevel;
  image?: string;

  // houseElements-style
  multiple_choice?: string[];

  // irregularVerbs-style (field-specific)
  multiple_choice_ps?: string[];
  multiple_choice_pp?: string[];

  // future-proof: allow multiple_choice_<field>
  [k: string]: any;
};

export type RawVocabDataset = Record<string, RawVocabItem>;

export interface VocabItem {
  id: string;     // stable: term key
  term: string;
  level: VocabLevel;   // default "general" if missing
  image?: string;

  // all fields normalized to arrays of strings
  fields: Record<string, string[]>;

  // multiple choice distractors normalized by field
  mc: Record<string, string[]>;
}

export interface NormalizedVocab {
  items: VocabItem[];
  byLevel: Record<string, VocabItem[]>;
}

function arrify(v: any): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean);
  return [String(v).trim()].filter(Boolean);
}

export function normalizeVocabDataset(raw: RawVocabDataset): NormalizedVocab {
  const items: VocabItem[] = [];

  Object.entries(raw || {}).forEach(([term, obj]) => {
    const level = (obj?.level ?? "general") as VocabLevel;

    const fields: Record<string, string[]> = {};
    const keys: StudyField[] = [
      "definition",
      "past_simple",
      "present_perfect",
      "French",
      "German",
      "Italian",
    ];

    keys.forEach((k) => {
      const arr = arrify(obj?.[k]);
      if (arr.length) fields[k] = arr;
    });

    // always include term as a “field”
    fields.term = [term];

    // MC normalization:
    // - generic multiple_choice
    // - field-specific variants (ps/pp)
    // - and any future multiple_choice_<something>
    const mc: Record<string, string[]> = {};
    const generic = arrify(obj?.multiple_choice);
    if (generic.length) mc.generic = generic;

    const ps = arrify(obj?.multiple_choice_ps);
    if (ps.length) mc.past_simple = ps;

    const pp = arrify(obj?.multiple_choice_pp);
    if (pp.length) mc.present_perfect = pp;

    // future: multiple_choice_<fieldName>
    Object.keys(obj || {}).forEach((k) => {
      if (!k.startsWith("multiple_choice_")) return;
      const fieldName = k.replace("multiple_choice_", ""); // e.g. "French"
      const arr = arrify(obj[k]);
      if (arr.length) mc[fieldName] = arr;
    });

    items.push({
      id: term,
      term,
      level,
      image: obj?.image,
      fields,
      mc,
    });
  });

  const byLevel: Record<string, VocabItem[]> = {};
  items.forEach((it) => {
    const k = String(it.level ?? "general");
    if (!byLevel[k]) byLevel[k] = [];
    byLevel[k].push(it);
  });

  return { items, byLevel };
}

/* -------------------------
   Checking helpers
------------------------- */

function norm(s: any): string {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")  // ignore apostrophes
    .replace(/\s+/g, " ");
}

export function isCorrectAnswer(accepted: string[], user: string): boolean {
  const u = norm(user);
  return accepted.some(a => norm(a) === u);
}

export function getFrontText(item: VocabItem, front: FrontField): string {
  if (front === "term") return item.term;
  const arr = item.fields?.[front] || [];
  return arr[0] || "—";
}

export function getAcceptedAnswers(item: VocabItem, field: BackField): string[] {
  if (field === "term") return [item.term];
  const arr = item.fields?.[field] || [];
  return arr;
}
