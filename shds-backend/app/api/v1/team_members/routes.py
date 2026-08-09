from app.models.team_member import TeamMember
from app.utils.crud_factory import build_crud_blueprint
from app.utils.parsing import require_fields

ALLOWED_FIELDS = [
    "name", "designation", "department", "bio", "photo_url",
    "email", "linkedin_url", "display_order", "is_active",
]


def _parse_payload(data: dict, is_create: bool) -> dict:
    if is_create:
        require_fields(data, ["name", "designation"])
    return {k: data[k] for k in ALLOWED_FIELDS if k in data}


team_members_bp = build_crud_blueprint(
    "team_members",
    TeamMember,
    searchable_fields=["name", "designation", "department"],
    parse_payload=_parse_payload,
)