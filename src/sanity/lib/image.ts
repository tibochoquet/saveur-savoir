import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: Image) {
  return builder.image(source);
}
