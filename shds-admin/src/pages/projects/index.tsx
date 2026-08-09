import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { projectsConfig } from "@/config/resources/projects";

export default function ProjectsPage() {
  return <ResourceListPage config={projectsConfig} />;
}
