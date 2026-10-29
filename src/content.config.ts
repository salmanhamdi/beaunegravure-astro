import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Savoir-faire. Le corps Markdown porte la partie rédactionnelle longue ;
 * le frontmatter porte tout ce qui est structuré (SEO, points clés, FAQ).
 */
const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    titre: z.string(),
    h1: z.string(),
    seoTitle: z.string().max(65),
    description: z.string().min(110).max(165),
    surtitre: z.string(),
    chapo: z.string(),
    /** Ordre d'affichage dans le hub et la navigation. */
    ordre: z.number().int(),
    /**
     * Nature du savoir-faire : ce qui se conçoit, ce qui se fabrique,
     * ce qui en résulte. Structure la page des savoir-faire.
     */
    famille: z.enum(['creation', 'fabrication', 'application']),
    /** Catégorie du catalogue de réalisations utilisée pour la galerie. */
    galerie: z.enum(['verre', 'bois', 'objets', 'metal', 'plaques', 'decoupe']),
    /**
     * Pièces de la galerie, choisies une à une, quand la catégorie ne suffit
     * pas. Un savoir-faire se définit par un procédé, pas par une matière :
     * l'impression UV se pose aussi bien sur un panneau de bois que sur un
     * chevalet de comptoir ou une étiquette de plexiglass, et la galerie par
     * catégorie n'en montrait qu'une seule des trois. Absent, la galerie reste
     * celle de `galerie` — c'est le cas des neuf autres savoir-faire.
     */
    pieces: z.array(z.string()).min(3).max(6).optional(),
    /** Titre et chapô de la galerie, quand `pieces` la détache d'une catégorie. */
    galerieTitre: z.string().optional(),
    galerieChapo: z.string().optional(),
    /** Identifiant de la réalisation servant de visuel principal. */
    visuel: z.string(),
    /** Quatre repères courts affichés en liste. */
    points: z.array(z.string()).min(3).max(6),
    /** Phrase décrivant les usages typiques. */
    usages: z.string(),
    faq: z
      .array(z.object({ question: z.string(), reponse: z.string() }))
      .default([]),
    /**
     * Ce qui détermine le prix et le délai, juste avant la demande de devis.
     *
     * Le champ est obligatoire : c'est la dernière question que se pose un
     * prospect, et aucune page ne doit y échapper. Il ne contient volontairement
     * AUCUN montant ni AUCUNE durée — l'atelier chiffre au projet, et un chiffre
     * inventé serait pire que pas de chiffre. Seuls les facteurs sont listés.
     *
     * `lien` est facultatif et diffère d'une page à l'autre : l'article de fond
     * sur le prix là où il éclaire vraiment, la page du studio là où la question
     * suivante est « à qui ai-je affaire ? ». Aucune page ne porte les deux.
     */
    reperes: z.object({
      facteurs: z.array(z.string()).min(3).max(6),
      note: z.string(),
      lien: z.object({ href: z.string(), libelle: z.string() }).optional(),
    }),
  }),
});

/**
 * Secteurs d'intervention.
 *
 * Une page par secteur réellement servi, et uniquement par secteur
 * réellement servi. Ces pages répondent à une question que le client se
 * pose vraiment — « vous êtes à Ladoix, est-ce que vous me livrez ? » —
 * et non à une requête qu'on espère capter.
 *
 * LE SCHÉMA EST LE GARDE-FOU. Les trois champs `delai`, `pieces` et
 * `references` sont obligatoires et minorés : une page de secteur sans
 * délai réel, sans pièce réellement livrée et sans référence nommable ne
 * compile pas. C'est délibéré. Des pages de ville générées à partir d'un
 * gabarit, où seul le nom de la commune change, relèvent de ce que Google
 * nomme « pages satellites » et « abus de contenu à grande échelle » : la
 * sanction est rétroactive et frappe le domaine entier. Le seul rempart
 * fiable contre cette dérive est de la rendre impossible à committer.
 *
 * Corollaire : on ne contourne pas ces minimums en remplissant les champs
 * de généralités. Une page qui ne peut pas les honorer ne se fait pas.
 */
const zones = defineCollection({
  loader: glob({ base: './src/content/zones', pattern: '**/*.md' }),
  schema: z.object({
    /** Nom d'usage de la commune ou du secteur, tel qu'on le dit. */
    ville: z.string(),
    /** Département en toutes lettres, et son numéro pour l'affichage. */
    departement: z.string(),
    departementNumero: z.string().regex(/^\d{2,3}$/),
    seoTitle: z.string().max(65),
    description: z.string().min(110).max(165),
    h1: z.string(),
    chapo: z.string(),
    /** Ordre d'affichage sur la page mère : du plus proche au plus loin. */
    ordre: z.number().int(),
    /** Distance routière depuis l'atelier, en kilomètres. Jamais arrondie à la hausse. */
    distanceKm: z.number().int().positive(),
    /**
     * Ce qui est réellement proposé sur ce secteur. Aucune valeur par
     * défaut : le mode de remise change d'un secteur à l'autre et doit
     * être tranché page par page.
     */
    remise: z
      .array(z.enum(['atelier', 'livraison', 'expedition']))
      .min(1),
    /** Délai constaté sur ce secteur, formulé sans promesse chiffrée fausse. */
    delai: z.string().min(20),
    /**
     * Identifiants de réalisations réellement livrées sur ce secteur.
     * Vérifiés contre le catalogue à la construction : un identifiant
     * inconnu fait échouer le build.
     */
    pieces: z.array(z.string()).min(2).max(6),
    /**
     * Références clientes de ce secteur, nommées ou décrites.
     * « Un domaine de la Côte de Nuits » est recevable ; « nos nombreux
     * clients » ne l'est pas, d'où la longueur minimale.
     */
    references: z.array(z.string().min(12)).min(1),
    /** Ce que ce secteur demande en propre : filières, matières, usages. */
    specificites: z.array(z.string()).min(2).max(5),
    faq: z
      .array(z.object({ question: z.string(), reponse: z.string() }))
      .default([]),
  }),
});

/**
 * Journal de l'atelier. Contenu éditorial long, en Markdown.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    titre: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    chapo: z.string(),
    categorie: z.enum([
      'verre-grave',
      'domaines-viticoles',
      'mariage-evenement',
      'plaques-signaletique',
      'cadeaux-entreprise',
      'fichiers-et-bat',
      'guides-atelier',
    ]),
    datePublication: z.coerce.date(),
    dateModification: z.coerce.date(),
    auteur: z.string().default('L’atelier Beaune Gravure'),
    /** Nom de fichier dans src/assets/images/blog/. */
    couverture: z.string(),
    couvertureAlt: z.string(),
    /** Points essentiels affichés en encadré au-dessus de l'article. */
    aRetenir: z.array(z.string()).default([]),
    /** Repères pratiques présentés sous forme de tableau. */
    reperes: z
      .array(z.object({ label: z.string(), valeur: z.string() }))
      .default([]),
    faq: z
      .array(z.object({ question: z.string(), reponse: z.string() }))
      .default([]),
    /** Pages internes liées, pour le maillage. */
    liens: z
      .array(z.object({ href: z.string(), label: z.string() }))
      .default([]),
    tempsLecture: z.string(),
    pilier: z.boolean().default(false),
  }),
});

export const collections = { services, zones, blog };
