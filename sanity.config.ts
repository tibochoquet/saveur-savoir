import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

// Singletons: altijd hetzelfde ene document openen, geen lijst en
// geen "nieuw document"-knop.
const singletonItem = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type));

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
                    singletonItem(S, "paginaRecepten", "Recepten"),
                    singletonItem(S, "paginaBlog", "Blog"),
                    singletonItem(S, "paginaContact", "Contact"),
                    S.divider(),
                    singletonItem(S, "siteInstellingen", "Site-instellingen"),
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
