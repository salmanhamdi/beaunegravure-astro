import type { ImageMetadata } from 'astro';

/**
 * Résolution de la couverture d'un article par son seul nom de fichier.
 *
 * Les articles du journal illustraient leurs pages avec des copies rangées
 * dans `assets/images/blog/` — copies strictement identiques, au bit près pour
 * trois d'entre elles, à des photographies déjà présentes ailleurs. Une
 * photographie n'existe désormais qu'en un exemplaire, et la couverture la
 * désigne par son nom, quelle que soit la famille où elle est rangée.
 *
 * Les noms de fichiers sont uniques dans toute la photothèque ; le contrôle en
 * est fait ci-dessous, et une collision arrête le build plutôt que de laisser
 * un article afficher silencieusement la mauvaise image.
 */
const fichiers = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/**/*.{webp,jpg,jpeg,png}',
  { eager: true },
);

const parNom = new Map<string, ImageMetadata>();
const collisions: string[] = [];
for (const [chemin, module] of Object.entries(fichiers)) {
  const nom = chemin.split('/').pop()!;
  if (parNom.has(nom)) collisions.push(nom);
  parNom.set(nom, module.default);
}
if (collisions.length > 0) {
  throw new Error(
    `Photothèque : plusieurs fichiers portent le même nom — ${[...new Set(collisions)].join(', ')}`,
  );
}

/** `undefined` si le nom ne correspond à aucun fichier : l'appelant décide. */
export function couverture(nom: string): ImageMetadata | undefined {
  return parNom.get(nom);
}
