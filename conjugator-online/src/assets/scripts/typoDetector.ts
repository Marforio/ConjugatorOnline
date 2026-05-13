/* Frontend typo detector for Conjugator.
   Rule/gate based. Designed for immediate UX feedback.

   What this module does
   ---------------------
   Given:
     - prompt context: tense, sentence type, person, verb lemma
     - user answer string
     - list of acceptable answers (exact strings)
   it returns:
     - isTypo: should we treat the answer as a "typo / near miss" (for UX only)
     - forceWrong + reason: hard grammar/morphology violations (must NOT be treated as typos)

   Philosophy (matching the Python notebook)
   ----------------------------------------
   1) First apply "hard gates" (branching rules). If any gate triggers, we forceWrong.
      These gates encode teacher policy: certain mistakes are *not* typos, even if close
      in edit-distance (e.g., wrong auxiliary family, DID + V-ed, missing HAVE, etc.)

   2) If no hard gate triggers, compute a conservative edit-distance score to the closest
      acceptable answer and classify as typo if levMin <= threshold.

   v3 notes (your current base):
   - sentenceType normalization ("Questions"/"Positive"/etc.)
   - subject omission tolerance for Declarative/Negative (not Question) by expanding
     acceptable answers to include subject-stripped variants for distance computation.
   - present continuous doubling enforcement (grabing => forceWrong)
   - expanded irregular allowlist

   New in this revision (still v3; you can bump if you want)
   ---------------------------------------------------------
   (1) Time keyword stripping added to normalization/scoring (from notebook).
   (2) Thorough comments for every gate.
   (3) Gate wiring audit: ensure every declared gate is called from detectTypo().
*/

export const TYPO_DETECTOR_VERSION = "2026-05-12.v3";

export type SentenceType = "Declarative" | "Negative" | "Question";
export type Tense =
  | "Present simple"
  | "Past simple"
  | "Future simple"
  | "Present continuous"
  | "Present perfect"
  | "Recommendation";

export interface TypoInput {
  tense: Tense | string;
  sentenceType: SentenceType | string;
  person: string;
  verb: string; // lemma
  userAnswer: string;
  correctAnswers: string[]; // acceptable answers (including abbreviations)
}

export interface TypoOutput {
  version: string;
  isTypo: boolean;
  forceWrong: boolean;
  forceWrongReason: string;
  debug?: Record<string, any>;
}

/** -------------------- helpers: unicode + tokenize -------------------- **/

function stripDiacritics(s: string): string {
  return (s ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeText(s: string): string {
  return stripDiacritics((s ?? "").toLowerCase().normalize("NFKC"));
}

export function tokens(s: string): string[] {
  let x = normalizeText(s);
  x = x.replace(/[^a-z'\s]+/g, " "); // keep letters + apostrophes
  x = x.replace(/\s+/g, " ").trim();
  return x ? x.split(" ") : [];
}

export function normToken(t: string): string {
  let x = normalizeText(t);
  x = x.replace(/[^a-z']+/g, "");
  return x;
}

/** -------------------- sentence type normalization -------------------- **/
export function normSentenceType(st: any): SentenceType {
  const s = normalizeText(String(st ?? "")).trim();
  if (!s) return "Declarative";
  if (s.startsWith("q")) return "Question"; // Question / Questions
  if (s.startsWith("neg")) return "Negative";
  if (s.startsWith("pos")) return "Declarative"; // Positive
  if (s.startsWith("decl")) return "Declarative";
  return "Declarative";
}

/** -------------------- subject helpers -------------------- **/
const SUBJECTS = new Set(["i", "you", "he", "she", "it", "we", "they"]);

function stripLeadingSubject(ans: string): string {
  const toks = tokens(ans);
  if (toks.length <= 1) return ans;
  if (!SUBJECTS.has(toks[0])) return ans;
  return toks.slice(1).join(" ");
}

/** -------------------- time keyword stripping (from notebook) --------------------
  In the notebook you removed "time fillers" before scoring so that:
    "yesterday i went" vs "i went" doesn't inflate edit distance
  This should ONLY affect normalization for scoring/typo distance, not hard gates
  about auxiliaries etc. (those should still see the whole answer).

  Adjust this list to match your game's actual time reference vocabulary.
*/
const TIME_FILLERS = new Set<string>([
  "occasionally", "rarely", "sometimes", "seldom", "always", "usually", "often", "regularly", "here and there", "every day",
                        "every week", "every month", "every year", "twice a week", "once a month", "once a year",
                        "on Mondays", "on Tuesdays", "on Wednesdays", "on Thursdays", "on Fridays", "on Saturdays",
                        "on Sundays", "now", "currently", "at the moment", "right now", "as we speak", "yesterday", "last week", "last month", "last year", "2 weeks ago", "5 years ago", "in 2008", "when I was a child",
                        "since 2020", "since 2003", "in the last 3 months", "for the last 5 years", "for 2 weeks",
                         "in my life", "so far", "up to now", "until now", "recently", "lately", "next week", "in 2030", "when I graduate", "in 2 years", "next summer", "in the future", "recommendation"
                      ]);

function normalizeForScoring(text: string): string {
  // 1) tokenize
  let toks = tokens(text);

  // 2) remove time fillers
  toks = toks.filter((t) => !TIME_FILLERS.has(t));

  return toks.join(" ");
}

/** -------------------- contractions helpers -------------------- **/

function hasLLContractionWill(userAnswer: string): boolean {
  const s = normalizeText(userAnswer);
  return /\b(i|you|he|she|it|we|they)'ll\b/.test(s);
}

function hasSContractionHave(userAnswer: string): boolean {
  const s = normalizeText(userAnswer);
  return /\b(he|she|it|who|that|there|what)'s\b/.test(s);
}

function hasDContractionShould(userAnswer: string): boolean {
  const s = normalizeText(userAnswer);
  return /\b(i|you|he|she|it|we|they)'d\b/.test(s);
}

/** Accept "he s done" / "we ve done" as near contraction forms by rewriting spaced variants. */
function normalizeSpacedContractions(s: string): string {
  let x = normalizeText(s);

  // subjects + s => 's
  x = x.replace(/\b(i|you|he|she|it|we|they)\s+s\b/g, "$1's");
  // subjects + ve => 've
  x = x.replace(/\b(i|you|we|they)\s+ve\b/g, "$1've");
  // You can extend:
  // x = x.replace(/\b(i|you|he|she|it|we|they)\s+ll\b/g, "$1'll");

  return x;
}

/** -------------------- levenshtein + similarity -------------------- **/

export function levenshtein(a: string, b: string): number {
  a = a ?? "";
  b = b ?? "";
  const n = a.length,
    m = b.length;
  if (n === 0) return m;
  if (m === 0) return n;

  const dp = new Array<number>(m + 1);
  for (let j = 0; j <= m; j++) dp[j] = j;

  for (let i = 1; i <= n; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= m; j++) {
      const tmp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return dp[m];
}

export function normLev(a: string, b: string): number {
  const denom = Math.max((a ?? "").length, (b ?? "").length, 1);
  return levenshtein(a ?? "", b ?? "") / denom;
}

export function sim(a: string, b: string): number {
  return 1 - normLev(normToken(a), normToken(b));
}

/** -------------------- accepted matching -------------------- **/
export function bestAccepted(userAnswer: string, correctAnswers: string[]) {
  const ua = userAnswer ?? "";
  const acc = Array.isArray(correctAnswers) ? correctAnswers : [];
  if (acc.length === 0) return { best: "", levMin: 1.0 };

  let best = acc[0];
  let bestLev = normLev(ua, acc[0]);
  for (const a of acc) {
    const d = normLev(ua, a);
    if (d < bestLev) {
      bestLev = d;
      best = a;
    }
  }
  return { best, levMin: bestLev };
}

/** -------------------- irregular normalization helper (for Game.start()) -------------------- **/
export function normalizeIrregulars(irregJson: any) {
  const out: Record<string, { past_simple: string; past_participle: string }> = {};
  for (const [lemma, v] of Object.entries(irregJson || {})) {
    if (Array.isArray(v) && v.length >= 2) {
      out[String(lemma).toLowerCase()] = {
        past_simple: String(v[0]).toLowerCase(),
        past_participle: String(v[1]).toLowerCase(),
      };
    } else if (v && typeof v === "object") {
      out[String(lemma).toLowerCase()] = {
        past_simple: String((v as any).past_simple || (v as any).past || "").toLowerCase(),
        past_participle: String(
          (v as any).past_participle || (v as any).pastParticiple || (v as any).pp || ""
        ).toLowerCase(),
      };
    }
  }
  return out;
}

/** -------------------- aux families --------------------
  Used by:
   - gateAuxWrongFamily (wrong auxiliary family)
   - gatePresentPerfectMissingHave (missing HAVE)
   - gateRecommendationMissingShould (missing SHOULD)
   - gatePastSimpleDidRequiresBase (DID + V-ed)
   - gateFutureMissingWill / gateFutureWillRequiresLemmaBase
*/
const AUX_FAM: Record<string, Set<string>> = {
  DID: new Set(["did", "didnt", "didn't"]),
  DO: new Set(["do", "does", "dont", "don't", "doesnt", "doesn't"]),
  HAVE: new Set(["have", "has", "havent", "haven't", "hasnt", "hasn't", "ve", "'ve"]), // include contractions like 've (they've) as HAVE family
  HAD: new Set(["had", "hadnt", "hadn't"]),
  BE: new Set(["am", "is", "are", "was", "were", "aint", "isnt", "isn't", "arent", "aren't","m", "'m", "re", "'re"]), 
  SHOULD: new Set(["should", "shouldnt", "shouldn't"]),
  WILL: new Set(["will", "wont", "won't", "ll"]),
};

function expectedAuxFamily(tense: Tense, sentenceType: SentenceType): string | null {
  // This is used for the "aux wrong family" gate.
  if (tense === "Present perfect") return "HAVE";
  if (tense === "Recommendation") return "SHOULD";
  if (tense === "Past simple" && (sentenceType === "Negative" || sentenceType === "Question")) return "DID";
  if (tense === "Present simple" && (sentenceType === "Negative" || sentenceType === "Question")) return "DO";
  if (tense === "Present continuous") return "BE";
  if (tense === "Future simple") return "WILL";
  return null;
}

function auxCandidateTokens(userAnswer: string): string[] {
  // Heuristic window: first few tokens + any "n't" tokens later.
  // Excludes participle-looking tokens to reduce e.g. "done" matching "don't".
  const toks = tokens(userAnswer);
  const cand: string[] = [];

  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];

    // keep original token selection logic
    if (i <= 3) cand.push(t);
    else if (t.endsWith("nt") || t.includes("n't")) cand.push(t);

    // NEW: also extract contraction suffix from tokens like "you've", "they're", "i'm", "he's"
    // tokens() keeps apostrophes, so these arrive as a single token with "'"
    const apos = t.indexOf("'");
    if (apos > 0 && apos < t.length - 1) {
      const suffix = t.slice(apos);      // e.g. "'ve", "'re", "'m", "'s", "n't"
      const suffixNoApos = t.slice(apos + 1); // e.g. "ve", "re", "m", "s", "nt"

      // push both forms so it matches either "'ve" or "ve" depending on your AUX_FAM sets
      cand.push(suffix);
      cand.push(suffixNoApos);
    }
  }

  // keep your original "not participle-looking" filter, but apply it at the end
  // so contraction suffixes like "'ve" aren't accidentally dropped.
  return cand.filter((t) => {
    // don't drop contractions like "'ve" just because they end with "e"
    if (t.startsWith("'")) return true;

    // drop obvious participle-ish tokens to avoid false aux matches
    return !(t.endsWith("ed") || t.endsWith("en") || t.endsWith("ing"));
  });
}

function bestFamilyMatch(userToks: string[], famWords: Set<string>) {
  let bestS = 0;
  let bestU = "";
  let bestT = "";
  for (const u of userToks) {
    for (const t of famWords) {
      const s = sim(u, t);
      if (s > bestS) {
        bestS = s;
        bestU = u;
        bestT = t;
      }
    }
  }
  return { bestS, bestU, bestT };
}

/** -------------------- GATES: Aux / structure -------------------- **/

/**
 * gateAuxWrongFamily (A1-ish)
 * ---------------------------
 * If the user uses a clearly identifiable auxiliary family, but it's the WRONG family
 * for the prompt's tense/sentence type, then this is NOT a typo.
 *
 * Example: Present perfect expected HAVE, user uses DID -> forceWrong
 */
function gateAuxWrongFamily(input: TypoInput, minConf = 0.72, margin = 0.06) {
  const st = normSentenceType(input.sentenceType);
  const tense = input.tense as Tense;
  const need = expectedAuxFamily(tense, st);
  if (!need) return { bad: false, reason: "" };

  const cand = auxCandidateTokens(input.userAnswer);
  const famScores: Record<string, ReturnType<typeof bestFamilyMatch>> = {};
  for (const fam of Object.keys(AUX_FAM)) {
    famScores[fam] = bestFamilyMatch(cand, AUX_FAM[fam]);
  }

  // pick best family overall
  let bestFam = Object.keys(famScores)[0];
  for (const fam of Object.keys(famScores)) {
    if (famScores[fam].bestS > famScores[bestFam].bestS) bestFam = fam;
  }

  const sBest = famScores[bestFam].bestS;
  const sNeed = famScores[need]?.bestS ?? 0;

  // If a wrong family is very confidently present, reject as "not typo"
  if (sBest >= minConf && bestFam !== need && sBest >= sNeed + margin) {
    const { bestU, bestT } = famScores[bestFam];
    return {
      bad: true,
      reason: `aux_wrong_family(found=${bestFam} via ${bestU}~${bestT} sim=${sBest.toFixed(2)}, need=${need})`,
    };
  }
  return { bad: false, reason: "" };
}

/**
 * gatePresentPerfectMissingHave (A2)
 * ---------------------------------
 * Present perfect requires HAVE/has/'s (acceptable contractions).
 * Missing HAVE is a hard grammar error, not a typo.
 */
function gatePresentPerfectMissingHave(input: TypoInput, minHave = 0.72) {
  const tense = input.tense as Tense;
  if (tense !== "Present perfect") return { bad: false, reason: "" };

  const cand = auxCandidateTokens(input.userAnswer);
  const m = bestFamilyMatch(cand, AUX_FAM.HAVE);

  if (m.bestS >= minHave) return { bad: false, reason: "" };
  if (hasSContractionHave(input.userAnswer)) return { bad: false, reason: "" };

  return { bad: true, reason: `present_perfect_missing_have(best_have_sim=${m.bestS.toFixed(2)})` };
}

/**
 * gateRecommendationMissingShould
 * ------------------------------
 * Recommendation tense requires SHOULD (or 'd contraction treated as SHOULD in your policy).
 * Missing SHOULD is a hard grammar error.
 */
function gateRecommendationMissingShould(input: TypoInput, minShould = 0.72) {
  const tense = input.tense as Tense;
  if (tense !== "Recommendation") return { bad: false, reason: "" };

  const cand = auxCandidateTokens(input.userAnswer);
  const m = bestFamilyMatch(cand, AUX_FAM.SHOULD);

  if (m.bestS >= minShould) return { bad: false, reason: "" };
  if (hasDContractionShould(input.userAnswer)) return { bad: false, reason: "" };

  return { bad: true, reason: `recommendation_missing_should(best_should_sim=${m.bestS.toFixed(2)})` };
}

/**
 * gateRecommendationShouldRequiresBase
 * -----------------------------------
 * If SHOULD is present, the following verb must be base form. Pattern "should + V-ed" is NOT a typo.
 * (Analogous to DID + base.)
 *
 * Examples to reject:
 *   "you should separated" (should + V-ed)
 */
function gateRecommendationShouldRequiresBase(input: TypoInput, shouldSim = 0.64) {
  const tense = input.tense as Tense;
  if (tense !== "Recommendation") return { bad: false, reason: "" };

  const cand = auxCandidateTokens(input.userAnswer);
  const m = bestFamilyMatch(cand, AUX_FAM.SHOULD);
  if (m.bestS < shouldSim) return { bad: false, reason: "" };

  const toks = tokens(input.userAnswer);
  const wrongEd = toks.find((t) => t.endsWith("ed"));
  if (wrongEd) return { bad: true, reason: `should_requires_base(found_ed=${wrongEd}, lemma=${input.verb})` };

  return { bad: false, reason: "" };
}

/**
 * gatePastSimpleDidRequiresBase (A3)
 * ---------------------------------
 * For Past simple questions/negatives, DID must be followed by base form.
 * "did + V-ed" is a hard error, not typo.
 */
function gatePastSimpleDidRequiresBase(input: TypoInput, didSim = 0.64) {
  const st = normSentenceType(input.sentenceType);
  const tense = input.tense as Tense;
  if (!(tense === "Past simple" && (st === "Negative" || st === "Question"))) {
    return { bad: false, reason: "" };
  }

  const cand = auxCandidateTokens(input.userAnswer);
  const m = bestFamilyMatch(cand, AUX_FAM.DID);
  if (m.bestS < didSim) return { bad: false, reason: "" };

  const toks = tokens(input.userAnswer);
  const wrongEd = toks.find((t) => t.endsWith("ed"));
  if (wrongEd) return { bad: true, reason: `did_requires_base(found_ed=${wrongEd}, lemma=${input.verb})` };

  return { bad: false, reason: "" };
}

/**
 * gateFutureMissingWill
 * --------------------
 * Future simple requires WILL (or 'll).
 * Missing WILL is hard grammar error (not typo).
 */
function gateFutureMissingWill(input: TypoInput, minWillSim = 0.72) {
  const tense = input.tense as Tense;
  if (tense !== "Future simple") return { bad: false, reason: "" };

  const cand = auxCandidateTokens(input.userAnswer);
  const m = bestFamilyMatch(cand, AUX_FAM.WILL);

  if (m.bestS >= minWillSim) return { bad: false, reason: "" };
  if (hasLLContractionWill(input.userAnswer)) return { bad: false, reason: "" };

  return { bad: true, reason: `future_missing_will(best_will_sim=${m.bestS.toFixed(2)})` };
}

/**
 * gateFutureWillRequiresLemmaBase
 * ------------------------------
 * If WILL is present, the main verb should be base form of the target lemma.
 *
 * This prevents shocking FP typos like:
 *   target verb=fall, user writes: "we will fell"  (different verb, not typo)
 *
 * It also blocks WILL combined with participles/gerunds:
 *   "will fallen" / "will falling" / "will disturbed" are NOT typos.
 */
function gateFutureWillRequiresLemmaBase(input: TypoInput, minWillSim = 0.64, minVerbSim = 0.9) {
  const tense = input.tense as Tense;
  if (tense !== "Future simple") return { bad: false, reason: "" };

  const lemma = normToken(input.verb);
  if (!lemma) return { bad: false, reason: "" };

  const cand = auxCandidateTokens(input.userAnswer);
  const m = bestFamilyMatch(cand, AUX_FAM.WILL);
  const hasWill = m.bestS >= minWillSim || hasLLContractionWill(input.userAnswer);
  if (!hasWill) return { bad: false, reason: "" };

  const toks = tokens(input.userAnswer);
  if (toks.length === 0) return { bad: true, reason: "will_requires_base(no_tokens)" };

  // Hard reject common wrong morphology after WILL
  const wrongIng = toks.find((t) => t.endsWith("ing"));
  if (wrongIng) return { bad: true, reason: `will_requires_base(found_ing=${wrongIng}, lemma=${lemma})` };

  const wrongEd = toks.find((t) => t.endsWith("ed"));
  if (wrongEd) return { bad: true, reason: `will_requires_base(found_ed=${wrongEd}, lemma=${lemma})` };

  const wrongEn = toks.find((t) => t.endsWith("en"));
  if (wrongEn) return { bad: true, reason: `will_requires_base(found_en=${wrongEn}, lemma=${lemma})` };

  // Hard reject if the best verb-like token isn't basically the lemma (prevents "fall" -> "fell")
  let bestTok = toks[0];
  let bestS = sim(bestTok, lemma);
  for (const t of toks) {
    const s = sim(t, lemma);
    if (s > bestS) {
      bestS = s;
      bestTok = t;
    }
  }
  if (bestS < minVerbSim) {
    return { bad: true, reason: `will_wrong_verb(best_sim=${bestS.toFixed(2)}, best_tok=${bestTok}, lemma=${lemma})` };
  }

  return { bad: false, reason: "" };
}

/** -------------------- present simple -es gate -------------------- **/

const CONSONANTS = new Set("bcdfghjklmnpqrstvwxyz".split(""));

function expectedPresentSimple3sg(verb: string): string {
  const v = normToken(verb);
  if (!v) return v;

  const problemEnd1 = new Set(["x", "s"]);
  const problemEnd2 = new Set(["ss", "sh", "ch"]);

  if (v.length >= 2 && v.endsWith("y") && CONSONANTS.has(v[v.length - 2])) return v.slice(0, -1) + "ies";
  if (problemEnd1.has(v[v.length - 1]) || problemEnd2.has(v.slice(-2)) || v === "go" || v === "do") return v + "es";
  return v + "s";
}

function pickUserVerbToken(userAnswer: string, expected: string): string {
  const toks = tokens(userAnswer);
  if (toks.length === 0) return "";
  let best = toks[0],
    bestS = -1;
  for (const t of toks) {
    const s = sim(t, expected);
    if (s > bestS) {
      bestS = s;
      best = t;
    }
  }
  return best;
}

/**
 * gatePresentSimpleMissingEs
 * -------------------------
 * Hard rule: if 3rd-person singular declarative requires "...es" but user wrote "...s",
 * treat as not-typo.
 *
 * Example: "she rushs" when expected "she rushes"
 */
function gatePresentSimpleMissingEs(input: TypoInput) {
  const tense = input.tense as Tense;
  const st = normSentenceType(input.sentenceType);

  if (tense !== "Present simple") return { bad: false, reason: "" };
  if (st !== "Declarative") return { bad: false, reason: "" };

  const p = normToken(input.person);
  if (!(p === "he" || p === "she" || p === "it")) return { bad: false, reason: "" };

  const verb = normToken(input.verb);
  const exp = expectedPresentSimple3sg(verb);
  const uTok = pickUserVerbToken(input.userAnswer, exp);

  if (exp.endsWith("es") && uTok === verb + "s") {
    return { bad: true, reason: `present_simple_missing_es(user_tok=${uTok}, expected=${exp})` };
  }
  return { bad: false, reason: "" };
}

/** -------------------- regular morphology: doubling + -ed/-ing -------------------- **/

const VOWELS_SET = new Set("aeiou".split(""));
const NON_DOUBLING_CONSONANTS = new Set(["w", "x", "y"]);
const L_DOUBLING_LEMMAS = new Set(["cancel", "level", "travel", "model", "label", "signal", "unravel", "rebel", "revel"]);

const NON_DOUBLING = new Set([
  "abandon","administer","allow","alter","anger","answer","benefit","bother","broaden","cater","color","combat","consider","counter","cover","credit","deliver","develop",
  "differ","discover","discredit","edit","encounter","enter","exhibit","favor","focus","foster","frighten","gather","happen","hasten","honor","inherit","inhibit","interpret",
  "lengthen","limit","listen","lower","master","market","minister","misinterpret","monitor","murder","offer","open","order","pocket","ponder","profit","reckon","reconsider",
  "recover","register","remember","render","rocket","shorten","signal","skyrocket","soften","strengthen","suffer","summon","surrender","target","threaten","tighten","transfer",
  "visit","wager","wander","weaken","widen","wonder",
]);

function shouldDouble(lemma: string): boolean {
  const a = normToken(lemma);
  if (a.length < 3) return false;
  if (NON_DOUBLING.has(a)) return false;

  const c3 = a[a.length - 3];
  const v2 = a[a.length - 2];
  const c1 = a[a.length - 1];

  return CONSONANTS.has(c3) && VOWELS_SET.has(v2) && CONSONANTS.has(c1) && !NON_DOUBLING_CONSONANTS.has(c1);
}

function missingDoubleConsonant(userWord: string, correctWord: string): boolean {
  const u = normToken(userWord).replace(/'/g, "");
  const c = normToken(correctWord).replace(/'/g, "");
  if (c.length !== u.length + 1) return false;

  for (let i = 1; i < c.length; i++) {
    if (c[i] === c[i - 1] && CONSONANTS.has(c[i])) {
      if (c.slice(0, i) + c.slice(i + 1) === u) return true;
    }
  }
  return false;
}

function regularEd(lemma: string): string {
  const v = normToken(lemma);
  if (!v) return v;
  if (shouldDouble(v)) return v + v[v.length - 1] + "ed";
  if (v.endsWith("e")) return v + "d";
  if (v.length >= 2 && v.endsWith("y") && CONSONANTS.has(v[v.length - 2])) return v.slice(0, -1) + "ied";
  return v + "ed";
}

function regularIng(lemma: string): string {
  const v = normToken(lemma);
  if (!v) return v;

  if (shouldDouble(v)) return v + v[v.length - 1] + "ing";
  if (v.endsWith("e") && !v.endsWith("ee")) return v.slice(0, -1) + "ing";
  return v + "ing";
}

/** Not currently used for gating (kept because it mirrors notebook tooling). */
function isLDoublingVariant(uTok: string, expTok: string): boolean {
  const u = normToken(uTok).replace(/'/g, "");
  const e = normToken(expTok).replace(/'/g, "");

  const m1 = e.match(/^(.*)ll(ed|ing)$/);
  if (m1) return `${m1[1]}l${m1[2]}` === u;

  const m2 = e.match(/^(.*)l(ed|ing)$/);
  if (m2) return `${m2[1]}ll${m2[2]}` === u;

  return false;
}

function expectedPrincipal(
  lemma: string,
  tense: Tense,
  sentenceType: SentenceType,
  IRREG: Record<string, { past_simple: string; past_participle: string }>
) {
  const v = normToken(lemma);
  if (!v) return "";

  if (tense === "Past simple" && sentenceType === "Declarative") {
    if (IRREG[v]) return IRREG[v].past_simple;
    return regularEd(v);
  }

  if (tense === "Present perfect") {
    if (IRREG[v]) return IRREG[v].past_participle;
    return regularEd(v);
  }

  return "";
}

/** -------------------- GATES: BE + -ing (present continuous) -------------------- **/

/**
 * gatePresentContinuousMissingBe
 * ------------------------------
 * Present continuous requires BE (am/is/are/...) regardless of sentence polarity.
 */
function gatePresentContinuousMissingBe(input: TypoInput, minBeSim = 0.72) {
  const tense = input.tense as Tense;
  if (tense !== "Present continuous") return { bad: false, reason: "" };

  const cand = auxCandidateTokens(input.userAnswer);
  const m = bestFamilyMatch(cand, AUX_FAM.BE);
  if (m.bestS >= minBeSim) return { bad: false, reason: "" };

  return { bad: true, reason: `present_continuous_missing_be(best_be_sim=${m.bestS.toFixed(2)})` };
}

/**
 * gatePresentContinuousNegativeRequiresBeNot
 * -----------------------------------------
 * If sentence type is Negative, the user should express negation with BE + not / n't.
 * Pattern "she not instructing" (no BE) is hard wrong.
 */
function gatePresentContinuousNegativeRequiresBeNot(input: TypoInput, minBeSim = 0.72) {
  const tense = input.tense as Tense;
  const st = normSentenceType(input.sentenceType);
  if (!(tense === "Present continuous" && st === "Negative")) return { bad: false, reason: "" };

  const toks = tokens(input.userAnswer);
  const hasNot = toks.includes("not") || toks.some((t) => t.endsWith("n't"));
  if (!hasNot) return { bad: false, reason: "" };

  const cand = auxCandidateTokens(input.userAnswer);
  const m = bestFamilyMatch(cand, AUX_FAM.BE);
  if (m.bestS < minBeSim) {
    return { bad: true, reason: `present_continuous_negative_missing_be(best_be_sim=${m.bestS.toFixed(2)})` };
  }

  return { bad: false, reason: "" };
}

/**
 * gatePresentContinuousRequiresIng
 * -------------------------------
 * Present continuous requires an -ing form (not bare lemma).
 * Blocks: "i am not discharge" (should be discharging)
 */
function gatePresentContinuousRequiresIng(input: TypoInput) {
  const tense = input.tense as Tense;
  if (tense !== "Present continuous") return { bad: false, reason: "" };

  const lemma = normToken(input.verb);
  if (!lemma) return { bad: false, reason: "" };

  const expIng = regularIng(lemma);
  const uTok = pickUserVerbToken(input.userAnswer, expIng);

  if (uTok === lemma) {
    return { bad: true, reason: `present_continuous_missing_ing(user_tok=${uTok}, expected=${expIng})` };
  }

  const toks = tokens(input.userAnswer);
  if (!toks.some((t) => t.endsWith("ing"))) {
    return { bad: true, reason: `present_continuous_missing_ing(no_ing_token, expected=${expIng})` };
  }

  return { bad: false, reason: "" };
}

/**
 * gatePresentContinuousMissingDoubling
 * -----------------------------------
 * For verbs where CVC doubling is required (grab -> grabbing),
 * missing the doubled consonant is treated as hard wrong (not typo).
 */
function gatePresentContinuousMissingDoubling(input: TypoInput) {
  const tense = input.tense as Tense;
  if (tense !== "Present continuous") return { bad: false, reason: "" };

  const lemma = normToken(input.verb);
  if (!lemma) return { bad: false, reason: "" };

  if (!shouldDouble(lemma)) return { bad: false, reason: "" };

  const expIng = regularIng(lemma);
  const uTok = pickUserVerbToken(input.userAnswer, expIng);

  if (missingDoubleConsonant(uTok, expIng)) {
    return { bad: true, reason: `present_continuous_missing_double(user_tok=${uTok}, expected=${expIng})` };
  }

  return { bad: false, reason: "" };
}

function gatePresentContinuousBeAgreement(input: TypoInput, minBeSim = 0.72) {
  const tense = input.tense as Tense;
  if (tense !== "Present continuous") return { bad: false, reason: "" };

  // expected BE form from person
  const p = normToken(input.person);
  if (!p) return { bad: false, reason: "" };

  const expected =
    p === "i" ? "am" :
    (p === "he" || p === "she" || p === "it") ? "is" :
    "are"; // you/we/they default

  const cand = auxCandidateTokens(input.userAnswer);
  const m = bestFamilyMatch(cand, AUX_FAM.BE);
  if (m.bestS < minBeSim) return { bad: false, reason: "" }; // BE not confidently present; other gates handle missing BE

  // find best token match to the expected form specifically
  let bestS = 0;
  let bestTok = "";
  for (const t of cand) {
    const s = sim(t, expected);
    if (s > bestS) {
      bestS = s;
      bestTok = t;
    }
  }

  // If they used BE but it's not the right member (isnt vs arent, etc.)
  if (bestS < 0.85) {
    return {
      bad: true,
      reason: `present_continuous_be_agreement(expected=${expected}, best_tok=${bestTok}, best_sim=${bestS.toFixed(2)})`,
    };
  }

  return { bad: false, reason: "" };
}

/** -------------------- GATES: DO agreement -------------------- **/

/**
 * gatePresentSimpleDoAgreement
 * ---------------------------
 * Present simple Question/Negative requires DO support.
 * DO must agree with person:
 *  - he/she/it -> does
 *  - otherwise -> do
 *
 * Blocks: "does you inform"
 */
function gatePresentSimpleDoAgreement(input: TypoInput, minDoSim = 0.72) {
  const tense = input.tense as Tense;
  const st = normSentenceType(input.sentenceType);
  if (!(tense === "Present simple" && (st === "Question" || st === "Negative"))) return { bad: false, reason: "" };

  const p = normToken(input.person);
  if (!p) return { bad: false, reason: "" };

  const expected = p === "he" || p === "she" || p === "it" ? "does" : "do";

  const cand = auxCandidateTokens(input.userAnswer);
  const m = bestFamilyMatch(cand, AUX_FAM.DO);
  if (m.bestS < minDoSim) return { bad: false, reason: "" };

  let bestS = 0;
  let bestTok = "";
  for (const t of cand) {
    const s = sim(t, expected);
    if (s > bestS) {
      bestS = s;
      bestTok = t;
    }
  }

  if (bestS < 0.85) {
    return {
      bad: true,
      reason: `present_simple_do_agreement(expected=${expected}, best_tok=${bestTok}, best_sim=${bestS.toFixed(2)})`,
    };
  }

  return { bad: false, reason: "" };
}

/** -------------------- GATES: regular -ed requirements -------------------- **/

/**
 * gatePastSimpleDeclarativeRegularRequiresEd
 * -----------------------------------------
 * Past simple declarative:
 *  - irregulars handled by gateIrregularStrict
 *  - regulars must be -ed form
 *
 * Blocks: "she booste" (instead of boosted)
 */
function gatePastSimpleDeclarativeRegularRequiresEd(
  input: TypoInput,
  IRREG: Record<string, { past_simple: string; past_participle: string }>
) {
  const tense = input.tense as Tense;
  const st = normSentenceType(input.sentenceType);
  if (!(tense === "Past simple" && st === "Declarative")) return { bad: false, reason: "" };

  const lemma = normToken(input.verb);
  if (!lemma) return { bad: false, reason: "" };

  if (IRREG[lemma]) return { bad: false, reason: "" };

  const exp = regularEd(lemma);
  const uTok = pickUserVerbToken(input.userAnswer, exp);

  if ((uTok === lemma || sim(uTok, lemma) >= 0.9) && uTok !== exp) {
    return { bad: true, reason: `past_simple_missing_ed(user_tok=${uTok}, expected=${exp})` };
  }

  return { bad: false, reason: "" };
}

function looksLikeRegularEdForm(tok: string): boolean {
  const t = normToken(tok);
  return t.endsWith("ed") || t.endsWith("ied") || t.endsWith("d");
}

/**
 * gatePresentPerfectRegularMissingEdHard
 * -------------------------------------
 * Present perfect regular verbs must use -ed participle (not bare lemma).
 * Also blocks tokens that don't even look like a regular participle shape.
 *
 * Blocks: "has she coordinate" (should be coordinated)
 */
function gatePresentPerfectRegularMissingEdHard(
  input: TypoInput,
  IRREG: Record<string, { past_simple: string; past_participle: string }>
) {
  const tense = input.tense as Tense;
  if (tense !== "Present perfect") return { bad: false, reason: "" };

  const lemma = normToken(input.verb);
  if (!lemma) return { bad: false, reason: "" };
  if (IRREG[lemma]) return { bad: false, reason: "" };

  const exp = regularEd(lemma);
  const uTok = pickUserVerbToken(input.userAnswer, exp);

  if (uTok === lemma) {
    return { bad: true, reason: `present_perfect_missing_ed(user_tok=${uTok}, expected=${exp})` };
  }

  if (!looksLikeRegularEdForm(uTok)) {
    return { bad: true, reason: `present_perfect_missing_ed_shape(user_tok=${uTok}, expected=${exp})` };
  }

  return { bad: false, reason: "" };
}

/** -------------------- GATES: missing required doubling (for -ed forms) -------------------- **/

/**
 * gateMissingRequiredDoubling
 * ---------------------------
 * For -ed principal forms (past simple declarative / present perfect),
 * if the lemma requires consonant doubling, missing the double is hard wrong.
 *
 * Note: L-doubling lemmas are exempt (cancelled/canceled etc.)
 */
function gateMissingRequiredDoubling(
  input: TypoInput,
  IRREG: Record<string, { past_simple: string; past_participle: string }>
) {
  const tense = input.tense as Tense;
  const st = normSentenceType(input.sentenceType);
  const lemma = normToken(input.verb);

  const exp = expectedPrincipal(lemma, tense, st, IRREG);
  if (!exp) return { bad: false, reason: "" };

  const uTok = pickUserVerbToken(input.userAnswer, exp);

  // Exempt L-doubling verbs per notebook policy
  if (L_DOUBLING_LEMMAS.has(lemma)) return { bad: false, reason: "" };

  if (!shouldDouble(lemma)) return { bad: false, reason: "" };

  if (missingDoubleConsonant(uTok, exp)) {
    return { bad: true, reason: `missing_required_double(user_tok=${uTok}, expected=${exp})` };
  }

  return { bad: false, reason: "" };
}

/** -------------------- wrong-verb lexical gate -------------------- **/

/**
 * gateWrongVerbLexical
 * -------------------
 * Force WRONG if user answer contains no token moderately similar to:
 *  - lemma
 *  - expected principal form (if defined for tense)
 *
 * Prevents unrelated verbs from being treated as typos.
 */
function gateWrongVerbLexical(
  input: TypoInput,
  IRREG: Record<string, { past_simple: string; past_participle: string }>,
  minSim = 0.5
) {
  const toks = tokens(input.userAnswer);
  if (toks.length === 0) return { bad: true, reason: "wrong_verb(no_tokens)" };

  const tense = input.tense as Tense;
  const st = normSentenceType(input.sentenceType);

  const lemma = normToken(input.verb);
  const exp = expectedPrincipal(lemma, tense, st, IRREG);
  const targets = [lemma, exp].filter(Boolean);

  let best = 0;
  let bestTok = "";
  let bestTarget = "";
  for (const t of toks) {
    for (const trg of targets) {
      const s = sim(t, trg);
      if (s > best) {
        best = s;
        bestTok = t;
        bestTarget = trg;
      }
    }
  }

  if (best < minSim) {
    return { bad: true, reason: `wrong_verb_lexical(best_sim=${best.toFixed(2)}, best_tok=${bestTok}, target=${bestTarget})` };
  }

  return { bad: false, reason: "" };
}

/** -------------------- irregular strict gate + allowlist -------------------- **/

const IRREG_TOLERATED = new Set<string>([
  "read|red",
  "stolen|solen",
  "foretold|fortold",
  "understood|undersood",
  "understood|undestood",
  "sang|dang",

  "dealt|delt",
  "beaten|beatten",
  "slept|selpt",
  "bore|biore",
  "done|dione",
  "slept|splet",
  "sprang|srpang",
  "meant|ment",
  "showed|showd",
  "shrank|sshrank",

  "saw|swa",
  "thought|thougt",
]);

/**
 * gateIrregularStrict
 * ------------------
 * For irregular verbs (where IRREG entry exists), we enforce strict principal form:
 *  - if user token is exactly one of {lemma, past, pp} but not the expected one -> forceWrong
 *  - if user matches expected exactly -> ok
 *  - otherwise allow only if in allowlist (expected|user_token)
 *  - else forceWrong
 */
function gateIrregularStrict(
  input: TypoInput,
  IRREG: Record<string, { past_simple: string; past_participle: string }>
) {
  const tense = input.tense as Tense;
  const st = normSentenceType(input.sentenceType);

  const lemma = normToken(input.verb);
  const entry = IRREG[lemma];
  if (!entry) return { bad: false, reason: "" };

  const exp = expectedPrincipal(lemma, tense, st, IRREG);
  if (!exp) return { bad: false, reason: "" };

  const toks = tokens(input.userAnswer);
  if (toks.length === 0) return { bad: false, reason: "" };

  const forms = new Set([lemma, entry.past_simple, entry.past_participle]);

  let uTok = toks[0];
  let bestS = -1;
  for (const t of toks) {
    let sBestForm = 0;
    for (const f of forms) sBestForm = Math.max(sBestForm, sim(t, f));
    if (sBestForm > bestS) {
      bestS = sBestForm;
      uTok = t;
    }
  }

  if (forms.has(uTok) && uTok !== exp) {
    return { bad: true, reason: `irregular_wrong_form_exact(user_tok=${uTok}, expected=${exp})` };
  }

  if (uTok === exp) return { bad: false, reason: "" };

  if (IRREG_TOLERATED.has(`${exp}|${uTok}`)) return { bad: false, reason: "" };

  return { bad: true, reason: `irregular_strict(user_tok=${uTok}, expected=${exp})` };
}

/** -------------------- detectTypo (entry point) -------------------- **/

export function detectTypo(
  input: TypoInput,
  opts: { IRREG: Record<string, { past_simple: string; past_participle: string }> }
): TypoOutput {
  const IRREG = opts.IRREG || ({} as any);

  // Normalize the *metadata* (tense/sentenceType) but keep user text as-is for now.
  const normInput: TypoInput = {
    ...input,
    tense: input.tense as Tense,
    sentenceType: normSentenceType(input.sentenceType),
    person: input.person,
    verb: input.verb,
    userAnswer: input.userAnswer,
    correctAnswers: Array.isArray(input.correctAnswers) ? input.correctAnswers : [],
  };

  // Normalize spaced contractions in user answer so "he s" counts like "he's", etc.
  // This normalized answer is what ALL gates will see.
  const normInput2: TypoInput = {
    ...normInput,
    userAnswer: normalizeSpacedContractions(normInput.userAnswer),
  };

  const st = normSentenceType(normInput2.sentenceType);

  // ---------- Build answer set for scoring (distance heuristic) ----------
  // We apply "time filler stripping" only for scoring, not for hard grammar gates.
  //
  // Also apply "missing subject harmless" tolerance by adding subject-stripped accepted answers,
  // but only for Declarative/Negative (not Question).
  let answersForDistance = normInput2.correctAnswers;

  if (st !== "Question") {
    const uaToks = tokens(normInput2.userAnswer);
    const hasSubjectAlready = uaToks.length > 0 && SUBJECTS.has(uaToks[0]);

    if (!hasSubjectAlready) {
      const stripped = (normInput2.correctAnswers || []).map(stripLeadingSubject);
      answersForDistance = Array.from(new Set([...(normInput2.correctAnswers || []), ...stripped]));
    }
  }

  // Normalize for scoring: strip time fillers from both user answer and acceptable answers.
  const userForScore = normalizeForScoring(normInput2.userAnswer);
  const answersForScore = (answersForDistance || []).map(normalizeForScoring);

  // Compute best accepted distance (used only if no hard gate triggers)
  const { best, levMin } = bestAccepted(userForScore, answersForScore);

  // Helper to reduce repetition for forceWrong returns
  const forceWrong = (reason: string): TypoOutput => ({
    version: TYPO_DETECTOR_VERSION,
    isTypo: false,
    forceWrong: true,
    forceWrongReason: reason,
    debug: { bestAccepted: best, levMin },
  });

  // ======================== HARD GATES (in notebook order) ========================

  // Gate 1: wrong auxiliary family (HAVE vs DO vs DID vs BE vs SHOULD vs WILL).
  // If user clearly uses an auxiliary, but it's the wrong family for the prompt, it's not a typo.
  const g1 = gateAuxWrongFamily(normInput2);
  if (g1.bad) return forceWrong(g1.reason);

  // Gate 2: Present perfect requires HAVE (or allowed 's contraction).
  const g2 = gatePresentPerfectMissingHave(normInput2);
  if (g2.bad) return forceWrong(g2.reason);

  // Gate 2b: Present perfect regular requires -ed participle (not bare lemma; must look like -ed form).
  const g2b = gatePresentPerfectRegularMissingEdHard(normInput2, IRREG);
  if (g2b.bad) return forceWrong(g2b.reason);

  // Gate 3: Recommendation requires SHOULD (or allowed 'd contraction).
  const g3 = gateRecommendationMissingShould(normInput2);
  if (g3.bad) return forceWrong(g3.reason);

  // Gate 3b: SHOULD must be followed by base form (reject should + V-ed).
  const g3b = gateRecommendationShouldRequiresBase(normInput2);
  if (g3b.bad) return forceWrong(g3b.reason);

  // Gate F1: Future simple requires WILL (or 'll contraction).
  const gf1 = gateFutureMissingWill(normInput2);
  if (gf1.bad) return forceWrong(gf1.reason);

  // Gate F2: WILL must combine with base lemma verb; reject will + -ed/-ing/-en and wrong lemma verb.
  const gf2 = gateFutureWillRequiresLemmaBase(normInput2);
  if (gf2.bad) return forceWrong(gf2.reason);

  // Gate 4: Past simple (Question/Negative) DID must be followed by base form.
  const g4 = gatePastSimpleDidRequiresBase(normInput2);
  if (g4.bad) return forceWrong(g4.reason);

  // Gate 5: Present simple 3sg "...es" rule (rushes vs rushs).
  const g5 = gatePresentSimpleMissingEs(normInput2);
  if (g5.bad) return forceWrong(g5.reason);

  // Gate 5a: Present simple DO agreement in questions/negatives (does you -> hard wrong).
  const g5a = gatePresentSimpleDoAgreement(normInput2);
  if (g5a.bad) return forceWrong(g5a.reason);

  // Gate PC1: Present continuous requires BE.
  const gPc1 = gatePresentContinuousMissingBe(normInput2);
  if (gPc1.bad) return forceWrong(gPc1.reason);

  // GAte PC1b: If BE is present, it should agree with the subject (he is vs he are).
  const gPcAgree = gatePresentContinuousBeAgreement(normInput2);
  if (gPcAgree.bad) return forceWrong(gPcAgree.reason);

  // Gate PC2: Present continuous negative must include BE with negation (blocks "she not instructing").
  const gPc2 = gatePresentContinuousNegativeRequiresBeNot(normInput2);
  if (gPc2.bad) return forceWrong(gPc2.reason);

  // Gate PC3: Present continuous requires -ing (blocks "i am not discharge").
  const gPc3 = gatePresentContinuousRequiresIng(normInput2);
  if (gPc3.bad) return forceWrong(gPc3.reason);

  // Gate PC4: If lemma requires CVC doubling, enforce it in -ing (grabing -> hard wrong).
  const gPc4 = gatePresentContinuousMissingDoubling(normInput2);
  if (gPc4.bad) return forceWrong(gPc4.reason);

  // Gate PS1: Past simple declarative regular verbs require -ed (booste -> hard wrong).
  const gPs1 = gatePastSimpleDeclarativeRegularRequiresEd(normInput2, IRREG);
  if (gPs1.bad) return forceWrong(gPs1.reason);

  // Gate 6: Wrong verb lexical (prevents unrelated verbs being treated as typos).
  const g6 = gateWrongVerbLexical(normInput2, IRREG, 0.5);
  if (g6.bad) return forceWrong(g6.reason);

  // Gate 7: Irregular strict policy (+ allowlist).
  const g7 = gateIrregularStrict(normInput2, IRREG);
  if (g7.bad) return forceWrong(g7.reason);

  // Gate 8: Missing required doubling for -ed forms (subset of tenses).
  const g8 = gateMissingRequiredDoubling(normInput2, IRREG);
  if (g8.bad) return forceWrong(g8.reason);

  // ======================== FINAL TYPO HEURISTIC ========================
  // Only reached if no forceWrong gate triggered.
  // Conservative: treat as typo if normalized levenshtein to closest acceptable <= 0.16
  const isTypo = levMin <= 0.16;

  return {
    version: TYPO_DETECTOR_VERSION,
    isTypo,
    forceWrong: false,
    forceWrongReason: "",
    debug: { bestAccepted: best, levMin },
  };
}