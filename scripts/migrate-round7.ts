// Eenmalige migratie voor deze ronde (Spotlight-sectie op de homepage):
// - homepage-document krijgt de twee nieuwe, verplichte velden
//   spotlightTitel en spotlightHandles. Zonder deze migratie zou de
//   Studio het homepage-document als "ongeldig" tonen (verplichte velden
//   ontbreken) totdat de eigenaar ze zelf invult.
// - Kiest 4 bestaande, echte Shopify-producten als startwaarde — de
//   eigenaar past dit naar smaak aan in de Studio.
//
// Gebruik: npm run migrate:round7
// Veilig om opnieuw te draaien: setIfMissing raakt niets aan als de
// velden al (door de eigenaar) ingevuld zijn.

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

  console.log("Homepage: spotlight-velden aanvullen (setIfMissing)...");
  await client
    .patch("homepage")
    .setIfMissing({
      spotlightTitel: "Nieuw in ons assortiment",
      spotlightHandles: [
        "bonne-maman-kastanjecreme-met-vanille",
        "ducros-persillade",
        "carambar",
        "teisseire-menthe-verte-groene-muntsiroop-mega-formaat-130-cl-zonder-kunstmatige-smaakstoffen-en-zonder-conserveermiddelen",
      ],
    })
    .commit();
  console.log("  homepage bijgewerkt");

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
