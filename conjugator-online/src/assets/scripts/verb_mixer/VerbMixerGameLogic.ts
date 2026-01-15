// GrammarGameLogic.ts

import type { GrammarExercise } from "./VerbMixerPromptEngine";

/* ------------------------------------------------------------------
 * NORMALIZATION
 * - case-insensitive
 * - trims
 * - collapses multiple spaces
 * ------------------------------------------------------------------ */

function normalizeUserText(s: any): string {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/* ------------------------------------------------------------------
 * GET ACCEPTED ANSWERS
 * answer forms + allowed typos
 * ------------------------------------------------------------------ */

export function getAcceptedAnswers(prompt: GrammarExercise): string[] {
  const forms = Array.isArray(prompt.answerForms) ? prompt.answerForms : [];
  const typos = Array.isArray(prompt.allowedTypos) ? prompt.allowedTypos : [];
  const all = [...forms, ...typos]
    .map(normalizeUserText)
    .filter((x) => x.length > 0);

  // de-duplicate
  return Array.from(new Set(all));
}

/* ------------------------------------------------------------------
 * CHECK ANSWER
 * User types complement (e.g., "to go" / "going" / "go")
 * Compare to accepted answers
 * ------------------------------------------------------------------ */

export function checkAnswer(prompt: GrammarExercise, userAnswer: string): boolean {
  const user = normalizeUserText(userAnswer);
  const accepted = getAcceptedAnswers(prompt);
  return accepted.includes(user);
}

/* ------------------------------------------------------------------
 * GAME STATE
 * ------------------------------------------------------------------ */

export interface GameRoundView {
  roundNumber: number; // 1..30
  totalRounds: number;
  sentence: string;
  answerVerb: string; // shown every round
  category: string;
  key: string;
}

export interface RoundResult {
  correct: boolean;
  userAnswer: string;
  acceptedAnswers: string[];
}

export interface GameSession {
  rounds: GrammarExercise[];
  idx: number; // current round index
  score: number;
  history: Array<{
    promptId: string;
    correct: boolean;
    userAnswer: string;
  }>;
}

/* ------------------------------------------------------------------
 * CREATE SESSION
 * ------------------------------------------------------------------ */

export function createSession(rounds: GrammarExercise[]): GameSession {
  return {
    rounds: Array.isArray(rounds) ? rounds : [],
    idx: 0,
    score: 0,
    history: [],
  };
}

/* ------------------------------------------------------------------
 * GET CURRENT ROUND (what you display)
 * ------------------------------------------------------------------ */

export function getCurrentRound(session: GameSession): GameRoundView | null {
  const p = session.rounds[session.idx];
  if (!p) return null;

  return {
    roundNumber: session.idx + 1,
    totalRounds: session.rounds.length,
    sentence: p.sentence,
    answerVerb: p.answerVerb,
    category: p.category,
    key: p.key,
  };
}

/* ------------------------------------------------------------------
 * SUBMIT ANSWER
 * Updates session, returns result
 * ------------------------------------------------------------------ */

export function submitAnswer(
  session: GameSession,
  userAnswer: string
): RoundResult | null {
  const p = session.rounds[session.idx];
  if (!p) return null;

  const correct = checkAnswer(p, userAnswer);
  if (correct) session.score += 1;

  session.history.push({
    promptId: p.id,
    correct,
    userAnswer: String(userAnswer ?? ""),
  });

  const acceptedAnswers = getAcceptedAnswers(p);

  // advance
  session.idx += 1;

  return { correct, userAnswer: String(userAnswer ?? ""), acceptedAnswers };
}

/* ------------------------------------------------------------------
 * FINISHED?
 * ------------------------------------------------------------------ */

export function isFinished(session: GameSession): boolean {
  return session.idx >= session.rounds.length;
}
