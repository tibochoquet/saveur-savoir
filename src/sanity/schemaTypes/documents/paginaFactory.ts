import { defineField, defineType, type FieldDefinition } from "sanity";

/**
 * SEO-titel/omschrijving — optioneel, overschrijft de standaardtitel/
 * -omschrijving van de pagina in het browsertabblad en in zoekresultaten.
 * Gedeeld door alle pagina-singletons (via paginaBasisVelden hieronder
 * of losstaand toegevoegd aan schema's die de factory niet gebruiken).
 */
export function seoVelden(): FieldDefinition[] {
  return [
    defineField({
      name: "seoTitel",
      title: "SEO-titel",
      description: "Optioneel. Titel in het browsertabblad en in zoekresultaten. Leeg = de standaardtitel van deze pagina.",
      type: "string",
    }),
    defineField({
      name: "seoOmschrijving",
      title: "SEO-omschrijving",
      description: "Optioneel. Korte omschrijving die zoekmachines tonen. Leeg = de standaardomschrijving van deze pagina.",
      type: "text",
      rows: 2,
    }),
  ];
}

/**
 * Basisvelden die alle paginatekst-singletons delen: paginatitel, kop,
 * introtekst, (optioneel) een beeld dat naast de intro rendert, en
 * SEO-titel/omschrijving. Geen layout- of structuurkeuzes verder.
 */
export function paginaBasisVelden(options: { metBeeld?: boolean } = {}): FieldDefinition[] {
  const { metBeeld = true } = options;

  const velden: FieldDefinition[] = [
    defineField({
      name: "paginatitel",
      title: "Paginatitel",
      description: "Kort label, gebruikt in het browsertabblad en als label bovenaan de pagina.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kop",
      title: "Kop",
      description: "De grote titel bovenaan de pagina.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "introtekst",
      title: "Introductietekst",
      description: "Elke nieuwe alinea (Enter) wordt een eigen paragraaf op de site.",
      type: "eenvoudigeTekst",
      validation: (Rule) => Rule.required(),
    }),
  ];

  if (metBeeld) {
    velden.push(
      defineField({
        name: "introAfbeelding",
        title: "Foto bij de intro",
        description:
          "Optioneel. Met foto: tekst en foto naast elkaar (foto rechts op desktop, eronder op mobiel). Zonder foto: tekst op volle breedte.",
        type: "afbeelding",
      })
    );
  }

  velden.push(...seoVelden());

  return velden;
}

/**
 * Fabriek voor de eenvoudige paginatekst-singletons (Webshop, Diensten,
 * Recepten, Blog) die verder geen extra velden nodig hebben. Contact en
 * de dienstpagina's bouwen hun eigen schema met paginaBasisVelden() plus
 * extra secties.
 */
export function maakPaginaSchema(name: string, title: string, extraVelden: FieldDefinition[] = []) {
  return defineType({
    name,
    title,
    type: "document",
    fields: [...paginaBasisVelden(), ...extraVelden],
    preview: {
      prepare() {
        return { title };
      },
    },
  });
}
