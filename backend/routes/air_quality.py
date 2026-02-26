from flask import Blueprint, jsonify
from services.api_service import fetch_air_quality, fetch_air_quality_history
from services.recommendation_service import get_recommendations

air_quality_bp = Blueprint("air_quality", __name__)


@air_quality_bp.route("/api/air-quality/<path:location>", methods=["GET"])
def get_air_quality(location):
    """Fetch current air quality for a location."""
    try:
        data = fetch_air_quality(location)
        recommendations = get_recommendations(data["aqi"])
        return jsonify({"success": True, "data": data, "recommendations": recommendations})
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 404
    except Exception as e:
        return jsonify({"success": False, "error": f"Failed to fetch air quality: {str(e)}"}), 500


@air_quality_bp.route("/api/air-quality/<path:location>/history", methods=["GET"])
def get_air_quality_history(location):
    """Return historical air quality data for a location."""
    try:
        history = fetch_air_quality_history(location)
        return jsonify({"success": True, "data": history, "location": location})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
