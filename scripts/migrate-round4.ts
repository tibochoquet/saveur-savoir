// Eenmalige migratie voor deze ronde:
// - Cookievoorkeuren-pagina: vervangt de generieke Shopify-boilerplate
//   over marketing/analytics/advertentiecookies (die iemand er kennelijk
//   ingeplakt heeft) door een eerlijke uitleg — er is geen tracking op
//   de site, dus geen cookiebanner nodig.
//
// Gebruik: npm run migrate:round4
// LET OP: dit overschrijft het `inhoud`-veld van "cookievoorkeuren" altijd
// (niet setIfMissing), omdat de huidige inhoud feitelijk onjuist is voor
// deze site (beweert marketing/analytics-cookies te gebruiken, terwijl er
// geen tracking is). Alle andere migraties in dit script zijn wel veilig
// om opnieuw te draaien.

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

const key = () => Math.random().toString(36).slice(2, 10);

const heading = (text: string, style: "h2" | "h3" = "h2") => ({
  _type: "block" as const,
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span" as const, _key: key(), text, marks: [] }],
});

const paragraph = (text: string) => ({
  _type: "block" as const,
  _key: key(),
  style: "normal" as const,
  markDefs: [],
  children: [{ _type: "span" as const, _key: key(), text, marks: [] }],
});

async function run() {
  console.log("Migratie gestart...\n");

  console.log("Cookievoorkeuren: eerlijke uitleg zetten (overschrijft de bestaande inhoud)...");
  await client
    .patch("cookievoorkeuren")
    .set({
      inhoud: [
        heading("Welke cookies gebruiken wij?"),
        paragraph(
          "Deze website gebruikt geen tracking-, marketing- of advertentiecookies, en ook geen analysecookies. Er is daarom geen cookiebanner nodig — we houden niets bij waarvoor toestemming vereist is."
        ),
        heading("De enige cookie: je winkelwagen", "h3"),
        paragraph(
          "Zodra je een product aan je winkelwagen toevoegt, plaatst Shopify (onze webshop-leverancier) een functionele cookie om te onthouden wat er in je winkelwagen zit terwijl je verder bestelt. Deze cookie wordt alleen geplaatst op het moment dat je zelf iets aan je winkelwagen toevoegt — niet bij een gewoon bezoek aan de site."
        ),
        heading("In de toekomst", "h3"),
        paragraph(
          "Zodra hier ooit verandering in komt (bijvoorbeeld analytics of marketing via Shopify), werken we deze pagina bij en voegen we, als dat nodig is, alsnog een cookiebanner toe."
        ),
      ],
    })
    .commit();

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
