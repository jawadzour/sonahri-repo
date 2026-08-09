import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { partnersConfig } from "@/config/resources/partners";

export default function PartnersPage() {
  return <ResourceListPage config={partnersConfig} />;
}
