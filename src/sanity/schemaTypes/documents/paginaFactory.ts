import { defineField, defineType } from "sanity";

/**
 * Fabriek voor de vaste paginatekst-singletons (Webshop, Diensten,
 * Recepten, Blog, Contact): steeds dezelfde drie velden, zodat we niet
 * vijf keer bijna-identieke schema's onderhouden. Alleen tekst — geen
 * layout- of structuurkeuzes.
 */
export function maakPaginaSchema(name: string, title: string) {
  return defineType({
    name,
    title,
    type: "document",
    fields: [
      defineField({
        name: "paginatitel",
        title: "Paginatitel",
        description: "Kort label, gebruikt in het browsertabblad en als label bovenaan de pagina.",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "kop",
        title: "Kop",
        description: "De grote titel bovenaan de pagina.",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "introtekst",
        title: "Introductietekst",
        description: "Elke nieuwe alinea (Enter) wordt een eigen paragraaf op de site.",
        type: "eenvoudigeTekst",
        validation: (Rule) => Rule.required(),
      }),
    ],
    preview: {
      prepare() {
        return { title };
      },
    },
  });
}
