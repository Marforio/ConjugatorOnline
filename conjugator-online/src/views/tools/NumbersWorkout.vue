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
            <v-img
              src="/images/banners/NumbersWorkout.png"
              alt="Numbers Workout"
              cover
              style="max-width: 350px; max-height: 200px;"
            />
        </div>

        <p class="text-body-2 font-weight-bold text-indigo mb-2">
          Number Mastery Challenge
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
        class="d-flex flex-column sm-flex-row align-start sm-align-center justify-space-between mb-3 px-2 ga-2"
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
          {{ isFlipped ? 'Click card to see prompt' : 'Click card to flip & check answer' }}
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
                  class="pa-6 pa-md-8 bg-white d-flex flex-column justify-center align-center text-center"
                >
                  <div class="text-overline font-weight-bold text-slate-400 tracking-widest mb-3">
                    How would you say this number?
                  </div>

                  <div class="number-display mb-4">
                    {{ prompt?.question }}
                  </div>

                  <div class="text-caption text-slate-400">
                    Tap the card to reveal the correct reading of the number
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                  class="pa-6 bg-slate-50 border-s border-slate-100 d-flex flex-column justify-center"
                >
                  <div class="text-overline font-weight-bold text-slate-400 tracking-widest mb-2">
                    Category
                  </div>

                  <div class="mb-5">
                    <v-chip
                      color="indigo-darken-1"
                      size="large"
                      class="text-white font-weight-black px-4 shadow-sm"
                    >
                      {{ formatCategory(prompt?.category) }}
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
                    Correct Reading
                  </span>
                  <p class="text-h5 font-weight-bold text-slate-900 font-monospace leading-normal mb-0">
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
          Great work reviewing number forms and spoken patterns.
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
type PromptCategory = {
  weight: number
  prompts: Record<string, string>
}

const DATA: Record<string, PromptCategory> = {
  times: {
    weight: 2,
    prompts: {
      "11:30": "eleven thirty or half past eleven",
      "12:45": "twelve forty-five or quarter to one",
      "3:15": "three fifteen or quarter past three",
      "7:20": "seven twenty",
      "9:05": "nine oh five",
      "4:50": "four fifty",
      "6:40": "six forty",
      "2:10": "two ten",
      "2:00": "two o'clock",
      "5:00": "five o'clock",
      "8:55": "eight fifty-five or five to nine",
      "10:25": "ten twenty-five",
      "1:45": "one forty-five or quarter to two",
      "5:35": "five thirty-five",
      "11:05": "eleven oh five or five past eleven",
      "12:10": "twelve ten or ten past twelve",
      "3:40": "three forty",
      "7:55": "seven fifty-five or five to eight",
      "9:30": "nine thirty or half past nine",
      "4:15": "four fifteen or quarter past four",
      "6:05": "six oh five or five past six",
      "12:00 AM": "twelve o'clock or twelve midnight",
      "12:00 PM": "twelve o'clock or twelve noon"
    }
  },

  dates: {
    weight: 2,
    prompts: {
      "25 Dec": "December 25th, 2022",
      "1 Jan": "January 1st",
      "4 Jul": "July 4th",
      "14 Feb": "February 14th",
      "31 Oct": "October 31st",
      "21 Jun": "June 21st",
      "5 May": "May 5th",
      "11 Nov": "November 11th",
      "2 Mar": "March 2nd",
      "9 Sep": "September 9th",
      "17 Aug": "August 17th",
      "30 Apr": "April 30th",
      "22 Dec": "December 22nd",
      "7 Jan": "January 7th",
      "19 Jul": "July 19th"
    }
  },

  ordinals: {
    weight: 2,
    prompts: {
      "1st": "first",
      "22nd": "twenty-second",
      "3rd": "third",
      "24th": "twenty-fourth",
      "5th": "fifth",
      "36th": "thirty-sixth",
      "7th": "seventh",
      "8th": "eighth",
      "9th": "ninth",
      "10th": "tenth",
      "11th": "eleventh",
      "12th": "twelfth",
      "13th": "thirteenth",
      "14th": "fourteenth",
      "15th": "fifteenth",
      "19th": "nineteenth",
      "21st": "twenty-first",
      "31st": "thirty-first",
      "25th anniversary": "twenty-fifth anniversary",
      "50th anniversary": "fiftieth anniversary",
      "100th anniversary": "one hundredth anniversary",
      "20th day of the month": "twentieth day of the month",
      "50th": "fiftieth",
      "100th": "one hundredth"
    }
  },

  percentages: {
    weight: 1,
    prompts: {
      "25%": "twenty-five percent",
      "50%": "fifty percent",
      "75%": "seventy-five percent",
      "10%": "ten percent",
      "15%": "fifteen percent",
      "20%": "twenty percent",
      "30%": "thirty percent",
      "40%": "forty percent",
      "60%": "sixty percent",
      "80%": "eighty percent",
      "90%": "ninety percent",
      "5%": "five percent",
      "12%": "twelve percent",
      "33%": "thirty-three percent",
      "99%": "ninety-nine percent"
    }
  },

  fractions: {
    weight: 2,
    prompts: {
      "1/2": "one half",
      "3/4": "three fourths or three quarters",
      "2/3": "two thirds",
      "1/3": "one third",
      "1/20": "one twentieth",
      "1/5": "one fifth",
      "1/10": "one tenth",
      "1/50": "one fiftieth",
      "1/4": "one fourth or one quarter",
      "2/5": "two fifths",
      "3/5": "three fifths",
      "4/5": "four fifths",
      "5/6": "five sixths",
      "1/8": "one eighth",
      "3/8": "three eighths",
      "7/8": "seven eighths",
      "5/12": "five twelfths",
      "11/16": "eleven sixteenths",
      "9/10": "nine tenths",
      "3/10 s": "three tenths of a second",
      "7/10 s": "seven tenths of a second"
    }
  },

  decimals: {
    weight: 3,
    prompts: {
      "0.5": "zero point five",
      "1.25": "one point two five",
      "3.14": "three point one four",
      "0.75": "zero point seven five",
      "2.5": "two point five",
      "4.99": "four point nine nine",
      "6.01": "six point zero one",
      "7.33": "seven point three three",
      "8.125": "eight point one two five",
      "9.9": "nine point nine",
      "1.01": "one point zero one",
      "2.75": "two point seven five",
      "5.555": "five point five five five",
      "0.33": "zero point three three",
      "12.04": "twelve point zero four"
    }
  },

  one_numbers: {
    weight: 2,
    prompts: {
      "100": "one hundred",
      "1'000": "one thousand",
      "1'000'000": "one million",
      "1'000'000'000": "one billion",
      "100th": "one hundredth",
      "1/1000 s": "one one thousandth of a second",
      "1/100 s": "one one hundredth of a second",
      "5/100 s": "five one hundredths of a second",
      "9/1000 s": "nine one thousandths of a second"
    }
  },

  middle_numbers: {
    weight: 3,
    prompts: {
      "1'500": "one thousand five hundred",
      "250'000": "two hundred fifty thousand",
      "750'000": "seven hundred fifty thousand",
      "3'200": "three thousand two hundred",
      "4'800": "four thousand eight hundred",
      "125'000": "one hundred twenty-five thousand",
      "640'000": "six hundred forty thousand",
      "890'000": "eight hundred ninety thousand",
      "129'000": "one hundred twenty-nine thousand",
      "34'500": "thirty-four thousand five hundred",
      "56'800": "fifty-six thousand eight hundred",
      "22'900": "twenty-two thousand nine hundred",
      "66'950": "sixty-six thousand nine hundred fifty",
      "91'020": "ninety-one thousand twenty",
      "220'000": "two hundred twenty thousand",
      "430'000": "four hundred thirty thousand",
      "670'000": "six hundred seventy thousand"
    }
  },

  large_numbers: {
    weight: 4,
    prompts: {
      "3'500'000'000": "three point five billion",
      "1'800'000'000": "one point eight billion",
      "2'700'000": "two point seven million",
      "4'200'000'000": "four point two billion",
      "6'750'000'000": "six point seven five billion",
      "9'100'000'000": "nine point one billion",
      "5'500'000'000": "five point five billion",
      "7'300'000'000": "seven point three billion",
      "8'900'000'000": "eight point nine billion",
      "12'400'000": "twelve point four million",
      "33'000'000": "thirty-three million",
      "98'500'000": "ninety-eight point five million",
      "450'000'000": "four hundred fifty million",
      "2'900'000'000": "two point nine billion",
      "1'300'000'000": "one point three billion",
      "3'600'000": "three point six million",
      "71'900'000": "seventy-one point nine million",
      "123'800'000": "one hundred twenty-three point eight million",
      "5'600'000'000": "five point six billion",
      "520'700'000": "five hundred twenty point seven million"
    }
  },

  money: {
    weight: 4,
    prompts: {
      "$10.50": "ten dollars (and) fifty (cents)",
      "€20.00": "twenty euros",
      "£5.75": "five pounds (and) seventy-five (pence)",
      "$3.99": "three dollars (and) ninety-nine (cents)",
      "$12.30": "twelve dollars (and) thirty (cents)",
      "€8.40": "eight euros (and) forty (cents)",
      "€55.10": "fifty-five euros (and) ten (cents)",
      "£2.20": "two pounds (and) twenty (pence)",
      "£19.95": "nineteen pounds (and) ninety-five (pence)",
      "$79.95": "seventy-nine dollars (and) ninety-five (cents)",
      "$250.75": "two hundred fifty dollars (and) seventy-five (cents)",
      "€300.50": "three hundred euros (and) fifty (cents)",
      "£120.00": "one hundred twenty pounds",
      "$999.99": "nine hundred ninety-nine dollars (and) ninety-nine (cents)",
      "€1.25": "one euro (and) twenty-five (cents)"
    }
  },

  decades: {
    weight: 2,
    prompts: {
      "90s": "the nineteen nineties",
      "2000s": "the two thousands",
      "2010s": "the twenty tens",
      "80s": "the nineteen eighties",
      "70s": "the nineteen seventies",
      "60s": "the nineteen sixties",
      "50s": "the nineteen fifties",
      "20s": "the twenty twenties",
      "30s": "the nineteen thirties",
      "1920s": "the nineteen twenties",
      "1910s": "the nineteen tens",
      "1890s": "the eighteen nineties",
      "1880s": "the eighteen eighties",
      "1870s": "the eighteen seventies",
      "1860s": "the eighteen sixties"
    }
  },

  years: {
    weight: 3,
    prompts: {
      "2020": "two thousand twenty",
      "1999": "nineteen ninety-nine",
      "2001": "two thousand one",
      "1984": "nineteen eighty-four",
      "1975": "nineteen seventy-five",
      "1963": "nineteen sixty-three",
      "1988": "nineteen eighty-eight",
      "1576": "fifteen seventy-six",
      "1950": "nineteen fifty",
      "2015": "two thousand fifteen",
      "2012": "two thousand twelve",
      "2008": "two thousand eight",
      "1995": "nineteen ninety-five",
      "1990": "nineteen ninety",
      "1888": "eighteen eighty-eight",
      "1776": "seventeen seventy-six",
      "1492": "fourteen ninety-two"
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

  Object.entries(DATA).forEach(([category, obj]) => {
    Object.entries(obj.prompts).forEach(([question, answer]) => {
      for (let i = 0; i < obj.weight; i++) {
        pool.push({
          question,
          answer,
          category
        })
      }
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

function formatCategory(category?: string) {
  if (!category) return ""
  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
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

/* REMOVE the hover filter entirely */
/* .flashcard-scene:hover .flashcard-card {
  filter: drop-shadow(0 12px 26px rgba(79, 70, 229, 0.08));
} */

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

.number-display {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  color: rgb(15, 23, 42);
  word-break: break-word;
}

.practice-badge {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(224, 231, 255, 1), rgba(238, 242, 255, 1));
  border: 1px solid rgba(165, 180, 252, 0.6);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.12);
}

.tap-hint-badge {
  box-shadow: 0 8px 18px rgba(79, 70, 229, 0.14);
}

.min-vh-80 {
  min-height: 80vh;
}
</style>