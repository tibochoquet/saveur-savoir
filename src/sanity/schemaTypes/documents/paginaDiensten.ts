import { defineField } from "sanity";
import { maakPaginaSchema } from "./paginaFactory";

export default maakPaginaSchema("paginaDiensten", "Pagina: Diensten", [
  defineField({
    name: "dienstenItems",
    title: "De twee diensten-blokken",
    description:
      "Precies 2 items, in vaste volgorde: eerst Vertalingen (linkt naar /vertalingen), dan Privéles (linkt naar /prive-les). De links zelf liggen vast in code.",
    type: "array",
    validation: (Rule) => Rule.length(2),
    of: [
      {
        type: "object",
        name: "dienstItem",
        title: "Dienst",
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
