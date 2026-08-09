import { Badge } from "@/components/ui/badge";
import { formatDateTime, truncate } from "@/lib/format";
import type { ContactMessage } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

const typeLabel: Record<ContactMessage["inquiry_type"], string> = {
  general: "General",
  partnership: "Partnership",
  donation: "Donation/Support",
  volunteering: "Volunteering",
  media: "Media",
  other: "Other",
};

export const messagesConfig: ResourceConfig<ContactMessage> = {
  key: "contact-messages",
  label: "Contact Messages",
  singularLabel: "Message",
  description: "Messages submitted through the public Contact form.",
  endpoint: "/inquiries",
  searchPlaceholder: "Search by name, email, or subject...",
  canCreate: false,
  columns: [
    {
      key: "name",
      label: "From",
      render: (row) => (
        <div>
          <p className={row.is_read ? "font-normal" : "font-semibold"}>{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "inquiry_type",
      label: "Type",
      render: (row) => <Badge variant="secondary">{typeLabel[row.inquiry_type]}</Badge>,
    },
    { key: "message", label: "Message", render: (row) => truncate(row.message, 60) },
    {
      key: "created_at",
      label: "Received",
      render: (row) => formatDateTime(row.created_at),
    },
    {
      key: "is_read",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_read ? "secondary" : "warning"}>
          {row.is_read ? "Read" : "Unread"}
        </Badge>
      ),
    },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text" },
    { name: "subject", label: "Subject", type: "text", colSpan: 2 },
    {
      name: "inquiry_type",
      label: "Type",
      type: "select",
      options: [
        { label: "General", value: "general" },
        { label: "Partnership", value: "partnership" },
        { label: "Donation/Support", value: "donation" },
        { label: "Volunteering", value: "volunteering" },
        { label: "Media", value: "media" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "message", label: "Message", type: "textarea", colSpan: 2 },
    { name: "is_read", label: "Marked as read", type: "boolean" },
  ],
  emptyStateTitle: "No messages yet",
  emptyStateDescription: "Submissions from the public Contact page will appear here.",
};
