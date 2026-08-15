import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";
import Seo from "@/components/Seo";
import { fetchGallery, type PublicGalleryImage } from "@/lib/shds-api";

// Optional nicer subtitles for known categories — the backend only stores
// a flat category string per image, so any category not listed here still
// renders fine with just its name as the heading.
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Education Programs": "Children learning and growing in our education initiatives",
  "Health & Nutrition": "Community health awareness and maternal care programs",
  "WASH Initiatives": "Water, sanitation, and hygiene projects in rural communities",
  "Women Empowerment": "Women's groups, training, and community participation",
  "Disaster Response": "Emergency relief and rehabilitation efforts",
  "Community Engagement": "Community mobilization and social development activities",
};

function groupByCategory(images: PublicGalleryImage[]) {
  const order: string[] = [];
  const groups = new Map<string, PublicGalleryImage[]>();
  for (const image of images) {
    if (!groups.has(image.category)) {
      groups.set(image.category, []);
      order.push(image.category);
    }
    groups.get(image.category)!.push(image);
  }
  return order.map((category) => ({
    category,
    images: groups.get(category)!.sort((a, b) => a.display_order - b.display_order),
  }));
}

export default function Gallery() {
  const [images, setImages] = useState<PublicGalleryImage[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGallery()
      .then(setImages)
      .catch(() => setImages(null))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = images ? groupByCategory(images) : [];

  return (
    <div className="min-h-screen bg-white">
      <Seo path="/gallery" />
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Gallery</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl">
            Visual stories from our field work across Sindh
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-600 py-16">Photos will be added here soon.</p>
          ) : (
            <div className="space-y-16">
              {categories.map(({ category, images: categoryImages }) => (
                <div key={category}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{category}</h2>
                  {CATEGORY_DESCRIPTIONS[category] && (
                    <p className="text-gray-600 text-base sm:text-lg mb-8">{CATEGORY_DESCRIPTIONS[category]}</p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    {categoryImages.map((image) => (
                      <GalleryCard key={image.id} image={image} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Want to See More?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            For more detailed case studies, field reports, and photography, please reach out to our team directly.
          </p>
        </div>
      </section>
    </div>
  );
}

function GalleryCard({ image }: { image: PublicGalleryImage }) {
  const [failed, setFailed] = useState(false);
  const label = image.alt_text || image.caption || image.category;

  return (
    <Card
      className="group overflow-hidden bg-white border-2 border-[#2d8659]
  rounded-2xl shadow-md hover:border-orange-500
  hover:bg-green-50 hover:shadow-2xl
  hover:-translate-y-2 transition-all duration-300 py-0 gap-0"
    >
      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 relative group overflow-hidden">
        {!failed ? (
          <img
            src={image.image_url}
            alt={label}
            onError={() => setFailed(true)}
            className="absolute inset-0 w-full h-full object-cover
group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d8659]/20 to-[#1e5a96]/20 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end justify-start p-4">
          <p className="text-white text-sm font-semibold
translate-y-3 opacity-0
group-hover:translate-y-0
group-hover:opacity-100
transition-all duration-300">
            {label}
          </p>
        </div>
      </div>
      {image.caption && (
        <div className="p-4 bg-white group-hover:bg-green-50 transition-colors duration-300">
          <p className="text-gray-700 font-medium group-hover:text-[#2d8659] transition-colors duration-300">
            {image.caption}
          </p>
        </div>
      )}
    </Card>
  );
}
