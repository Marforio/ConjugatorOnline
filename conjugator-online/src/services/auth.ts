// src/services/auth.ts
import api from "@/axios";

export function getAccessToken() {
  return localStorage.getItem("access");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh");
}

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

// API calls only
export async function apiLogin(username: string, password: string) {
  return api.post("/token/", { username, password });
}

export async function apiRefresh(refresh: string) {
  return api.post("/token/refresh/", { refresh });
}
