import type { PortableTextBlock } from "@portabletext/types";
import type { Image } from "sanity";

export interface SanityImageValue extends Image {
  alt?: string;
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
  gerelateerdProduct?: Pick<Product, "naam" | "slug" | "prijs">;
}

export interface Product {
  _id: string;
  naam: string;
  slug: { current: string };
  categorie:
    | "Kaas"
    | "Madeleines & bakvormen"
    | "Droge worst"
    | "Wijn"
    | "Zeep"
    | "Etherische oliën"
    | "Wandelroutes";
  soort: "fysiek" | "digitaal";
  prijs: string;
  herkomst: string;
  excerpt: string;
  dek: string;
  afbeelding?: SanityImageValue;
  verhaal?: PortableTextBlock[];
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

export interface Homepage {
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

export interface Pagina {
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

export interface PaginaContact {
  paginatitel: string;
  kop: string;
  introtekst: PortableTextBlock[];
  onderwerpSuggesties?: string[];
}

export interface DienstPagina {
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

export interface JuridischePagina {
  titel: string;
  inhoud?: PortableTextBlock[];
}
