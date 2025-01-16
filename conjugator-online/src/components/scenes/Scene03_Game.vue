<!-- src/components/scenes/Scene03_Game.vue -->
<template>
  <div class="game-scene">
    <h1>Conjugation Game</h1>
    <div class="sidebar">
      <div class="settings-summary">
        <h2>Settings</h2>
        <p>Name: {{ userName }}</p>
        <p>Verb Set: {{ gameSettings.verbSet }}</p>
        <p>Sentence Types: {{ gameSettings.sentenceTypes.join(', ') }}</p>
        <p>Tenses: {{ gameSettings.tenses.join(', ') }}</p>
      </div>
      <div class="timers">
        <p>Round Timer: {{ roundTimer }}</p>
        <p>Overall Timer: {{ overallTimer }}</p>
        <p>Right: {{ rightCount }}</p>
        <p>Wrong: {{ wrongCount }}</p>
        <p>Remaining: {{ remainingCount }}</p>
        <p>Completed rounds: {{ promptCounter }}</p>
      </div>
      <div class="buttons">
        <button @click="goBack">BACK</button>
        <button @click="quitGame">QUIT</button>
      </div>
    </div>
    <div class="workspace">
      <h2>Instructions</h2>
      <div class="prompts">
        <div class="prompt">
          <label>Person:</label>
          <p>{{ currentPrompt.person }}</p>
        </div>
        <div class="prompt">
          <label>Verb:</label>
          <p>{{ currentPrompt.verb }}</p>
        </div>
        <div class="prompt">
          <label>Tense:</label>
          <p>{{ currentPrompt.tense }}</p>
        </div>
        <div class="prompt">
          <label>Sentence Type:</label>
          <p>{{ currentPrompt.sentenceType }}</p>
        </div>
      </div>
      <div v-if="!gameStarted">
        <button @click="startGame">START</button>
      </div>
      <div v-else>
        <label>Answer:</label>
        <input v-model="userAnswer" @keyup.enter="submitAnswer" />
        <button @click="submitAnswer">{{ submitButtontext }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import Game from '@/assets/scripts/Game';

export default {
  props: ['gameSettings'],
  data() {
    return {
      userName: 'Player', // Replace with actual user name if available
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
    };
  },
  async mounted() {
  this.game = new Game(this.gameSettings);
  this.game.start();
},
  beforeDestroy() {
    clearInterval(this.timerInterval);
    clearInterval(this.intervalId); // Clear the overall timer interval
    clearInterval(this.roundIntervalId); // Clear the round timer interval
  },
  methods: {
    goBack() {
      this.$emit('changeScene', 'Scene02_Settings');
    },
    endGame() {
      this.results = this.game.getResults();
      this.$emit('gameOver', this.results);
      this.endTimer();
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
  this.overallTimer = Math.floor((now - this.startTime) / 1000);
},
    endTimer() {
    clearInterval(this.intervalId);
    },
    startRoundTimer() {
  this.roundStartTime = new Date().getTime(); // Reset round start time
  this.roundTimer = 0; // Reset the round timer display
  clearInterval(this.roundIntervalId); // Clear any existing interval
  
  this.roundIntervalId = setInterval(() => {
    const now = new Date().getTime();
    this.roundTimer = Math.floor((now - this.roundStartTime) / 1000);
  }, 1000);
},
    endRoundTimer() {
      clearInterval(this.roundIntervalId);
    },
    submitAnswer() {
  const isCorrect = this.game.submitAnswer(this.userAnswer);
  if (isCorrect) {
    this.rightCount = this.game.getRightCount();
  } else {
    this.wrongCount = this.game.getWrongCount();
  }
  this.promptCounter++;
  this.remainingCount--;
  this.userAnswer = '';
  
  // End the current round timer
  this.endRoundTimer();

  if (this.remainingCount === 1) {
    this.submitButtontext = 'FINISH';
  }
  if (this.remainingCount === 0) {
    console.log(this.game.getResults());
    this.endGame();
  } else {
    this.game.nextPrompt();
    this.updatePrompt();
    
    // Start a new round timer
    this.startRoundTimer();
  }
}

  }
};
</script>

<style scoped>
.game-scene {
  display: flex;
  flex-direction: row;
}

.sidebar {
  width: 25%;
  padding: 20px;
  background-color: #f0f0f0;
}

.workspace {
  width: 75%;
  padding: 20px;
}

.prompts {
  display: flex;
  flex-direction: column;
}

.prompt {
  margin-bottom: 10px;
}

.buttons {
  margin-top: 20px;
}

.buttons button {
  margin-right: 10px;
}
</style>