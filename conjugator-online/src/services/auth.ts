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

export async function login(username: string, password: string) {
  const res = await api.post("/token/", { username, password });
  saveTokens(res.data.access, res.data.refresh);
  return res.data;
}

export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  const res = await api.post("/token/refresh/", { refresh });
  saveTokens(res.data.access, refresh); // save new access, keep refresh
  return res.data.access;
}
