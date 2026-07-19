import nodemailer from "nodemailer";

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      "[Mailer] SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS missing). Skipping email send."
    );
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendContactNotification(params: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  inquiryType?: string | null;
}): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;

  const to = process.env.CONTACT_NOTIFY_EMAIL || process.env.SMTP_USER;

  try {
    await transport.sendMail({
      from: `"SHDS Website" <${process.env.SMTP_USER}>`,
      to,
      replyTo: params.email,
      subject: `New inquiry: ${params.subject || params.inquiryType || "General"}`,
      text: [
        `Name: ${params.name}`,
        `Email: ${params.email}`,
        `Phone: ${params.phone || "-"}`,
        `Type: ${params.inquiryType || "general"}`,
        "",
        params.message,
      ].join("\n"),
    });
    return true;
  } catch (error) {
    console.error("[Mailer] Failed to send email:", error);
    return false;
  }
}
