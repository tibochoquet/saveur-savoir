# Saveur & Savoir

Marketing- en contentsite voor Saveur & Savoir — Frans leven, taal en
landschap. Astro + Tailwind, met Sanity als headless CMS.

## Stack

- **Astro 7** + TypeScript + Tailwind v4
- **Sanity** als CMS, ingebed in de site op `/studio`
- **Vercel** voor hosting
- **Web3Forms** voor het contactformulier (geen eigen backend)
- Geen webshop, geen betaalprovider — producten worden aangevraagd via e-mail

## Aan de slag

```sh
npm install
cp .env.example .env   # vul PUBLIC_SANITY_PROJECT_ID en PUBLIC_SANITY_DATASET in
npm run dev
```

De site draait op `localhost:4321`, de Sanity Studio op
`localhost:4321/studio`.

## Omgevingsvariabelen

Zie `.env.example`. Nooit in code hardcoden, nooit committen (`.env`
staat in `.gitignore`).

| Variabele                     | Waar te vinden                                                | Nodig voor             |
| ------------------------------ | ---------------------------------------------------------------- | ------------------------ |
| `PUBLIC_SANITY_PROJECT_ID`     | sanity.io/manage → je project                                    | site + Studio            |
| `PUBLIC_SANITY_DATASET`        | sanity.io/manage → je project (meestal `production`)             | site + Studio            |
| `SANITY_API_WRITE_TOKEN`       | sanity.io/manage → project → API → Tokens → "Editor"-rechten     | alleen `npm run seed`    |
| `PUBLIC_WEB3FORMS_ACCESS_KEY`  | web3forms.com (gratis, alleen e-mailadres nodig)                 | het contactformulier     |
| `PUBLIC_ALLOW_INDEXING`        | —                                                                 | zoekmachine-indexering aan/uit |

## Content en het CMS

Alle content (recepten, wandelingen, blogartikelen, producten,
site-instellingen) wordt beheerd in Sanity Studio op `/studio`. De
schema's staan in `src/sanity/schemaTypes/`.

Beeldvelden hebben altijd hotspot/crop aan en een verplicht alt-veld
zodra er een foto gekozen is. Zolang een item geen foto heeft, toont de
site automatisch een placeholder — dat hoeft dus niet met code opgelost
te worden.

Rich text (recepten-intro, wandelverhaal, blogartikelen, productverhaal)
is bewust beperkt tot kop 2/3, vet, cursief, link, lijst, afbeelding en
pull-quote — geen kleuren of lettertypes, zodat de opmaak van de site
niet doorbroken kan worden vanuit het Studio.

Een recept/wandeling/blogartikel/product is pas "gepubliceerd" (en dus
aanklikbaar op de overzichtspagina) zodra het hoofdinhoud-veld gevuld is
(bereidingsstappen, etappes + gpx-bestand, inhoud, of verhaal). Zonder
die inhoud verschijnt het item met een "Binnenkort"-label en zonder
link — precies zoals de eerdere hardcoded placeholders werkten.

### Seed-script

De content die eerst hardcoded in de site stond, staat als script klaar
om één keer te importeren zodat de site na het aansluiten van het CMS
niet leeg is:

```sh
npm run seed
```

Vereist `PUBLIC_SANITY_PROJECT_ID` en `SANITY_API_WRITE_TOKEN` in
`.env`. Het script is veilig om vaker te draaien — het gebruikt
`createIfNotExists`, dus het overschrijft nooit bestaande content.

## Deploy: automatische rebuild bij publiceren

De site is statisch gebouwd (`astro build`), dus een wijziging in
Sanity leidt pas tot een nieuwe site nadat Vercel opnieuw gebouwd
heeft. Dat gebeurt automatisch via een deploy hook + webhook:

### 1. Maak een deploy hook aan in Vercel

1. Ga naar je project in Vercel → **Settings** → **Git** → **Deploy Hooks**.
2. Geef het een naam (bv. "Sanity publish") en kies de branch (meestal `main`).
3. Klik **Create Hook** en kopieer de gegenereerde URL — dit is een geheime, uniek gegenereerde link die een deploy start zodra hij aangeroepen wordt.

### 2. Koppel die URL als webhook in Sanity

1. Ga naar [sanity.io/manage](https://www.sanity.io/manage) → je project → **API** → **Webhooks**.
2. Klik **Create webhook**.
3. **URL**: plak de deploy hook-URL van Vercel.
4. **Dataset**: `production` (of je eigen dataset).
5. **Trigger on**: Create, Update, Delete (alle wijzigingen).
6. **HTTP method**: `POST`.
7. Sla op.

Vanaf nu triggert elke publicatie in het Studio automatisch een nieuwe
Vercel-deploy, zodat de live site binnen enkele minuten de nieuwe
content toont. Er is geen verdere actie nodig vanuit de eigenaar — zij
publiceert gewoon in het Studio.

## Staging

Zolang de site nog niet op saveursavoir.nl staat, draait hij op een
tijdelijke `vercel.app`-URL met zoekmachine-indexering uitgeschakeld
(`noindex`-meta + een dichtgetimmerde `robots.txt`). Zet
`PUBLIC_ALLOW_INDEXING=true` in de Vercel-omgevingsvariabelen zodra het
eigen domein gekoppeld is.

## Commands

| Command           | Actie                                                |
| ------------------ | ------------------------------------------------------ |
| `npm install`      | Installeert dependencies                              |
| `npm run dev`      | Start lokale dev server + Studio op `localhost:4321`   |
| `npm run build`    | Bouwt de productie-site naar `./dist/`                 |
| `npm run preview`  | Preview van de build, lokaal                           |
| `npm run seed`     | Importeert de seed-data eenmalig naar Sanity            |
| `npm run astro ...`| Astro CLI-commando's, bv. `astro check`                |
