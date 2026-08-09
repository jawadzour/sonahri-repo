"""
Media Library feature — file upload + tracked media records.

Files are stored on local disk under app.config["UPLOAD_FOLDER"] and
served back via the /uploads/<filename> route registered in
app/__init__.py. The actual save-to-disk logic lives in
app/utils/uploads.py, shared with the public donation screenshot upload.
"""

import os

from flask import Blueprint, current_app, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import or_

from app.extensions import db
from app.models.media_file import MediaFile
from app.utils.errors import NotFoundError, ValidationError
from app.utils.responses import paginated, success
from app.utils.uploads import save_uploaded_file

media_bp = Blueprint("media", __name__)


@media_bp.get("/")
@jwt_required()
def list_media():
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 24, type=int), 100)
    search_term = request.args.get("search", "", type=str)

    query = MediaFile.query
    if search_term:
        like = f"%{search_term}%"
        query = query.filter(or_(MediaFile.filename.ilike(like), MediaFile.alt_text.ilike(like)))

    query = query.order_by(MediaFile.created_at.desc())
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()

    return paginated([item.to_dict() for item in items], page, per_page, total)


@media_bp.post("/upload")
@jwt_required()
def upload_media():
    if "file" not in request.files:
        raise ValidationError("No file part in the request. Use form field name 'file'.")

    file_storage = request.files["file"]
    _, url, size_bytes = save_uploaded_file(file_storage)

    identity = get_jwt_identity()
    media = MediaFile(
        filename=file_storage.filename,
        url=url,
        mime_type=file_storage.mimetype or "application/octet-stream",
        size_bytes=size_bytes,
        uploaded_by_id=int(identity) if identity else None,
    )
    db.session.add(media)
    db.session.commit()

    return success(data=media.to_dict(), status_code=201)


@media_bp.delete("/<int:item_id>")
@jwt_required()
def delete_media(item_id: int):
    media = db.session.get(MediaFile, item_id)
    if not media:
        raise NotFoundError("File not found.")

    filename = media.url.rsplit("/", 1)[-1]
    file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.session.delete(media)
    db.session.commit()
    return success(message="Deleted.")