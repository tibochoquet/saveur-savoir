import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "naam",
      title: "Naam",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Wordt gebruikt in de link naar dit product.",
      options: { source: "naam", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categorie",
      title: "Categorie",
      description: "Bepaalt in welke categorie dit product valt bij het filteren op de webshop-pagina. Categorieën beheer je zelf onder \"Productcategorieën\".",
      type: "reference",
      to: [{ type: "productcategorie" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "soort",
      title: "Soort product",
      description: "Fysiek (wordt verzonden) of digitaal (bv. een gpx-bestand — geen verzendkosten).",
      type: "string",
      options: {
        list: [
          { title: "Fysiek", value: "fysiek" },
          { title: "Digitaal", value: "digitaal" },
        ],
        layout: "radio",
      },
      initialValue: "fysiek",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gpxBestand",
      title: "GPX-bestand",
      description: "Alleen voor digitale producten zoals een wandelroute. Wordt niet rechtstreeks als publieke download getoond — dit is voor eigen beheer, zolang aanvragen nog via het contactformulier verlopen.",
      type: "file",
      options: { accept: ".gpx" },
      hidden: ({ document }) => document?.soort !== "digitaal",
    }),
    defineField({
      name: "prijs",
      title: "Prijs",
      description: "Volledige prijsvermelding zoals die getoond wordt, bijvoorbeeld: € 22,50 / 500 g. Zonder prijs kan een product niet aangevraagd worden.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "herkomst",
      title: "Herkomst",
      description: "Bijvoorbeeld: Jura, Frankrijk.",
      type: "string",
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
      description: "De grotere, cursieve zin direct onder de titel. Te zien op de productpagina zelf, niet op het overzicht.",
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
      name: "verhaal",
      title: "Het verhaal",
      description: "Het langere verkoopverhaal achter dit product. Leeg laten als het product nog niet klaar is voor publicatie — dan krijgt het \"Binnenkort\" op de overzichtspagina.",
      type: "blockContent",
    }),
  ],
  preview: {
    select: { title: "naam", subtitle: "categorie.titel", media: "afbeelding" },
  },
});
