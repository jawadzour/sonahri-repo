"""
Admin — authenticated back-office users.
"""

from __future__ import annotations

import bcrypt

from app.extensions import db
from app.models.base import BaseModel
from app.models.enums import AdminRole


class Admin(BaseModel):
    __tablename__ = "admins"

    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(320), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(
        db.Enum(AdminRole, name="admin_role"),
        default=AdminRole.ADMIN,
        nullable=False,
    )
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    last_login_at = db.Column(db.DateTime(timezone=True), nullable=True)

    handled_messages = db.relationship(
        "ContactMessage",
        back_populates="handled_by",
        foreign_keys="ContactMessage.handled_by_id",
    )
    uploaded_reports = db.relationship(
        "Report",
        back_populates="uploaded_by",
        foreign_keys="Report.uploaded_by_id",
    )

    def set_password(self, raw_password: str) -> None:
        self.password_hash = bcrypt.hashpw(
            raw_password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    def check_password(self, raw_password: str) -> bool:
        return bcrypt.checkpw(
            raw_password.encode("utf-8"), self.password_hash.encode("utf-8")
        )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role.value,
            "is_active": self.is_active,
            "last_login_at": self.last_login_at.isoformat() if self.last_login_at else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Admin id={self.id} email={self.email!r} role={self.role.value}>"