import { defineField, defineType } from "sanity";

// Producten zelf leven uitsluitend in Shopify (zie src/shopify/client.ts)
// — dit document dupliceert daar niets van. Het bestaat alleen om
// redactionele content toe te voegen die Shopify niet heeft: links naar
// receptenkaarten die bij dit product passen. Gekoppeld via de
// Shopify-handle (platte string, geen reference), dezelfde aanpak als
// overal elders op de site.
export default defineType({
  name: "productAanvulling",
  title: "Product — receptenkaarten",
  type: "document",
  fields: [
    defineField({
      name: "productHandle",
      title: "Webshopproduct (handle)",
      description:
        "De handle uit de Shopify-productURL van het product waar dit bij hoort, bijvoorbeeld bij saveursavoir.nl/webshop/teisseire-siroop-muntsmaak vul je hier \"teisseire-siroop-muntsmaak\" in.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "receptenkaart1",
      title: "Receptenkaart 1",
      description: "Optioneel. Verschijnt alleen op de productpagina als dit is ingevuld.",
      type: "object",
      fields: [
        defineField({
          name: "handle",
          title: "Receptenkaart — webshopproduct (handle)",
          description: "De handle uit de Shopify-productURL van de receptenkaart.",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "tekst",
          title: "Eigen zin erover",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "receptenkaart2",
      title: "Receptenkaart 2",
      description: "Optioneel. Verschijnt alleen op de productpagina als dit is ingevuld.",
      type: "object",
      fields: [
        defineField({
          name: "handle",
          title: "Receptenkaart — webshopproduct (handle)",
          description: "De handle uit de Shopify-productURL van de receptenkaart.",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "tekst",
          title: "Eigen zin erover",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "productHandle" },
    prepare({ title }) {
      return { title: title || "(geen handle ingevuld)", subtitle: "Product — receptenkaarten" };
    },
  },
});
