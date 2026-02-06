import type { VocabItem, BackField } from "./VocabWorkoutPromptEngine";
import { shuffle } from "./VocabWorkoutPoolBuilder";
import { getAcceptedAnswers, isCorrectAnswer } from "./VocabWorkoutPromptEngine";
import { isAnswerAccepted } from "@/assets/scripts/vocab_workout/AnswerNormalize";

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

export function buildMultipleChoiceOptions(
  item: VocabItem,
  backField: BackField,
  pool: VocabItem[],
  count = 4
): string[] {
  const accepted = getAcceptedAnswers(item, backField);
  const correct = accepted[0] || "—";

  // Prefer field-specific distractors:
  // - item.mc[backField] (e.g. past_simple / present_perfect / French)
  // else item.mc.generic (houseElements)
  // else fallback from pool
  const fieldSpecific = item.mc?.[backField] || [];
  const generic = item.mc?.generic || [];

  let distractors = [...fieldSpecific, ...generic];

  if (distractors.length === 0) {
    // fallback distractors from pool’s same field if possible
    distractors =
      pool
        .filter(x => x.id !== item.id)
        .map(x => (getAcceptedAnswers(x, backField)[0] || x.term))
        .filter(Boolean);
  }

  const options = uniq([correct, ...distractors]).filter(Boolean);
  const picked = uniq([correct, ...shuffle(options).filter(x => x !== correct)]).slice(0, count);
  return shuffle(picked);
}

export function checkUserAnswer(it: any, backField: string, userInput: string): boolean {
  // both past forms
  if (backField === "past_forms") {
    const parsed = parseBothPastForms(userInput);
    if (!parsed) return false;

    const psAccepted = getAcceptedAnswers(it, "past_simple");
    const ppAccepted = getAcceptedAnswers(it, "present_perfect"); // (your “past participle” field)

    const psOk = isAnswerAccepted(parsed.pastSimple, psAccepted);
    const ppOk = isAnswerAccepted(parsed.pastParticiple, ppAccepted);
    return psOk && ppOk;
  }

  // existing behavior
  const accepted = getAcceptedAnswers(it, backField as any);
  return isAnswerAccepted(userInput, accepted);
}

function normalizeToken(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");
}

/**
 * Expected format: "<past_simple> <past_participle>"
 * We’ll accept:
 *  - extra whitespace
 *  - slash/comma/semicolon as separator too (optional but nice UX)
 */
export function parseBothPastForms(input: string): { pastSimple: string; pastParticiple: string } | null {
  const raw = String(input ?? "").trim();
  if (!raw) return null;

  // Replace common separators with a single space, then split
  const cleaned = raw.replace(/[\/,;|]+/g, " ").replace(/\s+/g, " ").trim();

  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length < 2) return null;

  // If user typed more than 2 tokens (rare), treat:
  // pastSimple = first token, pastParticiple = rest joined
  // (helps with edge cases like multiword forms)
  const pastSimple = normalizeToken(parts[0]);
  const pastParticiple = normalizeToken(parts.slice(1).join(" "));

  if (!pastSimple || !pastParticiple) return null;
  return { pastSimple, pastParticiple };
}

function matchesAccepted(user: string, accepted: string[]) {
  const u = normalizeToken(user);
  return accepted.some(a => normalizeToken(a) === u);
}
