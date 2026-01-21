export const parallelUniversePrompts = {
    1: {
        verb: "feel",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ better if you eat healthy.",
        condition: false,
        answers: ["will feel", "'ll feel", "ll feel"],
        negative: false
    },
    2: {
        verb: "feel",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ healthy, you'd feel better.",
        condition: true,
        answers: ["ate"],
        negative: false
    },
    3: {
        verb: "feel",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ so much junk food last week, you'd feel better right now.",
        condition: true,
        answers: ["had not eaten", "hadn't eaten", "hadnt eaten"],
        negative: true
    },
    4: {
        verb: "go",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ far if you keep practicing.",
        condition: false,
        answers: ["will go", "'ll go", "ll go"],
        negative: false
    },
    5: {
        verb: "go",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ more often, you'd get in shape.",
        condition: true,
        answers: ["went"],
        negative: false
    },
    6: {
        verb: "go",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ to the doctor earlier, you'd have recovered by now.",
        condition: true,
        answers: ["had gone"],
        negative: false
    },

    7: {
        verb: "play",
        irreg_level: "regular",
        conditional_type: "first",
        sentence: "You _____ better if you warm up first.",
        condition: false,
        answers: ["will play", "'ll play", "ll play"],
        negative: false
    },
    8: {
        verb: "play",
        irreg_level: "regular",
        conditional_type: "second",
        sentence: "If you _____ more often, you'd improve quickly.",
        condition: true,
        answers: ["played"],
        negative: false
    },
    9: {
        verb: "play",
        irreg_level: "regular",
        conditional_type: "third",
        sentence: "If you _____ the match yesterday, you'd feel proud today.",
        condition: true,
        answers: ["had played"],
        negative: false
    },

    10: {
        verb: "eat",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ better if you avoid heavy meals.",
        condition: false,
        answers: ["will eat", "'ll eat", "ll eat"],
        negative: false
    },
    11: {
        verb: "eat",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ less sugar, you'd have more energy.",
        condition: true,
        answers: ["ate"],
        negative: false
    },
    12: {
        verb: "eat",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ breakfast this morning, you wouldn't be hungry now.",
        condition: true,
        answers: ["had eaten"],
        negative: false
    },

    13: {
        verb: "study",
        irreg_level: "regular",
        conditional_type: "first",
        sentence: "You _____ the test if you focus today.",
        condition: false,
        answers: ["will pass", "'ll pass", "ll pass"],
        negative: false
    },
    14: {
        verb: "study",
        irreg_level: "regular",
        conditional_type: "second",
        sentence: "If you _____ more regularly, you'd remember everything.",
        condition: true,
        answers: ["studied"],
        negative: false
    },
    15: {
        verb: "study",
        irreg_level: "regular",
        conditional_type: "third",
        sentence: "If you _____ last night, you'd have finished the assignment.",
        condition: true,
        answers: ["had studied"],
        negative: false
    },

    16: {
        verb: "take",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ amazing photos if you bring your camera.",
        condition: false,
        answers: ["will take", "'ll take", "ll take"],
        negative: false
    },
    17: {
        verb: "take",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ more breaks, you'd feel less stressed.",
        condition: true,
        answers: ["took"],
        negative: false
    },
    18: {
        verb: "take",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ that opportunity, you'd be in a different place now.",
        condition: true,
        answers: ["had taken"],
        negative: false
    },

    19: {
        verb: "clean",
        irreg_level: "regular",
        conditional_type: "first",
        sentence: "You _____ faster if you start now.",
        condition: false,
        answers: ["will clean", "'ll clean", "ll clean"],
        negative: false
    },
    20: {
        verb: "clean",
        irreg_level: "regular",
        conditional_type: "second",
        sentence: "If you _____ your room more often, you'd find things easily.",
        condition: true,
        answers: ["cleaned"],
        negative: false
    },
    21: {
        verb: "clean",
        irreg_level: "regular",
        conditional_type: "third",
        sentence: "If you _____ the kitchen yesterday, it wouldn't be messy now.",
        condition: true,
        answers: ["had cleaned"],
        negative: false
    },

    22: {
        verb: "write",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ better essays if you practice daily.",
        condition: false,
        answers: ["will write", "'ll write", "ll write"],
        negative: false
    },
    23: {
        verb: "write",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ more often, you'd improve your style.",
        condition: true,
        answers: ["wrote"],
        negative: false
    },
    24: {
        verb: "write",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ the report earlier, you'd have more free time now.",
        condition: true,
        answers: ["had written"],
        negative: false
    },

    25: {
        verb: "see",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ results quickly if you stay consistent.",
        condition: false,
        answers: ["will see", "'ll see", "ll see"],
        negative: false
    },
    26: {
        verb: "see",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ things differently, you'd feel more hopeful.",
        condition: true,
        answers: ["saw"],
        negative: false
    },
    27: {
        verb: "see",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ the warning signs, you'd have avoided the problem.",
        condition: true,
        answers: ["had seen"],
        negative: false
    },
    28: {
        verb: "drink",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ enough water if you keep a bottle with you.",
        condition: false,
        answers: ["will drink", "'ll drink", "ll drink"],
        negative: false
    },
    29: {
        verb: "drink",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ more water, you'd feel more energized.",
        condition: true,
        answers: ["drank"],
        negative: false
    },
    30: {
        verb: "drink",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ so much coffee yesterday, you'd sleep better now.",
        condition: true,
        answers: ["had not drunk", "hadn't drunk", "hadnt drunk"],
        negative: true
    },

    31: {
        verb: "come",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ earlier if you leave on time.",
        condition: false,
        answers: ["will come", "'ll come", "ll come"],
        negative: false
    },
    32: {
        verb: "come",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ to class more often, you'd understand everything.",
        condition: true,
        answers: ["came"],
        negative: false
    },
    33: {
        verb: "come",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ to the meeting yesterday, you'd know the plan.",
        condition: true,
        answers: ["had come"],
        negative: false
    },

    34: {
        verb: "open",
        irreg_level: "regular",
        conditional_type: "first",
        sentence: "You _____ the door automatically if you press this button.",
        condition: false,
        answers: ["will open", "'ll open", "ll open"],
        negative: false
    },
    35: {
        verb: "open",
        irreg_level: "regular",
        conditional_type: "second",
        sentence: "If you _____ the windows more often, the room would smell fresher.",
        condition: true,
        answers: ["opened"],
        negative: false
    },
    36: {
        verb: "open",
        irreg_level: "regular",
        conditional_type: "third",
        sentence: "If you _____ the package earlier, you'd have seen the mistake.",
        condition: true,
        answers: ["had opened"],
        negative: false
    },

    37: {
        verb: "break",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ the habit if you stay consistent.",
        condition: false,
        answers: ["will break", "'ll break", "ll break"],
        negative: false
    },
    38: {
        verb: "break",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ the rules, you'd get in trouble.",
        condition: true,
        answers: ["broke"],
        negative: false
    },
    39: {
        verb: "break",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ the vase yesterday, you'd be apologizing now.",
        condition: true,
        answers: ["had broken"],
        negative: false
    },

    40: {
        verb: "learn",
        irreg_level: "regular",
        conditional_type: "first",
        sentence: "You _____ faster if you practice every day.",
        condition: false,
        answers: ["will learn", "'ll learn", "ll learn"],
        negative: false
    },
    41: {
        verb: "learn",
        irreg_level: "regular",
        conditional_type: "second",
        sentence: "If you _____ more vocabulary, you'd understand the text easily.",
        condition: true,
        answers: ["learned"],
        negative: false
    },
    42: {
        verb: "learn",
        irreg_level: "regular",
        conditional_type: "third",
        sentence: "If you _____ the grammar earlier, you'd feel more confident now.",
        condition: true,
        answers: ["had learned"],
        negative: false
    },

    43: {
        verb: "drive",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ safely if you slow down.",
        condition: false,
        answers: ["will drive", "'ll drive", "ll drive"],
        negative: false
    },
    44: {
        verb: "drive",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ more carefully, you'd avoid accidents.",
        condition: true,
        answers: ["drove"],
        negative: false
    },
    45: {
        verb: "drive",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ so fast yesterday, you wouldn't have gotten a ticket.",
        condition: true,
        answers: ["had not driven", "hadn't driven", "hadnt driven"],
        negative: true
    },

    46: {
        verb: "watch",
        irreg_level: "regular",
        conditional_type: "first",
        sentence: "You _____ the show if you finish your work early.",
        condition: false,
        answers: ["will watch", "'ll watch", "ll watch"],
        negative: false
    },
    47: {
        verb: "watch",
        irreg_level: "regular",
        conditional_type: "second",
        sentence: "If you _____ more documentaries, you'd learn a lot.",
        condition: true,
        answers: ["watched"],
        negative: false
    },
    48: {
        verb: "watch",
        irreg_level: "regular",
        conditional_type: "third",
        sentence: "If you _____ the movie last night, you'd understand the reference.",
        condition: true,
        answers: ["had watched"],
        negative: false
    },

    49: {
        verb: "give",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ great advice if you listen carefully.",
        condition: false,
        answers: ["will give", "'ll give", "ll give"],
        negative: false
    },
    50: {
        verb: "give",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ yourself more time, you'd feel less rushed.",
        condition: true,
        answers: ["gave"],
        negative: false
    },
    51: {
        verb: "give",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ it more thought, you'd have chosen differently.",
        condition: true,
        answers: ["had given"],
        negative: false
    },
    52: {
        verb: "run",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ faster if you train regularly.",
        condition: false,
        answers: ["will run", "'ll run", "ll run"],
        negative: false
    },
    53: {
        verb: "run",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ every morning, you'd feel stronger.",
        condition: true,
        answers: ["ran"],
        negative: false
    },
    54: {
        verb: "run",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ the race yesterday, you'd be exhausted now.",
        condition: true,
        answers: ["had run"],
        negative: false
    },

    55: {
        verb: "buy",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ a better laptop if you save a bit more.",
        condition: false,
        answers: ["will buy", "'ll buy", "ll buy"],
        negative: false
    },
    56: {
        verb: "buy",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ fewer snacks, you'd save more money.",
        condition: true,
        answers: ["bought"],
        negative: false
    },
    57: {
        verb: "buy",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ that ticket earlier, you'd be on the trip now.",
        condition: true,
        answers: ["had bought"],
        negative: false
    },

    58: {
        verb: "sleep",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ better if you avoid screens before bed.",
        condition: false,
        answers: ["will sleep", "'ll sleep", "ll sleep"],
        negative: false
    },
    59: {
        verb: "sleep",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ earlier, you'd feel more rested.",
        condition: true,
        answers: ["slept"],
        negative: false
    },
    60: {
        verb: "sleep",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ enough last night, you wouldn't be tired now.",
        condition: true,
        answers: ["had slept"],
        negative: false
    },

    61: {
        verb: "lose",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ weight if you exercise regularly.",
        condition: false,
        answers: ["will lose", "'ll lose", "ll lose"],
        negative: false
    },
    62: {
        verb: "lose",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ your keys less often, you'd save time.",
        condition: true,
        answers: ["lost"],
        negative: false
    },
    63: {
        verb: "lose",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ your wallet yesterday, you'd be panicking now.",
        condition: true,
        answers: ["had lost"],
        negative: false
    },

    64: {
        verb: "send",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ the documents today if you finish reviewing them.",
        condition: false,
        answers: ["will send", "'ll send", "ll send"],
        negative: false
    },
    65: {
        verb: "send",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ the email earlier, they'd reply by now.",
        condition: true,
        answers: ["sent"],
        negative: false
    },
    66: {
        verb: "send",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ the invitation last week, more people would have come.",
        condition: true,
        answers: ["had sent"],
        negative: false
    },

    67: {
        verb: "keep",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ improving if you stay consistent.",
        condition: false,
        answers: ["will keep", "'ll keep", "ll keep"],
        negative: false
    },
    68: {
        verb: "keep",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ your promises, people would trust you more.",
        condition: true,
        answers: ["kept"],
        negative: false
    },
    69: {
        verb: "keep",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ your notes organized, you'd have found them easily.",
        condition: true,
        answers: ["had kept"],
        negative: false
    },

    70: {
        verb: "call",
        irreg_level: "regular",
        conditional_type: "first",
        sentence: "You _____ me if anything strange happens.",
        condition: false,
        answers: ["will call", "'ll call", "ll call"],
        negative: false
    },
    71: {
        verb: "call",
        irreg_level: "regular",
        conditional_type: "second",
        sentence: "If you _____ your parents more often, they'd be happier.",
        condition: true,
        answers: ["called"],
        negative: false
    },
    72: {
        verb: "call",
        irreg_level: "regular",
        conditional_type: "third",
        sentence: "If you _____ me yesterday, I would have helped you.",
        condition: true,
        answers: ["had called"],
        negative: false
    },
    73: {
        verb: "beat",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "You _____ your record if you train harder.",
        condition: false,
        answers: ["will beat", "'ll beat", "ll beat"],
        negative: false
    },
    74: {
        verb: "beat",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you _____ your fears, you'd feel unstoppable.",
        condition: true,
        answers: ["beat"],
        negative: false
    },
    75: {
        verb: "beat",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If Man City _____ Madrid, they would have completed the best season in history.",
        condition: true,
        answers: ["had beaten"],
        negative: false
    },

    76: {
        verb: "bite",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "You _____ your nails if you stay mindful.",
        condition: false,
        answers: ["will not bite", "won't bite"],
        negative: true
    },
    77: {
        verb: "bite",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you _____ your tongue more often, you'd avoid arguments.",
        condition: true,
        answers: ["bit"],
        negative: false
    },
    78: {
        verb: "bite",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you _____ your lip yesterday, it wouldn't hurt now.",
        condition: true,
        answers: ["had bitten"],
        negative: false
    },

    79: {
        verb: "forbid",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "You _____ trouble if you follow the rules.",
        condition: false,
        answers: ["will avoid", "'ll avoid", "ll avoid"],
        negative: false
    },
    80: {
        verb: "forbid",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If they _____ phones in class, students would focus more.",
        condition: true,
        answers: ["forbade"],
        negative: false
    },
    81: {
        verb: "forbid",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If they _____ it earlier, the issue wouldn't have happened.",
        condition: true,
        answers: ["had forbidden"],
        negative: false
    },

    82: {
        verb: "blow",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "You _____ your chance if you don't prepare.",
        condition: false,
        answers: ["will blow", "'ll blow", "ll blow"],
        negative: false
    },
    83: {
        verb: "blow",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you _____ on the embers, they'd glow again.",
        condition: true,
        answers: ["blew"],
        negative: false
    },
    84: {
        verb: "blow",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you _____ all your savings last year, you'd regret it now.",
        condition: true,
        answers: ["had blown"],
        negative: false
    },

    85: {
        verb: "offset",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "You _____ the cost if you apply the discount.",
        condition: false,
        answers: ["will offset", "'ll offset", "ll offset"],
        negative: false
    },
    86: {
        verb: "offset",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you _____ your emissions, you'd reduce your footprint.",
        condition: true,
        answers: ["offset"],
        negative: false
    },
    87: {
        verb: "offset",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you _____ the damage earlier, the repair would be cheaper.",
        condition: true,
        answers: ["had offset"],
        negative: false
    },

    88: {
        verb: "tear",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "You _____ the paper if you rush.",
        condition: false,
        answers: ["will tear", "'ll tear", "ll tear"],
        negative: false
    },
    89: {
        verb: "tear",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you _____ the page out carefully, it wouldn't rip.",
        condition: true,
        answers: ["tore"],
        negative: false
    },
    90: {
        verb: "tear",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you _____ open the envelope yesterday, you'd have seen the letter.",
        condition: true,
        answers: ["had torn"],
        negative: false
    },

    91: {
        verb: "hide",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "You _____ your feelings if you trust me.",
        condition: false,
        answers: ["will not hide", "won't hide"],
        negative: true
    },
    92: {
        verb: "hide",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you _____ your keys better, you'd stop losing them.",
        condition: true,
        answers: ["hid"],
        negative: false
    },
    93: {
        verb: "hide",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you _____ the gift earlier, they wouldn't have found it.",
        condition: true,
        answers: ["had hidden"],
        negative: false
    },

    94: {
        verb: "burn",
        irreg_level: "regular",
        conditional_type: "first",
        sentence: "You _____ the food if you don't watch it.",
        condition: false,
        answers: ["will burn", "'ll burn", "ll burn"],
        negative: false
    },
    95: {
        verb: "burn",
        irreg_level: "regular",
        conditional_type: "second",
        sentence: "If you _____ the candle all night, it would melt completely.",
        condition: true,
        answers: ["burned", "burnt"],
        negative: false
    },
    96: {
        verb: "burn",
        irreg_level: "regular",
        conditional_type: "third",
        sentence: "If you _____ the toast earlier, the kitchen wouldn't smell now.",
        condition: true,
        answers: ["had burned", "had burnt"],
        negative: false
    },
    97: {
        verb: "beat",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ your personal best today, you'll feel proud.",
        condition: true,
        answers: ["beat"],
        negative: false
    },
    98: {
        verb: "beat",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you trained harder, you _____ your rivals easily.",
        condition: false,
        answers: ["would beat", "d beat", "'d beat"],
        negative: false
    },
    99: {
        verb: "beat",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had tried harder, you _____ the record yesterday.",
        condition: false,
        answers: ["would have beaten"],
        negative: false
    },

    100: {
        verb: "bite",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ your nails, they'll stay short.",
        condition: true,
        answers: ["bite"],
        negative: false
    },
    101: {
        verb: "bite",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were more careful, you _____ your tongue so often.",
        condition: false,
        answers: ["wouldn't bite", "would not bite", "wouldnt bite"],
        negative: true
    },
    102: {
        verb: "bite",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had focused, you _____ your lip yesterday.",
        condition: false,
        answers: ["wouldn't have bitten", "wouldnt have bitten", "would not have bitten"],
        negative: true
    },

    103: {
        verb: "forbid",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If they _____ phones in class, students would pay more attention.",
        condition: true,
        answers: ["forbade"],
        negative: false
    },
    104: {
        verb: "forbid",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If school leaders were more reasonable, they _____ water bottles in the classroom.",
        condition: false,
        answers: ["would not forbid", "wouldnt forbid", "wouldn't forbid"],
        negative: true
    },
    105: {
        verb: "forbid",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If they had acted sooner, they _____ that behavior years ago.",
        condition: false,
        answers: ["would have forbidden"],
        negative: false
    },

    106: {
        verb: "blow",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ on the embers, they'll glow again.",
        condition: true,
        answers: ["blow"],
        negative: false
    },
    107: {
        verb: "blow",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were more careful, you _____ your chance.",
        condition: false,
        answers: ["wouldn't blow", "would not blow"],
        negative: true
    },
    108: {
        verb: "blow",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had saved more, you _____ all your money last year.",
        condition: false,
        answers: ["wouldn't have blown", "would not have blown"],
        negative: true
    },

    109: {
        verb: "offset",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ your emissions, you'll reduce your footprint.",
        condition: true,
        answers: ["offset"],
        negative: false
    },
    110: {
        verb: "offset",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you planned better, you _____ the extra costs.",
        condition: false,
        answers: ["would offset"],
        negative: false
    },
    111: {
        verb: "offset",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had acted earlier, you _____ the damage.",
        condition: false,
        answers: ["would have offset"],
        negative: false
    },

    112: {
        verb: "tear",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ the page out slowly, it won't rip.",
        condition: true,
        answers: ["tear"],
        negative: false
    },
    113: {
        verb: "tear",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were gentler, you _____ the paper so often.",
        condition: false,
        answers: ["wouldn't tear", "would not tear"],
        negative: true
    },
    114: {
        verb: "tear",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had opened it carefully, you _____ the envelope.",
        condition: false,
        answers: ["wouldn't have torn", "would not have torn"],
        negative: true
    },

    115: {
        verb: "hide",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ your valuables well, no one will find them.",
        condition: true,
        answers: ["hide"],
        negative: false
    },
    116: {
        verb: "hide",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you trusted me more, you _____ your feelings.",
        condition: false,
        answers: ["wouldn't hide", "would not hide"],
        negative: true
    },
    117: {
        verb: "hide",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had chosen a better spot, you _____ the gift properly.",
        condition: false,
        answers: ["would have hidden"],
        negative: false
    },

    118: {
        verb: "burn",
        irreg_level: "regular",
        conditional_type: "first",
        sentence: "If you _____ the sauce, it will taste bitter.",
        condition: true,
        answers: ["burn"],
        negative: false
    },
    119: {
        verb: "burn",
        irreg_level: "regular",
        conditional_type: "second",
        sentence: "If you were more attentive, you _____ dinner so often.",
        condition: false,
        answers: ["wouldn't burn", "would not burn"],
        negative: true
    },
    120: {
        verb: "burn",
        irreg_level: "regular",
        conditional_type: "third",
        sentence: "If you had watched the oven, you _____ the cookies yesterday.",
        condition: false,
        answers: ["wouldn't have burned", "would not have burned", "wouldn't have burnt", "would not have burnt"],
        negative: true
    },
    121: {
        verb: "set",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ clear goals, you'll stay motivated.",
        condition: true,
        answers: ["set"],
        negative: false
    },
    122: {
        verb: "set",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you worked more efficiently, you _____ new records.",
        condition: false,
        answers: ["would set"],
        negative: false
    },
    123: {
        verb: "set",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had planned better, you _____ a different deadline.",
        condition: false,
        answers: ["would have set"],
        negative: false
    },

    124: {
        verb: "hit",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ the brakes now, you'll stop in time.",
        condition: true,
        answers: ["hit"],
        negative: false
    },
    125: {
        verb: "hit",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you were more careful, you _____ the target easily.",
        condition: false,
        answers: ["would hit"],
        negative: false
    },
    126: {
        verb: "hit",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had reacted sooner, you _____ the wall.",
        condition: false,
        answers: ["wouldn't have hit", "would not have hit"],
        negative: true
    },

    127: {
        verb: "seek",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ help, you'll find it.",
        condition: true,
        answers: ["seek"],
        negative: false
    },
    128: {
        verb: "seek",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were more open, you _____ better opportunities.",
        condition: false,
        answers: ["would seek"],
        negative: false
    },
    129: {
        verb: "seek",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had asked earlier, you _____ the right advice.",
        condition: false,
        answers: ["would have sought"],
        negative: false
    },

    130: {
        verb: "light",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ the candles now, the room will look cozy.",
        condition: true,
        answers: ["light"],
        negative: false
    },
    131: {
        verb: "light",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you were more careful, you _____ the fire too quickly.",
        condition: false,
        answers: ["wouldn't light", "would not light"],
        negative: true
    },
    132: {
        verb: "light",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had used a match, you _____ the grill faster.",
        condition: false,
        answers: ["would have lit", "would have lighted"],
        negative: false
    },

    133: {
        verb: "build",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ a strong foundation, the house will last.",
        condition: true,
        answers: ["build"],
        negative: false
    },
    134: {
        verb: "build",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you had more time, you _____ a treehouse.",
        condition: false,
        answers: ["would build"],
        negative: false
    },
    135: {
        verb: "build",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had followed the plan, you _____ it correctly.",
        condition: false,
        answers: ["would have built"],
        negative: false
    },

    136: {
        verb: "dig",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ deeper, you'll find the roots.",
        condition: true,
        answers: ["dig"],
        negative: false
    },
    137: {
        verb: "dig",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you were stronger, you _____ faster.",
        condition: false,
        answers: ["would dig"],
        negative: false
    },
    138: {
        verb: "dig",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had used the right tool, you _____ the hole sooner.",
        condition: false,
        answers: ["would have dug"],
        negative: false
    },

    139: {
        verb: "buy",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ the tickets now, you'll get a discount.",
        condition: true,
        answers: ["buy"],
        negative: false
    },
    140: {
        verb: "buy",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you saved more, you _____ a better phone.",
        condition: false,
        answers: ["would buy"],
        negative: false
    },
    141: {
        verb: "buy",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had compared prices, you _____ it cheaper.",
        condition: false,
        answers: ["would have bought"],
        negative: false
    },

    142: {
        verb: "sell",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ your old bike, you'll have more space.",
        condition: true,
        answers: ["sell"],
        negative: false
    },
    143: {
        verb: "sell",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you advertised it better, you _____ it quickly.",
        condition: false,
        answers: ["would sell"],
        negative: false
    },
    144: {
        verb: "sell",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had lowered the price, you _____ it yesterday.",
        condition: false,
        answers: ["would have sold"],
        negative: false
    },

    145: {
        verb: "pay",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ attention, you'll understand the instructions.",
        condition: true,
        answers: ["pay"],
        negative: false
    },
    146: {
        verb: "pay",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you were more careful, you _____ extra fees.",
        condition: false,
        answers: ["wouldn't pay", "would not pay"],
        negative: true
    },
    147: {
        verb: "pay",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had checked the bill, you _____ that mistake.",
        condition: false,
        answers: ["wouldn't have paid", "would not have paid"],
        negative: true
    },

    148: {
        verb: "write",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ your ideas down, you'll remember them.",
        condition: true,
        answers: ["write"],
        negative: false
    },
    149: {
        verb: "write",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you practiced more, you _____ better essays.",
        condition: false,
        answers: ["would write"],
        negative: false
    },
    150: {
        verb: "write",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had started earlier, you _____ a stronger report.",
        condition: false,
        answers: ["would have written"],
        negative: false
    },

    151: {
        verb: "send",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ the documents now, they'll arrive today.",
        condition: true,
        answers: ["send"],
        negative: false
    },
    152: {
        verb: "send",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you were more organized, you _____ reminders on time.",
        condition: false,
        answers: ["would send"],
        negative: false
    },
    153: {
        verb: "send",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had checked the address, you _____ it correctly.",
        condition: false,
        answers: ["would have sent"],
        negative: false
    },

    154: {
        verb: "forgive",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ him, you'll feel lighter.",
        condition: true,
        answers: ["forgive"],
        negative: false
    },
    155: {
        verb: "forgive",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you were more patient, you _____ people more easily.",
        condition: false,
        answers: ["would forgive"],
        negative: false
    },
    156: {
        verb: "forgive",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had understood his reasons, you _____ him sooner.",
        condition: false,
        answers: ["would have forgiven"],
        negative: false
    },

    157: {
        verb: "forget",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ your keys again, you'll be locked out.",
        condition: true,
        answers: ["forget"],
        negative: false
    },
    158: {
        verb: "forget",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you were more organized, you _____ important dates.",
        condition: false,
        answers: ["wouldn't forget", "would not forget"],
        negative: true
    },
    159: {
        verb: "forget",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had written it down, you _____ the appointment.",
        condition: false,
        answers: ["wouldn't have forgotten", "would not have forgotten"],
        negative: true
    },

    160: {
        verb: "sweep",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ the floor now, the room will look tidy.",
        condition: true,
        answers: ["sweep"],
        negative: false
    },
    161: {
        verb: "sweep",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you cleaned more often, you _____ dust everywhere.",
        condition: false,
        answers: ["wouldn't sweep", "would not sweep"],
        negative: true
    },
    162: {
        verb: "sweep",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had done it yesterday, you _____ it today.",
        condition: false,
        answers: ["wouldn't have swept", "would not have swept"],
        negative: true
    },

    163: {
        verb: "cling",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ to old habits, change will be slow.",
        condition: true,
        answers: ["cling"],
        negative: false
    },
    164: {
        verb: "cling",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were more confident, you _____ to others so much.",
        condition: false,
        answers: ["wouldn't cling", "would not cling"],
        negative: true
    },
    165: {
        verb: "cling",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had trusted yourself, you _____ to that idea.",
        condition: false,
        answers: ["wouldn't have clung", "would not have clung"],
        negative: true
    },

    166: {
        verb: "creep",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ quietly, no one will notice.",
        condition: true,
        answers: ["creep"],
        negative: false
    },
    167: {
        verb: "creep",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you moved more slowly, you _____ people out.",
        condition: false,
        answers: ["wouldn't creep", "would not creep"],
        negative: true
    },
    168: {
        verb: "creep",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had walked normally, you _____ everyone out yesterday.",
        condition: false,
        answers: ["wouldn't have crept", "would not have crept"],
        negative: true
    },

    169: {
        verb: "sing",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ with confidence, the audience will love it.",
        condition: true,
        answers: ["sing"],
        negative: false
    },
    170: {
        verb: "sing",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you practiced more, you _____ beautifully.",
        condition: false,
        answers: ["would sing"],
        negative: false
    },
    171: {
        verb: "sing",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had warmed up, you _____ better yesterday.",
        condition: false,
        answers: ["would have sung"],
        negative: false
    },
    172: {
        verb: "hang",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ the picture straight, it will look better.",
        condition: true,
        answers: ["hang"],
        negative: false
    },
    173: {
        verb: "hang",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were more careful, you _____ it crooked.",
        condition: false,
        answers: ["wouldn't hang", "would not hang"],
        negative: true
    },
    174: {
        verb: "hang",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had used a level, you _____ it unevenly.",
        condition: false,
        answers: ["wouldn't have hung", "would not have hung"],
        negative: true
    },

    175: {
        verb: "grind",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ the beans fresh, the coffee will taste better.",
        condition: true,
        answers: ["grind"],
        negative: false
    },
    176: {
        verb: "grind",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you had a better machine, you _____ the spices evenly.",
        condition: false,
        answers: ["would grind"],
        negative: false
    },
    177: {
        verb: "grind",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had taken your time, you _____ the gears.",
        condition: false,
        answers: ["wouldn't have ground", "would not have ground"],
        negative: true
    },

    178: {
        verb: "hurt",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ your ankle again, you'll need a brace.",
        condition: true,
        answers: ["hurt"],
        negative: false
    },
    179: {
        verb: "hurt",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you moved more carefully, you _____ yourself so often.",
        condition: false,
        answers: ["wouldn't hurt", "would not hurt"],
        negative: true
    },
    180: {
        verb: "hurt",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had stretched properly, you _____ your back yesterday.",
        condition: false,
        answers: ["wouldn't have hurt", "would not have hurt"],
        negative: true
    },

    181: {
        verb: "quit",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ now, you'll regret it later.",
        condition: true,
        answers: ["quit"],
        negative: false
    },
    182: {
        verb: "quit",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you had more patience, you _____ so easily.",
        condition: false,
        answers: ["wouldn't quit", "would not quit"],
        negative: true
    },
    183: {
        verb: "quit",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had stayed focused, you _____ last week.",
        condition: false,
        answers: ["wouldn't have quit", "would not have quit"],
        negative: true
    },

    184: {
        verb: "shoot",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ quickly, you'll catch the moment.",
        condition: true,
        answers: ["shoot"],
        negative: false
    },
    185: {
        verb: "shoot",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you practiced more, you _____ straighter.",
        condition: false,
        answers: ["would shoot"],
        negative: false
    },
    186: {
        verb: "shoot",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had aimed properly, you _____ the target.",
        condition: false,
        answers: ["would have shot"],
        negative: false
    },

    187: {
        verb: "show",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ your work, they'll give feedback.",
        condition: true,
        answers: ["show"],
        negative: false
    },
    188: {
        verb: "show",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were more confident, you _____ your talent.",
        condition: false,
        answers: ["would show"],
        negative: false
    },
    189: {
        verb: "show",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had arrived earlier, you _____ your project.",
        condition: false,
        answers: ["would have shown"],
        negative: false
    },

    190: {
        verb: "strike",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ the match now, it will light.",
        condition: true,
        answers: ["strike"],
        negative: false
    },
    191: {
        verb: "strike",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were more careful, you _____ the wrong note.",
        condition: false,
        answers: ["wouldn't strike", "would not strike"],
        negative: true
    },
    192: {
        verb: "strike",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had reacted faster, you _____ the ball cleanly.",
        condition: false,
        answers: ["would have struck"],
        negative: false
    },

    193: {
        verb: "stick",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ to the plan, you'll succeed.",
        condition: true,
        answers: ["stick"],
        negative: false
    },
    194: {
        verb: "stick",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were more disciplined, you _____ to your schedule.",
        condition: false,
        answers: ["would stick"],
        negative: false
    },
    195: {
        verb: "stick",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had followed the rules, you _____ to the guidelines.",
        condition: false,
        answers: ["would have stuck"],
        negative: false
    },

    196: {
        verb: "spring",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ into action, you'll solve it quickly.",
        condition: true,
        answers: ["spring"],
        negative: false
    },
    197: {
        verb: "spring",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were more alert, you _____ into motion sooner.",
        condition: false,
        answers: ["would spring"],
        negative: false
    },
    198: {
        verb: "spring",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had noticed the issue, you _____ into action earlier.",
        condition: false,
        answers: ["would have sprung"],
        negative: false
    },

    199: {
        verb: "broadcast",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ the announcement now, everyone will hear it.",
        condition: true,
        answers: ["broadcast"],
        negative: false
    },
    200: {
        verb: "broadcast",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you had better equipment, you _____ the show live.",
        condition: false,
        answers: ["would broadcast"],
        negative: false
    },
    201: {
        verb: "broadcast",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had checked the signal, you _____ it properly.",
        condition: false,
        answers: ["would have broadcast"],
        negative: false
    },

    202: {
        verb: "flee",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ now, you'll avoid the crowd.",
        condition: true,
        answers: ["flee"],
        negative: false
    },
    203: {
        verb: "flee",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you felt unsafe, you _____ immediately.",
        condition: false,
        answers: ["would flee"],
        negative: false
    },
    204: {
        verb: "flee",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had heard the warning, you _____ sooner.",
        condition: false,
        answers: ["would have fled"],
        negative: false
    },

    205: {
        verb: "bleed",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ again, apply pressure.",
        condition: true,
        answers: ["bleed"],
        negative: false
    },
    206: {
        verb: "bleed",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were more careful, you _____ so easily.",
        condition: false,
        answers: ["wouldn't bleed", "would not bleed"],
        negative: true
    },
    207: {
        verb: "bleed",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had worn gloves, you _____ yesterday.",
        condition: false,
        answers: ["wouldn't have bled", "would not have bled"],
        negative: true
    },

    208: {
        verb: "lie",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ down now, you'll feel better.",
        condition: true,
        answers: ["lie"],
        negative: false
    },
    209: {
        verb: "lie",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you were honest, you _____ about it.",
        condition: false,
        answers: ["wouldn't lie", "would not lie"],
        negative: true
    },
    210: {
        verb: "lie",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had told the truth, you _____ yesterday.",
        condition: false,
        answers: ["wouldn't have lied", "would not have lied"],
        negative: true
    },

    211: {
        verb: "shrink",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ the sweater, it won't fit.",
        condition: true,
        answers: ["shrink"],
        negative: false
    },
    212: {
        verb: "shrink",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you washed it carefully, it _____ in the dryer.",
        condition: false,
        answers: ["wouldn't shrink", "would not shrink"],
        negative: true
    },
    213: {
        verb: "shrink",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had checked the label, it _____ last week.",
        condition: false,
        answers: ["wouldn't have shrunk", "would not have shrunk"],
        negative: true
    },

    214: {
        verb: "sink",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ the boat, it will be a disaster.",
        condition: true,
        answers: ["sink"],
        negative: false
    },
    215: {
        verb: "sink",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you overloaded it, it _____ quickly.",
        condition: false,
        answers: ["would sink"],
        negative: false
    },
    216: {
        verb: "sink",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had patched the hole, it _____ yesterday.",
        condition: false,
        answers: ["wouldn't have sunk", "would not have sunk"],
        negative: true
    },

    217: {
        verb: "spin",
        irreg_level: "advanced",
        conditional_type: "first",
        sentence: "If you _____ the wheel now, you'll get a prize.",
        condition: true,
        answers: ["spin"],
        negative: false
    },
    218: {
        verb: "spin",
        irreg_level: "advanced",
        conditional_type: "second",
        sentence: "If you pushed harder, it _____ faster.",
        condition: false,
        answers: ["would spin"],
        negative: false
    },
    219: {
        verb: "spin",
        irreg_level: "advanced",
        conditional_type: "third",
        sentence: "If you had tightened the bolt, it _____ yesterday.",
        condition: false,
        answers: ["wouldn't have spun", "would not have spun"],
        negative: true
    },

    /* --- ESSENTIAL VERBS --- */

    220: {
        verb: "sit",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ here, you'll see better.",
        condition: true,
        answers: ["sit"],
        negative: false
    },
    221: {
        verb: "sit",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you moved closer, you _____ comfortably.",
        condition: false,
        answers: ["would sit"],
        negative: false
    },
    222: {
        verb: "sit",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had chosen the front row, you _____ better.",
        condition: false,
        answers: ["would have sat"],
        negative: false
    },

    223: {
        verb: "cut",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ the rope, it will fall.",
        condition: true,
        answers: ["cut"],
        negative: false
    },
    224: {
        verb: "cut",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you were more careful, you _____ yourself.",
        condition: false,
        answers: ["wouldn't cut", "would not cut"],
        negative: true
    },
    225: {
        verb: "cut",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had used a sharper knife, you _____ it cleanly.",
        condition: false,
        answers: ["would have cut"],
        negative: false
    },

    226: {
        verb: "drink",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ more water, you'll feel better.",
        condition: true,
        answers: ["drink"],
        negative: false
    },
    227: {
        verb: "drink",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you exercised more, you _____ more fluids.",
        condition: false,
        answers: ["would drink"],
        negative: false
    },
    228: {
        verb: "drink",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had brought a bottle, you _____ enough yesterday.",
        condition: false,
        answers: ["would have drunk"],
        negative: false
    },

    229: {
        verb: "cost",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If it _____ less, more people will buy it.",
        condition: true,
        answers: ["costs"],
        negative: false
    },
    230: {
        verb: "cost",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If it were on sale, it _____ less.",
        condition: false,
        answers: ["would cost"],
        negative: false
    },
    231: {
        verb: "cost",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had compared prices, it _____ you less.",
        condition: false,
        answers: ["would have cost"],
        negative: false
    },

    232: {
        verb: "fight",
        irreg_level: "essential",
        conditional_type: "first",
        sentence: "If you _____ for it, you'll win.",
        condition: true,
        answers: ["fight"],
        negative: false
    },
    233: {
        verb: "fight",
        irreg_level: "essential",
        conditional_type: "second",
        sentence: "If you trained harder, you _____ better.",
        condition: false,
        answers: ["would fight"],
        negative: false
    },
    234: {
        verb: "fight",
        irreg_level: "essential",
        conditional_type: "third",
        sentence: "If you had defended yourself, you _____ back.",
        condition: false,
        answers: ["would have fought"],
        negative: false
    }
}

    



