import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getAccessToken, refreshToken, clearTokens } from "./services/auth";

const api = axios.create({
  baseURL: "https://your-backend.azurewebsites.net",
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
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
        return api(originalRequest); // retry with new token
      } catch (err) {
        clearTokens();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
