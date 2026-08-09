import { Badge } from "@/components/ui/badge";
import type { Partner } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

const typeLabel: Record<Partner["partner_type"], string> = {
  donor: "Donor",
  government: "Government",
  ngo: "NGO",
  corporate: "Corporate",
  other: "Other",
};

export const partnersConfig: ResourceConfig<Partner> = {
  key: "partners",
  label: "Partners",
  singularLabel: "Partner",
  description: "Manage donor, government, and NGO partners shown on the website.",
  endpoint: "/partners",
  searchPlaceholder: "Search partners...",
  columns: [
    {
      key: "name",
      label: "Partner",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded bg-muted">
            {row.logo_url && <img src={row.logo_url} alt="" className="h-full w-full object-contain" />}
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: "partner_type",
      label: "Type",
      render: (row) => <Badge variant="secondary">{typeLabel[row.partner_type]}</Badge>,
    },
    { key: "website_url", label: "Website" },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "secondary"}>
          {row.is_active ? "Active" : "Hidden"}
        </Badge>
      ),
    },
  ],
  fields: [
    { name: "logo_url", label: "Logo", type: "image", colSpan: 2 },
    { name: "name", label: "Name", type: "text", required: true, colSpan: 2 },
    {
      name: "partner_type",
      label: "Type",
      type: "select",
      required: true,
      options: [
        { label: "Donor", value: "donor" },
        { label: "Government", value: "government" },
        { label: "NGO", value: "ngo" },
        { label: "Corporate", value: "corporate" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "website_url", label: "Website URL", type: "url" },
    { name: "description", label: "Description", type: "textarea", colSpan: 2 },
    { name: "display_order", label: "Display order", type: "number" },
    { name: "is_active", label: "Active on website", type: "boolean" },
  ],
};
