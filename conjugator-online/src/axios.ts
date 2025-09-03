// src/axios.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "@/stores/auth";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // must be set in .env
});

// Request interceptor: attach access token if available
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const auth = useAuthStore();

    // Skip attaching for auth endpoints
    if (config.url?.includes("/login") || config.url?.includes("/token/")) {
      return config;
    }

    if (auth.access) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${auth.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: try refresh on 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const auth = useAuthStore();

      try {
        const newToken = await auth.refreshAccessToken();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        auth.logout(); // clears tokens + resets store
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
