import requests
from app.utils.rate_limiter import RateLimiter


class FootballDataClient:
    """HTTP wrapper for the football-data.org v4 API."""

    def __init__(self, api_key: str, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({"X-Auth-Token": api_key})
        self.limiter = RateLimiter(max_calls=10, period=60)

    def _get(self, path: str, params: dict | None = None) -> dict:
        self.limiter.wait()
        url = f"{self.base_url}{path}"
        resp = self.session.get(url, params=params, timeout=30)
        resp.raise_for_status()
        return resp.json()

    def get_competitions(self) -> list[dict]:
        data = self._get("/competitions")
        return data.get("competitions", [])

    def get_competition(self, code: str) -> dict:
        return self._get(f"/competitions/{code}")

    def get_competition_teams(self, code: str, season: int | None = None) -> list[dict]:
        params = {}
        if season:
            params["season"] = season
        data = self._get(f"/competitions/{code}/teams", params or None)
        return data.get("teams", [])

    def get_competition_matches(
        self, code: str, season: int | None = None
    ) -> list[dict]:
        params = {}
        if season:
            params["season"] = season
        data = self._get(f"/competitions/{code}/matches", params or None)
        return data.get("matches", [])
