import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import type { GalleryImage } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

function GalleryPreviewCell({ row }: { row: GalleryImage }) {
  const [open, setOpen] = useState(false);
  if (!row.image_url) return <div className="h-12 w-16 rounded bg-muted" />;
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
        className="h-12 w-16 cursor-zoom-in overflow-hidden rounded bg-muted"
      >
        <img src={row.image_url} alt={row.alt_text ?? ""} className="h-full w-full object-cover" />
      </div>
      <ImageLightbox src={row.image_url} alt={row.alt_text ?? row.category} open={open} onOpenChange={setOpen} />
    </>
  );
}

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
      render: (row) => <GalleryPreviewCell row={row} />,
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
