const basedir = "./src/assets/data/";

let irregularVerbs = {};

async function loadIrregularVerbs() {
    try {
      const irregularVerbsResponse = await fetch(basedir + 'irregularVerbs.json');
      const irregularVerbs = await irregularVerbsResponse.json();
      return irregularVerbs;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  loadIrregularVerbs().then((verbs) => {
    console.log('Irregular verbs loaded:', verbs);
  });
  
const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
const vowels = ['a', 'e', 'i', 'o', 'u'];
const NON_DOUBLING_CONSONANTS = ['w', 'x', 'y'];
const NON_DOUBLING = ['administer', 'allow', 'alter', 'anger', 'answer', 'bother', 'cater', 'color', 'consider', 'counter', 'cover', 'deliver', 
    'differ', 'discover', 'encounter', 'enter', 'favor', 'foster', 'gather', 'honor', 'lower', 'master', 'market', 'minister', 
    'monitor', 'murder', 'offer', 'open', 'order', 'pocket', 'ponder', 'reconsider', 'recover', 'register', 'remember', 'render',  
    'rocket', 'skyrocket', 'suffer', 'surrender', 'target', 'transfer', 'wager', 'wander', 'wonder'];

function presentSimple(sentence, action, person) {
    const problemEndingsOne = ['x', 's'];
    const problemEndingsTwo = ['ss', 'sh', 'ch'];
    let aux = '';
    let principal = '';

    if (sentence === 'Negative' || sentence === 'Question') {
        if (person === "he" || person === "she" || person === "it") {
            aux = "does";
            principal = action;
        } else {
            aux = "do";
            principal = action;
        }
    } else if (sentence === 'Declarative' && (person === "he" || person === "she" || person === "it")) {
        if (consonants.includes(action[action.length - 2]) && action[action.length - 1] === 'y') {
            principal = action.slice(0, -1) + "ies";
        } else if (problemEndingsOne.includes(action[action.length - 1]) || problemEndingsTwo.includes(action.slice(-2)) || action.toLowerCase() === "go" || action.toLowerCase() === "do") {
            principal = action + 'es';
        } else {
            principal = action + 's';
        }
        aux = null;
    } else if (sentence === 'Declarative' && (person === "i" || person === "you" || person === "we" || person === "they")) {
        principal = action;
        aux = null;
    }

    return { aux, principal };
}

function presentContinuous(action, person) {
    let principal = '';
    let aux = '';

    if (person === "i") {
        aux = "am";
    } else if (person === "he" || person === "she" || person === "it") {
        aux = "is";
    } else if (person === "you" || person === "we" || person === "they") {
        aux = "are";
    }

    if (action.length >= 3 && consonants.includes(action[action.length - 3]) && vowels.includes(action[action.length - 2]) && consonants.includes(action[action.length - 1]) && !NON_DOUBLING_CONSONANTS.includes(action[action.length - 1]) && !NON_DOUBLING.includes(action)) {
        principal = action + action[action.length - 1] + "ing";
    } else if (action.slice(-2) === "ie") {
        principal = action.slice(0, -2) + 'ying';
    } else if (consonants.includes(action[action.length - 2]) && action[action.length - 1] === "e") {
        principal = action.slice(0, -1) + "ing";
    } else {
        principal = action + "ing";
    }

    return { aux, principal };
}

function pastSimple(sentence, action) {
    let aux = '';
    let principal = '';

    if (sentence === 'Negative' || sentence === 'Question') {
        aux = "did";
        principal = action;
    } else if (sentence === "Declarative") {
        aux = null;
        if (irregularVerbs.hasOwnProperty(action)) {
            principal = irregularVerbs[action]["past_simple"];
        } else if (action.length >= 3 && consonants.includes(action[action.length - 3]) && vowels.includes(action[action.length - 2]) && consonants.includes(action[action.length - 1]) && !NON_DOUBLING_CONSONANTS.includes(action[action.length - 1]) && !NON_DOUBLING.includes(action)) {
            principal = action + action[action.length - 1] + "ed";
        } else if (action[action.length - 1] === "e") {
            principal = action + "d";
        } else if (consonants.includes(action[action.length - 2]) && action[action.length - 1] === 'y') {
            principal = action.slice(0, -1) + "ied";
        } else {
            principal = action + "ed";
        }
    }

    return { aux, principal };
}

function presentPerfect(action, subject) {
    let aux = '';
    if (subject === "he" || subject === "she" || subject === "it") {
        aux = "has";
    } else if (subject === "i" || subject === "you" || subject === "we" || subject === "they") {
        aux = "have";
    }

    let principal = '';
    if (irregularVerbs.hasOwnProperty(action)) {
        principal = irregularVerbs[action]["past_participle"];
    } else if (action.length >= 3 && consonants.includes(action[action.length - 3]) && vowels.includes(action[action.length - 2]) && consonants.includes(action[action.length - 1]) && !NON_DOUBLING_CONSONANTS.includes(action[action.length - 1]) && !NON_DOUBLING.includes(action)) {
        principal = action + action[action.length - 1] + "ed";
    } else if (action[action.length - 1] === "e") {
        principal = action + "d";
    } else if (consonants.includes(action[action.length - 2]) && action[action.length - 1] === 'y') {
        principal = action.slice(0, -1) + "ied";
    } else {
        principal = action + "ed";
    }

    return { aux, principal };
}

function future(action) {
    const aux = 'will';
    const principal = action;
    return { aux, principal };
}

function recommendation(action) {
    const aux = 'should';
    const principal = action;
    return { aux, principal };
}

export {
    presentSimple,
    presentContinuous,
    pastSimple,
    presentPerfect,
    future,
    recommendation
};