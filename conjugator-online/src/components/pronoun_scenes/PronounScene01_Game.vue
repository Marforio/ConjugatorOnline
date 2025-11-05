<template>
  <v-container fluid class="pa-0 d-flex" style="height: 100vh;">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-if="$vuetify.display.smAndUp"
      permanent
      width="280"
      class="pa-4 d-flex flex-column align-center ml-3 align-self-center"
    >
      <v-img
        src="/images/pronoun-practice.png"
        alt="Pronoun Game Logo"
        class="m-4 rounded-lg"
        max-width="220"
        aspect-ratio="4/3"
        cover
      />

      <h2 class="text-h6 text-center font-weight-bold">Game Settings</h2>

      <v-list density="compact" lines="one">
        <v-list-item>
          <v-list-item-title v-if="isAuthenticated">
            <span class="font-weight-medium">Name:</span> <InitialsText />
          </v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item style="align-content: center;"><v-icon start icon="mdi-counter" class="me-2" />  {{ remainingCount }} rounds</v-list-item>
        <v-list-item><v-icon start icon="mdi-timer-outline" class="me-2" /> 8 sec / round</v-list-item>

        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title>
            <p class="font-weight-medium">Reminder:</p>
            <ul>
              <li class="text-wrap">Animals, aliens, mascots or monsters are not persons but things (for this exercise)</li>
              <li class="text-wrap">if subject == object, then object = reflexive</li>
            </ul>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <div class="mt-auto d-flex justify-space-between align-center w-100 px-3">
        
        <RouterLink :to="{ name: 'games' }">
            <v-btn icon elevation="0" size="large" class="ms-3" @click="goBack">
          <v-icon color="grey-darken-3">mdi-arrow-left-circle</v-icon></v-btn>
        </RouterLink>
        
        

        <v-btn v-if="gameStarted" color="error" variant="flat" class="me-3" @click="quitGame">QUIT</v-btn>
      </div>
    </v-navigation-drawer>

    <!-- Main game area -->
    <v-container fluid class="pa-2 d-flex justify-center align-center">
      <div v-if="!gameStarted">
        <!-- Instructions -->
        <h1 class="text-h3 mb-6">Instructions</h1>
        <ul class="no-bullets pa-0">
          <li class="mb-2">
            <v-icon start icon="mdi-counter" class="me-2" /> There are <b>{{ remainingCount }}</b> rounds.
          </li>
          <li class="mb-2">
            <v-icon start icon="mdi-eye" class="me-2" /> Each round shows:
            <ul class="ms-6 mt-1">
              <li>A picture</li>
              <li>A sentence with a blank</li>
            </ul>
          </li>
          <li class="mb-2">
            <v-icon start icon="mdi-pencil" class="me-2" /> Type the correct pronoun in the blank.
          </li>
          <li class="mb-2">
            <v-icon start icon="mdi-timer-outline" class="me-2" /> Time pressure: you have <b>8 seconds</b> to write the pronoun.
          </li>
        </ul>

        <p class="text-subtitle-1 mt-4">
          <b>Before you start:</b> do you maybe need to review the
          <a href="https://book.language-labs.ch/ch9#table-of-pronouns" target="_blank">English pronouns</a>?
        </p>

        <div class="d-flex justify-center mt-12">
          <v-btn color="success" large @click="startGame">START THE GAME</v-btn>
        </div>

        <div v-if="$vuetify.display.xs" class="d-flex justify-center mt-6">
           <RouterLink :to="{ name: 'games' }">
                <v-btn icon elevation="0" size="large" class="ms-3" @click="goBack">
            <v-icon color="grey-darken-3">mdi-arrow-left-circle</v-icon></v-btn>
            </RouterLink>
        </div>

      </div>

      <div v-else>
        <!-- Active Game -->
        <v-card class="mb-6" height="560px" :style="{ width: $vuetify.display.mdAndUp ? '450px' : '280px' }"
                :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-2'" elevation="2" color="grey-lighten-4">
          

          <v-card-text class="text-center">
            <div class="text-center text-uppercase text-body-1 mb-1">"{{ currentPrompt.subject }}"</div>
            <div class="mb-4 d-flex justify-center align-center">
                <v-img
                    v-if="currentPrompt.image"
                    :src="`/images/pronoun_pics_resized/${currentPrompt.image}`"
                    alt="Pronoun Image"
                    class="mb-3 rounded-lg border-md"
                    max-width="200"
                    aspect-ratio="1"
                    cover
                />
                </div>

            <div class="text-h6 mb-5">{{ currentPrompt.question }}</div>

            <v-text-field
              v-model="userAnswer"
              @keyup.enter="submitAnswer"
              label="Type the pronoun here"
              placeholder="Fill in the pronoun"
              variant="outlined"
              density="compact"
            ></v-text-field>

            <!-- Countdown Timer -->
          <div class="text-center mt-1">
            <v-progress-circular
              :model-value="(timeLeft / 8) * 100"
              :color="timerColor"
              size="70"
              width="8"
              rotate="-90"
            >
              <span class="text-h6">{{ timeLeft }}</span>
            </v-progress-circular>
          </div>

            <div class="d-flex justify-center mt-4">
              <v-btn color="primary" large @click="submitAnswer">
                {{ submitButtonText }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-progress-linear
          :model-value="progressValue"
          height="10"
          color="primary"
          class="my-4"
        ></v-progress-linear>

        <v-footer class="pa-4 game-footer rounded-lg" color="grey-lighten-3" elevation="2">
          <v-row justify="center" align="center">
            <v-col cols="12" md="6">
              <div class="scoreboard d-flex justify-center align-center" :style="{ gap: '24px' }">
                <!-- Correct -->
                <transition name="flash-green" mode="out-in">
                  <span :key="rightCount" class="text-success text-h6 text-center">✅ {{ rightCount }}</span>
                </transition>

                <!-- Incorrect -->
                <transition name="flash-red" mode="out-in">
                  <span :key="wrongCount" class="text-error text-h6 text-center">❌ {{ wrongCount }}</span>
                </transition>

                <v-divider vertical></v-divider>

                <!-- Remaining -->
                <transition name="flash-black" mode="out-in">
                  <span :key="remainingCount" class="text-black text-h6 text-center">
                    <v-icon color="black">mdi-tray-full</v-icon> {{ remainingCount }}
                  </span>
                </transition>
              </div>
            </v-col>
          </v-row>
        </v-footer>
      </div>
    </v-container>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="2500"
      location="top"
      elevation="4"
    >
      {{ snackbar.message }}
    </v-snackbar>

    <!-- Blocking dialog while loading -->
    <v-dialog v-model="showBlockingDialog" persistent fullscreen transition="fade-transition">
      <v-card class="d-flex align-center justify-center" color="transparent" elevation="0">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import PronounGame from '@/assets/scripts/pronoun/pronounGame.js';
import { ref, reactive, computed, onBeforeUnmount } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useRouter } from 'vue-router';
import api from '@/axios';

const router = useRouter();
const gameSettings = reactive({
  numPrompts: 30, 
});

const game = ref(null);
const gameStarted = ref(false);
const currentPrompt = reactive({
  question: '',
  image: '',
  subject: '',
});
const userAnswer = ref('');
const rightCount = ref(0);
const wrongCount = ref(0);
const remainingCount = ref(gameSettings.numPrompts);
const promptCounter = ref(0);
const startTime = ref(null);
const roundStartTime = ref(null);
const submitButtonText = ref('SUBMIT');
const snackbar = reactive({ show: false, message: '', color: 'success' });
const showBlockingDialog = ref(false);

const progressValue = computed(() => (promptCounter.value / gameSettings.numPrompts) * 100);
const isAuthenticated = ref(false);

const timeLeft = ref(8);
const timerColor = ref('primary');
let timerInterval = null;


async function startGame() {
  game.value = new PronounGame({ numPrompts: gameSettings.numPrompts });
  showBlockingDialog.value = true;
  startTime.value = new Date().getTime(); 
  await game.value.start();
  showBlockingDialog.value = false;
  gameStarted.value = true;
  updatePrompt();
}

function updatePrompt() {
  const prompt = game.value.getCurrentPrompt();
  if (!prompt) {
    console.error('No current prompt available.');
    return;
  }
  currentPrompt.question = prompt.questionText;
  currentPrompt.image = prompt.image;
  currentPrompt.subject = prompt.subject;
  roundStartTime.value = new Date().getTime();

  startTimer();  // countdown timer
}


function submitAnswer() {
  stopTimer();
  const elapsedTime = ((new Date().getTime() - roundStartTime.value) / 1000).toFixed(1);
  const isCorrect = game.value.submitAnswer(userAnswer.value, elapsedTime);

  snackbar.message = isCorrect
    ? `Yes! "${userAnswer.value}" is correct!`
    : `Sorry, "${userAnswer.value}" is wrong!`;
  snackbar.color = isCorrect ? 'success' : 'warning';
  snackbar.show = true;

  if (isCorrect) rightCount.value = game.value.getRightCount();
  else wrongCount.value = game.value.getWrongCount();

  promptCounter.value++;
  remainingCount.value--;

  userAnswer.value = '';

  if (remainingCount.value === 0) {
    submitButtonText.value = 'FINISH';
    endGame();
  } else {
    game.value.nextPrompt();
    updatePrompt();
  }
}

const emit = defineEmits(['gameOver']);

async function endGame() {
  stopTimer();
  showBlockingDialog.value = true;

  if (!gameStarted.value) {
    console.warn("Game ended but was already quit — skipping save.");
    return;
  }

  const resultsData = game.value.getResults();
  console.log('Game finished!', resultsData);

  const avgTime =
    ((new Date().getTime() - startTime.value) / 1000 / resultsData.length).toFixed(1);

  const rounds = resultsData.map((r, index) => ({
    question: r.question,
    pronoun: r.pronoun,
    image: r.image,
    label: r.label,
    correct_answer: r.correctAnswers,
    prompt_number: index + 1,
    user_answer: r.userAnswer,
    is_correct: r.correct, 
    out_of_time: r.out_of_time || false,
    elapsed_time: r.elapsedTime || null, 
    typo: false,
    typo_requested: false,
    typo_accepted: null,
  }));

  const payload = {
    game_name: 'Pronoun Practice',
    total_rounds: gameSettings.numPrompts,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: new Date(startTime.value).toISOString(),
    finished_at: new Date().toISOString(),
    total_time: Math.floor((new Date().getTime() - startTime.value) / 1000),
    avg_time_per_prompt: parseFloat(avgTime),
    rounds,
  };

  try {
      console.log("Submitting game payload:", JSON.stringify(payload, null, 2));
      const response = await api.post('/other-games-sessions/', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("Game session saved:", response.data);
    } catch (error) {
      console.error("Status:", error.response?.status);
      console.error("Response data:", error.response?.data);
    }

  setTimeout(() => {
    showBlockingDialog.value = false;
    emit('gameOver', payload);
    console.log(payload)
    // optionally stop timers if needed
    // endTimer();
  }, 1000);
}


function quitGame() {
  stopTimer();

  if (game.value && typeof game.value.stop === 'function') {
    game.value.stop(); // call an internal cleanup if your PronounGame supports it
  }

  // Reset all reactive state
  gameStarted.value = false;
  game.value = null;
  promptCounter.value = 0;
  remainingCount.value = gameSettings.numPrompts;
  userAnswer.value = '';
  rightCount.value = 0;
  wrongCount.value = 0;

  console.log("Game stopped manually — not saving session.");
  
  // Navigate away
  router.push({ name: 'games' });
}

function goBack() {
    stopTimer();

    if (game.value && typeof game.value.stop === 'function') {
      game.value.stop(); // call an internal cleanup if your PronounGame supports it
    }

    // Reset all reactive state
    gameStarted.value = false;
    game.value = null;
    promptCounter.value = 0;
    remainingCount.value = gameSettings.numPrompts;
    userAnswer.value = '';
    rightCount.value = 0;
    wrongCount.value = 0;

    console.log("Game stopped manually — not saving session.");
    
    // Navigate away
    router.push({ name: 'games' });
  }

function startTimer() {
  clearInterval(timerInterval);
  timeLeft.value = 8;
  timerColor.value = 'primary';

  timerInterval = setInterval(() => {
    timeLeft.value--;

    // Change color thresholds
    if (timeLeft.value <= 2) timerColor.value = 'error';
    else if (timeLeft.value <= 4) timerColor.value = 'warning';
    else timerColor.value = 'primary';

    // If time runs out
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function handleTimeout() {
  // Mark round as out_of_time and treat as wrong answer
  stopTimer();
  const elapsedTime = 8.0
  game.value.submitAnswer('', elapsedTime, true); // you can add this third param in your PronounGame

  snackbar.message = '⏰ Time is up!';
  snackbar.color = 'error';
  snackbar.show = true;

  // Clear the input field
  userAnswer.value = '';

  wrongCount.value = game.value.getWrongCount();

  promptCounter.value++;
  remainingCount.value--;

  if (remainingCount.value === 0) {
    endGame();
  } else {
    game.value.nextPrompt();
    updatePrompt();
  }

  onBeforeUnmount(() => {
    stopTimer();
    if (game.value && typeof game.value.stop === 'function') {
      game.value.stop();
    }
  });

  onBeforeRouteLeave((to, from, next) => {
    stopTimer();
    if (game.value && typeof game.value.stop === 'function') {
      game.value.stop();
    }
    next();
  });

}


</script>

<style scoped>
.scoreboard {
  gap: 24px;
}

.v-progress-circular {
  transition: color 0.3s ease;
}

.no-bullets {
  list-style-type: none;
  padding-left: 0;
  margin-left: 0;
}


</style>
