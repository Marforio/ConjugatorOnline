<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Dashboard</h1>
      <button class="btn btn-danger" @click="logout">Logout</button>
    </div>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <ul v-else class="list-group">
      <li v-for="session in sessions" :key="session.id" class="list-group-item d-flex justify-content-between align-items-center">
        <span><strong>{{ session.username }}</strong></span>
        <span class="badge bg-primary rounded-pill">{{ session.score }} pts</span>
      </li>
    </ul>

    <div v-if="errors.length">
        <h2>Recent Errors</h2>
        <ul class="list-group">
            <li v-for="errorItem in errors" :key="errorItem.error_id" class="list-group-item">
            <span><strong>{{ errorItem.error_code }}</strong> ({{ errorItem.times }}x)</span>
            <div v-if="errorItem.evidence">
                {{ errorItem.evidence }}
            </div>
            </li>
        </ul>
    </div>
    <div v-else>
      <p class="text-muted">No recent errors.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import api from "@/axios";
import { clearTokens } from "@/services/auth";

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
  // Add other fields as exposed by your ErrorSerializer
}

export default defineComponent({
  name: "Dashboard",
  setup() {
    const sessions = ref<GameSession[]>([]);
    const errors = ref<ErrorItem[]>([]);
    const loading = ref<boolean>(true);
    const error = ref<string | null>(null);
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

    const logout = () => {
      clearTokens();
      window.location.href = "/login";
    };

    onMounted(() => {
      fetchDashboardData;
      // Refresh data every 30 seconds
      intervalId = window.setInterval(fetchDashboardData, 80000);
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return { sessions, errors, loading, error, logout };
  },
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
