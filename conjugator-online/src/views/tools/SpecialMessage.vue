<template>
  <v-container
    fluid
    class="pa-6 max-width-game-container min-vh-80 d-flex align-center justify-center"
  >
    <!-- START SCREEN -->
    <div
      v-if="!gameStarted && !gameComplete"
      class="text-center w-100"
      style="max-width: 680px;"
    >
      <v-card
        variant="flat"
        border
        class="pa-6 rounded-xl bg-slate-50 border-slate-200"
      >
        <div class="d-flex justify-center mb-4">
            <v-img src="/images/banners/SpecialMessage.png" class="tile-image" cover max-width="400" />
            </div>

        <p class="text-h6 font-weight-bold text-indigo mb-1">
          Special Message Challenge
        </p>
        <span class="text-caption text-slate-400 d-block mb-6">
          Self-Guided Practice
        </span>

        <v-divider class="mb-6 border-slate-200" />

        <v-card
          variant="flat"
          border
          class="pa-4 bg-white border-slate-200 rounded-lg text-left mb-6"
        >
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 font-weight-bold text-slate-800">
                Time Pressure
              </div>
              <div class="text-caption text-slate-400">
                Max. 15 seconds per round!
              </div>
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
          block
          color="indigo-darken-1"
          size="large"
          elevation="1"
          class="text-white font-weight-black rounded-xl text-none"
          @click="startGame"
        >
          Start Practice
        </v-btn>
      </v-card>
    </div>

    <!-- GAME -->
    <div
      v-else-if="gameStarted"
      class="w-100 py-2"
      style="max-width: 850px;"
    >
      <div
        class="d-flex align-center justify-space-between mb-3 px-2 ga-2"
      >
        <div v-if="useTimer" class="d-flex align-center">
          <v-progress-circular
            :model-value="timerProgress"
            :size="42"
            :width="4"
            :color="timeLeft <= 4 ? 'error' : 'indigo'"
            class="font-weight-black font-monospace text-caption"
          >
            {{ timeLeft }}
          </v-progress-circular>
        </div>
      </div>

      <div class="d-flex justify-center mb-3">
        <v-chip
          link
          color="indigo-darken-1"
          variant="tonal"
          class="font-weight-black px-4 py-2 text-none rounded-xl tracking-wide tap-hint-badge"
          prepend-icon="mdi-rotate-3d-variant"
          @click.stop="isFlipped = !isFlipped"
        >
          {{ isFlipped ? 'Click card to see question' : 'Click card to flip & check answer' }}
        </v-chip>
      </div>

      <!-- CLICKABLE FLIP CARD -->
      <div
        class="flashcard-scene"
        role="button"
        tabindex="0"
        @click="isFlipped = !isFlipped"
        @keydown.enter.prevent="isFlipped = !isFlipped"
        @keydown.space.prevent="isFlipped = !isFlipped"
      >
        <div class="flashcard-card" :class="{ 'is-card-flipped': isFlipped }">
          <!-- FRONT -->
          <div class="flashcard-face flashcard-front">
            <div class="flashcard-surface mx-auto rounded-2xl border border-slate-200 overflow-hidden elevation-4 bg-white">
              <v-row no-gutters class="fill-height">
                <v-col
                  cols="12"
                  md="8"
                  class="pa-6 pa-md-8 bg-white d-flex flex-column justify-center align-center text-center fill-height"
                >
                  <div class="text-subtitle-2 font-weight-medium text-slate-400 tracking-widest mb-8">
                    Form a sentence using correlatives and/or inversion:
                  </div>

                  <div class="mb-3">
                    <v-chip
                      class="bg-green-darken-1 text-white font-weight-medium p-2 shadow-sm text-wrap rounded"
                    >
                      {{ prompt?.category }}
                    </v-chip>
                  </div>

                  <div class="prompt-display mb-4">
                    {{ prompt?.question }}
                  </div>

                  <div class="text-caption text-slate-400">
                    Tap the card to reveal the correct structure
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                  class="pa-6 bg-slate-50 border-s border-slate-100 d-flex flex-column justify-center"
                >
                  <div class="text-overline font-weight-bold text-slate-400 tracking-widest mb-2">
                    Pattern
                  </div>

                  <div class="mb-3">
                    <div
                      class="bg-green-darken-1 text-white font-weight-medium p-2 shadow-sm text-wrap rounded"
                    >
                      {{ prompt?.category }}
                    </div>
                  </div>

                  <!-- INVERSION NEEDED CHIP -->
                  <div
                    v-if="prompt?.category && inversionCategories.includes(prompt.category)"
                    class="mb-4"
                  >
                    <v-chip
                      color="amber-darken-3"
                      variant="flat"
                      size="small"
                      class="font-weight-bold text-white uppercase tracking-wider"
                      prepend-icon="mdi-swap-horizontal"
                    >
                      Inversion needed
                    </v-chip>
                  </div>

                  <div class="text-overline font-weight-bold text-slate-400 tracking-widest mb-2">
                    Round
                  </div>

                  <div class="text-h6 font-weight-black text-slate-800 font-monospace">
                    {{ promptCounter }} / {{ totalRounds }}
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>

          <!-- BACK -->
          <div class="flashcard-face flashcard-back">
            <div class="flashcard-surface mx-auto rounded-2xl border border-slate-200 overflow-hidden elevation-4 bg-slate-50 pa-6 d-flex flex-column justify-center">
              <div class="text-center w-100" style="max-width: 600px; margin: 0 auto;">
                <v-card
                  variant="flat"
                  border
                  class="pa-5 bg-indigo-50 border-indigo-200 rounded-xl text-center mb-3"
                  @click.stop
                >
                  <span class="text-xxs font-weight-black text-indigo-700 uppercase tracking-wider d-block mb-2">
                    Suggested Response
                  </span>
                  <p class="text-h6 font-weight-bold text-slate-900 leading-normal mb-0">
                    {{ prompt?.answer }}
                  </p>
                </v-card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTROLS -->
      <v-row class="mt-4 align-center px-1" dense>
        <v-col cols="4" class="text-left">
          <div class="text-caption font-weight-bold text-slate-400 tracking-wider uppercase">
            Progress:
            <span class="font-monospace text-slate-700 font-weight-black ml-1">
              {{ promptCounter }} / {{ totalRounds }}
            </span>
          </div>
        </v-col>

        <v-col cols="8" class="text-right d-flex justify-end ga-2">
          <v-btn
            variant="outlined"
            color="indigo"
            class="rounded-xl font-weight-black text-none"
            size="large"
            prepend-icon="mdi-rotate-3d-variant"
            @click.stop="isFlipped = !isFlipped"
          >
            Flip Card
          </v-btn>

          <v-btn
            color="indigo"
            size="large"
            class="text-white font-weight-black rounded-xl text-none px-6"
            append-icon="mdi-arrow-right"
            @click.stop="next"
          >
            Next Card
          </v-btn>
        </v-col>

        <v-col cols="12" class="mt-2">
          <v-progress-linear
            :model-value="progressValue"
            height="6"
            color="indigo"
            bg-color="slate-100"
            rounded
          />
        </v-col>
      </v-row>
    </div>

    <!-- END -->
    <div
      v-else
      class="text-center w-100"
      style="max-width: 500px; margin-top: 10vh;"
    >
      <v-card variant="flat" border class="pa-6 rounded-xl border-slate-200 bg-white">
        <v-avatar color="indigo-lighten-5" size="64" class="mb-4">
          <v-icon icon="mdi-emoticon-happy-outline" color="indigo" size="32" />
        </v-avatar>

        <h2 class="text-h5 font-weight-black text-slate-800 mb-2">
          Practice Session Finished!
        </h2>
        <p class="text-caption text-slate-400 mb-6">
          Great job practicing special sentences with correlatives and inversions!
        </p>

        <v-divider class="mb-6" />

        <v-btn
          block
          color="indigo"
          size="large"
          class="text-white font-weight-black rounded-xl text-none"
          @click="resetGame"
        >
          Practice Again
        </v-btn>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from "vue"

/* ================= INVERSION LIST ================= */
const inversionCategories: string[] = [
  "Just as... so...",
  "Not only... but also...",
  "Not until",
  "Never",
  "Rarely",
  "Only when",
  "Hardly... when...",
  "No sooner... than...",
  "Scarcely... when..."
]

/* ================= DATASET ================= */
type PromptItem = {
  question: string
  answer: string
}

type ActivityCategory = {
  description: string
  instructions: string
  prompts: Record<string, PromptItem[]>
}

const DATA: Record<string, ActivityCategory> = {
  "Special Message": {
    description: "Use correlatives and inversion to create special sentences",
    instructions: "Create a special sentence using correlatives and/or inversion.",
    prompts: {
      "Either... or...": [
        { question: "We ship the product this month // The project will fail", answer: "Either we ship the product this month, or the project will fail." },
        { question: "We talk to our suppliers // The launch will be delayed", answer: "Either we talk to our suppliers, or the launch will be delayed." },
        { question: "We update our strategy // We will lose the election", answer: "Either we update our strategy, or we will lose the election." },
        { question: "We start listening to feedback // We will lose touch with our customers", answer: "Either we start listening to feedback, or we will lose touch with our customers." },
        { question: "We finalize the report today // The bid will be rejected", answer: "Either we finalize the report today, or the bid will be rejected." },
        { question: "Someone fixes the issue // The project will be cancelled", answer: "Either someone fixes the issue, or the project will be cancelled." },
        { question: "We negotiate a solution now // We will have a long-term problem", answer: "Either we negotiate a solution now, or we will have a long-term problem." }
      ],
      "This is both... and...": [
        { question: "A fascinating experiment // a practical application", answer: "This is both a fascinating experiment and a practical application." },
        { question: "An innovative approach // a reliable method", answer: "This is both an innovative approach and a reliable method." },
        { question: "A challenging problem // a simple solution", answer: "This is both a challenging problem and a simple solution." },
        { question: "A high-risk investment // A legally-complicated venture", answer: "This is both a high-risk investment and a legally-complicated venture." },
        { question: "A groundbreaking discovery // a new way of thinking", answer: "This is both a groundbreaking discovery and a new way of thinking." }
      ],
      "Just as... so...": [
        { question: "Richard became a hero // you can help your community", answer: "Just as Richard became a hero, so can you help your community." },
        { question: "Rose solved the problem // you can find a solution too", answer: "Just as Rose solved the problem, so can you find a solution too." },
        { question: "Tom achieved success // you can reach your goals as well", answer: "Just as Tom achieved success, so can you reach your goals." },
        { question: "Nike changed marketing // your startup can innovate too", answer: "Just as Nike changed marketing, so can your startup innovate." },
        { question: "Individuals look for opportunities // Nations need new export markets", answer: "Just as individuals look for opportunities, so do nations need new export markets." },
        { question: "My company embraced change // your team can adapt as well", answer: "Just as my company embraced change, so can your team adapt." }
      ],
      "Not only... but also...": [
        { question: "She is talented // she is hardworking", answer: "Not only is she talented, but she is also hardworking." },
        { question: "The project is challenging // it is rewarding", answer: "Not only is the project challenging, but it is also rewarding." },
        { question: "The company is innovative // it is socially responsible", answer: "Not only is the company innovative, but it is also socially responsible." },
        { question: "The strategy is effective // it is sustainable", answer: "Not only is the strategy effective, but it is also sustainable." },
        { question: "The team is diverse // it is collaborative", answer: "Not only is the team diverse, but it is also collaborative." },
        { question: "The product is top quality // it is affordable", answer: "Not only is the product top quality, but it is also affordable." },
        { question: "The service is efficient // it is customer-friendly", answer: "Not only is the service efficient, but it is also customer-friendly." },
        { question: "The initiative is ambitious // it is well-supported", answer: "Not only is the initiative ambitious, but it is also well-supported." },
        { question: "The market can be accessed // it is profitable", answer: "Not only can the market be accessed, but it is also profitable." },
        { question: "The technology is advanced // it is user-friendly", answer: "Not only is the technology advanced, but it is also user-friendly." },
        { question: "We will conquer the market // expand to new sectors", answer: "Not only will we conquer the market, but we will also expand to new sectors." },
        { question: "We will improve our skills // we will achieve great results", answer: "Not only will we improve our skills, but we will also achieve great results." }
      ],
      "Whether... or...": [
        { question: "working // relaxing >>> the airpods are for you", answer: "Whether you are working or relaxing, the AirPods are for you." },
        { question: "starting a company // managing your household >>> this budgeting tool is a game changer", answer: "Whether you are starting a company or managing your household, this budgeting tool is a game changer." },
        { question: "exercising // relaxing >>> this fitness app is perfect for you", answer: "Whether you are exercising or relaxing, this fitness app is perfect for you." },
        { question: "training with friends // exercising alone >>> this workout plan suits everyone", answer: "Whether you are training with friends or exercising alone, this workout plan suits everyone." },
        { question: "working from home // going to the office >>> this productivity tool makes life easier", answer: "Whether you are working from home or going to the office, this productivity tool makes life easier." },
        { question: "decorating your home // enhancing your office >>> the super-table is perfect for you", answer: "Whether you are decorating your home or enhancing your office, the super-table is perfect for you." },
        { question: "reading a book // watching a movie >>> this cozy blanket is ideal for both activities", answer: "Whether you are reading a book or watching a movie, this cozy blanket is ideal for both activities." },
        { question: "cooking at home // dining out >>> this recipe book is perfect for you", answer: "Whether you are cooking at home or dining out, this recipe book is perfect for you." },
        { question: "building at home // working on a construction site >>> this toolkit is perfect for real builders", answer: "Whether you are building at home or working on a construction site, this toolkit is perfect for real builders." }
      ],
      "Rarely": [
        { question: "you see such talent", answer: "Rarely do you see such talent." },
        { question: "you find such opportunities", answer: "Rarely do you find such opportunities." },
        { question: "you can experience such moments", answer: "Rarely can you experience such moments." },
        { question: "you will have such a clear opportunity", answer: "Rarely will you have such a clear opportunity." },
        { question: "you can make a difference in so many people's lives", answer: "Rarely can you make a difference in so many people's lives." },
        { question: "you can impact so many people", answer: "Rarely can you impact so many people." },
        { question: "you meet such inspiring individuals", answer: "Rarely do you meet such inspiring individuals." },
        { question: "I have seen such remarkable achievements", answer: "Rarely have I seen such remarkable achievements." },
        { question: "I have seen so much talent in a room", answer: "Rarely have I seen so much talent in a room." },
        { question: "I have rarely seen such dedication", answer: "Rarely have I seen such dedication." },
        { question: "you find such commitment to the project", answer: "Rarely do you find such commitment to the project." }
      ],
      "Not until": [
        { question: "you try it yourself // you will understand", answer: "Not until you try it yourself will you understand." },
        { question: "you see the results // you will realize the potential", answer: "Not until you see the results will you realize the potential." },
        { question: "you experience it firsthand // you will understand its value", answer: "Not until you experience it firsthand will you understand its value." },
        { question: "you see it in person // it clicks for you", answer: "Not until you see it in person will it click for you." },
        { question: "you witness it firsthand // you realize how life-changing it is", answer: "Not until you witness it firsthand will you realize how life-changing it is." },
        { question: "you take the necessary steps // you will achieve success", answer: "Not until you take the necessary steps will you achieve success." },
        { question: "you speak to Ella directly // you will see how great the project is", answer: "Not until you speak to Ella directly will you see how great the project is." },
        { question: "you try it out // you actually feel how good it is", answer: "Not until you try it out will you actually feel how good it is." },
        { question: "you go through the current process // you understand the pain points we are trying to remove", answer: "Not until you go through the current process will you understand the pain points we are trying to remove." },
        { question: "you reach the top // you appreciate the journey", answer: "Not until you reach the top will you appreciate the journey." },
        { question: "you get your first win // you realize your full potential", answer: "Not until you get your first win will you realize your full potential." }
      ],
      "Never": [
        { question: "I have seen such a thing", answer: "Never have I seen such a thing." },
        { question: "I have experienced such a moment", answer: "Never have I experienced such a moment." },
        { question: "I have encountered such a challenge", answer: "Never have I encountered such a challenge." },
        { question: "I have witnessed such dedication", answer: "Never have I witnessed such dedication." },
        { question: "I have found such commitment", answer: "Never have I found such commitment." },
        { question: "I have met such inspiring individuals", answer: "Never have I met such inspiring individuals." },
        { question: "I had imagined such success", answer: "Never had I imagined such success." },
        { question: "I have come across a friendlier person", answer: "Never have I come across a friendlier person." }
      ],
      "Only when": [
        { question: "you see the results // you understand the impact", answer: "Only when you see the results do you understand the impact." },
        { question: "you experience it firsthand // you realize its value", answer: "Only when you experience it firsthand do you realize its value." },
        { question: "you witness it directly // you comprehend its significance", answer: "Only when you witness it directly do you comprehend its significance." },
        { question: "you take the necessary steps // you achieve success", answer: "Only when you take the necessary steps do you achieve success." },
        { question: "you try it out // you feel its effectiveness", answer: "Only when you try it out do you feel its effectiveness." },
        { question: "you go through the process // you understand the challenges", answer: "Only when you go through the process do you understand the challenges." },
        { question: "you reach the top // you appreciate the journey", answer: "Only when you reach the top do you appreciate the journey." },
        { question: "you get your first win // you realize your full potential", answer: "Only when you get your first win do you realize your full potential." },
        { question: "you play with real money // you understand the stakes", answer: "Only when you play with real money do you understand the stakes." },
        { question: "you try it yourself // you can understand the challenge", answer: "Only when you try it yourself can you understand the challenge." }
      ]
    }
  }
}

/* ================= STATE ================= */
const gameStarted = ref(false)
const gameComplete = ref(false)
const promptCounter = ref(0)
const totalRounds = ref(30)

const prompt = ref<{ question: string; answer: string; category: string } | null>(null)
const queue = ref<Array<{ question: string; answer: string; category: string }>>([])
const isFlipped = ref(false)

/* TIMER */
const ROUND_TIME = 15

const useTimer = ref(false)
const timeLeft = ref(ROUND_TIME)
let timer: ReturnType<typeof setInterval> | null = null

const timerProgress = computed(() => (timeLeft.value / ROUND_TIME) * 100)
const progressValue = computed(() => (promptCounter.value / totalRounds.value) * 100)

/* ================= CORE ================= */

function weightedPool() {
  const pool: Array<{ question: string; answer: string; category: string }> = []

  Object.values(DATA).forEach((activity) => {
    Object.entries(activity.prompts).forEach(([categoryName, itemArray]) => {
      itemArray.forEach((item) => {
        pool.push({
          question: item.question,
          answer: item.answer,
          category: categoryName
        })
      })
    })
  })

  return pool
}

function buildQueue() {
  const pool = weightedPool()
  shuffle(pool)
  queue.value = pool.slice(0, totalRounds.value)
}

function startGame() {
  gameStarted.value = true
  gameComplete.value = false
  promptCounter.value = 0
  isFlipped.value = false
  buildQueue()
  next()
}

function next() {
  isFlipped.value = false

  if (!queue.value.length || promptCounter.value >= totalRounds.value) {
    stopTimer()
    gameStarted.value = false
    gameComplete.value = true
    return
  }

  prompt.value = queue.value.shift() ?? null
  promptCounter.value++

  if (useTimer.value) {
    startTimer()
  } else {
    stopTimer()
  }
}

function resetGame() {
  stopTimer()
  gameStarted.value = false
  gameComplete.value = false
  promptCounter.value = 0
  prompt.value = null
  queue.value = []
  isFlipped.value = false
  timeLeft.value = ROUND_TIME
}

/* ================= TIMER ================= */

function startTimer() {
  stopTimer()
  timeLeft.value = ROUND_TIME

  timer = setInterval(() => {
    timeLeft.value--

    if (timeLeft.value <= 0) {
      stopTimer()
      isFlipped.value = true
    }
  }, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onBeforeUnmount(stopTimer)

/* ================= UTILS ================= */

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
</script>

<style scoped>
.flashcard-scene {
  perspective: 1600px;
  cursor: pointer;
  outline: none;
  width: 100%;
}

.flashcard-card {
  position: relative;
  width: 100%;
  height: 340px;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  transition: transform 0.65s ease;
  will-change: transform;
}

.is-card-flipped {
  transform: rotateY(180deg);
}

.flashcard-face {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}

.flashcard-front {
  transform: rotateY(0deg);
}

.flashcard-back {
  transform: rotateY(180deg);
}

.flashcard-surface {
  width: 100%;
  height: 100%;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.prompt-display {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 700;
  line-height: 1.4;
  color: rgb(15, 23, 42);
  word-break: break-word;
}

.tap-hint-badge {
  box-shadow: 0 8px 18px rgba(79, 70, 229, 0.14);
}

.min-vh-80 {
  min-height: 80vh;
}
</style>