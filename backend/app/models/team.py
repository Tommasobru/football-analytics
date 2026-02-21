from app.extensions import db


class Team(db.Model):
    __tablename__ = "teams"

    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    name = db.Column(db.String(200), nullable=False)
    short_name = db.Column(db.String(100))
    tla = db.Column(db.String(5))
    crest_url = db.Column(db.String(500))
    area_name = db.Column(db.String(100))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "shortName": self.short_name,
            "tla": self.tla,
            "crestUrl": self.crest_url,
            "areaName": self.area_name,
        }
