import type { APIRoute } from 'astro';
import { EST_INDEXABLE, urlAbsolue } from '@utils/env';

/**
 * robots.txt généré au build.
 *
 * Sur le staging Hostinger, tout est interdit à l'exploration : le site ne doit
 * jamais entrer en concurrence avec le domaine de production dans l'index.
 */
export const GET: APIRoute = () => {
  const lignes = EST_INDEXABLE
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        '# Le point d’entrée du formulaire n’a pas vocation à être exploré.',
        'Disallow: /api/',
        '',
        `Sitemap: ${urlAbsolue('/sitemap-index.xml')}`,
        '',
      ]
    : [
        '# Environnement de préproduction — ne pas indexer.',
        'User-agent: *',
        'Disallow: /',
        '',
      ];

  return new Response(lignes.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
