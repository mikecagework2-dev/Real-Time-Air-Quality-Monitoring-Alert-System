import requests
from config import Config
from models.air_quality_data import AirQualityData


GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/direct"
AIR_POLLUTION_URL = "http://api.openweathermap.org/data/2.5/air_pollution"


def _get_coordinates(location):
    """Resolve city name to (lat, lon) using OpenWeatherMap Geocoding API."""
    api_key = Config.OPENWEATHER_API_KEY
    if not api_key:
        raise ValueError("OPENWEATHER_API_KEY is not configured.")
    response = requests.get(
        GEOCODING_URL,
        params={"q": location, "limit": 1, "appid": api_key},
        timeout=10,
    )
    response.raise_for_status()
    results = response.json()
    if not results:
        raise ValueError(f"Location '{location}' not found.")
    return results[0]["lat"], results[0]["lon"], results[0].get("name", location)


def _parse_air_quality(data, location_name):
    """Parse OpenWeatherMap Air Pollution API response into a clean dict."""
    item = data["list"][0]
    components = item.get("components", {})
    aqi_index = item["main"]["aqi"]  # 1-5 scale from OWM

    # Map OWM AQI (1-5) to US AQI approximation
    aqi_map = {1: 25, 2: 75, 3: 125, 4: 175, 5: 250}
    aqi = aqi_map.get(aqi_index, aqi_index * 50)

    return {
        "aqi": aqi,
        "aqi_index": aqi_index,
        "pm25": round(components.get("pm2_5", 0.0), 2),
        "pm10": round(components.get("pm10", 0.0), 2),
        "co": round(components.get("co", 0.0), 2),
        "no2": round(components.get("no2", 0.0), 2),
        "o3": round(components.get("o3", 0.0), 2),
        "so2": round(components.get("so2", 0.0), 2),
        "location": location_name,
    }


def fetch_air_quality(location):
    """Fetch current air quality for a location name."""
    lat, lon, location_name = _get_coordinates(location)
    api_key = Config.OPENWEATHER_API_KEY
    response = requests.get(
        AIR_POLLUTION_URL,
        params={"lat": lat, "lon": lon, "appid": api_key},
        timeout=10,
    )
    response.raise_for_status()
    parsed = _parse_air_quality(response.json(), location_name)
    store_air_quality_data(location_name, parsed)
    return parsed


def fetch_air_quality_history(location):
    """Return last 24 hours of stored air quality data for a location."""
    return AirQualityData.get_history(location, hours=24)


def store_air_quality_data(location, data):
    """Persist air quality data to the database."""
    AirQualityData.save(location, data)
