import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'football.db')}",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FOOTBALL_DATA_API_KEY = os.environ.get("FOOTBALL_DATA_API_KEY", "")
    FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4"
