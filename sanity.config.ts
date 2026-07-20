import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

// Singletons: altijd hetzelfde ene document openen, geen lijst en
// geen "nieuw document"-knop. schemaType en documentId zijn meestal
// gelijk, behalve bij de juridische pagina's (één gedeeld schema,
// telkens een ander vast document-ID).
const singletonItem = (S: StructureBuilder, schemaType: string, title: string, documentId: string = schemaType) =>
  S.listItem()
    .title(title)
    .id(documentId)
    .child(S.document().schemaType(schemaType).documentId(documentId));

export default defineConfig({
  name: "saveur-savoir",
  title: "Saveur & Savoir",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Inhoud")
          .items([
            S.documentTypeListItem("recept").title("Recepten"),
            S.documentTypeListItem("blogartikel").title("Blogartikelen"),
            S.documentTypeListItem("product").title("Producten"),
            S.documentTypeListItem("productcategorie").title("Productcategorieën"),
            S.documentTypeListItem("onderwerp").title("Onderwerpen (blog)"),
            S.divider(),
            // Alle paginateksten en instellingen gegroepeerd op één
            // plek, zodat de eigenaar niet hoeft te zoeken.
            S.listItem()
              .title("Pagina's")
              .child(
                S.list()
                  .title("Pagina's")
                  .items([
                    singletonItem(S, "homepage", "Homepage"),
                    singletonItem(S, "paginaWebshop", "Webshop"),
                    singletonItem(S, "paginaDiensten", "Diensten"),
                    singletonItem(S, "paginaVertalingen", "Vertalingen"),
                    singletonItem(S, "paginaPriveLes", "Privéles"),
                    singletonItem(S, "paginaRecepten", "Recepten"),
                    singletonItem(S, "paginaBlog", "Blog"),
                    singletonItem(S, "paginaContact", "Contact"),
                    S.divider(),
                    singletonItem(S, "siteInstellingen", "Site-instellingen"),
                  ])
              ),
            // Zeven vaste documenten van hetzelfde schema.
            S.listItem()
              .title("Juridische pagina's")
              .child(
                S.list()
                  .title("Juridische pagina's")
                  .items([
                    singletonItem(S, "juridischePagina", "Disclaimer", "disclaimer"),
                    singletonItem(S, "juridischePagina", "Privacybeleid", "privacybeleid"),
                    singletonItem(S, "juridischePagina", "Cookievoorkeuren", "cookievoorkeuren"),
                    singletonItem(S, "juridischePagina", "Herroeping", "herroeping"),
                    singletonItem(S, "juridischePagina", "Algemene voorwaarden", "algemeneVoorwaarden"),
                    singletonItem(S, "juridischePagina", "Servicevoorwaarden", "servicevoorwaarden"),
                    singletonItem(S, "juridischePagina", "Verzenden & Retourneren", "verzendenRetourneren"),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
