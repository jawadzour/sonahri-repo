"""
Program — a thematic program area (e.g. Education, Health & Nutrition,
WASH, Livelihoods), as shown on the frontend's Programs page.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel


class Program(BaseModel):
    __tablename__ = "programs"

    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    icon = db.Column(db.String(100), nullable=True)  # lucide-react icon name
    summary = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    display_order = db.Column(db.Integer, default=0, nullable=False)

    # --- Relationships ---
    # No cascade delete here on purpose: projects, gallery images, and
    # donations are historical records that should outlive a program being
    # removed. The FK on the child side uses ondelete="SET NULL" instead.
    projects = db.relationship("Project", back_populates="program")
    gallery_images = db.relationship("Gallery", back_populates="program")
    donations = db.relationship("Donation", back_populates="program")

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "title": self.title,
            "slug": self.slug,
            "icon": self.icon,
            "summary": self.summary,
            "description": self.description,
            "is_active": self.is_active,
            "display_order": self.display_order,
        }
        
    def __repr__(self) -> str:  # pragma: no cover
        return f"<Program id={self.id} title={self.title!r}>"
