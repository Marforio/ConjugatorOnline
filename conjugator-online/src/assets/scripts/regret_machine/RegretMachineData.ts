// RegretMachinePrompts.js
// 2 entries per verb (≈160 entries). Modals alternate should/could.
// Students type ONLY the modal verb phrase (e.g., "should have gone", "couldn't have done").

// NOTE: keys are in quotes (as requested).

export const regretmachineData = {
  "1": {
    prompt: "I left my rain jacket at home, and now I'm soaking wet.",
    verb: "bring",
    highlight: "brought",
    sentence: "I _____ my rain jacket.",
    category: "essential",
    modal: "should",
    answers: ["should have brought", "should've brought", "shouldve brought", "shoulda brought"],
    negative: false
  },
  "2": {
    prompt: "I came to work with the later train.",
    verb: "come",
    highlight: "came",
    sentence: "I _____ with the earlier train.",
    category: "essential",
    modal: "could",
    answers: ["could have come", "could've come", "couldve come", "coulda come"],
    negative: false
  },

  "3": {
    prompt: "I slept only 4 hours and now I feel tired.",
    verb: "sleep",
    highlight: "slept",
    sentence: "I _____ more.",
    category: "essential",
    modal: "should",
    answers: ["should have slept", "should've slept", "shouldve slept", "shoulda slept"],
    negative: false
  },
  "4": {
    prompt: "I didn't hear the announcement and got confused.",
    verb: "hear",
    highlight: "didn't hear",
    sentence: "I _____ the announcement.",
    category: "essential",
    modal: "should",
    answers: ["should have heard", "should've heard", "shouldve heard", "shoulda heard"],
    negative: false
  },

  "5": {
    prompt: "I forgot my wallet and couldn't pay for anything.",
    verb: "forget",
    highlight: "forgot",
    sentence: "I _____ my wallet.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have forgotten", "should not have forgotten", "shouldnt have forgotten", "shouldnt ve forgotten", "shouldnt've forgotten"],
    negative: true
  },
  "6": {
    prompt: "I didn't bring my ID, so I couldn't get into the building.",
    verb: "bring",
    highlight: "didn't bring",
    sentence: "I _____ my ID.",
    category: "essential",
    modal: "should",
    answers: ["should have brought", "should've brought", "shouldve brought", "shoulda brought"],
    negative: false
  },

  "7": {
    prompt: "I bought the wrong size online and now I have to return it.",
    verb: "buy",
    highlight: "bought",
    sentence: "I _____ the right size.",
    category: "essential",
    modal: "should",
    answers: ["should have bought", "should've bought", "shouldve bought", "shoulda bought"],
    negative: false
  },
  "8": {
    prompt: "I paid too much because I didn't compare prices.",
    verb: "pay",
    highlight: "paid",
    sentence: "I _____ less.",
    category: "essential",
    modal: "could",
    answers: ["could have paid", "could've paid", "couldve paid", "coulda paid"],
    negative: false
  },

  "9": {
    prompt: "I drank too much coffee and couldn't sleep.",
    verb: "drink",
    highlight: "drank",
    sentence: "I _____ so much coffee.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have drunk", "should not have drunk", "shouldnt have drunk", "shouldn't've drunk", "shouldnt've drunk"],
    negative: true
  },
  "10": {
    prompt: "I didn't eat breakfast and then I got dizzy.",
    verb: "eat",
    highlight: "didn't eat",
    sentence: "I _____ breakfast.",
    category: "essential",
    modal: "should",
    answers: ["should have eaten", "should've eaten", "shouldve eaten", "shoulda eaten"],
    negative: false
  },

  "11": {
    prompt: "I drove too fast and got a speeding ticket.",
    verb: "drive",
    highlight: "drove",
    sentence: "I _____ more slowly.",
    category: "essential",
    modal: "should",
    answers: ["should have driven", "should've driven", "shouldve driven", "shoulda driven"],
    negative: false
  },
  "12": {
    prompt: "I crashed because I didn't see the sign.",
    verb: "see",
    highlight: "didn't see",
    sentence: "I _____ the sign.",
    category: "essential",
    modal: "should",
    answers: ["should have seen", "should've seen", "shouldve seen", "shoulda seen"],
    negative: false
  },

  "13": {
    prompt: "I said something rude and hurt my friend's feelings.",
    verb: "say",
    highlight: "said",
    sentence: "I _____ that.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have said", "should not have said", "shouldnt have said", "shouldn't've said", "shouldnt've said"],
    negative: false
  },
  "14": {
    prompt: "I didn't tell you earlier, and that caused problems.",
    verb: "tell",
    highlight: "didn't tell",
    sentence: "I _____ you sooner.",
    category: "essential",
    modal: "could",
    answers: ["could have told", "could've told", "couldve told", "coulda told"],
    negative: false
  },

  "15": {
    prompt: "I wrote the email too quickly and made mistakes.",
    verb: "write",
    highlight: "wrote",
    sentence: "I _____ it more carefully.",
    category: "essential",
    modal: "should",
    answers: ["should have written", "should've written", "shouldve written", "shoulda written"],
    negative: false
  },
  "16": {
    prompt: "I didn't do the homework, so I fell behind.",
    verb: "do",
    highlight: "didn't do",
    sentence: "I _____ the homework.",
    category: "essential",
    modal: "should",
    answers: ["should have done", "should've done", "shouldve done", "shoulda done"],
    negative: false
  },

  "17": {
    prompt: "I broke the touchscreen and now I can't use the phone.",
    verb: "break",
    highlight: "broke",
    sentence: "I _____ the touchscreen.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have broken", "should not have broken", "shouldnt have broken", "shouldnt ve broken", "shouldnt've broken"],
    negative: true
  },
  "18": {
    prompt: "The champion skier lost after falling on the last turn.",
    verb: "fall",
    highlight: "falling",
    sentence: "He _____ on the last turn.",
    category: "essential",
    modal: "should",
    answers: ["should not have fallen", "shouldn't have fallen", "shouldnt have fallen", "shouldnt ve fallen", "shouldnt've fallen"],
    negative: true
  },

  "19": {
    prompt: "I chose the wrong option and now it's too late to change it.",
    verb: "choose",
    highlight: "chose",
    sentence: "I _____ more carefully.",
    category: "essential",
    modal: "could",
    answers: ["could have chosen", "could've chosen", "couldve chosen", "coulda chosen"],
    negative: false
  },
  "20": {
    prompt: "I didn't catch the football when it was thrown to me.",
    verb: "catch",
    highlight: "didn't catch",
    sentence: "I _____ the football.",
    category: "essential",
    modal: "should",
    answers: ["should have caught", "should've caught", "shouldve caught", "shoulda caught"],
    negative: false
  },

  "21": {
    prompt: "I came home too late and missed dinner.",
    verb: "come",
    highlight: "came",
    sentence: "I _____ home earlier.",
    category: "essential",
    modal: "should",
    answers: ["should have come", "should've come", "shouldve come", "shoulda come"],
    negative: false
  },
  "22": {
    prompt: "I didn't go to the meeting, and I missed important news.",
    verb: "go",
    highlight: "didn't go",
    sentence: "I _____ to the meeting.",
    category: "essential",
    modal: "should",
    answers: ["should have gone", "should've gone", "shouldve gone", "shoulda gone"],
    negative: false
  },

  "23": {
    prompt: "I cut my finger because I wasn't paying attention.",
    verb: "cut",
    highlight: "cut",
    sentence: "I _____ more carefully.",
    category: "essential",
    modal: "should",
    answers: ["should have cut", "should've cut", "shouldve cut", "shoulda cut"],
    negative: false
  },
  "24": {
    prompt: "I didn't build the shelf correctly and it collapsed.",
    verb: "build",
    highlight: "didn't build",
    sentence: "I _____ it better.",
    category: "essential",
    modal: "could",
    answers: ["could have built", "could've built", "couldve built", "coulda built"],
    negative: false
  },

  "25": {
    prompt: "I dealt with that situation badly and made it worse.",
    verb: "deal",
    highlight: "dealt",
    sentence: "I _____ with it differently.",
    category: "essential",
    modal: "should",
    answers: ["should have dealt", "should've dealt", "shouldve dealt", "shoulda dealt"],
    negative: false
  },
  "26": {
    prompt: "I didn't keep my promise, and now nobody trusts me.",
    verb: "keep",
    highlight: "didn't keep",
    sentence: "I _____ my promise.",
    category: "essential",
    modal: "should",
    answers: ["should have kept", "should've kept", "shouldve kept", "shoulda kept"],
    negative: false
  },

  "27": {
    prompt: "I dug in the wrong place and didn't find treasure.",
    verb: "dig",
    highlight: "dug",
    sentence: "I _____ somewhere else.",
    category: "essential",
    modal: "should",
    answers: ["should have dug", "should've dug", "shouldve dug", "shoulda dug"],
    negative: false
  },
  "28": {
    prompt: "I didn't draw a plan first, so the project became messy.",
    verb: "draw",
    highlight: "didn't draw",
    sentence: "I _____ a plan first.",
    category: "essential",
    modal: "should",
    answers: ["should have drawn", "should've drawn", "shouldve drawn", "shoulda drawn"],
    negative: false
  },

  "29": {
    prompt: "I drank too quickly and felt sick.",
    verb: "drink",
    highlight: "drank",
    sentence: "I _____ more slowly.",
    category: "essential",
    modal: "should",
    answers: ["should have drunk", "should've drunk", "shouldve drunk", "shoulda drunk"],
    negative: false
  },
  "30": {
    prompt: "I didn't bring a charger, so my phone died.",
    verb: "bring",
    highlight: "didn't bring",
    sentence: "I _____ my charger.",
    category: "essential",
    modal: "should",
    answers: ["should have brought", "should've brought", "shouldve brought", "shoulda brought"],
    negative: false
  },

  "31": {
    prompt: "I ate too much and then I couldn't move.",
    verb: "eat",
    highlight: "ate",
    sentence: "I _____ so much.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have eaten", "should not have eaten", "shouldnt have eaten", "shouldnt ve eaten", "shouldnt've eaten"],
    negative: true
  },
  "32": {
    prompt: "I didn't fight for what I wanted, and I regret it.",
    verb: "fight",
    highlight: "didn't fight",
    sentence: "I _____ for it.",
    category: "essential",
    modal: "could",
    answers: ["could have fought", "could've fought", "couldve fought", "coulda fought"],
    negative: false
  },

  "33": {
    prompt: "I found the answer too late, and failed the exercise.",
    verb: "find",
    highlight: "found",
    sentence: "I _____ the answer sooner.",
    category: "essential",
    modal: "should",
    answers: ["should have found", "should've found", "shouldve found", "shoulda found"],
    negative: false
  },
  "34": {
    prompt: "I didn't freeze the leftovers, and they went bad.",
    verb: "freeze",
    highlight: "didn't freeze",
    sentence: "I _____ them.",
    category: "essential",
    modal: "should",
    answers: ["should have frozen", "should've frozen", "shouldve frozen", "shoulda frozen"],
    negative: false
  },

  "35": {
    prompt: "I forgot to set an alarm and overslept.",
    verb: "set",
    highlight: "to set",
    sentence: "I _____ an alarm.",
    category: "essential",
    modal: "should",
    answers: ["should have set", "should've set", "shouldve set", "shoulda set"],
    negative: false
  },
  "36": {
    prompt: "I didn't get enough money for my services.",
    verb: "get",
    highlight: "didn't get",
    sentence: "I _____ more money.",
    category: "essential",
    modal: "could",
    answers: ["could have got", "could've got", "couldve got", "coulda got", "could have gotten", "could've gotten", "couldve gotten", "coulda gotten"],
    negative: false
  },

  "37": {
    prompt: "I gave up too early and missed a great opportunity.",
    verb: "give",
    highlight: "gave",
    sentence: "I _____ up so early.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have given", "should not have given", "shouldnt have given", "shouldnt ve given", "shouldnt've given"],
    negative: false
  },
  "38": {
    prompt: "I didn't go with you, and now I wish I had.",
    verb: "go",
    highlight: "didn't go",
    sentence: "I _____ with you.",
    category: "essential",
    modal: "should",
    answers: ["should have gone", "should've gone", "shouldve gone", "shoulda gone"],
    negative: false
  },

  "39": {
    prompt: "I grew impatient and said the wrong thing.",
    verb: "grow",
    highlight: "grew",
    sentence: "I _____ impatient.",
    category: "essential",
    modal: "should",
    answers: ["should not have grown", "shouldn't have grown", "shouldnt have grown", "shouldnt ve grown", "shouldnt've grown"],
    negative: true
  },
  "40": {
    prompt: "I didn't have time because I started late.",
    verb: "have",
    highlight: "didnt't have",
    sentence: "I _____ more time.",
    category: "essential",
    modal: "could",
    answers: ["could have had", "could've had", "couldve had", "coulda had"],
    negative: false
  },

  "41": {
    prompt: "I hid the truth and now everything is worse.",
    verb: "hide",
    highlight: "hid",
    sentence: "I _____ the truth.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have hidden", "should not have hidden", "shouldnt have hidden", "shouldnt ve hidden", "shouldnt've hidden"],
    negative: true
  },
  "42": {
    prompt: "I didn't hit save, and I lost my work.",
    verb: "hit",
    highlight: "hit",
    sentence: "I _____ save.",
    category: "essential",
    modal: "could",
    answers: ["should have hit", "should've hit", "shouldve hit", "shoulda hit"],
    negative: false
  },

  "43": {
    prompt: "I held onto the past and couldn't move on.",
    verb: "hold",
    highlight: "held",
    sentence: "I _____ on so tightly to the past.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have held", "should not have held", "shouldnt have held", "shouldnt ve held", "shouldnt've held"],
    negative: true
  },
  "44": {
    prompt: "I didn't know that you're supposed to take your shoes off.",
    verb: "know",
    highlight: "didn't know",
    sentence: "I _____ that cultural difference.",
    category: "essential",
    modal: "should",
    answers: ["should have known", "should've known", "shouldve known", "shoulda known"],
    negative: false
  },

  "45": {
    prompt: "I left the house without my keys and got locked out.",
    verb: "leave",
    highlight: "left",
    sentence: "I _____ without my keys.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have left", "should not have left", "shouldnt have left", "shouldnt ve left", "shouldnt've left"],
    negative: true
  },
  "46": {
    prompt: "I didn't let you explain, and that was unfair.",
    verb: "let",
    highlight: "didn't let",
    sentence: "I _____ you explain.",
    category: "essential",
    modal: "could",
    answers: ["could have let", "could've let", "couldve let", "coulda let"],
    negative: false
  },

  "47": {
    prompt: "I lost my temper and shouted.",
    verb: "lose",
    highlight: "lost",
    sentence: "I _____ my temper.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have lost", "should not have lost", "shouldnt have lost", "shouldn't've lost", "shouldnt've lost"],
    negative: true
  },
  "48": {
    prompt: "I didn't make a backup, so I lost everything.",
    verb: "make",
    highlight: "didn't make",
    sentence: "I _____ a backup.",
    category: "essential",
    modal: "should",
    answers: ["should have made", "should've made", "shouldve made", "shoulda made"],
    negative: false
  },

  "49": {
    prompt: "I meant to hurt him, and that was wrong.",
    verb: "mean",
    highlight: "meant",
    sentence: "I _____ to hurt him.",
    category: "essential",
    modal: "should",
    answers: ["should not have meant", "shouldn't have meant", "shouldnt have meant", "shouldnt ve meant", "shouldnt've meant"],
    negative: true
  },
  "50": {
    prompt: "I didn't meet them when I had the chance, and now I can't.",
    verb: "meet",
    highlight: "didn't meet",
    sentence: "I _____ them earlier.",
    category: "essential",
    modal: "should",
    answers: ["should have met", "should've met", "shouldve met", "shoulda met"],
    negative: false
  },

  "51": {
    prompt: "I put the file in the wrong folder and couldn't find it.",
    verb: "put",
    highlight: "put",
    sentence: "I _____ it there.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have put", "should not have put", "shouldnt have put", "shouldn't've put", "shouldnt've put"],
    negative: true
  },
  "52": {
    prompt: "I didn't read the instructions and made a silly mistake.",
    verb: "read",
    highlight: "didn't read",
    sentence: "I _____ the instructions.",
    category: "essential",
    modal: "could",
    answers: ["could have read", "could've read", "couldve read", "coulda read"],
    negative: false
  },

  "53": {
    prompt: "I rode without a helmet and it was really risky.",
    verb: "ride",
    highlight: "rode",
    sentence: "I _____ without a helmet.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have ridden", "should not have ridden", "shouldnt have ridden", "shouldnt ve ridden", "shouldnt've ridden"],
    negative: true
  },
  "54": {
    prompt: "I didn't ring you back and you waited all day.",
    verb: "ring",
    highlight: "didn't ring",
    sentence: "I _____ you back.",
    category: "essential",
    modal: "could",
    answers: ["could have rung", "could've rung", "couldve rung", "coulda rung"],
    negative: false
  },

  "55": {
    prompt: "I ran before I was healed and re-injured myself.",
    verb: "run",
    highlight: "ran",
    sentence: "I _____ so soon.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have run", "should not have run", "shouldnt have run", "shouldnt ve run", "shouldnt've run"],
    negative: true
  },
  "56": {
    prompt: "I didn't see the warning sign and stepped into danger.",
    verb: "see",
    highlight: "didn't see",
    sentence: "I _____ the warning sign.",
    category: "essential",
    modal: "should",
    answers: ["should have seen", "should've seen", "shouldve seen", "shoulda seen"],
    negative: false
  },

  "57": {
    prompt: "I sold it too soon and now it's worth more.",
    verb: "sell",
    highlight: "sold",
    sentence: "I _____ it so soon.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have sold", "should not have sold", "shouldnt have sold", "shouldnt ve sold", "shouldnt've sold"],
    negative: true
  },
  "58": {
    prompt: "I didn't send the email, so the deadline passed.",
    verb: "send",
    highlight: "didn't send",
    sentence: "I _____ it earlier.",
    category: "essential",
    modal: "should",
    answers: ["should have sent", "should've sent", "shouldve sent", "shoulda sent"],
    negative: false
  },

  "59": {
    prompt: "I set the temperature too high and ruined the food.",
    verb: "set",
    highlight: "set",
    sentence: "I _____ it lower.",
    category: "essential",
    modal: "should",
    answers: ["should have set", "should've set", "shouldve set", "shoulda set"],
    negative: false
  },
  "60": {
    prompt: "I didn't show up, and the team lost because of it.",
    verb: "show",
    highlight: "didn't show",
    sentence: "I _____ up.",
    category: "essential",
    modal: "should",
    answers: ["should have shown", "should've shown", "shouldve shown", "shoulda shown"],
    negative: false
  },

  "61": {
    prompt: "I sang too loudly and embarrassed myself.",
    verb: "sing",
    highlight: "sang",
    sentence: "I _____ so loudly.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have sung", "should not have sung", "shouldnt have sung", "shouldnt ve sung", "shouldnt've sung"],
    negative: true
  },
  "62": {
    prompt: "I didn't sit down when I felt dizzy.",
    verb: "sit",
    highlight: "didn't sit",
    sentence: "I _____ down.",
    category: "essential",
    modal: "could",
    answers: ["could have sat", "could've sat", "couldve sat", "coulda sat"],
    negative: false
  },

  "63": {
    prompt: "I spoke without thinking and caused confusion.",
    verb: "speak",
    highlight: "spoke",
    sentence: "I _____ more carefully.",
    category: "essential",
    modal: "should",
    answers: ["should have spoken", "should've spoken", "shouldve spoken", "shoulda spoken"],
    negative: false
  },
  "64": {
    prompt: "I didn't spend wisely and now I'm in a difficult financial situation.",
    verb: "spend",
    highlight: "didn't spend",
    sentence: "I _____ my money better.",
    category: "essential",
    modal: "could",
    answers: ["could have spent", "could've spent", "couldve spent", "coulda spent"],
    negative: false
  },

  "65": {
    prompt: "I stood too close to the edge and nearly fell.",
    verb: "stand",
    highlight: "stood",
    sentence: "I _____ there.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have stood", "should not have stood", "shouldnt have stood", "shouldn't've stood", "shouldnt've stood"],
    negative: true
  },
  "66": {
    prompt: "I made the children cry by stealing their candy.",
    verb: "steal",
    highlight: "stealing",
    sentence: "I _____ their candy.",
    category: "essential",
    modal: "should",
    answers: ["should not have stolen", "shouldn't have stolen", "shouldnt have stolen", "shouldnt ve stolen", "shouldnt've stolen"],
    negative: true
  },

  "67": {
    prompt: "I stuck with a bad plan for too long.",
    verb: "stick",
    highlight: "stuck",
    sentence: "I _____ with it.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have stuck", "should not have stuck", "shouldnt have stuck", "shouldnt ve stuck", "shouldnt've stuck"],
    negative: true
  },
  "68": {
    prompt: "I didn't swim on vacation, even though I wanted to.",
    verb: "swim",
    highlight: "didn't swim",
    sentence: "I _____ more.",
    category: "essential",
    modal: "could",
    answers: ["could have swum", "could've swum", "couldve swum", "coulda swum"],
    negative: false
  },

  "69": {
    prompt: "I took the wrong turn and wasted an hour.",
    verb: "take",
    highlight: "took",
    sentence: "I _____ that turn.",
    category: "essential",
    modal: "should",
    answers: ["shouldn't have taken", "should not have taken", "shouldnt have taken", "shouldnt ve taken", "shouldnt've taken"],
    negative: true
  },
  "70": {
    prompt: "I didn't teach them the rule clearly, so they stayed confused.",
    verb: "teach",
    highlight: "didn't teach",
    sentence: "I _____ it better.",
    category: "essential",
    modal: "could",
    answers: ["could have taught", "could've taught", "couldve taught", "coulda taught"],
    negative: false
  },

  "71": {
    prompt: "I thought about it too late.",
    verb: "think",
    highlight: "thought",
    sentence: "I _____ about it earlier.",
    category: "essential",
    modal: "should",
    answers: ["should have thought", "should've thought", "shouldve thought", "shoulda thought"],
    negative: false
  },
  "72": {
    prompt: "I didn't throw it away, and now it smells bad.",
    verb: "throw",
    highlight: "didn't throw",
    sentence: "I _____ it away.",
    category: "essential",
    modal: "should",
    answers: ["should have thrown", "should've thrown", "shouldve thrown", "shoulda thrown"],
    negative: false
  },

  "73": {
    prompt: "I misunderstood the instructions and did the wrong task.",
    verb: "understand",
    highlight: "misunderstood",
    sentence: "I _____ the instructions.",
    category: "essential",
    modal: "should",
    answers: ["should have understood", "should've understood", "shouldve understood", "shoulda understood"],
    negative: false
  },
  "74": {
    prompt: "I didn't wake up on time, so I missed my appointment.",
    verb: "wake",
    highlight: "didn't wake",
    sentence: "I _____ earlier.",
    category: "essential",
    modal: "could",
    answers: ["could have woken", "could've woken", "couldve woken", "coulda woken"],
    negative: false
  },

  "75": {
    prompt: "I wore uncomfortable shoes and got blisters.",
    verb: "wear",
    highlight: "wore",
    sentence: "I _____ different shoes.",
    category: "essential",
    modal: "should",
    answers: ["should have worn", "should've worn", "shouldve worn", "shoulda worn"],
    negative: false
  },
"76": {
  prompt: "I didn't win because I didn't practice enough.",
  verb: "win",
  highlight: "didn't win",
  sentence: "I _____ if I'd practiced more.",
  category: "essential",
  modal: "could",
  answers: ["could have won", "could've won", "couldve won", "coulda won"],
  negative: false
},

"77": {
  prompt: "I became impatient and quit too early.",
    verb: "become",
    highlight: "became",
    sentence: "I _____ so impatient.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have become",
      "should not have become",
      "shouldnt have become",
      "shouldn't've become",
      "shouldnt've become"
    ],
    negative: true
  },

  "78": {
    prompt: "I didn't begin earlier, so I ran out of time.",
    verb: "begin",
    highlight: "didn't begin",
    sentence: "I _____ earlier.",
    category: "essential",
    modal: "could",
    answers: [
      "could have begun",
      "could've begun",
      "couldve begun",
      "coulda begun"
    ],
    negative: false
  },

  "79": {
    prompt: "I bent the rules and got in trouble.",
    verb: "bend",
    highlight: "bent",
    sentence: "I _____ the rules.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have bent",
      "should not have bent",
      "shouldnt have bent",
      "shouldn't've bent",
      "shouldnt've bent"
    ],
    negative: true
  },

  "80": {
    prompt: "I didn't break the habit sooner, but I had the chance.",
    verb: "break",
    highlight: "didn't break",
    sentence: "I _____ the habit sooner.",
    category: "essential",
    modal: "could",
    answers: [
      "could have broken",
      "could've broken",
      "couldve broken",
      "coulda broken"
    ],
    negative: false
  },

  "81": {
    prompt: "I forgot to bring snacks and we got hungry.",
    verb: "bring",
    highlight: "to bring",
    sentence: "I _____ snacks.",
    category: "essential",
    modal: "should",
    answers: [
      "should have brought",
      "should've brought",
      "shouldve brought",
      "shoulda brought"
    ],
    negative: false
  },

  "82": {
    prompt: "I didn't build confidence, but I had time to work on it.",
    verb: "build",
    highlight: "didn't build",
    sentence: "I _____ confidence.",
    category: "essential",
    modal: "could",
    answers: [
      "could have built",
      "could've built",
      "couldve built",
      "coulda built"
    ],
    negative: false
  },

  "83": {
    prompt: "I bought it without thinking and regretted it later.",
    verb: "buy",
    highlight: "bought",
    sentence: "I _____ it.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have bought",
      "should not have bought",
      "shouldnt have bought",
      "shouldn't've bought",
      "shouldnt've bought"
    ],
    negative: true
  },

  "84": {
    prompt: "I didn't catch the mistake earlier, but it was visible.",
    verb: "catch",
    highlight: "didn't catch",
    sentence: "I _____ it earlier.",
    category: "essential",
    modal: "could",
    answers: [
      "could have caught",
      "could've caught",
      "couldve caught",
      "coulda caught"
    ],
    negative: false
  },

  "85": {
    prompt: "I chose the expensive option and wasted money.",
    verb: "choose",
    highlight: "chose",
    sentence: "I _____ the cheaper option.",
    category: "essential",
    modal: "should",
    answers: [
      "should have chosen",
      "should've chosen",
      "shouldve chosen",
      "shoulda chosen"
    ],
    negative: false
  },

  "86": {
    prompt: "I didn't come prepared, but I had everything at home.",
    verb: "come",
    highlight: "didn't come",
    sentence: "I _____ prepared.",
    category: "essential",
    modal: "could",
    answers: [
      "could have come",
      "could've come",
      "couldve come",
      "coulda come"
    ],
    negative: false
  },

  "87": {
    prompt: "That plan cost too much.",
    verb: "cost",
    highlight: "cost",
    sentence: "It _____ so much.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have cost",
      "should not have cost",
      "shouldnt have cost",
      "shouldn't ve cost",
      "shouldnt ve cost"
    ],
    negative: true
  },

  "88": {
    prompt: "I cut the paper like a preschooler.",
    verb: "cut",
    highlight: "cut",
    sentence: "I _____ it more carefully.",
    category: "essential",
    modal: "could",
    answers: [
      "could have cut",
      "could've cut",
      "couldve cut",
      "coulda cut"
    ],
    negative: false
  },

  "89": {
    prompt: "I dealt with it emotionally and made it worse.",
    verb: "deal",
    highlight: "dealt",
    sentence: "I _____ with it calmly.",
    category: "essential",
    modal: "should",
    answers: [
      "should have dealt",
      "should've dealt",
      "shouldve dealt",
      "shoulda dealt"
    ],
    negative: false
  },

  "90": {
    prompt: "I didn't dig deeper, but the answer was there.",
    verb: "dig",
    highlight: "didn't dig",
    sentence: "I _____ deeper.",
    category: "essential",
    modal: "could",
    answers: [
      "could have dug",
      "could've dug",
      "couldve dug",
      "coulda dug"
    ],
    negative: false
  },

  "91": {
    prompt: "I did it without checking and made errors.",
    verb: "do",
    highlight: "did",
    sentence: "I _____ it more carefully.",
    category: "essential",
    modal: "should",
    answers: [
      "should have done",
      "should've done",
      "shouldve done",
      "shoulda done"
    ],
    negative: false
  },

  "92": {
    prompt: "I didn't draw a diagram, but it would have helped.",
    verb: "draw",
    highlight: "didn't draw",
    sentence: "I _____ a diagram.",
    category: "essential",
    modal: "could",
    answers: [
      "could have drawn",
      "could've drawn",
      "couldve drawn",
      "coulda drawn"
    ],
    negative: false
  },

  "93": {
    prompt: "I drank water too late and got a headache.",
    verb: "drink",
    highlight: "drank",
    sentence: "I _____ earlier.",
    category: "essential",
    modal: "should",
    answers: [
      "should have drunk",
      "should've drunk",
      "shouldve drunk",
      "shoulda drunk"
    ],
    negative: false
  },

  "94": {
    prompt: "I didn't drive carefully, but I had enough time.",
    verb: "drive",
    highlight: "didn't drive",
    sentence: "I _____ more carefully.",
    category: "essential",
    modal: "could",
    answers: [
      "could have driven",
      "could've driven",
      "couldve driven",
      "coulda driven"
    ],
    negative: false
  },

  "95": {
    prompt: "I ate junk food and felt terrible.",
    verb: "eat",
    highlight: "ate",
    sentence: "I _____ junk food.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have eaten",
      "should not have eaten",
      "shouldnt have eaten",
      "shouldnt ve eaten",
      "shouldnt've eaten"
    ],
    negative: true
  },

  "96": {
    prompt: "I fell in love. Bad news for my studies.",
    verb: "fall",
    highlight: "fell",
    sentence: "I _____ in love. Bad news for my studies.",
    category: "essential",
    modal: "should",
    answers: [
      "should not have fallen",
      "should not've fallen",
      "shouldnt have fallen",
      "shouldnt've fallen"
    ],
    negative: true
  },

  "97": {
    prompt: "I felt angry and reacted badly.",
    verb: "feel",
    highlight: "felt",
    sentence: "I _____ calmer.",
    category: "essential",
    modal: "should",
    answers: [
      "should have felt",
      "should've felt",
      "shouldve felt",
      "shoulda felt"
    ],
    negative: false
  },

  "98": {
    prompt: "I didn't fight back, but I had a chance.",
    verb: "fight",
    highlight: "didn't fight",
    sentence: "I _____ back.",
    category: "essential",
    modal: "could",
    answers: [
      "could have fought",
      "could've fought",
      "couldve fought",
      "coulda fought"
    ],
    negative: false
  },

  "99": {
    prompt: "I found out too late, and it shocked me.",
    verb: "find",
    highlight: "found",
    sentence: "I _____ out earlier.",
    category: "essential",
    modal: "should",
    answers: [
      "should have found",
      "should've found",
      "shouldve found",
      "shoulda found"
    ],
    negative: false
  },

  "100": {
    prompt: "I didn't fly earlier and lost a day of my trip.",
    verb: "fly",
    highlight: "didn't fly",
    sentence: "I _____ earlier.",
    category: "essential",
    modal: "could",
    answers: [
      "could have flown",
      "could've flown",
      "couldve flown",
      "coulda flown"
    ],
    negative: false
  },
"101": {
    prompt: "I forgot the appointment and felt embarrassed.",
    verb: "forget",
    highlight: "forgot",
    sentence: "I _____ the appointment.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have forgotten",
      "should not have forgotten",
      "shouldnt have forgotten",
      "shouldn't ve forgotten",
      "shouldnt ve forgotten"
    ],
    negative: true
  },

  "102": {
    prompt: "I didn't freeze the meat, but I had room in the freezer.",
    verb: "freeze",
    highlight: "didn't freeze",
    sentence: "I _____ it.",
    category: "essential",
    modal: "could",
    answers: [
      "could have frozen",
      "could've frozen",
      "couldve frozen",
      "coulda frozen"
    ],
    negative: false
  },

  "103": {
    prompt: "I got angry and ruined the moment.",
    verb: "get",
    highlight: "got",
    sentence: "I _____ so angry.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have got",
      "should not have got",
      "shouldnt have got",
      "shouldn't've got",
      "shouldnt've got",
      "shouldn't have got",
      "should not have gotten",
      "shouldnt have gotten",
      "shouldn't ve gotten",
      "shouldnt ve gotten"
    ],
    negative: true
  },

  "104": {
    prompt: "I didn't give them a warning.",
    verb: "give",
    highlight: "didn't give",
    sentence: "I _____ them a warning.",
    category: "essential",
    modal: "could",
    answers: [
      "could have given",
      "could've given",
      "couldve given",
      "coulda given"
    ],
    negative: false
  },

  "105": {
    prompt: "I went out in terrible weather.",
    verb: "go",
    highlight: "went",
    sentence: "I _____ in that weather.",
    category: "essential",
    modal: "should",
    answers: [
      "should not have gone",
      "shouldn't have gone",
      "shouldn't ve gone",
      "shouldnt ve gone"
    ],
    negative: true
  },

  "106": {
    prompt: "I didn't grow my social skills in school.",
    verb: "grow",
    highlight: "didn't grow",
    sentence: "I _____ my skills.",
    category: "essential",
    modal: "could",
    answers: [
      "could have grown",
      "could've grown",
      "couldve grown",
      "coulda grown"
    ],
    negative: false
  },

  "107": {
    prompt: "I didn't have enough time to do the project.",
    verb: "have",
    highlight: "didn't have",
    sentence: "I _____ more time.",
    category: "essential",
    modal: "should",
    answers: [
      "should have had",
      "should've had",
      "shouldve had",
      "shoulda had"
    ],
    negative: false
  },

  "108": {
    prompt: "I didn't hear the key point.",
    verb: "hear",
    highlight: "didn't hear",
    sentence: "I _____ it.",
    category: "essential",
    modal: "should",
    answers: [
      "should have heard",
      "should've heard",
      "shouldve heard",
      "shoulda heard"
    ],
    negative: false
  },

  "109": {
    prompt: "I hid the truth and caused mistrust.",
    verb: "hide",
    highlight: "hid",
    sentence: "I _____ the truth.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have hidden",
      "should not have hidden",
      "shouldnt have hidden",
      "shouldn't've hidden",
      "shouldnt've hidden"
    ],
    negative: true
  },

  "110": {
    prompt: "I didn't hit the brakes in time to stop the car.",
    verb: "hit",
    highlight: "didn't hit",
    sentence: "I _____ the brakes sooner.",
    category: "essential",
    modal: "should",
    answers: [
      "should have hit",
      "should've hit",
      "shouldve hit",
      "shoulda hit"
    ],
    negative: false
  },

  "111": {
    prompt: "I held back my opinion and regretted it.",
    verb: "hold",
    highlight: "held",
    sentence: "I _____ back my opinion.",
    category: "essential",
    modal: "should",
    answers: [
      "should not have held",
      "shouldn't have held",
      "shouldn't ve held",
      "shouldnt have held"
    ],
    negative: true
  },

  "112": {
    prompt: "I didn't keep notes.",
    verb: "keep",
    highlight: "didn't keep",
    sentence: "I _____ notes.",
    category: "essential",
    modal: "could",
    answers: [
      "could have kept",
      "could've kept",
      "couldve kept",
      "coulda kept"
    ],
    negative: false
  },

  "113": {
    prompt: "I didn't know about the exam.",
    verb: "know",
    highlight: "didn't know",
    sentence: "I _____ that there would be an exam.",
    category: "essential",
    modal: "should",
    answers: [
      "should have known",
      "should've known",
      "shouldve known",
      "shoulda known"
    ],
    negative: false
  },

  "114": {
    prompt: "I didn't lead the team with a clear vision.",
    verb: "lead",
    highlight: "didn't lead",
    sentence: "I _____ better.",
    category: "essential",
    modal: "could",
    answers: [
      "could have led",
      "could've led",
      "couldve led",
      "coulda led"
    ],
    negative: false
  },

  "115": {
    prompt: "I left my bag on the train and lost it.",
    verb: "leave",
    highlight: "left",
    sentence: "I _____ it there.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have left",
      "should not have left",
      "shouldnt have left",
      "shouldn't ve left",
      "shouldnt ve left"
    ],
    negative: true
  },

  "116": {
    prompt: "I didn't let them finish speaking, but I should have.",
    verb: "let",
    highlight: "didn't let",
    sentence: "I _____ them finish.",
    category: "essential",
    modal: "could",
    answers: [
      "could have let",
      "could've let",
      "couldve let",
      "coulda let"
    ],
    negative: false
  },

  "117": {
    prompt: "I lost the receipt and couldn't return the item.",
    verb: "lose",
    highlight: "lost",
    sentence: "I _____ the receipt.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have lost",
      "should not have lost",
      "shouldnt have lost",
      "shouldn't've lost",
      "shouldnt've lost"
    ],
    negative: true
  },

  "118": {
    prompt: "I didn't make time for it, but I could have.",
    verb: "make",
    highlight: "didn't make",
    sentence: "I _____ time.",
    category: "essential",
    modal: "could",
    answers: [
      "could have made",
      "could've made",
      "couldve made",
      "coulda made"
    ],
    negative: false
  },

  "119": {
    prompt: "The knee injury didn't mean the end of his career, but he was never as good again.",
    verb: "mean",
    highlight: "didn't mean",
    sentence: "I _____ the end.",
    category: "advanced",
    modal: "should",
    answers: [
      "should have meant",
      "should've meant",
      "shouldve meant",
      "shoulda meant"
    ],
    negative: false
  },

  "120": {
    prompt: "I didn't meet the deadline, even though I had enough time.",
    verb: "meet",
    highlight: "didn't meet",
    sentence: "I _____ the deadline.",
    category: "essential",
    modal: "should",
    answers: [
      "should have met",
      "should've met",
      "shouldve met",
      "shoulda met"
    ],
    negative: false
  },

  "121": {
    prompt: "I paid without checking the bill and got overcharged.",
    verb: "check",
    highlight: "checking",
    sentence: "I _____ the bill first.",
    category: "essential",
    modal: "should",
    answers: [
      "should have checked",
      "should've checked",
      "shouldve checked",
      "shoulda checked"
    ],
    negative: false
  },

  "122": {
    prompt: "I didn't put it in the right place.",
    verb: "put",
    highlight: "didn't put",
    sentence: "I _____ it away.",
    category: "essential",
    modal: "could",
    answers: [
      "could have put",
      "could've put",
      "couldve put",
      "coulda put"
    ],
    negative: false
  },

  "123": {
    prompt: "I read the message too late.",
    verb: "read",
    highlight: "read",
    sentence: "I _____ it sooner.",
    category: "essential",
    modal: "should",
    answers: [
      "should have read",
      "should've read",
      "shouldve read",
      "shoulda read"
    ],
    negative: false
  },

  "124": {
    prompt: "I didn't ride my bike all summer.",
    verb: "ride",
    highlight: "didn't ride",
    sentence: "I _____ a few times, at least.",
    category: "essential",
    modal: "could",
    answers: [
      "could have ridden",
      "could've ridden",
      "couldve ridden",
      "coulda ridden"
    ],
    negative: false
  },

  "125": {
    prompt: "I rang you at the worst time and interrupted.",
    verb: "ring",
    highlight: "rang",
    sentence: "I _____ you then.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have rung",
      "should not have rung",
      "shouldnt have rung",
      "shouldn't ve rung",
      "shouldnt ve rung"
    ],
    negative: true
  },

  "126": {
    prompt: "I didn't run a final check, and it broke.",
    verb: "run",
    highlight: "didn't run",
    sentence: "I _____ one more check.",
    category: "essential",
    modal: "could",
    answers: [
      "could have run",
      "could've run",
      "couldve run",
      "coulda run"
    ],
    negative: false
  },

  "127": {
    prompt: "I said yes too quickly and regretted it.",
    verb: "say",
    highlight: "said",
    sentence: "I _____ yes so quickly.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have said",
      "should not have said",
      "shouldnt have said",
      "shouldn't ve said",
      "shouldnt ve said"
    ],
    negative: true
  },

  "128": {
    prompt: "I didn't see the second half of the film.",
    verb: "see",
    highlight: "didn't see",
    sentence: "I _____ it.",
    category: "essential",
    modal: "could",
    answers: [
      "could have seen",
      "could've seen",
      "couldve seen",
      "coulda seen"
    ],
    negative: false
  },

  "129": {
    prompt: "I sold my bike and now I miss it.",
    verb: "sell",
    highlight: "sold",
    sentence: "I _____ it.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have sold",
      "should not have sold",
      "shouldnt have sold",
      "shouldn't ve sold",
      "shouldnt ve sold"
    ],
    negative: true
  },

  "130": {
    prompt: "I don't know why I didn't send the job application.",
    verb: "send",
    highlight: "didn't send",
    sentence: "I _____ it.",
    category: "essential",
    modal: "could",
    answers: [
      "could have sent",
      "could've sent",
      "couldve sent",
      "coulda sent"
    ],
    negative: false
  },

  "131": {
    prompt: "I set the meeting for the wrong day.",
    verb: "set",
    highlight: "set",
    sentence: "I _____ it for Friday.",
    category: "essential",
    modal: "should",
    answers: [
      "should have set",
      "should've set",
      "shouldve set",
      "shoulda set"
    ],
    negative: false
  },

  "132": {
    prompt: "I didn't show the document.",
    verb: "show",
    highlight: "didn't show",
    sentence: "I _____ it.",
    category: "essential",
    modal: "could",
    answers: [
      "could have shown",
      "could've shown",
      "couldve shown",
      "coulda shown"
    ],
    negative: false
  },

  "133": {
    prompt: "I sang karaoke in front of the girl I like.",
    verb: "sing",
    highlight: "sang",
    sentence: "I _____ in front of her.",
    category: "essential",
    modal: "should",
    answers: [
      "should not have sung",
      "shouldn't have sung",
      "shouldnt have sung",
      "shouldnt ve sung"
    ],
    negative: true
  },

  "134": {
    prompt: "I didn't sit close enough to see.",
    verb: "sit",
    highlight: "didn't sit",
    sentence: "I _____ closer.",
    category: "essential",
    modal: "could",
    answers: [
      "could have sat",
      "could've sat",
      "couldve sat",
      "coulda sat"
    ],
    negative: false
  },

  "135": {
    prompt: "I slept in and missed the sunrise.",
    verb: "sleep",
    highlight: "slept",
    sentence: "I _____ in.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have slept",
      "should not have slept",
      "shouldnt have slept",
      "shouldn't ve slept",
      "shouldnt ve slept"
    ],
    negative: true
  },

  "136": {
    prompt: "I didn't speak up, but my idea was good.",
    verb: "speak",
    highlight: "didn't speak",
    sentence: "I _____ up.",
    category: "essential",
    modal: "could",
    answers: [
      "could have spoken",
      "could've spoken",
      "couldve spoken",
      "coulda spoken"
    ],
    negative: false
  },

  "137": {
    prompt: "I spent too much and now I'm stressed.",
    verb: "spend",
    highlight: "spent",
    sentence: "I _____ so much.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have spent",
      "should not have spent",
      "shouldnt have spent",
      "shouldn't ve spent",
      "shouldnt ve spent"
    ],
    negative: true
  },

  "138": {
    prompt: "I didn't stand up to volunteer.",
    verb: "stand",
    highlight: "didn't stand",
    sentence: "I _____ up.",
    category: "essential",
    modal: "could",
    answers: [
      "could have stood",
      "could've stood",
      "couldve stood",
      "coulda stood"
    ],
    negative: false
  },

  "139": {
    prompt: "I stole my friend's business idea.",
    verb: "steal",
    highlight: "stole",
    sentence: "I _____ his idea.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have stolen",
      "should not have stolen",
      "shouldnt have stolen",
      "shouldn't ve stolen",
      "shouldnt ve stolen"
    ],
    negative: true
  },

  "140": {
    prompt: "I didn't stick to the schedule.",
    verb: "stick",
    highlight: "didn't stick",
    sentence: "I _____ to the schedule.",
    category: "advanced",
    modal: "should",
    answers: [
      "should have stuck",
      "should've stuck",
      "shouldve stuck",
      "shoulda stuck"
    ],
    negative: false
  },

  "141": {
    prompt: "I swam right after eating and felt sick.",
    verb: "swim",
    highlight: "swam",
    sentence: "I _____ right after eating.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have swum",
      "should not have swum",
      "shouldnt have swum",
      "shouldn't ve swum",
      "shouldnt ve swum"
    ],
    negative: true
  },

"142": {
  prompt: "I didn't take notes.",
  verb: "take",
  highlight: "didn't take",
  sentence: "I _____ notes.",
  category: "essential",
  modal: "could",
  answers: [
    "could have taken",
    "could've taken",
    "couldve taken",
    "coulda taken"
  ],
  negative: false
},

"143": {
  prompt: "I taught the wrong method and confused them.",
    verb: "teach",
    highlight: "taught",
    sentence: "I _____ the right method.",
    category: "essential",
    modal: "should",
    answers: [
      "should have taught",
      "should've taught",
      "shouldve taught",
      "shoulda taught"
    ],
    negative: false
  },

  "144": {
    prompt: "I didn't tell the truth.",
    verb: "tell",
    highlight: "didn't tell",
    sentence: "I _____ the truth.",
    category: "essential",
    modal: "could",
    answers: [
      "could have told",
      "could've told",
      "couldve told",
      "coulda told"
    ],
    negative: false
  },

  "145": {
    prompt: "I thought about it too late and missed my chance.",
    verb: "think",
    highlight: "thought",
    sentence: "I _____ earlier.",
    category: "essential",
    modal: "should",
    answers: [
      "should have thought",
      "should've thought",
      "shouldve thought",
      "shoulda thought"
    ],
    negative: false
  },

  "146": {
    prompt: "I didn't throw out the trash.",
    verb: "throw",
    highlight: "didn't throw",
    sentence: "I _____ it out yesterday.",
    category: "essential",
    modal: "could",
    answers: [
      "could have thrown",
      "could've thrown",
      "couldve thrown",
      "coulda thrown"
    ],
    negative: false
  },

  "147": {
    prompt: "I understood the problem too late.",
    verb: "understand",
    highlight: "understood",
    sentence: "I _____ sooner.",
    category: "essential",
    modal: "should",
    answers: [
      "should have understood",
      "should've understood",
      "shouldve understood",
      "shoulda understood"
    ],
    negative: false
  },

  "148": {
    prompt: "I didn't wake up early enough.",
    verb: "wake",
    highlight: "didn't wake",
    sentence: "I _____ earlier.",
    category: "essential",
    modal: "could",
    answers: [
      "could have woken",
      "could've woken",
      "couldve woken",
      "coulda woken"
    ],
    negative: false
  },

  "149": {
    prompt: "I wore something too casual and felt awkward.",
    verb: "wear",
    highlight: "wore",
    sentence: "I _____ something smarter.",
    category: "essential",
    modal: "should",
    answers: [
      "should have worn",
      "should've worn",
      "shouldve worn",
      "shoulda worn"
    ],
    negative: false
  },

"150": {
  prompt: "I didn't win because I stopped trying too early.",
  verb: "win",
  highlight: "didn't win",
  sentence: "I _____ if I'd kept trying.",
  category: "essential",
  modal: "could",
  answers: [
    "could have won",
    "could've won",
    "couldve won",
    "coulda won"
  ],
  negative: false
},

"151": {
  prompt: "I wrote the password down in the wrong place.",
    verb: "write",
    highlight: "wrote",
    sentence: "I _____ it somewhere safer.",
    category: "essential",
    modal: "should",
    answers: [
      "should have written",
      "should've written",
      "shouldve written",
      "shoulda written"
    ],
    negative: false
  },

  "152": {
    prompt: "I didn't begin the assignment on time.",
    verb: "begin",
    highlight: "didn't begin",
    sentence: "I _____ earlier.",
    category: "essential",
    modal: "could",
    answers: [
      "could have begun",
      "could've begun",
      "couldve begun",
      "coulda begun"
    ],
    negative: false
  },

  "153": {
    prompt: "I fought with my friend over something small.",
    verb: "fight",
    highlight: "fought",
    sentence: "I _____ about it.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have fought",
      "should not have fought",
      "shouldnt have fought",
      "shouldn't've fought",
      "shouldnt've fought"
    ],
    negative: true
  },

  "154": {
    prompt: "I didn't keep the receipt.",
    verb: "keep",
    highlight: "didn't keep",
    sentence: "I _____ it.",
    category: "essential",
    modal: "should",
    answers: [
      "should have kept",
      "should've kept",
      "shouldve kept",
      "shoulda kept"
    ],
    negative: false
  },

  "155": {
    prompt: "I chose without thinking and regretted it immediately.",
    verb: "choose",
    highlight: "chose",
    sentence: "I _____ more carefully.",
    category: "essential",
    modal: "should",
    answers: [
      "should have chosen",
      "should've chosen",
      "shouldve chosen",
      "shoulda chosen"
    ],
    negative: false
  },

  "156": {
    prompt: "I didn't see the opportunity, but it was right there.",
    verb: "see",
    highlight: "didn't see",
    sentence: "I _____ it.",
    category: "essential",
    modal: "should",
    answers: [
      "should have seen",
      "should've seen",
      "shouldve seen",
      "shoulda seen"
    ],
    negative: false
  },

  "157": {
    prompt: "I sent it to the wrong person by mistake.",
    verb: "send",
    highlight: "sent",
    sentence: "I _____ it to them.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have sent",
      "should not have sent",
      "shouldnt have sent",
      "shouldn't've sent",
      "shouldnt've sent"
    ],
    negative: true
  },

  "158": {
    prompt: "I didn't bring an umbrella for my girlfriend.",
    verb: "bring",
    highlight: "didn't bring",
    sentence: "I _____ an umbrella for her.",
    category: "essential",
    modal: "could",
    answers: [
      "could have brought",
      "could've brought",
      "couldve brought",
      "coulda brought"
    ],
    negative: false
  },

  "159": {
    prompt: "I promised something I didn't really mean.",
    verb: "mean",
    highlight: "mean",
    sentence: "I _____ what I promised.",
    category: "essential",
    modal: "should",
    answers: [
      "should have meant",
      "should've meant",
      "shouldve meant",
      "shoulda meant"
    ],
    negative: false
  },

  "160": {
    prompt: "I broke the promise.",
    verb: "break",
    highlight: "broke",
    sentence: "I _____ my promise.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have broken",
      "should not have broken",
      "shouldnt have broken",
      "shouldn't ve broken",
      "shouldnt ve broken"
    ],
    negative: true
  },

  "161": {
    prompt: "I didn't catch the bus because I stopped to tie my laces.",
    verb: "catch",
    highlight: "didn't catch",
    sentence: "I _____ the bus.",
    category: "essential",
    modal: "could",
    answers: [
      "could have caught",
      "could've caught",
      "couldve caught",
      "coulda caught"
    ],
    negative: false
  },

  "162": {
    prompt: "I drank too much coffee and couldn't sleep.",
    verb: "drink",
    highlight: "drank",
    sentence: "I _____ so much coffee.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have drunk",
      "should not have drunk",
      "shouldnt have drunk",
      "shouldn't've drunk",
      "shouldnt've drunk"
    ],
    negative: true
  },

  "163": {
    prompt: "I drove too fast even though the road was icy.",
    verb: "drive",
    highlight: "drove",
    sentence: "I _____ more carefully.",
    category: "essential",
    modal: "should",
    answers: [
      "should have driven",
      "should've driven",
      "shouldve driven",
      "shoulda driven"
    ],
    negative: false
  },

  "164": {
    prompt: "I fed Rufus late and he got upset.",
    verb: "feed",
    highlight: "fed",
    sentence: "I _____ him earlier.",
    category: "advanced",
    modal: "should",
    answers: [
      "should have fed",
      "should've fed",
      "shouldve fed",
      "shoulda fed"
    ],
    negative: false
  },

  "165": {
    prompt: "I forgot to send the message even though it was important.",
    verb: "forget",
    highlight: "forgot",
    sentence: "I _____ the message.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have forgotten",
      "should not have forgotten",
      "shouldnt have forgotten",
      "shouldn't ve forgotten",
      "shouldnt ve forgotten"
    ],
    negative: true
  },

  "166": {
    prompt: "I grew impatient and interrupted them.",
    verb: "grow",
    highlight: "grew",
    sentence: "I _____ impatient.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have grown",
      "should not have grown",
      "shouldnt have grown",
      "shouldn't ve grown",
      "shouldnt ve grown"
    ],
    negative: true
  },

  "167": {
    prompt: "I hid the truth even though they trusted me.",
    verb: "hide",
    highlight: "hid",
    sentence: "I _____ the truth.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have hidden",
      "should not have hidden",
      "shouldnt have hidden",
      "shouldn't ve hidden",
      "shouldnt ve hidden"
    ],
    negative: true
  },

  "168": {
    prompt: "I kept quiet, but I could have spoken up.",
    verb: "keep",
    highlight: "kept",
    sentence: "I _____ up.",
    category: "essential",
    modal: "could",
    answers: [
      "could have spoken",
      "could've spoken",
      "couldve spoken",
      "coulda spoken"
    ],
    negative: false
  },

  "169": {
    prompt: "I let the chance slip away.",
    verb: "let",
    highlight: "let",
    sentence: "I _____ the chance.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have let",
      "should not have let",
      "shouldnt have let",
      "shouldn't ve let",
      "shouldnt ve let"
    ],
    negative: true
  },

  "170": {
    prompt: "I never met the customer in person.",
    verb: "meet",
    highlight: "met",
    sentence: "I _____ the customer in person.",
    category: "essential",
    modal: "could",
    answers: [
      "could have met",
      "could've met",
      "couldve met",
      "coulda met"
    ],
    negative: false
  },

  "171": {
    prompt: "I paid too much because I didn't compare prices.",
    verb: "pay",
    highlight: "paid",
    sentence: "I _____ less.",
    category: "essential",
    modal: "could",
    answers: [
      "could have paid",
      "could've paid",
      "couldve paid",
      "coulda paid"
    ],
    negative: false
  },

  "172": {
    prompt: "I read the instructions too quickly and misunderstood them.",
    verb: "read",
    highlight: "read",
    sentence: "I _____ more carefully.",
    category: "essential",
    modal: "should",
    answers: [
      "should have read",
      "should've read",
      "shouldve read",
      "shoulda read"
    ],
    negative: false
  },

  "173": {
    prompt: "I ran ahead without checking if they were safe.",
    verb: "run",
    highlight: "ran",
    sentence: "I _____ ahead.",
    category: "essential",
    modal: "should",
    answers: [
      "shouldn't have run",
      "should not have run",
      "shouldnt have run",
      "shouldn't ve run",
      "shouldnt ve run"
    ],
    negative: true
  },

  "174": {
    prompt: "I said nothing even though I had something important to add.",
    verb: "say",
    highlight: "said",
    sentence: "I _____ something.",
    category: "essential",
    modal: "should",
    answers: [
      "should have said",
      "should've said",
      "shouldve said",
      "shoulda said"
    ],
    negative: false
  },

  "175": {
    prompt: "I saw the mistake but didn't correct it.",
    verb: "correct",
    highlight: "didn't correct",
    sentence: "I _____ it.",
    category: "essential",
    modal: "should",
    answers: [
      "should have corrected",
      "should've corrected",
      "shouldve corrected",
      "shoulda corrected"
    ],
    negative: false
  },

  "176": {
    prompt: "I laid the blame on others instead of myself.",
    verb: "lay",
    highlight: "laid",
    sentence: "I _____ the blame elsewhere.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have laid",
      "should not have laid",
      "shouldnt have laid",
      "shouldn't ve laid",
      "shouldnt ve laid"
    ],
    negative: true
  },

  "177": {
    prompt: "I spread the rumor.",
    verb: "spread",
    highlight: "spread",
    sentence: "I _____ it.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have spread",
      "should not have spread",
      "shouldnt have spread",
      "shouldn't ve spread",
      "shouldnt ve spread"
    ],
    negative: true
  },

  "178": {
    prompt: "I stank of alcohol during the interview.",
    verb: "stink",
    highlight: "stank",
    sentence: "I _____ of alcohol.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have stunk",
      "should not have stunk",
      "shouldnt have stunk",
      "shouldn't ve stunk",
      "shouldnt ve stunk"
    ],
    negative: true
  },

  "179": {
    prompt: "I struck the wrong tone in my email.",
    verb: "strike",
    highlight: "struck",
    sentence: "I _____ a different tone.",
    category: "advanced",
    modal: "could",
    answers: [
      "could have struck",
      "could've struck",
      "couldve struck",
      "coulda struck"
    ],
    negative: false
  },

  "180": {
    prompt: "I lied about the situation, and it made things worse.",
    verb: "lie",
    highlight: "lied",
    sentence: "I _____ the truth.",
    category: "advanced",
    modal: "should",
    answers: [
      "should have lain",
      "should've lain",
      "shouldve lain",
      "shoulda lain"
    ],
    negative: false
  },

  "181": {
    prompt: "I beat myself up over a small mistake.",
    verb: "beat",
    highlight: "beat",
    sentence: "I _____ myself up over it.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have beaten",
      "should not have beaten",
      "shouldnt have beaten",
      "shouldn't ve beaten",
      "shouldnt ve beaten"
    ],
    negative: true
  },

  "182": {
    prompt: "I bet all my savings and lost everything.",
    verb: "bet",
    highlight: "bet",
    sentence: "I _____ all my savings.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have bet",
      "should not have bet",
      "shouldnt have bet",
      "shouldn't ve bet",
      "shouldnt ve bet"
    ],
    negative: true
  },

  "183": {
    prompt: "I bled through my shirt because I ignored the injury.",
    verb: "bleed",
    highlight: "bled",
    sentence: "I _____ the injury sooner.",
    category: "advanced",
    modal: "should",
    answers: [
      "should have treated",
      "should've treated",
      "shouldve treated",
      "shoulda treated"
    ],
    negative: false
  },

  "184": {
    prompt: "I blew my chance by arriving late.",
    verb: "blow",
    highlight: "blew",
    sentence: "I _____ my chance.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have blown",
      "should not have blown",
      "shouldnt have blown",
      "shouldn't ve blown",
      "shouldnt ve blown"
    ],
    negative: true
  },

  "185": {
    prompt: "I broadcast the news before confirming it.",
    verb: "broadcast",
    highlight: "broadcast",
    sentence: "I _____ it so quickly.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have broadcast",
      "should not have broadcast",
      "shouldnt have broadcast",
      "shouldn't ve broadcast",
      "shouldnt ve broadcast"
    ],
    negative: true
  },

  "186": {
    prompt: "I cast doubt on the plan without offering solutions.",
    verb: "cast",
    highlight: "cast",
    sentence: "I _____ doubt without helping.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have cast",
      "should not have cast",
      "shouldnt have cast",
      "shouldn't ve cast",
      "shouldnt ve cast"
    ],
    negative: true
  },

  "187": {
    prompt: "I crept away instead of explaining myself.",
    verb: "creep",
    highlight: "crept",
    sentence: "I _____ away like that.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have crept",
      "should not have crept",
      "shouldnt have crept",
      "shouldn't ve crept",
      "shouldnt ve crept"
    ],
    negative: true
  },

  "188": {
    prompt: "I fed the wrong information into the system.",
    verb: "feed",
    highlight: "fed",
    sentence: "I _____ it incorrect data.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have fed",
      "should not have fed",
      "shouldnt have fed",
      "shouldn't ve fed",
      "shouldnt ve fed"
    ],
    negative: true
  },

  "189": {
    prompt: "I foretold disaster without evidence.",
    verb: "foretell",
    highlight: "foretold",
    sentence: "I _____ such an outcome.",
    category: "advanced",
    modal: "could",
    answers: [
      "could have foretold",
      "could've foretold",
      "couldve foretold",
      "coulda foretold"
    ],
    negative: false
  },

  "190": {
    prompt: "I ground the coffee too finely and ruined it.",
    verb: "grind",
    highlight: "ground",
    sentence: "I _____ it so finely.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have ground",
      "should not have ground",
      "shouldnt have ground",
      "shouldn't ve ground",
      "shouldnt ve ground"
    ],
    negative: true
  },

  "191": {
    prompt: "I hurt his feelings without meaning to.",
    verb: "hurt",
    highlight: "hurt",
    sentence: "I _____ his feelings.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have hurt",
      "should not have hurt",
      "shouldnt have hurt",
      "shouldn't ve hurt",
      "shouldnt ve hurt"
    ],
    negative: true
  },

  "192": {
    prompt: "I lent money without setting conditions.",
    verb: "lend",
    highlight: "lent",
    sentence: "I _____ the money more carefully.",
    category: "advanced",
    modal: "could",
    answers: [
      "could have lent",
      "could've lent",
      "couldve lent",
      "coulda lent"
    ],
    negative: false
  },

  "193": {
    prompt: "I offset the loss by cutting corners.",
    verb: "offset",
    highlight: "offset",
    sentence: "I _____ the loss that way.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have offset",
      "should not have offset",
      "shouldnt have offset",
      "shouldn't ve offset",
      "shouldnt ve offset"
    ],
    negative: true
  },

  "194": {
    prompt: "I rang him too late, and he was already asleep.",
    verb: "ring",
    highlight: "rang",
    sentence: "I _____ him earlier.",
    category: "advanced",
    modal: "could",
    answers: [
      "could have rung",
      "could've rung",
      "couldve rung",
      "coulda rung"
    ],
    negative: false
  },

  "195": {
    prompt: "I shook his confidence by criticizing him publicly.",
    verb: "shake",
    highlight: "shook",
    sentence: "I _____ his confidence.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have shaken",
      "should not have shaken",
      "shouldnt have shaken",
      "shouldn't ve shaken",
      "shouldnt ve shaken"
    ],
    negative: true
  },

  "196": {
    prompt: "I shed responsibility instead of owning my mistake.",
    verb: "shed",
    highlight: "shed",
    sentence: "I _____ responsibility.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have shed",
      "should not have shed",
      "shouldnt have shed",
      "shouldn't ve shed",
      "shouldnt ve shed"
    ],
    negative: true
  },

  "197": {
    prompt: "I shot down the idea too quickly.",
    verb: "shoot",
    highlight: "shot",
    sentence: "I _____ it down so quickly.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have shot",
      "should not have shot",
      "shouldnt have shot",
      "shouldn't ve shot",
      "shouldnt ve shot"
    ],
    negative: true
  },

  "198": {
    prompt: "I shrank from the challenge instead of trying.",
    verb: "shrink",
    highlight: "shrank",
    sentence: "I _____ from the challenge.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have shrunk",
      "should not have shrunk",
      "shouldnt have shrunk",
      "shouldn't ve shrunk",
      "shouldnt ve shrunk"
    ],
    negative: true
  },

  "199": {
    prompt: "I shut the computer down during the installation.",
    verb: "shut",
    highlight: "shut",
    sentence: "I _____ it down.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have shut",
      "should not have shut",
      "shouldnt have shut",
      "shouldn't ve shut",
      "shouldnt ve shut"
    ],
    negative: true
  },

  "200": {
    prompt: "I sank into pessimism instead of acting.",
    verb: "sink",
    highlight: "sank",
    sentence: "I _____ into pessimism.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have sunk",
      "should not have sunk",
      "shouldnt have sunk",
      "shouldn't ve sunk",
      "shouldnt ve sunk"
    ],
    negative: true
  },

  "201": {
    prompt: "I slew the final boss without mercy.",
    verb: "slay",
    highlight: "slew",
    sentence: "I _____ the the final boss.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have slain",
      "should not have slain",
      "shouldnt have slain",
      "shouldn't ve slain",
      "shouldnt ve slain"
    ],
    negative: true
  },

  "202": {
    prompt: "I slid past the warning signs.",
    verb: "slide",
    highlight: "slid",
    sentence: "I _____ past them.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have slid",
      "should not have slid",
      "shouldnt have slid",
      "shouldn't ve slid",
      "shouldnt ve slid"
    ],
    negative: true
  },

  "203": {
    prompt: "I spat out my opinion without thinking.",
    verb: "spit",
    highlight: "spat",
    sentence: "I _____ out my feelings like that.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have spat", "should not have spat", "shouldnt have spat", "shouldn't ve spat", "shouldnt ve spat", "shouldn't have spit", "should not have spit", "shouldnt have spit", "shouldn't ve spit", "shouldnt ve spit"],
    negative: true
  },

  "204": {
    prompt: "I spun the centrifuges before testing them.",
    verb: "spin",
    highlight: "spun",
    sentence: "I _____ the centrifuges so soon.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have spun",
      "should not have spun",
      "shouldnt have spun",
      "shouldn't've spun",
      "shouldnt've spun"
    ],
    negative: true
  },

  "205": {
    prompt: "I struck back instead of calming down.",
    verb: "strike",
    highlight: "struck",
    sentence: "I _____ back.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have struck",
      "should not have struck",
      "shouldnt have struck",
      "shouldn't ve struck",
      "shouldnt ve struck"
    ],
    negative: true
  },

  "206": {
    prompt: "I swept the issue under the rug.",
    verb: "sweep",
    highlight: "swept",
    sentence: "I _____ it under the rug.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have swept",
      "should not have swept",
      "shouldnt have swept",
      "shouldn't ve swept",
      "shouldnt ve swept"
    ],
    negative: true
  },

  "207": {
    prompt: "I upset the balance by interfering.",
    verb: "upset",
    highlight: "upset",
    sentence: "I _____ the balance.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have upset",
      "should not have upset",
      "shouldnt have upset",
      "shouldn't ve upset",
      "shouldnt ve upset"
    ],
    negative: true
  },

  "208": {
    prompt: "I wove a web of lies.",
    verb: "weave",
    highlight: "wove",
    sentence: "I _____ such a web of lies.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have woven",
      "should not have woven",
      "shouldnt have woven",
      "shouldn't ve woven",
      "shouldnt ve woven"
    ],
    negative: true
  },

  "209": {
    prompt: "I wept openly during the meeting.",
    verb: "weep",
    highlight: "wept",
    sentence: "I _____ openly like that.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have wept",
      "should not have wept",
      "shouldnt have wept",
      "shouldn't ve wept",
      "shouldnt ve wept"
    ],
    negative: true
  },

  "210": {
    prompt: "I wound him up instead of listening.",
    verb: "wind",
    highlight: "wound",
    sentence: "I _____ him up.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have wound",
      "should not have wound",
      "shouldnt have wound",
      "shouldn't ve wound",
      "shouldnt ve wound"
    ],
    negative: true
  },

  "211": {
    prompt: "I withstood change for too long.",
    verb: "withstand",
    highlight: "withstood",
    sentence: "I _____ change.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have withstood",
      "should not have withstood",
      "shouldnt have withstood",
      "shouldn't ve withstood",
      "shouldnt ve withstood"
    ],
    negative: true
  },

  "212": {
    prompt: "I fled the scene instead of helping.",
    verb: "flee",
    highlight: "fled",
    sentence: "I _____ the scene.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have fled",
      "should not have fled",
      "shouldnt have fled",
      "shouldn't ve fled",
      "shouldnt ve fled"
    ],
    negative: true
  },

  "213": {
    prompt: "I underwent the procedure without asking questions.",
    verb: "undergo",
    highlight: "underwent",
    sentence: "I _____ it without questions.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have undergone",
      "should not have undergone",
      "shouldnt have undergone",
      "shouldn't ve undergone",
      "shouldnt ve undergone"
    ],
    negative: true
  },

  "214": {
    prompt: "I lied to protect myself.",
    verb: "lie",
    highlight: "lied",
    sentence: "I _____ like that.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have lain",
      "should not have lain",
      "shouldnt have lain",
      "shouldn't ve lain",
      "shouldnt ve lain"
    ],
    negative: true
  },

  "215": {
    prompt: "I bound myself to a bad agreement.",
    verb: "bind",
    highlight: "bound",
    sentence: "I _____ myself to it.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have bound",
      "should not have bound",
      "shouldnt have bound",
      "shouldnt ve bound",
      "shouldn't ve bound"
    ],
    negative: true
  },

  "216": {
    prompt: "I strove for perfection and burned out.",
    verb: "strive",
    highlight: "strove",
    sentence: "I _____ so hard.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have striven",
      "should not have striven",
      "shouldnt have striven",
      "shouldn't ve striven",
      "shouldnt ve striven"
    ],
    negative: true
  },

  "217": {
    prompt: "I sought approval instead of trusting myself.",
    verb: "seek",
    highlight: "sought",
    sentence: "I _____ approval.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have sought",
      "should not have sought",
      "shouldnt have sought",
      "shouldn't ve sought",
      "shouldnt ve sought"
    ],
    negative: false
  },

  "218": {
    prompt: "I hung back instead of stepping up.",
    verb: "hang",
    highlight: "hung",
    sentence: "I _____ back.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have hung",
      "should not have hung",
      "shouldnt have hung",
      "shouldn't ve hung",
      "shouldnt ve hung"
    ],
    negative: true
  },

  "219": {
    prompt: "I spread myself too thin and failed.",
    verb: "spread",
    highlight: "spread",
    sentence: "I _____ myself so thin.",
    category: "advanced",
    modal: "should",
    answers: [
      "shouldn't have spread",
      "should not have spread",
      "shouldnt have spread",
      "shouldn't ve spread",
      "shouldnt've spread"
    ],
    negative: true
  },

  "220": {
    prompt: "I withdrew without explaining why.",
    verb: "withdraw",
    highlight: "withdrew",
    sentence: "I _____ without explaining.",
    category: "advanced",
    modal: "should",
    answers: [
      "should not have withdrawn",
      "shouldn't have withdrawn",
      "shouldnt have withdrawn",
      "shouldnt ve withdrawn",
      "shouldn't ve withdrawn"
    ],
    negative: true
  }
};








