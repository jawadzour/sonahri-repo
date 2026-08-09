import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { messagesConfig } from "@/config/resources/messages";

export default function ContactMessagesPage() {
  return <ResourceListPage config={messagesConfig} />;
}
