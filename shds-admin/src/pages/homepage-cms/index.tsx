import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { homepageCmsConfig } from "@/config/resources/homepage-cms";

export default function HomepageCmsPage() {
  return <ResourceListPage config={homepageCmsConfig} />;
}
