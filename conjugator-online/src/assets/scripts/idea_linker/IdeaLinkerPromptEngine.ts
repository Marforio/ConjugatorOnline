// src/assets/scripts/ideaLinker/IdeaLinkerPromptEngine.ts

import type { IdeaLinkerDataset, IdeaLinkerEntry, IdeaLinkerTranslations } from "./IdeaLinkerPrompts";

export const ROUND_SECONDS = 15;

export type IdeaLinkerSettings = {
  numRounds: number;
  // future-proof toggles
  showTranslations: boolean;
};

export type IdeaLinkerRound = {
  id: string; // `${entryId}:${promptIndex}`
  entryId: string;
  promptIndex: number;
  promptText: string;

  category: string;
  variant: string;
  behavior: string;

  possibleLinkers: string[];
  excludedLinkers: string[];
  translations: IdeaLinkerTranslations | null;

  minAnswers: number;
  maxAnswers: number;
};

export function normalizeForCompare(s: string): string {
  // Auxiliaries-style: remove spaces + punctuation + apostrophes; case-insensitive.
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[?!.]+$/g, "")
    .replace(/[\s.,!;:"()\-–—_/\\]+/g, "")
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

export function flattenDataset(dataset: IdeaLinkerDataset): IdeaLinkerRound[] {
  const rounds: IdeaLinkerRound[] = [];

  for (const [entryId, entry] of Object.entries(dataset)) {
    const d = entryDefaults(entry);

    entry.prompts.forEach((promptText, idx) => {
      rounds.push({
        id: `${entryId}:${idx}`,
        entryId,
        promptIndex: idx,
        promptText: String(promptText),

        category: String(entry.category),
        variant: String(entry.variant),
        behavior: String(entry.behavior),

        possibleLinkers: (entry.possibleLinkers || []).map(String),
        excludedLinkers: d.excludedLinkers,
        translations: d.translations,

        minAnswers: d.minAnswers,
        maxAnswers: d.maxAnswers,
      });
    });
  }

  return rounds;
}

/**
 * Even-ish distribution sampler:
 * - group rounds by entryId
 * - allocate a quota to each entry
 * - shuffle within each entry and take quota
 * - if we still need more, fill from remaining
 */
export function sampleRoundsEvenly(allRounds: IdeaLinkerRound[], numRounds: number): IdeaLinkerRound[] {
  const n = clamp(Number(numRounds) || 0, 1, allRounds.length);

  const byEntry = new Map<string, IdeaLinkerRound[]>();
  for (const r of allRounds) {
    if (!byEntry.has(r.entryId)) byEntry.set(r.entryId, []);
    byEntry.get(r.entryId)!.push(r);
  }

  // shuffle each bucket
  for (const [k, bucket] of byEntry.entries()) {
    byEntry.set(k, shuffle(bucket));
  }

  const entryIds = Array.from(byEntry.keys());
  const baseQuota = Math.floor(n / entryIds.length);
  let remainder = n % entryIds.length;

  const chosen: IdeaLinkerRound[] = [];

  // first pass: base quota + distribute remainder
  for (const entryId of entryIds) {
    const bucket = byEntry.get(entryId)!;
    const take = Math.min(bucket.length, baseQuota + (remainder > 0 ? 1 : 0));
    if (remainder > 0) remainder--;

    chosen.push(...bucket.splice(0, take));
  }

  // fill leftover slots (if some buckets were smaller than quota)
  if (chosen.length < n) {
    const leftovers: IdeaLinkerRound[] = [];
    for (const bucket of byEntry.values()) leftovers.push(...bucket);
    chosen.push(...shuffle(leftovers).slice(0, n - chosen.length));
  }

  return chosen.slice(0, n);
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