/* @fileoverview
 * PronounSet class - generates sets of prompts for the pronoun training game.
 * Combines question templates with pronoun-labeled images to produce interactive prompts.
 */

import { sample, shuffle } from 'lodash';
import { PronounPrompt } from './pronounPrompts.js';

class PronounSet {
  static PRONOUNS = {
    i:    { object: "me", possessiveAdjective: "my", possessivePronoun: "mine", reflexive: "myself" },
    you:  { object: "you", possessiveAdjective: "your", possessivePronoun: "yours", reflexive: "yourself" },
    he:   { object: "him", possessiveAdjective: "his", possessivePronoun: "his", reflexive: "himself" },
    she:  { object: "her", possessiveAdjective: "her", possessivePronoun: "hers", reflexive: "herself" },
    it:   { object: "it", possessiveAdjective: "its", possessivePronoun: "its", reflexive: "itself" },
    we:   { object: "us", possessiveAdjective: "our", possessivePronoun: "ours", reflexive: "ourselves" },
    they: { object: "them", possessiveAdjective: "their", possessivePronoun: "theirs", reflexive: "themselves" },
  };

  static QUESTIONS = {
    1:  { label: "object 1", question: "I saw ___ yesterday.", excluded: ["we"] },
    2:  { label: "object 2", question: "We like ___ .", excluded: ["i"] },
    3:  { label: "object 3", question: "You forgot ___ .", excluded: [""] },
    4:  { label: "possessive adj 1", question: "I remember ___ name.", excluded: [] },
    5:  { label: "possessive adj 2", question: "I took ___ picture.", excluded: [] },
    6:  { label: "possessive adj 3", question: "I feel ___ presence.", excluded: ["we"] },
    7:  { label: "possessive pronoun 1", question: "This isn't my space. This space is ___ .", excluded: ["i", "it"] },
    8:  { label: "possessive pronoun 2", question: "This wasn't my idea. This idea was ___ .", excluded: ["i", "it"], needsEyes: true  },
    9:  { label: "reflexive 1", question: "XXX see(s) ___ in the mirror.", excluded: [], needsEyes: true },
    10: { label: "reflexive 2", question: "Can XXX move by ___ ?", excluded: [] },
    11: { label: "family 1", question: "XXX called ___ sister.", excluded: ["i","you","it","we"], needsFamily: true },
    12: { label: "family 2", question: "XXX called ___ brother.", excluded: ["i","you","it","we"], needsFamily: true },
  };

  constructor(length = 30) {
    this.length = length;
    this.PromptList = [];
    this.CurrentPromptNumber = 1;
  }

  async loadPrompts() {
    try {
      const response = await fetch(PronounSet.PRONOUN_DATA);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      this.pronounData = Object.values(data);

      // Group by pronoun
      const pronounGroups = this.groupByPronoun(this.pronounData);

      // Weight pronouns by available image count
      const totalImages = Object.values(pronounGroups).reduce((acc, g) => acc + g.length, 0);
      const weights = Object.entries(pronounGroups).reduce((acc, [p, imgs]) => {
        acc[p] = imgs.length / totalImages;
        return acc;
      }, {});

      // Build prompts adaptively
      while (this.PromptList.length < this.length) {
        const pronoun = this.pickWeightedPronoun(weights);
        const pic = sample(pronounGroups[pronoun]);
        const question = this.selectQuestionForPicture(pronoun, pic);

        if (!question) continue; // skip unsuitable combos

        const filledQuestion = this.createQuestionSentence(question, pronoun, pic);
        const answer = this.getAnswerForQuestion(question, pronoun, filledQuestion);

        this.PromptList.push(
          new PronounPrompt({
            number: this.PromptList.length + 1,
            questionText: filledQuestion,
            correctAnswer: answer,
            pronoun,
            image: pic.filename,
            label: question.label,
            subject: pic.subject
          })
        );
      }

      this.PromptList = shuffle(this.PromptList);
    } catch (error) {
      console.error('[PronounSet] Error loading prompts:', error);
    }
  }

  /** Group image index by pronoun */
  groupByPronoun(data) {
    return data.reduce((acc, pic) => {
      if (!acc[pic.pronoun]) acc[pic.pronoun] = [];
      acc[pic.pronoun].push(pic);
      return acc;
    }, {});
  }

  /** Weighted random selection based on pronoun image proportions */
  pickWeightedPronoun(weights) {
    const r = Math.random();
    let sum = 0;
    for (const [p, w] of Object.entries(weights)) {
      sum += w;
      if (r <= sum) return p;
    }
    return 'it'; // fallback
  }

  /** Filter out excluded pronouns and invalid picture types */
  selectQuestionForPicture(pronoun, pic) {
    const possible = Object.values(PronounSet.QUESTIONS).filter((q) => {
      if (q.excluded.includes(pronoun)) return false;
      if (q.needsEyes && !pic.eyes) return false;
      if (q.needsFamily && !pic.family) return false;
      return true;
    });

    if (possible.length === 0) return null;
    return sample(possible);
  }

  /** Fill in placeholders & apply pronoun-specific rules */
  createQuestionSentence(question, pronoun, pic) {
    let q = question.question;
    const subject = pic.subject || 'Someone';

    // Replace XXX with subject (capitalize if at start or if n)
    q = q.replace(/XXX/g, (match, offset) =>
      offset === 0
        ? subject.charAt(0).toUpperCase() + subject.slice(1)
        : pic.family === true
          ? subject
          : subject.toLowerCase()
    );

    return q;
  }

  /** Derive the correct pronoun answer (object/reflexive/etc.) */
  getAnswerForQuestion(question, pronoun, filledQuestion) {
    const forms = PronounSet.PRONOUNS[pronoun];
    if (!forms) return pronoun;

    // --- special override for “object 1–3” ---
    const qIndex = Object.entries(PronounSet.QUESTIONS)
      .find(([_, val]) => val.label === question.label)?.[0];
    const firstWord = filledQuestion.split(" ")[0].toLowerCase();

    let useReflexive = false;
    if (['1','2','3'].includes(qIndex)) {
      // Only override if subject and pronoun are same person
      if (
        (firstWord === 'i' && pronoun === 'i') ||
        (firstWord === 'we' && pronoun === 'we') ||
        (firstWord === 'you' && pronoun === 'you')
      ) {
        useReflexive = true;
      }
    }

    if (useReflexive) return forms.reflexive;

    if (question.label.includes('object')) return forms.object;
    if (question.label.includes('possessive adj') || question.label.includes('family'))
      return forms.possessiveAdjective;
    if (question.label.includes('possessive pronoun')) return forms.possessivePronoun;
    if (question.label.includes('reflexive')) return forms.reflexive;

    return pronoun;
  }

  getPrompt() {
    if (this.CurrentPromptNumber > this.PromptList.length)
      throw new Error('No more prompts available');
    return this.PromptList[this.CurrentPromptNumber++ - 1];
  }

  getRemainingCount() {
    return this.PromptList.length - this.CurrentPromptNumber + 1;
  }
}

PronounSet.PRONOUN_DATA = '/images/image_index.json';
export { PronounSet };
