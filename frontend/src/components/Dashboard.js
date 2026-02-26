import React, { useState, useEffect, useCallback } from "react";
import LocationInput from "./LocationInput";
import AirQualityCard from "./AirQualityCard";
import TrendChart from "./TrendChart";
import Recommendations from "./Recommendations";
import { getAirQuality, getAirQualityHistory } from "../services/api";
import { checkAndNotify } from "../services/notifications";
import { POLL_INTERVAL, DEFAULT_THRESHOLDS } from "../utils/constants";

export default function Dashboard() {
  const [airData, setAirData] = useState(null);
  const [history, setHistory] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentLocation, setCurrentLocation] = useState("");

  const fetchData = useCallback(async (location) => {
    if (!location) return;
    setLoading(true);
    setError("");
    try {
      const [aqRes, histRes] = await Promise.allSettled([
        getAirQuality(location),
        getAirQualityHistory(location),
      ]);

      if (aqRes.status === "fulfilled" && aqRes.value.success) {
        setAirData(aqRes.value.data);
        setRecommendations(aqRes.value.recommendations);
        setLastUpdated(new Date().toISOString());
        checkAndNotify(aqRes.value.data.aqi, location, DEFAULT_THRESHOLDS.aqi);
      } else {
        const errMsg =
          aqRes.status === "rejected"
            ? aqRes.reason.message
            : aqRes.value?.error || "Failed to fetch air quality data.";
        setError(errMsg);
      }

      if (histRes.status === "fulfilled" && histRes.value.success) {
        setHistory(histRes.value.data || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every POLL_INTERVAL ms
  useEffect(() => {
    if (!currentLocation) return;
    const interval = setInterval(() => {
      fetchData(currentLocation);
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [currentLocation, fetchData]);

  function handleSearch(location) {
    setCurrentLocation(location);
    fetchData(location);
  }

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h1>🌬️ Air Quality Monitor</h1>
        <p>Real-time air quality data and health alerts for any city worldwide.</p>
      </div>

      <LocationInput onSearch={handleSearch} loading={loading} />

      {loading && (
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Fetching air quality data…</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-banner">
          <strong>⚠️ Error:</strong> {error}
          {error.includes("API key") && (
            <p className="error-hint">
              Configure your OpenWeatherMap API key in the backend <code>.env</code> file.
            </p>
          )}
        </div>
      )}

      {airData && !loading && (
        <div className="dashboard-content">
          <div className="dashboard-main">
            <AirQualityCard data={airData} lastUpdated={lastUpdated} />
            <Recommendations recommendations={recommendations} />
          </div>
          <div className="dashboard-chart">
            <TrendChart history={history} />
          </div>
        </div>
      )}

      {!airData && !loading && !error && (
        <div className="welcome-message">
          <div className="welcome-icon">🌍</div>
          <h2>Search for a location to get started</h2>
          <p>Enter a city name or use your current location to see live air quality data.</p>
        </div>
      )}

      {currentLocation && (
        <p className="refresh-note">
          Auto-refreshes every 5 minutes · Monitoring: <strong>{currentLocation}</strong>
        </p>
      )}
    </div>
  );
}
