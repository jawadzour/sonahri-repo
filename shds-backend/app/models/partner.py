"""
Partner — an organization SHDS partners with (donor, government body,
NGO, corporate) — e.g. Population Welfare Department, NRSP, PAIMAN,
Baitulmaal, as referenced across the frontend's Programs/Projects pages.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel
from app.models.enums import PartnerType


class Partner(BaseModel):
    __tablename__ = "partners"

    name = db.Column(db.String(255), nullable=False)
    logo_url = db.Column(db.String(500), nullable=True)
    website_url = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text, nullable=True)
    partner_type = db.Column(
        db.Enum(PartnerType, name="partner_type"),
        default=PartnerType.OTHER,
        nullable=False,
        index=True,
    )
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    display_order = db.Column(db.Integer, default=0, nullable=False)

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "name": self.name,
            "logo_url": self.logo_url,
            "website_url": self.website_url,
            "description": self.description,
            "partner_type": self.partner_type.value if self.partner_type else None,
            "is_active": self.is_active,
            "display_order": self.display_order,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Partner id={self.id} name={self.name!r} type={self.partner_type.value}>"
