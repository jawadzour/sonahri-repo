"""
PageView — a single recorded visit to a public-site page, used to power
the visitor stats on the admin dashboard.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel


class PageView(BaseModel):
    __tablename__ = "page_views"

    path = db.Column(db.String(255), nullable=False, index=True)
    # SHA-256 hash of (IP + User-Agent + day + SECRET_KEY) — never the raw
    # IP — lets us count unique visitors per day without storing anything
    # personally identifying. See app/utils/analytics.py.
    visitor_hash = db.Column(db.String(64), nullable=False, index=True)
    referrer = db.Column(db.String(500), nullable=True)

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "path": self.path,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<PageView id={self.id} path={self.path}>"
