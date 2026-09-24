import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "@/stores/auth";
import { getAccessToken } from "./services/auth";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // must be set in .env
});

// --- single-flight refresh state ---
let refreshPromise: Promise<string> | null = null;
let redirectingToLogin = false;

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const auth = useAuthStore();

  // Do not attach auth for auth endpoints
  if (config.url?.includes("/login") || config.url?.includes("/token/")) {
    return config;
  }

  const token = auth.access || getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: refresh once on 401, queue concurrent requests behind one refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const auth = useAuthStore();

    const originalRequest = (error?.config || {}) as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error?.response?.status;
    const url = String(originalRequest?.url || "");

    // Only handle 401 here
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Never try refresh for auth endpoints themselves
    if (url.includes("/token/refresh/") || url.includes("/login")) {
      if (!redirectingToLogin) {
        redirectingToLogin = true;
        auth.logout();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      if (!redirectingToLogin) {
        redirectingToLogin = true;
        auth.logout();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Start one refresh request for all concurrent 401s
      if (!refreshPromise) {
        refreshPromise = auth.refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;

      // Retry original request with fresh token
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      if (!redirectingToLogin) {
        redirectingToLogin = true;
        auth.logout(); // clears tokens + resets store
        window.location.href = "/login";
      }
      return Promise.reject(refreshErr);
    }
  }
);

export default api;