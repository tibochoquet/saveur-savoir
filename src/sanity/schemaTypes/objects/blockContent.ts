import { defineArrayMember, defineType } from "sanity";

/**
 * Beperkte rich text voor lopende tekst ("het verhaal"-achtige velden).
 * Bewust een kleine set opties — geen kleuren, geen lettertypes, geen H1
 * (die is voor de paginatitel) — zodat de opmaak van de site niet
 * doorbroken kan worden vanuit het Studio.
 */
export default defineType({
  name: "blockContent",
  title: "Tekst",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normaal", value: "normal" },
        { title: "Kop 2", value: "h2" },
        { title: "Kop 3", value: "h3" },
      ],
      lists: [
        { title: "Opsomming", value: "bullet" },
        { title: "Genummerd", value: "number" },
      ],
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
    defineArrayMember({ type: "afbeelding" }),
    defineArrayMember({ type: "pullQuote" }),
  ],
});
