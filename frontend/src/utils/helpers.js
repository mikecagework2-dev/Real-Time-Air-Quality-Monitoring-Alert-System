import { AQI_LEVELS } from "./constants";

/**
 * Format an AQI value to a rounded integer string.
 */
export function formatAQI(value) {
  if (value === null || value === undefined) return "—";
  return Math.round(Number(value)).toString();
}

/**
 * Return the background color for a given AQI value.
 */
export function getAQIColor(aqi) {
  const level = AQI_LEVELS.find((l) => aqi >= l.min && aqi <= l.max);
  return level ? level.color : "#7e0023";
}

/**
 * Return the text color (for contrast) for a given AQI value.
 */
export function getAQITextColor(aqi) {
  const level = AQI_LEVELS.find((l) => aqi >= l.min && aqi <= l.max);
  return level ? level.textColor : "#fff";
}

/**
 * Return the label string for a given AQI value.
 */
export function getAQILabel(aqi) {
  const level = AQI_LEVELS.find((l) => aqi >= l.min && aqi <= l.max);
  return level ? level.label : "Hazardous";
}

/**
 * Format a pollutant value with its unit.
 */
export function formatPollutant(value, unit = "µg/m³") {
  if (value === null || value === undefined) return "—";
  return `${Number(value).toFixed(2)} ${unit}`;
}

/**
 * Format a timestamp string into a readable local date/time.
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return "—";
  try {
    const normalized = timestamp.endsWith("Z") ? timestamp : timestamp + "Z";
    const date = new Date(normalized);
    return date.toLocaleString();
  } catch {
    return timestamp;
  }
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
