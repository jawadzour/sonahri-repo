import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { reportsConfig } from "@/config/resources/reports";

export default function ReportsPage() {
  return <ResourceListPage config={reportsConfig} />;
}
