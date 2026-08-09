"""
User Management feature — CRUD over Admin accounts.
"""

from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import or_

from app.extensions import db
from app.models.admin import Admin
from app.models.enums import AdminRole
from app.utils.errors import NotFoundError, ValidationError
from app.utils.parsing import parse_enum, require_fields
from app.utils.responses import paginated, success

users_bp = Blueprint("users", __name__)


@users_bp.get("/")
@jwt_required()
def list_users():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 10, type=int), 100)
    search_term = request.args.get("search", "", type=str)

    query = Admin.query
    if search_term:
        like = f"%{search_term}%"
        query = query.filter(or_(Admin.name.ilike(like), Admin.email.ilike(like)))

    query = query.order_by(Admin.created_at.desc())
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()

    return paginated([item.to_dict() for item in items], page, per_page, total)


@users_bp.get("/<int:item_id>")
@jwt_required()
def get_user(item_id: int):
    admin = db.session.get(Admin, item_id)
    if not admin:
        raise NotFoundError("Admin user not found.")
    return success(data=admin.to_dict())


@users_bp.post("/")
@jwt_required()
def create_user():
    data = request.get_json(silent=True) or {}
    require_fields(data, ["name", "email", "password"])

    email = data["email"].strip().lower()
    if Admin.query.filter_by(email=email).first():
        raise ValidationError("An admin with this email already exists.")

    role = parse_enum(AdminRole, data.get("role", "admin"), "role")

    admin = Admin(
        name=data["name"],
        email=email,
        role=role,
        is_active=data.get("is_active", True),
    )
    admin.set_password(data["password"])
    db.session.add(admin)
    db.session.commit()
    return success(data=admin.to_dict(), status_code=201)


@users_bp.put("/<int:item_id>")
@jwt_required()
def update_user(item_id: int):
    admin = db.session.get(Admin, item_id)
    if not admin:
        raise NotFoundError("Admin user not found.")

    data = request.get_json(silent=True) or {}

    if "name" in data:
        admin.name = data["name"]
    if "email" in data:
        new_email = data["email"].strip().lower()
        existing = Admin.query.filter(Admin.email == new_email, Admin.id != item_id).first()
        if existing:
            raise ValidationError("An admin with this email already exists.")
        admin.email = new_email
    if "role" in data:
        admin.role = parse_enum(AdminRole, data["role"], "role")
    if "is_active" in data:
        admin.is_active = data["is_active"]
    if data.get("password"):
        admin.set_password(data["password"])

    db.session.commit()
    return success(data=admin.to_dict())


@users_bp.delete("/<int:item_id>")
@jwt_required()
def delete_user(item_id: int):
    admin = db.session.get(Admin, item_id)
    if not admin:
        raise NotFoundError("Admin user not found.")

    current_identity = get_jwt_identity()
    if current_identity and int(current_identity) == item_id:
        raise ValidationError("You can't delete your own account while signed in.")

    db.session.delete(admin)
    db.session.commit()
    return success(message="Deleted.")