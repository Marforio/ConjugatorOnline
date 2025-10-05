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
                    {{ totalRoundsPlayed }} total rounds: {{ totalCorrect }} correct, {{ totalIncorrect }} incorrect
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
                    :labels="generateSparklineLabels(sessionAccuracyTrend)"
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
                  <v-tooltip text="How close you are to an ideal student (1500 correct answers, 100% accuracy, 12s avg speed, medium difficulty" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-card
                        class="ma-2 flex-grow-1 bg-light-blue-lighten-5"
                        elevation="2"
                        v-bind="props"
                        style="min-width: 180px;"
                      >
                        <v-card-text class="text-center">
                          <v-card-title class="text-subtitle-2 text-wrap mb-2">Power index</v-card-title>
                            <Gauge
                                  :key="gaugeKey"
                                  :value="userStore.healthScore ?? 0"
                                  :size="$vuetify.display.lgAndUp ? 120 : 200"
                                />
                            <v-card-subtitle class="text-caption text-wrap">
                              Level: {{ healthTier ?? '' }}
                            </v-card-subtitle>
                        </v-card-text>
                      </v-card>
                      
                    </template>
                  </v-tooltip>
                  
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
            <v-divider class="my-6"/>

            <!-- spacer card-->
            <v-col v-if="$vuetify.display.xlAndUp" xl="1"></v-col>

            <!-- Error explainer -->
            <v-col cols="12" lg="6" xl="4">
              <v-card
                class="pa-4 d-flex flex-column justify-space-between"
                elevation="3"
                style="background-color: #fff9db; min-height: 430px;"
              >
                <v-card-title class="text-h4 font-weight-bold">
                  <v-icon class="me-3 mb-2">mdi-lightbulb-on-10</v-icon>
                  Error explainer
                </v-card-title>
                <v-card-subtitle class="text-center">
                  You have {{ totalIncorrect }} incorrect answers
                </v-card-subtitle>

                <v-card-text v-if="currentError" class="flex-grow-1 d-flex flex-column justify-center">
                  <transition name="slide" mode="out-in">
                    <div :key="currentError?.user_answer">
                      <div class="m-2 text-center">Can you explain why this answer was incorrect?</div>
                      <div class="my-6 text-center font-weight-light" style="font-size: 3rem;">
                        "{{ currentError.user_answer }}"
                      </div>
                      <div class="text-center">
                        <span class="text-overline mx-3">{{ currentError.verb }}</span>
                        <span class="text-overline mx-3">{{ currentError.person }}</span>
                        <span class="text-overline mx-3">{{ currentError.tense }}</span>
                        <span class="text-overline mx-3">{{ currentError.sentence_type }}</span>
                      </div>
                    </div>
                  </transition>
                </v-card-text>
                <v-card-text v-else class="text-center text-caption text-muted mt-6">
                  No conjugation errors yet.
                </v-card-text>


                <v-card-actions class="d-flex justify-end">
                  <v-btn
                    color="brown-lighten-1"
                    size="large"
                    @click="nextError"
                    :disabled="!incorrectAnswersData.length"
                  >
                    Next error
                    <v-icon size="32" class="ms-2">mdi-arrow-right-thin-circle-outline</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            
            <!-- spacer card -->
            <v-col v-if="$vuetify.display.xlAndUp" xl="2"></v-col>
            
            
            <!-- Use your mastered verbs -->
            <v-col cols="12" lg="6" xl="4">
              <v-card
                class="pa-4 d-flex flex-column justify-space-between bg-teal-lighten-4"
                elevation="3"
                style="min-height: 430px;"
              >
                <v-card-title class="text-h4 font-weight-bold">
                  <v-icon class="me-3 mb-2">mdi-bullhorn</v-icon>
                  Use your mastered irregs
                </v-card-title>
                <v-card-subtitle class="text-center text-wrap">
                  You have mastered {{ userStore.tenseStats.mastered_verbs_ps.length }} irregular verbs in past simple form and {{ userStore.tenseStats.mastered_verbs_pp.length }} in present perfect form
                </v-card-subtitle>

                <v-card-text v-if="currentMasteredVerb" class="flex-grow-1 d-flex flex-column justify-center">
                  <transition name="slide" mode="out-in">
                    <div :key="currentMasteredVerb?.verb">
                      <div class="m-2 text-center">Can you use this verb + tense in a sentence about your life?</div>
                      <div class="my-6 text-center" style="font-size: 3.5rem;">
                        {{ currentMasteredVerb?.verb }}
                      </div>
                      <div class="text-center">
                        Tense: <span class="text-overline mx-3">{{ currentMasteredVerb?.tense }}</span>
                      </div>
                    </div>
                  </transition>
                </v-card-text>
                <v-card-text v-else class="text-center text-caption text-muted mt-6">
                  No mastered verbs yet.
                </v-card-text>
                <v-card-actions v-if="currentMasteredVerb" class="d-flex justify-end">
                  <v-btn
                    color="brown-lighten-1"
                    size="large"
                    @click="nextMasteredVerb"
                    :disabled="!incorrectAnswersData.length"
                  >
                    Next verb
                    <v-icon size="32" class="ms-2">mdi-arrow-right-thin-circle-outline</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-6"/>

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
                  color="green-lighten-2"
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
            style="max-height: 1000px; overflow-y: scroll;"
            :style="{
              minWidth: xs ? '250px' : '95%',
              maxWidth: xs ? '500px' : '99%',
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
                      {{ session.correct_count }} correct out of {{ session.total_rounds }} 
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
                            <td>
                              <!-- 1. Approved -->
                              <template v-if="round.typo === true">
                                <span class="badge bg-success">Typo approved</span>
                              </template>

                              <!-- 2. Denied (show whenever typo_accepted is explicitly false) -->
                              <template v-else-if="round.typo_accepted === false">
                                <span class="badge bg-warning">Typo denied</span>
                              </template>

                              <!-- 3. Pending -->
                              <template v-else-if="round.typo_requested === true">
                                <span class="badge bg-warning text-dark">Pending approval</span>
                              </template>

                              <!-- 4. Request button (only when not correct and no other state) -->
                              <template v-else-if="!round.is_correct">
                                <v-btn
                                  size="small"
                                  color="primary"
                                  :disabled="typoRequests.has(round.id)"
                                  @click="requestTypo(round)"
                                >
                                  This was a typo
                                </v-btn>
                              </template>
                            </td>

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
import { defineComponent, ref, onMounted, computed, watch } from "vue";
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
import Gauge from "@/components/Gauge.vue"

// ---------------- Types ----------------
interface Round {
  id: number;
  is_correct: boolean;
  typo: boolean | null;
  typo_requested: boolean;
  typo_accepted: boolean | null;
  tense?: string;
  sentence_type?: string;
  prompt_number?: number;
  person?: string;
  verb?: string;
  acceptable_answers?: string[];
  elapsed_time?: number;
  user_answer?: string;
}

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
  rounds: Round[];
}

// ---------------- Component ----------------
export default defineComponent({
  name: "Dashboard",
  components: { TopNavBar, NumbersCard, PieChart, BarChart, ErrorsDataTab, AdminErrorDataTab, VocabDataTab, GoalsDataTab, Gauge },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const sessions = ref<GameSession[]>([]);
    const loading = ref<boolean>(true);
    const errorsError = ref<string | null>(null);
    const conjGameError = ref<string | null>(null);
    const verbUsage = ref<any[]>([]);
    const tierStats = ref<any[]>([]);
    const currentError = ref<any | null>(null);
    const currentMasteredVerb = ref<any | null>(null);

    const HEALTH_TIERS: Record<string, [number, number]> = {
      "Getting started": [0,9],
      "Warming up": [10,19],
      "Jeune espoir": [20,29],
      "Haut potentiel": [30,39],
      "Professional": [40,49],
      "Super League": [50,59],
      "National Team": [60,69],
      "Champions League": [70,79],
      "Hall of Fame": [80,89],
      "Ballon d'Or": [90,98],
      "Conjugation Messi": [99,100]
    }

    const gaugeKey = ref(0);
    const { lgAndUp } = useDisplay();
    watch(() => lgAndUp.value, () => {
      gaugeKey.value++;
    });



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

    function pickRandomError() {
      if (!incorrectAnswersData.value.length) {
        currentError.value = null;
        return;
      }
      const idx = Math.floor(Math.random() * incorrectAnswersData.value.length);
      currentError.value = incorrectAnswersData.value[idx];
    }

    function nextError() {
      pickRandomError();
    }

    function nextMasteredVerb() {
      const verbsPs = userStore.tenseStats?.mastered_verbs_ps ?? [];
      const verbsPp = userStore.tenseStats?.mastered_verbs_pp ?? [];

      // Attach tense labels to each verb
      const labeledPs = verbsPs.map(verb => ({ verb, tense: "Past Simple" }));
      const labeledPp = verbsPp.map(verb => ({ verb, tense: "Present Perfect" }));

      const allLabeledVerbs = [...labeledPs, ...labeledPp];

      if (!allLabeledVerbs.length) {
        currentMasteredVerb.value = null;
        return;
      }

      const randomIndex = Math.floor(Math.random() * allLabeledVerbs.length);
      currentMasteredVerb.value = allLabeledVerbs[randomIndex];
    }


    // ---------------- Stats ----------------
    const healthTier = computed(() => {
      const score = userStore.healthScore ?? 0;;

      for (const [tier, [min, max]] of Object.entries(HEALTH_TIERS)) {
        if (score >= min && score <= max) {
          return tier;
        }
      }

      return "Unknown"; // fallback if score is outside defined ranges
    });
    
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
        const validRounds = session.rounds.filter((round: Round) => !round.typo);
        return sum + validRounds.length;
      }, 0)
    );

    const totalTypos = computed(() =>
      sessions.value.reduce((sum, session) => {
        return sum + session.rounds.filter((round: Round) => round.typo).length;
      }, 0)
    );

    const totalCorrect = computed(() =>
      sessions.value.reduce(
        (sum, session) =>
          sum + session.rounds.filter((round: Round) => round.is_correct && !round.typo).length,
        0
      )
    );

    const totalIncorrect = computed(() =>
      sessions.value.reduce(
        (sum, session) =>
          sum + session.rounds.filter((round: Round) => !round.is_correct && !round.typo).length,
        0
      )
    );

    const totalPercentCorrect = computed(() => {
      return totalRoundsPlayed.value > 0
        ? Number(((totalCorrect.value / totalRoundsPlayed.value) * 100).toFixed(0))
        : 0;
    });

    const totalPercentIncorrect = computed(() => {
      return totalRoundsPlayed.value > 0
        ? Number(((totalIncorrect.value / totalRoundsPlayed.value) * 100).toFixed(0))
        : 0;
    });

        const incorrectAnswersData = computed(() => {
      const rounds = sessions.value.flatMap(session => session.rounds || []);

      return rounds
        .filter(round => !round.is_correct) // only keep incorrect ones
        .map(round => ({
          user_answer: round.user_answer || "",
          verb: round.verb || "unknown",
          tense: round.tense || "unknown",
          person: round.person || "unknown",
          sentence_type: round.sentence_type || "unknown",
          acceptable_answers: round.acceptable_answers || [],
          prompt_number: round.prompt_number,
          session_id: round.id,
        }));
    });


    const activeTab = ref("grammar-feedback");
    const tabItems = [
      { value: "grammar-feedback", label: "Errors Feedback" },
      { value: "vocabulary", label: "Vocabulary" },
      { value: "goals", label: "Achievements" },
      { value: "conjugation-game", label: "Conjugator" },
    ];

    const { xs, smAndDown } = useDisplay();
    const isMobile = computed(() => smAndDown.value);

    const BarchartColorPalette = [
      "#4CAF50", "#2196F3", "#FFC107", "#E91E63", "#9C27B0", "#FF5722",
    ];
    const sparklineGradients = [
      ['#222'], ['#42b3f4'], ['green', 'yellow', 'red'],
      ['purple', 'violet'], ['#00c6ff', '#F0F', '#FF0'],
      ['#f72047', '#ffd200', '#1feaea'],
    ];

    // ---------------- API Calls ----------------
    const fetchConjGameSessionsDashboardData = async (): Promise<void> => {
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
        .slice() // shallow copy so we don’t mutate original
        .reverse()
        .map(session => {
          const total = session.total_rounds ?? 0;
          return total
            ? Number(((session.correct_count / total) * 100).toFixed(0))
            : null;
        })
        .filter((x): x is number => x !== null);
    });

    // ---------------- Typo Actions ----------------
    const requestTypo = async (round: Round): Promise<void> => {
      if (typoRequests.value.has(round.id)) return;
      typoRequests.value.add(round.id);
      try {
        await api.patch(`/conj-game-rounds/${round.id}/request-typo/`, {
          typo_requested: true,
        });
        round.typo_requested = true;
        round.typo_accepted = null;
        showSnackbar("Typo request submitted!");
      } catch (err) {
        console.error("Typo request failed:", err);
        typoRequests.value.delete(round.id);
        showSnackbar("Failed to send typo request.", "error");
      }
    };

    const acceptTypo = async (round: Round): Promise<void> => {
      try {
        await api.patch(`/conj-game-rounds/${round.id}/accept-typo/`);
        round.typo = true;
        round.is_correct = true;
        round.typo_requested = false;
        round.typo_accepted = true;
        showSnackbar("Typo approved!");
      } catch (err) {
        console.error("Typo approval failed:", err);
        showSnackbar("Failed to approve typo.", "error");
      }
    };

    const denyTypo = async (round: Round): Promise<void> => {
      try {
        await api.patch(`/conj-game-rounds/${round.id}/deny-typo/`);
        round.typo = false;
        round.typo_requested = false;
        round.typo_accepted = false;
        showSnackbar("Typo denied!");
      } catch (err) {
        console.error("Typo denial failed:", err);
        showSnackbar("Failed to deny typo.", "error");
      }
    };

    // ---------------- Derived Stats ----------------
    const sessionAccuracyTrendArray = computed(() => sessionAccuracyTrend.value);

    const tenseAccuracyData = computed(() => {
      const rounds = sessions.value.flatMap(session => session.rounds || []);
      const tenseGroups: Record<string, { correct: number; total: number }> = {};
      for (const round of rounds) {
        const tense = round.tense || "unknown";
        if (!tenseGroups[tense]) tenseGroups[tense] = { correct: 0, total: 0 };
        tenseGroups[tense].total += 1;
        if (round.is_correct) tenseGroups[tense].correct += 1;
      }
      return Object.entries(tenseGroups).map(([tense, stats], i) => ({
        label: tense,
        value: parseFloat(((stats.correct / stats.total) * 100).toFixed(0)),
        correct: stats.correct,
        total: stats.total,
        color: BarchartColorPalette[i % BarchartColorPalette.length],
      }));
    });

    const sentenceTypeAccuracyData = computed(() => {
      const rounds = sessions.value.flatMap(session => session.rounds || []);
      const typeGroups: Record<string, { correct: number; total: number }> = {};
      for (const round of rounds) {
        const type = round.sentence_type || "unknown";
        if (!typeGroups[type]) typeGroups[type] = { correct: 0, total: 0 };
        typeGroups[type].total += 1;
        if (round.is_correct) typeGroups[type].correct += 1;
      }
      return Object.entries(typeGroups).map(([type, stats], i) => ({
        label: type,
        value: parseFloat(((stats.correct / stats.total) * 100).toFixed(0)),
        correct: stats.correct,
        total: stats.total,
        color: BarchartColorPalette[i % BarchartColorPalette.length],
      }));
    });


    // ---------------- Lifecycle ----------------
    onMounted(async () => {
      await userStore.fetchUserData();
      await fetchConjGameSessionsDashboardData();
      userStore.fetchVerbUsageDashboardData();
      setInitialTabFromRoute();
      pickRandomError();
      nextMasteredVerb();
    });

    function setInitialTabFromRoute(): void {
      const tabFromRoute = route.query.tab;
      const isValidTab = typeof tabFromRoute === "string" && tabItems.some(t => t.value === tabFromRoute);
      activeTab.value = isValidTab ? tabFromRoute : tabItems[0].value;
    }

    // ---------------- Expose ----------------
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
      totalCorrect,
      totalIncorrect,
      totalRightWrongChartData,
      totalRoundsPlayed,
      totalTypos,
      avgTimePerRound,
      tenseAccuracyData,
      sentenceTypeAccuracyData,
      incorrectAnswersData,
      healthTier,
      smAndDown,
      xs,
      verbUsage,
      tierStats,
      tenseStats,
      typoRequests,
      snackbar,
      requestTypo,
      acceptTypo,
      denyTypo,
      sparklineGradients,
      generateSparklineLabels,
      currentError,
      nextError,
      pickRandomError,
      currentMasteredVerb,
      nextMasteredVerb,
      gaugeKey 
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
.slide-enter-active, .slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

</style>

