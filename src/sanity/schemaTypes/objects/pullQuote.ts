import { defineField, defineType } from "sanity";

/**
 * Los blok voor een uitgelichte quote in lopende tekst — visueel apart van
 * een gewone alinea (zie de "verhaal"-secties op de site).
 */
export default defineType({
  name: "pullQuote",
  title: "Pull-quote",
  type: "object",
  fields: [
    defineField({
      name: "citaat",
      title: "Citaat",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { citaat: "citaat" },
    prepare({ citaat }) {
      return {
        title: citaat,
        subtitle: "Pull-quote",
      };
    },
  },
});
