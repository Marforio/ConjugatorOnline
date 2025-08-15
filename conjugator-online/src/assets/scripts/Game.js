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
    const cleanedAnswer = answer.toLowerCase().replace(/['.]/g, '');
    this.currentPrompt.setUserAnswer(cleanedAnswer);
    const isCorrect = this.currentPrompt.getCorrect();
    if (isCorrect) {
      this.rightCount++;
    } else {
      this.wrongCount++;
    }
      
    // Instead of adding elapsedTime inside prompt, add it here
    const promptNumber = this.currentPrompt.getNumber();

    // Store elapsed time from currentPrompt (or pass it as argument)
    this.elapsedTimes[promptNumber] = this.currentPrompt.elapsedTime;
    
    // Get the raw prompt object
      const rawPrompt = toRaw(this.currentPrompt);

      // Create a plain copy with elapsedTime added
      const promptCopy = {
        number: rawPrompt.number,
        verb: rawPrompt.verb,
        person: rawPrompt.person,
        tense: rawPrompt.tense,
        sentence: rawPrompt.sentence,
        answers: rawPrompt.answers,
        correct: rawPrompt.correct,
        elapsedTime: rawPrompt.elapsedTime,
        userAnswer: rawPrompt.userAnswer,
      };

      this.results.push({
        prompt: promptCopy,
        number: this.currentPrompt.getNumber(),
        ...this.currentPrompt.getResult(),
      });


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