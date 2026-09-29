// src/axios.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "@/stores/auth";
import { getAccessToken } from "./services/auth";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

let isRedirectingToLogin = false;

function isAuthRoute(url?: string) {
  if (!url) return false;
  return (
    url.includes("/login") ||
    url.includes("/token/") ||
    url.includes("/token/refresh") ||
    url.includes("/validate")
  );
}

// Request interceptor
api.interceptors.request.use((config) => {
  const auth = useAuthStore();

  if (isAuthRoute(config.url)) {
    return config;
  }

  const token = auth.access || getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: try refresh on 401 (once)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If request itself is auth-related, do not retry/refresh loop
    if (isAuthRoute(originalRequest?.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const auth = useAuthStore();

      try {
        const newToken = await auth.refreshAccessToken();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        auth.logout();
        if (!isRedirectingToLogin) {
          isRedirectingToLogin = true;
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;