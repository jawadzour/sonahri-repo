export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = "planned" | "ongoing" | "completed";
export type DonationStatus = "pending" | "completed" | "failed" | "refunded";
export type PartnerType = "donor" | "government" | "ngo" | "corporate" | "other";
export type ReportType = "annual" | "financial" | "impact" | "other";
export type InquiryType =
  | "general"
  | "partnership"
  | "donation"
  | "volunteering"
  | "media"
  | "other";
export type AdminRole = "admin" | "superadmin";
export type VolunteerStatus = "pending" | "approved" | "rejected";
