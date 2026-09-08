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
    /** Catégorie du catalogue de réalisations utilisée pour la galerie. */
    galerie: z.enum(['verre', 'bois', 'objets', 'metal', 'plaques', 'decoupe']),
    /** Identifiant de la réalisation servant de visuel principal. */
    visuel: z.string(),
    /** Quatre repères courts affichés en liste. */
    points: z.array(z.string()).min(3).max(6),
    /** Phrase décrivant les usages typiques. */
    usages: z.string(),
    faq: z
      .array(z.object({ question: z.string(), reponse: z.string() }))
      .default([]),
    /** Mise en avant sur la page d'accueil. */
    vedette: z.boolean().default(false),
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
