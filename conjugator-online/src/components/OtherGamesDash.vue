<template>
  <v-container fluid class="pa-4 pa-sm-6">

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center my-12 py-12">
      <v-progress-circular indeterminate size="64" width="6" color="primary" />
      <div class="text-subtitle-1 text-medium-emphasis mt-4">Loading...</div>
    </div>

    <!-- Error State -->
    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6" closable>
      {{ error }}
    </v-alert>

    <!-- Empty State -->
    <div v-else-if="availableGames.length === 0" class="text-center my-12 py-12 d-flex flex-column align-center justify-center opacity-70">
      <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-gamepad-variant-outline</v-icon>
      <h3 class="text-h5 font-weight-medium text-grey-darken-2">No gameplay history recorded</h3>
      <p class="text-body-2 text-neutral mt-1">Complete modular training exercises to generate analytics.</p>
    </div>

    <!-- Main Content Grid -->
    <v-row v-else class="align-stretch">
      <v-col cols="12">
        <v-card class="pa-4 pa-md-6 mb-2 rounded-xl bg-grey-lighten-5 border" elevation="0">
          <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4">
            
            <!-- LEFT: Select Dropdown -->
            <div class="flex-shrink-0">
              <v-select
                v-model="selectedGame"
                :items="availableGames"
                label="Select Alternative Game Module"
                variant="outlined"
                density="comfortable"
                hide-details
                bg-color="white"
                style="max-width: 400px; min-width: 260px"
                class="rounded-lg"
              />
            </div>

            <!-- CENTER: Title -->
            <div class="text-sm-center flex-grow-1 px-4">
              <h1 class="text-h4 font-weight-black text-grey-darken-4 mb-0 tracking-tight">
                {{ selectedGame }}
              </h1>
            </div>

            <!-- RIGHT: Hero Image Banner -->
            <div v-if="selectedGame" class="flex-shrink-0 d-none d-md-flex align-center">
              <v-img
                :src="gamePictures[selectedGame] || gamePictures['Pronoun Practice']"
                alt="Module visual banner graphic"
                max-width="320"
                min-width="180"
                height="80"
                class="rounded-xl border shadow-sm"
                cover
              />
            </div>

          </div>
        </v-card>
      </v-col>

      <!-- Active Game Data Container Context -->
      <v-col cols="12" v-if="selectedGame && groupedGames[selectedGame]">
        <v-row class="align-stretch">
          
          <!-- Accuracy Pie Chart Card -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card class="chart-card pa-4 w-100 rounded-xl" elevation="2">
              <v-card-title class="text-h6 font-weight-bold text-grey-darken-3 pb-0 d-flex align-center">
                <v-icon class="me-2" color="primary">mdi-chart-pie</v-icon> Overall Accuracy
              </v-card-title>
              <v-divider class="my-3 opacity-40" />
              <v-card-text class="d-flex flex-column align-center justify-center flex-grow-1">
                <PieChart :data="getPieChartData(groupedGames[selectedGame])" />
                
                <v-chip variant="tonal" color="primary" class="font-weight-bold mt-6 mb-1 px-4">
                  {{ groupedGames[selectedGame].sessions.length }} Game Session{{ groupedGames[selectedGame].sessions.length !== 1 ? 's' : '' }}
                </v-chip>
                <div class="text-subtitle-2 font-weight-medium text-grey-darken-2">
                  Total Processing Load: <strong>{{ groupedGames[selectedGame].totalRounds }}</strong> rounds
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  {{ groupedGames[selectedGame].totalCorrect }} verified correct responses &bull; {{ groupedGames[selectedGame].totalIncorrect }} correction cycles
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Sparkline Trend Chart Card -->
          <v-col cols="12" md="6" class="d-flex">
            <v-card class="chart-card pa-4 w-100 rounded-xl" elevation="2">
              <v-card-title class="text-h6 font-weight-bold text-grey-darken-3 pb-0 d-flex align-center">
                <v-icon class="me-2" color="blue-darken-1">mdi-chart-timeline-variant-shimmer</v-icon> Performance Evolution
              </v-card-title>
              <v-divider class="my-3 opacity-40" />
              <v-card-text class="d-flex flex-column justify-center flex-grow-1">
                <div v-if="sessionAccuracyTrend.length > 1" class="w-100 pa-2">
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
                  <div class="text-caption text-medium-emphasis text-center font-weight-medium mt-4">
                    Accuracy precision ratio mapped per structural iteration sequence
                  </div>
                </div>
                <div v-else class="text-center py-12 text-muted my-auto opacity-60">
                  <v-icon size="44" color="grey-lighten-1" class="mb-2">mdi-chart-line-variant</v-icon>
                  <p class="text-body-2">Accumulate multiple consecutive runs to render contextual delta trends.</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Trophy / Achievements Subsection Component -->
          <v-col cols="12" lg="6" class="d-flex">
            <v-card elevation="2" class="chart-card trophy-card pa-4 w-100 rounded-xl flex-column">
              <v-card-title class="text-h5 font-weight-bold d-flex align-center text-amber-darken-4 pb-2">
                <v-icon class="me-3 color-gold-icon" size="28">mdi-trophy-variant</v-icon>
                Milestones & Badges
              </v-card-title>
              <v-divider class="mb-4 border-gold opacity-40" />

              <v-card-text class="flex-grow-1 overflow-y-auto pa-1">
                <v-progress-linear v-if="loadingAchievements" indeterminate color="amber-darken-2" class="mb-4 rounded" height="4" />

                <v-list v-if="automaticAchievements.length" class="bg-transparent pa-0">
                  <v-hover v-slot="{ isHovering, props }" v-for="achievement in automaticAchievements" :key="achievement.id">
                    <v-list-item
                      v-bind="props"
                      class="mb-3 golden-list-item elevation-1 transition-all"
                      :style="isHovering ? { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(184,134,11,0.2) !important' } : {}"
                    >
                      <template #prepend>
                        <v-avatar color="amber-lighten-4" size="40" class="me-2">
                          <v-icon icon="mdi-medal" color="amber-darken-4" size="22" />
                        </v-avatar>
                      </template>

                      <v-list-item-title class="font-weight-black text-subtitle-1 text-amber-darken-4 text-wrap">
                        {{ achievement.name }}
                      </v-list-item-title>

                      <v-list-item-subtitle class="text-wrap mt-1 text-body-2 font-weight-medium text-brown-darken-3">
                        {{ achievement.description }}
                      </v-list-item-subtitle>

                      <v-list-item-subtitle class="text-caption mt-2 text-brown-darken-1 d-flex align-center">
                        <v-icon size="12" class="me-1">mdi-calendar-check</v-icon>
                        Unlocked: <strong>{{ formatDate(achievement.achieved_on) }}</strong>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-hover>
                </v-list>

                <div v-else class="text-center py-12 opacity-60 my-auto d-flex flex-column align-center justify-center h-100">
                  <v-icon size="56" color="amber-lighten-3" class="mb-2">mdi-trophy-broken</v-icon>
                  <div class="text-subtitle-1 font-weight-medium text-grey-darken-2">No active rewards found</div>
                  <p class="text-caption text-neutral">High accuracy tiers or speed parameters unlock automatic honors.</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Error Explainer Engine Context Card -->
          <v-col cols="12" lg="6" class="d-flex">
            <v-card
              class="chart-card pa-4 w-100 rounded-xl border flex-column justify-space-between bg-emerald-panel"
              elevation="2"
            >
              <v-card-title class="text-h5 font-weight-bold text-emerald-header d-flex align-center pb-2">
                <v-icon class="me-3 text-emerald-icon" size="28">mdi-lightbulb-on-outline</v-icon>
                Interactive Critique Explainer
              </v-card-title>
              <v-divider class="mb-3 border-emerald alpha-divider" />
              
              <v-card-subtitle class="text-center font-weight-medium text-emerald-subtitle mb-2">
                Anomalies Detected: <strong>{{ groupedGames[selectedGame].totalIncorrect }}</strong> logged items
              </v-card-subtitle>

              <v-card-text v-if="currentError(selectedGame)" class="flex-grow-1 d-flex flex-column justify-center pa-2">
                <div class="text-center">
                  <p class="text-body-2 font-weight-medium text-grey-darken-3 mb-4">
                    <span v-if="selectedGame !== 'Prove it!' && selectedGame !== 'Pronunciation Challenge'">Analyze the structural failure below to reinforce proper usage parameters:</span>
                    <span v-else-if="selectedGame === 'Prove it!'">Incorporate the irregular past paradigm constraint into your active recall structure:</span>
                    <span v-else-if="selectedGame === 'Pronunciation Challenge'">Acoustic phoneme disparity detected. Isolate and match native cadence markers:</span>
                  </p>

                  <!-- Image context rendering loops -->
                  <div v-if="selectedGame === 'Pronoun Practice' || selectedGame === 'Quantifier Quest'" class="mb-4 d-flex justify-center align-center">
                    <v-img
                      :src="(selectedGame === 'Quantifier Quest' ? quantifierImagePath : pronounImagePath) + currentError(selectedGame)?.image"
                      alt="Prompt semantic evaluation visual asset"
                      class="rounded-lg border-md elevation-1"
                      max-width="120"
                      height="120"
                      cover
                    />
                  </div>

                  <v-sheet color="white" class="pa-4 rounded-xl border border-dashed mb-3 elevation-sm">
                    <div class="text-subtitle-1 font-weight-bold text-grey-darken-4 line-height-md italic-quote">
                      "{{ currentError(selectedGame)?.question || currentError(selectedGame)?.question_text }}"
                    </div>
                  </v-sheet>

                  <div v-if="selectedGame !== 'Prove it!' && selectedGame !== 'Pronunciation Challenge'" class="mt-2 text-center">
                    <v-chip v-if="currentError(selectedGame)?.out_of_time || currentError(selectedGame)?.user_answer === ''" color="error" variant="flat" size="small">
                      Sequence Timed Out (No Submission)
                    </v-chip>
                    <v-chip v-else color="red-darken-1" variant="tonal" class="font-weight-bold text-body-2">
                      Your execution trace: <strong class="ms-1">"{{ currentError(selectedGame)?.user_answer }}"</strong>
                    </v-chip>
                  </div>
                </div>
              </v-card-text>

              <v-card-text v-else class="text-center py-12 text-caption text-muted my-auto opacity-60 d-flex flex-column align-center justify-center h-100">
                <v-icon size="56" color="green-lighten-3" class="mb-2">mdi-shield-check-outline</v-icon>
                <div class="text-subtitle-1 font-weight-medium text-grey-darken-2">Perfect execution score!</div>
                <p class="text-caption">No tracked evaluation flags exist for this game module configuration.</p>
              </v-card-text>

              <v-card-actions class="d-flex justify-end pt-2 border-top alpha-divider">
                <v-btn
                  color="emerald-action-btn"
                  variant="flat"
                  size="large"
                  class="rounded-lg text-button font-weight-bold px-6"
                  @click="nextError(selectedGame)"
                  :disabled="!groupedGames[selectedGame].incorrectRounds.length"
                >
                  Inspect Next Case
                  <v-icon size="20" class="ms-2">mdi-arrow-right-circle</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Session Details Expansion Accordions Panels -->
        <v-card class="pa-4 mt-6 rounded-xl border" elevation="1">
          <div class="text-h6 font-weight-bold text-grey-darken-3 mb-3 d-flex align-center">
            <v-icon class="me-2" color="indigo">mdi-history</v-icon> Historical Logs & Audits
          </div>
          <v-expansion-panels variant="accordion" class="historical-panels shadow-sm">
            
            <!-- Category Render Set 1: Standard Choice Games -->
            <v-expansion-panel
              v-if="selectedGame !== 'Prove it!' && selectedGame !== 'Pronunciation Challenge'"
              v-for="session in groupedGames[selectedGame].sessions"
              :key="session.session_id"
              class="border-bottom-panel"
            >
              <v-expansion-panel-title class="font-weight-bold">
                <template #default>
                  <div class="d-flex align-center justify-space-between w-100 pe-4">
                    <span class="text-subtitle-2 font-weight-black text-indigo-darken-3">
                      {{ session.correct_count }} / {{ session.total_rounds }} Pass Marks
                    </span>
                    <span class="text-caption text-medium-emphasis">
                      <v-icon size="12" class="me-1">mdi-clock-outline</v-icon>
                      {{ new Date(session.started_at).toLocaleString() }}
                    </span>
                  </div>
                </template>
              </v-expansion-panel-title>
              
              <v-expansion-panel-text class="bg-grey-fluid pa-0">
                <v-table class="bg-white rounded-lg border custom-data-table">
                  <thead>
                    <tr>
                      <th class="font-weight-bold text-grey-darken-3">#</th>
                      <th class="font-weight-bold text-grey-darken-3">Semantic Prompt Evaluation Challenge</th>
                      <th v-if="selectedGame === 'Quantifier Quest' || selectedGame === 'Pronoun Practice'" class="font-weight-bold text-grey-darken-3">Visual Variable</th>
                      <th class="font-weight-bold text-grey-darken-3">User Input</th>
                      <th class="font-weight-bold text-grey-darken-3 text-center">Status</th>
                      <th class="font-weight-bold text-grey-darken-3 text-center">Typo Class?</th>
                      <th class="font-weight-bold text-grey-darken-3 text-end">Moderation Workflow</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="round in session.rounds" :key="round.id">
                      <td class="text-caption font-weight-bold text-medium-emphasis">{{ round.prompt_number }}</td>
                      <td class="text-body-2 font-weight-medium text-grey-darken-3 text-wrap max-w-text">{{ round.question }}</td>
                      <td v-if="selectedGame === 'Quantifier Quest' || selectedGame === 'Pronoun Practice'">
                        <img :src="(selectedGame === 'Quantifier Quest' ? quantifierImagePath : pronounImagePath) + round.image" alt="Evaluation visual dependency" class="rounded border my-1 max-h-thumb" />
                      </td>
                      <td class="text-body-2 font-weight-bold text-grey-darken-4">
                        <span v-if="round.user_answer">{{ round.user_answer }}</span>
                        <span v-else class="text-caption italic text-error">Timeout</span>
                      </td>
                      <td class="text-center">
                        <v-icon :color="round.is_correct ? 'success' : 'error'" size="22">
                          {{ round.is_correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
                        </v-icon>
                      </td>
                      <td class="text-center">
                        <v-chip size="x-small" :color="round.typo ? 'grey-darken-2' : 'grey-lighten-2'" class="font-weight-bold">
                          {{ round.typo ? 'True' : 'False' }}
                        </v-chip>
                      </td>
                      <td class="text-end">
                        <template v-if="!round.is_correct && !round.typo_requested">
                          <v-btn
                            size="small"
                            color="indigo-darken-1"
                            variant="tonal"
                            class="font-weight-bold rounded-lg"
                            @click="requestTypo(round)"
                          >
                            Flag as Typo
                          </v-btn>
                        </template>
                        <template v-else-if="round.typo_requested">
                          <v-chip size="small" color="warning" variant="flat" class="font-weight-bold">Pending Review</v-chip>
                        </template>
                        <template v-else-if="round.typo_accepted">
                          <v-chip size="small" color="success" variant="flat" class="font-weight-bold">Overruled (Ok)</v-chip>
                        </template>
                        <span v-else class="text-caption text-grey">—</span>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Category Render Set 2: Direct Production/Audio Games -->
            <v-expansion-panel
              v-if="selectedGame === 'Prove it!' || selectedGame === 'Pronunciation Challenge'"
              v-for="session in groupedGames[selectedGame].sessions"
              :key="session.session_id"
              class="border-bottom-panel"
            >
              <v-expansion-panel-title class="font-weight-bold">
                <template #default>
                  <div class="d-flex align-center justify-space-between w-100 pe-4">
                    <span class="text-subtitle-2 font-weight-black text-teal-darken-3">
                      {{ session.correct_count }} / {{ session.total_rounds }} Verified
                    </span>
                    <span class="text-caption text-medium-emphasis">
                      <v-icon size="12" class="me-1">mdi-clock-outline</v-icon>
                      {{ new Date(session.started_at).toLocaleString() }}
                    </span>
                  </div>
                </template>
              </v-expansion-panel-title>
              
              <v-expansion-panel-text class="bg-grey-fluid pa-0">
                <v-table class="bg-white rounded-lg border custom-data-table">
                  <thead>
                    <tr>
                      <th class="font-weight-bold text-grey-darken-3" style="width: 60px;">#</th>
                      <th v-if="selectedGame === 'Prove it!'" class="font-weight-bold text-grey-darken-3" style="width: 140px;">Irregular Anchor</th>
                      <th class="font-weight-bold text-grey-darken-3">Lexical Challenge Context Prompt</th>
                      <th class="font-weight-bold text-grey-darken-3 text-center" style="width: 100px;">Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="round in session.rounds" :key="round.id">
                      <td class="text-caption font-weight-bold text-medium-emphasis">{{ round.prompt_number }}</td>
                      <td v-if="selectedGame === 'Prove it!'">
                        <v-chip size="small" class="font-weight-bold text-uppercase" color="teal" variant="outlined">
                          {{ round.label }}
                        </v-chip>
                      </td>
                      <td class="text-body-2 font-weight-medium text-grey-darken-3 text-wrap">{{ round.question }}</td>
                      <td class="text-center">
                        <v-icon :color="round.is_correct ? 'success' : 'error'" size="22">
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

    <!-- Global Component Toast Notifications Stream -->
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      timeout="3000"
      elevation="4"
      location="top right"
      class="mt-4"
    >
      <div class="d-flex align-center font-weight-bold">
        <v-icon size="18" class="me-2">
          {{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        {{ snackbar.message }}
      </div>
      <template #actions>
        <v-btn icon="mdi-close" variant="text" size="small" @click="snackbar.visible = false" />
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from 'vue-router';
import api from "@/axios";
import { useUserStore } from "@/stores/user";
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
  sample_rate?: number;
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
  rounds?: OtherGameRound[];
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
  id: number;
  student: number;
  student_username: string;
  name: string;
  description: string;
  evidence: string;
  criteria_key: string;
  achieved_on: string;
  manually_created: boolean;
}

// ----- Reactive Engine State Dependencies -----
const route = useRoute();
const userStore = useUserStore();

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
const automaticAchievements = ref<Achievement[]>([]);
const manualAchievements = ref<Achievement[]>([]);
const achievedKeys = ref<Set<string>>(new Set());

const selectedGame = ref<string | null>(null);
const typoRequests = ref<Set<number>>(new Set());
const errorIndex = ref<Record<string, number>>({});

const GAME_NAMES = [
  "Balanced Opinions",
  "Be Polite!",
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
  "Unfinished Business",
  "Uses Of Auxiliaries",
  "Verb Mixer",
  "Verb Mixer Classroom Edition",
  "Year 2040",
  "Word Families",
];

const gamePictures: Record<string, string> = {
  "Balanced Opinions": "/images/banners/BalancedOpinions.png",
  "Be Polite!": "/images/banners/BePolite.png",
  "Comparison": "/images/banners/Comparison.png",
  "Idea Linker": "/images/banners/IdeaLinker.png",
  "Pronoun Practice": "/images/banners/PronounPractice.png",
  "Quantifier Quest": "/images/banners/QuantifierQuest.png",
  "Unfinished Business": "/images/banners/UnfinishedBusiness.png",
  "Verb Mixer": "/images/banners/VerbMixer.png",
  "Verb Mixer Classroom Edition": "/images/banners/VerbMixer.png",
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

const availableGames = computed(() =>
  GAME_NAMES.filter(name => groupedGames.value[name]?.sessions.length > 0)
);

const sessionAccuracyTrend = computed(() => {
  if (!selectedGame.value) return [];
  return groupedGames.value[selectedGame.value]?.accuracyTrend ?? [];
});

const sparklineGradients = [
  ['#222'], ['#42b3f4'], ['green', 'yellow', 'red'],
  ['purple', 'violet'], ['#00c6ff', '#F0F', '#FF0']
];

// ----- Action Notifiers Helpers -----
const showSnackbar = (message: string, color = "success") => {
  snackbar.value = { message, color, visible: true };
};

function generateSparklineLabels(arr: number[]): string[] {
  if (arr.length <= 8) return arr.map(val => `${val}%`);
  const lastIndex = arr.length - 1;
  const showIndices = [0, Math.floor(arr.length * 0.25), Math.floor(arr.length * 0.5), Math.floor(arr.length * 0.75), lastIndex];
  return arr.map((val, i) => showIndices.includes(i) ? `${val}%` : "\u00A0");
}

function normalizeGameName(name: string): string {
  if (!name) return name;
  if (name.startsWith("Comparison")) return "Comparison";
  if (name.startsWith("Parallel Universe")) return "Parallel Universe";
  if (name.startsWith("Uses Of Auxiliaries")) return "Uses Of Auxiliaries";
  if (name.startsWith("Quantifier Quest")) return "Quantifier Quest";
  if (name.startsWith("Pronoun Practice")) return "Pronoun Practice";
  if (name.startsWith("Prove it!")) return "Prove it!";
  if (name.startsWith("Pronunciation Challenge")) return "Pronunciation Challenge";
  return name;
}

// ==========================================
// 🎯 THE CORE ARCHITECTURAL SECURITY FIXED HERE
// ==========================================
const fetchAchievements = async () => {
  loadingAchievements.value = true;
  error.value = null;
  try {
    const params: any = {};
    if (userStore.isStaff) {
      if (!userStore.studentId) {
        allAchievements.value = [];
        return;
      }
      params.student = userStore.studentId; // Secure constraint payload tracking mapping rule
    }

    const res = await api.get<Achievement[]>("/achievements/", { params });
    allAchievements.value = res.data;
    manualAchievements.value = res.data.filter(a => a.manually_created);
    automaticAchievements.value = filterAchievementsForGame(selectedGame.value ?? "");
  } catch (err) {
    console.error("Failed to fetch achievements:", err);
    error.value = "Failed to load modular achievements metadata rules.";
  } finally {
    loadingAchievements.value = false;
  }
};

// ----- Core Hydration Pipeline Initialization Sequence -----
onMounted(async () => {
  error.value = null;
  try {
    loadingAchievements.value = true;
    loadingSessions.value = true;

    const params: any = {};
    if (userStore.isStaff) {
      if (!userStore.studentId) {
        groupedGames.value = {};
        loadingSessions.value = false;
        loadingAchievements.value = false;
        return;
      }
      params.student = userStore.studentId; // Secure dual-identity payload encapsulation parameter
    }

    const achievementsPromise = fetchAchievements();
    const sessionsPromise = api.get<OtherGameSession[]>("/other-games-sessions/", { params });

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
        s.total_rounds ? Number(((s.correct_count / s.total_rounds) * 100).toFixed(0)) : 0
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
    console.error("Hydration runtime block crashed unexpected context traces:", err);
    error.value = "Failed to synchronize execution records.";
  } finally {
    loadingSessions.value = false;
  }
});

// ----- Observers & Sync Watchers Filters -----
watch(selectedGame, (game) => {
  automaticAchievements.value = filterAchievementsForGame(game ?? "");
});

const filterAchievementsForGame = (game: string) => {
  if (!game) return [];
  return allAchievements.value
    .filter(a => !a.manually_created)
    .filter(a => a.name.startsWith(game) || a.criteria_key.startsWith(game) || a.criteria_key.startsWith('hard_work_' + game.toLowerCase().slice(0, 3)))
    .sort((a, b) => new Date(b.achieved_on).getTime() - new Date(a.achieved_on).getTime());
};

const getPieChartData = (gameData: GroupedGameData) => {
  const total = gameData.totalCorrect + gameData.totalIncorrect;
  if (total === 0) return [{ label: "Correct", value: 0 }, { label: "Incorrect", value: 0 }];
  
  return [
    { label: "Correct", value: Math.round((gameData.totalCorrect / total) * 100) },
    { label: "Incorrect", value: Math.round((gameData.totalIncorrect / total) * 100) },
  ];
};

const requestTypo = async (round: OtherGameRound) => {
  if (typoRequests.value.has(round.id)) return;
  typoRequests.value.add(round.id);
  try {
    await api.patch(`/other-games-rounds/${round.id}/request-typo/`, { typo_requested: true });
    round.typo_requested = true;
    showSnackbar("Typo verification requested successfully.");
  } catch (err) {
    console.error(err);
    typoRequests.value.delete(round.id);
    showSnackbar("Failed to submit verification parameters.", "error");
  }
};

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

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString();
};
</script>

<style scoped>
.chart-card {
  height: 440px !important;
  display: flex;
  flex-direction: column;
}

.golden-list-item {
  background: linear-gradient(135deg, #ffffff 0%, #fffbf2 100%) !important;
  border: 1px solid rgba(212, 175, 55, 0.35) !important;
  border-radius: 12px !important;
}

.trophy-card {
  background: linear-gradient(180deg, #ffffff 0%, #fffbf4 100%) !important;
  border: 1px solid rgba(212, 175, 55, 0.25) !important;
}

.color-gold-icon {
  color: #d4af37 !important;
}

.border-gold {
  border-color: rgba(212, 175, 55, 0.2) !important;
}

/* Emerald Explainer Theme Styles */
.bg-emerald-panel {
  background-color: #f4faf6 !important;
  border: 1px solid rgba(46, 125, 50, 0.15) !important;
}
.text-emerald-header {
  color: #1b5e20 !important;
}
.text-emerald-icon {
  color: #2e7d32 !important;
}
.border-emerald {
  border-color: rgba(46, 125, 50, 0.1) !important;
}
.text-emerald-subtitle {
  color: #388e3c !important;
}
.v-btn[color="emerald-action-btn"] {
  background-color: #2e7d32 !important;
  color: white !important;
}

.historical-panels :deep(.v-expansion-panel-title) {
  padding: 14px 20px !important;
}

.border-bottom-panel {
  border-bottom: 1px solid #edf0f2 !important;
  margin-bottom: 4px !important;
}

.italic-quote {
  font-style: italic;
}

.max-w-text {
  max-width: 440px;
}

.max-h-thumb {
  max-height: 44px;
  object-fit: cover;
}

.bg-grey-fluid {
  background-color: #fafbfc !important;
}

.custom-data-table {
  border-radius: 8px !important;
  overflow: hidden;
}

.gap-4 {
  gap: 16px;
}
</style>