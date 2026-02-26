from flask import Blueprint, request, jsonify
from services.alert_service import check_and_send_alerts, send_email_alert

alerts_bp = Blueprint("alerts", __name__)

DEFAULT_THRESHOLDS = {
    "aqi": 150,
    "pm25": 35.4,
    "pm10": 154.0,
    "no2": 100.0,
    "o3": 100.0,
    "so2": 75.0,
    "co": 10000.0,
}


@alerts_bp.route("/api/alerts/thresholds", methods=["GET"])
def get_default_thresholds():
    """Return default alert thresholds."""
    return jsonify({"success": True, "thresholds": DEFAULT_THRESHOLDS})


@alerts_bp.route("/api/alerts/test", methods=["POST"])
def test_alert():
    """Send a test alert email."""
    data = request.get_json() or {}
    email = data.get("email")
    if not email:
        return jsonify({"success": False, "error": "email is required"}), 400
    try:
        send_email_alert(
            email,
            location=data.get("location", "Test City"),
            aqi=data.get("aqi", 175),
            data={
                "pm25": 55.5,
                "pm10": 120.0,
                "co": 400.0,
                "no2": 45.0,
                "o3": 80.0,
                "so2": 10.0,
            },
        )
        return jsonify({"success": True, "message": f"Test alert sent to {email}"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@alerts_bp.route("/api/alerts/check", methods=["POST"])
def manual_check():
    """Manually trigger alert check for a location."""
    data = request.get_json() or {}
    location = data.get("location")
    if not location:
        return jsonify({"success": False, "error": "location is required"}), 400
    try:
        from services.api_service import fetch_air_quality
        air_data = fetch_air_quality(location)
        alerts_sent = check_and_send_alerts(location, air_data)
        return jsonify({
            "success": True,
            "data": air_data,
            "alerts_sent": len(alerts_sent),
            "recipients": alerts_sent,
        })
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
