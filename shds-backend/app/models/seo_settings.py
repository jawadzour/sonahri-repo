"""
SeoSettings — a singleton row holding default SEO/metadata configuration.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel


class SeoSettings(BaseModel):
    __tablename__ = "seo_settings"

    default_meta_title = db.Column(db.String(255), nullable=False, default="")
    default_meta_description = db.Column(db.String(500), nullable=True)
    default_og_image_url = db.Column(db.String(500), nullable=True)
    google_analytics_id = db.Column(db.String(100), nullable=True)
    google_site_verification = db.Column(db.String(255), nullable=True)
    robots_txt = db.Column(db.Text, nullable=True)
    sitemap_enabled = db.Column(db.Boolean, default=True, nullable=False)

    @classmethod
    def get_solo(cls) -> "SeoSettings":
        instance = db.session.get(cls, 1)
        if not instance:
            instance = cls(id=1)
            db.session.add(instance)
            db.session.commit()
        return instance

    def to_dict(self) -> dict:
        return {
            "default_meta_title": self.default_meta_title,
            "default_meta_description": self.default_meta_description,
            "default_og_image_url": self.default_og_image_url,
            "google_analytics_id": self.google_analytics_id,
            "google_site_verification": self.google_site_verification,
            "robots_txt": self.robots_txt,
            "sitemap_enabled": self.sitemap_enabled,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<SeoSettings default_meta_title={self.default_meta_title!r}>"