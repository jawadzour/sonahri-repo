from app.models.partner import Partner
from app.models.enums import PartnerType
from app.utils.crud_factory import build_crud_blueprint
from app.utils.parsing import parse_enum

ALLOWED_FIELDS = [
    "name", "logo_url", "website_url", "description",
    "partner_type", "is_active", "display_order",
]


def _parse_payload(data: dict, is_create: bool) -> dict:
    values = {k: data[k] for k in ALLOWED_FIELDS if k in data}
    if "partner_type" in values:
        values["partner_type"] = parse_enum(PartnerType, values["partner_type"], "partner_type")
    return values


partners_bp = build_crud_blueprint(
    "partners",
    Partner,
    searchable_fields=["name", "description"],
    parse_payload=_parse_payload,
)