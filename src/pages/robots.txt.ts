import type { APIRoute } from "astro";

// Zelfde schakelaar als de noindex-meta in Layout.astro — zet
// PUBLIC_ALLOW_INDEXING=true in Vercel zodra de site op
// saveursavoir.nl staat.
const allowIndexing = import.meta.env.PUBLIC_ALLOW_INDEXING === "true";

export const GET: APIRoute = () => {
  // /studio (de Sanity Studio-CMS) en /styleguide (intern design-system-
  // overzicht) mogen nooit geïndexeerd worden, los van de algemene
  // schakelaar hierboven.
  const body = allowIndexing
    ? "User-agent: *\nAllow: /\nDisallow: /studio\nDisallow: /styleguide\nSitemap: https://saveursavoir.nl/sitemap-index.xml\n"
    : "User-agent: *\nDisallow: /\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};
