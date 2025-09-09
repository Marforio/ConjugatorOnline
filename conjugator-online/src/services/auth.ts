// src/services/auth.ts
import api from "@/axios";

export function getAccessToken() {
  return localStorage.getItem("access");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh");
}

export function saveTokens(access: string, refresh: string, expiresIn: number = 3600) {
  const expiry = Date.now() + expiresIn * 1000;
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("access_expiry", expiry.toString());
}

export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("access_expiry");
}

// API calls only
export async function apiLogin(username: string, password: string) {
  return api.post("/token/", { username, password });
}

export async function apiRefresh(refresh: string) {
  return api.post("/token/refresh/", { refresh });
}
export async function apiValidateToken() {
  return api.get("/token/validate/");
}

