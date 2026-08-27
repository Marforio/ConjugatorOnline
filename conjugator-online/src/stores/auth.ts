// src/stores/auth.ts
import { defineStore } from "pinia";
import { ref, computed, nextTick } from "vue";
import {
  apiLogin, apiRefresh, apiValidateToken,
  saveTokens, clearTokens,
  getAccessToken, getRefreshToken
} from "@/services/auth";

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

  const isLoggedIn = computed(() => !!access.value);

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
    return res.data.access;
  }

  async function refreshAccessToken() {
    if (!refresh.value) throw new Error("No refresh token");
    const res = await apiRefresh(refresh.value);
    access.value = res.data.access;
    saveTokens(res.data.access, refresh.value);
    emitTokenRefreshed(res.data.access);
    return res.data.access;
  }

  function logout() {
    access.value = null;
    refresh.value = null;
    isRestored.value = false;
    clearTokens();
    emitAuthInvalid();
  }

  async function validateSession(): Promise<boolean> {
    await nextTick();

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