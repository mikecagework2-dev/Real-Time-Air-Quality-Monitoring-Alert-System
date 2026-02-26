import React from "react";
import { getAQIColor, getAQITextColor, getAQILabel, formatPollutant, formatTimestamp } from "../utils/helpers";
import { POLLUTANT_LABELS, POLLUTANT_UNITS } from "../utils/constants";

export default function AirQualityCard({ data, lastUpdated }) {
  if (!data) return null;

  const aqi = data.aqi ?? 0;
  const bgColor = getAQIColor(aqi);
  const textColor = getAQITextColor(aqi);
  const label = getAQILabel(aqi);

  const pollutants = ["pm25", "pm10", "co", "no2", "o3", "so2"];

  return (
    <div className="aq-card">
      <div className="aq-card-header" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="aq-location">{data.location || "Unknown Location"}</div>
        <div className="aq-aqi-value">{aqi}</div>
        <div className="aq-aqi-label">{label}</div>
        <div className="aq-updated">
          Last updated: {formatTimestamp(lastUpdated)}
        </div>
      </div>

      <div className="aq-pollutants">
        {pollutants.map((key) => (
          <div key={key} className="pollutant-item">
            <span className="pollutant-name">{POLLUTANT_LABELS[key]}</span>
            <span className="pollutant-value">
              {formatPollutant(data[key], POLLUTANT_UNITS[key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
