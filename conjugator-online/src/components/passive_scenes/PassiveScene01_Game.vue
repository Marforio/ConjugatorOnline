<!-- src/components/passive/passive_scenes/PassiveScene01_Game.vue -->
<template>
  <v-container fluid class="pa-4 d-flex justify-center">

    <!-- Floating feedback (correct only, non-blocking) -->
    <div
      v-if="showFloatingFeedback"
      class="floating-feedback success"
    >
      <strong>Correct! <v-icon icon="mdi-emoticon-happy-outline"/></strong>
    </div>

    <v-card class="p-4" width="420" min-height="600" elevation="3">

      <!-- START SCREEN -->
      <div v-if="!gameStarted" class="p-3">
        <div class="d-flex justify-center mb-4">
          <v-img src="/images/banners/PassiveParty.png" max-width="400" />
        </div>

        <v-list density="compact">
          <v-list-item>
            <template #prepend><v-icon icon="mdi-counter" /></template>
            <v-list-item-title>
              {{ numRounds }} prompts
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-pencil" /></template>
            <v-list-item-title>
              Type only the passive verb phrase
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend><v-icon icon="mdi-alert-circle-outline" /></template>
            <v-list-item-title>
              No abbreviations
            </v-list-item-title>
          </v-list-item>

          <v-list-item> <template #prepend> <v-icon icon="mdi-book-open-page-variant-outline" /> </template> <v-list-item-title class="text-wrap">Review <a href="https://book.language-labs.ch/ch8#usage" target="_blank">the passive</a></v-list-item-title> </v-list-item>
        </v-list>

        <div class="d-flex justify-center mt-6">
          <v-btn color="success" @click="begin">Start</v-btn>
        </div>
      </div>

      <!-- GAME -->
      <div v-else class="game-layout">

        <!-- TOP -->
        <div class="game-top">
          <div class="d-flex justify-space-between mb-2">
            <div>Round {{ currentRound + 1 }} / {{ numRounds }}</div>
            <div class="text-caption">⏱ {{ elapsedTime }} s</div>
          </div>
        </div>

        <!-- MIDDLE -->
        <div class="game-middle mb-5" >
          <v-tooltip location="right">
            <template #activator="{ props }">
              <span
                v-bind="props"
                class="text-subtitle-2 font-weight-light"
              >
                Help! What tense is this?
              </span>
            </template>

            <span>{{ currentPrompt.tense }}</span>
          </v-tooltip>

          <v-card class="pa-3 my-4" elevation="3" style="margin-bottom: 20px;">
            <v-card-title>Active</v-card-title> 
            <v-card-text class="text-wrap">{{ currentPrompt.active }}</v-card-text>

            <v-card-title>Passive</v-card-title>
            <v-card-text class="text-wrap">{{ currentPrompt.passive }}</v-card-text>
            
          </v-card>

          <div class="answer-spacing">
            <v-text-field
              v-model="userAnswer"
              label="Type the passive verb form"
              density="compact"
              hide-details
              @keyup.enter="submit"
            />
          </div>


          <div class="d-flex justify-center mt-4">
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
        </div>
      </div>
    </v-card>

    <!-- WRONG ANSWER DIALOG -->
    <v-dialog v-model="showWrongDialog" persistent max-width="420">
      <v-card @keydown.enter.prevent="acknowledgeWrong" color="yellow-lighten-2 pa-3">
        <v-card-title class="text-h6">Wrong <v-icon icon="mdi-emoticon-sad-outline"/></v-card-title>

        <v-card-text>
          <div class="mb-2">
            Your answer:
            <strong>{{ lastUserAnswer || '—' }}</strong>
          </div>
          <div class="mb-2">
            Tense:
            <strong>{{ lastTense }}</strong>
          </div>
          <div>
            Correct answer:
            <strong>{{ lastCorrectAnswer }}</strong>
          </div>
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
import { checkAnswer } from '@/assets/scripts/passive/PassivePromptEngine'
import api from '@/axios'


const props = defineProps({ prompts: Array })
const emit = defineEmits(['gameOver'])

const inputLocked = ref(false)
const INPUT_COOLDOWN_MS = 600

const numRounds = props.prompts.length
const currentRound = ref(0)
const currentPrompt = computed(() => props.prompts[currentRound.value])

const startTime = ref(null)

const userAnswer = ref('')
const lastUserAnswer = ref('')
const lastTense = ref('')
const lastCorrectAnswer = ref('')

const rightCount = ref(0)
const wrongCount = ref(0)
const remaining = ref(numRounds)

const gameStarted = ref(false)

const resultsStore = ref([]);


/* TIMER (elapsed only) */
const elapsedTime = ref(0)
let timer = null

function startTimer() {
  stopTimer()
  elapsedTime.value = 0
  timer = setInterval(() => elapsedTime.value++, 1000)
}
function stopTimer() {
  clearInterval(timer)
}


/* FEEDBACK */
const showFloatingFeedback = ref(false)
const showWrongDialog = ref(false)
const wrongOkButton = ref(null)
watch(showWrongDialog, async visible => {
  if (visible) {
    await nextTick()
    wrongOkButton.value?.$el?.focus()
  }
})

/* GAME FLOW */
function begin() {
  gameStarted.value = true
  startTime.value = new Date()
  startTimer()
}


const progressValue = computed(() =>
  (currentRound.value / numRounds) * 100
)

function submit() {
  if (inputLocked.value) return
  inputLocked.value = true

  stopTimer()

  const user = userAnswer.value.trim()
  const correct = checkAnswer(currentPrompt.value, user)

  recordRound(user, correct)

  if (correct) {
    showFloatingFeedback.value = true
    setTimeout(() => (showFloatingFeedback.value = false), 900)

    next() // auto-advance
  } else {
    lastUserAnswer.value = user
    lastCorrectAnswer.value = currentPrompt.value.answer
    lastTense.value = currentPrompt.value.tense
    showWrongDialog.value = true
  }
}

function next() {
  userAnswer.value = ''

  if (currentRound.value === numRounds - 1) {
  // last round finished — send payload
  finishGame();
  return;
  }


  currentRound.value++
  startTimer()

  unlockInputWithDelay()
}


function recordRound(user, correct) {
  const roundNumber = resultsStore.value.length + 1;

  resultsStore.value.push({
    question: currentPrompt.value.active,
    correct_answer: currentPrompt.value.answer,
    prompt_number: roundNumber,
    user_answer: user,
    is_correct: correct,
    out_of_time: false,
    elapsed_time: elapsedTime.value,
    typo: false,
    typo_requested: false,
    typo_accepted: null,
  });

  correct ? rightCount.value++ : wrongCount.value++;
  remaining.value--;
}

function acknowledgeWrong() {
    showWrongDialog.value = false
    next()
    unlockInputWithDelay()
  }

function unlockInputWithDelay(delay = INPUT_COOLDOWN_MS) {
  setTimeout(() => {
    inputLocked.value = false
  }, delay)
}


async function finishGame() {
  stopTimer();

  const finishedAt = new Date();
  const totalSeconds =
    Math.floor((finishedAt.getTime() - startTime.value.getTime()) / 1000);

  const avgTime =
    resultsStore.value.length > 0
      ? totalSeconds / resultsStore.value.length
      : 0;

  const payload = {
    game_name: 'Passive Party',
    total_rounds: numRounds,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: startTime.value.toISOString(),
    finished_at: finishedAt.toISOString(),
    total_time: totalSeconds,
    avg_time_per_prompt: parseFloat(avgTime.toFixed(2)),
    rounds: resultsStore.value,
  };

  try {
    console.log(
      'Submitting Passive Party payload:',
      JSON.stringify(payload, null, 2)
    );

    await api.post('/other-games-sessions/', payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Status:', error.response?.status);
    console.error('Response data:', error.response?.data);
  }

  emit('gameOver', payload);
}


onMounted(() => {
  window.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return

    e.preventDefault()

    if (inputLocked.value) return

    if (showWrongDialog.value) {
      acknowledgeWrong()
    } else {
      submit()
    }
  })
})


onBeforeUnmount(stopTimer)
</script>

<style scoped>
.answer-spacing {
  margin-top: 32px;  
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

</style>
