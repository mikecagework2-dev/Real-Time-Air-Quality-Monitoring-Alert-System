/**
 * Request browser notification permission from the user.
 * Returns the permission state: "granted", "denied", or "default".
 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications.");
    return "unsupported";
  }
  if (Notification.permission === "granted") return "granted";
  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Send a browser notification.
 */
export function sendNotification(title, body, options = {}) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return null;
  }
  return new Notification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    ...options,
  });
}

/**
 * Check AQI against threshold and fire a notification if exceeded.
 */
export function checkAndNotify(aqi, location, threshold = 150) {
  if (aqi >= threshold) {
    return sendNotification(
      `⚠️ Air Quality Alert – ${location}`,
      `AQI is ${aqi}, which has exceeded your threshold of ${threshold}. Take precautions.`,
      { tag: `aqi-alert-${location}`, renotify: true }
    );
  }
  return null;
}

/**
 * Return a human-readable string for the current notification permission state.
 */
export function getPermissionStatus() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}
