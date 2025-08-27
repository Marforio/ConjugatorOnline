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

            <v-data-table
              v-else
              :headers="tableHeaders"
              :items="sessions"
              class="elevation-1"
              item-value="session_id"
              :items-per-page="5"
            >
              <template #item.started_at="{ item }">
                {{ new Date(item.started_at).toLocaleString() }}
              </template>

              <template #item.tenses="{ item }">
                {{ item.tenses.join(', ') }}
              </template>

              <template #item.sentence_types="{ item }">
                {{ item.sentence_types.join(', ') }}
              </template>
            </v-data-table>
          </v-window-item>

        </v-window>
      </v-container>
    </v-main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import api from "@/axios";
import { useUserStore } from "@/stores/user";
import LoggedInFooter from '@/components/LoggedInFooter.vue';
import TopNavBar from '@/components/TopNavBar.vue';


interface GameSession {
  id: number;
  username: string;
  score: number;
  created_at: string;
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
  components: { TopNavBar, LoggedInFooter },
  setup() {
    const sessions = ref<GameSession[]>([]);
    const errors = ref<ErrorItem[]>([]);
    const loading = ref<boolean>(true);
    const errorsError = ref<string | null>(null);
    const conjGameError = ref<string | null>(null);
    const userStore = useUserStore();

    // Use string keys for active tab and tabs list
    const activeTab = ref("overview");
    const tabs = [
      "grammar-feedback",
      "vocabulary",
      "goals",
      "conjugation-game",
    ];

    const tableHeaders = [
      { title: "Session ID", value: "session_id" },
      { title: "Correct Count", value: "correct_count"},
      { title: "Incorrect Count", value: "wrong_count"},
      { title: "Verb Set", value: "verb_set" },
      { title: "Tenses", value: "tenses" },
      { title: "Sentence Types", value: "sentence_types" },
      { title: "Started At", value: "started_at" },
      { title: "Total Rounds", value: "total_rounds" },
      { title: "Avg Time (s)", value: "avg_time_per_prompt" },
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
      intervalId = window.setInterval(fetchErrorDashboardData, 80000);
      fetchConjGameSessionsDashboardData();
      intervalId = window.setInterval(fetchConjGameSessionsDashboardData, 80000);
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
      tableHeaders,
    };
  },
});
</script>

