import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

type GalleryImage = {
  file: string;
  alt: string;
  caption: string;
};

export default function Gallery() {
  usePageTitle("Gallery");
  const galleryCategories: { title: string; description: string; images: GalleryImage[] }[] = [
    {
      title: "Education Programs",
      description: "Children learning and growing in our education initiatives",
      images: [
        { file: "education-1.jpg", alt: "Classroom learning session", caption: "Non-formal education in progress" },
        { file: "education-2.jpg", alt: "Girls' education activity", caption: "Empowering girls through education" },
        { file: "education-3.jpg", alt: "Teacher training workshop", caption: "Teacher capacity building session" },
      ],
    },
    {
      title: "Health & Nutrition",
      description: "Community health awareness and maternal care programs",
      images: [
        { file: "health-1.jpg", alt: "Health awareness session", caption: "Community health education" },
        { file: "health-2.jpg", alt: "Nutrition program", caption: "Nutrition support for children" },
        { file: "health-3.jpg", alt: "Health camp", caption: "Community health camp" },
      ],
    },
    {
      title: "WASH Initiatives",
      description: "Water, sanitation, and hygiene projects in rural communities",
      images: [
        { file: "wash-1.jpg", alt: "Water point installation", caption: "Safe water point for community" },
        { file: "wash-2.jpg", alt: "Hygiene promotion", caption: "Hygiene awareness campaign" },
        { file: "wash-3.jpg", alt: "Latrine construction", caption: "Community sanitation facility" },
      ],
    },
    {
      title: "Women Empowerment",
      description: "Women's groups, training, and community participation",
      images: [
        { file: "women-1.jpg", alt: "Women's group meeting", caption: "Women's community organization meeting" },
        { file: "women-2.jpg", alt: "Skills training", caption: "Vocational skills training for women" },
        { file: "women-3.jpg", alt: "Women leaders", caption: "Women leaders in community decision-making" },
      ],
    },
    {
      title: "Disaster Response",
      description: "Emergency relief and rehabilitation efforts",
      images: [
        { file: "disaster-1.jpg", alt: "Flood relief distribution", caption: "Emergency relief distribution" },
        { file: "disaster-2.jpg", alt: "School rehabilitation", caption: "School rehabilitation after disaster" },
        { file: "disaster-3.jpg", alt: "Community support", caption: "Supporting affected communities" },
      ],
    },
    {
      title: "Community Engagement",
      description: "Community mobilization and social development activities",
      images: [
        { file: "community-1.jpg", alt: "Community gathering", caption: "Community mobilization session" },
        { file: "community-2.jpg", alt: "Volunteer training", caption: "Community volunteer training" },
        { file: "community-3.jpg", alt: "Community event", caption: "Community development activity" },
      ],
    },
  ];


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Gallery</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Visual stories from our field work across Sindh
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-16">
            {galleryCategories.map((category, catIdx) => (
              <div key={catIdx}>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{category.title}</h2>
                <p className="text-gray-600 text-lg mb-8">{category.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.images.map((image, imgIdx) => (
                    <GalleryCard key={imgIdx} image={image} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#2d8659] to-[#1e5a96] text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Want to See More?</h2>
          <p className="text-xl text-blue-100 mb-8">
            For more detailed case studies, field reports, and photography, please reach out to our team directly.
          </p>
        </div>
      </section>
    </div>
  );
}

function GalleryCard({ image }: { image: GalleryImage }) {
  const [failed, setFailed] = useState(false);
  const src = `/images/gallery/${image.file}`;

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
            src={src}
            alt={image.alt}
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
            {image.alt}
          </p>
        </div>
      </div>
      <div className="p-4 bg-white group-hover:bg-green-50 transition-colors duration-300">
        <p className="text-gray-700 font-medium group-hover:text-[#2d8659] transition-colors duration-300">{image.caption}</p>
      </div>
    </Card>
  );
}
