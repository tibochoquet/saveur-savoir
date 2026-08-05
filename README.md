# Saveur & Savoir

Marketing- en contentsite voor Saveur & Savoir — Frans leven, taal en
landschap. Astro + Tailwind, met Sanity als headless CMS.

## Stack

- **Astro 7** + TypeScript + Tailwind v4, hybride gerenderd via de
  **Vercel-adapter**: de meeste pagina's zijn statisch (Sanity-content),
  `/webshop` + productpagina's renderen op-aanvraag (zie "Shopify-koppeling")
- **Sanity** als CMS, ingebed in de site op `/studio` (recepten, blog, pagina's)
- **Shopify** (Storefront API) is de enige bron voor productdata — geen
  productdata in Sanity. Afrekenen gebeurt op Shopify zelf, niet op deze site
- **Vercel** voor hosting
- **Web3Forms** voor het contactformulier (geen eigen backend)

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
| `PUBLIC_SHOPIFY_DOMAIN`        | jouw-winkel.myshopify.com                                        | de webshop op `/webshop` |
| `PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Shopify admin → Headless-kanaal → zie "Shopify-koppeling" hieronder | de webshop + winkelwagen |
| `SHOPIFY_WEBHOOK_SECRET`       | Shopify admin → Instellingen → Notificaties → onderaan "Webhooks"     | de Shopify-webhook (`/api/shopify-webhook`) |
| `VERCEL_DEPLOY_HOOK_URL`       | Vercel-project → Settings → Git → Deploy Hooks                       | de Shopify-webhook (triggert een rebuild) |
| `PUBLIC_ALLOW_INDEXING`        | —                                                                 | zoekmachine-indexering aan/uit |
| `PUBLIC_GA_ID`                 | analytics.google.com → Beheer → Gegevens verzamelen → Streamgegevens | Google Analytics (zie "Cookietoestemming en Google Analytics") |

## Content en het CMS

Alle content (recepten, blogartikelen, pagina's, site-instellingen) wordt
beheerd in Sanity Studio op `/studio`. De schema's staan in
`src/sanity/schemaTypes/`. Productdata zelf staat niet in Sanity — die komt
uitsluitend uit Shopify (zie "Shopify-koppeling" verderop).

Beeldvelden hebben altijd hotspot/crop aan en een verplicht alt-veld
zodra er een foto gekozen is. Zolang een item geen foto heeft, toont de
site automatisch een placeholder — dat hoeft dus niet met code opgelost
te worden.

Rich text (recepten-intro, wandelverhaal, blogartikelen, productverhaal)
is bewust beperkt tot kop 2/3, vet, cursief, link, lijst, afbeelding en
pull-quote — geen kleuren of lettertypes, zodat de opmaak van de site
niet doorbroken kan worden vanuit het Studio.

Een recept/blogartikel/product is pas "gepubliceerd" (en dus aanklikbaar
op de overzichtspagina) zodra het hoofdinhoud-veld gevuld is
(introductietekst bij een recept, inhoud bij een blogartikel, verhaal bij
een product). Zonder die inhoud verschijnt het item met een
"Binnenkort"-label en zonder link — precies zoals de eerdere hardcoded
placeholders werkten.

### SEO-titel en -omschrijving per pagina

Elke pagina-singleton (Homepage, Webshop, Diensten, Vertalingen, Privéles,
Recepten, Blog, Contact, en elke juridische pagina) heeft een optioneel
veld **SEO-titel** en **SEO-omschrijving** (onderaan het document, meestal
ingeklapt). Leeg = de site valt terug op de gewone paginatitel. Alleen de
homepage heeft een hardcoded standaardtitel als niemand ooit een
SEO-titel invult: "Saveur & Savoir | Franse recepten, Franse producten,
vertalingen & Franse lessen".

### Recept als "receptkaart"

Een recept kan gekoppeld worden aan een product in de webshop via
**"Receptkaart — webshopproduct (handle)"** op het recept (de handle uit
de Shopify-productURL) plus een optionele eigen knoptekst. Ingevuld =
er verschijnt onderaan het recept een CTA-blok naar dat product; leeg =
geen blok. De oude ingrediënten/bereidingsstappen-velden staan nog in
Studio (ingeklapt onder "Archief") maar worden niet meer op de site
getoond — bewust niet verwijderd, zodat bestaande content niet verloren
gaat.

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

## Shopify-koppeling (webshop)

`/webshop` toont de productcatalogus rechtstreeks uit Shopify via de
**Storefront API** (titel, prijs, foto's, beschrijving, beschikbaarheid en
collectie/categorie). Er is een eigen winkelwagen (`/winkelwagen`, plus het
cart-icoon in de header) die rechtstreeks met Shopify's **Storefront Cart
API** praat — geen eigen ordersysteem. Vanuit de winkelwagen ga je naar
Shopify's eigen hosted checkout om af te rekenen.

Sanity blijft verantwoordelijk voor al het overige (recepten, blog,
pagina's, de intro-tekst en "Hoe bestellen werkt"-uitleg bovenaan/onderaan
`/webshop`). Alleen de productdata zelf komt uit Shopify — Shopify is
daarin de enige bron, er is bewust geen Sanity-synchronisatie/kopie van
productdata.

### Rendering: statisch vs. op-aanvraag

`/webshop` en de productdetailpagina's (`export const prerender = false`
in beide bestanden) renderen **op-aanvraag** via de Vercel-adapter, met een
korte ISR-cache van 60 seconden (`astro.config.mjs`). Prijs, voorraad en
nieuwe/verwijderde producten zijn dus binnen zo'n minuut zichtbaar, zonder
dat er een nieuwe build nodig is. De rest van de site (homepage, recepten,
blog, diensten, juridische pagina's) blijft volledig statisch — die content
verandert alleen wanneer er in Sanity gepubliceerd wordt.

### Shopify-webhook (vangnet)

Naast de ISR-cache is er `/api/shopify-webhook` (`src/pages/api/shopify-webhook.ts`):
bij elke product create/update/delete in Shopify triggert dit direct een
volledige Vercel-rebuild, zodat ook de weinige **statische** pagina's die
Shopify-data raadplegen (bv. de Receptkaart-check in `recepten/[slug].astro`,
die op build-time controleert of de gekoppelde handle nog bestaat) meteen
meebewegen, in plaats van te wachten op de eerstvolgende Sanity-publicatie.

Instellen in Shopify admin:

1. Ga naar **Instellingen → Notificaties**.
2. Scroll naar **Webhooks** onderaan de pagina.
3. Maak drie webhooks aan, telkens met URL `https://saveursavoir.nl/api/shopify-webhook`
   en formaat **JSON**:
   - Event: **Product creation**
   - Event: **Product update**
   - Event: **Product deletion**
4. Kopieer de **Webhook-signing secret** die op diezelfde pagina staat
   (geldt voor alle webhooks van deze winkel) naar `SHOPIFY_WEBHOOK_SECRET`
   in Vercel.
5. Zorg dat `VERCEL_DEPLOY_HOOK_URL` in Vercel wijst naar een deploy hook
   (zie "Deploy: automatische rebuild bij publiceren" hieronder — dezelfde
   soort hook als voor Sanity, mag een aparte, nieuwe hook zijn).

Zonder deze twee env-vars geeft `/api/shopify-webhook` een `500`-fout terug
in plaats van de site te breken — de ISR-cache blijft in dat geval het
enige (iets tragere) verversingsmechanisme.

### Token aanmaken

De eenvoudigste manier is via Shopify's eigen **Headless**-kanaal (geen
custom-app-gedoe nodig):

1. Shopify admin → **Instellingen → Apps en verkoopkanalen**.
2. **Shopify App Store verkennen** → zoek **"Headless"** (gratis, officieel
   van Shopify) → installeren.
3. Maak in Headless een nieuwe **Storefront** aan (bv. "Website").
4. Kies **Storefront API** (niet Klantaccount-API).
5. Kopieer de **openbare (public) access token** — dat is
   `PUBLIC_SHOPIFY_STOREFRONT_TOKEN`. Deze staat bewust met een
   `PUBLIC_`-prefix: de winkelwagen praat rechtstreeks vanuit de browser
   met de Storefront API, en dit is precies het token dat Shopify daarvoor
   bedoeld heeft (geen geheime/Admin-rechten).
6. `PUBLIC_SHOPIFY_DOMAIN` is je `jouw-winkel.myshopify.com`-domein (te
   vinden in de adresbalk van je Shopify admin).

Belangrijk: een product is pas zichtbaar via de Storefront API als het
(a) op **Actief** staat (niet Concept) én (b) gekoppeld is aan het
verkoopkanaal dat bij de token hoort (bij Headless gebeurt dat
automatisch voor nieuwe producten, maar check dit bij bestaande
producten onder "Verkoopkanalen en apps").

### Winkelwagen

`src/shopify/cart.ts` praat client-side (in de browser) met Shopify's
Storefront Cart API — `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`,
`cartLinesRemove`. De cart-ID staat in `localStorage`; de daadwerkelijke
inhoud leeft bij Shopify. Elke wijziging dispatcht een
`cart:updated`-event zodat het aantal-badge in de header overal bijwerkt.
`/winkelwagen` toont de regels, laat aantallen aanpassen, en linkt naar
`cart.checkoutUrl` (Shopify's eigen hosted checkout) om af te rekenen.

### Zonder token

Ontbreken `PUBLIC_SHOPIFY_DOMAIN` of `PUBLIC_SHOPIFY_STOREFRONT_TOKEN` (of
zijn er nog geen producten gepubliceerd), dan toont `/webshop` een nette
"De webshop komt binnenkort"-melding. De build faalt nooit hierop.

### Uitverkocht

Een product zonder voorraad (`availableForSale: false` in Shopify) toont
"Tijdelijk uitverkocht" in plaats van de aantal-kiezer en de
"In winkelwagen"-knop — kan dus niet aan de winkelwagen toegevoegd worden,
zowel op het overzicht als op de productpagina zelf.

## Deploy: automatische rebuild bij publiceren

Op één uitzondering na (`/webshop`, zie "Rendering: statisch vs.
op-aanvraag" hierboven) is de site statisch gebouwd (`astro build`), dus
een wijziging in Sanity leidt pas tot een nieuwe site nadat Vercel
opnieuw gebouwd heeft. Dat gebeurt automatisch via een deploy hook +
webhook:

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

Er bestaat een tweede, vergelijkbare deploy hook-koppeling specifiek
voor productwijzigingen in Shopify — zie "Shopify-webhook (vangnet)"
verderop. Die twee webhooks staan los van elkaar en mogen dezelfde of
een eigen deploy hook gebruiken.

## Cookietoestemming en Google Analytics

De site meet standaard **niets**. Google Analytics (GA4) wordt pas
geladen nadat een bezoeker expliciet op "Accepteren" klikt in de
cookiebanner (rechtsonder in `src/components/CookieBanner.astro`, in
elke pagina via `Layout.astro`). Bij weigeren — of zolang er nog geen
keuze is gemaakt — wordt er geen enkel verzoek naar Google verstuurd en
worden er geen `_ga`-cookies geplaatst.

Technisch:

- `src/lib/consent.ts` bevat de hele logica: Google Consent Mode v2
  (`analytics_storage` etc. staan standaard op `'denied'`, zie
  `setDefaultDeniedConsent()`), het laden van `gtag.js` (alleen ná
  toestemming, zie `loadGtagScript()`), en het opslaan/toepassen van de
  keuze in `localStorage` (`applyConsent()` / `getStoredConsent()`).
- De keuze is op elk moment herroepbaar via de knop op de
  Cookievoorkeuren-pagina (`src/pages/[juridisch].astro`, alleen
  zichtbaar op die pagina) — dit stuurt een `open-cookie-preferences`-
  event dat de banner opnieuw opent. Bij intrekken worden eventuele
  `_ga`/`_ga_*`-cookies meteen verwijderd.
- `PUBLIC_GA_ID` (zie omgevingsvariabelen hierboven) bepaalt welk GA4-
  meet-ID gebruikt wordt. Leeg/ontbrekend → de banner werkt nog gewoon,
  maar "Accepteren" laadt dan niets (geen crash).

Zelf testen: open de site in een incognitovenster, klik "Weigeren" en
controleer in de Netwerktab dat er geen verzoeken naar
`googletagmanager.com` of `google-analytics.com` verschijnen. Klik
daarna (in een nieuw incognitovenster) op "Accepteren" — dan hoort
`gtag/js?id=G-...` wél te laden, en zou de bezoeker binnen enkele
seconden in GA4 → Rapporten → Realtime moeten verschijnen.

## Merkkleuren

Voor gebruik buiten deze codebase (bijvoorbeeld in Shopify):

| Kleur                                     | Hex       |
| ------------------------------------------ | --------- |
| Beige achtergrond (`cream-100`)            | `#f7f1e4` |
| Knopkleur, roodachtig (`terracotta-500`)   | `#a44c2c` |

Het volledige kleurenpalet (inclusief lichtere/donkerdere varianten)
staat in `src/styles/global.css` onder `@theme`.

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
