import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { aboutCmsConfig } from "@/config/resources/about-cms";

export default function AboutCmsPage() {
  return <ResourceListPage config={aboutCmsConfig} />;
}
