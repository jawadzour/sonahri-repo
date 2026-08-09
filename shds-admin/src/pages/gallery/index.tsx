import { ResourceListPage } from "@/pages/resources/resource-list-page";
import { galleryConfig } from "@/config/resources/gallery";

export default function GalleryPage() {
  return <ResourceListPage config={galleryConfig} />;
}
