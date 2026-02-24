// src/assets/scripts/ideaLinker/IdeaLinkerPromptEngine.ts

import type { IdeaLinkerDataset, IdeaLinkerEntry, IdeaLinkerTranslations } from "./IdeaLinkerPrompts";

export const ROUND_SECONDS = 30;

export type IdeaLinkerSettings = {
  numRounds: number;
  // future-proof toggles
  showTranslations: boolean;
};

export type IdeaLinkerRound = {
  id: string;
  entryId: string;
  promptIndex: number;
  promptText: string;

  category: string;
  variant: string | null;
  behavior: string;

  possibleLinkers: string[];
  excludedLinkers: string[];
  translations: IdeaLinkerTranslations | null;

  minAnswers: number;
  maxAnswers: number;

  imageKey: string;   // raw: variant or category
  imagePath: string;  // "/images/linkers/<slug>.jpg"
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

export function flattenDataset(dataset: IdeaLinkerDataset): IdeaLinkerRound[] {
  const rounds: IdeaLinkerRound[] = [];

  for (const [entryId, entry] of Object.entries(dataset)) {
    const d = entryDefaults(entry);
    const cat = String(entry.category);
    const vari = entry.variant == null ? null : String(entry.variant);

    const img = linkerImagePath(cat, vari);

    entry.prompts.forEach((promptText, idx) => {
      rounds.push({
        id: `${entryId}:${idx}`,
        entryId,
        promptIndex: idx,
        promptText: String(promptText),

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

