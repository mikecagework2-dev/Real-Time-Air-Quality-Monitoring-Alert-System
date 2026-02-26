import React, { useState, useEffect } from "react";
import {
  requestNotificationPermission,
  sendNotification,
  getPermissionStatus,
} from "../services/notifications";

export default function Notifications() {
  const [permission, setPermission] = useState(getPermissionStatus());
  const [history, setHistory] = useState([]);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    setPermission(getPermissionStatus());
  }, []);

  async function handleRequestPermission() {
    const result = await requestNotificationPermission();
    setPermission(result);
  }

  function handleTestNotification() {
    const n = sendNotification(
      "🌿 Test Notification",
      "Air Quality Monitor notifications are working correctly!",
      { tag: "test-notification" }
    );
    if (n) {
      const entry = {
        id: Date.now(),
        title: "🌿 Test Notification",
        body: "Air Quality Monitor notifications are working correctly!",
        time: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => [entry, ...prev.slice(0, 19)]);
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  }

  const statusMap = {
    granted: { label: "✅ Granted", className: "status-granted" },
    denied: { label: "❌ Denied", className: "status-denied" },
    default: { label: "⏳ Not yet requested", className: "status-default" },
    unsupported: { label: "🚫 Not supported by your browser", className: "status-denied" },
  };

  const status = statusMap[permission] || statusMap.default;

  return (
    <div className="notifications-container">
      <h2>🔔 Browser Notifications</h2>

      <div className="notification-status-card">
        <h3>Permission Status</h3>
        <span className={`permission-badge ${status.className}`}>{status.label}</span>

        {permission !== "granted" && permission !== "unsupported" && (
          <button className="btn btn-primary" onClick={handleRequestPermission}>
            Request Permission
          </button>
        )}

        {permission === "granted" && (
          <button className="btn btn-secondary" onClick={handleTestNotification}>
            {testSent ? "✅ Sent!" : "🔔 Send Test Notification"}
          </button>
        )}

        {permission === "denied" && (
          <p className="info-text">
            Notifications are blocked. Please allow notifications in your browser settings and
            refresh the page.
          </p>
        )}
      </div>

      <div className="notification-info">
        <h3>How Notifications Work</h3>
        <ul>
          <li>Notifications trigger automatically when AQI exceeds your threshold.</li>
          <li>The dashboard checks air quality every 5 minutes.</li>
          <li>Set custom thresholds in the <strong>Alert Settings</strong> page.</li>
        </ul>
      </div>

      {history.length > 0 && (
        <div className="notification-history">
          <h3>Recent Notifications (this session)</h3>
          <ul>
            {history.map((item) => (
              <li key={item.id} className="notif-history-item">
                <span className="notif-time">{item.time}</span>
                <span className="notif-title">{item.title}</span>
                <span className="notif-body">{item.body}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
