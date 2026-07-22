import { defineField, defineType } from "sanity";
import { seoVelden } from "./paginaFactory";

/**
 * Eén schema, zeven documenten (Disclaimer, Privacybeleid, Herroeping,
 * Algemene voorwaarden, Verzenden & Retourneren, Cookievoorkeuren,
 * Servicevoorwaarden) — elk met een vast document-ID, geopend als eigen
 * singleton-item in de Studio-structuur (zie sanity.config.ts). Alleen
 * titel + rich text, verder niets: de inhoud is aan de eigenaar.
 */
export default defineType({
  name: "juridischePagina",
  title: "Juridische pagina",
  type: "document",
  fields: [
    defineField({
      name: "titel",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "inhoud",
      title: "Inhoud",
      description: "Mag leeg blijven totdat je hier zelf tekst voor hebt.",
      type: "blockContent",
    }),
    ...seoVelden(),
  ],
  preview: {
    select: { title: "titel" },
  },
});
