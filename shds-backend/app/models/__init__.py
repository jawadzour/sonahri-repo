"""
Model registry.
"""

from app.models.base import BaseModel  # noqa: F401

from app.models.admin import Admin  # noqa: F401
from app.models.program import Program  # noqa: F401
from app.models.project import Project  # noqa: F401
from app.models.gallery import Gallery  # noqa: F401
from app.models.donation import Donation  # noqa: F401
from app.models.contact_message import ContactMessage  # noqa: F401
from app.models.partner import Partner  # noqa: F401
from app.models.report import Report  # noqa: F401
from app.models.team_member import TeamMember  # noqa: F401
from app.models.volunteer import Volunteer  # noqa: F401
from app.models.content_block import ContentBlock  # noqa: F401
from app.models.media_file import MediaFile  # noqa: F401
from app.models.website_settings import WebsiteSettings  # noqa: F401
from app.models.seo_settings import SeoSettings  # noqa: F401
from app.models.page_view import PageView  # noqa: F401

__all__ = [
    "BaseModel", "Admin", "Program", "Project", "Gallery", "Donation",
    "ContactMessage", "Partner", "Report", "TeamMember", "Volunteer",
    "ContentBlock", "MediaFile", "WebsiteSettings", "SeoSettings", "PageView",
]