import { defineField, defineType } from "sanity";

/**
 * Gedeeld beeldveld: hotspot/crop staat aan zodat bijsnijden in het Studio
 * gebeurt (niet in code), en alt-tekst is verplicht zodra er een beeld is
 * gekozen — maar het veld zelf is optioneel, zodat PlaceholderImage als
 * fallback kan blijven werken tot er een echte foto is.
 */
export default defineType({
  name: "afbeelding",
  title: "Afbeelding",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alt-tekst",
      description: "Korte omschrijving van wat er op de foto te zien is. Nodig voor toegankelijkheid en zoekmachines.",
      type: "string",
      validation: (Rule) =>
        Rule.custom((alt, context) => {
          const parent = context.parent as { asset?: unknown } | undefined;
          if (parent?.asset && !alt) {
            return "Alt-tekst is verplicht zodra er een afbeelding is gekozen.";
          }
          return true;
        }),
    }),
  ],
});
