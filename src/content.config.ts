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

export const collections = { services, blog };
