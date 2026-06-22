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
export type BackField =
  | "term"
  | "past_simple"
  | "present_perfect"
  | "definition"
  | "past_forms"
  | "French"
  | "German"
  | "Italian";

export type GameMode = "cards" | "write" | "multiple_choice" | "quiz" | "match";

export type RawVocabItem = {
  definition?: string;
  past_simple?: string[];
  present_perfect?: string[];
  French?: string;
  German?: string;
  Italian?: string;
  level?: VocabLevel;
  image?: string;
  multiple_choice?: string[];
  multiple_choice_ps?: string[];
  multiple_choice_pp?: string[];
  [k: string]: any;
};

export type RawVocabDataset = Record<string, RawVocabItem>;

export interface VocabItem {
  id: string;
  term: string;
  level: VocabLevel;
  image?: string;
  fields: Record<string, string[]>;
  mc: Record<string, string[]>;
}

export interface NormalizedVocab {
  items: VocabItem[];
  byLevel: Record<string, VocabItem[]>;
}

function arrify(v: any): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  return [String(v).trim()].filter(Boolean);
}

export function normalizeVocabDataset(
  raw: RawVocabDataset,
  opts: { listKey: string }
): NormalizedVocab {
  const items: VocabItem[] = [];
  const listKey = opts.listKey.trim();

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

    fields.term = [term];

    const mc: Record<string, string[]> = {};
    const generic = arrify(obj?.multiple_choice);
    if (generic.length) mc.generic = generic;

    const ps = arrify(obj?.multiple_choice_ps);
    if (ps.length) mc.past_simple = ps;

    const pp = arrify(obj?.multiple_choice_pp);
    if (pp.length) mc.present_perfect = pp;

    Object.keys(obj || {}).forEach((k) => {
      if (!k.startsWith("multiple_choice_")) return;
      const fieldName = k.replace("multiple_choice_", "");
      const arr = arrify(obj[k]);
      if (arr.length) mc[fieldName] = arr;
    });

    items.push({
      id: `${listKey}::${term}`,
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
    (byLevel[k] ||= []).push(it);
  });

  return { items, byLevel };
}

export function normalizeVocabDatasetWithListKey(listKey: string, raw: RawVocabDataset) {
  return normalizeVocabDataset(raw, { listKey });
}

/* -------------------------
   Checking helpers
------------------------- */

function norm(s: any): string {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/\s+/g, " ");
}

export function isCorrectAnswer(accepted: string[], user: string): boolean {
  const u = norm(user);
  return accepted.some((a) => norm(a) === u);
}

export function getFrontText(item: VocabItem | any, front: FrontField): string {
  // For custom items with additional_data
  if (item.additional_data) {
    if (front === "term") return item.term;
    const data = item.additional_data;
    const value = data[front];
    if (Array.isArray(value)) return value[0] || "—";
    return value ? String(value) : "—";
  }

  // For hardcoded items with fields
  if (front === "term") return item.term;
  const arr = item.fields?.[front] || [];
  return arr[0] || "—";
}

export function getAcceptedAnswers(item: VocabItem | any, field: BackField): string[] {
  // For custom items
  if (item.additional_data) {
    if (field === "term") return [item.term];
    const data = item.additional_data;
    const value = data[field];
    if (Array.isArray(value)) return value;
    if (value) return [String(value)];
    return [];
  }

  // For hardcoded items
  if (field === "term") return [item.term];
  const arr = item.fields?.[field] || [];
  return arr;
}