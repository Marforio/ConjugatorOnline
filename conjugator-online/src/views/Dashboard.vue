<template>
    <!-- Top App Bar -->
    <TopNavBar />

<!-- Main content area -->
    <v-main>
      <v-container>
        <!-- Tabs Navigation -->
        <v-tabs v-model="activeTab" class="mt-4">
          <v-tab value="grammar-feedback">Grammar Feedback</v-tab>
          <v-tab value="vocabulary">Vocabulary</v-tab>
          <v-tab value="goals">Goals</v-tab>
          <v-tab value="conjugation-game">Conjugation Game</v-tab>
        </v-tabs>

        <!-- Tab Content -->
        <v-window v-model="activeTab" class="mt-5">
          <v-window-item value="grammar-feedback">
            <!-- Grammar Feedback tab content -->
            <div v-if="loading" class="text-center my-5">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else-if="errorsError">
              <v-alert type="error">{{ errorsError }}</v-alert>
            </div>
            
            <div v-if="errors.length">
              <h2>Recent Errors</h2>
              <v-list>
                <v-list-item v-for="errorItem in errors" :key="errorItem.error_id">
                  <v-list-item-content>
                    <v-list-item-title>
                      <strong>{{ errorItem.error_code }}</strong> ({{ errorItem.times }}x)
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="errorItem.evidence">
                      {{ errorItem.evidence }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <div v-else>
              <p class="text-muted">No recent errors.</p>
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
              <PieChart :data="totalRightWrongChartData" />
              <div v-for="session in sessions" :key="session.session_id" class="mt-6">
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      Game {{ session.session_id }} — {{ new Date(session.started_at).toLocaleString() }} —
                      {{ session.correct_count }} Correct, {{ session.wrong_count }} Incorrect — {{ session.tenses.join(', ').slice(0,50) }}
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
          </div>
            

          </v-window-item>


        </v-window>
      </v-container>
    </v-main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from "vue";
import api from "@/axios";
import { useUserStore } from "@/stores/user";
import LoggedInFooter from '@/components/LoggedInFooter.vue';
import TopNavBar from '@/components/TopNavBar.vue';
import PieChart from "@/components/charts/PieChart.vue";

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


interface ErrorItem {
  error_id: string;
  error_code: string;
  evidence: string | null;
  times: number;
}
let intervalId: ReturnType<typeof setInterval>;

export default 
defineComponent({
  name: "Dashboard",
  components: { TopNavBar, LoggedInFooter, PieChart },
  setup() {
    const sessions = ref<GameSession[]>([]);
    const errors = ref<ErrorItem[]>([]);
    const loading = ref<boolean>(true);
    const errorsError = ref<string | null>(null);
    const conjGameError = ref<string | null>(null);
    const userStore = useUserStore();
    const totalCorrect = computed(() =>
      sessions.value.reduce((sum, session) => sum + session.correct_count, 0)
    );
    const totalIncorrect = computed(() =>
      sessions.value.reduce((sum, session) => sum + session.wrong_count, 0)
    );
    const totalRightWrongChartData = computed(() => [
      { label: 'Correct', value: totalCorrect.value },
      { label: 'Incorrect', value: totalIncorrect.value },
    ]);



    // Use string keys for active tab and tabs list
    const activeTab = ref("overview");
    const tabs = [
      "grammar-feedback",
      "vocabulary",
      "goals",
      "conjugation-game",
    ];



    let intervalId: number;

    const fetchErrorDashboardData = async () => {
      loading.value = true;
      errorsError.value = null;


      try {
        const errorsRes = await api.get<ErrorItem[]>("/errors/");
        errors.value = errorsRes.data;
      } catch (err: any) {
        console.error("Errors fetch failed:", err);
        errorsError.value = errorsError.value
          ? `${errorsError.value}; Failed to fetch errors`
          : "Failed to fetch errors";
      }

      loading.value = false;
    };
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



    onMounted(() => {
      fetchErrorDashboardData();
      fetchConjGameSessionsDashboardData();

      intervalId = window.setInterval(() => {
        fetchErrorDashboardData();
        fetchConjGameSessionsDashboardData();
      }, 80000);
    });


    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      sessions,
      errors,
      loading,
      errorsError,
      conjGameError,
      activeTab,
      tabs,
      userStore,
      TopNavBar,
      PieChart,
      totalRightWrongChartData,
    };
  },
});
</script>

