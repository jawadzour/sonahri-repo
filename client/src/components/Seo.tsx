import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_URL, getSeoForPath } from "@shared/seo";

// Keeps <title>/description/canonical/OG/Twitter tags in sync during
// client-side (wouter) navigation. The initial HTML for each route already
// has correct tags baked in server-side (see server/_core/seo.ts) for
// crawlers and link-unfurlers; this covers subsequent in-app route changes,
// which never re-request the HTML shell.
export default function Seo({ path }: { path: string }) {
  const { seo, found } = getSeoForPath(path);
  const fullTitle = `${seo.title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${seo.path === "/" ? "/" : seo.path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={found ? "index, follow" : "noindex, follow"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={seo.description} />
    </Helmet>
  );
}
