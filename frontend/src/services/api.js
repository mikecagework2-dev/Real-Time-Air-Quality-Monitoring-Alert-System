import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor for uniform error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export async function getAirQuality(location) {
  const response = await api.get(`/api/air-quality/${encodeURIComponent(location)}`);
  return response.data;
}

export async function getAirQualityHistory(location) {
  const response = await api.get(
    `/api/air-quality/${encodeURIComponent(location)}/history`
  );
  return response.data;
}

export async function savePreferences(data) {
  const response = await api.post("/api/preferences", data);
  return response.data;
}

export async function getPreferences(userId) {
  const response = await api.get(`/api/preferences/${userId}`);
  return response.data;
}

export async function updatePreferences(userId, data) {
  const response = await api.put(`/api/preferences/${userId}`, data);
  return response.data;
}

export async function testAlert(data) {
  const response = await api.post("/api/alerts/test", data);
  return response.data;
}

export async function getDefaultThresholds() {
  const response = await api.get("/api/alerts/thresholds");
  return response.data;
}

export async function checkAlerts(location) {
  const response = await api.post("/api/alerts/check", { location });
  return response.data;
}

export default api;
