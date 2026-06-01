<template>
  <v-container fluid class="pa-6 max-width-game-container d-flex justify-center align-center">
    
    <div v-if="!gameStarted && !gameComplete" class="text-center w-100" style="max-width: 680px;">
      <v-card variant="flat" border class="pa-6 rounded-xl bg-slate-50 border-slate-200">
        <v-img
          :src="BANNERS[props.game]"
          max-width="480"
          max-height="180"
          class="mx-auto mb-6 rounded-lg elevation-1"
          cover
        />
        
        <h2 class="text-h5 font-weight-black text-slate-900 mb-2">{{ props.game }}</h2>
        <p class="text-body-2 font-weight-bold text-indigo mb-2">
          {{ gameData[props.game]?.description }}
        </p>
        <p class="text-caption text-slate-500 line-height-md mb-6">
          {{ gameData[props.game]?.instructions }}
        </p>

        <v-divider class="mb-6 border-slate-200" />

        <div v-if="props.game === 'Prove it!'" class="text-left mb-6">
          <label class="text-overline font-weight-black text-slate-400 d-block mb-2 tracking-wider">
            Select Verb Set
          </label>
          <v-radio-group
            v-model="selectedCategory"
            hide-details
            class="custom-pill-radio-group"
          >
            <v-row dense>
              <v-col cols="12" sm="6" v-for="cat in ['Essential irregulars past simple', 'Advanced irregulars past simple', 'Essential irregulars present perfect', 'Advanced irregulars present perfect']" :key="cat">
                <v-card 
                  variant="flat" 
                  border 
                  :class="selectedCategory === cat ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white'"
                  class="pa-3 rounded-lg cursor-pointer transition-all d-flex align-center"
                  @click="selectedCategory = cat"
                >
                  <v-radio :value="cat" color="indigo-darken-2" hide-details density="compact" />
                  <span class="text-caption font-weight-bold text-slate-700 ml-2 leading-tight">{{ cat }}</span>
                </v-card>
              </v-col>
            </v-row>
          </v-radio-group>
        </div>

        <v-card variant="flat" border class="pa-4 bg-white border-slate-200 rounded-lg text-left mb-6">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 font-weight-bold text-slate-800">Time Pressure</div>
              <div class="text-caption text-slate-400">You must answer under 10s!</div>
            </div>
            <v-switch
              v-model="useTimer"
              inset
              hide-details
              color="indigo"
              density="compact"
            />
          </div>
        </v-card>

        <v-btn 
          color="indigo-darken-1" 
          size="large" 
          block
          class="text-white font-weight-black rounded-xl"
          elevation="1"
          @click="startGame"
        >
          Launch Challenge
        </v-btn>
      </v-card>
    </div>

    <div v-else-if="gameStarted" class="w-100 py-4" style="max-width: 800px;">
      
      <div class="d-flex align-center justify-space-between mb-4 px-2">
        <div class="d-flex align-center text-caption font-weight-bold text-slate-500">
          <v-icon icon="mdi-account-circle" size="small" class="mr-1" />
          Student: <span class="text-indigo ml-1 font-monospace">{{ props.student }}</span>
        </div>
        
        <div v-if="useTimer" class="d-flex align-center">
          <v-progress-circular
            :model-value="timerProgress"
            :size="40"
            :width="4"
            :color="timeLeft <= 3 ? 'error' : 'indigo'"
            class="font-weight-black font-monospace text-caption"
          >
            {{ timeLeft }}
          </v-progress-circular>
        </div>
      </div>

      <div class="game-viewport-card-wrapper mb-6">
        
        <v-card 
          v-if="props.game !== 'Balanced Opinions' && props.game !== 'Unfinished Business' && props.game !== 'Verb Mixer Classroom Edition'"
          class="mx-auto rounded-2xl border border-slate-200 slide-card layout-flex-center"
          elevation="3"
          :class="animationClass"
        >
          <div v-if="selectedCategory.includes('present perfect')" class="card-pill-badge-header">
            <v-chip color="indigo-lighten-2" text-color="indigo-darken-4" size="large" class="font-weight-black uppercase">
              {{ prompt?.category }}
            </v-chip>
          </div>
          <div class="flashcard-main-display-text text-slate-800 font-weight-bold">
            {{ prompt?.question }}
          </div>
        </v-card>

        <v-card 
          v-else-if="props.game === 'Balanced Opinions'"
          class="mx-auto rounded-2xl border border-slate-200 slide-card layout-flex-center pa-6"
          elevation="3"
          :class="animationClass"
        >
          <div class="text-overline font-weight-bold text-slate-400 tracking-widest mb-2">Balanced Opinion Challenge</div>
          <div class="flashcard-sub-display-text text-slate-500 mb-4">What is your balanced perspective on...?</div>
          <div class="flashcard-main-display-text text-slate-900 font-weight-black line-height-tight mb-6">
            {{ prompt?.question }}
          </div>
          <div class="card-footer-pill border-t pt-4 w-100 text-center border-slate-100">
            <span class="text-caption font-weight-bold text-slate-400 uppercase mr-2 tracking-wider">Linking Word:</span>
            <v-chip color="indigo-darken-1" size="large" class="text-white font-weight-black px-4 shadow-sm">
              {{ prompt?.category }}
            </v-chip>
          </div>
        </v-card>

        <v-card 
          v-else-if="props.game === 'Unfinished Business'"
          class="mx-auto rounded-2xl border border-slate-200 slide-card layout-flex-center pa-6"
          elevation="3"
          :class="animationClass"
        >
          <div class="text-overline font-weight-bold text-slate-400 tracking-widest mb-2">Finished vs Unfinished Past</div>
          <div class="flashcard-sub-display-text text-slate-500 mb-4">Conjugate the following verb:</div>
          <div class="flashcard-main-display-text text-deep-purple font-weight-black uppercase tracking-wide mb-6">
            {{ prompt?.question }}
          </div>
          <div class="card-footer-pill border-t pt-4 w-100 text-center border-slate-100">
            <span class="text-caption font-weight-bold text-slate-400 uppercase mr-2 tracking-wider">under this time frame:</span>
            <v-chip color="amber-darken-2" size="large" class="text-white font-weight-black px-4 shadow-sm">
              {{ prompt?.category }}
            </v-chip>
          </div>
        </v-card>

        <v-card 
          v-else-if="props.game === 'Verb Mixer Classroom Edition'"
          class="mx-auto rounded-2xl border border-slate-200 slide-card layout-flex-center pa-8"
          elevation="3"
          :class="animationClass"
        >
          <div class="text-overline font-weight-bold text-slate-400 tracking-widest mb-4">Verb Complement Challenge (Infinitive vs Gerund)</div>
          <div class="flashcard-main-display-text text-slate-800 font-weight-bold line-height-sm mb-4">
            {{ prompt?.question }}
          </div>
          <div class="text-caption font-weight-medium text-slate-400">
            Choose between <code class="font-weight-black text-slate-600">to + verb</code> or <code class="font-weight-black text-slate-600">verb + -ing</code> verb complements.
          </div>
        </v-card>
      </div>

      <div class="px-2 mb-6">
        <div class="d-flex justify-space-between align-center text-caption font-weight-bold text-slate-400 mb-1 tracking-wider">
          <span>PROGRESS</span>
          <span class="font-monospace text-slate-600">{{ promptCounter }} / {{ totalRounds }} CARDS</span>
        </div>
        <v-progress-linear
          :model-value="progressValue"
          height="8"
          color="indigo"
          bg-color="slate-100"
          rounded
        />
      </div>

      <v-card variant="flat" border class="pa-4 bg-slate-50 border-slate-200 rounded-xl">
        <div class="text-overline text-center font-weight-black text-slate-400 tracking-widest d-block mb-3">
          Teacher Controls
        </div>
        <div class="d-flex justify-center flex-wrap ga-3">
          <v-btn 
            color="success" 
            variant="elevated" 
            size="large" 
            min-width="140"
            class="font-weight-black rounded-lg text-none"
            prepend-icon="mdi-check-circle"
            @click="evaluate('right')"
          >
            Correct
          </v-btn>
          
          <v-btn 
            color="error" 
            variant="elevated" 
            size="large" 
            min-width="140"
            class="font-weight-black rounded-lg text-none"
            prepend-icon="mdi-close-circle"
            @click="evaluate('wrong')"
          >
            Incorrect
          </v-btn>
          
          <v-btn 
            color="grey-darken-2" 
            variant="flat" 
            size="large" 
            min-width="140"
            class="text-white font-weight-black rounded-lg text-none"
            prepend-icon="mdi-help-circle-outline"
            @click="evaluate('unclear')"
          >
            Unsure
          </v-btn>
        </div>
      </v-card>
      
      <div class="d-flex justify-center mt-6">
        <v-btn icon elevation="0" size="x-large" :to="{ name: 'teacher-tools' }">
          <v-icon size="x-large" color="black">
            mdi-arrow-left-circle
          </v-icon>
        </v-btn>
      </div>
    </div>

    <div v-else class="text-center w-100" style="max-width: 600px;">
      <v-card variant="flat" border class="pa-6 rounded-xl border-slate-200 bg-white">
        <div class="text-overline font-weight-black text-slate-400 tracking-widest mb-1">Session Complete</div>
        <h2 class="text-h4 font-weight-black text-grey mb-6">Evaluation Results</h2>

        <v-row dense class="mb-6">
          <v-col cols="12">
            <v-card variant="flat" class="pa-4 rounded-xl bg-slate-50 border d-flex align-center justify-space-between">
              <span class="text-subtitle-2 font-weight-bold text-slate-500">Accuracy</span>
              <span class="text-h4 font-weight-black font-monospace text-slate-900">{{ score }}%</span>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card variant="flat" border class="pa-3 rounded-lg border-emerald-100 bg-emerald-50/30 text-center">
              <div class="text-emerald-700 font-weight-black text-h5">{{ rightCount }}</div>
              <div class="text-xs font-weight-bold text-emerald-600 uppercase tracking-wide">Correct</div>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card variant="flat" border class="pa-3 rounded-lg border-rose-100 bg-rose-50/30 text-center">
              <div class="text-rose-700 font-weight-black text-h5">{{ wrongCount }}</div>
              <div class="text-xs font-weight-bold text-rose-600 uppercase tracking-wide">Incorrect</div>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card variant="flat" border class="pa-3 rounded-lg border-slate-200 bg-slate-50 text-center">
              <div class="text-slate-700 font-weight-black text-h5">{{ unclearCount }}</div>
              <div class="text-xs font-weight-bold text-slate-500 uppercase tracking-wide">Unsure</div>
            </v-card>
          </v-col>
        </v-row>

        <div v-if="flaggedPrompts.length" class="text-left mb-6">
          <div class="text-overline font-weight-black text-rose-500 tracking-wider mb-2 d-flex align-center">
            <v-icon icon="mdi-alert-circle-outline" size="small" class="mr-1" />
            Wrong answers (Needs Review)
          </div>
          <v-card variant="flat" border max-height="200" class="overflow-y-auto rounded-lg border-slate-200 bg-slate-50 pa-1">
            <v-card-text class="pa-0">
              <v-list density="compact" bg-color="transparent">
                <v-list-item v-for="(p, i) in flaggedPrompts" :key="i" class="px-3 min-height-dense">
                  <template v-slot:prepend>
                    <v-icon icon="mdi-close" color="rose-500" size="14" class="mr-2" />
                  </template>
                  <span class="text-caption font-weight-medium text-slate-700">
                    {{ props.game === "Balanced Opinions" ? `${p.category}: ${p.question}` : p.question }}
                  </span>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </div>

        <v-divider class="mb-6 border-slate-200" />

        <div class="d-flex flex-column sm-flex-row ga-3 justify-center">
          <v-btn 
            color="indigo-darken-1" 
            size="large" 
            class="text-white font-weight-black rounded-xl text-none"
            prepend-icon="mdi-refresh"
            @click="resetGame"
          >
            Replay Same Student
          </v-btn>
          <v-btn 
            variant="outlined" 
            color="grey-darken-2" 
            size="large" 
            block
            class="font-weight-black rounded-xl text-none"
            prepend-icon="mdi-account-switch"
            :to="{ name: 'teacher-tools' }"
          >
            Back to Teacher Tools
          </v-btn>
        </div>
      </v-card>
    </div>

  </v-container>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="1000" min-width="120" class="text-center">
    <span class="font-weight-black font-monospace text-subtitle-2 tracking-widest uppercase">{{ snackbar.message }}</span>
  </v-snackbar>

  <v-dialog v-model="saving" persistent width="160">
    <v-card class="d-flex justify-center align-center pa-6 rounded-xl border border-slate-100 shadow-xl bg-white">
      <v-progress-circular indeterminate size="44" width="4" color="indigo" />
      <span class="text-xxs font-weight-black tracking-widest text-slate-400 mt-3 uppercase">Saving Log</span>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import api from "@/axios"

const props = defineProps<{
  game: "Spelling bee" | "Pronunciation Challenge" | "Prove it!" | "Be Polite!" | "Balanced Opinions" | "Unfinished Business" | "Verb Mixer Classroom Edition"
  student: string
}>()

// --------------------------
// STATE MANAGEMENT & DATA DEFINITIONS KEYS
// --------------------------
const BANNERS = {
  "Spelling bee": "/images/banners/SpellingBee.png",
  "Pronunciation Challenge": "/images/banners/PronunciationChallenge.png",
  "Prove it!": "/images/banners/ProveIt.png",
  "Be Polite!": "/images/banners/BePolite.png",
  "Balanced Opinions": "/images/banners/BalancedOpinions.png",
  "Unfinished Business": "/images/banners/UnfinishedBusiness.png",
  "Verb Mixer Classroom Edition": "/images/banners/VerbMixer.png",
}

const selectedCategory = ref<string>("") 
const prompt = ref<{ question: string; verb: string; correctAnswers: string[]; category: string } | null>(null)
const gameStarted = ref(false)
const gameComplete = ref(false)

const rightCount = ref(0)
const wrongCount = ref(0)
const unclearCount = ref(0)
const hasAnyAnswer = ref(false)
const saving = ref(false)
const promptCounter = ref(0)

const wrongPrompts = ref<string[]>([])
const promptQueue = ref<{ question: string; verb: string; correctAnswers: string[]; category: string }[]>([])
const shownPrompts = ref<{ question: string; verb: string; correctAnswers: string[]; category: string; is_correct: boolean | null }[]>([])

const totalRounds = computed(() =>
  props.game === "Balanced Opinions" ? 12 : props.game === "Unfinished Business" ? 24 : props.game === "Verb Mixer Classroom Edition" ? 28 : 30
)
const remainingCount = ref(totalRounds.value)
const snackbar = reactive({ show: false, message: "", color: "success" })

// Animations configurations variables
const animationClass = ref("")
let slideTimeout: ReturnType<typeof setTimeout> | null = null
const progressValue = computed(() => (promptCounter.value / totalRounds.value) * 100)

// Countdown timer configurations mapping parameters
const useTimer = ref(false)
const timeLeft = ref(10)
let timerInterval: ReturnType<typeof setInterval> | null = null
const timerProgress = computed(() => (timeLeft.value / 10) * 100)
const score = computed(() => rightCount.value !== 0 ? ((rightCount.value / totalRounds.value) * 100).toFixed(1) : 0)

// --------------------------
// GAME DATA 
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
    "Balanced Opinions": {
    description: "Practice giving balanced opinions with contrast/linking words.",
    instructions:
      "A card will show a linking word and a controversial topic. The student must give a balanced opinion aloud (pros + cons). The teacher validates the response.",
    prompts: {
      linking_words: [
        "However",
        "That being said",
        "Nevertheless",
        "Nonetheless",
        "Still",
        "And yet",
        "Although",
        "Even though",
        "Though",
        "Despite",
        "In spite of",
        "While",
        "Whereas",
        "On the other hand"
      ],
      topics: [
        "Nuclear Power",
        "Bitcoin",
        "Bullfighting",
        "Smoking",
        "Alcohol",
        "Marijuana",
        "Plant-based meat",
        "Tesla cars",
        "Low taxes",
        "Artificial Intelligence",
        "Social Media",
        "McDonald's",
        "Temu",
        "Working from home (Home office)",
        "Living in a shared apartment (with roomates)",
        "Living with your parents",
        "Basejumping",
        "Paragliding",
        "Off-piste skiing",
        "F1 racing",
        "Golf",
        "Curling",
        "Animals in the zoo",
        "Eating meat",
        "Living in Fribourg",
        "Living in a big city",
        "Living in the countryside",
        "Online education",
        "Space exploration",
        "Genetic engineering",
        "Cloning",
        "Ice cream",
        "Growing up in Switzerland",
        "Going to the military service",
        "Being a professional athlete",
        "Being a YouTuber",
        "Having a pet",
        "Allowing children to play video games",
        "Allowing pre-teens to have a smartphone",
        "Going to Scotland for a holiday",
        "Going to Venice for a holiday",
        "Having kids",
        "Being a farmer",
        "Being a doctor",
        "Being an entrepreneur (having your own company)",
        "Going to Sweden for a holiday",
        "Going to Brazil for a holiday",
        "Studying your bachelor's degree part-time while working",
      ]
    }
  },
  "Unfinished Business": {
  description: "Practice talking about activities in finished vs unfinished time references and irregular verbs.",
  instructions:
    "A card will show an irregular verb (infinitive) and a time reference. The student must respond orally (teacher validates).",
  prompts: {
    time_references: [
      "yesterday",
      "last night",
      "2 days ago",
      "in 1999",
      "in 2023",
      "when I was a child",
      "when I was growing up",
      "last summer",
      "last month",
      "as a child",
      "in my life",
      "since 2020",
      "for 5 years",
      "for 2 years",
      "already",
      "never (in my life)",
      "so far (in my life)",
      "so far (this year)",
      "this year",
      "this week",
      "today",
      "just",
      "recently",
      "lately"
    ]
  }
},
"Verb Mixer Classroom Edition": {
  description: "Practice choosing the right verb complement (infinitive vs -ing)",
  instructions: "A card will show a question. Answer the question using the correct verb form (infinitive or -ing) as a verb complement.",
  prompts: {
    "infinitive_verb": [
      "What do you promise?",
      "What do you refuse?",
      "What did you manage?",
      "What are you planning?",
      "What do you deserve?",
      "What did you agree __________?",
      "What do you tend ____________ in the evenings?",
      "What did you choose ____________ yesterday?",
      "What do you sometimes pretend ____________?",
      "Is there something you hope ____________ this year?",
      "Is there something you can't wait ____________?",
      "What did you offer ____________ ?",
      "What do you wish ____________ for your next birthday?",
      "What do you remind your colleagues ____________?",
      "What did you persuade someone _________?",
      "What do you expect ____________ in the future?",
      "What will you never learn ____________?"    
    ],
    "adjective": [
      "I think linear algebra is difficult ___________ .",
      "I find German easy ____________ .",
      "I consider this exercise important ____________ .",
      "I feel motivated ____________ .",
      "I think world peace is hard ____________ .",
      "I think history is interesting ____________ .",
    ],
    "bare_infinitive": [
      "What did your parents make you __________ as a kid?",
      "What did your parents let you __________ as a kid?",
      "What does the teacher make you __________ in class?",
      "What does the teacher let you __________ in class?",
    ],
    "-ing_verb": [
      "What do you suggest?",
      "What do you recommend?",
      "What do you regret?",
      "What will you finish today?",
      "What do you admit?",
      "Which activity do you avoid?",
      "Which activity can you NOT imagine ________?",
      "What will you stop ________?",
      "Which activity don't you mind?",
      "What must you keep ________?",
      "What do you enjoy ?",
      "What do you dislike ?",
      "If I left Switzerland, I would miss  ________ ",
      "I would never risk _________",
      "I want to quit ________",
      "I will never quit ________",
      "I can't stand ________",
      "I have to keep ________",
      "I have to practice ________",
      "My parents enjoy ________",
      "My parents dislike ________",
    ],
    "special_expression": [
      "What are you not looking forward to?",
      "What will you never get used to?",
      "In the last few years, what did you get used to?",
      "What do you look forward to?",
      "Which unpleasant task are you used to?",
      "What are you still not used to?",
      "What hard activity are you used to?"
    ],
    "preposition": [
      "What are you good at?",
      "What are you bad at?",
      "What are you focused on?",
      "What are you working on?",
      "What did you apologize for?",
      "What are you interested in?",
      "What are you tired of?",
      "What are you sorry for?",
      "What do you dream about?",
      "I like to eat after ____________ (activity)",
      "I like to do sports before ____________ (activity)",
      "I like to go out after ____________ (activity)",
    ],
    "subject": [
      "______________ is unhealthy.",
      "______________ is fun.",
      "______________ is difficult.",
      "______________ is good exercise.",
    ],
    "change_in_meaning": [
      "What do you remember _____________ when you were a kid?",
      "What do you have to remember ____________? (an important task you mustn't forget)",
      "What will you never forget ____________? (a memorable experience)",
      "What is something you cannot forget ____________? (a future obligation you need to remember)",
    ]
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
// GAME PROCESSING CORE LOGIC
// --------------------------
function startGame() {
  if (props.game === "Prove it!" && !selectedCategory.value) {
    snackbar.message = "Please select a target vocabulary matrix category first"
    snackbar.color = "error"
    snackbar.show = true
    return
  }
  gameStarted.value = true
  gameComplete.value = false
  buildPromptQueue()
  loadNextPrompt()
}

function buildPromptQueue() {
  const dataset = props.game === "Prove it!" ? gameData[selectedCategory.value] : gameData[props.game]
  if (!dataset) return

  if (props.game === "Unfinished Business") {
    const essentials = gameData["Essential irregulars past simple"]
    if (!essentials?.prompts) return
    const verbs = shuffle(Object.keys(essentials.prompts))
    const timeRefs = dataset.prompts.time_references as string[]
    const queue: typeof promptQueue.value = []
    const rounds = Math.min(totalRounds.value, verbs.length)

    for (let i = 0; i < rounds; i++) {
      const verb = verbs[i]
      const timeRef = timeRefs[Math.floor(Math.random() * timeRefs.length)]
      queue.push({ question: `${verb}`, verb, correctAnswers: [], category: `${timeRef}` })
    }
    promptQueue.value = queue
    return
  }

  if (props.game === "Balanced Opinions") {
    const linkingWords = shuffle(dataset.prompts.linking_words)
    const topics = shuffle(dataset.prompts.topics)
    const rounds = totalRounds.value
    const queue: typeof promptQueue.value = []
    for (let i = 0; i < rounds; i++) {
      const link = linkingWords[i]
      const topic = topics[i]
      queue.push({ question: `${topic}`, verb: topic, correctAnswers: [], category: link })
    }
    promptQueue.value = queue
    return
  }

  if (props.game === "Verb Mixer Classroom Edition") {
    const queue: typeof promptQueue.value = []
    const distribution: Record<string, number> = {
      "infinitive_verb": 6, "adjective": 2, "bare_infinitive": 3, "-ing_verb": 6,
      "special_expression": 4, "preposition": 3, "change_in_meaning": 3, "subject": 1,
    }

    for (const [category, count] of Object.entries(distribution)) {
      const values = (dataset.prompts as Record<string, string[]>)[category]
      if (!Array.isArray(values) || values.length === 0) continue
      const shuffled = shuffle(values)
      for (let i = 0; i < count; i++) {
        const q = shuffled[i % shuffled.length]
        queue.push({ question: q, verb: category, correctAnswers: [], category: category })
      }
    }
    promptQueue.value = shuffle(queue).slice(0, totalRounds.value)
    return
  }

  const queue: typeof promptQueue.value = []
  Object.entries(dataset.prompts).forEach(([key, values]) => {
    if (selectedCategory.value.includes("present perfect")) {
      queue.push({ question: values[1], verb: key, correctAnswers: [values[0]], category: key })
      return
    }
    if (selectedCategory.value.includes("past simple")) {
      const q = values[Math.floor(Math.random() * values.length)]
      queue.push({ question: q, verb: key, correctAnswers: [key], category: key })
      return
    }
    values.forEach(v => {
      queue.push({ question: v, verb: key, correctAnswers: [v], category: key })
    })
  })
  promptQueue.value = shuffle(queue).slice(0, totalRounds.value)
}

function animateSlide() {
  animationClass.value = "slide-out-left"
  slideTimeout && clearTimeout(slideTimeout)
  slideTimeout = setTimeout(() => {
    animationClass.value = "slide-in-right"
    setTimeout(() => {
      animationClass.value = "slide-in-final"
      setTimeout(() => (animationClass.value = ""), 250)
    }, 30)
  }, 200)
}

function loadNextPrompt() {
  if (!promptQueue.value.length || promptCounter.value >= totalRounds.value) {
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

  const shouldAppendCategory = props.game === "Prove it!" && selectedCategory.value.includes("present perfect")
  const finalQuestion = shouldAppendCategory ? `${prompt.value.question} (${prompt.value.category})` : prompt.value.question

  shownPrompts.value.push({
    question: finalQuestion,
    verb: prompt.value.verb,
    correctAnswers: prompt.value.correctAnswers,
    category: prompt.value.category,
    is_correct: type === "right" ? true : type === "wrong" ? false : null,
  })

  if (type === "right") rightCount.value++
  else if (type === "wrong") wrongCount.value++
  else unclearCount.value++

  snackbar.message = type === "right" ? "Correct" : type === "wrong" ? "Incorrect" : "Passed"
  snackbar.color = type === "right" ? "success" : type === "wrong" ? "error" : "slate-600"
  snackbar.show = true
  loadNextPrompt()
}

const flaggedPrompts = computed(() => shownPrompts.value.filter(p => p.is_correct !== true))

function resetCounts() {
  promptCounter.value = 0
  remainingCount.value = totalRounds.value
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

const gameNameAbbreviations: Record<string, string> = {
  "Essential irregulars past simple": "EssPS",
  "Advanced irregulars past simple": "AdvPS",
  "Essential irregulars present perfect": "EssPP",
  "Advanced irregulars present perfect": "AdvPP",
}

const updatedGameName = computed(() => {
  if (props.game === "Prove it!" && selectedCategory.value) {
    const abbreviation = gameNameAbbreviations[selectedCategory.value as keyof typeof gameNameAbbreviations]
    return `Prove it! >> ${abbreviation || selectedCategory.value}`
  }
  return props.game
})

async function endGame() {
  stopTimer()
  if (!hasAnyAnswer.value) {
    gameComplete.value = false
    gameStarted.value = false
    return
  }
  gameComplete.value = true
  saving.value = true

  const rounds = shownPrompts.value.map((r, index) => ({
    question: props.game === "Balanced Opinions" ? `${r.category}: ${r.question}` : r.question,
    pronoun: null, image: null, label: r.verb, correct_answer: r.correctAnswers, prompt_number: index + 1,
    user_answer: null, is_correct: r.is_correct, out_of_time: false, elapsed_time: null, typo: false, typo_requested: false, typo_accepted: null,
  }))

  const payload = {
    game_name: updatedGameName.value, student_web_id: props.student, total_rounds: totalRounds.value,
    correct_count: rightCount.value, wrong_count: wrongCount.value, started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(), total_time: 0, avg_time_per_prompt: 0, rounds,
  }

  try {
    await api.post("/other-games-sessions/", payload, { headers: { "Content-Type": "application/json" } })
  } catch (err) {
    console.error("Saving failed:", err)
  }
  saving.value = false
  gameStarted.value = false
}
</script>

<style scoped>
/* Max width box constraint balancing viewport sizes */
.max-width-game-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 🌟 The Polished Flashcard Presentation Layer Rules */
.game-viewport-card-wrapper {
  position: relative;
  width: 100%;
  perspective: 1000px; /* Enables 3D canvas depths for translation swiping */
}

.slide-card {
  width: 100%;
  max-width: 720px;
  height: 340px;
  background-color: #ffffff !important;
  border-color: #e2e8f0 !important;
  transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.25s ease;
  will-change: transform, opacity;
}

/* Reusable layout centering utilities */
.layout-flex-center {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Typography Scales Overrides for Visibility from Back rows */
.flashcard-main-display-text {
  font-size: 2.75rem !important;
  line-height: 1.25 !important;
  padding: 0 24px;
  text-align: center;
  word-break: break-word;
}

.flashcard-sub-display-text {
  font-size: 1rem !important;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.card-pill-badge-header {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
}

/* Softened Motion Animation Frames Curves */
.slide-out-left {
  transform: translateX(-100%) rotate(-4s);
  opacity: 0;
}

.slide-in-right {
  transform: translateX(100%) rotate(4s);
  opacity: 0;
}

.slide-in-final {
  transform: translateX(0) rotate(0deg);
  opacity: 1;
}

/* Custom CSS layout formatting for pill selection grids */
.custom-pill-radio-group :deep(.v-selection-control) {
  margin-inline-end: 0 !important;
}
.custom-pill-radio-group :deep(.v-label) {
  display: none !important; /* Hide native layout label tokens */
}

/* Utility layout resets */
.min-height-dense {
  min-height: 32px !important;
}
.leading-tight {
  line-height: 1.25 !important;
}
.line-height-sm {
  line-height: 1.4 !important;
}
</style>