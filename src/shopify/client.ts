import type { ShopifyProduct } from "./types";

// Alleen productdata komt uit Shopify — recepten, blog en pagina's
// blijven volledig in Sanity. Zonder deze twee env-vars is de webshop
// gewoon leeg (zie webshop/index.astro), nooit een build-fout.
const domain = import.meta.env.PUBLIC_SHOPIFY_DOMAIN;
const token = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2024-10";

export const isShopifyGeconfigureerd = Boolean(domain && token);

function formatPrijs(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: currencyCode }).format(
    Number.parseFloat(amount)
  );
}

interface ShopifyImageEdge {
  node: { url: string; altText: string | null };
}

interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  images?: { edges: ShopifyImageEdge[] };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  collections: { edges: { node: { title: string } }[] };
  variants?: { edges: { node: { id: string } }[] };
}

function naarShopifyProduct(node: ShopifyProductNode): ShopifyProduct {
  const afbeeldingen = node.images?.edges.map((e) => ({ url: e.node.url, alt: e.node.altText })) ?? [];
  const featured = node.featuredImage ? { url: node.featuredImage.url, alt: node.featuredImage.altText } : null;

  return {
    id: node.id,
    handle: node.handle,
    titel: node.title,
    beschrijvingHtml: node.descriptionHtml,
    beschikbaar: node.availableForSale,
    prijs: formatPrijs(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode),
    afbeelding: featured ?? afbeeldingen[0] ?? null,
    afbeeldingen: afbeeldingen.length ? afbeeldingen : featured ? [featured] : [],
    categorie: node.collections.edges[0]?.node.title ?? null,
    productUrl: `https://${domain}/products/${node.handle}`,
    // Alle huidige producten hebben precies 1 (standaard-)variant — geen
    // variant-kiezer nodig. Dit is de merchandiseId voor de winkelwagen.
    variantId: node.variants?.edges[0]?.node.id ?? null,
  };
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!isShopifyGeconfigureerd) return null;

  try {
    const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token!,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      console.error(`Shopify Storefront API: HTTP ${res.status}`);
      return null;
    }

    const json = await res.json();
    if (json.errors) {
      console.error("Shopify Storefront API:", JSON.stringify(json.errors));
      return null;
    }

    return json.data as T;
  } catch (err) {
    console.error("Shopify Storefront API onbereikbaar:", err);
    return null;
  }
}

const PRODUCTEN_QUERY = `
  query Producten($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          descriptionHtml
          availableForSale
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          collections(first: 1) { edges { node { title } } }
          variants(first: 1) { edges { node { id } } }
        }
      }
    }
  }
`;

export async function getShopifyProducten(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProductNode }[] } }>(PRODUCTEN_QUERY, {
    first: 100,
  });
  if (!data) return [];
  return data.products.edges.map((e) => naarShopifyProduct(e.node));
}

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      availableForSale
      images(first: 6) { edges { node { url altText } } }
      priceRange { minVariantPrice { amount currencyCode } }
      collections(first: 1) { edges { node { title } } }
      variants(first: 1) { edges { node { id } } }
    }
  }
`;

export async function getShopifyProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProductNode | null }>(PRODUCT_BY_HANDLE_QUERY, { handle });
  if (!data?.product) return null;
  return naarShopifyProduct(data.product);
}

// Korte platte tekst voor op de kaart in het overzicht; de productpagina
// zelf toont de volledige descriptionHtml.
export function kortBeschrijving(html: string, max = 140) {
  const tekst = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return tekst.length > max ? `${tekst.slice(0, max - 1).trimEnd()}…` : tekst;
}
