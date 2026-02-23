<template>
  <v-container fluid class="pa-5 d-flex justify-center" style="min-height: 100vh;">
    <!-- PRE-GAME -->
    <div v-if="!gameStarted && !gameComplete" class="text-center">
      <div>
        <v-img
          :src="BANNERS[props.game]"
          max-width="600"
          class="mx-auto my-6"
          contain
        />
      </div>
      <p class="text-body-1 mb-4">
        {{ gameData[props.game]?.description }}
      </p>
      <p class="text-body-1 mb-6">
        {{ gameData[props.game]?.instructions }}
      </p>

      <!-- Radio buttons for Prove it! -->
      <v-radio-group
        v-if="props.game === 'Prove it!'"
        v-model="selectedCategory"
        row
        class="mb-6"
      >
        <v-radio
          label="Essential irregulars past simple"
          value="Essential irregulars past simple"
        />
        <v-radio
          label="Advanced irregulars past simple"
          value="Advanced irregulars past simple"
        />
        <v-radio
          label="Essential irregulars present perfect"
          value="Essential irregulars present perfect"
        />
        <v-radio
          label="Advanced irregulars present perfect"
          value="Advanced irregulars present perfect"
        />
      </v-radio-group>


      <!-- Time pressure toggle -->
      <div class="d-flex justify-center">
              <v-switch
        v-model="useTimer"
        label="Enable time pressure (10s per card)"
        inset
        class="mb-6"
        color="info"

      />
      </div>


      <v-btn color="success" size="x-large" @click="startGame">
        START
      </v-btn>
    </div>

    <!-- ACTIVE GAME -->
    <div v-else-if="gameStarted" class="text-center py-10">
      <!-- Timer -->
      <div v-if="useTimer" class="my-6 d-flex justify-end">
        <v-progress-circular
          :model-value="timerProgress"
          :size="80"
          :width="8"
          color="primary"
        >
          {{ timeLeft }}
        </v-progress-circular>
      </div>
      <!-- Flashcard -->
      <v-card
        class="mx-auto mb-8 pa-10 text-center slide-card"
        elevation="4"
        :class="animationClass"
        style="width: 600px; height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center;"
      >
        <v-card-title
          class="text-center text-uppercase text-high-emphasis"
          v-if="selectedCategory == 'Essential irregulars present perfect' || selectedCategory == 'Advanced irregulars present perfect'"
        >
          <span>
            <v-chip
              color="primary"
              size="x-large"
              class="text-black"
              variant="flat"
            >
              {{ prompt?.category }}
            </v-chip>
          </span>


        </v-card-title>

        <v-card-text class="text-wrap mt-5" style="font-size: 2.5rem;">
          {{ prompt?.question }}
        </v-card-text>
      </v-card>
      <div class="my-6">
    <!-- Progress bar -->
    <v-progress-linear
        :model-value="progressValue"
        height="20"
        color="blue"
        rounded
        striped
      >
        <template v-slot:default>
          <strong>{{ promptCounter }} / {{ totalRounds }}</strong>
        </template>
      </v-progress-linear>
    </div>


      <!-- Evaluation buttons -->
      <div class="d-flex justify-center ga-6 mt-4">
        <v-btn color="success" size="x-large" @click="evaluate('right')">
          YES
        </v-btn>
        <v-btn color="error" size="x-large" @click="evaluate('wrong')">
          NO
        </v-btn>
        <v-btn color="grey-darken-1" size="x-large" @click="evaluate('unclear')">
          UNSURE
        </v-btn>
      </div>
    </div>

    <!-- GAME COMPLETE -->
    <div v-else class="text-center">
      <h2 class="text-h4 mb-4">Results</h2>

      <p class="text-h5 m-3">Score = {{ score }}%</p>
      <p class="text-success mb-2">✔ Correct: {{ rightCount }}</p>
      <p class="text-error mb-2">✖ Incorrect: {{ wrongCount }}</p>
      <p class="mb-4">❓ Unsure: {{ unclearCount }}</p>

      <div v-if="flaggedPrompts.length" class="mb-6">
        <h3 class="text-h6 mb-2">Needs Review</h3>
        <ul class="">
          <li v-for="(p, i) in flaggedPrompts" :key="i">
            {{ p.question }}
          </li>
        </ul>
      </div>

      <v-btn color="primary" size="x-large" @click="resetGame" class="me-5">
        PLAY AGAIN (SAME PLAYER)
      </v-btn>
      <RouterLink :to="{ name: 'teacher-tools' }">
        <v-btn color="info" size="x-large">
        PLAY WITH OTHER PLAYER
      </v-btn>
      </RouterLink>
      
    </div>
  </v-container>

  <!-- Snackbar -->
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="1200">
    {{ snackbar.message }}
  </v-snackbar>

  <!-- Saving dialog -->
  <v-dialog v-model="saving" persistent width="200">
    <v-card class="d-flex justify-center align-center pa-6">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-card>
  </v-dialog>
</template>


<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import api from "@/axios"

const props = defineProps<{
  game: "Spelling bee" | "Pronunciation Challenge" | "Prove it!" | "Be Polite!"
  student: string
}>()



// --------------------------
// STATE
// --------------------------
const BANNERS = {
  "Spelling bee": "/images/banners/SpellingBee-png",
  "Pronunciation Challenge": "/images/banners/PronunciationChallenge.png",
  "Prove it!": "/images/banners/ProveIt.png",
  "Be Polite!": "/images/banners/BePolite.png",
}

const selectedCategory = ref<string>("")    // for Prove it!

const prompt = ref<{ question: string; verb: string; correctAnswers: string[]; category: string } | null>(null)
const gameStarted = ref(false)
const gameComplete = ref(false)

const rightCount = ref(0)
const wrongCount = ref(0)
const score = computed(() => rightCount.value !== 0 ? (rightCount.value / totalRounds * 100).toFixed(1) : 0)
const hasAnyAnswer = ref(false)
const unclearCount = ref(0)
const wrongPrompts = ref<string[]>([])
const promptQueue = ref<{
  question: string
  verb: string
  correctAnswers: string[]
  category: string
}[]>([])


const shownPrompts = ref<{
  question: string
  verb: string
  correctAnswers: string[]
  category: string
  is_correct: boolean | null
}[]>([])

const totalRounds = 30
const remainingCount = ref(totalRounds)
const promptCounter = ref(0)

const snackbar = reactive({ show: false, message: "", color: "success" })
const saving = ref(false)

// Slide animation
const animationClass = ref("")
let slideTimeout: ReturnType<typeof setTimeout> | null = null

const progressValue = computed(() => (promptCounter.value / totalRounds) * 100)


const useTimer = ref(false)
const timeLeft = ref(10)
let timerInterval: ReturnType<typeof setInterval> | null = null

const timerProgress = computed(() => (timeLeft.value / 10) * 100)

// --------------------------
// GAME DATA (extendable by game name)
// --------------------------
const gameData: Record<string, { description: string; instructions: string; prompts: Record<string, string[]> }> = {
  "Pronunciation Challenge": {
    description: "Practice pronunciation with feedback from the teacher",
    instructions: "A card will appear with a word or phrase. Read the card aloud. The teacher will confirm if your pronunciation was correct.",
    prompts: {
      "-es": ['a few watches', "matrices", "shoe laces", "open spaces in beaches", "it displaces", "it realizes", "he embraces open spaces", 'many boxes', 'several dishes', 'two buses', 'he dances in churches', 'she engages with ', "sumptuous sandwiches", 'he passes', 'it catches', 'he kisses faces', 'he fixes the buses', 'many pieces', 'several chances', 'different classes of masses', 'changing faces', 'decreasing wages', 'rising prices', "it races", "she raises prices", 'different addresses', 'she presses latches', 'he guesses names', 'it reaches', 'she blushes', 'he rushes', 'various wishes', 'several losses', 'many crosses', 'different mixes', 'he mixes dishes', "she approaches the cases", "it encloses the spaces", "it washes the braces", "he polishes briefcases", "she launches the boxes"],
      "-ed normal": ['she walked', 'he jumped', "I tightened", "he loosened", "it softened", 'they played', "I screamed", "you triggered", 'we called', "you changed", 'I watched', 'she brushed', "she snapped", "you snatched it", "it was axed", "I asked", "you unmasked", "I smashed it", "you misbehaved", 'he cooked', 'they squeezed', 'we listened', 'she cleaned', 'he studied', 'they engaged', 'I crashed', 'she opened', "it clocked", "you unboxed", 'he coughed', 'they laughed', 'we smiled', 'I hugged', 'she messaged', 'he practiced', 'we enjoyed', 'I finished', "they broadened", "we narrowed", "she managed", "it was fixed"],
      "-ed voiced": ['he celebrated', "you wasted", 'we decided', "it was invented", "they've visited", "it was loaded", "they've investigated", "we've recreated", "they expanded", "it is folded", "they've donated", "she's recreated", "it's  manipulated", "it originated", "we are united", "very complicated", "we're eliminated", "it's embedded", "we've generated", "I calculated", "we dominated", "she graduated", "I comprehended"],
      "-gh": ['although', "2 meters high", "who sighed?", "who coughed?", "who laughed?", "mile-high city", "laughing all the way",  "roughing the passer", 'through', 'borough', 'cough', 'enough', 'rough', 'tough', 'laugh', 'sleigh', 'weigh', 'neigh', 'even though', "cough syrup", "a tough guy" , "enough is enough"],
      "-ght": ['light', 'night', 'fight', 'sight', 'might', 'flight', 'bright', 'tight', 'height', 'weight', 'slight', 'insight', 'delight', 'fright', 'bought', 'thought', 'brought', 'fought', "equally weighted", "a high height", 'caught', 'taught', 'naught', 'wrought', 'fraught', 'overwrought', 'distraught', 'forethought', 'sought', 'weight', 'straight'],
      "kn-": ['knee', 'knock', 'knowledge', 'knife', 'knit', 'knob', 'knoll', 'knack', 'knapsack', 'knuckle', 'knight', 'knowingly', 'knew'],
      "-gn-": ['magnet', "signature", "cognitive", "significant", "malignant", "ignite", "designate", "resignation", "magnolia", "magnifiy", "magnetic", "signal", "signify", "signals", "agnostic", "magnesium"],
      "h-": ["a humble hotel", "he's hard-headed", "that's heavy-handed", "a heavy hammer", "a wholesome habit", "I have the whole house", "I can't eat in this hateful heat", "a historic house", "handy help", "horrific horror", "a humble human", "hilarious humor", "with a heavy heart", "a happy home", "he's healing at home", "I hate the heat", "hit it and heat it", "a huge hug", "happy holidays!", "a healthy heart", "with a heavy heart", "hey, who hit her?", "haul out the holly", "hand me the honey"],
      "qu-": ['quick question', 'quality', 'quantity', 'acquire', 'squeeze', 'equal', 'x equals 10', 'aqueduct', "equality", "quarrel", "squeak and squeal", "inquisitive", "liquid", "an equation", "in quarantine", "liquidity", "illiquid asset"],
      "ch-": ['cheap', 'choose', 'chair', 'challenge', 'charm', 'chocolate', 'cheer', 'chop', "cheep sheep", "choose you shoes", "chilly cheese", "charming child", "chasing chickens", "chubby cheeks", "chocolate chunk", "cheerful chant", "chopping cherries", "chewing chocolate", "chasing cheetahs"],
      "ci-ce": ['special', 'cinema', 'certain', 'cereal', 'celebrate'],
      "hard": ["parentheses", "indices", "the mirror", "my clothes", "apostrophe", "emphasis", "analysis", "symthesis", "rural", "hierarchy", "iron", "phenomenon"],
      "strange": ["diesel engine", "Easter island", "a kitchen island", "Is Iceland an island?", "dollar", "gauge", "vineyard", "comfortable", "Wednesday", "February", "women", "debt", "aisle", "recipe", "cupboard", "4-stroke engine"],
      "pairs": ["desert (Sahara) vs dessert (cake)", "lead (to guide) vs lead (the metal)", "wind (air movement) vs wind (to turn)", "tear (rip) vs tear (from the eye)", "quiet (shhh!) vs quite ('quite good')", "suit (clothing) vs suite (set of rooms)", "choose vs chose", "live (to reside) vs live (not recorded)", "bass (fish) vs bass (low frequency sound)"],
    }
  },
  "Be Polite!": {
    description: "Prove your ability to be polite by repeating the auxiliary verb in the question.",
    instructions: "A card will appear with a yes/no question. Answer the question politely by repeating the auxiliary verb.",
    prompts: {
      "present_simple": [
        "Do you take out the trash on Tuesdays?",
        "Do you usually check your email before class?",
        "Do you work on your homework every day?",
        "Do you drink coffee in the morning?",
        "Do you often help your classmates?",
        "Do you need a pen right now?",
        "Do you know the answer to this question?",
        "Do you speak English at home?",
        "Do you like working in pairs?",
        "Do you always bring your notebook to class?"
      ],
      "present_simple_negative": [
        "Do you not like group work?",
        "Don't you have your homework with you?",
        "Do you not understand the instructions?",
        "Don't you usually take the bus to school?",
        "Do you not need any help today?"
      ],
      "present_continuous": [
        "Are you working on your assignment right now?",
        "Are you listening to me?",
        "Are you studying for an exam this week?",
        "Are you waiting for someone today?",
        "Are you learning any new words this month?",
        "Are you using your phone for the activity?",
        "Are you writing the answer down?",
        "Are you watching any English videos these days?"
      ],
      "present_continuous_negative": [
        "Aren't you paying attention?",
        "Are you not feeling well today?",
        "Aren't you working on it at the moment?"
      ],
      "present_perfect": [
        "Have you finished your homework yet?",
        "Have you ever visited London?",
        "Have you done your chores today?",
        "Have you heard this song before?",
        "Have you already sent the message?",
        "Have you studied enough for tomorrow?",
        "Have you eaten lunch today?",
        "Have you seen this movie before?",
        "Have you spoken to your teacher about it?"
      ],
      "present_perfect_negative": [
        "Haven't you completed the task yet?",
        "Have you not read the instructions?",
        "Haven't you ever tried sushi?"
      ],
      "past_simple": [
        "Did you take out the trash yesterday?",
        "Did you call your parents last night?",
        "Did you watch TV after dinner?",
        "Did you go to bed late yesterday?",
        "Did you do any exercise last week?",
        "Did you remember to bring your books?",
        "Did you meet any friends last weekend?",
        "Did you have breakfast this morning?",
        "Did you understand the last lesson?"
      ],
      "past_simple_negative": [
        "Didn't you do your homework?",
        "Did you not see my message?",
        "Didn't you go to school yesterday?"
      ],
      "past_continuous": [
        "Were you studying when I called you?",
        "Were you sleeping at 10 p.m. last night?",
        "Were you watching a movie when the power went out?",
        "Were you working on your project yesterday evening?",
        "Were you listening to music while you were cooking?",
        "Were you talking to someone during the break?"
      ],
      "past_continuous_negative": [
        "Weren't you paying attention when I explained it?",
        "Were you not taking notes during the presentation?"
      ],
      "future_simple": [
        "Will you be on time tomorrow?",
        "Will you help me with this later?",
        "Will you remember to bring your notebook next class?",
        "Will you study tonight?",
        "Will you do the dishes after dinner?",
        "Will you join us for the next activity?"
      ],
      "future_simple_negative": [
        "Won't you be able to come tomorrow?",
        "Will you not attend the meeting?"
      ],
      "should": [
        "Should you apologize to your classmate?",
        "Should we start now?",
        "Should you review the vocabulary again?",
        "Should I speak more slowly?",
        "Should you turn off your phone during class?",
        "Should we take a short break?"
      ],
      "should_negative": [
        "Shouldn't you be more careful?",
        "Should we not wait for the others?"
      ],
      "could": [
        "Could you repeat that, please?",
        "Could you open the window?",
        "Could you help me with this question?",
        "Could you speak a little louder?",
        "Could you send me the file today?",
        "Could we change partners?"
      ],
      "could_negative": [
        "Couldn't you come earlier next time?",
        "Could you not make so much noise, please?"
      ],
      "can": [
        "Can you confirm the meeting time?",
        "Can you help me carry these books?",
        "Can you answer this question in English?",
        "Can you wait a moment, please?",
        "Can you explain your idea?",
        "Can we start the game now?",
        "Can I borrow your pen?",
        "Can you close the door, please?"
      ],
      "can_negative": [
        "Can't you stay a little longer?",
        "Can you not interrupt, please?"
      ],
      "would": [
        "Would you like to try again?",
        "Would you mind speaking more slowly?",
        "Would you help me with my pronunciation?",
        "Would you like some feedback now?",
        "Would you prefer working alone or in pairs?",
        "Would you like to answer first?"
      ],
      "would_negative": [
        "Wouldn't you agree that this is important?",
        "Would you not rather do it tomorrow?"
      ],
      "be_present": [
        "Are you ready to begin?",
        "Is your homework finished?",
        "Are you okay?",
        "Is it your turn?",
        "Are we in the right room?"
      ],
      "be_past": [
        "Were you late to class yesterday?",
        "Was the homework difficult?",
        "Were you tired after school?",
        "Was it noisy in the classroom?",
        "Were they happy with the result?"
      ]
    }
  },
  "Essential irregulars past simple": {
    description: "Prove your knowledge of past simple irregular verbs.",
    instructions: "Answer the question using the past simple form of the verb in the question.",
    prompts: {
      "bring": ["What did you bring to school today?", "What did you bring for lunch the other day?"],
      "eat": ["What did you eat for breakfast this morning?", "what did you eat for dinner last night?"],
      "go": ["Where did you go last weekend?", "Where did you go on your last holiday?"],
      "see": ["What did you see at the zoo?", "What did you see on your last trip to the cinema?"],
      "take": ["What did you take when you went to the mountain?", "What did you take on your last vacation?"],
      "write": ["What did you write in your last email?", "What did you write by hand last month?"],
      "come": ["When did you come back from your last holiday?", "When did you come to school this week?"],
      "do": ["What did you do last Saturday?", "What did you do for fun last summer?"],
      "have": ["What did you have for lunch yesterday?", "When did you have a great time?"],
      "make": ["What did you make in the kitchen?", "What did you make in art class?"],
      "run": [ "Where did you run yesterday?", "When did you run in a race?" ], 
      "hear": [ "What did you hear on the radio?", "What did you hear at school today?" ], 
      "break": [ "What did you break last week?", "What did you break by accident at home?" ], 
      "swim": [ "Where did you swim last summer?", "When did you swim in the ocean?" ], 
      "sing": [ "What did you sing as a child?", "What did you sing in music class?" ], 
      "cut": [ "What did you cut with scissors?", "What did you cut in the kitchen?" ], 
      "buy": [ "What did you buy at the store?", "What did you buy last weekend?" ], 
      "sell": [ "What did you sell online?", "What did you sell to earn some extra money?" ], 
      "pay": [ "How much did you pay for lunch?", "How did you pay at the shop yesterday?" ], 
      "say": [ "What did you say to your friend?", "What did you say in class yesterday?" ], 
      "speak": [ "What did you speak about in class?", "What did you speak about with your family?" ], 
      "dig": [ "What did you dig in the garden?", "Where did you dig last year?" ], 
      "forget": [ "Whose birthday did you forget?", "What did you forget to do last week?" ], 
      "light": [ "What did you light with a match?", "What did you light in the evening?" ], 
      "forbid": [ "What did your teacher forbid in class?", "What did your parents forbid you to do?" ], 
      "send": [ "What did you send in a message?", "What did you send by email last week?" ], 
      "know": [ "Who from this class did you know previously?", "What did you know before the test?" ], 
      "understand": [ "What did you understand very well in school?", "What language did you understand as a child?" ], 
      "think": [ "What did you think about the last Eurovision?", "What did you think about the weather last week?" ], 
      "catch": [ "When did you catch a ball?", "What did you catch last week?" ],
      "read": [ "What did you read last night?", "What did you read in class yesterday?" ], 
      "find": [ "What did you find in the park?", "What did you find at home last week?" ], 
      "lose": [ "What did you lose yesterday?", "What did you lose on your last trip?" ], 
      "drive": [ "Where did you drive last weekend?", "When did you drive to school?" ], 
      "meet": [ "Who did you meet yesterday?", "Who did you meet on your last holiday?" ], 
      "build": [ "What did you build?", "What did you build with blocks?" ], 
      "draw": [ "What did you draw in your notebook?", "What did you draw in art class?" ], 
      "feel": [ "What did you feel when you won?", "What did you feel yesterday morning?" ], 
      "cost": [ "What did it cost to buy lunch?", "What did the laptop cost?" ], 
      "wear": [ "What did you wear yesterday?", "What did you wear to the party?" ], 
      "win": [ "What did you win?", "When did you win a game?" ], 
      "fall": [ "Where did you fall?", "When did you fall on the ski slope?" ], 
      "leave": [ "When did you leave school yesterday?", "When did you leave home last weekend?" ], 
      "begin": [ "What did you begin last month?", "What did you begin in class yesterday?" ], 
      "teach": [ "What did your teacher teach yesterday?", "What did you teach the children?" ], 
      "steal": [ "What did the thief steal?", "What did someone steal from the shop?" ], 
      "throw": [ "What did you throw in the game?", "What did you throw away yesterday?" ], 
      "spend": [ "What did you spend money on last week?", "What did you spend time doing yesterday?" ], 
      "fight": [ "What did you fight about yesterday?", "What did the heroes fight in the story?" ], 
      "hide": [ "Where did you hide yesterday?", "What did you hide in your room?" ], 
      "rise": [ "When did the sun rise today?", "When did you rise from bed yesterday?" ], 
      "show": [ "What did you show your friend?", "What did you show in class yesterday?" ], 
      "mean": [ "What did you mean by that?", "What did the word mean in the story?" ], 
      "deal": [ "What problem did you deal with yesterday?", "When did you deal cards?" ], 
      "wake": [ "When did you wake up today?", "When did you wake up last weekend?" ], 
      "drink": [ "What did you drink for breakfast?", "What did you drink at the party?" ], 
      "choose": [ "What did you choose for lunch?", "What did you choose in the shop?" ], 
      "become": [ "When did you become the best?", "What did you become independent?" ], 
      "freeze": [ "What did you freeze in the freezer?", "When did your toes freeze?" ], 
      "set": [ "What did you set on the table?", "What did you set up yesterday?" ], 
      "hit": [ "What did you hit with the racket?", "What did you hit by accident?" ], 
      "sleep": [ "How many hours did you sleep last night?", "When did you sleep outdoors?" ], 
      "put": [ "What did you put in your bag?", "What did you put on the desk yesterday?" ], 
      "lead": [ "When did you lead the race?", "When did you lead a time?" ], 
      "get": [ "What did you get for your birthday?", "What did you get at the shop yesterday?" ], 
      "sit": [ "Where did you sit in class?", "Where did you sit last weekend?" ], 
      "grow": [ "What did you grow in the garden?", "What did you grow last summer?" ], 
      "hold": [ "What did you hold in your hand?", "What did you hold during the game?" ], 
      "tell": [ "What did you tell your friend?", "What did you tell your teacher yesterday?" ], 
      "let": [ "What did you let your friend do?", "What did you let your pet do?" ], 
      "fly": [ "Where did you fly last summer?", "When did you fly to another city?" ],
      "give": [ "What did you give to your friend?", "What did you give for Christmas?" ],
    }
  },
    "Advanced irregulars past simple": {
    description: "Prove your knowledge of past simple irregular verbs.",
    instructions: "Answer the question using the past simple form of the verb in the question.",
    prompts: {
        "bear": [
          "What did you bear last year?",
          "What did you bear during a hard time?"
        ],
        "beat": [
          "Which team did Gottéron beat in the game?",
          "Who did you beat in the competition?"
        ],
        "bend": [
          "What did you bend yesterday?",
          "Which part did you bend?"
        ],
        "bet": [
          "What did you bet on last week?",
          "What did you bet with your friend?"
        ],
        "bid": [
          "What did you bid for at the auction?",
          "What did you bid online yesterday?"
        ],
        "bite": [
          "What did the baby bite into?",
          "Who did the dog bite?"
        ],
        "bleed": [
          "When did your heart bleed (metaphorically)?",
          "What did you bleed from yesterday?"
        ],
        "blow": [
          "Which direction did the wind blow last night?",
          "When did you blow out a candle?"
        ],
        "broadcast": [
          "What did you broadcast on TV?",
          "What did you broadcast last week?"
        ],
        "cast": [
          "What metal you cast?",
          "Which actor did they cast for the role?"
        ],
        "cling": [
          "Why did the baby cling to his mother?",
          "What did you cling to in fear?"
        ],
        "creep": [
          "When did the soldiers creep on the ground?",
          "When did you creep quietly?"
        ],
        "feed": [
          "What did you feed the dog?",
          "What did you feed at the farm?"
        ],
        "foretell": [
          "What did you foretell about the weather?",
          "What did you foretell last year?"
        ],
        "grind": [
          "What did you grind in the kitchen?",
          "What did you grind in the workshop?"
        ],
        "hang": [
          "What did you hang on the wall?",
          "What did you hang up in your closet?"
        ],
        "hurt": [
          "What did you hurt last week?",
          "What did you hurt during the game?"
        ],
        "lay": [
          "What did you lay on the table?",
          "What did you lay on the ground?"
        ],
        "lend": [
          "What did you lend your friend?",
          "What did you lend last month?"
        ],
        "offset": [
          "When did you offset your carbon footprint?",
          "What did you offset in the budget?"
        ],
        "ride": [
          "What did you ride last summer?",
          "What did you ride at the park?"
        ],
        "ring": [
          "What did you ring yesterday?",
          "What did you ring at the door?"
        ],
        "seek": [
          "What did you seek last year?",
          "What did you seek in the library?"
        ],
        "shake": [
          "What did you shake yesterday?",
          "What did you shake in your hand?"
        ],
        "shed": [
          "Did your dog shed its hair?",
          "When did you shed your skin?"
        ],
        "shoot": [
          "What did you shoot in the game?",
          "When did you shoot?"
        ],
        "shrink": [
          "What did you shrink in the washing machine?",
          "When did your savings shrink?"
        ],
        "shut": [
          "When did you shut the door?",
          "What did you shut down the computer?"
        ],
        "sink": [
          "What year did the Titanic sink?",
          "When did stock prices sink?"
        ],
        "slide": [
          "When did you slide?",
          "When did your car tires slide?"
        ],
        "spit": [
          "What did you spit out yesterday?",
          "Why did the camel spit?"
        ],
        "spin": [
          "What did you spin in class?",
          "What did you spin at home?"
        ],
        "stand": [
          "Where did you stand yesterday?",
          "Where did you stand in line?"
        ],
        "stink": [
          "What [stink] in your fridge?",
          "What [stink] in the kitchen?"
        ],
        "strike": [
          "What did you strike yesterday?",
          "What did you strike in the game?"
        ],
        "sweep": [
          "Which room you sweep yesterday?",
          "What did you sweep in the house?"
        ],
        "tear": [
          "What did you tear yesterday?",
          "Did you tear a ligament?"
        ],
        "upset": [
          "Why did the news upset you?",
          "When did you upset your friend?"
        ],
        "weave": [
          "What did you weave in art class?",
          "What did you weave last summer?"
        ],
        "weep": [
          "When did you weep last year?",
          "What did you weep about yesterday?"
        ],
        "wind": [
          "What did you wind yesterday?",
          "What did you wind around the pole?"
        ],
        "withdraw": [
          "How much did you withdraw from the bank account?",
          "When did you withdraw from the competition?"
        ],
        "withstand": [
          "What did you withstand last year?",
          "What did you withstand in the storm?"
        ],
        "flee": [
          "Where did you flee yesterday?",
          "What did you flee from last week?"
        ],
        "undergo": [
          "What did you undergo last year?",
          "What did you undergo at school?"
        ],
        "spread": [
          "What did you spread on the bread?",
          "Which rumor did you spread?"
        ],
        "lie": [
          "When did you lie down for a nap?",
          "Where did you lie down for your nap?"
        ],
        "bind": [
          "What two materials did you bind together?",
          "When did you bind the materials?"
        ],
        "strive": [
          "What did you strive for last year?",
          "What did you strive to do yesterday?"
        ]
      }
    },
    "Essential irregulars present perfect": {
    description: "Prove your knowledge of present perfect irregular verbs.",
    instructions: "Answer the question using the present perfect form of the verb in the question.",
    prompts: {
      "bring": ["brought", "I have _____ my books to school."],
      "eat": ["eaten", "She has _____ breakfast already."],
      "go": ["gone", "We have _____ to the park many times."],
      "see": ["seen", "They have _____ that movie twice."],
      "take": ["taken", "He has _____ the bus to work."],
      "write": ["written", "She has _____ three letters today."],
      "come": ["come", "They have _____ to visit us often."],
      "do": ["done", "I have _____ my homework already."],
      "have": ["had", "We have _____ a great time together."],
      "make": ["made", "She has _____ a cake for the party."],
      "run": ["run", "He has _____ five kilometers today."],
      "hear": ["heard", "I have _____ that song before."],
      "break": ["broken", "She has _____ her phone screen."],
      "swim": ["swum", "They have _____ across the lake."],
      "sing": ["sung", "He has _____ in the choir for years."],
      "cut": ["cut", "She has _____ the paper neatly."],
      "buy": ["bought", "I have _____ a new jacket."],
      "sell": ["sold", "They have _____ their old car."],
      "pay": ["paid", "He has _____ the bill already."],
      "say": ["said", "She has _____ something important."],
      "speak": ["spoken", "He has _____ to the teacher."],
      "dig": ["dug", "They have _____ a hole in the garden."],
      "forget": ["forgotten", "I have _____ my password again."],
      "light": ["lit", "She has _____ the candles."],
      "forbid": ["forbidden", "He has _____ us from entering."],
      "send": ["sent", "I have _____ the email already."],
      "know": ["known", "She has _____ him for years."],
      "understand": ["understood", "I have _____ the lesson clearly."],
      "think": ["thought", "He has _____ about the problem carefully."],
      "catch": ["caught", "She has _____ the ball easily."],
      "read": ["read", "I have _____ that book twice."], 
      "find": ["found", "They have _____ the missing keys."],
      "lose": ["lost", "He has _____ his wallet again."],
      "drive": ["driven", "She has _____ to work every day this week."],
      "meet": ["met", "I have _____ many new friends."],
      "build": ["built", "They have _____ a new house."],
      "draw": ["drawn", "She has _____ a beautiful picture."],
      "feel": ["felt", "I have _____ very happy since the divorce."],
      "cost": ["cost", "The trip has _____ a lot of money."],
      "wear": ["worn", "She has _____ that dress before."],
      "win": ["won", "He has _____ the game twice."],
      "fall": ["fallen", "She has _____ off her bike."],
      "leave": ["left", "They have _____ the city already."],
      "begin": ["begun", "She has _____ a new project this week."], 
      "teach": ["taught", "He has _____ us many useful lessons."], 
      "steal": ["stolen", "Someone has _____ my bike again."], 
      "throw": ["thrown", "He has _____ the ball across the field."], 
      "spend": ["spent", "I have _____ all my money already."], 
      "fight": ["fought", "They have _____ bravely in the battle."], 
      "hide": ["hidden", "She has _____ the keys under the mat."], 
      "rise": ["risen", "The sun has _____ over the mountains."], 
      "show": ["shown", "He has _____ us his new phone."], 
      "mean": ["meant", "I have _____ to call you all day."], 
      "deal": ["dealt", "She has _____ the cards fairly."], 
      "wake": ["woken", "He has _____ up late again."], 
      "drink": ["drunk", "I have _____ three cups of coffee today."], 
      "choose": ["chosen", "She has _____ the red dress."], 
      "become": ["become", "He has _____ a great leader."], 
      "freeze": ["frozen", "The lake has _____ solid overnight."], 
      "set": ["set", "They have _____ the table for dinner."], 
      "hit": ["hit", "He has _____ the target perfectly."], 
      "sleep": ["slept", "I have _____ very well tonight."], 
      "put": ["put", "She has _____ the book on the shelf."], 
      "lead": ["led", "He has _____ the team to victory."], 
      "get": ["gotten", "I have _____ better at chess."], 
      "sit": ["sat", "She has _____ in the front row."], 
      "grow": ["grown", "They have _____ vegetables in the garden."], 
      "hold": ["held", "He has _____ the baby gently."], 
      "tell": ["told", "She has _____ me the whole story."], 
      "let": ["let", "I have _____ him borrow my pen."], 
      "fly": ["flown", "We have _____ to Paris twice."], 
      "give": ["given", "She has _____ me a wonderful gift."]
    }
    },
    "Advanced irregulars present perfect": {
    description: "Prove your knowledge of present perfect irregular verbs.",
    instructions: "Answer the question using the present perfect form of the verb in the question.",
    prompts: {
      "bear": ["borne", "I have _____ a heavy weight all these years."], 
      "beat": ["beaten", "Arsenal has never _____ Liverpool by more than one goal."], 
      "bend": ["bent", "That lawyer has _____ every rule in the book."], 
      "bet": ["bet", "He has _____ all his money on that horse."], 
      "bid": ["bid", "She has _____ for the painting at the auction."], 
      "bite": ["bitten", "I have _____ my tongue many times."], 
      "bleed": ["bled", "He has _____ after the accident."], 
      "blow": ["blown", "The wind has _____ the leaves away."], 
      "broadcast": ["broadcast", "The station has _____ the news live."], 
      "cast": ["cast", "They have _____ their votes already."], 
      "cling": ["clung", "The child has _____ to his mother all day."], 
      "creep": ["crept", "The cat has _____ silently into the room."], 
      "feed": ["fed", "She has _____ the baby twice today."], 
      "foretell": ["foretold", "The prophet has _____ the future correctly."], 
      "grind": ["ground", "He has _____ the coffee beans fresh."], 
      "hang": ["hung", "That jacket has _____ in my closet since I was 20."], 
      "hurt": ["hurt", "She has _____ her ankle again."], 
      "lay": ["laid", "He has _____ the books on the desk."], 
      "lend": ["lent", "I have _____ my pen to a friend."], 
      "offset": ["offset", "The company has _____ its losses with new gains."], 
      "ride": ["ridden", "She has _____ her bike to school every day."], 
      "ring": ["rung", "He has _____ the bell three times."], 
      "seek": ["sought", "They have _____ advice from their teacher."], 
      "shake": ["shaken", "He has _____ the bottle before opening it."], 
      "shed": ["shed", "The tree has _____ its leaves for winter."], 
      "shoot": ["shot", "The player has _____ the ball into the net."], 
      "shrink": ["shrunk", "My sweater has _____ in the wash."], 
      "shut": ["shut", "She has _____ the door quietly."], 
      "sink": ["sunk", "The ship has _____ to the bottom of the sea."], 
      "slay": ["slain", "The knight has _____ the dragon."], 
      "slide": ["slid", "The child has _____ down the slide."], 
      "spit": ["spat", "He has _____ out the bad taste."], 
      "spin": ["spun", "The dancer has _____ around gracefully."], 
      "stand": ["stood", "I have _____ in line for hours."], 
      "stink": ["stunk", "The garbage has _____ up the room."], 
      "strike": ["struck", "Lightning has _____ the tree."], 
      "sweep": ["swept", "She has _____ the floor clean."], 
      "tear": ["torn", "He has _____ his shirt again."], 
      "upset": ["upset", "The news has _____ everyone in the office."], 
      "weave": ["woven", "She has _____ a beautiful basket."], 
      "weep": ["wept", "He has _____ for his lost friend."], 
      "wind": ["wound", "She has _____ the string tightly."], 
      "withdraw": ["withdrawn", "He has _____ money from the bank."], 
      "withstand": ["withstood", "The building has _____ the storm."], 
      "flee": ["fled", "The thief has _____ from the police."], 
      "undergo": ["undergone", "She has _____ surgery recently."], 
      "spread": ["spread", "He has _____ the butter on the bread."], 
      "lie": ["lain", "She has _____ in bed all morning."], 
      "bind": ["bound", "He has _____ the papers together."], 
      "strive": ["striven", "They have _____ to achieve success."]
    }
    }
}

// --------------------------
// GAME LOGIC
// --------------------------
function startGame() {
  gameStarted.value = true
  gameComplete.value = false

  if (props.game === "Prove it!" && !selectedCategory.value) {
    snackbar.message = "Please select a category first"
    snackbar.color = "error"
    snackbar.show = true
    return
  }
  buildPromptQueue()
  loadNextPrompt()
}

function buildPromptQueue() {
  const dataset =
    props.game === "Prove it!"
      ? gameData[selectedCategory.value]
      : gameData[props.game]

  if (!dataset) return

  const queue: typeof promptQueue.value = []

  Object.entries(dataset.prompts).forEach(([key, values]) => {
    // PRESENT PERFECT → always index [1]
    if (
      selectedCategory.value === "Essential irregulars present perfect" ||
      selectedCategory.value === "Advanced irregulars present perfect"
    ) {
      queue.push({
        question: values[1],
        verb: key,
        correctAnswers: [values[0]],
        category: key,
      })
      return
    }

    // PAST SIMPLE → random question from values
    if (
      selectedCategory.value === "Advanced irregulars past simple" ||
      selectedCategory.value === "Essential irregulars past simple"
    ) {
      const q = values[Math.floor(Math.random() * values.length)]
      queue.push({
        question: q,
        verb: key,
        correctAnswers: [key],
        category: key,
      })
      return
    }

    // DEFAULT (Pronunciation etc.)
    values.forEach(v => {
      queue.push({
        question: v,
        verb: key,
        correctAnswers: [v],
        category: key,
      })
    })
  })

  // Shuffle
  promptQueue.value = shuffle(queue).slice(0, totalRounds)
}


function animateSlide() {
  animationClass.value = "slide-out-left"
  slideTimeout && clearTimeout(slideTimeout)
  slideTimeout = setTimeout(() => {
    animationClass.value = "slide-in-right"
    setTimeout(() => {
      animationClass.value = "slide-in-final"
      setTimeout(() => (animationClass.value = ""), 400)
    }, 40)
  }, 350)
}

function loadNextPrompt() {
  if (!promptQueue.value.length || promptCounter.value >= totalRounds) {
    endGame()
    return
  }

  prompt.value = promptQueue.value.shift() || null
  promptCounter.value++
  remainingCount.value--

  animateSlide()
  if (useTimer.value) startTimer()
}

function startTimer() {
  stopTimer()
  timeLeft.value = 10

  timerInterval = setInterval(() => {
    timeLeft.value--

    if (timeLeft.value <= 0) {
      stopTimer()
      evaluate('unclear')
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function evaluate(type: "right" | "wrong" | "unclear") {
  stopTimer()
  hasAnyAnswer.value = true

  if (!prompt.value) return

  const shouldAppendCategory =
    props.game === "Prove it!" &&
    selectedCategory.value.includes("present perfect")

  const finalQuestion = shouldAppendCategory
    ? `${prompt.value.question} (${prompt.value.category})`
    : prompt.value.question

  shownPrompts.value.push({
    question: finalQuestion,
    verb: prompt.value.verb,
    correctAnswers: prompt.value.correctAnswers,
    category: prompt.value.category,
    is_correct: type === "right"
      ? true
      : type === "wrong"
      ? false
      : null,
  })

  if (type === "right") rightCount.value++
  else if (type === "wrong") wrongCount.value++
  else unclearCount.value++

  snackbar.message = type.toUpperCase()
  snackbar.color =
    type === "right"
      ? "success"
      : type === "wrong"
      ? "error"
      : "grey-darken-2"

  snackbar.show = true
  loadNextPrompt()
}


const flaggedPrompts = computed(() =>
  shownPrompts.value.filter(p => p.is_correct !== true)
)


function resetCounts() {
  promptCounter.value = 0
  remainingCount.value = totalRounds
  rightCount.value = 0
  wrongCount.value = 0
  unclearCount.value = 0
  shownPrompts.value = []
}

function resetGame() {
  gameStarted.value = false
  gameComplete.value = false
  resetCounts()
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}


// --------------------------
// END GAME → SEND TO BACKEND
// --------------------------
const gameNameAbbreviations: Record<string, string> = {
  "Essential irregulars past simple": "EssPS",
  "Advanced irregulars past simple": "AdvPS",
  "Essential irregulars present perfect": "EssPP",
  "Advanced irregulars present perfect": "AdvPP",
}

const updatedGameName = computed(() => {
  if (props.game === "Prove it!" && selectedCategory.value) {
    const abbreviation = gameNameAbbreviations[selectedCategory.value as keyof typeof gameNameAbbreviations]
    return `Prove it! >> ${abbreviation  || selectedCategory.value }`
  }
  return props.game
})

async function endGame() {
  stopTimer()

  // Do NOT save empty or aborted games
  if (!hasAnyAnswer.value) {
    gameComplete.value = false
    gameStarted.value = false
    return
  }
  
  gameComplete.value = true
  saving.value = true

const rounds = shownPrompts.value.map((r, index) => ({
  question: r.question,
  pronoun: null,
  image: null,
  label: r.verb,
  correct_answer: r.correctAnswers,
  prompt_number: index + 1,
  user_answer: null,
  is_correct: r.is_correct, 
  out_of_time: false,
  elapsed_time: null,
  typo: false,
  typo_requested: false,
  typo_accepted: null,
}))


  const payload = {
    game_name: props.game,
    student_web_id: props.student,
    total_rounds: totalRounds,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    total_time: 0,
    avg_time_per_prompt: 0,
    rounds,
  }

  try {
    await api.post("/other-games-sessions/", payload, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("Saving failed:", err)
  }

  saving.value = false
  gameStarted.value = false
}

function quitGame() {
  saving.value = false
  gameStarted.value = false

  prompt.value = null
  shownPrompts.value = []

  rightCount.value = 0
  wrongCount.value = 0
  unclearCount.value = 0
  remainingCount.value = totalRounds
  promptCounter.value = 0
  wrongPrompts.value = []
}
</script>

<style scoped>
.slide-card {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

/* left → vanish */
.slide-out-left {
  transform: translateX(-120%);
  opacity: 0;
}

/* right → enter */
.slide-in-right {
  transform: translateX(120%);
  opacity: 0;
}

/* center → visible */
.slide-in-final {
  transform: translateX(0);
  opacity: 1;
}
</style>
