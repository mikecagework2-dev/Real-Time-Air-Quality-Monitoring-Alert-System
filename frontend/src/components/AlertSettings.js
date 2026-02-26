import React, { useState, useEffect } from "react";
import { savePreferences, getDefaultThresholds, testAlert } from "../services/api";

// Form field names intentionally use snake_case to mirror the backend API payload directly.
const DEFAULT_FORM = {
  location: "",
  email: "",
  alert_threshold: 150,
  pm25_threshold: 35.4,
  pm10_threshold: 154.0,
  no2_threshold: 100.0,
  o3_threshold: 100.0,
  email_enabled: false,
};

export default function AlertSettings() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getDefaultThresholds()
      .then((res) => {
        if (res.thresholds) {
          setForm((prev) => ({
            ...prev,
            alert_threshold: res.thresholds.aqi ?? 150,
            pm25_threshold: res.thresholds.pm25 ?? 35.4,
            pm10_threshold: res.thresholds.pm10 ?? 154.0,
            no2_threshold: res.thresholds.no2 ?? 100.0,
            o3_threshold: res.thresholds.o3 ?? 100.0,
          }));
        }
      })
      .catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.location.trim()) {
      setError("Location is required.");
      return;
    }
    setSaving(true);
    try {
      const res = await savePreferences(form);
      setMessage(`Preferences saved! (ID: ${res.data?.id})`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setError("");
    setMessage("");
    if (!form.email.trim()) {
      setError("Enter an email address to send a test alert.");
      return;
    }
    setTesting(true);
    try {
      await testAlert({ email: form.email, location: form.location || "Test City" });
      setMessage(`Test alert sent to ${form.email}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="settings-container">
      <h2>⚙️ Alert Settings</h2>
      <p className="settings-description">
        Configure custom alert thresholds and email notifications.
      </p>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSave} className="settings-form">
        <div className="form-section">
          <h3>Location</h3>
          <div className="form-group">
            <label htmlFor="location">City / Location *</label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. London"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>AQI Threshold</h3>
          <div className="form-group">
            <label htmlFor="alert_threshold">Alert when AQI exceeds</label>
            <input
              id="alert_threshold"
              name="alert_threshold"
              type="number"
              min="0"
              max="500"
              value={form.alert_threshold}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Pollutant Thresholds (µg/m³)</h3>
          {[
            { name: "pm25_threshold", label: "PM2.5" },
            { name: "pm10_threshold", label: "PM10" },
            { name: "no2_threshold", label: "NO₂" },
            { name: "o3_threshold", label: "O₃" },
          ].map(({ name, label }) => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type="number"
                min="0"
                step="0.1"
                value={form[name]}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          ))}
        </div>

        <div className="form-section">
          <h3>Email Notifications</h3>
          <div className="form-group checkbox-group">
            <input
              id="email_enabled"
              name="email_enabled"
              type="checkbox"
              checked={form.email_enabled}
              onChange={handleChange}
            />
            <label htmlFor="email_enabled">Enable email notifications</label>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="form-input"
              disabled={!form.email_enabled}
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleTest}
            disabled={testing || !form.email_enabled}
          >
            {testing ? "Sending…" : "📧 Send Test Alert"}
          </button>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "💾 Save Preferences"}
        </button>
      </form>
    </div>
  );
}
