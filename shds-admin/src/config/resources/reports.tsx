import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Report } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

const typeLabel: Record<Report["report_type"], string> = {
  annual: "Annual Report",
  financial: "Financial Statement",
  impact: "Impact Report",
  other: "Other",
};

export const reportsConfig: ResourceConfig<Report> = {
  key: "reports",
  label: "Reports",
  singularLabel: "Report",
  description: "Manage downloadable annual, financial, and impact reports.",
  endpoint: "/reports",
  searchPlaceholder: "Search reports...",
  columns: [
    { key: "title", label: "Title" },
    {
      key: "report_type",
      label: "Type",
      render: (row) => <Badge variant="secondary">{typeLabel[row.report_type]}</Badge>,
    },
    { key: "year", label: "Year" },
    {
      key: "is_public",
      label: "Visibility",
      render: (row) => (
        <Badge variant={row.is_public ? "success" : "secondary"}>
          {row.is_public ? "Public" : "Private"}
        </Badge>
      ),
    },
    {
      key: "file_url",
      label: "File",
      render: (row) =>
        row.file_url ? (
          <Button variant="ghost" size="sm" asChild>
            <a href={row.file_url} target="_blank" rel="noreferrer">
              <Download className="h-4 w-4" />
              Open
            </a>
          </Button>
        ) : (
          "—"
        ),
    },
  ],
  fields: [
    { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
    {
      name: "report_type",
      label: "Type",
      type: "select",
      required: true,
      options: [
        { label: "Annual Report", value: "annual" },
        { label: "Financial Statement", value: "financial" },
        { label: "Impact Report", value: "impact" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "year", label: "Year", type: "number" },
    { name: "file_url", label: "Report file (PDF)", type: "file", required: true, colSpan: 2, description: "Upload the report PDF or document." },
    { name: "description", label: "Description", type: "textarea", colSpan: 2 },
    { name: "is_public", label: "Publicly visible", type: "boolean" },
  ],
};
