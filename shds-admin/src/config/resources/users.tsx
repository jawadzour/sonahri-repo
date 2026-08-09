import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import type { AdminUser } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

export const usersConfig: ResourceConfig<AdminUser> = {
  key: "users",
  label: "User Management",
  singularLabel: "Admin User",
  description: "Manage who can sign in to this admin dashboard.",
  endpoint: "/users",
  searchPlaceholder: "Search by name or email...",
  columns: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <Badge variant={row.role === "superadmin" ? "default" : "secondary"}>
          {row.role === "superadmin" ? "Super Admin" : "Admin"}
        </Badge>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "warning"}>
          {row.is_active ? "Active" : "Pending Approval"}
        </Badge>
      ),
    },
    {
      key: "last_login_at",
      label: "Last login",
      render: (row) => (row.last_login_at ? formatDateTime(row.last_login_at) : "Never"),
    },
  ],
  fields: [
    { name: "name", label: "Full name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", description: "Leave blank to keep the current password when editing." },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Super Admin", value: "superadmin" },
      ],
    },
    { name: "is_active", label: "Account active", type: "boolean" },
  ],
};
