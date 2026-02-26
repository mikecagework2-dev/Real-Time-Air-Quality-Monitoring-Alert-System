from database.db_setup import get_db_connection
from datetime import datetime


class AirQualityData:
    def __init__(self, id=None, location="", aqi=0, pm25=0.0, pm10=0.0,
                 co=0.0, no2=0.0, o3=0.0, so2=0.0, timestamp=None):
        self.id = id
        self.location = location
        self.aqi = aqi
        self.pm25 = pm25
        self.pm10 = pm10
        self.co = co
        self.no2 = no2
        self.o3 = o3
        self.so2 = so2
        self.timestamp = timestamp or datetime.utcnow().isoformat()

    def to_dict(self):
        return {
            "id": self.id,
            "location": self.location,
            "aqi": self.aqi,
            "pm25": self.pm25,
            "pm10": self.pm10,
            "co": self.co,
            "no2": self.no2,
            "o3": self.o3,
            "so2": self.so2,
            "timestamp": self.timestamp,
        }

    @classmethod
    def from_row(cls, row):
        if row is None:
            return None
        return cls(
            id=row["id"],
            location=row["location"],
            aqi=row["aqi"],
            pm25=row["pm25"],
            pm10=row["pm10"],
            co=row["co"],
            no2=row["no2"],
            o3=row["o3"],
            so2=row["so2"],
            timestamp=row["timestamp"],
        )

    @classmethod
    def save(cls, location, data):
        conn = get_db_connection()
        now = datetime.utcnow().isoformat()
        cursor = conn.execute(
            """INSERT INTO air_quality_data
               (location, aqi, pm25, pm10, co, no2, o3, so2, timestamp)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                location,
                data.get("aqi", 0),
                data.get("pm25", 0.0),
                data.get("pm10", 0.0),
                data.get("co", 0.0),
                data.get("no2", 0.0),
                data.get("o3", 0.0),
                data.get("so2", 0.0),
                now,
            ),
        )
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return new_id

    @classmethod
    def get_history(cls, location, hours=24):
        conn = get_db_connection()
        rows = conn.execute(
            """SELECT * FROM air_quality_data
               WHERE location LIKE ?
               AND timestamp >= datetime('now', ?)
               ORDER BY timestamp ASC""",
            (f"%{location}%", f"-{hours} hours"),
        ).fetchall()
        conn.close()
        return [cls.from_row(r).to_dict() for r in rows]

    @classmethod
    def get_latest(cls, location):
        conn = get_db_connection()
        row = conn.execute(
            """SELECT * FROM air_quality_data
               WHERE location LIKE ?
               ORDER BY timestamp DESC LIMIT 1""",
            (f"%{location}%",),
        ).fetchone()
        conn.close()
        return cls.from_row(row)
