// src/axios.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getAccessToken, refreshToken, clearTokens } from "./services/auth";

// Create an axios instance with baseURL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // '/api' in dev, full URL in prod
});

// Request interceptor: attach access token if it exists
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAccessToken();
    if (token) {
      // Ensure headers object exists
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 errors and refresh token if needed
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // retry original request with new token
      } catch (err) {
        clearTokens();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
