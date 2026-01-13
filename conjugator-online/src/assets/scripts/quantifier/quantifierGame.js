// quantifierGame.js
import { QuantifierSet } from './quantifierSets';

class QuantifierGame {
  /**
   * settings: { numPrompts: number, variant: "countable"|"uncountable"|"all" }
   */
  constructor(settings = {}) {
    this.settings = settings;
    this.numPrompts = settings.numPrompts || 30;

    // NEW: which prompt pool to use
    this.variant = settings.variant || 'all';

    // pass variant to set so it can filter
    this.quantifierSet = new QuantifierSet(this.numPrompts, { variant: this.variant });

    this.currentPrompt = null;
    this.rightCount = 0;
    this.wrongCount = 0;
    this.results = [];
    this.elapsedTimes = {};
    this.active = false;
    this.timer = null;
    this.roundTimer = null;
  }

  async start() {
    await this.quantifierSet.loadPrompts();
    this.currentPrompt = this.quantifierSet.getPrompt();
    this.active = true;
  }

  getCurrentPrompt() {
    return this.currentPrompt;
  }

  /**
   * Sets currentPrompt to the next prompt and returns it (or null if none)
   */
  nextPrompt() {
    this.currentPrompt = this.quantifierSet.getPrompt();
    return this.currentPrompt;
  }

  /**
   * Submit an answer for the current prompt.
   * This method records the answer but DOES NOT advance to the next prompt.
   *
   * @param {string} answer
   * @param {number} elapsedTime (seconds)
   * @param {boolean} outOfTime
   * @returns {boolean} whether correct
   */
  submitAnswer(answer, elapsedTime = 0, outOfTime = false) {
    if (!this.currentPrompt) {
      throw new Error('No current prompt loaded.');
    }

    // normalize answer
    const cleaned = String(answer || '')
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[?.!"'’‘`´]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // set user answer on prompt instance
    if (typeof this.currentPrompt.setUserAnswer === 'function') {
      this.currentPrompt.setUserAnswer(cleaned);
    } else {
      // defensive fallback if prompt is plain object
      this.currentPrompt.userAnswer = cleaned;
      this.currentPrompt.correct = (this.currentPrompt.correctAnswers || [])
        .some(a => a.toLowerCase() === cleaned);
    }

    const isCorrect = !outOfTime && !!this.currentPrompt.getCorrect?.();

    if (isCorrect) this.rightCount++;
    else this.wrongCount++;

    // record elapsed time on prompt
    this.currentPrompt.elapsedTime = Number(elapsedTime) || 0;
    this.elapsedTimes[this.currentPrompt.number] = Number(elapsedTime) || 0;

    // build normalized result for output
    const res = this.currentPrompt.getResult ? this.currentPrompt.getResult() : {
      number: this.currentPrompt.number,
      question: this.currentPrompt.generatedQuestion || this.currentPrompt.questionText || '',
      quantifier: this.currentPrompt.quantifier || null,
      subject: this.currentPrompt.subject || '',
      userAnswer: this.currentPrompt.userAnswer || cleaned,
      correctAnswers: this.currentPrompt.correctAnswers || [],
      correct: isCorrect,
      image: this.currentPrompt.image || null,
      elapsedTime: this.currentPrompt.elapsedTime || 0
    };
    res.question = this.currentPrompt.generatedQuestion || res.question;
    
    const normalized = {
      number: res.number,
      question: res.question,
      pronoun: res.quantifier || null, // keep 'pronoun' field name if serializer expects it later
      userAnswer: res.userAnswer,
      correctAnswers: res.correctAnswers,
      correct: isCorrect,
      label: res.label || null,
      image: res.image,
      elapsedTime: res.elapsedTime || 0,
      out_of_time: !!outOfTime,
    };

    this.results.push(normalized);

    return isCorrect;
  }

  setCurrentPromptQuestion(question) {
  if (!this.currentPrompt) return;

  const q = String(question || '').trim();

  // Store separately so we don't break any prompt logic that depends on questionText
  this.currentPrompt.generatedQuestion = q;

  // Optional: if your prompt is a class and you'd rather use a setter if it exists
  if (typeof this.currentPrompt.setQuestion === 'function') {
    this.currentPrompt.setQuestion(q);
  }
}


  getResults() {
    return this.results.map(r => ({
      ...r,
      elapsedTime: r.elapsedTime ?? this.elapsedTimes[r.number] ?? 0,
    }));
  }

  getRightCount() {
    return this.rightCount;
  }

  getWrongCount() {
    return this.wrongCount;
  }

  getRemainingCount() {
    return this.quantifierSet.getRemainingCount();
  }

  getSummary() {
    return {
      total: this.results.length,
      correct: this.rightCount,
      incorrect: this.wrongCount,
      accuracy: this.results.length ? Math.round((this.rightCount / this.results.length) * 100) : 0,
      variant: this.variant,
    };
  }

  stop() {
    this.active = false;
    if (this.timer) clearInterval(this.timer);
    if (this.roundTimer) clearTimeout(this.roundTimer);
  }
}

export default QuantifierGame;
