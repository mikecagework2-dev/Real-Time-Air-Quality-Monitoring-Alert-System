import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { POLLUTANT_LABELS, POLLUTANT_UNITS } from "../utils/constants";
import { getAQIColor } from "../utils/helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const POLLUTANT_KEYS = ["aqi", "pm25", "pm10", "co", "no2", "o3", "so2"];

export default function TrendChart({ history }) {
  const [activePollutant, setActivePollutant] = useState("aqi");

  if (!history || history.length === 0) {
    return (
      <div className="trend-chart-container">
        <h3>Air Quality Trend</h3>
        <p className="no-data">No historical data available yet. Data is stored as you search.</p>
      </div>
    );
  }

  const labels = history.map((item) => {
    const date = new Date(item.timestamp + (item.timestamp.endsWith("Z") ? "" : "Z"));
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  const values = history.map((item) => item[activePollutant] ?? 0);
  const borderColor = activePollutant === "aqi"
    ? "#4fc3f7"
    : "#81c784";

  const chartData = {
    labels,
    datasets: [
      {
        label:
          activePollutant === "aqi"
            ? "AQI"
            : `${POLLUTANT_LABELS[activePollutant]} (${POLLUTANT_UNITS[activePollutant]})`,
        data: values,
        borderColor,
        backgroundColor: borderColor + "33",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#e0e0e0" },
      },
      title: {
        display: true,
        text: "Air Quality Trend (Last 24 Hours)",
        color: "#e0e0e0",
      },
    },
    scales: {
      x: {
        ticks: { color: "#aaa", maxTicksLimit: 12 },
        grid: { color: "#333" },
      },
      y: {
        ticks: { color: "#aaa" },
        grid: { color: "#333" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="trend-chart-container">
      <div className="chart-controls">
        {POLLUTANT_KEYS.map((key) => (
          <button
            key={key}
            className={`chart-btn ${activePollutant === key ? "active" : ""}`}
            onClick={() => setActivePollutant(key)}
          >
            {key === "aqi" ? "AQI" : POLLUTANT_LABELS[key]}
          </button>
        ))}
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}
