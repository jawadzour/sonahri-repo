"""
ContactMessage — a contact-form submission from the public website.

Mirrors the `inquiries` table from the previous Node/Drizzle backend
(drizzle/schema.ts), with two additions (is_read, handled_by) to support
an admin workflow that the old single-table design didn't have.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel
from app.models.enums import InquiryType


class ContactMessage(BaseModel):
    __tablename__ = "contact_messages"

    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(320), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    subject = db.Column(db.String(255), nullable=True)
    message = db.Column(db.Text, nullable=False)
    inquiry_type = db.Column(
        db.Enum(InquiryType, name="inquiry_type"),
        default=InquiryType.GENERAL,
        nullable=False,
        index=True,
    )
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    responded_at = db.Column(db.DateTime(timezone=True), nullable=True)

    handled_by_id = db.Column(
        db.Integer,
        db.ForeignKey("admins.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # --- Relationships ---
    handled_by = db.relationship(
        "Admin", back_populates="handled_messages", foreign_keys=[handled_by_id]
    )

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "subject": self.subject,
            "message": self.message,
            "inquiry_type": self.inquiry_type.value,
            "is_read": self.is_read,
            "responded_at": self.responded_at.isoformat() if self.responded_at else None,
            "handled_by_id": self.handled_by_id,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<ContactMessage id={self.id} email={self.email!r}>"
