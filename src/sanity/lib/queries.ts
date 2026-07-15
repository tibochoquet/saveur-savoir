import { sanityClient } from "sanity:client";
import type { Blogartikel, Product, Recept, SiteInstellingen, Wandeling } from "./types";

// Documenten worden op aanmaakdatum getoond — dat is ook de volgorde
// waarin het seed-script (scripts/seed.ts) ze aanmaakt.
const ORDER = "order(_createdAt asc)";

export function getRecepten() {
  return sanityClient.fetch<Recept[]>(`*[_type == "recept"] | ${ORDER}`);
}

export function getReceptBySlug(slug: string) {
  return sanityClient.fetch<Recept | null>(
    `*[_type == "recept" && slug.current == $slug][0]`,
    { slug }
  );
}

const WANDELING_PROJECTION = `{ ..., gpxBestand{ asset->{url, originalFilename, size} } }`;

export function getWandelingen() {
  return sanityClient.fetch<Wandeling[]>(
    `*[_type == "wandeling"] | ${ORDER} ${WANDELING_PROJECTION}`
  );
}

export function getWandelingBySlug(slug: string) {
  return sanityClient.fetch<Wandeling | null>(
    `*[_type == "wandeling" && slug.current == $slug][0] ${WANDELING_PROJECTION}`,
    { slug }
  );
}

export function getBlogartikelen() {
  return sanityClient.fetch<Blogartikel[]>(`*[_type == "blogartikel"] | ${ORDER}`);
}

export function getBlogartikelBySlug(slug: string) {
  return sanityClient.fetch<Blogartikel | null>(
    `*[_type == "blogartikel" && slug.current == $slug][0]`,
    { slug }
  );
}

export function getProducten() {
  return sanityClient.fetch<Product[]>(`*[_type == "product"] | ${ORDER}`);
}

export function getProductBySlug(slug: string) {
  return sanityClient.fetch<Product | null>(
    `*[_type == "product" && slug.current == $slug][0]`,
    { slug }
  );
}

export function getSiteInstellingen() {
  return sanityClient.fetch<SiteInstellingen | null>(
    `*[_type == "siteInstellingen"][0]`
  );
}
