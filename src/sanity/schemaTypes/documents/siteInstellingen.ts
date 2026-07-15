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
  ],
  preview: {
    prepare() {
      return { title: "Site-instellingen" };
    },
  },
});
