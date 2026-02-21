from app.extensions import db


class Competition(db.Model):
    __tablename__ = "competitions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    name = db.Column(db.String(200), nullable=False)
    code = db.Column(db.String(10), unique=True, nullable=False)
    area_name = db.Column(db.String(100))
    type = db.Column(db.String(50))
    emblem_url = db.Column(db.String(500))
    last_synced = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "code": self.code,
            "areaName": self.area_name,
            "type": self.type,
            "emblemUrl": self.emblem_url,
        }


class CompetitionTeam(db.Model):
    __tablename__ = "competition_teams"

    competition_id = db.Column(
        db.Integer, db.ForeignKey("competitions.id"), primary_key=True
    )
    team_id = db.Column(db.Integer, db.ForeignKey("teams.id"), primary_key=True)
    season_year = db.Column(db.Integer, primary_key=True)
