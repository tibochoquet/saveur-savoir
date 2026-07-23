// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  ''
);

// https://astro.build/config
export default defineConfig({
  site: 'https://saveursavoir.nl',

  // Statisch blijft de standaard (homepage, recepten, blog, diensten,
  // juridische pagina's — Sanity-content, verandert alleen bij
  // publiceren). Alleen /webshop en de productdetailpagina's zetten
  // zelf `export const prerender = false` om live uit Shopify te lezen
  // (zie webshop/index.astro en webshop/[slug].astro). De Vercel-adapter
  // is nodig zodra er ook maar één route op-aanvraag rendert.
  adapter: vercel({
    // Korte ISR-cache (60s) op de niet-vooraf-gegenereerde routes, zodat
    // niet elk paginabezoek een nieuwe Shopify-call is, maar wijzigingen
    // (prijs, voorraad, nieuwe producten) wel snel zichtbaar worden.
    isr: {
      expiration: 60,
      // De webhook is een POST-only actie (HMAC-verificatie + rebuild
      // triggeren), geen cachebare pagina — die moet altijd als echte
      // serverless function draaien, nooit als (mogelijk gecachete) ISR.
      exclude: ["/api/shopify-webhook"],
    },
  }),

  vite: {
    plugins: [tailwindcss()]
  },

  redirects: {
    '/franse-producten': '/webshop',
    '/franse-producten/[slug]': '/webshop/[slug]',
    '/wandelen': '/blog',
    // De enige wandeling die ooit een echte detailpagina had.
    '/wandelen/gr70-chemin-de-stevenson': '/blog',
  },

  integrations: [
    react(),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || 'production',
      useCdn: false,
      studioBasePath: '/studio',
    }),
    sitemap({
      // Studio (CMS-admin), de stijlgids (intern design-system-overzicht)
      // en de oude, puur-doorverwijzende routes horen niet in de sitemap.
      filter: (page) =>
        !page.includes('/studio') &&
        !page.includes('/styleguide') &&
        !page.includes('/franse-producten') &&
        !page.includes('/wandelen'),
    }),
  ]
});