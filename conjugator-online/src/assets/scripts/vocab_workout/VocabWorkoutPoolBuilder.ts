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

export function buildPool(items: VocabItem[], settings?: BuildPoolSettings): VocabItem[] {
  const level = settings?.level ?? null;
  if (level === null) return items;
  return items.filter(it => String(it.level) === level);
}

export interface RoundPlan {
  items: VocabItem[];
  roundCount: number;
}

export function buildRoundPlan(
  pool: VocabItem[],
  mode: string,
  opts?: { quizCount?: number }
): RoundPlan {
  const shuffled = shuffle(pool);

  // full-list modes
  if (mode === "cards" || mode === "write" || mode === "multiple_choice") {
    return { items: shuffled, roundCount: shuffled.length };
  }

  // subset mode
  if (mode === "quiz") {
    const n = Math.max(5, Math.min(opts?.quizCount ?? 15, shuffled.length));
    return { items: shuffled.slice(0, n), roundCount: n };
  }

  return { items: shuffled, roundCount: shuffled.length };
}
