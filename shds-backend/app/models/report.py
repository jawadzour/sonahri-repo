"""
Report — a downloadable document (annual report, financial statement,
impact report) — supports the "detailed case studies, field reports"
mentioned on the frontend's Gallery page and the Governance page's
mention of accountability/audit records.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel
from app.models.enums import ReportType


class Report(BaseModel):
    __tablename__ = "reports"

    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    file_url = db.Column(db.String(500), nullable=False)
    report_type = db.Column(
        db.Enum(ReportType, name="report_type"),
        default=ReportType.OTHER,
        nullable=False,
        index=True,
    )
    year = db.Column(db.Integer, nullable=True, index=True)
    is_public = db.Column(db.Boolean, default=True, nullable=False)
    published_at = db.Column(db.DateTime(timezone=True), nullable=True)

    uploaded_by_id = db.Column(
        db.Integer,
        db.ForeignKey("admins.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # --- Relationships ---
    uploaded_by = db.relationship(
        "Admin", back_populates="uploaded_reports", foreign_keys=[uploaded_by_id]
    )

    def to_dict(self) -> dict:
            return {
                **self._base_dict(),
                "title": self.title,
                "description": self.description,
                "file_url": self.file_url,
                "report_type": self.report_type.value,
                "year": self.year,
                "is_public": self.is_public,
                "published_at": self.published_at.isoformat() if self.published_at else None,
                "uploaded_by_id": self.uploaded_by_id,
            }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Report id={self.id} title={self.title!r} year={self.year}>"
