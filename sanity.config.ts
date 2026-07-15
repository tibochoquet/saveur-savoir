import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

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
            S.documentTypeListItem("wandeling").title("Wandelingen"),
            S.documentTypeListItem("blogartikel").title("Blogartikelen"),
            S.documentTypeListItem("product").title("Producten"),
            S.divider(),
            // Site-instellingen is een singleton: altijd hetzelfde ene
            // document openen, geen lijst en geen "nieuw document"-knop.
            S.listItem()
              .title("Site-instellingen")
              .id("siteInstellingen")
              .child(
                S.document()
                  .schemaType("siteInstellingen")
                  .documentId("siteInstellingen")
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
