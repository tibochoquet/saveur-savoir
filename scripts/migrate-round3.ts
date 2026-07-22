// Eenmalige migratie voor deze ronde:
// - homepage: standaard SEO-titel zetten
// - productcategorie: 3 documenten aanmaken/updaten die overeenkomen met de
//   ECHTE huidige Shopify-collecties (de 7 oude documenten uit een vorige
//   ronde, vóór de Shopify-koppeling, matchen geen enkele live collectie
//   meer en blijven als legacy staan — niet verwijderd)
//
// Gebruik: npm run migrate:round3
// Veilig om opnieuw te draaien: gebruikt createIfNotExists/patch met een
// vaste, deterministische set aan document-ID's.

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

async function run() {
  console.log("Migratie gestart...\n");

  console.log("Homepage: standaard SEO-titel zetten (alleen als seoTitel nog leeg is)...");
  await client
    .patch("homepage")
    .setIfMissing({
      seoTitel: "Saveur & Savoir | Franse recepten, Franse producten, vertalingen & Franse lessen",
    })
    .commit();

  // Titels moeten exact overeenkomen met de huidige Shopify-collectienamen
  // (gecontroleerd via de Storefront API) zodat de kleurtint-koppeling in
  // webshop/index.astro werkt. Kies zelf gerust een andere tint in Studio
  // — dit is een eerste, aesthetische keuze, geen vaste regel.
  const categorieen: { id: string; titel: string; kleurTint: string }[] = [
    { id: "productcategorie-drank-siroop-sap-water", titel: "Drank, siroop, sap, water", kleurTint: "bg-blue-100" },
    { id: "productcategorie-zoet-beleg", titel: "Zoet beleg", kleurTint: "bg-terracotta-100" },
    {
      id: "productcategorie-ingredienten-koken-bakken",
      titel: "Ingrediënten voor koken en bakken",
      kleurTint: "bg-ochre-100",
    },
  ];

  console.log("Productcategorieën (huidige Shopify-collecties): aanmaken/tint zetten...");
  for (const cat of categorieen) {
    await client.createIfNotExists({
      _id: cat.id,
      _type: "productcategorie",
      titel: cat.titel,
      slug: { _type: "slug", current: cat.id.replace("productcategorie-", "") },
      kleurTint: cat.kleurTint,
    });
    await client.patch(cat.id).setIfMissing({ kleurTint: cat.kleurTint }).commit();
    console.log(`  ${cat.titel} -> ${cat.kleurTint}`);
  }

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
