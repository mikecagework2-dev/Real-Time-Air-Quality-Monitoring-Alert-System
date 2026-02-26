# 🌬️ Real-Time Air Quality Monitoring & Alert System

A full-stack web application that provides real-time air quality monitoring, health recommendations, customizable alerts, and historical trend visualization for any city worldwide.

---

## ✨ Features

- **Live AQI Data** – Fetches current Air Quality Index and pollutant breakdowns (PM2.5, PM10, CO, NO₂, O₃, SO₂) from OpenWeatherMap.
- **Color-Coded AQI Display** – Instant visual feedback using the standard AQI color scale.
- **Health Recommendations** – Tailored activity and safety advice based on current AQI levels.
- **Trend Charts** – Interactive Chart.js line graphs showing the last 24 hours of data per pollutant.
- **Location Comparison** – Side-by-side comparison of air quality across multiple cities.
- **Custom Alert Thresholds** – Set per-pollutant and AQI thresholds; receive email alerts when exceeded.
- **Browser Notifications** – Native Web Notifications API integration for in-browser alerts.
- **Email Alerts** – Automated email alerts via Flask-Mail when thresholds are breached.
- **Auto-Refresh** – Dashboard auto-refreshes every 5 minutes.
- **Responsive Design** – Clean dark-themed UI that works on desktop and mobile.

---

## 🏗️ Architecture

```
├── backend/          # Python Flask REST API
│   ├── app.py        # Application entry point
│   ├── config.py     # Configuration management
│   ├── models/       # Data models (SQLite via sqlite3)
│   ├── routes/       # API route blueprints
│   ├── services/     # Business logic (API, alerts, recommendations)
│   └── database/     # DB initialization and helpers
└── frontend/         # React 18 SPA
    └── src/
        ├── components/  # React components
        ├── services/    # API client and notifications
        └── utils/       # Constants and helpers
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- An [OpenWeatherMap API key](https://openweathermap.org/api) (free tier works)

---

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp ../.env.example .env
# Edit .env and add your OPENWEATHER_API_KEY

# Run the Flask server
python app.py
```

The API will be available at `http://localhost:5000`.

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional – defaults to localhost:5000)
cp .env.example .env

# Start the development server
npm start
```

The app will open at `http://localhost:3000`.

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key | *(required for data)* |
| `MAIL_SERVER` | SMTP server hostname | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP server port | `587` |
| `MAIL_USERNAME` | SMTP login email | |
| `MAIL_PASSWORD` | SMTP password / app password | |
| `DATABASE_URL` | SQLite connection string | `sqlite:///database/air_quality.db` |
| `SECRET_KEY` | Flask secret key | `dev-secret-key-change-in-production` |
| `DEBUG` | Enable Flask debug mode | `True` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## 📡 API Reference

### Air Quality

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/air-quality/<location>` | Fetch current air quality for a location |
| `GET` | `/api/air-quality/<location>/history` | Get last 24 hours of stored data |
| `GET` | `/api/health` | Health check |

### Preferences

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/preferences` | Create user preferences |
| `GET` | `/api/preferences/<id>` | Get preferences by ID |
| `PUT` | `/api/preferences/<id>` | Update preferences |
| `DELETE` | `/api/preferences/<id>` | Delete preferences |

### Alerts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/alerts/thresholds` | Get default alert thresholds |
| `POST` | `/api/alerts/test` | Send a test email alert |
| `POST` | `/api/alerts/check` | Manually trigger an alert check |

---

## 📊 AQI Scale

| AQI Range | Level | Color |
|---|---|---|
| 0–50 | Good | 🟢 Green |
| 51–100 | Moderate | 🟡 Yellow |
| 101–150 | Unhealthy for Sensitive Groups | 🟠 Orange |
| 151–200 | Unhealthy | 🔴 Red |
| 201–300 | Very Unhealthy | 🟣 Purple |
| 301+ | Hazardous | 🔴 Maroon |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask, Flask-CORS, Flask-Mail, APScheduler |
| Database | SQLite (via Python sqlite3) |
| Frontend | React 18, React Router v6 |
| Charts | Chart.js, react-chartjs-2 |
| HTTP Client | axios |
| Air Quality Data | OpenWeatherMap Air Pollution API |

---

## 📁 Project Structure

```
Real-Time-Air-Quality-Monitoring-Alert-System/
├── backend/
│   ├── app.py                    # Flask app, scheduler, blueprints
│   ├── config.py                 # Environment config
│   ├── requirements.txt
│   ├── models/
│   │   ├── user_preferences.py   # User preferences model + DB ops
│   │   └── air_quality_data.py   # Air quality data model + DB ops
│   ├── routes/
│   │   ├── air_quality.py        # /api/air-quality routes
│   │   ├── preferences.py        # /api/preferences routes
│   │   └── alerts.py             # /api/alerts routes
│   ├── services/
│   │   ├── api_service.py        # OpenWeatherMap API integration
│   │   ├── alert_service.py      # Threshold checking + email alerts
│   │   └── recommendation_service.py  # AQI-based health advice
│   └── database/
│       └── db_setup.py           # SQLite schema initialization
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── App.js                # Router + navbar
│   │   ├── App.css               # Global dark-theme styles
│   │   ├── index.js
│   │   ├── components/
│   │   │   ├── Dashboard.js      # Main dashboard with auto-refresh
│   │   │   ├── LocationInput.js  # City search + geolocation
│   │   │   ├── AirQualityCard.js # AQI display card
│   │   │   ├── TrendChart.js     # 24h trend chart
│   │   │   ├── AlertSettings.js  # Alert threshold configuration
│   │   │   ├── Comparison.js     # Multi-city comparison
│   │   │   ├── Recommendations.js # Health recommendations
│   │   │   └── Notifications.js  # Browser notification management
│   │   ├── services/
│   │   │   ├── api.js            # axios API client
│   │   │   └── notifications.js  # Web Notifications API wrapper
│   │   └── utils/
│   │       ├── constants.js      # AQI levels, thresholds, config
│   │       └── helpers.js        # Formatting utilities
│   ├── package.json
│   └── .env.example
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔒 Notes

- The backend starts successfully even without an API key configured – API calls will return a descriptive error until a key is provided.
- Email alerts require a valid SMTP configuration (Gmail with App Passwords works well).
- Historical data is only available for locations that have been searched at least once while the backend is running.
- For production, set `DEBUG=False` and use a strong `SECRET_KEY`.
