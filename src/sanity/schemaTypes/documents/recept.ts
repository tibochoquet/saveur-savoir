import { defineField, defineType } from "sanity";
import { seoVelden } from "./paginaFactory";

export default defineType({
  name: "recept",
  title: "Recept",
  type: "document",
  fieldsets: [
    {
      name: "archief",
      title: "Archief — niet meer zichtbaar op de site",
      description:
        "Deze velden worden niet meer getoond op de receptpagina (vervangen door de Receptenkaart-CTA hieronder). Ze blijven bewaard, niet verwijderd.",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "seo",
      title: "SEO en zoekmachines",
      description:
        "Gebruikt voor het browsertabblad, zoekresultaten, en de gestructureerde data (JSON-LD) die Google en AI-crawlers gebruiken om dit receptverhaal te herkennen als artikel.",
      options: { collapsible: true, collapsed: true },
    },
  ],
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
      name: "publicatiedatum",
      title: "Publicatiedatum",
      description: "De datum die bij dit receptverhaal getoond wordt en die zoekmachines gebruiken.",
      type: "date",
      fieldset: "seo",
      validation: (Rule) => Rule.required(),
    }),
    ...seoVelden().map((veld) => ({ ...veld, fieldset: "seo" })),
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
      description: "De alinea direct onder de hoofdfoto. Leeg laten als het recept nog niet klaar is voor publicatie — dan krijgt het \"Binnenkort\" op de overzichtspagina.",
      type: "blockContent",
    }),
    defineField({
      name: "ingredientengroepen",
      title: "Ingrediënten",
      description: "Eén of meerdere groepen, bijvoorbeeld \"Voor de soep\" en \"Voor de pistou\".",
      fieldset: "archief",
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
      description: "De genummerde stappen.",
      fieldset: "archief",
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
    defineField({
      name: "receptenkaartHandle",
      title: "Receptenkaart — webshopproduct (handle)",
      description:
        "Optioneel. De handle uit de Shopify-productURL van dit recept als receptenkaart, bijvoorbeeld bij saveursavoir.nl/webshop/soupe-au-pistou-kaart vul je hier \"soupe-au-pistou-kaart\" in. Ingevuld = er verschijnt onderaan het recept een CTA-blok naar de webshop.",
      type: "string",
    }),
    defineField({
      name: "receptenkaartTekst",
      title: "Receptenkaart — eigen zin bij de CTA",
      description:
        "Optioneel. De zin boven de knop, bijvoorbeeld \"Liever dit recept als kant-en-klaar pakket in huis? Bekijk het als product in de webshop.\" Leeg = standaardzin.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "receptenkaartKnoptekst",
      title: "Receptenkaart — eigen tekst bij de knop",
      description: "Optioneel. Bijvoorbeeld: \"Bestel de receptenkaart\". Leeg = standaardtekst.",
      type: "string",
    }),
    defineField({
      name: "gerelateerdeProducten",
      title: "Producten bij dit recept",
      description:
        "Optioneel, 2 tot 4 stuks. Verschijnt als apart blok onderaan het recept, los van de Receptenkaart-CTA hierboven. Alleen zichtbaar zodra er minstens één item is ingevuld.",
      type: "array",
      of: [
        {
          type: "object",
          name: "gerelateerdProduct",
          title: "Product",
          fields: [
            defineField({
              name: "productHandle",
              title: "Webshopproduct (handle)",
              description:
                "De handle uit de Shopify-productURL, bijvoorbeeld bij saveursavoir.nl/webshop/teisseire-siroop-muntsmaak vul je hier \"teisseire-siroop-muntsmaak\" in.",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "tekst",
              title: "Eigen tekst (naam of aanprijzende zin)",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "tekst", subtitle: "productHandle" },
          },
        },
      ],
      validation: (Rule) => Rule.min(2).max(4),
    }),
  ],
  preview: {
    select: { title: "titel", subtitle: "streek", media: "afbeelding" },
  },
});
