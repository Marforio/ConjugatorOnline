<template>
  <v-container>
    <!-- Tabs Navigation -->
    <v-select
      v-if="isMobile"
      v-model="activeTab"
      :items="tabItems"
      item-title="label"
      item-value="value"
      label="Select section"
      class="mt-4"
      dense
      outlined
    />

    <v-tabs
      v-else
      v-model="activeTab"
      class="mt-4"
      show-arrows
      grow
    >
      <v-tab v-for="item in tabItems" :key="item.value" :value="item.value">
        {{ item.label }}
      </v-tab>
    </v-tabs>

    <!-- Tab Content -->
    <v-window v-model="activeTab" class="mt-5" :touch="false">
      <v-window-item value="grammar-feedback">
        <div v-if="loading" class="text-center my-5">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else-if="errorsError">
          <v-alert type="error">{{ errorsError }}</v-alert>
        </div>
        <div v-else>
          <AdminErrorDataTab v-if="userStore.isStaff" :key="'admin'"/>
          <ErrorsDataTab v-else :key="'student'" />

        </div>
      </v-window-item>

      <v-window-item value="vocabulary">
        <VocabDataTab />
      </v-window-item>

      <v-window-item value="goals">
        <GoalsDataTab />
      </v-window-item>

      <v-window-item value="conjugation-game">
        <div v-if="loading" class="text-center my-5">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <div v-else-if="conjGameError">
          <v-alert type="error">{{ conjGameError }}</v-alert>
        </div>
        <div v-else class="d-flex flex-wrap align-start pa-2">
          <div v-if="!sessions.length">
            <h3 class="m-5 text-center">No data to display.</h3>
          </div>
          <div v-else>
            <v-row dense>
            <!-- Conjugation accuracy -->
            <v-col cols="12" lg="6" sm="12">
              <v-card class="chart-card pa-4" elevation="2">
                <v-card-title class="text-h5 font-weight-bold">Conjugation accuracy</v-card-title>
                <v-card-text class="d-flex flex-column align-center flex-grow-1">
                  <PieChart :data="totalRightWrongChartData" />
                  <div class="text-subtitle-1 mt-4">
                    {{ sessions.length }} game{{ sessions.length !== 1 ? 's' : '' }} played
                  </div>
                  <div class="text-subtitle-2">
                    {{ totalRoundsPlayed }} total rounds
                  </div>
                  <div v-if="totalTypos > 0" class="text-caption text-muted">
                    ({{ totalTypos }} typo<span v-if="totalTypos > 1">s</span> not counted)
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <!-- Some Numbers -->
            <v-col cols="12" lg="6">
              <v-card class="chart-card pa-2" v-if="sessionAccuracyTrend.length > 1" elevation="2">
                    <v-card  elevation="1" class="pa-4 mb-2">
                  <div class="text-h6 mb-2">Game Accuracy Trend</div>
                  <v-sparkline
                    :model-value="sessionAccuracyTrend"
                    :gradient="sparklineGradients[2]"
                    color="blue"
                    line-width="3"
                    stroke-linecap="round"
                    auto-draw
                    auto-draw-duration="1200"
                    auto-draw-easing="ease"
                    padding="20"
                    smooth
                    :labels="
                      sessionAccuracyTrend.length > 8
                        ? sessionAccuracyTrend.map((val, i, arr) => {
                            const lastIndex = arr.length - 1
                            // Always show first, last, and 3 evenly spaced in between
                            const showIndices = [
                              0,
                              Math.floor(arr.length * 0.25),
                              Math.floor(arr.length * 0.5),
                              Math.floor(arr.length * 0.75),
                              lastIndex,
                            ]
                            return showIndices.includes(i) ? `${val}%` : ''
                          })
                        : sessionAccuracyTrend.map(val => `${val}%`)
                    "
                    :show-labels="true"
                  />

                  <div class="text-caption text-muted mt-2">
                    Accuracy per game played
                  </div>
                  
                </v-card>
                <div style="display: flex;">
                  <NumbersCard
                    class="ma-2 flex-grow-1"
                    :value="(userStore.totalCorrect ?? 0).toString()"
                    title="Total correct"
                    label="Conjugations (rounds) in the Conjugator game"
                  />
                  <NumbersCard
                    class="ma-2 flex-grow-1"
                    :value="avgTimePerRound"
                    title="Avg speed"
                    label="Seconds per answer (round)"
                  />
                </div>
              </v-card>
                
      
    

            </v-col>

            <!-- Tense accuracy -->
            <v-col cols="12" lg="6">
              <v-card class="chart-card pa-4" elevation="2">
                <v-card-title class="text-h5 font-weight-bold">Tense accuracy</v-card-title>
                <v-card-text class="d-flex flex-column align-center flex-grow-1">
                  <BarChart :data="tenseAccuracyData" :width="400" :height="250" color="#4CAF50" />
                  <div class="text-subtitle-1 mt-4">Percentage of correct answers by tense</div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Sentence type accuracy -->
            <v-col cols="12" lg="6">
              <v-card class="chart-card pa-4" elevation="2">
                <v-card-title class="text-h5 font-weight-bold">Sentence type accuracy</v-card-title>
                <v-card-text class="d-flex flex-column align-center flex-grow-1">
                  <BarChart :data="sentenceTypeAccuracyData" :width="400" :height="250" color="#2196F3" />
                  <div class="text-subtitle-1 mt-4">Percentage of correct answers by sentence type</div>
                </v-card-text>
              </v-card>
            </v-col>

          
          </v-row>

          <v-divider />

          <h3 class="text-h4 mt-6 mb-4 mx-5 font-weight-bold w-100">Irregular verbs</h3>
          <v-row dense>
          <v-col cols="12" lg="6">
            <v-sheet elevation="2" class="p-4 w-100 d-flex flex-column gap-4">
              
              <h5 class="text-h6">Past simple</h5>

              <!-- Basic 75 past simple -->
              <div>
                <div class="font-weight-medium mb-2">Basic 75 irregs</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[0]?.discovered_pct_ps ?? 0"
                  height="22"
                  color="blue darken-2"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[0]?.discovered_pct_ps ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Discovered (written correctly 1x)</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[0]?.mastered_pct_ps ?? 0"
                  height="22"
                  color="primary"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[0]?.mastered_pct_ps ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Mastered (written correctly 3x)</div>
              </div>

              <!-- Master 110 past simple -->
              <div>
                <div class="font-weight-medium mb-2">Master 110 irregs</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[1]?.discovered_pct_ps ?? 0"
                  height="22"
                  color="green darken-2"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[1]?.discovered_pct_ps ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Discovered (written correctly 1x)</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[1]?.mastered_pct_ps ?? 0"
                  height="22"
                  color="success"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[1]?.mastered_pct_ps ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Mastered (written correctly 3x)</div>
              </div>
              <!-- All Irregs past simple -->
              <div>
                <div class="font-weight-medium mb-2">All 130 irregs</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[2]?.discovered_pct_ps ?? 0"
                  height="22"
                  color="purple"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[2]?.discovered_pct_ps ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Discovered (written correctly 1x)</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[2]?.mastered_pct_ps ?? 0"
                  height="22"
                  color="deep-purple"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[2]?.mastered_pct_ps ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Mastered (written correctly 3x)</div>
              </div>

            </v-sheet>
          </v-col>



          <v-col cols="12" lg="6">
            <v-sheet elevation="2" class="p-4 w-100 d-flex flex-column gap-4">
              <h5 class="text-h6">Present perfect</h5>
              
              <!-- Basic 75 present perfect -->
              <div>
                <div class="font-weight-medium mb-2">Basic 75 irregs</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[0]?.discovered_pct_pp ?? 0"
                  height="22"
                  color="red lighten-2"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[0]?.discovered_pct_pp ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Discovered (written correctly 1x)</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[0]?.mastered_pct_pp ?? 0"
                  height="22"
                  color="red"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[0]?.mastered_pct_pp ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Mastered (written correctly 3x)</div>
              </div>
              
              <!-- Master 110 present perfect -->
              <div>
                <div class="font-weight-medium mb-2">Master 110 irregs</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[1]?.discovered_pct_pp ?? 0"
                  height="22"
                  color="yellow darken-2"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[1]?.discovered_pct_pp ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Discovered (written correctly 1x)</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[1]?.mastered_pct_pp ?? 0"
                  height="22"
                  color="orange"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[1]?.mastered_pct_pp ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Mastered (written correctly 3x)</div>
              </div>

              <!-- All Irregs present perfect -->

              <div>
                <div class="font-weight-medium mb-2">All 130 irregs</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[2]?.discovered_pct_pp ?? 0"
                  height="22"
                  color="brown lighten-2"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[2]?.discovered_pct_pp ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Discovered (written correctly 1x)</div>
                <v-progress-linear
                  :model-value="userStore.tierStats?.[2]?.mastered_pct_pp ?? 0"
                  height="22"
                  color="brown darken-2"
                  striped
                  rounded
                  class="mb-1"
                >
                  <template #default>
                    <span>{{ userStore.tierStats?.[2]?.mastered_pct_pp ?? 0 }}%</span>
                  </template>
                </v-progress-linear>
                <div class="text-caption text-muted">Mastered (written correctly 3x)</div>
              </div>

            </v-sheet>
          </v-col>
          
        </v-row>
          
          <v-divider />

          <v-card
            class="pa-4 mb-6"
            elevation="2"
            :style="{
              minWidth: xs ? '250px' : '95%',
              maxWidth: xs ? '500px' : '95%',
              marginLeft: xs ? '5px' : '16px',
              marginRight: xs ? '5px' : '16px',
              marginTop: '20px',
            }"
          >
            <div class="text-h5 mt-2">
              Game details ({{ sessions.length }} game{{ sessions.length !== 1 ? 's' : '' }} played)
            </div>
            <div v-for="session in sessions" :key="session.session_id" class="mt-6">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <span class="font-weight-medium">
                      Game {{ session.session_id }} — <span v-if="session.correct_count > 0">{{ session.correct_count }} Correct</span><span v-if="session.wrong_count > 0">, {{ session.wrong_count }} Incorrect </span> 
                    </span>
                    — {{ new Date(session.started_at).toLocaleString() }} — {{ session.tenses.join(', ').slice(0, 50) }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div v-if="session.rounds?.length">
                      <v-table>
                        <thead>
                          <tr>
                            <th>Prompt #</th>
                            <th>Person</th>
                            <th>Verb</th>
                            <th>Tense</th>
                            <th>Sentence Type</th>
                            <th>User Answer</th>
                            <th>Acceptable Answers</th>
                            <th>Correct?</th>
                            <th>Typo?</th>
                            <th>Time (s)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="round in session.rounds"
                            :key="`${session.session_id}-${round.prompt_number}`"
                          >
                            <td>{{ round.prompt_number }}</td>
                            <td>{{ round.person }}</td>
                            <td>{{ round.verb }}</td>
                            <td>{{ round.tense }}</td>
                            <td>{{ round.sentence_type }}</td>
                            <td>{{ round.user_answer }}</td>
                                                        <td>{{ round.acceptable_answers?.join(' / ') }}</td>
                            <td>
                              <v-icon
                                :color="round.typo ? 'grey' : round.is_correct ? 'green' : 'red'"
                              >
                                {{
                                  round.typo
                                    ? 'mdi-cancel' // or 'mdi-minus-circle-outline'
                                    : round.is_correct
                                    ? 'mdi-check-circle'
                                    : 'mdi-close-circle'
                                }}
                              </v-icon>
                            </td>
                            <td>{{ round.typo }}</td>
                            <td>{{ round.elapsed_time?.toFixed(2) ?? '—' }}</td>
                            <td v-if="!round.typo && !round.typo_requested && !round.is_correct">
                              <v-btn
                                size="small"
                                color="primary"
                                :disabled="typoRequests.has(round.id)"
                                @click="requestTypo(round.id)"
                              >
                                This was a typo
                              </v-btn>
                            </td>
                            <td v-else-if="round.typo_requested && !round.typo">
                              <span class="text-caption text-warning">Pending approval</span>
                            </td>
                            <td v-else-if="round.typo">
                              <span class="text-caption text-success">Typo approved</span>
                            </td>
                            <td>{{ round.elapsed_time?.toFixed(2) ?? '—' }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                    <div v-else>
                      <p class="text-muted">No rounds data available for this session.</p>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card>
        </div>
      </div>
      </v-window-item>
    </v-window>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import api from "@/axios";
import { useUserStore } from "@/stores/user";
import { useDisplay } from "vuetify";
import TopNavBar from "@/components/TopNavBar.vue";
import PieChart from "@/components/charts/PieChart.vue";
import BarChart from "@/components/charts/BarChart.vue";
import ErrorsDataTab from "@/components/ErrorsDataTab.vue";
import AdminErrorDataTab from "@/components/AdminErrorDataTab.vue";
import NumbersCard from "@/components/NumbersCard.vue";
import { useRouter, useRoute } from 'vue-router';
import VocabDataTab from "@/components/VocabDataTab.vue";
import GoalsDataTab from "@/components/GoalsDataTab.vue";




interface GameSession {
  session_id: number;
  student: number;
  verb_set: string;
  sentence_types: string[];
  tenses: string[];
  started_at: string;
  total_rounds: number;
  correct_count: number;
  wrong_count: number;
  avg_time_per_prompt: number;
  rounds: any[];
}

export default defineComponent({
  name: "Dashboard",
  components: { TopNavBar, NumbersCard, PieChart, BarChart, ErrorsDataTab, AdminErrorDataTab, VocabDataTab, GoalsDataTab },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const sessions = ref<GameSession[]>([]);
    const loading = ref<boolean>(true);
    const errorsError = ref<string | null>(null);
    const conjGameError = ref<string | null>(null);
    const verbUsage = ref<any[]>([]);
    const tierStats = ref<any[]>([]);
    interface TenseStats {
        discovered_verbs_ps: string[];
        discovered_verbs_pp: string[];
        mastered_verbs_ps: string[];
        mastered_verbs_pp: string[];
      }

    const tenseStats = ref<TenseStats | null>(null);

    const typoRequests = ref<Set<number>>(new Set());
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    });

    const showSnackbar = (text: string, color = 'success') => {
      snackbar.value.text = text;
      snackbar.value.color = color;
      snackbar.value.show = true;
    };

    const userStore = useUserStore();

    const avgTimePerRound = computed(() => {
      const total = sessions.value.reduce((sum, session) => sum + session.avg_time_per_prompt, 0);
      return sessions.value.length > 0 ? (total / sessions.value.length).toFixed(1) : 0;
    });

    const totalRightWrongChartData = computed(() => [
      { label: "Correct", value: totalPercentCorrect.value },
      { label: "Incorrect", value: totalPercentIncorrect.value },
    ]);
    const totalRoundsPlayed = computed(() =>
      sessions.value.reduce((sum, session) => {
        const validRounds = session.rounds.filter((round: any) => !round.typo);
        return sum + validRounds.length;
      }, 0)
    );

    const totalTypos = computed(() =>
      sessions.value.reduce((sum, session) => {
        return (
          sum + session.rounds.filter((round: any) => round.typo).length
        );
      }, 0)
    );

    const totalPercentCorrect = computed(() => {
      const totalCorrect = sessions.value.reduce((sum, session) => {
        return (
          sum +
          session.rounds.filter((round: any) => round.is_correct && !round.typo).length
        );
      }, 0);

      return Number(((totalCorrect / totalRoundsPlayed.value) * 100).toFixed(0));
    });


    const totalPercentIncorrect = computed(() => {
      const totalIncorrect = sessions.value.reduce((sum, session) => {
        return (
          sum +
          session.rounds.filter((round: any) => !round.is_correct && !round.typo).length
        );
      }, 0);

      return Number(((totalIncorrect / totalRoundsPlayed.value) * 100).toFixed(0));
    });



    const activeTab = ref("grammar-feedback");
    const tabItems = [
      { value: "grammar-feedback", label: "Errors Feedback" },
      { value: "vocabulary", label: "Vocabulary" },
      { value: "goals", label: "Goals" },
      { value: "conjugation-game", label: "Conjugator" },
    ];

    const { xs, smAndDown } = useDisplay();
    const isMobile = computed(() => smAndDown.value);
    const BarchartColorPalette = [
      "#4CAF50",
      "#2196F3",
      "#FFC107",
      "#E91E63",
      "#9C27B0",
      "#FF5722",
    ];
    const sparklineGradients = [
          ['#222'],
          ['#42b3f4'],
          ['green', 'yellow', 'red'],
          ['purple', 'violet'],
          ['#00c6ff', '#F0F', '#FF0'],
          ['#f72047', '#ffd200', '#1feaea'],
        ]

    const fetchConjGameSessionsDashboardData = async () => {
      loading.value = true;
      conjGameError.value = null;

      try {
        const sessionsRes = await api.get<GameSession[]>("/conj-game-sessions/");
        sessions.value = sessionsRes.data;

      } catch (err: any) {
        console.error("Conj game sessions fetch failed:", err);
        conjGameError.value = conjGameError.value
          ? `${conjGameError.value}; Failed to fetch sessions`
          : "Failed to fetch sessions";
      }

      loading.value = false;
    };

    const sessionAccuracyTrend = computed(() => {
      return sessions.value
        .reverse()
        .map(session => {
          const total = session.total_rounds ?? 0
          return total
            ? Number(((session.correct_count / total) * 100).toFixed(0))
            : null
        })
        .filter((x): x is number => x !== null) // type guard to keep only numbers
    })

  const requestTypo = async (promptId: number) => {
    if (typoRequests.value.has(promptId)) return;

    typoRequests.value.add(promptId);

    try {
      await api.patch(`/conj-game-rounds/${promptId}/request-typo/`, {
        typo_requested: true
      });
      showSnackbar('Typo request submitted!');
      fetchConjGameSessionsDashboardData();
    } catch (err) {
      console.error("Typo request failed:", err);
      showSnackbar('Failed to send typo request.', 'error');
    }
  };


    // unwrap the computed into a plain array
const sessionAccuracyTrendArray = computed(() => sessionAccuracyTrend.value)


    const tenseAccuracyData = computed(() => {
      const rounds = sessions.value.flatMap((session) => session.rounds || []);
      const tenseGroups: Record<string, { correct: number; total: number }> = {};

      for (const round of rounds) {
        const tense = round.tense;
        if (!tenseGroups[tense]) {
          tenseGroups[tense] = { correct: 0, total: 0 };
        }
        tenseGroups[tense].total += 1;
        if (round.is_correct) {
          tenseGroups[tense].correct += 1;
        }
      }

      return Object.entries(tenseGroups).map(
        ([tense, stats], index: number) => ({
          label: tense,
          value: parseFloat(((stats.correct / stats.total) * 100).toFixed(0)),
          correct: stats.correct,
          total: stats.total,
          color: BarchartColorPalette[index % BarchartColorPalette.length],
        })
      );
    });

    const sentenceTypeAccuracyData = computed(() => {
      const rounds = sessions.value.flatMap((session) => session.rounds || []);
      const typeGroups: Record<string, { correct: number; total: number }> = {};

      for (const round of rounds) {
        const type = round.sentence_type;
        if (!typeGroups[type]) {
          typeGroups[type] = { correct: 0, total: 0 };
        }
        typeGroups[type].total += 1;
        if (round.is_correct) {
          typeGroups[type].correct += 1;
        }
      }


      return Object.entries(typeGroups).map(
        ([type, stats], index: number) => ({
          label: type,
          value: parseFloat(((stats.correct / stats.total) * 100).toFixed(0)),
          correct: stats.correct,
          total: stats.total,
          color: BarchartColorPalette[index % BarchartColorPalette.length],
        })
      );
    });

    onMounted(async () => {
      await userStore.fetchUserData();
      await fetchConjGameSessionsDashboardData();
      userStore.fetchVerbUsageDashboardData();
      setInitialTabFromRoute();
      console.log("is staff? ", userStore.isStaff)
    });

    function setInitialTabFromRoute() {
      const tabFromRoute = route.query.tab;
      const isValidTab = typeof tabFromRoute === "string" && tabItems.some(t => t.value === tabFromRoute);

      activeTab.value = isValidTab ? tabFromRoute : tabItems[0].value; // fallback to first tab
    }


    return {
      sessions,
      loading,
      errorsError,
      conjGameError,
      activeTab,
      tabItems,
      isMobile,
      userStore,
      TopNavBar,
      PieChart,
      sessionAccuracyTrend: sessionAccuracyTrendArray,
      totalRightWrongChartData,
      totalRoundsPlayed,
      totalTypos,
      avgTimePerRound,
      tenseAccuracyData,
      sentenceTypeAccuracyData,
      smAndDown,
      xs,
      verbUsage,
      tierStats,
      tenseStats,
      typoRequests,
      snackbar,
      requestTypo,
      sparklineGradients,
    };
  },
});
</script>

<style scoped>
.chart-card {
  min-height: 500px;   /* keeps them equal height */
  display: flex;
  flex-direction: column;
}
.chart-card .v-card-text {
  flex-grow: 1;        /* stretch content evenly */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

