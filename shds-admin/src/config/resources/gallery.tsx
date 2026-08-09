import { Badge } from "@/components/ui/badge";
import type { GalleryImage } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

export const galleryConfig: ResourceConfig<GalleryImage> = {
  key: "gallery",
  label: "Gallery",
  singularLabel: "Image",
  description: "Manage photos shown on the public Gallery page, grouped by category.",
  endpoint: "/gallery",
  searchPlaceholder: "Search by category or caption...",
  columns: [
    {
      key: "image_url",
      label: "Preview",
      render: (row) => (
        <div className="h-12 w-16 overflow-hidden rounded bg-muted">
          {row.image_url && (
            <img src={row.image_url} alt={row.alt_text ?? ""} className="h-full w-full object-cover" />
          )}
        </div>
      ),
    },
    { key: "category", label: "Category" },
    { key: "caption", label: "Caption" },
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
    { name: "image_url", label: "Image", type: "image", required: true, colSpan: 2 },
    { name: "category", label: "Category", type: "text", required: true, placeholder: "e.g. Education Programs" },
    { name: "caption", label: "Caption", type: "text", colSpan: 2 },
    { name: "alt_text", label: "Alt text (accessibility)", type: "text", colSpan: 2 },
    { name: "display_order", label: "Display order", type: "number" },
    { name: "is_published", label: "Published", type: "boolean" },
  ],
};
