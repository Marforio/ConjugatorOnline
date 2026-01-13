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
  /**
   * @param {number} numPrompts
   * @param {{ variant?: "countable" | "uncountable" | "all" }} options
   */
  constructor(numPrompts = 30, options = {}) {
    this.numPrompts = numPrompts;
    this.variant = options.variant || 'all'; // "countable" | "uncountable" | "all"
    this.prompts = [];
    this.remaining = [];
  }

  async loadPrompts() {
    const countablePool = [];
    const uncountablePool = [];

    Object.values(quantifierData).forEach(item => {
      if (item.countable) countablePool.push(item);
      else uncountablePool.push(item);
    });

    let selected = [];

    // --- NEW: choose pool based on variant ---
    if (this.variant === 'countable') {
      selected = this._sampleWithRepeat(countablePool, this.numPrompts);
    } else if (this.variant === 'uncountable') {
      selected = this._sampleWithRepeat(uncountablePool, this.numPrompts);
    } else {
      // "all" (mixed): roughly half countable, half uncountable.
      // If one pool is smaller, we repeat from that pool as needed.
      const half = Math.floor(this.numPrompts / 2);
      const rest = this.numPrompts - half;

      selected = [
        ...this._sampleWithRepeat(countablePool, half),
        ...this._sampleWithRepeat(uncountablePool, rest),
      ];
    }

    this.prompts = this._shuffle(
      selected.map((item, index) => this._createPrompt(item, index + 1))
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

  // NEW: sample n items, repeating if the pool is smaller than n
  _sampleWithRepeat(array, n) {
    if (!Array.isArray(array) || array.length === 0 || n <= 0) return [];

    const shuffled = this._shuffle([...array]);
    const out = [];
    let idx = 0;

    while (out.length < n) {
      out.push(shuffled[idx % shuffled.length]);
      idx++;
    }

    return out;
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
