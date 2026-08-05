// Eenmalige migratie voor deze ronde (Google Analytics 4 + cookiebanner):
// - Cookievoorkeuren-pagina: vervangt de tekst van migrate-round4.ts (die
//   zei "geen tracking, dus geen cookiebanner nodig") — dat is niet meer
//   waar nu Google Analytics draait. Nieuwe tekst benoemt expliciet welke
//   cookies GA4 zet, waarvoor, en verwijst naar de interactieve
//   "wijzig je voorkeuren"-knop die nu op deze pagina staat.
// - Privacybeleid: voegt een nieuwe sectie "Cookies en Google Analytics"
//   toe, vlak na de inleiding en vóór "Persoonlijke informatie die wij
//   verzamelen of verwerken" — de rest van de (generieke Shopify-)tekst
//   blijft ongemoeid, dit is een gerichte toevoeging, geen herschrijving.
//
// Gebruik: npm run migrate:round6
// LET OP: overschrijft `inhoud` van cookievoorkeuren volledig (zoals
// migrate-round4.ts ook deed — de vorige tekst is nu feitelijk onjuist).
// Voegt bij privacybeleid alleen twee blocks toe vóór een vast ankerpunt;
// veilig om opnieuw te draaien (skipt de invoeging als de sectie al bestaat).

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

const GA_SECTION_MARKER = "Cookies en Google Analytics";

async function run() {
  console.log("Migratie gestart...\n");

  console.log("Cookievoorkeuren-pagina bijwerken...");
  await client
    .patch("cookievoorkeuren")
    .set({
      inhoud: [
        heading("Welke cookies gebruiken wij?"),
        paragraph(
          "Deze website plaatst nooit analytische cookies zonder jouw expliciete toestemming. Kies je voorkeur via de banner onderaan de pagina bij je eerste bezoek, of wijzig 'm op elk moment via de knop onderaan deze pagina."
        ),
        heading("Noodzakelijke cookies", "h3"),
        paragraph(
          "Zodra je een product aan je winkelwagen toevoegt, plaatst Shopify (onze webshop-leverancier) een functionele cookie om te onthouden wat er in je winkelwagen zit terwijl je verder bestelt. Deze cookie is noodzakelijk voor de werking van de webshop en staat niet aan/uit te zetten."
        ),
        heading("Analytische cookies: Google Analytics", "h3"),
        paragraph(
          "Met jouw toestemming gebruiken we Google Analytics (meet-ID G-1F7V2BVD57) om te zien hoeveel bezoekers de site heeft en welke pagina's populair zijn — dit helpt ons de site te verbeteren. Google Analytics plaatst hiervoor cookies zoals _ga en _ga_* op je apparaat, die een willekeurige, anonieme identifier bijhouden. We gebruiken deze gegevens niet voor advertenties of om je persoonlijk te identificeren."
        ),
        paragraph(
          "Weiger je, of maak je nog geen keuze? Dan wordt Google Analytics niet geladen en worden er geen Google-cookies geplaatst of gegevens naar Google verstuurd."
        ),
        heading("Je toestemming intrekken of wijzigen", "h3"),
        paragraph(
          "Je keuze wordt onthouden in je browser en is op elk moment te wijzigen via de knop hieronder op deze pagina. Bij intrekken verwijderen we ook meteen de eventueel al geplaatste Google-cookies."
        ),
      ],
    })
    .commit();
  console.log("  cookievoorkeuren bijgewerkt");

  console.log("\nPrivacybeleid-pagina controleren...");
  const privacybeleid = await client.getDocument<{ inhoud?: Array<{ _key: string; style?: string; children?: Array<{ text?: string }> }> }>(
    "privacybeleid"
  );
  const inhoud = privacybeleid?.inhoud ?? [];

  const alreadyHasSection = inhoud.some((block) =>
    block.children?.some((child) => child.text === GA_SECTION_MARKER)
  );

  if (alreadyHasSection) {
    console.log("  sectie 'Cookies en Google Analytics' bestaat al, overslaan");
  } else {
    const anchorIndex = inhoud.findIndex((block) =>
      block.children?.some((child) => child.text === "Persoonlijke informatie die wij verzamelen of verwerken")
    );

    if (anchorIndex === -1) {
      console.warn(
        "  WAARSCHUWING: ankerpunt 'Persoonlijke informatie die wij verzamelen of verwerken' niet gevonden — sectie niet ingevoegd. Voeg 'm handmatig toe in Sanity Studio."
      );
    } else {
      const newBlocks = [
        heading(GA_SECTION_MARKER),
        paragraph(
          "We gebruiken Google Analytics (meet-ID G-1F7V2BVD57) om geanonimiseerd bij te houden hoe bezoekers onze website gebruiken, zodat we de site kunnen verbeteren. Dit gebeurt alleen ná jouw expliciete toestemming via de cookiebanner — zonder toestemming plaatst Google Analytics geen cookies en worden er geen gegevens naar Google verstuurd."
        ),
        paragraph(
          "Meer details over welke cookies dit precies zijn en hoe je je toestemming kunt wijzigen of intrekken, vind je op de Cookievoorkeuren-pagina."
        ),
      ];

      const updatedInhoud = [
        ...inhoud.slice(0, anchorIndex),
        ...newBlocks,
        ...inhoud.slice(anchorIndex),
      ];

      await client.patch("privacybeleid").set({ inhoud: updatedInhoud }).commit();
      console.log("  sectie 'Cookies en Google Analytics' toegevoegd vóór 'Persoonlijke informatie die wij verzamelen of verwerken'");
    }
  }

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
