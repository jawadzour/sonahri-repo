import { getSeoForPath, SITE_URL, SITE_NAME } from "../../shared/seo";

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Rewrites a self-closing/void tag's attribute value by locating the tag
// via its `id` (order-independent) rather than assuming attribute order,
// so the exact markup in client/index.html can change without breaking this.
function replaceTagAttrById(html: string, id: string, attr: "content" | "href", value: string): string {
  const tagRegex = new RegExp(`<[^>]*\\bid="${id}"[^>]*>`, "i");
  return html.replace(tagRegex, tag => tag.replace(new RegExp(`${attr}="[^"]*"`), `${attr}="${escapeAttr(value)}"`));
}

// Injects per-route title/description/canonical/OG/Twitter tags into the
// static HTML shell before it's sent to the client. This is what makes the
// SPA's SEO metadata visible to crawlers and link-unfurlers that don't
// execute JavaScript (Facebook/Twitter/LinkedIn/WhatsApp, some search bots) —
// react-helmet-async alone only updates the DOM after React mounts.
export function injectSeoTags(html: string, urlPath: string): string {
  const pathname = urlPath.split("?")[0].split("#")[0];
  const { seo, found } = getSeoForPath(pathname);

  const fullTitle = `${seo.title} | ${SITE_NAME}`;
  const canonicalPath = seo.path === "/" ? "/" : seo.path;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  let result = html.replace(
    /<title id="seo-title">[\s\S]*?<\/title>/,
    `<title id="seo-title">${escapeAttr(fullTitle)}</title>`
  );
  result = replaceTagAttrById(result, "seo-description", "content", seo.description);
  result = replaceTagAttrById(result, "seo-canonical", "href", canonicalUrl);
  result = replaceTagAttrById(result, "seo-og-title", "content", fullTitle);
  result = replaceTagAttrById(result, "seo-og-description", "content", seo.description);
  result = replaceTagAttrById(result, "seo-og-url", "content", canonicalUrl);
  result = replaceTagAttrById(result, "seo-twitter-title", "content", fullTitle);
  result = replaceTagAttrById(result, "seo-twitter-description", "content", seo.description);
  // Unknown routes still render the client's NotFound page (soft 404, since
  // this SPA can't set a real HTTP status per route) — keep them out of the
  // index via robots so they don't compete with real pages in search results.
  result = replaceTagAttrById(result, "seo-robots", "content", found ? "index, follow" : "noindex, follow");

  return result;
}
