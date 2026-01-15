<!-- src/components/grammar/grammar_scenes/GrammarScene01_Game.vue -->
<template>
  <v-container fluid class="pa-4 d-flex justify-center">

    <!-- Floating feedback (correct only, non-blocking) -->
    <div v-if="showFloatingFeedback" class="floating-feedback success">
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline" /></strong>
    </div>

    <v-card class="px-4 pt-4 pn-1" width="420" min-height="600" elevation="3">

      <!-- START SCREEN -->
      <div v-if="!gameStarted" class="p-3">
        <div class="d-flex justify-center mb-4">
          <v-img src="/images/banners/VerbMixer.png" max-width="400" />
        </div>

        <v-list density="compact">
          <v-list-item>
            <template #prepend><v-icon icon="mdi-counter" /></template>
            <v-list-item-title class="text-wrap">{{ numRounds }} prompts</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-timer-outline" /></template>
            <v-list-item-title class="text-wrap">{{ ROUND_SECONDS }} seconds per prompt</v-list-item-title>
          </v-list-item>

        <v-list-item>
            <template #prepend><v-icon icon="mdi-eye-outline" /></template>
            <v-list-item-title class="text-wrap">
              You will see a sentence + a <strong>verb</strong> every round
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template #prepend><v-icon icon="mdi-pencil" /></template>
            <v-list-item-title class="text-wrap">
              Type the correct form of the verb (e.g. <strong>to go</strong>, <strong>going</strong>, <strong>go</strong>)
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <div class="d-flex justify-center mt-10">
          <v-btn color="success" @click="begin" :disabled="!hasAnyPrompts">
            Start
          </v-btn>
        </div>

        <div v-if="!hasAnyPrompts" class="text-caption text-center mt-4">
          No prompts were loaded. Please go back and try again.
        </div>
      </div>

      <!-- GAME -->
      <div v-else class="game-layout">

        <!-- loading guard -->
        <div v-if="!hasPrompt" class="p-6 text-center">
          <v-progress-circular indeterminate />
          <div class="text-caption mt-3">Loading prompts…</div>
        </div>

        <!-- actual game -->
        <template v-else>
          <!-- TOP -->
          <div class="game-top">
            <div class="d-flex justify-space-between mb-2">
              <div>Round {{ currentRound + 1 }} / {{ numRounds }}</div>
              <div class="text-subtitle-2 timer-pill" :class="timerClass">⏱ {{ timeLeft }} s</div>
            </div>
          </div>

          <!-- MIDDLE -->
          <div class="game-middle mb-5">
            <v-card rounded variant="text" class="pa-3 my-4" style="margin-bottom: 20px;">
            <v-card-text class="d-flex justify-center text-wrap">
                <v-chip
                color="blue-lighten-4"
                size="x-large"
                class="text-black"
                variant="flat"
                >
                {{ currentPrompt.answerVerb }}
                </v-chip>
            </v-card-text>

            <v-card-text
                class="d-flex justify-center text-wrap text-body-h1"
                style="font-size: 1.2rem;"
            >
                {{ currentPrompt.sentence }}
            </v-card-text>
            </v-card>


            <div class="answer-spacing d-flex justify-center" ref="answerWrap">
                <v-text-field
                    v-model="userAnswer"
                    label="Your answer (e.g. to go / going / go)"
                    hide-details
                    @keyup.enter="submit"
                    :disabled="inputLocked"
                    max-width="80%"
                />
                </div>


            <div class="d-flex justify-center mt-8">
              <v-btn color="primary" @click="submit" :disabled="inputLocked">
                Submit
              </v-btn>
            </div>
          </div>

          <!-- BOTTOM -->
          <div class="game-bottom">
            <v-progress-linear
              :model-value="progressValue"
              height="10"
              class="mb-3"
              color="primary"
            />

            <div class="d-flex justify-space-between">
              <div>✅ {{ rightCount }}</div>
              <div>❌ {{ wrongCount }}</div>
              <div>Remaining: {{ remaining }}</div>
            </div>

            <div class="mt-5 d-flex justify-center align-center w-100">
            <RouterLink :to="{ name: 'games' }">
              <v-btn icon elevation="0" size="large">
                <v-icon color="grey-darken-3" size="large">
                  mdi-arrow-left-circle
                </v-icon>
              </v-btn>
            </RouterLink>
          </div>
          </div>
        </template>
      </div>
    </v-card>

    <!-- WRONG ANSWER DIALOG -->
    <v-dialog v-model="showWrongDialog" persistent max-width="420">
      <v-card @keydown.enter.prevent="acknowledgeWrong" color="yellow-lighten-2 pa-3">
        <v-card-title class="text-h6 mt-4">
          {{ lastOutOfTime ? "Time ran out" : "Wrong" }}
          <v-icon :icon="lastOutOfTime ? 'mdi-timer-off-outline' : 'mdi-emoticon-sad-outline'" />
        </v-card-title>

        <v-card-text>
          <p class="mb-2">
            Key: <strong>{{ lastKey }}</strong>
          </p>

          <p class="mb-2">
            Sentence: <span class="font-italic">{{ lastSentence }}</span>
          </p>

          <p class="mb-2">
            Verb: <span class="font-weight-bold">{{ lastAnswerVerb }}</span>
          </p>

          <p class="mb-2">
            Your answer: <strong>{{ lastUserAnswer || '—' }}</strong>
          </p>

          <p class="mb-0">
            Accepted answers:
            <strong>{{ lastAcceptedAnswers }}</strong>
          </p>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn ref="wrongOkButton" color="secondary" @click="acknowledgeWrong">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import api from '@/axios'

// game answer checking
import { checkAnswer, getAcceptedAnswers } from '@/assets/scripts/verb_mixer/VerbMixerGameLogic'

const ROUND_SECONDS = 15
const WARN_SECONDS = 9
const DANGER_SECONDS = 3

const timeLeft = ref(ROUND_SECONDS)
let timer = null

const props = defineProps({
  prompts: { type: Array, required: true },
})
const emit = defineEmits(['gameOver'])

const INPUT_COOLDOWN_MS = 600
const inputLocked = ref(false)

const numRounds = computed(() => (Array.isArray(props.prompts) ? props.prompts.length : 0))
const hasAnyPrompts = computed(() => numRounds.value > 0)

const currentRound = ref(0)
const currentPrompt = computed(() => props.prompts?.[currentRound.value] || null)
const hasPrompt = computed(() => !!currentPrompt.value)

const startTime = ref(null)
const userAnswer = ref('')

// dialog fields
const lastUserAnswer = ref('')
const lastSentence = ref('')
const lastKey = ref('')
const lastAnswerVerb = ref('')
const lastAcceptedAnswers = ref('')
const lastOutOfTime = ref(false)

const rightCount = ref(0)
const wrongCount = ref(0)
const remaining = ref(0)

const gameStarted = ref(false)
const resultsStore = ref([])

/* ------------------------------------------------------------------
 * helpers
 * ------------------------------------------------------------------ */
const answerWrap = ref(null)

async function focusAnswer() {
  // wait for DOM updates
  await nextTick()

  // run after transitions/layout
  requestAnimationFrame(() => {
    // if still locked, don't focus yet
    if (inputLocked.value) return

    // focus the real input inside the wrapper
    const input = answerWrap.value?.querySelector?.('input')
    input?.focus?.()
    input?.select?.() // optional: highlight previous text
  })
}



function setWrongDialogData(user, outOfTimeFlag) {
  const p = currentPrompt.value
  if (!p) return

  lastUserAnswer.value = user || '—'
  lastSentence.value = p.sentence
  lastKey.value = p.key
  lastAnswerVerb.value = p.answerVerb
  lastOutOfTime.value = !!outOfTimeFlag
  lastAcceptedAnswers.value = (getAcceptedAnswers(p) || []).join(' / ') || '—'
}

/* ------------------------------------------------------------------
 * TIMER and handling TIMEOUT
 * ------------------------------------------------------------------ */

function startTimer() {
  stopTimer()
  timeLeft.value = ROUND_SECONDS

  timer = setInterval(() => {
    if (!hasPrompt.value) return
    if (showWrongDialog.value || inputLocked.value) return

    timeLeft.value--

    if (timeLeft.value <= 0) {
      timeLeft.value = 0
      handleTimeOut()
    }
  }, 1000)
}

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
}

function handleTimeOut() {
  if (!hasPrompt.value) return
  if (inputLocked.value) return

  inputLocked.value = true
  stopTimer()

  const user = userAnswer.value.trim()

  setWrongDialogData(user || '—', true)
  recordRound(user, false, true)
  showWrongDialog.value = true
}

const timerClass = computed(() => {
  if (!gameStarted.value) return ''
  if (timeLeft.value <= DANGER_SECONDS) return 'timer-danger'
  if (timeLeft.value <= WARN_SECONDS) return 'timer-warn'
  return 'timer-ok'
})

/* ------------------------------------------------------------------
 * FEEDBACK
 * ------------------------------------------------------------------ */

const showFloatingFeedback = ref(false)
const showWrongDialog = ref(false)
const wrongOkButton = ref(null)

watch(showWrongDialog, async (visible) => {
  if (visible) {
    await nextTick()
    wrongOkButton.value?.$el?.focus()
  }
})

/* ------------------------------------------------------------------
 * GAME FLOW
 * ------------------------------------------------------------------ */

const progressValue = computed(() => {
  if (!hasAnyPrompts.value) return 0
  return (currentRound.value / numRounds.value) * 100
})

function begin() {
  if (!hasAnyPrompts.value) return

  // reset session state (important if scene reused)
  currentRound.value = 0
  rightCount.value = 0
  wrongCount.value = 0
  resultsStore.value = []
  remaining.value = numRounds.value
  userAnswer.value = ''
  inputLocked.value = false

  gameStarted.value = true
  startTime.value = new Date()

  startTimer()
  focusAnswer()
}

function submit() {
  if (!hasPrompt.value) return
  if (inputLocked.value) return

  inputLocked.value = true
  stopTimer()

  const user = userAnswer.value.trim()
  const correct = checkAnswer(currentPrompt.value, user)

  recordRound(user, correct, false)

  if (correct) {
    showFloatingFeedback.value = true
    setTimeout(() => (showFloatingFeedback.value = false), 900)
    next()
  } else {
    setWrongDialogData(user, false)
    showWrongDialog.value = true
  }
}

function next() {
  userAnswer.value = ''

  if (currentRound.value >= numRounds.value - 1) {
    finishGame()
    return
  }

  currentRound.value++
  startTimer()
  unlockInputWithDelay()
}

function recordRound(user, correct, outOfTime = false) {
  const p = currentPrompt.value
  if (!p) return

  const roundNumber = resultsStore.value.length + 1
  const secondsUsed = ROUND_SECONDS - timeLeft.value

  const accepted = getAcceptedAnswers(p)

  // typo detection
  const normalizedUser = String(user || '').trim().toLowerCase().replace(/\s+/g, ' ')
  const allowedTypos = Array.isArray(p.allowedTypos) ? p.allowedTypos : []
  const typoAccepted = allowedTypos
    .map((x) => String(x).trim().toLowerCase().replace(/\s+/g, ' '))
    .includes(normalizedUser)

  // ✅ API-compatible round object (IDENTICAL field names to Passive Party)
  resultsStore.value.push({
    question: p.sentence,
    correct_answer: accepted.join(' / '),
    prompt_number: roundNumber,
    user_answer: user,
    is_correct: correct,
    out_of_time: outOfTime,
    elapsed_time: secondsUsed,
    typo: typoAccepted,
    typo_requested: false,
    typo_accepted: typoAccepted ? normalizedUser : null,
  })

  correct ? rightCount.value++ : wrongCount.value++
  remaining.value--
}

function acknowledgeWrong() {
  showWrongDialog.value = false
  next()
}

function unlockInputWithDelay(delay = INPUT_COOLDOWN_MS) {
  setTimeout(async () => {
    inputLocked.value = false
    await focusAnswer()
  }, delay)
}
watch(currentRound, async () => {
  if (gameStarted.value) {
    // wait for prompt UI to render
    await focusAnswer()
  }
})


async function finishGame() {
  stopTimer()

  const finishedAt = new Date()
  const totalSeconds = Math.floor((finishedAt.getTime() - startTime.value.getTime()) / 1000)

  const avgTime = resultsStore.value.length > 0
    ? totalSeconds / resultsStore.value.length
    : 0
    const mode = props.gameSettings?.mode ?? 'mixed' // or however you store it

    const gameName =
        mode === 'mixed'
            ? 'Verb Mixer'
            : 'Verb Mixer Practice'
  
    const payload = {
    game_name: gameName,
    total_rounds: numRounds.value,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: startTime.value.toISOString(),
    finished_at: finishedAt.toISOString(),
    total_time: totalSeconds,
    avg_time_per_prompt: parseFloat(avgTime.toFixed(2)),
    rounds: resultsStore.value,
  }

  try {
    console.log('Submitting Verb Mixer payload:', JSON.stringify(payload, null, 2))
    await api.post('/other-games-sessions/', payload, {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Status:', error.response?.status)
    console.error('Response data:', error.response?.data)
  }

  emit('gameOver', payload)
}

/* ------------------------------------------------------------------
 * KEYBOARD
 * ------------------------------------------------------------------ */

onMounted(() => {
  const handler = (e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    if (inputLocked.value) return
    if (showWrongDialog.value) {
      acknowledgeWrong()
    } else {
      submit()
    }
  }

  window.addEventListener('keydown', handler)
  onBeforeUnmount(() => window.removeEventListener('keydown', handler))
})

onBeforeUnmount(stopTimer)
</script>

<style scoped>
.answer-spacing {
  margin-top: 40px;
}

.game-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game-middle {
  flex: 1;
  margin-top: 10%;
}

.floating-feedback {
  position: fixed;
  top: 8vh;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 16px;
  border-radius: 8px;
  background: #4caf50;
  color: white;
  z-index: 2000;
}

.timer-pill {
  padding: 2px 8px;
  border-radius: 999px;
  transition: background-color 150ms ease, color 150ms ease;
}

/* default: subtle / transparent */
.timer-ok {
  background: transparent;
}

/* getting low */
.timer-warn {
  background: rgba(255, 193, 7, 0.25);
}

/* critical */
.timer-danger {
  background: rgba(244, 67, 54, 0.22);
}
</style>
