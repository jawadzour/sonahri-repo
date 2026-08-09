"""
Application factory.
"""

import logging

from flask import Flask

from app.config import get_config
from app.extensions import cors, db, jwt, limiter, ma, migrate


def create_app(config_name: str | None = None) -> Flask:
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))

    _configure_logging(app)
    _init_extensions(app)
    _register_blueprints(app)
    _register_error_handlers(app)
    _register_cli(app)
    _ensure_upload_folder(app)
    _register_uploads_route(app)

    return app


def _configure_logging(app: Flask) -> None:
    logging.basicConfig(level=app.config.get("LOG_LEVEL", "INFO"))


def _init_extensions(app: Flask) -> None:
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)

    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    with app.app_context():
        import app.models  # noqa: F401


def _register_blueprints(app: Flask) -> None:
    from app.api import register_api

    register_api(app)


def _register_error_handlers(app: Flask) -> None:
    from app.utils.errors import register_error_handlers

    register_error_handlers(app)


def _register_cli(app: Flask) -> None:
    from app.cli import register_cli

    register_cli(app)


def _ensure_upload_folder(app: Flask) -> None:
    import os

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


def _register_uploads_route(app: Flask) -> None:
    from flask import send_from_directory

    @app.get("/uploads/<path:filename>")
    def serve_upload(filename: str):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)