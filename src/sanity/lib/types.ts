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

export interface Wandeling {
  _id: string;
  titel: string;
  slug: { current: string };
  streek: string;
  excerpt: string;
  afbeelding?: SanityImageValue;
  afstand: string;
  duur: string;
  hoogteverschil?: string;
  niveau: "Makkelijk" | "Matig zwaar" | "Zwaar";
  intro?: PortableTextBlock[];
  etappes?: string[];
  gpxBestand?: { asset: { url: string; originalFilename: string; size: number } };
}

export interface Blogartikel {
  _id: string;
  titel: string;
  slug: { current: string };
  onderwerp: "Tradities" | "Taal" | "Eten & drinken" | "Cultuur";
  excerpt: string;
  dek: string;
  afbeelding?: SanityImageValue;
  leestijdMinuten?: number;
  inhoud?: PortableTextBlock[];
}

export interface Product {
  _id: string;
  naam: string;
  slug: { current: string };
  categorie: "Kaas" | "Madeleines & bakvormen" | "Droge worst" | "Wijn" | "Zeep" | "Etherische oliën";
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
