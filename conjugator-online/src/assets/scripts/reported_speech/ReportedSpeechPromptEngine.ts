// src/assets/scripts/reported_speech/ReportedSpeechPromptEngine.ts

/* ------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------ */

export type IrregCategory = "essential" | "advanced" | null;

export interface RawReportedSpeechPrompt {
  speaker: string;
  direct: string;
  Highlight: string;
  reported: string;
  answer: string;
  irreg_category: IrregCategory;
}

export type RawReportedSpeechDataset = Record<number | string, RawReportedSpeechPrompt>;

export interface ReportedSpeechExercise {
  id: number | string;
  speaker: string;
  direct: string;
  highlight: string;
  reported: string;
  answer: string;
  irreg_category: IrregCategory;
}

export interface NormalizedPrompts {
  arr: ReportedSpeechExercise[];
  byIrregCategory: {
    none: ReportedSpeechExercise[]; // irreg_category === null
    essential: ReportedSpeechExercise[];
    advanced: ReportedSpeechExercise[];
  };
}

/* ------------------------------------------------------------------
 * NORMALIZATION HELPERS
 * - Lowercase
 * - Trim
 * - Collapse whitespace
 * - Remove apostrophes so missing apostrophes are not penalized
 * ------------------------------------------------------------------ */

export function normalizeForCheck(s: any): string {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")      // ✅ remove apostrophes (straight + curly)
    .replace(/\s+/g, " ");     // collapse spaces
}

/* ------------------------------------------------------------------
 * NORMALIZE PROMPTS
 * Turns raw object → { arr, byIrregCategory }
 * ------------------------------------------------------------------ */

export function normalizePrompts(raw: RawReportedSpeechDataset): NormalizedPrompts {
  const arr: ReportedSpeechExercise[] = [];

  Object.entries(raw || {}).forEach(([id, p]) => {
    arr.push({
      id,
      speaker: p?.speaker ?? "",
      direct: p?.direct ?? "",
      highlight: p?.Highlight ?? "",
      reported: p?.reported ?? "",
      answer: p?.answer ?? "",
      irreg_category:
        p?.irreg_category === "essential" || p?.irreg_category === "advanced"
          ? p.irreg_category
          : null,
    });
  });

  const byIrregCategory = {
    none: [] as ReportedSpeechExercise[],
    essential: [] as ReportedSpeechExercise[],
    advanced: [] as ReportedSpeechExercise[],
  };

  arr.forEach((ex) => {
    if (ex.irreg_category === "essential") byIrregCategory.essential.push(ex);
    else if (ex.irreg_category === "advanced") byIrregCategory.advanced.push(ex);
    else byIrregCategory.none.push(ex);
  });

  return { arr, byIrregCategory };
}

/* ------------------------------------------------------------------
 * CHECK ANSWER
 * - Case-insensitive
 * - Apostrophes ignored (hadn't == hadnt)
 * - Whitespace normalized
 * ------------------------------------------------------------------ */

export function checkAnswer(prompt: ReportedSpeechExercise, userAnswer: string): boolean {
  const correct = normalizeForCheck(prompt?.answer);
  const user = normalizeForCheck(userAnswer);
  return user === correct;
}
/* ------------------------------------------------------------------
 * HIGHLIGHT HELPERS (for v-html)
 * - Highlights the first occurrence of `highlight` inside `text`
 * - Case-insensitive match, but preserves original casing in output
 * - Returns HTML string with <span class="font-weight-bold">...</span>
 * ------------------------------------------------------------------ */

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Highlight helper (safe for v-html)
 * NOTE: It escapes the whole text, then injects a bold span for the match.
 */
export function highlightSubstringHtml(text: any, highlight: any): string {
  const rawText = String(text ?? "");
  const rawHighlight = String(highlight ?? "");

  if (!rawText || !rawHighlight) return escapeHtml(rawText);

  const hay = rawText.toLowerCase();
  const needle = rawHighlight.toLowerCase();

  const idx = hay.indexOf(needle);
  if (idx === -1) return escapeHtml(rawText);

  let before = rawText.slice(0, idx);
  const match = rawText.slice(idx, idx + rawHighlight.length);
  let after = rawText.slice(idx + rawHighlight.length);

  // Trim only whitespace touching the match
  before = before.replace(/\s+$/, "");
  after = after.replace(/^\s+/, "");

  // ✅ Use &nbsp; so spacing cannot collapse away
  return (
    escapeHtml(before) +
    "&nbsp;" +
    `<span class="font-weight-bold">${escapeHtml(match)}</span>` +
    "&nbsp;" +
    escapeHtml(after)
  );
}


