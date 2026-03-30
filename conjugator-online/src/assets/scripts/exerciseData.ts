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
    // 0110 Forgetting to say plural 's'
    "0110": {
        1: {
            type : "radio",
            question : "What is the plural form of 'cat'?",
            answers : [
                ["cat", false, "Wrong. The plural form of 'cat' is 'cats'."],
                ["cats", true, "Correct! The plural form of 'cat' is 'cats'." ]
            ]
        },
    2: {
        type : "radio",
        question : "What is the #1 most frequent error made by French speakers in English?",
        answers : [
            ["Forgetting to say the plural 's'", true, "Correct! The most common error made by French speakers in English is forgetting to say the plural 's'."],
        ]
    },
    3: {
        type : "radio",
        question : "Do you promise to try to focus on remembering to say the plural 's' in English?",
        answers : [
            ["I promise", true, "Great! Remembering to say the plural 's' is important."],
            ["I don't promise", false, ":-( not nice."]
        ]
    },
    4: {
        type : "checkbox",
        question : "Which of these sentences are true?",
        answers : [
            ["Not pronouncing the plural 's' is a common error.", true, "Correct! This sentence is correct."],
            ["Not pronouncing the plural 's' can be avoided with a bit of concentration.", true, "Correct! This sentence is correct."],
            ["Not pronouncing the plural 's' makes you sound cool and sophisticated.", false, "Wrong. Not pronouncing the plural 's' makes you sound less fluent." ]
        ]
    },
    5: {
        type : "radio",
        question : "I will earn a better grade and participation points with the teacher by focusing on the plural 's'.",
        answers : [
            ["Yes, I will", true, "Yes, the teacher will definitely notice your effort and reward you for it."],
            ["No, I won't", false, "Wrong. Focusing on the plural 's' is actually important for earning a better grade and participation points."]
        ]
    },
    6: { 
        type : "radio",
        question : "Choose the best option.",
        answers : [
            ["I don't want any problems", true, "Correct! This is the best option. English differs from French in this type of construction."],
            ["I don't want any problem", false, "Wrong. This is not the best option. 'Any' usually refers to a plural quantity."]
        ]
    },
        7: {
        type : "radio",
        question : "Choose the best option.",
        answers : [
            ["I have a lot of friends.", true, "Correct! This is the best option. English differs from French in this type of construction."],
            ["I have a lot of friend.", false, "Wrong. This is not the best option. 'A lot of' usually refers to a plural quantity."]
        ]
    },
        8: {
        type : "radio",
        question : "Choose the best option.",
        answers : [
            ["No, I don't have any more question.", false, "Wrong. This is not the best option. 'Any more' usually refers to a plural quantity."],
            ["No, I don't have any more questions.", true, "Correct! This is the best option. 'Any more' usually refers to a plural quantity."]
        ]
    },
        9: {
        type : "radio",
        question : "What should you do when the word you want to use in plural form ends in -ss, -x, -z, -ch, or -sh (mass, fox, quiz, church, splash)?",
        answers : [
            ["Nothing. These words have a plural form identical to the singular form.", false, "Wrong. These words have a plural form that ends in -es."],
            ["Just pronounce -s at the end of the word.", false, "Wrong. You need to say -es (/iz/) at the end of the word."],
            ["Pronounce -es (/iz/) at the end of the word.", true, "Correct! You need to say -es (/iz/) at the end of the word." ]
        ]
    },
    10: {
        type : "checkbox",
        question : "When do you have to be especially careful to pronounce the plural 's' in English?",
        answers : [
            ["When the word ends in -s, -x, -z, -se, -ge, -ce, -ch, or -sh.", true, "Correct! You need to be careful with words like 'bus', 'fox', 'quiz', 'house', 'page', 'face', 'church', and 'splash'."],
            ["When you make negative sentences with 'any'.", true, "Correct! You need to be careful with negative sentences with 'any', such as 'I don't have any questions'."],
            ["Always.", true, "Correct! If your native language is French, you should always be careful to pronounce the plural 's' in English."]
        ]
    },
    },
    // NEEDS A FEW MORE QUESTION  --  0111 Wild plural s
    "0111": {
    1: {
        type : "radio",
        question : "What is error 0111 about?",
        answers : [
            ["It's about not pronouncing the plural 's'.", false, "Wrong. This error is not about forgetting to pronounce the plural 's'. "],
            ["It's about adding a plural 's' when it's not needed.", true, "Correct! This error is about adding a plural 's' when it's not needed."],
        ]
    },
    2: {
        type : "radio",
        question : "How can I avoid making error 0111?",
        answers : [
            ["By being more focused and careful about -s endings in general.", true, "Correct! Being more focused and careful about -s endings in general can help you avoid making error 0111."],  
            ["By not caring at all about -s endings.", false, "Wrong. Not caring about -s endings can actually increase the chances of making error 0111."],
        ]
    },
    3: {
        type : "checkbox",
        question : "Which of these are examples of error 0111?",
        answers : [
            ["I have a cats,", true, "Correct! This is an example of error 0111. The plural 's' is not needed here."],
            ["I have a lot of friend.", false, "Wrong. This is not an example of error 0111."],
        ]
    },
},


    // 0120 Irregular plurals
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
            answers: ["phenomena", "criteria", "bacteria", "media", "data", "automata", "stigmata"]
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
    // 0125 Singular nouns ending in -s
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
                ["False", false, "Incorrect. 'A means' == 'un moyen'" ]
            ]
        }
    },

    // 0130 PLural nouns
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
                ["'the stairs are dangerous'", true, "Yes! A plural noun should be in plural conjugation ('are')"],
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
        },
        11: {
            type : "radio",
            question : "True or false: Plurals nouns such as 'scissors' and 'pants' should never be used with a plural verb such as 'are' and 'were'.",
            answers : [
                ["True", false, "Incorrect. Plural nouns like 'scissors' and 'pants' always take a plural verb."],
                ["False", true, "Correct! Plural nouns like 'scissors' and 'pants' always take a plural verb." ]
            ]
        },
        12: {
            type : "radio",
            question : "True or false: Plural nouns such as 'scissors' and 'pants' should never be used with the indefinite article 'a' or 'an'.",
            answers : [
                ["True", true, "Correct! Plural nouns like 'scissors' and 'pants' cannot be used with the indefinite article 'a' or 'an', which implies singularity."],
                ["False", false, "Wrong. Plural nouns like 'scissors' and 'pants' cannot be used with the indefinite article 'a' or 'an', which implies singularity." ]
            ]
        },
     },

    // 0140 Plurals inside compound nouns
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

    // 0141 Not using compound nouns
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
            type : "checkbox",
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
        },
        11: {
            type : "radio",
            question: "What is a compound noun?",
            answers : [
                ["A noun made up of two or more words that function as a single noun.", true, "Correct! A compound noun is made up of two or more words that function as a single noun, for example 'toothpaste', 'computer screen' or 'mother-in-law'."],
                ["A noun that is always plural.", false, "Wrong. A compound noun can be singular or plural. Example: 'computer screen' (singular) vs 'computer screens' (plural)."],
                ["A noun that cannot be modified by adjectives.", false, "Wrong. A compound noun can be modified by adjectives. Example: 'an expensive computer screen." ]
            ]
        },
        12: {
            type : "checkbox",
            question : "Which of these is an example of a compound noun?",
            answers : [
                ["Concert hall", true, "Correct! 'Concert hall' is a compound noun made up of 'concert' and 'hall'."],
                ["The big dog", false, "Wrong. 'Dog' is a simple noun modified by an adjective and specified by the article."],
                ["Consolidation", false, "Wrong. 'Consolidation' is just a long simple noun." ],
                ["Hot dog bun", true, "Correct! 'Hot dog bun' is a compound noun made up of 'hot', 'dog' and 'bun'."],
                ["The soft hot dog bun", false, "Wrong. 'Hot' and 'soft' are adjectives modifying the compound noun 'hot dog bun'." ]
            ]
    },
    },

    // 0151 Treating uncountable nouns as single units
    "0151" : {
        1: {
            type : "checkbox",
            question : "Which of these words are uncountable nouns?",
            answers : [
                ["Book", false, "Wrong. 'Book' is a countable noun. You can say 'a book' or 'two books'."],
                ["Information", true, "Correct! 'Information' is an uncountable noun. You cannot say 'an information' or 'two informations'."],
                ["Advice", true,"Correct! 'Advice' is an uncountable noun. You cannot say 'an advice' or 'two advices'." ],
                ["Microphone", false, "Wrong. 'Microphone' is a countable noun. You can say 'a microphone' or 'two microphones'." ],
                ["Furniture", true, "Correct! 'Furniture' is an uncountable noun. You cannot say 'a furniture' or 'two furnitures'." ],
                ["News", true, "Correct! 'News' is an uncountable noun (>> 'l'actualité'). You cannot say 'a news' or 'two news'." ],
                ["Water", true, "Correct! 'Water' is an uncountable noun. You cannot say 'a water' or 'two waters'." ],
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
                ["True", false, "Wrong. 'Each' and 'every' cannot be used with uncountable nouns such as 'information' and 'advice', because they imply that the noun is a single unit."],
                ["False", true, "Correct. 'Each' and 'every' cannot be used with uncountable nouns such as 'information' and 'advice', because they imply that the noun is a single unit." ]
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
        6: {
            type : "radio",
            question : "Can we say 'that's an expensive furniture'?",
            answers : [
                ["True", false, "Wrong. 'Furniture' is an uncountable noun and cannot be treated as a single unit."],
                ["False", true, "Correct. 'Furniture' is an uncountable noun and cannot be treated as a single unit." ]
            ]
        },
        7: {
            type : "radio",
            question : "Can we say 'that's a heavy luggage'?",
            answers : [
                ["True", false, "Wrong. 'Luggage' is an uncountable noun and cannot be treated as a single unit."],
                ["False", true, "Correct. 'Luggage' is an uncountable noun and cannot be treated as a single unit." ]
            ]
        },
        8: {
            type : "radio",
            question : "Can we say 'I made a long travel'?",
            answers : [
                ["True", false, "Wrong. 'Travel' is an uncountable noun and cannot be treated as a single unit. You can say 'I made a long trip' or 'I made a long journey'."],
                ["False", true, "Correct. 'Travel' is an uncountable noun and cannot be treated as a single unit. You can say 'I made a long trip' or 'I made a long journey'." ]
            ]
        },
        9: {
            type : "text_multi",
            question : "If we want to say 'one unit' of 'information', what other word can we say instead of 'information'?",
            answers : ["a piece of information", "a fact", "a bit of information", "fact", "piece of information", "bit of information"]
        },        
        10: {
            type : "text_multi",
            question : "If we want to say 'one unit' of 'advice', what other word can we say instead of 'advice'?",
            answers : ["a piece of advice", "a tip", "some advice", "a bit of advice", "a suggestion", "piece of advice", "bit of advice", "tip", "suggestion"],
        },
        12: {
            type : "text_multi",
            question : "If we want to say 'one unit' of 'news', what can we say instead of 'a news'?",
            answers : ["a piece of news", "a news item", "a news story", "a news report"]
            },
        13: {   
            type : "text_multi",
            question : "If we want to say 'one unit' of 'luggage', what other word can we say instead of 'luggage'?",
            answers : ["a piece of luggage", "a luggage item", "a suitcase", "a travel bag", "some luggage", "suitcase", "travel bag", "piece of luggage"]
         },
        14: {
            type : "text_multi",
            question : "If we want to say 'one unit' of 'travel', what other word can we say instead of 'travel'?",
            answers : ["a trip", "a journey", "trip", "journey"]
            },
        15: {
            type : "text_multi",
            question : "If we want to say 'one unit' of 'software', what other word can we say instead of 'software'?",
            answers : ["a piece of software", "an application", "a program", "application", "program", "piece of software"],
            },
        16: {
            type: "checkbox",
            question: "Why is it wrong to say 'I have a lot of job'? Check all that apply.",
            answers: [
                ["Because 'job' refers to a position of employment, which is a countable noun. You can say 'I have a job' or 'I have a lot of jobs'.", true, "Correct! 'Job' is a countable noun. You can say 'I have a job' or 'I have a lot of jobs'."],
                ["Because there is no difference in the way 'job' and 'work' are used in English.", false, "Wrong. 'Job' and 'work' are different words with different meanings and grammatical properties."],
                ["Because 'work' is an uncountable noun that refers to the activity of doing a job.", true, "Correct! 'Work' is an uncountable noun that refers to the activity of doing a job."]
            ]
        },
        17: {
            type: "radio",
            question: "What is better?",
            answers: [
                ["There is a furniture", false, "Wrong. 'Furniture' is an uncountable noun and cannot be treated as a single unit."],
                ["There is furniture", true, "Correct! 'Furniture' is an uncountable noun and should not be treated as a single unit (no article is used)."  ]
            ]
         },         18: {
            type: "radio",
            question: "What is better?",
            answers: [
                ["I have information for you.", true, "Correct! 'Information' is an uncountable noun and should not be treated as a single unit (no article is used)."  ],
                ["I have an information for you.", false, "Wrong. 'Information' is an uncountable noun and cannot be treated as a single unit."],
            ]
        },
    },

// 0152 Using uncountable nouns in plural form or with plural verbs
"0152": {
    1: {
        type: "checkbox",
        question: "Which of these sentences use uncountable nouns correctly?",
        answers: [
            ["The furnitures are very modern.", false, "Wrong. 'Furniture' is uncountable and cannot take an 's' or a plural verb."],
            ["The furniture is very modern.", true, "Correct! Uncountable nouns always take a singular verb and no 's'."],
            ["I need some advices.", false, "Wrong. 'Advice' cannot be pluralized with an 's'."],
            ["I need some advice.", true, "Correct! Even when referring to multiple suggestions, 'advice' remains singular."],
            ["The news is good.", true, "Correct! Although 'news' ends in 's', it is uncountable and takes a singular verb."]
        ]
    },
    2: {
        type: "radio",
        question: "Is it correct to say 'The informations you sent are helpful'?",
        answers: [
            ["True", false, "Wrong. 'Information' is uncountable. It should be 'The information you sent IS helpful'."],
            ["False", true, "Correct. 'Information' never takes an 's' and always takes a singular verb."]
        ]
    },
    3: {
        type: "radio",
        question: "Which verb form is correct for uncountable nouns?",
        answers: [
            ["Singular (e.g., 'is', 'has', 'was')", true, "Correct! Uncountable nouns are always treated as singular for conjugation purposes."],
            ["Plural (e.g., 'are', 'have', 'were')", false, "Wrong. Plural verbs are for countable nouns. Uncountable nouns require singular verbs."]
        ]
    },
    4: {
        type: "checkbox",
        question: "Identify the grammatically incorrect (WRONG) sentences:",
        answers: [
            ["Your luggages are at the reception.", true, "Incorrect. It should be 'Your luggage is...'"],
            ["Research takes a long time.", false, "Correct. 'Research' is uncountable and 'takes' is the singular verb form."],
            ["Many progresses were made this year.", true, "Incorrect. 'Progress' is uncountable. It should be 'Much progress was made...'"],
            ["The weather was beautiful.", false, "Correct. 'Weather' is uncountable and takes the singular 'was'."]
        ]
    },
    5: {
        type: "radio",
        question: "What is the correct way to talk about multiple items of 'equipment'?",
        answers: [
            ["The equipments are ready.", false, "Wrong. You cannot add 's' to equipment."],
            ["The equipment is ready.", true, "Correct! 'Equipment' remains singular even if there are many machines."]
        ]
    },
    6: {
        type: "text_multi",
        question: "Correct this sentence: 'The homeworks were difficult.'",
        answers: ["The homework was difficult", "homework was difficult", "was", "was difficult", "was, not were", "was not were", "was instead of were"]
    },
    7: {
        type: "radio",
        question: "Fill in the blank: 'No ______ is good ______.'",
        answers: [
            ["news / news", true, "Correct! 'News' looks plural but is an uncountable singular noun."],
            ["new / news", false, "Wrong. The fixed expression uses 'news' (uncountable) for both."],
            ["news / newses", false, "Wrong. 'News' cannot be pluralized further into 'newses'."]
        ]
    },
    8: {
        type: "radio",
        question: "Can we say 'The softwares are being updated'?",
        answers: [
            ["True", false, "Wrong. 'Software' is uncountable. It should be 'The software is being updated'."],
            ["False", true, "Correct. 'Software' is uncountable and cannot be used in the plural form."]
        ]
    },
    9: {
        type: "radio",
        question: "The form 'informations' is impossible in English.",
        answers: [
            ["True", true, "Correct! 'Information' is uncountable and cannot take an 's'."],
            ["False", false, "Wrong. 'Information' is uncountable and cannot take an 's'." ]
        ]
    },
    10: {
        type: "checkbox",
        question: "Which of the following nouns NEVER take an 's' in standard English? (Check all that apply)",
        answers: [
            ["Furniture", true, "Correct! 'Furniture' is uncountable."],
            ["Job", false, "Wrong. 'Job' is countable; you can have many 'jobs'."],
            ["Knowledge", true, "Correct! 'Knowledge' is uncountable."],
            ["Luggage", true, "Correct! 'Luggage' is uncountable."],
            ["Idea", false, "Wrong. 'Idea' is countable; you can have many 'ideas'."]
        ]
    },
        11: {
            type: "radio",
            question: "Which of these sentences is correct?",
            answers: [
                ["The furniture is expensive.", true, "Correct! 'Furniture' is uncountable and takes a singular verb."],
                ["The furnitures are expensive.", false, "Wrong. 'Furniture' is uncountable and cannot be pluralized."]
            ]
        },
        12: {
            type: "radio",
            question: "Why are words like 'information', 'advice' and 'furniture' never used in plural form?",
            answers: [
                ["Because they represent concepts or masses that cannot be counted as multiple units.", true, "Correct! Uncountable nouns represent concepts or masses that cannot be counted as individual units."],
                ["Because they are always used in formal writing.", false, "Wrong. Uncountable nouns can be used in both formal and informal contexts."],
                ["Because they are always used in singular form for stylistic reasons.", false, "Wrong. The singular form of uncountable nouns is a grammatical requirement, not just a stylistic choice." ]
            ]
        },
        13: {
            type: "radio",
            question: "Is this sentence correct?: 'A lot of stuff were stolen from the house.'",
            answers: [
                ["True", false, "Wrong. 'Stuff' is uncountable and takes a singular verb. It should be 'A lot of stuff was stolen from the house.'"],
                ["False", true, "Correct! 'Stuff' is uncountable and takes a singular verb: was."]
            ]
        },
        14: {
            type: "radio",
            question: "Is this sentence correct?: 'You have a lot of stuffs in your room.'",
            answers: [
                ["True", false, "Wrong. 'Stuff' is uncountable and cannot be pluralized. It should be 'You have a lot of stuff in your room.'"],
                ["False", true, "Correct! 'Stuff' is uncountable and cannot be pluralized."]
            ]
        },
        15: {
            type: "radio",
            question: "Some words are countable in French/German but uncountable in English. Is this true?",
            answers: [
                ["True", true, "Correct! 'Information' and 'Advice' are examples of words that are countable in other languages but uncountable in English."],
                ["False", false, "Wrong. 'Information' and 'Advice' are countable in other languages but uncountable in English."]
            ]
        },
        16: {
            type: "radio",
            question: "Which French translation is grammatically similar to 'all the furniture'?",
            answers: [
                ["tout le mobilier", true, "Correct! 'Mobilier' is an uncountable noun in French, just like 'furniture' in English."],
                ["toutes les meubles", false, "Wrong. 'Meuble' is a countable noun in French, while 'furniture' is uncountable in English."],
            ]
        },
        17: {
            type: "radio",
            question: "Which French translation is grammatically similar to 'all the news'?",
            answers: [
                ["toutes les nouvelles", false, "Wrong. 'Nouvelles' is a countable noun in French, while 'news' is uncountable in English."],
                ["toute l'actualité", true, "Correct! 'Actualité' is an uncountable noun in French, just like 'news' in English."],
            ]
        },
        18: {
            type: "radio",
            question: "What is an acceptable translation for 'bonnes connaissances d'allemand' in English?",
            answers: [
                ["good knowledges of German", false, "Wrong. 'Knowledge' is uncountable in English and similar to 'le savoir' in French."],
                ["good knowledge of German", true, "Correct! 'Knowledge' is uncountable in English and should be used in the singular form."],
            ]
        },
    },

    // 0153 Using uncountable nouns with counting quantifiers (many, several, etc.)
"0153": {
    1: {
        type: "radio",
        question: "Which quantifier is WRONG to use with the word 'information'?",
        answers: [
            ["Much", false, "Correct usage. 'Much' is used with uncountable nouns."],
            ["Many", true, "Correct! 'Many' is for countable units. You cannot say 'many informations'."],
            ["Some", false, "Correct usage. 'Some' can be used with both countable and uncountable nouns."]
        ]
    },
    2: {
        type: "radio",
        question: "Can we say 'I have several advices for you'?",
        answers: [
            ["True", false, "Wrong. 'Several' implies a specific count of units, which is incompatible with the uncountable noun 'advice'."],
            ["False", true, "Correct! You should say 'I have some advice' or 'several pieces of advice'."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these quantifiers are incompatible with uncountable nouns like 'furniture' or 'equipment'?",
        answers: [
            ["Several", true, "Correct! 'Several' is only for countable items."],
            ["A lot of", false, "Wrong. 'A lot of' works for both countable and uncountable."],
            ["Many", true, "Correct! 'Many' is only for countable items."],
            ["Few / A few", true, "Correct! 'Few' is for counting units. Use 'little' or 'a little' for uncountable."]
        ]
    },
    4: {
        type: "radio",
        question: "What is the correct way to express a large amount of 'work'?",
        answers: [
            ["I have many works to do.", false, "Wrong. 'Work' is uncountable; 'many' and the plural 's' are incorrect."],
            ["I have much work to do.", true, "Correct! 'Much' is the appropriate quantifier for uncountable nouns in formal contexts."]
        ]
    },
    5: {
        type: "radio",
        question: "Is 'a few luggage' grammatically correct?",
        answers: [
            ["True", false, "Wrong. 'A few' is for countable items. Use 'a few bags' or 'a little luggage'."],
            ["False", true, "Correct! 'Luggage' is uncountable and cannot be used with 'a few'."]
        ]
    },
    6: {
        type: "text_multi",
        question: "Instead of saying 'many researches', what is a correct way to say it using 'research'?",
        answers: ["much research", "a lot of research", "a great deal of research", "some research"]
    },
    7: {
        type: "radio",
        question: "Which sentence is correct?",
        answers: [
            ["There are several news today.", false, "Wrong. 'News' is uncountable; 'several' and 'are' are incorrect."],
            ["There is some news today.", true, "Correct! 'News' is uncountable and pairs with 'some' and 'is'."]
        ]
    },
    8: {
        type: "radio",
        question: "Can we use 'a large number of' with the word 'machinery'?",
        answers: [
            ["True", false, "Wrong. 'A large number of' is for countable nouns. Use 'a large amount of machinery'."],
            ["False", true, "Correct! 'Machinery' is uncountable."]
        ]
    },
    9: {
        type: "checkbox",
        question: "Choose the correct sentences:",
        answers: [
            ["He gave me many tips.", true, "Correct! 'Tips' is countable, so 'many' is fine."],
            ["He gave me many advice.", false, "Wrong. 'Advice' is uncountable and cannot be used with 'many'."],
            ["He gave me a lot of advice.", true, "Correct! 'A lot of' works perfectly here."]
        ]
    },
    10: {
        type: "radio",
        question: "If 'many' is for countable, which word is the uncountable equivalent?",
        answers: [
            ["Several", false, "Wrong. 'Several' is also for countable."],
            ["Much", true, "Correct! 'Much' is the uncountable counterpart to 'many'."],
            ["A few", false, "Wrong. 'A few' is for countable."]
        ]
    },
    11: {
        type: "radio",
        question: "Can we say 'We need several softwares'?",
        answers: [
            ["True", false, "Wrong. 'Software' is uncountable. Use 'several programs' or 'a lot of software'."],
            ["False", true, "Correct! 'Software' cannot be counted with 'several'."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct the quantifier: 'How many progress have you made?'",
        answers: ["How much progress", "much progress"]
    },
    13: {
        type: "radio",
        question: "Which is better for a negative sentence?",
        answers: [
            ["I don't have many money.", false, "Wrong. 'Money' is uncountable."],
            ["I don't have much money.", true, "Correct! 'Much' is the standard quantifier for uncountable nouns in negatives."]
        ]
    },
    14: {
        type: "radio",
        question: "Is 'several travels' correct?",
        answers: [
            ["True", false, "Wrong. 'Travel' is uncountable. Use 'several trips' or 'a lot of travel'."],
            ["False", true, "Correct! 'Travel' (the general noun) is uncountable."]
        ]
    },
    15: {
        type: "checkbox",
        question: "Which of these pairs are INCORRECT?",
        answers: [
            ["Several furnitures", true, "Incorrect. Uncountable nouns don't take 'several' or 's'."],
            ["Many information", true, "Incorrect. 'Information' is uncountable."],
            ["A few facts", false, "Correct. 'Fact' is countable."],
            ["Several luggage", true, "Incorrect. 'Luggage' is uncountable."]
        ]
    },
    16: {
        type: "radio",
        question: "Complete the sentence: 'The chef used ______ salt.'",
        answers: [
            ["many", false, "Wrong. Salt is uncountable."],
            ["several", false, "Wrong. Several is for countable units."],
            ["too much", true, "Correct! 'Much' is used for uncountable quantities."]
        ]
    },
    17: {
        type: "text_multi",
        question: "Change 'many musics' to a correct uncountable form:",
        answers: ["much music", "a lot of music", "some music"]
    },
    18: {
        type: "radio",
        question: "Can 'a few' be used with 'knowledge'?",
        answers: [
            ["True", false, "Wrong. 'Knowledge' is uncountable. Use 'a little knowledge'."],
            ["False", true, "Correct! 'A few' is strictly for countable items."]
        ]
    },
    19: {
        type: "radio",
        question: "What is the error in 'There were several chaos in the street'?",
        answers: [
            ["Chaos is countable.", false, "Wrong."],
            ["'Several' cannot be used with 'chaos' because chaos is uncountable.", true, "Correct! You should say 'There was a lot of chaos'."]
        ]
    },
    20: {
        type: "checkbox",
        question: "Which quantifiers can be used with BOTH countable and uncountable nouns?",
        answers: [
            ["Some", true, "Correct! 'Some books' and 'some water'."],
            ["Any", true, "Correct! 'Any books' and 'any water'."],
            ["A lot of", true, "Correct! 'A lot of books' and 'a lot of water'."],
            ["Many", false, "Wrong. Only for countable."],
            ["Much", false, "Wrong. Only for uncountable."]
        ]
    }
},

// 0161 Incorrect form of the indefinite article (a vs an)
"0161": {
    1: {
        type: "radio",
        question: "What determines whether we use 'a' or 'an' before a word?",
        answers: [
            ["The first letter of the word.", false, "Wrong. It is the sound of the first letter that matters, not the spelling."],
            ["The sound of the first letter of the word.", true, "Correct! We use 'an' before a vowel sound and 'a' before a consonant sound."]
        ]
    },
    2: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["A apple", false, "Wrong. 'Apple' starts with a vowel sound, so it should be 'an apple'."],
            ["An orange", true, "Correct! 'Orange' starts with a vowel sound."],
            ["A banana", true, "Correct! 'Banana' starts with a consonant sound."],
            ["An pear", false, "Wrong. 'Pear' starts with a consonant sound, so it should be 'a pear'."]
        ]
    },
    3: {
        type: "radio",
        question: "Why do we say 'a university' instead of 'an university'?",
        answers: [
            ["Because 'u' is always a consonant in English.", false, "Wrong. 'U' is a vowel, but in this word, it sounds like the consonant 'y'."],
            ["Because 'university' starts with a 'y' sound (like 'you'), which is a consonant sound.", true, "Correct! Even though it starts with the letter 'u', the sound is a consonant 'y' sound."]
        ]
    },
    4: {
        type: "radio",
        question: "Which is the correct way to talk about a mythical creature?",
        answers: [
            ["I saw an unicorn.", false, "Wrong. 'Unicorn' starts with a 'y' sound (yu-nicorn), so it requires 'a'."],
            ["I saw a unicorn.", true, "Correct! The 'u' in unicorn is pronounced as a consonant 'y' sound."]
        ]
    },
    5: {
        type: "radio",
        question: "What is the correct article for the word 'hour'?",
        answers: [
            ["A hour", false, "Wrong. The 'h' is silent, so the word starts with a vowel sound."],
            ["An hour", true, "Correct! Because the 'h' is silent, we hear the vowel sound 'ou', so we use 'an'."]
        ]
    },
    6: {
        type: "checkbox",
        question: "Which of these 'u' words correctly use 'a' because they start with a 'y' sound?",
        answers: [
            ["A unit", true, "Correct! 'Unit' sounds like 'yu-nit'."],
            ["A umbrella", false, "Wrong. 'Umbrella' starts with a vowel sound (uh-mbrella), so it needs 'an'."],
            ["A user", true, "Correct! 'User' sounds like 'yu-zer'."],
            ["A utensil", true, "Correct! 'Utensil' sounds like 'yu-tensil'."]
        ]
    },
    7: {
        type: "radio",
        question: "Choose the correct sentence:",
        answers: [
            ["It was an unusual event.", true, "Correct! 'Unusual' starts with a vowel sound (uh), so 'an' is used."],
            ["It was a unusual event.", false, "Wrong. 'Unusual' starts with a vowel sound and requires 'an'."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Complete the phrase: 'He is ____ honest man.'",
        answers: ["an", "an honest", "an honest man"]
    },
    9: {
        type: "radio",
        question: "Which is correct for the word 'European'?",
        answers: [
            ["An European country", false, "Wrong. 'European' starts with a 'y' sound, so it takes 'a'."],
            ["A European country", true, "Correct! The sound at the start is a consonant 'y'."]
        ]
    },
    10: {
        type: "radio",
        question: "Fill in the blank: 'I need ____ map and ____ umbrella.'",
        answers: [
            ["a / an", true, "Correct! 'Map' starts with a consonant sound, 'umbrella' starts with a vowel sound."],
            ["an / a", false, "Wrong. This is the opposite of the correct rule."],
            ["a / a", false, "Wrong. 'Umbrella' requires 'an'."]
        ]
    },
    11: {
        type: "checkbox",
        question: "Identify the INCORRECT pairs:",
        answers: [
            ["An horse", true, "Incorrect. 'Horse' has a voiced 'h', so it should be 'a horse'."],
            ["A egg", true, "Incorrect. 'Egg' starts with a vowel sound, so it should be 'an egg'."],
            ["An MP3 player", false, "Correct. The letter 'M' is pronounced 'em', which starts with a vowel sound."],
            ["A FBI agent", true, "Incorrect. The letter 'F' is pronounced 'ef', so it should be 'an FBI agent'."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Write the correct article for 'one-way street':",
        answers: ["a", "a one-way street"]
    }
},

// 0162 Incorrect use of 'an' before a voiced 'h' (Liaison with H)
"0162": {
    1: {
        type: "radio",
        question: "In English, is the letter 'h' usually a silent letter or a voiced consonant?",
        answers: [
            ["Silent (no breath is used).", false, "Wrong. In most English words like 'house' and 'hotel', the 'h' is voiced with an exhaled breath."],
            ["Voiced (you must exhale when saying it).", true, "Correct! Because you exhale, it acts as a consonant, so we use 'a' instead of 'an'."]
        ]
    },
    2: {
        type: "checkbox",
        question: "Which of these common 'h' words correctly use 'a'?",
        answers: [
            ["A hotel", true, "Correct! The 'h' is voiced, so 'an hotel' is incorrect."],
            ["A history book", true, "Correct! 'History' starts with a voiced consonant sound."],
            ["A home", true, "Correct! 'Home' starts with a voiced consonant sound."],
            ["An hammer", false, "Wrong. 'Hammer' has a voiced 'h', so it should be 'a hammer'."]
        ]
    },
    3: {
        type: "radio",
        question: "Which of the following is the correct way to talk about a place to stay?",
        answers: [
            ["I booked an hotel for the weekend.", false, "Wrong. 'Hotel' starts with a voiced 'h', so you should use 'a'."],
            ["I booked a hotel for the weekend.", true, "Correct! 'A hotel' is the standard modern English usage."]
        ]
    },
    4: {
        type: "radio",
        question: "Is 'an hospital' grammatically correct?",
        answers: [
            ["True", false, "Wrong. The 'h' in hospital is voiced, so it requires 'a'."],
            ["False", true, "Correct! You should say 'a hospital'."]
        ]
    },
    5: {
        type: "checkbox",
        question: "Identify the INCORRECT phrases:",
        answers: [
            ["An holiday", true, "Incorrect. 'Holiday' has a voiced 'h'; use 'a'."],
            ["An horse", true, "Incorrect. 'Horse' has a voiced 'h'; use 'a'."],
            ["A human", false, "Correct. 'Human' starts with a voiced consonant sound."],
            ["An headache", true, "Incorrect. 'Headache' starts with a voiced 'h'; use 'a'."]
        ]
    },
    6: {
        type: "radio",
        question: "Why is 'an historic event' sometimes heard, even if 'a historic event' is the modern rule?",
        answers: [
            ["Because 'historic' is an exception and must always use 'an'.", false, "Wrong."],
            ["It is an older style, but in modern English, 'a' is preferred because the 'h' is voiced.", true, "Correct! While you might see 'an' in old books, 'a historic' is the standard recommendation today."]
        ]
    },
    7: {
        type: "text_multi",
        question: "Correct this sentence: 'It was an hard test.'",
        answers: ["It was a hard test", "a hard test"]
    },
    8: {
        type: "radio",
        question: "Fill in the blank: 'That is ____ huge mistake.'",
        answers: [
            ["a", true, "Correct! 'Huge' starts with a voiced 'h'."],
            ["an", false, "Wrong. 'Huge' starts with a consonant sound."]
        ]
    },
    9: {
        type: "radio",
        question: "Which of these is correct for a common hobby?",
        answers: [
            ["A hike in the mountains.", true, "Correct! 'Hike' starts with a voiced 'h'."],
            ["An hike in the mountains.", false, "Wrong. 'Hike' requires 'a'."]
        ]
    },
    10: {
        type: "text_multi",
        question: "Write the correct article for the word 'helicopter':",
        answers: ["a", "a helicopter"]
    }
},
// 0163 Overuse of the definite article 'the' (General vs Specific)
"0163": {
    1: {
        type: "radio",
        question: "When should you avoid using 'the' before a noun?",
        answers: [
            ["When referring to a specific item already mentioned.", false, "Wrong. That is exactly when you SHOULD use 'the'."],
            ["When talking about a concept, substance, or group in general.", true, "Correct! General statements usually do not require 'the'."]
        ]
    },
    2: {
        type: "checkbox",
        question: "Which of these sentences are correct for a general statement?",
        answers: [
            ["The love is all you need.", false, "Wrong. 'Love' is an abstract concept; you should say 'Love is all you need'."],
            ["Dogs are loyal animals.", true, "Correct! We don't use 'the' when talking about dogs in general."],
            ["The water is necessary for life.", false, "Wrong. In a general scientific sense, we just say 'Water is necessary...'."],
            ["Technology is changing the world.", true, "Correct! 'Technology' is used here as a general concept."]
        ]
    },
    3: {
        type: "radio",
        question: "What is the difference between 'I like cheese' and 'I like the cheese'?",
        answers: [
            ["There is no difference.", false, "Wrong. They have very different meanings."],
            ["'I like cheese' is general; 'I like the cheese' refers to a specific cheese (e.g., the one on this plate).", true, "Correct! 'The' specifies a particular instance."]
        ]
    },
    4: {
        type: "radio",
        question: "Is it correct to say 'The happiness is important'?",
        answers: [
            ["True", false, "Wrong. Happiness is an abstract noun used generally here. It should be 'Happiness is important'."],
            ["False", true, "Correct! Abstract nouns like happiness, peace, or time do not take 'the' when used generally."]
        ]
    },
    5: {
        type: "checkbox",
        question: "Identify the sentences that INCORRECTLY use 'the':",
        answers: [
            ["The breakfast is the most important meal.", true, "Incorrect. We usually say 'Breakfast is...' when speaking generally."],
            ["I'm going to the bank.", false, "Correct. This refers to a specific, known institution."],
            ["The corruption is a problem in many countries.", true, "Incorrect. As a general concept, it should be 'Corruption is...'."],
            ["The nature is beautiful.", true, "Incorrect. Usually, we just say 'Nature is beautiful'."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: '_______ is a strong metal.'",
        answers: [
            ["The steel", false, "Wrong. This is a general statement about the material."],
            ["Steel", true, "Correct! General substances do not take an article."]
        ]
    },
    7: {
        type: "radio",
        question: "When is it CORRECT to use 'the' with a word like 'moon' or 'sun'?",
        answers: [
            ["Only if you have mentioned them before.", false, "Wrong."],
            ["Always, because there is only one and it is known by everyone.", true, "Correct! Unique entities known by all require 'the'."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct this sentence: 'The English is a difficult language.'",
        answers: ["English is a difficult language", "English is difficult"]
    },
    9: {
        type: "radio",
        question: "Which sounds more natural for a general observation?",
        answers: [
            ["The children like to play.", false, "Wrong. This sounds like you are talking about a specific group of kids."],
            ["Children like to play.", true, "Correct! This refers to children in general."]
        ]
    },
    10: {
        type: "radio",
        question: "Can we say 'The life is short'?",
        answers: [
            ["True", false, "Wrong. In a general philosophical sense, we say 'Life is short'."],
            ["False", true, "Correct! 'Life' as a general concept does not take 'the'."]
        ]
    },
    11: {
        type: "checkbox",
        question: "Which of these categories usually do NOT take 'the' when used generally?",
        answers: [
            ["Languages (e.g., French, Japanese)", true, "Correct!"],
            ["Academic subjects (e.g., History, Math)", true, "Correct!"],
            ["Specific rivers (e.g., Nile, Thames)", false, "Wrong. Rivers actually DO take 'the'."],
            ["Sports (e.g., Football, Tennis)", true, "Correct!"]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix the error: 'The People are often afraid of change.'",
        answers: ["People are often afraid of change", "People are often afraid"]
    }
},
// 0164 Incorrect use of the definite article 'the' with a country name
"0164": {
    1: {
        type: "radio",
        question: "As a general rule, do we use 'the' before most country names like 'France' or 'Japan'?",
        answers: [
            ["Yes, countries always need an article.", false, "Wrong. Most countries are proper nouns that do not take 'the'."],
            ["No, most country names are used without 'the'.", true, "Correct! We say 'I live in France,' not 'the France'."]
        ]
    },
    2: {
        type: "checkbox",
        question: "Which of these country names correctly use 'the'?",
        answers: [
            ["The Netherlands", true, "Correct! Because it is a plural name."],
            ["The Philippines", true, "Correct! Because it is a plural name."],
            ["The Italy", false, "Wrong. 'Italy' is a singular name and does not take 'the'."],
            ["The United Arab Emirates", true, "Correct! Names with 'United' or plural 'Emirates' require 'the'."]
        ]
    },
    3: {
        type: "radio",
        question: "Which is the correct way to refer to the USA?",
        answers: [
            ["I am visiting United States.", false, "Wrong. Because 'States' is plural, it must be 'the United States'."],
            ["I am visiting the United States.", true, "Correct! We use 'the' with plural country names like 'the United States'."]
        ]
    },
    4: {
        type: "radio",
        question: "Is it correct to say 'The Switzerland is beautiful'?",
        answers: [
            ["True", false, "Wrong. Switzerland is a singular country name and should not have 'the'."],
            ["False", true, "Correct! You should say 'Switzerland is beautiful'."]
        ]
    },
    5: {
        type: "checkbox",
        question: "Identify the INCORRECT sentences:",
        answers: [
            ["He is from the Spain.", true, "Incorrect. It should be 'from Spain'."],
            ["She lives in the United Kingdom.", false, "Correct. Countries with 'Kingdom' require 'the'."],
            ["The Brazil is the largest country in South America.", true, "Incorrect. It should be 'Brazil is...'."],
            ["They moved to the Czech Republic.", false, "Correct. Countries with 'Republic' require 'the'."]
        ]
    },
    6: {
        type: "radio",
        question: "What is the rule for countries that include words like 'Kingdom', 'Republic', or 'Union'?",
        answers: [
            ["They do not use 'the'.", false, "Wrong."],
            ["They always use 'the' (e.g., the Dominican Republic).", true, "Correct! Titles describing the political structure of a country require 'the'."]
        ]
    },
    7: {
        type: "radio",
        question: "What is the rule for using 'the' with country names?",
        answers: [
            ["Never use 'the' with any country name.", false, "Wrong. There are exceptions."],
            ["Always use 'the' with any country name.", false, "Wrong. Most country names do not take 'the'."],
            ["Use 'the' only with plural country names ('the Netherlands') and those with political words such as 'Kingdom' or 'Republic' (like 'the United Kingdom').", true, "Correct! Plural names (like 'the Netherlands') and those with titles (like 'the United Kingdom') require 'the'."]
        ]
    },
    8: {
        type: "radio",
        question: "Fill in the blank: 'We are traveling across _______'.",
        answers: [
            ["the Canada", false, "Wrong. Canada is singular."],
            ["Canada", true, "Correct! No article is needed for Canada."]
        ]
    },
    9: {
        type: "radio",
        question: "Which of these is correct for the country of the Maldives?",
        answers: [
            ["The Maldives are islands.", true, "Correct! Because it is a plural name (islands), it takes 'the'."],
            ["Maldives are islands.", false, "Wrong. Plural island-group countries require 'the'."]
        ]
    },
    10: {
        type: "radio",
        question: "Write the correct form: 'The capital of (the France / France) is Paris.'",
        answers: [
            ["the France", false, "Wrong. France is singular and does not take 'the'."],
            ["France", true, "Correct! No article is needed for France."]
        ]
    }
},
// 0170 Demonstrative determiners (this, that, these, those)
"0170": {
    1: {
        type: "radio",
        question: "Which demonstrative should you use for multiple objects that are far away?",
        answers: [
            ["Those", true, "Correct! 'Those' is for plural objects that are far away."],
            ["These", false, "Wrong. 'These' is for plural objects that are near."],
            ["That", false, "Wrong. 'That' is for a single object that is far away."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'these houses here' correct?",
        answers: [
            ["True", true, "Correct! 'These' is plural and refers to things that are 'here'."],
            ["False", false, "Wrong. 'These' is the correct plural form for nearby objects."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are grammatically incorrect?",
        answers: [
            ["This books", true, "Incorrect. 'This' is singular, 'books' is plural."],
            ["Those car", true, "Incorrect. 'Those' is plural, 'car' is singular."],
            ["These apples", false, "Correct! Both are plural and nearby."],
            ["That house", false, "Correct! Both are singular and far away."]
        ]
    },
    4: {
        type: "radio",
        question: "Do demonstrative determiners ever end in '-s' (e.g., 'thats' or 'thises')?",
        answers: [
            ["Yes", false, "Wrong. Demonstratives have specific plural forms (these/those) but never add a suffix '-s'."],
            ["No", true, "Correct! Demonstratives never end in '-s'."]
        ]
    },
    5: {
        type: "text_multi",
        question: "Change 'this' to the plural form:",
        answers: ["these"]
    },
    6: {
        type: "text_multi",
        question: "Change 'that' to the plural form:",
        answers: ["those"]
    },
    7: {
        type: "radio",
        question: "How do you refer to a single object far away?",
        answers: [
            ["That object there", true, "Correct! 'That' is singular and far."],
            ["Those object there", false, "Wrong. 'Those' is plural."]
        ]
    },
    8: {
        type: "radio",
        question: "Fill in the blank: 'Look at ____ mountains over there!'",
        answers: [
            ["those", true, "Correct! Mountains are plural and far away."],
            ["these", false, "Wrong. 'These' implies they are close to you."]
        ]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["This house is mine.", true, "Correct! Singular determiner with singular noun."],
            ["These house is mine.", false, "Wrong. 'These' requires a plural noun."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Select the correct pairs:",
        answers: [
            ["Near + Singular: This", true, "Correct!"],
            ["Far + Singular: That", true, "Correct!"],
            ["Near + Plural: These", true, "Correct!"],
            ["Far + Plural: Those", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "Can we say 'I like this shoes'?",
        answers: [
            ["True", false, "Wrong. Shoes are plural, so you must say 'these shoes'."],
            ["False", true, "Correct! 'This' is only for singular nouns."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct the error: 'I want that cookies.'",
        answers: ["I want those cookies", "those cookies"]
    }
},

// 0179 Incorrect use of 'some' in negative sentences
"0179": {
    1: {
        type: "radio",
        question: "Can you use 'some' in a standard negative sentence (e.g., with 'don't')?",
        answers: [
            ["Yes", false, "Wrong. 'Some' is generally replaced by 'any' in negative sentences."],
            ["No", true, "Correct! We use 'any' for negations."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I didn't have some money.", false, "Wrong. You cannot use 'some' with a negative verb."],
            ["I didn't have any money.", true, "Correct! 'Any' is the correct quantifier for negative sentences."]
        ]
    },
    3: {
        type: "text_multi",
        question: "Correct this sentence: 'They don't have some food.'",
        answers: ["They don't have any food", "They have no food"]
    },
    4: {
        type: "radio",
        question: "Is 'I have no money' an alternative to 'I don't have any money'?",
        answers: [
            ["True", true, "Correct! Both express a total lack of money."],
            ["False", false, "Wrong. 'No' is a valid way to negate a noun without using 'any'."]
        ]
    },
    5: {
        type: "checkbox",
        question: "Which of these are WRONG?",
        answers: [
            ["She doesn't want some help.", true, "Incorrect. Should be 'any help'."],
            ["We didn't see some people.", true, "Incorrect. Should be 'any people'."],
            ["I saw some birds.", false, "Correct. This is a positive sentence."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'He doesn't have ____ friends here.'",
        answers: [
            ["some", false, "Wrong. The sentence is negative."],
            ["any", true, "Correct! 'Any' is used with 'doesn't'."]
        ]
    },
    7: {
        type: "radio",
        question: "In which sentence type is 'some' usually used?",
        answers: [
            ["Negative sentences", false, "Wrong."],
            ["Affirmative (positive) sentences", true, "Correct!"]
        ]
    },
    8: {
        type: "text_multi",
        question: "If 'some' is used in a positive sentence, what replaces it in a negative one?",
        answers: ["any"]
    },
    9: {
        type: "radio",
        question: "Which sounds natural?",
        answers: [
            ["There isn't some milk left.", false, "Wrong."],
            ["There isn't any milk left.", true, "Correct!"]
        ]
    },
    10: {
        type: "radio",
        question: "Can you say 'I saw some animals'?",
        answers: [
            ["True", true, "Correct! In positive sentences, 'some' is perfectly fine."],
            ["False", false, "Wrong. 'Some' is the standard choice for positive statements."]
        ]
    },
    11: {
        type: "checkbox",
        question: "Select the correct negative versions of 'I have some ideas':",
        answers: [
            ["I don't have any ideas.", true, "Correct!"],
            ["I have no ideas.", true, "Correct!"],
            ["I don't have some ideas.", false, "Wrong."]
        ]
    },
    12: {
        type: "radio",
        question: "True or False: 'Any' is the negative counterpart to 'some'.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    }
},

// 0180 Incorrect use of 'any' by itself (in positive sentences)
"0180": {
    1: {
        type: "radio",
        question: "Can we use 'any' in a simple positive statement like 'I have any money'?",
        answers: [
            ["Yes", false, "Wrong. 'Any' requires a negative verb or a question context."],
            ["No", true, "Correct! In a positive sentence, you should use 'some'."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I have some ideas.", true, "Correct! Positive sentences use 'some'."],
            ["I have any ideas.", false, "Wrong. 'Any' should not be used in a positive statement like this."]
        ]
    },
    3: {
        type: "checkbox",
        question: "When is it correct to use 'any'?",
        answers: [
            ["In questions (e.g., Do you have any...?)", true, "Correct!"],
            ["In negative sentences (e.g., I don't have any...)", true, "Correct!"],
            ["In positive statements (e.g., I have any...)", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct this sentence: 'I have any water.'",
        answers: ["I have some water", "I have water"]
    },
    5: {
        type: "radio",
        question: "Is 'Do you have any idea where they went?' correct?",
        answers: [
            ["True", true, "Correct! 'Any' is perfectly standard in questions."],
            ["False", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'We need ____ help.'",
        answers: [
            ["some", true, "Correct! This is an affirmative request/statement."],
            ["any", false, "Wrong. 'Any' would sound like you are looking for a negation."]
        ]
    },
    7: {
        type: "radio",
        question: "What is better?",
        answers: [
            ["I have any time today.", false, "Wrong."],
            ["I have some time today.", true, "Correct!"]
        ]
    },
    8: {
        type: "checkbox",
        question: "Which of these are correct questions?",
        answers: [
            ["Is there any coffee left?", true, "Correct!"],
            ["Do you want any sugar?", true, "Correct!"],
            ["I have any sugar.", false, "Wrong."]
        ]
    },
    9: {
        type: "text_multi",
        question: "Instead of 'I have any money', what should you say?",
        answers: ["I have some money", "I have money"]
    },
    10: {
        type: "radio",
        question: "In the sentence 'I don't have ____ friends', which is correct?",
        answers: [
            ["any", true, "Correct! It is a negative sentence."],
            ["some", false, "Wrong. 'Some' is not used in negatives."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: You can use 'any' in positive sentences to mean 'it doesn't matter which'.",
        answers: [
            ["True", true, "Correct! (e.g., 'Take any card'). But it cannot be used to mean 'a certain amount' in a positive statement."],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "radio",
        question: "Which is the correct positive form?",
        answers: [
            ["There are any books on the table.", false, "Wrong."],
            ["There are some books on the table.", true, "Correct!"]
        ]
    }
},

// 0181 Double Negative (don't + no)
"0181": {
    1: {
        type: "radio",
        question: "Can you use a negative verb (don't) and a negative quantifier (no) in the same sentence?",
        answers: [
            ["Yes", false, "Wrong. This creates a 'double negative', which is incorrect in standard English."],
            ["No", true, "Correct! You should use 'don't + any' or 'have + no'."]
        ]
    },
    2: {
        type: "radio",
        question: "Which of these is correct?",
        answers: [
            ["I don't have no money.", false, "Wrong. This is a double negative."],
            ["I don't have any money.", true, "Correct! Negative verb + 'any'."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which are correct ways to say you have zero of something?",
        answers: [
            ["I have no time.", true, "Correct!"],
            ["I don't have any time.", true, "Correct!"],
            ["I don't have no time.", false, "Wrong. Double negative."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the double negative: 'I didn't see nobody.'",
        answers: ["I didn't see anybody", "I saw nobody", "I didn't see anyone"]
    },
    5: {
        type: "radio",
        question: "Is 'We don't need no education' grammatically correct in standard English?",
        answers: [
            ["True", false, "Wrong. It is a famous lyric, but it is a double negative. It should be 'We don't need any education'."],
            ["False", true, "Correct! Standard English avoids double negatives."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'There isn't ____ milk.'",
        answers: [
            ["no", false, "Wrong. Double negative with 'isn't'."],
            ["any", true, "Correct!"]
        ]
    },
    7: {
        type: "text_multi",
        question: "Change 'I have no friends' to a sentence using 'don't':",
        answers: ["I don't have any friends"]
    },
    8: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["He doesn't want nothing.", false, "Wrong."],
            ["He wants nothing.", true, "Correct!"]
        ]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["He doesn't want anything.", true, "Correct!"],
            ["He doesn't want nothing.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Select all grammatically correct options:",
        answers: [
            ["I can't find anything.", true, "Correct!"],
            ["I can find nothing.", true, "Correct!"],
            ["I can't find nothing.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "If the verb is already negative (didn't), which word should you use?",
        answers: [
            ["Any", true, "Correct!"],
            ["No", false, "Wrong. This would create a double negative."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct the sentence: 'She hasn't no homework.'",
        answers: ["She has no homework", "She hasn't any homework", "She hasn't got any homework"]
    }
},

// 0182 Placement of 'enough'
"0182": {
    1: {
        type: "radio",
        question: "Where is 'enough' placed when used with a noun?",
        answers: [
            ["Before the noun.", true, "Correct! (e.g., enough water)."],
            ["After the noun.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Where is 'enough' placed when used with an adjective?",
        answers: [
            ["Before the adjective.", false, "Wrong."],
            ["After the adjective.", true, "Correct! (e.g., tall enough)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["Warm enough", true, "Correct! Adjective + enough."],
            ["Enough warm", false, "Wrong. Adjective must come first."],
            ["Enough time", true, "Correct! Enough + noun."],
            ["Time enough", false, "Wrong (in standard usage)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the placement: 'I am not enough tall.'",
        answers: ["I am not tall enough", "tall enough"]
    },
    5: {
        type: "radio",
        question: "Is 'Do we have money enough?' correct?",
        answers: [
            ["True", false, "Wrong. It should be 'enough money'."],
            ["False", true, "Correct! 'Enough' comes before the noun."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'The room is ____.'",
        answers: [
            ["big enough", true, "Correct! Adjective + enough."],
            ["enough big", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Fill in the blank: 'We have ____.'",
        answers: [
            ["enough food", true, "Correct! Enough + noun."],
            ["food enough", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the placement: 'This coffee is not enough hot.'",
        answers: ["This coffee is not hot enough", "hot enough"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I didn't study enough.", true, "Correct! 'Enough' can follow a verb."],
            ["I didn't enough study.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Choose the correct sentences:",
        answers: [
            ["Are you old enough?", true, "Correct!"],
            ["Is there enough sugar?", true, "Correct!"],
            ["The car isn't fast enough.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Enough' always comes before the word it modifies.",
        answers: [
            ["True", false, "Wrong. It comes after adjectives and adverbs."],
            ["False", true, "Correct! It comes after adjectives but before nouns."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Write 'enough' and 'sleep' in the correct order:",
        answers: ["enough sleep"]
    }
},

// 0183 Quantifiers: Many vs Much
"0183": {
    1: {
        type: "radio",
        question: "Which quantifier is used with countable nouns (like 'apples' or 'books')?",
        answers: [
            ["Many", true, "Correct! 'Many' is for plural countable nouns."],
            ["Much", false, "Wrong. 'Much' is for uncountable nouns."]
        ]
    },
    2: {
        type: "radio",
        question: "Which quantifier is used with uncountable nouns (like 'time' or 'patience')?",
        answers: [
            ["Much", true, "Correct! 'Much' is for uncountable nouns."],
            ["Many", false, "Wrong. 'Many' is for countable nouns."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these pairs are correct?",
        answers: [
            ["Many people", true, "Correct! 'People' is countable."],
            ["Much money", true, "Correct! 'Money' is uncountable."],
            ["Many time", false, "Wrong. 'Time' is uncountable; use 'much'."],
            ["Much problems", false, "Wrong. 'Problems' is countable; use 'many'."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the quantifier: 'I don't have many patience.'",
        answers: ["I don't have much patience", "much patience"]
    },
    5: {
        type: "radio",
        question: "Is 'How many does it cost?' correct?",
        answers: [
            ["True", false, "Wrong. For price (uncountable money), we say 'How much'."],
            ["False", true, "Correct! It should be 'How much does it cost?'."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'There were ____ cars on the road.'",
        answers: [
            ["many", true, "Correct! 'Cars' is countable."],
            ["much", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Fill in the blank: 'We don't have ____ information.'",
        answers: [
            ["many", false, "Wrong. 'Information' is uncountable."],
            ["much", true, "Correct!"]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'He has much friends.'",
        answers: ["He has many friends", "many friends"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Many thanks!", true, "Correct! 'Thanks' is treated as countable plural."],
            ["Much thanks!", false, "Wrong (though 'much appreciated' is correct, 'much thanks' is not standard)."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Choose the correct uncountable pairings:",
        answers: [
            ["Much salt", true, "Correct!"],
            ["Much water", true, "Correct!"],
            ["Much homework", true, "Correct!"],
            ["Many homework", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Can we say 'many times'?",
        answers: [
            ["True", true, "Correct! 'Time' as an occasion is countable."],
            ["False", false, "Wrong. You can say 'many times'."]
        ]
    },
    12: {
        type: "radio",
        question: "Which is correct for asking about quantity?",
        answers: [
            ["How many water do you want?", false, "Wrong."],
            ["How much water do you want?", true, "Correct!"]
        ]
    }
},

// 0184 Quantifiers: Few vs Little
"0184": {
    1: {
        type: "radio",
        question: "Which quantifier is used with plural countable nouns?",
        answers: [
            ["Few", true, "Correct! (e.g., few friends)."],
            ["Little", false, "Wrong. 'Little' is for uncountable nouns."]
        ]
    },
    2: {
        type: "radio",
        question: "Which quantifier is used with uncountable nouns?",
        answers: [
            ["Little", true, "Correct! (e.g., little milk)."],
            ["Few", false, "Wrong. 'Few' is for countable nouns."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["A few days", true, "Correct!"],
            ["A little sugar", true, "Correct!"],
            ["A few water", false, "Wrong. 'Water' is uncountable; use 'a little'."],
            ["A little ideas", false, "Wrong. 'Ideas' is countable; use 'a few'."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I have a few patience left.'",
        answers: ["I have a little patience left", "a little patience"]
    },
    5: {
        type: "radio",
        question: "Is 'He has few friends' correct?",
        answers: [
            ["True", true, "Correct! 'Friends' is countable plural."],
            ["False", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Just ____ milk in my coffee, please.'",
        answers: [
            ["a little", true, "Correct!"],
            ["a few", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Fill in the blank: 'We have ____ minutes before the train leaves.'",
        answers: [
            ["a few", true, "Correct!"],
            ["a little", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'There is a few hope.'",
        answers: ["There is a little hope", "a little hope"]
    },
    9: {
        type: "radio",
        question: "Which quantifier describes a small amount of an uncountable noun?",
        answers: [
            ["Little", true, "Correct!"],
            ["Few", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Choose the correct countable pairings:",
        answers: [
            ["A few cars", true, "Correct!"],
            ["A few people", true, "Correct!"],
            ["A few information", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "What is the difference between 'few' and 'a few'?",
        answers: [
            ["'Few' is negative (not many); 'a few' is positive (some).", true, "Correct!"],
            ["There is no difference.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Write the correct quantifier for 'luck' (few or little):",
        answers: ["little", "a little"]
    }
},

// 0185 Each/Every with singular nouns
"0185": {
    1: {
        type: "radio",
        question: "Should 'every' and 'each' be followed by a singular or plural noun?",
        answers: [
            ["Singular", true, "Correct! They refer to individual units."],
            ["Plural", false, "Wrong. You cannot say 'every days'."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'every days' correct?",
        answers: [
            ["True", false, "Wrong. It should be 'every day'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["Each student", true, "Correct!"],
            ["Every country", true, "Correct!"],
            ["Every countries", false, "Wrong."],
            ["Each students", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I go there every weeks.'",
        answers: ["I go there every week", "every week"]
    },
    5: {
        type: "radio",
        question: "Does 'each' take a singular or plural verb?",
        answers: [
            ["Singular (e.g., 'Each has')", true, "Correct!"],
            ["Plural (e.g., 'Each have')", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: '____ person in the room was silent.'",
        answers: [
            ["Every", true, "Correct!"],
            ["All", false, "Wrong (all would require plural 'people' and 'were')."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Each time I see her, she's smiling.", true, "Correct!"],
            ["Each times I see her...", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'Every computers need an update.'",
        answers: ["Every computer needs an update", "Every computer"]
    },
    9: {
        type: "radio",
        question: "Which sounds natural?",
        answers: [
            ["I practice every day.", true, "Correct!"],
            ["I practice every days.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Choose the correct singular pairings:",
        answers: [
            ["Every book", true, "Correct!"],
            ["Each child", true, "Correct!"],
            ["Every children", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'each of the students' correct?",
        answers: [
            ["True", true, "Correct! When you use 'each of the', the noun becomes plural, but 'each' by itself stays singular."],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Rewrite 'All the students' using 'Each':",
        answers: ["Each student"]
    }
},

// 0186 Both/Either/Neither (Two things)
"0186": {
    1: {
        type: "radio",
        question: "How many items are 'both', 'either', and 'neither' used to refer to?",
        answers: [
            ["Two things", true, "Correct!"],
            ["Three or more things", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which word is used to mean 'one or the other'?",
        answers: [
            ["Either", true, "Correct!"],
            ["Neither", false, "Wrong. 'Neither' means 'not one and not the other'."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["Both my parents", true, "Correct!"],
            ["Neither of them", true, "Correct!"],
            ["I don't like either of these.", true, "Correct!"],
            ["I don't like neither of these.", false, "Wrong. Double negative."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Which word means 'A and B'?",
        answers: ["both"]
    },
    5: {
        type: "radio",
        question: "Is 'I don't like neither' correct?",
        answers: [
            ["True", false, "Wrong. Use 'I like neither' or 'I don't like either'."],
            ["False", true, "Correct!"]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I have two pens. You can use ____ of them.'",
        answers: [
            ["either", true, "Correct! (any one of the two)."],
            ["both", false, "Wrong (unless you want them to use two pens at once)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is the negative version of 'Both'?",
        answers: [
            ["Neither", true, "Correct!"],
            ["Either", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Complete: '____ of the two options is acceptable.' (meaning zero options)",
        answers: ["neither"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I didn't see either of them.", true, "Correct!"],
            ["I didn't see both of them.", false, "Wrong (this would mean you saw only one)."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Select the correct phrases for two items:",
        answers: [
            ["On either side of the road", true, "Correct!"],
            ["Both of my hands", true, "Correct!"],
            ["Neither answer is right", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "Can we use 'both' for three people?",
        answers: [
            ["True", false, "Wrong. Use 'all' for three or more."],
            ["False", true, "Correct!"]
        ]
    },
    12: {
        type: "text_multi",
        question: "What is the negative counterpart to 'either'?",
        answers: ["neither"]
    }
},

// 0187 'Both' with the article 'the'
"0187": {
    1: {
        type: "radio",
        question: "Is it correct to say 'The both options'?",
        answers: [
            ["True", false, "Wrong. 'The' is not used before 'both'."],
            ["False", true, "Correct! You should say 'Both options' or 'Both of the options'."]
        ]
    },
    2: {
        type: "radio",
        question: "Which of these is the correct way to refer to two people?",
        answers: [
            ["Both people", true, "Correct!"],
            ["The both people", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which are valid alternatives to 'The both cars are red'?",
        answers: [
            ["Both cars are red.", true, "Correct!"],
            ["Both of the cars are red.", true, "Correct!"],
            ["The two cars are red.", true, "Correct!"],
            ["The both cars...", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The both students passed.'",
        answers: ["Both students passed", "Both of the students passed"]
    },
    5: {
        type: "radio",
        question: "Can you say 'The both' in English?",
        answers: [
            ["Yes", false, "Wrong. This is a common error for French/German speakers, but it doesn't exist in English."],
            ["No", true, "Correct!"]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: '____ my brothers are tall.'",
        answers: [
            ["Both", true, "Correct!"],
            ["The both", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Both the parents were there.", true, "Correct! (the follows both)."],
            ["The both parents were there.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Fix this phrase: 'I liked the both movies.'",
        answers: ["I liked both movies", "I liked both of the movies"]
    },
    9: {
        type: "radio",
        question: "Where does 'the' go when using 'both' and 'of'?",
        answers: [
            ["Before 'both'", false, "Wrong."],
            ["After 'of' (e.g., both of the...)", true, "Correct!"]
        ]
    },
    10: {
        type: "checkbox",
        question: "Choose the correct expressions:",
        answers: [
            ["Both of them", true, "Correct!"],
            ["Both these things", true, "Correct!"],
            ["The both of them", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Can we say 'The two options are good'?",
        answers: [
            ["True", true, "Correct! You can use 'the' with 'two', just not with 'both'."],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Write 'both' and 'sides' in the correct order without any article:",
        answers: ["both sides"]
    }
},

// 0188 Implicit Nouns with Much/Little
"0188": {
    1: {
        type: "radio",
        question: "When a noun is implicit (not stated), which quantifiers are usually used?",
        answers: [
            ["Many / Few", false, "Wrong. These are for countable plurals."],
            ["Much / Little", true, "Correct! (e.g., There is little we can do)."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I don't have many to say' correct?",
        answers: [
            ["True", false, "Wrong. It should be 'I don't have much to say'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct for implicit contexts?",
        answers: [
            ["Much was accomplished.", true, "Correct!"],
            ["Little is known.", true, "Correct!"],
            ["Many was accomplished.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Complete: 'There is ____ we can do about it.' (meaning not much)",
        answers: ["little"]
    },
    5: {
        type: "radio",
        question: "Which sounds more natural?",
        answers: [
            ["Much depends on your decision.", true, "Correct!"],
            ["Many depends on your decision.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I didn't see ____ of the movie.'",
        answers: [
            ["much", true, "Correct!"],
            ["many", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Little remains to be done.", true, "Correct!"],
            ["Few remains to be done.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'How many is left?' (referring to an uncountable quantity)",
        answers: ["How much is left"]
    },
    9: {
        type: "radio",
        question: "Can we say 'Much of what you said is true'?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Choose correct phrases for abstract/unspecified quantities:",
        answers: [
            ["Too much to do", true, "Correct!"],
            ["Very little to see", true, "Correct!"],
            ["Too many to do", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'Many are called, but few are chosen' an exception?",
        answers: [
            ["Yes", true, "Correct! Here 'many' and 'few' refer to implicit countable 'people'."],
            ["No", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'There wasn't many to eat.'",
        answers: ["There wasn't much to eat"]
    }
},

// 0189 'Of' with specified vs unspecified nouns
"0189": {
    1: {
        type: "radio",
        question: "When should you use 'of' after a quantifier?",
        answers: [
            ["When referring to a specific group (e.g., 'the', 'these', 'my').", true, "Correct!"],
            ["When referring to things in general.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'Many of cars' correct?",
        answers: [
            ["True", false, "Wrong. You say 'Many cars' or 'Many of the cars'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["Many students", true, "Correct! (General)"],
            ["Many of the students", true, "Correct! (Specific)"],
            ["Many of students", false, "Wrong. (Missing determiner)"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'A few of players were injured.'",
        answers: ["A few players were injured", "A few of the players were injured"]
    },
    5: {
        type: "radio",
        question: "Can we say 'Both of them'?",
        answers: [
            ["True", true, "Correct! Pronouns are specific, so 'of' is used."],
            ["False", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I saw ____ movies last week.'",
        answers: [
            ["some", true, "Correct!"],
            ["some of", false, "Wrong. (unless followed by 'the')."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Most people like pizza.", true, "Correct!"],
            ["Most of people like pizza.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'Several of those books are mine.'",
        answers: ["Several of those books are mine", "Several of those books"]
    },
    9: {
        type: "radio",
        question: "Do we use 'of' before a pronoun like 'us', 'you', or 'them'?",
        answers: [
            ["Yes (e.g., Many of us)", true, "Correct!"],
            ["No (e.g., Many us)", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Choose correct specific quantifications:",
        answers: [
            ["Some of my friends", true, "Correct!"],
            ["All of these cars", true, "Correct!"],
            ["Few of houses", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'All people' the same as 'All of the people'?",
        answers: [
            ["'All people' is general; 'All of the people' is a specific group.", true, "Correct!"],
            ["They are exactly the same.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'Much of information was lost.'",
        answers: ["Much information was lost", "Much of the information was lost"]
    }
},


// 0210 Adjective Position
"0210": {
    1: {
        type: "radio",
        question: "Where does the adjective go in relation to the noun it describes?",
        answers: [
            ["Before the noun", true, "Correct! Adjectives almost always come before the noun."],
            ["After the noun", false, "Wrong. In English, we say 'red car', not 'car red'."]
        ]
    },
    2: {
        type: "checkbox",
        question: "Which of these phrases are correct?",
        answers: [
            ["A blue sky", true, "Correct!"],
            ["A sky blue", false, "Wrong. The adjective must come first."],
            ["An interesting book", true, "Correct!"],
            ["A book interesting", false, "Wrong."]
        ]
    },
    3: {
        type: "radio",
        question: "Is 'I have a car fast' correct?",
        answers: [
            ["True", false, "Wrong. It should be 'a fast car'."],
            ["False", true, "Correct! The adjective 'fast' belongs before 'car'."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the order: 'The house big'",
        answers: ["The big house", "big house"]
    },
    5: {
        type: "radio",
        question: "Which is the correct way to describe a person?",
        answers: [
            ["A tall woman", true, "Correct!"],
            ["A woman tall", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'It was a ______.'",
        answers: [
            ["difficult decision", true, "Correct!"],
            ["decision difficult", false, "Wrong."]
        ]
    },
    7: {
        type: "checkbox",
        question: "Identify the incorrect phrases:",
        answers: [
            ["A movie boring", true, "Incorrect. Should be 'a boring movie'."],
            ["A sunny day", false, "Correct."],
            ["An apple green", true, "Incorrect. Should be 'a green apple'."],
            ["Cold water", false, "Correct."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Put these words in order: (wine / expensive / an)",
        answers: ["an expensive wine"]
    },
    9: {
        type: "radio",
        question: "Does the rule change if there are two adjectives (e.g., 'big' and 'red')?",
        answers: [
            ["No, both still go before the noun.", true, "Correct! 'The big red house'."],
            ["Yes, one goes before and one goes after.", false, "Wrong."]
        ]
    },
    10: {
        type: "radio",
        question: "Is 'The weather is hot' an exception to the 'before the noun' rule?",
        answers: [
            ["No, because 'hot' follows a linking verb, not a noun.", true, "Correct! If there is no noun immediately after, adjectives follow verbs like 'be'."],
            ["Yes, it's an error.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Which sounds natural?",
        answers: [
            ["I saw a small cat.", true, "Correct!"],
            ["I saw a cat small.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct the order: 'I need a laptop new.'",
        answers: ["I need a new laptop", "new laptop"]
    }
},

// 0220 Adjectives have no plural form
"0220": {
    1: {
        type: "radio",
        question: "Do adjectives in English change if the noun is plural?",
        answers: [
            ["Yes, you add an -s.", false, "Wrong. Adjectives are never plural."],
            ["No, they stay the same.", true, "Correct! 'Red car' and 'red cars'."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Three smalls dogs", false, "Wrong. Adjectives do not take an 's'."],
            ["Three small dogs", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct plural phrases:",
        answers: [
            ["Expensive watches", true, "Correct!"],
            ["Expensives watches", false, "Wrong. Adjectives cannot be plural."],
            ["New books", true, "Correct!"],
            ["News books", false, "Wrong. (Note: 'News' is a noun, not the plural of 'new' here)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He has differents ideas.'",
        answers: ["He has different ideas", "different ideas"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'I bought two ______ laptops.'",
        answers: [
            ["cheap", true, "Correct!"],
            ["cheaps", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Is 'The flowers are beautifuls' correct?",
        answers: [
            ["True", false, "Wrong. Even after a verb, the adjective remains singular."],
            ["False", true, "Correct! It should be 'The flowers are beautiful'."]
        ]
    },
    7: {
        type: "radio",
        question: "If 'child' becomes 'children', does 'young' change?",
        answers: [
            ["No, it remains 'young children'.", true, "Correct!"],
            ["Yes, it becomes 'youngs children'.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Fix this: 'The blues eyes'",
        answers: ["The blue eyes", "blue eyes"]
    },
    9: {
        type: "checkbox",
        question: "Which of these are WRONG?",
        answers: [
            ["Fast cars", false, "Correct."],
            ["Fasts cars", true, "Wrong."],
            ["Bigs houses", true, "Wrong."],
            ["Modern buildings", false, "Correct."]
        ]
    },
    10: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Those are goods news.", false, "Wrong. 'News' is uncountable, and 'good' must be singular."],
            ["That is good news.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: In English, adjectives do not have a gender or plural form.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Rewrite 'a red car' in the plural:",
        answers: ["red cars", "some red cars"]
    }
},

// 0225 -ed vs -ing/-y adjectives
"0225": {
    1: {
        type: "radio",
        question: "Which ending describes how a person feels (the recipient of an emotion)?",
        answers: [
            ["-ed (e.g., bored)", true, "Correct!"],
            ["-ing (e.g., boring)", false, "Wrong. -ing describes the thing that causes the feeling."]
        ]
    },
    2: {
        type: "radio",
        question: "Which ending describes the thing or person that causes the feeling?",
        answers: [
            ["-ing (e.g., exciting)", true, "Correct!"],
            ["-ed (e.g., excited)", false, "Wrong. -ed describes the person feeling the emotion."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["I am interested in history.", true, "Correct! (I feel the interest)."],
            ["History is interesting.", true, "Correct! (History causes interest)."],
            ["I am interesting in history.", false, "Wrong. Unless you mean you are a person people find interesting!"],
            ["History is interested.", false, "Wrong. History cannot feel emotions."]
        ]
    },
    4: {
        type: "radio",
        question: "Fill in the blank: 'The movie was so ______, I almost fell asleep.'",
        answers: [
            ["boring", true, "Correct!"],
            ["bored", false, "Wrong."]
        ]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'I was so ______ during the movie.'",
        answers: [
            ["bored", true, "Correct!"],
            ["boring", false, "Wrong."]
        ]
    },
    6: {
        type: "text_multi",
        question: "Which word describes a person who makes you feel afraid?",
        answers: ["scary"]
    },
    7: {
        type: "text_multi",
        question: "Which word describes how you feel when you see a ghost?",
        answers: ["scared", "frightened"]
    },
    8: {
        type: "radio",
        question: "Is 'I am very confusing' the same as 'I am very confused'?",
        answers: [
            ["No. 'Confused' means you don't understand; 'Confusing' means others don't understand you.", true, "Correct!"],
            ["Yes, they are the same.", false, "Wrong."]
        ]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Working late is tiring.", true, "Correct!"],
            ["Working late is tired.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct usage:",
        answers: [
            ["An amazing result", true, "Correct!"],
            ["An amazed result", false, "Wrong."],
            ["I am amazed", true, "Correct!"],
            ["I am amazing", true, "Correct! (But it means you are great, not feeling a feeling)."]
        ]
    },
    11: {
        type: "radio",
        question: "Fill in the blank: 'The news was ______.'",
        answers: [
            ["shocking", true, "Correct!"],
            ["shocked", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct the error: 'I was very exciting to see you.'",
        answers: ["I was very excited to see you", "I was excited"]
    }
},

// 0231 Pronunciation -teen vs -ty
"0231": {
    1: {
        type: "radio",
        question: "Which part of the word 'thirteen' (13) is stressed?",
        answers: [
            ["The second syllable (-teen)", true, "Correct! thir-TEEN."],
            ["The first syllable (thir-)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which part of the word 'thirty' (30) is stressed?",
        answers: [
            ["The first syllable (THIR-)", true, "Correct! THIR-ty."],
            ["The second syllable (-ty)", false, "Wrong."]
        ]
    },
    3: {
        type: "radio",
        question: "If you hear 'FOR-ty', which number is being said?",
        answers: [
            ["40", true, "Correct!"],
            ["14", false, "Wrong. 14 is four-TEEN."]
        ]
    },
    4: {
        type: "radio",
        question: "If you hear 'fif-TEEN', which number is being said?",
        answers: [
            ["15", true, "Correct!"],
            ["50", false, "Wrong. 50 is FIF-ty."]
        ]
    },
    5: {
        type: "checkbox",
        question: "Which of these have the stress on the FIRST syllable?",
        answers: [
            ["Seventy (70)", true, "Correct!"],
            ["Seventeen (17)", false, "Wrong."],
            ["Eighty (80)", true, "Correct!"],
            ["Eighteen (18)", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "True or False: '-ty' endings (like 40, 50, 60) have a short, blunt ending sound.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "True or False: '-teen' endings (like 14, 15, 16) have a long 'n' sound at the end.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    8: {
        type: "radio",
        question: "How do you pronounce 19?",
        answers: [
            ["nine-TEEN", true, "Correct!"],
            ["NINE-ty", false, "Wrong. That is 90."]
        ]
    },
    9: {
        type: "radio",
        question: "How do you pronounce 60?",
        answers: [
            ["SIX-ty", true, "Correct!"],
            ["six-TEEN", false, "Wrong. That is 16."]
        ]
    },
    10: {
        type: "text_multi",
        question: "Which word has a stressed '-ty' sound? (trick question)",
        answers: ["none", "neither", "no word"]
    },
    11: {
        type: "radio",
        question: "To be clear in a noisy room, which syllable should you emphasize for '17'?",
        answers: [
            ["TEEN", true, "Correct!"],
            ["SEVEN", false, "Wrong."]
        ]
    },
    12: {
        type: "radio",
        question: "Which number is SEVEN-ty?",
        answers: [
            ["70", true, "Correct!"],
            ["17", false, "Wrong."]
        ]
    }
},

// 0232 Numerals - 'One' hundred/thousand
"0232": {
    1: {
        type: "radio",
        question: "How do you say the number 100?",
        answers: [
            ["One hundred", true, "Correct!"],
            ["Hundred", false, "Wrong. You must say 'a hundred' or 'one hundred'."]
        ]
    },
    2: {
        type: "radio",
        question: "How do you say 1,000?",
        answers: [
            ["One thousand", true, "Correct!"],
            ["Thousand", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct ways to read 150?",
        answers: [
            ["One hundred fifty", true, "Correct!"],
            ["A hundred and fifty", true, "Correct!"],
            ["Hundred fifty", false, "Wrong. Missing 'a' or 'one'."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Write out 1,200 in words (beginning with 'one'):",
        answers: ["one thousand two hundred"]
    },
    5: {
        type: "radio",
        question: "Is 'I have hundred dollars' correct?",
        answers: [
            ["True", false, "Wrong. Use 'a hundred' or 'one hundred'."],
            ["False", true, "Correct!"]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'There were ______ people at the event.'",
        answers: [
            ["one thousand", true, "Correct!"],
            ["thousand", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Can 'a hundred' be used instead of 'one hundred'?",
        answers: [
            ["Yes, 'a hundred' is very common in speech.", true, "Correct!"],
            ["No, only 'one hundred' is correct.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: '____ thousand years ago.'",
        answers: ["One", "A"]
    },
    9: {
        type: "radio",
        question: "Which is more formal for a report?",
        answers: [
            ["One hundred", true, "Correct!"],
            ["Hundred", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct readings of 1,005:",
        answers: [
            ["One thousand five", true, "Correct!"],
            ["A thousand and five", true, "Correct!"],
            ["Thousand five", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "In the number 2,100, do you say 'two thousand hundred'?",
        answers: [
            ["No, you say 'two thousand one hundred'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["One hundred percent", true, "Correct!"],
            ["Hundred percent", false, "Wrong."]
        ]
    }
},

// 0233 No plural -s or 'of' with specific numbers
"0233": {
    1: {
        type: "radio",
        question: "When saying a specific number (e.g., 500,000), do you add an 's' to 'thousand'?",
        answers: [
            ["No, it stays singular.", true, "Correct! 'Five hundred thousand'."],
            ["Yes, you say 'five hundred thousands'.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Do you use 'of' between a specific number and the noun (e.g., 1 million people)?",
        answers: [
            ["No, you say 'one million people'.", true, "Correct!"],
            ["Yes, you say 'one million of people'.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["Three million dollars", true, "Correct!"],
            ["Three millions dollars", false, "Wrong. No 's'."],
            ["Three millions of dollars", false, "Wrong. No 's' and no 'of'."],
            ["Millions of dollars", true, "Correct! (Note: 'of' and 's' are used only when the number is NOT specific)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "How do you read 200,000?",
        answers: ["two hundred thousand"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'The project cost five ______.'",
        answers: [
            ["million euros", true, "Correct!"],
            ["millions euros", false, "Wrong."],
            ["millions of euros", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Is 'six thousands cars' correct?",
        answers: [
            ["True", false, "Wrong. It should be 'six thousand cars'."],
            ["False", true, "Correct!"]
        ]
    },
    7: {
        type: "radio",
        question: "When is it okay to say 'thousands of'?",
        answers: [
            ["When the exact number is unknown (e.g., Thousands of people).", true, "Correct!"],
            ["When the exact number is 2,000.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'Ten millions of inhabitants'",
        answers: ["Ten million inhabitants"]
    },
    9: {
        type: "checkbox",
        question: "Identify the INCORRECT phrases:",
        answers: [
            ["Two billions people", true, "Incorrect. No 's'."],
            ["Two billion people", false, "Correct."],
            ["Two billions of people", true, "Incorrect."]
        ]
    },
    10: {
        type: "radio",
        question: "How do you say 400?",
        answers: [
            ["Four hundred", true, "Correct!"],
            ["Four hundreds", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Which is correct for 30,000,000?",
        answers: [
            ["Thirty million", true, "Correct!"],
            ["Thirty millions", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Read '5,000,000 CHF':",
        answers: ["five million Swiss Francs", "five million"]
    }
},

// 0234 Years (e.g., 1995)
"0234": {
    1: {
        type: "radio",
        question: "What is the standard way to say the year 1985?",
        answers: [
            ["Nineteen eighty-five", true, "Correct! (split into two numbers)."],
            ["One thousand nine hundred eighty-five", false, "Wrong. This is too formal and unusual."]
        ]
    },
    2: {
        type: "radio",
        question: "How do you say the year 1700?",
        answers: [
            ["Seventeen hundred", true, "Correct!"],
            ["One thousand seven hundred", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct for 2024?",
        answers: [
            ["Twenty twenty-four", true, "Correct!"],
            ["Two thousand twenty-four", true, "Correct!"],
            ["Twenty hundred twenty-four", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "How do you say 1999?",
        answers: ["nineteen ninety-nine"]
    },
    5: {
        type: "radio",
        question: "How do you say 1805?",
        answers: [
            ["Eighteen oh-five", true, "Correct!"],
            ["Eighteen five", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I was born in ______.' (1990)",
        answers: [
            ["nineteen ninety", true, "Correct!"],
            ["one thousand nine hundred ninety", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Is 'The year two thousand' correct for 2000?",
        answers: [
            ["True", true, "Correct! For years 2000–2009, 'two thousand...' is most common."],
            ["False", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "How do you say 2010?",
        answers: ["twenty-ten", "two thousand and ten"]
    },
    9: {
        type: "radio",
        question: "Which is the standard way to say 1066?",
        answers: [
            ["Ten sixty-six", true, "Correct!"],
            ["One thousand sixty-six", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct readings for 1900:",
        answers: [
            ["Nineteen hundred", true, "Correct!"],
            ["One thousand nine hundred", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Can you say 'In the nineteen ninety-five'?",
        answers: [
            ["No, do not use 'the' before a year.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Read the year '1492':",
        answers: ["fourteen ninety-two"]
    }
},

// 0235 Decades (e.g., the 80s)
"0235": {
    1: {
        type: "radio",
        question: "How do you say 'the 80s'?",
        answers: [
            ["The eighties", true, "Correct!"],
            ["The eighty years", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I grew up in the 90s.", true, "Correct!"],
            ["I grew up in 90s.", false, "Wrong. Decades require the article 'the'."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct names for decades?",
        answers: [
            ["The sixties", true, "Correct!"],
            ["The seventies", true, "Correct!"],
            ["The seventy", false, "Wrong."],
            ["The sixties years", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Write out 'the 70s':",
        answers: ["the seventies"]
    },
    5: {
        type: "radio",
        question: "How do you say 'the 1920s'?",
        answers: [
            ["The nineteen-twenties", true, "Correct!"],
            ["The nineteen-twenty years", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'He loves music from ______.'",
        answers: [
            ["the fifties", true, "Correct!"],
            ["the fifty", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Is 'the 2000s' said as 'the two thousands'?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'The movie was set in eighties.'",
        answers: ["The movie was set in the eighties"]
    },
    9: {
        type: "radio",
        question: "Which is the correct written form?",
        answers: [
            ["the '80s", true, "Correct!"],
            ["the 80's", false, "Wrong (technically '80s is preferred as there is no possession)."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct decade names:",
        answers: [
            ["The thirties", true, "Correct!"],
            ["The fourties", false, "Wrong (spelling: 'forties')"],
            ["The forties", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "Can we say 'The eighties decade'?",
        answers: [
            ["It is redundant; 'the eighties' is enough.", true, "Correct!"],
            ["Yes, it's standard.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Read 'the 60s':",
        answers: ["the sixties"]
    }
},

// 0236 Ordinal Numbers (1st, 2nd, 3rd)
"0236": {
    1: {
        type: "radio",
        question: "What is the ordinal form of 'one'?",
        answers: [
            ["First", true, "Correct!"],
            ["Oneth", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "What is the ordinal form of 'two'?",
        answers: [
            ["Second", true, "Correct!"],
            ["Twoth", false, "Wrong."]
        ]
    },
    3: {
        type: "radio",
        question: "What is the ordinal form of 'three'?",
        answers: [
            ["Third", true, "Correct!"],
            ["Threeth", false, "Wrong."]
        ]
    },
    4: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["Fourth", true, "Correct!"],
            ["Fifth", true, "Correct!"],
            ["Fiveth", false, "Wrong."],
            ["Ninth", true, "Correct!"],
            ["Nineth", false, "Wrong (spelling: no 'e')."]
        ]
    },
    5: {
        type: "text_multi",
        question: "What is the ordinal of 20?",
        answers: ["twentieth"]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Today is my ______ birthday.' (22)",
        answers: [
            ["twenty-second", true, "Correct!"],
            ["twenty-twoth", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for the number 12?",
        answers: [
            ["Twelfth", true, "Correct!"],
            ["Twelveth", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Write out '3rd':",
        answers: ["third"]
    },
    9: {
        type: "radio",
        question: "How do most ordinal numbers end?",
        answers: [
            ["-th", true, "Correct!"],
            ["-st", false, "Wrong. Only numbers ending in 1 (except 11) end in -st."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the irregular ordinals:",
        answers: [
            ["First", true, "Correct!"],
            ["Second", true, "Correct!"],
            ["Third", true, "Correct!"],
            ["Tenth", false, "Wrong (it follows the -th rule)."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'twenty-oneth' correct?",
        answers: [
            ["True", false, "Wrong. It should be 'twenty-first'."],
            ["False", true, "Correct!"]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct the spelling: 'Fiveth'",
        answers: ["fifth"]
    }
},

// 0240 Comparative Form (Short vs Long)
"0240": {
    1: {
        type: "radio",
        question: "What is the comparative form of 'tall'?",
        answers: [
            ["Taller", true, "Correct!"],
            ["More tall", false, "Wrong. For short adjectives, add -er."]
        ]
    },
    2: {
        type: "radio",
        question: "What is the comparative form of 'expensive'?",
        answers: [
            ["More expensive", true, "Correct!"],
            ["Expensiver", false, "Wrong. For long adjectives, use 'more'."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these irregular comparatives are correct?",
        answers: [
            ["Good -> Better", true, "Correct!"],
            ["Bad -> Worse", true, "Correct!"],
            ["Far -> Further", true, "Correct!"],
            ["Good -> Gooder", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "What is the comparative of 'big'?",
        answers: ["bigger"]
    },
    5: {
        type: "radio",
        question: "Is 'more better' correct?",
        answers: [
            ["True", false, "Wrong. 'Better' is already comparative. Never use 'more' with 'better'."],
            ["False", true, "Correct!"]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'This phone is ______ than that one.'",
        answers: [
            ["newer", true, "Correct!"],
            ["more new", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Fill in the blank: 'This book is ______ than the movie.'",
        answers: [
            ["more interesting", true, "Correct!"],
            ["interestinger", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'Your car is more fast than mine.'",
        answers: ["Your car is faster than mine", "faster"]
    },
    9: {
        type: "radio",
        question: "Which is the comparative of 'funny'?",
        answers: [
            ["Funnier", true, "Correct! (Two-syllable adjectives ending in -y change to -ier)."],
            ["More funny", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Choose the correct forms:",
        answers: [
            ["Smarter", true, "Correct!"],
            ["More beautiful", true, "Correct!"],
            ["More bad", false, "Wrong (Worse)."]
        ]
    },
    11: {
        type: "radio",
        question: "Can we say 'littler'?",
        answers: [
            ["'Smaller' is much more common.", true, "Correct!"],
            ["Yes, always.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Write the comparative of 'difficult':",
        answers: ["more difficult"]
    }
},

// 0241 Comparative Preposition (Than)
"0241": {
    1: {
        type: "radio",
        question: "Which word do we use to link two things in a comparison?",
        answers: [
            ["Than", true, "Correct!"],
            ["That", false, "Wrong."],
            ["As", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I am taller as my brother' correct?",
        answers: [
            ["True", false, "Wrong. Use 'than' after a comparative."],
            ["False", true, "Correct! It should be 'taller than'."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct sentences:",
        answers: [
            ["She is older than me.", true, "Correct!"],
            ["It's cheaper than I thought.", true, "Correct!"],
            ["He's faster that me.", false, "Wrong. Use 'than'."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Your house is bigger that mine.'",
        answers: ["Your house is bigger than mine", "bigger than"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'London is larger ______ Geneva.'",
        answers: [
            ["than", true, "Correct!"],
            ["from", false, "Wrong."],
            ["then", false, "Wrong. ('Then' is for time)."]
        ]
    },
    6: {
        type: "radio",
        question: "Which word is often confused with 'than' but means 'at that time'?",
        answers: [
            ["Then", true, "Correct!"],
            ["Than", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Is 'This is better from that' correct?",
        answers: [
            ["True", false, "Wrong. Use 'than'."],
            ["False", true, "Correct!"]
        ]
    },
    8: {
        type: "text_multi",
        question: "Complete the comparison: 'Gold is more expensive ____ silver.'",
        answers: ["than"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I like this one more than the other.", true, "Correct!"],
            ["I like this one more as the other.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Select the correct phrases:",
        answers: [
            ["More than enough", true, "Correct!"],
            ["Worse than before", true, "Correct!"],
            ["Better as ever", false, "Wrong. Better than ever."]
        ]
    },
    11: {
        type: "radio",
        question: "Can we use 'than' with 'the same'?",
        answers: [
            ["No, we use 'the same as'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'He is stronger then he looks.'",
        answers: ["He is stronger than he looks", "than"]
    }
},

// 0245 Comparative vs Superlative
"0245": {
    1: {
        type: "radio",
        question: "How many things are you comparing when you use a 'comparative' (-er)?",
        answers: [
            ["Two things", true, "Correct!"],
            ["Three or more things", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "How many things are you comparing when you use a 'superlative' (-est)?",
        answers: [
            ["One thing vs a whole group (3+)", true, "Correct!"],
            ["Only two things", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["Of these two cars, the red one is faster.", true, "Correct! (Comparing 2)."],
            ["He is the fastest player on the team.", true, "Correct! (Comparing vs group)."],
            ["He is the faster player on the team.", false, "Wrong. Use superlative for a whole group."]
        ]
    },
    4: {
        type: "radio",
        question: "Is 'This is the better coffee I've ever had' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'the best' because it's out of all coffees."],
            ["False", true, "Correct!"]
        ]
    },
    5: {
        type: "radio",
        question: "If you have two sons, should you say 'he is my oldest son' or 'he is my older son'?",
        answers: [
            ["Older son", true, "Correct! (Comparing only 2)."],
            ["Oldest son", false, "Wrong. (Technically, oldest is for 3+)."]
        ]
    },
    6: {
        type: "text_multi",
        question: "Which form is used for 'the top one of all'?",
        answers: ["superlative"]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["This path is the shortest of the three.", true, "Correct!"],
            ["This path is the shorter of the three.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'This is the better day of my life.'",
        answers: ["This is the best day of my life", "best day"]
    },
    9: {
        type: "radio",
        question: "Fill in the blank: 'Between Sarah and Jane, Jane is ______.'",
        answers: [
            ["the taller", true, "Correct! (Comparing 2)."],
            ["the tallest", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["The best in the world", true, "Correct!"],
            ["Better than ever", true, "Correct!"],
            ["The better of the world", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Does 'the most' indicate a comparative or a superlative?",
        answers: [
            ["Superlative", true, "Correct!"],
            ["Comparative", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Mount Everest is the higher mountain in the world.'",
        answers: ["highest"]
    }
},

// 0250 Superlative Form
"0250": {
    1: {
        type: "radio",
        question: "What is the superlative form of 'small'?",
        answers: [
            ["The smallest", true, "Correct!"],
            ["The most small", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "What is the superlative form of 'beautiful'?",
        answers: [
            ["The most beautiful", true, "Correct!"],
            ["The beautifulest", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which irregular superlatives are correct?",
        answers: [
            ["Good -> The best", true, "Correct!"],
            ["Bad -> The worst", true, "Correct!"],
            ["Far -> The farthest", true, "Correct!"],
            ["Bad -> The baddest", false, "Wrong (slang only)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "What is the superlative of 'happy'?",
        answers: ["the happiest", "happiest"]
    },
    5: {
        type: "radio",
        question: "Is 'the most cheap' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'the cheapest'."],
            ["False", true, "Correct!"]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'It was the ______ day of my life.'",
        answers: [
            ["hottest", true, "Correct!"],
            ["most hot", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is the superlative of 'difficult'?",
        answers: [
            ["The most difficult", true, "Correct!"],
            ["The difficultest", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'He is the goodest player.'",
        answers: ["He is the best player", "the best"]
    },
    9: {
        type: "radio",
        question: "Which word always precedes a superlative in a sentence?",
        answers: [
            ["The", true, "Correct!"],
            ["A", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Select correct superlative forms:",
        answers: [
            ["The longest", true, "Correct!"],
            ["The most expensive", true, "Correct!"],
            ["The most smart", false, "Wrong (the smartest)."]
        ]
    },
    11: {
        type: "radio",
        question: "What is the superlative of 'wide'?",
        answers: [
            ["The widest", true, "Correct!"],
            ["The wideste", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Write the superlative of 'bad':",
        answers: ["the worst"]
    }
},

// 0251 Superlative Preposition (In the world)
"0251": {
    1: {
        type: "radio",
        question: "Which prepositional phrase is standard after a superlative?",
        answers: [
            ["In the world", true, "Correct!"],
            ["Of the world", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'He is the best player of the team' correct?",
        answers: [
            ["True", false, "Wrong. Use 'on the team' or 'in the team'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["The tallest building in the city", true, "Correct!"],
            ["The tallest building of the city", false, "Wrong."],
            ["The best student in the class", true, "Correct!"],
            ["The best student of the class", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the phrase: 'The most expensive car of the world'",
        answers: ["The most expensive car in the world", "in the world"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'This is the oldest house ______ Switzerland.'",
        answers: [
            ["in", true, "Correct!"],
            ["of", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Can we say 'The best day of my life'?",
        answers: [
            ["Yes, 'of' is used for periods of time.", true, "Correct!"],
            ["No, it must be 'in'.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is better?",
        answers: [
            ["The biggest company in Europe", true, "Correct!"],
            ["The biggest company of Europe", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'The fastest man of history'",
        answers: ["The fastest man in history", "in history"]
    },
    9: {
        type: "radio",
        question: "True or False: We use 'in' for locations and 'of' for time/groups with superlatives.",
        answers: [
            ["True", true, "Correct! (e.g., best in the class, best of the group)."],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct preposition:",
        answers: [
            ["Highest in the mountains", true, "Correct!"],
            ["Deepest in the ocean", true, "Correct!"],
            ["Richest of the world", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'The smartest of all' correct?",
        answers: [
            ["True", true, "Correct! 'Of all' is a standard phrase."],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The coldest city of the country.'",
        answers: ["The coldest city in the country", "in the country"]
    }
},

// 0261 The more..., the more...
"0261": {
    1: {
        type: "radio",
        question: "How many times do you use 'the' in this construction?",
        answers: [
            ["Twice (before both adjectives)", true, "Correct!"],
            ["Once (at the beginning only)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'More you study, better you do' correct?",
        answers: [
            ["True", false, "Wrong. It should be 'The more you study, the better you do'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["The higher you go, the colder it gets.", true, "Correct!"],
            ["Higher you go, colder it gets.", false, "Wrong."],
            ["The sooner, the better.", true, "Correct!"],
            ["Sooner, better.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Complete the phrase: 'The more, the ______.'",
        answers: ["merrier"]
    },
    5: {
        type: "radio",
        question: "Fill in the blanks: '______ you exercise, ______ you feel.'",
        answers: [
            ["The more / the better", true, "Correct!"],
            ["More / better", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Can you say 'The more I sleep, I am more tired'?",
        answers: [
            ["No, it should be 'the more tired I am'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["The harder he works, the more successful he becomes.", true, "Correct!"],
            ["The harder he works, more successful he becomes.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'The cheaper it is, better for me.'",
        answers: ["The cheaper it is, the better for me", "the better"]
    },
    9: {
        type: "radio",
        question: "Is 'The less you know, the better' correct?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct structures:",
        answers: [
            ["The faster, the better", true, "Correct!"],
            ["The more expensive, the better quality", true, "Correct!"],
            ["The older I get, I am wiser", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Does this construction exist in French/German without 'the'?",
        answers: [
            ["Yes, which is why it's a common error.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Finish this: 'The bigger they are, the ____ they fall.'",
        answers: ["harder"]
    }
},

// 0270 Equality Expression (As...As)
"0270": {
    1: {
        type: "radio",
        question: "Which expression is used to say two things are equal?",
        answers: [
            ["As + adjective + as", true, "Correct!"],
            ["As + adjective + than", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I am as tall than my brother' correct?",
        answers: [
            ["True", false, "Wrong. Use 'as tall as'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct expressions of equality?",
        answers: [
            ["As good as gold", true, "Correct!"],
            ["The same as mine", true, "Correct!"],
            ["The same than mine", false, "Wrong. Use 'same as'."],
            ["As soon as possible", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He is as fast like a lightning.'",
        answers: ["He is as fast as lightning", "as fast as"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Your car is ______ mine.'",
        answers: [
            ["the same as", true, "Correct!"],
            ["same than", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is correct for negation?",
        answers: [
            ["He is not as old as he looks.", true, "Correct!"],
            ["He is not as old than he looks.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Can we say 'He is as tall like me'?",
        answers: [
            ["No, use 'as tall as'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'As much ____ possible.'",
        answers: ["as"]
    },
    9: {
        type: "radio",
        question: "Which is the correct way to compare two similar items?",
        answers: [
            ["This one is the same as that one.", true, "Correct!"],
            ["This one is same as that one.", false, "Wrong. (Need the article 'the')."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct phrases:",
        answers: [
            ["As far as I know", true, "Correct!"],
            ["As well as", true, "Correct!"],
            ["Same than before", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'I work as hard as you' correct?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct this: 'It's as hot than yesterday.'",
        answers: ["as hot as yesterday", "as hot as"]
    }
},

// 0280 Adjective as Adverb (-ly)
"0280": {
    1: {
        type: "radio",
        question: "What ending is usually added to an adjective to make it an adverb?",
        answers: [
            ["-ly", true, "Correct!"],
            ["-ing", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'She sings beautiful' correct?",
        answers: [
            ["True", false, "Wrong. Use the adverb 'beautifully'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct adverbs?",
        answers: [
            ["Quickly", true, "Correct!"],
            ["Happily", true, "Correct!"],
            ["Easy", false, "Wrong (adjective)."],
            ["Slowly", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Make an adverb from 'careful':",
        answers: ["carefully"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'He drives ______.'",
        answers: [
            ["slowly", true, "Correct!"],
            ["slow", false, "Wrong (though common in casual speech, it's grammatically an adjective)."]
        ]
    },
    6: {
        type: "radio",
        question: "Which modifies a verb?",
        answers: [
            ["An adverb", true, "Correct!"],
            ["An adjective", false, "Wrong (adjectives modify nouns)."]
        ]
    },
    7: {
        type: "radio",
        question: "Is 'I work happy' correct if you mean the manner in which you work?",
        answers: [
            ["No, it should be 'I work happily'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'Please listen careful.'",
        answers: ["Please listen carefully", "carefully"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["The sun is shining brightly.", true, "Correct!"],
            ["The sun is shining bright.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct adverb usage:",
        answers: [
            ["He spoke clearly.", true, "Correct!"],
            ["She ran quick.", false, "Wrong."],
            ["They lived peacefully.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "What is the adverb form of 'angry'?",
        answers: [
            ["Angrily", true, "Correct!"],
            ["Angred", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Write the adverb for 'perfect':",
        answers: ["perfectly"]
    }
},

// 0281 Adverbs with no -ly (Fast, Late, Hard)
"0281": {
    1: {
        type: "radio",
        question: "What is the adverb form of 'fast'?",
        answers: [
            ["Fast", true, "Correct!"],
            ["Fastly", false, "Wrong. 'Fastly' does not exist."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I arrived lately' correct if you mean you were not on time?",
        answers: [
            ["True", false, "Wrong. Use 'late'. 'Lately' means 'recently'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these words function as both adjectives and adverbs WITHOUT -ly?",
        answers: [
            ["Fast", true, "Correct!"],
            ["Hard", true, "Correct!"],
            ["Early", true, "Correct!"],
            ["Beautiful", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'She runs very fastly.'",
        answers: ["She runs very fast", "fast"]
    },
    5: {
        type: "radio",
        question: "Which word means 'with great effort'?",
        answers: [
            ["Hard", true, "Correct! (e.g., I work hard)."],
            ["Hardly", false, "Wrong. 'Hardly' means 'almost not'."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'He woke up ______.'",
        answers: [
            ["early", true, "Correct!"],
            ["earlily", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I studied hard for the exam.", true, "Correct!"],
            ["I studied hardly for the exam.", false, "Wrong. (This means you didn't study!)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the adverb form of 'late'?",
        answers: ["late"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["The train arrived late.", true, "Correct!"],
            ["The train arrived lately.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct adverbs:",
        answers: [
            ["Work hard", true, "Correct!"],
            ["Drive fast", true, "Correct!"],
            ["Arrive early", true, "Correct!"],
            ["Speak fastly", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Hardly' is the adverb of 'hard'.",
        answers: [
            ["False", true, "Correct! 'Hard' is its own adverb. 'Hardly' has a different meaning."],
            ["True", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct this: 'He hits the ball hardly.'",
        answers: ["He hits the ball hard"]
    }
},

// 0284 No 'the' with 'last week/month'
"0284": {
    1: {
        type: "radio",
        question: "Is it correct to say 'I went to London the last week'?",
        answers: [
            ["True", false, "Wrong. Do not use 'the' with 'last week'."],
            ["False", true, "Correct! Just say 'last week'."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I saw him last month.", true, "Correct!"],
            ["I saw him the last month.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct phrases:",
        answers: [
            ["Last night", true, "Correct!"],
            ["The last night", false, "Wrong."],
            ["Last summer", true, "Correct!"],
            ["The last summer", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'We met the last year.'",
        answers: ["We met last year"]
    },
    5: {
        type: "radio",
        question: "When CAN you use 'the last week'?",
        answers: [
            ["When referring to a duration (e.g., 'in the last week' meaning 'during the past 7 days').", true, "Correct!"],
            ["When saying when something happened in the past.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I was on holiday ______.'",
        answers: [
            ["last week", true, "Correct!"],
            ["the last week", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which sounds natural?",
        answers: [
            ["Last Tuesday was rainy.", true, "Correct!"],
            ["The last Tuesday was rainy.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'I moved here ____ February.'",
        answers: ["last"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Last weekend was fun.", true, "Correct!"],
            ["The last weekend was fun.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Select correct time expressions:",
        answers: [
            ["Last Monday", true, "Correct!"],
            ["Next month", true, "Correct!"],
            ["The last month", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'I worked a lot the last week' correct?",
        answers: [
            ["No, it should be 'last week'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The last year was difficult.'",
        answers: ["Last year was difficult"]
    }
},

// 0285 For vs Ago (Time in the past)
"0285": {
    1: {
        type: "radio",
        question: "Which word is used to describe how far back in the past an event happened?",
        answers: [
            ["Ago", true, "Correct! (e.g., 10 years ago)."],
            ["For", false, "Wrong. 'For' describes duration."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I arrived for 10 minutes' correct if you mean 10 minutes in the past?",
        answers: [
            ["True", false, "Wrong. Use '10 minutes ago'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct for past points in time?",
        answers: [
            ["Two days ago", true, "Correct!"],
            ["A long time ago", true, "Correct!"],
            ["For two days", false, "Wrong (this means a duration)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He left for three hours.' (meaning 3 hours in the past)",
        answers: ["He left three hours ago"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'The war ended many years ______.'",
        answers: [
            ["ago", true, "Correct!"],
            ["for", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Does 'for' correspond to the German 'vor' in 'vor 10 Jahren'?",
        answers: [
            ["No, 'ago' is the equivalent of 'vor'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I met her for three weeks.", false, "Wrong. (This sounds like the meeting lasted three weeks)."],
            ["I met her three weeks ago.", true, "Correct!"]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'Once upon a time, a long time ____.'",
        answers: ["ago"]
    },
    9: {
        type: "radio",
        question: "Which describes a finished action at a specific time back in the past?",
        answers: [
            ["Ago", true, "Correct!"],
            ["For", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage of 'ago':",
        answers: [
            ["I saw it a minute ago.", true, "Correct!"],
            ["Five minutes for", false, "Wrong."],
            ["Six months ago", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'I arrived ago 10 minutes' correct?",
        answers: [
            ["No, 'ago' follows the time period.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct this: 'I finished for an hour.'",
        answers: ["I finished an hour ago"]
    }
},

// 0286 Since vs For (Length of time)
"0286": {
    1: {
        type: "radio",
        question: "Which word is used to describe a duration or length of time?",
        answers: [
            ["For", true, "Correct! (e.g., for 10 years)."],
            ["Since", false, "Wrong. 'Since' is for a starting point."]
        ]
    },
    2: {
        type: "radio",
        question: "Which word is used to describe a starting point in time?",
        answers: [
            ["Since", true, "Correct! (e.g., since 2010)."],
            ["For", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["I've been here for three hours.", true, "Correct!"],
            ["I've been here since 3 o'clock.", true, "Correct!"],
            ["I've been here since three hours.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I've worked here since 5 years.'",
        answers: ["I've worked here for 5 years", "for 5 years"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We have known each other ______ childhood.'",
        answers: [
            ["since", true, "Correct!"],
            ["for", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I haven't seen him ______ a long time.'",
        answers: [
            ["for", true, "Correct!"],
            ["since", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for '10 years'?",
        answers: [
            ["For 10 years", true, "Correct!"],
            ["Since 10 years", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'I've lived here ____ last Monday.'",
        answers: ["since"]
    },
    9: {
        type: "radio",
        question: "Which describes an action that started in the past and continues to the present?",
        answers: [
            ["Both 'for' and 'since'.", true, "Correct! (depending on if you state the duration or start)."],
            ["Neither.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct pairings:",
        answers: [
            ["For ages", true, "Correct!"],
            ["Since yesterday", true, "Correct!"],
            ["Since two weeks", false, "Wrong. (For two weeks)."]
        ]
    },
    11: {
        type: "radio",
        question: "Can we say 'Since many years'?",
        answers: [
            ["No, use 'for many years'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'I haven't eaten since 2 days.'",
        answers: ["I haven't eaten for 2 days", "for 2 days"]
    }
},

// 0287 Ever vs Never
"0287": {
    1: {
        type: "radio",
        question: "Which word is usually used in questions to mean 'at any point in time'?",
        answers: [
            ["Ever", true, "Correct! (e.g., Have you ever...?)"],
            ["Never", false, "Wrong. 'Never' is for negations."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I have ever seen that movie' correct for a positive statement?",
        answers: [
            ["True", false, "Wrong. Use 'I have seen' or 'I have always seen'."],
            ["False", true, "Correct! 'Ever' is not used for continuation."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["I have never been to China.", true, "Correct!"],
            ["Have you ever been to China?", true, "Correct!"],
            ["Don't ever do that again.", true, "Correct!"],
            ["I ever go to the gym.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "What is the question form of 'I have never'?",
        answers: ["Have you ever"]
    },
    5: {
        type: "radio",
        question: "Does 'ever' mean 'always'?",
        answers: [
            ["No, it means 'at any time'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Nothing ______ happens in this town.'",
        answers: [
            ["ever", true, "Correct! (Nothing is already negative, so we use ever)."],
            ["never", false, "Wrong. (This would be a double negative)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["This is the best meal I've ever eaten.", true, "Correct!"],
            ["This is the best meal I've never eaten.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'I don't never go there.'",
        answers: ["I never go there", "I don't ever go there"]
    },
    9: {
        type: "radio",
        question: "Which sounds natural?",
        answers: [
            ["Hardly ever", true, "Correct! (meaning almost never)."],
            ["Hardly never", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Select correct usage:",
        answers: [
            ["If you ever need help, call me.", true, "Correct!"],
            ["Never say never.", true, "Correct!"],
            ["I ever like pizza.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'I am ever happy' correct?",
        answers: [
            ["No, say 'I am always happy'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Have you never been to the moon?' (for a standard question)",
        answers: ["Have you ever been to the moon?"]
    }
},

// 0288 Already vs Yet
"0288": {
    1: {
        type: "radio",
        question: "Which word is used in positive statements to show that an action is finished?",
        answers: [
            ["Already", true, "Correct! (e.g., I have already eaten)."],
            ["Yet", false, "Wrong. 'Yet' is for negations/questions."]
        ]
    },
    2: {
        type: "radio",
        question: "Which word is used at the end of negative sentences or questions?",
        answers: [
            ["Yet", true, "Correct! (e.g., I haven't eaten yet)."],
            ["Already", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["I have already finished my work.", true, "Correct!"],
            ["Have you finished yet?", true, "Correct!"],
            ["I haven't finished already.", false, "Wrong. Use 'yet'."],
            ["I have yet finished.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "What is the missing word: 'I ____ know the answer.'",
        answers: ["already"]
    },
    5: {
        type: "radio",
        question: "Where is 'yet' usually placed in a sentence?",
        answers: [
            ["At the end.", true, "Correct!"],
            ["In the middle.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'It is only 8 AM, but I have ______ had two coffees.'",
        answers: [
            ["already", true, "Correct!"],
            ["yet", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["The train hasn't arrived yet.", true, "Correct!"],
            ["The train hasn't arrived already.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'Have you already seen the movie?' (Standard question for confirmation)",
        answers: ["Have you seen the movie yet?"]
    },
    9: {
        type: "radio",
        question: "Can 'already' be used in questions to express surprise?",
        answers: [
            ["Yes (e.g., Have you finished already?!).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Select the correct phrases:",
        answers: [
            ["Not yet", true, "Correct!"],
            ["Already done", true, "Correct!"],
            ["Yet finished", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'I already have seen it' correct?",
        answers: [
            ["It's better as 'I have already seen it'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'I don't know it already.'",
        answers: ["I don't know it yet", "I don't yet know it"]
    }
},

// 0289 Still vs Anymore
"0289": {
    1: {
        type: "radio",
        question: "Which word expresses that an action is continuing from the past?",
        answers: [
            ["Still", true, "Correct! (e.g., I still work there)."],
            ["Anymore", false, "Wrong. 'Anymore' is for stopping."]
        ]
    },
    2: {
        type: "radio",
        question: "Which word expresses that an action has stopped?",
        answers: [
            ["Anymore", true, "Correct! (e.g., I don't work there anymore)."],
            ["Still", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["I still live in London.", true, "Correct!"],
            ["I don't live in London anymore.", true, "Correct!"],
            ["I always live in London.", false, "Wrong. (Use 'still' for continuation)."],
            ["I still don't live in London.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "What is the opposite of 'still' in a negative sentence?",
        answers: ["anymore", "not anymore"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Are you ______ hungry?'",
        answers: [
            ["still", true, "Correct!"],
            ["anymore", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'He doesn't play piano ______.'",
        answers: [
            ["anymore", true, "Correct!"],
            ["still", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I am still active in the club.", true, "Correct!"],
            ["I am always active in the club.", false, "Wrong (if you mean you continue to be)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'I am no more working for them.'",
        answers: ["I am not working for them anymore", "I am no longer working for them"]
    },
    9: {
        type: "radio",
        question: "Where is 'anymore' usually placed?",
        answers: [
            ["At the end of the sentence.", true, "Correct!"],
            ["In the middle.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct usage:",
        answers: [
            ["Still waiting", true, "Correct!"],
            ["Anymore waiting", false, "Wrong."],
            ["I don't smoke anymore.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "Can 'still' be used in negative sentences?",
        answers: [
            ["Yes, to show a delay (e.g., It still hasn't arrived).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I always have the same car.' (Meaning you continue to have it)",
        answers: ["I still have the same car"]
    }
},

// 0293 Intensifier 'Such'
"0293": {
    1: {
        type: "radio",
        question: "When do you use 'such'?",
        answers: [
            ["With a noun phrase (Adjective + Noun).", true, "Correct! (e.g., such a nice day)."],
            ["With just an adjective.", false, "Wrong. Use 'so' for just adjectives."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'He is such tall' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'so tall'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["Such a beautiful place!", true, "Correct!"],
            ["Such nice people!", true, "Correct!"],
            ["Such beautiful!", false, "Wrong."],
            ["Such a movie!", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'It was so a long journey.'",
        answers: ["It was such a long journey", "such a"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'She is ______ smart student.'",
        answers: [
            ["such a", true, "Correct!"],
            ["so", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I've never seen such mess.", false, "Wrong. 'Such a mess'."] ,
            ["I've never seen such a mess.", true, "Correct!"]
        ]
    },
    7: {
        type: "radio",
        question: "Can 'such' be used with plural nouns?",
        answers: [
            ["Yes (e.g., such good friends).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the intensifier: 'They are ____ kind people.'",
        answers: ["such"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["He has such a lot of money.", true, "Correct!"],
            ["He has so lot of money.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["Such a disaster!", true, "Correct!"],
            ["Such lovely weather!", true, "Correct!"],
            ["Such weather lovely!", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Such' usually precedes the article 'a/an'.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'It is so a cold night.'",
        answers: ["It is such a cold night"]
    }
},

// 0294 Intensifier 'So'
"0294": {
    1: {
        type: "radio",
        question: "When do you use 'so' as an intensifier?",
        answers: [
            ["With a single adjective.", true, "Correct! (e.g., so happy)."],
            ["With a noun phrase.", false, "Wrong. Use 'such'."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct for a lot of something?",
        answers: [
            ["So much / So many", true, "Correct!"],
            ["So a lot", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["I am so tired.", true, "Correct!"],
            ["You have so many books.", true, "Correct!"],
            ["You have so books.", false, "Wrong."],
            ["It was so cold.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'It was such expensive.'",
        answers: ["It was so expensive"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'I have ______ work to do.'",
        answers: [
            ["so much", true, "Correct!"],
            ["so many", false, "Wrong. (Work is uncountable)."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She was ______ happy.'",
        answers: [
            ["so", true, "Correct!"],
            ["such", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["There are so many people here.", true, "Correct!"],
            ["There are so people here.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'I love you ____ much.'",
        answers: ["so"]
    },
    9: {
        type: "radio",
        question: "Is 'I am so a positive person' correct?",
        answers: [
            ["No, it should be 'such a positive person'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct intensifiers:",
        answers: [
            ["So beautiful", true, "Correct!"],
            ["So quickly", true, "Correct! (Adverbs too!)"],
            ["So a problem", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Can we use 'so' with 'very'?",
        answers: [
            ["No, it's redundant. Pick one.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The movie was such good.'",
        answers: ["The movie was so good"]
    }
},

// 0295 Near vs Nearby
"0295": {
    1: {
        type: "radio",
        question: "Which word is a preposition that is followed by a noun?",
        answers: [
            ["Near", true, "Correct! (e.g., near the lake)."],
            ["Nearby", false, "Wrong. 'Nearby' usually comes after or is used as an adjective."]
        ]
    },
    2: {
        type: "radio",
        question: "Which word is used as an adverb or adjective at the end of a sentence?",
        answers: [
            ["Nearby", true, "Correct! (e.g., a hotel nearby)."],
            ["Near", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["I live near the station.", true, "Correct!"],
            ["I live nearby the station.", false, "Wrong. Don't use 'nearby' as a preposition."],
            ["There is a station nearby.", true, "Correct!"],
            ["He is close to me.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I live nearby the park.'",
        answers: ["I live near the park", "near the park"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Is there a pharmacy ______?'",
        answers: [
            ["nearby", true, "Correct!"],
            ["near", false, "Wrong. (Need a noun after 'near')."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'We are ______ the end.'",
        answers: [
            ["near", true, "Correct!"],
            ["closeby", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is better?",
        answers: [
            ["Close to the hospital", true, "Correct!"],
            ["Close the hospital", false, "Wrong. (That's a verb!)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the phrase: 'A nearby town.'",
        answers: ["A nearby town", "a town nearby"]
    },
    9: {
        type: "radio",
        question: "Can 'nearby' be used as an adjective before a noun?",
        answers: [
            ["Yes (e.g., a nearby restaurant).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["Near here", true, "Correct!"],
            ["Nearby here", false, "Wrong."],
            ["Closeby", true, "Correct! (As an adverb)."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'The park is near' correct?",
        answers: [
            ["Yes, as an adjective/adverb.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The restaurant is nearby the hotel.'",
        answers: ["The restaurant is near the hotel", "near the hotel"]
    }
},

// 0296 Good vs Well
"0296": {
    1: {
        type: "radio",
        question: "Which word is an adjective (modifies a noun)?",
        answers: [
            ["Good", true, "Correct!"],
            ["Well", false, "Wrong (Well is an adverb)."]
        ]
    },
    2: {
        type: "radio",
        question: "Which word is an adverb (modifies a verb)?",
        answers: [
            ["Well", true, "Correct!"],
            ["Good", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["The pizza is good.", true, "Correct!"],
            ["She plays well.", true, "Correct!"],
            ["She plays good.", false, "Wrong."],
            ["He is a good student.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I speak English good.'",
        answers: ["I speak English well", "well"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'You did a ______ job!'",
        answers: [
            ["good", true, "Correct!"],
            ["well", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I didn't sleep ______.'",
        answers: [
            ["well", true, "Correct!"],
            ["good", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for health?",
        answers: [
            ["I don't feel well.", true, "Correct!"],
            ["I don't feel good.", true, "Correct! (Used informally for emotions/health)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the adverb of 'good'?",
        answers: ["well"]
    },
    9: {
        type: "radio",
        question: "Is 'The team played good' correct?",
        answers: [
            ["No, it should be 'well'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["Good news", true, "Correct!"],
            ["Sleep well", true, "Correct!"],
            ["Eat good", false, "Wrong (Eat well)."]
        ]
    },
    11: {
        type: "radio",
        question: "Can 'well' be an adjective?",
        answers: [
            ["Yes, only for health.", true, "Correct!"],
            ["No, never.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'He drives very good.'",
        answers: ["He drives very well"]
    }
},

// 0297 Hard vs Hardly
"0297": {
    1: {
        type: "radio",
        question: "Which word means 'with a lot of effort'?",
        answers: [
            ["Hard", true, "Correct!"],
            ["Hardly", false, "Wrong. 'Hardly' means 'almost not'."]
        ]
    },
    2: {
        type: "radio",
        question: "Which word means 'barely' or 'almost not'?",
        answers: [
            ["Hardly", true, "Correct!"],
            ["Hard", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["I work hard.", true, "Correct!"],
            ["I can hardly hear you.", true, "Correct!"],
            ["I can hard hear you.", false, "Wrong."],
            ["It is a hard bed.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I hardly studied, so I passed.' (If you mean you studied a lot)",
        answers: ["I studied hard"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'It is ______ raining.' (meaning almost not raining)",
        answers: [
            ["hardly", true, "Correct!"],
            ["hard", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'It is raining ______.' (meaning a heavy storm)",
        answers: [
            ["hard", true, "Correct!"],
            ["hardly", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I can hardly wait!", true, "Correct!"],
            ["I can hard wait!", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What does 'hardly ever' mean?",
        answers: ["almost never", "very rarely"]
    },
    9: {
        type: "radio",
        question: "Is 'He works hardly' a compliment?",
        answers: [
            ["No, it means he does almost no work.", true, "Correct!"],
            ["Yes, it means he is a hero.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct meanings:",
        answers: [
            ["Hardly any = almost none", true, "Correct!"],
            ["Hard work = difficult work", true, "Correct!"],
            ["Work hardly = work with effort", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Where is 'hardly' usually placed?",
        answers: [
            ["Before the verb (e.g., I hardly know her).", true, "Correct!"],
            ["At the end of the sentence.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The exams were hardly.' (meaning difficult)",
        answers: ["The exams were hard"]
    }
},

// 0300 Auxiliary 'Be'
"0300": {
    1: {
        type: "radio",
        question: "What is the correct form for 'I' in the past?",
        answers: [
            ["I was", true, "Correct!"],
            ["I were", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "What is the correct form for 'They' in the past?",
        answers: [
            ["They were", true, "Correct!"],
            ["They was", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct forms of 'be'?",
        answers: [
            ["You were", true, "Correct!"],
            ["He is", true, "Correct!"],
            ["They is", false, "Wrong."],
            ["We was", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "What is the past form of 'it is'?",
        answers: ["it was"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We ______ not happy with the result.'",
        answers: [
            ["were", true, "Correct!"],
            ["was", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She ______ at work yesterday.'",
        answers: [
            ["was", true, "Correct!"],
            ["were", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["You are my friend.", true, "Correct!"],
            ["You is my friend.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'The movies was great.'",
        answers: ["The movies were great"]
    },
    9: {
        type: "radio",
        question: "Is 'I am' the present form of 'I was'?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct past tense forms:",
        answers: [
            ["She was", true, "Correct!"],
            ["They were", true, "Correct!"],
            ["It were", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Can 'be' be used as an auxiliary for the continuous tense (e.g., I am eating)?",
        answers: [
            ["Yes.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'Why was you late?'",
        answers: ["Why were you late?"]
    }
},

// 0310 Present Simple -s
"0310": {
    1: {
        type: "radio",
        question: "Which pronouns require the verb to end in '-s' in the present simple?",
        answers: [
            ["He, She, It", true, "Correct!"],
            ["I, You, We, They", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'She play tennis' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'She plays tennis'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct present simple forms?",
        answers: [
            ["He works", true, "Correct!"],
            ["They works", false, "Wrong."],
            ["It works", true, "Correct!"],
            ["I works", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The sun rise in the east.'",
        answers: ["The sun rises in the east", "rises"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'My brother ______ in London.'",
        answers: [
            ["lives", true, "Correct!"],
            ["live", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'It ______ very well.'",
        answers: [
            ["works", true, "Correct!"],
            ["work", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for the negative?",
        answers: [
            ["She doesn't like pizza.", true, "Correct! (The -s is on 'does')."],
            ["She doesn't likes pizza.", false, "Wrong. (Don't double the -s)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'She do not go.'",
        answers: ["She does not go"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["A cat sleeps a lot.", true, "Correct!"],
            ["Cats sleeps a lot.", false, "Wrong. (Plural 'cats' doesn't need -s on the verb)."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct 3rd person singular verbs:",
        answers: [
            ["He watches", true, "Correct!"],
            ["She flys", false, "Wrong (flies)."],
            ["It goes", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'Everyone knows him' correct?",
        answers: [
            ["True", true, "Correct! 'Everyone' is singular."],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'He have a car.'",
        answers: ["He has a car"]
    }
},

// 0320 Negative Form (S A not P)
"0320": {
    1: {
        type: "radio",
        question: "What is the standard order for a negative sentence?",
        answers: [
            ["Subject + Auxiliary + not + Principal Verb", true, "Correct! (e.g., I do not go)."],
            ["Subject + Principal Verb + not", false, "Wrong. (e.g., I go not is incorrect)."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I eat not meat' correct?",
        answers: [
            ["True", false, "Wrong. Use 'I do not eat meat'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct negative forms?",
        answers: [
            ["I do not know.", true, "Correct!"],
            ["She does not smoke.", true, "Correct!"],
            ["They not arrive.", false, "Wrong."],
            ["We did not see it.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He works not here.'",
        answers: ["He does not work here", "He doesn't work here"]
    },
    5: {
        type: "radio",
        question: "What is the auxiliary for the negative in the present simple?",
        answers: [
            ["Do / Does", true, "Correct!"],
            ["Have", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "What is the auxiliary for the negative in the past simple?",
        answers: [
            ["Did", true, "Correct!"],
            ["Was", false, "Wrong (except for the verb 'be')."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I don't have time.", true, "Correct!"],
            ["I haven't time.", false, "Wrong (in modern standard English, 'do' is preferred)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Put in order: (not / he / go / did)",
        answers: ["he did not go"]
    },
    9: {
        type: "radio",
        question: "Can we say 'I can not'?",
        answers: [
            ["Yes, 'cannot' is the auxiliary/principal combined.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct structures:",
        answers: [
            ["S + A + not + P", true, "Correct!"],
            ["She did not like it.", true, "Correct!"],
            ["She liked not it.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'They don't are happy' correct?",
        answers: [
            ["No, 'be' is a special case and doesn't use 'do'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I not want it.'",
        answers: ["I do not want it", "I don't want it"]
    }
},

// 0321 Question Form (A S P)
"0321": {
    1: {
        type: "radio",
        question: "What is the standard order for a question in English?",
        answers: [
            ["Auxiliary + Subject + Principal Verb", true, "Correct! (e.g., Do you know?)."],
            ["Subject + Verb", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'What means this word?' correct?",
        answers: [
            ["True", false, "Wrong. It should be 'What does this word mean?'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct question forms?",
        answers: [
            ["Do you like coffee?", true, "Correct!"],
            ["Where she went?", false, "Wrong."],
            ["Did she go?", true, "Correct!"],
            ["What is it?", true, "Correct! (Be is special)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Where went they?'",
        answers: ["Where did they go?"]
    },
    5: {
        type: "radio",
        question: "What is the order if there is a 'Wh-' word (like Who, Where)?",
        answers: [
            ["Wh- + A + S + P", true, "Correct!"],
            ["Wh- + S + P", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: '______ you see the movie?'",
        answers: [
            ["Did", true, "Correct!"],
            ["Have", false, "Wrong (would need past participle 'seen')."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Does he work here?", true, "Correct!"],
            ["Works he here?", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Put in order: (you / why / did / leave)",
        answers: ["why did you leave"]
    },
    9: {
        type: "radio",
        question: "Is 'Are you ready?' a correct A S P form?",
        answers: [
            ["Yes, 'be' acts as its own auxiliary.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct questions:",
        answers: [
            ["Can you help me?", true, "Correct!"],
            ["How much does it cost?", true, "Correct!"],
            ["How much costs it?", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'You like pizza?' a correct question in formal writing?",
        answers: [
            ["No, you must use 'Do you like pizza?'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'What you want?'",
        answers: ["What do you want?"]
    }
},

// 0322 Modal + principal verb (no 'to')
"0322": {
    1: {
        type: "radio",
        question: "Do you use 'to' between a modal verb (can, must, should) and the main verb?",
        answers: [
            ["No", true, "Correct! (e.g., I must go)."],
            ["Yes", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I must to work.", false, "Wrong."],
            ["I must work.", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct modal constructions?",
        answers: [
            ["I can swim.", true, "Correct!"],
            ["You should to study.", false, "Wrong."],
            ["They might come.", true, "Correct!"],
            ["We would like to go.", true, "Correct! ('would like' is an exception where 'to' follows 'like', not 'would')."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He can to speak English.'",
        answers: ["He can speak English"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'You should ______ more.'",
        answers: [
            ["exercise", true, "Correct!"],
            ["to exercise", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Is 'I must go' the same as 'I have to go'?",
        answers: [
            ["Yes, but 'have' is not a modal, so it needs 'to'.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["We will be late.", true, "Correct!"],
            ["We will to be late.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'She can ____.' (meaning she knows how to run)",
        answers: ["run"]
    },
    9: {
        type: "radio",
        question: "Can we say 'I might to go'?",
        answers: [
            ["No, say 'I might go'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct modal sentences:",
        answers: [
            ["I could hear you.", true, "Correct!"],
            ["May I to come in?", false, "Wrong."],
            ["Shall we dance?", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Ought to' is a modal that actually uses 'to'.",
        answers: [
            ["True, it is a rare exception.", true, "Correct!"],
            ["False.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'You must to see this film.'",
        answers: ["You must see this film"]
    }
},

// 0330/0331 Negative/Question in Past Simple (A S P / S A not P)
"0330": {
    1: {
        type: "radio",
        question: "In a negative past simple sentence, what happens to the principal verb?",
        answers: [
            ["It returns to the infinitive form.", true, "Correct! (e.g., I didn't GO)."],
            ["It stays in the past form.", false, "Wrong. (e.g., I didn't went is incorrect)."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is the correct negative for 'I went'?",
        answers: [
            ["I didn't go.", true, "Correct!"],
            ["I didn't went.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these questions are correct?",
        answers: [
            ["Did you see him?", true, "Correct!"],
            ["Did you saw him?", false, "Wrong."],
            ["Did they arrive?", true, "Correct!"],
            ["Did they arrived?", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'She didn't chose the red one.'",
        answers: ["She didn't choose the red one", "didn't choose"]
    },
    5: {
        type: "radio",
        question: "What is the auxiliary for all past simple questions?",
        answers: [
            ["Did", true, "Correct!"],
            ["Done", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I ______ not see it.'",
        answers: [
            ["did", true, "Correct!"],
            ["do", false, "Wrong (this would be present)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Why didn't you tell me?", true, "Correct!"],
            ["Why didn't you told me?", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'Did you went to the party?'",
        answers: ["Did you go to the party?"]
    },
    9: {
        type: "radio",
        question: "Is 'I didn't have' the correct past negative of 'I had'?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct negative/question structures:",
        answers: [
            ["Did + Subject + Infinitive", true, "Correct!"],
            ["Subject + didn't + Infinitive", true, "Correct!"],
            ["I didn't ate lunch.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Can we say 'I didn't be'?",
        answers: [
            ["No, 'be' is special (I was not).", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'They didn't liked the food.'",
        answers: ["They didn't like the food"]
    }
},

// 0332 No 'do/did' in positive statements
"0332": {
    1: {
        type: "radio",
        question: "Do you normally use 'do' or 'did' in a positive statement (e.g., I went)?",
        answers: [
            ["No", true, "Correct! (Unless you are emphasizing something)."],
            ["Yes", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is the standard positive way to say you ate dinner?",
        answers: [
            ["I ate dinner.", true, "Correct!"],
            ["I did eat dinner.", false, "Wrong (unnecessary auxiliary)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct positive sentences?",
        answers: [
            ["He lives in Rome.", true, "Correct!"],
            ["He does live in Rome.", false, "Wrong."],
            ["We saw the film.", true, "Correct!"],
            ["We did see the film.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I do work here.' (for a normal statement)",
        answers: ["I work here"]
    },
    5: {
        type: "radio",
        question: "When might someone actually say 'I do like it'?",
        answers: [
            ["To emphasize or contradict someone.", true, "Correct!"],
            ["In every normal sentence.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She ______ to school yesterday.'",
        answers: [
            ["went", true, "Correct!"],
            ["did go", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["They arrive at 6 PM.", true, "Correct!"],
            ["They do arrive at 6 PM.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Fix this: 'I did find my keys.'",
        answers: ["I found my keys"]
    },
    9: {
        type: "radio",
        question: "Is 'He does eats' correct?",
        answers: [
            ["No, never double the -s.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the standard positive forms:",
        answers: [
            ["I like music.", true, "Correct!"],
            ["I did like music.", false, "Wrong."],
            ["He came home.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: In most European languages, there is no 'do' support, so this error is common.",
        answers: [
            ["True.", true, "Correct!"],
            ["False.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'I did see you last week.'",
        answers: ["I saw you last week"]
    }
},

// 0335 Special Case: 'Be' as Principal Verb
"0335": {
    1: {
        type: "radio",
        question: "Does the verb 'be' (am, is, are, was, were) use 'do' or 'did' for negatives?",
        answers: [
            ["No, it acts as its own auxiliary.", true, "Correct! (e.g., I am not)."],
            ["Yes, you say 'I do not be'." , false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct for the past negative?",
        answers: [
            ["I was not happy.", true, "Correct!"],
            ["I did not be happy.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct negative forms of 'be'?",
        answers: [
            ["They are not here.", true, "Correct!"],
            ["They don't be here.", false, "Wrong."],
            ["She was not late.", true, "Correct!"],
            ["She didn't be late.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Why do you be angry?'",
        answers: ["Why are you angry?"]
    },
    5: {
        type: "radio",
        question: "How do you make a question with 'be' in the past?",
        answers: [
            ["Were you late?", true, "Correct!"],
            ["Did you be late?", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I ______ not hungry.'",
        answers: [
            ["am", true, "Correct!"],
            ["do be", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["He is not a doctor.", true, "Correct!"],
            ["He doesn't be a doctor.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'She didn't be there.'",
        answers: ["She wasn't there", "She was not there"]
    },
    9: {
        type: "radio",
        question: "Is 'Be you ready?' correct?",
        answers: [
            ["No, use 'Are you ready?'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct 'be' questions:",
        answers: [
            ["Is she coming?", true, "Correct!"],
            ["Was it cold?", true, "Correct!"],
            ["Did it be cold?", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "Does 'be' follow the A S P pattern in questions?",
        answers: [
            ["Yes, but 'be' is both the A and the P.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'We don't be ready yet.'",
        answers: ["We aren't ready yet", "We are not ready yet"]
    }
},


// 0400 Invalid Auxiliary/Principal Combination
"0400": {
    1: {
        type: "radio",
        question: "Which principal verb form must follow the auxiliary 'have' in a perfect tense?",
        answers: [
            ["Past Participle (e.g., seen, gone)", true, "Correct! 'Have' always pairs with the past participle."],
            ["Infinitive (e.g., see, go)", false, "Wrong. 'Have see' is never correct."],
            ["Gerund (-ing)", false, "Wrong."]
        ]
    },
    2: {
        type: "checkbox",
        question: "Which of these combinations are grammatically CORRECT?",
        answers: [
            ["I can swimming", false, "Wrong. Modals like 'can' need the infinitive 'swim'."],
            ["He is eating", true, "Correct! 'Be' + '-ing' forms the continuous tense."],
            ["They did went", false, "Wrong. 'Did' must be followed by the infinitive 'go'."],
            ["We have finished", true, "Correct! 'Have' + past participle."]
        ]
    },
    3: {
        type: "radio",
        question: "What form of the principal verb follows modal verbs like 'must', 'should', or 'will'?",
        answers: [
            ["Base infinitive (without 'to')", true, "Correct! (e.g., must go, will see)."],
            ["Past participle", false, "Wrong."],
            ["Gerund (-ing)", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the combination: 'She is go to the park.'",
        answers: ["She is going to the park", "She goes to the park"]
    },
    5: {
        type: "radio",
        question: "Is 'I have drank the water' correct?",
        answers: [
            ["True", false, "Wrong. 'Drank' is past simple; the past participle is 'drunk'."],
            ["False", true, "Correct! It should be 'I have drunk'."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'You shouldn't ______ so much coffee.'",
        answers: [
            ["drink", true, "Correct! Modal + Infinitive."],
            ["drank", false, "Wrong."],
            ["drinking", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which auxiliary combines with the past participle to form the passive voice?",
        answers: [
            ["Be (is, was, were)", true, "Correct! (e.g., It was made)."],
            ["Do (do, does, did)", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the combination: 'Did you saw him?'",
        answers: ["Did you see him?"]
    },
    9: {
        type: "radio",
        question: "In the present perfect continuous, 'have' is followed by 'been'. What follows 'been'?",
        answers: [
            ["The -ing form (e.g., working)", true, "Correct! 'I have been working'."],
            ["The infinitive", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the INCORRECT combinations:",
        answers: [
            ["I have ate", true, "Incorrect. Should be 'I have eaten'."],
            ["He was seen", false, "Correct."],
            ["They might coming", true, "Incorrect. Should be 'They might come'."],
            ["We are done", false, "Correct."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: The auxiliary 'do' is only used with the base infinitive form of a verb.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct the sentence: 'She has already do it.'",
        answers: ["She has already done it"]
    }
},

// 0410 Prohibition vs Lack of Obligation
"0410": {
    1: {
        type: "radio",
        question: "Which phrase means 'it is not necessary' (optional)?",
        answers: [
            ["Don't have to", true, "Correct! This means you can do it if you want, but you aren't required to."],
            ["Must not", false, "Wrong. This means it is forbidden."]
        ]
    },
    2: {
        type: "radio",
        question: "Which phrase means 'it is forbidden' (prohibited)?",
        answers: [
            ["Must not", true, "Correct!"],
            ["Don't have to", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "In a library, which is the correct instruction?",
        answers: [
            ["You must not speak loudly.", true, "Correct! (Prohibition)."],
            ["You don't have to speak loudly.", false, "Wrong. (This implies you can if you want, which is not the rule)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "If admission is free, you '____ ____ ____ pay'.",
        answers: ["don't have to", "do not have to"]
    },
    5: {
        type: "radio",
        question: "Is 'You don't have to smoke here' a strong enough warning for a gas station?",
        answers: [
            ["No, because it implies you could smoke if you wanted to.", true, "Correct! You should say 'You must not smoke'."],
            ["Yes, it's very clear.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'You ______ wear a tie to the office, but most people do.'",
        answers: [
            ["don't have to", true, "Correct! (Lack of obligation)."],
            ["must not", false, "Wrong. (This would mean ties are banned)."]
        ]
    },
    7: {
        type: "radio",
        question: "What is another way to say 'must not'?",
        answers: [
            ["Can't", true, "Correct! 'You can't park here' means the same as 'You must not park here'."],
            ["Needn't", false, "Wrong. 'Needn't' is like 'don't have to'."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'You don't have to touch that wire! It's dangerous!'",
        answers: ["You must not touch", "You can't touch", "You mustn't touch"]
    },
    9: {
        type: "radio",
        question: "Which sentence describes a choice?",
        answers: [
            ["You don't have to come if you're tired.", true, "Correct!"],
            ["You must not come if you're tired.", false, "Wrong. (That's a prohibition)."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the 'Prohibition' (Forbidden) examples:",
        answers: [
            ["You mustn't drive without a license.", true, "Correct!"],
            ["You don't have to drive; we can take the bus.", false, "Wrong. (Choice)."],
            ["You can't use your phone during the exam.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "Does 'don't have to' mean the same as French 'ne pas devoir'?",
        answers: [
            ["No. In French 'ne pas devoir' often means prohibition, but in English 'don't have to' never does.", true, "Correct!"],
            ["Yes, they are identical.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'In soccer, you don't have to touch the ball with your hands.'",
        answers: ["you must not touch", "you mustn't touch", "you can't touch"]
    }
},

// 0412 Would in Condition Clause
"0412": {
    1: {
        type: "radio",
        question: "In an 'If' clause (the condition), should you use 'would'?",
        answers: [
            ["No, use the past simple (for 2nd conditional).", true, "Correct! 'If I were', not 'If I would be'."],
            ["Yes, it makes it more polite.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which part of the sentence usually contains 'would'?",
        answers: [
            ["The result clause (e.g., ...I would buy a car).", true, "Correct!"],
            ["The 'if' clause (e.g., If I would have...).", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these sentences are correct?",
        answers: [
            ["If I won the lottery, I would buy a boat.", true, "Correct!"],
            ["If I would win the lottery, I would buy a boat.", false, "Wrong. No 'would' in the 'if' part."],
            ["I would be happy if you came.", true, "Correct!"],
            ["I would be happy if you would come.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'If I would be you, I would go.'",
        answers: ["If I were you, I would go", "If I was you, I would go"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'If he ______ more time, he would travel.'",
        answers: [
            ["had", true, "Correct!"],
            ["would have", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Is 'If it would rain, I would stay home' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'If it rained'."],
            ["False", true, "Correct!"]
        ]
    },
    7: {
        type: "radio",
        question: "When referring to a hypothetical present, the 'if' clause uses:",
        answers: [
            ["Past Simple", true, "Correct!"],
            ["Future with 'will'", false, "Wrong."],
            ["Would", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'If I would know her name, I would tell you.'",
        answers: ["If I knew her name", "If I knew her name, I would tell you"]
    },
    9: {
        type: "radio",
        question: "Which is more natural?",
        answers: [
            ["I'd tell you if I knew.", true, "Correct!"],
            ["I'd tell you if I would know.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the INCORRECT conditionals:",
        answers: [
            ["If I would have money, I'd go.", true, "Incorrect."],
            ["If I had money, I'd go.", false, "Correct."],
            ["If you would help me, I'd finish.", true, "Incorrect (should be 'If you helped me')."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using 'would' in both parts of a conditional is a common error for German speakers because of the 'wenn... würde...' structure.",
        answers: [
            ["True", true, "Correct! English requires the past simple in the 'if' part."],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'If I would see him, I would say hello.'",
        answers: ["If I saw him, I would say hello", "If I saw him"]
    }
},

// 0415 Will vs Want
"0415": {
    1: {
        type: "radio",
        question: "Which word expresses a desire (I want to)?",
        answers: [
            ["Want", true, "Correct!"],
            ["Will", false, "Wrong. 'Will' is for the future."]
        ]
    },
    2: {
        type: "radio",
        question: "What does 'I will go' mean?",
        answers: [
            ["I am going in the future (future tense).", true, "Correct!"],
            ["I want to go (desire).", false, "Wrong. This is a common confusion with German 'will'."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these correctly express a desire?",
        answers: [
            ["I want a coffee.", true, "Correct!"],
            ["I will a coffee.", false, "Wrong. This just sounds like you are announcing the future existence of a coffee."],
            ["I would like a coffee.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "How do you say 'Je veux manger' in English?",
        answers: ["I want to eat", "I would like to eat"]
    },
    5: {
        type: "radio",
        question: "Is 'I will not go' the same as 'I don't want to go'?",
        answers: [
            ["No. One is future; the other is desire.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I ______ to go to sleep now.' (desire)",
        answers: [
            ["want", true, "Correct!"],
            ["will", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "If a German speaker says 'Ich will...', what should they usually say in English?",
        answers: [
            ["I want...", true, "Correct!"],
            ["I will...", false, "Wrong. This is the 'false friend' error."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'I will a pizza.' (Meaning: I want to order/eat one)",
        answers: ["I want a pizza", "I'll have a pizza", "I would like a pizza"]
    },
    9: {
        type: "radio",
        question: "Which word functions as a future auxiliary?",
        answers: [
            ["Will", true, "Correct!"],
            ["Want", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the sentences expressing FUTURE (not desire):",
        answers: [
            ["It will rain tomorrow.", true, "Correct!"],
            ["I want a new car.", false, "Wrong. (Desire)."],
            ["They will arrive at six.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'I would' is sometimes used for desire (I would like), but 'will' is purely for the future/intention.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'I will to stay home because I'm tired.' (Meaning: I want to)",
        answers: ["I want to stay home", "I'd like to stay home"]
    }
},

// 0416 Will in 2nd Conditional
"0416": {
    1: {
        type: "radio",
        question: "In a 2nd conditional (hypothetical), what word belongs in the result clause?",
        answers: [
            ["Would", true, "Correct! (e.g., I would go)."],
            ["Will", false, "Wrong. 'Will' is for real possibilities in the future (1st conditional)."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is a correct 2nd conditional sentence?",
        answers: [
            ["If I had time, I would help you.", true, "Correct!"],
            ["If I had time, I will help you.", false, "Wrong. You can't mix past 'had' with future 'will'."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which are INCORRECT?",
        answers: [
            ["If I were you, I will do it.", true, "Incorrect. Use 'would'."],
            ["If she lived here, we will see her often.", true, "Incorrect. Use 'would'."],
            ["If he arrived now, we would be happy.", false, "Correct."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'If I was rich, I will buy a mansion.'",
        answers: ["I would buy a mansion", "would buy"]
    },
    5: {
        type: "radio",
        question: "If the 'if' part uses 'if I find', you use 'will'. If it uses 'if I found', you use ______?",
        answers: [
            ["would", true, "Correct!"],
            ["will", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'If they asked us, we ______ say yes.'",
        answers: [
            ["would", true, "Correct!"],
            ["will", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Is 'I will travel more if I were retired' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'I would travel'."] ,
            ["False", true, "Correct!"]
        ]
    },
    8: {
        type: "text_multi",
        question: "Fix this: 'If it snowed in July, people will be surprised.'",
        answers: ["people would be surprised", "would be"]
    },
    9: {
        type: "radio",
        question: "Which form is used for an imaginary/unlikely situation?",
        answers: [
            ["If + past, would + infinitive", true, "Correct!"],
            ["If + past, will + infinitive", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct hypothetical results:",
        answers: [
            ["I would tell her.", true, "Correct!"],
            ["I will tell her.", false, "Wrong (too definite/real)."],
            ["We would be late.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Will' is for the 1st conditional; 'Would' is for the 2nd conditional.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'If I won, I will share the prize.'",
        answers: ["If I won, I would share", "I would share the prize"]
    }
},

// 0417 Past in Result Clause (2nd Conditional)
"0417": {
    1: {
        type: "radio",
        question: "In the second part (result) of a 2nd conditional, do you use the past simple?",
        answers: [
            ["No, use 'would + infinitive'.", true, "Correct!"],
            ["Yes, to match the first part.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["If I were king, I would make a law.", true, "Correct!"],
            ["If I were king, I made a law.", false, "Wrong. 'Made' is past simple, not a hypothetical result."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the INCORRECT sentences:",
        answers: [
            ["If it rained, we stayed inside.", true, "Incorrect (unless talking about a past habit, but wrong for a conditional). Should be 'would stay'."],
            ["If I knew, I told you.", true, "Incorrect. Should be 'would tell you'."],
            ["If he saw me, he would wave.", false, "Correct."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'If I had a car, I drove to work.'",
        answers: ["I would drive to work", "would drive"]
    },
    5: {
        type: "radio",
        question: "Where does the 'past simple' belong in a conditional sentence?",
        answers: [
            ["Only in the 'if' clause (condition).", true, "Correct!"],
            ["Only in the result clause.", false, "Wrong."],
            ["In both parts.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'If she found her keys, she ______ leave.'",
        answers: [
            ["would", true, "Correct!"],
            ["left", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Is 'If you tried, you succeeded' a correct 2nd conditional?",
        answers: [
            ["No, it should be 'you would succeed'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'If I won, I traveled around the world.'",
        answers: ["I would travel around the world", "would travel"]
    },
    9: {
        type: "radio",
        question: "Which describes a hypothetical result?",
        answers: [
            ["I would call you.", true, "Correct!"],
            ["I called you.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct conditional results:",
        answers: [
            ["...it would be great.", true, "Correct!"],
            ["...it was great.", false, "Wrong."],
            ["...they would enjoy it.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: The 'result' clause is about what *would* happen, so it must use 'would'.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'If we had more money, we bought a boat.'",
        answers: ["we would buy a boat", "would buy"]
    }
},

// 0420 Irregular Verb Form
"0420": {
    1: {
        type: "radio",
        question: "What is the past simple of 'go'?",
        answers: [
            ["Went", true, "Correct!"],
            ["Goed", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "What is the past simple of 'buy'?",
        answers: [
            ["Bought", true, "Correct!"],
            ["Boughten", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these irregular forms are correct?",
        answers: [
            ["Fall -> Fell", true, "Correct!"],
            ["Feel -> Felt", true, "Correct!"],
            ["Write -> Writed", false, "Wrong (Wrote)."],
            ["Bring -> Brought", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "What is the past participle of 'eat'?",
        answers: ["eaten"]
    },
    5: {
        type: "radio",
        question: "Is 'I have saw him' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'I have seen'."],
            ["False", true, "Correct!"]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She ______ her keys yesterday.' (lose)",
        answers: [
            ["lost", true, "Correct!"],
            ["losed", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "What is the past of 'run'?",
        answers: [
            ["Ran", true, "Correct!"],
            ["Runned", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the spelling: 'He has choosen.'",
        answers: ["chosen"]
    },
    9: {
        type: "radio",
        question: "Which is the past of 'teach'?",
        answers: [
            ["Taught", true, "Correct!"],
            ["Teached", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct past forms:",
        answers: [
            ["Spoke", true, "Correct!"],
            ["Knowed", false, "Wrong (Knew)."],
            ["Caught", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Most irregular verbs change their internal vowel (e.g., sing -> sang).",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Write the past simple of 'think':",
        answers: ["thought"]
    }
},

// 0424 Pres Cont Overuse (vs Simple)
"0424": {
    1: {
        type: "radio",
        question: "Which tense is used for habits and regular routines?",
        answers: [
            ["Present Simple (e.g., I go)", true, "Correct!"],
            ["Present Continuous (e.g., I am going)", false, "Wrong. 'I am going' is for now."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I'm playing tennis every Saturday' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'I play tennis'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these represent regular habits?",
        answers: [
            ["I drink coffee every morning.", true, "Correct!"],
            ["I'm drinking coffee every morning.", false, "Wrong. (Continuous is for now)."],
            ["He travels by train to work.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I am taking the bus on Fridays.'",
        answers: ["I take the bus on Fridays", "I take the bus"]
    },
    5: {
        type: "radio",
        question: "When should you NOT use '-ing'?",
        answers: [
            ["For repeated, permanent situations.", true, "Correct!"],
            ["For actions happening right now.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'He ______ in a bank.' (permanent job)",
        answers: [
            ["works", true, "Correct!"],
            ["is working", false, "Wrong (unless it is only a temporary project)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which sounds more like a general truth?",
        answers: [
            ["Water boils at 100 degrees.", true, "Correct!"],
            ["Water is boiling at 100 degrees.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'I'm usually waking up at 7.'",
        answers: ["I usually wake up at 7", "I wake up at 7"]
    },
    9: {
        type: "radio",
        question: "Is 'She's always coming late' an exception?",
        answers: [
            ["Yes, 'always + -ing' is used to express annoyance.", true, "Correct!"],
            ["No, it's just wrong.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct habit sentences:",
        answers: [
            ["They go to France every summer.", true, "Correct!"],
            ["They are going to France every summer.", false, "Wrong."],
            ["She eats lunch at her desk.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Present continuous is for temporary actions; Present simple is for permanent ones.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I am living in Switzerland.' (if you mean permanently)",
        answers: ["I live in Switzerland"]
    }
},

// 0425 Pres Simple Overuse (vs Continuous)
"0425": {
    1: {
        type: "radio",
        question: "Which tense is used for an action happening exactly at this moment?",
        answers: [
            ["Present Continuous (I am doing)", true, "Correct!"],
            ["Present Simple (I do)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "If you see a bird flying right now, what do you say?",
        answers: [
            ["Look! A bird is flying.", true, "Correct!"],
            ["Look! A bird flies.", false, "Wrong. (That sounds like a general fact about birds)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are ongoing actions?",
        answers: [
            ["I am writing a letter now.", true, "Correct!"],
            ["I write letters every day.", false, "Wrong. (That's a habit)."],
            ["The economy is growing this month.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Listen! The phone rings.'",
        answers: ["The phone is ringing"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Wait a second, I ______ to someone on the other line.'",
        answers: [
            ["am talking", true, "Correct!"],
            ["talk", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which phrase suggests an ongoing trend?",
        answers: [
            ["Prices are going up these days.", true, "Correct!"],
            ["Prices go up these days.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Is 'I study right now' correct?",
        answers: [
            ["True", false, "Wrong. Use 'I am studying'."],
            ["False", true, "Correct!"]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'At the moment, he works in the garden.'",
        answers: ["At the moment, he is working in the garden", "he is working"]
    },
    9: {
        type: "radio",
        question: "Which tense do we use for a temporary situation (e.g., this week only)?",
        answers: [
            ["Present Continuous", true, "Correct!"],
            ["Present Simple", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct 'Right Now' sentences:",
        answers: [
            ["It's raining.", true, "Correct!"],
            ["Someone is knocking at the door.", true, "Correct!"],
            ["She speaks on the phone now.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: If you can add 'at the moment' to a sentence, you should usually use present continuous.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The weather changes as we speak.'",
        answers: ["The weather is changing"]
    }
},

// 0426 Pres Cont State Verbs
"0426": {
    1: {
        type: "radio",
        question: "Can you use 'knowing' in the continuous tense (e.g., I am knowing)?",
        answers: [
            ["No, 'know' is a state verb.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which of these is a 'state' verb that doesn't usually take -ing?",
        answers: [
            ["Believe", true, "Correct!"],
            ["Run", false, "Wrong (that's an action)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are WRONG?",
        answers: [
            ["I am wanting a sandwich.", true, "Incorrect. Should be 'I want'."],
            ["She is owning a car.", true, "Incorrect. Should be 'She owns'."],
            ["He is understanding me.", true, "Incorrect. Should be 'He understands'."],
            ["I am thinking.", false, "Correct. (Thinking is an mental action, but 'thinking that' for an opinion is a state)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I am needing your help.'",
        answers: ["I need your help", "I need"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'I ______ what you mean.'",
        answers: [
            ["understand", true, "Correct!"],
            ["am understanding", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'This laptop ______ to me.'",
        answers: [
            ["belongs", true, "Correct!"],
            ["is belonging", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I see what you mean.", true, "Correct!"],
            ["I am seeing what you mean.", false, "Wrong (unless you mean literally visiting a psychic)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'She is believing in ghosts.'",
        answers: ["She believes in ghosts"]
    },
    9: {
        type: "radio",
        question: "Are verbs of preference (like, love, hate) state verbs?",
        answers: [
            ["Yes, they should stay in the simple tense.", true, "Correct! (e.g., I love it)."],
            ["No.", false, "Wrong. (McDonald's 'I'm lovin' it' is a rare advertising exception)."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct state verb usage:",
        answers: [
            ["It smells good.", true, "Correct!"],
            ["It is smelling good.", false, "Wrong."],
            ["I remember you.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "Is 'I am having a party' correct?",
        answers: [
            ["Yes, because 'have' here is an action (hosting), not possession.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I am hearing you clearly.'",
        answers: ["I hear you clearly", "I can hear you"]
    }
},

// 0430 Pres Simple Overuse (vs Present Perfect)
"0430": {
    1: {
        type: "radio",
        question: "Which tense describes an action that started in the past and is still true now?",
        answers: [
            ["Present Perfect (I have lived)", true, "Correct!"],
            ["Present Simple (I live)", false, "Wrong. 'I live' doesn't specify the duration."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I am a teacher since 20 years' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'I have been a teacher for 20 years'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct for something starting in the past and continuing?",
        answers: [
            ["I have known him for a long time.", true, "Correct!"],
            ["I know him for a long time.", false, "Wrong."],
            ["We have been married since May.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I live here since 2010.'",
        answers: ["I have lived here since 2010", "I've lived here since 2010"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'She ______ in this office for six months.'",
        answers: [
            ["has worked", true, "Correct!"],
            ["works", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Does the word 'since' usually trigger the present perfect?",
        answers: [
            ["Yes.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I have had this car for three years.", true, "Correct!"],
            ["I have this car for three years.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'We are friends since we were kids.'",
        answers: ["We have been friends since we were kids"]
    },
    9: {
        type: "radio",
        question: "Can we use 'since' with the present simple?",
        answers: [
            ["No, it's almost always a mistake.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct 'Duration' sentences:",
        answers: [
            ["I've been sick all week.", true, "Correct!"],
            ["I'm sick all week.", false, "Wrong."],
            ["They have owned the house for years.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: In German/French, the present tense is used for 'since' situations, but English requires the Present Perfect.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The climate changes since the industrial revolution.'",
        answers: ["The climate has been changing", "The climate has changed"]
    }
},

// 0432 Past Simple Overuse (vs Present Perfect)
"0432": {
    1: {
        type: "radio",
        question: "Which tense do you use for a past action when the time is NOT specific?",
        answers: [
            ["Present Perfect (I have seen)", true, "Correct!"],
            ["Past Simple (I saw)", false, "Wrong. Past simple needs a specific time like 'yesterday'."]
        ]
    },
    2: {
        type: "radio",
        question: "If you want to say you've visited Paris many times in your life, you say:",
        answers: [
            ["I have been to Paris many times.", true, "Correct!"],
            ["I was in Paris many times.", false, "Wrong (implies you are talking about a specific finished period)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these describe indefinite time?",
        answers: [
            ["I have already eaten.", true, "Correct!"],
            ["I ate at 1 PM.", false, "Wrong. (Specific time)."],
            ["Have you ever seen a whale?", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Instead of 'I did it already', say: '____ ____ ____ ____.'",
        answers: ["I have already done it", "I've already done it"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We ______ that movie three times so far.'",
        answers: [
            ["have seen", true, "Correct!"],
            ["saw", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which phrase usually indicates the need for Present Perfect?",
        answers: [
            ["So far", true, "Correct!"],
            ["Yesterday", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is better?",
        answers: [
            ["I have finished my homework!", true, "Correct! (Result is important now)."],
            ["I finished my homework!", false, "Wrong (in British English especially)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'I was in London many times.'",
        answers: ["I have been to London many times"]
    },
    9: {
        type: "radio",
        question: "Is 'Did you ever hear this song?' correct?",
        answers: [
            ["It's better as 'Have you ever heard...'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct indefinite past sentences:",
        answers: [
            ["He has just arrived.", true, "Correct!"],
            ["He arrived just now.", false, "Wrong (requires past simple)."],
            ["She has never tried sushi.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: The present perfect is used when the result of the past action is relevant to the present.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I lost my keys!' (meaning you don't have them now)",
        answers: ["I have lost my keys", "I've lost my keys"]
    }
},

// 0433 Pres Perfect Simple vs Continuous
"0433": {
    1: {
        type: "radio",
        question: "Which tense emphasizes how long an action has been going on (duration)?",
        answers: [
            ["Present Perfect Continuous (I've been doing)", true, "Correct!"],
            ["Present Perfect Simple (I've done)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which tense emphasizes that an action is finished or a result has been reached?",
        answers: [
            ["Present Perfect Simple (I've painted the room)", true, "Correct!"],
            ["Present Perfect Continuous (I've been painting the room)", false, "Wrong (this implies you might still be painting)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these emphasize duration?",
        answers: [
            ["I have been waiting for two hours.", true, "Correct!"],
            ["I have waited for two hours.", false, "Correct, but less emphasis on the 'waiting' activity itself."],
            ["He has been running since this morning.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the sentence: 'I've written three emails.' (to emphasize the finished number)",
        answers: ["I have written three emails"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'My hands are dirty because I ______ in the garden.'",
        answers: [
            ["have been working", true, "Correct! (Activity in progress)."],
            ["have worked", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is better for 'How many'?",
        answers: [
            ["Present Perfect Simple (How many have you made?)", true, "Correct!"],
            ["Present Perfect Continuous", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is better for 'How long'?",
        answers: [
            ["Present Perfect Continuous (How long have you been waiting?)", true, "Correct!"],
            ["Present Perfect Simple", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'I've been finishing my homework.'",
        answers: ["I have finished my homework"]
    },
    9: {
        type: "radio",
        question: "Can state verbs (know, like) be used in the continuous form?",
        answers: [
            ["No, even in the perfect tense (e.g., I've known him, not I've been knowing).", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct 'Result' sentences:",
        answers: [
            ["I've broken my glass.", true, "Correct!"],
            ["I've been breaking my glass.", false, "Wrong."],
            ["She's found a new job.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: If you want to complain about how long someone was late, use the continuous form.",
        answers: [
            ["True (e.g., I've been standing here for an hour!).", true, "Correct!"],
            ["False.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I've been learning 50 new words today.' (emphasizing the result)",
        answers: ["I have learned 50 new words today"]
    }
},

// 0440 Pres Simple Overuse (vs Past Simple)
"0440": {
    1: {
        type: "radio",
        question: "Which tense should you use for an event that happened and finished last year?",
        answers: [
            ["Past Simple (I went)", true, "Correct!"],
            ["Present Simple (I go)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'Yesterday I see a movie' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'Yesterday I saw a movie'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these require the past tense?",
        answers: [
            ["Last month I visited my aunt.", true, "Correct!"],
            ["In 1999, they moved to Berlin.", true, "Correct!"],
            ["Usually, I visit my aunt.", false, "Wrong. (Habit)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'When I was a child, I play soccer.'",
        answers: ["I played soccer"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We ______ to Norway two years ago.'",
        answers: [
            ["traveled", true, "Correct!"],
            ["travel", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Suddenly, the door ______.'",
        answers: [
            ["opened", true, "Correct!"],
            ["opens", false, "Wrong (unless telling a story in the 'historical present')."]
        ]
    },
    7: {
        type: "radio",
        question: "Which sounds more like a past story?",
        answers: [
            ["He came in and sat down.", true, "Correct!"],
            ["He comes in and sits down.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'I arrive late for the meeting yesterday.'",
        answers: ["I arrived late"]
    },
    9: {
        type: "radio",
        question: "Is 'I didn't went' correct?",
        answers: [
            ["No, after 'didn't', use the infinitive 'go'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct past tense verbs:",
        answers: [
            ["He spoke.", true, "Correct!"],
            ["She buyed.", false, "Wrong (Bought)."],
            ["They knew.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: If you are talking about 'last week', all verbs in that context must be past tense.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Last night I eat a burger.'",
        answers: ["Last night I ate a burger"]
    }
},

// 0442 Pres Perf Overuse (vs Past Simple)
"0442": {
    1: {
        type: "radio",
        question: "Can you use the Present Perfect (I have done) with a specific finished time like 'yesterday'?",
        answers: [
            ["No, use the Past Simple.", true, "Correct! 'I did it yesterday', not 'I have done it yesterday'."],
            ["Yes.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct for an event in 2015?",
        answers: [
            ["I graduated in 2015.", true, "Correct!"],
            ["I have graduated in 2015.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the INCORRECT sentences:",
        answers: [
            ["I have seen him last night.", true, "Incorrect."],
            ["I saw him last night.", false, "Correct."],
            ["We have traveled to Asia in 2010.", true, "Incorrect."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I have finished my studies in June.'",
        answers: ["I finished my studies in June"]
    },
    5: {
        type: "radio",
        question: "If the time period is over (e.g., secondary school), which tense do you use?",
        answers: [
            ["Past Simple", true, "Correct!"],
            ["Present Perfect", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Shakespeare ______ many plays.'",
        answers: [
            ["wrote", true, "Correct! (He is no longer alive to write more)."],
            ["has written", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which sounds natural for yesterday's weather?",
        answers: [
            ["It was sunny yesterday.", true, "Correct!"],
            ["It has been sunny yesterday.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'I have had a big breakfast this morning.' (it is now afternoon)",
        answers: ["I had a big breakfast"]
    },
    9: {
        type: "radio",
        question: "Is 'I've worked there from 2005 to 2010' correct?",
        answers: [
            ["No, use past simple 'I worked'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct finished-time sentences:",
        answers: [
            ["She left five minutes ago.", true, "Correct!"],
            ["She has left five minutes ago.", false, "Wrong."],
            ["The package arrived on Monday.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: If the sentence has the word 'ago', you MUST use the past simple.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I have eaten at that restaurant last week.'",
        answers: ["I ate at that restaurant last week"]
    }
},

// 0445 Past Continuous Overuse
"0445": {
    1: {
        type: "radio",
        question: "When is the Past Continuous (I was doing) used?",
        answers: [
            ["For an action ongoing at a specific moment in the past.", true, "Correct!"],
            ["For a repeated habit in the past.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I was going to the beach every day when I was young' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'I went to the beach'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct uses of Past Continuous:",
        answers: [
            ["I was sleeping when the alarm went off.", true, "Correct!"],
            ["What were you doing at 8 PM yesterday?", true, "Correct!"],
            ["He was always eating apples.", true, "Correct! (Again, the 'always' exception for annoyance)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'As a child, I was playing the violin a lot.'",
        answers: ["I played the violin a lot", "I used to play"]
    },
    5: {
        type: "radio",
        question: "Which tense provides the 'background' for a specific event?",
        answers: [
            ["Past Continuous", true, "Correct! (e.g., The sun was shining when we left)."],
            ["Past Simple", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'While I ______ dinner, the phone rang.'",
        answers: [
            ["was cooking", true, "Correct!"],
            ["cooked", false, "Wrong (implied sequence, not background)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is better for a past habit?",
        answers: [
            ["I took the bus to school.", true, "Correct!"],
            ["I was taking the bus to school.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'Ten years ago, I was living in a small flat.' (if you mean a permanent state)",
        answers: ["I lived in a small flat"]
    },
    9: {
        type: "radio",
        question: "Is 'I was finishing my project yesterday' correct for a completed task?",
        answers: [
            ["No, use 'I finished'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify INCORRECT continuous usage:",
        answers: [
            ["I was knowing the answer.", true, "Incorrect (State verb)."],
            ["He was having a red car.", true, "Incorrect (Possession)."],
            ["They were talking loudly.", false, "Correct."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Use Past Simple for completed actions; Past Continuous for actions 'in progress'.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Every morning, I was waking up at 6 AM.'",
        answers: ["I woke up at 6 AM", "I used to wake up at 6 AM"]
    }
},

// 0447 Used To + Inf.
"0447": {
    1: {
        type: "radio",
        question: "What form follows 'used to' to describe a past habit?",
        answers: [
            ["Infinitive (e.g., play)", true, "Correct!"],
            ["-ing form (e.g., playing)", false, "Wrong (that's for 'be used to')."]
        ]
    },
    2: {
        type: "radio",
        question: "How do you form the negative of 'I used to play'?",
        answers: [
            ["I did not use to play", true, "Correct! (Note: 'use' loses the 'd')."],
            ["I used not to play", false, "Wrong (archaic)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["I used to smoke.", true, "Correct!"],
            ["I didn't use to like vegetables.", true, "Correct!"],
            ["I didn't used to like vegetables.", false, "Wrong (the 'd' is removed with 'did')."]
        ]
    },
    4: {
        type: "text_multi",
        question: "How do you ask a question about a past habit with 'use'?",
        answers: ["Did you use to"]
    },
    5: {
        type: "radio",
        question: "Does 'used to' exist in the present tense?",
        answers: [
            ["No. For present habits, just use the Present Simple.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Did they ______ live here?'",
        answers: [
            ["use to", true, "Correct!"],
            ["used to", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is better?",
        answers: [
            ["I used to have long hair.", true, "Correct!"],
            ["I was having long hair.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the spelling: 'I didn't used to swim.'",
        answers: ["I didn't use to swim"]
    },
    9: {
        type: "radio",
        question: "Is 'I'm used to' the same as 'I used to'?",
        answers: [
            ["No. 'I'm used to' means you are accustomed to something now.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct 'Habit' sentences:",
        answers: [
            ["I used to go to church.", true, "Correct!"],
            ["She used to be shy.", true, "Correct!"],
            ["I used to go to the gym tomorrow.", false, "Wrong (Future)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Used to' implies that the action no longer happens.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I am used to play tennis when I was 10.'",
        answers: ["I used to play tennis"]
    }
},

// 0448 Past Perfect Incorrect
"0448": {
    1: {
        type: "radio",
        question: "When should you use the Past Perfect (I had done)?",
        answers: [
            ["To describe an action that happened BEFORE another past action.", true, "Correct!"],
            ["To describe any action that happened a long time ago.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I had eaten lunch yesterday' a correct standalone sentence?",
        answers: [
            ["No, use 'I ate lunch'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the CORRECT uses of Past Perfect:",
        answers: [
            ["I arrived late because I had missed the bus.", true, "Correct! (The bus miss happened first)."],
            ["When I reached the station, the train had left.", true, "Correct!"],
            ["Ten years ago, I had moved to London.", false, "Wrong (No other past action to relate to)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the sentence: 'I had graduated in 2010.'",
        answers: ["I graduated in 2010"]
    },
    5: {
        type: "radio",
        question: "Which tense acts as the 'past of the past'?",
        answers: [
            ["Past Perfect", true, "Correct!"],
            ["Past Simple", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I didn't recognize him because he ______ so much.'",
        answers: [
            ["had changed", true, "Correct!"],
            ["changed", false, "Wrong (suggests he changed at the moment you saw him)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is better?",
        answers: [
            ["She told me she had already seen the film.", true, "Correct!"],
            ["She told me she has already seen the film.", false, "Wrong (sequence of tenses)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Fix this: 'I had gone to bed early last night.'",
        answers: ["I went to bed early last night"]
    },
    9: {
        type: "radio",
        question: "Is 'The film started when we arrived' different from 'The film had started when we arrived'?",
        answers: [
            ["Yes. 'Had started' means it was already playing when you got there.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify unnecessary Past Perfect:",
        answers: [
            ["I had seen that man before.", false, "Correct (implies you saw him before another time)."],
            ["Last week I had gone to the dentist.", true, "Incorrect."],
            ["In my youth I had played the piano.", true, "Incorrect."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Do not use 'had' just because an action is very old.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'She said she had finished yesterday.'",
        answers: ["She said she had finished"]
    }
},

// 0449 Past Perfect Underuse
"0449": {
    1: {
        type: "radio",
        question: "If you want to explain that you weren't hungry because of an earlier meal, which is better?",
        answers: [
            ["I wasn't hungry because I had eaten a big lunch.", true, "Correct!"],
            ["I wasn't hungry because I ate a big lunch.", false, "Wrong (sequence is less clear)."]
        ]
    },
    2: {
        type: "radio",
        question: "Which tense clarifies which of two past actions happened first?",
        answers: [
            ["Past Perfect", true, "Correct!"],
            ["Past Simple", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the sentences that NEED Past Perfect for clarity:",
        answers: [
            ["The meeting ______ (start) before I arrived.", true, "Correct! (had started)."],
            ["I realized I ______ (leave) my phone at home.", true, "Correct! (had left)."],
            ["I ______ (buy) a sandwich and ate it.", false, "Wrong (actions are in sequence)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the sentence: 'When I got home, my brother already ate my pizza.'",
        answers: ["had already eaten", "had already eaten my pizza"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'If I ______ known, I would have told you.'",
        answers: [
            ["had", true, "Correct!"],
            ["would have", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'He was tired because he ______ all night.'",
        answers: [
            ["had been working", true, "Correct!"],
            ["worked", false, "Wrong (suggests he worked after he was tired)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for reported speech?",
        answers: [
            ["He said he had lost his wallet.", true, "Correct!"],
            ["He said he lost his wallet.", false, "Incorrect (technically)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Complete the sentence: 'By the time I was 20, I ____ ____ to three different countries.'",
        answers: ["had been"]
    },
    9: {
        type: "radio",
        question: "Is 'The house was empty because everyone went out' clear?",
        answers: [
            ["It is clearer as 'everyone had gone out'.", true, "Correct!"],
            ["Yes, it's perfect.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["I had never seen such a thing until yesterday.", true, "Correct!"],
            ["I felt better after I had slept.", true, "Correct!"],
            ["I had went to the store.", false, "Wrong (Had gone)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Use Past Perfect to go 'backwards' in time from a past story.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'When I arrived, the party finished.' (meaning it was over already)",
        answers: ["the party had finished", "had finished"]
    }
},

// 0450 Future Definite vs Indefinite
"0450": {
    1: {
        type: "radio",
        question: "Which tense is best for a pre-planned appointment or a definite arrangement?",
        answers: [
            ["Present Continuous (I'm meeting him at 5).", true, "Correct!"],
            ["Future Simple (I will meet him).", false, "Wrong (this is more of a promise or unplanned decision)."]
        ]
    },
    2: {
        type: "radio",
        question: "Which tense is used for a prediction based on opinion?",
        answers: [
            ["Future Simple (I think they will win).", true, "Correct!"],
            ["Present Continuous", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the PLANNED actions:",
        answers: [
            ["I'm flying to Paris on Tuesday.", true, "Correct!"],
            ["I'll buy some milk later.", false, "Wrong. (Spontaneous)."],
            ["We're getting married in June.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Instead of 'I will play tennis tomorrow at 10 AM', say: 'I ____ ____ ____ tomorrow.'",
        answers: ["am playing tennis", "am playing"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Look at those clouds! It ______ rain.' (Prediction with evidence)",
        answers: [
            ["is going to", true, "Correct!"],
            ["will", false, "Wrong (less common for immediate physical evidence)."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Wait, I ______ help you with those bags.'",
        answers: [
            ["will", true, "Correct! (Spontaneous decision)."],
            ["am helping", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which sounds more like a confirmed plan?",
        answers: [
            ["I am seeing the doctor tomorrow.", true, "Correct!"],
            ["I will see the doctor tomorrow.", false, "Wrong (sounds like a vague intention)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing auxiliary: 'They ____ ____ to London next week.' (tickets are bought)",
        answers: ["are going"]
    },
    9: {
        type: "radio",
        question: "Can we use 'will' for a social arrangement?",
        answers: [
            ["It is better to use the continuous form.", true, "Correct!"],
            ["Yes, always.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct future predictions:",
        answers: [
            ["I think it will be a good day.", true, "Correct!"],
            ["In the future, cars will fly.", true, "Correct!"],
            ["In the future, cars are flying.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Use 'be going to' for intentions; 'will' for sudden decisions.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I will dinner with my parents tonight.' (It's a fixed plan)",
        answers: ["I am having dinner", "I'm having dinner"]
    }
},

// 0451 Future Continuous
"0451": {
    1: {
        type: "radio",
        question: "What does the Future Continuous (I will be doing) describe?",
        answers: [
            ["An action that will be in progress at a specific time in the future.", true, "Correct!"],
            ["A finished action in the future.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is a correct use of Future Continuous?",
        answers: [
            ["At this time tomorrow, I will be sitting on a plane.", true, "Correct!"],
            ["I will be sitting on a plane tomorrow.", false, "Wrong (lacks the specific time point context)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the CORRECT structures:",
        answers: [
            ["I will be working from 9 to 5 tomorrow.", true, "Correct!"],
            ["Will you be using your car tonight?", true, "Correct! (often used for polite requests)."],
            ["I will being working.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I will working when you arrive.'",
        answers: ["I will be working"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'This time next week, we ______ on the beach.'",
        answers: [
            ["will be lying", true, "Correct!"],
            ["will lie", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Is 'I will be coming to the party' a polite way to announce your arrival?",
        answers: [
            ["True", true, "Correct! It sounds less like a decision and more like a natural event."],
            ["False", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which describes an interrupted future action?",
        answers: [
            ["I'll be eating dinner when you call.", true, "Correct!"],
            ["I'll eat dinner when you call.", false, "Wrong (suggests you'll start eating *after* the call)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing part: 'I ____ ____ ____ tomorrow afternoon.' (sleep)",
        answers: ["will be sleeping"]
    },
    9: {
        type: "radio",
        question: "Can we use Future Continuous for a temporary future state?",
        answers: [
            ["Yes.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct future continuous sentences:",
        answers: [
            ["He will be sleeping.", true, "Correct!"],
            ["They will be traveling.", true, "Correct!"],
            ["She will be been working.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: The future continuous focuses on the 'duration' of an action in the future.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I will flying to New York this time tomorrow.'",
        answers: ["I will be flying"]
    }
},

// 0452 Future Perfect
"0452": {
    1: {
        type: "radio",
        question: "What does the Future Perfect (I will have done) describe?",
        answers: [
            ["An action that will be completed by a certain point in the future.", true, "Correct!"],
            ["An action that will start in the future.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which phrase is commonly used with the Future Perfect?",
        answers: [
            ["By the time...", true, "Correct! (e.g., By the time you arrive, I will have finished)."],
            ["When...", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the CORRECT structures:",
        answers: [
            ["I will have graduated by next year.", true, "Correct!"],
            ["I will have finish by 5 PM.", false, "Wrong (Need past participle 'finished')."],
            ["They will have arrived before we do.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I will have see the doctor by then.'",
        answers: ["I will have seen the doctor"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'By 2030, we ______ this house for ten years.'",
        answers: [
            ["will have owned", true, "Correct!"],
            ["will own", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Is 'I will have landed' the same as 'I will land'?",
        answers: [
            ["No. 'Will have landed' means the action is already over at that future point.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which describes a future deadline?",
        answers: [
            ["I will have finished the report by Friday.", true, "Correct!"],
            ["I am finishing the report on Friday.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing auxiliary: 'She ____ ____ ____ by the time we arrive.' (leave)",
        answers: ["will have left"]
    },
    9: {
        type: "radio",
        question: "Can we use Future Perfect for a prediction about the past?",
        answers: [
            ["Yes (e.g., He will have arrived by now).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct future perfect sentences:",
        answers: [
            ["I will have eaten.", true, "Correct!"],
            ["We will have spent everything.", true, "Correct!"],
            ["He will have being finished.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: The future perfect looks 'backwards' from a future point.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I will have arrive before you.'",
        answers: ["I will have arrived"]
    }
},


// 0510 Past Modals (should/could + have + past participle)
"0510": {
    1: {
        type: "radio",
        question: "How do you express regret about an action in the past using 'should'?",
        answers: [
            ["should + have + past participle", true, "Correct! 'I should have gone'."],
            ["should + past simple", false, "Wrong. 'I should went' is incorrect."],
            ["should + have + infinitive", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I could did it' correct?",
        answers: [
            ["True", false, "Wrong. It should be 'I could have done it'."],
            ["False", true, "Correct! Use the past participle after 'could have'."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these are correct past modal forms?",
        answers: [
            ["We should have called.", true, "Correct!"],
            ["They could have won.", true, "Correct!"],
            ["I shouldn't have ate that.", false, "Wrong. Should be 'shouldn't have eaten'."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I should have study harder.'",
        answers: ["I should have studied harder", "should have studied"]
    },
    5: {
        type: "radio",
        question: "What does 'You shouldn't have done that' imply?",
        answers: [
            ["Criticism or regret about a past action.", true, "Correct!"],
            ["A suggestion for the future.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'He ______ have told us the truth.'",
        answers: [
            ["could", true, "Correct! (Past possibility/criticism)."],
            ["can", false, "Wrong. 'Can' is present."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is the past participle of 'see' used in 'should have ____'?",
        answers: [
            ["seen", true, "Correct!"],
            ["saw", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Fix this: 'We could of helped.' (Common phonetic error)",
        answers: ["We could have helped"]
    },
    9: {
        type: "radio",
        question: "Which describes a missed opportunity?",
        answers: [
            ["I could have gone to the party.", true, "Correct!"],
            ["I could go to the party.", false, "Wrong (Present)."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct regret sentences:",
        answers: [
            ["I should have stayed.", true, "Correct!"],
            ["I shouldn't have lied.", true, "Correct!"],
            ["I should had stayed.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: The word 'have' never changes to 'has' in 'should have'.",
        answers: [
            ["True", true, "Correct! Modals are always followed by the base form 'have'."],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'You shoulded tell me.'",
        answers: ["You should have told me"]
    }
},

// 0520 Must in Past (Had to)
"0520": {
    1: {
        type: "radio",
        question: "Can you use 'must' to describe a past obligation (e.g., yesterday)?",
        answers: [
            ["No, use 'had to'.", true, "Correct!"],
            ["Yes, just add -ed.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct for a childhood memory?",
        answers: [
            ["I had to walk to school.", true, "Correct!"],
            ["I must walk to school.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct past obligations:",
        answers: [
            ["We had to leave early.", true, "Correct!"],
            ["They musted stay.", false, "Wrong."],
            ["Did you have to work?", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Yesterday I must finish my report.'",
        answers: ["Yesterday I had to finish my report", "I had to finish"]
    },
    5: {
        type: "radio",
        question: "What is the past form of 'I must'?",
        answers: [
            ["I had to", true, "Correct!"],
            ["I must have", false, "Wrong (that's for logical deduction, not obligation)."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Last year, she ______ wear a uniform.'",
        answers: [
            ["had to", true, "Correct!"],
            ["must", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for a future obligation?",
        answers: [
            ["I will have to go.", true, "Correct!"],
            ["I will must go.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'We musted wait for an hour.'",
        answers: ["We had to wait"]
    },
    9: {
        type: "radio",
        question: "Is 'I must have finished' an obligation in the past?",
        answers: [
            ["No, that means 'I probably finished'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct past forms of obligation:",
        answers: [
            ["I had to.", true, "Correct!"],
            ["I didn't have to.", true, "Correct!"],
            ["I mustn'ted.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Must' has no past tense form of its own.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'He musted help his father.'",
        answers: ["He had to help"]
    }
},

// 0530 Future in the Past (Will -> Would)
"0530": {
    1: {
        type: "radio",
        question: "If you are reporting a past promise, what does 'will' change to?",
        answers: [
            ["Would", true, "Correct! (e.g., He said he would help)."],
            ["Will", false, "Wrong (unless the event is still in the future)."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["She said she would call.", true, "Correct!"],
            ["She said she will call.", false, "Wrong (in reported past speech)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct 'Future in the Past' sentences:",
        answers: [
            ["I knew it would rain.", true, "Correct!"],
            ["He promised he will come.", false, "Wrong."],
            ["They thought they would win.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He told me he will arrive at six.'",
        answers: ["He told me he would arrive at six", "would arrive"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We didn't know that the party ______ be a surprise.'",
        answers: [
            ["would", true, "Correct!"],
            ["will", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which matches 'I thought'?",
        answers: [
            ["I thought it would be easy.", true, "Correct!"],
            ["I thought it will be easy.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "If a person says 'I will help', how do you report it later?",
        answers: [
            ["He said he would help.", true, "Correct!"],
            ["He said he will help.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Fix this: 'I was sure it will happen.'",
        answers: ["I was sure it would happen"]
    },
    9: {
        type: "radio",
        question: "Is 'would' the past form of 'will' in reported speech?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct sequences:",
        answers: [
            ["She hoped it would stop.", true, "Correct!"],
            ["She hopes it will stop.", true, "Correct!"],
            ["She hoped it will stop.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: This rule is necessary for 'backshifting' tenses in indirect speech.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'The boss said he will call us back.'",
        answers: ["The boss said he would call us back"]
    }
},

// 0540 Past of Can (Could / Was able to)
"0540": {
    1: {
        type: "radio",
        question: "What is the past tense of 'can' for general ability?",
        answers: [
            ["Could", true, "Correct!"],
            ["Caned", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'When I was five, I can swim' correct?",
        answers: [
            ["True", false, "Wrong. Use 'could'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct past abilities:",
        answers: [
            ["She could speak French as a child.", true, "Correct!"],
            ["I was able to finish the race.", true, "Correct!"],
            ["They can see the mountain yesterday.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He can't find his keys this morning.'",
        answers: ["He couldn't find his keys", "couldn't find"]
    },
    5: {
        type: "radio",
        question: "Which form is better for a specific one-time achievement in the past?",
        answers: [
            ["Was able to", true, "Correct!"],
            ["Could", false, "Wrong (Could is usually for general ability)."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'We ______ hear the noise from the street.'",
        answers: [
            ["could", true, "Correct!"],
            ["can", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is the correct negative form for the past?",
        answers: [
            ["Couldn't", true, "Correct!"],
            ["Cann't", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Fix this: 'I can play piano ten years ago.'",
        answers: ["I could play piano"]
    },
    9: {
        type: "radio",
        question: "Is 'could' the only past form of 'can'?",
        answers: [
            ["No, 'was able to' is also used.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct questions about the past:",
        answers: [
            ["Could you see the screen?", true, "Correct!"],
            ["Were you able to see?", true, "Correct!"],
            ["Can you see yesterday?", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Could' is also used for present requests, which can be confusing.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Correct: 'I can't sleep last night.'",
        answers: ["I couldn't sleep last night"]
    }
},

// 0710 Syntax (Verb + Object + Modifier)
"0710": {
    1: {
        type: "radio",
        question: "Where should an adverb usually go in a sentence with an object?",
        answers: [
            ["After the object (e.g., speak German fluently).", true, "Correct!"],
            ["Between the verb and the object (e.g., speak fluently German).", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I like very much pizza' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'I like pizza very much'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these have the correct word order?",
        answers: [
            ["He plays the guitar well.", true, "Correct!"],
            ["He plays well the guitar.", false, "Wrong."],
            ["She drinks coffee slowly.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the order: 'I wrote carefully the letter.'",
        answers: ["I wrote the letter carefully"]
    },
    5: {
        type: "radio",
        question: "Which structure is standard in English?",
        answers: [
            ["Verb + Object + Modifier", true, "Correct!"],
            ["Verb + Modifier + Object", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She ______.'",
        answers: [
            ["plays the piano beautifully", true, "Correct!"],
            ["plays beautifully the piano", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I understood the lesson perfectly.", true, "Correct!"],
            ["I understood perfectly the lesson.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct this: 'He speaks every day English.'",
        answers: ["He speaks English every day"]
    },
    9: {
        type: "radio",
        question: "Can an adverb ever come before the verb?",
        answers: [
            ["Yes (e.g., I often eat pizza), but not between the verb and object.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify INCORRECT word order:",
        answers: [
            ["I love very much my dog.", true, "Incorrect."],
            ["I love my dog very much.", false, "Correct."],
            ["She watched carefully the movie.", true, "Incorrect."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: In French or German, you can often put adverbs between the verb and object, which causes this error in English.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'We closed quickly the window.'",
        answers: ["We closed the window quickly"]
    }
},

// 0712 Preposition at the End
"0712": {
    1: {
        type: "radio",
        question: "In natural English questions, where does the preposition usually go?",
        answers: [
            ["At the end of the question.", true, "Correct!"],
            ["At the beginning of the question.", false, "Wrong (this is formal/archaic)."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is the most natural way to ask a question?",
        answers: [
            ["Who are you talking to?", true, "Correct!"],
            ["To whom are you talking?", false, "Wrong (too formal for most contexts)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct natural questions:",
        answers: [
            ["What are you looking for?", true, "Correct!"],
            ["For what are you looking?", false, "Wrong."],
            ["Where do you come from?", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the order: 'About what are you thinking?'",
        answers: ["What are you thinking about?"]
    },
    5: {
        type: "radio",
        question: "Does the same rule apply to relative clauses (e.g., 'the man I spoke to')?",
        answers: [
            ["Yes, the preposition usually goes after the verb.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'This is the book I was telling you ______.'",
        answers: [
            ["about", true, "Correct!"],
            ["of", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Which chair should I sit in?", true, "Correct!"],
            ["In which chair should I sit?", false, "Wrong (formal)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'For who is this gift?'",
        answers: ["Who is this gift for?"]
    },
    9: {
        type: "radio",
        question: "Is it technically 'wrong' to put the preposition at the start?",
        answers: [
            ["No, but it sounds very unnatural in spoken English.", true, "Correct!"],
            ["Yes, it's a major error.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct structures:",
        answers: [
            ["That's the girl I went to school with.", true, "Correct!"],
            ["Who did you go with?", true, "Correct!"],
            ["With who did you go?", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Ending a sentence with a preposition is perfectly fine in modern English.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'In which house do you live?'",
        answers: ["Which house do you live in?"]
    }
},

// 0713 Content Clause (No Inversion)
"0713": {
    1: {
        type: "radio",
        question: "In a content clause (e.g., 'I know where...'), do you use the question word order (A-S-P)?",
        answers: [
            ["No, use the statement word order (S-P).", true, "Correct!"],
            ["Yes, because it starts with a question word.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I don't know where he is.", true, "Correct!"],
            ["I don't know where is he.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct content clauses:",
        answers: [
            ["Can you tell me what time it is?", true, "Correct!"],
            ["Can you tell me what time is it?", false, "Wrong."],
            ["I wonder how much it costs.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Tell me where did you go.'",
        answers: ["Tell me where you went"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'I forgot who ______.'",
        answers: [
            ["he was", true, "Correct!"],
            ["was he", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Do you know how old she is?", true, "Correct!"],
            ["Do you know how old is she?", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Does the main sentence being a question change the order of the content clause?",
        answers: [
            ["No, the content clause always stays in statement order.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'She asked why was I late.'",
        answers: ["She asked why I was late"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I'm not sure what she wants.", true, "Correct!"],
            ["I'm not sure what does she want.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the INCORRECT word order:",
        answers: [
            ["I know who he is.", false, "Correct."],
            ["I know who is he.", true, "Incorrect."],
            ["I know why he left.", false, "Correct."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using question order inside a normal sentence is a very common 'transfer' error.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I don't know where is the station.'",
        answers: ["I don't know where the station is"]
    }
},

// 0714 Defining vs Non-defining Relative Clauses (Commas)
"0714": {
    1: {
        type: "radio",
        question: "Which type of relative clause requires commas?",
        answers: [
            ["Non-defining (extra information).", true, "Correct!"],
            ["Defining (essential information).", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'The car that I bought is blue' correct without commas?",
        answers: [
            ["True", true, "Correct! It defines which car."],
            ["False", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct use of commas:",
        answers: [
            ["My brother, who lives in Paris, is coming to visit.", true, "Correct!"],
            ["The book, that is on the table, is mine.", false, "Wrong (Defining clauses don't use commas)."],
            ["Paris, which is the capital of France, is beautiful.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Which relative pronoun is NEVER used with commas?",
        answers: ["that"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'London ______ is the capital of the UK, is huge.'",
        answers: [
            [", which", true, "Correct!"],
            ["which", false, "Wrong (needs commas)."]
        ]
    },
    6: {
        type: "radio",
        question: "Which sentence implies you only have one sister?",
        answers: [
            ["My sister, who lives in Rome, is a doctor.", true, "Correct! (The information is extra)."],
            ["My sister who lives in Rome is a doctor.", false, "Wrong (This implies you have multiple sisters and are specifying one)."]
        ]
    },
    7: {
        type: "radio",
        question: "Can you use 'that' in a non-defining clause (with commas)?",
        answers: [
            ["No, use 'which' or 'who'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the punctuation: 'The man, who stole the money, was caught.' (Defining)",
        answers: ["The man who stole the money was caught"]
    },
    9: {
        type: "radio",
        question: "What is the purpose of a non-defining clause?",
        answers: [
            ["To add extra, non-essential information.", true, "Correct!"],
            ["To identify which person/thing we are talking about.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct 'Defining' clauses (no commas):",
        answers: [
            ["The house where I was born is old.", true, "Correct!"],
            ["The girl who won the race is my cousin.", true, "Correct!"],
            ["My father, who is 60, is retired.", false, "Wrong (this is non-defining)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: If you remove a non-defining clause, the sentence still makes sense.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Apple which was founded by Steve Jobs is a big company.'",
        answers: ["Apple, which was founded by Steve Jobs, is a big company"]
    }
},

// 0715 Transitive vs Intransitive (Rise vs Raise)
"0715": {
    1: {
        type: "radio",
        question: "Which verb requires a direct object?",
        answers: [
            ["Raise (e.g., Raise your hand).", true, "Correct! (Transitive)."],
            ["Rise (e.g., The sun rises).", false, "Wrong! (Intransitive)."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'The sun raises at 6 AM' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'rises'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct usage:",
        answers: [
            ["He raised the price.", true, "Correct!"],
            ["The price rose.", true, "Correct!"],
            ["He rose his hand.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "What is the past tense of 'rise'?",
        answers: ["rose"]
    },
    5: {
        type: "text_multi",
        question: "What is the past tense of 'raise'?",
        answers: ["raised"]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Please ______ if you have a question.'",
        answers: [
            ["speak up", true, "Correct! (Intransitive)."],
            ["say", false, "Wrong (Needs an object)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which verb means 'to go up by itself'?",
        answers: [
            ["Rise", true, "Correct!"],
            ["Raise", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'They raised from their seats.'",
        answers: ["They rose from their seats"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I lay the book on the table.", true, "Correct! (Transitive)."],
            ["I lie the book on the table.", false, "Wrong!"]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the INTRANSITIVE verbs (no object):",
        answers: [
            ["Arrive", true, "Correct!"],
            ["Sleep", true, "Correct!"],
            ["Tell", false, "Wrong (Needs an object)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: A transitive verb MUST have an object to be complete.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The smoke was raising into the air.'",
        answers: ["The smoke was rising"]
    }
},

// 0716 Monotransitive vs Ditransitive (Tell vs Say)
"0716": {
    1: {
        type: "radio",
        question: "Which verb requires an indirect object (a person being told)?",
        answers: [
            ["Tell (e.g., Tell me the truth).", true, "Correct!"],
            ["Say (e.g., Say the truth).", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'He said me to go' correct?",
        answers: [
            ["True", false, "Wrong. Use 'He told me to go'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct usage:",
        answers: [
            ["I said hello.", true, "Correct!"],
            ["I told hello.", false, "Wrong."],
            ["I told him a story.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'She said him that she was late.'",
        answers: ["She told him that she was late"]
    },
    5: {
        type: "radio",
        question: "Can you use 'to' with 'say' for a person?",
        answers: [
            ["Yes (e.g., He said to me...).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Did you ______ the news?'",
        answers: [
            ["hear", true, "Correct!"],
            ["listen", false, "Wrong (needs 'to')."]
        ]
    },
    7: {
        type: "radio",
        question: "Which verb means 'to help someone remember'?",
        answers: [
            ["Remind", true, "Correct! (e.g., Remind me)."],
            ["Remember", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'I told that it was true.'",
        answers: ["I said that it was true", "I told him that it was true"]
    },
    9: {
        type: "radio",
        question: "Which is a ditransitive verb (takes two objects)?",
        answers: [
            ["Give", true, "Correct! (Give him a gift)."],
            ["Explain", false, "Wrong (Explain to him...)."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the CORRECT ditransitive usage:",
        answers: [
            ["Show me the way.", true, "Correct!"],
            ["Explain me the way.", false, "Wrong."],
            ["Bring her a glass.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Tell' always needs to specify WHO is being told.",
        answers: [
            ["True (usually).", true, "Correct!"],
            ["False.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'She said me her name.'",
        answers: ["She told me her name"]
    }
},

// 0717 Explain/Suggest/Recommend Construction
"0717": {
    1: {
        type: "radio",
        question: "Is 'I will explain you the project' correct?",
        answers: [
            ["True", false, "Wrong. Do not put 'you' immediately after 'explain'."],
            ["False", true, "Correct! Say 'I will explain the project to you'."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is the correct way to suggest something?",
        answers: [
            ["I suggest that you leave.", true, "Correct!"],
            ["I suggest you to leave.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the INCORRECT sentences:",
        answers: [
            ["He recommended me a book.", true, "Incorrect. Should be 'recommended a book to me'."],
            ["He recommended a book.", false, "Correct."],
            ["She explained to me the situation.", true, "Incorrect word order. Use 'explained the situation to me'."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I suggest you to try this.'",
        answers: ["I suggest that you try this", "I suggest trying this"]
    },
    5: {
        type: "radio",
        question: "Where should the person (indirect object) go after 'present'?",
        answers: [
            ["After the direct object, with 'to'.", true, "Correct! (e.g., present the data to you)."],
            ["Immediately after 'present'.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'He ______.'",
        answers: [
            ["explained the problem to us", true, "Correct!"],
            ["explained us the problem", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for 'recommend'?",
        answers: [
            ["I recommend the fish.", true, "Correct!"],
            ["I recommend you the fish.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct this: 'Can you suggest me a good hotel?'",
        answers: ["Can you suggest a good hotel to me?", "Can you suggest a good hotel?"]
    },
    9: {
        type: "radio",
        question: "Can 'suggest' be followed by an '-ing' form?",
        answers: [
            ["Yes (e.g., I suggest going now).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct structures:",
        answers: [
            ["Explain + thing + to + person", true, "Correct!"],
            ["Suggest + -ing", true, "Correct!"],
            ["Recommend + person + thing", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using 'me' or 'you' right after these verbs is a very common error for French/German speakers.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'He presented us the new plan.'",
        answers: ["He presented the new plan to us", "He presented the new plan"]
    }
},

// 0721 Indirect Question Form
"0721": {
    1: {
        type: "radio",
        question: "In an indirect question (e.g., 'Do you know...?'), do you use the auxiliary 'do' in the second part?",
        answers: [
            ["No, it uses statement word order.", true, "Correct!"],
            ["Yes, because it's still a question.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'Do you know what does this mean?' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'Do you know what this means?'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct indirect questions:",
        answers: [
            ["Could you tell me where the bank is?", true, "Correct!"],
            ["Could you tell me where is the bank?", false, "Wrong."],
            ["I was wondering why he left.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Do you know where did he go?'",
        answers: ["Do you know where he went?"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Do you have any idea ______?'",
        answers: [
            ["what time it is", true, "Correct!"],
            ["what time is it", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Please tell me what she said.", true, "Correct!"],
            ["Please tell me what did she say.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Does 'can you tell me if...' require an auxiliary in the 'if' clause?",
        answers: [
            ["No (e.g., ...if she is here).", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'I wonder why does he work so much.'",
        answers: ["I wonder why he works so much"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I don't remember where I parked.", true, "Correct!"],
            ["I don't remember where did I park.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify INCORRECT indirect questions:",
        answers: [
            ["Tell me what is your name.", true, "Incorrect. Should be 'what your name is'."],
            ["Ask him where he lives.", false, "Correct."],
            ["Do you know how much does it cost?", true, "Incorrect."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Indirect questions are essentially questions hidden inside another sentence or a polite opening.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Could you explain why was the flight delayed?'",
        answers: ["Could you explain why the flight was delayed?"]
    }
},

// 0722 Subject Questions (Who broke this?)
"0722": {
    1: {
        type: "radio",
        question: "If the question word (Who/What) is the SUBJECT, do you use 'do/did'?",
        answers: [
            ["No, use the normal past or present verb form.", true, "Correct! (e.g., Who called?)."],
            ["Yes, always use 'did'." , false, "Wrong. (e.g., Who did call? is usually wrong)."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'Who did win the game?' correct for a standard question?",
        answers: [
            ["True", false, "Wrong. Should be 'Who won the game?'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct subject questions:",
        answers: [
            ["What happened?", true, "Correct!"],
            ["Who wrote this book?", true, "Correct!"],
            ["Who did write this book?", false, "Wrong (unless for emphasis)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Who did break the window?'",
        answers: ["Who broke the window?"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: '______ invited you?'",
        answers: [
            ["Who", true, "Correct!"],
            ["Who did", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["What caused the accident?", true, "Correct!"],
            ["What did cause the accident?", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Compare these: 1. 'Who did you see?' 2. 'Who saw you?' Which one is a subject question?",
        answers: [
            ["Number 2 (Who saw you?).", true, "Correct! 'Who' is the one doing the seeing."],
            ["Number 1.", false, "Wrong. In Number 1, 'Who' is the object."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'Who did tell you that?'",
        answers: ["Who told you that?"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Which team won?", true, "Correct!"],
            ["Which team did win?", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the OBJECT questions (these NEED do/did):",
        answers: [
            ["Who did you call?", true, "Correct! (You called someone)."],
            ["What did you buy?", true, "Correct! (You bought something)."],
            ["What fell off the table?", false, "Wrong (Subject question)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: In subject questions, the word order is exactly like a statement.",
        answers: [
            ["True (e.g., Someone called -> Who called?).", true, "Correct!"],
            ["False.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'How many people did come?'",
        answers: ["How many people came?"]
    }
},

// 0730 Cleft Sentences (What I need is...)
"0730": {
    1: {
        type: "radio",
        question: "What is the purpose of a cleft sentence?",
        answers: [
            ["To emphasize a specific part of the information.", true, "Correct!"],
            ["To ask a question.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is a correct cleft sentence starting with 'What'?",
        answers: [
            ["What I need is a vacation.", true, "Correct!"],
            ["What is a vacation that I need.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct cleft sentences:",
        answers: [
            ["It was John who broke the window.", true, "Correct!"],
            ["The person I called was Mary.", true, "Correct!"],
            ["The thing what I want is coffee.", false, "Wrong. (Use 'that' or nothing, not 'what')."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The reason why I am here is for help you.'",
        answers: ["The reason I am here is to help you"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'It is ______ I am worried about.'",
        answers: [
            ["you that", true, "Correct!"],
            ["you what", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is more emphatic?",
        answers: [
            ["What he did was amazing.", true, "Correct! (Cleft sentence)."],
            ["He did something amazing.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "How do you emphasize 'Monday' in 'We met on Monday'?",
        answers: [
            ["It was on Monday that we met.", true, "Correct!"],
            ["On Monday we met.", false, "Wrong (though correct, it's not a cleft)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'All ____ I want for Christmas is you.'",
        answers: ["that"]
    },
    9: {
        type: "radio",
        question: "Is 'The place where I want to go is Japan' a cleft sentence?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct 'It is...' clefts:",
        answers: [
            ["It's the money that matters.", true, "Correct!"],
            ["It's me who is responsible.", true, "Correct!"],
            ["Is me who is responsible.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Cleft sentences 'cleave' (split) a simple sentence in two to focus on one part.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The thing what I hate is rain.'",
        answers: ["The thing I hate is rain", "The thing that I hate is rain"]
    }
},

// 0740 Correlative Sentences (Parallel Structure)
"0740": {
    1: {
        type: "radio",
        question: "In correlative pairs (both...and, neither...nor), what is 'parallel structure'?",
        answers: [
            ["Using the same grammatical form for both parts.", true, "Correct!"],
            ["Using two different tenses.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["She is both smart and kind.", true, "Correct! (Adjective + Adjective)."],
            ["She is both smart and a kindness.", false, "Wrong. (Adjective + Noun)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct parallel structures:",
        answers: [
            ["Either you stay or you go.", true, "Correct!"],
            ["Neither the food nor the service was good.", true, "Correct!"],
            ["Both singing and to dance.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Not only he arrived late, but also forgot his keys.'",
        answers: ["Not only did he arrive late, but he also forgot his keys"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'The movie was as ______ as it was long.'",
        answers: [
            ["boring", true, "Correct!"],
            ["bored", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is the correct pair for 'neither'?",
        answers: [
            ["nor", true, "Correct!"],
            ["or", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is the correct pair for 'either'?",
        answers: [
            ["or", true, "Correct!"],
            ["nor", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Complete the pair: 'Not only... but ____.'",
        answers: ["also", "but also"]
    },
    9: {
        type: "radio",
        question: "Is 'He is as strong as he is tall' correct?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct 'Both...and' usage:",
        answers: [
            ["Both the teacher and the students.", true, "Correct!"],
            ["Both fast and cheap.", true, "Correct!"],
            ["Both in the car and on walking.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Correlative structures help balance a sentence and make it more professional.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The car is not only fast but it is expensive too.'",
        answers: ["The car is not only fast but also expensive"]
    }
},

// 0750 Inversion for Emphasis (Never have I...)
"0750": {
    1: {
        type: "radio",
        question: "When you start a sentence with a negative word like 'Never', what happens to the word order?",
        answers: [
            ["It becomes inverted (Question order: Auxiliary + Subject).", true, "Correct!"],
            ["It stays in statement order.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct for emphasis?",
        answers: [
            ["Never have I seen such a mess.", true, "Correct!"],
            ["Never I have seen such a mess.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct inverted structures:",
        answers: [
            ["Not only did he come, but he was early.", true, "Correct!"],
            ["Seldom do we see such talent.", true, "Correct!"],
            ["Under no circumstances you should leave.", false, "Wrong. (should you leave)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Rarely I go to the cinema.'",
        answers: ["Rarely do I go to the cinema"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Only then ______ realize the mistake.'",
        answers: [
            ["did I", true, "Correct!"],
            ["I did", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Hardly had I arrived when the phone rang.", true, "Correct!"],
            ["Hardly I arrived when the phone rang.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Does 'Not only' require inversion in the first clause?",
        answers: [
            ["Yes (e.g., Not only was it cold...).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'Never I will do that again.'",
        answers: ["Never will I do that again"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Little did he know what was coming.", true, "Correct!"],
            ["Little he knew what was coming.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct 'Negative Adverb' beginnings:",
        answers: [
            ["At no time were we informed.", true, "Correct!"],
            ["No sooner had I left than it rained.", true, "Correct!"],
            ["Nowhere I could find him.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Inversion is used to make a sentence sound more formal or dramatic.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Not only he is smart, he is also rich.'",
        answers: ["Not only is he smart, but he is also rich"]
    }
},

// 0800 Passive Form
"0800": {
    1: {
        type: "radio",
        question: "What are the two essential components of any passive construction?",
        answers: [
            ["The verb 'be' + Past Participle.", true, "Correct! (e.g., It was made)."],
            ["The verb 'do' + Infinitive.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is the correct passive form of 'He cleans the car'?",
        answers: [
            ["The car is cleaned by him.", true, "Correct!"],
            ["The car cleans by him.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct passive sentences:",
        answers: [
            ["The decision was made.", true, "Correct!"],
            ["They were invited.", true, "Correct!"],
            ["It has been finished.", true, "Correct!"],
            ["It was finish.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The letter was wrote by Mary.'",
        answers: ["The letter was written by Mary"]
    },
    5: {
        type: "radio",
        question: "What is the passive of 'They are building a house'?",
        answers: [
            ["A house is being built.", true, "Correct!"],
            ["A house is building.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'The problem ______ solved yesterday.'",
        answers: [
            ["was", true, "Correct!"],
            ["has been", false, "Wrong (because of 'yesterday')."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["English is spoken here.", true, "Correct!"],
            ["English speaks here.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing part: 'The bridge ____ ____ built in 1950.'",
        answers: ["was"]
    },
    9: {
        type: "radio",
        question: "Is 'I am being watched' a passive construction?",
        answers: [
            ["True", true, "Correct! (Present continuous passive)."],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the incorrect passive forms:",
        answers: [
            ["The project was done.", false, "Correct."],
            ["The project was did.", true, "Incorrect."],
            ["The project has being done.", true, "Incorrect."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: In a passive sentence, the object of the action becomes the subject of the sentence.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The car was steal last night.'",
        answers: ["The car was stolen last night"]
    }
},

// 0801 Passive with Gerund Error
"0801": {
    1: {
        type: "radio",
        question: "Which verb form follows 'be' in a passive sentence?",
        answers: [
            ["Past Participle (e.g., seen).", true, "Correct!"],
            ["Gerund (e.g., seeing).", false, "Wrong. 'Was seeing' is active continuous."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'He was hiring last week' correct if someone gave him a job?",
        answers: [
            ["True", false, "Wrong. It should be 'He was hired'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct passive forms:",
        answers: [
            ["It was stolen.", true, "Correct!"],
            ["It was stealing.", false, "Wrong. (Active)."],
            ["The house was sold.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The game was exciting.' (if you mean the game was stimulated by something else)",
        answers: ["The game was excited", "The game was exciting"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'He ______ gone before we arrived.'",
        answers: [
            ["was already", true, "Correct!"],
            ["was already going", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which describes an action done TO someone?",
        answers: [
            ["She was given a gift.", true, "Correct!"],
            ["She was giving a gift.", false, "Wrong (Active)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["The window was broken.", true, "Correct!"],
            ["The window was breaking.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'The cake was eating by the children.'",
        answers: ["The cake was eaten by the children"]
    },
    9: {
        type: "radio",
        question: "Is 'The shop was closing' the same as 'The shop was closed'?",
        answers: [
            ["No. 'Closing' is an active process; 'Closed' is the passive state or action.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the INCORRECT 'passive' sentences:",
        answers: [
            ["I was inviting to the party.", true, "Incorrect. Should be 'invited'."],
            ["I was calling by my boss.", true, "Incorrect. Should be 'called'."],
            ["The work was finished.", false, "Correct."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using the -ing form instead of the past participle makes the subject the *doer* of the action.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The car is repairing.'",
        answers: ["The car is being repaired", "The car is repaired"]
    }
},

// 0802 Passive Preposition (By)
"0802": {
    1: {
        type: "radio",
        question: "Which preposition is used to introduce the 'agent' (the person doing the action) in a passive sentence?",
        answers: [
            ["By", true, "Correct! (e.g., written by Shakespeare)."],
            ["From", false, "Wrong."],
            ["With", false, "Wrong (usually used for tools/instruments)."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'The bridge was built from the Romans' correct?",
        answers: [
            ["True", false, "Wrong. Use 'built by the Romans'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct passive prepositions:",
        answers: [
            ["Painted by Leonardo.", true, "Correct!"],
            ["Decided by the board.", true, "Correct!"],
            ["Made of wood.", true, "Correct! (Materials use 'of' or 'from')."],
            ["Made by wood.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The song was sung from a famous artist.'",
        answers: ["The song was sung by a famous artist"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'He was hit ______ a car.'",
        answers: [
            ["by", true, "Correct!"],
            ["with", false, "Wrong (unless someone used a car as a tool to hit him)."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'The door was opened ______ a key.'",
        answers: [
            ["with", true, "Correct! (Use 'with' for instruments/tools)."],
            ["by", false, "Wrong (unless the key is alive)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["The book was written by my friend.", true, "Correct!"],
            ["The book was written of my friend.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing preposition: 'The law was passed ____ Parliament.'",
        answers: ["by"]
    },
    9: {
        type: "radio",
        question: "Is 'Invented from Thomas Edison' correct?",
        answers: [
            ["No, it should be 'by'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct usage of 'by':",
        answers: [
            ["Discovery by chance.", true, "Correct!"],
            ["Driven by success.", true, "Correct!"],
            ["Directed from Spielberg.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'By' describes the person/entity that performs the action in passive voice.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The goal was scored through the captain.'",
        answers: ["The goal was scored by the captain"]
    }
},

// 0805 To be born
"0805": {
    1: {
        type: "radio",
        question: "Which tense do we use to state the year of your birth?",
        answers: [
            ["Past Simple Passive (I was born).", true, "Correct!"],
            ["Present Simple (I am born).", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I am born in 1995' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'I was born'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct way to talk about birth:",
        answers: [
            ["She was born in Berlin.", true, "Correct!"],
            ["They were born in 2000.", true, "Correct!"],
            ["I born in London.", false, "Wrong (needs the verb 'to be')."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He is born in March.'",
        answers: ["He was born in March"]
    },
    5: {
        type: "radio",
        question: "What is the past participle of 'bear' used in this expression?",
        answers: [
            ["born", true, "Correct!"],
            ["bore", false, "Wrong (bore is the past simple)."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Where ______ you born?'",
        answers: [
            ["were", true, "Correct!"],
            ["was", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["A star was born.", true, "Correct!"],
            ["A star is born.", true, "Correct! (Title of a movie, but 'was' is for history)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Complete the sentence: 'I ____ ____ on a Tuesday.'",
        answers: ["was born"]
    },
    9: {
        type: "radio",
        question: "Can we say 'I borned there'?",
        answers: [
            ["No, 'born' is not a normal verb you conjugate like that.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["He was born rich.", true, "Correct!"],
            ["The twins were born early.", true, "Correct!"],
            ["I am born 10 years ago.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Since birth is a past event, 'am born' is technically impossible unless you are currently arriving!",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'My brother born in 1998.'",
        answers: ["My brother was born in 1998"]
    }
},

// 0910 Subject vs Object Pronouns
"0910": {
    1: {
        type: "radio",
        question: "Which pronoun is used as the SUBJECT (doing the action)?",
        answers: [
            ["He", true, "Correct!"],
            ["Him", false, "Wrong (Object)."]
        ]
    },
    2: {
        type: "radio",
        question: "Which pronoun is used as the OBJECT (receiving the action)?",
        answers: [
            ["Me", true, "Correct!"],
            ["I", false, "Wrong (Subject)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct subject/object pairs:",
        answers: [
            ["I / Me", true, "Correct!"],
            ["She / Her", true, "Correct!"],
            ["They / Them", true, "Correct!"],
            ["We / Us", true, "Correct!"],
            ["He / His", false, "Wrong. ('His' is possessive; 'Him' is object)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Him and me went to the park.'",
        answers: ["He and I went to the park"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Wait for ______!'",
        answers: [
            ["us", true, "Correct!"],
            ["we", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: '______ invited ______ to the party.'",
        answers: [
            ["They / her", true, "Correct!"],
            ["Them / she", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct after 'than'?",
        answers: [
            ["He is taller than me.", true, "Correct! (Informal/Common)."],
            ["He is taller than I.", true, "Correct! (Formal/Short for 'than I am')."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the object pronoun for 'it'?",
        answers: ["it"]
    },
    9: {
        type: "radio",
        question: "Is 'Give it to they' correct?",
        answers: [
            ["No, it should be 'Give it to them'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the SUBJECT pronouns:",
        answers: [
            ["I", true, "Correct!"],
            ["Them", false, "Wrong."],
            ["She", true, "Correct!"],
            ["Us", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: The object pronoun is used after a preposition (e.g., with me, for him).",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Mary told I a secret.'",
        answers: ["Mary told me a secret"]
    }
},

// 0915 Its vs It's
"0915": {
    1: {
        type: "radio",
        question: "Which form is the possessive adjective (meaning 'belonging to it')?",
        answers: [
            ["Its", true, "Correct!"],
            ["It's", false, "Wrong (It's = It is)."]
        ]
    },
    2: {
        type: "radio",
        question: "Which form is the contraction for 'it is' or 'it has'?",
        answers: [
            ["It's", true, "Correct!"],
            ["Its", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct usage:",
        answers: [
            ["The dog wagged its tail.", true, "Correct!"],
            ["It's a beautiful day.", true, "Correct!"],
            ["The company changed it's logo.", false, "Wrong (No apostrophe for possession)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The bird hurt it's wing.'",
        answers: ["The bird hurt its wing"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: '______ raining outside.'",
        answers: [
            ["It's", true, "Correct!"],
            ["Its", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'The phone lost ______ signal.'",
        answers: [
            ["its", true, "Correct!"],
            ["it's", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Does the possessive 'its' ever have an apostrophe?",
        answers: [
            ["No, never.", true, "Correct! (Just like 'his', 'hers', and 'ours')."],
            ["Yes.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: '____ been a long time.'",
        answers: ["It's"]
    },
    9: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Every country has its own flag.", true, "Correct!"],
            ["Every country has it's own flag.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct 'It is' contractions:",
        answers: [
            ["It's cold.", true, "Correct!"],
            ["It's mine.", true, "Correct!"],
            ["The tree lost it's leaves.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: If you can replace the word with 'it is', you need the apostrophe.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The car has it's engine in the back.'",
        answers: ["The car has its engine in the back"]
    }
},

// 0920 Gendered Pronouns for Objects (It)
"0920": {
    1: {
        type: "radio",
        question: "In English, what pronoun do we use for an object like a table or a car?",
        answers: [
            ["It", true, "Correct!"],
            ["He or She", false, "Wrong (Objects have no gender)."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I have a new boat. She is very fast' correct?",
        answers: [
            ["It is common for sailors, but 'It' is the standard rule.", true, "Correct!"],
            ["No, it's always wrong.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct object references:",
        answers: [
            ["Look at that building. It is huge.", true, "Correct!"],
            ["Where is the hammer? He is in the box.", false, "Wrong."],
            ["I love this watch. It was a gift.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I like your car. How much did he cost?'",
        answers: ["How much did it cost?"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'The sun is hot. ______ is shining brightly.'",
        answers: [
            ["It", true, "Correct!"],
            ["He", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'The wall lost ______ paint.'",
        answers: [
            ["its", true, "Correct!"],
            ["his", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is the standard pronoun for an animal whose gender you don't know?",
        answers: [
            ["It", true, "Correct!"],
            ["She", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the correct pronoun for 'The Moon'?",
        answers: ["it"]
    },
    9: {
        type: "radio",
        question: "Is 'This machine changes his color' correct?",
        answers: [
            ["No, use 'its'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify incorrect object gender:",
        answers: [
            ["Give the book to her.", false, "Correct (if 'her' is a person)."],
            ["The book? He is on the table.", true, "Incorrect."],
            ["My country and her history.", true, "Correct (metaphorical/poetic, but 'its' is better for grammar)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: English is one of the few European languages where nouns have no grammatical gender.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I found your keys. Here they are.' (Wait, this is plural). Fix: 'I found your key. Here he is.'",
        answers: ["Here it is"]
    }
},

// 0925 No Null Subjects (It is raining)
"0925": {
    1: {
        type: "radio",
        question: "Can an English sentence start with the verb 'is' (e.g., 'Is good')?",
        answers: [
            ["No, you must use a subject like 'It'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct for the weather?",
        answers: [
            ["It is raining.", true, "Correct!"],
            ["Is raining.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct subject usage:",
        answers: [
            ["It is important to study.", true, "Correct!"],
            ["Is important to study.", false, "Wrong."],
            ["There are many people.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Seems like a good idea.' (Formal speech)",
        answers: ["It seems like a good idea"]
    },
    5: {
        type: "radio",
        question: "What is the missing subject: '____ is necessary to wait.'",
        answers: [
            ["It", true, "Correct!"],
            ["There", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: '______ was cold last night.'",
        answers: [
            ["It", true, "Correct!"],
            ["Was", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I think it is beautiful.", true, "Correct!"],
            ["I think is beautiful.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct this: 'Is true that she left.'",
        answers: ["It is true that she left"]
    },
    9: {
        type: "radio",
        question: "Is 'It' called a 'dummy subject' in these cases?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the INCORRECT null subjects:",
        answers: [
            ["Is a nice car.", true, "Incorrect."],
            ["Was funny.", true, "Incorrect."],
            ["It was funny.", false, "Correct."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: In Spanish or Italian, you can omit the subject, but in English, you almost never can.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'If is raining, don't go out.'",
        answers: ["If it is raining"]
    }
},

// 0930 Possessive Adjectives (His vs Her)
"0930": {
    1: {
        type: "radio",
        question: "If a woman loses her dog, do we say:",
        answers: [
            ["She lost her dog.", true, "Correct! (Possessive matches the owner)."],
            ["She lost his dog.", false, "Wrong (unless the dog belonged to a man)."]
        ]
    },
    2: {
        type: "radio",
        question: "If a man loses his keys, do we say:",
        answers: [
            ["He lost his keys.", true, "Correct!"],
            ["He lost her keys.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct possessive adjectives:",
        answers: [
            ["My book", true, "Correct!"],
            ["Your book", true, "Correct!"],
            ["Theirs book", false, "Wrong (Their book)."],
            ["Our house", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "What is the possessive pronoun for 'mine'?",
        answers: ["mine"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'The girl took ______ bag.'",
        answers: [
            ["her", true, "Correct!"],
            ["his", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'The boy forgot ______ lunch.'",
        answers: [
            ["his", true, "Correct!"],
            ["her", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for 'them'?",
        answers: [
            ["Their car", true, "Correct!"],
            ["Them car", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the possessive adjective for 'we'?",
        answers: ["our"]
    },
    9: {
        type: "radio",
        question: "Is 'That car is my' correct?",
        answers: [
            ["No, use the possessive pronoun 'mine'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct possessive pronouns (used alone):",
        answers: [
            ["It's yours.", true, "Correct!"],
            ["It's hers.", true, "Correct!"],
            ["It's our.", false, "Wrong (Ours)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: English possessive adjectives agree with the 'possessor', not the 'object' (unlike French 'son/sa').",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'John gave her his phone.' (Meaning John's phone). Fix: 'John gave her her phone.' (Wait, this is different). Fix: 'Jane took his hat.' (Meaning Jane's hat).",
        answers: ["Jane took her hat"]
    }
},

// 0941 A friend of mine (Double Genitive)
"0941": {
    1: {
        type: "radio",
        question: "Which is the correct way to say 'Un de mes amis'?",
        answers: [
            ["A friend of mine", true, "Correct!"],
            ["A friend of me", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct for 'one of her books'?",
        answers: [
            ["A book of hers", true, "Correct!"],
            ["A book of her", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct possessive structures:",
        answers: [
            ["A relative of ours", true, "Correct!"],
            ["A neighbor of them", false, "Wrong (of theirs)."],
            ["A colleague of yours", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He is a student of me.'",
        answers: ["He is a student of mine"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'That idea ______ was great!'",
        answers: [
            ["of yours", true, "Correct!"],
            ["of you", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'It was a decision ______.'",
        answers: [
            ["of theirs", true, "Correct!"],
            ["of them", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["A friend of his", true, "Correct!"],
            ["A friend of him", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'I met a friend of ____.' (belonging to me)",
        answers: ["mine"]
    },
    9: {
        type: "radio",
        question: "Can we say 'Some friends of mine'?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct phrases:",
        answers: [
            ["A story of hers", true, "Correct!"],
            ["A dog of ours", true, "Correct!"],
            ["A cousin of us", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: This structure is called the 'Double Genitive'.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Is she a sister of you?'",
        answers: ["Is she a sister of yours?"]
    }
},

// 0942 By myself vs On my own
"0942": {
    1: {
        type: "radio",
        question: "Which is a correct way to say you did something alone?",
        answers: [
            ["By myself", true, "Correct!"],
            ["By my own", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is the other correct way using the word 'own'?",
        answers: [
            ["On my own", true, "Correct!"],
            ["On my self", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct combinations:",
        answers: [
            ["I live by myself.", true, "Correct!"],
            ["I live on my own.", true, "Correct!"],
            ["I live by my own.", false, "Wrong."],
            ["I live on myself.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He did the homework by his own.'",
        answers: ["He did the homework by himself", "on his own"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Did you travel ______?'",
        answers: [
            ["by yourself", true, "Correct!"],
            ["by your own", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She likes being ______.'",
        answers: [
            ["on her own", true, "Correct!"],
            ["by her own", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for 'them'?",
        answers: [
            ["By themselves", true, "Correct!"],
            ["By their own", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing preposition: '____ our own.'",
        answers: ["On"]
    },
    9: {
        type: "radio",
        question: "Is 'By myself' more informal than 'On my own'?",
        answers: [
            ["They are both very common and interchangeable.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct phrases:",
        answers: [
            ["On its own", true, "Correct!"],
            ["By itself", true, "Correct!"],
            ["On itself", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Do not mix the two phrases together.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'We fixed the car by our own.'",
        answers: ["We fixed the car by ourselves", "on our own"]
    }
},

// 0950 Reflexive Pronouns (Myself)
"0950": {
    1: {
        type: "radio",
        question: "When do you use a reflexive pronoun (myself, himself, etc.)?",
        answers: [
            ["When the subject and the object are the same person.", true, "Correct!"],
            ["When you want to emphasize a different person.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I saw me in the mirror' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'I saw myself'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct reflexive usage:",
        answers: [
            ["He cut himself while cooking.", true, "Correct!"],
            ["She bought her a gift.", true, "Correct (if 'her' is someone else)."],
            ["She bought herself a gift.", true, "Correct (if she bought it for her)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'They enjoyed them at the party.'",
        answers: ["They enjoyed themselves"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We should take care of ______.'",
        answers: [
            ["ourselves", true, "Correct!"],
            ["us", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Help ______ to some cookies!'",
        answers: [
            ["yourself", true, "Correct!"],
            ["you", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for 'it'?",
        answers: [
            ["Itself", true, "Correct!"],
            ["Its", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the reflexive for 'you' (plural)?",
        answers: ["yourselves"]
    },
    9: {
        type: "radio",
        question: "Is 'I did it myself' an emphatic use?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the INCORRECT reflexive forms:",
        answers: [
            ["Hisself", true, "Incorrect (Himself)."],
            ["Theirselves", true, "Incorrect (Themselves)."],
            ["Myself", false, "Correct."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Reflexive pronouns always end in -self or -selves.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'John looked at him in the mirror.' (meaning John saw his own face).",
        answers: ["John looked at himself"]
    }
},

// 0951 Reflexivity Transfer (Remember vs Se souvenir)
"0951": {
    1: {
        type: "radio",
        question: "Is 'I remember me the day' correct?",
        answers: [
            ["No, 'remember' is not reflexive in English.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I dressed quickly.", true, "Correct!"],
            ["I dressed myself quickly.", false, "Wrong (technically okay, but 'dressed' is rarely reflexive in English)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify verbs that are NOT reflexive in English (but are in French/German):",
        answers: [
            ["Wash", true, "Correct!"],
            ["Remember", true, "Correct!"],
            ["Sit down", true, "Correct!"],
            ["Feel", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I feel me better today.'",
        answers: ["I feel better today", "I feel better"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We ______ at 5 PM.'",
        answers: [
            ["met", true, "Correct!"],
            ["met ourselves", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'He ______ after the long run.'",
        answers: [
            ["rested", true, "Correct!"],
            ["rested himself", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I am shaving.", true, "Correct!"],
            ["I am shaving me.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the sentence: 'I relax me on Sundays.'",
        answers: ["I relax on Sundays"]
    },
    9: {
        type: "radio",
        question: "Is 'I am washing me' correct?",
        answers: [
            ["No, just say 'I am washing'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct English usage:",
        answers: [
            ["I sit down.", true, "Correct!"],
            ["I worry about you.", true, "Correct!"],
            ["I worry me about you.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: In English, we only use reflexive pronouns if there is a special emphasis or if the action is unusual.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I am imagining me in Hawaii.'",
        answers: ["I am imagining myself in Hawaii"]
    }
},

// 0955 Existential There
"0955": {
    1: {
        type: "radio",
        question: "Which is the correct way to say 'Il y a' in English for plural objects?",
        answers: [
            ["There are", true, "Correct!"],
            ["There is", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'It has many people' a correct translation for 'Il y a du monde'?",
        answers: [
            ["No, use 'There are many people'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct existential sentences:",
        answers: [
            ["There is a dog.", true, "Correct!"],
            ["There are some dogs.", true, "Correct!"],
            ["It gives many problems.", false, "Wrong (German 'Es gibt' transfer)."],
            ["There has a problem.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'There is two apples on the table.'",
        answers: ["There are two apples"]
    },
    5: {
        type: "radio",
        question: "What is the past tense of 'There is'?",
        answers: [
            ["There was", true, "Correct!"],
            ["There had", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: '______ a lot of noise last night.'",
        answers: [
            ["There was", true, "Correct!"],
            ["It was", false, "Wrong (unless 'It' refers to a specific thing)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for a question?",
        answers: [
            ["Are there any eggs?", true, "Correct!"],
            ["Have there any eggs?", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'It has a school in the village.'",
        answers: ["There is a school in the village"]
    },
    9: {
        type: "radio",
        question: "Which verb does 'There' agree with?",
        answers: [
            ["The noun that follows it.", true, "Correct!"],
            ["The word 'There'.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the incorrect 'There' constructions:",
        answers: [
            ["There were many cars.", false, "Correct."],
            ["There are a car.", true, "Incorrect."],
            ["There's two car.", true, "Incorrect (common in speech, but grammatically wrong)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using 'It has' or 'It gives' for existence is a major error for French/German speakers.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'In my room, there has a big window.'",
        answers: ["there is a big window"]
    }
},

// 0960 Relative Pronouns (Who vs Which)
"0960": {
    1: {
        type: "radio",
        question: "Which relative pronoun is used for people?",
        answers: [
            ["Who", true, "Correct!"],
            ["Which", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which relative pronoun is used for things or animals?",
        answers: [
            ["Which", true, "Correct!"],
            ["Who", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct relative clauses:",
        answers: [
            ["The man who lives next door.", true, "Correct!"],
            ["The car which I bought.", true, "Correct!"],
            ["The dog who is barking.", false, "Wrong (use 'which' or 'that')."],
            ["The children that were playing.", true, "Correct! ('That' can be used for both)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The movie who I saw was great.'",
        answers: ["The movie which I saw", "The movie that I saw"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'The doctor ______ treated me was kind.'",
        answers: [
            ["who", true, "Correct!"],
            ["which", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'The keys ______ were on the table are gone.'",
        answers: [
            ["which", true, "Correct!"],
            ["who", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Can 'that' replace both 'who' and 'which' in defining clauses?",
        answers: [
            ["Yes.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct the error: 'People which smoke should go outside.'",
        answers: ["People who smoke"]
    },
    9: {
        type: "radio",
        question: "Which is correct for a company?",
        answers: [
            ["The company which produced this...", true, "Correct!"],
            ["The company who produced this...", true, "Correct! (Acceptable when treating a company as a group of people)."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the incorrect pronouns:",
        answers: [
            ["The computer who works.", true, "Incorrect."],
            ["The lady which speaks.", true, "Incorrect."],
            ["The box that is open.", false, "Correct."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: In non-defining clauses (with commas), you MUST use 'who' or 'which', never 'that'.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The teacher which told us to study.'",
        answers: ["The teacher who told us to study"]
    }
},

// 0961 Relative Place (Where)
"0961": {
    1: {
        type: "radio",
        question: "Which relative pronoun is used to refer to a place?",
        answers: [
            ["Where", true, "Correct!"],
            ["Who", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'The restaurant which we ate' correct?",
        answers: [
            ["No, it needs 'where' or 'which we ate AT'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct place references:",
        answers: [
            ["The city where I was born.", true, "Correct!"],
            ["The hotel that we stayed in.", true, "Correct!"],
            ["The place which I met her.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'This is the school who I studied at.'",
        answers: ["This is the school where I studied", "school that I studied at"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'I found a park ______ we can play.'",
        answers: [
            ["where", true, "Correct!"],
            ["which", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Can we use 'which' for a place if we add a preposition?",
        answers: [
            ["Yes (e.g., The city in which I live).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["The room where the meeting is.", true, "Correct!"],
            ["The room who the meeting is.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'The station ____ we met.'",
        answers: ["where"]
    },
    9: {
        type: "radio",
        question: "Is 'Where' a relative adverb?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the incorrect usage:",
        answers: [
            ["The office who I work.", true, "Incorrect."],
            ["The office where I work.", false, "Correct."],
            ["The office which I work in.", false, "Correct."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Where' replaces the need for a preposition like 'in' or 'at'.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Is this the shop who sells bread?' (Wait, this is about the shop as a thing). Fix: 'Is this the shop who I saw?' (Place).",
        answers: ["where I saw it", "that I saw"]
    }
},

// 0970 Relative Pronoun 'Whose'
"0970": {
    1: {
        type: "radio",
        question: "When do you use 'whose' in a relative clause?",
        answers: [
            ["To show possession (replaces 'his', 'her', or 'their').", true, "Correct!"],
            ["To refer to a group of people.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'The man who his car is red' correct?",
        answers: [
            ["No, say 'The man whose car is red'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct 'Whose' sentences:",
        answers: [
            ["The student whose grades are highest.", true, "Correct!"],
            ["The company whose CEO resigned.", true, "Correct!"],
            ["The girl who's brother is here.", false, "Wrong (who's = who is)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The actor who his movie won.'",
        answers: ["The actor whose movie won"]
    },
    5: {
        type: "radio",
        question: "Can 'whose' be used for things, not just people?",
        answers: [
            ["Yes (e.g., The tree whose leaves fell).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'That is the neighbor ______ dog barks all night.'",
        answers: [
            ["whose", true, "Correct!"],
            ["who's", false, "Wrong (Who's = Who is)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["The family whose house burned down.", true, "Correct!"],
            ["The family that their house burned down.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'The scientist ____ research was famous.'",
        answers: ["whose"]
    },
    9: {
        type: "radio",
        question: "Is 'whose' used for questions too?",
        answers: [
            ["Yes (e.g., Whose bag is this?).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct possessive relative:",
        answers: [
            ["A person whose dream came true.", true, "Correct!"],
            ["A country whose economy is strong.", true, "Correct!"],
            ["A person who their dream...", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Whose' replaces the possessive adjective and the noun it modifies is placed immediately after.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The doctor who her clinic is new.'",
        answers: ["The doctor whose clinic is new"]
    }
},

// 1010 Preposition of Movement (To)
"1010": {
    1: {
        type: "radio",
        question: "Which preposition is used with verbs of movement like 'go', 'come', or 'travel'?",
        answers: [
            ["To", true, "Correct! We go TO a place."],
            ["In", false, "Wrong. 'In' describes a static position, not movement."]
        ]
    },
    2: {
        type: "checkbox",
        question: "Which of these are correct?",
        answers: [
            ["I'm going to Italy.", true, "Correct!"],
            ["I'm going in Italy.", false, "Wrong. (Unless you are already inside Italy and moving within it)."],
            ["Welcome to our home.", true, "Correct!"],
            ["He came to the office.", true, "Correct!"]
        ]
    },
    3: {
        type: "radio",
        question: "Is 'I went in the supermarket' correct if you mean the journey there?",
        answers: [
            ["True", false, "Wrong. It should be 'I went TO the supermarket'."],
            ["False", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'We traveled in Spain last summer.' (meaning the trip to the country)",
        answers: ["We traveled to Spain"]
    },
    5: {
        type: "radio",
        question: "What is the exception for the word 'home'?",
        answers: [
            ["You don't use 'to' (e.g., I'm going home).", true, "Correct! 'Home' doesn't take 'to'."],
            ["You must use 'at'.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She moved ______ London in 2010.'",
        answers: [
            ["to", true, "Correct!"],
            ["at", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for an invitation?",
        answers: [
            ["Come to my party!", true, "Correct!"],
            ["Come in my party!", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing preposition: 'I walked ____ the station.'",
        answers: ["to"]
    },
    9: {
        type: "radio",
        question: "Is 'I arrived to the hotel' correct?",
        answers: [
            ["No, 'arrive' is an exception and uses 'at' or 'in'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct movement phrases:",
        answers: [
            ["Fly to New York", true, "Correct!"],
            ["Return to work", true, "Correct!"],
            ["Get to the car", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using 'in' instead of 'to' is a common error for speakers of Romance languages.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'We are going in the mountains this weekend.'",
        answers: ["We are going to the mountains"]
    }
},

// 1015 Change in Value (By vs To)
"1015": {
    1: {
        type: "radio",
        question: "Which preposition describes the *amount* of a change?",
        answers: [
            ["By (e.g., increased by 10%)", true, "Correct!"],
            ["To", false, "Wrong. 'To' describes the final target."]
        ]
    },
    2: {
        type: "radio",
        question: "Which preposition describes the *final result* of a change?",
        answers: [
            ["To (e.g., rose to $100)", true, "Correct!"],
            ["By", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "If a price goes from $10 to $15, which are correct?",
        answers: [
            ["It increased by $5.", true, "Correct!"],
            ["It increased to $15.", true, "Correct!"],
            ["It increased of $5.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Sales grew of 20%.'",
        answers: ["Sales grew by 20%"]
    },
    5: {
        type: "radio",
        question: "Is 'The temperature fell from 5 degrees' correct if 5 is the final number?",
        answers: [
            ["No, it should be 'fell TO 5 degrees'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'We cut our costs ______ 15 percent.'",
        answers: [
            ["by", true, "Correct!"],
            ["to", false, "Wrong (unless the costs are now exactly 15%)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["A rise of 10 percent", true, "Correct! (Note: nouns can use 'of', but verbs use 'by')."],
            ["It rose of 10 percent", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the preposition for the target: 'The population grew ____ 1 million.'",
        answers: ["to"]
    },
    9: {
        type: "radio",
        question: "Is 'It increased from $500' correct to describe the gap?",
        answers: [
            ["No, use 'by $500'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct verb prepositions:",
        answers: [
            ["Decrease by half", true, "Correct!"],
            ["Reduced to zero", true, "Correct!"],
            ["Expanded of 5 meters", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'By' shows the difference between the old and new values.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The stock price dropped to 5 dollars.' (The drop was 5 dollars).",
        answers: ["dropped by 5 dollars"]
    }
},

// 1020 Temporal Prepositions (At, On, In)
"1020": {
    1: {
        type: "radio",
        question: "Which preposition is used for specific times of day (e.g., 5 PM, noon)?",
        answers: [
            ["At", true, "Correct!"],
            ["On", false, "Wrong."],
            ["In", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which preposition is used for days and specific dates (e.g., Monday, July 4th)?",
        answers: [
            ["On", true, "Correct!"],
            ["In", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct temporal pairings:",
        answers: [
            ["In 1990", true, "Correct!"],
            ["On Tuesday", true, "Correct!"],
            ["At breakfast", true, "Correct!"],
            ["In July 4th", false, "Wrong. (Dates need 'on')."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I was born at 1985.'",
        answers: ["I was born in 1985"]
    },
    5: {
        type: "radio",
        question: "What do we use for seasons (Summer, Winter)?",
        answers: [
            ["In", true, "Correct!"],
            ["On", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I'll see you ______ the weekend.'",
        answers: [
            ["at", true, "Correct! (UK)"],
            ["on", true, "Correct! (US)"],
            ["in", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["In the morning", true, "Correct!"],
            ["At the morning", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the preposition for 'night'?",
        answers: ["at"]
    },
    9: {
        type: "radio",
        question: "Is 'I have a meeting in Monday' correct?",
        answers: [
            ["No, use 'on Monday'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["At midnight", true, "Correct!"],
            ["In the 21st century", true, "Correct!"],
            ["On the afternoon", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: We use 'in' for longer periods like months, years, and centuries.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The shop opens in 8 o'clock.'",
        answers: ["at 8 o'clock"]
    }
},

// 1030 Preposition of Purpose (To vs For)
"1030": {
    1: {
        type: "radio",
        question: "To express a purpose with a verb, which structure should you use?",
        answers: [
            ["To + infinitive (e.g., to buy)", true, "Correct!"],
            ["For + infinitive (e.g., for buy)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Can you use 'for' to express purpose?",
        answers: [
            ["Only with a noun (e.g., for a coffee) or a gerund (for buying).", true, "Correct!"],
            ["Yes, with any verb form.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Which of these express purpose correctly?",
        answers: [
            ["I went to the store to get milk.", true, "Correct!"],
            ["I went to the store for getting milk.", true, "Correct (but 'to get' is more common)."],
            ["I went to the store for get milk.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I am here for learn English.'",
        answers: ["I am here to learn English"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We use a knife ______ bread.'",
        answers: [
            ["to cut", true, "Correct!"],
            ["for to cut", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is the correct way to say you traveled for a specific reason?",
        answers: [
            ["I traveled to see the world.", true, "Correct!"],
            ["I traveled for see the world.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I came here for a meeting.", true, "Correct! (For + Noun)."],
            ["I came here to a meeting.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'She called ____ say hello.'",
        answers: ["to"]
    },
    9: {
        type: "radio",
        question: "Is 'He works for earn money' correct?",
        answers: [
            ["No, use 'to earn money'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct 'To' vs 'For':",
        answers: [
            ["Designed for comfort.", true, "Correct!"],
            ["Designed to be comfortable.", true, "Correct!"],
            ["Designed for to be comfortable.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using 'for' + infinitive is a very common error for speakers of languages where the preposition 'for' (like 'pour' or 'für') is used this way.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'I stop at the bank for get some cash.'",
        answers: ["to get some cash"]
    }
},

// 1035 Scale (To) vs Area (By)
"1035": {
    1: {
        type: "radio",
        question: "Which preposition is used for a scale or ratio (e.g., 1:100)?",
        answers: [
            ["To", true, "Correct! (One to a hundred)."],
            ["By", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which preposition is used for dimensions or areas (e.g., 10x10)?",
        answers: [
            ["By", true, "Correct! (Ten by ten)."],
            ["To", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["A four-by-four car (4x4).", true, "Correct!"],
            ["A scale of one to ten.", true, "Correct!"],
            ["A room ten to twelve meters.", false, "Wrong. (Should be 'by')."]
        ]
    },
    4: {
        type: "text_multi",
        question: "How do you say '10:1' out loud?",
        answers: ["ten to one"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'The garden is fifteen ______ twenty meters.'",
        answers: [
            ["by", true, "Correct!"],
            ["to", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which describes a photo's aspect ratio?",
        answers: [
            ["Sixteen to nine (16:9).", true, "Correct!"],
            ["Sixteen by nine.", false, "Wrong (usually)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for a wood plank?",
        answers: [
            ["A two-by-four.", true, "Correct!"],
            ["A two-to-four.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the preposition for a ratio: 'The odds are three ____ one.'",
        answers: ["to"]
    },
    9: {
        type: "radio",
        question: "Is 'A scale 1 by 100' correct?",
        answers: [
            ["No, use '1 to 100'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct dimension phrases:",
        answers: [
            ["Side by side", true, "Correct!"],
            ["Bit by bit", true, "Correct!"],
            ["Three by five index card", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: In dimensions, 'by' essentially represents the 'x' (multiplication) symbol.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The scale of the map is one by fifty thousand.'",
        answers: ["one to fifty thousand"]
    }
},

// 1040 No Future Tense in Time Clauses (Will)
"1040": {
    1: {
        type: "radio",
        question: "In a time clause (starting with 'when', 'as soon as', 'before'), which tense should you use for the future?",
        answers: [
            ["Present Simple", true, "Correct! (e.g., When I arrive)."],
            ["Future Simple", false, "Wrong. (e.g., When I will arrive)."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I will tell him when I will see him' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'when I see him'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct future-referring time clauses:",
        answers: [
            ["As soon as I finish, I'll call.", true, "Correct!"],
            ["Before you go, say goodbye.", true, "Correct!"],
            ["Until it will stop raining, we wait.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I'll help you after I will eat.'",
        answers: ["after I eat"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We ______ until the sun ______.'",
        answers: [
            ["will wait / sets", true, "Correct!"],
            ["wait / will set", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Once you arrive, let me know.", true, "Correct!"],
            ["Once you will arrive, let me know.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Can we use 'will' in the main part of the sentence?",
        answers: [
            ["Yes, only the 'time clause' part loses the 'will'.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'I won't start until you ____ ready.'",
        answers: ["are"]
    },
    9: {
        type: "radio",
        question: "Is 'When I am older, I will be famous' correct?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify incorrect time clauses:",
        answers: [
            ["If I will go", true, "Incorrect (Conditionals follow the same rule)."],
            ["When I will go", true, "Incorrect."],
            ["When I go", false, "Correct."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using 'will' in time clauses is a common error for speakers of languages where the future is used in both parts.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'As soon as the flight will land, I'll text you.'",
        answers: ["As soon as the flight lands"]
    }
},

// 1041 Preposition of Static Position (Under vs Down)
"1041": {
    1: {
        type: "radio",
        question: "Which preposition describes a static location below something else?",
        answers: [
            ["Under", true, "Correct!"],
            ["Down", false, "Wrong. 'Down' implies movement or direction."]
        ]
    },
    2: {
        type: "radio",
        question: "Which preposition describes a direction of movement?",
        answers: [
            ["Down", true, "Correct! (e.g., walk down the hill)."],
            ["Under", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct static positions:",
        answers: [
            ["The cat is under the table.", true, "Correct!"],
            ["The village is under the mountain.", true, "Correct!"],
            ["The keys are down the table.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He lives down the street.' (Wait, this is an idiom). Correct: 'The submarine is down the water.'",
        answers: ["The submarine is under the water"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'I hid the letter ______ my pillow.'",
        answers: [
            ["under", true, "Correct!"],
            ["down", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is correct for a level in a building?",
        answers: [
            ["Downstairs", true, "Correct!"],
            ["Understairs", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["He is below me in the rankings.", true, "Correct!"],
            ["He is down me in the rankings.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing preposition: 'The boat sank ____ the surface.'",
        answers: ["under", "below"]
    },
    9: {
        type: "radio",
        question: "Is 'Look down!' a movement or static direction?",
        answers: [
            ["Direction.", true, "Correct!"],
            ["Static position.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["Under pressure", true, "Correct!"],
            ["Under control", true, "Correct!"],
            ["Down the bridge", false, "Wrong (unless moving)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Avoid 'down' for stationary objects; use 'under' or 'below'.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The monster is down the bed.'",
        answers: ["The monster is under the bed"]
    }
},

// 1042 Part of a Whole (Top vs Above)
"1042": {
    1: {
        type: "radio",
        question: "Which word describes the actual 'highest part' of an object?",
        answers: [
            ["Top", true, "Correct! (e.g., top of the page)."],
            ["Above", false, "Wrong. 'Above' means higher than the object, but not touching it."]
        ]
    },
    2: {
        type: "radio",
        question: "Which word describes the 'lowest part' of an object?",
        answers: [
            ["Bottom", true, "Correct! (e.g., bottom of the cup)."],
            ["Under", false, "Wrong. 'Under' means below the object."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct 'part of a whole' terms:",
        answers: [
            ["The top of the mountain", true, "Correct!"],
            ["The above of the mountain", false, "Wrong."],
            ["The front of the house", true, "Correct!"],
            ["The upper of the house", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Write your name on the upper of the form.'",
        answers: ["the top of the form"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'There is a bird ______ the roof.'",
        answers: [
            ["on top of", true, "Correct!"],
            ["above", false, "Wrong (that would mean it's flying over it)."]
        ]
    },
    6: {
        type: "radio",
        question: "Which describes a specific page location?",
        answers: [
            ["The bottom of the page.", true, "Correct!"],
            ["The below of the page.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["The top floor", true, "Correct!"],
            ["The above floor", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'The ____ of the class.' (the best students)",
        answers: ["top"]
    },
    9: {
        type: "radio",
        question: "Is 'The upper part' correct?",
        answers: [
            ["Yes, 'upper' and 'lower' can be adjectives for parts.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct phrases:",
        answers: [
            ["The bottom line", true, "Correct!"],
            ["The top drawer", true, "Correct!"],
            ["The under of the car", false, "Wrong. (The underside)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Above' and 'Below' are for comparing two separate objects, not parts of one object.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'He stood on the above of the hill.'",
        answers: ["the top of the hill"]
    }
},

// 1050 Collocations (Interested in, Depend on)
"1050": {
    1: {
        type: "radio",
        question: "Which preposition always follows the adjective 'interested'?",
        answers: [
            ["In", true, "Correct!"],
            ["At", false, "Wrong."],
            ["Of", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which preposition follows the verb 'depend'?",
        answers: [
            ["On", true, "Correct!"],
            ["Of", false, "Wrong."],
            ["From", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct collocations:",
        answers: [
            ["Good at math", true, "Correct!"],
            ["Interested in art", true, "Correct!"],
            ["Afraid from spiders", false, "Wrong. (Afraid of)."],
            ["Succeed in business", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I am bad in cooking.'",
        answers: ["I am bad at cooking"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Are you afraid ______ the dark?'",
        answers: [
            ["of", true, "Correct!"],
            ["at", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She is married ______ a doctor.'",
        answers: [
            ["to", true, "Correct!"],
            ["with", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I apologize for the delay.", true, "Correct!"],
            ["I apologize at the delay.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the preposition for 'wait': 'We are waiting ____ the bus.'",
        answers: ["for"]
    },
    9: {
        type: "radio",
        question: "Is 'I am angry with you' correct?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct combinations:",
        answers: [
            ["Listen to music", true, "Correct!"],
            ["Look at the sky", true, "Correct!"],
            ["Agree with me", true, "Correct!"],
            ["Think at it", false, "Wrong. (Think about/of)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Collocations are fixed pairs that often don't follow a logical rule and must be memorized.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'It depends of my boss.'",
        answers: ["It depends on my boss"]
    }
},

// 1100 Verb Complement Choice (Infinitive vs Gerund)
"1100": {
    1: {
        type: "radio",
        question: "After 'promise', which form do you use?",
        answers: [
            ["To + infinitive (e.g., promise to help)", true, "Correct!"],
            ["Gerund (e.g., promise helping)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "After 'enjoy', which form do you use?",
        answers: [
            ["Gerund (e.g., enjoy reading)", true, "Correct!"],
            ["To + infinitive (e.g., enjoy to read)", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct complements:",
        answers: [
            ["I decided to go.", true, "Correct!"],
            ["I finished to work.", false, "Wrong. (Finished working)."],
            ["I want to see you.", true, "Correct!"],
            ["I suggest to wait.", false, "Wrong. (Suggest waiting)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I stopped to smoke.' (if you mean you no longer smoke)",
        answers: ["I stopped smoking"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'He promised ______ me back.'",
        answers: [
            ["to call", true, "Correct!"],
            ["calling", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She avoids ______ late.'",
        answers: [
            ["arriving", true, "Correct!"],
            ["to arrive", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I remember to lock the door.", true, "Correct! (I didn't forget)."],
            ["I remember locking the door.", true, "Correct! (I have the memory)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "Correct: 'I look forward to see you.'",
        answers: ["I look forward to seeing you"]
    },
    9: {
        type: "radio",
        question: "Can 'like' take both forms?",
        answers: [
            ["Yes (e.g., I like to swim / I like swimming).", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct 'Gerund only' verbs:",
        answers: [
            ["Mind", true, "Correct!"],
            ["Finish", true, "Correct!"],
            ["Plan", false, "Wrong (Plan to...)."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: There is no easy rule; you have to learn which verbs take which form.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'They decided going by train.'",
        answers: ["They decided to go"]
    }
},

// 1111 Gerund after Specific Verbs (Enjoy, Mind, etc.)
"1111": {
    1: {
        type: "radio",
        question: "Which form follows the verb 'suggest'?",
        answers: [
            ["Gerund (e.g., suggest going)", true, "Correct!"],
            ["Infinitive (e.g., suggest to go)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which form follows 'avoid'?",
        answers: [
            ["Gerund (e.g., avoid eating)", true, "Correct!"],
            ["Infinitive", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct gerund usage:",
        answers: [
            ["I don't mind waiting.", true, "Correct!"],
            ["He recommended reading the book.", true, "Correct!"],
            ["We enjoyed to watch the sunset.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I enjoy to swim.'",
        answers: ["I enjoy swimming"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'Would you mind ______ the window?'",
        answers: [
            ["closing", true, "Correct!"],
            ["to close", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I recommend ______ a taxi.'",
        answers: [
            ["taking", true, "Correct!"],
            ["to take", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Keep working!", true, "Correct!"],
            ["Keep to work!", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing form: 'I avoid ____ (eat) sugar.'",
        answers: ["eating"]
    },
    9: {
        type: "radio",
        question: "Is 'He finished to read' correct?",
        answers: [
            ["No, use 'finished reading'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify verbs that require the Gerund:",
        answers: [
            ["Consider", true, "Correct!"],
            ["Miss", true, "Correct!"],
            ["Decide", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using the infinitive after these verbs is a very frequent error for students.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'She suggested to go to the park.'",
        answers: ["She suggested going"]
    }
},

// 1112 Gerund after Prepositions
"1112": {
    1: {
        type: "radio",
        question: "When a verb follows a preposition (in, at, for, about), what form must it be?",
        answers: [
            ["Gerund (e.g., in learning)", true, "Correct!"],
            ["Infinitive (e.g., in to learn)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I'm sorry for to be late' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'for being late'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct preposition + gerund combinations:",
        answers: [
            ["Interested in buying.", true, "Correct!"],
            ["Good at singing.", true, "Correct!"],
            ["Afraid of to fall.", false, "Wrong. (Afraid of falling)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He left without to say goodbye.'",
        answers: ["without saying goodbye"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'How about ______ tonight?'",
        answers: [
            ["going out", true, "Correct!"],
            ["to go out", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'They succeeded ______ the job.'",
        answers: [
            ["in getting", true, "Correct!"],
            ["to get", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I'm tired of waiting.", true, "Correct!"],
            ["I'm tired to wait.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing form: 'Thanks for ____ (help) me.'",
        answers: ["helping"]
    },
    9: {
        type: "radio",
        question: "Can we say 'He is famous for his singing'?",
        answers: [
            ["Yes, 'singing' is the gerund here.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["Instead of crying.", true, "Correct!"],
            ["By working hard.", true, "Correct!"],
            ["For to help.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Every time you have 'Preposition + Verb', the verb must end in -ing.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'She is thinking about to move to Berlin.'",
        answers: ["about moving"]
    }
},

// 1113 Gerund as Subject
"1113": {
    1: {
        type: "radio",
        question: "When a verb is the subject of a sentence, which form is standard?",
        answers: [
            ["Gerund (e.g., Smoking is bad).", true, "Correct!"],
            ["Infinitive (e.g., To smoke is bad).", false, "Correct, but much more formal and less common."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'Run is good for you' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'Running is good'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct subject usage:",
        answers: [
            ["Eating healthy is important.", true, "Correct!"],
            ["Learn English is fun.", false, "Wrong."],
            ["Traveling opens the mind.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Read books helps you learn.'",
        answers: ["Reading books helps you learn"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: '______ is my favorite hobby.'",
        answers: [
            ["Cooking", true, "Correct!"],
            ["To cook", false, "Wrong (too formal)."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is the correct warning?",
        answers: [
            ["Parking is prohibited.", true, "Correct!"],
            ["To park is prohibited.", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Working hard leads to success.", true, "Correct!"],
            ["Work hard leads to success.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing form: '____ (sleep) too much makes me tired.'",
        answers: ["Sleeping"]
    },
    9: {
        type: "radio",
        question: "Is 'Is good to exercise' correct?",
        answers: [
            ["No, use 'It is good to exercise' or 'Exercising is good'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct subject gerunds:",
        answers: [
            ["Waiting is difficult.", true, "Correct!"],
            ["Winning isn't everything.", true, "Correct!"],
            ["Swim is fun.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using the base verb as a subject is a common error in many languages, but English needs the -ing form.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Live in a big city is expensive.'",
        answers: ["Living in a big city is expensive"]
    }
},

// 1115 Infinitive after Specific Verbs (Decide, Plan, etc.)
"1115": {
    1: {
        type: "radio",
        question: "Which form follows the verb 'decide'?",
        answers: [
            ["To + infinitive (e.g., decide to go)", true, "Correct!"],
            ["Gerund (e.g., decide going)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Which form follows 'hope'?",
        answers: [
            ["To + infinitive", true, "Correct!"],
            ["Gerund", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct infinitive usage:",
        answers: [
            ["I plan to travel next year.", true, "Correct!"],
            ["I hope seeing you soon.", false, "Wrong. (Hope to see)."],
            ["He offered to help me.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'She promised helping us.'",
        answers: ["She promised to help us"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We ______ to go out tonight.'",
        answers: [
            ["want", true, "Correct!"],
            ["suggest", false, "Wrong (suggest + -ing)."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'They ______ to buy a new house.'",
        answers: [
            ["decided", true, "Correct!"],
            ["enjoyed", false, "Wrong (enjoyed + -ing)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I am learning to drive.", true, "Correct!"],
            ["I am learning driving.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'He refused ____ (answer) the question.'",
        answers: ["to answer"]
    },
    9: {
        type: "radio",
        question: "Is 'I plan traveling' correct?",
        answers: [
            ["No, use 'I plan to travel'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify verbs that require the Infinitive:",
        answers: [
            ["Agree", true, "Correct!"],
            ["Promise", true, "Correct!"],
            ["Avoid", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Most verbs about 'future intention' or 'choice' take the infinitive.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'We hope seeing you tomorrow.'",
        answers: ["We hope to see you tomorrow"]
    }
},

// 1116 Infinitive after Adjectives
"1116": {
    1: {
        type: "radio",
        question: "When a verb follows an adjective (happy, easy, difficult), what form is usually used?",
        answers: [
            ["To + infinitive (e.g., happy to help)", true, "Correct!"],
            ["Gerund (e.g., happy helping)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'It's difficult understanding him' correct?",
        answers: [
            ["No, use 'difficult to understand'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct adjective + infinitive combinations:",
        answers: [
            ["She is eager to learn.", true, "Correct!"],
            ["He was surprised seeing her.", false, "Wrong. (Surprised to see)."],
            ["It is impossible to finish.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I am so glad seeing you.'",
        answers: ["I am so glad to see you"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'It is important ______ quiet.'",
        answers: [
            ["to be", true, "Correct!"],
            ["being", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Are you ready ______?'",
        answers: [
            ["to go", true, "Correct!"],
            ["going", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["English is easy to learn.", true, "Correct!"],
            ["English is easy learning.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'I was afraid ____ (ask).'",
        answers: ["to ask"]
    },
    9: {
        type: "radio",
        question: "Is 'I am happy to help' the same as 'I am happy helping'?",
        answers: [
            ["No, the second one is less common and usually refers to a specific ongoing action.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["Nice to meet you.", true, "Correct!"],
            ["Afraid to go.", true, "Correct!"],
            ["Safe to use.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: If you can say 'it is [adjective]...', the next verb is almost always an infinitive.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'She was excited moving to a new city.'",
        answers: ["excited to move"]
    }
},

// 1117 Let and Make (No 'To')
"1117": {
    1: {
        type: "radio",
        question: "What form follows the verbs 'let' or 'make' when you mention a person?",
        answers: [
            ["Base infinitive without 'to' (e.g., make me go)", true, "Correct!"],
            ["Infinitive with 'to' (e.g., make me to go)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'He made me to cry' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'He made me cry'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct usage of 'let' and 'make':",
        answers: [
            ["Let me see.", true, "Correct!"],
            ["Let me to see.", false, "Wrong."],
            ["My boss makes me work late.", true, "Correct!"],
            ["They didn't let him leave.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'Please let me to help you.'",
        answers: ["Please let me help you"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'The movie made me ______.'",
        answers: [
            ["laugh", true, "Correct!"],
            ["to laugh", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'Don't let them ______.'",
        answers: [
            ["win", true, "Correct!"],
            ["to win", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["He made her repeat it.", true, "Correct!"],
            ["He made her repeating it.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'Let it ____.' (The Beatles song)",
        answers: ["be"]
    },
    9: {
        type: "radio",
        question: "Is 'I was made to wait' an exception?",
        answers: [
            ["Yes, in the passive voice, 'make' uses 'to'.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct 'Let/Make' sentences:",
        answers: [
            ["Make it happen.", true, "Correct!"],
            ["Let's go.", true, "Correct!"],
            ["Let me to go.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using 'to' after 'let' or 'make' is a very common mistake for French or German speakers.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The teacher made us to write an essay.'",
        answers: ["made us write an essay"]
    }
},

// 1120 Special Expressions (Look forward to)
"1120": {
    1: {
        type: "radio",
        question: "After 'I look forward to', which form is used?",
        answers: [
            ["Gerund (e.g., seeing you)", true, "Correct!"],
            ["Infinitive (e.g., see you)", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I am used to drive on the left' correct?",
        answers: [
            ["No, use 'driving' after 'be used to'.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct special combinations:",
        answers: [
            ["I look forward to meeting you.", true, "Correct!"],
            ["He is getting used to working early.", true, "Correct!"],
            ["I look forward to meet you.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I am looking forward to hear from you.'",
        answers: ["I am looking forward to hearing from you"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'They aren't used to ______ in a city.'",
        answers: [
            ["living", true, "Correct!"],
            ["live", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Which is correct for a letter ending?",
        answers: [
            ["I look forward to your reply.", true, "Correct! (Noun is fine)."],
            ["I look forward to replying.", true, "Correct! (Gerund is fine)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Get used to waking up early.", true, "Correct!"],
            ["Get used to wake up early.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing form: 'I'm used to ____ (eat) spicy food.'",
        answers: ["eating"]
    },
    9: {
        type: "radio",
        question: "Is 'to' a preposition in these specific expressions?",
        answers: [
            ["Yes, which is why it is followed by -ing.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct usage:",
        answers: [
            ["Looking forward to seeing the result.", true, "Correct!"],
            ["Used to live in a house.", false, "Wrong (Wait! 'I used to live' is past habit. 'I am used to living' is the current feeling)."],
            ["He's used to his new job.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: 'Used to + inf' (past habit) and 'Be used to + -ing' (accustomed to) are completely different rules.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'We are looking forward to go on holiday.'",
        answers: ["to going on holiday"]
    }
},

// 1130 No Past Simple in Verb Complements (to went)
"1130": {
    1: {
        type: "radio",
        question: "After 'to', can you use a past tense verb like 'went' or 'saw'?",
        answers: [
            ["No, always use the base infinitive (to go, to see).", true, "Correct!"],
            ["Yes, if the sentence is in the past.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'We decided to went home' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'decided to go'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct past-related infinitives:",
        answers: [
            ["I wanted to stay.", true, "Correct!"],
            ["I wanted to stayed.", false, "Wrong."],
            ["They promised to come.", true, "Correct!"],
            ["They promised to came.", false, "Wrong."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He forgot to brought his keys.'",
        answers: ["He forgot to bring his keys"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'It was hard ______ him.'",
        answers: [
            ["to find", true, "Correct!"],
            ["to found", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She expected him ______.'",
        answers: [
            ["to arrive", true, "Correct!"],
            ["to arrived", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I needed to talk to you.", true, "Correct!"],
            ["I needed to talked to you.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing word: 'He began ____ (run) when he saw us.'",
        answers: ["to run", "running"]
    },
    9: {
        type: "radio",
        question: "Is 'To have seen' a correct 'past infinitive'?",
        answers: [
            ["Yes, but the 'to' is still followed by the base 'have'.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the INCORRECT 'to + past' combinations:",
        answers: [
            ["To saw", true, "Incorrect."],
            ["To spoken", true, "Incorrect."],
            ["To speak", false, "Correct."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: The word 'to' acts as a sign for the infinitive form, which never changes for tense.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'She was the first person to arrived.'",
        answers: ["the first person to arrive"]
    }
},

// 1140 Want Construction (I want you to...)
"1140": {
    1: {
        type: "radio",
        question: "Which is the correct way to say 'Je veux que tu viennes'?",
        answers: [
            ["I want you to come.", true, "Correct!"],
            ["I want that you come.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Can 'want' be followed by 'that'?",
        answers: [
            ["Generally no; use the 'want + person + to' construction.", true, "Correct!"],
            ["Yes, it's very common.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct 'want' usage:",
        answers: [
            ["I want her to stay.", true, "Correct!"],
            ["I want that she stays.", false, "Wrong."],
            ["We want it to rain.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'He wants that I help him.'",
        answers: ["He wants me to help him"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'They want ______ some cake.'",
        answers: [
            ["us to eat", true, "Correct!"],
            ["that we eat", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I just want ______ happy.'",
        answers: [
            ["you to be", true, "Correct!"],
            ["that you are", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Does she want me to call?", true, "Correct!"],
            ["Does she want that I call?", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing phrase: 'She wants ____ ____ (help) her.' (me)",
        answers: ["me to help"]
    },
    9: {
        type: "radio",
        question: "Is 'I want to go' correct?",
        answers: [
            ["Yes, if the person wanting and doing the action is the same.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the correct structures:",
        answers: [
            ["Want + person + to + verb", true, "Correct!"],
            ["Want + that + subject + verb", false, "Wrong."],
            ["Want + to + verb", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: This construction (I want you to) also applies to verbs like 'expect' and 'would like'.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'We want that the government changes the law.'",
        answers: ["We want the government to change the law"]
    }
},

// 1150 Negative Verb Complement (Not to go)
"1150": {
    1: {
        type: "radio",
        question: "Where do you place 'not' in a negative infinitive (e.g., to go)?",
        answers: [
            ["Before 'to' (e.g., not to go).", true, "Correct!"],
            ["After 'to' (e.g., to not go).", true, "Acceptable (split infinitive), but 'not to go' is more traditional."],
            ["Before the main verb (e.g., to don't go).", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'I decided to don't go' correct?",
        answers: [
            ["True", false, "Wrong. Should be 'I decided not to go'."],
            ["False", true, "Correct!"]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct negative complements:",
        answers: [
            ["He told me not to worry.", true, "Correct!"],
            ["I enjoy not working today.", true, "Correct!"],
            ["She promised to not tell.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'I try to don't eat too much.'",
        answers: ["I try not to eat too much"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'It is important ______ late.'",
        answers: [
            ["not to be", true, "Correct!"],
            ["don't be", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'She prefers ______ by train.'",
        answers: [
            ["not traveling", true, "Correct!"],
            ["to not traveling", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["I'd rather not go.", true, "Correct!"],
            ["I'd rather to not go.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing part: 'They decided ____ ____ ____ (buy) the car.'",
        answers: ["not to buy"]
    },
    9: {
        type: "radio",
        question: "Is 'Try not to' the same as 'Don't try to'?",
        answers: [
            ["No, 'Try not to' means your attempt is about avoiding something.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct negative forms:",
        answers: [
            ["Happy not to see him.", true, "Correct!"],
            ["Worrying about not being on time.", true, "Correct!"],
            ["Trying for don't fall.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Verb complements are not conjugated, so they never use 'don't', 'doesn't', or 'didn't'.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'Be careful to don't fall!'",
        answers: ["not to fall"]
    }
},

// 1210 Possessive 's (John's car)
"1210": {
    1: {
        type: "radio",
        question: "What is the standard way to show possession for people?",
        answers: [
            ["Possessive 's (e.g., John's car).", true, "Correct!"],
            ["Of structure (e.g., the car of John).", false, "Wrong (unnatural for people)."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'the house of my sister' natural English?",
        answers: [
            ["No, use 'my sister's house'.", true, "Correct!"],
            ["Yes, it's perfect.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct possessive forms:",
        answers: [
            ["The boy's bike.", true, "Correct!"],
            ["My father's hat.", true, "Correct!"],
            ["The car of the doctor.", false, "Wrong (the doctor's car)."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The book of Peter is long.'",
        answers: ["Peter's book is long"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'I'm going to ______ house.'",
        answers: [
            ["Sarah's", true, "Correct!"],
            ["the house of Sarah", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'This is my ______ laptop.'",
        answers: [
            ["friend's", true, "Correct!"],
            ["friend laptop", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["Today's weather", true, "Correct!"],
            ["The weather of today", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the possessive form of 'the child'?",
        answers: ["the child's"]
    },
    9: {
        type: "radio",
        question: "Is 'The dog's bone' correct?",
        answers: [
            ["True", true, "Correct! (Animals also use 's)."],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct 's usage:",
        answers: [
            ["Yesterday's news.", true, "Correct!"],
            ["A month's salary.", true, "Correct!"],
            ["The car's of my neighbors.", false, "Wrong."]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Using 'the ... of ...' for people is a common direct translation from languages like French.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The bicycle of the girl is pink.'",
        answers: ["The girl's bicycle is pink"]
    }
},

// 1220 Unusual 's (Inanimate objects)
"1220": {
    1: {
        type: "radio",
        question: "Which structure is usually better for inanimate objects?",
        answers: [
            ["Of structure (e.g., the roof of the house).", true, "Correct!"],
            ["Possessive 's (e.g., the house's roof).", false, "Less common/unnatural."]
        ]
    },
    2: {
        type: "radio",
        question: "Is 'the table's leg' the most natural form?",
        answers: [
            ["No, 'the leg of the table' or 'the table leg' is better.", true, "Correct!"],
            ["Yes.", false, "Wrong."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the better choice for inanimate objects:",
        answers: [
            ["The back of the chair.", true, "Correct!"],
            ["The chair's back.", false, "Less natural."],
            ["The end of the movie.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The book's page is torn.'",
        answers: ["The page of the book", "the book page"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'What is the ______?'",
        answers: [
            ["name of the street", true, "Correct!"],
            ["street's name", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'The ______ was locked.'",
        answers: [
            ["door of the car", true, "Correct!"],
            ["car's door", false, "Less natural (though common for vehicles)."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct?",
        answers: [
            ["The capital of France.", true, "Correct!"],
            ["France's capital.", true, "Correct! (Countries are an exception)."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the missing part: 'The bottom ____ the ocean.'",
        answers: ["of"]
    },
    9: {
        type: "radio",
        question: "Can we use 's for organizations (e.g., the company's policy)?",
        answers: [
            ["Yes, organizations are treated like groups of people.", true, "Correct!"],
            ["No.", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify the better 'Of' usage:",
        answers: [
            ["The color of the sky.", true, "Correct!"],
            ["The sky's color.", false, "Less natural."],
            ["The result of the test.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: We generally avoid 's for inanimate objects unless they are time expressions or countries.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The day's time is 2 PM.'",
        answers: ["The time of day is 2 PM"]
    }
},

// 1230 Plural Possessive (Friends' car)
"1230": {
    1: {
        type: "radio",
        question: "Where do you put the apostrophe for a plural noun ending in -s (e.g., friends)?",
        answers: [
            ["After the -s (e.g., friends').", true, "Correct!"],
            ["Before the -s (e.g., friend's).", false, "Wrong (that is singular)."]
        ]
    },
    2: {
        type: "radio",
        question: "Which is the correct possessive for 'parents' (two people)?",
        answers: [
            ["My parents' house.", true, "Correct!"],
            ["My parent's house.", false, "Wrong (that implies one parent)."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify the correct plural possessives:",
        answers: [
            ["The teachers' room.", true, "Correct!"],
            ["The childrens' toys.", false, "Wrong. ('Children' is already plural, so use 's: 'children's')."],
            ["The students' exam.", true, "Correct!"]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the error: 'The two dogs's bones.'",
        answers: ["the two dogs' bones"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'We went to my ______ house.' (two grandparents)",
        answers: [
            ["grandparents'", true, "Correct!"],
            ["grandparent's", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'The ______ uniforms are blue.' (the workers)",
        answers: [
            ["workers'", true, "Correct!"],
            ["workers's", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for an irregular plural like 'men'?",
        answers: [
            ["The men's room.", true, "Correct! (If it doesn't end in -s, use 's)."],
            ["The mens' room.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the plural possessive of 'student'?",
        answers: ["students'"]
    },
    9: {
        type: "radio",
        question: "Is 'The ladies' bags' correct?",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct plural 's forms:",
        answers: [
            ["The players' coach.", true, "Correct!"],
            ["Women's rights.", true, "Correct!"],
            ["Birds' nests.", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: If the plural word doesn't end in 's' (like 'people'), you still add ''s'.",
        answers: [
            ["True (e.g., people's).", true, "Correct!"],
            ["False.", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'The boys's bikes are here.'",
        answers: ["The boys' bikes are here"]
    }
},

// 1300/1310 Short Answers/Agreement (Yes, I did / So did I)
"1300": {
    1: {
        type: "radio",
        question: "When someone says 'I like pizza', how do you agree using 'so'?",
        answers: [
            ["So do I.", true, "Correct!"],
            ["So I do.", false, "Wrong."]
        ]
    },
    2: {
        type: "radio",
        question: "If someone asks 'Did you see the movie?', what is a polite short answer?",
        answers: [
            ["Yes, I did.", true, "Correct!"],
            ["Yes.", false, "Correct, but can sound dry or cold."]
        ]
    },
    3: {
        type: "checkbox",
        question: "Identify correct short answers:",
        answers: [
            ["No, I haven't.", true, "Correct!"],
            ["Yes, she is.", true, "Correct!"],
            ["Yes, I do like.", false, "Wrong. (Just 'Yes, I do')."]
        ]
    },
    4: {
        type: "text_multi",
        question: "Correct the agreement: 'I have a car.' - 'So have I.' (if using 'do' support)",
        answers: ["So do I"]
    },
    5: {
        type: "radio",
        question: "Fill in the blank: 'You haven't seen her, ______?'",
        answers: [
            ["have you", true, "Correct! (Question tag)."],
            ["haven't you", false, "Wrong."]
        ]
    },
    6: {
        type: "radio",
        question: "Fill in the blank: 'I was late.' - 'Oh, ______.'",
        answers: [
            ["so was I", true, "Correct!"],
            ["so did I", false, "Wrong."]
        ]
    },
    7: {
        type: "radio",
        question: "Which is correct for 'Neither'?",
        answers: [
            ["I don't like it. - Neither do I.", true, "Correct!"],
            ["I don't like it. - Neither I do.", false, "Wrong."]
        ]
    },
    8: {
        type: "text_multi",
        question: "What is the short answer: 'Can you swim? Yes, ____ ____.'",
        answers: ["I can"]
    },
    9: {
        type: "radio",
        question: "Is 'I will' a polite response to 'Will you help me?'",
        answers: [
            ["Yes, I will.", true, "Correct!"],
            ["Yes.", false, "Too short."]
        ]
    },
    10: {
        type: "checkbox",
        question: "Identify correct auxiliaries for interest:",
        answers: [
            ["I went to Paris. - Did you?", true, "Correct!"],
            ["I'm tired. - Are you?", true, "Correct!"],
            ["I like it. - Do you?", true, "Correct!"]
        ]
    },
    11: {
        type: "radio",
        question: "True or False: Repeating the auxiliary makes you sound more engaged in the conversation.",
        answers: [
            ["True", true, "Correct!"],
            ["False", false, "Wrong."]
        ]
    },
    12: {
        type: "text_multi",
        question: "Fix this: 'She doesn't smoke.' - 'Neither she does.'",
        answers: ["Neither does she"]
    }
},

}