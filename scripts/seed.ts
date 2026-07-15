// Eenmalig seed-script: zet de content die eerst hardcoded in de site
// stond om naar echte Sanity-documenten, zodat de site niet leeg is
// zodra de pagina's op het CMS overschakelen.
//
// Gebruik: npm run seed
// Vereist in .env: PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET,
// SANITY_API_WRITE_TOKEN (een token met "Editor"-rechten).
//
// Veilig om opnieuw te draaien: gebruikt createIfNotExists per document,
// dus bestaande content wordt nooit overschreven of verdubbeld.

import "dotenv/config";
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Ontbrekende omgevingsvariabelen. Zorg dat PUBLIC_SANITY_PROJECT_ID en SANITY_API_WRITE_TOKEN in .env staan."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Seed-documenten hebben bewust wisselende vorm (volledige items vs.
// stub-items zonder detailvelden), dus een los object-type volstaat hier.
type SeedDoc = Record<string, unknown> & { _id: string; _type: string };

const key = () => Math.random().toString(36).slice(2, 10);

const paragraph = (text: string) => ({
  _type: "block" as const,
  _key: key(),
  style: "normal" as const,
  markDefs: [],
  children: [{ _type: "span" as const, _key: key(), text, marks: [] }],
});

const heading2 = (text: string) => ({
  _type: "block" as const,
  _key: key(),
  style: "h2" as const,
  markDefs: [],
  children: [{ _type: "span" as const, _key: key(), text, marks: [] }],
});

const pullQuote = (citaat: string) => ({
  _type: "pullQuote" as const,
  _key: key(),
  citaat,
});

async function run() {
  console.log("Seeden gestart...\n");

  console.log("GPX-bestand uploaden voor GR70...");
  const gpxAsset = await client.assets.upload(
    "file",
    readFileSync(path.join(__dirname, "seed-assets", "gr70-chemin-de-stevenson.gpx")),
    { filename: "gr70-chemin-de-stevenson.gpx", contentType: "application/gpx+xml" }
  );

  const recepten: SeedDoc[] = [
    {
      _id: "recept-soupe-au-pistou",
      _type: "recept",
      titel: "Soupe au pistou",
      slug: { _type: "slug", current: "soupe-au-pistou" },
      streek: "Provence",
      excerpt: "De Provençaalse groentesoep die pas leeft door de basilicumpasta die je er vers doorheen roert.",
      bereidingstijd: "45 min",
      aantalPersonen: "6 personen",
      niveau: "Gemakkelijk",
      intro: [
        paragraph(
          "Soupe au pistou is het bewijs dat een simpele groentesoep iets bijzonders wordt door één goed idee: de kruidenpasta apart houden tot het laatste moment. Wat in de Italiaanse keuken pesto heet, heet hier pistou — zonder pijnboompitten, met net iets meer knoflook. De soep zelf is flexibel: gebruik wat de groentela te bieden heeft, zolang de pistou er maar vers doorheen gaat."
        ),
      ],
      ingredientengroepen: [
        {
          _key: key(),
          titel: "Voor de soep",
          ingredienten: [
            "2 courgettes, in blokjes",
            "3 aardappelen, in blokjes",
            "2 wortels, in plakjes",
            "200 g witte bonen, uitgelekt",
            "200 g sperziebonen, in stukken",
            "2 tomaten, ontveld en in blokjes",
            "100 g kleine pastasoort (bv. coquillettes)",
            "2 liter groentebouillon",
            "Zout en versgemalen peper",
          ],
        },
        {
          _key: key(),
          titel: "Voor de pistou",
          ingredienten: [
            "3 tenen knoflook",
            "1 grote bos verse basilicum",
            "100 ml olijfolie",
            "60 g Parmezaanse kaas, geraspt",
          ],
        },
      ],
      bereidingsstappen: [
        { _key: key(), titel: "Bouillon aan de kook brengen", tekst: "Breng de groentebouillon aan de kook in een grote soeppan en breng op smaak met zout en peper." },
        { _key: key(), titel: "Aardappelen en wortels", tekst: "Voeg de aardappelen en wortels toe en laat 10 minuten zachtjes koken." },
        { _key: key(), titel: "De rest van de groenten", tekst: "Voeg de courgette, sperziebonen en witte bonen toe. Laat nog 10 minuten sudderen." },
        { _key: key(), titel: "Pasta en tomaat", tekst: "Roer de pasta en tomatenblokjes erdoor en kook nog 8 tot 10 minuten, tot de pasta beetgaar is." },
        { _key: key(), titel: "De pistou maken", tekst: "Stamp de knoflook, basilicum, olijfolie en Parmezaanse kaas in een vijzel (of blender) tot een grove, geurige pasta." },
        { _key: key(), titel: "Serveren", tekst: "Verdeel de soep over de kommen en roer bij elke kom vlak voor het serveren een flinke lepel pistou erdoor. Nooit meekoken — dan verliest de basilicum zijn frisheid." },
      ],
      tip: "Maak gerust een dubbele hoeveelheid pistou — met een laagje olijfolie erop bewaart het prima in de koelkast, heerlijk door pasta of op geroosterd brood.",
    },
    {
      _id: "recept-tarte-fine-aux-pommes",
      _type: "recept",
      titel: "Tarte fine aux pommes",
      slug: { _type: "slug", current: "tarte-fine-aux-pommes" },
      excerpt: "Boterdeeg zo dun als papier, dakpansgewijs belegd met appel — het toetje van elke Franse zondag.",
      bereidingstijd: "1 uur",
      niveau: "Gemiddeld",
    },
    {
      _id: "recept-poulet-basquaise",
      _type: "recept",
      titel: "Poulet basquaise",
      slug: { _type: "slug", current: "poulet-basquaise" },
      excerpt: "Kip stoofpot uit het Baskenland, traag gegaard met paprika, tomaat en een vleugje Espelette-peper.",
      bereidingstijd: "1,5 uur",
      niveau: "Gemakkelijk",
    },
    {
      _id: "recept-clafoutis-aux-cerises",
      _type: "recept",
      titel: "Clafoutis aux cerises",
      slug: { _type: "slug", current: "clafoutis-aux-cerises" },
      excerpt: "Een flan-achtige kersentaart uit de Limousin — je maakt hem sneller dan hij op is.",
      bereidingstijd: "50 min",
      niveau: "Gemakkelijk",
    },
  ];

  const wandelingen: SeedDoc[] = [
    {
      _id: "wandeling-gr70-chemin-de-stevenson",
      _type: "wandeling",
      titel: "GR70 — Chemin de Stevenson",
      slug: { _type: "slug", current: "gr70-chemin-de-stevenson" },
      streek: "Cévennes",
      excerpt: "Twaalf dagen door de Cévennes, in het spoor van Robert Louis Stevenson en zijn eigenzinnige ezel.",
      afstand: "252 km",
      duur: "12 dagen",
      hoogteverschil: "+9.000 m",
      niveau: "Matig zwaar",
      intro: [
        paragraph(
          "In 1878 liep de Schotse schrijver Robert Louis Stevenson twaalf dagen door de Cévennes, vergezeld door een ezel die hij liever kwijt dan rijk was. Zijn verslag, \"Travels with a Donkey in the Cévennes\", werd een klassieker — en het pad dat hij liep, is nu een van de mooiste lange-afstandsroutes van Frankrijk."
        ),
        paragraph(
          "De GR70 voert je over kale hoogvlaktes, door kastanjebossen en langs eenzame schaapskooien, met de Mont Lozère als hoogtepunt halverwege. Het pad is goed bewegwijzerd en elke etappe eindigt in een dorp met een gîte of kleine herberg — je hoeft dus niet met een tent te sjouwen."
        ),
      ],
      etappes: [
        "Le Puy-en-Velay → Le Monastier-sur-Gazeille",
        "Le Monastier → Le Bouchet-Saint-Nicolas",
        "Le Bouchet → Langogne",
        "Langogne → Cheylard-l'Évêque",
        "Cheylard → Luc",
        "Luc → Chasseradès",
        "Chasseradès → Le Bleymard",
        "Le Bleymard → Pont-de-Montvert (via Mont Lozère)",
        "Pont-de-Montvert → Florac",
        "Florac → Cassagnas",
        "Cassagnas → Saint-Jean-du-Gard",
        "Saint-Jean-du-Gard → Alès",
      ],
      gpxBestand: {
        _type: "file",
        asset: { _type: "reference", _ref: gpxAsset._id },
      },
    },
    {
      _id: "wandeling-calanques-van-marseille",
      _type: "wandeling",
      titel: "Calanques van Marseille",
      slug: { _type: "slug", current: "calanques-van-marseille" },
      excerpt: "Steile kalkkloven, turquoise water en geen boom die schaduw geeft — pak veel water mee.",
      afstand: "14 km",
      duur: "dagtocht",
    },
    {
      _id: "wandeling-gorges-du-verdon",
      _type: "wandeling",
      titel: "Gorges du Verdon",
      slug: { _type: "slug", current: "gorges-du-verdon" },
      excerpt: "De Grand Canyon van Europa, met paden die soms rakelings langs de rotswand lopen.",
      afstand: "18 km",
      duur: "dagtocht",
    },
    {
      _id: "wandeling-cirque-de-gavarnie",
      _type: "wandeling",
      titel: "Cirque de Gavarnie",
      slug: { _type: "slug", current: "cirque-de-gavarnie" },
      excerpt: "Een natuurlijk amfitheater in de Pyreneeën, met een waterval van driehonderd meter.",
      afstand: "9 km",
      duur: "halve dag",
    },
  ];

  const blogartikelen: SeedDoc[] = [
    {
      _id: "blogartikel-la-bise",
      _type: "blogartikel",
      titel: "Waarom Fransen elkaar twee, drie of vier keer kussen",
      slug: { _type: "slug", current: "la-bise" },
      onderwerp: "Tradities",
      excerpt: "La bise lijkt een simpel gebaar, tot je in het verkeerde departement de verkeerde kant op buigt.",
      dek: "La bise lijkt een simpel gebaar — tot je in het verkeerde departement de verkeerde kant op buigt en je voorhoofden tegen elkaar klappen.",
      leestijdMinuten: 6,
      inhoud: [
        paragraph(
          "Er bestaat geen officiële kaart, geen wetboek, geen app die het je vertelt — en toch weet vrijwel elke Fransman feilloos hoe vaak je elkaar een kus op de wang geeft wanneer je iemand begroet. In Parijs zijn het er meestal twee. Een stukje zuidelijker, in de Loire, kun je zomaar op vier uitkomen. In sommige delen van Bretagne volstaat er soms zelfs maar één."
        ),
        paragraph(
          "Het gebaar heet la bise en het is diep verankerd in het dagelijks leven: collega's begroeten elkaar ermee 's ochtends bij de koffieautomaat, vriendinnen doen het bij elke ontmoeting, en op familiefeesten kan het zomaar een kwartier duren voordat iedereen iedereen heeft gekust. Handen schudden is voor formelere, zakelijkere situaties — of voor wanneer je iemand voor het eerst ontmoet in een professionele context."
        ),
        heading2("Een kwestie van geografie"),
        paragraph(
          "Onderzoekers van de Franse combinatie-website combiendebises.free.fr (ja, die bestaat echt) verzamelden jarenlang meldingen van gebruikers over het aantal kussen per regio. Het resultaat is een lappendeken: geen twee aangrenzende departementen doen het noodzakelijk hetzelfde, en zelfs binnen één stad kan de gewoonte verschillen per generatie of sociale kring."
        ),
        paragraph(
          "Als vuistregel geldt: hoe verder naar het zuiden, hoe meer kussen je kan verwachten. Maar reken er niet op — de enige betrouwbare methode is simpelweg de ander laten leiden en een fractie van een seconde wachten voordat je je hoofd terugtrekt."
        ),
        pullQuote(
          "Als toerist hoef je het niet perfect te doen — het feit dat je het probeert, wordt bijna altijd gewaardeerd."
        ),
        heading2("Wanneer je het wél fout kan doen"),
        paragraph(
          "De grootste misstap is niet het verkeerde aantal, maar het verkeerde moment: la bise is voor bekenden en informele ontmoetingen, niet voor een eerste zakelijke kennismaking. En sinds een paar jaar geldt in sommige werkomgevingen — zeker sinds de pandemie — dat een korte knik of handdruk ook prima geaccepteerd wordt. Twijfel je? Kijk wat de ander doet, en volg."
        ),
      ],
    },
    {
      _id: "blogartikel-tu-of-vous",
      _type: "blogartikel",
      titel: "Tu of vous: wanneer je het echt fout kan doen",
      slug: { _type: "slug", current: "tu-of-vous" },
      onderwerp: "Taal",
      excerpt: "De regels lijken simpel, tot je collega van vijftig jaar plots vous tegen je zegt.",
    },
    {
      _id: "blogartikel-elke-streek-zijn-kaas",
      _type: "blogartikel",
      titel: "Waarom elke Franse streek zijn eigen kaas heeft",
      slug: { _type: "slug", current: "elke-streek-zijn-kaas" },
      onderwerp: "Eten & drinken",
      excerpt: "Meer dan 1.200 soorten, en elke Fransman is ervan overtuigd dat die van zijn streek de beste is.",
    },
    {
      _id: "blogartikel-de-zondagse-markt",
      _type: "blogartikel",
      titel: "De ongeschreven regels van de zondagse markt",
      slug: { _type: "slug", current: "de-zondagse-markt" },
      onderwerp: "Cultuur",
      excerpt: "Niet knijpen in het fruit, niet voordringen, en altijd 'bonjour' zeggen voordat je iets vraagt.",
    },
    {
      _id: "blogartikel-franse-schooltijden",
      _type: "blogartikel",
      titel: "Waarom Franse kinderen tot 18.00 uur op school kunnen zitten",
      slug: { _type: "slug", current: "franse-schooltijden" },
      onderwerp: "Cultuur",
      excerpt: "Het Franse schoolsysteem verrast elke nieuwkomer — meestal op de manier die je niet verwacht.",
    },
  ];

  const producten: SeedDoc[] = [
    {
      _id: "product-comte-24-maanden",
      _type: "product",
      naam: "Comté 24 maanden",
      slug: { _type: "slug", current: "comte-24-maanden" },
      categorie: "Kaas",
      prijs: "€ 22,50 / 500 g",
      herkomst: "Jura, Frankrijk",
      excerpt: "Twee jaar gerijpt in de kelders van het Jura, tot de smaak kristallen krijgt.",
      dek: "Een Comté die twee jaar in de kelders van het Jura heeft liggen rijpen, tot de smaak kristallen krijgt.",
      verhaal: [
        paragraph(
          "Comté wordt gemaakt van rauwe melk van Montbéliarde-koeien die op de hoogvlaktes van het Jura grazen. Elk wiel weegt zo'n veertig kilo en wordt gemaakt in een coöperatieve kaasmakerij — een \"fruitière\" — waar boeren van meerdere kleine bedrijven hun melk samenbrengen. Een eeuwenoude traditie die ervoor zorgt dat ook kleine boerderijen kunnen blijven bestaan."
        ),
        paragraph(
          "Wat deze Comté bijzonder maakt is de rijping: 24 maanden in de koele, vochtige kelders van affineur Marcel Petite, in het Fort Saint-Antoine — een negentiende-eeuws fort hoog in de bergen dat is omgebouwd tot rijpingskelder. Na twee jaar krijgt de kaas kleine, knapperige eiwitkristallen en een smaak die zweemt naar geroosterde hazelnoot, karamel en een vleugje bouillon."
        ),
        pullQuote("Hoe ouder de Comté, hoe kleiner de kristallen, hoe groter het verschil."),
        paragraph(
          "Ik proefde deze Comté voor het eerst bij een kaasboer op de markt van Lons-le-Saunier, die me een stukje liet proeven \"gewoon om te zien of ik het verschil zou merken\" met de jongere versies. Dat merkte ik meteen — en sindsdien haal ik hem elke keer als ik in de buurt ben."
        ),
      ],
    },
    {
      _id: "product-reblochon-fermier",
      _type: "product",
      naam: "Reblochon fermier",
      slug: { _type: "slug", current: "reblochon-fermier" },
      categorie: "Kaas",
      prijs: "€ 14,00 / stuk",
      herkomst: "Haute-Savoie",
      excerpt: "Zachte, wasachtige korst en een romige kern — de klassieker van de Haute-Savoie.",
    },
    {
      _id: "product-madeleinevorm-verkoperen",
      _type: "product",
      naam: "Madeleinevorm, verkoperen",
      slug: { _type: "slug", current: "madeleinevorm-verkoperen" },
      categorie: "Madeleines & bakvormen",
      prijs: "€ 28,00 / stuk",
      herkomst: "Commercy",
      excerpt: "Een gietvorm voor twaalf madeleines, precies zoals ze al generaties gemaakt worden in Commercy.",
    },
    {
      _id: "product-saucisson-sec-aux-herbes",
      _type: "product",
      naam: "Saucisson sec aux herbes de Provence",
      slug: { _type: "slug", current: "saucisson-sec-aux-herbes-de-provence" },
      categorie: "Droge worst",
      prijs: "€ 9,50 / 200 g",
      herkomst: "Provence",
      excerpt: "Traag gedroogde droge worst, op smaak gebracht met tijm en rozemarijn.",
    },
    {
      _id: "product-domaine-familiale-rose",
      _type: "product",
      naam: "Domaine familiale rosé",
      slug: { _type: "slug", current: "domaine-familiale-rose" },
      categorie: "Wijn",
      prijs: "€ 16,00 / fles (75 cl)",
      herkomst: "Côtes de Provence",
      excerpt: "Droog, fris, en precies de kleur van een Provençaalse zomeravond.",
      dek: "Een rosé van een familiedomein net buiten Draguignan — droog, fris, en precies de kleur van een Provençaalse zomeravond.",
      verhaal: [
        paragraph(
          "Het domein wordt al vier generaties gerund door dezelfde familie, op wijngaarden die grenzen aan de heuvels van de Massif des Maures. De druiven — grenache, cinsault en een beetje syrah — worden met de hand geplukt in de vroege ochtend, wanneer het nog koel genoeg is om de frisheid in de druif te bewaren."
        ),
        paragraph(
          "Wat deze rosé onderscheidt van de bekende supermarktflessen is de \"saignée\"-methode: een deel van het sap wordt na een paar uur contact met de schil afgetapt, wat zorgt voor die kenmerkende bleekroze kleur en een structuur die net iets meer body heeft dan de doorsnee zomerwijn."
        ),
        pullQuote("Deze rosé smaakt naar een keukentafel in de Provence, niet naar een strandbar."),
        paragraph(
          "Ik kreeg deze fles voor het eerst aangeboden door de wijnboer zelf, tijdens een proeverij aan de keukentafel van het domein — geen poespas, gewoon een fles, vijf glazen, en een gesprek dat drie uur duurde. Die avond nam ik een kist mee naar huis, en dat doe ik nog steeds elk jaar."
        ),
      ],
    },
    {
      _id: "product-savon-de-marseille",
      _type: "product",
      naam: "Savon de Marseille, olijfolie",
      slug: { _type: "slug", current: "savon-de-marseille-olijfolie" },
      categorie: "Zeep",
      prijs: "€ 6,50 / blok",
      herkomst: "Marseille",
      excerpt: "Traditionele zeepblokken, nog steeds gekookt volgens het eeuwenoude procedé.",
    },
    {
      _id: "product-etherische-lavendelolie",
      _type: "product",
      naam: "Etherische lavendelolie",
      slug: { _type: "slug", current: "etherische-lavendelolie" },
      categorie: "Etherische oliën",
      prijs: "€ 19,00 / 10 ml",
      herkomst: "Plateau de Valensole",
      excerpt: "Gedistilleerd op kleine schaal, met een geur die meteen aan de Provence doet denken.",
    },
  ];

  const siteInstellingen: SeedDoc = {
    _id: "siteInstellingen",
    _type: "siteInstellingen",
    contactEmail: "hallo@saveursavoir.nl",
    reactietijd: "Meestal binnen 2 à 3 werkdagen",
    footerTagline: "Frans leven, taal en landschap — met tijd genomen.",
    footerRegel: "Gevestigd in Nederland, met het hart in Frankrijk.",
  };

  const alleDocumenten = [...recepten, ...wandelingen, ...blogartikelen, ...producten, siteInstellingen];

  console.log(`\n${alleDocumenten.length} documenten seeden...`);
  for (const doc of alleDocumenten) {
    await client.createIfNotExists(doc);
    console.log(`✓ ${doc._id}`);
  }

  console.log("\nKlaar. Open /studio om de content te bekijken en aan te vullen met foto's.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
