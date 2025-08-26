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
          <v-window-item value="overview">
            <!-- Overview tab content -->
            <div v-if="loading" class="text-center my-5">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else-if="error">
              <v-alert type="error">{{ error }}</v-alert>
            </div>
            <v-list v-else>
              <v-list-item v-for="session in sessions" :key="session.id">
                <v-list-item-content>
                  <v-list-item-title>{{ session.username }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip color="primary" label>{{ session.score }} pts</v-chip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
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

          <v-window-item value="analytics">
            <p>Coming soon...</p>
          </v-window-item>

          <v-window-item value="settings">
            <p>Coming soon...</p>
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
    const error = ref<string | null>(null);
    const userStore = useUserStore();

    // Use string keys for active tab and tabs list
    const activeTab = ref("overview");
    const tabs = [
      "grammar-feedback",
      "vocabulary",
      "goals",
      "conjugation-game",
    ];

    let intervalId: number;

    const fetchDashboardData = async () => {
      try {
        loading.value = true;
        const [sessionsRes, errorsRes] = await Promise.all([
          api.get<GameSession[]>("/conj-game-sessions/"),
          api.get<ErrorItem[]>("/errors/"),
        ]);
        sessions.value = sessionsRes.data;
        errors.value = errorsRes.data;
        error.value = null;
      } catch (err: any) {
        console.error(err);
        error.value = err.response?.data?.detail || "Failed to fetch data";
      } finally {
        loading.value = false;
      }
    };


    onMounted(() => {
      fetchDashboardData();
      intervalId = window.setInterval(fetchDashboardData, 80000);
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      sessions,
      errors,
      loading,
      error,
      activeTab,
      tabs,
      userStore,
      TopNavBar,
    };
  },
});
</script>

