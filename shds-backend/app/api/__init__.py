"""
Top-level API package.

register_api(app) mounts every versioned API blueprint. Versioning the API
(/api/v1/...) from day one means a future /api/v2/ can be introduced
without breaking existing frontend clients.
"""

from flask import Flask

from app.api.v1 import v1_bp


def register_api(app: Flask) -> None:
    app.register_blueprint(v1_bp, url_prefix="/api/v1")
