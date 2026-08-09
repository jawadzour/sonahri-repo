import { Badge } from "@/components/ui/badge";
import { truncate } from "@/lib/format";
import type { ContentBlock } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

export const aboutCmsConfig: ResourceConfig<ContentBlock> = {
  key: "about-cms",
  label: "About CMS",
  singularLabel: "Section",
  description:
    "Manage editable content sections on the public About page (mission, history, values, leadership intro).",
  endpoint: "/cms/about",
  searchPlaceholder: "Search sections...",
  columns: [
    { key: "section_key", label: "Section key", className: "font-mono text-xs" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle", render: (row) => truncate(row.subtitle, 40) },
    {
      key: "is_published",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_published ? "success" : "secondary"}>
          {row.is_published ? "Published" : "Draft"}
        </Badge>
      ),
    },
  ],
  fields: [
    {
      name: "section_key",
      label: "Section key",
      type: "text",
      required: true,
      placeholder: "mission, history, values...",
      description: "A unique identifier the frontend uses to place this content.",
    },
    { name: "title", label: "Title", type: "text", colSpan: 2 },
    { name: "subtitle", label: "Subtitle", type: "text", colSpan: 2 },
    { name: "body", label: "Body content", type: "richtext", colSpan: 2 },
    { name: "image_url", label: "Image", type: "image", colSpan: 2 },
    { name: "display_order", label: "Display order", type: "number" },
    { name: "is_published", label: "Published", type: "boolean" },
  ],
  emptyStateTitle: "No about-page sections yet",
};
