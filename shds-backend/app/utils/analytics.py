"""
Helpers for the self-hosted page-view analytics: privacy-friendly visitor
hashing and lightweight bot filtering. Kept out of routes.py so the logic
is testable on its own and isn't tangled up with request handling.
"""

from __future__ import annotations

import hashlib
from datetime import date

from flask import current_app

_BOT_MARKERS = (
    "bot", "spider", "crawl", "slurp", "curl/", "wget/", "python-requests",
    "headlesschrome", "phantomjs", "facebookexternalhit", "petalbot",
    "ahrefsbot", "semrushbot", "mj12bot", "dataforseo", "bytespider",
)


def is_bot_user_agent(user_agent: str | None) -> bool:
    """Best-effort filter so obvious bots/crawlers don't inflate visitor
    counts. Not exhaustive — it doesn't need to be, since the goal is a
    reasonable "human visitors" number, not airtight bot detection."""
    if not user_agent:
        return True  # no UA at all is almost always a script, not a browser
    ua = user_agent.lower()
    return any(marker in ua for marker in _BOT_MARKERS)


def hash_visitor(ip: str, user_agent: str) -> str:
    """One-way hash of IP + User-Agent + today's date + SECRET_KEY, so the
    same person visiting multiple times in a day collapses to one "unique
    visitor" without ever persisting their raw IP address."""
    salt = current_app.config["SECRET_KEY"]
    raw = f"{ip}|{user_agent}|{date.today().isoformat()}|{salt}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()
