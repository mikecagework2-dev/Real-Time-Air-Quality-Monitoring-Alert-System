from flask_mail import Message
from services.recommendation_service import get_aqi_level

# mail instance is set by app.py after initialization
mail = None


def init_alert_service(mail_instance):
    global mail
    mail = mail_instance


def check_and_send_alerts(location, data, preferences_list=None):
    """Check AQI thresholds and send alerts for matching user preferences."""
    from models.user_preferences import UserPreferences
    from database.db_setup import get_db_connection

    aqi = data.get("aqi", 0)

    conn = get_db_connection()
    rows = conn.execute(
        "SELECT * FROM user_preferences WHERE location LIKE ?",
        (f"%{location}%",),
    ).fetchall()
    conn.close()

    alerts_sent = []
    for row in rows:
        threshold = row["alert_threshold"] or 150
        email_enabled = bool(row["email_enabled"])
        email = row["email"]

        if aqi >= threshold and email_enabled and email:
            try:
                send_email_alert(email, location, aqi, data)
                alerts_sent.append(email)
            except Exception as e:
                print(f"Failed to send alert to {email}: {e}")

        # Check individual pollutant thresholds
        pollutant_alerts = []
        if row["pm25_threshold"] and data.get("pm25", 0) >= row["pm25_threshold"]:
            pollutant_alerts.append(f"PM2.5: {data['pm25']} µg/m³ (threshold: {row['pm25_threshold']})")
        if row["pm10_threshold"] and data.get("pm10", 0) >= row["pm10_threshold"]:
            pollutant_alerts.append(f"PM10: {data['pm10']} µg/m³ (threshold: {row['pm10_threshold']})")
        if row["no2_threshold"] and data.get("no2", 0) >= row["no2_threshold"]:
            pollutant_alerts.append(f"NO₂: {data['no2']} µg/m³ (threshold: {row['no2_threshold']})")
        if row["o3_threshold"] and data.get("o3", 0) >= row["o3_threshold"]:
            pollutant_alerts.append(f"O₃: {data['o3']} µg/m³ (threshold: {row['o3_threshold']})")

        # Send pollutant-specific alert independently of the AQI alert.
        # Both alert types are evaluated and sent when applicable so users
        # receive complete information about every exceeded threshold.
        if pollutant_alerts and email_enabled and email:
            try:
                _send_pollutant_alert(email, location, pollutant_alerts)
                alerts_sent.append(email)
            except Exception as e:
                print(f"Failed to send pollutant alert to {email}: {e}")

    return alerts_sent


def send_email_alert(email, location, aqi, data):
    """Send an AQI threshold exceeded email alert."""
    if mail is None:
        raise RuntimeError("Mail service not initialized.")
    level = get_aqi_level(aqi)
    subject = f"⚠️ Air Quality Alert for {location} – AQI {aqi} ({level['label']})"
    body = f"""Air Quality Alert

Location: {location}
AQI: {aqi} – {level['label']}

Pollutant Breakdown:
  PM2.5 : {data.get('pm25', 'N/A')} µg/m³
  PM10  : {data.get('pm10', 'N/A')} µg/m³
  CO    : {data.get('co', 'N/A')} µg/m³
  NO₂   : {data.get('no2', 'N/A')} µg/m³
  O₃    : {data.get('o3', 'N/A')} µg/m³
  SO₂   : {data.get('so2', 'N/A')} µg/m³

Please take necessary precautions.

-- Air Quality Monitor
"""
    msg = Message(subject=subject, recipients=[email], body=body)
    mail.send(msg)


def _send_pollutant_alert(email, location, pollutant_alerts):
    """Send a pollutant-specific threshold exceeded email alert."""
    if mail is None:
        raise RuntimeError("Mail service not initialized.")
    subject = f"⚠️ Pollutant Alert for {location}"
    body = "The following pollutants have exceeded your thresholds:\n\n"
    body += "\n".join(f"  • {a}" for a in pollutant_alerts)
    body += "\n\n-- Air Quality Monitor\n"
    msg = Message(subject=subject, recipients=[email], body=body)
    mail.send(msg)
