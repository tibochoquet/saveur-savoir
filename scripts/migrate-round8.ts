// Eenmalige migratie voor deze ronde (Article-schema/JSON-LD op
// receptpagina's):
// - Elk bestaand recept-document krijgt een publicatiedatum
//   (verplicht veld, nodig voor de nieuwe JSON-LD en de zichtbare
//   "Gepubliceerd op"-datum op de pagina). Zonder deze migratie zou
//   Sanity Studio bestaande recepten als "ongeldig" tonen.
// - Startwaarde: de datum waarop het document oorspronkelijk in Sanity
//   is aangemaakt (_createdAt) — de meest eerlijke beschikbare waarde,
//   geen verzonnen datum. De eigenaar kan dit per recept aanpassen in
//   de Studio als de echte publicatiedatum anders is.
//
// Gebruik: npm run migrate:round8
// Veilig om opnieuw te draaien: setIfMissing raakt niets aan bij een
// recept waar de eigenaar zelf al een publicatiedatum heeft ingevuld.

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

  const recepten = await client.fetch<{ _id: string; _createdAt: string; titel: string }[]>(
    `*[_type == "recept"]{ _id, _createdAt, titel }`
  );

  console.log(`${recepten.length} recept(en) gevonden.\n`);

  for (const recept of recepten) {
    const publicatiedatum = recept._createdAt.slice(0, 10); // YYYY-MM-DD
    await client.patch(recept._id).setIfMissing({ publicatiedatum }).commit();
    console.log(`  ${recept.titel}: publicatiedatum -> ${publicatiedatum} (indien nog leeg)`);
  }

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
