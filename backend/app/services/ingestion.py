from datetime import datetime, timezone
from app.extensions import db
from app.models import Competition, CompetitionTeam, Team, Match, HeadToHead
from app.services.football_data_client import FootballDataClient


class IngestionService:
    """Syncs data from football-data.org into the local database."""

    def __init__(self, client: FootballDataClient):
        self.client = client

    def sync_competition(self, code: str, season: int | None = None):
        print(f"Syncing competition {code}...")
        comp_data = self.client.get_competition(code)
        season_year = season or comp_data.get("currentSeason", {}).get("startDate", "")[:4]
        if isinstance(season_year, str) and season_year:
            season_year = int(season_year)

        comp = Competition.query.get(comp_data["id"])
        if not comp:
            comp = Competition(id=comp_data["id"])
        comp.name = comp_data["name"]
        comp.code = comp_data["code"]
        comp.area_name = comp_data.get("area", {}).get("name")
        comp.type = comp_data.get("type")
        comp.emblem_url = comp_data.get("emblem")
        comp.last_synced = datetime.now(timezone.utc)
        db.session.merge(comp)
        db.session.commit()

        self._sync_teams(comp.id, code, season_year)
        self._sync_matches(comp.id, code, season_year)
        self._rebuild_head_to_head(comp.id, season_year)
        print(f"Done syncing {code} (season {season_year}).")

    def _sync_teams(self, competition_id: int, code: str, season_year: int):
        print(f"  Syncing teams for {code}...")
        teams_data = self.client.get_competition_teams(code, season_year)
        for t in teams_data:
            team = Team.query.get(t["id"])
            if not team:
                team = Team(id=t["id"])
            team.name = t["name"]
            team.short_name = t.get("shortName")
            team.tla = t.get("tla")
            team.crest_url = t.get("crest")
            team.area_name = t.get("area", {}).get("name")
            db.session.merge(team)

            ct = CompetitionTeam.query.get((competition_id, t["id"], season_year))
            if not ct:
                db.session.add(
                    CompetitionTeam(
                        competition_id=competition_id,
                        team_id=t["id"],
                        season_year=season_year,
                    )
                )
        db.session.commit()
        print(f"  Synced {len(teams_data)} teams.")

    def _sync_matches(self, competition_id: int, code: str, season_year: int):
        print(f"  Syncing matches for {code}...")
        matches_data = self.client.get_competition_matches(code, season_year)
        count = 0
        for m in matches_data:
            if m.get("status") != "FINISHED":
                continue
            score = m.get("score", {})
            ft = score.get("fullTime", {})
            match = Match.query.get(m["id"])
            if not match:
                match = Match(id=m["id"])
            match.competition_id = competition_id
            match.season_year = season_year
            match.utc_date = datetime.fromisoformat(
                m["utcDate"].replace("Z", "+00:00")
            )
            match.home_team_id = m["homeTeam"]["id"]
            match.away_team_id = m["awayTeam"]["id"]
            match.home_score = ft.get("home")
            match.away_score = ft.get("away")
            match.winner = m.get("score", {}).get("winner")
            db.session.merge(match)
            count += 1
        db.session.commit()
        print(f"  Synced {count} finished matches.")

    def _rebuild_head_to_head(self, competition_id: int, season_year: int):
        print(f"  Rebuilding H2H for competition {competition_id}, season {season_year}...")
        HeadToHead.query.filter_by(
            competition_id=competition_id, season_year=season_year
        ).delete()
        db.session.commit()

        matches = Match.query.filter_by(
            competition_id=competition_id, season_year=season_year
        ).all()

        h2h_map: dict[tuple, dict] = {}
        for m in matches:
            if m.home_score is None or m.away_score is None:
                continue
            a, b = sorted([m.home_team_id, m.away_team_id])
            key = (a, b)
            if key not in h2h_map:
                h2h_map[key] = {
                    "matches_played": 0,
                    "team_a_wins": 0,
                    "team_b_wins": 0,
                    "draws": 0,
                    "team_a_goals": 0,
                    "team_b_goals": 0,
                }
            rec = h2h_map[key]
            rec["matches_played"] += 1

            if m.home_team_id == a:
                rec["team_a_goals"] += m.home_score
                rec["team_b_goals"] += m.away_score
            else:
                rec["team_a_goals"] += m.away_score
                rec["team_b_goals"] += m.home_score

            if m.winner == "HOME_TEAM":
                winner_id = m.home_team_id
            elif m.winner == "AWAY_TEAM":
                winner_id = m.away_team_id
            else:
                rec["draws"] += 1
                continue

            if winner_id == a:
                rec["team_a_wins"] += 1
            else:
                rec["team_b_wins"] += 1

        for (a, b), stats in h2h_map.items():
            db.session.add(
                HeadToHead(
                    team_a_id=a,
                    team_b_id=b,
                    competition_id=competition_id,
                    season_year=season_year,
                    **stats,
                )
            )
        db.session.commit()
        print(f"  Built {len(h2h_map)} H2H records.")
