"""
Notifications feature — a single summary endpoint the admin dashboard
polls to show unread/pending counts on the bell icon (unread contact
messages, pending volunteer applications, pending donations), plus the
most recent few items across all three for the dropdown preview.
"""

from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.models.contact_message import ContactMessage
from app.models.donation import Donation
from app.models.enums import DonationStatus, VolunteerStatus
from app.models.volunteer import Volunteer
from app.utils.responses import success

notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.get("/summary")
@jwt_required()
def get_notification_summary():
    unread_messages_count = ContactMessage.query.filter_by(is_read=False).count()
    pending_volunteers_count = Volunteer.query.filter_by(status=VolunteerStatus.PENDING).count()
    pending_donations_count = Donation.query.filter_by(status=DonationStatus.PENDING).count()

    recent_messages = (
        ContactMessage.query.filter_by(is_read=False)
        .order_by(ContactMessage.created_at.desc())
        .limit(5)
        .all()
    )
    recent_volunteers = (
        Volunteer.query.filter_by(status=VolunteerStatus.PENDING)
        .order_by(Volunteer.created_at.desc())
        .limit(5)
        .all()
    )
    recent_donations = (
        Donation.query.filter_by(status=DonationStatus.PENDING)
        .order_by(Donation.created_at.desc())
        .limit(5)
        .all()
    )

    return success(
        data={
            "counts": {
                "unread_messages": unread_messages_count,
                "pending_volunteers": pending_volunteers_count,
                "pending_donations": pending_donations_count,
                "total": unread_messages_count + pending_volunteers_count + pending_donations_count,
            },
            "recent_messages": [m.to_dict() for m in recent_messages],
            "recent_volunteers": [v.to_dict() for v in recent_volunteers],
            "recent_donations": [d.to_dict() for d in recent_donations],
        }
    )