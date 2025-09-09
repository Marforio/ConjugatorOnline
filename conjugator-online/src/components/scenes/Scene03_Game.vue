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
        src="/images/conjugator.png"
        alt="Logo"
        class="m-4 rounded-lg"
        max-width="220"
        aspect-ratio="1"
        cover
      />

      <h2 class="text-h6 font-weight-bold">Your Settings</h2>

      <v-list density="compact" lines="one">
        <v-list-item>
          <v-list-item-title v-if="isAuthenticated"><span class="font-weight-medium">Name:</span> <InitialsText /></v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title style="text-wrap: wrap;"><span class="font-weight-medium">Verb set:</span> {{ gameSettings.verbSet }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
            <span class="font-weight-medium">Rounds: </span>{{ remainingCount }} 
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-title style="text-wrap: wrap;">
            <span class="font-weight-medium">Sentence type(s):</span> {{ gameSettings?.sentenceTypes?.join(', ') || '' }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title style="text-wrap: wrap;">
            <span class="font-weight-medium">Tense(s): </span>{{ gameSettings?.tenses?.join(', ') || '' }}
          </v-list-item-title>
        </v-list-item>
        <v-switch :model-value="true" :label="showKeyword ? 'See time reference' : 'See tense name'" v-model="showKeyword" label="Time reference" class="ms-6" />
      </v-list>
      <v-divider></v-divider>

      <div class="mt-auto d-flex justify-space-between align-center w-100 px-3">
        <v-btn icon elevation="0" size="large" class="ms-3" @click="goBack">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <v-btn v-if="gameStarted" color="error" variant="flat" class="me-3" @click="quitGame">QUIT</v-btn>
      </div>
    </v-navigation-drawer>

    <!-- Main game area -->
    <v-container fluid class="pa-2 d-flex justify-center align-center">
      <div v-if="!gameStarted">
        <!-- Instructions -->
        <h1 class="text-h3 mb-6">Game Instructions</h1>
        <ol>
          <li>You must write {{ remainingCount }} conjugations ({{ remainingCount }}  rounds).</li>
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
         <v-card v-if="$vuetify.display.smAndUp" class="pa-6 mb-6 d-flex justify-center align-center rounded-lg" height="50px" :style="{ width: $vuetify.display.mdAndUp ? '450px' : '280px',
                                                                                                        gap: $vuetify.display.mdAndUp ? '40px' : '20px'}
            " elevation="2" color="grey-lighten-4">
          <span class="text-subtitle-2" style="text-align: align-center"><v-icon>mdi-timer-sand</v-icon style="text-align: align-center"> Round  {{ roundTimer }}</span>
          <v-divider vertical v-if="$vuetify.display.mdAndUp" color="white"></v-divider>
          <span class="text-subtitle-2" style="text-align: align-center"><v-icon>mdi-timer</v-icon style="text-align: align-center"> Total  {{ overallTimer }}</span>

        </v-card>

        <v-card class="mb-6" height="350px" :style="{ width: $vuetify.display.mdAndUp ? '450px' : '280px',
                                                          height: $vuetify.display.mdAndUp ? '280px' : '350px'
         }" :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-2'" elevation="2" color="grey-lighten-4">
          <v-card-title class="text-h5 text-center text-primary">Verb</v-card-title>
          <v-card-text class="text-center">
            <div v-if="$vuetify.display.mdAndUp" class="text-h2 font-weight-bold mb-6">{{ currentPrompt.verb }}</div>
            <div v-else="$vuetify.display.mdAndUp" class="text-h4 font-weight-bold mb-6">{{ currentPrompt.verb }}</div>
            
            <v-row justify="center" align="center">
              <v-col cols="12" md="4">
                <div class="text-subtitle-2 text-grey-darken-1">Person</div>
                <div class="text-body-1">{{ currentPrompt.person }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="text-subtitle-2 text-grey-darken-1">Sentence Type</div>
                <div class="text-body-1">{{ currentPrompt.sentenceType }}</div>
              </v-col>
              <v-col v-if="$vuetify.display.smAndUp" cols="12" md="4">
                <div class="text-subtitle-2 text-grey-darken-1">{{ displayedTenseHeader }}</div>
                <div class="text-body-1 text-center">{{ randomTenseDisplay }}</div>
              </v-col>
              <v-col v-else cols="12" md="4">
                <div class="d-flex flex-column align-center">
                  <div class="d-flex align-center justify-center mb-2" style="gap: 25px;">
                    <div class="text-subtitle-2 text-grey-darken-1">{{ displayedTenseHeader }}</div>
                    <v-switch
                      v-model="showKeyword"
                      density="compact"
                      hide-details
                      class="ma-0 pa-0"
                      style="margin-bottom: -4px;"
                    />
                  </div>
                  <div class="text-body-1 text-center">{{ randomTenseDisplay }}</div>
                </div>
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

            <!-- Submit Button -->
            <div
              class="d-flex justify-center"
              :class="$vuetify.display.xs ? 'mt-2' : 'mt-4'"
            >
              <v-btn color="primary" large @click="submitAnswer">
                {{ submitButtontext }}
              </v-btn>
            </div>
          </v-col>
        </v-row>


        <v-progress-linear
          :model-value="progressValue"
          height="10"
          color="primary"
          class="my-4"
        ></v-progress-linear>

        <v-footer class="pa-4 game-footer rounded-lg" color="grey-lighten-3" elevation="2">
          <v-row justify="center" align="center">
            <v-col cols="12" md="6">
              <div class="scoreboard d-flex justify-center align-center" :style="{ 
                                                        gap: $vuetify.display.mdAndUp ? '50px' : '15px',
                                                        height: $vuetify.display.xs ? '20px' : 'auto'
                                                        }">
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
                  <v-tooltip text="Remaining" location="right">
                    <template #activator="{ props }">
                      <span :key="remainingCount" class="text-black text-h6 text-center" v-bind="props">
                        <v-icon color="black">mdi-tray-full</v-icon> {{ remainingCount }}
                      </span>
                    </template>
                  </v-tooltip>
                </transition>

                <!-- Completed -->
                <transition name="flash-black" mode="out-in">
                  <v-tooltip text="Completed" location="right">
                    <template #activator="{ props }">
                      <span :key="promptCounter" class="text-black text-h6 text-center" v-bind="props">
                        <v-icon color="black">mdi-archive-check</v-icon> {{ promptCounter }}
                      </span>
                    </template>
                  </v-tooltip>
                </transition>
              </div>
            </v-col>
          </v-row>

        </v-footer>
        <div v-if="$vuetify.display.xs" class="d-flex justify-center mt-6">
          <v-btn icon elevation large @click="goBack">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
        </div>
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



<script>
import api from '@/axios';
import { getAccessToken } from '@/services/auth';
import Game from '@/assets/scripts/Game';
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
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      showKeyword: true,
      randomTenseDisplay: '',
      keywords: {},

    };
  },
  async mounted() {
    this.game = new Game(this.gameSettings);
    await this.tenseKeyWords();  // wait for keywords to load
    this.game.start();
    this.updatePrompt();   
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
    clearInterval(this.intervalId);
    clearInterval(this.roundIntervalId);
  },
  computed: {
    progressValue() {
      return ((this.promptCounter) / this.gameSettings.numPrompts) * 100;
    },
    isAuthenticated() { 
      return !!getAccessToken();
    },
    displayedTenseHeader() {
      if (!this.showKeyword) return "Tense";
      return "Time reference"
    }

  },
  methods: {
    goBack() {
      this.$emit('changeScene', 'Scene02_Settings');
    },
    async tenseKeyWords() {
      try {
        const res = await fetch('/data/tenseKeywords.json');
        this.keywords = await res.json();
      } catch (e) {
        console.error('Error loading tense keywords:', e);
      }
    },
    updateRandomTense() {
      if (!this.showKeyword) {
        this.randomTenseDisplay = this.currentPrompt.tense;
        return;
      }

      const tenseKey = this.currentPrompt.tense.toLowerCase().replace(/\s/g, '_');
      const options = this.keywords[tenseKey];

      if (Array.isArray(options) && options.length > 0) {
        let randomIndex;

        // Ensure new random index is different from the previous one
        do {
          randomIndex = Math.floor(Math.random() * options.length);
        } while (
          options.length > 1 && 
          options[randomIndex] === this.randomTenseDisplay
        );

        this.randomTenseDisplay = options[randomIndex];
      } else {
        this.randomTenseDisplay = this.currentPrompt.tense;
      }
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
      elapsed_time: parseFloat(r.elapsedTime),
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
      rounds: rounds   // no session or session_id here
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

        this.$emit('gameOver', payload );

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

      // Ensure a fresh random tense keyword is selected
      this.updateRandomTense();

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

      // Trigger snackbar
      this.snackbar.message = isCorrect
        ? `Yes! "${this.userAnswer}" is correct!`
        : `Sorry, "${this.userAnswer}" is wrong!`;
      this.snackbar.color = isCorrect ? 'success' : 'warning';
      // Reset and re-trigger the snackbar cleanly
      this.snackbar.show = false;
      this.$nextTick(() => {
        this.snackbar.show = true;});


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
.scoreboard {
  gap: 24px;
}

.text-black {
  color: #000;
}


</style>
