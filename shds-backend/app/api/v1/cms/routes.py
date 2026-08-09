"""
CMS feature — editable content blocks for the Homepage and About pages.
"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from sqlalchemy import or_

from app.extensions import db
from app.models.content_block import ContentBlock
from app.utils.errors import NotFoundError, ValidationError
from app.utils.parsing import require_fields
from app.utils.responses import paginated, success

ALLOWED_FIELDS = ["section_key", "title", "subtitle", "body", "image_url", "display_order", "is_published"]


def _build_page_blueprint(name: str, page: str) -> Blueprint:
    bp = Blueprint(name, __name__)

    @bp.get("/")
    @jwt_required()
    def list_blocks():
        query = ContentBlock.query.filter_by(page=page)

        search_term = request.args.get("search", "", type=str)
        if search_term:
            like = f"%{search_term}%"
            query = query.filter(
                or_(ContentBlock.section_key.ilike(like), ContentBlock.title.ilike(like))
            )

        page_num = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 10, type=int), 100)

        query = query.order_by(ContentBlock.display_order.asc(), ContentBlock.id.asc())
        total = query.count()
        items = query.offset((page_num - 1) * per_page).limit(per_page).all()

        return paginated([item.to_dict() for item in items], page_num, per_page, total)

    @bp.get("/<int:item_id>")
    @jwt_required()
    def get_block(item_id: int):
        item = ContentBlock.query.filter_by(id=item_id, page=page).first()
        if not item:
            raise NotFoundError("Content block not found.")
        return success(data=item.to_dict())

    @bp.post("/")
    @jwt_required()
    def create_block():
        data = request.get_json(silent=True) or {}
        require_fields(data, ["section_key"])

        existing = ContentBlock.query.filter_by(page=page, section_key=data["section_key"]).first()
        if existing:
            raise ValidationError(f"A section with key '{data['section_key']}' already exists on this page.")

        values = {k: data[k] for k in ALLOWED_FIELDS if k in data}
        block = ContentBlock(page=page, **values)
        db.session.add(block)
        db.session.commit()
        return success(data=block.to_dict(), status_code=201)

    @bp.put("/<int:item_id>")
    @jwt_required()
    def update_block(item_id: int):
        item = ContentBlock.query.filter_by(id=item_id, page=page).first()
        if not item:
            raise NotFoundError("Content block not found.")

        data = request.get_json(silent=True) or {}
        values = {k: data[k] for k in ALLOWED_FIELDS if k in data}
        for key, value in values.items():
            setattr(item, key, value)
        db.session.commit()
        return success(data=item.to_dict())

    @bp.delete("/<int:item_id>")
    @jwt_required()
    def delete_block(item_id: int):
        item = ContentBlock.query.filter_by(id=item_id, page=page).first()
        if not item:
            raise NotFoundError("Content block not found.")
        db.session.delete(item)
        db.session.commit()
        return success(message="Deleted.")

    return bp


homepage_cms_bp = _build_page_blueprint("homepage_cms", "homepage")
about_cms_bp = _build_page_blueprint("about_cms", "about")