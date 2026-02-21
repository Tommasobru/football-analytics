from flask import Blueprint, jsonify, request
from app.services.graph_builder import GraphBuilder
from app.services.head_to_head import HeadToHeadService

bp = Blueprint("graph", __name__)


@bp.route("/graph/dominance")
def dominance():
    competitions_param = request.args.get("competitions", "")
    competition_codes = (
        [c.strip() for c in competitions_param.split(",") if c.strip()]
        if competitions_param
        else None
    )
    season = request.args.get("season", type=int)
    date_from = request.args.get("dateFrom")
    date_to = request.args.get("dateTo")

    graph = GraphBuilder.build(
        competition_codes=competition_codes,
        season=season,
        date_from=date_from,
        date_to=date_to,
    )
    return jsonify(graph)


@bp.route("/graph/head-to-head")
def head_to_head():
    team1 = request.args.get("team1", type=int)
    team2 = request.args.get("team2", type=int)

    if not team1 or not team2:
        return jsonify({"error": "team1 and team2 are required"}), 400

    competitions_param = request.args.get("competitions", "")
    competition_codes = (
        [c.strip() for c in competitions_param.split(",") if c.strip()]
        if competitions_param
        else None
    )
    season = request.args.get("season", type=int)

    result = HeadToHeadService.get_detail(
        team1, team2, competition_codes=competition_codes, season=season
    )

    if "error" in result:
        return jsonify(result), 404

    return jsonify(result)
