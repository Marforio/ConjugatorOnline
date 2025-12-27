// exercise dictionary
export const exerciseData = {
    // Template
    "0000": {
        1: {
            type : "radio",
            question : "",
            answers : [
                ["True", true, "These plurals come from Latin or Greek origins."],
                ["False", false,"These strange plurals come from Latin or Greek origins." ]
            ]
        },
        2: {
            type : "",
            question : "",
            answer : ""
        },
        3: {
            type : "",
            question : "",
            answer : ""
        },
        4: {
            type : "",
            question : "",
            answer : ""
        },
        5: {
            type : "",
            question : "",
            answer : ""
        },
        6: {
            type : "",
            question : "",
            answer : ""
        },
        7: {
            type : "",
            question : "",
            answer : ""
        },
        8: {
            type : "",
            question : "",
            answer : ""
        },
        9: {
            type : "",
            question : "",
            answer : ""
        },
        10: {
            type : "",
            question : "",
            answer : ""
        }
    },
    // Irregular plurals
    "0120": {
        1: {
            type : "text_mono",
            question: "What is the correct plural form of 'child'?",
            answer: "children"
        },
        2: {
            type : "text_mono",
            question: "What is the correct plural form of 'foot'?",
            answer: "feet"
        },
        3: {
            type : 'text_mono',
            question: "What is the correct plural form of 'tooth'?",
            answer: "teeth"
        },
        4: {
            type : 'text_mono',
            question: "The word 'person' has the plural forms 'persons' and _____________.",
            answer: "people"
        },
        5: {
            type : 'text_mono',
            question: "What is the correct plural form of 'mouse'?",
            answer: "mice"
        },
        6: {
            type : 'text_mono',
            question: "The correct plural form of 'man' is _____________.",
            answer: "men"
        },
        7: {
            type : 'text_mono',
            question: "The correct plural form of 'woman' is _____________.",
            answer: "women"
        },
        8: {
            type : 'text_mono',
            question: "What is the correct plural form of 'die' (un dé dans un jeu de société / ein Würfel)?",
            answer: "dice"
        },
        9: {
            type : 'checkbox',
            question: "Which of the following sentences is correct?",
            answers: [
                ["The plural form of 'datum' is 'data'.", true, "Yes. The plural form 'data' is correct."],
                ["The singular form 'datum' is almost never used.", true, "Actually, it's true. We usually use 'data'."],
                ["The plural form 'datas' is correct.", false, "Sorry, the plural form 'datas' is not valid and caused by French influence."]
            ]
        },
        10: {
            type : "text_multi",
            question: "Write a plural form ending with the letter -a (write one word)",
            answers: ["phenomena", "criteria", "bacteria", "media", "data"]
        },
        11: {
            type : "radio",
            question: "English irregular plurals ending in -a or -i are mostly derived from Latin or Greek.",
            answers: [
                ["True", true, "It's true! These plurals come from Latin or Greek origins."],
                ["False", false,"It's actually true. Most -a and -i plurals come from Latin or Greek." ]
            ]
        },
        12: {
            type : "radio",
            question: "The translation of 'les médias' / 'die Medien' in English is 'the medias'.",
            answers: [
                ["True" , false, "The correct plural form is 'the media'."],
                ["False" , true, "The correct plural form is 'the media'." ]
            ]
        },
        13: {
            type : "text_mono",
            question: "What is the correct plural form of 'medium'?",
            answer: "media"
        },
        14: {
            type : "text_multi",
            question: "Write a plural form ending with the letter -i (write one word):",
            answers: ["fungi", "cacti", "radii", "nuclei", "alumni"]
        },
        15: {
            type : "radio",
            question: "A few English words have a plural form identical to the singular form.",
            answers: [
                ["True" , false, "Right! These include 'sheep', 'deer', 'fish', 'series', and 'means'."],
                ["False" , true, "It's true. The words 'sheep', 'deer', 'fish', 'series', 'means' are both singular and plural." ]
            ]
        },
    },
    // Singular nouns ending in -s
    "0125": {
        1: {
            type : "radio",
            question : "Nouns ending in -s are always plural.",
            answers : [
                ["True", false, "Wrong! Not all nouns are plural when ending in -s."],
                ["False", true, "Right! A few nouns actually end in -s in their singular forms." ]
            ]
        },
        2: {
            type : "radio",
            question : "The singular and plural forms of the words 'means', 'series' and 'species' are identical.",
            answers : [
                ["True", true, "Right! Means, species and series end in -s in both the singular and plural form."],
                ["False", false, "Wrong! Believe it or not, means, species and series end in -s in both the singular and plural form." ]
            ]
        },
        3: {
            type : "radio",
            question : "Choose the missing word: 'This rare bird species _______ at risk'",
            answers : [
                ["are", false, "Wrong. 'This species' is 'one species'. It requires the singular conjugation of the verb be: 'is'."],
                ["is", true, "Right! 'This species' is singular and requires the singular conjugation of the verb be" ],
                ['both of the above are valid', false, "Wrong. 'This species' is 'one species'. It requires the singular conjugation of the verb be: 'is'."]
            ]
        },
        4: {
            type : "checkbox",
            question : "Select the sentence(s) that describe(s) a common error with singular words ending in -s.",
            answers : [
                ["Students forget to add another -es at the end of the word.", false, "This is wrong. We don't need to add another -es ending to words like 'series' and 'species'."],
                ["Students incorrectly delete the -s ending.", true, "Right! Students often say (incorrectly): This TV serie is very good." ],
                ['Students use a plural conjugation even when the word is singular.', true, "This is true. Students often say (incorrectly) 'Economics are very important."]
            ]
        },
        5: {
            type : "radio",
            question : "Choose the missing word: Mathematics _______ the foundation of all technology.'",
            answers : [
                ["are", false, "Wrong. 'Mathematics' is 'one thing'. It requires the singular conjugation of the verb be: 'is'."],
                ["is", true, "Right! 'Mathematics' is singular and requires the singular conjugation of the verb be" ],
                ['both of the above are valid', false, "Wrong. 'Mathematics' is 'a single thing'. It requires the singular conjugation of the verb be: 'is'."]
            ]
        },
        6: {
            type : "radio",
            question : "Which French translation best captures the correct way to use the English word 'the news'?",
            answers : [
                ["les nouvelles", false, "Wrong. 'Les nouvelles' is plural; 'the news' is singular."],
                ["l'actualité", true, "'L'actualité' is singular, just like 'the news'" ],
                ['le journal', false, "Wrong. 'Le journal' is 'the newspaper'."]
            ]
        },
        7: {
            type : "radio",
            question : "Choose the missing word: 'The news _______________ not good.",
            answers : [
                ["is", true, "Right! 'The news' is 'A mass of information'. It requires the singular conjugation of the verb be: 'is'."],
                ["are", false, "Wrong. 'News' is a word for a single mass of information (l'actualité). It requires the singular conjugation of the verb be: 'is'." ],
                ['both of the above are valid', false, "Wrong. Only the singular conjugation 'is' can be used with 'news', because 'the news' is a single mass."]
            ]
        },
        8: {
            type : "checkbox",
            question : "Which of these words are valid singular forms?",
            answers : [
                ["electronics", true, "Yes. 'Electronics' is not a plural noun. It is a domain (one domain) of engineering."],
                ["analysis", true,"Right! 'Analysis' is a singular form ('an in-depth analysis')"],
                ["cookies", false, "Not cookies! Cookies has a singular form, cookie." ],
                ["news", true, "Correct! News is a singular form. You cannot say 'a new'."]
            ]
        },
        9: {
            type : "radio",
            question : "Correct or incorrect: 'une bonne nouvelle' = 'a good new'",
            answers : [
                ["True", false, "Incorrect. The word 'new' does not exist as a translation of 'une nouvelle'."],
                ["False", true, "Correct! The word 'new' does not exist as a translation of 'une nouvelle'." ]
            ]
        },
        10: {
            type : "radio",
            question : "Correct or incorrect: 'un moyen de transport' = 'a means of transportation'",
            answers : [
                ["True", true, "Correct! 'A means' == 'un moyen'"],
                ["False", true, "Incorrect. 'A means' == 'un moyen'" ]
            ]
        }
    },

    // PLural nouns
    "0130": {
        1: {
            type : "radio",
            question : "What is a plural noun?",
            answers : [
                ["A word that is always used in plural form", true, "Yes! A plural noun is a word for a thing that only exists in pairs or in sets."],
                ["A word with an uncommon or irregular plural form", false, "Not true. A plural noun is a word for a thing that only exists in pairs (glasses) or in sets (stairs)." ],
                ["I like plural nouns", false, "Glad to hear that, but that's not the definition."]
            ]
        },
        2: {
            type : "radio",
            question : "Plural nouns can be treated as a single thing ('A house is expensive'), or as multiple things ('The houses are expensive').",
            answers : [
                ["True", false, "Incorrect. Plural nouns should never be treated as a single thing. 'House' is not a plural noun."],
                ["False", true, "Correct. Plural nouns should never be treated as a single thing. 'House' is not a plural noun." ]
            ]
        },
        3: {
            type : "radio",
            question : "Choose the correct option: '___________________ very sharp.'",
            answers : [
                ["This scissor is", false, "Wrong choice. Scissors always come in pairs, and are therefore always plural (-s is obligatory)."],
                ["These scissors is", false, "Wrong choice. The verb 'be' should appear in plural form ('are')'." ],
                ["These scissors are", true, "Correct! Scissors are always plural." ]
            ]
        },
        4: {
            type : "checkbox",
            question : "Which of these words are plural nouns?",
            answers : [
                ["media", false, "Wrong. 'Media' is not a plural noun. It can be used in the singular form 'medium'."],
                ["series", false,"Wrong. 'Series' is not a plural noun. It can be used as a singular word ('a TV series')." ],
                ["pants", true, "Correct! Pants are always plural, because they come in pairs by definition." ],
                ["scissors", true, "Correct! Scissors are always plural. You cannot say ' a scissor'."]
            ]
        },
        5: {
            type : "radio",
            question : "What is the missing word?: 'My headphones ________ very expensive.",
            answers : [
                ["is", false, "Wrong. Headphones A-R-E plural by definition."],
                ["are", true, "Correct! Headphones are always plural." ],
                ["both are acceptable", false,"Wrong. Only the plural conjugation 'are' is correct." ],
            ]
        },
        6: {
            type : "radio",
            question : "Is this sentence correct? 'I bought myself a nice jeans.'",
            answers : [
                ["Correct", false, "Not true. 'Jeans' always come in pairs. You cannot say 'one jeans' or 'a jeans'."],
                ["Incorrect", true, "Right! 'Jeans' always come in pairs. You cannot say 'one jeans' or 'a jeans'." ]
            ]
        },
        7: {
            type : "radio",
            question : "What is the correct option?",
            answers : [
                ["'stairs are dangerous'", true, "Yes! A plural noun should be in plural conjugation ('are')"],
                ["'the stair is dangerous'", false, "Wrong. A plural noun cannot appear in singular form ('stair')" ],
                ["'the stairs is dangerous'", false,"No. A plural noun is not compatible with a singular conjugation ('is')" ],
            ]
        },
        8: {
            type : "radio",
            question : "Choose the best option for the plural noun 'eaves' (l'avant-toît): 'This house has _________________.'",
            answers : [
                ["a wide eaves", false, "Wrong. You cannot use the indefinite article 'a' with a plural noun."],
                ["a wide eave", false, "Wrong. The singular form 'eave' does not exist. 'Eaves' is a plural noun." ],
                ["wide eaves", true,"Right! You can use a plural noun without an article." ],
            ]
        },
        9: {
            type : "radio",
            question : "Is this correct?: 'The stairs were designed to draw attention.'",
            answers : [
                ["Correct", true, "Yes, use 'stairs' in the plural form with the plural conjugation of 'be' ('were')."],
                ["Incorrect", false, "Wrong. The word 'stairs' MUST be used in plural ('stairs') form and with a plural conjugation ('were')." ]
            ]
        },
        10: {
            type : "checkbox",
            question : "Which of these words are plural nouns?",
            answers : [
                ["stairs", true, "Yes! The singular form 'a stair' does not exist."],
                ["clothes", true,"Yes. 'A clothe' is not a valid form. Clothes are plural by definition." ],
                ["data", true, "Correct! The singular form 'datum' is rarely used." ],
                ["sunglasses", true, "Correct! Sunglasses exist in pairs by definition. You cannot say 'a sunglass'."]
            ]
        }
    },
    



};


