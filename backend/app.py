import sys
import os

# Ensure the backend directory is on the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_mail import Mail
from apscheduler.schedulers.background import BackgroundScheduler

from config import Config
from database.db_setup import init_db
from routes.air_quality import air_quality_bp
from routes.preferences import preferences_bp
from routes.alerts import alerts_bp
import services.alert_service as alert_svc

app = Flask(__name__)
app.config.from_object(Config)

# Configure Flask-Mail
app.config.update(
    MAIL_SERVER=Config.MAIL_SERVER,
    MAIL_PORT=Config.MAIL_PORT,
    MAIL_USE_TLS=True,
    MAIL_USERNAME=Config.MAIL_USERNAME,
    MAIL_PASSWORD=Config.MAIL_PASSWORD,
    MAIL_DEFAULT_SENDER=Config.MAIL_USERNAME or "noreply@airqualitymonitor.local",
)

CORS(app, resources={r"/api/*": {"origins": "*"}})

mail = Mail(app)
alert_svc.init_alert_service(mail)

# Register blueprints
app.register_blueprint(air_quality_bp)
app.register_blueprint(preferences_bp)
app.register_blueprint(alerts_bp)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Air Quality Monitor API is running."})


def scheduled_alert_check():
    """Background job: fetch data for all tracked locations and send alerts."""
    from database.db_setup import get_db_connection
    from services.api_service import fetch_air_quality
    from services.alert_service import check_and_send_alerts

    conn = get_db_connection()
    rows = conn.execute("SELECT DISTINCT location FROM user_preferences").fetchall()
    conn.close()

    for row in rows:
        location = row["location"]
        try:
            data = fetch_air_quality(location)
            check_and_send_alerts(location, data)
        except Exception as e:
            print(f"Scheduled check failed for {location}: {e}")


def create_app():
    init_db()

    if Config.OPENWEATHER_API_KEY:
        scheduler = BackgroundScheduler()
        scheduler.add_job(scheduled_alert_check, "interval", minutes=5, id="alert_check")
        scheduler.start()
        print("Background scheduler started (every 5 minutes).")
    else:
        print(
            "WARNING: OPENWEATHER_API_KEY not set. "
            "API calls will fail until a key is provided in .env"
        )

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(host="0.0.0.0", port=5000, debug=Config.DEBUG)
