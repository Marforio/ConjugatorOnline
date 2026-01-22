import type { VocabItem, BackField } from "./VocabWorkoutPromptEngine";
import { shuffle } from "./VocabWorkoutPoolBuilder";
import { getAcceptedAnswers, isCorrectAnswer } from "./VocabWorkoutPromptEngine";

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

export function checkUserAnswer(item: VocabItem, field: BackField, user: string): boolean {
  const accepted = getAcceptedAnswers(item, field);
  return isCorrectAnswer(accepted, user);
}
