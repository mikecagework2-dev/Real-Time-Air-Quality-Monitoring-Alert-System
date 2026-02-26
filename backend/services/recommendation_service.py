AQI_LEVELS = [
    {"min": 0,   "max": 50,  "label": "Good",                          "color": "#00e400"},
    {"min": 51,  "max": 100, "label": "Moderate",                      "color": "#ffff00"},
    {"min": 101, "max": 150, "label": "Unhealthy for Sensitive Groups", "color": "#ff7e00"},
    {"min": 151, "max": 200, "label": "Unhealthy",                     "color": "#ff0000"},
    {"min": 201, "max": 300, "label": "Very Unhealthy",                "color": "#8f3f97"},
    {"min": 301, "max": 9999,"label": "Hazardous",                     "color": "#7e0023"},
]

RECOMMENDATIONS = {
    "Good": "Air quality is satisfactory. Enjoy outdoor activities.",
    "Moderate": "Acceptable for most people. Sensitive groups should consider reducing prolonged outdoor exertion.",
    "Unhealthy for Sensitive Groups": "Sensitive groups should limit outdoor activities.",
    "Unhealthy": "Everyone should wear a mask and limit outdoor exposure.",
    "Very Unhealthy": "Stay indoors as much as possible. Wear N95 masks if outdoors.",
    "Hazardous": "Health alert: avoid all outdoor activities. Keep windows and doors closed.",
}


def get_aqi_level(aqi):
    """Return label and color for the given AQI value."""
    for level in AQI_LEVELS:
        if level["min"] <= aqi <= level["max"]:
            return {"label": level["label"], "color": level["color"]}
    return {"label": "Hazardous", "color": "#7e0023"}


def get_recommendations(aqi):
    """Return health recommendations based on AQI."""
    level = get_aqi_level(aqi)
    label = level["label"]
    recommendation = RECOMMENDATIONS.get(label, "Check local guidelines.")
    activities = _get_activity_suggestions(label)
    return {
        "level": label,
        "color": level["color"],
        "recommendation": recommendation,
        "activities": activities,
    }


def _get_activity_suggestions(label):
    suggestions = {
        "Good": [
            "Great day for a run or bike ride.",
            "Open windows to ventilate your home.",
            "Outdoor sports and picnics are fine.",
        ],
        "Moderate": [
            "Light outdoor activities are okay for most people.",
            "Sensitive individuals should keep activity short.",
            "Consider wearing a mask if you have allergies.",
        ],
        "Unhealthy for Sensitive Groups": [
            "Children and elderly should stay indoors.",
            "Asthmatics should carry their inhaler.",
            "Avoid strenuous outdoor exercise.",
        ],
        "Unhealthy": [
            "Wear a surgical mask or N95 outdoors.",
            "Limit time outside to essential trips only.",
            "Keep indoor air clean with air purifiers.",
        ],
        "Very Unhealthy": [
            "Stay indoors with windows closed.",
            "Use an N95 mask if you must go outside.",
            "Run air purifiers on high inside.",
        ],
        "Hazardous": [
            "Do NOT go outdoors.",
            "Seal gaps around doors and windows.",
            "Contact local health authorities for guidance.",
        ],
    }
    return suggestions.get(label, [])
