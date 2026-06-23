import type { VocabItem, BackField } from "./VocabWorkoutPromptEngine";
import { shuffle } from "./VocabWorkoutPoolBuilder";
import { getAcceptedAnswers, isCorrectAnswer } from "./VocabWorkoutPromptEngine";
import { isAnswerAccepted } from "@/assets/scripts/vocab_workout/AnswerNormalize";

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

/**
 * Get field values from custom item (uses additional_data)
 */
/**
 * Get field values from custom item (uses object roots or additional_data)
 */
function getFieldValuesFromCustomItem(item: any, fieldName: string): string[] {
  // Intercept root properties first before checking additional_data
  if (fieldName === "term" && item?.term) {
    return [String(item.term)];
  }
  if (fieldName === "definition" && item?.definition) {
    return [String(item.definition)];
  }

  const data = item.additional_data || {};
  const value = data[fieldName];

  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === "string") {
    return [value].filter(Boolean);
  }
  return [];
}

/**
 * Determine if an item is custom (has additional_data) or hardcoded (has fields)
 */
function isCustomItem(item: any): boolean {
  return !!(item.additional_data && (item.definition || item.part_of_speech));
}

export function buildMultipleChoiceOptions(
  item: VocabItem | any,
  backField: BackField,
  pool: VocabItem[] | any[],
  count = 4
): string[] {
  // Determine correct answer based on item type
  let accepted: string[];
  
  if (isCustomItem(item)) {
    accepted = getFieldValuesFromCustomItem(item, backField);
  } else {
    accepted = getAcceptedAnswers(item as VocabItem, backField);
  }
  
  const correct = accepted[0] || "—";

  // Prefer field-specific distractors (for hardcoded items)
  const fieldSpecific = (item as any).mc?.[backField] || [];
  const generic = (item as any).mc?.generic || [];

  let distractors = [...fieldSpecific, ...generic];

  if (distractors.length === 0) {
    // fallback distractors from pool's same field if possible
    distractors = pool
      .filter((x: any) => x.id !== item.id)
      .map((x: any) => {
        if (isCustomItem(x)) {
          const vals = getFieldValuesFromCustomItem(x, backField);
          return vals[0] || x.term;
        }
        return (getAcceptedAnswers(x as VocabItem, backField)[0] || x.term);
      })
      .filter(Boolean);
  }

  const options = uniq([correct, ...distractors]).filter(Boolean);
  const picked = uniq([correct, ...shuffle(options).filter((x) => x !== correct)]).slice(0, count);
  return shuffle(picked);
}

export function checkUserAnswer(it: any, backField: string, userInput: string): boolean {
  console.group("🧠 [ENGINE DEBUG] checkUserAnswer");
  console.log("Input Item (it)      :", it);
  console.log("Target backField     :", `"${backField}"`);
  console.log("Raw User Input       :", `"${userInput}"`);

  const isCustom = isCustomItem(it);
  console.log("Detected List Type   :", isCustom ? "CUSTOM (Backend DB)" : "HARDCODED (Frontend Script)");

  // both past forms (only for hardcoded irregular verbs)
  if (backField === "past_forms" && !isCustom) {
    console.log("↳ Processing hardcoded 'past_forms' split-matching logic...");
    const parsed = parseBothPastForms(userInput);
    console.log("Parsed User Input tokens:", parsed);
    
    if (!parsed) {
      console.warn("↳ Failed to parse userInput into two distinct past forms.");
      console.groupEnd();
      return false;
    }

    const psAccepted = getAcceptedAnswers(it, "past_simple");
    const ppAccepted = getAcceptedAnswers(it, "present_perfect");
    console.log("Expected Past Simple Array     :", psAccepted);
    console.log("Expected Present Perfect Array  :", ppAccepted);

    const psOk = isAnswerAccepted(parsed.pastSimple, psAccepted);
    const ppOk = isAnswerAccepted(parsed.pastParticiple, ppAccepted);
    console.log(`Evaluation Results -> Past Simple Match: ${psOk} | Past Participle Match: ${ppOk}`);
    
    const finalResult = psOk && ppOk;
    console.log("Final Dual-Form Evaluation:", finalResult);
    console.groupEnd();
    return finalResult;
  }

  // Get accepted answers based on item type
  let accepted: string[];
  if (isCustom) {
    accepted = getFieldValuesFromCustomItem(it, backField);
    console.log("Extracted via getFieldValuesFromCustomItem:", accepted);
  } else {
    accepted = getAcceptedAnswers(it as VocabItem, backField as any);
    console.log("Extracted via getAcceptedAnswers:", accepted);
  }

  // Double-check the ultimate fallback rule since backField is locked to 'term' in write mode
  if (backField === "term") {
    console.log("📝 Note: backField is 'term'. Direct object root evaluation expected context targets:", [it.term]);
  }

  const finalResult = isAnswerAccepted(userInput, accepted);
  console.log("isAnswerAccepted Outcome :", finalResult);
  console.groupEnd();
  
  return finalResult;
}

/**
 * NEW: Check answer for custom items specifically
 */
export function checkUserAnswerForCustomItem(
  item: any,
  fieldName: string,
  userAnswer: string
): boolean {

  const accepted = getFieldValuesFromCustomItem(item, fieldName);

  const finalResult = isAnswerAccepted(userAnswer, accepted);

  return finalResult;
}
/**
 * NEW: Get expected answers from custom item
 */
export function getExpectedAnswersForCustomItem(item: any, fieldName: string): string[] {
  return getFieldValuesFromCustomItem(item, fieldName);
}

function normalizeToken(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/\s+/g, " ");
}

/**
 * Expected format: "<past_simple> <past_participle>"
 * We'll accept:
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

  const pastSimple = normalizeToken(parts[0]);
  const pastParticiple = normalizeToken(parts.slice(1).join(" "));

  if (!pastSimple || !pastParticiple) return null;
  return { pastSimple, pastParticiple };
}

function matchesAccepted(user: string, accepted: string[]) {
  const u = normalizeToken(user);
  return accepted.some((a) => normalizeToken(a) === u);
}