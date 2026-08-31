import { defineField, defineType } from "sanity";
import { seoVelden } from "./paginaFactory";

/**
 * Singleton: er bestaat maar één document van dit type (zie
 * sanity.config.ts). Bevat alleen tekst en beeld voor de homepage —
 * geen structuur- of layoutkeuzes. Het aantal/de volgorde van de
 * "wat ik bied"-items en waar ze naartoe linken staat vast in code;
 * hier kan alleen de tekst per item aangepast worden.
 */
export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fieldsets: [
    { name: "hero", title: "Hero (bovenaan)" },
    { name: "spotlight", title: "Spotlight (uitgelichte producten)" },
    { name: "overMij", title: "Wie ben ik" },
    { name: "aanbod", title: "Wat ik bied" },
    { name: "contact", title: "Contact-oproep" },
    { name: "seo", title: "SEO", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    ...seoVelden().map((veld) => ({ ...veld, fieldset: "seo" })),
    defineField({
      name: "heroEyebrow",
      title: "Label boven de titel",
      description: "Bijvoorbeeld: Frans leven, taal & landschap.",
      type: "string",
      fieldset: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroTitel",
      title: "Titel",
      type: "string",
      fieldset: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroIntro",
      title: "Introductietekst",
      description: "Elke nieuwe alinea (Enter) wordt een eigen paragraaf op de site.",
      type: "eenvoudigeTekst",
      fieldset: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroCtaPrimair",
      title: "Knoptekst (primair)",
      description: "Bijvoorbeeld: Ontdek wat ik bied.",
      type: "string",
      fieldset: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroCtaSecundair",
      title: "Knoptekst (secundair)",
      description: "Bijvoorbeeld: Over mij.",
      type: "string",
      fieldset: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroAfbeelding",
      title: "Foto",
      type: "afbeelding",
      fieldset: "hero",
      description: "Zonder foto wordt automatisch een placeholder getoond.",
    }),

    defineField({
      name: "spotlightTitel",
      title: "Kop boven de uitgelichte producten",
      description: "Bijvoorbeeld: \"Nieuw in ons assortiment\" of \"Speciaal voor Kerst\".",
      type: "string",
      fieldset: "spotlight",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "spotlightHandles",
      title: "Uitgelichte producten (3 tot 4)",
      description:
        "De handle uit de Shopify-productURL, bijvoorbeeld bij saveursavoir.nl/webshop/soupe-au-pistou-kaart vul je \"soupe-au-pistou-kaart\" in. Een product dat niet meer bestaat in Shopify wordt automatisch overgeslagen, nooit een dode link.",
      type: "array",
      fieldset: "spotlight",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.min(3).max(4).required(),
    }),

    defineField({
      name: "overMijEyebrow",
      title: "Label boven de titel",
      description: "Bijvoorbeeld: Wie ben ik.",
      type: "string",
      fieldset: "overMij",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "overMijTitel",
      title: "Titel",
      type: "string",
      fieldset: "overMij",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "overMijTekst",
      title: "Tekst",
      description: "Elke nieuwe alinea (Enter) wordt een eigen paragraaf op de site.",
      type: "eenvoudigeTekst",
      fieldset: "overMij",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "overMijQuote",
      title: "Uitgelichte quote",
      type: "string",
      fieldset: "overMij",
    }),
    defineField({
      name: "overMijAfbeelding",
      title: "Foto",
      type: "afbeelding",
      fieldset: "overMij",
      description: "Zonder foto wordt automatisch een placeholder getoond.",
    }),

    defineField({
      name: "aanbodEyebrow",
      title: "Label boven de titel",
      description: "Bijvoorbeeld: Wat ik bied.",
      type: "string",
      fieldset: "aanbod",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aanbodTitel",
      title: "Titel",
      type: "string",
      fieldset: "aanbod",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aanbodItems",
      title: "Items",
      description: "Precies 4 items, in deze vaste volgorde: Diensten, Recepten, Webshop, Blog. Alleen de tekst is hier aan te passen, niet waar ze naartoe linken.",
      type: "array",
      fieldset: "aanbod",
      of: [
        {
          type: "object",
          name: "aanbodItem",
          title: "Item",
          fields: [
            defineField({
              name: "titel",
              title: "Titel",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "tekst",
              title: "Tekst",
              description: "Elke nieuwe alinea (Enter) wordt een eigen paragraaf op de site.",
              type: "eenvoudigeTekst",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.length(4),
    }),

    defineField({
      name: "contactEyebrow",
      title: "Label boven de titel",
      description: "Bijvoorbeeld: Contact.",
      type: "string",
      fieldset: "contact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactTitel",
      title: "Titel",
      type: "string",
      fieldset: "contact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactTekst",
      title: "Tekst",
      description: "Elke nieuwe alinea (Enter) wordt een eigen paragraaf op de site.",
      type: "eenvoudigeTekst",
      fieldset: "contact",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactCta",
      title: "Knoptekst",
      description: "Bijvoorbeeld: Stuur een bericht.",
      type: "string",
      fieldset: "contact",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage" };
    },
  },
});
