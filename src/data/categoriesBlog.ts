/**
 * Catégories du journal.
 *
 * Les slugs sont volontairement sans accent ni caractère spécial : c'est
 * précisément ce qui manquait à l'ancien site, où quatre articles pointaient
 * vers des catégories accentuées inexistantes et produisaient des pages vides.
 *
 * Les pages de catégorie ne sont générées que pour les catégories qui
 * contiennent réellement au moins un article (voir la route dédiée).
 */
export const CATEGORIES_BLOG = {
  'verre-grave': {
    nom: 'Verre gravé',
    titre: 'Conseils sur la gravure du verre',
    description:
      'Logos sur verre, choix du modèle, zones de marquage, rendu satiné et validation des séries.',
  },
  'domaines-viticoles': {
    nom: 'Domaines viticoles',
    titre: 'Gravure pour les domaines viticoles',
    description:
      'Verres de dégustation, caisses gravées, coffrets de cuvée et cadeaux clients pour les domaines de Bourgogne.',
  },
  'mariage-evenement': {
    nom: 'Mariages et événements',
    titre: 'Gravure pour les mariages et les événements',
    description:
      'Flûtes, verres et objets personnalisés pour les mariages, anniversaires et cérémonies.',
  },
  'plaques-signaletique': {
    nom: 'Plaques et signalétique',
    titre: 'Plaques professionnelles et signalétique',
    description:
      'Choix des matières, lisibilité, emplacement et plaques connectées pour les établissements recevant du public.',
  },
  'cadeaux-entreprise': {
    nom: 'Cadeaux d’entreprise',
    titre: 'Cadeaux d’entreprise gravés',
    description:
      'Comment choisir un cadeau client utile, sobre et durable : supports adaptés, personnalisation mesurée et cohérence avec l’image de l’entreprise.',
  },
  'fichiers-et-bat': {
    nom: 'Fichiers et BAT',
    titre: 'Préparer un fichier de gravure',
    description:
      'Formats acceptés, qualité requise, vectorisation et rôle du bon à tirer avant production.',
  },
  'guides-atelier': {
    nom: 'Guides de l’atelier',
    titre: 'Les guides de l’atelier',
    description:
      'Repères de fond sur la gravure laser : matières, procédés, coûts et limites du procédé.',
  },
} as const;

export type CategorieBlogSlug = keyof typeof CATEGORIES_BLOG;

export function nomCategorie(slug: string): string {
  return CATEGORIES_BLOG[slug as CategorieBlogSlug]?.nom ?? slug;
}
