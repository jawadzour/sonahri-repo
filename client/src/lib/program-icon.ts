/**
 * Maps the free-text `icon` field admins type into a Program record (see
 * shds-admin's Program form, placeholder "GraduationCap (lucide icon)") to
 * an actual lucide-react component. Deliberately a curated, explicitly
 * imported set rather than `import * as Icons from "lucide-react"` — a
 * wildcard import would pull every lucide icon into the bundle and defeat
 * tree-shaking. Falls back to a generic icon for unrecognized names so a
 * typo in the admin panel never breaks rendering.
 */
import {
  AlertTriangle,
  Baby,
  BookOpen,
  Briefcase,
  Building2,
  Droplet,
  Droplets,
  Globe,
  GraduationCap,
  HandHeart,
  Handshake,
  Heart,
  HeartHandshake,
  Home,
  Leaf,
  MapPin,
  School,
  Shield,
  Sprout,
  Stethoscope,
  TreePine,
  UserCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

const PROGRAM_ICONS: Record<string, LucideIcon> = {
  AlertTriangle,
  Baby,
  BookOpen,
  Briefcase,
  Building2,
  Droplet,
  Droplets,
  Globe,
  GraduationCap,
  HandHeart,
  Handshake,
  Heart,
  HeartHandshake,
  Home,
  Leaf,
  MapPin,
  School,
  Shield,
  Sprout,
  Stethoscope,
  TreePine,
  UserCheck,
  Users,
  Zap,
};

export function getProgramIcon(name: string | null | undefined): LucideIcon {
  if (name && PROGRAM_ICONS[name]) return PROGRAM_ICONS[name];
  return Sprout;
}

// Rotating color theme so cards stay visually varied regardless of how many
// programs admins add — the backend has no per-program color field.
export const PROGRAM_COLOR_THEMES = [
  { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50", border: "border-blue-200", hoverBorder: "hover:border-blue-500", hoverTitle: "group-hover:text-blue-600", hoverBg: "hover:bg-blue-50" },
  { gradient: "from-red-500 to-red-600", bg: "bg-red-50", border: "border-red-200", hoverBorder: "hover:border-red-500", hoverTitle: "group-hover:text-red-600", hoverBg: "hover:bg-red-50" },
  { gradient: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200", hoverBorder: "hover:border-cyan-500", hoverTitle: "group-hover:text-cyan-600", hoverBg: "hover:bg-cyan-50" },
  { gradient: "from-amber-500 to-amber-600", bg: "bg-amber-50", border: "border-amber-200", hoverBorder: "hover:border-amber-500", hoverTitle: "group-hover:text-amber-600", hoverBg: "hover:bg-amber-50" },
  { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", border: "border-purple-200", hoverBorder: "hover:border-purple-500", hoverTitle: "group-hover:text-purple-600", hoverBg: "hover:bg-purple-50" },
  { gradient: "from-orange-500 to-orange-600", bg: "bg-orange-50", border: "border-orange-200", hoverBorder: "hover:border-orange-500", hoverTitle: "group-hover:text-orange-600", hoverBg: "hover:bg-orange-50" },
  { gradient: "from-green-500 to-green-600", bg: "bg-green-50", border: "border-green-200", hoverBorder: "hover:border-green-500", hoverTitle: "group-hover:text-green-600", hoverBg: "hover:bg-green-50" },
] as const;

export function getProgramColorTheme(index: number) {
  return PROGRAM_COLOR_THEMES[index % PROGRAM_COLOR_THEMES.length];
}

// Splits a program's free-text description into intro paragraph lines and
// "- "/"* "-prefixed bullet lines, so admins can write a Key Activities
// list in a plain textarea without a dedicated activities field existing
// on the backend model.
export function splitDescription(description: string | null | undefined): {
  paragraphs: string[];
  bullets: string[];
} {
  if (!description) return { paragraphs: [], bullets: [] };
  const lines = description.split("\n").map((l) => l.trim()).filter(Boolean);
  const paragraphs: string[] = [];
  const bullets: string[] = [];
  for (const line of lines) {
    if (line.startsWith("- ") || line.startsWith("* ")) {
      bullets.push(line.slice(2).trim());
    } else {
      paragraphs.push(line);
    }
  }
  return { paragraphs, bullets };
}
