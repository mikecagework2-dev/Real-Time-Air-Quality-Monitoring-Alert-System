// AQI level definitions with ranges, labels, colors, and descriptions
export const AQI_LEVELS = [
  {
    min: 0,
    max: 50,
    label: "Good",
    color: "#00e400",
    textColor: "#000",
    description: "Air quality is satisfactory, and air pollution poses little or no risk.",
  },
  {
    min: 51,
    max: 100,
    label: "Moderate",
    color: "#ffff00",
    textColor: "#000",
    description:
      "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
  },
  {
    min: 101,
    max: 150,
    label: "Unhealthy for Sensitive Groups",
    color: "#ff7e00",
    textColor: "#000",
    description:
      "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
  },
  {
    min: 151,
    max: 200,
    label: "Unhealthy",
    color: "#ff0000",
    textColor: "#fff",
    description:
      "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
  },
  {
    min: 201,
    max: 300,
    label: "Very Unhealthy",
    color: "#8f3f97",
    textColor: "#fff",
    description: "Health alert: The risk of health effects is increased for everyone.",
  },
  {
    min: 301,
    max: 9999,
    label: "Hazardous",
    color: "#7e0023",
    textColor: "#fff",
    description:
      "Health warning of emergency conditions: everyone is more likely to be affected.",
  },
];

export const DEFAULT_THRESHOLDS = {
  aqi: 150,
  pm25: 35.4,
  pm10: 154.0,
  no2: 100.0,
  o3: 100.0,
  so2: 75.0,
  co: 10000.0,
};

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const POLL_INTERVAL = 300000; // 5 minutes in milliseconds

export const POLLUTANT_UNITS = {
  pm25: "µg/m³",
  pm10: "µg/m³",
  co: "µg/m³",
  no2: "µg/m³",
  o3: "µg/m³",
  so2: "µg/m³",
};

export const POLLUTANT_LABELS = {
  pm25: "PM2.5",
  pm10: "PM10",
  co: "CO",
  no2: "NO₂",
  o3: "O₃",
  so2: "SO₂",
};
