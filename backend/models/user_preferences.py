from database.db_setup import get_db_connection
from datetime import datetime


class UserPreferences:
    def __init__(self, id=None, location="", email="", alert_threshold=150,
                 pm25_threshold=35.4, pm10_threshold=154.0,
                 no2_threshold=100.0, o3_threshold=100.0,
                 email_enabled=False, created_at=None, updated_at=None):
        self.id = id
        self.location = location
        self.email = email
        self.alert_threshold = alert_threshold
        self.pm25_threshold = pm25_threshold
        self.pm10_threshold = pm10_threshold
        self.no2_threshold = no2_threshold
        self.o3_threshold = o3_threshold
        self.email_enabled = email_enabled
        self.created_at = created_at or datetime.utcnow().isoformat()
        self.updated_at = updated_at or datetime.utcnow().isoformat()

    def to_dict(self):
        return {
            "id": self.id,
            "location": self.location,
            "email": self.email,
            "alert_threshold": self.alert_threshold,
            "pm25_threshold": self.pm25_threshold,
            "pm10_threshold": self.pm10_threshold,
            "no2_threshold": self.no2_threshold,
            "o3_threshold": self.o3_threshold,
            "email_enabled": bool(self.email_enabled),
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_row(cls, row):
        if row is None:
            return None
        return cls(
            id=row["id"],
            location=row["location"],
            email=row["email"],
            alert_threshold=row["alert_threshold"],
            pm25_threshold=row["pm25_threshold"],
            pm10_threshold=row["pm10_threshold"],
            no2_threshold=row["no2_threshold"],
            o3_threshold=row["o3_threshold"],
            email_enabled=bool(row["email_enabled"]),
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )

    @classmethod
    def get_by_id(cls, user_id):
        conn = get_db_connection()
        row = conn.execute(
            "SELECT * FROM user_preferences WHERE id = ?", (user_id,)
        ).fetchone()
        conn.close()
        return cls.from_row(row)

    @classmethod
    def create(cls, data):
        conn = get_db_connection()
        now = datetime.utcnow().isoformat()
        cursor = conn.execute(
            """INSERT INTO user_preferences
               (location, email, alert_threshold, pm25_threshold, pm10_threshold,
                no2_threshold, o3_threshold, email_enabled, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                data.get("location", ""),
                data.get("email", ""),
                data.get("alert_threshold", 150),
                data.get("pm25_threshold", 35.4),
                data.get("pm10_threshold", 154.0),
                data.get("no2_threshold", 100.0),
                data.get("o3_threshold", 100.0),
                1 if data.get("email_enabled", False) else 0,
                now,
                now,
            ),
        )
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return cls.get_by_id(new_id)

    @classmethod
    def update(cls, user_id, data):
        conn = get_db_connection()
        now = datetime.utcnow().isoformat()
        conn.execute(
            """UPDATE user_preferences SET
               location = COALESCE(?, location),
               email = COALESCE(?, email),
               alert_threshold = COALESCE(?, alert_threshold),
               pm25_threshold = COALESCE(?, pm25_threshold),
               pm10_threshold = COALESCE(?, pm10_threshold),
               no2_threshold = COALESCE(?, no2_threshold),
               o3_threshold = COALESCE(?, o3_threshold),
               email_enabled = COALESCE(?, email_enabled),
               updated_at = ?
               WHERE id = ?""",
            (
                data.get("location"),
                data.get("email"),
                data.get("alert_threshold"),
                data.get("pm25_threshold"),
                data.get("pm10_threshold"),
                data.get("no2_threshold"),
                data.get("o3_threshold"),
                1 if data.get("email_enabled") else (0 if "email_enabled" in data else None),
                now,
                user_id,
            ),
        )
        conn.commit()
        conn.close()
        return cls.get_by_id(user_id)

    @classmethod
    def delete(cls, user_id):
        conn = get_db_connection()
        conn.execute("DELETE FROM user_preferences WHERE id = ?", (user_id,))
        conn.commit()
        conn.close()
