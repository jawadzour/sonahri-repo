"""
Shared enum types used across models.

Kept as plain Python enums (not SQLAlchemy-native postgres ENUM types) so
they map to a portable VARCHAR + CHECK constraint via db.Enum, making it
painless to add new values later via a migration instead of an
ALTER TYPE dance.
"""

import enum


class AdminRole(str, enum.Enum):
    ADMIN = "admin"
    SUPERADMIN = "superadmin"


class ProjectStatus(str, enum.Enum):
    PLANNED = "planned"
    ONGOING = "ongoing"
    COMPLETED = "completed"


class DonationStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class PartnerType(str, enum.Enum):
    DONOR = "donor"
    GOVERNMENT = "government"
    NGO = "ngo"
    CORPORATE = "corporate"
    OTHER = "other"


class ReportType(str, enum.Enum):
    ANNUAL = "annual"
    FINANCIAL = "financial"
    IMPACT = "impact"
    OTHER = "other"


class InquiryType(str, enum.Enum):
    GENERAL = "general"
    PARTNERSHIP = "partnership"
    DONATION = "donation"
    VOLUNTEERING = "volunteering"
    MEDIA = "media"
    OTHER = "other"
    
class VolunteerStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"