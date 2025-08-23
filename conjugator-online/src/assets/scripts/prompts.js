/* Module containing the ConjugationPrompt class, which represents a single conjugation prompt in the Conjugator game.
 The class has methods for setting user answers, checking correctness, and retrieving prompt data.
 It is used by the Set classes (VocabularySet and ConjugationSet) to create and manage sets of prompts for the game.
 */

class ConjugationPrompt {
    /**
     * Creates a ConjugationPrompt object.
     * @param {number} numberInSet - The number of the prompt within the set.
     * @param {string} verb - The verb for the prompt.
     * @param {string} person - The person for the prompt.
     * @param {string} tense - The tense for the prompt.
     * @param {string} sentence - The sentence type for the prompt.
     * @param {Array<string>} answers - The correct answers for the prompt.
     */
    constructor(numberInSet, verb, person, tense, sentence, answers) {
        this.number = numberInSet;
        this.verb = verb;
        this.person = person;
        this.tense = tense;
        this.sentence = sentence;
        this.answers = answers;
        this.promptData = { verb: this.verb, person: this.person, tense: this.tense, 'sentence type': this.sentence };
        this.userAnswer = "";
        this.correct = false;
        this.elapsedTime = 0
    }

    getAnswers() {
        // Returns the correct answers, which is a list
        return this.answers;
    }

    getNumber() {
        // Returns the prompt's number within the set
        return this.number;
    }

    getPerson() {
        return this.person;
    }

    getResult() {
        const resultData = {
            prompt: {
            verb: this.verb,
            person: this.person,
            tense: this.tense,
            sentenceType: this.sentence,  
        },
        userAnswer: this.userAnswer,
        correct: this.correct,
        correctAnswers: this.answers,
        };
        return resultData;
    }

    getSentenceType() {
        return this.sentence;
    }

    getTense() {
        return this.tense;
    }

    getVerb() {
        return this.verb;
    }

    setUserAnswer(userAnswer) {
        this.userAnswer = userAnswer;
        this.correct = this.answers.includes(this.userAnswer);
    }

    getCorrect() {
        return this.correct;
    }
    getEvidence() {
        return { correct: this.correct, userAnswer: this.userAnswer, answers: this.answers, elapsedTime: this.elapsedTime };
    }
    
}

export { ConjugationPrompt };