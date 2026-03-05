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
            question: "Tick the box for any sentence that is correct.",
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
                ["True" , true, "Right! These include 'sheep', 'deer', 'fish', 'series', and 'means'."],
                ["False" , false, "It's actually true. The words 'sheep', 'deer', 'fish', 'series', 'means' are both singular and plural." ]
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

    // Plurals inside compound nouns
    "0140" : {
        1: {
            type : "radio",
            question : "What is a compound noun?",
            answers : [
                ["A noun made up of two or more words that function as a single noun.", true, "Correct! A compound noun is made up of two or more words that function as a single noun."],
                ["A noun that is always plural.", false, "Wrong. A compound noun can be singular or plural."],
                ["A noun that cannot be modified by adjectives.", false, "Wrong. A compound noun can be modified by adjectives." ]
            ]
        },        
        2: {
            type : "radio",
            question : "Which of these is an example of a compound noun?",
            answers : [
                ["Computer screen", true, "Correct! 'Computer screen' is a compound noun made up of 'computer' and 'screen'."],
                ["The big dog", false, "Wrong. 'Dog' is a simple noun modified by an adjective and specified by the article."],
                ["Consolidation", false, "Wrong. 'Consolidation' is just a long simple noun." ]
            ]
        },
        3: {
            type : "text_multi",
            question : "Change the following phrase into a compound noun: 'A journey lasting three days'",
            answers : ["a three-day journey", "a 3-day journey","a three day journey", "a 3 day journey", "three-day journey", "3-day journey"]
        },
        4: {
            type: "text_multi",
            question: "Change the following phrase into a compound noun: 'A boy who is 5 years old'",
            answers: ["a five-year-old boy", "a 5-year-old boy", "a five year old boy", "a 5 year old boy", "five-year-old boy", "5-year-old boy", "five year old boy", "5 year old boy"]
        },
        5: {
            type : "text_multi",
            question : "Change the following phrase into a compound noun: 'An exam consisting of 20 questions'",
            answers : ["a 20-question exam", "a twenty-question exam", "a 20 question exam", "a twenty question exam", "20-question exam", "twenty-question exam", "20 question exam", "twenty question exam"]
        },
        6: {
            type : "checkbox",
            question : "Which of these sentences is correct?",
            answers : [
                ["I wrote a 10-page report.", true, "Correct! '10-page report' is a correctly formed compound noun."],
                ["I wrote a 10 pages report.", false, "Wrong. The plural form 'pages' is not correct in this compound noun."],
                ["I wrote a Tenpagereport.", false, "Wrong. 'Tenpagereport' is not correctly formed. It should be 'Ten-page report'."],
            ]
        },
        7: {
            type : "checkbox",
            question : "Which of these sentences is correct?",
            answers : [
                ["Hyphens ( - ) are used to link words together, especially when numbers are involved.", true, "Correct! Hyphens are used to link words together, especially when numbers are involved."],
                ["Hyphens ( - )  in a compound noun are obligatory. It is a big mistake not to use them.", false, "Wrong. Hyphens are not always obligatory in compound nouns. They are used in specific cases, such as when numbers are involved."],
                ["Hyphens ( - ) are a visual aid to help clarify which words are grouped together.", true, "Correct! Hyphens help clarify which words are grouped together."]
            ]
        },
        8: {
            type : "radio",
            question : "Why do we avoid plural forms inside compound nouns?",
            answers : [
                ["Because only the last noun behaves like a noun; the first noun(s) act as adjectives or modifiers, which cannot be pluralized.", true, "Right! In compound nouns, only the last noun behaves like a noun; the first noun(s) act as adjectives or modifiers."],
                ["Because plural forms are more difficult to pronounce inside compound nouns.", false, "Wrong. Plural forms are not more difficult to pronounce inside compound nouns." ],
                ["We don't avoid plural forms inside compound nouns.", false, "Wrong. You should avoid plural forms inside compound nouns." ]
            ]
        },
        9: {
            type :  "radio",
            question : "Is this correct: 'I live in a 10-floors building' ?",
            answers : [
                ["Yes, it is correct.", false, "Wrong. The correct form is 'I live in a 10-floor building'."],
                ["No, it is incorrect.", true, "Right! The correct form is 'I live in a 10-floor building'."]
            ]
        },
        10: {
            type : "radio",
            question : "Is this correct: 'My neighbors are a 5-children family' ?",
            answers : [
                ["Yes, it is correct.", false, "Wrong. The correct form is 'My neighbors are a 5-child family'."],
                ["No, it is incorrect.", true, "Right! The correct form is 'My neighbors are a 5-child family'."]
            ]
        }
    },

    // Not using compound nouns
    "0141" : {
        1: {
            type : "radio",
            question :  "Are compound nouns such as '4-wheel drive' considered natural and elegant in English?",
            answers : [
                ["Yes, compound nouns are natural and elegant in English.", true, "Correct! Compound nouns are a natural and elegant way to express ideas in English."],
                ["No, compound nouns are complicated and should be avoided.", false, "Wrong. Compound nouns are a natural and elegant way to express ideas in English." ]
            ]
        },
        2: {
            type : "radio",
            question : "Why are compound nouns such as 'a 50-win season' considered elegant?",
            answers : [
                ["Because they are short and economical.", true, "Correct! Compound nouns are elegant because they are concise and efficient."],
                ["Because they are a bit old-fashioned and outdated.", false, "Wrong. Compound nouns are not old-fashioned or outdated."],
                ["Because they are rarely used.", false, "Wrong. Compound nouns are used all the time." ]
            ]
        },
        3: {
            type : "radio",
            question :  "Choose the most elegant option:",
            answers : [
                ["The team had a season with 50 wins.", false, "Wrong. The preposition 'with' makes the sentence less concise."],
                ["The team had a 50-win season.", true, "Correct! 'A 50-win season' is a concise and elegant way to express this idea."],
                ["The team had a 50 win's season.", false, "Wrong. There is no need for the possessive ** 's ** here." ]
                ]
        },
        4: {
            type : "radio",
            question : "Choose the most elegant option:",
            answers : [
                ["The rover has a sensor for detecting obstacles.", false, "Wrong. The preposition 'for' makes the sentence less concise."],
                ["The rover has an obstacles-detection sensor,", false, "Wrong. The plural form 'obstacles' is not correct inside a compound noun."],
                ["The rover has an obstacle-detection sensor.", true, "Correct! 'An obstacle-detection sensor' is a concise and elegant way to express this idea." ]
            ]
        },
        5: {
            type : "radio",
            question : "True or false: avoid using possessive 's if you can use compound word instead.",
            answers : [
                ["True", true, "Correct! It's usually better to say, for example, 'The University campus' instead of 'The University's campus'."],
                ["False", false, "Wrong. It's usually better to say, for example, 'The University campus' instead of 'The University's campus'." ]
            ]
        },
        6: {
            type : "radio",
            question : "Which statments about compound nouns are correct?",
            answers : [
                ["Compound nouns are a natural and elegant way to express ideas in English.", true, "Correct! Compound nouns are a natural and elegant way to express ideas in English."],
                ["Compound nouns are often more concise and efficient than using prepositional phrases or possessive forms.", true, "Correct! Compound nouns are often more concise and efficient than using prepositional phrases or possessive forms."],
                ["You must always use compound nouns instead of prepositions or possessives.", false, "Wrong. There are common sense situations in which using a preposition or possessive form is more appropriate." ]
            ]
        },
        7: {
            type : "radio",
            question : "True or false: possessive 's is often used unnecessarily when a compound noun would be more concise and elegant.",
            answers : [
                ["True", true, "Correct! Possessive 's is often unnecessary (example: 'the airport's lounge' vs 'the airport lounge')."],
                ["False", false, "Wrong. Possessive 's is often unnecessary if the notion of ownership is weakly expressed (example: 'the airport's lounge' vs 'the airport lounge')." ]
            ]
        },
        8: {
            type : "radio",
            question : "In general, which of these sentences is more elegant?",
            answers : [
                ["The school's website is a bit outdated.", false, "Wrong. The possessive 's is less concise and elegant."],
                ["The school website is a bit outdated.", true, "Correct! The compound noun 'school website' is more concise and elegant." ],
                ["The website of the school is a bit outdated.", false, "Wrong. The prepositional phrase 'of the school' is less concise and elegant."]
            ]        
        },
        9: {
            type : "radio",
            question : "In general, which of these sentences is more elegant?",
            answers : [
                ["The three-day weekend for all is a dangerous idea.", true, "Correct! The compound noun 'three-day weekend' is more concise and elegant."],
                ["The three days' weekend for all is a dangerous idea.", false, "Wrong. The possessive 's is less elegant, even wrong in this case." ],
                ["The weekend of three days for all is a dangerous idea.", false, "Wrong. The prepositional phrase 'of three days' is less concise and elegant." ]
            ]
        },
        10: {
            type : "radio",
            question : "In general, which of these sentences is more elegant?",
            answers : [
                ["Geneva's airport needs to be renovated.", false, "Wrong. The possessive 's is less concise and elegant."],
                ["Geneva airport needs to be renovated.", true, "Correct! The compound noun 'Geneva airport' is more concise and elegant." ],
                ["The airport of Geneva needs to be renovated.", false, "Wrong. The prepositional phrase 'of Geneva' is less concise and elegant." ]
            ]
        }
    },

    // Treating uncountable nouns as single units
    "0151" : {
        1: {
            type : "checkbox",
            question : "Which of these words are uncountable nouns?",
            answers : [
                ["Book", false, "Wrong. 'Book' is a countable noun."],
                ["Information", true, "Correct! 'Information' is an uncountable noun."],
                ["Advice", true,"Correct! 'Advice' is an uncountable noun." ],
                ["Microphone", false, "Wrong. 'Microphone' is a countable noun." ],
                ["Furniture", true, "Correct! 'Furniture' is an uncountable noun." ],
                ["News", true, "Correct! 'News' is an uncountable noun (>> 'l'actualité')." ],
                ["Water", true, "Correct! 'Water' is an uncountable noun." ],
            ]
        },
        2: {
            type : "radio",
            question : "Uncountable nouns such as 'information' and 'advice' can be treated as a single unit ('an information' or 'an advice').",
            answers : [
                ["True", false, "Wrong. Uncountable nouns should not be treated as a single units."],
                ["False", true, "Correct. Uncountable nouns should not be treated as a single units." ]
            ]
        },
        3: {
            type : "radio",
            question : "Can we use 'each' and 'every' with uncountable nouns such as 'information' and 'advice'?",
            answers : [
                ["True", false, "Wrong. 'Each' and 'every' cannot be used with uncountable nouns such as 'information' and 'advice'."],
                ["False", true, "Correct. 'Each' and 'every' cannot be used with uncountable nouns such as 'information' and 'advice'." ]
            ]
        },
        4: {
            type : "radio",
            question : "Why are the articles 'a' and 'an' and the determiners 'each' and 'every' not used with uncountable nouns such as 'information' and 'advice'?",
            answers : [
                ["Because these articles and determiners imply that the noun is a single unit, which is incompatible with uncountable nouns.", true, "Correct! The articles 'a' and 'an' and the determiners 'each' and 'every' imply that the noun is a single unit, which is incompatible with uncountable nouns."],
                ["Because these articles and determiners are only used with plural nouns.", false, "Wrong. The articles 'a' and 'an' and the determiners 'each' and 'every' are used with singular countable nouns." ],
                ["Because these articles and determiners are only used with countable nouns.", false, "Wrong. The articles 'a' and 'an' and the determiners 'each' and 'every' are used with singular countable nouns." ]
            ]
        },
        5: {
            type : "checkbox",
            question : "Which of these are correct?",
            answers : [
                ["Each furniture in this room is priceless.", false, "Wrong. 'Furniture' is an uncountable noun and cannot be treated as a single unit."],
                ["I have important information to give.", true, "Correct! 'Information' is an uncountable noun and should not be treated as a single unit (no article is used)." ],
                ["I have an important advice to give.", false, "Wrong. 'Advice' is an uncountable noun and cannot be treated as a single unit."],
                ["I have an important announcement to make.", true, "Correct! 'Announcement' is a countable noun and can be treated as a single unit ('an announcement')."],
                ["Every news today was depressing.", false, "Wrong. 'News' is an uncountable noun and cannot be treated as a single unit, which is what 'every' implies."],
            ]
},
    }
}