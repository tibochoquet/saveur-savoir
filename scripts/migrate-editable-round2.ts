// Eenmalige migratie voor de tweede "editable"-ronde:
// - twee nieuwe lege juridische pagina's: Cookievoorkeuren, Servicevoorwaarden
// - productcategorie-documenten aanmaken voor de 7 bestaande categorieën
// - bestaande producten patchen: categorie-string -> referentie naar het
//   bijbehorende productcategorie-document
//
// Gebruik: npm run migrate:round2
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

  // 1. Twee nieuwe lege juridische pagina's.
  console.log("Juridische pagina's: Cookievoorkeuren en Servicevoorwaarden aanmaken...");
  await client.createIfNotExists({
    _id: "cookievoorkeuren",
    _type: "juridischePagina",
    titel: "Cookievoorkeuren",
  });
  await client.createIfNotExists({
    _id: "servicevoorwaarden",
    _type: "juridischePagina",
    titel: "Servicevoorwaarden",
  });

  // 2. Productcategorieën aanmaken — vaste, deterministische ID's zodat
  // dit veilig herhaald kan worden en de referentie-migratie hieronder
  // altijd naar hetzelfde document wijst.
  const categorieen: { id: string; titel: string; slug: string }[] = [
    { id: "productcategorie-kaas", titel: "Kaas", slug: "kaas" },
    { id: "productcategorie-madeleines-bakvormen", titel: "Madeleines & bakvormen", slug: "madeleines-bakvormen" },
    { id: "productcategorie-droge-worst", titel: "Droge worst", slug: "droge-worst" },
    { id: "productcategorie-wijn", titel: "Wijn", slug: "wijn" },
    { id: "productcategorie-zeep", titel: "Zeep", slug: "zeep" },
    { id: "productcategorie-etherische-olien", titel: "Etherische oliën", slug: "etherische-olien" },
    { id: "productcategorie-wandelroutes", titel: "Wandelroutes", slug: "wandelroutes" },
  ];

  console.log("Productcategorieën aanmaken...");
  for (const cat of categorieen) {
    await client.createIfNotExists({
      _id: cat.id,
      _type: "productcategorie",
      titel: cat.titel,
      slug: { _type: "slug", current: cat.slug },
    });
  }

  // 3. Bestaande producten patchen: categorie-string -> referentie.
  console.log("Producten patchen: categorie-string -> referentie...");
  const producten = await client.fetch<{ _id: string; categorie: string }[]>(
    `*[_type == "product"]{_id, categorie}`
  );

  for (const product of producten) {
    if (typeof product.categorie !== "string") {
      console.log(`  ${product._id}: al een referentie, overslaan.`);
      continue;
    }
    const match = categorieen.find((c) => c.titel === product.categorie);
    if (!match) {
      console.warn(`  ${product._id}: onbekende categorie "${product.categorie}", overslaan.`);
      continue;
    }
    await client
      .patch(product._id)
      .set({ categorie: { _type: "reference", _ref: match.id } })
      .commit();
    console.log(`  ${product._id}: "${product.categorie}" -> ${match.id}`);
  }

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
