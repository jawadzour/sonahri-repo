"""
Settings feature — Website Settings and SEO Settings (singletons).
"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.seo_settings import SeoSettings
from app.models.website_settings import WebsiteSettings
from app.utils.responses import success

settings_bp = Blueprint("settings", __name__)

WEBSITE_FIELDS = [
    "site_name", "tagline", "logo_url", "favicon_url", "contact_email",
    "contact_phone", "address", "facebook_url", "twitter_url",
    "instagram_url", "linkedin_url", "youtube_url", "maintenance_mode",
    "donation_bank_name", "donation_account_title", "donation_account_number",
    "donation_iban", "donation_swift_code", "donation_jazzcash_number",
    "donation_easypaisa_number", "donation_raast_id", "donation_instructions",
]

SEO_FIELDS = [
    "default_meta_title", "default_meta_description", "default_og_image_url",
    "google_analytics_id", "google_site_verification", "robots_txt", "sitemap_enabled",
]


@settings_bp.get("/website")
@jwt_required()
def get_website_settings():
    return success(data=WebsiteSettings.get_solo().to_dict())


@settings_bp.put("/website")
@jwt_required()
def update_website_settings():
    settings = WebsiteSettings.get_solo()
    data = request.get_json(silent=True) or {}
    for key in WEBSITE_FIELDS:
        if key in data:
            setattr(settings, key, data[key])
    db.session.commit()
    return success(data=settings.to_dict())


@settings_bp.get("/seo")
@jwt_required()
def get_seo_settings():
    return success(data=SeoSettings.get_solo().to_dict())


@settings_bp.put("/seo")
@jwt_required()
def update_seo_settings():
    settings = SeoSettings.get_solo()
    data = request.get_json(silent=True) or {}
    for key in SEO_FIELDS:
        if key in data:
            setattr(settings, key, data[key])
    db.session.commit()
    return success(data=settings.to_dict())