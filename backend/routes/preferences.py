from flask import Blueprint, request, jsonify
from models.user_preferences import UserPreferences

preferences_bp = Blueprint("preferences", __name__)


@preferences_bp.route("/api/preferences", methods=["POST"])
def create_preferences():
    """Create or save user preferences."""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
    if not data.get("location"):
        return jsonify({"success": False, "error": "location is required"}), 400
    try:
        prefs = UserPreferences.create(data)
        return jsonify({"success": True, "data": prefs.to_dict()}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@preferences_bp.route("/api/preferences/<int:user_id>", methods=["GET"])
def get_preferences(user_id):
    """Get user preferences by ID."""
    prefs = UserPreferences.get_by_id(user_id)
    if prefs is None:
        return jsonify({"success": False, "error": "Preferences not found"}), 404
    return jsonify({"success": True, "data": prefs.to_dict()})


@preferences_bp.route("/api/preferences/<int:user_id>", methods=["PUT"])
def update_preferences(user_id):
    """Update user preferences."""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No data provided"}), 400
    existing = UserPreferences.get_by_id(user_id)
    if existing is None:
        return jsonify({"success": False, "error": "Preferences not found"}), 404
    try:
        updated = UserPreferences.update(user_id, data)
        return jsonify({"success": True, "data": updated.to_dict()})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@preferences_bp.route("/api/preferences/<int:user_id>", methods=["DELETE"])
def delete_preferences(user_id):
    """Delete user preferences."""
    existing = UserPreferences.get_by_id(user_id)
    if existing is None:
        return jsonify({"success": False, "error": "Preferences not found"}), 404
    try:
        UserPreferences.delete(user_id)
        return jsonify({"success": True, "message": "Preferences deleted"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
