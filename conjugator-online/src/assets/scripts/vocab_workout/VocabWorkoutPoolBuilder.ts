import type { VocabItem } from "./VocabWorkoutPromptEngine";

export function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface BuildPoolSettings {
  level?: "essential" | "advanced" | null;
}

export function buildPool(items: (VocabItem | any)[], settings?: BuildPoolSettings): (VocabItem | any)[] {
  const level = settings?.level ?? null;
  if (level === null) return items;
  
  return items.filter((it) => {
    // For custom items, level might be in additional data or null
    const itemLevel = it.level || it.additional_data?.level || null;
    return String(itemLevel) === level;
  });
}

export interface RoundPlan {
  items: (VocabItem | any)[];
  roundCount: number;
}

export function buildRoundPlan(
  pool: (VocabItem | any)[],
  mode: string,
  opts?: { quizCount?: number }
): RoundPlan {
  const shuffled = shuffle(pool);

  if (mode === "cards" || mode === "write" || mode === "multiple_choice") {
    return { items: shuffled, roundCount: shuffled.length };
  }

  if (mode === "quiz") {
    const n = Math.max(5, Math.min(opts?.quizCount ?? 15, shuffled.length));
    return { items: shuffled.slice(0, n), roundCount: n };
  }

  return { items: shuffled, roundCount: shuffled.length };
}