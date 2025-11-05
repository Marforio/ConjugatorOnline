/* Module containing the PronounPrompt class, which represents a single prompt
 * in the Pronoun game.
 * Each prompt consists of:
 *  - a question text (e.g., "I saw ___ yesterday.")
 *  - a pronoun (e.g., "he")
 *  - a correct answer (e.g., "him")
 *  - optional image metadata
 * The class handles checking user responses and tracking result data.
 */

class PronounPrompt {
    /**
     * Creates a PronounPrompt object.
     * @param {Object} config - Configuration for the prompt.
     * @param {string} config.questionText - The question shown to the user.
     * @param {string|string[]} config.correctAnswer - The correct answer(s) for the blank.
     * @param {string} config.pronoun - The pronoun this question tests (e.g., "she").
     * @param {string} [config.image] - Optional filename for the associated image.
     * @param {string} [config.label] - A label describing the question type (e.g., "object", "reflexive").
     * @param {number} [config.numberInSet] - The index of this prompt in the game set.
     */
    constructor({ questionText, correctAnswer, pronoun, subject, image = null, label = '', numberInSet = null }) {
        this.number = numberInSet;
        this.questionText = questionText;
        this.pronoun = pronoun;
        this.image = image;
        this.label = label;
        this.subject = subject

        // Normalize correct answers to array for flexible checking
        this.correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];

        this.userAnswer = "";
        this.correct = false;
        this.elapsedTime = 0; 
    }

    /** Returns the question text displayed to the user */
    getQuestionText() {
        return this.questionText;
    }

    /** Returns the pronoun this question tests */
    getPronoun() {
        return this.pronoun;
    }

    /** Returns all correct answers (array) */
    getCorrectAnswers() {
        return this.correctAnswers;
    }

    /** Sets the user’s answer and checks correctness (case-insensitive) */
    setUserAnswer(userAnswer) {
        this.userAnswer = userAnswer.trim();
        this.correct = this.correctAnswers.some(
            ans => ans.toLowerCase() === this.userAnswer.toLowerCase()
        );
    }

    /** Returns whether the user's answer was correct */
    getCorrect() {
        return this.correct;
    }

    /** Returns the image filename (if available) */
    getImage() {
        return this.image;
    }

    /** Returns metadata for result tracking */
    getResult() {
        return {
            number: this.number,
            question: this.questionText,
            pronoun: this.pronoun,
            userAnswer: this.userAnswer,
            correctAnswers: this.correctAnswers,
            correct: this.correct,
            image: this.image,
            label: this.label,
            elapsedTime: this.elapsedTime
        };
    }

    /** Returns lightweight evidence summary for analytics */
    getEvidence() {
        return {
            correct: this.correct,
            userAnswer: this.userAnswer,
            answers: this.correctAnswers,
            elapsedTime: this.elapsedTime
        };
    }
}

export { PronounPrompt };
