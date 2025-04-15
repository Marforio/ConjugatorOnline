<!-- src/components/scenes/Scene03_Game.vue -->
<template>
  <div class="conjugator-container">
    <div id="game-scene">
      <div id="logo">
        <p class="display-5 text-center"><span class="border rounded-pill p-3 px-5">Conjugator</span></p>
      </div> <!-- Missing closing tag added -->
      <div id="sidebar">
          <h2>Settings</h2>
          <p>Name: {{ userName }}</p>
          <p>Verb Set: {{ gameSettings.verbSet }}</p>
          <p>Sentence Types: {{ gameSettings.sentenceTypes.join(', ') }}</p>
          <p>Tenses: {{ gameSettings.tenses.join(', ') }}</p>
      </div>
      <div id="gamespace">
          <div id="prompt1">
            <div class="card" style="width: 18rem;">
              <p class="h3">{{ currentPrompt.person }}</p>
              <div class="card-body">
                <h5 class="card-title">Person</h5>
              </div>
            </div>
          </div>
          <div id="prompt2">
            <div class="card" style="width: 18rem;">
              <p class="h3">{{ currentPrompt.tense }}</p>
              <div class="card-body">
                <h5 class="card-title">Tense</h5>
              </div>
            </div>
          </div>
          <div id="prompt3">
            <div class="card" style="width: 18rem;">
              <p class="h3">{{ currentPrompt.sentenceType }}</p>
              <div class="card-body">
                <h5 class="card-title">Sentence type</h5>
              </div>
            </div>
          </div>
          <div id="verb">
            <p>Verb: {{ currentPrompt.verb }}</p>
          </div>
          <div id="answer">
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
      <div id="footer" class="d-flex flex-row">
          <p>Right: {{ rightCount }}</p>
          <p>Wrong: {{ wrongCount }}</p>
          <p>Remaining: {{ remainingCount }}</p>
          <p>Completed rounds: {{ promptCounter }}</p>
      </div>
      <div id="timer">
          <p>Round Timer: {{ roundTimer }}</p>
          <p>Overall Timer: {{ overallTimer }}</p>
      </div>
      <div id="nav">
        <button @click="goBack">BACK</button>
        <button @click="quitGame">QUIT</button>
      </div>
    </div>
   </div> 
</template>


<script>
import Game from '@/assets/scripts/Game';
import '@/assets/styles/global_conjugator_styles.css';

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
    const elapsed = Math.floor((now - this.startTime) / 1000); // Total elapsed seconds
    this.overallTimer = this.formatTime(elapsed); // Format to MM:SS
  },
    endTimer() {
    clearInterval(this.intervalId);
    },
    startRoundTimer() {
    this.roundStartTime = new Date().getTime(); // Reset round start time
    clearInterval(this.roundIntervalId); // Clear any existing interval
    
    this.roundIntervalId = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = Math.floor((now - this.roundStartTime) / 1000); // Total elapsed seconds
      this.roundTimer = this.formatTime(elapsed); // Format to MM:SS
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
#game-scene {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 1fr 1fr auto auto;
  grid-template-areas: 
    "logo . timer timer"
    "logo prompt1 prompt2 prompt3"
    "sidebar verb verb verb"
    "sidebar answer answer answer"
    "nav footer footer footer";
  height: 100vh; /* Use the full viewport height */
  width: 100vw;  /* Use the full viewport width */
  gap: 10px; /* Add spacing between grid items */
}

#logo {
  grid-area: logo;
  padding: 10px;
  text-align: center;
}

#sidebar {
  grid-area: sidebar;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}

#gamespace {
  grid-column: span 3; /* Ensures proper layout */
  display: flex;
  flex-wrap: wrap; /* Allows items to wrap if necessary */
  gap: 15px; /* Adds spacing between prompts */
}

#prompt1, #prompt2, #prompt3, #verb {
  flex: 1 0 20%; /* Ensures flexibility */
}

#footer {
  grid-area: footer;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

#nav {
  grid-area: nav;
  text-align: center;
}

#timer {
  grid-area: timer;
  text-align: center;
}

#answer {
  grid-area: answer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
