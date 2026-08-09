"""
Email sending utility.

send_email() is safe to call even before real SMTP credentials exist:
if MAIL_ENABLED is False (the default) or credentials are missing, it
logs what *would* have been sent instead of raising — so feature code
(contact form, volunteer signup) can call it unconditionally without
needing to know whether email is configured yet.

To actually send emails: set MAIL_ENABLED=True and fill in MAIL_SERVER /
MAIL_USERNAME / MAIL_PASSWORD / MAIL_DEFAULT_SENDER in .env. For Gmail,
MAIL_USERNAME is the Gmail address and MAIL_PASSWORD must be a 16-character
Google "App Password" (not the regular account password).
"""

from __future__ import annotations

import logging

from flask import current_app
from flask_mail import Message

from app.extensions import mail

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, body: str, html: str | None = None) -> bool:
    """Best-effort send. Returns True if actually sent, False if skipped/failed."""
    if not current_app.config.get("MAIL_ENABLED"):
        logger.info("MAIL_ENABLED is False — skipping email to %s: %s", to, subject)
        return False

    if not current_app.config.get("MAIL_USERNAME") or not current_app.config.get("MAIL_PASSWORD"):
        logger.warning("Email is enabled but MAIL_USERNAME/MAIL_PASSWORD are not set — skipping.")
        return False

    try:
        message = Message(subject=subject, recipients=[to], body=body, html=html)
        mail.send(message)
        return True
    except Exception:
        logger.exception("Failed to send email to %s", to)
        return False