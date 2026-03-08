// src/assets/scripts/ideaLinker/IdeaLinkerPromptEngine.ts

import type { IdeaLinkerDataset, IdeaLinkerEntry, IdeaLinkerTranslations } from "./IdeaLinkerPrompts";

export const ROUND_SECONDS = 45;

export type IdeaLinkerSettings = {
  numRounds: number;
  // future-proof toggles
  showTranslations: boolean;
};

// In IdeaLinkerPromptEngine.ts

export type IdeaLinkerRound = {
  id: string;
  entryId: string;
  promptIndex: number;
  promptText: string;
  
  // NEW: Split ideas
  idea1: string | null;
  idea2: string | null;

  category: string;
  variant: string | null;
  behavior: string;

  possibleLinkers: string[];
  excludedLinkers: string[];
  translations: IdeaLinkerTranslations | null;

  minAnswers: number;
  maxAnswers: number;

  imageKey: string;
  imagePath: string;
};

function slugForImageKey(s: string): string {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linkerImagePath(category: string, variant: string | null): { key: string; path: string } {
  const key = (variant && String(variant).trim()) ? String(variant) : String(category);
  const slug = slugForImageKey(key);
  return { key, path: `/images/linkers/${slug}.jpg` };
}

export function normalizeForCompare(s: string): string {
  // Auxiliaries-style: remove spaces + punctuation + apostrophes; case-insensitive.
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[?!.]+$/g, "")
    .replace(/[\s.,!;:¨"()\-–—_/\\]+/g, "")
    .replace(/'/g, "");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function entryDefaults(entry: IdeaLinkerEntry) {
  return {
    excludedLinkers: Array.isArray(entry.excludedLinkers) ? entry.excludedLinkers.map(String) : [],
    translations: entry.translations ?? null,
    minAnswers: Number.isFinite(entry.minAnswers as any) ? Number(entry.minAnswers) : 1,
    maxAnswers: Number.isFinite(entry.maxAnswers as any) ? Number(entry.maxAnswers) : (entry.possibleLinkers ?? []).length,
  };
}

// In IdeaLinkerPromptEngine.ts

export function flattenDataset(dataset: IdeaLinkerDataset): IdeaLinkerRound[] {
  const rounds: IdeaLinkerRound[] = [];

  for (const [entryId, entry] of Object.entries(dataset)) {
    const d = entryDefaults(entry);
    const cat = String(entry.category);
    const vari = entry.variant == null ? null : String(entry.variant);

    const img = linkerImagePath(cat, vari);

    entry.prompts.forEach((promptText, idx) => {
      const split = splitPromptIntoIdeas(String(promptText));
      
      rounds.push({
        id: `${entryId}:${idx}`,
        entryId,
        promptIndex: idx,
        promptText: String(promptText),
        
        // NEW: Add split ideas
        idea1: split?.idea1 ?? null,
        idea2: split?.idea2 ?? null,

        category: cat,
        variant: vari,
        behavior: String(entry.behavior),

        possibleLinkers: (entry.possibleLinkers || []).map(String),
        excludedLinkers: d.excludedLinkers,
        translations: d.translations,

        minAnswers: d.minAnswers,
        maxAnswers: d.maxAnswers,

        imageKey: img.key,
        imagePath: img.path,
      });
    });
  }

  return rounds;
}

/**
 * Sample rounds evenly across entries, then shuffle within each entry.
 * Protection A: cap how many rounds can be drawn from each entry
 * so the game never selects more prompts from an entry than there are
 * eligible (unused-possible) linkers for that entry.
 *
 * Also keeps the "even-ish distribution" idea, but will redistribute
 * leftover rounds to entries that still have capacity.
 */

export function sampleRoundsEvenly(allRounds: IdeaLinkerRound[], numRounds: number): IdeaLinkerRound[] {
  const n = clamp(Number(numRounds) || 0, 1, allRounds.length);

  const byEntry = new Map<string, IdeaLinkerRound[]>();
  for (const r of allRounds) {
    if (!byEntry.has(r.entryId)) byEntry.set(r.entryId, []);
    byEntry.get(r.entryId)!.push(r);
  }

  // shuffle each bucket (random prompt selection within each entry)
  for (const [k, bucket] of byEntry.entries()) {
    byEntry.set(k, shuffle(bucket));
  }

  // capacity per entry = number of eligible linkers in that entry
  // (possibleLinkers minus excludedLinkers, unique by normalized form)
  const capacityByEntry = new Map<string, number>();
  for (const [entryId, bucket] of byEntry.entries()) {
    const first = bucket[0];
    if (!first) {
      capacityByEntry.set(entryId, 0);
      continue;
    }

    const excludedNorm = new Set((first.excludedLinkers || []).map(normalizeForCompare));
    const eligibleNorm = new Set(
      (first.possibleLinkers || [])
        .filter(Boolean)
        .map((l) => normalizeForCompare(l))
        .filter((l) => l && !excludedNorm.has(l))
    );

    capacityByEntry.set(entryId, eligibleNorm.size);
  }

  // Only keep entries that can actually contribute at least 1 safe round
  let entryIds = Array.from(byEntry.keys()).filter((id) => (capacityByEntry.get(id) || 0) > 0);
  entryIds = shuffle(entryIds);

  const chosen: IdeaLinkerRound[] = [];

  // We allocate in passes:
  // - In each pass, give each entry 1 round, until we reach n
  // - But never exceed per-entry capacity or bucket length
  // This produces good mixing and respects caps.
  const takenByEntry = new Map<string, number>();
  for (const id of entryIds) takenByEntry.set(id, 0);

  while (chosen.length < n && entryIds.length > 0) {
    let progressed = false;

    for (const entryId of shuffle(entryIds)) {
      if (chosen.length >= n) break;

      const bucket = byEntry.get(entryId)!;
      const cap = capacityByEntry.get(entryId) || 0;
      const taken = takenByEntry.get(entryId) || 0;

      // stop using this entry if at cap or no prompts left
      if (taken >= cap || bucket.length === 0) continue;

      chosen.push(bucket.shift()!);
      takenByEntry.set(entryId, taken + 1);
      progressed = true;
    }

    // Remove exhausted entries (at cap or empty)
    entryIds = entryIds.filter((entryId) => {
      const bucket = byEntry.get(entryId)!;
      const cap = capacityByEntry.get(entryId) || 0;
      const taken = takenByEntry.get(entryId) || 0;
      return bucket.length > 0 && taken < cap;
    });

    if (!progressed) break; // safety
  }

  // If we couldn't reach n because of caps, return as many as we safely can.
  // (You can also throw or warn here.)
  return shuffle(chosen);
}

export type CheckAnswerResult =
  | { correct: true; chosenLinker: string; correctAnswers: string[] }
  | { correct: false; reason: "excluded" | "already_used" | "not_in_list"; correctAnswers: string[] };

export function getEligibleLinkers(round: IdeaLinkerRound, usedLinkers: Set<string>): string[] {
  const excludedNorm = new Set(round.excludedLinkers.map(normalizeForCompare));
  const usedNorm = new Set(Array.from(usedLinkers).map(normalizeForCompare));

  return round.possibleLinkers
    .filter(Boolean)
    .filter((l) => !excludedNorm.has(normalizeForCompare(l)))
    .filter((l) => !usedNorm.has(normalizeForCompare(l)));
}

export function checkIdeaLinkerAnswer(
  round: IdeaLinkerRound,
  userAnswer: string,
  usedLinkers: Set<string>
): CheckAnswerResult {
  const userNorm = normalizeForCompare(userAnswer);

  const possibleNorm = new Map<string, string>();
  for (const l of round.possibleLinkers) possibleNorm.set(normalizeForCompare(l), l);

  const excludedNorm = new Set(round.excludedLinkers.map(normalizeForCompare));
  const usedNorm = new Set(Array.from(usedLinkers).map(normalizeForCompare));

  const correctAnswers = getEligibleLinkers(round, usedLinkers);

  if (excludedNorm.has(userNorm)) return { correct: false, reason: "excluded", correctAnswers };
  if (usedNorm.has(userNorm)) return { correct: false, reason: "already_used", correctAnswers };

  if (possibleNorm.has(userNorm)) {
    const chosenLinker = possibleNorm.get(userNorm)!;

    // must still be eligible
    const eligibleNorm = new Set(correctAnswers.map(normalizeForCompare));
    if (!eligibleNorm.has(userNorm)) return { correct: false, reason: "already_used", correctAnswers };

    return { correct: true, chosenLinker, correctAnswers };
  }

  return { correct: false, reason: "not_in_list", correctAnswers };
}

export function buildCorrectAnswersLabel(correctAnswers: string[]): string {
  return correctAnswers.join(" / ");
}

export function translationsLabel(translations: IdeaLinkerTranslations | null): string {
  if (!translations) return "";
  const parts: string[] = [];
  for (const [lang, items] of Object.entries(translations)) {
    parts.push(`${lang}: ${items.join(", ")}`);
  }
  return parts.join(" • ");
}

export function formatExcludedLinkers(excludedLinkers: string[] | null): string {
  if (!excludedLinkers || excludedLinkers.length === 0) {
    return "None";
  }
  return excludedLinkers.map(l => `"${l}"`).join(", ");
}

export function getTranslationsByLanguage(translations: IdeaLinkerTranslations | null): {
  french: string[];
  german: string[];
  italian: string[];
} {
  if (!translations) {
    return { french: [], german: [], italian: [] };
  }
  
  return {
    french: translations.French || [],
    german: translations.German || [],
    italian: translations.Italian || []
  };
}

export function formatTranslationsForLanguage(translations: string[]): string {
  if (!translations || translations.length === 0) return "No translations available";
  return translations.join(", ");
}

// In IdeaLinkerPromptEngine.ts

/**
 * Splits a prompt into Idea 1 and Idea 2 based on the blank marker (___).
 * Handles three main patterns:
 * 1. Blank at the start: "___ idea, main idea." → Uses comma as boundary
 * 2. Blank in the middle: "idea. ___, idea." → Uses period before blank
 * 3. Standard case: "idea ___ idea." → Uses blank as direct boundary
 * 
 * Returns an object with both ideas, or null if the split fails.
 */
export function splitPromptIntoIdeas(promptText: string): { idea1: string; idea2: string } | null {
  const trimmed = promptText.trim();
  const blankIndex = trimmed.indexOf('___');
  
  if (blankIndex === -1) {
    console.warn('Prompt does not contain a blank marker:', promptText);
    return null;
  }
  
  // CASE 1: Blank at the very beginning
  // Example: "___ many competitors, the company succeeded."
  if (blankIndex === 0) {
    // Find the first comma after the blank
    const afterBlank = trimmed.substring(3); // Skip the "___"
    const commaIndex = afterBlank.indexOf(',');
    
    if (commaIndex === -1) {
      // No comma found, split at the blank
      const parts = trimmed.split('___');
      return {
        idea1: parts[0].trim() || '(connecting word goes here)',
        idea2: parts[1]?.trim() || ''
      };
    }
    
    // Split at the comma after the blank
    const idea1Part = afterBlank.substring(0, commaIndex).trim();
    const idea2Part = afterBlank.substring(commaIndex + 1).trim();
    
    return {
      idea1: idea1Part,
      idea2: idea2Part
    };
  }
  
  // CASE 2: Check if there's a period before the blank
  // Example: "First idea. Second idea, ___, continues here."
  const beforeBlank = trimmed.substring(0, blankIndex);
  const lastPeriodIndex = beforeBlank.lastIndexOf('.');
  
  if (lastPeriodIndex !== -1) {
    // There's a period before the blank - split there
    const idea1 = beforeBlank.substring(0, lastPeriodIndex).trim();
    
    // For idea2, take everything after the period, removing the blank
    const afterPeriod = beforeBlank.substring(lastPeriodIndex + 1).trim();
    const afterBlank = trimmed.substring(blankIndex + 3).trim();
    
    // If there's a comma after the blank, include text up to and after it
    const commaIndex = afterBlank.indexOf(',');
    let idea2;
    
    if (commaIndex !== -1) {
      // Reconstruct: "part before blank, part after blank"
      idea2 = afterPeriod + ' ' + afterBlank.substring(commaIndex + 1).trim();
    } else {
      // No comma after blank, just concatenate
      idea2 = (afterPeriod + ' ' + afterBlank).trim();
    }
    
    return {
      idea1: idea1,
      idea2: idea2
    };
  }
  
  // CASE 3: Standard case - blank in the middle, no period before it
  // Example: "The team trained hard ___ their performance was poor."
  const parts = trimmed.split('___');
  
  if (parts.length !== 2) {
    console.warn('Unexpected blank marker count in prompt:', promptText);
    return null;
  }
  
  // Check if there's a comma after the blank in idea2
  const idea2Raw = parts[1].trim();
  const commaIndex = idea2Raw.indexOf(',');
  
  if (commaIndex !== -1 && commaIndex < 3) {
    // There's a comma right after the blank (likely part of the linker format)
    // Remove it from idea2
    return {
      idea1: parts[0].trim(),
      idea2: idea2Raw.substring(commaIndex + 1).trim()
    };
  }
  
  return {
    idea1: parts[0].trim(),
    idea2: idea2Raw
  };
}

/**
 * Test helper function to validate the split logic
 */
export function testPromptSplit(promptText: string): void {
  console.log('Testing:', promptText);
  const result = splitPromptIntoIdeas(promptText);
  if (result) {
    console.log('  Idea 1:', result.idea1);
    console.log('  Idea 2:', result.idea2);
  } else {
    console.log('  FAILED to split');
  }
  console.log('---');
}