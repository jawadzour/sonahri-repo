from app.models.gallery import Gallery
from app.utils.crud_factory import build_crud_blueprint

ALLOWED_FIELDS = [
    "category", "image_url", "alt_text", "caption",
    "display_order", "is_published", "program_id",
]


def _parse_payload(data: dict, is_create: bool) -> dict:
    return {k: data[k] for k in ALLOWED_FIELDS if k in data}


gallery_bp = build_crud_blueprint(
    "gallery",
    Gallery,
    searchable_fields=["category", "caption"],
    parse_payload=_parse_payload,
)