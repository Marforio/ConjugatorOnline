// src/axios.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getAccessToken, refreshToken, clearTokens } from "./services/auth";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // must be set in .env
});

// Request interceptor: attach access token only if exists
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Always allow auth endpoints
    if (config.url?.includes("/login") || config.url?.includes("/token/")) {
      return config;
    }

    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If no token, let the request go through and let backend handle 401
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: refresh token on 401
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
