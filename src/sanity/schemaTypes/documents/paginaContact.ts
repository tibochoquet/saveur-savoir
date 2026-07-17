import { defineField, defineType } from "sanity";
import { paginaBasisVelden } from "./paginaFactory";

// Geen introAfbeelding hier: de ruimte naast de introtekst wordt al
// door het contactformulier gebruikt, dus er is geen plek voor een
// optionele foto zoals bij de andere pagina's.
export default defineType({
  name: "paginaContact",
  title: "Pagina: Contact",
  type: "document",
  fields: [
    ...paginaBasisVelden({ metBeeld: false }),
    defineField({
      name: "onderwerpSuggesties",
      title: "Onderwerp-suggesties (contactformulier)",
      description: "Suggesties die verschijnen terwijl iemand het onderwerpveld invult.",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Pagina: Contact" };
    },
  },
});
