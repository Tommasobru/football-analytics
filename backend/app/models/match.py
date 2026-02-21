from app.extensions import db


class Match(db.Model):
    __tablename__ = "matches"

    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    competition_id = db.Column(
        db.Integer, db.ForeignKey("competitions.id"), nullable=False
    )
    season_year = db.Column(db.Integer, nullable=False)
    utc_date = db.Column(db.DateTime, nullable=False)
    home_team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    away_team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), nullable=False)
    home_score = db.Column(db.Integer)
    away_score = db.Column(db.Integer)
    winner = db.Column(db.String(20))  # HOME_TEAM, AWAY_TEAM, DRAW

    home_team = db.relationship("Team", foreign_keys=[home_team_id], lazy="joined")
    away_team = db.relationship("Team", foreign_keys=[away_team_id], lazy="joined")

    __table_args__ = (
        db.Index("ix_matches_competition", "competition_id"),
        db.Index("ix_matches_home_team", "home_team_id"),
        db.Index("ix_matches_away_team", "away_team_id"),
        db.Index("ix_matches_date", "utc_date"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "competitionId": self.competition_id,
            "seasonYear": self.season_year,
            "utcDate": self.utc_date.isoformat() if self.utc_date else None,
            "homeTeam": self.home_team.to_dict() if self.home_team else None,
            "awayTeam": self.away_team.to_dict() if self.away_team else None,
            "homeScore": self.home_score,
            "awayScore": self.away_score,
            "winner": self.winner,
        }
