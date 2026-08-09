"""
Email sending utility, via Brevo's HTTP transactional email API.

Not plain SMTP: Render blocks outbound traffic to SMTP ports (25/465/587)
on free-tier web services to prevent abuse, so Gmail-SMTP-style sending
doesn't work there. Brevo's API sends over HTTPS instead, which isn't
blocked, and its free tier just needs one verified sender address (no
domain/DNS ownership required) to send to any recipient.

send_email() is safe to call even before real credentials exist: if
MAIL_ENABLED is False (the default) or BREVO_API_KEY is missing, it logs
what *would* have been sent instead of raising — so feature code (contact
form, volunteer signup) can call it unconditionally without needing to
know whether email is configured yet.

To actually send emails: set MAIL_ENABLED=True, BREVO_API_KEY (from
Brevo's dashboard → SMTP & API → API Keys), and BREVO_SENDER_EMAIL (must
be verified in Brevo via Single Sender Verification) in .env.
"""

from __future__ import annotations

import logging

import requests
from flask import current_app

logger = logging.getLogger(__name__)

BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email"


def send_email(to: str, subject: str, body: str, html: str | None = None) -> bool:
    """Best-effort send. Returns True if actually sent, False if skipped/failed."""
    if not current_app.config.get("MAIL_ENABLED"):
        logger.info("MAIL_ENABLED is False — skipping email to %s: %s", to, subject)
        return False

    api_key = current_app.config.get("BREVO_API_KEY")
    sender_email = current_app.config.get("BREVO_SENDER_EMAIL")
    if not api_key or not sender_email:
        logger.warning("Email is enabled but BREVO_API_KEY/BREVO_SENDER_EMAIL are not set — skipping.")
        return False

    payload = {
        "sender": {"email": sender_email, "name": current_app.config.get("BREVO_SENDER_NAME", "SHDS")},
        "to": [{"email": to}],
        "subject": subject,
        "textContent": body,
    }
    if html:
        payload["htmlContent"] = html

    try:
        response = requests.post(
            BREVO_SEND_URL,
            json=payload,
            headers={"api-key": api_key, "Content-Type": "application/json"},
            timeout=10,
        )
        response.raise_for_status()
        return True
    except Exception:
        logger.exception("Failed to send email to %s", to)
        return False