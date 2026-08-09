"""
Generic CRUD blueprint factory.

Every admin-managed resource (Programs, Projects, Gallery, Partners,
Reports, Donations, Team Members, Volunteers, Contact Messages) needs
the same shape of endpoint: paginated+searchable list, get-by-id,
create, update, delete — all JWT-protected, all returning the same
{success, data, pagination} envelope.
"""

from __future__ import annotations

from typing import Callable, Optional, Sequence

from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from sqlalchemy import or_

from app.extensions import db
from app.utils.errors import NotFoundError
from app.utils.responses import paginated, success


def build_crud_blueprint(
    name: str,
    model,
    *,
    searchable_fields: Sequence[str] = (),
    parse_payload: Optional[Callable[[dict, bool], dict]] = None,
    serialize: Optional[Callable[[object], dict]] = None,
    default_sort_field: str = "created_at",
    allow_create: bool = True,
    allow_delete: bool = True,
):
    bp = Blueprint(name, __name__)
    _serialize = serialize or (lambda obj: obj.to_dict())

    def _apply_search(query, term: str):
        if not term or not searchable_fields:
            return query
        like = f"%{term}%"
        conditions = [getattr(model, field).ilike(like) for field in searchable_fields]
        return query.filter(or_(*conditions))

    @bp.get("/")
    @jwt_required()
    def list_items():
        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 10, type=int), 100)
        search_term = request.args.get("search", "", type=str)
        sort_dir = request.args.get("sort_dir", "desc")

        query = _apply_search(model.query, search_term)

        sort_col = getattr(model, default_sort_field, None)
        if sort_col is not None:
            query = query.order_by(sort_col.desc() if sort_dir == "desc" else sort_col.asc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()

        return paginated([_serialize(item) for item in items], page, per_page, total)

    @bp.get("/<int:item_id>")
    @jwt_required()
    def get_item(item_id: int):
        item = db.session.get(model, item_id)
        if not item:
            raise NotFoundError(f"{model.__name__} not found.")
        return success(data=_serialize(item))

    if allow_create:

        @bp.post("/")
        @jwt_required()
        def create_item():
            data = request.get_json(silent=True) or {}
            values = parse_payload(data, True) if parse_payload else data
            item = model(**values)
            db.session.add(item)
            db.session.commit()
            return success(data=_serialize(item), status_code=201)

    @bp.put("/<int:item_id>")
    @jwt_required()
    def update_item(item_id: int):
        item = db.session.get(model, item_id)
        if not item:
            raise NotFoundError(f"{model.__name__} not found.")
        data = request.get_json(silent=True) or {}
        values = parse_payload(data, False) if parse_payload else data
        for key, value in values.items():
            setattr(item, key, value)
        db.session.commit()
        return success(data=_serialize(item))

    if allow_delete:

        @bp.delete("/<int:item_id>")
        @jwt_required()
        def delete_item(item_id: int):
            item = db.session.get(model, item_id)
            if not item:
                raise NotFoundError(f"{model.__name__} not found.")
            db.session.delete(item)
            db.session.commit()
            return success(message="Deleted.")

    return bp