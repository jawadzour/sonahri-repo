"""
Branded HTML email templates for submitter-facing confirmation emails
(contact form, donations). Inline styles only — email clients strip
<style> blocks / external CSS unreliably.
"""

from __future__ import annotations

from decimal import Decimal

BRAND_GREEN = "#2d8659"
TEXT_DARK = "#1f2937"
TEXT_MUTED = "#6b7280"
BORDER = "#e5e7eb"
ORG_NAME = "Sonahri Humanitarian Development Society"

PAYMENT_METHOD_LABELS = {
    "bank_transfer": "Bank Transfer",
    "jazzcash": "JazzCash",
    "easypaisa": "Easypaisa",
}


def _wrap_email(title: str, body_html: str) -> str:
    return f"""\
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:24px 12px;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid {BORDER};">
      <tr>
        <td style="background-color:{BRAND_GREEN};padding:24px 32px;">
          <span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">SHDS</span>
          <div style="color:#ffffff;font-size:15px;margin-top:4px;opacity:0.9;">{title}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;color:{TEXT_DARK};font-size:15px;line-height:1.6;">
          {body_html}
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px;border-top:1px solid {BORDER};color:{TEXT_MUTED};font-size:12px;">
          &copy; {ORG_NAME} (SHDS)
        </td>
      </tr>
    </table>
  </body>
</html>"""


def contact_confirmation_html(name: str) -> str:
    body_html = f"""\
          <p>Hi {name},</p>
          <p>Thank you for reaching out to {ORG_NAME}. We've received your
          message and will get back to you soon.</p>
          <p style="margin-top:24px;">&mdash; SHDS Team</p>"""
    return _wrap_email("We received your message", body_html)


def donation_confirmation_html(
    donor_name: str,
    amount: Decimal,
    currency: str,
    payment_method: str | None,
    transaction_reference: str,
) -> str:
    method_label = PAYMENT_METHOD_LABELS.get(payment_method or "", payment_method or "-")
    rows = "".join(
        f"""\
          <tr>
            <td style="padding:8px 0;color:{TEXT_MUTED};">{label}</td>
            <td style="padding:8px 0;text-align:right;font-weight:bold;">{value}</td>
          </tr>"""
        for label, value in [
            ("Amount", f"{currency} {amount:,.2f}"),
            ("Payment method", method_label),
            ("Transaction reference", transaction_reference),
        ]
    )
    body_html = f"""\
          <p>Hi {donor_name},</p>
          <p>Thank you for your generous donation to {ORG_NAME}. Our team
          will verify your payment shortly and reach out if anything else
          is needed.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-top:1px solid {BORDER};font-size:14px;">
            {rows}
          </table>
          <p style="margin-top:24px;">&mdash; SHDS Team</p>"""
    return _wrap_email("Thank you for your donation", body_html)
