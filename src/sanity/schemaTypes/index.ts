import afbeelding from "./objects/afbeelding";
import blockContent from "./objects/blockContent";
import eenvoudigeTekst from "./objects/eenvoudigeTekst";
import pullQuote from "./objects/pullQuote";

import recept from "./documents/recept";
import blogartikel from "./documents/blogartikel";
import product from "./documents/product";
import onderwerp from "./documents/onderwerp";
import siteInstellingen from "./documents/siteInstellingen";
import homepage from "./documents/homepage";
import paginaWebshop from "./documents/paginaWebshop";
import paginaDiensten from "./documents/paginaDiensten";
import paginaRecepten from "./documents/paginaRecepten";
import paginaBlog from "./documents/paginaBlog";
import paginaContact from "./documents/paginaContact";

export const schemaTypes = [
  // objecten (herbruikbare velden)
  afbeelding,
  blockContent,
  eenvoudigeTekst,
  pullQuote,
  // documenten
  recept,
  blogartikel,
  product,
  onderwerp,
  // singletons (zie sanity.config.ts, gegroepeerd onder "Pagina's")
  homepage,
  paginaWebshop,
  paginaDiensten,
  paginaRecepten,
  paginaBlog,
  paginaContact,
  siteInstellingen,
];
