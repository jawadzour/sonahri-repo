"""
Public feature — unauthenticated, read-only endpoints for the public
website, plus the public-facing submission forms (contact, volunteer
signup, donation).
"""

from flask import Blueprint, request

from app.extensions import db, limiter
from app.models.content_block import ContentBlock
from app.models.donation import Donation
from app.models.enums import InquiryType
from app.models.gallery import Gallery
from app.models.partner import Partner
from app.models.program import Program
from app.models.project import Project
from app.models.report import Report
from app.models.contact_message import ContactMessage
from app.models.volunteer import Volunteer
from app.models.seo_settings import SeoSettings
from app.models.team_member import TeamMember
from app.models.website_settings import WebsiteSettings
from app.utils.errors import ValidationError
from app.utils.parsing import parse_decimal, parse_enum, require_fields
from app.utils.responses import success
from app.utils.mailer import send_email
from app.utils.email_templates import contact_confirmation_html, donation_confirmation_html
from app.utils.uploads import save_uploaded_file

public_bp = Blueprint("public", __name__)


@public_bp.get("/programs")
def list_public_programs():
    items = Program.query.filter_by(is_active=True).order_by(Program.display_order.asc()).all()
    return success(data=[p.to_dict() for p in items])


@public_bp.get("/projects")
def list_public_projects():
    query = Project.query
    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)
    items = query.order_by(Project.created_at.desc()).all()
    return success(data=[p.to_dict() for p in items])


@public_bp.get("/gallery")
def list_public_gallery():
    query = Gallery.query.filter_by(is_published=True)
    category = request.args.get("category")
    if category:
        query = query.filter_by(category=category)
    items = query.order_by(Gallery.display_order.asc()).all()
    return success(data=[g.to_dict() for g in items])


@public_bp.get("/partners")
def list_public_partners():
    items = Partner.query.filter_by(is_active=True).order_by(Partner.display_order.asc()).all()
    return success(data=[p.to_dict() for p in items])


@public_bp.get("/reports")
def list_public_reports():
    items = Report.query.filter_by(is_public=True).order_by(Report.year.desc()).all()
    return success(data=[r.to_dict() for r in items])


@public_bp.get("/team-members")
def list_public_team_members():
    items = TeamMember.query.filter_by(is_active=True).order_by(TeamMember.display_order.asc()).all()
    return success(data=[t.to_dict() for t in items])


@public_bp.get("/cms/homepage")
def get_homepage_content():
    items = (
        ContentBlock.query.filter_by(page="homepage", is_published=True)
        .order_by(ContentBlock.display_order.asc())
        .all()
    )
    return success(data=[c.to_dict() for c in items])


@public_bp.get("/cms/about")
def get_about_content():
    items = (
        ContentBlock.query.filter_by(page="about", is_published=True)
        .order_by(ContentBlock.display_order.asc())
        .all()
    )
    return success(data=[c.to_dict() for c in items])


@public_bp.get("/settings/website")
def get_public_website_settings():
    return success(data=WebsiteSettings.get_solo().to_dict())


@public_bp.get("/settings/seo")
def get_public_seo_settings():
    return success(data=SeoSettings.get_solo().to_dict())


@public_bp.post("/contact")
@limiter.limit("5 per minute")
def submit_contact_message():
    data = request.get_json(silent=True) or {}
    require_fields(data, ["name", "email", "message"])

    inquiry_type = InquiryType.GENERAL
    if data.get("inquiry_type"):
        inquiry_type = parse_enum(InquiryType, data["inquiry_type"], "inquiry_type")

    message = ContactMessage(
        name=data["name"],
        email=data["email"],
        phone=data.get("phone"),
        subject=data.get("subject"),
        message=data["message"],
        inquiry_type=inquiry_type,
    )
    db.session.add(message)
    db.session.commit()

    send_email(
        to=message.email,
        subject="We received your message — SHDS",
        body=(
            f"Hi {message.name},\n\n"
            "Thank you for reaching out to Sonahri Humanitarian Development Society. "
            "We've received your message and will get back to you soon.\n\n"
            "— SHDS Team"
        ),
        html=contact_confirmation_html(message.name),
    )

    return success(message="Thank you — we'll be in touch soon.", status_code=201)


@public_bp.post("/volunteers")
@limiter.limit("5 per minute")
def submit_volunteer_application():
    data = request.get_json(silent=True) or {}
    require_fields(data, ["name", "email"])

    volunteer = Volunteer(
        name=data["name"],
        email=data["email"],
        phone=data.get("phone"),
        city=data.get("city"),
        area_of_interest=data.get("area_of_interest"),
        availability=data.get("availability"),
        message=data.get("message"),
    )
    db.session.add(volunteer)
    db.session.commit()

    send_email(
        to=volunteer.email,
        subject="Thanks for volunteering — SHDS",
        body=(
            f"Hi {volunteer.name},\n\n"
            "Thank you for applying to volunteer with Sonahri Humanitarian Development "
            "Society. Our team will review your application and reach out soon.\n\n"
            "— SHDS Team"
        ),
    )

    return success(message="Thanks for applying to volunteer — we'll reach out soon.", status_code=201)


@public_bp.post("/donations")
@limiter.limit("10 per minute")
def submit_public_donation():
    """
    Accepts multipart/form-data so an optional payment screenshot can be
    attached. Regular fields come through request.form (not request.json)
    because of that.
    """
    data = request.form
    require_fields(
        dict(data), ["donor_name", "amount", "payment_method", "transaction_reference"]
    )

    amount = parse_decimal(data.get("amount"), "amount")
    if amount <= 0:
        raise ValidationError("Donation amount must be greater than zero.")

    program_id = data.get("program_id")
    program_id = int(program_id) if program_id else None

    screenshot_url = None
    screenshot_file = request.files.get("payment_screenshot")
    if screenshot_file and screenshot_file.filename:
        _, screenshot_url, _ = save_uploaded_file(screenshot_file)

    donation = Donation(
        donor_name=data["donor_name"],
        donor_email=data.get("donor_email") or None,
        donor_phone=data.get("donor_phone") or None,
        is_anonymous=data.get("is_anonymous") == "true",
        amount=amount,
        currency=data.get("currency") or "PKR",
        payment_method=data["payment_method"],
        transaction_reference=data["transaction_reference"],
        message=data.get("message") or None,
        payment_screenshot_url=screenshot_url,
        program_id=program_id,
    )
    db.session.add(donation)
    db.session.commit()

    if donation.donor_email:
        send_email(
            to=donation.donor_email,
            subject="Thank you for your donation — SHDS",
            body=(
                f"Hi {donation.donor_name},\n\n"
                f"Thank you for your generous donation of {donation.currency} {donation.amount}. "
                "Our team will verify your payment shortly and reach out if anything else is needed.\n\n"
                "— SHDS Team"
            ),
            html=donation_confirmation_html(
                donor_name=donation.donor_name,
                amount=donation.amount,
                currency=donation.currency,
                payment_method=donation.payment_method,
                transaction_reference=donation.transaction_reference,
            ),
        )

    return success(
        data={"id": donation.id, "status": donation.status.value},
        message="Thank you for your donation — we'll verify your payment shortly.",
        status_code=201,
    )