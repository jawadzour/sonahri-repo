import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { ApiPaginated } from "@/types/api";
import type { Project } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

async function loadDistinctSectors(): Promise<string[]> {
  const { data } = await api.get<ApiPaginated<Project>>("/projects/", { params: { page: 1, per_page: 100 } });
  const sectors = new Set<string>();
  for (const project of data.data) {
    if (project.sector) sectors.add(project.sector);
  }
  return [...sectors].sort((a, b) => a.localeCompare(b));
}

const statusVariant: Record<Project["status"], "secondary" | "success" | "warning"> = {
  planned: "secondary",
  ongoing: "warning",
  completed: "success",
};

export const projectsConfig: ResourceConfig<Project> = {
  key: "projects",
  label: "Projects",
  singularLabel: "Project",
  description: "Manage funded projects shown on the public Projects page.",
  endpoint: "/projects",
  searchPlaceholder: "Search projects...",
  columns: [
    { key: "title", label: "Title" },
    { key: "donor", label: "Donor" },
    { key: "location", label: "Location" },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
  ],
  fields: [
    { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "donor", label: "Donor", type: "text" },
    { name: "location", label: "Location", type: "text" },
    {
      name: "sector",
      label: "Sector / Category",
      type: "combobox",
      placeholder: "Select or add a category...",
      loadOptions: loadDistinctSectors,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Planned", value: "planned" },
        { label: "Ongoing", value: "ongoing" },
        { label: "Completed", value: "completed" },
      ],
    },
    { name: "beneficiaries", label: "Beneficiaries", type: "text", placeholder: "e.g. 5,000 households" },
    { name: "start_date", label: "Start date", type: "date" },
    { name: "end_date", label: "End date", type: "date" },
    { name: "description", label: "Description", type: "richtext", colSpan: 2 },
  ],
};
