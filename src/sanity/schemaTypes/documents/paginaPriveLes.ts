import { defineField, defineType } from "sanity";
import { seoVelden } from "./paginaFactory";

export default defineType({
  name: "paginaPriveLes",
  title: "Pagina: Privéles",
  type: "document",
  fieldsets: [
    { name: "hero", title: "Hero (bovenaan)" },
    { name: "watHetIs", title: "Wat het is" },
    { name: "doelgroep", title: "Voor wie" },
    { name: "hoeHetWerkt", title: "Hoe het werkt" },
    { name: "cta", title: "Aan de slag (onderaan)" },
    { name: "seo", title: "SEO", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    ...seoVelden().map((veld) => ({ ...veld, fieldset: "seo" })),
    defineField({ name: "heroEyebrow", title: "Label", type: "string", fieldset: "hero", validation: (Rule) => Rule.required() }),
    defineField({ name: "heroTitel", title: "Titel", type: "string", fieldset: "hero", validation: (Rule) => Rule.required() }),
    defineField({
      name: "heroIntro",
      title: "Introductietekst",
      type: "eenvoudigeTekst",
      fieldset: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "heroKnoptekst", title: "Knoptekst", type: "string", fieldset: "hero", validation: (Rule) => Rule.required() }),
    defineField({
      name: "heroAfbeelding",
      title: "Foto",
      type: "afbeelding",
      fieldset: "hero",
      description: "Zonder foto wordt automatisch een placeholder getoond.",
    }),

    defineField({ name: "watHetIsEyebrow", title: "Label", type: "string", fieldset: "watHetIs", validation: (Rule) => Rule.required() }),
    defineField({
      name: "watHetIsTekst",
      title: "Tekst",
      type: "eenvoudigeTekst",
      fieldset: "watHetIs",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "watHetIsAfbeelding",
      title: "Foto (optioneel)",
      description:
        "Optioneel. Met foto: tekst en foto naast elkaar (foto rechts op desktop, eronder op mobiel). Zonder foto: tekst op volle breedte.",
      type: "afbeelding",
      fieldset: "watHetIs",
    }),

    defineField({ name: "doelgroepEyebrow", title: "Label", type: "string", fieldset: "doelgroep", validation: (Rule) => Rule.required() }),
    defineField({
      name: "doelgroepenItems",
      title: "Items",
      description: "Precies 2 items.",
      type: "array",
      fieldset: "doelgroep",
      validation: (Rule) => Rule.length(2),
      of: [
        {
          type: "object",
          name: "doelgroepItem",
          title: "Item",
          fields: [
            defineField({ name: "titel", title: "Titel", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "tekst", title: "Tekst", type: "eenvoudigeTekst", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "titel" } },
        },
      ],
    }),

    defineField({ name: "hoeHetWerktEyebrow", title: "Label", type: "string", fieldset: "hoeHetWerkt", validation: (Rule) => Rule.required() }),
    defineField({
      name: "hoeHetWerktStappen",
      title: "Stappen",
      description: "Precies 4 stappen, in volgorde.",
      type: "array",
      fieldset: "hoeHetWerkt",
      validation: (Rule) => Rule.length(4),
      of: [
        {
          type: "object",
          name: "stap",
          title: "Stap",
          fields: [
            defineField({ name: "titel", title: "Titel", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "tekst", title: "Tekst", type: "eenvoudigeTekst", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "titel" } },
        },
      ],
    }),

    defineField({ name: "ctaEyebrow", title: "Label", type: "string", fieldset: "cta", validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaTitel", title: "Titel", type: "string", fieldset: "cta", validation: (Rule) => Rule.required() }),
    defineField({
      name: "ctaTekst",
      title: "Tekst",
      type: "eenvoudigeTekst",
      fieldset: "cta",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "ctaKnoptekst", title: "Knoptekst", type: "string", fieldset: "cta", validation: (Rule) => Rule.required() }),
  ],
  preview: {
    prepare() {
      return { title: "Pagina: Privéles" };
    },
  },
});
