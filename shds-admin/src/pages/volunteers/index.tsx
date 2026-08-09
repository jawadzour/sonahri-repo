import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { volunteersConfig } from "@/config/resources/volunteers";

export default function VolunteersPage() {
  return <ResourceListPage config={volunteersConfig} />;
}
