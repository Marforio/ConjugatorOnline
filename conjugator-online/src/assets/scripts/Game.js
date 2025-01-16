// src/assets/scripts/Game.js
import { ConjugationSet } from './sets';

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
    console.log(this.currentPrompt.getAnswers());
    const isCorrect = this.currentPrompt.getCorrect();
    console.log(isCorrect);
    if (isCorrect) {
      console.log('Old right count:', this.rightCount);
      this.rightCount++;
      console.log('New right count:', this.rightCount);
    } else {
      this.wrongCount++;
    }
    this.results.push({
      number: this.currentPrompt.getNumber(),
      ...this.currentPrompt.getResult(),
    });
    return isCorrect;
  }
  getRemainingCount() {
    return this.conjugationSet.getRemainingCount();
  }

  getResults() {
    return this.results;
  }

  getRightCount() {
    return this.rightCount;
  }

  getWrongCount() {
    return this.wrongCount;
  }
}

export default Game;