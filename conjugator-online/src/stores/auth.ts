// src/stores/auth.ts
import { defineStore } from "pinia";
import { ref, computed, nextTick } from "vue";
import {
  apiLogin, apiRefresh, apiValidateToken,
  saveTokens, clearTokens,
  getAccessToken, getRefreshToken
} from "@/services/auth";
import { useWelcomeStore } from "@/stores/welcome";

function parseJwt(token: string | null): any | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", () => {
  const access = ref<string | null>(null);
  const refresh = ref<string | null>(null);
  const isRestored = ref(false);

  // ---- concurrency guards ----
  const refreshInFlight = ref<Promise<string> | null>(null);
  const validateInFlight = ref<Promise<boolean> | null>(null);

  function emitTokenRefreshed(newAccessToken: string) {
    window.dispatchEvent(
      new CustomEvent("auth:token-refreshed", {
        detail: { accessToken: newAccessToken }
      })
    );
  }

  function emitAuthInvalid() {
    window.dispatchEvent(new CustomEvent("auth:invalid"));
  }

  function restoreSession() {
    access.value = getAccessToken();
    refresh.value = getRefreshToken();
    isRestored.value = true;
  }

  if (typeof window !== "undefined") {
    restoreSession();
  }

  const isLoggedIn = computed(() => {
    if (!access.value) return false;
    return !isAccessTokenExpired(0);
  });

  function isAccessTokenExpired(skewSec = 10): boolean {
    const payload = parseJwt(access.value);
    if (!payload?.exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp <= (nowSec + skewSec);
  }

  async function login(username: string, password: string) {
    const res = await apiLogin(username, password);
    access.value = res.data.access;
    refresh.value = res.data.refresh;
    saveTokens(res.data.access, res.data.refresh);
    isRestored.value = true;
    return res.data.access as string;
  }

  async function refreshAccessToken() {
    if (!refresh.value) throw new Error("No refresh token");

    // If a refresh is already in progress, wait for it
    if (refreshInFlight.value) {
      return await refreshInFlight.value;
    }

    // Start one shared refresh request
    refreshInFlight.value = (async () => {
      const res = await apiRefresh(refresh.value!);
      access.value = res.data.access;
      saveTokens(res.data.access, refresh.value!);
      emitTokenRefreshed(res.data.access);
      return res.data.access as string;
    })();

    try {
      return await refreshInFlight.value;
    } finally {
      refreshInFlight.value = null;
    }
  }

  function logout() {
    access.value = null;
    refresh.value = null;
    isRestored.value = false;
    clearTokens();

    // reset warm cached welcome data
    try {
      const welcomeStore = useWelcomeStore();
      welcomeStore.resetWelcomeState();
    } catch {}

    emitAuthInvalid();
  }

  async function validateSession(): Promise<boolean> {
  await nextTick()

  if (validateInFlight.value) return await validateInFlight.value

  validateInFlight.value = (async () => {
    if (!isRestored.value) restoreSession()
    if (!access.value) return false

    // If access token is expired, refresh once
    if (isAccessTokenExpired()) {
      try {
        await refreshAccessToken()
        return true
      } catch {
        logout()
        return false
      }
    }

    // Token looks valid locally; optional server validate should be soft
    try {
      await apiValidateToken()
      return true
    } catch {
      // Try one refresh recovery; if that works, allow
      try {
        await refreshAccessToken()
        return true
      } catch {
        logout()
        return false
      }
    }
  })()

  try {
    return await validateInFlight.value
  } finally {
    validateInFlight.value = null
  }
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
    restoreSession,
  };
});