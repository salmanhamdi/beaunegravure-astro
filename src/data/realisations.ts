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
    fichier: 'verre-bleu-marquage-laser-rotatif.webp',
    titre: 'Marquage sur verre teinté',
    alt: 'Pièce cylindrique en verre teinté bleu en cours de marquage sur l’axe rotatif du laser',
    categorie: 'verre',
    service: '/services/verres-graves/',
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
    fichier: 'caisse-bois-mariage-impression-uv-dans-machine.webp',
    titre: 'Caisse de mariage imprimée, sur le plateau',
    alt: 'Caisse en bois pour une bouteille, couvercle imprimé en couleur d’un décor de feuillages avec deux prénoms et une date, photographiée sur le plateau de la machine laser',
    categorie: 'bois',
    service: '/services/impression-uv/',
  },
  {
    fichier: 'caisse-bois-bouteille-impression-uv-illustration-bourgogne.webp',
    titre: 'Caisse une bouteille imprimée en couleur',
    alt: 'Caisse en bois pour une bouteille imprimée en couleur d’une illustration des toits et des vignes de Bourgogne, présentée avec une bouteille, un verre et un bouchon gravé du millésime',
    categorie: 'bois',
    service: '/services/impression-uv/',
    vedette: true,
    // Photographie en portrait : le recadrage carré est remonté pour garder
    // la caisse imprimée entière dans la vignette.
    cadrage: 'center 35%',
  },
  {
    fichier: 'caisse-bois-trois-bouteilles-impression-mariage.webp',
    titre: 'Caisse trois bouteilles imprimée en couleur',
    alt: 'Caisse en bois pour trois bouteilles, couvercle coulissant imprimé en couleur avec un décor de mariés et flanc gravé au laser',
    categorie: 'bois',
    service: '/services/impression-uv/',
  },
  {
    fichier: 'caisse-bois-une-bouteille-gravee-impression-mariage.webp',
    titre: 'Caisse une bouteille gravée et imprimée',
    alt: 'Caisse en bois pour une bouteille : couvercle coulissant imprimé en couleur avec un décor de mariage, flanc du coffret gravé au laser',
    categorie: 'bois',
    service: '/services/caisses-bois-gravees/',
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
    fichier: 'impression-uv-icone-religieuse-panneau-bois.webp',
    titre: 'Icône reproduite sur bois',
    alt: 'Reproduction d’une icône ancienne imprimée en couleur sur un panneau de bois, accrochée au mur de pierre d’une église',
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
    fichier: 'sous-verres-bambou-graves-beaune-grands-crus.webp',
    titre: 'Dessous de verre en bambou gravés',
    alt: 'Dessous de verre ronds en bambou gravés au laser de motifs de vigne et de noms d’appellations de la Côte de Beaune, présentés avec leur support',
    categorie: 'bois',
    service: '/services/gravure-bois/',
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
    fichier: 'couteau-sommelier-grave-prenom-coffret.webp',
    titre: 'Couteau de sommelier gravé au prénom',
    alt: 'Couteau de sommelier à manche en bois posé dans son coffret noir, la platine gravée du nom de l’atelier d’un côté et d’un prénom de l’autre',
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
    fichier: 'crayons-bois-graves-serie-personnalisee.webp',
    titre: 'Crayons en bois gravés en série',
    alt: 'Onze crayons en bois naturel gravés au laser du même nom, alignés sur un fond d’ardoise, embout métal et gomme blanche',
    categorie: 'objets',
    service: '/services/gravure-bois/',
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
    fichier: 'gourdes-isothermes-blanches-personnalisees-serie.webp',
    titre: 'Série de gourdes isothermes personnalisées',
    alt: 'Gourdes isothermes blanches personnalisées d’un logo noir, alignées en série devant leurs étuis d’emballage',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
  },
  {
    fichier: 'gourdes-isothermes-couleurs-gravees-laser-serie.webp',
    titre: 'Gourdes isothermes gravées en série',
    alt: 'Gourdes isothermes de plusieurs couleurs gravées au laser, le logo apparaissant en acier nu sous la laque',
    categorie: 'objets',
    service: '/services/gravure-metal/',
  },
  {
    fichier: 'gourdes-bleues-marquees-laser-serie.webp',
    titre: 'Gourdes marquées en série',
    alt: 'Gourdes bleues personnalisées en série par marquage laser',
    categorie: 'objets',
    service: '/services/etiquettes-industrielles/',
  },
  {
    fichier: 'flasques-inox-gravees-serie-plateau-laser.webp',
    titre: 'Flasques gravées en série dans la machine',
    alt: 'Flasques en inox gravées au laser d’un logo et d’un millésime, alignées en série sur le plateau nid d’abeille du laser',
    categorie: 'objets',
    service: '/services/cadeaux-personnalises/',
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
    fichier: 'boule-petanque-gravee-logo-entreprise.webp',
    titre: 'Boule de pétanque gravée au logo',
    alt: 'Boule de pétanque en acier tenue en main, gravée au laser du logo d’une entreprise sur la calotte supérieure, sur un terrain de jeu',
    categorie: 'objets',
    service: '/services/gravure-metal/',
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
    service: '/services/marquage-industriel/',
    vedette: true,
  },
  {
    fichier: 'outil-metal-marque-datamatrix-laser.webp',
    titre: 'DataMatrix sur outil',
    alt: 'Outil métallique marqué au laser avec un code DataMatrix',
    categorie: 'metal',
    service: '/services/marquage-industriel/',
  },
  {
    fichier: 'piece-horlogerie-gravee-edition-limitee.webp',
    titre: 'Numérotation de précision',
    alt: 'Pièce horlogère métallique gravée avec un numéro d’édition limitée',
    categorie: 'metal',
    service: '/services/marquage-industriel/',
  },
  {
    fichier: 'marquage-laser-fibre-outils-serie.webp',
    titre: 'Outillage marqué en série',
    alt: 'Série de forets métalliques positionnés pour un marquage laser',
    categorie: 'metal',
    service: '/services/marquage-industriel/',
  },
  {
    fichier: 'outil-industriel-grave-reference.webp',
    titre: 'Identification d’outillage',
    alt: 'Outil industriel métallique gravé avec une référence',
    categorie: 'metal',
    service: '/services/marquage-industriel/',
  },
  {
    fichier: 'marquage-laser-filtres-aluminium-serie.webp',
    titre: 'Série sur aluminium anodisé',
    alt: 'Filtres en aluminium anodisé marqués au laser en série',
    categorie: 'metal',
    service: '/services/marquage-industriel/',
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
    fichier: 'impression-uv-chevalet-nfc-avis-google-osteopathe.webp',
    titre: 'Chevalet d’avis clients NFC',
    alt: 'Chevalet de comptoir imprimé en couleur avec une puce NFC et un QR code, posé sur le bureau d’un cabinet d’ostéopathie',
    categorie: 'plaques',
    service: '/services/impression-uv/',
  },
  {
    fichier: 'plaques-porte-hotel-gravees-appellations-pictogrammes.webp',
    titre: 'Plaques de porte gravées pour un hôtel',
    alt: 'Série de plaques de porte gravées à finition argent : noms d’appellations bourguignonnes, intitulés de pièces et pictogrammes, percées pour la pose',
    categorie: 'plaques',
    service: '/services/signaletique/',
  },
  {
    fichier: 'plaques-plexiglass-bicouche-reperes-couleur.webp',
    titre: 'Repères en plexiglass bicouche',
    alt: 'Plaques et jetons en plexiglass bicouche gravés de repères et de numéros, en cinq couleurs',
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
    fichier: 'plaque-nfc-menu-avis-google-spotitap.webp',
    titre: 'Plaque NFC menu et avis',
    alt: 'Plaque ronde NFC réunissant menu en ligne, avis Google et accès Wi-Fi, tenue dans une main',
    categorie: 'plaques',
    service: '/services/plaques-professionnelles/',
  },
  {
    fichier: 'badge-professionnel-grave-personnalise.webp',
    titre: 'Badge professionnel',
    alt: 'Badge nominatif professionnel gravé et découpé',
    categorie: 'plaques',
    service: '/services/plaques-professionnelles/',
  },
  {
    fichier: 'plaque-professionnelle-metal-brosse-entreprise.webp',
    titre: 'Plaque d’entreprise en métal brossé',
    alt: 'Grande plaque professionnelle en métal brossé marquée en noir de deux logos, d’une liste de prestations, d’un numéro de téléphone et de pictogrammes de réseaux sociaux, percée aux quatre angles',
    categorie: 'plaques',
    service: '/services/plaques-professionnelles/',
  },
  {
    fichier: 'plaques-professionnelles-gravees-multi-finitions.webp',
    titre: 'Signalétique multi-finitions',
    alt: 'Ensemble de plaques de signalétique gravées présentées en plusieurs finitions',
    categorie: 'plaques',
    service: '/services/plaques-professionnelles/',
    vedette: true,
  },
  {
    fichier: 'gravure-laser-plaques-vigneron-serie-atelier.webp',
    titre: 'Plaques de domaine en série',
    alt: 'Plaques de domaine viticole gravées en série dans la machine laser',
    categorie: 'plaques',
    service: '/services/plaques-professionnelles/',
  },

  {
    fichier: 'plaques-decoratives-bordeaux-cave-route-grands-crus.webp',
    titre: 'Plaques décoratives pour une cave',
    alt: 'Deux plaques décoratives bordeaux à lettres et motifs de vigne blancs, dont une en forme de plaque de rue, posées devant des bouteilles de Bourgogne',
    categorie: 'plaques',
    service: '/services/signaletique/',
  },

  /* ------------------------ Découpe et plexiglass ------------------------- */
  {
    fichier: 'impression-uv-etiquettes-plexiglass-domaine-leflaive.webp',
    titre: 'Étiquettes de parcelle en plexiglass',
    alt: 'Étiquettes de vigne en plexiglass blanc, découpées, percées et imprimées en couleur pour un domaine de Puligny-Montrachet',
    categorie: 'decoupe',
    service: '/services/impression-uv/',
  },
  {
    fichier: 'impression-uv-medaillons-plexiglass-animaux-spotitap.webp',
    titre: 'Médaillons pour animaux',
    alt: 'Six médaillons ronds en plexiglass imprimés en couleur, chacun dans un motif différent, tenus dans une main',
    categorie: 'decoupe',
    service: '/services/impression-uv/',
  },
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

/* ======================================================================= */
/*                            SOUS-GALERIES                                */
/* ======================================================================= */

/**
 * Découpage fin du catalogue, en galeries thématiques.
 *
 * POURQUOI. Les six catégories décrivent une MATIÈRE ; elles ne décrivent pas
 * ce qu'on cherche. Quelqu'un qui veut faire graver des couteaux de sommelier
 * ne cherche pas « objets », et la page « Objets et cadeaux » lui demande de
 * parcourir dix-neuf pièces pour trouver les six qui le concernent. Les
 * sous-galeries donnent une page par famille réellement demandée.
 *
 * CE N'EST PAS UNE FABRIQUE DE PAGES. Chaque sous-galerie est un sous-ensemble
 * de pièces RÉELLEMENT photographiées : rien n'est généré, rien n'est
 * dupliqué. La contrainte est vérifiée au build par `sousGaleriesVerifiees`
 * ci-dessous, qui refuse un identifiant inconnu, une pièce rangée dans la
 * mauvaise catégorie, une pièce présente dans deux galeries, et toute galerie
 * de moins de trois pièces — en dessous, une page n'a rien à montrer.
 *
 * La catégorie `decoupe` (quatre pièces) n'en a volontairement aucune : la
 * découper produirait exactement les pages creuses que ce garde-fou cherche à
 * empêcher.
 */
export interface SousGalerie {
  slug: string;
  categorie: CategorieSlug;
  nom: string;
  titre: string;
  seoTitle: string;
  description: string;
  intro: string;
  pieces: string[];
}

export const SOUS_GALERIES: SousGalerie[] = [
  /* ---------------------------- Bois et coffrets --------------------------- */
  {
    slug: 'caisses-et-coffrets',
    categorie: 'bois',
    nom: 'Caisses et coffrets',
    titre: 'Caisses de vin et coffrets gravés',
    seoTitle: 'Caisses de vin et coffrets bois gravés',
    description:
      'Caisses de vin et coffrets en bois gravés pour les domaines de Bourgogne : logo, appellation, millésime, armoiries, et coffrets cadeaux personnalisés.',
    intro:
      'La pièce qui sort du chai et qui porte le nom du domaine. Ces caisses et ces coffrets ont été gravés sur les bois fournis par les domaines eux-mêmes — peuplier brut, pin huilé, chêne de récupération — qui ne réagissent pas de la même façon sous le faisceau. D’où l’exemplaire d’essai demandé avant chaque série.',
    pieces: [
      'caisses-vin-bois-gravees-appellations-bourgogne',
      'caisse-vin-bois-gravee-domaine-bruno-colin',
      'caisse-bois-gravee-armoiries-domaine',
      'caisses-vin-bois-personnalisees-domaines',
      'caisses-bois-gravees-hospices-de-beaune',
      'coffrets-bois-graves-cadeaux-personnalises',
      'caisse-bois-bouteille-impression-couleur',
      'impression-uv-coffret-bois-mariage-personnalise',
      'caisse-bois-une-bouteille-gravee-impression-mariage',
      'caisse-bois-bouteille-impression-uv-illustration-bourgogne',
      'caisse-bois-mariage-impression-uv-dans-machine',
      'caisse-bois-trois-bouteilles-impression-mariage',
    ],
  },
  {
    slug: 'panneaux-et-grand-format',
    categorie: 'bois',
    nom: 'Panneaux et grand format',
    titre: 'Panneaux de bois gravés et grand format',
    seoTitle: 'Panneaux bois gravés et gravure grand format',
    description:
      'Panneaux de bois gravés au laser et imprimés en UV : enseignes de domaine, panneaux d’accueil, décors et pièces de grand format jusqu’à 101 × 61 cm.',
    intro:
      'C’est la zone utile du laser CO₂ qui fixe la limite : 101 × 61 cm en une passe, au-delà de quoi la pièce se compose. Ces panneaux mêlent les deux procédés — la gravure creuse et brunit le bois, l’impression UV y dépose la couleur — et le choix dépend d’abord de l’exposition du panneau, pas du rendu voulu.',
    pieces: [
      'gravure-grand-format-panneau-domaine-viticole',
      'gravure-laser-bois-corton-grand-cru-beaune-gravure',
      'gravure-laser-panneau-bois-moto-club',
      'impression-uv-bois-planches-decoratives',
      'impression-uv-icone-religieuse-panneau-bois',
    ],
  },
  {
    slug: 'decoupe-et-decoration-bois',
    categorie: 'bois',
    nom: 'Découpe et décoration',
    titre: 'Découpe laser du bois et pièces décoratives',
    seoTitle: 'Découpe laser bois et décoration personnalisée',
    description:
      'Découpe laser du bois et du liège : prénoms et formes découpées, sous-verres pour la restauration, pièces décoratives et objets gravés sur mesure.',
    intro:
      'Ici le laser ne marque pas, il taille. Formes, prénoms, cercles, sous-verres : la découpe du bois et du liège demande un trait net et une reprise propre des angles, ce qui se règle au gabarit plutôt qu’à la machine. Les pièces fines partent avec leurs chutes, qui servent d’essai de teinte.',
    pieces: [
      'decoupe-bois-prenoms-cercles-personnalises',
      'decoupe-laser-decoration-bois-personnalisee',
      'sous-verres-bambou-graves-beaune-grands-crus',
      'sous-verres-liege-graves-restauration',
      'impression-uv-tonnelet-bois-beaune-malmedy-beaune-gravure',
    ],
  },
  /* ---------------------------- Métal et pièces ---------------------------- */
  {
    slug: 'tracabilite-et-donnees-variables',
    categorie: 'metal',
    nom: 'Traçabilité et données variables',
    titre: 'Traçabilité laser : numéros de série, QR et DataMatrix',
    seoTitle: 'Traçabilité laser : QR codes et DataMatrix',
    description:
      'Marquage laser de traçabilité : numéros de série incrémentés, codes DataMatrix et QR codes uniques, à partir d’un simple tableau de données.',
    intro:
      'Deux pièces d’une même série portent rarement le même code. Chaque pièce reçoit le sien depuis un tableau que vous transmettez : le réglage machine ne change pas, seul le fichier change. Une pièce test est marquée et scannée avant lancement — c’est cette étape qui garantit que la série sera exploitable par vos lecteurs.',
    pieces: [
      'plaque-metal-qr-code-donnees-variables',
      'pieces-inox-marquage-numero-serie',
      'outil-metal-marque-datamatrix-laser',
      'etiquettes-industrielles-donnees-variables',
      'etiquette-plastique-qr-code-tracabilite',
    ],
  },
  {
    slug: 'plaques-techniques',
    categorie: 'metal',
    nom: 'Plaques techniques',
    titre: 'Plaques techniques et plaques de machine',
    seoTitle: 'Plaques techniques et plaques de machine gravées',
    description:
      'Plaques techniques gravées au laser : plaques de machine, plaques constructeur, boîtiers et coffrets, identification d’armoires et de postes.',
    intro:
      'Une plaque de machine doit rester lisible après des années de nettoyage industriel. Le marquage laser fibre ne dépose rien sur l’inox ou l’aluminium : il modifie la surface, donc il ne peut pas s’écailler ni se décoller. Sur une plaque déjà au format, nous marquons sans découper — notre découpe laser ne traite pas le métal.',
    pieces: [
      'plaques-metal-gravees-laser-serie',
      'plaque-inox-marquee-laser-en-production',
      'etiquette-industrielle-jaune-metal-beaune-gravure',
      'boitier-technique-plaque-identification',
    ],
  },
  {
    slug: 'outillage-et-pieces-marquees',
    categorie: 'metal',
    nom: 'Outillage et pièces',
    titre: 'Marquage d’outillage et de pièces techniques',
    seoTitle: 'Marquage laser d’outillage et de pièces',
    description:
      'Marquage laser sur outillage et pièces techniques : outils, forets, gabarits, filtres aluminium, composants plastiques et pièces de précision.',
    intro:
      'Identifier un outil, c’est limiter les pertes et rendre un inventaire possible. Ces pièces ont été marquées au laser fibre dans une zone utile de 20 × 20 cm, mandrin rotatif compris pour les formes cylindriques. Sur les plastiques techniques, la compatibilité se vérifie au cas par cas : ceux qui contiennent du chlore ne sont pas traités.',
    pieces: [
      'marquage-laser-fibre-outils-serie',
      'outil-industriel-grave-reference',
      'marquage-laser-filtres-aluminium-serie',
      'marquage-laser-composant-plastique-industriel',
      'piece-plastique-marquee-reference',
      'piece-horlogerie-gravee-edition-limitee',
    ],
  },
  /* --------------------------- Objets et cadeaux --------------------------- */
  {
    slug: 'sommellerie-et-couteaux',
    categorie: 'objets',
    nom: 'Sommellerie et couteaux',
    titre: 'Couteaux de sommelier et objets de cave gravés',
    seoTitle: 'Couteaux de sommelier et tire-bouchons gravés',
    description:
      'Couteaux de sommelier, tire-bouchons et coffrets viticoles gravés au laser : appellations, logos de domaines, prénoms, à l’unité comme en série.',
    intro:
      'La famille la plus demandée en Côte de Beaune, souvent commandée après les caisses et les verres — avec le même fichier, déjà préparé et validé. Sur un manche, quelques millimètres de gravure suffisent : l’objet reste un outil de travail, pas un support publicitaire.',
    pieces: [
      'couteau-sommelier-grave-prenom-coffret',
      'couteaux-graves-appellations-vins-bourgogne',
      'couteaux-coffrets-viticoles-personnalises',
      'couteaux-personnalises-gravure-laser-fibre',
      'couteaux-pliants-personnalises-serie',
      'tire-bouchon-bois-grave-personnalise',
    ],
  },
  {
    slug: 'gourdes-et-contenants',
    categorie: 'objets',
    nom: 'Gourdes et contenants',
    titre: 'Gourdes, flasques et gobelets gravés',
    seoTitle: 'Gourdes, flasques et gobelets inox gravés',
    description:
      'Gourdes et flasques inox, gobelets isothermes gravés au laser fibre : marquage permanent qui résiste au lavage, pour les séries d’entreprise.',
    intro:
      'Sur un contenant manipulé tous les jours, l’impression part au lavage. Le laser fibre marque l’inox sans rien déposer, donc rien ne peut s’écailler. La seule vraie question est le revêtement : un inox brossé rend très bien, un objet peint ou laqué peut s’écailler au bord du tracé, et cela se vérifie sur un exemplaire avant la série.',
    pieces: [
      'gourde-inox-gravee-laser-fibre',
      'gourdes-bleues-marquees-laser-serie',
      'gourdes-isothermes-couleurs-gravees-laser-serie',
      'gourdes-isothermes-blanches-personnalisees-serie',
      'flasques-inox-personnalisees-laser',
      'flasques-inox-gravees-serie-plateau-laser',
      'gobelets-isothermes-personnalises-laser',
    ],
  },
  {
    slug: 'ecriture-et-bureau',
    categorie: 'objets',
    nom: 'Écriture et bureau',
    titre: 'Stylos et objets de bureau personnalisés',
    seoTitle: 'Stylos gravés et objets de bureau personnalisés',
    description:
      'Stylos bois et métal gravés, clés USB personnalisées : objets d’écriture et de bureau marqués au laser pour les cadeaux clients et les séminaires.',
    intro:
      'Une ligne de texte sur un stylo, pas davantage. C’est la famille où la retenue compte le plus : le destinataire doit pouvoir sortir l’objet devant quelqu’un d’autre sans gêne, ce qu’un logo surdimensionné interdit. Ces pièces ont été gravées en série pour des cadeaux clients et des séminaires.',
    pieces: [
      'stylo-professionnel-marque-logo-laser',
      'crayons-bois-graves-serie-personnalisee',
      'stylos-bois-graves-cadeaux-entreprise',
      'cles-usb-bois-personnalisees-gravure',
    ],
  },
  {
    slug: 'objets-du-quotidien',
    categorie: 'objets',
    nom: 'Objets du quotidien',
    titre: 'Objets du quotidien gravés sur mesure',
    seoTitle: 'Objets gravés : couverts, cuir, montres',
    description:
      'Couverts inox, porte-clés, briquets, montres et étuis en cuir gravés au laser : pièces uniques et petites séries, sur l’objet que vous apportez.',
    intro:
      'Ce sont souvent des pièces apportées par leur propriétaire, et parfois sentimentales. Avant d’intervenir sur un objet de valeur, nous vérifions la matière et la forme, nous expliquons le risque, et nous proposons un essai quand c’est possible. Une gravure ne se défait pas.',
    pieces: [
      'boule-petanque-gravee-logo-entreprise',
      'couverts-inox-personnalises-prenom',
      'porte-cles-metal-personnalise-gravure',
      'briquet-metal-personnalise-gravure',
      'gravure-laser-fibre-montre-metal',
      'gravure-laser-etui-cuir-rouge',
    ],
  },
  /* ------------------------------ Verre ------------------------------------ */
  {
    slug: 'verres-et-flutes',
    categorie: 'verre',
    nom: 'Verres et flûtes',
    titre: 'Verres à vin et flûtes gravés au logo',
    seoTitle: 'Verres à vin et flûtes gravés au logo du domaine',
    description:
      'Verres à vin et de dégustation gravés au logo des domaines, des caveaux et des restaurants : un marquage satiné qui ne part pas au lave-vaisselle.',
    intro:
      'Chaque modèle de verre demande son propre réglage, à cause de la courbure : c’est le premier exemplaire qui coûte le plus, pas les suivants. La zone exploitable dépend de la paroi — plus elle est bombée, plus elle se réduit — et le motif s’adapte à la forme du verre plutôt que l’inverse.',
    pieces: [
      'verre-vin-grave-logo-domaine-muzard',
      'verre-vin-grave-logo-domaine-patrick-guillot',
      'verre-grave-machine-laser-logo-entreprise',
      'verre-grave-veuve-ambal-spritz-club',
      'verre-bleu-marquage-laser-rotatif',
    ],
  },
  {
    slug: 'mariage-et-evenement',
    categorie: 'verre',
    nom: 'Mariage et événement',
    titre: 'Verres, flûtes et bouteilles pour un événement',
    seoTitle: 'Flûtes et bouteilles gravées mariage et baptême',
    description:
      'Flûtes à champagne, verres et bouteilles gravés pour un mariage, un baptême ou un anniversaire : pièces uniques comme séries de table.',
    intro:
      'Sur ces commandes, la fabrication n’est presque jamais le facteur limitant : c’est la liste des noms, qui arrive souvent la semaine d’avant. Envoyez-la même incomplète, nous préparons le gabarit et nous n’attendons plus que les prénoms. Une paire de verres se traite avec le même soin qu’une série.',
    pieces: [
      'flutes-champagne-gravees-mariage',
      'verre-vin-grave-mariage-personnalise',
      'bouteille-vin-gravee-bapteme-personnalisee',
      'bouteille-champagne-coffret-personnalises',
    ],
  },
  /* --------------------------- Plaques et signalétique --------------------- */
  {
    slug: 'plaques-de-cabinet',
    categorie: 'plaques',
    nom: 'Plaques de cabinet',
    titre: 'Plaques de cabinet et de façade gravées',
    seoTitle: 'Plaques de cabinet et de façade gravées',
    description:
      'Plaques professionnelles gravées pour cabinets et commerces : laiton, inox, plexiglass découpé, acrylique bicouche, et badges personnalisés.',
    intro:
      'Une plaque de façade se choisit par son exposition avant de se choisir par son style : un laiton gravé et une plaque d’acrylique bicouche ne vieillissent pas de la même façon en plein sud. Nous demandons donc toujours où elle sera posée, et à quelle orientation, avant de proposer une matière.',
    pieces: [
      'plaques-professionnelles-gravees-multi-finitions',
      'plaque-professionnelle-metal-brosse-entreprise',
      'plaque-professionnelle-avocat-exterieure-beaune-gravure',
      'badge-professionnel-grave-personnalise',
    ],
  },
  {
    slug: 'reperage-et-numerotation',
    categorie: 'plaques',
    nom: 'Repérage et numérotation',
    titre: 'Repérage couleur, numéros de porte et signalétique',
    seoTitle: 'Repérage couleur, numéros de porte et étiquettes',
    description:
      'Repérage et numérotation gravés : étiquettes en acrylique bicouche dans 49 coloris, numéros de porte découpés et séries de plaques cohérentes.',
    intro:
      'Sur stratifié gravable, le laser enlève la couche de surface et révèle la couleur du cœur : le texte est la matière, il ne peut donc ni pâlir ni s’effacer. Quarante-neuf coloris disponibles, dont les combinaisons normalisées du repérage — noir sur jaune, blanc sur rouge, blanc sur bleu. Dos adhésif ou perçage, selon le support de pose. Le même travail de série vaut pour la signalétique intérieure d’un hôtel ou d’une maison d’hôtes : les plaques de porte doivent rester identiques d’une chambre à l’autre, des années après la pose.',
    pieces: [
      'plaques-porte-hotel-gravees-appellations-pictogrammes',
      'plaques-plexiglass-bicouche-reperes-couleur',
      'decoupe-plexiglass-plaque-numero-porte',
      'gravure-laser-plaques-vigneron-serie-atelier',
    ],
  },
];

/**
 * Sous-galeries validées contre le catalogue.
 *
 * Le contrôle est délibérément intransigeant, et il échoue le build : une
 * galerie qui renvoie vers une pièce absente afficherait une page à trous, et
 * une pièce rangée sous la mauvaise catégorie casserait le fil d'Ariane.
 */
export const sousGaleriesVerifiees: SousGalerie[] = (() => {
  const vues = new Map<string, string>();
  for (const galerie of SOUS_GALERIES) {
    if (galerie.pieces.length < 3) {
      throw new Error(
        `Sous-galerie « ${galerie.slug} » : ${galerie.pieces.length} pièce(s), trois au minimum.`,
      );
    }
    for (const id of galerie.pieces) {
      const piece = realisations.find((r) => r.id === id);
      if (!piece) {
        throw new Error(`Sous-galerie « ${galerie.slug} » : pièce introuvable — ${id}.`);
      }
      if (piece.categorie !== galerie.categorie) {
        throw new Error(
          `Sous-galerie « ${galerie.slug} » : la pièce ${id} est en catégorie « ${piece.categorie} ».`,
        );
      }
      const deja = vues.get(id);
      if (deja) {
        throw new Error(`Pièce ${id} présente dans « ${deja} » et « ${galerie.slug} ».`);
      }
      vues.set(id, galerie.slug);
    }
  }
  return SOUS_GALERIES;
})();

/** Sous-galeries d'une catégorie, dans l'ordre de déclaration. */
export function sousGaleriesDe(categorie: CategorieSlug): SousGalerie[] {
  return sousGaleriesVerifiees.filter((g) => g.categorie === categorie);
}
