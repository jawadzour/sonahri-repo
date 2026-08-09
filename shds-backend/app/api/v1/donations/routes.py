from app.models.donation import Donation
from app.models.enums import DonationStatus
from app.utils.crud_factory import build_crud_blueprint
from app.utils.parsing import parse_decimal, parse_enum, require_fields

ALLOWED_FIELDS = [
    "donor_name", "donor_email", "donor_phone", "is_anonymous",
    "amount", "currency", "payment_method", "transaction_reference",
    "status", "message", "program_id",
]


def _parse_payload(data: dict, is_create: bool) -> dict:
    if is_create:
        require_fields(data, ["donor_name", "amount"])
    values = {k: data[k] for k in ALLOWED_FIELDS if k in data}
    if "amount" in values:
        values["amount"] = parse_decimal(values["amount"])
    if "status" in values:
        values["status"] = parse_enum(DonationStatus, values["status"], "status")
    return values


donations_bp = build_crud_blueprint(
    "donations",
    Donation,
    searchable_fields=["donor_name", "transaction_reference"],
    parse_payload=_parse_payload,
)