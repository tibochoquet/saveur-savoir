import afbeelding from "./objects/afbeelding";
import blockContent from "./objects/blockContent";
import eenvoudigeTekst from "./objects/eenvoudigeTekst";
import pullQuote from "./objects/pullQuote";

import recept from "./documents/recept";
import blogartikel from "./documents/blogartikel";
import productcategorie from "./documents/productcategorie";
import productAanvulling from "./documents/productAanvulling";
import onderwerp from "./documents/onderwerp";
import siteInstellingen from "./documents/siteInstellingen";
import homepage from "./documents/homepage";
import paginaWebshop from "./documents/paginaWebshop";
import paginaDiensten from "./documents/paginaDiensten";
import paginaRecepten from "./documents/paginaRecepten";
import paginaBlog from "./documents/paginaBlog";
import paginaContact from "./documents/paginaContact";
import paginaVertalingen from "./documents/paginaVertalingen";
import paginaPriveLes from "./documents/paginaPriveLes";
import juridischePagina from "./documents/juridischePagina";

export const schemaTypes = [
  // objecten (herbruikbare velden)
  afbeelding,
  blockContent,
  eenvoudigeTekst,
  pullQuote,
  // documenten
  recept,
  blogartikel,
  // productcategorie dient nu alleen nog als naam→tint-opzoektabel voor
  // de zachte achtergrond op het webshop-overzicht — productdata zelf
  // komt uitsluitend uit Shopify (zie src/shopify/client.ts).
  productcategorie,
  // Redactionele aanvulling per Shopify-product (receptenkaart-links) —
  // dupliceert geen productdata, zie het schema zelf voor uitleg.
  productAanvulling,
  onderwerp,
  // singletons (zie sanity.config.ts, gegroepeerd onder "Pagina's")
  homepage,
  paginaWebshop,
  paginaDiensten,
  paginaRecepten,
  paginaBlog,
  paginaContact,
  paginaVertalingen,
  paginaPriveLes,
  siteInstellingen,
  // juridische pagina's: één schema, zeven documenten (zie sanity.config.ts)
  juridischePagina,
];
