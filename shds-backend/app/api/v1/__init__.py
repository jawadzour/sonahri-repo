"""
API v1 blueprint.
"""

from flask import Blueprint

from app.api.v1.auth.routes import auth_bp
from app.api.v1.health.routes import health_bp
from app.api.v1.inquiries.routes import inquiries_bp
from app.api.v1.programs.routes import programs_bp
from app.api.v1.projects.routes import projects_bp
from app.api.v1.gallery.routes import gallery_bp
from app.api.v1.partners.routes import partners_bp
from app.api.v1.reports.routes import reports_bp
from app.api.v1.donations.routes import donations_bp
from app.api.v1.team_members.routes import team_members_bp
from app.api.v1.volunteers.routes import volunteers_bp
from app.api.v1.cms.routes import homepage_cms_bp, about_cms_bp
from app.api.v1.media.routes import media_bp
from app.api.v1.settings.routes import settings_bp
from app.api.v1.users.routes import users_bp
from app.api.v1.public.routes import public_bp
from app.api.v1.notifications.routes import notifications_bp

v1_bp = Blueprint("api_v1", __name__)

v1_bp.register_blueprint(health_bp, url_prefix="/health")
v1_bp.register_blueprint(auth_bp, url_prefix="/auth")
v1_bp.register_blueprint(inquiries_bp, url_prefix="/inquiries")
v1_bp.register_blueprint(programs_bp, url_prefix="/programs")
v1_bp.register_blueprint(projects_bp, url_prefix="/projects")
v1_bp.register_blueprint(gallery_bp, url_prefix="/gallery")
v1_bp.register_blueprint(partners_bp, url_prefix="/partners")
v1_bp.register_blueprint(reports_bp, url_prefix="/reports")
v1_bp.register_blueprint(donations_bp, url_prefix="/donations")
v1_bp.register_blueprint(team_members_bp, url_prefix="/team-members")
v1_bp.register_blueprint(volunteers_bp, url_prefix="/volunteers")
v1_bp.register_blueprint(homepage_cms_bp, url_prefix="/cms/homepage")
v1_bp.register_blueprint(about_cms_bp, url_prefix="/cms/about")
v1_bp.register_blueprint(media_bp, url_prefix="/media")
v1_bp.register_blueprint(settings_bp, url_prefix="/settings")
v1_bp.register_blueprint(users_bp, url_prefix="/users")
v1_bp.register_blueprint(public_bp, url_prefix="/public")
v1_bp.register_blueprint(notifications_bp, url_prefix="/notifications")