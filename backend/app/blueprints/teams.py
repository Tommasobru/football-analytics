from flask import Blueprint, jsonify, request
from app.models import Team, Match
from app.extensions import db
from sqlalchemy import func

bp = Blueprint("teams", __name__)


@bp.route("/teams/<int:team_id>")
def get_team(team_id):
    team = Team.query.get_or_404(team_id)
    return jsonify(team.to_dict())


@bp.route("/teams/<int:team_id>/stats")
def team_stats(team_id):
    team = Team.query.get_or_404(team_id)

    home_matches = Match.query.filter_by(home_team_id=team_id)
    away_matches = Match.query.filter_by(away_team_id=team_id)

    wins = (
        home_matches.filter_by(winner="HOME_TEAM").count()
        + away_matches.filter_by(winner="AWAY_TEAM").count()
    )
    draws = (
        home_matches.filter_by(winner="DRAW").count()
        + away_matches.filter_by(winner="DRAW").count()
    )
    losses = (
        home_matches.filter_by(winner="AWAY_TEAM").count()
        + away_matches.filter_by(winner="HOME_TEAM").count()
    )

    goals_for = (
        db.session.query(func.coalesce(func.sum(Match.home_score), 0))
        .filter(Match.home_team_id == team_id)
        .scalar()
        + db.session.query(func.coalesce(func.sum(Match.away_score), 0))
        .filter(Match.away_team_id == team_id)
        .scalar()
    )
    goals_against = (
        db.session.query(func.coalesce(func.sum(Match.away_score), 0))
        .filter(Match.home_team_id == team_id)
        .scalar()
        + db.session.query(func.coalesce(func.sum(Match.home_score), 0))
        .filter(Match.away_team_id == team_id)
        .scalar()
    )

    return jsonify(
        {
            "team": team.to_dict(),
            "stats": {
                "played": wins + draws + losses,
                "wins": wins,
                "draws": draws,
                "losses": losses,
                "goalsFor": goals_for,
                "goalsAgainst": goals_against,
                "goalDifference": goals_for - goals_against,
            },
        }
    )


@bp.route("/teams/<int:team_id>/matches")
def team_matches(team_id):
    Team.query.get_or_404(team_id)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    query = (
        Match.query.filter(
            db.or_(
                Match.home_team_id == team_id,
                Match.away_team_id == team_id,
            )
        )
        .order_by(Match.utc_date.desc())
    )

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify(
        {
            "matches": [m.to_dict() for m in pagination.items],
            "total": pagination.total,
            "page": pagination.page,
            "pages": pagination.pages,
        }
    )
