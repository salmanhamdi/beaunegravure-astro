// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * L'URL du site est pilotée par l'environnement afin qu'un même code source
 * puisse être publié sur le staging Hostinger puis sur le domaine définitif
 * sans modification manuelle.
 *
 *   npm run build:staging  -> https://dimgrey-caribou-115686.hostingersite.com
 *   npm run build:prod     -> https://beaunegravure.fr
 */
const SITE_URL = process.env.SITE_URL ?? 'https://beaunegravure.fr';
const IS_PRODUCTION = new URL(SITE_URL).hostname.endsWith('beaunegravure.fr');

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  image: {
    // Le format AVIF est généré en priorité, WebP en repli, via astro:assets.
    responsiveStyles: true,
    layout: 'constrained',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    // Le sitemap n'a de sens que sur le domaine de production : sur le staging
    // le site est entièrement en noindex et ne doit pas se déclarer aux moteurs.
    ...(IS_PRODUCTION
      ? [
          sitemap({
            filter: (page) => !page.includes('/merci/'),
            changefreq: 'monthly',
            lastmod: new Date(),
            serialize(item) {
              const path = new URL(item.url).pathname;
              if (path === '/') return { ...item, priority: 1.0 };
              if (path.startsWith('/realisations') || path.startsWith('/services')) {
                return { ...item, priority: 0.9 };
              }
              if (path === '/contact/') return { ...item, priority: 0.9 };
              if (path.startsWith('/blog/')) return { ...item, priority: 0.6 };
              if (path === '/mentions-legales/' || path === '/politique-de-confidentialite/') {
                return { ...item, priority: 0.2 };
              }
              return { ...item, priority: 0.7 };
            },
          }),
        ]
      : []),
  ],
  vite: {
    build: {
      assetsInlineLimit: 1024,
    },
  },
});
