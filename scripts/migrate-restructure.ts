// Eenmalige migratie voor de herstructurering:
// - onderwerpen worden losse documenten i.p.v. een vaste lijst
// - bestaande producten krijgen "soort: fysiek"
// - de wandeling "GR70" wordt een blogartikel + een digitaal product
//   (met het gpx-bestand), de drie ongepubliceerde wandelingen vervallen
// - een homepage-singleton wordt aangemaakt met de huidige tekst
//
// Gebruik: npm run migrate:restructure
// Veilig om opnieuw te draaien: gebruikt createIfNotExists/patch, geen
// destructieve stappen behalve het verwijderen van de vier
// wandeling-documenten (die na deze migratie geen schema meer hebben).

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

const numberListItem = (text: string) => ({
  _type: "block" as const,
  _key: key(),
  style: "normal" as const,
  listItem: "number" as const,
  level: 1,
  markDefs: [],
  children: [{ _type: "span" as const, _key: key(), text, marks: [] }],
});

async function run() {
  console.log("Migratie gestart...\n");

  // 1. Onderwerpen als losse documenten
  const onderwerpen = [
    { id: "onderwerp-tradities", titel: "Tradities", slug: "tradities" },
    { id: "onderwerp-taal", titel: "Taal", slug: "taal" },
    { id: "onderwerp-eten-drinken", titel: "Eten & drinken", slug: "eten-drinken" },
    { id: "onderwerp-cultuur", titel: "Cultuur", slug: "cultuur" },
    { id: "onderwerp-natuur", titel: "Natuur", slug: "natuur" },
  ];

  console.log("Onderwerpen aanmaken...");
  for (const o of onderwerpen) {
    await client.createIfNotExists({
      _id: o.id,
      _type: "onderwerp",
      titel: o.titel,
      slug: { _type: "slug", current: o.slug },
    });
    console.log(`✓ ${o.id}`);
  }

  // 2. Bestaande blogartikelen: onderwerp-string -> reference
  const onderwerpPerArtikel: Record<string, string> = {
    "blogartikel-la-bise": "onderwerp-tradities",
    "blogartikel-tu-of-vous": "onderwerp-taal",
    "blogartikel-elke-streek-zijn-kaas": "onderwerp-eten-drinken",
    "blogartikel-de-zondagse-markt": "onderwerp-cultuur",
    "blogartikel-franse-schooltijden": "onderwerp-cultuur",
  };

  console.log("\nBlogartikelen: onderwerp omzetten naar reference...");
  for (const [artikelId, onderwerpId] of Object.entries(onderwerpPerArtikel)) {
    await client
      .patch(artikelId)
      .set({ onderwerp: { _type: "reference", _ref: onderwerpId } })
      .commit({ autoGenerateArrayKeys: true });
    console.log(`✓ ${artikelId} -> ${onderwerpId}`);
  }

  // 3. Bestaande producten: soort = fysiek
  const bestaandeProducten = [
    "product-comte-24-maanden",
    "product-reblochon-fermier",
    "product-madeleinevorm-verkoperen",
    "product-saucisson-sec-aux-herbes",
    "product-domaine-familiale-rose",
    "product-savon-de-marseille",
    "product-etherische-lavendelolie",
  ];

  console.log("\nBestaande producten: soort = fysiek...");
  for (const id of bestaandeProducten) {
    await client.patch(id).setIfMissing({ soort: "fysiek" }).commit();
    console.log(`✓ ${id}`);
  }

  // 4. GR70: wandeling -> blogartikel + digitaal product
  console.log("\nGR70 migreren naar blogartikel + digitaal product...");

  const gpxAssetRef = "file-ceeca918d7fd4a70de64d377c8ba9947287b8c9f-gpx";

  await client.createIfNotExists({
    _id: "product-gr70-chemin-de-stevenson-gpx",
    _type: "product",
    naam: "GR70 — Chemin de Stevenson (gpx-bestand)",
    slug: { _type: "slug", current: "gr70-chemin-de-stevenson-gpx" },
    categorie: "Wandelroutes",
    soort: "digitaal",
    prijs: "€ 4,50 / bestand",
    herkomst: "Cévennes",
    excerpt: "Het volledige gpx-bestand van de GR70, met alle twaalf etappes.",
    dek: "Het gpx-bestand achter het verhaal van de GR70 — twaalf etappes, van Le Puy-en-Velay tot Alès.",
    gpxBestand: { _type: "file", asset: { _type: "reference", _ref: gpxAssetRef } },
    verhaal: [
      paragraph(
        "Dit is het volledige trackbestand van de GR70, de Chemin de Stevenson, van Le Puy-en-Velay tot Alès. Twaalf etappes, 252 km, rechtstreeks te openen in elke wandel-app of gps-toestel."
      ),
      paragraph(
        "Bij het bestand hoort een verhaal — te lezen op de blog — over Robert Louis Stevenson, zijn ezel Modestine, en de route die hij per ongeluk beroemd maakte."
      ),
    ],
  });
  console.log("✓ product-gr70-chemin-de-stevenson-gpx");

  await client.createIfNotExists({
    _id: "blogartikel-gr70-chemin-de-stevenson",
    _type: "blogartikel",
    titel: "GR70 — Chemin de Stevenson",
    slug: { _type: "slug", current: "gr70-chemin-de-stevenson" },
    onderwerp: { _type: "reference", _ref: "onderwerp-natuur" },
    excerpt: "Twaalf dagen door de Cévennes, in het spoor van Robert Louis Stevenson en zijn eigenzinnige ezel.",
    dek: "Twaalf dagen door de Cévennes, over dezelfde paden die Robert Louis Stevenson in 1878 aflegde met een koppige ezel genaamd Modestine.",
    leestijdMinuten: 8,
    inhoud: [
      paragraph(
        "In 1878 liep de Schotse schrijver Robert Louis Stevenson twaalf dagen door de Cévennes, vergezeld door een ezel die hij liever kwijt dan rijk was. Zijn verslag, \"Travels with a Donkey in the Cévennes\", werd een klassieker — en het pad dat hij liep, is nu een van de mooiste lange-afstandsroutes van Frankrijk."
      ),
      paragraph(
        "De GR70 voert je over kale hoogvlaktes, door kastanjebossen en langs eenzame schaapskooien, met de Mont Lozère als hoogtepunt halverwege. Het pad is goed bewegwijzerd en elke etappe eindigt in een dorp met een gîte of kleine herberg — je hoeft dus niet met een tent te sjouwen."
      ),
      paragraph(
        "In cijfers: 252 km, verspreid over 12 dagen, met een hoogteverschil van zo'n 9.000 meter. Niveau: matig zwaar — prima te doen met een redelijke conditie, maar geen wandeling voor de allereerste keer."
      ),
      paragraph("De twaalf etappes op een rij:"),
      numberListItem("Le Puy-en-Velay → Le Monastier-sur-Gazeille"),
      numberListItem("Le Monastier → Le Bouchet-Saint-Nicolas"),
      numberListItem("Le Bouchet → Langogne"),
      numberListItem("Langogne → Cheylard-l'Évêque"),
      numberListItem("Cheylard → Luc"),
      numberListItem("Luc → Chasseradès"),
      numberListItem("Chasseradès → Le Bleymard"),
      numberListItem("Le Bleymard → Pont-de-Montvert (via Mont Lozère)"),
      numberListItem("Pont-de-Montvert → Florac"),
      numberListItem("Florac → Cassagnas"),
      numberListItem("Cassagnas → Saint-Jean-du-Gard"),
      numberListItem("Saint-Jean-du-Gard → Alès"),
    ],
    gerelateerdProduct: { _type: "reference", _ref: "product-gr70-chemin-de-stevenson-gpx" },
  });
  console.log("✓ blogartikel-gr70-chemin-de-stevenson");

  // 5. Homepage-singleton
  console.log("\nHomepage-singleton aanmaken...");
  await client.createIfNotExists({
    _id: "homepage",
    _type: "homepage",
    heroEyebrow: "Frans leven, taal & landschap",
    heroTitel: "Een Franse zomer, het hele jaar door.",
    heroIntro:
      "Ik help je Frankrijk beter te begrijpen — de taal, de keuken, de paden door het landschap. Rustig opgebouwd, met aandacht voor detail.",
    heroCtaPrimair: "Ontdek wat ik bied",
    heroCtaSecundair: "Over mij",
    overMijEyebrow: "Wie ben ik",
    overMijTitel: "Frankrijk is geen bestemming. Het is een manier van kijken.",
    overMijTekst:
      "Al jaren trekt Frankrijk aan me — de taal, de tafels, de trage paden door de heuvels. Saveur & Savoir is waar ik dat deel: met wie Frans wil leren spreken, wie op zoek is naar een goed recept, of wie gewoon graag leest over een land dat nooit uitgeleerd raakt.",
    overMijQuote: "Traag reizen begint met traag kijken.",
    aanbodEyebrow: "Wat ik bied",
    aanbodTitel: "Vier manieren om dichter bij Frankrijk te komen.",
    aanbodItems: [
      {
        _key: key(),
        titel: "Diensten",
        tekst: "Vertalingen, ondertiteling en privéles Frans of Nederlands — persoonlijk en op maat.",
      },
      {
        _key: key(),
        titel: "Franse recepten",
        tekst: "Gerechten uit Franse keukens, uitgeprobeerd en doorverteld — met de verhalen erbij.",
      },
      {
        _key: key(),
        titel: "Webshop",
        tekst: "Een kleine etalage van dingen die ik zelf gebruik en aanraad, rechtstreeks uit Frankrijk.",
      },
      {
        _key: key(),
        titel: "Blog",
        tekst: "Franse cultuur en tradities, kleine ontdekkingen en \"wist je dat\"-verhalen.",
      },
    ],
    contactEyebrow: "Contact",
    contactTitel: "Vraag, idee, of gewoon zin om te praten over Frankrijk?",
    contactTekst: "Stuur een bericht — ik antwoord graag persoonlijk, meestal binnen een paar dagen.",
    contactCta: "Stuur een bericht",
  });
  console.log("✓ homepage");

  // 6. Oude wandeling-documenten verwijderen
  console.log("\nWandeling-documenten verwijderen (contenttype vervalt)...");
  const wandelingIds = [
    "wandeling-gr70-chemin-de-stevenson",
    "wandeling-calanques-van-marseille",
    "wandeling-gorges-du-verdon",
    "wandeling-cirque-de-gavarnie",
  ];
  for (const id of wandelingIds) {
    await client.delete(id);
    console.log(`✓ verwijderd: ${id}`);
  }

  console.log("\nMigratie voltooid.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
