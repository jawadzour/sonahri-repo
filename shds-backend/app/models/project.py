"""
Project — an individual funded project/initiative, as shown on the
frontend's Projects page (title, donor, location, sector, status, etc).
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel
from app.models.enums import ProjectStatus


class Project(BaseModel):
    __tablename__ = "projects"

    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    donor = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    sector = db.Column(db.String(150), nullable=True)
    status = db.Column(
        db.Enum(ProjectStatus, name="project_status"),
        default=ProjectStatus.ONGOING,
        nullable=False,
        index=True,
    )
    beneficiaries = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)

    program_id = db.Column(
        db.Integer,
        db.ForeignKey("programs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # --- Relationships ---
    program = db.relationship("Program", back_populates="projects")

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "title": self.title,
            "slug": self.slug,
            "donor": self.donor,
            "location": self.location,
            "sector": self.sector,
            "status": self.status.value,
            "beneficiaries": self.beneficiaries,
            "description": self.description,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "program_id": self.program_id,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Project id={self.id} title={self.title!r} status={self.status.value}>"
