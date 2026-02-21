from app.extensions import db


class HeadToHead(db.Model):
    __tablename__ = "head_to_head"

    team_a_id = db.Column(db.Integer, db.ForeignKey("teams.id"), primary_key=True)
    team_b_id = db.Column(db.Integer, db.ForeignKey("teams.id"), primary_key=True)
    competition_id = db.Column(
        db.Integer, db.ForeignKey("competitions.id"), primary_key=True
    )
    season_year = db.Column(db.Integer, primary_key=True)
    matches_played = db.Column(db.Integer, default=0)
    team_a_wins = db.Column(db.Integer, default=0)
    team_b_wins = db.Column(db.Integer, default=0)
    draws = db.Column(db.Integer, default=0)
    team_a_goals = db.Column(db.Integer, default=0)
    team_b_goals = db.Column(db.Integer, default=0)

    team_a = db.relationship("Team", foreign_keys=[team_a_id], lazy="joined")
    team_b = db.relationship("Team", foreign_keys=[team_b_id], lazy="joined")

    __table_args__ = (
        db.CheckConstraint("team_a_id < team_b_id", name="ck_canonical_order"),
    )
