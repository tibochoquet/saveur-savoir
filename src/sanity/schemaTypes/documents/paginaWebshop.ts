import { defineField } from "sanity";
import { maakPaginaSchema } from "./paginaFactory";

export default maakPaginaSchema("paginaWebshop", "Pagina: Webshop", [
  defineField({
    name: "bestelStappen",
    title: "\"Hoe bestellen werkt\" — stappen",
    description: "Precies 3 stappen, in de volgorde waarin ze getoond worden.",
    type: "array",
    validation: (Rule) => Rule.length(3),
    of: [
      {
        type: "object",
        name: "bestelStap",
        title: "Stap",
        fields: [
          defineField({ name: "titel", title: "Titel", type: "string", validation: (Rule) => Rule.required() }),
          defineField({
            name: "tekst",
            title: "Tekst",
            type: "eenvoudigeTekst",
            validation: (Rule) => Rule.required(),
          }),
        ],
        preview: { select: { title: "titel" } },
      },
    ],
  }),
]);
