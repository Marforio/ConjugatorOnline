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

export default defineComponent({
  name: "Dashboard",
  setup() {
    const sessions = ref<GameSession[]>([]);
    const loading = ref<boolean>(true);
    const error = ref<string | null>(null);
    let intervalId: number;

    const fetchSessions = async () => {
      try {
        loading.value = true;
        const response = await api.get<GameSession[]>("/api/conj-game-sessions/");
        sessions.value = response.data;
        error.value = null;
      } catch (err: any) {
        console.error(err);
        error.value = err.response?.data?.detail || "Failed to fetch sessions";
      } finally {
        loading.value = false;
      }
    };

    const logout = () => {
      clearTokens();
      window.location.href = "/login";
    };

    onMounted(() => {
      fetchSessions();
      // Refresh data every 30 seconds
      intervalId = window.setInterval(fetchSessions, 30000);
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return { sessions, loading, error, logout };
  },
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
