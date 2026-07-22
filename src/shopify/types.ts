export interface ShopifyProductAfbeelding {
  url: string;
  alt: string | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  titel: string;
  beschrijvingHtml: string;
  beschikbaar: boolean;
  prijs: string;
  afbeelding: ShopifyProductAfbeelding | null;
  afbeeldingen: ShopifyProductAfbeelding[];
  categorie: string | null;
  productUrl: string;
  variantId: string | null;
}
