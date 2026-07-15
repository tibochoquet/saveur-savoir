import { defineField, defineType } from "sanity";

export default defineType({
  name: "wandeling",
  title: "Wandeling",
  type: "document",
  fields: [
    defineField({
      name: "titel",
      title: "Titel",
      description: "Bijvoorbeeld: GR70 — Chemin de Stevenson.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Wordt gebruikt in de link naar deze wandeling.",
      options: { source: "titel", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "streek",
      title: "Streek",
      description: "Bijvoorbeeld: Cévennes. Te zien op de detailpagina zelf, niet op het overzicht.",
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
      name: "afstand",
      title: "Afstand",
      description: "Bijvoorbeeld: 252 km.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "duur",
      title: "Duur",
      description: "Bijvoorbeeld: 12 dagen, of: dagtocht.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hoogteverschil",
      title: "Hoogteverschil",
      description: "Bijvoorbeeld: +9.000 m.",
      type: "string",
    }),
    defineField({
      name: "niveau",
      title: "Niveau",
      description: "Te zien op de detailpagina zelf, niet op het overzicht.",
      type: "string",
      options: {
        list: [
          { title: "Makkelijk", value: "Makkelijk" },
          { title: "Matig zwaar", value: "Matig zwaar" },
          { title: "Zwaar", value: "Zwaar" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "intro",
      title: "Introductietekst",
      description: "De tekst onder de hoofdfoto, over de route en zijn geschiedenis.",
      type: "blockContent",
    }),
    defineField({
      name: "etappes",
      title: "Etappes",
      description: "Eén regel per etappe, bijvoorbeeld: Le Puy-en-Velay → Le Monastier-sur-Gazeille.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "gpxBestand",
      title: "GPX-bestand",
      description: "Het downloadbare trackbestand voor deze route. Verplicht zodra de wandeling gepubliceerd wordt.",
      type: "file",
      options: { accept: ".gpx" },
    }),
  ],
  preview: {
    select: { title: "titel", subtitle: "streek", media: "afbeelding" },
  },
});
