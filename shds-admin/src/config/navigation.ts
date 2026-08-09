import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Home,
  Info,
  FolderKanban,
  Briefcase,
  Image,
  Users,
  Handshake,
  FileText,
  MessageSquare,
  HandHeart,
  Wallet,
  Settings,
  Search,
  Library,
  ShieldCheck,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { label: "Homepage CMS", path: "/homepage-cms", icon: Home },
      { label: "About CMS", path: "/about-cms", icon: Info },
      { label: "Programs", path: "/programs", icon: FolderKanban },
      { label: "Projects", path: "/projects", icon: Briefcase },
      { label: "Gallery", path: "/gallery", icon: Image },
      { label: "Team Members", path: "/team", icon: Users },
      { label: "Partners", path: "/partners", icon: Handshake },
      { label: "Reports", path: "/reports", icon: FileText },
    ],
  },
  {
    title: "Engagement",
    items: [
      { label: "Contact Messages", path: "/messages", icon: MessageSquare },
      { label: "Volunteers", path: "/volunteers", icon: HandHeart },
      { label: "Donations", path: "/donations", icon: Wallet },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Media Library", path: "/media-library", icon: Library },
      { label: "Website Settings", path: "/settings", icon: Settings },
      { label: "SEO Settings", path: "/seo", icon: Search },
      { label: "User Management", path: "/users", icon: ShieldCheck },
    ],
  },
];
