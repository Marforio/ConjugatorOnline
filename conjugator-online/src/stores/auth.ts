// src/stores/auth.ts
import { defineStore } from "pinia";
import { ref, computed, onMounted, nextTick } from "vue";
import { 
  apiLogin, apiRefresh, apiValidateToken, 
  saveTokens, clearTokens, 
  getAccessToken, getRefreshToken 
} from "@/services/auth";

export const useAuthStore = defineStore("auth", () => {
  const access = ref<string | null>(null);
  const refresh = ref<string | null>(null);
  const isRestored = ref(false); // new: hydration flag

  // Session restoration (hydration)
  function restoreSession() {
    access.value = getAccessToken();
    refresh.value = getRefreshToken();
    isRestored.value = true;
  }

  // Immediate restore on store creation / component mount
  if (typeof window !== 'undefined') {
    restoreSession();
  }

  const isLoggedIn = computed(() => !!access.value);

  async function login(username: string, password: string) {
    const res = await apiLogin(username, password);
    access.value = res.data.access;
    refresh.value = res.data.refresh;
    saveTokens(res.data.access, res.data.refresh);
    isRestored.value = true; // Set hydrated after login
    return res.data.access;
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
    isRestored.value = false;
    clearTokens();
  }

  async function validateSession(): Promise<boolean> {
    await nextTick();

    // Hydrate from localStorage if not hydrated
    if (!isRestored.value) restoreSession();

    if (!access.value) return false;

    if (isAccessTokenExpired()) {
      try {
        await refreshAccessToken();
        await apiValidateToken();
        return true;
      } catch {
        logout();
        return false;
      }
    }
    try {
      await apiValidateToken();
      return true;
    } catch {
      try {
        await refreshAccessToken();
        await apiValidateToken();
        return true;
      } catch {
        logout();
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
    isRestored,    
    isLoggedIn,
    login,
    logout,
    refreshAccessToken,
    validateSession,
    isAccessTokenExpired,
    restoreSession, // EXPORTED for early call if needed
  };
});
