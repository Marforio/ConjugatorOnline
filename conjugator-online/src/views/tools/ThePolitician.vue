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
            <v-img src="/images/banners/ThePolitician.png" class="tile-image" cover max-width="400" />
            </div>

        <p class="text-h6 font-weight-bold text-indigo mb-1">
          Cleft Sentence Challenge
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
                  <div class="text-overline font-weight-bold text-slate-400 tracking-widest mb-3">
                    Form a cleft sentence using the prompt:
                  </div>

                  <div class="cleft-prompt-display mb-4">
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

                  <div class="mb-5">
                    <div
                      class="bg-green-darken-1 text-white font-weight-medium p-2 shadow-sm text-wrap"
                    >
                      {{ prompt?.category }}
                  </div>
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
          Great job practicing your cleft sentence structures!
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

/* ================= DATASET ================= */
type SubCategory = {
  weight: number
  prompts: Record<string, string>
}

type ActivityCategory = {
  description: string
  instructions: string
  prompts: Record<string, SubCategory>
}

const DATA: Record<string, ActivityCategory> = {
  "The Politician": {
    description: "Use cleft sentences to add clarity to your statements",
    instructions: "Answer the question using a cleft sentence structure.",
    prompts: {
      "What... or All...": {
        weight: 1,
        prompts: {
          "What does the project need? [clear direction]": "What the country needs is clear direction",
          "What do you love about our country? [its people]": "What I love about our country is its people",
          "What do you want for the nation? [prosperity and peace]": "What I want for the nation is prosperity and peace",
          "What do people have to do to make a difference? [vote on election day]": "All that (What) people have to do is vote on election day",
          "What do we need to improve the project? [define a vision]": "What we need to improve the project is to define a vision",
          "What matters most about the project? [having a clear vision]": "What matters most about the project is having a clear vision",
          "What is the key issue for the country? [economic stability]": "All that (What) matters for the country is economic stability"
        }
      },
      "What happens is... What happened was...": {
        weight: 1,
        prompts: {
          "How is the budget decided? [we go through a planning process]": "What happens is we go through a planning process",
          "Why is the government bankrupt? [the wrong people were put in charge]": "What happened was the wrong people were put in charge",
          "Why did the project fail? [there was a lack of proper planning]": "What happened was there was a lack of proper planning",
          "What went wrong with the campaign? [there was a lack of coordination]": "What happened was there was a lack of coordination",
          "How did the team succeed? [they followed a well-structured plan]": "What happened was they followed a well-structured plan",
          "How do citizens share their opinions? [they use public forums and discussions]": "What happens is they use public forums and discussions"
        }
      },
      "The person who...": {
        weight: 1,
        prompts: {
          "Who will take responsibility for the project? [the team leader]": "The person who will take responsibility for the project is the team leader",
          "Who will find a solution to the problem? [the project manager]": "The person who will find a solution to the problem is the project manager",
          "Who is responsible for the project's success? [the team leader]": "The person who is responsible for the project's success is the team leader",
          "Who will lead the next phase of the project? [the project manager]": "The person who will lead the next phase of the project is the project manager",
          "Who will evaluate the project's outcomes? [the quality assurance team]": "The person who will evaluate the project's outcomes is the quality assurance team",
          "Who will implement the new strategy? [the operations team]": "The person who will implement the new strategy is the operations team",
          "Who has influenced you the most? [my mentor]": "The person who has influenced you the most is my mentor",
          "Who has taught you the most? [my mother]": "The person who has taught you the most is my mother"
        }
      },
      "The place where...": {
        weight: 1,
        prompts: {
          "Where will the meeting be held? [the conference room]": "The place where the meeting will be held is the conference room",
          "Where will the conference be held? [Washington, D.C.]": "The place where the conference will be held is Washington, D.C.",
          "Where will the elections be decided? [in rural areas]": "The place where the elections will be decided is in rural areas",
          "Where is the project taking place? [the main office]": "The place where the project is taking place is the main office",
          "Where will the team gather for the discussion? [the meeting room]": "The place where the team will gather for the discussion is the meeting room",
          "Where is the new strategy being implemented? [the operations department]": "The place where the new strategy is being implemented is the operations department",
          "Where will the evaluation of the project occur? [the Dallas office]": "The place where the evaluation of the project will occur is the Dallas office"
        }
      },
      "The reason why...": {
        weight: 1,
        prompts: {
          "Why did the project succeed? [because of careful planning]": "The reason why the project succeeded is (because of) careful planning",
          "Why did the team fail? [there was a lack of coordination]": "The reason why the team failed is (that) there was a lack of coordination",
          "Why is the budget insufficient? [because of unexpected expenses]": "The reason why the budget is insufficient is (because of) unexpected expenses",
          "Why is the strategy effective? [thorough research was done]": "The reason why the strategy is effective is (that) thorough research was done",
          "Why did the campaign succeed? [we had strong leadership]": "The reason why the campaign succeeded is (that) we had strong leadership",
          "Why did the initiative fail? [due to poor execution]": "The reason why the initiative failed is poor execution"
        }
      },
      "The way in which...": {
        weight: 1,
        prompts: {
          "How did the team achieve success? [through effective collaboration]": "The way in which the team achieved success is through effective collaboration",
          "How was the problem solved? [by following a structured approach]": "The way in which the problem was solved is by following a structured approach",
          "How did the project stay on track? [through careful planning]": "The way in which the project stayed on track is through careful planning",
          "How is the strategy being implemented? [through a co-creation process]": "The way in which the strategy is being implemented is through a co-creation process",
          "How will the evaluation be conducted? [through a structured process]": "The way in which the evaluation will be conducted is through a structured process",
          "How did the campaign gain traction? [with aggressive promotion]": "The way in which the campaign gained traction is with aggressive promotion"
        }
      },
      "The last time...": {
        weight: 1,
        prompts: {
          "When was the last time the team met? [last Monday]": "The last time the team met was last Monday",
          "When did the project last receive an update? [yesterday]": "The last time the project received an update was yesterday",
          "When was the last time the strategy was reviewed? [last week]": "The last time the strategy was reviewed was last week",
          "When did the campaign last run? [last month]": "The last time the campaign ran was last month",
          "When was the last evaluation conducted? [last quarter]": "The last time the evaluation was conducted was last quarter"
        }
      }
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
    Object.entries(activity.prompts).forEach(([subCatName, subCatObj]) => {
      Object.entries(subCatObj.prompts).forEach(([question, answer]) => {
        const weight = subCatObj.weight ?? 1
        for (let i = 0; i < weight; i++) {
          pool.push({
            question,
            answer,
            category: subCatName
          })
        }
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

.cleft-prompt-display {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
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