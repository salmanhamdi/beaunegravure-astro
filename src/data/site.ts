/**
 * Source de vérité unique pour l'identité, les coordonnées et la navigation.
 *
 * RÈGLE ABSOLUE : aucune donnée de cette page n'est inventée.
 * Les champs dont la valeur n'a pas pu être vérifiée valent `null` et sont
 * listés dans `donneesManquantes` afin d'apparaître explicitement dans le
 * rapport de build. Ils doivent être renseignés avant la mise en production.
 */

export interface AdressePostale {
  rue: string;
  codePostal: string;
  ville: string;
  region: string;
  pays: string;
  paysCode: string;
}

/** Coordonnées relevées sur la fiche Google Business « SARL BEAUNE GRAVURE ». */
export const geo = {
  latitude: 47.0716359,
  longitude: 4.8817362,
} as const;

export const adresse: AdressePostale = {
  rue: '15 avenue de Corton',
  codePostal: '21550',
  ville: 'Ladoix-Serrigny',
  region: 'Bourgogne-Franche-Comté',
  pays: 'France',
  paysCode: 'FR',
};

export const telephone = {
  /** Format E.164, utilisé pour les liens `tel:` et le balisage structuré. */
  e164: '+33766225062',
  /** Format d'affichage français. */
  affichage: '07 66 22 50 62',
} as const;

export const email = 'contact@beaunegravure.fr';

export const reseaux = {
  instagram: 'https://www.instagram.com/beaunegravure/',
  googleMaps: 'https://maps.app.goo.gl/DtGuFSXMyAWkvAt29',
  googleAvis: 'https://g.page/r/CX14imRFOhoGEAE/review',
} as const;

export const whatsapp = {
  /** wa.me attend le numéro sans « + » ni séparateur. */
  url: `https://wa.me/${telephone.e164.replace(/\D/g, '')}`,
} as const;

/**
 * Informations légales obligatoires (art. 6-III LCEN).
 * `null` = donnée non vérifiable dans les sources disponibles.
 * NE PAS INVENTER : renseigner à partir de l'extrait Kbis.
 */
export const legal = {
  raisonSociale: 'SARL Beaune Gravure',
  formeJuridique: 'SARL',
  /** Nom du gérant, directeur de la publication. */
  directeurPublication: null as string | null,
  siret: null as string | null,
  rcs: null as string | null,
  capitalSocial: null as string | null,
  tvaIntracommunautaire: null as string | null,
  hebergeur: {
    nom: 'Hostinger International Ltd.',
    adresse: '61 Lordou Vironos Street, 6023 Larnaca, Chypre',
    site: 'https://www.hostinger.fr',
  },
} as const;

/** Horaires : aucune source fiable disponible, donc non publiés et absents du schema. */
export const horaires = null;

/** Champs à obtenir auprès du client avant la mise en production. */
export const donneesManquantes = [
  'legal.directeurPublication — nom du gérant (mentions légales obligatoires)',
  'legal.siret — numéro SIRET',
  'legal.rcs — ville et numéro d’immatriculation RCS',
  'legal.capitalSocial — montant du capital social',
  'legal.tvaIntracommunautaire — numéro de TVA si assujetti',
  'horaires — horaires d’ouverture de l’atelier (schema LocalBusiness + page contact)',
  'telephone — confirmer que le 07 66 22 50 62 est bien la ligne principale et pas uniquement WhatsApp',
  'email — confirmer que contact@beaunegravure.fr est actif et relevé',
] as const;

export const site = {
  nom: 'Beaune Gravure',
  baseline: 'Gravure laser sur verre en Bourgogne',
  descriptionCourte:
    'Atelier de gravure laser à Ladoix-Serrigny, près de Beaune. Verres à vin, flûtes, logos de domaines, mariages et séries professionnelles.',
  langue: 'fr-FR',
  locale: 'fr_FR',
  anneeCreation: 2019,
  /** Ancienneté du savoir-faire, reprise du récit de l'atelier (« plus de 20 ans »). */
  anneesExperience: 20,
} as const;

/** Zone d'intervention réellement revendiquée par l'atelier. */
export const zones = [
  'Beaune',
  'Ladoix-Serrigny',
  'Nuits-Saint-Georges',
  'Dijon',
  'Chalon-sur-Saône',
  'Côte-d’Or',
  'Saône-et-Loire',
  'Bourgogne-Franche-Comté',
] as const;

export interface LienNav {
  href: string;
  label: string;
  /** Libellé court pour la navigation mobile ou le pied de page. */
  court?: string;
  enfants?: LienNav[];
}

export const navigation: LienNav[] = [
  {
    href: '/services/',
    label: 'Savoir-faire',
    enfants: [
      { href: '/services/verres-graves/', label: 'Verres et flûtes gravés' },
      { href: '/services/gravure-laser/', label: 'Gravure laser' },
      { href: '/services/caisses-bois-gravees/', label: 'Caisses et coffrets bois' },
      { href: '/services/cadeaux-personnalises/', label: 'Cadeaux personnalisés' },
      { href: '/services/plaques-professionnelles/', label: 'Plaques professionnelles' },
      { href: '/services/etiquettes-industrielles/', label: 'Étiquettes industrielles' },
      { href: '/services/decoupe-laser/', label: 'Découpe laser' },
      { href: '/services/impression-uv/', label: 'Impression UV' },
      { href: '/services/signaletique/', label: 'Signalétique' },
    ],
  },
  { href: '/realisations/', label: 'Réalisations' },
  { href: '/a-propos/', label: 'L’atelier', court: 'Atelier' },
  { href: '/blog/', label: 'Journal' },
];

/** Appel à l'action principal, isolé du reste de la navigation. */
export const ctaPrincipal = {
  href: '/contact/',
  label: 'Demander un devis',
} as const;

export const piedDePage = {
  savoirFaire: [
    { href: '/services/verres-graves/', label: 'Verres et flûtes gravés' },
    { href: '/services/gravure-laser/', label: 'Gravure laser' },
    { href: '/services/caisses-bois-gravees/', label: 'Caisses et coffrets bois' },
    { href: '/services/cadeaux-personnalises/', label: 'Cadeaux personnalisés' },
    { href: '/services/plaques-professionnelles/', label: 'Plaques professionnelles' },
  ],
  decouvrir: [
    { href: '/realisations/', label: 'Réalisations' },
    { href: '/a-propos/', label: 'L’atelier' },
    { href: '/blog/', label: 'Journal de l’atelier' },
    { href: '/contact/', label: 'Demander un devis' },
  ],
  legal: [
    { href: '/mentions-legales/', label: 'Mentions légales' },
    { href: '/politique-de-confidentialite/', label: 'Politique de confidentialité' },
  ],
} as const;

/** Adresse formatée sur une ligne. */
export const adresseLigne = `${adresse.rue}, ${adresse.codePostal} ${adresse.ville}`;
