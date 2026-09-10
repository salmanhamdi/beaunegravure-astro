/**
 * Assistant de qualification — le graphe et les réponses.
 *
 * AUCUNE INTELLIGENCE ARTIFICIELLE, ET C'EST UN CHOIX. Chaque phrase affichée
 * est écrite ici, à la main, et relue. L'assistant ne peut donc rien inventer
 * sur un prix, un délai, une matière ou une faisabilité — quatre sujets où une
 * phrase approximative coûte une commande, et parfois la confiance.
 *
 * LA VÉRITÉ TECHNIQUE PASSE AVANT LA FLUIDITÉ COMMERCIALE. La page Le studio
 * énonce que la Speedy 400 ne découpe ni le verre ni le métal : le verre se
 * grave, le métal se marque au laser fibre. Un entonnoir qui enchaînerait
 * « Découpe » puis « Verre » sans broncher promettrait donc l'inverse de ce que
 * le site affirme deux écrans plus loin. Ces deux croisements ont leur propre
 * réponse, écrite, qui explique la distinction au lieu de la masquer. Ils
 * restent proposés : quelqu'un qui cherche à faire découper du verre mérite une
 * réponse, pas une option absente.
 *
 * CE FICHIER NE TOUCHE JAMAIS AU DOM. Il ne contient que des données typées,
 * pour qu'on puisse ajouter une matière, une branche ou une question sans
 * ouvrir le composant — et pour qu'une relecture éditoriale se fasse ici, d'un
 * seul tenant.
 *
 * LE RÉSUMÉ EST CONSTRUIT À PARTIR DE `resume`. Chaque option porte le fragment
 * de phrase qu'elle apportera au message WhatsApp et au formulaire de devis :
 * « une gravure laser », « sur métal », « en petite série ». Les fragments se
 * recollent dans l'ordre du parcours. Aucune donnée personnelle n'y entre.
 */

/** Étapes du parcours. Un identifiant absent d'ici ne peut pas être atteint. */
export type IdEtape =
  | 'savoir-faire'
  | 'matiere-gravure'
  | 'matiere-decoupe'
  | 'matiere-uv'
  | 'matiere-indecis'
  | 'decoupe-verre'
  | 'decoupe-metal'
  | 'quantite'
  | 'fichier'
  | 'delai'
  | 'sortie';

/** Ce qu'une option retient du choix, pour le résumé final. */
export type Champ = 'savoirFaire' | 'matiere' | 'quantite' | 'fichier' | 'delai';

export interface Option {
  /** Libellé du bouton. */
  readonly libelle: string;
  /** Étape suivante. */
  readonly vers: IdEtape;
  /** Champ renseigné par ce choix. */
  readonly champ?: Champ;
  /** Fragment repris dans le résumé, par exemple « sur métal ». */
  readonly resume?: string;
  /**
   * Fragments d'AUTRES champs que ce choix corrige.
   *
   * Sans cela, un visiteur venu par « Découpe » puis réorienté vers la gravure
   * gardait « une découpe laser » en tête de résumé : le message WhatsApp
   * annonçait alors « une découpe laser sur verre », c'est-à-dire précisément
   * ce que l'écran venait d'expliquer être impossible. Une réorientation doit
   * réécrire ce qu'elle réoriente.
   */
  readonly corrige?: Partial<Record<Champ, string>>;
  /** Valeur transmise au champ « Type de projet » du formulaire de devis. */
  readonly projet?: string;
}

export interface Etape {
  readonly id: IdEtape;
  /** Question posée. Vide pour les écrans qui ne font qu'expliquer. */
  readonly question: string;
  /** Paragraphes affichés avant les options. Texte brut, jamais de HTML. */
  readonly texte?: readonly string[];
  readonly options: readonly Option[];
}

export interface QuestionFaq {
  readonly q: string;
  /** Réponse en paragraphes. Chaque phrase doit être vérifiable sur le site. */
  readonly r: readonly string[];
}

/* -------------------------------------------------------------------------- */
/*  Le graphe                                                                  */
/* -------------------------------------------------------------------------- */

export const etapes: readonly Etape[] = [
  {
    id: 'savoir-faire',
    question: 'Que souhaitez-vous réaliser ?',
    options: [
      {
        libelle: 'Gravure laser',
        vers: 'matiere-gravure',
        champ: 'savoirFaire',
        resume: 'une gravure laser',
        projet: 'Gravure laser',
      },
      {
        libelle: 'Découpe laser',
        vers: 'matiere-decoupe',
        champ: 'savoirFaire',
        resume: 'une découpe laser',
        projet: 'Découpe laser',
      },
      {
        libelle: 'Impression UV',
        vers: 'matiere-uv',
        champ: 'savoirFaire',
        resume: 'une impression UV',
        projet: 'Impression UV',
      },
      {
        // La création graphique ne dépend pas de la matière : on demande donc
        // d'abord ce qui existe déjà, ce qui est la vraie question ici.
        libelle: 'Création graphique',
        vers: 'fichier',
        champ: 'savoirFaire',
        resume: 'une création graphique',
        projet: 'Création graphique',
      },
      {
        libelle: 'Je ne sais pas encore',
        vers: 'matiere-indecis',
        champ: 'savoirFaire',
        resume: 'un projet à définir',
      },
    ],
  },

  {
    id: 'matiere-gravure',
    question: 'Sur quelle matière ?',
    options: [
      { libelle: 'Verre et cristal', vers: 'quantite', champ: 'matiere', resume: 'sur verre' },
      { libelle: 'Bois et coffrets', vers: 'quantite', champ: 'matiere', resume: 'sur bois' },
      { libelle: 'Métal et industrie', vers: 'quantite', champ: 'matiere', resume: 'sur métal' },
      { libelle: 'Plaques et signalétique', vers: 'quantite', champ: 'matiere', resume: 'sur plaque' },
      { libelle: 'Plexiglas', vers: 'quantite', champ: 'matiere', resume: 'sur plexiglas' },
      { libelle: 'Cuir', vers: 'quantite', champ: 'matiere', resume: 'sur cuir' },
      { libelle: 'Objets et cadeaux', vers: 'quantite', champ: 'matiere', resume: 'sur objet' },
      { libelle: 'Autre matière', vers: 'quantite', champ: 'matiere', resume: '' },
    ],
  },

  {
    id: 'matiere-decoupe',
    question: 'Quelle matière découper ?',
    options: [
      { libelle: 'Bois', vers: 'quantite', champ: 'matiere', resume: 'dans le bois' },
      { libelle: 'Plexiglas', vers: 'quantite', champ: 'matiere', resume: 'dans le plexiglas' },
      { libelle: 'Cuir', vers: 'quantite', champ: 'matiere', resume: 'dans le cuir' },
      { libelle: 'Papier et carton', vers: 'quantite', champ: 'matiere', resume: 'dans le papier' },
      { libelle: 'Textile', vers: 'quantite', champ: 'matiere', resume: 'dans le textile' },
      // Proposés volontairement : la réponse vaut mieux que l'option absente.
      { libelle: 'Verre', vers: 'decoupe-verre' },
      { libelle: 'Métal', vers: 'decoupe-metal' },
      { libelle: 'Autre matière', vers: 'quantite', champ: 'matiere', resume: '' },
    ],
  },

  {
    id: 'matiere-uv',
    question: 'Sur quel support ?',
    options: [
      { libelle: 'Bois et coffrets', vers: 'quantite', champ: 'matiere', resume: 'sur bois' },
      { libelle: 'Plexiglas', vers: 'quantite', champ: 'matiere', resume: 'sur plexiglas' },
      { libelle: 'Plaques et signalétique', vers: 'quantite', champ: 'matiere', resume: 'sur plaque' },
      { libelle: 'Objets et cadeaux', vers: 'quantite', champ: 'matiere', resume: 'sur objet' },
      { libelle: 'Autre support', vers: 'quantite', champ: 'matiere', resume: '' },
    ],
  },

  {
    id: 'matiere-indecis',
    question: 'Sur quelle matière travaillez-vous ?',
    texte: [
      'Dites-nous la matière : nous vous orienterons vers le bon procédé.',
    ],
    options: [
      { libelle: 'Verre et cristal', vers: 'quantite', champ: 'matiere', resume: 'sur verre' },
      { libelle: 'Bois et coffrets', vers: 'quantite', champ: 'matiere', resume: 'sur bois' },
      { libelle: 'Métal et industrie', vers: 'quantite', champ: 'matiere', resume: 'sur métal' },
      { libelle: 'Plaques et signalétique', vers: 'quantite', champ: 'matiere', resume: 'sur plaque' },
      { libelle: 'Plexiglas', vers: 'quantite', champ: 'matiere', resume: 'sur plexiglas' },
      { libelle: 'Objets et cadeaux', vers: 'quantite', champ: 'matiere', resume: 'sur objet' },
      { libelle: 'Je ne sais pas encore', vers: 'quantite' },
    ],
  },

  /* ---- Les deux croisements que le site interdit d'annoncer autrement ---- */

  {
    id: 'decoupe-verre',
    question: 'Le verre se grave, il ne se découpe pas.',
    texte: [
      'Notre découpe laser traite les matières non métalliques : bois, plexiglas, cuir, papier, textile.',
      'Le verre, lui, se grave — logos, textes, jauges, motifs. C’est un savoir-faire que nous pratiquons couramment.',
    ],
    options: [
      {
        libelle: 'Alors une gravure sur verre',
        vers: 'quantite',
        champ: 'matiere',
        resume: 'sur verre',
        corrige: { savoirFaire: 'une gravure laser' },
        projet: 'Gravure laser',
      },
      { libelle: 'Voir les autres matières', vers: 'matiere-decoupe' },
      { libelle: 'En parler avec vous', vers: 'sortie' },
    ],
  },

  {
    id: 'decoupe-metal',
    question: 'Le métal se marque, nous ne le découpons pas.',
    texte: [
      'Notre laser fibre marque et grave les métaux en profondeur : pièces techniques, plaques, outillage, numéros de série.',
      'La découpe du métal, elle, n’est pas un procédé de l’atelier.',
    ],
    options: [
      {
        libelle: 'Alors un marquage métal',
        vers: 'quantite',
        champ: 'matiere',
        resume: 'sur métal',
        corrige: { savoirFaire: 'un marquage laser' },
        projet: 'Gravure laser',
      },
      { libelle: 'Voir les autres matières', vers: 'matiere-decoupe' },
      { libelle: 'En parler avec vous', vers: 'sortie' },
    ],
  },

  /* ------------------------------ Suite ---------------------------------- */

  {
    id: 'quantite',
    question: 'Combien de pièces, à peu près ?',
    options: [
      { libelle: '1 pièce', vers: 'fichier', champ: 'quantite', resume: 'en pièce unique' },
      { libelle: 'Petite série', vers: 'fichier', champ: 'quantite', resume: 'en petite série' },
      { libelle: 'Grande série', vers: 'fichier', champ: 'quantite', resume: 'en grande série' },
      { libelle: 'Pas encore défini', vers: 'fichier', champ: 'quantite' },
    ],
  },

  {
    id: 'fichier',
    question: 'Vous avez déjà un fichier ou un visuel ?',
    options: [
      { libelle: 'Oui', vers: 'delai', champ: 'fichier', resume: '(fichier disponible)' },
      { libelle: 'Non', vers: 'delai', champ: 'fichier' },
      {
        /*
          Pas de `projet` ici, et c'est délibéré. Ce choix décrit un besoin
          ANNEXE : quelqu'un qui veut marquer du métal et n'a pas de visuel
          demande d'abord un marquage. Poser « Création graphique » comme type
          de projet écrasait le savoir-faire choisi deux écrans plus tôt, et
          l'atelier recevait une demande de création pour un travail de
          marquage. Le besoin est porté par le résumé, où il appartient.
        */
        libelle: 'J’ai besoin d’aide pour le créer',
        vers: 'delai',
        champ: 'fichier',
        resume: '(création graphique à prévoir)',
      },
    ],
  },

  {
    id: 'delai',
    question: 'Quand souhaitez-vous le réaliser ?',
    options: [
      { libelle: 'Dès que possible', vers: 'sortie', champ: 'delai', resume: 'dès que possible' },
      { libelle: 'Dans les prochaines semaines', vers: 'sortie', champ: 'delai', resume: '' },
      { libelle: 'Pas encore défini', vers: 'sortie', champ: 'delai' },
    ],
  },

  {
    id: 'sortie',
    question: '',
    options: [],
  },
];

/* -------------------------------------------------------------------------- */
/*  Textes de l'interface                                                      */
/* -------------------------------------------------------------------------- */

export const textes = {
  /**
   * Libellé du bouton fermé.
   *
   * Il ne porte PAS d'`aria-label` : le nom accessible est ce libellé même.
   * Un « Ouvrir l'assistant » posé par-dessus remplacerait le texte visible par
   * un intitulé qui ne le contient pas, ce qui échoue au critère WCAG 2.5.3
   * « Label in Name » — quelqu'un qui dicte « préciser mon projet » ne
   * cliquerait rien. L'état, lui, se lit dans `aria-expanded`.
   */
  bulle: 'Préciser mon projet',
  fermer: 'Fermer l’assistant',
  titre: 'Assistant',
  accroche: 'Précisons votre projet en quelques questions.',
  demarrer: 'Préciser mon projet',
  faqTitre: 'Questions fréquentes',
  retour: 'Retour',
  recommencer: 'Recommencer',
  /* Écran final. */
  sortieTitre: 'Voilà qui est clair.',
  sortieSansReponse: 'Dites-nous en deux lignes ce que vous avez en tête.',
  devis: 'Demander un devis',
  whatsapp: 'Parler sur WhatsApp',
  /*
    La phrase que l'assistant prononce quand il ne sait pas. Elle est ici, et
    non dispersée dans le code, pour qu'on la relise comme une promesse.
  */
  incertitude:
    'Ce point dépend de votre projet. Envoyez-nous votre fichier ou vos mesures : nous confirmerons la faisabilité avant tout engagement.',
} as const;

/* -------------------------------------------------------------------------- */
/*  FAQ — sept réponses, toutes vérifiables sur le site                        */
/* -------------------------------------------------------------------------- */

export const faq: readonly QuestionFaq[] = [
  {
    q: 'Que pouvez-vous graver ?',
    r: [
      'Logos, monogrammes, blasons, textes, numéros de série, QR codes et motifs décoratifs.',
      'La gravure laser marque la matière elle-même : rien n’est déposé en surface.',
    ],
  },
  {
    q: 'Quelles matières travaillez-vous ?',
    r: [
      'Verre et cristal, bois et coffrets, métal, plaques et signalétique, plexiglas, cuir, et une large gamme d’objets.',
      'Chaque famille de matière demande une longueur d’onde différente, ou une encre : c’est pourquoi l’atelier réunit quatre machines.',
    ],
  },
  {
    q: 'Faites-vous des pièces uniques ?',
    r: [
      'Oui. Une pièce unique est traitée avec le même soin qu’une série.',
    ],
  },
  {
    q: 'Faites-vous des petites et grandes séries ?',
    r: [
      'Oui, de l’exemplaire unique à la série répétable.',
      'Les séries à données variables — numéros, prénoms, codes — font partie du quotidien de l’atelier.',
    ],
  },
  {
    q: 'Quels fichiers puis-je envoyer ?',
    r: [
      'Un fichier vectoriel est préférable : PDF, SVG, AI ou EPS. Pour un logo ou une découpe, c’est ce qui donne le tracé le plus net.',
      'En cas de doute, envoyez ce que vous avez : nous vous dirons ce qui est exploitable.',
    ],
  },
  {
    q: 'Pouvez-vous créer ou modifier mon visuel ?',
    r: [
      'Oui. Nous dessinons, redessinons, composons et adaptons le visuel jusqu’à ce qu’il tienne sur la matière choisie.',
      'C’est un savoir-faire à part entière, et le point de départ de beaucoup de projets.',
    ],
  },
  {
    q: 'Comment demander un devis ?',
    r: [
      'Par le formulaire de devis, en décrivant votre projet. Chaque projet est chiffré sur mesure.',
      'Nous revenons vers vous avec un prix et un délai fermes.',
    ],
  },
];
