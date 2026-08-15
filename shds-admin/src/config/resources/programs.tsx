import { Badge } from "@/components/ui/badge";
import { truncate } from "@/lib/format";
import type { Program } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

export const programsConfig: ResourceConfig<Program> = {
  key: "programs",
  label: "Programs",
  singularLabel: "Program",
  description: "Manage the thematic program areas shown on the public Programs page.",
  endpoint: "/programs",
  searchPlaceholder: "Search programs...",
  columns: [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug", className: "font-mono text-xs text-muted-foreground" },
    {
      key: "summary",
      label: "Summary",
      render: (row) => truncate(row.summary, 50),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "secondary"}>
          {row.is_active ? "Active" : "Hidden"}
        </Badge>
      ),
    },
    { key: "display_order", label: "Order" },
  ],
  fields: [
    { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
    { name: "slug", label: "Slug", type: "text", required: true, placeholder: "education-nutrition" },
    {
      name: "icon",
      label: "Icon name",
      type: "text",
      placeholder: "BookOpen",
      description:
        "One of: AlertTriangle, Baby, BookOpen, Briefcase, Building2, Droplet, Droplets, Globe, GraduationCap, HandHeart, Handshake, Heart, HeartHandshake, Home, Leaf, MapPin, School, Shield, Sprout, Stethoscope, TreePine, UserCheck, Users, Zap. Unrecognized names fall back to a default icon.",
    },
    { name: "summary", label: "Short summary", type: "textarea", colSpan: 2 },
    {
      name: "description",
      label: "Full description",
      type: "richtext",
      colSpan: 2,
      description: "Plain text. Prefix a line with \"- \" to render it as a bullet in the Key Activities list.",
    },
    { name: "display_order", label: "Display order", type: "number" },
    { name: "is_active", label: "Active on website", type: "boolean" },
  ],
};
