/**
 * Lightweight client for the SHDS Flask backend's public API.
 * Uses native fetch — no new dependency needed.
 */

const API_BASE_URL = import.meta.env.VITE_SHDS_API_URL || "http://localhost:5000/api/v1/public";

interface ApiSuccess<T> {
  success: true;
  data?: T;
  message?: string;
}

interface ApiError {
  success: false;
  message: string;
}

async function parseResponse<T>(response: Response): Promise<ApiSuccess<T>> {
  const body: ApiSuccess<T> | ApiError = await response.json();
  if (!response.ok || !body.success) {
    throw new Error((body as ApiError).message || "Something went wrong. Please try again.");
  }
  return body;
}

// --- Page view tracking (self-hosted analytics beacon) ---

export function sendPageView(path: string): void {
  const payload = JSON.stringify({ path, referrer: document.referrer || undefined });
  const url = `${API_BASE_URL}/track`;

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
    return;
  }

  // Fallback for browsers without sendBeacon: keepalive lets the request
  // survive the page navigating away before it completes.
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

// --- Contact form ---

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiryType?: string;
}

export async function submitContactMessage(payload: ContactPayload): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || undefined,
      subject: payload.subject || undefined,
      message: payload.message,
      inquiry_type: payload.inquiryType || "general",
    }),
  });

  const body = await parseResponse<unknown>(response);
  return body.message || "Thank you! Your inquiry has been received.";
}

// --- Programs (for the Donate page's optional program dropdown) ---

export interface PublicProgram {
  id: number;
  title: string;
  slug: string;
}

export async function fetchPrograms(): Promise<PublicProgram[]> {
  const response = await fetch(`${API_BASE_URL}/programs`);
  const body = await parseResponse<PublicProgram[]>(response);
  return body.data || [];
}

// --- Website settings (bank/JazzCash/Easypaisa details for the Donate page) ---

export interface PublicWebsiteSettings {
  site_name: string;
  contact_email: string;
  contact_phone: string | null;
  donation_bank_name: string | null;
  donation_account_title: string | null;
  donation_account_number: string | null;
  donation_iban: string | null;
  donation_swift_code: string | null;
  donation_jazzcash_number: string | null;
  donation_easypaisa_number: string | null;
  donation_raast_id: string | null;
  donation_instructions: string | null;
}

export async function fetchWebsiteSettings(): Promise<PublicWebsiteSettings> {
  const response = await fetch(`${API_BASE_URL}/settings/website`);
  const body = await parseResponse<PublicWebsiteSettings>(response);
  return body.data as PublicWebsiteSettings;
}

// --- Donations ---

export type DonationPaymentMethod = "bank_transfer" | "jazzcash" | "easypaisa";

export interface DonationPayload {
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: string;
  currency?: string;
  programId?: number;
  message?: string;
  paymentMethod: DonationPaymentMethod;
  transactionReference: string;
  isAnonymous?: boolean;
  screenshot?: File | null;
}

export async function submitDonation(payload: DonationPayload): Promise<string> {
  const formData = new FormData();
  formData.append("donor_name", payload.donorName);
  if (payload.donorEmail) formData.append("donor_email", payload.donorEmail);
  if (payload.donorPhone) formData.append("donor_phone", payload.donorPhone);
  formData.append("amount", payload.amount);
  formData.append("currency", payload.currency || "PKR");
  if (payload.programId) formData.append("program_id", String(payload.programId));
  if (payload.message) formData.append("message", payload.message);
  formData.append("payment_method", payload.paymentMethod);
  formData.append("transaction_reference", payload.transactionReference);
  formData.append("is_anonymous", payload.isAnonymous ? "true" : "false");
  if (payload.screenshot) formData.append("payment_screenshot", payload.screenshot);

  const response = await fetch(`${API_BASE_URL}/donations`, {
    method: "POST",
    body: formData,
  });

  const body = await parseResponse<{ id: number; status: string }>(response);
  return body.message || "Thank you for your donation!";
}