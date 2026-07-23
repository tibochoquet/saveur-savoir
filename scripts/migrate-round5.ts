// Eenmalige migratie voor het live gaan:
// - verwijdert de 8 legacy `product`-documenten (uit de periode vóór de
//   Shopify-koppeling) — Shopify is nu de enige bron voor productdata
// - verwijdert de 7 ongebruikte legacy `productcategorie`-documenten die
//   alleen aan die oude producten hingen (Kaas, Wijn, ...) — de 3 nieuwe
//   productcategorie-documenten die als kleurtint-opzoektabel dienen voor
//   de échte Shopify-collecties blijven staan
// - haalt de (nu ongeldige) `gerelateerdProduct`-referentie van het
//   GR70-blogartikel weg
//
// Gebruik: npm run migrate:round5
// Destructief (verwijdert documenten) maar veilig om opnieuw te draaien:
// een document dat al weg is, wordt overgeslagen.

import "dotenv/config";
import { createClient } from "@sanity/client";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Ontbrekende omgevingsvariabelen. Zorg dat PUBLIC_SANITY_PROJECT_ID en SANITY_API_WRITE_TOKEN in .env staan."
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

const legacyProductIds = [
  "product-comte-24-maanden",
  "product-domaine-familiale-rose",
  "product-etherische-lavendelolie",
  "product-gr70-chemin-de-stevenson-gpx",
  "product-madeleinevorm-verkoperen",
  "product-reblochon-fermier",
  "product-saucisson-sec-aux-herbes",
  "product-savon-de-marseille",
];

const legacyCategorieIds = [
  "productcategorie-kaas",
  "productcategorie-madeleines-bakvormen",
  "productcategorie-droge-worst",
  "productcategorie-wijn",
  "productcategorie-zeep",
  "productcategorie-etherische-olien",
  "productcategorie-wandelroutes",
];

async function run() {
  console.log("Migratie gestart...\n");

  console.log("GR70-blogartikel: ongeldige productreferentie verwijderen...");
  await client.patch("blogartikel-gr70-chemin-de-stevenson").unset(["gerelateerdProduct"]).commit();

  console.log("\nLegacy productdocumenten verwijderen (Shopify is nu de enige bron)...");
  for (const id of legacyProductIds) {
    await client.delete(id);
    console.log(`  ${id} verwijderd`);
  }

  console.log("\nOngebruikte legacy productcategorieën verwijderen...");
  for (const id of legacyCategorieIds) {
    await client.delete(id);
    console.log(`  ${id} verwijderd`);
  }

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
