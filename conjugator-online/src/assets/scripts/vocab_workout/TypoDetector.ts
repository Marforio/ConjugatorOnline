/**
 * Calculates the Levenshtein distance between two strings (edit distance).
 */
export function getEditDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Common-sense typo matcher.
 * Rules:
 * - If target is short (<= 4 chars), allow 0 typos (too easy to guess a different word).
 * - If target is medium (5-9 chars), allow exactly 1 typo.
 * - If target is long (>= 10 chars), allow up to 2 typos.
 * - CRITICAL: The first letter must match (prevents false positives on short/scrambled stems).
 */
export function isObviousTypo(userInput: string, targetAnswer: string): boolean {
  const cleanUser = userInput.trim().toLowerCase().replace(/\s+/g, " ");
  const cleanTarget = targetAnswer.trim().toLowerCase().replace(/\s+/g, " ");

  if (!cleanUser || !cleanTarget) return false;
  if (cleanUser === cleanTarget) return true; // Direct match

  // Strict Safeguard: If the first letter is wrong, it's not a typo, it's a structural misspelling
  if (cleanUser.charAt(0) !== cleanTarget.charAt(0)) return false;

  const distance = getEditDistance(cleanUser, cleanTarget);
  const targetLength = cleanTarget.length;

  if (targetLength <= 4) return distance === 0;      // "cam" -> no typos allowed
  if (targetLength <= 9) return distance <= 1;      // "engine" -> max 1 typo (e.g., "engien")
  return distance <= 2;                             // "connecting rod" -> max 2 typos
}