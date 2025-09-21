/* Module containing functions for game logic and data management for the Conjugator game */

// src/assets/scripts/Game.js
import { ConjugationSet } from './sets';
import { toRaw } from 'vue';

class Game {
  constructor(settings) {
    this.settings = settings;
    this.conjugationSet = new ConjugationSet(
      settings.verbSet,
      settings.tenses,
      settings.sentenceTypes,
      settings.numPrompts
    );
    this.currentPrompt = null;
    this.rightCount = 0;
    this.wrongCount = 0;
    this.results = [];
    this.elapsedTimes = {};
  }

  async start() {
    await this.conjugationSet.loadPrompts(); // Ensure data is loaded
    this.currentPrompt = this.conjugationSet.getPrompt();
}

  getCurrentPrompt() {
    return this.currentPrompt;
  }

  nextPrompt() {
    this.currentPrompt = this.conjugationSet.getPrompt();
  }

  submitAnswer(answer) {
    const cleanedAnswer = answer.toLowerCase()
                                .replace(/[?.!'"]/g, '')  // strip punctuation first
                                .replace(/\s+/g, ' ')     // collapse multiple spaces
                                .trim(); 
    this.currentPrompt.setUserAnswer(cleanedAnswer);

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