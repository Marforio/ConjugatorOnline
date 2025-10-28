/* Module containing game logic and data management for the pronoun game */

import { PronounSet } from './pronounSets';
import { toRaw } from 'vue';

class PronounGame {
  /**
   * @param {Object} settings - Game configuration
   * @param {number} settings.numPrompts - Number of prompts to generate per game
   */
  constructor(settings) {
    this.settings = settings;
    this.pronounSet = new PronounSet(settings.numPrompts);

    this.currentPrompt = null;
    this.rightCount = 0;
    this.wrongCount = 0;
    this.results = [];
    this.elapsedTimes = {};
  }

  /** Initializes the game and loads prompts */
  async start() {
    await this.pronounSet.loadPrompts(); // Load all pronoun-based prompts
    this.currentPrompt = this.pronounSet.getPrompt();
  }

  /** Returns the current prompt (PronounPrompt instance) */
  getCurrentPrompt() {
    return this.currentPrompt;
  }

  /** Moves to the next prompt and returns it */
  nextPrompt() {
    this.currentPrompt = this.pronounSet.getPrompt();
    return this.currentPrompt;
  }

  /**
   * Submits a user answer for the current prompt and updates scores.
   * @param {string} answer - User's entered answer.
   * @returns {boolean} Whether the answer was correct.
   */
  submitAnswer(answer) {
    if (!this.currentPrompt) {
      throw new Error("No current prompt loaded.");
    }

    const cleanedAnswer = answer
      .normalize("NFKC") // Normalize Unicode characters
      .toLowerCase()
      .replace(/[?.!"'’‘`´]/g, '') // Remove punctuation/apostrophes
      .replace(/\s+/g, ' ') // Collapse spaces
      .trim();

    this.currentPrompt.setUserAnswer(cleanedAnswer);
    const isCorrect = this.currentPrompt.getCorrect();

    if (isCorrect) {
      this.rightCount++;
    } else {
      this.wrongCount++;
    }

    // Record elapsed time for analytics (optional)
    const promptNumber = this.currentPrompt.number;
    this.elapsedTimes[promptNumber] = Number(this.currentPrompt.elapsedTime) || 0;

    // Store a normalized result object
    const res = this.currentPrompt.getResult();
    const normalized = {
      number: promptNumber,
      question: res.question,
      pronoun: res.pronoun,
      userAnswer: res.userAnswer,
      correctAnswers: res.correctAnswers,
      correct: res.correct,
      label: res.label,
      image: res.image,
      elapsedTime: this.elapsedTimes[promptNumber],
    };

    this.results.push(normalized);
    return isCorrect;
  }

  /** Returns all results with elapsed times merged */
  getResults() {
    return this.results.map(result => ({
      ...result,
      elapsedTime: this.elapsedTimes[result.number] || 0,
    }));
  }

  /** Returns count of correct answers */
  getRightCount() {
    return this.rightCount;
  }

  /** Returns count of incorrect answers */
  getWrongCount() {
    return this.wrongCount;
  }

  /** Returns remaining number of prompts */
  getRemainingCount() {
    return this.pronounSet.getRemainingCount();
  }

  /** Returns a summary object for easy UI reporting */
  getSummary() {
    return {
      total: this.results.length,
      correct: this.rightCount,
      incorrect: this.wrongCount,
      accuracy: this.results.length
        ? Math.round((this.rightCount / this.results.length) * 100)
        : 0,
    };
  }
}

export default PronounGame;
