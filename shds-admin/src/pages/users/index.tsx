import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { usersConfig } from "@/config/resources/users";

export default function UsersPage() {
  return <ResourceListPage config={usersConfig} />;
}
