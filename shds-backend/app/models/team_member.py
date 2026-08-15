"""
TeamMember — staff/board members shown on the public About page.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel


class TeamMember(BaseModel):
    __tablename__ = "team_members"

    name = db.Column(db.String(255), nullable=False)
    designation = db.Column(db.String(255), nullable=False)
    department = db.Column(db.String(150), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    photo_url = db.Column(db.String(500), nullable=True)
    email = db.Column(db.String(320), nullable=True)
    linkedin_url = db.Column(db.String(500), nullable=True)
    display_order = db.Column(db.Integer, default=0, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "name": self.name,
            "designation": self.designation,
            "department": self.department,
            "bio": self.bio,
            "photo_url": self.photo_url,
            "email": self.email,
            "linkedin_url": self.linkedin_url,
            "display_order": self.display_order,
            "is_active": self.is_active,
        }

    def to_public_dict(self) -> dict:
        """Public-safe serialization for the unauthenticated /public/team-members
        endpoint — omits email, which to_dict() includes for the admin CRUD panel."""
        data = self.to_dict()
        data.pop("email", None)
        return data

    def __repr__(self) -> str:  # pragma: no cover
        return f"<TeamMember id={self.id} name={self.name!r}>"