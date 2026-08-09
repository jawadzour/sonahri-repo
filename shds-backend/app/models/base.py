"""
Abstract base model shared by every table.

Feature models should inherit from BaseModel to automatically get a
primary key and created_at/updated_at timestamps, plus small convenience
methods, instead of redefining them each time.
"""

from __future__ import annotations

from datetime import datetime, timezone

from app.extensions import db


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class BaseModel(db.Model):
    """Abstract base class — not created as its own table."""

    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime(timezone=True), default=_utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False
    )

    def save(self) -> "BaseModel":
        db.session.add(self)
        db.session.commit()
        return self

    def delete(self) -> None:
        db.session.delete(self)
        db.session.commit()

    def _base_dict(self) -> dict:
        """Common id/timestamp fields every to_dict() should include."""
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }