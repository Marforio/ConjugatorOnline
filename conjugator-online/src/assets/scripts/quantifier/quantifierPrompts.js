/* Module containing the QuantifierPrompt class */

class QuantifierPrompt {
  /**
   * @param {Object} config
   * @param {string} config.questionText - e.g. "a large quantity of"
   * @param {string[]} config.correctAnswers - Fully generated correct answers
   * @param {string} config.quantifier - Target quantifier (e.g. "many", "much")
   * @param {string} config.subject - Base noun (e.g. "car", "gold")
   * @param {boolean} config.countable
   * @param {string|null} config.image
   * @param {number|null} config.numberInSet
   */
  constructor({
    questionText,
    correctAnswers,
    quantifier,
    subject,
    countable,
    image = null,
    numberInSet = null
  }) {
    this.number = numberInSet;
    this.questionText = questionText;
    this.quantifier = quantifier;
    this.subject = subject;
    this.countable = countable;
    this.image = image;

    this.correctAnswers = correctAnswers;
    this.userAnswer = '';
    this.correct = false;
    this.elapsedTime = 0;
  }

  getQuestionText() {
    return this.questionText;
  }

  setUserAnswer(userAnswer) {
    this.userAnswer = userAnswer.trim();
    this.correct = this.correctAnswers.some(
      ans => ans.toLowerCase() === this.userAnswer.toLowerCase()
    );
  }

  getCorrect() {
    return this.correct;
  }

  getResult() {
    return {
      number: this.number,
      question: this.questionText,
      quantifier: this.quantifier,
      subject: this.subject,
      countable: this.countable,
      userAnswer: this.userAnswer,
      correctAnswers: this.correctAnswers,
      correct: this.correct,
      image: this.image,
      elapsedTime: this.elapsedTime
    };
  }

  getEvidence() {
    return {
      correct: this.correct,
      userAnswer: this.userAnswer,
      answers: this.correctAnswers,
      elapsedTime: this.elapsedTime
    };
  }
}

export { QuantifierPrompt };
