export const SITE_URL = "https://sonahri.org";
export const SITE_NAME = "Sonahri Humanitarian Development Society (SHDS)";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero-bg.jpg`;

export interface PageSeo {
  path: string;
  title: string;
  description: string;
}

// One entry per real route in client/src/App.tsx. Keep in sync with it.
export const pagesSeo: PageSeo[] = [
  {
    path: "/",
    title: "Home",
    description:
      "SHDS mobilizes communities and delivers inclusive development programs in education, health, clean water, women empowerment, and disaster relief across 19 districts of Sindh, Pakistan since 2010.",
  },
  {
    path: "/about",
    title: "About Us",
    description:
      "Learn about Sonahri Humanitarian Development Society's mission, vision, and core values — equity, transparency, participation, integrity, and social justice — guiding our work across Sindh.",
  },
  {
    path: "/programs",
    title: "Our Programs",
    description:
      "Explore SHDS programs in education, health & nutrition, clean water, women's empowerment, disaster relief, community development, and partnerships across Sindh, Pakistan.",
  },
  {
    path: "/projects",
    title: "Our Projects",
    description:
      "See SHDS's ongoing and completed development projects delivering lasting impact for communities across Sindh, Pakistan.",
  },
  {
    path: "/impact",
    title: "Impact",
    description:
      "SHDS has reached 500,000+ beneficiaries across 19 districts of Sindh through education, health, disaster relief, and community development programs. See our impact by the numbers.",
  },
  {
    path: "/governance",
    title: "Governance & Leadership",
    description:
      "Meet the leadership team and learn about the structured governance behind Sonahri Humanitarian Development Society's programs across Sindh, Pakistan.",
  },
  {
    path: "/gallery",
    title: "Gallery",
    description:
      "Photos from SHDS programs and field activities — education, health, clean water, women's empowerment, and disaster relief initiatives across Sindh, Pakistan.",
  },
  {
    path: "/donate",
    title: "Donate",
    description:
      "Support SHDS's community development work in Sindh, Pakistan. Donate via bank transfer to fund education, health, clean water, and disaster relief programs.",
  },
  {
    path: "/contact",
    title: "Contact Us",
    description:
      "Get in touch with Sonahri Humanitarian Development Society. Our office is in Makli, District Thatta, Sindh, Pakistan.",
  },
];

export const notFoundSeo: PageSeo = {
  path: "/404",
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export function getSeoForPath(pathname: string): { seo: PageSeo; found: boolean } {
  const normalized = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const match = pagesSeo.find(p => p.path === normalized);
  if (match) return { seo: match, found: true };
  return { seo: notFoundSeo, found: false };
}
