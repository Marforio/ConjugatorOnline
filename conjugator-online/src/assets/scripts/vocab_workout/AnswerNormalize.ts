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

/**
 * Compare user input against accepted answers using two-pass matching:
 * Pass 1: normal spacing (river bank != riverbank)
 * Pass 2: no spaces (river bank == riverbank)
 *
 * This makes it forgiving for compounds without being too fuzzy.
 */
export function isAnswerAccepted(userRaw: string, accepted: string[], opts: NormalizeOptions = {}): boolean {
  if (!accepted?.length) return false;

  const user1 = normalizeAnswer(userRaw, { ...opts, removeAllSpaces: false });
  const user2 = normalizeAnswer(userRaw, { ...opts, removeAllSpaces: true });

  // Precompute normalized accepted
  const acc1 = accepted.map(a => normalizeAnswer(a, { ...opts, removeAllSpaces: false }));
  const acc2 = accepted.map(a => normalizeAnswer(a, { ...opts, removeAllSpaces: true }));

  // Exact match under either normalization
  if (acc1.includes(user1)) return true;
  if (acc2.includes(user2)) return true;

  return false;
}
