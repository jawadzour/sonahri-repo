"""
Volunteer — an application submitted by someone wanting to volunteer.
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel
from app.models.enums import VolunteerStatus


class Volunteer(BaseModel):
    __tablename__ = "volunteers"

    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(320), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    city = db.Column(db.String(150), nullable=True)
    area_of_interest = db.Column(db.String(255), nullable=True)
    availability = db.Column(db.String(255), nullable=True)
    message = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.Enum(VolunteerStatus, name="volunteer_status"),
        default=VolunteerStatus.PENDING,
        nullable=False,
        index=True,
    )

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "city": self.city,
            "area_of_interest": self.area_of_interest,
            "availability": self.availability,
            "message": self.message,
            "status": self.status.value,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Volunteer id={self.id} email={self.email!r} status={self.status.value}>"