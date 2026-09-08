/**
 * Distinction staging / production.
 *
 * Le staging Hostinger ne doit jamais être indexé ni se présenter comme la
 * version officielle du site. Toute la logique tient ici pour qu'aucune page
 * n'ait à la redécouvrir.
 */

/** URL du site telle que fournie à Astro au moment du build. */
export const SITE_URL: string = import.meta.env.SITE ?? 'https://beaunegravure.fr';

const hote = (() => {
  try {
    return new URL(SITE_URL).hostname;
  } catch {
    return 'beaunegravure.fr';
  }
})();

/** Le domaine de production est le seul autorisé à être indexé. */
export const EST_PRODUCTION =
  hote === 'beaunegravure.fr' || hote.endsWith('.beaunegravure.fr');

/** Forçable par la variable SITE_ENV, utile pour une préproduction ponctuelle. */
export const EST_INDEXABLE =
  EST_PRODUCTION && import.meta.env.SITE_ENV !== 'staging';

/** Construit une URL absolue à partir d'un chemin interne. */
export function urlAbsolue(chemin: string): string {
  return new URL(chemin, SITE_URL).href;
}
