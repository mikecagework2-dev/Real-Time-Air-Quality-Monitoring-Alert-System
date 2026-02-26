import React, { useState } from "react";

export default function LocationInput({ onSearch, loading }) {
  const [city, setCity] = useState("");
  const [geoError, setGeoError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  function handleGeolocate() {
    setGeoError("");
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Use reverse geocoding via OpenStreetMap Nominatim (no API key required)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const cityName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
          setCity(cityName);
          onSearch(cityName);
        } catch {
          const coords = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
          setCity(coords);
          onSearch(coords);
        }
      },
      (err) => {
        setGeoError("Unable to retrieve your location: " + err.message);
      }
    );
  }

  return (
    <div className="location-input-container">
      <form onSubmit={handleSubmit} className="location-form">
        <input
          type="text"
          className="location-input"
          placeholder="Enter city name (e.g. London, New York)…"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
          aria-label="City name"
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleGeolocate}
          disabled={loading}
          title="Use my current location"
          aria-label="Use my location"
        >
          📍 My Location
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !city.trim()}
        >
          {loading ? "Searching…" : "🔍 Search"}
        </button>
      </form>
      {geoError && <p className="error-message">{geoError}</p>}
    </div>
  );
}
