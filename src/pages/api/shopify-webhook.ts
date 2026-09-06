import type { APIRoute } from "astro";
import { createHmac, timingSafeEqual } from "node:crypto";

// Vangnet naast de ISR-cache op /webshop (zie astro.config.mjs): bij elke
// product create/update/delete in Shopify triggert dit endpoint direct een
// volledige Vercel-rebuild, zodat ook statische pagina's die Shopify-data
// gebruiken (bv. de Receptenkaart-check in recepten/[slug].astro) meteen
// bijwerken, in plaats van te wachten op de eerstvolgende Sanity-publicatie.
//
// Instellen in Shopify-admin: zie README.md ("Shopify-webhook").
export const prerender = false;

function isGeldigeShopifyRequest(rawBody: string, hmacHeader: string | null, secret: string): boolean {
  if (!hmacHeader) return false;

  const verwacht = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");

  const a = Buffer.from(hmacHeader);
  const b = Buffer.from(verwacht);
  // timingSafeEqual vereist gelijke lengte, anders is het sowieso ongeldig.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const POST: APIRoute = async ({ request }) => {
  const secret = import.meta.env.SHOPIFY_WEBHOOK_SECRET;
  const deployHookUrl = import.meta.env.VERCEL_DEPLOY_HOOK_URL;

  if (!secret || !deployHookUrl) {
    console.error("Shopify-webhook: SHOPIFY_WEBHOOK_SECRET of VERCEL_DEPLOY_HOOK_URL ontbreekt.");
    return new Response("Niet geconfigureerd", { status: 500 });
  }

  const rawBody = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");

  if (!isGeldigeShopifyRequest(rawBody, hmacHeader, secret)) {
    return new Response("Ongeldige handtekening", { status: 401 });
  }

  try {
    await fetch(deployHookUrl, { method: "POST" });
  } catch (err) {
    console.error("Shopify-webhook: kon Vercel deploy hook niet aanroepen:", err);
    return new Response("Rebuild kon niet gestart worden", { status: 502 });
  }

  return new Response("OK", { status: 200 });
};
