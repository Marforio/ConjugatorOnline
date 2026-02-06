/* @fileoverview
   ConjugationSet for the Conjugator game.

   This version is "smart-pool only":
   - It consumes the backend-provided SmartVerbPoolByTense:
       {
         verb_set: string,
         batch_size: number|null,
         "Past simple": string[],
         "Present perfect": string[]
       }
   - It does NOT use tier-based pools or any legacy merged pools.
   - It still loads verb JSON files because you need them for rendering/answer generation.

   NOTE:
   - Smart pool only meaning: if a smart pool is provided and contains arrays for a tense,
     we consume that list in order (cursor-based) so "unseen first" ordering is preserved.
   - If smart pool is missing/empty for a tense, we fall back to a local verb universe
     based on `type` (Basic 75 / Master 110 / All Irregular / GOAT 50, etc.)
*/

import { ConjugationPrompt } from "./prompts.js";
import { router } from "./sentenceBuilder.js";
import { abbreviator } from "./abbreviations.js";

class ConjugationSet {
  static PERSONS = ["i", "you", "he", "she", "it", "we", "they"];
  static ALL_TENSES = [
    "Present simple",
    "Past simple",
    "Future simple",
    "Present continuous",
    "Present perfect",
    "Recommendation",
  ];
  static ALL_SENTENCES = ["Declarative", "Negative", "Question"];

  constructor(type, tenses, sentences, length, smartVerbPoolByTense = null) {
    this.type = type;
    this.length = Number(length || 0);
    this.tenses = Array.isArray(tenses) ? tenses : [];
    this.sentences = Array.isArray(sentences) ? sentences : [];

    this.PromptDict = {};
    this.PromptList = [];
    this.CurrentPromptNumber = 1;

    // New: server-provided pool per tense
    this.smartPool = smartVerbPoolByTense; // SmartVerbPoolByTense or null
    this.smartCursorByTense = { "Past simple": 0, "Present perfect": 0 };
    this.verbSetIsSmart = this.#hasUsableSmartPool(this.smartPool);

    // Loaded data
    this.commonVerbs = null;
    this.regularVerbs = null;
    this.irregularVerbs = null;
    this.irregularVerbs75 = null;
    this.irregularVerbs110 = null;
    this.irregularVerbsGOAT50 = null;

    // Fallback verb universe (computed after loading JSON)
    this.fallbackVerbUniverse = [];

    // Helpful debug
    // console.log("[ConjugationSet] init:", {
    //   type: this.type,
    //   length: this.length,
    //   tenses: this.tenses,
    //   sentences: this.sentences,
    //   verbSetIsSmart: this.verbSetIsSmart,
    //   smartKeys: this.smartPool ? Object.keys(this.smartPool) : null,
    // });
  }

  async loadPrompts() {
    const basedir = "/data/";

    try {
      // Load local verb datasets (still needed for answer generation + GOAT filtering etc.)
      const [commonRes, regularRes, irregularRes, b75Res, m110Res, goat50Res] = await Promise.all([
        fetch(basedir + "commonVerbs.json"),
        fetch(basedir + "regularVerbs.json"),
        fetch(basedir + "irregularVerbs.json"),
        fetch(basedir + "irregBasic75.json"),
        fetch(basedir + "irregMaster110.json"),
        fetch(basedir + "irregGOAT50.json"),
      ]);

      this.commonVerbs = await commonRes.json();
      this.regularVerbs = await regularRes.json();
      this.irregularVerbs = await irregularRes.json();
      this.irregularVerbs75 = await b75Res.json();
      this.irregularVerbs110 = await m110Res.json();
      this.irregularVerbsGOAT50 = await goat50Res.json();

      // Build fallback verb universe (used only when smart pool doesn't cover a tense)
      this.fallbackVerbUniverse = this.#buildFallbackVerbUniverse();

      // Generate prompt skeletons
      for (let i = 1; i <= this.length; i++) {
        const tense = random1(this.tenses);
        const sentence = random1(this.sentences);
        const person = random1(ConjugationSet.PERSONS);

        const verb = this.#pickVerbForTense(tense);

        if (!verb || !person || !tense || !sentence) {
          console.error(`[ConjugationSet] Failed to generate prompt #${i}`, {
            verb,
            person,
            tense,
            sentence,
          });
          continue;
        }

        this.PromptDict[i] = { verb, person, tense, sentence, answers: [] };
      }

      // Populate answers + PromptList
      for (const i in this.PromptDict) {
        const { verb, person, tense, sentence } = this.PromptDict[i];

        const answer = router(verb, person, tense, sentence);
        this.PromptDict[i].answers.push(answer);

        const alternatives = abbreviator(tense, person, sentence, answer);
        this.PromptDict[i].answers.push(...(alternatives || []));

        const prompt = new ConjugationPrompt(
          Number(i),
          verb,
          person,
          tense,
          sentence,
          this.PromptDict[i].answers
        );

        this.PromptList.push(prompt);
      }
    } catch (error) {
      console.error("[ConjugationSet] Error loading prompts:", error);
    }
  }

  getCurrentPromptNumber() {
    return this.CurrentPromptNumber <= this.length ? this.CurrentPromptNumber : null;
  }

  getPrompt() {
    const index = this.getCurrentPromptNumber();
    if (index && index - 1 < this.PromptList.length) {
      const prompt = this.PromptList[index - 1]; // 0-based access
      this.CurrentPromptNumber += 1;
      return prompt;
    }
    throw new Error("No more prompts available");
  }

  getRemainingCount() {
    return Math.max(0, this.length - this.CurrentPromptNumber + 1);
  }

  /* ---------------------- smart pool helpers ---------------------- */

  #hasUsableSmartPool(pool) {
    if (!pool || typeof pool !== "object") return false;
    // Must contain at least one tense array with length
    const ps = Array.isArray(pool["Past simple"]) ? pool["Past simple"] : [];
    const pp = Array.isArray(pool["Present perfect"]) ? pool["Present perfect"] : [];
    return ps.length > 0 || pp.length > 0;
  }

  #pickVerbForTense(tense) {
    // Use smart pool only for the tenses it provides
    if (this.verbSetIsSmart && (tense === "Past simple" || tense === "Present perfect")) {
      const poolArr = Array.isArray(this.smartPool?.[tense]) ? Array.from(this.smartPool[tense]) : [];
      if (poolArr.length > 0) {
        const cur = Number(this.smartCursorByTense[tense] || 0);

        if (cur < poolArr.length) {
          this.smartCursorByTense[tense] = cur + 1;
          return poolArr[cur];
        }

        // exhausted: fall back (or wrap if you prefer)
        // If you want wrap-around instead of fallback, replace with:
        // this.smartCursorByTense[tense] = 1;
        // return poolArr[0];
      }
    }

    // fallback (local universe)
    return random1(this.fallbackVerbUniverse);
  }

  #buildFallbackVerbUniverse() {
    // Convert any object->keys
    const keys = (obj) => (obj && typeof obj === "object" ? Object.keys(obj) : []);

    // These names must match your existing settings “type” strings
    if (this.type === "Common verbs (Reg + Irreg)") {
      // commonVerbs can be an array OR object depending on your JSON;
      // normalize to array of verbs
      if (Array.isArray(this.commonVerbs)) return this.commonVerbs;
      return keys(this.commonVerbs);
    }

    if (this.type === "Regular verbs only") {
      if (Array.isArray(this.regularVerbs)) return this.regularVerbs;
      return keys(this.regularVerbs);
    }

    if (this.type === "Basic 75 Irregs") return keys(this.irregularVerbs75);
    if (this.type === "Master 110 Irregs") return keys(this.irregularVerbs110);

    if (this.type === "Shakespeare 130 Irregs") return keys(this.irregularVerbs);

    if (this.type === "GOAT 50 Hard Irregs Only") return keys(this.irregularVerbsGOAT50);

    // default fallback: all irregular keys (safe)
    return keys(this.irregularVerbs);
  }
}

/* ---------------------- utilities ---------------------- */

function random1(array) {
  if (!Array.isArray(array) || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export { ConjugationSet };
