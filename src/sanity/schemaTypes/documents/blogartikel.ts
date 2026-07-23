import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogartikel",
  title: "Blogartikel",
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
      description: "Wordt gebruikt in de link naar dit artikel.",
      options: { source: "titel", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "onderwerp",
      title: "Onderwerp",
      description: "Bepaalt in welke categorie dit artikel valt bij het filteren op de blogpagina. Nieuwe onderwerpen maak je aan bij \"Onderwerpen\" in het menu links.",
      type: "reference",
      to: [{ type: "onderwerp" }],
      validation: (Rule) => Rule.required(),
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
      name: "dek",
      title: "Inleidende zin",
      description: "De grotere, cursieve zin direct onder de titel. Te zien op de artikelpagina zelf, niet op het overzicht.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "afbeelding",
      title: "Foto",
      type: "afbeelding",
      description: "Zonder foto wordt automatisch een placeholder getoond.",
    }),
    defineField({
      name: "leestijdMinuten",
      title: "Leestijd (in minuten)",
      type: "number",
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: "inhoud",
      title: "Inhoud",
      description: "Het volledige artikel. Leeg laten als het artikel nog niet klaar is voor publicatie — dan krijgt het \"Binnenkort\" op de overzichtspagina.",
      type: "blockContent",
    }),
  ],
  preview: {
    select: { title: "titel", subtitle: "onderwerp.titel", media: "afbeelding" },
  },
});
