import type { PortableTextBlock } from "@portabletext/types";
import type { Image } from "sanity";

export interface SanityImageValue extends Image {
  alt?: string;
}

// Gedeeld door alle pagina-singletons — optionele overrides voor
// <title>/meta description, zie paginaFactory.ts (seoVelden()).
export interface SeoVelden {
  seoTitel?: string;
  seoOmschrijving?: string;
}

export interface Recept {
  _id: string;
  titel: string;
  slug: { current: string };
  streek: string;
  excerpt: string;
  afbeelding?: SanityImageValue;
  bereidingstijd: string;
  aantalPersonen: string;
  niveau: "Gemakkelijk" | "Gemiddeld" | "Moeilijk";
  intro?: PortableTextBlock[];
  ingredientengroepen?: { titel: string; ingredienten: string[] }[];
  bereidingsstappen?: { titel: string; tekst: string }[];
  tip?: string;
  // De webshopcatalogus leeft sinds de Shopify-koppeling niet meer in
  // Sanity, dus dit is een platte handle-string, geen reference.
  receptkaartHandle?: string;
  receptkaartKnoptekst?: string;
}

export interface Onderwerp {
  _id: string;
  titel: string;
  slug: { current: string };
}

export interface Blogartikel {
  _id: string;
  titel: string;
  slug: { current: string };
  onderwerp: Onderwerp;
  excerpt: string;
  dek: string;
  afbeelding?: SanityImageValue;
  leestijdMinuten?: number;
  inhoud?: PortableTextBlock[];
}

// Productdata komt uitsluitend uit Shopify (zie src/shopify/types.ts).
// Dit document dient alleen nog als naam→tint-opzoektabel voor de
// webshop-categoriekleur.
export interface Productcategorie {
  _id: string;
  titel: string;
  slug: { current: string };
  kleurTint?: string;
}

export interface FooterKolom {
  titel: string;
  link1Label: string;
  link2Label?: string;
  link3Label?: string;
}

export interface SiteInstellingen {
  contactEmail: string;
  reactietijd: string;
  footerTagline: string;
  footerRegel: string;
  footerDiensten: FooterKolom;
  footerOntdekken: FooterKolom;
  footerContact: FooterKolom;
}

export interface HomepageAanbodItem {
  titel: string;
  tekst: PortableTextBlock[];
}

export interface Homepage extends SeoVelden {
  heroEyebrow: string;
  heroTitel: string;
  heroIntro: PortableTextBlock[];
  heroCtaPrimair: string;
  heroCtaSecundair: string;
  heroAfbeelding?: SanityImageValue;
  overMijEyebrow: string;
  overMijTitel: string;
  overMijTekst: PortableTextBlock[];
  overMijQuote?: string;
  overMijAfbeelding?: SanityImageValue;
  aanbodEyebrow: string;
  aanbodTitel: string;
  aanbodItems: HomepageAanbodItem[];
  contactEyebrow: string;
  contactTitel: string;
  contactTekst: PortableTextBlock[];
  contactCta: string;
}

export interface Pagina extends SeoVelden {
  paginatitel: string;
  kop: string;
  introtekst: PortableTextBlock[];
  introAfbeelding?: SanityImageValue;
}

export interface TekstItem {
  titel: string;
  tekst: PortableTextBlock[];
}

export interface PaginaWebshop extends Pagina {
  bestelStappen: TekstItem[];
}

export interface PaginaDiensten extends Pagina {
  dienstenItems: TekstItem[];
}

export interface PaginaContact extends SeoVelden {
  paginatitel: string;
  kop: string;
  introtekst: PortableTextBlock[];
  onderwerpSuggesties?: string[];
}

export interface DienstPagina extends SeoVelden {
  heroEyebrow: string;
  heroTitel: string;
  heroIntro: PortableTextBlock[];
  heroKnoptekst: string;
  heroAfbeelding?: SanityImageValue;
  watHetIsEyebrow: string;
  watHetIsTekst: PortableTextBlock[];
  watHetIsAfbeelding?: SanityImageValue;
  hoeHetWerktEyebrow: string;
  hoeHetWerktStappen: TekstItem[];
  ctaEyebrow: string;
  ctaTitel: string;
  ctaTekst: PortableTextBlock[];
  ctaKnoptekst: string;
}

export interface PaginaVertalingen extends DienstPagina {
  voorWieEyebrow: string;
  voorWieItems: TekstItem[];
}

export interface PaginaPriveLes extends DienstPagina {
  doelgroepEyebrow: string;
  doelgroepenItems: TekstItem[];
}

export interface JuridischePagina extends SeoVelden {
  titel: string;
  inhoud?: PortableTextBlock[];
}
