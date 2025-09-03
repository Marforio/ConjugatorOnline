// src/stores/auth.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { apiLogin, apiRefresh, saveTokens, clearTokens, getAccessToken, getRefreshToken } from "@/services/auth";

export const useAuthStore = defineStore("auth", () => {
  const access = ref<string | null>(null);
    if (typeof window !== 'undefined') {
    access.value = getAccessToken();
    }
  const refresh = ref<string | null>(getRefreshToken());

  const isLoggedIn = computed(() => !!access.value);

  async function login(username: string, password: string) {
    const res = await apiLogin(username, password);
    access.value = res.data.access;
    refresh.value = res.data.refresh;
    saveTokens(res.data.access, res.data.refresh);
  }

  async function refreshAccessToken() {
    if (!refresh.value) throw new Error("No refresh token");
    const res = await apiRefresh(refresh.value);
    access.value = res.data.access;
    saveTokens(res.data.access, refresh.value);
  }

  function logout() {
    access.value = null;
    refresh.value = null;
    clearTokens();
  }

  return {
    access,
    refresh,
    isLoggedIn,
    login,
    logout,
    refreshAccessToken,
  };
});
