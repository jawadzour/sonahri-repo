"""
MediaFile — an uploaded image/document tracked in the Media Library.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel


class MediaFile(BaseModel):
    __tablename__ = "media_files"

    filename = db.Column(db.String(255), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    mime_type = db.Column(db.String(100), nullable=False)
    size_bytes = db.Column(db.Integer, nullable=False)
    alt_text = db.Column(db.String(255), nullable=True)

    uploaded_by_id = db.Column(
        db.Integer,
        db.ForeignKey("admins.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "filename": self.filename,
            "url": self.url,
            "mime_type": self.mime_type,
            "size_bytes": self.size_bytes,
            "alt_text": self.alt_text,
            "uploaded_by_id": self.uploaded_by_id,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<MediaFile id={self.id} filename={self.filename!r}>"