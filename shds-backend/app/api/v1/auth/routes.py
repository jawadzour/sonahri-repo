"""
Auth feature — login, refresh, logout, me, forgot/reset password.
"""

from datetime import datetime, timedelta, timezone

from flask import Blueprint, current_app, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_jwt_identity,
    jwt_required,
)

from app.extensions import db
from app.models.admin import Admin
from app.utils.errors import UnauthorizedError, ValidationError
from app.utils.responses import success
from app.utils.mailer import send_email

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        raise ValidationError("Email and password are required.")

    admin = Admin.query.filter_by(email=email).first()

    if not admin or not admin.check_password(password):
        raise UnauthorizedError("Invalid email or password.")

    if not admin.is_active:
        raise UnauthorizedError("Your account is pending approval from an existing admin.")

    admin.last_login_at = datetime.now(timezone.utc)
    db.session.commit()

    identity = str(admin.id)
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

    return success(
        data={
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": admin.to_dict(),
        }
    )


@auth_bp.post("/refresh")
def refresh():
    data = request.get_json(silent=True) or {}
    refresh_token = data.get("refresh_token")

    if not refresh_token:
        raise ValidationError("refresh_token is required.")

    try:
        decoded = decode_token(refresh_token)
    except Exception:
        raise UnauthorizedError("Invalid or expired refresh token.")

    if decoded.get("type") != "refresh":
        raise UnauthorizedError("Invalid refresh token.")

    identity = decoded.get("sub")
    admin = db.session.get(Admin, int(identity))
    if not admin or not admin.is_active:
        raise UnauthorizedError("Account no longer active.")

    new_access_token = create_access_token(identity=identity)
    new_refresh_token = create_refresh_token(identity=identity)

    return success(
        data={"access_token": new_access_token, "refresh_token": new_refresh_token}
    )


@auth_bp.post("/logout")
@jwt_required()
def logout():
    return success(message="Logged out.")


@auth_bp.get("/me")
@jwt_required()
def me():
    identity = get_jwt_identity()
    admin = db.session.get(Admin, int(identity))
    if not admin:
        raise UnauthorizedError("Account not found.")
    return success(data=admin.to_dict())


@auth_bp.post("/forgot-password")
def forgot_password():
    """
    Always returns a generic success message (whether or not the email
    exists) so this endpoint can't be used to check which emails are
    registered admins. If the email matches an active admin, a reset
    email is sent with a short-lived token.
    """
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()

    if not email:
        raise ValidationError("Email is required.")

    admin = Admin.query.filter_by(email=email).first()

    if admin and admin.is_active:
        reset_token = create_access_token(
            identity=str(admin.id),
            additional_claims={"purpose": "password_reset"},
            expires_delta=timedelta(minutes=30),
        )
        frontend_url = current_app.config["ADMIN_FRONTEND_URL"].rstrip("/")
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"

        send_email(
            to=admin.email,
            subject="Reset your SHDS Admin password",
            body=(
                f"Hi {admin.name},\n\n"
                "We received a request to reset your SHDS Admin password. "
                "This link is valid for 30 minutes:\n\n"
                f"{reset_link}\n\n"
                "If you didn't request this, you can safely ignore this email.\n\n"
                "— SHDS Team"
            ),
        )

    return success(
        message="If an account exists for that email, a reset link has been sent."
    )


@auth_bp.post("/reset-password")
def reset_password():
    data = request.get_json(silent=True) or {}
    token = data.get("token")
    new_password = data.get("password")

    if not token or not new_password:
        raise ValidationError("Token and new password are required.")

    if len(new_password) < 8:
        raise ValidationError("Password must be at least 8 characters.")

    try:
        decoded = decode_token(token)
    except Exception:
        raise UnauthorizedError("This reset link is invalid or has expired.")

    if decoded.get("purpose") != "password_reset":
        raise UnauthorizedError("This reset link is invalid.")

    admin = db.session.get(Admin, int(decoded.get("sub")))
    if not admin or not admin.is_active:
        raise UnauthorizedError("Account not found or disabled.")

    admin.set_password(new_password)
    db.session.commit()

    return success(message="Your password has been reset. You can now sign in.")

@auth_bp.post("/signup")
def signup():
    """
    Public signup — creates an inactive admin account. It cannot log in
    until an existing active admin approves it (User Management ->
    toggle "Account active").
    """
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        raise ValidationError("Name, email, and password are required.")

    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters.")

    if Admin.query.filter_by(email=email).first():
        raise ValidationError("An account with this email already exists.")

    from app.models.enums import AdminRole

    admin = Admin(name=name, email=email, role=AdminRole.ADMIN, is_active=False)
    admin.set_password(password)
    db.session.add(admin)
    db.session.commit()

    return success(
        message="Account created. An existing admin needs to approve it before you can sign in.",
        status_code=201,
    )