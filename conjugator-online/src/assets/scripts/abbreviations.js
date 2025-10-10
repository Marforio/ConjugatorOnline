/* This module has functions that generate valid alternative answers to the correct answer for each Prompt.
Game players therefore have more flexibility in their answers, including missing apostrophes and other common insignificant mistakes.
*/

function abbreviator(tense, person, sentenceType, text) {
    // Returns a list 'alternatives' containing abbreviated strings
    
    if (sentenceType === 'Positive') {
        sentenceType = 'Declarative';
    }
    if (sentenceType === 'Questions') {
        sentenceType = 'Question';
    }

    const NEGATIVE_ABBREVIATIONS = {
        "i am not": ["i'm not", "im not"],
        "you are not": ["you're not", "youre not", "you aren't", "you arent"],
        "he is not": ["he's not", "hes not", "he isn't", "he isnt"],
        "she is not": ["she's not", "shes not", "she isn't", "she isnt"],
        "it is not": ["it's not", "its not", "it isn't", "it isnt"],
        "we are not": ["we're not", "were not", "we aren't", "we arent"],
        "they are not": ["they're not", "theyre not" ,"they aren't", "they arent"]
    };

    let alternatives = [];

    // Questions for all tenses
    if (sentenceType === 'Question') {
        const alternative = text.replace("?", ""); // Make it possible to answer correctly without question mark
        alternatives.push(alternative);
        return alternatives;
    }

    // Present simple
    if (tense === 'Present simple') {
        if (sentenceType === 'Negative') {
            if (person === 'he' || person === 'she' || person === 'it') {
                const alternative = text.replace('does not', "doesn't");
                alternatives.push(alternative);
                const alternative2 = text.replace('does not', "doesnt");
                alternatives.push(alternative2);
            } else {
                const alternative = text.replace('do not', "don't");
                alternatives.push(alternative);
                const alternative2 = text.replace('do not', "dont");
                alternatives.push(alternative2);
            }
            return alternatives;
        }
    }

    // Past simple
    if (tense === 'Past simple') {
        if (sentenceType === 'Negative') {
            const alternative = text.replace('did not', "didn't");
            alternatives.push(alternative);
            const alternative2 = text.replace('did not', "didnt");
            alternatives.push(alternative2);
            return alternatives;
        }
    }

    // Future simple
    if (tense === 'Future simple') {
        if (sentenceType === 'Declarative') {
            if (person === 'i') {
                const alternative = text.replace('i will', "i'll");
                alternatives.push(alternative);
                const alternative2 = text.replace('i will', "ill");
                alternatives.push(alternative2);
            } else if (person === 'you') {
                const alternative = text.replace('you will', "you'll");
                alternatives.push(alternative);
                const alternative2 = text.replace('you will', "youll");
                alternatives.push(alternative2);
            } else if (person === 'he') {
                const alternative = text.replace('he will', "he'll");
                alternatives.push(alternative);
                const alternative2 = text.replace('he will', "hell");
                alternatives.push(alternative2);
            } else if (person === 'she') {
                const alternative = text.replace('she will', "she'll");
                alternatives.push(alternative);
                const alternative2 = text.replace('she will', "shell");
                alternatives.push(alternative2);
            } else if (person === 'it') {
                const alternative = text.replace('it will', "it'll");
                alternatives.push(alternative);
                const alternative2 = text.replace('it will', "itll");
                alternatives.push(alternative2);
            } else if (person === 'we') {
                const alternative = text.replace('we will', "we'll");
                alternatives.push(alternative);
                const alternative2 = text.replace('we will', "well");
                alternatives.push(alternative2);
            } else if (person === 'they') {
                const alternative = text.replace('they will', "they'll");
                alternatives.push(alternative);
                const alternative2 = text.replace('they will', "theyll");
                alternatives.push(alternative2);
            }
        } else if (sentenceType === 'Negative') {
            const alternative = text.replace('will not', "won't");
            alternatives.push(alternative);
            const alternative2 = text.replace('will not', "wont");
            alternatives.push(alternative2);
        }
        return alternatives;
    }
    // Recommendation
    if (tense === 'Recommendation') {
        if (sentenceType === 'Declarative') {
            if (person === 'i') {
                const alternative = text.replace('i should', "i'd");
                alternatives.push(alternative);
                const alternative2 = text.replace('i should', "id");
                alternatives.push(alternative2);
            } else if (person === 'you') {
                const alternative = text.replace('you should', "you'd");
                alternatives.push(alternative);
                const alternative2 = text.replace('you should', "youd");
                alternatives.push(alternative2);
            } else if (person === 'he') {
                const alternative = text.replace('he should', "he'd");
                alternatives.push(alternative);
                const alternative2 = text.replace('he should', "hed");
                alternatives.push(alternative2);
            } else if (person === 'she') {
                const alternative = text.replace('she should', "she'd");
                alternatives.push(alternative);
                const alternative2 = text.replace('she should', "shed");
                alternatives.push(alternative2);
            } else if (person === 'it') {
                const alternative = text.replace('it should', "it'd");
                alternatives.push(alternative);
                const alternative2 = text.replace('it should', "itd");
                alternatives.push(alternative2);
            } else if (person === 'we') {
                const alternative = text.replace('we should', "we'd");
                alternatives.push(alternative);
                const alternative2 = text.replace('we should', "wed");
                alternatives.push(alternative2);
            } else if (person === 'they') {
                const alternative = text.replace('they should', "they'd");
                alternatives.push(alternative);
                const alternative2 = text.replace('they should', "theyd");
                alternatives.push(alternative2);
            }
        } else if (sentenceType === 'Negative') {
            const alternative = text.replace('should not', "shouldn't");
            alternatives.push(alternative);
            const alternative2 = text.replace('should not', "shouldnt");
            alternatives.push(alternative2);
        }
        return alternatives;
    }

    // Present continuous
    if (tense === 'Present continuous') {
        if (sentenceType === 'Declarative') {
            if (person === 'i') {
                const alternative = text.replace('i am', "i'm");
                alternatives.push(alternative);
                const alternative2 = text.replace('i am', "im");
                alternatives.push(alternative2);
            } else if (person === 'you') {
                const alternative = text.replace('you are', "you're");
                alternatives.push(alternative);
                const alternative2 = text.replace('you are', "youre");
                alternatives.push(alternative2);
            } else if (person === 'he') {
                const alternative = text.replace('he is', "he's");
                alternatives.push(alternative);
                const alternative2 = text.replace('he is', "hes");
                alternatives.push(alternative2);
            } else if (person === 'she') {
                const alternative = text.replace('she is', "she's");
                alternatives.push(alternative);
                const alternative2 = text.replace('she is', "shes");
                alternatives.push(alternative2);
            } else if (person === 'it') {
                const alternative = text.replace('it is', "it's");
                alternatives.push(alternative);
                const alternative2 = text.replace('it is', "its");
                alternatives.push(alternative2);
            } else if (person === 'we') {
                const alternative = text.replace('we are', "we're");
                alternatives.push(alternative);
                const alternative2 = text.replace('we are', "were");
                alternatives.push(alternative2);
            } else if (person === 'they') {
                const alternative = text.replace('they are', "they're");
                alternatives.push(alternative);
                const alternative2 = text.replace('they are', "theyre");
                alternatives.push(alternative2);
            }
        } else if (sentenceType === 'Negative') {
            // ✅ Use the NEGATIVE_ABBREVIATIONS map for *all* pronouns
            const key = `${person} ${person === 'i' ? 'am not' : person === 'he' || person === 'she' || person === 'it' ? 'is not' : 'are not'}`;
            if (NEGATIVE_ABBREVIATIONS[key]) {
                for (const alt of NEGATIVE_ABBREVIATIONS[key]) {
                    const alternative = text.replace(key, alt);
                    alternatives.push(alternative);
                }
            }
        }
        return alternatives;
}

    // Present perfect
    if (tense === 'Present perfect') {
        if (sentenceType === 'Declarative') {
            if (person === 'i') {
                const alternative = text.replace('i have', "i've");
                alternatives.push(alternative);
                const alternative2 = text.replace('i have', "ive");
                alternatives.push(alternative2);
            } else if (person === 'you') {
                const alternative = text.replace('you have', "you've");
                alternatives.push(alternative);
                const alternative2 = text.replace('you have', "youve");
                alternatives.push(alternative2);
            } else if (person === 'he') {
                const alternative = text.replace('he has', "he's");
                alternatives.push(alternative);
                const alternative2 = text.replace('he has', "hes");
                alternatives.push(alternative2);
            } else if (person === 'she') {
                const alternative = text.replace('she has', "she's");
                alternatives.push(alternative);
                const alternative2 = text.replace('she has', "shes");
                alternatives.push(alternative2);
            } else if (person === 'it') {
                const alternative = text.replace('it has', "it's");
                alternatives.push(alternative);
                const alternative2 = text.replace('it has', "its");
                alternatives.push(alternative2);
            } else if (person === 'we') {
                const alternative = text.replace('we have', "we've");
                alternatives.push(alternative);
                const alternative2 = text.replace('we have', "weve");
                alternatives.push(alternative2);
            } else if (person === 'they') {
                const alternative = text.replace('they have', "they've");
                alternatives.push(alternative);
                const alternative2 = text.replace('they have', "theyve");
                alternatives.push(alternative2);
            }
        } else if (sentenceType === 'Negative') {
            if (person === 'he' || person === 'she' || person === 'it') {
                const alternative = text.replace('has not', "hasn't");
                alternatives.push(alternative);
                const alternative2 = text.replace('has not', "hasnt");
                alternatives.push(alternative2);
            } else {
                const alternative = text.replace('have not', "haven't");
                alternatives.push(alternative);
                const alternative2 = text.replace('have not', "havent");
                alternatives.push(alternative2);
            }
        }
        return alternatives;
    }

    return alternatives;
}

export { abbreviator };