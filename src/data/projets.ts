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

import spotitapVisuel from '@assets/images/projets/spotitap-plaque-avis-google-nfc-socle-bois.jpg';
import glassoraVisuel from '@assets/images/projets/glassora-verre-grave-fort-de-beauregard.jpg';

export interface Projet {
  slug: string;
  nom: string;
  /** Nature du projet, en deux mots. */
  nature: string;
  /** Formule courte affichée en tête de carte. */
  accroche: string;
  description: string;
  /**
   * Le projet raconté en trois temps : d'où il part, ce que l'atelier y a fait,
   * ce qu'il permet de montrer. Rien n'y est extrapolé — tout découle de la
   * description ci-dessus et des éléments relevés sur le site du projet.
   */
  contexte: string;
  atelier: string;
  resultat: string;
  /**
   * Savoir-faire et catégories que le projet mobilise RÉELLEMENT. Un lien n'est
   * présent que si le travail décrit ci-dessus le justifie.
   */
  savoirFaire: { href: string; libelle: string }[];
  /** Éléments concrets relevés sur le site du projet. */
  reperes: string[];
  url: string;
  domaine: string;
  libelleLien: string;
  /**
   * Photographie du produit réel de la marque, fournie par l'atelier.
   *
   * Jusqu'ici cette place était tenue par une réalisation approchante, faute de
   * visuel des deux marques ; la légende devait donc préciser qu'il ne
   * s'agissait pas du produit. Ce n'est plus le cas : chaque projet montre
   * désormais sa propre pièce.
   */
  visuel: ImageMetadata;
  visuelAlt: string;
  visuelLegende: string;
}

export const projets: Projet[] = [
  {
    slug: 'glassora',
    nom: 'Glassora',
    nature: 'Marque de verrerie personnalisée',
    accroche: 'Une maison de verrerie gravée, avec sa boutique et son configurateur.',
    description:
      'Glassora est une marque dédiée au verre gravé : une sélection de verres à vin, verres à eau, flûtes, verres à spiritueux et carafes, un configurateur en ligne pour composer sa gravure et visualiser le bon à tirer avant production, et une boutique organisée par occasion — mariage, naissance, anniversaire, domaines viticoles, entreprises.',
    contexte:
      'Une commande de verres gravés se règle d’ordinaire par des allers-retours de fichiers et d’épreuves, et le client ne voit sa gravure qu’une fois la pièce produite. Glassora part de la question inverse : et s’il composait lui-même son texte, choisissait son modèle, et voyait le résultat avant de commander ?',
    atelier:
      'Le choix des verres d’abord — tous les modèles n’acceptent pas la même gravure. Puis la conception du configurateur et du bon à tirer, l’organisation de la boutique par occasion plutôt que par forme, et la préparation des fichiers. La gravure elle-même est exécutée sur nos machines.',
    resultat:
      'Une gamme complète, sa boutique et son outil de personnalisation, tenus par le même atelier que celui qui grave. C’est le projet où la conception graphique et la production ont dû être pensées ensemble : un configurateur ne vaut que s’il ne promet rien que la machine ne sache faire.',
    savoirFaire: [
      { href: '/services/verres-graves/', libelle: 'Verres et flûtes gravés' },
      { href: '/services/creation-graphique/', libelle: 'Création graphique et fichiers' },
      { href: '/realisations/verre/', libelle: 'Nos réalisations sur verre' },
    ],
    reperes: [
      'Boutique en ligne et configurateur de gravure',
      'Univers mariage, naissance, domaines et entreprises',
      'Bon à tirer visualisé avant production',
    ],
    url: 'https://glassora.fr/',
    domaine: 'glassora.fr',
    libelleLien: 'Découvrir Glassora',
    visuel: glassoraVisuel,
    visuelAlt:
      'Verre à dégustation Glassora gravé du blason du Fort de Beauregard, tenu devant une haie',
    visuelLegende:
      'Verre Glassora gravé pour le Fort de Beauregard — dessin vectorisé puis gravé à l’atelier.',
  },
  {
    slug: 'spotitap',
    nom: 'Spotitap',
    nature: 'Plaques et cartes NFC connectées',
    accroche: 'Un objet connecté, son application et son CRM, conçus et fabriqués en France.',
    description:
      'Spotitap est une gamme de plaques et de cartes NFC — avis Google, menu de restaurant, Wi-Fi, réseaux sociaux, carte de visite — pilotée depuis une application unique, avec un CRM qui enregistre les contacts, les avis et les scans. Le profil reste modifiable à vie, sans installation côté visiteur.',
    contexte:
      'Une plaque NFC n’a d’intérêt que si ce qu’elle déclenche reste modifiable. Fabriquer l’objet ne suffisait donc pas : il fallait aussi ce qu’il y a derrière — le profil que l’on change sans remplacer la plaque, et le suivi de ce qu’elle produit.',
    atelier:
      'La conception de la gamme et sa fabrication : plaques et cartes, chacune portant sa propre destination — avis, menu, Wi-Fi, réseaux, carte de visite. Chaque exemplaire est donc différent, ce qui relève exactement du marquage à données variables. En parallèle, l’application de configuration et le CRM.',
    resultat:
      'Un objet, son application et son outil de suivi, conçus et fabriqués en France. Pour l’atelier, c’est la démonstration la plus complète : tenir une qualité constante sur une série où aucune pièce n’est identique à la précédente.',
    savoirFaire: [
      { href: '/services/plaques-professionnelles/', libelle: 'Plaques professionnelles' },
      {
        href: '/services/etiquettes-industrielles/',
        libelle: 'Marquage à données variables',
      },
      { href: '/realisations/metal/', libelle: 'Nos marquages sur métal' },
    ],
    reperes: [
      'Gamme de plaques et cartes NFC',
      'Application de configuration et CRM intégré',
      'Conçu et fabriqué en France',
    ],
    url: 'https://spotitap.com/',
    domaine: 'spotitap.com',
    libelleLien: 'Découvrir Spotitap',
    visuel: spotitapVisuel,
    visuelAlt:
      'Plaque Spotitap d’avis Google avec zone NFC et QR code, sur son socle en hêtre gravé',
    visuelLegende:
      'Plaque d’avis Google Spotitap sur socle hêtre gravé — impression UV, découpe et gravure à l’atelier.',
  },
];
