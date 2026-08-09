import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { programsConfig } from "@/config/resources/programs";

export default function ProgramsPage() {
  return <ResourceListPage config={programsConfig} />;
}
