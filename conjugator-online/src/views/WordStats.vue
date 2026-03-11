<template>
  <v-container fluid class="lexicon-visualizer">
    <!-- Header with Stats -->
    <v-card elevation="2" class="mb-6">
      <v-card-title class="d-flex align-center justify-space-between bg-primary pa-6">
        <div>
          <h1 class="text-h3 text-white mb-2">
            <v-icon size="large" color="white" class="me-2">mdi-book-alphabet</v-icon>
            Lexicon Visualizer Pro
          </h1>
          <div class="text-subtitle-1 text-white opacity-90">
            Advanced linguistic data analysis & visualization
          </div>
        </div>
        <div class="d-flex ga-3 align-center">
          <v-btn
            size="x-large"
            color="success"
            variant="elevated"
            prepend-icon="mdi-gamepad-variant"
            @click="startHangmanGame"
          >
            Play "Guess the Word"
          </v-btn>
          <v-chip v-if="!loading" size="x-large" color="white" variant="elevated">
            <v-icon start>mdi-database</v-icon>
            {{ wordData.length.toLocaleString() }} Lemmas
          </v-chip>
        </div>
      </v-card-title>

      <!-- Quick Stats Bar -->
      <v-card-text v-if="!loading" class="pa-4">
        <v-row>
          <v-col cols="12" md="3">
            <v-card variant="tonal" color="primary">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ activeList.length.toLocaleString() }}</div>
                <div class="text-caption text-medium-emphasis">Filtered Results</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card variant="tonal" color="success">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ longestWord.lemma }}</div>
                <div class="text-caption text-medium-emphasis">Longest Word ({{ longestWord.length }} letters)</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card variant="tonal" color="info">
              <v-card-text class="text-center">
                <div class="text-h4 font-weight-bold">{{ averageWordLength.toFixed(1) }}</div>
                <div class="text-caption text-medium-emphasis">Average Length</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card variant="tonal" color="purple" class="cursor-pointer" @click="refreshWordOfDay">
                <v-card-text class="text-center">
                    <div class="d-flex align-center justify-center mb-1">
                    <v-icon color="purple-darken-2" class="me-2">mdi-star</v-icon>
                    <span class="text-caption text-medium-emphasis">Word of the Day</span>
                    <v-icon color="purple-darken-2" class="ms-2">mdi-refresh</v-icon>
                    </div>
                    <div class="text-h5 font-weight-bold text-purple-darken-2 d-flex align-center justify-center">
                    {{ wordOfDay }}
                    <v-btn
                        icon
                        size="x-small"
                        variant="text"
                        color="primary"
                        @click.stop="openWiktionary(wordOfDay)"
                        class="ms-2"
                    >
                        <v-icon size="small">mdi-book-open-variant</v-icon>
                    </v-btn>
                    </div>
                </v-card-text>
                </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <v-row v-if="loading" justify="center" align="center" style="min-height: 400px;">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
        <div class="mt-4 text-h6">Analyzing Linguistic Data...</div>
      </v-col>
    </v-row>

    <!-- Main Content -->
    <v-row v-else>
      <!-- Left Sidebar: Filters & Results -->
      <v-col cols="12" md="4" lg="3">
        <!-- Filters Card -->
        <v-card elevation="2" class="mb-4">
          <v-card-title class="bg-grey-lighten-4">
            <v-icon start>mdi-filter-variant</v-icon>
            Search & Filter
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="filters.query"
              label="Contains String"
              prepend-inner-icon="mdi-magnify"
              hint="Search within words (e.g., 'phob')"
              persistent-hint
              clearable
              variant="outlined"
              density="compact"
              class="mb-4"
              @keyup.enter="applyFilters"
            ></v-text-field>

            <v-text-field
              v-model="filters.starts"
              label="Starts With Letter"
              prepend-inner-icon="mdi-alphabetical"
              maxlength="1"
              hint="Single letter (e.g., 'a')"
              persistent-hint
              clearable
              variant="outlined"
              density="compact"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model.number="filters.len"
              label="Exact Word Length"
              prepend-inner-icon="mdi-ruler"
              type="number"
              min="0"
              hint="0 = any length"
              persistent-hint
              clearable
              variant="outlined"
              density="compact"
              class="mb-4"
            ></v-text-field>

            <v-range-slider
              v-model="filters.lengthRange"
              label="Length Range"
              :min="minWordLength"
              :max="maxWordLength"
              :step="1"
              thumb-label="always"
              color="primary"
              class="mb-4"
            ></v-range-slider>

            <v-chip-group
              v-model="filters.selectedLetters"
              multiple
              column
              class="mb-4"
            >
              <div class="text-caption mb-2">Must contain letters:</div>
              <v-chip
                v-for="letter in alphabet"
                :key="letter"
                :value="letter"
                filter
                variant="outlined"
                size="small"
              >
                {{ letter.toUpperCase() }}
              </v-chip>
            </v-chip-group>

            <v-btn
              @click="applyFilters"
              color="primary"
              block
              size="large"
              prepend-icon="mdi-filter-check"
              class="mb-2"
            >
              Apply Filters
            </v-btn>
            <v-btn
              @click="resetFilters"
              variant="outlined"
              block
              prepend-icon="mdi-filter-remove"
            >
              Reset All
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Results Card -->
        <v-card elevation="2">
          <v-card-title class="bg-grey-lighten-4 d-flex justify-space-between align-center">
            <span>
              <v-icon start>mdi-format-list-bulleted</v-icon>
              Results
            </span>
            <v-chip size="small" color="primary">
              {{ activeList.length }}
            </v-chip>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-virtual-scroll
              :items="activeList.slice(0, 200)"
              height="500"
              item-height="48"
            >
              <template v-slot:default="{ item }">
                <v-list-item>
                  <v-list-item-title class="d-flex align-center">
                    <span class="lemma-text">{{ item[0] }}</span>
                  </v-list-item-title>
                  <template v-slot:append>
                    <v-btn
                      icon
                      size="x-small"
                      variant="text"
                      color="primary"
                      @click="openWiktionary(item[0])"
                      class="me-1"
                    >
                      <v-icon size="small">mdi-book-open-variant</v-icon>
                    </v-btn>
                    <v-chip size="x-small" color="grey-lighten-2">
                      {{ item[0].length }}
                    </v-chip>
                  </template>
                </v-list-item>
              </template>
            </v-virtual-scroll>
            <v-divider></v-divider>
            <div v-if="activeList.length > 200" class="pa-2 text-center text-caption text-medium-emphasis">
              Showing first 200 of {{ activeList.length }} results
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Panel: Visualizations -->
      <v-col cols="12" md="8" lg="9">
        <v-tabs v-model="activeTab" bg-color="primary" dark class="mb-4">
          <v-tab value="distributions">
            <v-icon start>mdi-chart-bar</v-icon>
            Distributions
          </v-tab>
          <v-tab value="letters">
            <v-icon start>mdi-alphabetical-variant</v-icon>
            Letter Analysis
          </v-tab>
          <v-tab value="density">
            <v-icon start>mdi-format-list-numbered</v-icon>
            Letter Density
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Tab 1: Distributions -->
          <v-window-item value="distributions">
            <v-row>
              <v-col cols="12">
                <v-card elevation="2">
                  <v-card-title class="bg-grey-lighten-4">
                    <v-icon start>mdi-chart-bar</v-icon>
                    Word Length Distribution
                  </v-card-title>
                  <v-card-text style="height: 400px;">
                    <Bar :data="lengthChartData" :options="chartOptions" />
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card elevation="2">
                  <v-card-title class="bg-grey-lighten-4">
                    <v-icon start>mdi-chart-histogram</v-icon>
                    First Letter Distribution
                  </v-card-title>
                  <v-card-text style="height: 400px;">
                    <Bar :data="firstLetterChartData" :options="chartOptions" />
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <v-card elevation="2">
                    <v-card-title class="bg-grey-lighten-4">
                        <v-icon start>mdi-chart-histogram</v-icon>
                        Last Letter Distribution
                    </v-card-title>
                    <v-card-text style="height: 400px;">
                        <Bar :data="lastLetterChartData" :options="chartOptions" />
                    </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Tab 2: Letter Analysis -->
          <v-window-item value="letters">
            <v-card elevation="2" class="mb-4">
              <v-card-title class="bg-grey-lighten-4">
                <v-icon start>mdi-chart-bubble</v-icon>
                Total Letter Frequency (All Lemmas)
              </v-card-title>
              <v-card-text>
                <div class="letter-cloud">
                  <v-tooltip
                    v-for="(count, letter) in sortedLetterCounts"
                    :key="letter"
                    location="top"
                    >
                    <template v-slot:activator="{ props }">
                        <v-chip
                        v-bind="props"
                        :color="getLetterColor(count)"
                        class="ma-2 letter-bubble"
                        size="large"
                        >
                        <div class="letter-chip-content">
                            <div class="text-h5 font-weight-bold">{{ letter.toUpperCase() }}</div>
                            <div class="text-caption">{{ count.toLocaleString() }}</div>
                        </div>
                        </v-chip>
                    </template>
                    <span>{{ letter.toUpperCase() }}: {{ count.toLocaleString() }} occurrences</span>
                    </v-tooltip>
                </div>
              </v-card-text>
            </v-card>

            <v-card elevation="2">
              <v-card-title class="bg-grey-lighten-4">
                <v-icon start>mdi-table</v-icon>
                Letter Frequency Table
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="letterTableHeaders"
                  :items="letterTableData"
                  :items-per-page="26"
                  density="compact"
                >
                  <template v-slot:item.letter="{ item }">
                    <span class="text-h6 font-weight-bold">{{ item.letter.toUpperCase() }}</span>
                  </template>
                  <template v-slot:item.frequency="{ item }">
                    <v-progress-linear
                      :model-value="(item.count / maxLetterFreq) * 100"
                      :color="getLetterColor(item.count)"
                      height="20"
                    >
                      <strong>{{ item.count.toLocaleString() }}</strong>
                    </v-progress-linear>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Tab 3: Density Rankings -->
          <v-window-item value="density">
            <v-card elevation="2">
              <v-card-title class="bg-grey-lighten-4 d-flex justify-space-between align-center">
                <span>
                  <v-icon start>mdi-podium</v-icon>
                  Top 15 Words by Letter Density
                </span>
                <v-select
                  v-model="rankLetter"
                  :items="alphabet"
                  label="Select Letter"
                  density="compact"
                  variant="outlined"
                  style="max-width: 150px;"
                  hide-details
                >
                  <template v-slot:selection="{ item }">
                    {{ item.value.toUpperCase() }}
                  </template>
                  <template v-slot:item="{ item, props }">
                    <v-list-item v-bind="props" :title="item.value.toUpperCase()"></v-list-item>
                  </template>
                </v-select>
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="(word, index) in densityRank"
                    :key="word.lemma"
                    :class="{ 'bg-yellow-lighten-4': index === 0, 'bg-grey-lighten-4': index === 1, 'bg-orange-lighten-4': index === 2 }"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="index < 3 ? 'primary' : 'grey-lighten-2'" size="small">
                        <span class="font-weight-bold">{{ index + 1 }}</span>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-h6 d-flex align-center">
                      {{ word.lemma }}
                      <v-btn
                        icon
                        size="x-small"
                        variant="text"
                        color="primary"
                        @click="openWiktionary(word.lemma)"
                        class="ms-2"
                      >
                        <v-icon size="small">mdi-book-open-variant</v-icon>
                      </v-btn>
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-chip color="primary" variant="elevated">
                        <v-icon start>mdi-repeat</v-icon>
                        {{ word.count }} × {{ rankLetter.toUpperCase() }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <!-- Hangman Game Dialog -->
    <v-dialog v-model="hangmanDialog" max-width="700" persistent>
      <v-card>
        <v-card-title class="bg-success text-white pa-4">
          <v-icon start color="white">mdi-gamepad-variant</v-icon>
          Guess the Word
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="closeHangmanGame"></v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <!-- Game Over Screens -->
          <div v-if="hangman.gameWon" class="text-center py-8">
            <v-icon size="120" color="success">mdi-trophy</v-icon>
            <div class="text-h3 text-success mt-4">You Win!</div>
            <div class="text-h5 mt-4 d-flex align-center justify-center">
              The word was: <strong class="ms-2">{{ hangman.word }}</strong>
              <v-btn
                icon
                size="small"
                variant="text"
                color="primary"
                @click="openWiktionary(hangman.word)"
                class="ms-2"
              >
                <v-icon>mdi-book-open-variant</v-icon>
              </v-btn>
            </div>
            <v-btn
              color="success"
              size="large"
              class="mt-6"
              prepend-icon="mdi-replay"
              @click="startHangmanGame"
            >
              Play Again
            </v-btn>
          </div>

          <div v-else-if="hangman.gameLost" class="text-center py-8">
            <v-icon size="120" color="error">mdi-close-circle</v-icon>
            <div class="text-h3 text-error mt-4">Game Over!</div>
            <div class="text-h5 mt-4 d-flex align-center justify-center">
              The word was: <strong class="ms-2">{{ hangman.word }}</strong>
              <v-btn
                icon
                size="small"
                variant="text"
                color="primary"
                @click="openWiktionary(hangman.word)"
                class="ms-2"
              >
                <v-icon>mdi-book-open-variant</v-icon>
              </v-btn>
            </div>
            <v-btn
              color="primary"
              size="large"
              class="mt-6"
              prepend-icon="mdi-replay"
              @click="startHangmanGame"
            >
              Try Again
            </v-btn>
          </div>

          <!-- Active Game -->
          <div v-else>
            <!-- Lives Indicator -->
            <div class="d-flex justify-center mb-6 ga-2">
              <v-avatar
                v-for="n in 7"
                :key="n"
                :color="n <= hangman.wrongGuesses ? 'error' : 'grey-lighten-3'"
                size="40"
              >
                <v-icon v-if="n <= hangman.wrongGuesses" color="white">mdi-close</v-icon>
              </v-avatar>
            </div>

            <!-- Word Display -->
            <div class="word-display mb-6">
              <span
                v-for="(letter, index) in hangman.displayWord"
                :key="index"
                class="letter-slot"
                :class="{ 'hyphen-slot': letter === '-' }"
              >
                {{ letter }}
              </span>
            </div>

            <!-- Alphabet Buttons -->
            <div class="alphabet-grid">
              <v-btn
                v-for="letter in alphabet"
                :key="letter"
                :disabled="hangman.guessedLetters.includes(letter)"
                :color="getLetterButtonColor(letter)"
                :variant="hangman.guessedLetters.includes(letter) ? 'tonal' : 'elevated'"
                size="large"
                @click="guessLetter(letter)"
              >
                {{ letter.toUpperCase() }}
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// State
const wordData = ref([]); 
const activeList = ref([]);
const loading = ref(true);
const rankLetter = ref('e');
const activeTab = ref('distributions');
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
const wordOfDay = ref('');
const hangmanDialog = ref(false);

const filters = reactive({ 
  query: '', 
  starts: '', 
  len: 0,
  lengthRange: [1, 20],
  selectedLetters: []
});

const hangman = reactive({
  word: '',
  displayWord: [],
  guessedLetters: [],
  wrongGuesses: 0,
  gameWon: false,
  gameLost: false
});

// Load data
onMounted(async () => {
  try {
    const response = await fetch('/data/lemmas_clean.txt');
    const text = await response.text();
    
    wordData.value = text.split('\n')
      .filter(line => line.includes(' -> '))
      .map(line => {
        const [lemma, variants] = line.split(' -> ');
        return [lemma.trim(), variants.split(',').map(v => v.trim())];
      });
    
    activeList.value = [...wordData.value];
    
    // Set initial length range
    filters.lengthRange = [minWordLength.value, maxWordLength.value];
    
    // Set word of the day
    refreshWordOfDay();
  } finally {
    loading.value = false;
  }
});

// Word of the Day
const refreshWordOfDay = () => {
  if (wordData.value.length === 0) return;
  const randomIndex = Math.floor(Math.random() * wordData.value.length);
  wordOfDay.value = wordData.value[randomIndex][0];
};

// Wiktionary link helper
const openWiktionary = (word) => {
  window.open(`https://en.wiktionary.org/wiki/${word}`, '_blank');
};

// Hangman Game Functions
const startHangmanGame = () => {
  // Pick a random word longer than 7 characters
  const longWords = wordData.value.filter(([lemma]) => lemma.length > 7);
  if (longWords.length === 0) {
    alert('No words longer than 7 characters available!');
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * longWords.length);
  const selectedWord = longWords[randomIndex][0].toLowerCase();
  
  hangman.word = selectedWord;
  // Display hyphens from the start, hide letters with underscore
  hangman.displayWord = selectedWord.split('').map(char => char === '-' ? '-' : '_');
  hangman.guessedLetters = [];
  hangman.wrongGuesses = 0;
  hangman.gameWon = false;
  hangman.gameLost = false;
  hangmanDialog.value = true;
};

const guessLetter = (letter) => {
  if (hangman.guessedLetters.includes(letter)) return;
  
  hangman.guessedLetters.push(letter);
  
  if (hangman.word.includes(letter)) {
    // Correct guess - reveal letters
    hangman.word.split('').forEach((char, index) => {
      if (char === letter) {
        hangman.displayWord[index] = letter.toUpperCase();
      }
    });
    
    // Check for win (ignore hyphens)
    const hiddenLetters = hangman.displayWord.filter((char, idx) => 
      char === '_' && hangman.word[idx] !== '-'
    );
    if (hiddenLetters.length === 0) {
      hangman.gameWon = true;
    }
  } else {
    // Wrong guess
    hangman.wrongGuesses++;
    
    // Check for loss
    if (hangman.wrongGuesses >= 7) {
      hangman.gameLost = true;
      // Reveal the word
      hangman.displayWord = hangman.word.split('').map(c => c.toUpperCase());
    }
  }
};

const getLetterButtonColor = (letter) => {
  if (!hangman.guessedLetters.includes(letter)) return 'primary';
  return hangman.word.includes(letter) ? 'success' : 'error';
};

const closeHangmanGame = () => {
  hangmanDialog.value = false;
};

// Filtering
const applyFilters = () => {
  activeList.value = wordData.value.filter(([lemma]) => {
    const lower = lemma.toLowerCase();
    
    // Text query
    const mQuery = filters.query ? lower.includes(filters.query.toLowerCase()) : true;
    
    // Starts with
    const mStart = filters.starts ? lower.startsWith(filters.starts.toLowerCase()) : true;
    
    // Exact length
    const mLen = filters.len > 0 ? lemma.length === filters.len : true;
    
    // Length range
    const mRange = lemma.length >= filters.lengthRange[0] && lemma.length <= filters.lengthRange[1];
    
    // Must contain selected letters
    const mLetters = filters.selectedLetters.length === 0 || 
      filters.selectedLetters.every(letter => lower.includes(letter));
    
    return mQuery && mStart && mLen && mRange && mLetters;
  });
};

const resetFilters = () => {
  filters.query = '';
  filters.starts = '';
  filters.len = 0;
  filters.lengthRange = [minWordLength.value, maxWordLength.value];
  filters.selectedLetters = [];
  activeList.value = [...wordData.value];
};

// Computed values
const minWordLength = computed(() => {
  if (!wordData.value.length) return 1;
  return Math.min(...wordData.value.map(([lemma]) => lemma.length));
});

const maxWordLength = computed(() => {
  if (!wordData.value.length) return 20;
  return Math.max(...wordData.value.map(([lemma]) => lemma.length));
});

const longestWord = computed(() => {
  if (!wordData.value.length) return { lemma: 'N/A', length: 0 };
  const w = wordData.value.reduce((a, b) => a[0].length > b[0].length ? a : b);
  return { lemma: w[0], length: w[0].length };
});

const averageWordLength = computed(() => {
  if (!wordData.value.length) return 0;
  const total = wordData.value.reduce((sum, [lemma]) => sum + lemma.length, 0);
  return total / wordData.value.length;
});

// Charts
const lengthChartData = computed(() => {
  const distribution = {};
  activeList.value.forEach(([lemma]) => {
    const len = lemma.length;
    distribution[len] = (distribution[len] || 0) + 1;
  });
  
  const sortedKeys = Object.keys(distribution).sort((a, b) => Number(a) - Number(b));
  
  return {
    labels: sortedKeys,
    datasets: [{
      label: 'Word Count',
      backgroundColor: '#1976D2',
      data: sortedKeys.map(k => distribution[k])
    }]
  };
});

const firstLetterChartData = computed(() => {
  const distribution = {};
  alphabet.forEach(letter => distribution[letter] = 0);
  
  activeList.value.forEach(([lemma]) => {
    const first = lemma[0].toLowerCase();
    if (alphabet.includes(first)) {
      distribution[first]++;
    }
  });
  
  return {
    labels: alphabet.map(l => l.toUpperCase()),
    datasets: [{
      label: 'Words Starting With',
      backgroundColor: '#43A047',
      data: alphabet.map(l => distribution[l])
    }]
  };
});

const lastLetterChartData = computed(() => {
  const distribution = {};
  alphabet.forEach(letter => distribution[letter] = 0);
  
  activeList.value.forEach(([lemma]) => {
    const last = lemma[lemma.length - 1].toLowerCase();
    if (alphabet.includes(last)) {
      distribution[last]++;
    }
  });
  
  return {
    labels: alphabet.map(l => l.toUpperCase()),
    datasets: [{
      label: 'Words Ending With',
      backgroundColor: '#E53935',
      data: alphabet.map(l => distribution[l])
    }]
  };
});

const totalLetterCounts = computed(() => {
  const counts = {};
  wordData.value.forEach(([lemma]) => {
    for (const char of lemma.toLowerCase()) {
      if (alphabet.includes(char)) counts[char] = (counts[char] || 0) + 1;
    }
  });
  return counts;
});

const sortedLetterCounts = computed(() => {
  return Object.fromEntries(
    Object.entries(totalLetterCounts.value).sort((a, b) => b[1] - a[1])
  );
});

const maxLetterFreq = computed(() => Math.max(...Object.values(totalLetterCounts.value)));

const densityRank = computed(() => {
  const char = rankLetter.value.toLowerCase();
  return [...activeList.value]
    .map(([lemma]) => ({ lemma, count: (lemma.toLowerCase().split(char).length - 1) }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
});

// Letter table
const letterTableHeaders = [
  { title: 'Letter', key: 'letter', sortable: true },
  { title: 'Frequency', key: 'frequency', sortable: true },
  { title: 'Percentage', key: 'percentage', sortable: true }
];

const letterTableData = computed(() => {
  const total = Object.values(totalLetterCounts.value).reduce((a, b) => a + b, 0);
  return Object.entries(totalLetterCounts.value)
    .map(([letter, count]) => ({
      letter,
      count,
      percentage: ((count / total) * 100).toFixed(2) + '%'
    }))
    .sort((a, b) => b.count - a.count);
});

// Helper functions
const getLetterColor = (count) => {
  const ratio = count / maxLetterFreq.value;
  if (ratio > 0.8) return 'red';
  if (ratio > 0.6) return 'orange';
  if (ratio > 0.4) return 'amber';
  if (ratio > 0.2) return 'light-blue';
  return 'blue-grey';
};

const getLetterSize = (count) => {
  const ratio = count / maxLetterFreq.value;
  if (ratio > 0.8) return 'x-large';
  if (ratio > 0.6) return 'large';
  if (ratio > 0.4) return 'default';
  return 'small';
};

const chartOptions = { 
  responsive: true, 
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    }
  }
};
</script>

<style scoped>
.lexicon-visualizer {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 24px;
}

.letter-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  padding: 20px;
}

.letter-chip-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 8px 4px;
}

.letter-bubble {
  min-width: 80px;
  min-height: 80px;
  transition: transform 0.2s;
}

.letter-bubble:hover {
  transform: scale(1.1);
}

.cursor-pointer {
  cursor: pointer;
}

.lemma-text {
  font-weight: 500;
}

/* Hangman Game Styles */
.word-display {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.letter-slot {
  display: inline-block;
  width: 40px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  border-bottom: 3px solid #333;
  color: #1976D2;
}

.letter-slot.hyphen-slot {
  border-bottom: none;
  color: #666;
}

.alphabet-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  max-width: 600px;
  margin: 0 auto;
}
</style>