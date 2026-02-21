"""CLI script for importing data from football-data.org.

Usage:
    cd backend
    python -m scripts.ingest --competitions PL
    python -m scripts.ingest --competitions PL,SA,BL1 --season 2024
"""

import argparse
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv()

from app import create_app
from app.services.football_data_client import FootballDataClient
from app.services.ingestion import IngestionService

# Competitions available on the football-data.org free tier
FREE_TIER_COMPETITIONS = {
    "PL": "Premier League",
    "BL1": "Bundesliga",
    "SA": "Serie A",
    "PD": "Primera Division",
    "FL1": "Ligue 1",
    "DED": "Eredivisie",
    "PPL": "Primeira Liga",
    "ELC": "Championship",
    "CL": "UEFA Champions League",
    "EC": "European Championship",
    "WC": "FIFA World Cup",
    "BSA": "Campeonato Brasileiro Série A",
    "CLI": "Copa Libertadores",
}


def main():
    parser = argparse.ArgumentParser(description="Import football data")
    parser.add_argument(
        "--competitions",
        required=True,
        help=(
            "Comma-separated competition codes. Free tier supports: "
            + ", ".join(FREE_TIER_COMPETITIONS)
        ),
    )
    parser.add_argument("--season", type=int, help="Season start year (e.g. 2024)")
    args = parser.parse_args()

    app = create_app()
    with app.app_context():
        api_key = app.config["FOOTBALL_DATA_API_KEY"]
        if not api_key:
            print("Error: FOOTBALL_DATA_API_KEY not set.")
            print("Set it as an environment variable or in a .env file.")
            sys.exit(1)

        client = FootballDataClient(api_key, app.config["FOOTBALL_DATA_BASE_URL"])
        service = IngestionService(client)

        codes = [c.strip().upper() for c in args.competitions.split(",")]
        for code in codes:
            if code not in FREE_TIER_COMPETITIONS:
                print(
                    f"Skipping {code}: not available on the free tier. "
                    f"Supported codes: {', '.join(FREE_TIER_COMPETITIONS)}"
                )
                continue
            try:
                service.sync_competition(code, args.season)
            except Exception as e:
                print(f"Error syncing {code}: {e}")


if __name__ == "__main__":
    main()
