"""
Health check endpoint.

Used by load balancers / uptime monitors / deployment platforms to verify
the app (and its DB connection) is up. This is infrastructure, not a
product feature, so it's implemented now rather than left as a stub.
"""

from flask import Blueprint
from sqlalchemy import text

from app.extensions import db
from app.utils.responses import success

health_bp = Blueprint("health", __name__)


@health_bp.get("/")
def health_check():
    db_status = "ok"
    try:
        db.session.execute(text("SELECT 1"))
    except Exception:
        db_status = "unavailable"

    return success(data={"status": "ok", "database": db_status})
