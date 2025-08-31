interface ErrorEntry {
  short_slug: string;
  description: string;
  reference: string;
  recommendation: string;
  examples: string;
}

export const errorsData: Record<string, ErrorEntry> = {
    "0110":{
        "short_slug": "plural-s", 
        "description": "forgetting to pronounce or write plural '-s'",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0110' target='_blank'>error 0110</a>)",
        "recommendation": "try to concentrate specifically on saying plural -s clearly at the end of every plural word",
        "examples": "'-s' endings always have to be clearly audible: carS, wallS, crackS, lakeS, shelveS, etc."
    },
    "0111":{
        "short_slug": "wild-plural-s", 
        "description": "adding a plural '-s' ending to words in singular form",
        "reference": "section 1.1.1 in the pdf grammar manual",
        "recommendation": "slow down when you speak and focus specifically on having control over -s endings",
        "examples": "'one pieces'; 'a machines', etc."
    },
    "0120":{
        "short_slug": "plural-irreg",
        "description": "incorrect plural form for an irregular plural",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0120' target='_blank'>error 0120</a>)",
        "recommendation": "remember that a few nouns have irregular plural forms instead of simply adding '-s'",
        "examples":"the plural form of 'child' is 'children', 'man' becomes 'men', 'foot' becomes 'feet', etc."
    },
    "0125":{
        "short_slug": "singular-s",
        "description": "incorrect use of a plural noun",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0125' target='_blank'>error 0125</a>)",
        "recommendation": "remember that the singular form of a few nouns ends in -s",
        "examples": "one series, a means of transportation, economics is important, etc."
    },
    "0130":{
        "short_slug": "plural-noun",
        "description": "incorrect use of a plural noun",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0130' target='_blank'>error 0130</a>)",
        "recommendation": "remember that some nouns can only be used in plural form, since they are plural by definition",
        "examples": "some things always come in pairs, and can only be used in plural form: glasses, jeans, shorts, scissors, headphones, etc."
    },
    "0140":{
        "short_slug": "compound-noun",
        "description": "incorrect use of a compound noun",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0140' target='_blank'>error 0140</a>)",
        "recommendation": "remember that nouns in compound nouns do not have plural endings, except for the last one, which is the base noun",
        "examples": "a woman who is 30 years old is a 30-year old woman; two houses with 3 floors are two 3-floor houses."
    },
    "0141":{
        "short_slug": "compound-noun-style",
        "description": "a compound noun would be more elegant",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0141' target='_blank'>error 0141</a>)",
        "recommendation": "stylistically, a compound noun is usually a better choice than a possessive or a preposition",
        "examples": "'the race car' is more elegant than 'the car for racing'; 'the bird house' is more elegant than 'the birds' house'"
    },
    "0151":{
        "short_slug": "uncountable-as-single-unit",
        "description": "incorrect treatment of an uncountable word as a unit",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0151' target='_blank'>error 0151</a>)",
        "recommendation": "remember that uncountable words cannot be treated as single units; do not use 'a', 'an' or 'one' with them",
        "examples": "avoid saying 'an information'; an example of correct use is 'some information' or 'give me information'"
    },
    "0152":{
        "short_slug": "uncountable-in-plural",
        "description": "incorrect use of an uncountable word in plural form",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0152' target='_blank'>error 0152</a>)",
        "recommendation": "remember that uncountable words are used only in singular form in a way that does not treat them as units; you cannot apply plural forms or conjugations to them",
        "examples": "do not say 'informations are...' or 'furnitures have...'; an example of correct use is 'information is...' or 'furniture has...'"
    },
    "0153":{
        "short_slug": "uncountable-multiple-quantifier",
        "description": "incorrect use of an uncountable word with a counting quantifier",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0153' target='_blank'>error 0153</a>)",
        "recommendation": "remember that uncountable words cannot be treated as units, whether in singular or plural form; they cannot be used with counting quantifiers that treat them as multiple units",
        "examples": "avoid saying 'many informations' or 'several researches'"
    },
    "0161":{
        "short_slug": "a-vs-an",
        "description": "incorrect form of the indefinite article",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0161' target='_blank'>error 0161</a>)",
        "recommendation": "remember that we use 'a' before words beginning with a consonant, and 'an' before words beginning with a vowel (in general)",
        "examples": "a dog, an army, a year, an enemy"
    },
    "0162":{
        "short_slug": "liaison-with-h",
        "description": "incorrect use of 'an' before a word beginning with 'h-'",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0162' target='_blank'>error 0162</a>)",
        "recommendation": "remember that 'h' is a full consonant in English (you need to exhale); for this reason, liaison using 'an' is incorrect",
        "examples": "say 'a hotel', not 'an hotel'; say 'a home', not 'an home'"
    },
    "0163":{
        "short_slug": "the-overuse",
        "description": "overuse of the definite article 'the'",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0163' target='_blank'>error 0163</a>)",
        "recommendation": "use 'the' only when referring to a specific thing that was already mentioned, or one that is obviously known by all, such as 'the moon'",
        "examples": "it is incorrect to say 'The steel is a very strong material' if you are referring to steel in general"
    },
    "0164":{
        "short_slug": "the-with-countries",
        "description": "incorrect use of the definite article 'the' with a country name",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0164' target='_blank'>error 0164</a>)",
        "recommendation": "use 'the' only with countries that have plural names, such as 'the United States' and 'the Netherlands', but not with other countries",
        "examples": "it is incorrect to say 'the Switzerland','the France', or 'the Spain'"
    },    
    "0170":{
        "short_slug": "demonstrative",
        "description": "incorrect form of a demonstrative determiner",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0170' target='_blank'>error 0170</a>)",
        "recommendation": "remember that demonstratives are different for single or multiple objects, and if they are near or far, but they never end in '-s'",
        "examples": "this house here, that house there, these houses here, those houses there"
    },
    "0180":{
        "short_slug": "quant-any-by-itself",
        "description": "incorrect use of the quantifier 'any' to make a negation",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0180' target='_blank'>error 0180</a>)",
        "recommendation": "remember that 'any' is generally used in negative sentences or questions",
        "examples": "Don't say 'I have any money. Say 'Sorry, I don't have any money' or 'I have no money'; Do you have any idea where they went?"
    },
    "0181":{
        "short_slug": "quant-double-negative",
        "description": "incorrect use of the quantifier 'no' in a negatively conjugated sentence",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0181' target='_blank'>error 0181</a>)",
        "recommendation": "remember that 'any' is used with negative conjugations to avoid making a double negative",
        "examples": "Don't say 'I don't have no money. Say 'I don't have any money' or 'I have no money'"
    },
    "0182":{
        "short_slug": "quant-enough",
        "description": "incorrect use of 'enough'",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0182' target='_blank'>error 0182</a>)",
        "recommendation": "remember that 'enough' is placed BEFORE nouns, but AFTER adjectives",
        "examples": "we don't have enough water; the water is hot enough for a nice bath"
    },
    "0183":{
        "short_slug": "quant-many-much",
        "description": "incorrect use of 'many' or 'much'",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0183' target='_blank'>error 0183</a>)",
        "recommendation": "remember that 'many' is used with countable words in plural form, while 'much' is used with uncountable words",
        "examples": "I've been here many times before; This is one of many problems we are facing; I don't have much time; He doesn't have much patience"
    },
    "0184":{
        "short_slug": "quant-few-little",
        "description": "incorrect use of 'few' or 'little'",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0184' target='_blank'>error 0184</a>)",
        "recommendation": "remember that 'few' is used with countable words in plural form, while 'little' is used with uncountable words",
        "examples": "I have a few good friends; I've done this a few times; 'I have little patience for these things';'Just a little milk, please'"
    },
    "0185":{
        "short_slug": "quant-each-every",
        "description": "incorrect use of 'every' or 'each' with a noun in plural form",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0185' target='_blank'>error 0185</a>)",
        "recommendation": "remember that 'every' and 'each' refer by definition to a single thing, like French 'chaque'",
        "examples": "it is incorrect to say 'every days' or 'each times'; say 'every day' and 'each time'"
    },
    "0186":{
        "short_slug": "quant-both-either-neither",
        "description": "incorrect use of 'both', 'either' or 'neither'",
        "reference": "<a href='https://book.language-labs.ch/ch1#both-either-neither' target='_blank'>Both. either. neither</a>)",
        "recommendation": "remember that 'both','either', and 'neither' are used to refer to two things, and that 'either' is used in negative sentences",
        "examples": "'Both my children have pollen allergies'; 'I don't like either of these houses."
    },
    "0187":{
        "short_slug": "quant-both-with-article",
        "description": "incorrectly preceding 'both' with the article 'the'",
        "reference": "<a href='https://book.language-labs.ch/ch1#e0187' target='_blank'>error 0187</a>)",
        "recommendation": "remember that, in English, we do not use the article 'the' in front of the determiner 'both'. You can do this with 'two', but not with 'both'",
        "examples": "'Both options are good' or 'the two options are good, but not 'The both options are good'."
    },
    
    "0210":{
        "short_slug": "adjective-position",
        "description": "incorrect position of the adjective in relation to the noun",
        "reference": "<a href='https://book.language-labs.ch/ch2#e0210' target='_blank'>error 0210</a>)",
        "recommendation": "remember that adjectives are always placed BEFORE the noun they modify",
        "examples": "say 'the big apple', not 'the apple big'"
    },
    "0220":{
        "short_slug": "adjective-no-declension",
        "description": "incorrectly adding an ending to an adjective",
        "reference": "<a href='https://book.language-labs.ch/ch2#e0220' target='_blank'>error 0220</a>)",
        "recommendation": "remember that adjectives are never plural. Adjectives do NOT change in number as a function of the number of the noun they modify",
        "examples": "say '2 red cars', not '2 reds cars"
    },
    "0225":{
        "short_slug": "adjective-ed-y-vs-ing",
        "description": "incorrectly choice of -y or -ing vs -ed ending for an adjective",
        "reference": "<a href='https://book.language-labs.ch/ch2#e0225' target='_blank'>error 0225</a>)",
        "recommendation": "remember that -y or -ing adjectives describe an activity or agency in the noun they modify, while -ed adjectives describe the noun as a recipient of the activity",
        "examples": "say 'I was scared by the movie', not 'I was scary by the movie'; say 'the movie was exciting', not 'the movie was excited'"
    },
    "0231":{
        "short_slug": "numerals-pronunciation",
        "description": "incorrect pronunciation of the ending '-teen' or 'ty'",
        "reference": "<a href='https://book.language-labs.ch/ch2#e0231' target='_blank'>error 0231</a>)",
        "recommendation": "remember that it is important to correctly stress the endings '-teen' and '-ty' to avoid confusion",
        "examples": "say THIR-ty and thir-TEEN, FOUR-ty and four-TEEN"
    },
    "0232":{
        "short_slug": "numerals-one",
        "description": "forgetting to read 100 or 1000 as one hundred or one thousand",
        "reference": "<a href='https://book.language-labs.ch/ch2#e0232' target='_blank'>error 0232</a>)",
        "recommendation": "remember that 100 is 'one hundred', not 'hundred'; The same goes for 1000",
        "examples": "120 cars is 'one hundred twenty cars', not 'hundred twenty cars'"
    },
    "0233":{
        "short_slug": "numerals-form-million-thousand",
        "description": "incorrectly using 'of' or adding plural '-s' to 'hundred', 'thousand', 'million' or 'billion'",
        "reference": "<a href='https://book.language-labs.ch/ch2#e0233' target='_blank'>error 0233</a>)",
        "recommendation": "remember that when reading specific numbers, we do not use 'of' or plural -s after hundred, thousand, million or billion",
        "examples": "30m CHF should be read '30 million Swiss Francs', not '30 millions of Swiss Francs'"
    },
    "0234":{
        "short_slug": "numerals-years",
        "description": "incorrect or unusual reading of a year",
        "reference": "<a href='https://book.language-labs.ch/ch2#e0234' target='_blank'>error 0234</a>)",
        "recommendation": "remember that for most years, the best approach is to say them as two separate numbers",
        "examples": "'1999' is simply 'nineteen ninenty-nine', not 'one thousand, nine hundred ninety-nine'"
    },
    "0235":{
        "short_slug": "numerals-decades",
        "description": "incorrect reading of a decade",
        "reference": "<a href='https://book.language-labs.ch/ch2#decades' target='_blank'>Decades</a>",
        "recommendation": "remember that decades are read as follows: 'the sixties', 'the seventies', etc.",
        "examples": "'80s' is 'the eighties', not 'the eighties years'"
    },
    "0236":{
            "short_slug": "numerals-ordinals",
            "description": "incorrect ordinal number form",
            "reference": "numbers workshop pdf (or online: <a href='https://book.language-labs.ch/ch2#ordinal-numbers' target='_blank'>ordinal numbers</a>))",
            "recommendation": "remember that ordinal numbers end in '-th'; numbers 1, 2 and 3 have irregular forms",
            "examples": "first, second, third, fourth, fifth, sixth, seventh, etc."
    },    
    "0240":{
        "short_slug": "comparative-form",
        "description": "incorrect comparative form",
        "reference": "section 2.1.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0240' target='_blank'>error 0240</a>)",
        "recommendation": "remember that the comparative form is different for short or long adjectives, and that there are three special cases (good, bad, and far)",
        "examples": "short - shorter; extended - more extended; bad - worse"
    },
    "0241":{
        "short_slug": "comparative-preposition",
        "description": "incorrect preposition in a comparison",
        "reference": "section 2.1.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0241' target='_blank'>error 0241</a>)",
        "recommendation": "remember that we use 'than' for comparison",
        "examples": "My car is faster than yours"
    },
    "0245":{
        "short_slug": "comp-vs-superl-confusion",
        "description": "incorrect use of comparative in a superlative situation, or of superlative in a comparative situation",
        "reference": "section 2.1.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0242' target='_blank'>error 0245</a>)",
        "recommendation": "remember that a superlative is used to compare one thing to all others, while a comparative is used to compare only two things",
        "examples": "say 'this is the best restaurant in town', not 'this is the better restaurant in town'; say 'this restaurant is better than that one', not 'this restaurant is best of that one'"
    },
    "0250":{
        "short_slug": "superlative-form",
        "description": "incorrect superlative form",
        "reference": "section 2.1.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0250' target='_blank'>error 0250</a>)",
        "recommendation": "remember that the superlative form is different for short or long adjectives, and that there are three special cases (good, bad, and far)",
        "examples": "short - the shortest ; extended - the most extended ; bad - the worst"
    },
    "0251":{
        "short_slug": "superl-prep-in-the-world",
        "description": "incorrect preposition in a superlative phrase",
        "reference": "section 2.1.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0251' target='_blank'>error 0251</a>)",
        "recommendation": "remember that typically use the prepositional phrase 'in the world' with a superlative, not 'of the world'",
        "examples": "He is the player in the world; This is the best restaurant in the world"
    },
    "0261":{
        "short_slug": "the more... the more...",
        "description": "incorrect use of a 'the more..., the more...' construction",
        "reference": "section 2.1.4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0261' target='_blank'>error 0261</a>)",
        "recommendation": "remember that we use the article 'the' before both adjectives in this construction (unlike in French)",
        "examples": "the higher they rise, the harder they fall; the more you study, the better you will do on the exam"
    },
    "0270":{
        "short_slug": "equality-with-as",
        "description": "incorrect expression of equality",
        "reference": "section 2.1.6 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0270' target='_blank'>error 0270</a>)",
        "recommendation": "remember that we express equality with an adjective using the expression AS+ADJECTIVE+AS",
        "examples": "You chances of winning are as goos as mine; I am as tall as my brother"
    },
    "0280":{
        "short_slug": "adjective-as-adverb",
        "description": "incorrect use of an adjective as an adverb",
        "reference": "see the explanation online: <a href='https://book.language-labs.ch/ch2#e0280' target='_blank'>error 0280</a>)",
        "recommendation": "remember that English adverbs are usually formed by adding '-ly' to the adjective, which makes them different from the adjective",
        "examples": "say 'I work happily', not 'I work happy'; 'She sings beautifully', not 'She sings beautiful'"
    },
    "0281":{
        "short_slug": "adve-no-ly",
        "description": "adding a -ly ending to an adverb that does not take an -ly ending",
        "reference": "section 2.2.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0281' target='_blank'>error 0281</a>)",
        "recommendation": "remember that some adverbs do not need an -ly ending",
        "examples": "don't say, 'she runs fastly', or 'I arrived lately'"
    },
    "0284":{
        "short_slug": "adv-the-last-week",
        "description": "adding the article 'the' to the temporal adverb 'last week', 'last month', etc.",
        "reference": "section 2.2.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0282' target='_blank'>error 0282</a>)",
        "recommendation": "remember that we use 'last week', 'last month', etc. without the article 'the'",
        "examples": "don't say, 'I went to the doctor the last week'"
    },
    "0285":{
        "short_slug": "adverbs-for-vs-ago",
        "description": "incorrect use of 'for' instead of 'ago' to describe how far in the past something happened",
        "reference": "section 2.2.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0285' target='_blank'>error 0285</a>)",
        "recommendation": "remember that English 'for' is not equivalent to German 'vor' in this context",
        "examples": "Say 'I arrived 10 years ago', not 'I arrived for 10 years'"
    },
    "0286":{
        "short_slug": "adverbs-since-vs-for",
        "description": "incorrect use of 'since' to describe a length of time",
        "reference": "section 2.2.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0286' target='_blank'>error 0286</a>)",
        "recommendation": "remember that 'since' is used with the point of departure or initiation of an action",
        "examples": "Say 'I have been here for 10 years', not 'I have been here since 10 years'"
    },
    "0287":{
        "short_slug": "adverbs-ever-and-never",
        "description": "incorrect use of 'ever' to express a negation or with the meaning 'always'.",
        "reference": "section 2.2.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0287' target='_blank'>error 0287</a>)",
        "recommendation": "remember that 'ever' is typically used to express the possibility of an action at any point, not the continuation or negation of an action'",
        "examples": "Have you ever been to Paris?'"
    },
    "0288":{
        "short_slug": "adverbs-already-yet",
        "description": "incorrect use of 'already' and/or 'yet'",
        "reference": "section 2.2.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0288' target='_blank'>error 0288</a>)",
        "recommendation": "remember that we use 'already' to express confirmation of a completed event, and 'yet' to negate or ask for confirmation",
        "examples": "Have you seen the movie yet?; I have already seen it"
    },
    "0289":{
        "short_slug": "adverbs-still-anymore",
        "description": "incorrect use of 'still' or 'anymore', or of 'always' instead of 'still'",
        "reference": "section 2.2.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0289' target='_blank'>error 0289</a>)",
        "recommendation": "remember that the continuation of an event is expressed with 'still', and the negation of a continuation with 'anymore'",
        "examples": "Say 'I am still active in the company', not 'I am always active in the company'"
    },
        "0293":{
        "short_slug": "intensifier-such",
        "description": "incorrect use of 'such' to intensify a noun phrase",
        "reference": "section 2.1.7 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0293' target='_blank'>error 0293</a>)",
        "recommendation": "remember that we use 'such' with an adj + noun phrase",
        "examples": "She is such a positive person!"
    },
    "0294":{
        "short_slug": "intensifier-so",
        "description": "incorrect use of 'so' to intensify an adjective or noun phrase",
        "reference": "section 2.1.7 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0294' target='_blank'>error 0294</a>)",
        "recommendation": "remember that we use 'so' with single adjectives and 'so much' or 'so many' with nouns",
        "examples": "I am so happy; I have never felt so much happiness on so many levels"
    },
    "0295":{
        "short_slug": "adverbs-near-vs-nearby",
        "description": "incorrect use of 'near', 'nearby', 'close' or 'closeby'",
        "reference": "section 2.2.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0295' target='_blank'>error 0295</a>)",
        "recommendation": "see section 2.2.3 for examples of correct use",
        "examples": "Say 'I live near the lake', not 'I live nearby the lake'"
    },
    "0296":{
        "short_slug": "adverbs-good-vs-well",
        "description": "incorrect use of 'good' as an adverb instead of 'well'",
        "reference": "section 2.2.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0296' target='_blank'>error 0296</a>)",
        "recommendation": "remember that 'good' is an adjective, not an adverb. It has to modify a noun, not a verb",
        "examples": "Say 'The pizza is good', not 'She can play music good'"
    },
    "0297":{
        "short_slug": "adverbs-hard-vs-hardly",
        "description": "incorrect use of 'hardly'",
        "reference": "section 2.2.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch2#e0297' target='_blank'>error 0297</a>)",
        "recommendation": "see section 2.2.3 for examples of correct use",
        "examples": "Say 'I can hardly understand the handwriting'"
    },
    "0300":{
        "short_slug": "memorization-be",
        "description": "uncertainty using the verb 'be' as an auxiliary verb",
        "reference": "section 3.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch3#e0300' target='_blank'>error 0300</a>)",
        "recommendation": "remember that the auxiliary 'be' is a basic building block that needs to be memorized",
        "examples": "do not make errors such as 'I were not happy' and 'They was not very good'"
    },
    "0310":{
        "short_slug": "pres-simple-s'",
        "description": "forgetting to add -s to a present simple verb in the 3rd person singular",
        "reference": "section 3.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch3#e0310' target='_blank'>error 0310</a>)",
        "recommendation": "remember pronouns 'he', 'she', and 'it' require an -s ending in the present simple",
        "examples": "say 'he runs, it doesn't work, she does not go', etc."
    },
    "0320":{
        "short_slug": "standard-negative-form",
        "description": "incorrect negative conjugation form",
        "reference": "section 3.3.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch3#e0320' target='_blank'>error 0320</a>)",
        "recommendation": "remember that the standard negative form is 'S A not P'",
        "examples": "say 'I do not go', not 'I go not', etc."
    },
    "0321":{
        "short_slug": "standard-question-form",
        "description": "incorrect question form",
        "reference": "section 3.3.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch3#e0321' target='_blank'>error 0321</a>)",
        "recommendation": "remember that the standard question form is 'A S P'",
        "examples": "say 'where did she go?', not 'where went she?'; say 'what does it mean?', not 'What means ___?'"
    },
    "0322":{
        "short_slug": "modal-to",
        "description": "incorrect use of the preposition 'to' between a modal auxiliary verb and the principal verb",
        "reference": "sections 3.3.1 and 3.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch3#e0322' target='_blank'>error 0322</a>)",
        "recommendation": "remember that we do not use 'to' between a modal verb and a principal verb",
        "examples": "it is incorrect to say 'I must to work'"
    },
    "0330":{
        "short_slug": "pres-past-simple-negs-quest",
        "description": "incorrect formation of a negative or question in the present or past simple",
        "reference": "section 3.3.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch3#e0330' target='_blank'>error 0330</a>)",
        "recommendation": "remember that the formation pattern is S A not P for negatives, and A S P for questions, with A being 'do/does/did' and P being the infinitive form of the verb",
        "examples": "she does not go, she did not go, did she go?, does she go?"
    },
    "0331":{
        "short_slug": "past-simple-form-negs-quest",
        "description": "incorrect use of a past simple verb form in a negative or question",
        "reference": "section 3.3.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch3#e0331' target='_blank'>error 0331</a>)",
        "recommendation": "remember that past simple forms such as 'went', 'saw' and 'chose' are used only in positive statements (declarative sentences)",
        "examples": "say 'she didn't go', not 'she didn't went'; say 'did she go?', not 'did she went?'"
    },
    "0332":{
        "short_slug": "positive-do-did",
        "description": "unnecesary use of 'do' or 'did' in a positive conjugation",
        "reference": "section 3.3.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch3#e0332' target='_blank'>error 0332</a>)",
        "recommendation": "remember that we do not normally use 'do' or 'did' as auxiliary verbs in positive (declarative) conjugations",
        "examples": "say 'I went', not 'I did go'; say 'I eat', not 'I do eat'"
    },
    "0335":{
        "short_slug": "conjugation-special-be",
        "description": "incorrect conjugation of the verb be as principal verb",
        "reference": "section 3.3.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch3#e0335' target='_blank'>error 0335</a>)",
        "recommendation": "remember that the verb BE is a special case when used as a principal verb",
        "examples": "say 'I am not happy', not 'I do not be happy'; ' I was not happy' not 'I did not be happy'"
    },
    "0400":{
        "short_slug": "invalid-aux-prin",
        "description": "invalid combination of an auxiliary verb and a principal verb form",
        "reference": "the beginning of chapter 4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0400' target='_blank'>error 0400</a>)",
        "recommendation": "remember that every auxiliary verb combines with a specific principal verb form to create a tense",
        "examples": "'can' only combines with infinitive, 'do' only combines with infinitive, 'have' only combines with past participle"
    },
    "0410":{
        "short_slug": "prohibition-vs-lack-of-obligation",
        "description": "incorrectly using 'do not have to' to express prohibition",
        "reference": "section 4.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0410' target='_blank'>error 0410</a>)",
        "recommendation": "remember that 'do not have to' expresses lack of obligation, while 'must not' or 'can't' expresses prohibition",
        "examples": "'You must not chew gum in here' is not the same as 'You do not have to chew gum in here'"
    },
    "0412":{
        "short_slug": "would-in-condition",
        "description": "using 'would' incorrectly in the condition clause of a conditional sentence",
        "reference": "section 4.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0412' target='_blank'>error 0412</a>)",
        "recommendation": "remember that 'would' is typically used in the result clause of a conditional sentence",
        "examples": "'If I knew where he lived I would tell you' is correct; 'If I would know where he lived I would tell you' is incorrect"
    },
    "0415":{
        "short_slug": "will-vs-want",
        "description": "confusing 'will' or 'would' with 'want' due to German influence",
        "reference": "section 4.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0415' target='_blank'>error 0415</a>)",
        "recommendation": "remember that 'will' is the auxiliary verb for the future tense; do not confuse it with 'want to'",
        "examples": "'I will go' (j'irai) is not the same as 'I want to go' (je veux y aller)"
    },
    "0420":{
        "short_slug": "irregular-verb-form",
        "description": "incorrect irregular form of the past simple or past participle",
        "reference": "list of irregular verbs on Quizlet (see <a href='https://book.language-labs.ch/ch4#e0420' target='_blank'>error 0420</a>)",
        "recommendation": "study the list of irregular verbs on Quizlet",
        "examples": "the past of 'fall' is 'fell', the past of 'feel' is 'felt'."
    },
    "0424":{
        "short_slug": "pres-cont-overuse-simple",
        "description": "overuse of the present continuous in present simple situations",
        "reference": "section 4.2.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0424' target='_blank'>error 0424</a>)",
        "recommendation": "remember that present continuous should not be used for regular or repeating actions",
        "examples": "say 'I go to the gym on Fridays', not 'I'm going to the gym on Fridays'"
    },
    "0425":{
        "short_slug": "pres-simple-overuse-cont",
        "description": "overuse of the present simple in present continuous situations",
        "reference": "section 4.2.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0425' target='_blank'>error 0425</a>)",
        "recommendation": "remember that we use present continuous for single ongoing actions",
        "examples": "say 'today, the climate is changing', not 'today, the climate changes'"
    },
    "0430":{
        "short_slug": "pres-simple-overuse-pperf",
        "description": "overuse of the present simple in present perfect situations",
        "reference": "section 4.2.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0430' target='_blank'>error 0430</a>)",
        "recommendation": "in English, we rarely use the present simple to describe actions that began in the past and continue until today; this is the job of the present perfect tense",
        "examples": "say 'I have lived here since 2013', not 'I live here since 2013'"
    },
    "0432":{
        "short_slug": "past-simple-overuse-pperf",
        "description": "missed opportunity to use the present perfect tense",
        "reference": "section 4.2.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0432' target='_blank'>error 0432</a>)",
        "recommendation": "remember that English has a specific verb tense for unfinished or indefinite past time, and it's not the past simple",
        "examples": "try to say 'I have done this already', instead of 'I did it already'; and 'I've been there many times', not 'I was there many times'"
    },
    "0440":{
        "short_slug": "pres-simple-overuse-past",
        "description": "using the present simple instead of the past simple in past situations",
        "reference": "section 4.2.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0440' target='_blank'>error 0440</a>)",
        "recommendation": "study the pronunciation rules and the past forms of irregular verbs so you can confidently use the past tense",
        "examples": "avoid saying 'last year I go to Norway, I travel there by train', etc."
    },
    "0442":{
        "short_slug": "pres-perf-overuse",
        "description": "overuse of the present perfect in past simple situations",
        "reference": "section 4.2.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0442' target='_blank'>error 0442</a>)",
        "recommendation": "remember that we use past simple, not present perfect, for actions in finished time",
        "examples": "say 'I studied this in secondary school', not 'I have studied this in secondary school'"
    },
    "0445":{
        "short_slug": "past-cont-overuse",
        "description": "incorrect use of the past continuous tense",
        "reference": "section 4.2.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0445' target='_blank'>error 0445</a>)",
        "recommendation": "remember that the past continuous is used for a single action that was ongoing at a point in the past; not for repeated actions",
        "examples": "say 'I was watching TV when you called', not 'As a child I was watching TV a lot'"
    },
    "0447":{
        "short_slug": "used-to-incorrect",
        "description": "incorrect use or conjugation of the expression 'used + to + inf.'",
        "reference": "section 4.2.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0447' target='_blank'>error 0447</a>)",
        "recommendation": "remember that the verb 'use' in the expression 'used to + inf' is a normal principal verb",
        "examples": "say 'I used to play', 'I did not use to play', 'Did you use to play?'"
    },
    "0448":{
        "short_slug": "past-perf-incorrect",
        "description": "incorrect use of the past perfect tense",
        "reference": "section 4.2.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0448' target='_blank'>error 0448</a>)",
        "recommendation": "avoid using the past perfect unless there is a past simple action that it refers to",
        "examples": "don't say 'I had not eaten lunch yesterday'; say 'I did not eat lunch yesterday because I had eaten such a big breakfast'"
    },
    "0449":{
        "short_slug": "past-perf-underuse",
        "description": "missed opportunity to use the past perfect tense",
        "reference": "section 4.2.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0449' target='_blank'>error 0449</a>)",
        "recommendation": "remember that the past perfect tense allows you to indicate a past event that happened before another past event",
        "examples": "'I did not have lunch because I had eaten so much for breakfast.'"
    },
    "0451":{
        "short_slug": "future-continuous",
        "description": "incorrect use of the future continuous",
        "reference": "section 4.2.4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0451' target='_blank'>error 0451</a>)",
        "recommendation": "remember that the future continuous is used for a single action that will be ongoing at a point in the future",
        "examples": "'I will be flying by the time you wake up.'"
    },
    "0452":{
        "short_slug": "future-perfect",
        "description": "incorrect use of the future perfect",
        "reference": "section 4.2.4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch4#e0452' target='_blank'>error 0452</a>)",
        "recommendation": "remember that the future perfect is used for a single action that will be complete at a set point in the future",
        "examples": "'I will have landed by the time you wake up tomorrow.'"
    },

    "0510":{
        "short_slug": "past-modal-gen",
        "description": "incorrect past form of should or could to express regret or crticism",
        "reference": "section 5.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch5#e0510' target='_blank'>error 0510</a>)",
        "recommendation": "remember that the past of should or could is 'should + have + past participle'",
        "examples": "I could have done more; I shouldn't have eaten so much"
    },
    "0520":{
        "short_slug": "past-modal-must",
        "description": "incorrect use of 'must + infinitive' in past or future situations",
        "reference": "section 5.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch5#e0520' target='_blank'>error 0520</a>)",
        "recommendation": "remember that 'must' cannot be used in past situations; use 'had to + inf' instead",
        "examples": "say 'As a child I had to help my parents in the shop, not 'As a child I must helped my parents'..."
    },
    "0530":{
        "short_slug": "past-will",
        "description": "incorrect use of 'will + infinitive' in past situations",
        "reference": "section 5.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch5#e0530' target='_blank'>error 0530</a>)",
        "recommendation": "when referencing the future from the perspective of the past, use 'would', not 'will'",
        "examples": "say 'The man said he would help us', not 'The man said he will help us'"
    },
    "0540":{
        "short_slug": "past-modal-can",
        "description": "incorrect use of 'can + infinitive' in past situations",
        "reference": "section 5.4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch5#e0540' target='_blank'>error 0540</a>)",
        "recommendation": "remember that 'can' is not used in past situations; use 'could' or 'was able to' instead",
        "examples": "say 'As a child I could drive the family tractor, not 'As a child I can drive the family tractor'"
    },
    "0610":{
        "short_slug": "linking-word-logic",
        "description": "incorrect logical category of a linking word (wrong meaning)",
        "reference": "section 6.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch6#e0610' target='_blank'>error 0610</a>)",
        "recommendation": "remember that there are 5 basic categories of logical organization of a text",
        "examples": "'despite' is a counter-expectation connector; 'while' is a contrast connector, etc."
    },
    "0620":{
        "short_slug": "connector-missed",
        "description": "missed opportunity to use a linking word for better clarity",
        "reference": "chapter 6 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch6#e0610' target='_blank'>error 0620</a>)",
        "recommendation": "remember that linking words help us create clearer argumentative structures",
        "examples": "instead of saying 'but', you can be more precise by saying 'however', 'despite', etc."
    },
    "0630":{
        "short_slug": "linking-word-grammar",
        "description": "incorrect grammatical use of a linking word",
        "reference": "section 6.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch6#e0630' target='_blank'>error 0630</a>)",
        "recommendation": "remember that some linking words are sentence modifiers, others must be followed by a clause or a noun phrase",
        "examples": "'I work despite the fatigue; 'I work even though I'm tired', 'I'm tired. However, I keep working"
    },

    "0710":{
        "short_slug": "sentence-order-VO",
        "description": "putting modifiers between the verb and the direct object",
        "reference": "section 7.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch7#e0710' target='_blank'>error 0710</a>)",
        "recommendation": "remember that we avoid placing modifiers between a verb and its object",
        "examples": "say 'she speaks German fluently', not 'she speaks fluently German"
    },
    "0712":{
        "short_slug": "preposition-position",
        "description": "incorrect position of the preposition in a sentence",
        "reference": "section 7.4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch7#e0712' target='_blank'>error 0712</a>)",
        "recommendation": "remember that prepositions are usually placed at the end of questions and relative clauses",
        "examples": "say 'Who did you write this letter for?', not 'for who did you write this letter'?"
    },
    "0717":{
        "short_slug": "verbs-of-recommendation-reporting",
        "description": "incorrect construction with verbs of recommendation or reporting ('present', 'explain', 'suggest', or 'recommend')",
        "reference": "section 7.1.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch7#e0717' target='_blank'>error 0717</a>)",
        "recommendation": "remember that we avoid saying 'you' immediately after 'explain', 'present', 'suggest' and 'recommmend'",
        "examples": "don't say 'I will present you my project', say 'I will present my project', for example"
    },
    "0721":{
        "short_slug": "indirect-question",
        "description": "incorrect indirect question form",
        "reference": "section 7.2.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch7#e0721' target='_blank'>error 0721</a>)",
        "recommendation": "remember that the embedded question cannot have the standard A-S-P question form",
        "examples": "say 'Do you know what this means?', not 'Do you know what does this mean?'"
    },
    "0722":{
        "short_slug": "subject-question",
        "description": "incorrect subject question form",
        "reference": "section 7.2.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch7#e0722' target='_blank'>error 0722</a>)",
        "recommendation": "remember that subject questions do not follow the standard A-S-P question form",
        "examples": "say 'Who broke this?', not 'Who did he break this?'"
    },
    "0730":{
        "short_slug": "cleft-sentence",
        "description": "problem using a cleft sentence",
        "reference": "section 7.3.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch7#e0730' target='_blank'>error 0730</a>)",
        "recommendation": "study the examples of cleft sentences in the grammar manual",
        "examples": "The person I spoke to is the manager; What I need is a good night's sleep"
    },
    "0740":{
        "short_slug": "correlative-sentence",
        "description": "problem using a correlative construction",
        "reference": "section 7.3.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch7#e0740' target='_blank'>error 0740</a>)",
        "recommendation": "review the rules for correlative structures, including making parallel structures",
        "examples": "The menu is as good as it is varied; This is both the apex of my career and the beginning of a new chapter"
    },
    "0750":{
        "short_slug": "inversion-construct",
        "description": "problem using inversion for emphasis or with a correlative preposition",
        "reference": "section 7.3.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch7#e0750' target='_blank'>error 0750</a>)",
        "recommendation": "remember that an inverted or question structure is used for emphasis or with a correlative preposition",
        "examples": "Not only did he come, but he also brought a gift; Never have I seen such a beautiful sunset"
    },
    "0800":{
        "short_slug": "passive-form",
        "description": "incorrect passive form",
        "reference": "chapter 8 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch8#e0800' target='_blank'>error 0800</a>)",
        "recommendation": "study the rules for the construction of passive forms",
        "examples": "It is done; it was finished efficienty; it has been a great success"
    },
    "0801":{
        "short_slug": "passive-with-gerund",
        "description": "incorrect use of gerund instead of past participle for the passive voice",
        "reference": "chapter 8 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch8#e0801' target='_blank'>error 0801</a>)",
        "recommendation": "remember that the past partciple (go went GONE) is used in the passive voice, not the gerund (going)",
        "examples": "He was already gone before we were hired"
    },
    "0802":{
        "short_slug": "passive-preposition",
        "description": "incorrect preposition in a passive construction",
        "reference": "chapter 8 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch8#e0802' target='_blank'>error 0802</a>)",
        "recommendation": "remember that 'by' is the preposition used in passive constructions",
        "examples": "it was decided by the president"
    },
    "0910":{
        "short_slug": "pronoun-subj-obj",
        "description": "incorrect subject or object pronoun",
        "reference": "chapter 9 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0910' target='_blank'>error 0910</a>)",
        "recommendation": "study the basic subject or object pronouns",
        "examples": "he is happy, she is happy, they are happy, I saw them, John saw her, etc."
    },
    "0915":{
        "short_slug": "pronoun-its-apostrophe",
        "description": "incorrect inclusion of an apostrophe in the possessive adjective 'its'",
        "reference": "chapter 9 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0915' target='_blank'>error 0915</a>)",
        "recommendation": "remember that the possessive adjective 'its' does not have an apostrophe",
        "examples": "The wall lost its color; The company reduced its debt"
    },
    "0920":{
        "short_slug": "pronoun-he-she-obj",
        "description": "using 'he' or 'she' incorrectly to refer to objects",
        "reference": "chapter 9 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0920' target='_blank'>error 0920</a>)",
        "recommendation": "remember that objects have no gender. We only use the pronoun 'it' (possessive 'its') to refer to non-humans",
        "examples": "I love my car. It is the best car in the world; This material changes its color."
    },
    "0925":{
        "short_slug": "pronoun-no-null-subject",
        "description": "incorrect use of a null subject in English",
        "reference": "chapter 9 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0925' target='_blank'>error 0925</a>)",
        "recommendation": "remember that null subjects are not possible in English",
        "examples": "do not say 'is good', say 'it is good'; do not say 'is raining', say 'it is raining'"
    },
    "0930":{
        "short_slug": "pronoun-poss-adj",
        "description": "incorrect possessive adjective or pronoun",
        "reference": "chapter 9 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0930' target='_blank'>error 0930</a>)",
        "recommendation": "study the possessive adjectives and pronouns and understand the difference between pronouns in English vs French",
        "examples": "She lost her dog, He lost his dog, The dog lost its way"
    },
    "0941":{
        "short_slug": "friend-of-poss",
        "description": "error with the expression 'a friend of + pronoun'",
        "reference": "section 9.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0941' target='_blank'>error 0941</a>)",
        "recommendation": "remember that in English the expression is 'a friend of + possessive pronoun'",
        "examples": "say 'a friend of mine'; not 'a friend of me'"
    },
    "0942":{
        "short_slug": "by-myself-own",
        "description": "error with the expression 'by myself' or 'on my own'",
        "reference": "section 9.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0942' target='_blank'>error 0942</a>)",
        "recommendation": "do not confuse 'by myself' with 'on my own'",
        "examples": "say 'I did it by myself', not 'I did it by my own'"
    },
    "0950":{
        "short_slug": "pronoun-reflexive",
        "description": "not using a reflexive pronoun",
        "reference": "chapter 9.0.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0950' target='_blank'>error 0950</a>)",
        "recommendation": "remember that we use use reflexive pronouns when the subject and object are the same person",
        "examples": "I saw myself in the mirror; he wore himself out by working 20 hours a day"
    },
    "0951":{
        "short_slug": "reflexivity-transfer",
        "description": "incorrect application of reflexivity due to French or German transfer",
        "reference": "chapter 9.0.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0951' target='_blank'>error 0951</a>)",
        "recommendation": "remember that a few verbs in French or German that are reflexive are not reflexive in English",
        "examples": "say 'I remember the day we met', not 'I remember me the day we met'"
    },
    "0960":{
        "short_slug": "relative-who-which",
        "description": "incorrect relative pronoun (who vs which)",
        "reference": "chapter 9 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0960' target='_blank'>error 0960</a>)",
        "recommendation": "remember that we use 'who' for people and 'which' for things",
        "examples": "The man who called the police wants to talk to you; the stadium, which was built in 1905, is our greatest monument"
    },
    "0961":{
        "short_slug": "relative-place",
        "description": "incorrect relative pronoun for place",
        "reference": "section 9.0.4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0961' target='_blank'>error 0961</a>)",
        "recommendation": "remember that we use 'where' to refer to a place, not 'who'",
        "examples": "The place where I met her is now a parking lot; The city where I was born is very beautiful"
    },
    "0970":{
        "short_slug": "relative-whose",
        "description": "problem with the use of the relative pronoun 'whose'",
        "reference": "chapter 9 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch9#e0970' target='_blank'>error 0970</a>)",
        "recommendation": "remember that we use 'whose' to replace a possessive adjective (his or hers) in a relative clause",
        "examples": "That's the engineer whose research I told you about (replaces 'his research')"
    },
    "1010":{
        "short_slug": "prep-movement",
        "description": "incorrect preposition for verbs denoting movement",
        "reference": "section 10.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch10#e1010' target='_blank'>error 1010</a>)",
        "recommendation": "remember that we use the preposition 'to' with verbs for movement",
        "examples": "say 'I went to France', not 'I went in France'"
    },
    "1020":{
        "short_slug": "prep-time",
        "description": "incorrect time preposition",
        "reference": "section 10.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch10#e1020' target='_blank'>error 1020</a>)",
        "recommendation": "review the correct usage of prepositions with temporal circumstances",
        "examples": "I was born in summer; more precisely, on June 12th, 1975, at midnight."
    },
    "1030":{
        "short_slug": "prep-purpose",
        "description": "incorrect combination of preposition and verb to express intention or purpose",
        "reference": "section 10.5 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch10#e1030' target='_blank'>error 1030</a>)",
        "recommendation": "remember that we never use the preposition 'for' with infinitive to express purpose",
        "examples": "say 'We took the train to go to Poland', not 'We took the train for go to Poland"
    },
    "1040":{
        "short_slug": "prep-clause-fut",
        "description": "incorrectly using future tense in a time clause",
        "reference": "section 10.4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch10#e1040' target='_blank'>error 1040</a>)",
        "recommendation": "remember that we avoid using future tense in a time clause",
        "examples": "say 'I'll call you as soon as I return', not 'as soon as I will return'"
    },
    "1050":{
        "short_slug": "prep-collocation",
        "description": "incorrect verb or adjective + preposition collocation",
        "reference": "section 10.5 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch10#e1050' target='_blank'>error 1050</a>)",
        "recommendation": "remember that there are specific combinations ('collocations') of verbs or adjectives with a preposition",
        "examples": "'I am interested in art'; 'I am bad at swimming'; 'it depends on the weather'"
    },
    "1100":{
        "short_slug": "verb-comp-choice",
        "description": "incorrect type of verb complement",
        "reference": "chapter 11 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch11#e1100' target='_blank'>error 1100</a>)",
        "recommendation": "remember that some verbs are followed by infinitive complements, and others by gerund (-ing) complements",
        "examples": "I promise to call; I stopped calling; I must remember to call; I regret calling"
    },
    "1110":{
        "short_slug": "verb-comp-let-make",
        "description": "incorrectly adding 'to' between let or make and their complement",
        "reference": "section 11.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch11#e1110' target='_blank'>error 1110</a>)",
        "recommendation": "remember that we use infinitive WIHOUT 'to' after the verbs 'make' and 'let'",
        "examples": "'My mom made me clean up my room'; 'My parents never let me go out after 11 pm"
    },
    "1120":{
        "short_slug": "verb-comp-special",
        "description": "incorrect complement for the expression 'be used to', 'get used to' or 'look forward to'",
        "reference": "section 11.1.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch11#e1120' target='_blank'>error 1120</a>)",
        "recommendation": "remember that, in a few special expressions, the preposition 'to' is actually followed by a verb in gerund form",
        "examples": "say 'I look forwards to seeing you'; not 'I look forward to see you'"
    },
    "1130":{
        "short_slug": "verb-comp-past",
        "description": "incorrectly using a past simple form as a verb complement",
        "reference": "chapter 11 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch11#e1130' target='_blank'>error 1130</a>)",
        "recommendation": "remember that the past simple form is never used in verb complements; not even in past situations",
        "examples": "say 'We decided to go', not 'We decided to went'"
    },
    "1140":{
        "short_slug": "want-construction",
        "description": "constructions with the verb 'want'",
        "reference": "section 11.2.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch11#e1140' target='_blank'>error 1140</a>)",
        "recommendation": "remember that we usually avoid 'that' clauses after 'want'",
        "examples": "say 'I want you to go', not 'I want that you go'; say 'We want it to rain', not 'We want that it rains'"
    },
    "1150":{
        "short_slug": "verb-comp-neg",
        "description": "incorrect negative form in a verb complement",
        "reference": "section 11.4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch11#e1150' target='_blank'>error 1150</a>)",
        "recommendation": "remember that the verb complement is not conjugated; the particle 'not' is simply inserted before the infinitive or gerund",
        "examples": "say 'We decided not to go'; 'I enjoy not having to cook'"
    },
    "1210":{
        "short_slug": "possessive-s-missing",
        "description": "not using possessive 's",
        "reference": "chapter 12 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch12#e1210' target='_blank'>error 1210</a>)",
        "recommendation": "remember that the use of possessive 's is the standard way of indicating that a person possesses something",
        "examples": "John's car (not 'the car of John'); my friend's chalet (not 'the chalet of my friend')"
    },
    "1220":{
        "short_slug": "possessive-s-unusual",
        "description": "unusual use of possessive 's",
        "reference": "chapter 12 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch12#e1220' target='_blank'>error 1220</a>)",
        "recommendation": "remember that sometimes the use of 's is avoided, especially when people are not involved as possessing agents",
        "examples": "we would say 'what is the time of day in Asia right now?', and not 'what is the day's time in Asia...?'"
    },
    "1230":{
        "short_slug": "possessive-plural",
        "description": "incorrect form of possessive 's after plurals",
        "reference": "chapter 12 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch12#e1230' target='_blank'>error 1230</a>)",
        "recommendation": "remember that the possessive of a plural noun is just an apostrophe (')",
        "examples": "the car of my friends is my friends' car"
    },
    "1300":{
        "short_slug": "auxiliary-application",
        "description": "error in the use of an auxiliary to show interest or agreement",
        "reference": "chapter 13 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch13#e1300' target='_blank'>error 1300</a>)",
        "recommendation": "remember that auxiliaries are repeated to show interest or to agree with your interlocutor",
        "examples": "'You haven't seen her, have you?'; -'I lived in Taiwan' -'Oh, so did I'"
    },
    "1310":{
        "short_slug": "auxiliary-application",
        "description": "sounding dry or cold by answering with a simple 'yes' or 'no'",
        "reference": "chapter 13 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch13#e1310' target='_blank'>error 1310</a>)",
        "recommendation": "remember that auxiliaries are repeated to show interest or to agree with your interlocutor",
        "examples": "'Did you call her? Yes, I did'; 'Do you like it? No, I don't'"
    },
    "1400":{
        "short_slug": "stress-on-last-syllable",
        "description": "incorrectly stressing the last syllable in the French manner",
        "reference": "section 14.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#e1400' target='_blank'>error 1400</a>)",
        "recommendation": "remember that English words are usually stressed near the beginning of the word, not at the end",
        "examples": "say /A-na-lyze/, not /a-na-LYZE/; /REA-so-na-ble/, not /rea-so-NA-ble/"
    },
    "1401":{
        "short_slug": "pronunciation-es-ending",
        "description": "not pronouncing or writing '-es' after an '-x', '-ss','-sh','-ch','-ge' or '-ce' ending",
        "reference": "section 14.0.3 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#s-endings' target='_blank'>-s endings</a>)",
        "recommendation": "remember that '-s' becomes '-es' and is pronounced 'iz' '-x', '-ss','-sh','-ch','-ge' or '-ce' ",
        "examples": "'passes' is pronounced 'passIZ', 'fixes' is pronounced 'fixIZ', 'changes' is pronounced 'changIZ'"
    },
    "1402":{
        "short_slug": "pronunciation-ed-voiced",
        "description": "incorrect pronunciation of -ed endings",
        "reference": "section 14.0.4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#e1402' target='_blank'>error 1402</a>)",
        "recommendation": "remember that '-ed' is pronounced 'd' except after -d or -t, when it is pronounced 'id'",
        "examples": "the pronunciation of -ed in 'pitched' and 'escaped' is not the same as in 'printed' and 'decided'"
    },
    "1403":{
        "short_slug": "pronunciation-ed-silent",
        "description": "forgetting to pronounce -ed endings after a -t or -d",
        "reference": "section 14.0.4 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#e1403' target='_blank'>error 1403</a>)",
        "recommendation": "remember that '-ed' is pronounced 'd' except after -d or -t, when it is pronounced 'id'",
        "examples": "the pronunciation of -ed in 'printed' and 'decided' has to be pronounced 'eeed' or 'iiid'"
    },
    "1404":{
        "short_slug": "pronunciation-ght",
        "description": "incorrect pronunciation of -ght endings",
        "reference": "section 14.0.5 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#ght-endings' target='_blank'>-ght endings</a>)",
        "recommendation": "'-ght' endings are basically pronounced 't'",
        "examples": "'bought' is pronounced 'bott', 'caught' is pronounced 'kawt'"
    },
    "1405":{
        "short_slug": "pronunciation-gh",
        "description": "incorrect pronunciation of a -gh ending",
        "reference": "section 14.0.6 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#gh-endings' target='_blank'>-gh endings</a>)",
        "recommendation": "-gh endings are either totally silent or a strong 'ff' sound",
        "examples": "'dough' sounds like 'doe', but 'laugh' sounds like 'laff'"
    },
    "1406":{
        "short_slug": "pronunciation-h",
        "description": "incorrect pronunciation of h- at the beginning of a word",
        "reference": "chapter 14.0.7 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#h-beginning' target='_blank'>h- at word beginnings</a>)",
        "recommendation": "'h' at the beginning of a word makes a sound; it is the subtle sound of an exhalation",
        "examples": "do not breathe in when you say 'home' or 'hit'"
    },
    "1407":{
        "short_slug": "pronunciation-kn",
        "description": "incorrect pronunciation of kn- at the beginning of a word",
        "reference": "chapter 14.0.8 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#kn-beginning' target='_blank'>kn- at word beginnings</a>)",
        "recommendation": "rememember that when we have kn- at the beginning of a word, the 'k' is silent",
        "examples": "'knee' is pronounced 'nee', 'knight' sounds like 'night'"
    },
    "1408":{
        "short_slug": "pronunciation-gn",
        "description": "incorrect pronunciation of -gn- ",
        "reference": "chapter 14.0.9 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#gn-sound' target='_blank'>-gn- sound</a>)",
        "recommendation": "remember that the French and Italian -gn- sound does not exist in English",
        "examples": "'signal' should be pronounced 'sigg-nal', 'magnet' should be 'magg-net'"
    },
    "1409":{
        "short_slug": "pronunciation-qu",
        "description": "incorrect pronunciation of qu- ",
        "reference": "chapter 14.0.10 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#qu-sound' target='_blank'>-qu- sound</a>)",
        "recommendation": "remember that the letters '-qu-' sound like 'kw', not like 'k'",
        "examples": "'quality' is pronounced 'kwality', not 'kality' as in French"
    },
    "1410":{
        "short_slug": "pronunciation-ch",
        "description": "incorrect pronunciation of ch- at the beginning of a word",
        "reference": "chapter 14.0.11 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#ch-beginning' target='_blank'>ch- at word beginnings</a>)",
        "recommendation": "remember that the sh- and ch- sounds are different in English",
        "examples": "a word like 'challenge' should be pronounced 'tshallenge', not 'shallenge'"
    },
    "1411":{
        "short_slug": "pronun-ital-ci-ce",
        "description": "incorrect pronunciation of -ce- or -ci- ",
        "reference": "section 14.0.12 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch14#ce-ci-sound' target='_blank'>-ce- and -ci- sounds</a>)",
        "recommendation": "remember the -ce- and -ci- make an 's' sound in English, not a 'ch' or 'dj' sound",
        "examples": "be careful with the pronunciation of 'concept' (kon-sept) or 'concert' (kon-sert), for example"
    },
    "1420":{
        "short_slug": "pronun-single-letter",
        "description": "incorrect pronunciation of a single letter, such as 'e', 'h', 'x' or 'y' ",
        "reference": "<a href='https://book.language-labs.ch/ch14#letter-pronunciation' target='_blank'>Pronunciation of single letters</a>",
        "recommendation": "review the correct way to pronounce single letters in English; this is important in mathematics, for example",
        "examples": "'x' is pronounced 'eks', 'y' is pronounced 'why', 'h' is pronounced 'aitch', etc."
    },
    "1501":{
        "short_slug": "false-friend-actually",
        "description": "actually is not a correct translation of actuellement",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#actually' target='_blank'>actually</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'actually' in English is not the same as 'actuellement' in French"
    },
    "1502":{
        "short_slug": "false-friend-control",
        "description": "control is not always a correct translation of contrôler",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#control' target='_blank'>control</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'control' in English is not always the same as 'contrôler' in French"
    },
    "1503":{
        "short_slug": "false-friend-experience",
        "description": "experience is not always a correct translation of expérience",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#experience' target='_blank'>experience</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'experience' in English is not the same as 'expérience' in French"
    },
    "1504":{
        "short_slug": "false-friend-chance",
        "description": "chance is not always a correct translation of 'la chance'",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#chance' target='_blank'>chance</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'chance' in English is not the same as 'la chance' in French"
    },
    "1505":{
        "short_slug": "false-friend-occasion",
        "description": "occasion is not a correct translation of 'd'occasion'",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#occasion' target='_blank'>occasion</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'occasion' in English is not the same as 'd'occasion' in French"
    },
    "1506":{
        "short_slug": "false-friend-quit",
        "description": "quit is not always a correct translation of quitter",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#quit' target='_blank'>quit</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'quit' in English is not the same as 'quitter' in French"
    },
    "1507":{
        "short_slug": "false-friend-journey",
        "description": "journey is not a correct translation of journée",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#journey' target='_blank'>journey</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'journey' in English is not the same as 'journée' in French"
    },
    "1508":{
        "short_slug": "false-friend-sensible",
        "description": "sensible is not a correct translation of sensible",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#sensible' target='_blank'>sensible</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'sensible' in English is not the same as 'sensible' in French"
    },
    "1509":{
        "short_slug": "false-friend-default",
        "description": "default is not always the correct translation of défaut",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#default' target='_blank'>default</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'a default' in English is not the same as 'un défault' in French"
    },
    "1510":{
        "short_slug": "false-friend-college",
        "description": "college is not always a correct translation of collège",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#college-high-school' target='_blank'>college vs high school</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'college' and 'high school' in English are not the same as 'collège' and 'haute école' in French"
    },
    "1511":{
        "short_slug": "false-friend-benefits",
        "description": "benefits is not always a correct translation of les bénéfices",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#benefits' target='_blank'>benefits</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'benefits' in English is not the same as 'les bénéfices' in French"
    },
    "1512":{
        "short_slug": "false-friend-resume",
        "description": "resume in not a correct translation of 'résumer'; 'resume' actually means to restart or continue some activity",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#resume' target='_blank'>resume</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'resume' in English is not the same as 'résumer' in French; you need to say 'summarize'"
    },
    "1513":{
        "short_slug": "false-friend-arrive",
        "description": "'arrive' is not always a correct translation of French 'arriver', when 'arriver' means 'to happen'",
        "reference": "section 15.0.1 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#arrive' target='_blank'>arrive</a>)",
        "recommendation": "read the explanation in section 15.0.1",
        "examples": "'happen' is the correct translation of 'arriver' in French, not 'arrive'; 'arrive' is only used for physical arrival at a place, not for events happening"
    },
    "1520":{
        "short_slug": "common-make-do",
        "description": "incorrect use of make vs do",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#make-vs-do' target='_blank'>make vs do</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "We make cookies, We do sports"
    },
    "1521":{
        "short_slug": "common-good-right",
        "description": "incorrect use of good vs right",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#good-vs-right' target='_blank'>good vs right</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "A good person vs the right choice"
    },
    "1523":{
        "short_slug": "common-hopefully-fortunately",
        "description": "incorrect use of hopefully vs fortunately",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#hopefully' target='_blank'>hopefully vs fortunately</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "Fortunately, the weather was good; Hopefully, we will have a good time"
    },
    "1524":{
        "short_slug": "common-fun-funny",
        "description": "incorrect use of fun vs funny",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#fun-vs-funny' target='_blank'>fun vs funny</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "The Lord of the Rings is fun; The Simpsons is funny"
    },
    "1525":{
        "short_slug": "common-remember-remind",
        "description": "incorrect use of remember vs remind",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#remember-remind' target='_blank'>remember vs remind</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "I remember when I saw you; You remind me of my brother"
    },
    "1526":{
        "short_slug": "common-say-tell",
        "description": "incorrect use of say vs tell",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#say-tell' target='_blank'>say vs tell</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "I say hello; I will tell you a story"
    },
    "1528":{
        "short_slug": "common-look-watch",
        "description": "incorrect use of look vs watch",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#look-watch' target='_blank'>look vs watch</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "She is looking at the birds; She is watching TV"
    },
    "1529":{
        "short_slug": "common-leave-let",
        "description": "incorrect use of leave vs let",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#leave-let' target='_blank'>leave vs let</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "I had to leave the party; I let the bird fly away"
    },
    "1530":{
        "short_slug": "common-lose-loose",
        "description": "incorrect use of lose vs loose",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#lose-loose' target='_blank'>lose vs loose</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "We often lose games for silly reasons; My pants are too loose"
    },
    "1531":{
        "short_slug": "common-graph-graphic",
        "description": "incorrect use of graph vs graphic",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#graph-graphic' target='_blank'>graph vs graphic</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "A graph is a diagram showing data, for ex. a historgram; A graphic is any image or illustration, for ex. a comic book illustration"
    },
    "1532":{
        "short_slug": "common-search-research",
        "description": "incorrect use of search vs research",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#search-research' target='_blank'>search vs research</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "We search for a lost object; We do research on a topic; NOT 'We research a lost object'"
    },
    "1533":{
        "short_slug": "common-interesting",
        "description": "incorrect use of 'interessant' instead of interesting",
        "reference": "section 15.0.2 in the pdf grammar manual (or online: <a href='https://book.language-labs.ch/ch15#interesting' target='_blank'>interesting</a>)",
        "recommendation": "read the explanation in section 15.0.2",
        "examples": "'interesting' is the correct adjective in English; the French form 'interessant' does not exist in English"
    },
    "1801":{
        "short_slug": "arch-architect",
        "description": "pronunciation of architect and architecture",
        "reference": "the top vocabulary mistakes made by architects, number 1",
        "recommendation": "remember that the -ch- in architect and architecture is pronounced with a hard “k” sound.",
        "examples": "say 'arkitect' and 'arkitecture', not 'arshitect' or 'arshitecture'"
    },
    "1802":{
        "short_slug": "arch-view-of",
        "description": "incorrect preposition after 'view'",
        "reference": "the top vocabulary mistakes made by architects, number 2",
        "recommendation": "remember that we usually use 'view' with the preposition 'of'",
        "examples": "say 'spectacular view of the mountains', not 'spectacular view on the mountains'"
    },
    "1803":{
        "short_slug": "arch-materiality",
        "description": "unusual vocabulary for materials",
        "reference": "the top vocabulary mistakes made by architects, number 3",
        "recommendation": "remember that 'materiality' is unusual in English",
        "examples": "say 'material composition of the project' or 'choice of materials'"
    },
    "1804":{
        "short_slug": "arch-raw",
        "description": "incorrect use of 'crude' or 'brute'",
        "reference": "the top vocabulary mistakes made by architects, number 3",
        "recommendation": "remember that we use 'raw' to talk about unprocessed or unrefined materials",
        "examples": "'I love the raw concrete in this project'"
    },
    "1805":{
        "short_slug": "arch-affectation",
        "description": "incorrect use of 'affectation'",
        "reference": "the top vocabulary mistakes made by architects, number 4",
        "recommendation": "remember that we avoid using 'affectation' to refer to the function of a building",
        "examples": "say 'program', 'function' or 'intended use'"
    },
    "1806":{
        "short_slug": "arch-int-priv",
        "description": "incorrect spelling of intimacy or privacy",
        "reference": "the top vocabulary mistakes made by architects, number 5",
        "recommendation": "remember that we say privacy and intimacy",
        "examples": "avoid saying 'privacity' and 'intimity'"
    },
    "1807":{
        "short_slug": "arch-made-of",
        "description": "incorrect description of material composition",
        "reference": "the top vocabulary mistakes made by architects, number 6",
        "recommendation": "remember that the preposition that follows 'made' is 'of'",
        "examples": "say 'my watch is made of steel', not 'my watch is (made) in steel'"
    },
    "1808":{
        "short_slug": "arch-diversity",
        "description": "incorrect vocabulary for diversity",
        "reference": "the top vocabulary mistakes made by architects, number 7",
        "recommendation": "avoid the word 'mixity', which does not really exist in English",
        "examples": "say 'diversity' or 'variety' instead"
    },
    "1809":{
        "short_slug": "arch-vocab-analysis",
        "description": "error with the use of analysis, calculation or principle",
        "reference": "the top vocabulary mistakes made by architects, number 8",
        "recommendation": "review the forms of the verbs and nouns for analysis, calculation and principles",
        "examples": "say 'after an analysis of the site, we began drawing', not 'after an anaylse of the project..."
    },
    "1810":{
        "short_slug": "arch-slope-steep",
        "description": "incorrect description of a slope",
        "reference": "the top vocabulary mistakes made by architects, number 9",
        "recommendation": "remember that the word 'slopy' does not exist",
        "examples": "say 'a gentle slope' or 'a steep slope'"
    },
    "1811":{
        "short_slug": "arch-nature",
        "description": "incorrect use of the word 'nature'",
        "reference": "the top vocabulary mistakes made by architects, number 10",
        "recommendation": "remember that we don't use 'nature' with a definite article ",
        "examples": "say 'Nature is important to me', not 'The nature is important...'"
    }
};

