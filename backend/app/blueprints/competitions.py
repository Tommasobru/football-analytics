from flask import Blueprint, jsonify
from app.models import Competition, CompetitionTeam, Team
from app.extensions import db

bp = Blueprint("competitions", __name__)


@bp.route("/competitions")
def list_competitions():
    competitions = Competition.query.order_by(Competition.name).all()
    return jsonify([c.to_dict() for c in competitions])


@bp.route("/competitions/<int:comp_id>/teams")
def competition_teams(comp_id):
    rows = (
        db.session.query(Team)
        .join(CompetitionTeam, CompetitionTeam.team_id == Team.id)
        .filter(CompetitionTeam.competition_id == comp_id)
        .order_by(Team.name)
        .all()
    )
    return jsonify([t.to_dict() for t in rows])
