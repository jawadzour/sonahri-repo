"""
Gallery — a single image entry, as shown on the frontend's Gallery page
(grouped by category, e.g. "Education Programs", "WASH Initiatives").
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel


class Gallery(BaseModel):
    __tablename__ = "gallery"

    category = db.Column(db.String(150), nullable=False, index=True)
    image_url = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(255), nullable=True)
    caption = db.Column(db.String(500), nullable=True)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    is_published = db.Column(db.Boolean, default=True, nullable=False)

    program_id = db.Column(
        db.Integer,
        db.ForeignKey("programs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # --- Relationships ---
    program = db.relationship("Program", back_populates="gallery_images")

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "category": self.category,
            "image_url": self.image_url,
            "alt_text": self.alt_text,
            "caption": self.caption,
            "display_order": self.display_order,
            "is_published": self.is_published,
            "program_id": self.program_id,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Gallery id={self.id} category={self.category!r}>"
