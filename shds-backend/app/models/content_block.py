"""
ContentBlock — an editable CMS section for the Homepage or About page.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel


class ContentBlock(BaseModel):
    __tablename__ = "content_blocks"
    __table_args__ = (
        db.UniqueConstraint("page", "section_key", name="uq_content_block_page_section"),
    )

    page = db.Column(db.String(50), nullable=False, index=True)  # "homepage" | "about"
    section_key = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(255), nullable=True)
    subtitle = db.Column(db.String(500), nullable=True)
    body = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    is_published = db.Column(db.Boolean, default=True, nullable=False)

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "page": self.page,
            "section_key": self.section_key,
            "title": self.title,
            "subtitle": self.subtitle,
            "body": self.body,
            "image_url": self.image_url,
            "display_order": self.display_order,
            "is_published": self.is_published,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<ContentBlock id={self.id} page={self.page!r} section_key={self.section_key!r}>"