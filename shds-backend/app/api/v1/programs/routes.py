from app.models.program import Program
from app.utils.crud_factory import build_crud_blueprint

ALLOWED_FIELDS = ["title", "slug", "icon", "summary", "description", "is_active", "display_order"]


def _parse_payload(data: dict, is_create: bool) -> dict:
    return {k: data[k] for k in ALLOWED_FIELDS if k in data}


programs_bp = build_crud_blueprint(
    "programs",
    Program,
    searchable_fields=["title", "slug", "summary"],
    parse_payload=_parse_payload,
)