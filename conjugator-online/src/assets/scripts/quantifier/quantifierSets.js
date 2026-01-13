/* Module responsible for building quantifier prompt sets */

import quantifierData from './quant_image_index.json';
import { QuantifierPrompt } from './quantifierPrompts';

const QUESTION_MAP = {
  "a large quantity of": ["many", "a lot of"],
  "an excessively large quantity of": ["too many", "too much"],
  "an incredibly excessive quantity of": ["too many", "too much"],
  "an impressively large quantity of": ["so many", "so much"],
  "not a large quantity of": ["many", "much"],
  "a small quantity of": ["a few", "a little"],
  "an excessively small quantity of": ["too few", "too little"],
  "an impressively small quantity of": ["so few", "so little"],
  "not a small quantity of": ["a few", "a little"],
  "just a small quantity of": ["a few", "a little"]
};

class QuantifierSet {
  constructor(numPrompts = 30) {
    this.numPrompts = numPrompts;
    this.prompts = [];
    this.remaining = [];
  }

  async loadPrompts() {
    const countablePool = [];
    const uncountablePool = [];

    Object.values(quantifierData).forEach(item => {
      if (item.countable) {
        countablePool.push(item);
      } else {
        uncountablePool.push(item);
      }
    });

    const half = Math.floor(this.numPrompts / 2);

    const selected = [
      ...this._sample(countablePool, half),
      ...this._sample(uncountablePool, half)
    ];

    this.prompts = this._shuffle(
      selected.map((item, index) =>
        this._createPrompt(item, index + 1)
      )
    );

    this.remaining = [...this.prompts];
  }

  getPrompt() {
    return this.remaining.shift() || null;
  }

  getRemainingCount() {
    return this.remaining.length;
  }

  /* ---------- helpers ---------- */

  _createPrompt(item, numberInSet) {
    const questions = Object.keys(QUESTION_MAP);
    const questionText =
      questions[Math.floor(Math.random() * questions.length)];

    const quantifierOptions = QUESTION_MAP[questionText];
    const quantifier = item.countable
      ? quantifierOptions[0]
      : quantifierOptions[1];

    const noun = item.countable
      ? (item.plural_noun ? item.subject : item.plural)
      : item.subject;

    const correctAnswers = [
      `${quantifier} ${noun}`
    ];

    return new QuantifierPrompt({
      questionText,
      correctAnswers,
      quantifier,
      subject: item.subject,
      countable: item.countable,
      image: item.filename,
      numberInSet
    });
  }

  _sample(array, n) {
    return this._shuffle([...array]).slice(0, n);
  }

  _shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export { QuantifierSet };
