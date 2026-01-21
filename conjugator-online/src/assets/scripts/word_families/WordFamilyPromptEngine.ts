// src/assets/scripts/word_families/WordFamilyPromptEngine.ts

/* ------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------ */

export type WordFamilyPOS = "verb" | "noun" | "adjective" | "adverb";

export interface RawPOSPrompt {
  // [answerWord, sentenceWithBlank]
  0: string;
  1: string;
}

export interface RawFamilyEntry {
  verb: [string, string] | null;
  noun: [string, string] | null;
  adjective: [string, string] | null;
  adverb: [string, string] | null;
  category: string;
}

export type RawDataset = Record<string, RawFamilyEntry>;

export interface WordFamilyItem {
  pos: WordFamilyPOS;
  answer: string;
  sentence: string;
}

export interface WordFamilyRound {
  id: string;          // e.g. "activ-::round"
  key: string;         // dataset key e.g. "activ-"
  category: string;    // category
  items: WordFamilyItem[]; // 2-4 items
}

/* ------------------------------------------------------------------
 * NORMALIZE
 * Convert raw dataset into list of rounds, each family as a round "base"
 * (we will sample 2-4 items per round later in PoolBuilder)
 * ------------------------------------------------------------------ */

const POS_ORDER: WordFamilyPOS[] = ["verb", "noun", "adjective", "adverb"];

export function normalizeWordFamilyPrompts(raw: RawDataset): WordFamilyRound[] {
  const rounds: WordFamilyRound[] = [];

  Object.entries(raw || {}).forEach(([key, entry]) => {
    const category = entry?.category ?? "general";
    const items: WordFamilyItem[] = [];

    POS_ORDER.forEach((pos) => {
      const val = entry?.[pos] as [string, string] | null;
      if (!val) return;
      const [answer, sentence] = val;
      items.push({
        pos,
        answer: String(answer ?? "").trim(),
        sentence: String(sentence ?? "").trim(),
      });
    });

    // Keep even if fewer than 2; PoolBuilder will skip if not enough
    rounds.push({
      id: `${key}::base`,
      key,
      category,
      items,
    });
  });

  return rounds;
}

/* ------------------------------------------------------------------
 * CHECK ANSWERS
 * Round is correct only if ALL filled answers match.
 * Case-insensitive, trim, collapse spaces.
 * ------------------------------------------------------------------ */

function norm(s: any): string {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function checkRoundAnswers(
  round: WordFamilyRound,
  userAnswers: Record<string, string>
): { allCorrect: boolean; perItem: Record<string, boolean> } {
  const perItem: Record<string, boolean> = {};

  round.items.forEach((it) => {
    const user = norm(userAnswers[it.pos]);
    const correct = norm(it.answer);
    perItem[it.pos] = user === correct;
  });

  const allCorrect = Object.values(perItem).every(Boolean);
  return { allCorrect, perItem };
}
