<template>
  <v-container>

<div v-if="isLoading" class="text-center my-5">
  <v-progress-circular indeterminate color="primary" />
</div>

<v-alert v-else-if="error" type="error">{{ error }}</v-alert>

<div v-else-if="availableGames.length === 0" class="text-center my-5">
  <v-alert type="info">No data available.</v-alert>
</div>

<v-row v-else>
      <v-col cols="12">
        <div class="d-flex align-center px-6">

          <!-- LEFT: select -->
          <div class="flex-shrink-0">
            <v-select
              v-model="selectedGame"
              :items="availableGames"
              label="Select Game"
              variant="outlined"
              density="compact"
              style="max-width: 400px; min-width: 200px"
            />
          </div>

          <!-- CENTER: title -->
          <div v-if="$vuetify.display.smAndUp" class="flex-grow-1 text-center">
            <h4 class="text-h4 font-weight-bold mb-0">
              {{ selectedGame }}
            </h4>
          </div>

          <!-- RIGHT: image (desktop only) -->
          <div v-if="$vuetify.display.smAndUp" class="flex-shrink-0 d-none d-md-flex">
            <v-img
              :src="selectedGame ? gamePictures[selectedGame] : gamePictures['Pronoun Practice']"
              alt="Game name"
              max-width="400"
              min-width="200"
              contain
            />
          </div>

        </div>
      </v-col>


      <v-col cols="12" v-if="selectedGame && groupedGames[selectedGame]">
        

        <v-row dense class="my-4">
          <!-- Accuracy Pie -->
          <v-col cols="12" md="6">
            <v-card class="chart-card pa-4" elevation="2">
              <v-card-title class="text-h6">Overall Accuracy</v-card-title>
              <v-card-text class="d-flex flex-column align-center">
                <PieChart :data="getPieChartData(groupedGames[selectedGame])" />
                <div class="text-subtitle-2 mt-4">
                  {{ groupedGames[selectedGame].sessions.length }} session
                  {{ groupedGames[selectedGame].sessions.length !== 1 ? 's' : '' }}
                  — {{ groupedGames[selectedGame].totalRounds }} rounds
                </div>
                <div class="text-subtitle-2">
                  {{ groupedGames[selectedGame].totalCorrect }} correct,
                  {{ groupedGames[selectedGame].totalIncorrect }} incorrect
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Sparkline -->
          <v-col cols="12" md="6">
            <v-card class="chart-card pa-4" v-if="sessionAccuracyTrend.length > 1" elevation="2">
              <v-card-title class="text-h6">Accuracy Trend</v-card-title>
              <v-card-text>
                <v-sparkline
                  :model-value="[...groupedGames[selectedGame].accuracyTrend].reverse()"
                  :gradient="sparklineGradients[4]"
                  color="blue"
                  line-width="3"
                  stroke-linecap="round"
                  smooth
                  auto-draw
                  auto-draw-duration="1200"
                  auto-draw-easing="ease"
                  padding="20"
                  :labels="generateSparklineLabels([...groupedGames[selectedGame].accuracyTrend].reverse())"
                  :show-labels="true"
                />
                <div class="text-caption text-muted text-center mt-2">
                  Accuracy per game played
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Trophy / Achievements Card -->
         <v-row dense>
          <v-col v-if="automaticAchievements.length > 0" cols="12" lg="6">
            <v-card elevation="2" class="chart-card trophy-card pa-4 mb-6">
              <v-card-title class="text-h5">
                <v-icon class="me-4">mdi-trophy</v-icon>
                Achievements in {{ selectedGame }}
              </v-card-title>

              <v-card-text class="achievement-card-body">
                <v-progress-linear v-if="loadingAchievements" indeterminate color="primary" class="mb-4" />

                <v-alert v-else-if="error" type="error" class="mb-4">
                  {{ error }}
                </v-alert>

                <!-- scroll container -->
                <div class="achievement-scroll">
                  <v-list v-if="automaticAchievements.length">
                    <v-list-item
                      v-for="(achievement, index) in automaticAchievements"
                      :key="achievement.id"
                      class="mb-4 golden-list-item"
                    >
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                          {{ achievement.name }}
                          <v-icon class="m-2" icon="mdi-star" />
                        </v-list-item-title>

                        <v-list-item-subtitle class="text-wrap mb-2">
                          {{ achievement.description }}
                        </v-list-item-subtitle>

                        <v-list-item-subtitle>
                          <strong>Achieved on:</strong> {{ formatDate(achievement.achieved_on) }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>

                  <div
                    v-else
                    class="text-center mt-8 text-medium-emphasis"
                  >
                    No achievements yet
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

        <!-- Error Explainer -->
          <v-col cols="12" lg="6" xl="4">
            <v-card
              class="chart-card pa-3 d-flex flex-column justify-space-between"
              elevation="3"
              style="background-color: #eef5ee"
            >
              <v-card-title class="text-h5">
                <v-icon class="me-3 mb-2">mdi-lightbulb-on-10</v-icon>
                Error Explainer
              </v-card-title>
              <v-card-subtitle class="text-center">
                {{ groupedGames[selectedGame].totalIncorrect }} incorrect answers
              </v-card-subtitle>
              <v-card-text v-if="currentError(selectedGame)">
                <div class="text-center">
                  <p v-if="selectedGame != 'Prove it!' && selectedGame != 'Pronunciation Challenge'">Can you explain why this answer was incorrect?</p>
                  <p v-if="selectedGame === 'Prove it!'">Can you answer this question with the correct form of the irregular verb?</p>
                  <p v-if="selectedGame === 'Pronunciation Challenge'">Can you pronounce this word correctly?</p>
                  <v-divider gradient v-if="selectedGame === 'Pronunciation Challenge' || selectedGame === 'Prove it!'" style="margin-top: 20px; margin-bottom: 50px;"></v-divider>
                  <div v-if="selectedGame === 'Pronoun Practice' || selectedGame === 'Quantifier Quest'" class="mb-2 d-flex justify-center align-center">
                        <v-img
                            :src="(selectedGame === 'Quantifier Quest' ? quantifierImagePath : pronounImagePath) + currentError(selectedGame)?.image"
                            alt="Prompt Image"
                            class="mt-1 mb-1 rounded-lg border-md"
                            max-width="110"
                            aspect-ratio="1"
                            cover
                        />
                  </div>
                  <div class="my-2 text-center font-weight-light" style="font-size: 1.2rem;">
                    "{{ currentError(selectedGame)?.question }}"
                  </div>
                  <div v-if="selectedGame != 'Prove it!' && selectedGame != 'Pronunciation Challenge'" class="text-center text-overline">
                    <em v-if="currentError(selectedGame)?.out_of_time || currentError(selectedGame)?.user_answer === ''">No answer submitted</em>
                        <span v-else>Your answer: {{ currentError(selectedGame)?.user_answer }}</span>
                    
                  </div>
                </div>
              </v-card-text>
              <v-card-text v-else class="text-center text-caption text-muted mt-6">
                No errors yet.
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn
                  color="brown-lighten-1"
                  size="large"
                  @click="nextError(selectedGame)"
                  :disabled="!groupedGames[selectedGame].incorrectRounds.length"
                >
                  Next error
                  <v-icon size="32" class="ms-2">mdi-arrow-right-thin-circle-outline</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Session Details -->
        <v-card class="pa-4 mt-4" elevation="2">
          <div class="text-h6 mb-2">Game Details</div>
          <v-expansion-panels>
            <v-expansion-panel
              v-if="selectedGame != 'Prove it!' && selectedGame != 'Pronunciation Challenge'"
              v-for="session in groupedGames[selectedGame].sessions"
              :key="session.session_id"
            >
              <v-expansion-panel-title>
                <span class="font-weight-medium">
                  {{ session.correct_count }} correct out of {{ session.total_rounds }}
                </span>
                — {{ new Date(session.started_at).toLocaleString() }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Question</th>
                      <th v-if="selectedGame === 'Quantifier Quest' || selectedGame === 'Pronoun Practice'">Image</th>
                      <th>Your Answer</th>
                      <th>Correct?</th>
                      <th>Typo?</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="round in session.rounds" :key="round.id">
                      <td>{{ round.prompt_number }}</td>
                      <td>{{ round.question }}</td>
                      <td v-if="selectedGame === 'Quantifier Quest' || selectedGame === 'Pronoun Practice'"><img :src="(selectedGame === 'Quantifier Quest' ? quantifierImagePath : pronounImagePath) + round.image" alt="Question Image" style="max-height: 40px;" /></td>
                      <td>{{ round.user_answer }}</td>
                      <td>
                        <v-icon :color="round.is_correct ? 'green' : 'red'">
                          {{ round.is_correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
                        </v-icon>
                      </td>
                      <td>{{ round.typo ? 'Yes' : 'No' }}</td>
                      <td>
                        <template v-if="!round.is_correct && !round.typo_requested">
                          <v-btn
                            size="small"
                            color="primary"
                            @click="requestTypo(round)"
                          >
                            This was a typo
                          </v-btn>
                        </template>
                        <template v-else-if="round.typo_requested">
                          <span class="badge bg-warning text-dark">Pending</span>
                        </template>
                        <template v-else-if="round.typo_accepted">
                          <span class="badge bg-success">Approved</span>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel
              v-if="selectedGame === 'Prove it!' || selectedGame === 'Pronunciation Challenge'"
              v-for="session in groupedGames[selectedGame].sessions" 
              :key="session.session_id"
            >
              <v-expansion-panel-title>
                <span class="font-weight-medium">
                  {{ session.correct_count }} correct out of {{ session.total_rounds }}
                </span>
                — {{ new Date(session.started_at).toLocaleString() }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th v-if="selectedGame === 'Prove it!'">Verb</th>
                      <th>Question</th>
                      <th>Correct?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="round in session.rounds" :key="round.id">
                      <td>{{ round.prompt_number }}</td>
                      <td v-if="selectedGame === 'Prove it!'">{{ round.label }}</td>
                      <td>{{ round.question }}</td>
                      <td>
                        <v-icon :color="round.is_correct ? 'green' : 'red'">
                          {{ round.is_correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
                        </v-icon>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>

    <div>
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      timeout="3000"
      top
      right
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn text @click="snackbar.visible = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
  </v-container>
    
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from 'vue-router';
import api from "@/axios";
import PieChart from "@/components/charts/PieChart.vue";

// ----- Interfaces -----
interface OtherGameRound {
  id: number;
  user_answer: string;
  question: string;
  label: string;
  image: string;
  prompt_number: number;
  is_correct: boolean | null;
  out_of_time: boolean | null;
  typo: boolean;
  typo_requested: boolean;
  typo_accepted: boolean | null;
  elapsed_time?: number;
  question_text?: string;
}

interface OtherGameSession {
  session_id: number;
  student: { id: number; user: { username: string } };
  game_name: string;
  total_rounds: number;
  correct_count: number;
  rounds?: OtherGameRound[]; // may be missing
  started_at: string;
  finished_at?: string;
}

interface GroupedGameData {
  sessions: OtherGameSession[];
  totalRounds: number;
  totalCorrect: number;
  totalIncorrect: number;
  accuracyTrend: number[];
  incorrectRounds: OtherGameRound[];
}

interface Snackbar {
  message: string;
  color: string;
  visible: boolean;
}

interface Achievement {
  id: number
  student: number
  student_username: string
  name: string
  description: string
  evidence: string
  criteria_key: string
  achieved_on: string
  manually_created: boolean
}
// ----- State -----
const route = useRoute()
const pronounImagePath = "/images/pronoun_pics_resized/";
const quantifierImagePath = "/images/quant_pics_resized/";

const loadingSessions = ref(true);
const loadingAchievements = ref(true);

const isLoading = computed(() => loadingSessions.value || loadingAchievements.value);

const error = ref<string | null>(null);
const groupedGames = ref<Record<string, GroupedGameData>>({});
const snackbar = ref<Snackbar>({
  message: "",
  color: "success",
  visible: false,
});
const allAchievements = ref<Achievement[]>([]);
const automaticAchievements = ref<Achievement[]>([])
const manualAchievements = ref<Achievement[]>([])
const achievedKeys = ref<Set<string>>(new Set())

const selectedGame = ref<string | null>(null);
// Filtered games with at least one session
const availableGames = computed(() =>
  GAME_NAMES.filter(name => groupedGames.value[name]?.sessions.length > 0)
);

const typoRequests = ref<Set<number>>(new Set());
const errorIndex = ref<Record<string, number>>({});

// ----- Snackbar -----
const showSnackbar = (message: string, color = "success") => {
  snackbar.value = { message, color, visible: true };
};

// --- Sparklines ---
function generateSparklineLabels(arr: number[]): string[] {
      if (arr.length <= 8) {
        return arr.map(val => `${val}%`);
      }

      const lastIndex = arr.length - 1;
      const showIndices = [
        0,
        Math.floor(arr.length * 0.25),
        Math.floor(arr.length * 0.5),
        Math.floor(arr.length * 0.75),
        lastIndex,
      ];

      return arr.map((val, i) =>
        showIndices.includes(i) ? `${val}%` : "\u00A0" // non-breaking space
      );
    }

const sparklineGradients = [
      ['#222'], ['#42b3f4'], ['green', 'yellow', 'red'],
      ['purple', 'violet'], ['#00c6ff', '#F0F', '#FF0'],
      ['#f72047', '#ffd200', '#1feaea'],
    ];

const sessionAccuracyTrend = computed(() => {
  if (!selectedGame.value) return [];
  return groupedGames.value[selectedGame.value]?.accuracyTrend ?? [];
});


// ----- Constants -----
const GAME_NAMES = [
  "Comparison",
  "Idea Linker",
  "Parallel Universe",  
  "Passive Party",
  "Pronoun Practice",
  "Pronunciation Challenge",
  "Prove it!",
  "Quantifier Quest",
  "Regret Machine",
  "Reported Speech",
  "Tricky Translator",
  "Uses Of Auxiliaries",
  "Verb Mixer",
  "Year 2040",
  "Word Families",
];
const gamePictures: Record<string, string> = {
  "Comparison": "/images/banners/Comparison.png",
  "Idea Linker": "/images/banners/IdeaLinker.png",
  "Pronoun Practice": "/images/banners/PronounPractice.png",
  "Quantifier Quest": "/images/banners/QuantifierQuest.png",
  "Uses Of Auxiliaries": "/images/banners/UsesOfAuxiliaries.png",
  "Tricky Translator": "/images/banners/TrickyTranslator.png",
  "Passive Party": "/images/banners/PassiveParty.png",
  "Word Families": "/images/banners/WordFamilies.png",
  "Regret Machine": "/images/banners/RegretMachine.png",
  "Prove it!": "/images/banners/ProveIt.png",
  "Pronunciation Challenge": "/images/banners/PronunciationChallenge.png",
  "Reported Speech": "/images/banners/ReportedSpeech.png",
  "Parallel Universe": "/images/banners/ParallelUniverse.png",
  "Year 2040": "/images/banners/Year2040.png"
};

// ----- Fetch and Group -----
onMounted(async () => {
  error.value = null;

  try {
    // Run both in parallel (faster) and track each independently
    loadingAchievements.value = true;
    loadingSessions.value = true;

    const achievementsPromise = fetchAchievements(); // this will manage loadingAchievements
    const sessionsPromise = api.get<OtherGameSession[]>("/other-games-sessions/");

    const [, res] = await Promise.all([achievementsPromise, sessionsPromise]);
    const sessions = res.data;

    const grouped: Record<string, GroupedGameData> = {};
    for (const name of GAME_NAMES) {
      grouped[name] = {
        sessions: [],
        totalRounds: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        accuracyTrend: [],
        incorrectRounds: [],
      };
    }

    for (const s of sessions) {
      const baseName = normalizeGameName(s.game_name);
      if (!GAME_NAMES.includes(baseName)) continue;

      const group = grouped[baseName];
      group.sessions.push(s);
      group.totalRounds += s.total_rounds ?? 0;
      group.totalCorrect += s.correct_count ?? 0;
      group.totalIncorrect += (s.total_rounds ?? 0) - (s.correct_count ?? 0);
    }

    for (const [, data] of Object.entries(grouped)) {
      data.accuracyTrend = data.sessions.map(s =>
        Number(((s.correct_count / s.total_rounds) * 100).toFixed(0))
      );
      data.incorrectRounds = data.sessions.flatMap(s =>
        (s.rounds || []).filter(r => !r.is_correct)
      );
    }

    groupedGames.value = grouped;

    const queryGame = typeof route.query.game === "string" ? route.query.game : null;
    if (queryGame && availableGames.value.includes(queryGame)) {
      selectedGame.value = queryGame;
    } else {
      selectedGame.value = availableGames.value[0] ?? null;
    }
  } catch (err) {
    console.error(err);
    error.value = "Failed to load game sessions.";
  } finally {
    loadingSessions.value = false;
  }
});


// Fetch all achievements
const fetchAchievements = async () => {
  loadingAchievements.value = true;
  error.value = null;

  try {
    const res = await api.get<Achievement[]>("/achievements/");
    allAchievements.value = res.data;
    manualAchievements.value = res.data.filter(a => a.manually_created);

    // keep automaticAchievements in sync even on first load
    automaticAchievements.value = filterAchievementsForGame(selectedGame.value ?? "");
  } catch (err) {
    console.error("Failed to fetch achievements:", err);
    error.value = "Failed to load achievements.";
  } finally {
    loadingAchievements.value = false;
  }
};


// Watch for game selection changes
watch(selectedGame, (game) => {
  automaticAchievements.value = filterAchievementsForGame(game ?? "");
});

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

// ----- Filter achievements by selected game -----
const filterAchievementsForGame = (game: string) => {
  if (!game) return [];
  return allAchievements.value
    .filter(a => !a.manually_created)               // automatic only
    .filter(a => a.name.startsWith(game) || a.criteria_key.startsWith(game) || a.criteria_key.startsWith('hard_work_'+game.toLowerCase().slice(0, 3))) // beginsWith
    .sort((a, b) => new Date(b.achieved_on).getTime() - new Date(a.achieved_on).getTime());
};

// ----- Pie Chart Data -----
const getPieChartData = (gameData: GroupedGameData) => {
  const total = gameData.totalCorrect + gameData.totalIncorrect;
  
  // Avoid division by zero
  if (total === 0) {
    return [
      { label: "Correct", value: 0 },
      { label: "Incorrect", value: 0 },
    ];
  }
  
  const correctPercentage = Math.round((gameData.totalCorrect / total) * 100);
  const incorrectPercentage = Math.round((gameData.totalIncorrect / total) * 100);
  
  return [
    { label: "Correct", value: correctPercentage },
    { label: "Incorrect", value: incorrectPercentage },
  ];
};

// ----- Typo Request -----
const requestTypo = async (round: OtherGameRound) => {
  if (typoRequests.value.has(round.id)) return;
  typoRequests.value.add(round.id);

  try {
    await api.patch(`/other-games-rounds/${round.id}/request-typo/`, {
      typo_requested: true,
    });
    round.typo_requested = true;
    showSnackbar("Typo request submitted!");
  } catch (err) {
    console.error("Typo request failed:", err);
    typoRequests.value.delete(round.id);
    showSnackbar("Failed to send typo request.", "error");
  }
};

// ----- Error Explainer -----
function normalizeGameName(name: string): string {
  if (!name) return name
  if (name.startsWith("Comparison")) return "Comparison"
  if (name.startsWith("Parallel Universe")) return "Parallel Universe"
  if (name.startsWith("Uses Of Auxiliaries")) return "Uses Of Auxiliaries"
  if (name.startsWith("Quantifier Quest")) return "Quantifier Quest"
  if (name.startsWith("Pronoun Practice")) return "Pronoun Practice"
  if (name.startsWith("Prove it!")) return "Prove it!"
  if (name.startsWith("Pronunciation Challenge")) return "Pronunciation Challenge"

  return name
}


const currentError = (gameName: string): OtherGameRound | null => {
  const game = groupedGames.value[gameName];
  if (!game || !game.incorrectRounds.length) return null;
  const index = errorIndex.value[gameName] || 0;
  return game.incorrectRounds[index];
};

const nextError = (gameName: string): void => {
  const game = groupedGames.value[gameName];
  if (!game || !game.incorrectRounds.length) return;
  errorIndex.value[gameName] = ((errorIndex.value[gameName] || 0) + 1) % game.incorrectRounds.length;
};
</script>



<style scoped>
.chart-card {
  height: 420px;
  display: flex;
  flex-direction: column;
}
.chart-card .v-card-text {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.golden-list-item {
  background: linear-gradient(
    135deg,
    #fff7d6,
    #f3e3a3
  );
  border: 1px solid rgba(184, 134, 11, 0.45); /* muted gold */
  border-radius: 16px;
  padding: 18px 20px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

/* Titles pop slightly */
.golden-list-item .v-list-item-title {
  color: #5c4500;
}

/* Subtitles stay soft */
.golden-list-item .v-list-item-subtitle {
  color: #6b5a1f;
}

.trophy-card {
  position: relative;
  border: 1px solid rgba(212, 175, 55, 0.35);
  background:
    linear-gradient(180deg, #ffffff 0%, #fffaf0 100%);
  box-shadow:
    0 6px 18px rgba(180, 150, 60, 0.12);
}

.trophy-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;

  background:
    linear-gradient(
      120deg,
      transparent 20%,
      rgba(255, 235, 160, 0.35) 40%,
      rgba(255, 215, 120, 0.2) 50%,
      transparent 70%
    );

  opacity: 0.5;
}

.trophy-card .v-card-title {
  color: #b38b00;
  font-weight: 600;
}

.trophy-card .v-icon {
  color: #caa600;
}


</style>
