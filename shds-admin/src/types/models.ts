import type {
  BaseEntity,
  ProjectStatus,
  DonationStatus,
  PartnerType,
  ReportType,
  InquiryType,
  AdminRole,
  VolunteerStatus,
} from "./common";

// --- Auth / Users ---
export interface AdminUser extends BaseEntity {
  name: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at: string | null;
}

// --- Programs ---
export interface Program extends BaseEntity {
  title: string;
  slug: string;
  icon: string | null;
  summary: string | null;
  description: string | null;
  is_active: boolean;
  display_order: number;
}

// --- Projects ---
export interface Project extends BaseEntity {
  title: string;
  slug: string;
  donor: string | null;
  location: string | null;
  sector: string | null;
  status: ProjectStatus;
  beneficiaries: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  program_id: number | null;
}

// --- Gallery ---
export interface GalleryImage extends BaseEntity {
  category: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  display_order: number;
  is_published: boolean;
  program_id: number | null;
}

// --- Team Members ---
export interface TeamMember extends BaseEntity {
  name: string;
  designation: string;
  department: string | null;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  display_order: number;
  is_active: boolean;
}

// --- Partners ---
export interface Partner extends BaseEntity {
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  partner_type: PartnerType;
  is_active: boolean;
  display_order: number;
}

// --- Reports ---
export interface Report extends BaseEntity {
  title: string;
  description: string | null;
  file_url: string;
  report_type: ReportType;
  year: number | null;
  is_public: boolean;
  published_at: string | null;
}

// --- Contact Messages ---
export interface ContactMessage extends BaseEntity {
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  inquiry_type: InquiryType;
  is_read: boolean;
  responded_at: string | null;
}

// --- Volunteers ---
export interface Volunteer extends BaseEntity {
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  area_of_interest: string | null;
  availability: string | null;
  message: string | null;
  status: VolunteerStatus;
}

// --- Donations ---
export interface Donation extends BaseEntity {
  donor_name: string;
  donor_email: string | null;
  donor_phone: string | null;
  is_anonymous: boolean;
  amount: number;
  currency: string;
  payment_method: string | null;
  transaction_reference: string | null;
  status: DonationStatus;
  message: string | null;
  payment_screenshot_url: string | null;
  program_id: number | null;
}

// --- CMS content blocks (Homepage / About) ---
export interface ContentBlock extends BaseEntity {
  page: "homepage" | "about";
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  display_order: number;
  is_published: boolean;
}

// --- Media Library ---
export interface MediaFile extends BaseEntity {
  filename: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string | null;
}

// --- Settings (singletons) ---
export interface WebsiteSettings {
  site_name: string;
  tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  contact_email: string;
  contact_phone: string | null;
  address: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  maintenance_mode: boolean;
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

// --- Analytics (self-hosted page-view stats) ---
export interface VisitorTrendPoint {
  date: string;
  views: number;
}

export interface TopPage {
  path: string;
  views: number;
}

export interface VisitorSummary {
  total_views: number;
  unique_visitors_30d: number;
  views_today: number;
  trend: VisitorTrendPoint[];
  top_pages: TopPage[];
}

export interface SeoSettings {
  default_meta_title: string;
  default_meta_description: string | null;
  default_og_image_url: string | null;
  google_analytics_id: string | null;
  google_tag_manager_id: string | null;
  google_site_verification: string | null;
  robots_txt: string | null;
  sitemap_enabled: boolean;
}
