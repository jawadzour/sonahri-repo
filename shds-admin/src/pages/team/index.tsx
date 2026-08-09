import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { teamMembersConfig } from "@/config/resources/team-members";

export default function TeamMembersPage() {
  return <ResourceListPage config={teamMembersConfig} />;
}
