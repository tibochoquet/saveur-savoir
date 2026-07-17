// Eenmalige migratie voor "alles bewerkbaar":
// - nieuwe velden op de bestaande paginaWebshop/paginaDiensten/paginaContact
// - twee volledig nieuwe dienstpagina-singletons (Vertalingen, Privéles),
//   geseed met de huidige hardcoded tekst
// - vijf lege juridische pagina's (titel gezet, inhoud leeg — die schrijft
//   de eigenaar zelf)
//
// Gebruik: npm run migrate:alles-bewerkbaar
// Veilig om opnieuw te draaien: gebruikt createIfNotExists/setIfMissing.

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

const paragraph = (text: string) => ({
  _type: "block" as const,
  _key: key(),
  style: "normal" as const,
  markDefs: [],
  children: [{ _type: "span" as const, _key: key(), text, marks: [] }],
});

const tekst = (t: string) => [paragraph(t)];

async function run() {
  console.log("Migratie gestart...\n");

  // 1. paginaWebshop: bestelStappen
  console.log("paginaWebshop: bestelStappen toevoegen...");
  await client
    .patch("paginaWebshop")
    .setIfMissing({
      bestelStappen: [
        {
          _key: key(),
          titel: "Mail",
          tekst: tekst("Je stuurt een aanvraag via het contactformulier, met het product dat je wilt."),
        },
        {
          _key: key(),
          titel: "Bevestiging",
          tekst: tekst(
            "Ik laat binnen enkele dagen weten of het product beschikbaar is, en bevestig prijs en verzendkosten."
          ),
        },
        {
          _key: key(),
          titel: "Verzending",
          tekst: tekst("Na de betalingsafspraak verstuur ik het product, met een trackinglink waar mogelijk."),
        },
      ],
    })
    .commit({ autoGenerateArrayKeys: true });
  console.log("✓ paginaWebshop");

  // 2. paginaDiensten: dienstenItems
  console.log("\npaginaDiensten: dienstenItems toevoegen...");
  await client
    .patch("paginaDiensten")
    .setIfMissing({
      dienstenItems: [
        {
          _key: key(),
          titel: "Vertalingen & ondertiteling",
          tekst: tekst(
            "Frans-Nederlands en Nederlands-Frans, met oog voor toon en nuance — van zakelijke documenten tot ondertiteling."
          ),
        },
        {
          _key: key(),
          titel: "Privéles Frans & Nederlands",
          tekst: tekst(
            "Persoonlijke lessen, op maat van jouw niveau en tempo. Voor wie eindelijk vloeiend mee wil praten."
          ),
        },
      ],
    })
    .commit({ autoGenerateArrayKeys: true });
  console.log("✓ paginaDiensten");

  // 3. paginaContact: onderwerpSuggesties
  console.log("\npaginaContact: onderwerpSuggesties toevoegen...");
  await client
    .patch("paginaContact")
    .setIfMissing({
      onderwerpSuggesties: [
        "Vertalingen & ondertiteling",
        "Privéles Frans of Nederlands",
        "Een recept of wandeling",
        "Franse producten",
        "Iets anders",
      ],
    })
    .commit();
  console.log("✓ paginaContact");

  // 4. paginaVertalingen (volledig nieuw)
  console.log("\npaginaVertalingen aanmaken...");
  await client.createIfNotExists({
    _id: "paginaVertalingen",
    _type: "paginaVertalingen",
    heroEyebrow: "Dienst",
    heroTitel: "Vertalingen & ondertiteling",
    heroIntro: tekst("Frans-Nederlands en Nederlands-Frans, zodat je boodschap overeind blijft — ook als de taal verandert."),
    heroKnoptekst: "Vraag een offerte aan",
    watHetIsEyebrow: "Wat het is",
    watHetIsTekst: [
      paragraph(
        "Een goede vertaling leest niet als een vertaling. Ik werk woord voor woord, maar denk in betekenis: wat wil deze tekst bij de lezer losmaken, en hoe doe je dat in de andere taal?"
      ),
      paragraph(
        "Van korte teksten tot volledige documenten, van ondertiteling voor een video tot een e-mailwisseling die precies de juiste toon moet raken — ik lever vertalingen die klinken alsof ze meteen zo geschreven zijn."
      ),
    ],
    voorWieEyebrow: "Voor wie",
    voorWieItems: [
      {
        _key: key(),
        titel: "Bedrijven",
        tekst: tekst("Zakelijke correspondentie, websites en contracten die ook in het Frans professioneel moeten overkomen."),
      },
      {
        _key: key(),
        titel: "Particulieren",
        tekst: tekst("Persoonlijke documenten, brieven of een verhuizing naar Frankrijk waarbij elk woord moet kloppen."),
      },
      {
        _key: key(),
        titel: "Makers",
        tekst: tekst("Ondertiteling voor video's, documentaires en podcasts — Frans-Nederlands en andersom."),
      },
    ],
    hoeHetWerktEyebrow: "Hoe het werkt",
    hoeHetWerktStappen: [
      { _key: key(), titel: "Aanvraag", tekst: tekst("Je stuurt je tekst of video op, met een idee van de deadline.") },
      { _key: key(), titel: "Offerte", tekst: tekst("Binnen twee werkdagen krijg je een duidelijke prijs en planning.") },
      { _key: key(), titel: "Vertaling", tekst: tekst("Ik vertaal met aandacht voor toon, context en doelgroep.") },
      { _key: key(), titel: "Revisie", tekst: tekst("Je krijgt een kans om vragen te stellen en aanpassingen te vragen.") },
      { _key: key(), titel: "Levering", tekst: tekst("Je ontvangt het eindresultaat in het format dat jij nodig hebt.") },
    ],
    ctaEyebrow: "Aan de slag",
    ctaTitel: "Heb je een tekst die om de juiste woorden vraagt?",
    ctaTekst: tekst("Stuur me je document of video door — ik laat binnen twee werkdagen weten wat het kost en hoe lang het duurt."),
    ctaKnoptekst: "Neem contact op",
  });
  console.log("✓ paginaVertalingen");

  // 5. paginaPriveLes (volledig nieuw)
  console.log("\npaginaPriveLes aanmaken...");
  await client.createIfNotExists({
    _id: "paginaPriveLes",
    _type: "paginaPriveLes",
    heroEyebrow: "Dienst",
    heroTitel: "Privéles Frans & Nederlands",
    heroIntro: tekst("Geen klas, geen leerboek dat niet bij je past — gewoon jij, ik, en een taal die eindelijk gaat kloppen."),
    heroKnoptekst: "Plan een kennismaking",
    watHetIsEyebrow: "Wat het is",
    watHetIsTekst: tekst(
      "Privéles betekent dat de les om jou draait, niet om een methode. We beginnen bij wat je al kan en bouwen van daaruit verder, in het tempo dat bij jouw leven past — of dat nu een half uur per week is of een intensief traject voor een verhuizing."
    ),
    doelgroepEyebrow: "Voor wie",
    doelgroepenItems: [
      {
        _key: key(),
        titel: "Frans leren",
        tekst: tekst("Voor wie een huis in Frankrijk heeft, er vaak komt, of gewoon eindelijk het gesprek aan de bar durft aan te gaan."),
      },
      {
        _key: key(),
        titel: "Nederlands leren",
        tekst: tekst("Voor Franstaligen die in Nederland wonen, werken of studeren en snel praktische taalvaardigheid nodig hebben."),
      },
    ],
    hoeHetWerktEyebrow: "Hoe het werkt",
    hoeHetWerktStappen: [
      { _key: key(), titel: "Kennismaking", tekst: tekst("Een gratis gesprek van 20 minuten om niveau en doel te bepalen.") },
      { _key: key(), titel: "Lesplan", tekst: tekst("Een programma op maat, gebouwd rond wat jij echt wilt kunnen.") },
      { _key: key(), titel: "Lessen", tekst: tekst("Wekelijks of tweewekelijks, online of in levenden lijve.") },
      { _key: key(), titel: "Bijstellen", tekst: tekst("Elke paar weken kijken we samen of het tempo nog klopt.") },
    ],
    ctaEyebrow: "Aan de slag",
    ctaTitel: "Klaar om eindelijk vloeiend mee te praten?",
    ctaTekst: tekst("De eerste kennismaking is vrijblijvend — daarna weten we allebei of het klikt."),
    ctaKnoptekst: "Neem contact op",
  });
  console.log("✓ paginaPriveLes");

  // 6. Vijf juridische pagina's — titel gezet, inhoud leeg
  console.log("\nJuridische pagina's aanmaken (leeg, eigenaar vult zelf aan)...");
  const juridischePaginas = [
    { id: "disclaimer", titel: "Disclaimer" },
    { id: "privacybeleid", titel: "Privacybeleid" },
    { id: "herroeping", titel: "Herroeping" },
    { id: "algemeneVoorwaarden", titel: "Algemene voorwaarden" },
    { id: "verzendenRetourneren", titel: "Verzenden & Retourneren" },
  ];
  for (const p of juridischePaginas) {
    await client.createIfNotExists({ _id: p.id, _type: "juridischePagina", titel: p.titel });
    console.log(`✓ ${p.id}`);
  }

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
