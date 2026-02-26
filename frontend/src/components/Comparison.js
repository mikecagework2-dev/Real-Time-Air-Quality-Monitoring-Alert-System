import React, { useState } from "react";
import { getAirQuality } from "../services/api";
import { getAQIColor, getAQILabel, formatPollutant } from "../utils/helpers";
import { POLLUTANT_LABELS, POLLUTANT_UNITS } from "../utils/constants";

export default function Comparison() {
  const [locations, setLocations] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function addLocation() {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (locations.find((l) => l.location?.toLowerCase() === trimmed.toLowerCase())) {
      setError("Location already added.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await getAirQuality(trimmed);
      if (res.success) {
        setLocations((prev) => [...prev, res.data]);
        setInput("");
      } else {
        setError(res.error || "Failed to fetch data.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function removeLocation(locationName) {
    setLocations((prev) => prev.filter((l) => l.location !== locationName));
  }

  const bestAqi = locations.length > 0 ? Math.min(...locations.map((l) => l.aqi)) : null;
  const worstAqi = locations.length > 0 ? Math.max(...locations.map((l) => l.aqi)) : null;

  const pollutants = ["pm25", "pm10", "co", "no2", "o3", "so2"];

  return (
    <div className="comparison-container">
      <h2>📊 Location Comparison</h2>
      <p>Compare air quality across multiple locations side by side.</p>

      <div className="comparison-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addLocation()}
          placeholder="Add a city to compare…"
          className="location-input"
          disabled={loading}
        />
        <button
          className="btn btn-primary"
          onClick={addLocation}
          disabled={loading || !input.trim()}
        >
          {loading ? "Loading…" : "+ Add"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {locations.length === 0 && (
        <p className="no-data">Add at least two locations to start comparing.</p>
      )}

      <div className="comparison-grid">
        {locations.map((loc) => {
          const isBest = loc.aqi === bestAqi && locations.length > 1;
          const isWorst = loc.aqi === worstAqi && locations.length > 1;
          const bgColor = getAQIColor(loc.aqi);
          return (
            <div
              key={loc.location}
              className={`comparison-card ${isBest ? "best" : ""} ${isWorst ? "worst" : ""}`}
            >
              <div className="comp-card-header" style={{ backgroundColor: bgColor }}>
                <button
                  className="remove-btn"
                  onClick={() => removeLocation(loc.location)}
                  aria-label="Remove location"
                >
                  ✕
                </button>
                <div className="comp-location">{loc.location}</div>
                <div className="comp-aqi">{loc.aqi}</div>
                <div className="comp-label">{getAQILabel(loc.aqi)}</div>
                {isBest && <span className="badge best-badge">🌿 Best</span>}
                {isWorst && <span className="badge worst-badge">⚠️ Worst</span>}
              </div>
              <div className="comp-pollutants">
                {pollutants.map((key) => (
                  <div key={key} className="comp-pollutant-row">
                    <span>{POLLUTANT_LABELS[key]}</span>
                    <span>{formatPollutant(loc[key], POLLUTANT_UNITS[key])}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
