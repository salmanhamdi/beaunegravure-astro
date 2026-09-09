/**
 * Catalogue des réalisations.
 *
 * Chaque entrée correspond à une photographie réelle d'une pièce produite par
 * l'atelier. Les textes alternatifs décrivent l'objet, jamais le client : les
 * logos visibles sur certaines pièces appartiennent à leurs propriétaires et ne
 * sont pas présentés comme des références commerciales.
 */
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { urlAbsolue } from '@utils/env';

const fichiers = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/realisations/*.{webp,jpg,jpeg,png}',
  { eager: true },
);

/**
 * Catégories de réalisations.
 *
 * `intro` explique ce que la catégorie donne réellement à voir, `usages`
 * énumère les contextes dans lesquels ces pièces sont commandées. Les deux sont
 * établis à partir des photographies effectivement présentes dans la catégorie :
 * rien n'y est extrapolé, aucun client n'y est nommé.
 *
 * `voirAussi` n'est renseigné que lorsqu'un lien est factuellement justifié —
 * jamais pour étoffer une liste.
 */
export const CATEGORIES = {
  verre: {
    slug: 'verre',
    nom: 'Verre et cristal',
    titre: 'Gravure laser sur verre et cristal',
    description:
      'Verres à vin, verres de dégustation, flûtes à champagne, bouteilles et trophées gravés pour les domaines viticoles, les restaurants, les entreprises et les mariages.',
    intro:
      'Le verre ne pardonne rien : la gravure y devient blanche et mate, définitive dès la première passe. C’est aussi la matière où le modèle compte autant que le dessin — un logo qui fonctionne sur un calice large ne tient pas toujours sur un pied étroit. Les pièces réunies ici montrent le même procédé appliqué à des formes très différentes.',
    usages:
      'Verres et flûtes pour les domaines viticoles et les restaurants, séries d’entreprise, trophées, bouteilles commémoratives et pièces de mariage.',
    voirAussi: {
      href: '/projets/',
      libelle: 'Glassora, notre marque de verrerie gravée',
    },
  },
  bois: {
    slug: 'bois',
    nom: 'Bois et coffrets',
    titre: 'Gravure et impression sur bois',
    description:
      'Caisses de vin, coffrets, panneaux et décors gravés au laser ou imprimés en couleur pour les domaines de Bourgogne et les cadeaux d’entreprise.',
    intro:
      'C’est la seule catégorie où les trois procédés de l’atelier se croisent : la gravure creuse et brunit la matière, la découpe y taille des formes, l’impression UV y dépose de la couleur. Une même caisse peut relever des trois. Les photographies vont du coffret unique au panneau grand format.',
    usages:
      'Caisses et coffrets de domaines, panneaux d’extérieur, médailles et trophées d’événement, sous-verres et pièces décoratives.',
  },
  objets: {
    slug: 'objets',
    nom: 'Objets et cadeaux',
    titre: 'Objets personnalisés et cadeaux gravés',
    description:
      'Couteaux de sommelier, tire-bouchons, stylos, gourdes, flasques et accessoires personnalisés à l’unité comme en série.',
    intro:
      'Ces objets arrivent finis : le marquage doit s’inscrire dans un dessin qui existe déjà, sur des surfaces rarement planes et souvent petites. Toute la difficulté est là — trouver la zone qui accepte le motif sans que l’objet cesse d’être lui-même.',
    usages:
      'Cadeaux d’entreprise et de fin d’année, coffrets de sommellerie, récompenses d’événement, cadeaux personnels à l’unité.',
  },
  metal: {
    slug: 'metal',
    nom: 'Métal et industrie',
    titre: 'Marquage laser sur métal et pièces techniques',
    description:
      'Numéros de série, QR codes, DataMatrix et références marqués au laser fibre sur inox, aluminium et plastiques techniques.',
    intro:
      'Ici le marquage n’est pas décoratif : il doit rester lisible — par un œil comme par un lecteur — pendant toute la vie de la pièce, sans ajout de matière ni étiquette rapportée. Chaque exemplaire porte souvent une donnée différente, ce qui change entièrement la façon de préparer la série.',
    usages:
      'Traçabilité et numéros de série, codes DataMatrix et QR, identification d’outillage et d’équipements, plaques techniques.',
    voirAussi: {
      href: '/projets/',
      libelle: 'Spotitap, nos plaques connectées',
    },
  },
  plaques: {
    slug: 'plaques',
    nom: 'Plaques et signalétique',
    titre: 'Plaques professionnelles et signalétique gravée',
    description:
      'Plaques de porte, badges, repérage et signalétique intérieure conçus pour rester lisibles et cohérents avec l’identité du lieu.',
    intro:
      'Une plaque se juge rarement seule : ce qui compte, c’est qu’elle reste cohérente avec celles qui l’entourent et avec celles qui viendront. Matière, format, typographie et hauteur de pose se décident donc pour l’ensemble, pas pour la première pièce. Les finitions présentées ici servent précisément à comparer.',
    usages:
      'Cabinets et professions libérales, hôtels et hébergements, entreprises et ateliers, domaines viticoles, badges nominatifs.',
  },
  decoupe: {
    slug: 'decoupe',
    nom: 'Découpe et plexiglass',
    titre: 'Découpe laser plexiglass et matières fines',
    description:
      'Formes, médaillons, badges et pièces découpées avec des contours nets dans le plexiglass, l’acrylique et le bois fin.',
    intro:
      'Le laser coupe et grave dans le même passage : une pièce peut sortir découpée à sa forme et déjà marquée, sans reprise. Sur le plexiglass, le chant reste net et légèrement translucide — c’est cette tranche, autant que la face, qui fait l’objet fini. La forme cesse d’être une contrainte : elle devient une décision de dessin.',
    usages:
      'Médaillons et marque-places, badges et formes en série, lettres et éléments de signalétique, pièces décoratives sur mesure.',
    voirAussi: {
      href: '/services/signaletique/',
      libelle: 'Lettres et formes découpées en signalétique',
    },
  },
} as const;

export type CategorieSlug = keyof typeof CATEGORIES;

export interface Realisation {
  /** Identifiant stable, égal au nom de fichier sans extension. */
  id: string;
  fichier: string;
  /** Légende courte affichée sous la vignette. */
  titre: string;
  /** Description de l'image pour les lecteurs d'écran et Google Images. */
  alt: string;
  categorie: CategorieSlug;
  /** Page de savoir-faire associée, si pertinent. */
  service?: string;
  /** Mise en avant sur la page d'accueil. */
  vedette?: boolean;
  /**
   * Point d'ancrage du recadrage, quand le centre de l'image n'est pas le
   * centre du sujet. Les vignettes sont carrées : une pièce placée en bord de
   * cadre serait rognée sans cet ajustement. Valeur CSS `object-position`.
   */
  cadrage?: string;
}

const DONNEES: Omit<Realisation, 'id'>[] = [
  /* ---------------------------- Verre et cristal --------------------------- */
  {
    fichier: 'verre-grave-machine-laser-logo-entreprise.webp',
    titre: 'Logo d’entreprise sur verre de dégustation',
    alt: 'Verre de dégustation gravé au logo d’une entreprise, positionné dans la machine laser de l’atelier',
    categorie: 'verre',
    service: '/services/verres-graves/',
    vedette: true,
  },
  {
    fichier: 'verre-vin-grave-logo-domaine-muzard.webp',
    titre: 'Logo de domaine sur pied de verre',
    alt: 'Pied de verre à vin gravé avec le logo manuscrit d’un domaine viticole de Bourgogne',
    categorie: 'verre',
    service: '/services/verres-graves/',
  },
  {
    fichier: 'flutes-champagne-gravees-mariage.webp',
    titre: 'Flûtes de mariage gravées',
    alt: 'Deux flûtes à champagne gravées avec des prénoms, une date et un décor floral fin',
    categorie: 'verre',
    service: '/services/verres-graves/',
  },
  {
    fichier: 'verre-grave-veuve-ambal-spritz-club.jpg',
    titre: 'Série pour une maison de vins effervescents',
    alt: 'Verre gravé en série pour une maison de vins effervescents bourguignonne',
    categorie: 'verre',
    service: '/services/verres-graves/',
  },
  {
    fichier: 'trophee-verre-grave-personnalise.webp',
    titre: 'Trophée en verre',
    alt: 'Trophée en verre gravé au laser avec un visuel sportif',
    categorie: 'verre',
    service: '/services/verres-graves/',
  },
  {
    fichier: 'trophee-verre-flute-graves-personnalises.webp',
    titre: 'Flûte et trophée gravés',
    alt: 'Flûte à champagne et trophée en verre gravés avec des motifs personnalisés',
    categorie: 'verre',
    service: '/services/verres-graves/',
  },
  {
    fichier: 'bouteille-vin-gravee-bapteme-personnalisee.webp',
    titre: 'Bouteille commémorative',
    alt: 'Bouteille de vin gravée avec un prénom et une date de baptême',
    categorie: 'verre',
    service: '/services/verres-graves/',
  },
  {
    fichier: 'bouteille-champagne-coffret-personnalises.webp',
    titre: 'Champagne et coffret assortis',
    alt: 'Bouteille de champagne et coffret noir personnalisés avec un motif doré',
    categorie: 'verre',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'verre-vin-grave-logo-domaine-patrick-guillot.webp',
    titre: 'Verre de domaine personnalisé',
    alt: 'Verre à vin gravé avec le logo d’un domaine viticole, tenu devant un feuillage',
    categorie: 'verre',
    service: '/services/verres-graves/',
  },
  {
    fichier: 'verre-vin-grave-mariage-personnalise.webp',
    titre: 'Verre de mariage personnalisé',
    alt: 'Verre à vin gravé avec un prénom, une date et un décor floral pour un mariage',
    categorie: 'verre',
    service: '/services/verres-graves/',
  },

  /* --------------------------- Bois et coffrets --------------------------- */
  {
    fichier: 'caisses-vin-bois-gravees-appellations-bourgogne.webp',
    titre: 'Appellations bourguignonnes gravées',
    alt: 'Caisses de vin en bois gravées avec des noms d’appellations de Bourgogne',
    categorie: 'bois',
    service: '/services/caisses-bois-gravees/',
  },
  {
    fichier: 'caisse-vin-bois-gravee-domaine-bruno-colin.webp',
    titre: 'Caisse de domaine personnalisée',
    alt: 'Caisse de vin en bois gravée au nom d’un domaine viticole de la Côte de Beaune',
    categorie: 'bois',
    service: '/services/caisses-bois-gravees/',
  },
  {
    fichier: 'caisse-bois-gravee-armoiries-domaine.webp',
    titre: 'Armoiries gravées sur caisse',
    alt: 'Caisse en bois gravée au laser avec les armoiries d’un domaine',
    categorie: 'bois',
    service: '/services/caisses-bois-gravees/',
  },
  {
    fichier: 'caisses-vin-bois-personnalisees-domaines.webp',
    titre: 'Caisses de domaines en série',
    alt: 'Caisses à vin en bois personnalisées avec les logos de plusieurs domaines viticoles',
    categorie: 'bois',
    service: '/services/caisses-bois-gravees/',
  },
  {
    fichier: 'coffrets-bois-graves-cadeaux-personnalises.webp',
    titre: 'Coffrets bois personnalisés',
    alt: 'Série de coffrets en bois gravés avec un portrait et une signature',
    categorie: 'bois',
    service: '/services/caisses-bois-gravees/',
  },
  {
    fichier: 'caisse-bois-bouteille-impression-couleur.webp',
    titre: 'Caisse une bouteille imprimée',
    alt: 'Caisse en bois pour une bouteille personnalisée par impression couleur',
    categorie: 'bois',
    service: '/services/impression-uv/',
  },
  {
    fichier: 'impression-uv-coffret-bois-mariage-personnalise.webp',
    titre: 'Coffret de mariage en couleur',
    alt: 'Coffret en bois personnalisé en couleur pour un mariage',
    categorie: 'bois',
    service: '/services/impression-uv/',
    // Photographie en portrait : le recadrage carré est remonté pour conserver
    // la date imprimée en haut du coffret.
    cadrage: 'center 22%',
  },
  {
    fichier: 'caisses-bois-gravees-hospices-de-beaune.webp',
    titre: 'Série de caisses gravées',
    alt: 'Série de caisses en bois gravées empilées dans l’atelier',
    categorie: 'bois',
    service: '/services/caisses-bois-gravees/',
  },
  {
    fichier: 'impression-uv-bois-planches-decoratives.webp',
    titre: 'Impression directe sur bois',
    alt: 'Planches décoratives en bois imprimées sous une imprimante UV',
    categorie: 'bois',
    service: '/services/impression-uv/',
  },
  {
    fichier: 'impression-uv-tonnelet-bois-beaune-malmedy-beaune-gravure.webp',
    titre: 'Tonnelet personnalisé en couleur',
    alt: 'Tonnelet en bois personnalisé par impression UV couleur',
    categorie: 'bois',
    service: '/services/impression-uv/',
  },
  {
    fichier: 'gravure-laser-panneau-bois-moto-club.webp',
    titre: 'Panneau bois grand format',
    alt: 'Grand panneau rond en bois gravé au laser pour un club de motards',
    categorie: 'bois',
    service: '/services/gravure-laser/',
  },
  {
    fichier: 'gravure-grand-format-panneau-domaine-viticole.webp',
    titre: 'Panneau de domaine grand format',
    alt: 'Grand panneau de domaine viticole gravé au laser',
    categorie: 'bois',
    service: '/services/gravure-laser/',
  },
  {
    fichier: 'gravure-laser-bois-corton-grand-cru-beaune-gravure.webp',
    titre: 'Grand cru gravé sur bois',
    alt: 'Planche en bois gravée au laser avec le nom d’un grand cru de la Côte de Beaune',
    categorie: 'bois',
    service: '/services/gravure-laser/',
  },
  {
    fichier: 'decoupe-bois-prenoms-cercles-personnalises.webp',
    titre: 'Prénoms décoratifs en bois',
    alt: 'Prénoms et cercle décoratif découpés au laser dans du bois',
    categorie: 'bois',
    service: '/services/decoupe-laser/',
  },
  {
    fichier: 'decoupe-laser-decoration-bois-personnalisee.webp',
    titre: 'Enseigne décorative en bois',
    alt: 'Décoration personnalisée en bois découpée au laser',
    categorie: 'bois',
    service: '/services/decoupe-laser/',
  },
  {
    fichier: 'medailles-bois-decoupees-gravees-serie.webp',
    titre: 'Médailles bois en série',
    alt: 'Série de médailles en bois découpées et gravées pour un événement sportif',
    categorie: 'bois',
    service: '/services/decoupe-laser/',
    vedette: true,
  },
  {
    fichier: 'trophees-bois-graves-evenement-entreprise.webp',
    titre: 'Trophées d’entreprise en bois',
    alt: 'Trophées en bois gravés pour un événement d’entreprise',
    categorie: 'bois',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'trophees-viticoles-bois-plexiglass-personnalises.webp',
    titre: 'Créations viticoles sur mesure',
    alt: 'Trophée viticole et supports de bouteilles personnalisés en bois et plexiglass',
    categorie: 'bois',
    service: '/services/caisses-bois-gravees/',
  },
  {
    fichier: 'sous-verres-liege-graves-restauration.webp',
    titre: 'Sous-verres en liège gravés',
    alt: 'Sous-verres en liège gravés pour un établissement de restauration',
    categorie: 'bois',
    service: '/services/gravure-laser/',
  },

  /* --------------------------- Objets et cadeaux -------------------------- */
  {
    fichier: 'cadeau-sommelier-personnalise-coffret.webp',
    titre: 'Coffret sommelier personnalisé',
    alt: 'Couteau de sommelier personnalisé présenté dans son coffret',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'couteaux-graves-appellations-vins-bourgogne.webp',
    titre: 'Couteaux aux appellations',
    alt: 'Coffret bois personnalisé avec des couteaux gravés aux noms d’appellations de Bourgogne',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'couteaux-personnalises-gravure-laser-fibre.webp',
    titre: 'Gravure fibre sur couteaux',
    alt: 'Deux couteaux dont la lame est gravée au laser fibre',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'couteaux-pliants-personnalises-serie.webp',
    titre: 'Couteaux pliants en série',
    alt: 'Série de couteaux pliants personnalisés avec un logo sur le manche en bois',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
    vedette: true,
  },
  {
    fichier: 'tire-bouchon-bois-grave-personnalise.webp',
    titre: 'Tire-bouchon gravé',
    alt: 'Tire-bouchon à manche en bois personnalisé par gravure laser',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'stylo-professionnel-marque-logo-laser.webp',
    titre: 'Stylo d’entreprise marqué',
    alt: 'Stylo professionnel noir marqué au laser avec un logo',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
    vedette: true,
  },
  {
    fichier: 'stylos-bois-graves-cadeaux-entreprise.webp',
    titre: 'Stylos bois en série',
    alt: 'Stylos en bois gravés pour une entreprise',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'couteaux-coffrets-viticoles-personnalises.webp',
    titre: 'Couteaux et coffrets viticoles',
    alt: 'Couteaux gravés accompagnés de coffrets personnalisés pour un domaine viticole',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'cles-usb-bois-personnalisees-gravure.webp',
    titre: 'Clés USB personnalisées',
    alt: 'Clés USB en bois gravées avec des prénoms',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'gourde-inox-gravee-laser-fibre.webp',
    titre: 'Gourde inox gravée',
    alt: 'Gourde en acier inoxydable personnalisée au laser fibre',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'gourdes-bleues-marquees-laser-serie.webp',
    titre: 'Gourdes marquées en série',
    alt: 'Gourdes bleues personnalisées en série par marquage laser',
    categorie: 'objets',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'flasques-inox-personnalisees-laser.webp',
    titre: 'Flasques personnalisées',
    alt: 'Deux flasques en inox personnalisées par gravure laser',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'gobelets-isothermes-personnalises-laser.webp',
    titre: 'Gobelets nomades gravés',
    alt: 'Gobelets isothermes noirs personnalisés par gravure laser',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'couverts-inox-personnalises-prenom.webp',
    titre: 'Couverts personnalisés',
    alt: 'Couverts en inox personnalisés avec un prénom',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'porte-cles-metal-personnalise-gravure.webp',
    titre: 'Porte-clés gravé',
    alt: 'Porte-clés métallique personnalisé par gravure laser',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'briquet-metal-personnalise-gravure.webp',
    titre: 'Briquet personnalisé',
    alt: 'Briquet métallique personnalisé avec un prénom et un emblème',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'gravure-laser-fibre-montre-metal.webp',
    titre: 'Montre gravée',
    alt: 'Montre métallique personnalisée par gravure laser fibre',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'gravure-laser-etui-cuir-rouge.webp',
    titre: 'Motif fin sur cuir',
    alt: 'Étui rouge en cuir gravé avec un motif floral détaillé',
    categorie: 'objets',
    service: '/services/gravure-laser/',
    vedette: true,
  },
  {
    fichier: 'coupe-trophee-plaque-gravee.webp',
    titre: 'Plaque de trophée',
    alt: 'Coupe sportive équipée d’une plaque personnalisée gravée',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },

  /* -------------------------- Métal et industrie -------------------------- */
  {
    fichier: 'plaques-metal-gravees-laser-serie.webp',
    titre: 'Plaques métalliques en série',
    alt: 'Plaques métalliques gravées au laser avec des textes techniques détaillés',
    categorie: 'metal',
    service: '/services/plaques-professionnelles/',
  },
  {
    fichier: 'plaque-metal-qr-code-donnees-variables.webp',
    titre: 'QR code et données variables',
    alt: 'Plaque métallique noire marquée avec un QR code et des données variables',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'plaque-inox-marquee-laser-en-production.webp',
    titre: 'Marquage inox en production',
    alt: 'Plaque signalétique en inox pendant son marquage au laser',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'pieces-inox-marquage-numero-serie.webp',
    titre: 'Traçabilité sur pièces inox',
    alt: 'Pièces industrielles en inox marquées avec des numéros de série',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
    vedette: true,
  },
  {
    fichier: 'outil-metal-marque-datamatrix-laser.webp',
    titre: 'DataMatrix sur outil',
    alt: 'Outil métallique marqué au laser avec un code DataMatrix',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'piece-horlogerie-gravee-edition-limitee.webp',
    titre: 'Numérotation de précision',
    alt: 'Pièce horlogère métallique gravée avec un numéro d’édition limitée',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'marquage-laser-fibre-outils-serie.webp',
    titre: 'Outillage marqué en série',
    alt: 'Série de forets métalliques positionnés pour un marquage laser',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'outil-industriel-grave-reference.webp',
    titre: 'Identification d’outillage',
    alt: 'Outil industriel métallique gravé avec une référence',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'marquage-laser-filtres-aluminium-serie.webp',
    titre: 'Série sur aluminium anodisé',
    alt: 'Filtres en aluminium anodisé marqués au laser en série',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'marquage-laser-composant-plastique-industriel.webp',
    titre: 'Composant plastique identifié',
    alt: 'Composant plastique industriel marqué avec des pictogrammes',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'piece-plastique-marquee-reference.webp',
    titre: 'Référence sur plastique',
    alt: 'Composant plastique clair marqué avec une référence',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'etiquette-plastique-qr-code-tracabilite.webp',
    titre: 'QR code de traçabilité',
    alt: 'Étiquette plastique jaune marquée avec un numéro et un QR code',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'etiquettes-industrielles-donnees-variables.webp',
    titre: 'Formats et données variables',
    alt: 'Étiquettes industrielles avec pictogrammes, QR codes et données variables',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'etiquette-industrielle-jaune-metal-beaune-gravure.jpg',
    titre: 'Étiquette industrielle jaune',
    alt: 'Étiquette industrielle jaune personnalisée fixée sur un support métallique',
    categorie: 'metal',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'boitier-technique-plaque-identification.webp',
    titre: 'Identification d’équipement',
    alt: 'Boîtier technique professionnel équipé d’une plaque métallique d’identification',
    categorie: 'metal',
    service: '/services/plaques-professionnelles/',
  },

  /* ------------------------ Plaques et signalétique ----------------------- */
  {
    fichier: 'plaques-professionnelles-gravees-multi-finitions.webp',
    titre: 'Signalétique multi-finitions',
    alt: 'Ensemble de plaques de signalétique gravées présentées en plusieurs finitions',
    categorie: 'plaques',
    service: '/services/plaques-professionnelles/',
    vedette: true,
  },
  {
    fichier: 'plaque-plexiglass-doree-avocat-decoupee.webp',
    titre: 'Plaque professionnelle en plexiglass',
    alt: 'Plaque professionnelle dorée en plexiglass découpée et gravée pour un cabinet',
    categorie: 'plaques',
    service: '/services/plaques-professionnelles/',
  },
  {
    fichier: 'plaque-professionnelle-avocat-exterieure-beaune-gravure.webp',
    titre: 'Plaque de cabinet extérieure',
    alt: 'Plaque professionnelle extérieure gravée, posée sur une façade',
    categorie: 'plaques',
    service: '/services/plaques-professionnelles/',
    // La plaque est décalée à droite dans le cadre : un recadrage centré en
    // couperait le texte gravé.
    cadrage: '72% center',
  },
  {
    fichier: 'decoupe-plexiglass-plaque-numero-porte.webp',
    titre: 'Numéro de porte découpé',
    alt: 'Plaque numéro de porte découpée dans du plexiglass noir',
    categorie: 'plaques',
    service: '/services/signaletique/',
  },
  {
    fichier: 'badge-professionnel-grave-personnalise.webp',
    titre: 'Badge professionnel',
    alt: 'Badge nominatif professionnel gravé et découpé',
    categorie: 'plaques',
    service: '/services/plaques-professionnelles/',
  },
  {
    fichier: 'gravure-laser-plaques-vigneron-serie-atelier.webp',
    titre: 'Plaques de domaine en série',
    alt: 'Plaques de domaine viticole gravées en série dans la machine laser',
    categorie: 'plaques',
    service: '/services/plaques-professionnelles/',
  },

  /* ------------------------ Découpe et plexiglass ------------------------- */
  {
    fichier: 'decoupe-laser-plexiglass-rose-beaune-gravure.jpg',
    titre: 'Découpe en plexiglass teinté',
    alt: 'Pièces découpées au laser dans du plexiglass rose',
    categorie: 'decoupe',
    service: '/services/decoupe-laser/',
  },
  {
    fichier: 'medaillons-plexiglass-decoupes-graves.webp',
    titre: 'Médaillons en plexiglass',
    alt: 'Médaillons ronds en plexiglass transparent découpés et gravés avec des messages',
    categorie: 'decoupe',
    service: '/services/decoupe-laser/',
    vedette: true,
  },
];

function resoudre(fichier: string): ImageMetadata {
  const cle = `../assets/images/realisations/${fichier}`;
  const module = fichiers[cle];
  if (!module) {
    throw new Error(
      `Réalisation introuvable : ${fichier}. Vérifier src/assets/images/realisations/.`,
    );
  }
  return module.default;
}

export const realisations: Realisation[] = DONNEES.map((entree) => ({
  ...entree,
  id: entree.fichier.replace(/\.(webp|jpe?g|png)$/i, ''),
}));

/** Métadonnées d'image résolues, indexées par identifiant de réalisation. */
export const imagesRealisations: Record<string, ImageMetadata> = Object.fromEntries(
  realisations.map((r) => [r.id, resoudre(r.fichier)]),
);

export function imageDe(realisation: Realisation): ImageMetadata {
  return imagesRealisations[realisation.id]!;
}

export function parCategorie(slug: CategorieSlug): Realisation[] {
  return realisations.filter((r) => r.categorie === slug);
}

export function parService(chemin: string): Realisation[] {
  return realisations.filter((r) => r.service === chemin);
}

export const realisationsVedettes = realisations.filter((r) => r.vedette);

export const categoriesOrdonnees = (
  Object.keys(CATEGORIES) as CategorieSlug[]
).map((slug) => ({
  ...CATEGORIES[slug],
  total: parCategorie(slug).length,
}));

/**
 * Rendu des vignettes sur les pages de réalisations — grille à trois colonnes.
 *
 * Ces deux constantes sont partagées avec `GrilleRealisations` pour une raison
 * précise : `imagesDeclarees` ci-dessous doit demander à Astro EXACTEMENT la
 * même variante que celle affichée. Une largeur ou un `sizes` qui diverge, et
 * le site produit un second jeu d'images inutile.
 */
export const LARGEURS_VIGNETTE = [400, 640, 900];
export const SIZES_VIGNETTE = '(min-width: 68rem) 31vw, 46vw';

/**
 * Décrit les photographies pour le balisage structuré.
 *
 * La variante demandée est EXACTEMENT celle que produit déjà `CarteRealisation`
 * — 900 px, WebP, qualité 72. Le nom du fichier généré dérivant du contenu et
 * des paramètres, aucune image supplémentaire n'est créée : on ne fait que
 * retrouver l'adresse de celle qui est déjà servie.
 *
 * Seuls des faits vérifiables sont renvoyés : l'adresse réelle, la légende et
 * le texte alternatif affichés sur la page, et les dimensions calculées par
 * Astro.
 */
export async function imagesDeclarees(pieces: Realisation[]) {
  return Promise.all(
    pieces.map(async (piece) => {
      const source = imageDe(piece);
      const rendue = await getImage({
        src: source,
        // Les mêmes options, à la virgule près, que celles que `<Picture>`
        // transmet depuis `CarteRealisation` — y compris `layout`, `fit` et
        // `position`, que le composant ajoute lui-même à partir de la
        // configuration globale des images. Les omettre produirait une variante
        // DIFFÉRENTE : 423 fichiers de plus dans le site, et une adresse qui ne
        // serait pas celle réellement servie.
        widths: LARGEURS_VIGNETTE,
        sizes: SIZES_VIGNETTE,
        layout: 'constrained',
        fit: 'cover',
        position: 'center',
        quality: 72,
        format: 'webp',
      });
      const largeur = Number(rendue.attributes.width ?? 900);
      const hauteur = Number(
        rendue.attributes.height ?? Math.round((largeur * source.height) / source.width),
      );
      return {
        contentUrl: urlAbsolue(rendue.src),
        nom: piece.titre,
        description: piece.alt,
        largeur,
        hauteur,
      };
    }),
  );
}

/** Récupère des réalisations dans un ordre choisi explicitement. */
export function parIds(...ids: string[]): Realisation[] {
  return ids
    .map((id) => realisations.find((r) => r.id === id))
    .filter((r): r is Realisation => Boolean(r));
}
