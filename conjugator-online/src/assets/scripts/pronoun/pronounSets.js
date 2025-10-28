/* @fileoverview
 * PronounSet class - generates sets of prompts for the pronoun training game.
 * Combines question templates with pronoun-labeled images to produce interactive prompts.
 */

import { random, sample } from 'lodash';
import { PronounPrompt } from './pronounPrompts.js';

class PronounSet {
    static PRONOUNS = {
        "i": { object: "me", possessiveAdjective: "my", possessivePronoun: "mine", reflexive: "myself" },
        "you": { object: "you", possessiveAdjective: "your", possessivePronoun: "yours", reflexive: "yourself" },
        "he": { object: "him", possessiveAdjective: "his", possessivePronoun: "his", reflexive: "himself" },
        "she": { object: "her", possessiveAdjective: "her", possessivePronoun: "hers", reflexive: "herself" },
        "it": { object: "it", possessiveAdjective: "its", possessivePronoun: "its", reflexive: "itself" },
        "we": { object: "us", possessiveAdjective: "our", possessivePronoun: "ours", reflexive: "ourselves" },
        "they": { object: "them", possessiveAdjective: "their", possessivePronoun: "theirs", reflexive: "themselves" }
    };

    static QUESTIONS = {
        1: { label: "object 1", question: "I saw ___ yesterday.", excluded: [] },
        2: { label: "object 2", question: "I like ___ .", excluded: [] },
        3: { label: "possessive adj 1", question: "I remember ___ name.", excluded: [] },
        4: { label: "possessive adj 2", question: "I took ___ picture.", excluded: ["i"] },
        5: { label: "possessive adj 3", question: "I feel ___ presence.", excluded: ["i"] },
        6: { label: "possessive pronoun 1", question: "This isn't my house. This house is ___ .", excluded: ["i", "it"] },
        7: { label: "possessive pronoun 2", question: "This wasn't my idea. This idea was ___ .", excluded: ["i", "it"] },
        8: { label: "reflexive 1", question: "XXX see(s) ___ in the mirror.", excluded: [], needsEyes: true },
        9: { label: "reflexive 2", question: "Can XXX move by ___ ?", excluded: [] },
        10: { label: "family 1", question: "XXX called ___ sister.", excluded: ["i", "you", "it", "we", "they"], needsFamily: true },
        11: { label: "family 2", question: "XXX called ___ brother.", excluded: ["i", "you", "it", "we", "they"], needsFamily: true }
    };

    constructor(length = 30) {
        this.length = length;
        this.PromptList = [];
        this.CurrentPromptNumber = 1;
    }

    async loadPrompts() {
        try {
            const response = await fetch(PronounSet.PRONOUN_DATA);
            const data = await response.json();
            this.pronounData = Object.values(data);

            // Ensure balanced pronoun distribution
            const pronounGroups = this.groupByPronoun(this.pronounData);
            const pronouns = Object.keys(pronounGroups);
            const perPronoun = Math.ceil(this.length / pronouns.length);

            for (const pronoun of pronouns) {
                const pictures = sample(pronounGroups[pronoun], perPronoun);
                for (const pic of pictures) {
                    const question = this.selectQuestionForPicture(pronoun, pic);
                    if (!question) continue;

                    const filledQuestion = this.createQuestionSentence(question, pronoun, pic);
                    const answer = this.getAnswerForQuestion(question, pronoun);
                    
                    const prompt = new PronounPrompt({
                        questionText: filledQuestion,
                        correctAnswer: answer,
                        pronoun,
                        image: pic.filename,
                        label: question.label
                    });
                    this.PromptList.push(prompt);

                    if (this.PromptList.length >= this.length) break;
                }
                if (this.PromptList.length >= this.length) break;
            }

        } catch (error) {
            console.error('Error loading prompts:', error);
        }
    }

    groupByPronoun(data) {
        return data.reduce((acc, pic) => {
            if (!acc[pic.pronoun]) acc[pic.pronoun] = [];
            acc[pic.pronoun].push(pic);
            return acc;
        }, {});
    }

    selectQuestionForPicture(pronoun, pic) {
        // Filter questions respecting exclusions and picture properties
        const possible = Object.values(PronounSet.QUESTIONS).filter(q => {
            if (q.excluded.includes(pronoun)) return false;
            if (q.needsEyes && !pic.eyes) return false;
            if (q.needsFamily && !pic.family) return false;
            return true;
        });

        return sample(possible);
    }

    createQuestionSentence(question, pronoun, pic) {
        let q = question.question;
        // Replace "XXX" with subject or pronoun in 3rd-person form
        const subject = pic.subject || this.capitalizeFirst(pronoun);
        q = q.replace(/XXX/g, subject);
        return q;
    }

    getAnswerForQuestion(question, pronoun) {
        const forms = PronounSet.PRONOUNS[pronoun];
        if (!forms) return pronoun;

        if (question.label.includes('object')) return forms.object;
        if (question.label.includes('possessive adj')) return forms.possessiveAdjective;
        if (question.label.includes('possessive pronoun')) return forms.possessivePronoun;
        if (question.label.includes('reflexive')) return forms.reflexive;
        return pronoun;
    }

    capitalizeFirst(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    getPrompt() {
        if (this.CurrentPromptNumber > this.PromptList.length) {
            throw new Error('No more prompts available');
        }
        const prompt = this.PromptList[this.CurrentPromptNumber - 1];
        this.CurrentPromptNumber++;
        return prompt;
    }

    getRemainingCount() {
        return this.PromptList.length - this.CurrentPromptNumber + 1;
    }
}

PronounSet.PRONOUN_DATA = 'image_index.json';
export { PronounSet };
