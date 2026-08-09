import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { TeamMember } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const teamMembersConfig: ResourceConfig<TeamMember> = {
  key: "team-members",
  label: "Team Members",
  singularLabel: "Team Member",
  description: "Manage staff and board members shown on the public About page.",
  endpoint: "/team-members",
  searchPlaceholder: "Search by name or designation...",
  columns: [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.photo_url ?? undefined} alt={row.name} />
            <AvatarFallback>{initials(row.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "designation", label: "Designation" },
    { key: "department", label: "Department" },
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
    { name: "photo_url", label: "Photo", type: "image", colSpan: 2 },
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "designation", label: "Designation", type: "text", required: true },
    { name: "department", label: "Department", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "linkedin_url", label: "LinkedIn URL", type: "url" },
    { name: "bio", label: "Short bio", type: "textarea", colSpan: 2 },
    { name: "display_order", label: "Display order", type: "number" },
    { name: "is_active", label: "Active on website", type: "boolean" },
  ],
};
