import { sanityClient } from "sanity:client";
import type {
  Blogartikel,
  Homepage,
  JuridischePagina,
  Onderwerp,
  Pagina,
  PaginaContact,
  PaginaDiensten,
  PaginaPriveLes,
  PaginaVertalingen,
  PaginaWebshop,
  Product,
  Recept,
  SiteInstellingen,
} from "./types";

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

const BLOGARTIKEL_PROJECTION = `{
  ...,
  onderwerp->{_id, titel, slug},
  gerelateerdProduct->{naam, slug, prijs}
}`;

export function getBlogartikelen() {
  return sanityClient.fetch<Blogartikel[]>(
    `*[_type == "blogartikel"] | ${ORDER} ${BLOGARTIKEL_PROJECTION}`
  );
}

export function getBlogartikelBySlug(slug: string) {
  return sanityClient.fetch<Blogartikel | null>(
    `*[_type == "blogartikel" && slug.current == $slug][0] ${BLOGARTIKEL_PROJECTION}`,
    { slug }
  );
}

export function getOnderwerpen() {
  return sanityClient.fetch<Onderwerp[]>(`*[_type == "onderwerp"] | order(titel asc)`);
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

export function getHomepage() {
  return sanityClient.fetch<Homepage | null>(`*[_type == "homepage"][0]`);
}

export function getPagina(type: "paginaRecepten" | "paginaBlog") {
  return sanityClient.fetch<Pagina | null>(`*[_type == $type][0]`, { type });
}

export function getPaginaWebshop() {
  return sanityClient.fetch<PaginaWebshop | null>(`*[_type == "paginaWebshop"][0]`);
}

export function getPaginaDiensten() {
  return sanityClient.fetch<PaginaDiensten | null>(`*[_type == "paginaDiensten"][0]`);
}

export function getPaginaContact() {
  return sanityClient.fetch<PaginaContact | null>(`*[_type == "paginaContact"][0]`);
}

export function getPaginaVertalingen() {
  return sanityClient.fetch<PaginaVertalingen | null>(`*[_type == "paginaVertalingen"][0]`);
}

export function getPaginaPriveLes() {
  return sanityClient.fetch<PaginaPriveLes | null>(`*[_type == "paginaPriveLes"][0]`);
}

const JURIDISCHE_PAGINA_IDS = [
  "disclaimer",
  "privacybeleid",
  "herroeping",
  "algemeneVoorwaarden",
  "verzendenRetourneren",
] as const;

export type JuridischePaginaId = (typeof JURIDISCHE_PAGINA_IDS)[number];

export function getJuridischePagina(id: JuridischePaginaId) {
  return sanityClient.fetch<JuridischePagina | null>(`*[_type == "juridischePagina" && _id == $id][0]`, { id });
}
