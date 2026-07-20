import { defineField, defineType } from "sanity";

export default defineType({
  name: "productcategorie",
  title: "Productcategorie",
  type: "document",
  fields: [
    defineField({
      name: "titel",
      title: "Titel",
      description: "Bijvoorbeeld: Kaas. Dit is het label dat als filterknop op de webshop-pagina verschijnt.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titel", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "titel" },
  },
});
