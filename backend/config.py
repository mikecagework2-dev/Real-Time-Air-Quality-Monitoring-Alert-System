import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY", "")
    MAIL_SERVER = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME", "")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD", "")
    DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///database/air_quality.db")
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key-change-in-production")
    DEBUG = os.environ.get("DEBUG", "True").lower() in ("true", "1", "yes")

    # Derive the SQLite file path from DATABASE_URL
    @staticmethod
    def get_db_path():
        db_url = os.environ.get("DATABASE_URL", "sqlite:///database/air_quality.db")
        if db_url.startswith("sqlite:///"):
            relative = db_url[len("sqlite:///"):]
            base_dir = os.path.dirname(os.path.abspath(__file__))
            return os.path.join(base_dir, relative)
        return db_url
