"""
Small parsing helpers used by each feature's parse_payload() function
when turning a JSON request body into typed column values.
"""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from typing import Optional, Type

from app.utils.errors import ValidationError


def parse_enum(enum_cls: Type, value, field_name: str):
    if value is None:
        return None
    try:
        return enum_cls(value)
    except ValueError:
        allowed = ", ".join(e.value for e in enum_cls)
        raise ValidationError(f"Invalid value for {field_name}. Allowed: {allowed}")


def parse_date(value) -> Optional[date]:
    if not value:
        return None
    if isinstance(value, date):
        return value
    try:
        return datetime.fromisoformat(str(value)[:10]).date()
    except ValueError:
        raise ValidationError("Dates must be in YYYY-MM-DD format.")


def parse_decimal(value, field_name: str = "amount") -> Decimal:
    try:
        return Decimal(str(value))
    except (InvalidOperation, TypeError):
        raise ValidationError(f"{field_name} must be a valid number.")


def require_fields(data: dict, fields: list[str]) -> None:
    missing = [f for f in fields if not data.get(f)]
    if missing:
        raise ValidationError(f"Missing required field(s): {', '.join(missing)}.")
    