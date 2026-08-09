"""
Custom application exceptions and centralized error-handler registration.

Feature code should raise APIError (or a subclass) instead of returning
error responses ad-hoc. register_error_handlers() wires these into Flask
so every error — expected or not — comes back as the same JSON envelope
defined in app/utils/responses.py.
"""

from __future__ import annotations

from flask import Flask
from werkzeug.exceptions import HTTPException

from app.utils.responses import error


class APIError(Exception):
    """Base class for all application-raised API errors."""

    status_code = 400
    code = "api_error"

    def __init__(self, message: str, status_code: int | None = None, errors=None, code: str | None = None):
        super().__init__(message)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        if code is not None:
            self.code = code
        self.errors = errors


class NotFoundError(APIError):
    status_code = 404
    code = "not_found"


class ValidationError(APIError):
    status_code = 422
    code = "validation_error"


class UnauthorizedError(APIError):
    status_code = 401
    code = "unauthorized"


class ForbiddenError(APIError):
    status_code = 403
    code = "forbidden"


class ConflictError(APIError):
    status_code = 409
    code = "conflict"


def register_error_handlers(app: Flask) -> None:
    """Attach centralized JSON error handlers to the Flask app."""

    @app.errorhandler(APIError)
    def handle_api_error(exc: APIError):
        return error(exc.message, exc.status_code, errors=exc.errors, code=exc.code)

    @app.errorhandler(HTTPException)
    def handle_http_exception(exc: HTTPException):
        return error(exc.description or exc.name, exc.code or 500, code="http_error")

    @app.errorhandler(Exception)
    def handle_unexpected_error(exc: Exception):
        app.logger.exception("Unhandled exception")
        if app.debug or app.testing:
            return error(str(exc), 500, code="internal_error")
        return error("An unexpected error occurred.", 500, code="internal_error")
