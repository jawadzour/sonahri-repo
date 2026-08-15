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

// --- Programs ---

export interface PublicProgram {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  summary: string | null;
  description: string | null;
}

export async function fetchPrograms(): Promise<PublicProgram[]> {
  const response = await fetch(`${API_BASE_URL}/programs`);
  const body = await parseResponse<PublicProgram[]>(response);
  return body.data || [];
}

// --- Projects ---

export interface PublicProject {
  id: number;
  title: string;
  slug: string;
  donor: string | null;
  location: string | null;
  sector: string | null;
  status: "planned" | "ongoing" | "completed";
  beneficiaries: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  program_id: number | null;
}

export async function fetchProjects(): Promise<PublicProject[]> {
  const response = await fetch(`${API_BASE_URL}/projects`);
  const body = await parseResponse<PublicProject[]>(response);
  return body.data || [];
}

// --- Gallery ---

export interface PublicGalleryImage {
  id: number;
  category: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  display_order: number;
  program_id: number | null;
}

export async function fetchGallery(): Promise<PublicGalleryImage[]> {
  const response = await fetch(`${API_BASE_URL}/gallery`);
  const body = await parseResponse<PublicGalleryImage[]>(response);
  return body.data || [];
}

// --- Team members ---

export interface PublicTeamMember {
  id: number;
  name: string;
  designation: string | null;
  department: string | null;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  display_order: number;
}

export async function fetchTeamMembers(): Promise<PublicTeamMember[]> {
  const response = await fetch(`${API_BASE_URL}/team-members`);
  const body = await parseResponse<PublicTeamMember[]>(response);
  return body.data || [];
}

// --- Partners ---

export interface PublicPartner {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  partner_type: string;
  display_order: number;
}

export async function fetchPartners(): Promise<PublicPartner[]> {
  const response = await fetch(`${API_BASE_URL}/partners`);
  const body = await parseResponse<PublicPartner[]>(response);
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

// --- SEO / analytics settings ---

export interface PublicSeoSettings {
  google_analytics_id: string | null;
  google_tag_manager_id: string | null;
}

export async function fetchSeoSettings(): Promise<PublicSeoSettings> {
  const response = await fetch(`${API_BASE_URL}/settings/seo`);
  const body = await parseResponse<PublicSeoSettings>(response);
  return body.data as PublicSeoSettings;
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