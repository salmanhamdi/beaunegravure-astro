# Beaune Gravure — site Astro

Site vitrine de **Beaune Gravure**, atelier de gravure laser sur verre à
Ladoix-Serrigny, près de Beaune (Côte-d'Or).

Reconstruction complète en [Astro](https://astro.build), **static-first** :
aucune base de données, aucun runtime serveur, aucune dépendance WordPress.

- **Production visée** : <https://beaunegravure.fr> *(le DNS pointe encore sur Wix)*
- **Préproduction** : <https://dimgrey-caribou-115686.hostingersite.com>

---

## Sommaire

- [Démarrage](#démarrage)
- [Commandes](#commandes)
- [Architecture](#architecture)
- [Contenu](#contenu)
- [Images](#images)
- [Typographie](#typographie)
- [Formulaire de devis](#formulaire-de-devis)
- [Environnements et indexation](#environnements-et-indexation)
- [Déploiement](#déploiement)
- [Contrôle qualité](#contrôle-qualité)
- [Données à compléter](#données-à-compléter)

---

## Démarrage

Node 20.3 ou supérieur.

```bash
npm install
npm run dev
```

Le site est servi sur <http://localhost:4321>.

---

## Commandes

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run check` | Vérification TypeScript et Astro |
| `npm run build` | `astro check` puis build de production dans `dist/` |
| `npm run build:staging` | Build pour la préproduction Hostinger (noindex global) |
| `npm run build:prod` | Build pour `beaunegravure.fr` (indexable, sitemap) |
| `npm run preview` | Sert `dist/` localement |
| `node scripts/verifier.mjs` | Contrôle du site généré : liens, SEO, titres, images, JSON-LD |

Deux scripts d'import ponctuels documentent la reprise depuis l'ancien site
WordPress. Ils ne sont pas exécutés au build :

```bash
node scripts/import-assets.mjs <chemin-du-depot-wordpress>
node scripts/import-blog.mjs   <chemin-du-depot-wordpress>
```

---

## Architecture

```
src/
├── assets/images/        Sources d'images, optimisées au build par astro:assets
│   ├── realisations/       74 photographies de pièces réelles
│   ├── atelier/            3 photographies d'atelier
│   ├── blog/               5 visuels de couverture
│   └── brand/              logo, monogramme, favicon
├── components/           Composants Astro, aucun framework tiers
├── content/              Contenu éditorial (Content Collections)
│   ├── services/           9 fichiers Markdown, un par savoir-faire
│   └── blog/               9 articles Markdown
├── data/                 Données typées : site, réalisations, catégories
├── layouts/              Gabarit unique
├── pages/                Routes
├── styles/               Jetons, fondations, composants partagés
└── utils/                Environnement et données structurées

public/
├── api/contact.php       Unique point d'entrée dynamique (formulaire)
├── .htaccess             En-têtes de sécurité, cache, URL canoniques
└── favicon, manifeste, image de partage
```

**Principes retenus**

- Aucune île interactive : le site ne charge que ~3 Ko de JavaScript
  (menu mobile et soumission du formulaire), toujours en amélioration
  progressive — tout fonctionne sans JavaScript.
- Le contenu éditorial vit en Markdown, pas dans du PHP ni dans la base de
  données : il se relit et se corrige dans un éditeur de texte.
- Une seule source de vérité pour les coordonnées : `src/data/site.ts`.
- Les révélations au défilement sont en CSS pur (`animation-timeline: view()`),
  avec le contenu visible par défaut si le navigateur ne les gère pas.

---

## Contenu

### Savoir-faire — `src/content/services/`

Un fichier Markdown par page. Le frontmatter porte le SEO, les points clés, la
galerie associée et la FAQ ; le corps porte la rédaction longue. Le schéma est
validé au build par Zod (`src/content.config.ts`), ce qui interdit par exemple
une méta-description hors des bornes 110–165 caractères.

### Journal — `src/content/blog/`

Neuf articles repris de l'ancien site, après tri éditorial :

- les 10 articles de moins de 175 mots, largement redondants avec les guides,
  ont été écartés ;
- les slugs de catégorie accentués (`guides-matériaux`, `signalétique`,
  `mariage-événement`) qui produisaient des pages vides ont été normalisés ;
- environ 80 accents manquants et une coquille ont été corrigés ;
- les sections promotionnelles vers les marques tierces ont été retirées.

Les pages de catégorie ne sont générées **que pour les catégories contenant au
moins un article** : aucune page vide ne peut réapparaître.

### Réalisations — `src/data/realisations.ts`

74 entrées typées, chacune reliée à une photographie réelle, avec texte
alternatif descriptif, légende, catégorie et savoir-faire associé.

---

## Images

`astro:assets` génère pour chaque visuel des variantes **AVIF** avec repli
**WebP**, en trois à quatre largeurs, avec `srcset`, `sizes` et dimensions
explicites — donc aucun décalage de mise en page.

Seules les images réellement utilisées sont présentes dans `src/`. Les visuels
de synthèse et les doublons de l'ancien site ont été écartés : voir la constante
`EXCLUS` de `scripts/import-assets.mjs`, qui documente chaque exclusion.

---

## Typographie

Deux familles, auto-hébergées, **sous-ensemble latin uniquement** :

- **Newsreader** (variable) — titres et accentuations éditoriales ;
- **IBM Plex Sans** (variable) — texte courant et interface.

Trois fichiers `woff2` au total (~168 Ko), déclarés dans
`src/components/Polices.astro`, dont deux préchargés. Aucune requête vers un
serveur tiers : c'est aussi ce qui permet de se passer de bandeau cookies.

---

## Formulaire de devis

Le site est statique ; le formulaire poste vers `public/api/contact.php`, seul
fichier dynamique, exécuté par PHP sur l'hébergement Hostinger.

**Garantie principale : aucune demande n'est perdue silencieusement.** Chaque
soumission valide est écrite sur disque *avant* toute tentative d'envoi. Si
`mail()` échoue, le visiteur reçoit un message explicite avec les coordonnées
directes, et la demande reste consultable dans le journal.

Protections : contrôle d'origine, pot de miel, piège temporel (3 s), limitation
à 5 envois par heure et par IP, assainissement de toutes les entrées,
neutralisation des injections d'en-tête.

### Configuration serveur

```bash
cd public_html/api
cp config.example.php config.php
# éditer config.php : destinataire, expéditeur, origines autorisées
```

`config.php` n'est jamais versionné. **Aucune clé secrète n'est nécessaire.**

Le journal est écrit dans `api/.data/`, protégé par un `.htaccess` généré
automatiquement. Pour une sécurité maximale, placer ce répertoire hors de
`public_html` via l'option `repertoire_data`.

> Configurer **SPF et DKIM** sur le domaine depuis le hPanel Hostinger : sans
> cela, les messages partiront probablement en indésirables.

---

## Environnements et indexation

L'URL du site est fournie au build par la variable `SITE_URL`. Elle détermine le
`canonical`, le `sitemap` et **l'indexabilité** :

| Environnement | `SITE_URL` | `robots` | `sitemap.xml` |
| --- | --- | --- | --- |
| Préproduction | `https://dimgrey-caribou-115686.hostingersite.com` | `noindex, nofollow` | non généré |
| Production | `https://beaunegravure.fr` | `index, follow` | généré |

La bascule est automatique : `src/utils/env.ts` ne considère comme indexable que
le domaine `beaunegravure.fr`. Aucune modification de code n'est requise le jour
du basculement DNS — il suffit de lancer `npm run build:prod`.

---

## Déploiement

Voir **[DEPLOIEMENT.md](DEPLOIEMENT.md)** pour la procédure détaillée.

En résumé :

```bash
npm run build:staging   # ou build:prod
# téléverser le contenu de dist/ dans public_html/
```

Le site ne requiert **aucun runtime Node.js** en production.

---

## Contrôle qualité

```bash
npm run build
node scripts/verifier.mjs
```

Le contrôleur analyse `dist/` et échoue si une erreur est détectée :

- liens internes cassés, liens sans intitulé accessible ;
- `title`, `description`, `canonical`, `robots`, `og:image` manquants ou dupliqués ;
- absence de `h1`, `h1` multiples, sauts de niveau de titre ;
- images sans `alt` ou sans dimensions ;
- JSON-LD invalide, ou données d'avis alors que le site n'en publie aucun ;
- référence à `localhost`, texte de remplissage, marqueur `TODO`.

---

## Données à compléter

Certaines mentions légales obligatoires n'ont pas pu être vérifiées et sont
donc **volontairement absentes plutôt qu'inventées**. Elles apparaissent en rouge
sur `/mentions-legales/` tant qu'elles ne sont pas renseignées dans
`src/data/site.ts` :

- nom du directeur de la publication ;
- numéro SIRET ;
- immatriculation RCS ;
- capital social ;
- numéro de TVA intracommunautaire ;
- horaires d'ouverture ;
- confirmation que le 07 66 22 50 62 est la ligne principale et non uniquement
  WhatsApp ;
- confirmation que `contact@beaunegravure.fr` est actif et relevé.

La liste est également exportée par `donneesManquantes` dans `src/data/site.ts`.
