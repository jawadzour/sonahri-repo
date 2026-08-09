import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { donationsConfig } from "@/config/resources/donations";

export default function DonationsPage() {
  return <ResourceListPage config={donationsConfig} />;
}
