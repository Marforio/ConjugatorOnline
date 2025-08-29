<template>
  <div class="game-scene">

    <div class="game-body">
      <!-- SIDEBAR -->
      <aside class="sidebar" style="align-content: center;">
        <img 
            src="/images/conjugator.png" 
            alt="Logo" 
            class="mb-1 rounded-image" 
            style="width: 95%; height: auto; opacity: 90%;" 
          />
        <h2 class="mt-4">Your settings</h2>
        <p>Name: {{ userName }}</p>
        <p>Verb Set: {{ gameSettings.verbSet }}</p>
        <p>Sentence Types: {{ gameSettings?.sentenceTypes?.join(', ') || '' }}</p>
        <p>Tenses: {{ gameSettings?.tenses?.join(', ') || '' }}</p>
        <div class="timer-box mt-4 mb-4">
          <p>Round: {{ roundTimer }}</p>
          <p>Total: {{ overallTimer }}</p>
      </div>
        <div class="footer-nav gap-3">
          <button class="btn btn-secondary" @click="goBack">BACK</button>
          <button class="btn btn-secondary" @click="quitGame">QUIT</button>
        </div>
      </aside>

      <!-- MAIN GAME AREA -->
      <main v-if="gameStarted === true" class="main-area p-4">
        
        <!-- Prompt Card -->
          <!-- Prompt Card -->
          <v-card class="pa-6" elevation="2" color="grey-lighten-4">
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

          <!-- Answer Input -->
          <v-row class="mt-6" justify="center" align="center">
          <v-col cols="12" md="8">
          <v-text-field
            v-model="userAnswer"
            @keyup.enter="submitAnswer"
            label="Answer"
            placeholder="include person + verb"
            variant="outlined"
            density="comfortable"
          ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
          <v-btn color="primary" size="large" @click="submitAnswer">
            {{ submitButtontext }}
          </v-btn>
          </v-col>
          </v-row>

          <!-- Progress Bar -->
          <v-progress-linear :model-value="progressValue" height="10" color="primary" class="my-4"></v-progress-linear>

          <!-- Footer -->
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

      </main>
      <main v-else>
        <div>
          <p class="display-3">Game Instructions</p>
          <p>How to play:</p>
          <ol>
            <li>You will be asked to write {{ remainingCount }} conjugations (the game has {{ remainingCount }} rounds )</li>
            <li>Every round, you will see 4 cards</li>
            <ul>
              <li>Person</li>
              <li>Verb</li>
              <li>Sentence type (Positive, Negative, or Question)</li>
              <li>Tense (Past simple, Future simple, Present continuous, etc.)</li>
            </ul>
            <li>Write the correct conjugation for that combination of cards</li>
            <li>Make sure you write both the person (subject) and the verb</li>
            <li>Don't press the BACK button during the game. You will be able to see the details for every round at the end of the game.</li>
          </ol>
          

        </div>
        <div>
          <button class="btn btn-lg btn-success" @click="startGame">START THE GAME</button>
        </div>
      </main>
    </div>
  </div>

  <!-- Blocking dialog while loading -->
  <v-dialog v-model="showBlockingDialog" persistent fullscreen transition="fade-transition">
    <v-card class="d-flex align-center justify-center" color="transparent" elevation="0">
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-card>
  </v-dialog>

</template>


<script>
import api from '@/axios';
import Game from '@/assets/scripts/Game';
import '@/assets/styles/global_conjugator_styles.css';

export default {
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
.game-scene {
  display: flex;
  flex-direction: column;
  margin-left: 4%;
  margin-right: 4%;
  margin-top: 1%;
  margin-bottom: 1%;
  height: 100%;
  gap: 10px;
  padding: 10px;
}

/* HEADER */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.timer-box {
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-align: right;
}

/* BODY */
.game-body {
  display: grid;
  grid-template-columns: 250px 1fr;
  flex: 1;
  gap: 10px;
}

/* SIDEBAR */
.sidebar {
  background: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}

/* MAIN GAME AREA */
.main-area {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.prompt-row-1 {
  display: flex;
  gap: 10px;
  flex: 2;
  flex-wrap: wrap;
  justify-content: center;
}
.prompt-row-2 {
    display: flex;
    gap: 10px;
    flex: 3;  /* 50% bigger than prompt-row-1  */
    flex-wrap: wrap;
    justify-content: center;
    margin: 1rem;
}

.verb-card {
  display: flex;
  justify-content: center;
}

.answer-section {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
  margin-bottom: 4rem;
}

/* FOOTER */
.game-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  gap: 3rem; 
}
.footer-nav {
  display: flex;
  justify-content: center;
}
.rounds {
  display: flex;
  flex-direction: column;
  border-color: black;
}
.scoreboard {
  font-size: 3rem;
  gap: 3rem;
}
.score {
  margin: 2rem;
}
 /* Score count transitions */
 /* Green transition */
.flash-green-enter-active, .flash-green-leave-active {
  transition: all 0.7s ease;
}
.flash-green-enter {
  transform: scale(1.5);
  color: limegreen;
  opacity: 0.7;
}
.flash-green-leave-to {
  opacity: 0;
}

/* Red transition */
.flash-red-enter-active, .flash-red-leave-active {
  transition: all 0.3s ease;
}
.flash-red-enter {
  transform: scale(1.5);
  color: crimson;
  opacity: 0.7;
}
.flash-red-leave-to {
  opacity: 0;
}




/* Responsive */
@media (max-width: 768px) {
  .game-body {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
  .game-footer {
    flex-direction: column;
  }
  .answer-form-group {
    flex-direction: column;
  }
}

</style>
