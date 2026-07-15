import type { APIRoute } from "astro";

// Zelfde schakelaar als de noindex-meta in Layout.astro — zet
// PUBLIC_ALLOW_INDEXING=true in Netlify zodra de site op
// saveursavoir.nl staat.
const allowIndexing = import.meta.env.PUBLIC_ALLOW_INDEXING === "true";

export const GET: APIRoute = () => {
  const body = allowIndexing ? "User-agent: *\nAllow: /\n" : "User-agent: *\nDisallow: /\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};
