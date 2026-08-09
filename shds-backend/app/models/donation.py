"""
Donation — a donation record (from the public "Donation/Support" contact
option, or a future dedicated donate flow).
"""

from __future__ import annotations

from app.extensions import db
from app.models.base import BaseModel
from app.models.enums import DonationStatus


class Donation(BaseModel):
    __tablename__ = "donations"

    donor_name = db.Column(db.String(255), nullable=False)
    donor_email = db.Column(db.String(320), nullable=True)
    donor_phone = db.Column(db.String(50), nullable=True)
    is_anonymous = db.Column(db.Boolean, default=False, nullable=False)

    amount = db.Column(db.Numeric(12, 2), nullable=False)
    currency = db.Column(db.String(10), default="PKR", nullable=False)

    payment_method = db.Column(db.String(100), nullable=True)
    payment_screenshot_url = db.Column(db.String(500), nullable=True)
    transaction_reference = db.Column(db.String(255), nullable=True, index=True)
    status = db.Column(
        db.Enum(DonationStatus, name="donation_status"),
        default=DonationStatus.PENDING,
        nullable=False,
        index=True,
    )

    message = db.Column(db.Text, nullable=True)

    program_id = db.Column(
        db.Integer,
        db.ForeignKey("programs.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # --- Relationships ---
    program = db.relationship("Program", back_populates="donations")

    def to_dict(self) -> dict:
        return {
            **self._base_dict(),
            "donor_name": self.donor_name,
            "donor_email": self.donor_email,
            "donor_phone": self.donor_phone,
            "is_anonymous": self.is_anonymous,
            "amount": float(self.amount) if self.amount is not None else None,
            "currency": self.currency,
            "payment_method": self.payment_method,
            "transaction_reference": self.transaction_reference,
            "status": self.status.value,
            "message": self.message,
            "program_id": self.program_id,
            "payment_screenshot_url": self.payment_screenshot_url,
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Donation id={self.id} amount={self.amount} status={self.status.value}>"
