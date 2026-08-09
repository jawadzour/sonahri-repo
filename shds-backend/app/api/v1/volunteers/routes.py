from app.models.volunteer import Volunteer
from app.models.enums import VolunteerStatus
from app.utils.crud_factory import build_crud_blueprint
from app.utils.parsing import parse_enum, require_fields

ALLOWED_FIELDS = [
    "name", "email", "phone", "city", "area_of_interest",
    "availability", "message", "status",
]


def _parse_payload(data: dict, is_create: bool) -> dict:
    if is_create:
        require_fields(data, ["name", "email"])
    values = {k: data[k] for k in ALLOWED_FIELDS if k in data}
    if "status" in values:
        values["status"] = parse_enum(VolunteerStatus, values["status"], "status")
    return values


volunteers_bp = build_crud_blueprint(
    "volunteers",
    Volunteer,
    searchable_fields=["name", "email", "city", "area_of_interest"],
    parse_payload=_parse_payload,
)