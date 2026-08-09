from datetime import datetime, timezone

from app.models.report import Report
from app.models.enums import ReportType
from app.utils.crud_factory import build_crud_blueprint
from app.utils.parsing import parse_enum

ALLOWED_FIELDS = ["title", "description", "file_url", "report_type", "year", "is_public"]


def _parse_payload(data: dict, is_create: bool) -> dict:
    values = {k: data[k] for k in ALLOWED_FIELDS if k in data}
    if "report_type" in values:
        values["report_type"] = parse_enum(ReportType, values["report_type"], "report_type")
    if is_create and values.get("is_public", True):
        values["published_at"] = datetime.now(timezone.utc)
    return values


reports_bp = build_crud_blueprint(
    "reports",
    Report,
    searchable_fields=["title", "description"],
    parse_payload=_parse_payload,
)