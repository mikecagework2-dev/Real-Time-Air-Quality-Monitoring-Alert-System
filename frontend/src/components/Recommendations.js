import React from "react";

export default function Recommendations({ recommendations }) {
  if (!recommendations) return null;

  const { level, color, recommendation, activities } = recommendations;

  return (
    <div className="recommendations-container">
      <h3>🩺 Health Recommendations</h3>
      <div
        className="recommendation-banner"
        style={{ borderLeftColor: color, backgroundColor: color + "22" }}
      >
        <span className="rec-level" style={{ color }}>
          {level}
        </span>
        <p className="rec-text">{recommendation}</p>
      </div>

      {activities && activities.length > 0 && (
        <div className="activity-suggestions">
          <h4>Activity Suggestions</h4>
          <ul>
            {activities.map((activity, idx) => (
              <li key={idx}>{activity}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
