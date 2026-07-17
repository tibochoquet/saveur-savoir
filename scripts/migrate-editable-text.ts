// Eenmalige migratie voor:
// - de "witregels verdwijnen"-bug: bestaande plain-text velden op de
//   homepage (heroIntro, overMijTekst, contactTekst, aanbodItems[].tekst)
//   worden omgezet naar eenvoudigeTekst (array van blokken), waarbij
//   elke regel in de oude tekst een eigen alinea wordt. Dat is de
//   veiligste algemene regel: de eigenaar typte losse regels (Enter of
//   een lege regel) steeds met de bedoeling om ze apart te tonen.
// - vijf nieuwe paginatekst-singletons (Webshop, Diensten, Recepten,
//   Blog, Contact), geseed met de huidige hardcoded tekst.
// - nieuwe footer-velden in siteInstellingen, geseed met de huidige
//   hardcoded labels.
//
// Gebruik: npm run migrate:editable-text
// Veilig om opnieuw te draaien voor de pagina-singletons en
// footer-velden (createIfNotExists / setIfMissing). De homepage-tekst-
// conversie zelf is niet idempotent bedoeld om per ongeluk twee keer te
// draaien nadat de eigenaar de tekst in de nieuwe rich text-editor
// heeft aangepast — controleer dus of dit al gedraaid is voor je het
// opnieuw doet.

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

// Elke regel (op basis van \n, dus zowel losse Enters als lege
// regels) wordt een eigen alinea-blok. Lege regels worden overgeslagen.
function tekstNaarBlokken(tekst: string) {
  return tekst
    .split("\n")
    .map((regel) => regel.trim())
    .filter((regel) => regel.length > 0)
    .map((regel) => ({
      _type: "block" as const,
      _key: key(),
      style: "normal" as const,
      markDefs: [],
      children: [{ _type: "span" as const, _key: key(), text: regel, marks: [] }],
    }));
}

async function run() {
  console.log("Migratie gestart...\n");

  // 1. Homepage: plain-text velden omzetten naar eenvoudigeTekst
  console.log("Homepage: tekstvelden omzetten naar alinea's...");
  const homepage = await client.fetch<Record<string, any>>(`*[_type == "homepage"][0]`);

  if (!homepage) {
    console.log("Geen homepage-document gevonden — sla deze stap over.");
  } else {
    const patch: Record<string, unknown> = {};

    for (const field of ["heroIntro", "overMijTekst", "contactTekst"] as const) {
      const waarde = homepage[field];
      if (typeof waarde === "string") {
        patch[field] = tekstNaarBlokken(waarde);
      }
    }

    if (Array.isArray(homepage.aanbodItems)) {
      patch.aanbodItems = homepage.aanbodItems.map((item: Record<string, any>) => ({
        ...item,
        tekst: typeof item.tekst === "string" ? tekstNaarBlokken(item.tekst) : item.tekst,
      }));
    }

    if (Object.keys(patch).length > 0) {
      await client.patch("homepage").set(patch).commit({ autoGenerateArrayKeys: true });
      console.log("✓ homepage bijgewerkt:", Object.keys(patch).join(", "));
    } else {
      console.log("Homepage-velden waren al geen plain text meer — niets te doen.");
    }
  }

  // 2. Vijf nieuwe paginatekst-singletons
  console.log("\nPaginatekst-singletons aanmaken...");

  const paginas = [
    {
      id: "paginaWebshop",
      type: "paginaWebshop",
      paginatitel: "Webshop",
      kop: "Een kleine etalage, rechtstreeks uit Frankrijk.",
      introtekst:
        "Nog geen kassa, geen winkelmand — je vraagt een product aan via het contactformulier, en ik antwoord persoonlijk met prijs, beschikbaarheid en (bij fysieke producten) verzendopties.",
    },
    {
      id: "paginaDiensten",
      type: "paginaDiensten",
      paginatitel: "Diensten",
      kop: "Twee manieren om samen te werken.",
      introtekst:
        "Naast alles wat er te lezen en te ontdekken is, help ik ook direct — met taal die klopt en les die aansluit bij jouw tempo.",
    },
    {
      id: "paginaRecepten",
      type: "paginaRecepten",
      paginatitel: "Franse recepten",
      kop: "Gerechten om je keuken naar Frankrijk te verplaatsen.",
      introtekst:
        "Geen ingewikkelde technieken, wel echte smaak — recepten die ik zelf keer op keer maak, met de verhalen en trucjes erbij.",
    },
    {
      id: "paginaBlog",
      type: "paginaBlog",
      paginatitel: "Blog",
      kop: "Franse cultuur, in kleine porties.",
      introtekst:
        "Gewoontes, gebruiken en \"wist je dat\"-verhalen die je niet in een reisgids vindt.",
    },
    {
      id: "paginaContact",
      type: "paginaContact",
      paginatitel: "Contact",
      kop: "Vraag, idee, of gewoon zin om te praten over Frankrijk?",
      introtekst: "Stuur een bericht — ik antwoord graag persoonlijk, meestal binnen een paar dagen.",
    },
  ];

  for (const pagina of paginas) {
    await client.createIfNotExists({
      _id: pagina.id,
      _type: pagina.type,
      paginatitel: pagina.paginatitel,
      kop: pagina.kop,
      introtekst: tekstNaarBlokken(pagina.introtekst),
    });
    console.log(`✓ ${pagina.id}`);
  }

  // 3. Footer-velden in siteInstellingen
  console.log("\nFooter-velden toevoegen aan siteInstellingen...");
  await client
    .patch("siteInstellingen")
    .setIfMissing({
      footerDiensten: {
        titel: "Diensten",
        link1Label: "Vertalingen & ondertiteling",
        link2Label: "Privéles Frans & Nederlands",
      },
      footerOntdekken: {
        titel: "Ontdekken",
        link1Label: "Franse recepten",
        link2Label: "Webshop",
        link3Label: "Blog",
      },
      footerContact: {
        titel: "Contact",
        link1Label: "Stuur een bericht",
      },
    })
    .commit();
  console.log("✓ siteInstellingen bijgewerkt");

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
