/* Module containing functions for game logic and data management for the Conjugator game */

// src/assets/scripts/Game.js
import { ConjugationSet } from './sets';
import { toRaw } from 'vue';
import { detectTypo } from "./typoDetector.ts";

function normalizeIrregulars(irregJson) {
  const out = {};
  for (const [lemma, v] of Object.entries(irregJson || {})) {
    if (Array.isArray(v) && v.length >= 2) {
      out[String(lemma).toLowerCase()] = {
        past_simple: String(v[0]).toLowerCase(),
        past_participle: String(v[1]).toLowerCase(),
      };
    } else if (v && typeof v === "object") {
      out[String(lemma).toLowerCase()] = {
        past_simple: String(v.past_simple || v.past || "").toLowerCase(),
        past_participle: String(v.past_participle || v.pastParticiple || v.pp || "").toLowerCase(),
      };
    }
  }
  return out;
}

class Game {
  constructor(settings) {
    this.settings = settings;
    this.conjugationSet = new ConjugationSet(
      settings.verbSet,
      settings.tenses,
      settings.sentenceTypes,
      settings.numPrompts,
      settings.smartVerbPool
    );
    this.currentPrompt = null;
    this.rightCount = 0;
    this.wrongCount = 0;
    this.results = [];
    this.elapsedTimes = {};
  }

  async start() {
    await this.conjugationSet.loadPrompts(); // Ensure data is loaded
    //console.log("Game start conjugationSet.settings.smartVerbPool", this.conjugationSet.smartVerbPool)
    //console.log("Game start conjugationSet.settings.verbSetIsSmart", this.conjugationSet.verbSetIsSmart)
    this._irregMap = normalizeIrregulars(this.conjugationSet.irregularVerbs);

    this.currentPrompt = this.conjugationSet.getPrompt();
}

  getCurrentPrompt() {
    return this.currentPrompt;
  }

  getCurrentCorrectAnswers() {
    const p = this.currentPrompt;
    if (!p) return [];
    if (typeof p.getCorrectAnswers === "function") return p.getCorrectAnswers() || [];
    const res = typeof p.getResult === "function" ? p.getResult() : null;
    return (res && res.correctAnswers) ? res.correctAnswers : [];
  }

  nextPrompt() {
    this.currentPrompt = this.conjugationSet.getPrompt();
  }

  submitAnswer(answer) {
    const rawForTypo = answer.normalize("NFKC").toLowerCase().replace(/\s+/g,' ').trim();
    const cleanedForCorrect = rawForTypo.replace(/[?.!"'’‘`´]/g,'').trim();
    this.currentPrompt.setUserAnswer(cleanedForCorrect);

    const isCorrect = this.currentPrompt.getCorrect();
    if (isCorrect) {
      this.rightCount++;
    } else {
      this.wrongCount++;
    }

    // Track elapsed time per prompt number
    const promptNumber = this.currentPrompt.getNumber();
    this.elapsedTimes[promptNumber] = Number(this.currentPrompt.elapsedTime) || 0;

    // Pull the normalized fields from getResult(), but don't spread it
    const res = this.currentPrompt.getResult(); // now includes userAnswer, correct, correctAnswers, prompt{...}

    const normalized = {
      number: promptNumber,
      prompt: {
        verb: this.currentPrompt.getVerb(),
        person: this.currentPrompt.getPerson(),
        tense: this.currentPrompt.getTense(),
        sentenceType: this.currentPrompt.getSentenceType(),
      },
      userAnswer: res.userAnswer,          // normalized key
      correct: !!res.correct,              // boolean
      correctAnswers: res.correctAnswers,  // normalized key (array)
      elapsedTime: this.elapsedTimes[promptNumber],
    };

    const typo = detectTypo(
      {
        tense: normalized.prompt.tense,
        sentenceType: normalized.prompt.sentenceType,
        person: normalized.prompt.person,
        verb: normalized.prompt.verb,
        userAnswer: rawForTypo, // use the raw normalized string for typo detection
        correctAnswers: normalized.correctAnswers,
      },
      { IRREG: this._irregMap }
    );

    normalized.typo = typo; // store full object (or store only fields you need)

    this.results.push(normalized);
    return isCorrect;
  }



  getResults() {
    // When returning results, merge in elapsedTime from separate store
    return this.results.map(result => ({
      ...result,
      elapsedTime: this.elapsedTimes[result.number] || 0,
    }));
  }

  getRightCount() {
    return this.rightCount;
  }

  getWrongCount() {
    return this.wrongCount;
  }
}

export default Game;