import os
from flask import Flask
from flask_cors import CORS

from .extensions import db
from config import Config


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    os.makedirs(app.instance_path, exist_ok=True)

    db.init_app(app)
    CORS(app)

    from .blueprints.competitions import bp as competitions_bp
    from .blueprints.teams import bp as teams_bp
    from .blueprints.matches import bp as matches_bp
    from .blueprints.graph import bp as graph_bp

    app.register_blueprint(competitions_bp, url_prefix="/api")
    app.register_blueprint(teams_bp, url_prefix="/api")
    app.register_blueprint(matches_bp, url_prefix="/api")
    app.register_blueprint(graph_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()

    return app
