// src/services/auth.ts
import axios from "axios";

const API_URL = "https://languagelabsback-feb3ekeqg2hkbrcp.switzerlandnorth-01.azurewebsites.net/";

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
  const res = await axios.post(`${API_URL}/api/token/`, { username, password });
  saveTokens(res.data.access, res.data.refresh);
  return res.data;
}

export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");
  const res = await axios.post(`${API_URL}/api/token/refresh/`, { refresh });
  saveTokens(res.data.access, refresh);
  return res.data.access;
}
