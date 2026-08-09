"""
Shared local-disk file upload helper.

Used by both app/api/v1/media/routes.py (admin Media Library) and
app/api/v1/public/routes.py (donation payment screenshots), so the
save-to-disk logic exists in exactly one place. Swapping to S3/cloud
storage later only means changing save_uploaded_file() here.
"""

from __future__ import annotations

import os
import uuid

from flask import current_app
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from app.utils.errors import ValidationError


def is_allowed_upload(filename: str) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    return ext in current_app.config["ALLOWED_UPLOAD_EXTENSIONS"]


def save_uploaded_file(file_storage: FileStorage) -> tuple[str, str, int]:
    """Saves the upload to disk and returns (unique_filename, url, size_bytes)."""
    if not file_storage or file_storage.filename == "":
        raise ValidationError("No file selected.")

    if not is_allowed_upload(file_storage.filename):
        allowed = ", ".join(sorted(current_app.config["ALLOWED_UPLOAD_EXTENSIONS"]))
        raise ValidationError(f"Unsupported file type. Allowed: {allowed}")

    original_name = secure_filename(file_storage.filename or "upload")
    ext = original_name.rsplit(".", 1)[-1].lower() if "." in original_name else ""
    unique_name = f"{uuid.uuid4().hex}.{ext}" if ext else uuid.uuid4().hex

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    destination = os.path.join(upload_folder, unique_name)
    file_storage.save(destination)
    size_bytes = os.path.getsize(destination)

    base_url = current_app.config["BACKEND_BASE_URL"].rstrip("/")
    url = f"{base_url}/uploads/{unique_name}"
    return unique_name, url, size_bytes