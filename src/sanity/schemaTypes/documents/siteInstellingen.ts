import { defineField, defineType } from "sanity";

/**
 * Singleton: er bestaat maar één document van dit type. Zie
 * sanity.config.ts (structure) en de Studio-structuur die "nieuw
 * document" hiervoor blokkeert.
 */
export default defineType({
  name: "siteInstellingen",
  title: "Site-instellingen",
  type: "document",
  fields: [
    defineField({
      name: "contactEmail",
      title: "Contact e-mailadres",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "reactietijd",
      title: "Reactietijd",
      description: "Bijvoorbeeld: Meestal binnen 2 à 3 werkdagen.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "footerTagline",
      title: "Footer: korte omschrijving",
      description: "De zin onder de sitenaam in de footer.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "footerRegel",
      title: "Footer: onderste regel",
      description: "Bijvoorbeeld: Gevestigd in Nederland, met het hart in Frankrijk.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "footerDiensten",
      title: "Footer: kolom \"Diensten\"",
      description: "De link-URL's liggen vast in code — hier stel je alleen de zichtbare tekst in.",
      type: "object",
      fields: [
        defineField({ name: "titel", title: "Koptekst", type: "string", validation: (Rule) => Rule.required() }),
        defineField({
          name: "link1Label",
          title: "Linktekst (gaat naar /vertalingen)",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "link2Label",
          title: "Linktekst (gaat naar /prive-les)",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "footerOntdekken",
      title: "Footer: kolom \"Ontdekken\"",
      description: "De link-URL's liggen vast in code — hier stel je alleen de zichtbare tekst in.",
      type: "object",
      fields: [
        defineField({ name: "titel", title: "Koptekst", type: "string", validation: (Rule) => Rule.required() }),
        defineField({
          name: "link1Label",
          title: "Linktekst (gaat naar /recepten)",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "link2Label",
          title: "Linktekst (gaat naar /webshop)",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "link3Label",
          title: "Linktekst (gaat naar /blog)",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "footerContact",
      title: "Footer: kolom \"Contact\"",
      description: "De link-URL ligt vast in code — hier stel je alleen de zichtbare tekst in.",
      type: "object",
      fields: [
        defineField({ name: "titel", title: "Koptekst", type: "string", validation: (Rule) => Rule.required() }),
        defineField({
          name: "link1Label",
          title: "Linktekst (gaat naar /contact)",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site-instellingen" };
    },
  },
});
