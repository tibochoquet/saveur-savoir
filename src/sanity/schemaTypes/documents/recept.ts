import { defineField, defineType } from "sanity";

export default defineType({
  name: "recept",
  title: "Recept",
  type: "document",
  fields: [
    defineField({
      name: "titel",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Wordt gebruikt in de link naar dit recept, bv. /recepten/soupe-au-pistou.",
      options: { source: "titel", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "streek",
      title: "Streek",
      description: "Bijvoorbeeld: Provence. Te zien op de receptpagina zelf, niet op het overzicht.",
      type: "string",
    }),
    defineField({
      name: "excerpt",
      title: "Korte omschrijving",
      description: "Één zin, te zien op de overzichtspagina.",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "afbeelding",
      title: "Foto",
      type: "afbeelding",
      description: "Zonder foto wordt automatisch een placeholder getoond.",
    }),
    defineField({
      name: "bereidingstijd",
      title: "Bereidingstijd",
      description: "Bijvoorbeeld: 45 min.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aantalPersonen",
      title: "Aantal personen",
      description: "Bijvoorbeeld: 6 personen. Te zien op de receptpagina zelf, niet op het overzicht.",
      type: "string",
    }),
    defineField({
      name: "niveau",
      title: "Niveau",
      type: "string",
      options: {
        list: [
          { title: "Gemakkelijk", value: "Gemakkelijk" },
          { title: "Gemiddeld", value: "Gemiddeld" },
          { title: "Moeilijk", value: "Moeilijk" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introductietekst",
      description: "De alinea direct onder de hoofdfoto.",
      type: "blockContent",
    }),
    defineField({
      name: "ingredientengroepen",
      title: "Ingrediënten",
      description: "Eén of meerdere groepen, bijvoorbeeld \"Voor de soep\" en \"Voor de pistou\".",
      type: "array",
      of: [
        {
          type: "object",
          name: "ingredientengroep",
          title: "Ingrediëntengroep",
          fields: [
            defineField({
              name: "titel",
              title: "Titel van de groep",
              description: "Bijvoorbeeld: Voor de soep.",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "ingredienten",
              title: "Ingrediënten",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "titel", ingredienten: "ingredienten" },
            prepare({ title, ingredienten }) {
              return { title, subtitle: `${ingredienten?.length ?? 0} ingrediënten` };
            },
          },
        },
      ],
    }),
    defineField({
      name: "bereidingsstappen",
      title: "Bereiding",
      description: "De genummerde stappen. Leeg laten als het recept nog niet klaar is voor publicatie — dan krijgt het \"Binnenkort\" op de overzichtspagina.",
      type: "array",
      of: [
        {
          type: "object",
          name: "bereidingsstap",
          title: "Stap",
          fields: [
            defineField({
              name: "titel",
              title: "Titel van de stap",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "tekst",
              title: "Uitleg",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "titel" },
          },
        },
      ],
    }),
    defineField({
      name: "tip",
      title: "Tip (pull-quote onderaan)",
      description: "Optionele afsluitende tip, bijvoorbeeld over bewaren.",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "titel", subtitle: "streek", media: "afbeelding" },
  },
});
