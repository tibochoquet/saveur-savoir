// Eenmalige migratie voor deze ronde (receptenkaart-terminologie +
// wederzijdse recept/product-koppeling):
// - Hernoemt receptkaartHandle -> receptenkaartHandle en
//   receptkaartKnoptekst -> receptenkaartKnoptekst op elk recept-document
//   (kopieert de waarde, verwijdert daarna het oude veld).
// - Zet receptenkaartTekst (de nieuwe, per-recept bewerkbare CTA-zin) op
//   de bestaande vaste zin, maar alleen bij recepten die de
//   receptenkaart-CTA al tonen (receptenkaartHandle ingevuld) — zodat er
//   voor bestaande, gepubliceerde recepten niets zichtbaars verandert.
// - gerelateerdeProducten (nieuw, "producten bij dit recept") en
//   productAanvulling (nieuw documenttype) blijven bewust leeg: dit zijn
//   pure toevoegingen die de eigenaar zelf invult wanneer ze relevant
//   zijn, geen zinvolle automatische startwaarde.
//
// Gebruik: npm run migrate:round9
// Veilig om opnieuw te draaien: als receptenkaartHandle al bestaat (dus
// de vorige run al gelukt is), gebeurt er niets meer voor dat document.

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

const STANDAARD_RECEPTENKAART_TEKST =
  "Liever dit recept als kant-en-klaar pakket in huis? Bekijk het als product in de webshop.";

interface LegacyRecept {
  _id: string;
  titel: string;
  receptkaartHandle?: string | null;
  receptkaartKnoptekst?: string | null;
  receptenkaartHandle?: string | null;
}

async function run() {
  console.log("Migratie gestart...\n");

  const recepten = await client.fetch<LegacyRecept[]>(
    `*[_type == "recept"]{ _id, titel, receptkaartHandle, receptkaartKnoptekst, receptenkaartHandle }`
  );

  console.log(`${recepten.length} recept(en) gevonden.\n`);

  for (const recept of recepten) {
    if (recept.receptenkaartHandle) {
      console.log(`  ${recept.titel}: al gemigreerd, overslaan`);
      continue;
    }

    const patch = client.patch(recept._id);

    if (recept.receptkaartHandle) {
      patch.set({
        receptenkaartHandle: recept.receptkaartHandle,
        receptenkaartKnoptekst: recept.receptkaartKnoptekst ?? undefined,
      });
      patch.setIfMissing({ receptenkaartTekst: STANDAARD_RECEPTENKAART_TEKST });
    }
    patch.unset(["receptkaartHandle", "receptkaartKnoptekst"]);

    await patch.commit();
    console.log(
      `  ${recept.titel}: ${recept.receptkaartHandle ? "receptkaartHandle -> receptenkaartHandle + CTA-zin gezet" : "geen receptkaart-koppeling, oude velden opgeruimd"}`
    );
  }

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
