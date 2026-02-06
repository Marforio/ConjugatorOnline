// src/assets/scripts/answerNormalize.js

// Characters commonly “typo noise” in your app context
const DROP_CHARS_RE = /[?!.,"“”„'’‘`´]/g;
const SYMBOLS_TO_SPACE_RE = /[&#$]/g;        // treat these as separators
const DASHES_RE = /[-‐-‒–—]/g;               // all dash variants
const MULTISPACE_RE = /\s+/g;

// normalize into a compare-safe form
export function normalizeAnswer(s) {
  return String(s ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(SYMBOLS_TO_SPACE_RE, " ")
    .replace(DASHES_RE, " ")
    .replace(DROP_CHARS_RE, "")
    .replace(MULTISPACE_RE, " ")
    .trim();
}

// Very tolerant match: compare normalized forms,
// plus allow “riverbank” == “river bank” by removing spaces.
export function equalsLoose(user, expected) {
  const a = normalizeAnswer(user);
  const b = normalizeAnswer(expected);

  if (!a || !b) return false;
  if (a === b) return true;

  // allow fused compounds
  if (a.replaceAll(" ", "") === b.replaceAll(" ", "")) return true;

  return false;
}

// compare user against an array of accepted answers
export function matchesAny(user, acceptedArr) {
  return (acceptedArr ?? []).some((exp) => equalsLoose(user, exp));
}
