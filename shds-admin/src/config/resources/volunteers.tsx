import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { Volunteer } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

const statusVariant: Record<Volunteer["status"], "secondary" | "success" | "destructive"> = {
  pending: "secondary",
  approved: "success",
  rejected: "destructive",
};

export const volunteersConfig: ResourceConfig<Volunteer> = {
  key: "volunteers",
  label: "Volunteers",
  singularLabel: "Volunteer",
  description: "Applications submitted by people interested in volunteering.",
  endpoint: "/volunteers",
  searchPlaceholder: "Search volunteers...",
  canCreate: false,
  columns: [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    { key: "city", label: "City" },
    { key: "area_of_interest", label: "Interest" },
    { key: "created_at", label: "Applied", render: (row) => formatDate(row.created_at) },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text" },
    { name: "city", label: "City", type: "text" },
    { name: "area_of_interest", label: "Area of interest", type: "text", colSpan: 2 },
    { name: "availability", label: "Availability", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    { name: "message", label: "Message", type: "textarea", colSpan: 2 },
  ],
  emptyStateTitle: "No volunteer applications yet",
};
