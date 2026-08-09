from app.models.project import Project
from app.models.enums import ProjectStatus
from app.utils.crud_factory import build_crud_blueprint
from app.utils.parsing import parse_date, parse_enum

ALLOWED_FIELDS = [
    "title", "slug", "donor", "location", "sector", "status",
    "beneficiaries", "description", "start_date", "end_date", "program_id",
]


def _parse_payload(data: dict, is_create: bool) -> dict:
    values = {k: data[k] for k in ALLOWED_FIELDS if k in data}
    if "status" in values:
        values["status"] = parse_enum(ProjectStatus, values["status"], "status")
    if "start_date" in values:
        values["start_date"] = parse_date(values["start_date"])
    if "end_date" in values:
        values["end_date"] = parse_date(values["end_date"])
    return values


projects_bp = build_crud_blueprint(
    "projects",
    Project,
    searchable_fields=["title", "donor", "location", "sector"],
    parse_payload=_parse_payload,
)