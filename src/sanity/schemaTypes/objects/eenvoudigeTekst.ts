import { defineArrayMember, defineType } from "sanity";

/**
 * Zeer beperkte rich text voor korte, lopende tekst (introteksten,
 * homepage-blokken) — bewust nog kariger dan blockContent: alleen
 * alinea's, vet, cursief en link. Geen koppen, lijsten, afbeeldingen
 * of pull-quotes. Bestaat specifiek om het "witregels verdwijnen"-
 * probleem van plain text-velden structureel op te lossen: elke
 * alinea is hier een eigen blok, in plaats van een string waarin
 * regeleindes door de browser worden weggegooid.
 */
export default defineType({
  name: "eenvoudigeTekst",
  title: "Tekst (eenvoudig)",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normaal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Vet", value: "strong" },
          { title: "Cursief", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "URL",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({ scheme: ["http", "https", "mailto"] }).required(),
              },
            ],
          },
        ],
      },
    }),
  ],
});
