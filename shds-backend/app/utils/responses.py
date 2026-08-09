"""
Standard response envelope helpers.

Keeping every endpoint's response shape consistent makes the frontend's
API client (currently the tRPC client, later a plain REST client) simpler
and more predictable. Not wired into any routes yet — routes will import
these once features are implemented.
"""

from __future__ import annotations

from typing import Any

from flask import jsonify


def success(data: Any = None, message: str | None = None, status_code: int = 200):
    """Build a consistent success envelope: {success, data, message}."""
    payload = {"success": True, "data": data}
    if message is not None:
        payload["message"] = message
    return jsonify(payload), status_code


def error(message: str, status_code: int = 400, errors: Any = None, code: str | None = None):
    """Build a consistent error envelope: {success, message, errors, code}."""
    payload = {"success": False, "message": message}
    if errors is not None:
        payload["errors"] = errors
    if code is not None:
        payload["code"] = code
    return jsonify(payload), status_code


def paginated(items: list[Any], page: int, per_page: int, total: int):
    """Build a consistent paginated envelope for list endpoints."""
    payload = {
        "success": True,
        "data": items,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": (total + per_page - 1) // per_page if per_page else 0,
        },
    }
    return jsonify(payload), 200
