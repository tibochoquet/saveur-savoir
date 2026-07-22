import { defineField, defineType } from "sanity";

// Sinds de Shopify-koppeling komen de zichtbare categorieën op /webshop
// uit Shopify-collecties, niet meer uit dit document — dit dient nu
// alleen nog als naam→tint-opzoektabel voor de zachte achtergrondkleur op
// het categorie-overzicht. De titel hier moet overeenkomen met de naam
// van de Shopify-collectie om de koppeling te laten werken.
export default defineType({
  name: "productcategorie",
  title: "Productcategorie",
  type: "document",
  fields: [
    defineField({
      name: "titel",
      title: "Titel",
      description: "Moet exact overeenkomen met de naam van de bijbehorende collectie in Shopify.",
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
    defineField({
      name: "kleurTint",
      title: "Kleurtint",
      description:
        "Zachte achtergrondkleur voor deze categorie op het webshop-overzicht (niet op losse productkaarten). Meerdere categorieën mogen dezelfde tint delen.",
      type: "string",
      options: {
        list: [
          { title: "Blauw (zacht)", value: "bg-blue-100" },
          { title: "Olijf (zacht)", value: "bg-olive-100" },
          { title: "Oker (zacht)", value: "bg-ochre-100" },
          { title: "Terracotta (zacht)", value: "bg-terracotta-100" },
          { title: "Crème (licht)", value: "bg-cream-200" },
          { title: "Crème (donker)", value: "bg-cream-300" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "titel", subtitle: "kleurTint" },
  },
});
