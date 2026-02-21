from sqlalchemy import func
from app.extensions import db
from app.models import HeadToHead, Team, Match


class GraphBuilder:
    """Builds dominance graph data (nodes + edges) from H2H records."""

    @staticmethod
    def build(
        competition_codes: list[str] | None = None,
        season: int | None = None,
        date_from: str | None = None,
        date_to: str | None = None,
    ) -> dict:
        from app.models import Competition

        query = db.session.query(HeadToHead)

        if competition_codes:
            comp_ids = (
                db.session.query(Competition.id)
                .filter(Competition.code.in_(competition_codes))
                .all()
            )
            comp_ids = [c[0] for c in comp_ids]
            if comp_ids:
                query = query.filter(HeadToHead.competition_id.in_(comp_ids))

        if season:
            query = query.filter(HeadToHead.season_year == season)

        if date_from or date_to:
            return GraphBuilder._build_from_matches(
                competition_codes, season, date_from, date_to
            )

        h2h_records = query.all()
        return GraphBuilder._assemble_graph(h2h_records)

    @staticmethod
    def _build_from_matches(
        competition_codes: list[str] | None,
        season: int | None,
        date_from: str | None,
        date_to: str | None,
    ) -> dict:
        from app.models import Competition
        from datetime import datetime

        query = db.session.query(Match)

        if competition_codes:
            comp_ids = (
                db.session.query(Competition.id)
                .filter(Competition.code.in_(competition_codes))
                .all()
            )
            comp_ids = [c[0] for c in comp_ids]
            if comp_ids:
                query = query.filter(Match.competition_id.in_(comp_ids))

        if season:
            query = query.filter(Match.season_year == season)

        if date_from:
            query = query.filter(Match.utc_date >= datetime.fromisoformat(date_from))
        if date_to:
            query = query.filter(Match.utc_date <= datetime.fromisoformat(date_to))

        matches = query.all()

        h2h_map: dict[tuple, dict] = {}
        for m in matches:
            if m.home_score is None:
                continue
            a, b = sorted([m.home_team_id, m.away_team_id])
            key = (a, b)
            if key not in h2h_map:
                h2h_map[key] = {
                    "team_a_id": a,
                    "team_b_id": b,
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

        # Convert to objects with attributes
        class H2HRecord:
            def __init__(self, d):
                for k, v in d.items():
                    setattr(self, k, v)

        records = [H2HRecord(d) for d in h2h_map.values()]
        return GraphBuilder._assemble_graph(records)

    @staticmethod
    def _assemble_graph(h2h_records) -> dict:
        team_ids = set()
        team_stats: dict[int, dict] = {}
        edges = []

        for rec in h2h_records:
            team_ids.add(rec.team_a_id)
            team_ids.add(rec.team_b_id)

            for tid in (rec.team_a_id, rec.team_b_id):
                if tid not in team_stats:
                    team_stats[tid] = {
                        "totalWins": 0,
                        "totalDraws": 0,
                        "totalLosses": 0,
                        "totalGoals": 0,
                    }

            team_stats[rec.team_a_id]["totalWins"] += rec.team_a_wins
            team_stats[rec.team_a_id]["totalLosses"] += rec.team_b_wins
            team_stats[rec.team_a_id]["totalDraws"] += rec.draws
            team_stats[rec.team_a_id]["totalGoals"] += rec.team_a_goals

            team_stats[rec.team_b_id]["totalWins"] += rec.team_b_wins
            team_stats[rec.team_b_id]["totalLosses"] += rec.team_a_wins
            team_stats[rec.team_b_id]["totalDraws"] += rec.draws
            team_stats[rec.team_b_id]["totalGoals"] += rec.team_b_goals

            win_diff = rec.team_a_wins - rec.team_b_wins
            if win_diff != 0:
                source = rec.team_a_id if win_diff > 0 else rec.team_b_id
                target = rec.team_b_id if win_diff > 0 else rec.team_a_id
                weight = abs(win_diff)
                total = rec.matches_played or 1
                dominance = weight / total

                edges.append(
                    {
                        "source": source,
                        "target": target,
                        "weight": weight,
                        "dominance": round(dominance, 3),
                        "sourceWins": max(rec.team_a_wins, rec.team_b_wins),
                        "targetWins": min(rec.team_a_wins, rec.team_b_wins),
                        "draws": rec.draws,
                    }
                )

        teams = Team.query.filter(Team.id.in_(team_ids)).all() if team_ids else []
        team_map = {t.id: t for t in teams}

        nodes = []
        for tid, stats in team_stats.items():
            team = team_map.get(tid)
            if team:
                nodes.append(
                    {
                        "id": tid,
                        "name": team.name,
                        "tla": team.tla,
                        "crestUrl": team.crest_url,
                        **stats,
                    }
                )

        return {"nodes": nodes, "edges": edges}
