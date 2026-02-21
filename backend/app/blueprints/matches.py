from flask import Blueprint, jsonify, request
from app.models import Match, Competition
from app.extensions import db

bp = Blueprint("matches", __name__)


@bp.route("/matches")
def list_matches():
    query = Match.query

    competition = request.args.get("competition")
    if competition:
        comp = Competition.query.filter_by(code=competition).first()
        if comp:
            query = query.filter(Match.competition_id == comp.id)

    season = request.args.get("season", type=int)
    if season:
        query = query.filter(Match.season_year == season)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    pagination = (
        query.order_by(Match.utc_date.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    return jsonify(
        {
            "matches": [m.to_dict() for m in pagination.items],
            "total": pagination.total,
            "page": pagination.page,
            "pages": pagination.pages,
        }
    )
