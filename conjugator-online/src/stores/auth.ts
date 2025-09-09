// src/stores/auth.ts
import { defineStore } from "pinia";
import { ref, computed, nextTick } from "vue";
import { apiLogin, apiRefresh, apiValidateToken, saveTokens, clearTokens, getAccessToken, getRefreshToken } from "@/services/auth";


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
    return res.data.access; // return the token
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

  async function validateSession(): Promise<boolean> {
    if (!access.value) return false;

    try {
      await apiValidateToken(); // token is valid
      return true;
    } catch {
      try {
        await refreshAccessToken(); // try to refresh
        await apiValidateToken();   // validate again
        return true;
      } catch {
        logout(); // clear tokens and reset store
        return false;
      }
    }
  }

function isAccessTokenExpired(): boolean {
    const expiry = parseInt(localStorage.getItem("access_expiry") || "0");
    return Date.now() > expiry;
  }

  return {
    access,
    refresh,
    isLoggedIn,
    login,
    logout,
    refreshAccessToken,
    validateSession,
    isAccessTokenExpired
  };
});
