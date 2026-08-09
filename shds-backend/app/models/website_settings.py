"""
WebsiteSettings — a singleton row holding site-wide identity/contact info.

There is always exactly one row (id=1). Use WebsiteSettings.get_solo() to
fetch-or-create it rather than querying directly.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel


class WebsiteSettings(BaseModel):
    __tablename__ = "website_settings"

    site_name = db.Column(db.String(255), nullable=False, default="Sindh Health & Development Society")
    tagline = db.Column(db.String(500), nullable=True)
    logo_url = db.Column(db.String(500), nullable=True)
    favicon_url = db.Column(db.String(500), nullable=True)
    contact_email = db.Column(db.String(320), nullable=False, default="")
    contact_phone = db.Column(db.String(50), nullable=True)
    address = db.Column(db.String(500), nullable=True)
    facebook_url = db.Column(db.String(500), nullable=True)
    twitter_url = db.Column(db.String(500), nullable=True)
    instagram_url = db.Column(db.String(500), nullable=True)
    linkedin_url = db.Column(db.String(500), nullable=True)
    youtube_url = db.Column(db.String(500), nullable=True)
    maintenance_mode = db.Column(db.Boolean, default=False, nullable=False)

    # --- Donation info (informational — no live payment gateway wired up) ---
    donation_bank_name = db.Column(db.String(255), nullable=True)
    donation_account_title = db.Column(db.String(255), nullable=True)
    donation_account_number = db.Column(db.String(100), nullable=True)
    donation_iban = db.Column(db.String(100), nullable=True)
    donation_swift_code = db.Column(db.String(20), nullable=True)
    donation_jazzcash_number = db.Column(db.String(50), nullable=True)
    donation_easypaisa_number = db.Column(db.String(50), nullable=True)
    donation_raast_id = db.Column(db.String(100), nullable=True)
    donation_instructions = db.Column(db.Text, nullable=True)

    @classmethod
    def get_solo(cls) -> "WebsiteSettings":
        instance = db.session.get(cls, 1)
        if not instance:
            instance = cls(id=1)
            db.session.add(instance)
            db.session.commit()
        return instance

    def to_dict(self) -> dict:
        return {
            "site_name": self.site_name,
            "tagline": self.tagline,
            "logo_url": self.logo_url,
            "favicon_url": self.favicon_url,
            "contact_email": self.contact_email,
            "contact_phone": self.contact_phone,
            "address": self.address,
            "facebook_url": self.facebook_url,
            "twitter_url": self.twitter_url,
            "instagram_url": self.instagram_url,
            "linkedin_url": self.linkedin_url,
            "youtube_url": self.youtube_url,
            "maintenance_mode": self.maintenance_mode,
            "donation_bank_name": self.donation_bank_name,
            "donation_account_title": self.donation_account_title,
            "donation_account_number": self.donation_account_number,
            "donation_iban": self.donation_iban,
            "donation_swift_code": self.donation_swift_code,
            "donation_jazzcash_number": self.donation_jazzcash_number,
            "donation_easypaisa_number": self.donation_easypaisa_number,
            "donation_raast_id": self.donation_raast_id,
            "donation_instructions": self.donation_instructions,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<WebsiteSettings site_name={self.site_name!r}>"