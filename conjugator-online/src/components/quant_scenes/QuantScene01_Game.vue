<template>
  <v-container fluid class="pa-0 d-flex" style="height: 100vh;">
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-if="$vuetify.display.mdAndUp"
      permanent
      width="280"
      class="pa-4 d-flex flex-column align-center ml-3 align-self-center"
    >
      <v-img
        src="/images/QuantifierQuest.png"
        alt="Quantifier Game Logo"
        class="m-4 rounded-lg"
        max-width="220"
        aspect-ratio="4/3"
        cover
      />

      <h2 class="text-h6 text-center font-weight-bold">Game Settings</h2>

      <v-list density="compact" lines="one">
        <v-list-item>
          <v-list-item-title>
            <span class="font-weight-medium">Name:</span> <InitialsText />
          </v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item>
          <v-icon start icon="mdi-counter" class="me-2" />
          {{ remainingCount }} rounds
        </v-list-item>

        <v-list-item>
          <v-icon start icon="mdi-timer-outline" class="me-2" />
          30 sec / round
        </v-list-item>
        <v-list-item>
        <v-icon start icon="mdi-format-list-bulleted" class="me-2" />
        {{ variantLabel }}
      </v-list-item>


        <v-divider />

        <v-list-item>
          <v-list-item-title>
            <p class="font-weight-medium">Reminder:</p>
            <ul>
              <li class="text-wrap text-caption">Countable nouns → many / a few</li>
              <li class="text-wrap text-caption">Uncountable nouns → much / a little</li>
              <li class="text-wrap text-caption">Use 'a lot of' for big quantities of uncountable nouns in declarative sentences.</li>
              <li class="text-wrap text-caption">Not allowed: <span class="font-italic">some, any, several, plenty</span></li>
            </ul>
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider />

      <div class="mt-auto d-flex justify-space-between align-center w-100 px-3">
        <RouterLink :to="{ name: 'games' }">
          <v-btn icon elevation="0" size="x-large">
            <v-icon color="grey-darken-3" size="x-large">
              mdi-arrow-left-circle
            </v-icon>
          </v-btn>
        </RouterLink>

        <v-btn
          v-if="gameStarted"
          color="error"
          variant="flat"
          class="me-3"
          @click="quitGame"
        >
          QUIT
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- Main game area -->
    <v-container fluid class="d-flex justify-center align-start pt-2">

      <div v-if="!gameStarted">
        <v-row class="mx-5 mt-0" align="start" justify="center">
          <!-- Instructions -->
          <v-col cols="12" md="5">
          <div>
            <v-img
              src="/images/banners/QuantifierQuest.png"
              max-width="300"
            />
          </div>

          <h1 class="text-h4 mt-6 mb-6">Instructions</h1>

          <ul class="no-bullets pa-0">
            <li class="mb-2">
              <v-icon start icon="mdi-counter" class="me-2" />
              There are <b>{{ remainingCount }}</b> rounds.
            </li>

            <li class="mb-2">
              <v-icon start icon="mdi-eye" class="me-2" />
              Each round shows:
              <ul class="ms-6 mt-1">
                <li>A picture</li>
                <li>A description of quantity</li>
              </ul>
            </li>

            <li class="mb-2">
              <v-icon start icon="mdi-head-question-outline" class="me-2" />
              Is the noun countable or uncountable?
            </li>

            <li class="mb-2">
              <v-icon start icon="mdi-pencil" class="me-2" />
              Type the correct quantifier + noun.
            </li>

            <li class="mb-2">
              <v-icon start icon="mdi-timer-outline" class="me-2" />
              You have <b>30 seconds</b> per round.
            </li>
          </ul>
          <div class="d-flex justify-center mt-12">
            <v-btn color="success" large @click="startGame">
              START THE GAME
            </v-btn>
          </div>
          
          </v-col>

          <!-- Grammar reminder -->
          <v-col cols="12" md="7" class="mt-5">
            <v-card class="pa-3" color="cyan-lighten-5">
              <v-card-title>Grammar reference</v-card-title>
              <v-card-text class="mt-3">
                <p><v-icon size="x-large" class="me-3">mdi-alert-outline</v-icon>In the game, choose quantifiers according to this table! </p>
              </v-card-text>
              <v-table class="text-center mx-5" density="compact">
                <thead>
                  <tr>
                    <th class="text-left">Quantity</th>
                    <th>Countable noun</th>
                    <th>Uncountable noun</th>
                  </tr>
                </thead>

                <tbody style="font-size: 0.8rem;">
                  <tr>
                    <td class="font-weight-bold text-left">Big quantity</td>
                    <td>many</td>
                    <td>a lot of **</td>
                  </tr>

                  <tr>
                    <td class="text-left"><span class="text-decoration-underline">Impressive</span> big quantity</td>
                    <td>so many</td>
                    <td>so much</td>
                  </tr>

                  <tr>
                    <td class="text-left"><span class="text-decoration-underline">Excessive</span> big quantity</td>
                    <td>too many</td>
                    <td>too much</td>
                  </tr>

                  <tr>
                    <td class="font-weight-bold text-left">Small quantity</td>
                    <td>a few</td>
                    <td>a little</td>
                  </tr>

                  <tr>
                    <td class="text-left"><span class="text-decoration-underline">Impressive</span> small quantity</td>
                    <td>so few</td>
                    <td>so little</td>
                  </tr>

                  <tr>
                    <td class="text-left"><span class="text-decoration-underline">Excessive</span> small quantity</td>
                    <td>too few</td>
                    <td>too little</td>
                  </tr>
                </tbody>
              </v-table>
              <v-card-text class="text-caption">** <strong>A lot of</strong> is used in declarative sentences only. <strong>Much</strong> is preferred the rest of the time, especially with 'too' and 'so' and when the conjugation is negative. Example: "I have a lot of time" (declarative), "I don't have much time" (negative). This is what the game expects.</v-card-text>
              <v-card-text><p>Yes, other quantifiers are possible (for example: <em>some, any, several, plenty of</em>, etc.), but the game will only accept the combinations shown above.</p><p>For a more complete explanation, see the grammar book sections on <a href="https://book.language-labs.ch/ch1#quantifiers" target='_blank'>Quantifiers</a> and <a href="https://book.language-labs.ch/ch1#countable-vs-uncountable" target='_blank'>Countable vs Uncountable Nouns</a>.</p></v-card-text>
            </v-card>
          </v-col>
        </v-row>

      </div>


      <div v-else>
        <!-- Active Game -->
        <v-card
          class="mb-6 d-flex justify-center"
          height="530px"
          :style="{ width: $vuetify.display.mdAndUp ? '500px' : '320px' }"
          :class="$vuetify.display.smAndUp ? 'pa-3' : 'pa-2'"
          elevation="2"
          color="grey-lighten-4"
        >
          <v-card-text class="text-center">
            <div class="d-flex justify-center mb-3">
              <v-img
                v-if="currentPrompt.image"
                :src="`/images/quant_pics_resized/${currentPrompt.image}`"
                class="rounded-lg border-md mb-5"
                max-width="200"
                aspect-ratio="1"
                cover
              />
            </div>
            <div class="d-flex justify-center align-center px-3">
              <v-tooltip v-if="displayedIntensifier" :text="displayedIntensifier === 'excessive' ? 'too' : 'so'"  location="top">
                  <template v-slot:activator="{ props }">
                    <v-card v-bind="props" class="mr-4">
                    <v-card-title>
                      {{ displayedIntensifier }}
                    </v-card-title>
                  </v-card> 
                  </template>
                </v-tooltip>
                <v-tooltip :text="displayedQuantity === 'big quantity' ? 'many // much or a lot of' : '(a) few // (a) little'"  location="top">
                  <template v-slot:activator="{ props }">
                  <v-card v-bind="props" class="mr-4">
                    <v-card-title>{{ displayedQuantity }}</v-card-title>
                  </v-card>
                  </template>
                </v-tooltip>
                <v-card>
                    <v-card-title class="text-uppercase">{{  currentPrompt.subject }}</v-card-title>
                  </v-card>
              
            </div>

            <div class="d-flex justify-center align-center my-5 pa-1">
              <span class="font-italic mr-3">"{{ displayedSentence }}</span>
              <v-text-field
              v-model="userAnswer"
              @keyup.enter="submitAnswer"
              label="Type the quantifier + noun"
              placeholder="e.g. many cars / so much gold"
              variant="outlined"
              max-width="300px"
            />
            <span class="font-italic ml-1"> ."</span>
            </div>

            <!-- Timer + Submit button on same row -->
            <div class="d-flex justify-center align-center">
              <v-progress-circular
                :model-value="(timeLeft / 30) * 100"
                :color="timerColor"
                size="70"
                width="8"
                rotate="-90"
              >
                <span class="text-h6">{{ timeLeft }}</span>
              </v-progress-circular>

              <v-btn
                class="ml-10"
                color="primary"
                large
                @click="submitAnswer"
              >
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
        />

        <v-footer class="pa-4 rounded-lg" color="grey-lighten-3">
          <div class="d-flex justify-space-evenly align-center w-100">
            <span class="text-success text-h6">✅ {{ rightCount }}</span>

            <span class="text-error text-h6">❌ {{ wrongCount }}</span>

            <span class="text-h6 d-flex align-center">
              <v-icon class="mr-1">mdi-tray-full</v-icon> {{ remainingCount }}
            </span>
          </div>

        </v-footer>
      </div>
    </v-container>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2500">
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
import QuantifierGame from '@/assets/scripts/quantifier/quantifierGame.js';
import { ref, reactive, computed, onBeforeUnmount } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import api from '@/axios';

const router = useRouter();
const emit = defineEmits(['gameOver']);
const props = defineProps({
  gameSettings: {
    type: Object,
    default: () => ({})
  }
})


const PROMPT_MAP = {
  "a large quantity of": [["I want", "I see", "I have", "I bought"],["big quantity", ""]], // target = ["many", "a lot of"]
  "an excessively large quantity of": [["I want", "I see", "I have", "I bought"],["big quantity", "excessive"]], // ["too many", "too much"]
  "an incredibly excessive quantity of": [["I want far", "I see far", "I have far", "I bought far"],["big quantity", "excessive"]], // ["too many", "too much"]
  "an impressively large quantity of": [["I want", "I see", "I have", "I bought"],["big quantity", "impressive"]], // ["so many", "so much"]
  "not a large quantity of": [["I don't want", "I don't see", "I don't have", "I didn't buy"],["big quantity", ""]], // ["many", "much"]
  "a small quantity of": [["I want", "I see", "I have", "I bought"],["small quantity", ""]], // ["a few", "a little"]
  "an excessively small quantity of": [["I want", "I see", "I have", "I bought"],["small quantity", "excessive"]], //["too few", "too little"]
  "an impressively small quantity of": [["I want", "I see", "I have", "I bought"],["small quantity", "impressive"]], // ["so few", "so little"]
  "not a small quantity of": [["I don't want", "I don't see", "I don't have", "I didn't buy"],["small quantity", ""]], //  ["a few", "a little"]
  "just a small quantity of": [["I want just", "I see only", "I have just", "I bought only"],["small quantity", ""]] // ["a few", "a little"]
};


const gameSettings = reactive({
  // Start scene will send { variant, numRounds }
  numPrompts: props.gameSettings?.numRounds ?? props.gameSettings?.numPrompts ?? 30,
  variant: props.gameSettings?.variant ?? 'all', // "countable" | "uncountable" | "all"
})


const game = ref(null);
const gameStarted = ref(false);

const currentPrompt = reactive({
  question: '',
  image: '',
  subject: ''
});

let displayedSentence = ref('');
let displayedQuantity = ref('');
let displayedIntensifier = ref('');

const userAnswer = ref('');
const rightCount = ref(0);
const wrongCount = ref(0);
const remainingCount = computed(() => {
  if (!gameStarted.value) return gameSettings.numPrompts;
  return Math.max(0, gameSettings.numPrompts - promptCounter.value);
});

const startTime = ref(null);

const promptCounter = ref(0);

const timeLeft = ref(30);
const timerColor = ref('primary');
let timerInterval = null;

const snackbar = reactive({ show: false, message: '', color: 'success' });

const submitButtonText = computed(() =>
  timeLeft.value <= 0 ? 'Next' : 'Submit'
);

const variantLabel = computed(() => {
  return gameSettings.variant === 'countable'
    ? 'Countables Only'
    : gameSettings.variant === 'uncountable'
      ? 'Uncountables Only'
      : 'All Nouns'
})


const progressValue = computed(
  () => (promptCounter.value / gameSettings.numPrompts) * 100
);

const showBlockingDialog = ref(false);

async function startGame() {
  game.value = new QuantifierGame({
    numPrompts: gameSettings.numPrompts,
    variant: gameSettings.variant,
  });

  showBlockingDialog.value = true;
  await game.value.start();

  startTime.value = new Date().getTime(); 
  showBlockingDialog.value = false;
  gameStarted.value = true;
  updatePrompt();
}

function pickPromptParts(key) {
  const entry = PROMPT_MAP[key];
  if (!entry) return null;

  const [firstList, secondList] = entry;

  // pick random element from the first list
  const randomElement = firstList[Math.floor(Math.random() * firstList.length)];

  const [secondA, secondB] = secondList;

  return [
    randomElement,
    secondA,
    secondB === "" ? null : secondB
  ];
}


function updatePrompt() {
  const p = game.value.getCurrentPrompt();
  if (!p) return;

  const [sentence, quantity, intensifier] = pickPromptParts(p.questionText);

  displayedSentence.value = sentence;
  displayedQuantity.value = quantity;
  displayedIntensifier.value = intensifier;

  const intensifierStr = intensifier ? `${intensifier} ` : '';
  const generatedQuestion = `'${sentence}' + [${intensifierStr}${quantity}] + '${p.subject}'`;

  currentPrompt.question = generatedQuestion;
  currentPrompt.image = p.image;
  currentPrompt.subject = p.subject;

  // store the generated question into the current round in the game engine
  if (typeof game.value.setCurrentPromptQuestion === 'function') {
    game.value.setCurrentPromptQuestion(generatedQuestion);
  }

  startTimer();
}


function submitAnswer() {
  stopTimer();

  // Guard: no prompt loaded
  if (!game.value.getCurrentPrompt()) {
    endGame();
    return;
  }

  const isCorrect = game.value.submitAnswer(userAnswer.value);

  snackbar.message = isCorrect ? 'Correct!' : 'Incorrect.';
  snackbar.color = isCorrect ? 'success' : 'warning';
  snackbar.show = true;

  rightCount.value = game.value.getRightCount();
  wrongCount.value = game.value.getWrongCount();

  userAnswer.value = '';
  promptCounter.value++;

if (game.value.getRemainingCount() === 0) {
      endGame();
    } else {
      game.value.nextPrompt();
      updatePrompt();
    }

}



function startTimer() {
  clearInterval(timerInterval);
  timeLeft.value = 30;

  timerInterval = setInterval(() => {
    timeLeft.value--;
    timerColor.value =
      timeLeft.value <= 2 ? 'error' :
      timeLeft.value <= 4 ? 'warning' : 'primary';

    if (timeLeft.value <= 0) handleTimeout();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function handleTimeout() {
  stopTimer();

  if (!game.value.getCurrentPrompt()) {
    endGame();
    return;
  }

  game.value.submitAnswer('', 30, true);

  rightCount.value = game.value.getRightCount();
  wrongCount.value = game.value.getWrongCount();

  userAnswer.value = '';
  promptCounter.value++;

  if (game.value.getRemainingCount() === 0) {
    endGame();
  } else {
    game.value.nextPrompt();
    updatePrompt();
  }
}

async function endGame() {
  stopTimer();
  showBlockingDialog.value = true;

  const resultsData = game.value.getResults();
  console.log('Quantifier game finished!', resultsData);

  const finishedAt = new Date();
  const totalTimeSeconds = Math.floor(
    (finishedAt.getTime() - startTime.value) / 1000
  );

  const avgTime =
    resultsData.length > 0
      ? (totalTimeSeconds / resultsData.length).toFixed(1)
      : 0;

  const rounds = resultsData.map((r, index) => ({
    question: r.question,
    pronoun: r.pronoun, // ← quantifier intentionally mapped to pronoun
    image: r.image,
    label: r.label || null,
    correct_answer: r.correctAnswers,
    prompt_number: index + 1,
    user_answer: r.userAnswer,
    is_correct: r.correct,
    out_of_time: r.out_of_time || false,
    elapsed_time: r.elapsedTime ?? null,
    typo: false,
    typo_requested: false,
    typo_accepted: null
  }));

  const payload = {
    game_name: `Quantifier Quest ${variantLabel.value}`,
    total_rounds: gameSettings.numPrompts,
    correct_count: rightCount.value,
    wrong_count: wrongCount.value,
    started_at: new Date(startTime.value).toISOString(),
    finished_at: finishedAt.toISOString(),
    total_time: totalTimeSeconds,
    avg_time_per_prompt: parseFloat(avgTime),
    rounds
  };

  try {
    console.log(
      'Submitting Quantifier game payload:',
      JSON.stringify(payload, null, 2)
    );

    const response = await api.post('/other-games-sessions/', payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Quantifier game session saved:', response.data);
  } catch (error) {
    console.error('Status:', error.response?.status);
    console.error('Response data:', error.response?.data);
  }

  setTimeout(() => {
    showBlockingDialog.value = false;
    emit('gameOver', payload);
  }, 1000);
}




function quitGame() {
  stopTimer();
  router.push({ name: 'games' });
}

onBeforeUnmount(stopTimer);
onBeforeRouteLeave(stopTimer);
</script>
