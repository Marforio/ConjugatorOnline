// Import the necessary functions from tenses.js
import { presentSimple, presentContinuous, pastSimple, presentPerfect, future, recommendation } from './tenses';

function sentenceBuilder(sentence, subject, aux, principal) {
    /**
     * Builds declarative, negative or question sentences based on input provided.
     * Called by the router function below.
     */

    let result = '';
    if (sentence === 'Declarative') {
        if (aux === null) {
            result = subject.toLowerCase() + " " + principal;
        } else {
            result = subject.toLowerCase() + " " + aux + " " + principal;
        }
    } else if (sentence === 'Negative') {
        result = subject.toLowerCase() + " " + aux + " not " + principal;
    } else if (sentence === 'Question') {
        result = aux.toLowerCase() + " " + subject + " " + principal + "?";
    }
    return result;
}

function router(verb, person, tense, sentence) {
    /**
     * Routes the construction of the final sentence string using the imported tense function and the sentenceBuilder function above.
     */
    console.log('Router received the following arguments:', [ verb, person, tense, sentence ]);
    if (sentence === 'Positive') {
        sentence = 'Declarative';
    }
    if (sentence === 'Questions') {
        sentence = 'Question';
    }
    let aux = '';
    let principal = '';
    if (tense === "Present simple") {
        ({ aux, principal } = presentSimple(sentence, verb, person));
    } else if (tense === "Present continuous") {
        ({ aux, principal } = presentContinuous(verb, person));
    } else if (tense === "Past simple") {
        ({ aux, principal } = pastSimple(sentence, verb));
    } else if (tense === "Present perfect") {
        ({ aux, principal } = presentPerfect(verb, person));
    } else if (tense === "Future simple") {
        ({ aux, principal } = future(verb));
    } else if (tense === "Recommendation") {
        ({ aux, principal } = recommendation(verb));
    }

    const result = sentenceBuilder(sentence, person, aux, principal);
    console.log('Router returning:', result);
    return result;
}

export {
    router
};