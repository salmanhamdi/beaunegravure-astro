/**
 * Projets nés de l'atelier.
 *
 * Glassora et Spotitap sont des marques distinctes, avec leur propre identité,
 * leur propre site et leur propre clientèle. Elles ne sont pas des services de
 * Beaune Gravure : elles sont la preuve que l'atelier sait concevoir, fabriquer
 * et mener un produit jusqu'au marché.
 *
 * Les descriptions ci-dessous sont établies à partir du contenu réel des deux
 * sites, relevé le 8 septembre 2026. Rien n'est extrapolé.
 */

export interface Projet {
  slug: string;
  nom: string;
  /** Nature du projet, en deux mots. */
  nature: string;
  /** Formule courte affichée en tête de carte. */
  accroche: string;
  description: string;
  /** Ce que le projet démontre du savoir-faire de l'atelier. */
  apport: string;
  /** Éléments concrets relevés sur le site du projet. */
  reperes: string[];
  url: string;
  domaine: string;
  libelleLien: string;
}

export const projets: Projet[] = [
  {
    slug: 'glassora',
    nom: 'Glassora',
    nature: 'Marque de verrerie personnalisée',
    accroche: 'Une maison de verrerie gravée, avec sa boutique et son configurateur.',
    description:
      'Glassora est une marque dédiée au verre gravé : une sélection de verres à vin, verres à eau, flûtes, verres à spiritueux et carafes, un configurateur en ligne pour composer sa gravure et visualiser le bon à tirer avant production, et une boutique organisée par occasion — mariage, naissance, anniversaire, domaines viticoles, entreprises.',
    apport:
      'Sélection des pièces, conception du configurateur, préparation des fichiers de gravure et production : Glassora est fabriquée dans notre atelier.',
    reperes: [
      'Boutique en ligne et configurateur de gravure',
      'Univers mariage, naissance, domaines et entreprises',
      'Bon à tirer visualisé avant production',
    ],
    url: 'https://glassora.fr/',
    domaine: 'glassora.fr',
    libelleLien: 'Découvrir Glassora',
  },
  {
    slug: 'spotitap',
    nom: 'Spotitap',
    nature: 'Plaques et cartes NFC connectées',
    accroche: 'Un objet connecté, son application et son CRM, conçus et fabriqués en France.',
    description:
      'Spotitap est une gamme de plaques et de cartes NFC — avis Google, menu de restaurant, Wi-Fi, réseaux sociaux, carte de visite — pilotée depuis une application unique, avec un CRM qui enregistre les contacts, les avis et les scans. Le profil reste modifiable à vie, sans installation côté visiteur.',
    apport:
      'Conception produit, fabrication des plaques et des cartes, et développement de la plateforme logicielle : Spotitap montre jusqu’où un projet peut aller quand la fabrication et le design avancent ensemble.',
    reperes: [
      'Gamme de plaques et cartes NFC',
      'Application de configuration et CRM intégré',
      'Conçu et fabriqué en France',
    ],
    url: 'https://spotitap.com/',
    domaine: 'spotitap.com',
    libelleLien: 'Découvrir Spotitap',
  },
];
