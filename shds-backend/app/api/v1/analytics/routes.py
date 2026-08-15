"""
Analytics — self-hosted page-view stats for the admin dashboard's visitor
widgets. Read-only and JWT-protected; the write side (recording a page
view) lives on the public blueprint's unauthenticated POST /public/track,
since only the public site posts views but only admins read the summary.
"""

from __future__ import annotations

from collections import Counter
from datetime import datetime, timedelta, timezone

from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.page_view import PageView
from app.utils.responses import success

analytics_bp = Blueprint("analytics", __name__)

TREND_DAYS = 30
TOP_PAGES_LIMIT = 5


@analytics_bp.get("/summary")
@jwt_required()
def get_analytics_summary():
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(days=TREND_DAYS)

    # Pulled into Python rather than aggregated in SQL (GROUP BY date(...))
    # because date-truncation functions aren't portable between this
    # project's SQLite-local / Postgres-prod setup. Row volume for a single
    # NGO site's 30-day window is small enough that this is cheap either way.
    rows = (
        db.session.query(PageView.created_at, PageView.visitor_hash, PageView.path)
        .filter(PageView.created_at >= window_start)
        .all()
    )

    daily_counts: Counter = Counter()
    page_counts: Counter = Counter()
    unique_hashes: set[str] = set()
    for created_at, visitor_hash, path in rows:
        daily_counts[created_at.date().isoformat()] += 1
        page_counts[path] += 1
        unique_hashes.add(visitor_hash)

    trend = []
    for offset in range(TREND_DAYS - 1, -1, -1):
        day = (now - timedelta(days=offset)).date().isoformat()
        trend.append({"date": day, "views": daily_counts.get(day, 0)})

    top_pages = [
        {"path": path, "views": count}
        for path, count in page_counts.most_common(TOP_PAGES_LIMIT)
    ]

    return success(
        data={
            "total_views": PageView.query.count(),
            "unique_visitors_30d": len(unique_hashes),
            "views_today": daily_counts.get(now.date().isoformat(), 0),
            "trend": trend,
            "top_pages": top_pages,
        }
    )
