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
  <v-window v-model="activeTab" class="mt-5" touchless>
    <v-window-item value="grammar-feedback">
      <!-- Grammar Feedback tab content -->
      <div v-if="loading" class="text-center my-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else-if="errorsError">
        <v-alert type="error">{{ errorsError }}</v-alert>
      </div>
      
      <div v-else>
        <ErrorsDataTab />
      </div>
        
    </v-window-item>

    <v-window-item value="vocabulary">
      <p>Coming soon...</p>
    </v-window-item>

    <v-window-item value="goals">
      <p>Coming soon...</p>
    </v-window-item>

    <v-window-item value="conjugation-game">
      <div v-if="loading" class="text-center my-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>

      <div v-else-if="conjGameError">
        <v-alert type="error">{{ conjGameError }}</v-alert>
      </div>
      <div v-else>
        <v-card class="pa-4 mb-6" elevation="2" style="max-width: 300px; margin-top: 16px; margin-left: 16px;"> 
          <v-card-title class="text-h5 font-weight-bold">Total accuracy</v-card-title>
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <PieChart :data="totalRightWrongChartData" />

              <div class="text-subtitle-1 mt-4">
                {{ sessions.length }} game{{ sessions.length !== 1 ? 's' : '' }} played
              </div>

              <div class="text-subtitle-2">
                {{ totalRoundsPlayed }} total rounds
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="pa-4 mb-6" elevation="2" :style="{
          minWidth: xs ? '300px' : '500px', 
          maxWidth: xs ? '500px' : '700px', 
          marginLeft: xs ? '5px' : '16px',
          marginRight: xs ? '5px' : '16px',}">

          <v-card-title class="text-h5 font-weight-bold">Tense accuracy</v-card-title>
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <BarChart :data="tenseAccuracyData" :width="500" :height="300" color="#4CAF50" />

              <div class="text-subtitle-1 mt-4">
                Percentage of correct answers by tense
              </div>

            </div>
          </v-card-text>
        </v-card>

        <v-card class="pa-4 mb-6" elevation="2" :style="{
          minWidth: xs ? '300px' : '500px', 
          maxWidth: xs ? '500px' : '700px', 
          marginLeft: xs ? '5px' : '16px',
          marginRight: xs ? '5px' : '16px'}"> 
          <v-card-title class="text-h5 font-weight-bold">Sentence type accuracy</v-card-title>
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <BarChart :data="sentenceTypeAccuracyData" :width="500" :height="300" color="#2196F3" />

              <div class="text-subtitle-1 mt-4">
                Percentage of correct answers by sentence type
              </div>

            </div>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>

        <v-card class="pa-4 mb-6" elevation="2" :style="{
          minWidth: xs ? '300px' : '95%', 
          maxWidth: xs ? '500px' : '95%', 
          marginLeft: xs ? '5px' : '16px',
          marginRight: xs ? '5px' : '16px',
          marginTop: '20px',
          }"> 
          <div class="text-h5 mt-2" >Game details</div>
          <div v-for="session in sessions" :key="session.session_id" class="mt-6">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <span class="font-weight-medium">Game {{ session.session_id }} —
                  {{ session.correct_count }} Correct, {{ session.wrong_count }} Incorrect</span> — {{ new Date(session.started_at).toLocaleString() }} — {{ session.tenses.join(', ').slice(0,50) }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div v-if="session.rounds?.length" >
                    <v-table>
                    <thead>
                      <tr>
                        <th>Prompt #</th>
                        <th>Person</th>
                        <th>Verb</th>
                        <th>Tense</th>
                        <th>Sentence Type</th>
                        <th>User Answer</th>
                        <th>Correct?</th>
                        <th>Acceptable Answers</th>
                        <th>Time (s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="round in session.rounds" :key="`${session.session_id}-${round.prompt_number}`"
                      >
                        <td>{{ round.prompt_number }}</td>
                        <td>{{ round.person }}</td>
                        <td>{{ round.verb }}</td>
                        <td>{{ round.tense }}</td>
                        <td>{{ round.sentence_type }}</td>
                        <td>{{ round.user_answer }}</td>
                        <td>
                          <v-icon :color="round.is_correct ? 'green' : 'red'">
                            {{ round.is_correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
                          </v-icon>
                        </td>
                        <td>{{ round.acceptable_answers?.join(' / ') }}</td>
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
      
      
    </v-window-item>


  </v-window>
</v-container>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import api from "@/axios";
import { useUserStore } from "@/stores/user";
import { useDisplay } from 'vuetify';
import LoggedInFooter from '@/components/LoggedInFooter.vue';
import TopNavBar from '@/components/TopNavBar.vue';
import PieChart from "@/components/charts/PieChart.vue";
import BarChart from "@/components/charts/BarChart.vue";
import ErrorsDataTab from "@/components/ErrorsDataTab.vue";


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

let intervalId: ReturnType<typeof setInterval>;

export default 
defineComponent({
  name: "Dashboard",
  components: { TopNavBar, LoggedInFooter, PieChart, BarChart, ErrorsDataTab },
  setup() {
    const sessions = ref<GameSession[]>([]);
    const loading = ref<boolean>(true);
    const errorsError = ref<string | null>(null);
    const conjGameError = ref<string | null>(null);
    const userStore = useUserStore();
    const totalRoundsPlayed = computed(() =>
      sessions.value.reduce((sum, session) => sum + session.total_rounds, 0)
    );
    const totalPercentCorrect = computed(() =>
      Number((sessions.value.reduce((sum, session) => sum + session.correct_count, 0) / totalRoundsPlayed.value * 100).toFixed(0))
    );
    const totalPercentIncorrect = computed(() =>
      Number((sessions.value.reduce((sum, session) => sum + session.wrong_count, 0) / totalRoundsPlayed.value * 100).toFixed(0))
    );
    const totalRightWrongChartData = computed(() => [
      { label:'Correct', value: totalPercentCorrect.value },
      { label:'Incorrect', value: totalPercentIncorrect.value }
    ]);



    // Use string keys for active tab and tabs list
    const activeTab = ref('grammar-feedback');
    const tabItems = [
      { value: 'grammar-feedback', label: 'Grammar Feedback' },
      { value: 'vocabulary', label: 'Vocabulary' },
      { value: 'goals', label: 'Goals' },
      { value: 'conjugation-game', label: 'Conjugation Game' },
    ];

    const { xs, smAndDown } = useDisplay();
    const isMobile = computed(() => smAndDown.value);
    const BarchartColorPalette = [
      '#4CAF50', '#2196F3', '#FFC107', '#E91E63', '#9C27B0', '#FF5722'
    ];



    let intervalId: number;

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
    const tenseAccuracyData = computed(() => {
      const rounds = sessions.value.flatMap(session => session.rounds || []);
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

      return Object.entries(tenseGroups).map(([tense, stats], index: number) => ({
        label: tense,
        value: parseFloat(((stats.correct / stats.total) * 100).toFixed(0)),
        correct: stats.correct,
        total: stats.total,
        color: BarchartColorPalette[index % BarchartColorPalette.length]
      }));
    });

    const sentenceTypeAccuracyData = computed(() => {
      const rounds = sessions.value.flatMap(session => session.rounds || []);
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

      return Object.entries(typeGroups).map(([type, stats], index: number) => ({
        label: type,
        value: parseFloat(((stats.correct / stats.total) * 100).toFixed(0)),
        correct: stats.correct,
        total: stats.total,
        color: BarchartColorPalette[index % BarchartColorPalette.length]
      }));
    });


    onMounted(() => {
      fetchConjGameSessionsDashboardData();

      //intervalId = window.setInterval(() => {
      //  fetchErrorDashboardData();
      //  fetchConjGameSessionsDashboardData();
      //}, 80000);
    });


    //onUnmounted(() => {
    //  clearInterval(intervalId);
    //});

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
      totalRightWrongChartData,
      totalRoundsPlayed,
      tenseAccuracyData,
      sentenceTypeAccuracyData,
      smAndDown,
      xs
    };
  },
});
</script>

