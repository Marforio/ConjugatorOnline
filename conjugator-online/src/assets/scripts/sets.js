 /* @fileoverview This file contains the VocabularySet and ConjugationSet classes.
 These classes are used to manage sets of vocabulary and conjugation prompts for the conjugator game.
 These Set classes make use of the ConjugationPrompt class to create and manage individual prompts.
*/
import { random } from 'lodash';
import { ConjugationPrompt } from './prompts.js';
import { router } from './sentenceBuilder.js';
import { abbreviator } from './abbreviations.js';

class VocabularySet {
    static IRREGULAR_VERBS = 'src/assets/data/irregularVerbs.json';

    constructor(window, vocabulary, length = 10) {
        const basedir = path.dirname(__filename);
        this.irregularVerbs = JSON.parse(fs.readFileSync(path.join(basedir, VocabularySet.IRREGULAR_VERBS), 'utf8'));
        this.startingPromptDict = {};
        this.playingPromptDict = {};
        if (vocabulary === 'irregs_past_simple') {
            for (let i = 0; i < length; i++) {
                const prompt = random(Object.keys(this.irregularVerbs));
                this.startingPromptDict[prompt] = this.irregularVerbs[prompt]['past_simple'];
            }
        }
    }

    shuffle() {
        this.playingPromptList = [...this.startingPromptList];
        for (const oPrompt of this.playingPromptList) {
            oPrompt.conceal(); // Assuming conceal is a method in ConjugationPrompt
        }
        this.playingPromptList = this.playingPromptList.sort(() => Math.random() - 0.5);
    }

    getPrompt() {
        if (this.playingPromptList.length === 0) {
            throw new Error('No more prompts');
        }
        return this.playingPromptList.pop();
    }

    returnPromptToList(oPrompt) {
        this.playingPromptList.push(oPrompt);
    }
}

class ConjugationSet {
    static PERSONS = ['i', 'you', 'he', 'she', 'it', 'we', 'they'];
    static ALL_TENSES = ['Present simple', 'Past simple', 'Future simple', 'Present continuous', 'Present perfect', 'Recommendation'];
    static ALL_SENTENCES = ['Declarative', 'Negative', 'Question'];
    static IRREGULAR_VERBS = 'src/assets/data/irregularVerbs.json';
    static COMMON_VERBS = 'src/assets/data/commonVerbs.json';
    static REGULAR_VERBS = 'src/assets/data/regularVerbs.json';

    constructor(type, tenses, sentences, length) {
        this.type = type;
        this.length = length;
        this.tenses = tenses;
        this.sentences = sentences;
        this.PromptDict = {};
        this.PromptList = [];
        this.CurrentPromptNumber = 1;
    }

    async loadPrompts() {
        const basedir = './src/assets/data/';
        try {
            const commonVerbsResponse = await fetch(basedir + 'commonVerbs.json');
            this.commonVerbs = await commonVerbsResponse.json();
            console.log('Common Verbs:', this.commonVerbs);

            const regularVerbsResponse = await fetch(basedir + 'regularVerbs.json');
            this.regularVerbs = await regularVerbsResponse.json();
            console.log('Regular Verbs:', this.regularVerbs);

            const irregularVerbsResponse = await fetch(basedir + 'irregularVerbs.json');
            this.irregularVerbs = await irregularVerbsResponse.json();
            console.log('Irregular Verbs:', this.irregularVerbs);

            let verbSource;

            // Determine verb source based on type
            if (this.type === 'Common verbs (Reg + Irreg)') {
                verbSource = this.commonVerbs;
            } else if (this.type === 'Regular verbs only') {
                verbSource = this.regularVerbs;
            } else if (this.type === 'Irregular verbs only') {
                verbSource = Object.keys(this.irregularVerbs);
            } else {
                console.error('Invalid type:', this.type);
                verbSource = [];
            }
            console.log('Selected verb source:', verbSource);

            if (!verbSource || verbSource.length === 0) {
                console.error('Verb source is empty. Check your data files and type.');
                return;
            }

            // Generate prompts
            for (let i = 1; i <= this.length; i++) {
                const verb = random1(verbSource);
                const person = random1(ConjugationSet.PERSONS);
                const tense = random1(this.tenses);
                const sentence = random1(this.sentences);
                const answers = [];

                if (!verb || !person || !tense || !sentence) {
                    console.error(`Failed to generate prompt for index ${i}:`, { verb, person, tense, sentence });
                    continue;
                }

                this.PromptDict[i] = { verb, person, tense, sentence, answers };
                console.log(`PromptDict[${i}] initialized:`, this.PromptDict[i]);
            }

            console.log('Completed PromptDict population:', this.PromptDict);

            // Populate answers and PromptList
            for (const i in this.PromptDict) {
                const { verb, person, tense, sentence } = this.PromptDict[i];
                const answer = router(verb, person, tense, sentence);
                console.log('The answer is ', answer);
                this.PromptDict[i].answers.push(answer);
                console.log(`PromptDict[${i}] answer:`, answer);

                const alternativeAnswers = abbreviator(tense, person, sentence, answer);
                console.log(`Alternative answers for PromptDict[${i}]:`, alternativeAnswers);
                this.PromptDict[i].answers.push(...alternativeAnswers);
                const answers = this.PromptDict[i].answers;
                console.log(`PromptDict[${i}] answers:`, answers);

                const prompt = new ConjugationPrompt(i, verb, person, tense, sentence, answers);
                this.PromptList.push(prompt);
                console.log(`PromptList[${i - 1}] added:`, prompt);
            }

            console.log('Completed PromptList population:', this.PromptList);
        } catch (error) {
            console.error('Error loading prompts:', error);
        }
    }

    getCurrentPromptNumber() {
        return this.CurrentPromptNumber <= this.length ? this.CurrentPromptNumber : null;
    }

    getPrompt() {
        const index = this.getCurrentPromptNumber();
        if (index && index - 1 < this.PromptList.length) {
            const prompt = this.PromptList[index - 1]; // Convert to 0-based index
            this.CurrentPromptNumber += 1;
            return prompt;
        } else {
            throw new Error('No more prompts available');
        }
    }
    getRemainingCount() {
        return this.length - this.CurrentPromptNumber + 1;
    }
}

// Helper function to select a random item from an array
function random1(array) {
    if (!array || array.length === 0) {
        console.error('random function received an empty array:', array);
        return null;
    }
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

export { ConjugationSet };
