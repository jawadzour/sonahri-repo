"""
Contact Messages (inquiries) feature — full CRUD.
"""

from datetime import datetime, timezone

from app.models.contact_message import ContactMessage
from app.models.enums import InquiryType
from app.utils.crud_factory import build_crud_blueprint
from app.utils.parsing import parse_enum, require_fields

ALLOWED_FIELDS = ["name", "email", "phone", "subject", "message", "inquiry_type", "is_read"]


def _parse_payload(data: dict, is_create: bool) -> dict:
    if is_create:
        require_fields(data, ["name", "email", "message"])
    values = {k: data[k] for k in ALLOWED_FIELDS if k in data}
    if "inquiry_type" in values:
        values["inquiry_type"] = parse_enum(InquiryType, values["inquiry_type"], "inquiry_type")
    if values.get("is_read") is True:
        values.setdefault("responded_at", datetime.now(timezone.utc))
    return values


inquiries_bp = build_crud_blueprint(
    "inquiries",
    ContactMessage,
    searchable_fields=["name", "email", "subject", "message"],
    parse_payload=_parse_payload,
)