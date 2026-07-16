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

export interface SiteInstellingen {
  contactEmail: string;
  reactietijd: string;
  footerTagline: string;
  footerRegel: string;
}

export interface HomepageAanbodItem {
  titel: string;
  tekst: string;
}

export interface Homepage {
  heroEyebrow: string;
  heroTitel: string;
  heroIntro: string;
  heroCtaPrimair: string;
  heroCtaSecundair: string;
  heroAfbeelding?: SanityImageValue;
  overMijEyebrow: string;
  overMijTitel: string;
  overMijTekst: string;
  overMijQuote?: string;
  overMijAfbeelding?: SanityImageValue;
  aanbodEyebrow: string;
  aanbodTitel: string;
  aanbodItems: HomepageAanbodItem[];
  contactEyebrow: string;
  contactTitel: string;
  contactTekst: string;
  contactCta: string;
}
