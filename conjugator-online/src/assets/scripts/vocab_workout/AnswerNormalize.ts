export type NormalizeOptions = {
  /** If true, remove accents: café -> cafe */
  stripDiacritics?: boolean;

  /** If true, treat hyphens/underscores as spaces before collapsing */
  hyphenAsSpace?: boolean;

  /** If true, remove all spaces (river bank == riverbank) */
  removeAllSpaces?: boolean;

  /** If true, remove punctuation/symbols like & # $ quotes etc. */
  stripPunctuation?: boolean;

  /** If true, lower-case everything */
  lowercase?: boolean;
};

const DEFAULT_OPTS: Required<NormalizeOptions> = {
  stripDiacritics: true,
  hyphenAsSpace: true,
  removeAllSpaces: false,
  stripPunctuation: true,
  lowercase: true,
};

/**
 * Normalize text to reduce false negatives from harmless typos:
 * - smart quotes -> straight quotes
 * - unicode dashes -> hyphen
 * - & # $ quotes etc removed (optional)
 * - hyphens treated as space (optional)
 * - whitespace collapsed
 */
export function normalizeAnswer(raw: string, opts: NormalizeOptions = {}): string {
  const o = { ...DEFAULT_OPTS, ...opts };
  let s = String(raw ?? "").trim();

  // Normalize Unicode (helps diacritics + compatibility chars)
  try {
    s = s.normalize("NFKD");
  } catch {
    // older environments may not support; ignore
  }

  // Convert smart quotes / apostrophes to plain
  s = s
    .replace(/[’‘‛‹›]/g, "'")
    .replace(/[“”„‟«»]/g, '"');

  // Normalize weird dashes to hyphen
  s = s.replace(/[‐-‒–—―]/g, "-");

  if (o.hyphenAsSpace) {
    // treat hyphen/underscore as word separators
    s = s.replace(/[-_]+/g, " ");
  }

  if (o.stripPunctuation) {
    /**
     * Remove punctuation/symbols that are almost always accidental.
     * Keep letters/numbers and spaces.
     * This intentionally removes: & # $ % " ' etc.
     */
    s = s.replace(/[^\p{L}\p{N}\s]/gu, "");
  }

  // Collapse whitespace
  s = s.replace(/\s+/g, " ").trim();

  if (o.stripDiacritics) {
    // Remove combining marks left over from NFKD (accents)
    s = s.replace(/[\u0300-\u036f]/g, "");
  }

  if (o.lowercase) {
    s = s.toLowerCase();
  }

  if (o.removeAllSpaces) {
    s = s.replace(/\s+/g, "");
  }

  return s;
}

/* =========================================================
   Typo Detection Core Algorithm
========================================================= */

/**
 * Calculates the Levenshtein distance between two strings (edit distance).
 */
function getEditDistance(a: string, b: string): number {
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
 * Evaluates whether a normalized user answer is an obvious typo of a normalized target.
 */
function isObviousTypo(userClean: string, targetClean: string): boolean {
  if (!userClean || !targetClean) return false;

  // Safeguard 1: First letter must match (prevents false matches on unrelated short stems)
  if (userClean.charAt(0) !== targetClean.charAt(0)) return false;

  // Safeguard 2: Words must not be wildly different lengths
  if (Math.abs(userClean.length - targetClean.length) > 2) return false;

  const distance = getEditDistance(userClean, targetClean);
  const targetLength = targetClean.length;

  // Common-sense scaling parameters:
  if (targetLength <= 4) return distance === 0; // Short strings ("cam", "gear"): 0 typos allowed
  if (targetLength <= 9) return distance <= 1; // Medium strings ("engine", "piston"): Max 1 typo allowed
  return distance <= 2;                        // Long strings ("connecting rod"): Max 2 typos allowed
}

/**
 * Compare user input against accepted answers using three-pass matching:
 * Pass 1: normal spacing (river bank != riverbank)
 * Pass 2: no spaces (river bank == riverbank)
 * Pass 3: Common-sense typo matcher on space-normalized entries
 *
 * This makes it forgiving for compounds without being too fuzzy.
 */
export function isAnswerAccepted(userRaw: string, accepted: string[], opts: NormalizeOptions = {}): boolean {
  if (!accepted?.length) return false;

  // --- PASS 1 & 2: STRICT NORMALIZATION MATCHES ---
  const user1 = normalizeAnswer(userRaw, { ...opts, removeAllSpaces: false });
  const user2 = normalizeAnswer(userRaw, { ...opts, removeAllSpaces: true });

  const acc1 = accepted.map((a) => normalizeAnswer(a, { ...opts, removeAllSpaces: false }));
  if (acc1.includes(user1)) return true;

  const acc2 = accepted.map((a) => normalizeAnswer(a, { ...opts, removeAllSpaces: true }));
  if (acc2.includes(user2)) return true;

  // --- PASS 3: TYPO DETECTION BACKUP FILTER ---
  // Run typo evaluation on space-normalized strings so multi-word boundaries remain clean
  return acc1.some((targetClean) => isObviousTypo(user1, targetClean));
}