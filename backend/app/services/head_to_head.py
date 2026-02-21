from app.extensions import db
from app.models import HeadToHead, Match, Team


class HeadToHeadService:
    """Provides detailed head-to-head data between two teams."""

    @staticmethod
    def get_detail(
        team1_id: int,
        team2_id: int,
        competition_codes: list[str] | None = None,
        season: int | None = None,
    ) -> dict:
        a, b = sorted([team1_id, team2_id])

        team_a = Team.query.get(a)
        team_b = Team.query.get(b)
        if not team_a or not team_b:
            return {"error": "Team not found"}

        # Aggregate H2H stats
        query = db.session.query(HeadToHead).filter_by(team_a_id=a, team_b_id=b)

        if competition_codes:
            from app.models import Competition

            comp_ids = [
                c[0]
                for c in db.session.query(Competition.id)
                .filter(Competition.code.in_(competition_codes))
                .all()
            ]
            if comp_ids:
                query = query.filter(HeadToHead.competition_id.in_(comp_ids))

        if season:
            query = query.filter(HeadToHead.season_year == season)

        records = query.all()

        totals = {
            "matchesPlayed": 0,
            "teamAWins": 0,
            "teamBWins": 0,
            "draws": 0,
            "teamAGoals": 0,
            "teamBGoals": 0,
        }
        for rec in records:
            totals["matchesPlayed"] += rec.matches_played
            totals["teamAWins"] += rec.team_a_wins
            totals["teamBWins"] += rec.team_b_wins
            totals["draws"] += rec.draws
            totals["teamAGoals"] += rec.team_a_goals
            totals["teamBGoals"] += rec.team_b_goals

        # Get individual matches
        match_query = Match.query.filter(
            db.or_(
                db.and_(Match.home_team_id == a, Match.away_team_id == b),
                db.and_(Match.home_team_id == b, Match.away_team_id == a),
            )
        ).order_by(Match.utc_date.desc())

        if season:
            match_query = match_query.filter(Match.season_year == season)

        matches = match_query.all()

        return {
            "teamA": team_a.to_dict(),
            "teamB": team_b.to_dict(),
            "stats": totals,
            "matches": [m.to_dict() for m in matches],
        }
