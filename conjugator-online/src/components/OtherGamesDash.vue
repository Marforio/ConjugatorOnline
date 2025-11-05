<template>
  <v-container>

    <div v-if="loading" class="text-center my-5">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert v-else-if="error" type="error">{{ error }}</v-alert>

    <div v-else-if="availableGames.length === 0" class="text-center my-5">
      <v-alert type="info">No data available.</v-alert>
    </div>

    <v-row v-else>
      <v-col cols="12" md="4">
        <div class="d-flex justify-end">
          <v-select
          v-model="selectedGame"
          :items="availableGames"
          label="Select Game"
          outlined
          dense
          ></v-select>
        </div>
      </v-col>

      <v-col cols="12" v-if="selectedGame && groupedGames[selectedGame]">
        <h5 class="text-h5 font-weight-bold">{{ selectedGame }}</h5>

        <v-row dense>
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
                  :model-value="groupedGames[selectedGame].accuracyTrend"
                  :gradient="sparklineGradients[4]"
                  color="blue"
                  line-width="3"
                  stroke-linecap="round"
                  smooth
                  auto-draw
                  auto-draw-duration="1200"
                  auto-draw-easing="ease"
                  padding="20"
                  :labels="generateSparklineLabels(sessionAccuracyTrend)"
                  :show-labels="true"
                />
                <div class="text-caption text-muted text-center mt-2">
                  Accuracy per game played
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Error Explainer -->
          <v-row>
          <v-col cols="12" lg="6" xl="4">
            <v-card
              class="pa-4 d-flex flex-column justify-space-between"
              elevation="3"
              style="background-color: #fff9db; min-height: 430px;"
            >
              <v-card-title class="text-h5 font-weight-bold">
                <v-icon class="me-3 mb-2">mdi-lightbulb-on-10</v-icon>
                Error Explainer
              </v-card-title>
              <v-card-subtitle class="text-center">
                {{ groupedGames[selectedGame].totalIncorrect }} incorrect answers
              </v-card-subtitle>
              <v-card-text v-if="currentError(selectedGame)">
                <div class="text-center">
                  <p>Can you explain why this answer was incorrect?</p>
                  <div class="mb-4 d-flex justify-center align-center">
                        <v-img
                            :src="`/images/pronoun_pics_resized/${currentError(selectedGame)?.image}`"
                            alt="Pronoun Image"
                            class="mt-3 mb-3 rounded-lg border-md"
                            max-width="150"
                            aspect-ratio="1"
                            cover
                        />
                  </div>
                  <div class="my-6 text-center font-weight-light" style="font-size: 2rem;">
                    "{{ currentError(selectedGame)?.question }}"
                  </div>
                  <div class="text-center text-overline">
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
                      <th>Your Answer</th>
                      <th>Correct?</th>
                      <th>Typo?</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="round in session.rounds" :key="round.id">
                      <td>{{ round.prompt_number }}</td>
                      <td>{{ round.question_text }}</td>
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
import { ref, onMounted, computed } from "vue";
import api from "@/axios";
import PieChart from "@/components/charts/PieChart.vue";

// ----- Interfaces -----
interface OtherGameRound {
  id: number;
  user_answer: string;
  question: string;
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

// ----- State -----
const loading = ref(true);
const error = ref<string | null>(null);
const groupedGames = ref<Record<string, GroupedGameData>>({});
const snackbar = ref<Snackbar>({
  message: "",
  color: "success",
  visible: false,
});

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
  "Pronoun Practice",
  "Quantifier Quest",
  "Verb Combinator",
  "Translator",
  "Passive Maker",
];

// ----- Fetch and Group -----
onMounted(async () => {
  try {
    const res = await api.get<OtherGameSession[]>("/other-games-sessions/");
    const sessions = res.data;
    console.log(sessions)

    const grouped: Record<string, GroupedGameData> = {};

    // Initialize all 5 groups (even if empty)
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

 // group sessions
    for (const s of sessions) {
      if (!GAME_NAMES.includes(s.game_name)) continue;
      const group = grouped[s.game_name];
      group.sessions.push(s);
      group.totalRounds += s.total_rounds ?? 0;
      group.totalCorrect += s.correct_count ?? 0;
      group.totalIncorrect += (s.total_rounds ?? 0) - (s.correct_count ?? 0);
    }

    // compute trends and incorrect rounds
    for (const [name, data] of Object.entries(grouped)) {
      data.accuracyTrend = data.sessions.map(
        s => Number(((s.correct_count / s.total_rounds) * 100).toFixed(0))
      );
      data.incorrectRounds = data.sessions.flatMap(s =>
        (s.rounds || []).filter(r => !r.is_correct)
      );
    }

    groupedGames.value = grouped;
    console.log(groupedGames)

    // select the first available game
    selectedGame.value = availableGames.value[0] ?? null;

  } catch (err) {
    console.error(err);
    error.value = "Failed to load game sessions.";
  } finally {
    loading.value = false;
  }
});

// ----- Pie Chart Data -----
const getPieChartData = (gameData: GroupedGameData) => [
  { label: "Correct", value: gameData.totalCorrect },
  { label: "Incorrect", value: gameData.totalIncorrect },
];

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
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
.chart-card .v-card-text {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
