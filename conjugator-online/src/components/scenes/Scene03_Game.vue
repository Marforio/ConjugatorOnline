<template>
  <v-container fluid class="pa-0">

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      permanent
      width="280"
      class="pa-4 d-flex flex-column align-center"
    >
      <v-img
        src="/images/conjugator.png"
        alt="Logo"
        class="mb-4 rounded-lg"
        max-width="220"
        aspect-ratio="1"
        cover
      />

      <h2 class="text-h6 font-weight-bold mb-2">Your Settings</h2>

      <v-list density="compact" lines="one">
        <v-list-item>
          <v-list-item-title>Name: <InitialsText /></v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Verb Set: {{ gameSettings.verbSet }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Sentence Types: {{ gameSettings?.sentenceTypes?.join(', ') || '' }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Tenses: {{ gameSettings?.tenses?.join(', ') || '' }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card class="mt-6 mb-6 pa-3 text-center" color="grey-lighten-4" elevation="2">
        <div class="text-subtitle-1 font-weight-medium">Round: {{ roundTimer }}</div>
        <div class="text-subtitle-1 font-weight-medium">Total: {{ overallTimer }}</div>
      </v-card>

      <div class="mt-auto d-flex justify-space-between align-center w-100">
        <v-btn icon elevation="0" size="large" class="ms-3" @click="goBack">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <v-btn color="error" variant="flat" class="me-3" @click="quitGame">QUIT</v-btn>
      </div>
    </v-navigation-drawer>

    <!-- Main game area -->
    <v-container fluid class="pa-4 d-flex justify-center align-center">
      <div v-if="!gameStarted">
        <!-- Instructions -->
        <h1 class="text-h3 mb-6">Game Instructions</h1>
        <p>How to play:</p>
        <ol>
          <li>You must write {{ remainingCount }} conjugations.</li>
          <li>Every round, you will see:</li>
          <ul>
            <li>a verb</li>
            <li>a person (subject)</li>
            <li>a sentence type</li>
            <li>a tense</li>
          </ul>
          <li>Write the correct conjugation for that combination</li>
          <li>REMEMBER:</li>
          <ul>
            <li>Include both subject and verb</li>
            <li>Contractions are allowed</li>
            <li>Don't press BACK during the game</li>
            <li>Details are shown at the end and in your dashboard</li>
          </ul>
        </ol>

        <div class="d-flex justify-center mt-12">
          <v-btn color="success" large @click="startGame">START THE GAME</v-btn>
        </div>

        <div v-if="$vuetify.display.xs" class="d-flex justify-center mt-6">
          <v-btn icon elevation large @click="goBack">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
        </div>
      </div>

      <div v-else>
        <!-- Active Game -->
        <v-card class="pa-6 mb-6" elevation="2" color="grey-lighten-4">
          <v-card-title class="text-h5 text-center text-primary">Verb</v-card-title>
          <v-card-text class="text-center">
            <div class="text-h1 font-weight-bold mb-6">{{ currentPrompt.verb }}</div>
            <v-row justify="center" align="center">
              <v-col cols="12" md="4">
                <div class="text-subtitle-2 text-grey-darken-1">Person</div>
                <div class="text-body-1">{{ currentPrompt.person }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-subtitle-2 text-grey-darken-1">Tense</div>
                <div class="text-body-1">{{ currentPrompt.tense }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-subtitle-2 text-grey-darken-1">Sentence Type</div>
                <div class="text-body-1">{{ currentPrompt.sentenceType }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-row justify="center" align="center" class="mb-6">
          <v-col cols="12" md="8">
            <v-text-field
              v-model="userAnswer"
              @keyup.enter="submitAnswer"
              label="Answer"
              placeholder="Include person + verb"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn color="primary" large @click="submitAnswer">{{ submitButtontext }}</v-btn>
          </v-col>
        </v-row>

        <v-progress-linear
          :model-value="progressValue"
          height="10"
          color="primary"
          class="my-4"
        ></v-progress-linear>

        <v-footer class="pa-4 game-footer" color="grey-lighten-3">
          <v-row justify="space-between" align="center">
            <v-col cols="12" md="6">
              <div class="scoreboard d-flex gap-4">
                <transition name="flash-green" mode="out-in">
                  <span :key="rightCount" class="text-success text-h6">✅ {{ rightCount }}</span>
                </transition>
                <transition name="flash-red" mode="out-in">
                  <span :key="wrongCount" class="text-error text-h6">❌ {{ wrongCount }}</span>
                </transition>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-card flat class="pa-2">
                <p>Remaining: {{ remainingCount }}</p>
                <p>Completed rounds: {{ promptCounter }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-footer>
      </div>
    </v-container>

    <!-- Blocking dialog while loading -->
    <v-dialog v-model="showBlockingDialog" persistent fullscreen transition="fade-transition">
      <v-card class="d-flex align-center justify-center" color="transparent" elevation="0">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-card>
    </v-dialog>
  </v-container>
</template>



<script>
import api from '@/axios';
import Game from '@/assets/scripts/Game';
import '@/assets/styles/global_conjugator_styles.css';
import InitialsText from '../InitialsText.vue';

export default {
  components: { InitialsText },
  props: {
    gameSettings: {
      type: Object,
      default: () => ({
        verbSet: '',
        sentenceTypes: [],
        tenses: [],
        numPrompts: 0
      })
    }
  },
  data() {
    return {
      userName: 'Player',
      game: null,
      gameStarted: false,
      currentPrompt: {
        person: '',
        verb: '',
        tense: '',
        sentenceType: ''
      },
      userAnswer: '',
      overallTimer: 0,
      roundTimer: 0,
      rightCount: 0,
      wrongCount: 0,
      remainingCount: this.gameSettings.numPrompts,
      promptCounter: 0,
      submitButtontext: 'SUBMIT',
      results: {},
      startTime: null,
      intervalId: null,
      roundStartTime: null,
      roundIntervalId: null,
      showBlockingDialog: false,

    };
  },
  async mounted() {
    this.game = new Game(this.gameSettings);
    this.game.start();
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
    clearInterval(this.intervalId);
    clearInterval(this.roundIntervalId);
  },
  computed: {
    progressValue() {
      return ((this.promptCounter) / this.gameSettings.numPrompts) * 100;
    }
  },
  methods: {
    goBack() {
      this.$emit('changeScene', 'Scene02_Settings');
    },
    
    async endGame() {
      this.showBlockingDialog = true;
      this.results = this.game.getResults();
      console.log("Game results in this.results (spread):", [...this.results]);

      const avgTime = ((new Date().getTime() - this.startTime) / 1000 / this.results.length).toFixed(1);

      const rounds = this.results.map((r, index) => ({
        prompt_number: index + 1,
        person: r.prompt.person,
        verb: r.prompt.verb,
        tense: r.prompt.tense,
        sentence_type: r.prompt.sentenceType,
        user_answer: r.userAnswer,
        is_correct: r.correct,
        acceptable_answers: Array.isArray(r.correctAnswers) ? r.correctAnswers : [],
        elapsed_time: parseFloat(r.elapsedTime)
      }));

      const payload = {
        verb_set: this.gameSettings.verbSet,
        sentence_types: this.gameSettings.sentenceTypes,  
        tenses: this.gameSettings.tenses,                 
        total_rounds: this.gameSettings.numPrompts,
        correct_count: this.rightCount,
        wrong_count: this.wrongCount,
        started_at: new Date(this.startTime).toISOString(),
        finished_at: new Date().toISOString(),
        total_time: Math.floor((new Date().getTime() - this.startTime) / 1000),
        avg_time_per_prompt: parseFloat(avgTime),
        rounds: rounds
      };

      try {
        console.log("Submitting game payload:", JSON.stringify(payload, null, 2));
        
        if (typeof payload.sentence_types === "string") {
            payload.sentence_types = JSON.parse(selections.sentenceTypes);
          }
        if (typeof payload.tenses === "string") {
            payload.tenses = JSON.parse(selections.tenses);
          }

        const response = await api.post('/conj-game-sessions/', payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log("Game session saved:", response.data);


        } catch (error) {
        console.error("Status:", error.response.status);
        console.error("Response data:", error.response.data);
        }

      // Delay to ensure dialog is visible long enough
      setTimeout(() => {
        this.showBlockingDialog = false;

        this.$emit('gameOver', {
          results: this.results,
          totalTime: this.overallTimer,
          avgTime
        });

        this.endTimer();
      }, 1000);
    },


    quitGame() {
      this.$emit('changeScene', 'Scene01_Landing');
    },
    startGame() {
      this.gameStarted = true;
      this.startTime = new Date().getTime();
      this.roundStartTime = new Date().getTime();
      this.timerInterval = setInterval(this.updateTimers, 1000);
      this.updatePrompt();
    },
    updatePrompt() {
      const prompt = this.game.getCurrentPrompt();
      this.currentPrompt.person = prompt.getPerson();
      this.currentPrompt.verb = prompt.getVerb();
      this.currentPrompt.tense = prompt.getTense();
      this.currentPrompt.sentenceType = prompt.getSentenceType();
      this.startRoundTimer();
    },
    updateTimers() {
      const now = new Date().getTime();
      const elapsed = Math.floor((now - this.startTime) / 1000);
      this.overallTimer = this.formatTime(elapsed);
    },
    endTimer() {
      clearInterval(this.intervalId);
    },
    startRoundTimer() {
      this.roundStartTime = new Date().getTime();
      clearInterval(this.roundIntervalId);
      this.roundIntervalId = setInterval(() => {
        const now = new Date().getTime();
        const elapsed = Math.floor((now - this.roundStartTime) / 1000);
        this.roundTimer = this.formatTime(elapsed);
      }, 1000);
    },
    formatTime(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
    endRoundTimer() {
      clearInterval(this.roundIntervalId);
    },
    submitAnswer() {
      const now = new Date().getTime();
      const elapsedMs = now - this.roundStartTime;
      const elapsedSecondsDecimal = (elapsedMs / 1000).toFixed(1);

      const realPrompt = this.game.getCurrentPrompt();
      realPrompt.elapsedTime = elapsedSecondsDecimal;

      const isCorrect = this.game.submitAnswer(this.userAnswer);
      if (isCorrect) {
        this.rightCount = this.game.getRightCount();
      } else {
        this.wrongCount = this.game.getWrongCount();
      }
      this.promptCounter++;
      this.remainingCount--;
      this.userAnswer = '';

      this.endRoundTimer();

      if (this.remainingCount === 1) {
        this.submitButtontext = 'FINISH';
      }
      if (this.remainingCount === 0) {
        this.endGame();
      } else {
        this.game.nextPrompt();
        this.updatePrompt();
        this.startRoundTimer();
      }
    },
  }
};
</script>


<style scoped>

</style>
