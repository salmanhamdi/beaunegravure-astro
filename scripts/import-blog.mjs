/**
 * Import ponctuel du journal depuis l'ancien dépôt WordPress.
 *
 * Décisions éditoriales appliquées ici :
 *  - seuls les 9 articles réellement substantiels sont repris ; les 10 articles
 *    de moins de 175 mots, largement redondants avec les guides, sont écartés ;
 *  - les slugs de catégorie accentués de l'ancien JSON sont normalisés ;
 *  - les accents manquants et les coquilles du contenu généré sont corrigés ;
 *  - les sections et liens promotionnels vers les marques tierces
 *    (glassora.fr, spotitap.com) sont retirés.
 *
 * Ce script n'est pas exécuté au build : il documente et permet de rejouer la
 * conversion. La source de vérité est désormais src/content/blog/*.md.
 *
 *   node scripts/import-blog.mjs "C:/chemin/vers/BG-clean-github"
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const source = process.argv[2];
if (!source) {
  console.error('Usage: node scripts/import-blog.mjs <chemin-du-depot-wordpress>');
  process.exit(1);
}

const jsonPath = path.join(source, 'wp-content/plugins/bg-custom/data/blog-data.json');
const destDir = path.join(process.cwd(), 'src/content/blog');

/** Articles conservés, avec leur nouvelle catégorie et leur couverture. */
const RETENUS = {
  'guide-gravure-laser': {
    categorie: 'guides-atelier',
    couverture: 'atelier-laser-uv-beaune-gravure-hero.webp',
    couvertureAlt: "Poste de marquage laser de l'atelier avec son ordinateur de préparation",
    pilier: true,
  },
  'guide-verres-graves-personnalises': {
    categorie: 'verre-grave',
    couverture: 'verre-grave-veuve-ambal-spritz-club.webp',
    couvertureAlt: 'Verre gravé en série pour une maison de vins effervescents',
    pilier: true,
  },
  'logo-sur-verre-gravure-ce-qui-marche': {
    categorie: 'verre-grave',
    couverture: 'verre-grave-veuve-ambal-spritz-club.webp',
    couvertureAlt: 'Verre gravé avec un logo, posé sur un plan de travail',
    pilier: false,
  },
  'combien-coute-gravure-laser-personnalisee-beaune': {
    categorie: 'guides-atelier',
    couverture: 'gravure-laser-bois-corton-grand-cru-beaune-gravure.webp',
    couvertureAlt: "Planche de bois gravée au laser avec le nom d'un grand cru",
    pilier: false,
  },
  'fichier-fournir-gravure-laser-propre': {
    categorie: 'fichiers-et-bat',
    couverture: 'atelier-laser-uv-beaune-gravure-hero.webp',
    couvertureAlt: "Fichier de gravure ouvert sur l'ordinateur de préparation de l'atelier",
    pilier: false,
  },
  'caisse-bois-gravee-domaine-viticole-usages-rendu': {
    categorie: 'domaines-viticoles',
    couverture: 'gravure-laser-bois-corton-grand-cru-beaune-gravure.webp',
    couvertureAlt: 'Gravure laser sur bois pour un domaine de la Côte de Beaune',
    pilier: false,
  },
  'cadeau-client-personnalise-idees-sobres-utiles': {
    categorie: 'cadeaux-entreprise',
    couverture: 'impression-uv-tonnelet-bois-beaune-malmedy-beaune-gravure.webp',
    couvertureAlt: "Objet en bois personnalisé en couleur pour un cadeau d'entreprise",
    pilier: false,
  },
  'guide-plaque-qr-code-nfc-avis-google': {
    categorie: 'plaques-signaletique',
    couverture: 'plaque-professionnelle-avocat-exterieure-beaune-gravure.webp',
    couvertureAlt: 'Plaque professionnelle gravée posée en façade',
    pilier: false,
  },
  'plaque-qr-code-avis-google-restaurant-emplacement': {
    categorie: 'plaques-signaletique',
    couverture: 'plaque-professionnelle-avocat-exterieure-beaune-gravure.webp',
    couvertureAlt: 'Plaque gravée destinée à un établissement recevant du public',
    pilier: false,
  },
};

/**
 * Accents et coquilles relevés dans le contenu WordPress d'origine.
 * Chaque entrée est un couple [mot sans accent, forme correcte].
 */
const MOTS = [
  ['reagit', 'réagit'], ['reagissent', 'réagissent'], ['reagir', 'réagir'],
  ['differemment', 'différemment'], ['differente', 'différente'],
  ['differentes', 'différentes'], ['differents', 'différents'], ['different', 'différent'],
  ['evenement', 'événement'], ['evenements', 'événements'],
  ['evenementiel', 'événementiel'], ['evenementielle', 'événementielle'],
  ['materiaux', 'matériaux'], ['materiau', 'matériau'],
  ['maniere', 'manière'], ['manieres', 'manières'],
  ['exterieur', 'extérieur'], ['exterieure', 'extérieure'], ['exterieures', 'extérieures'],
  ['interieur', 'intérieur'], ['interieure', 'intérieure'],
  ['decor', 'décor'], ['decors', 'décors'], ['decoratif', 'décoratif'], ['decorative', 'décorative'],
  ['detail', 'détail'], ['details', 'détails'],
  ['detaille', 'détaillé'], ['detaillee', 'détaillée'], ['detailles', 'détaillés'],
  ['decoupe', 'découpe'], ['decoupes', 'découpes'], ['decouper', 'découper'],
  ['element', 'élément'], ['elements', 'éléments'],
  ['elegant', 'élégant'], ['elegante', 'élégante'], ['elegance', 'élégance'],
  ['etape', 'étape'], ['etapes', 'étapes'],
  ['etiquette', 'étiquette'], ['etiquettes', 'étiquettes'],
  ['reference', 'référence'], ['references', 'références'],
  ['securite', 'sécurité'], ['memes', 'mêmes'],
  ['cuvee', 'cuvée'], ['cuvees', 'cuvées'],
  ['speciale', 'spéciale'], ['speciales', 'spéciales'], ['special', 'spécial'],
  ['frequent', 'fréquent'], ['frequente', 'fréquente'], ['frequentes', 'fréquentes'],
  ['preparent', 'préparent'], ['preparation', 'préparation'], ['preparer', 'préparer'],
  ['prepare', 'préparé'], ['preparee', 'préparée'],
  ['preferable', 'préférable'], ['prefere', 'préfère'],
  ['precis', 'précis'], ['precise', 'précise'], ['precision', 'précision'],
  ['gravee', 'gravée'], ['gravees', 'gravées'], ['graves', 'gravés'],
  ['personnalisee', 'personnalisée'], ['personnalisees', 'personnalisées'],
  ['dediee', 'dédiée'], ['dedie', 'dédié'],
  ['connectes', 'connectés'], ['connecte', 'connecté'],
  ['realise', 'réalisé'], ['realisee', 'réalisée'], ['realiser', 'réaliser'],
  ['qualite', 'qualité'], ['identite', 'identité'], ['lisibilite', 'lisibilité'],
  ['proprete', 'propreté'], ['durabilite', 'durabilité'], ['faisabilite', 'faisabilité'],
  ['serie', 'série'], ['series', 'séries'],
  ['modele', 'modèle'], ['modeles', 'modèles'],
  ['numero', 'numéro'], ['numeros', 'numéros'],
  ['donnees', 'données'], ['donnee', 'donnée'],
  ['matiere', 'matière'], ['matieres', 'matières'],
  ['interet', 'intérêt'], ['coherent', 'cohérent'], ['coherente', 'cohérente'],
  ['coherence', 'cohérence'],
  ['necessaire', 'nécessaire'], ['necessaires', 'nécessaires'],
  ['specifique', 'spécifique'], ['specifiques', 'spécifiques'],
  ['controle', 'contrôle'], ['controler', 'contrôler'],
  ['piece', 'pièce'], ['pieces', 'pièces'],
  ['resultat', 'résultat'], ['resultats', 'résultats'],
  ['annee', 'année'], ['annees', 'années'],
  ['delai', 'délai'], ['delais', 'délais'],
  ['lumiere', 'lumière'], ['satine', 'satiné'], ['satinee', 'satinée'],
  ['denaturer', 'dénaturer'], ['pres', 'près'],
  ['contraste', 'contrasté'], ['contrastes', 'contrastés'],
  ['degrade', 'dégradé'], ['degrades', 'dégradés'], ['degradés', 'dégradés'],
  ['interpretation', 'interprétation'],
  ['aligne', 'aligné'], ['alignee', 'alignée'], ['alignees', 'alignées'], ['alignes', 'alignés'],
  ['complementaire', 'complémentaire'], ['complementaires', 'complémentaires'],
  ['teste', 'testé'], ['testee', 'testée'], ['testes', 'testés'],
  ['apres', 'après'], ['tres', 'très'], ['deja', 'déjà'],
  ['cle', 'clé'], ['cles', 'clés'],
  ['generalement', 'généralement'], ['general', 'général'], ['generale', 'générale'],
  ['cree', 'crée'], ['creee', 'créée'], ['creer', 'créer'],
  ['facon', 'façon'], ['apercu', 'aperçu'], ['acces', 'accès'],
  ['probleme', 'problème'], ['problemes', 'problèmes'],
  ['completer', 'compléter'], ['complete', 'complète'], ['complet', 'complet'],
  ['repere', 'repère'], ['reperes', 'repères'], ['repereage', 'repérage'],
  ['fidele', 'fidèle'], ['fideles', 'fidèles'],
  ['regulier', 'régulier'], ['reguliere', 'régulière'], ['regulieres', 'régulières'],
  ['adaptee', 'adaptée'], ['adaptees', 'adaptées'], ['adapte', 'adapté'],
  ['souhaite', 'souhaité'], ['souhaitee', 'souhaitée'],
  ['dimensionnee', 'dimensionnée'], ['verifie', 'vérifié'], ['verifiee', 'vérifiée'],
  ['verification', 'vérification'], ['verifier', 'vérifier'],
  ['imprimee', 'imprimée'], ['imprime', 'imprimé'],
  ['utilisee', 'utilisée'], ['utilise', 'utilisé'],
  ['demande', 'demande'], ['ete', 'été'],
];

/** Coquilles littérales déjà présentes dans le contenu WordPress publié. */
const COQUILLES = [
  ['\u00e0utant', 'autant'],
];

const REMPLACEMENTS = MOTS.map(([sans, avec]) => [
  new RegExp(`\\b${sans}\\b`, 'g'),
  avec,
  new RegExp(`\\b${sans.charAt(0).toUpperCase()}${sans.slice(1)}\\b`, 'g'),
  avec.charAt(0).toUpperCase() + avec.slice(1),
]);

const APOSTROPHE = '\u2019';
const INSECABLE = '\u00a0';

/** Marques tierces : leurs sections promotionnelles ne sont pas reprises. */
const MARQUES_TIERCES = /glassora|spotitap/i;

function corriger(texte) {
  let sortie = String(texte ?? '');

  for (const [sans, avec] of COQUILLES) {
    sortie = sortie.split(sans).join(avec);
  }
  for (const [motifBas, avecBas, motifHaut, avecHaut] of REMPLACEMENTS) {
    sortie = sortie.replace(motifBas, avecBas).replace(motifHaut, avecHaut);
  }

  // Apostrophe typographique, lettres accentuées comprises.
  sortie = sortie.replace(/(\p{L})'(\p{L})/gu, `$1${APOSTROPHE}$2`);
  // Espace insécable devant la ponctuation double.
  sortie = sortie.replace(/\s*([?!;])/g, `${INSECABLE}$1`);
  sortie = sortie.replace(/(\p{L})\s*:(\s|$)/gu, `$1${INSECABLE}:$2`);
  sortie = sortie.replace(/«\s*/g, `«${INSECABLE}`);
  sortie = sortie.replace(/\s*»/g, `${INSECABLE}»`);

  return sortie.replace(/[ \t]{2,}/g, ' ').trim();
}

function echapper(valeur) {
  return String(valeur).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

const donnees = JSON.parse(await readFile(jsonPath, 'utf8'));
await mkdir(destDir, { recursive: true });

let ecrits = 0;
let sectionsRetirees = 0;
const rapport = [];

for (const post of donnees.posts) {
  const config = RETENUS[post.slug];
  if (!config) continue;

  const aRetenir = (post.keyTakeaways ?? []).map(corriger);
  const reperes = (post.decisionGuide ?? []).map((item) => ({
    label: corriger(item.label),
    valeur: corriger(item.value),
  }));
  const faq = (post.faq ?? []).map((item) => ({
    question: corriger(item.question),
    reponse: corriger(item.answer),
  }));

  // Maillage interne uniquement : les liens sortants de marque sont retirés.
  const liens = (post.strategicLinks ?? [])
    .filter((l) => typeof l?.url === 'string' && l.url.startsWith('/'))
    .filter((l) => !MARQUES_TIERCES.test(`${l.label ?? ''} ${l.title ?? ''} ${l.url}`))
    .map((l) => ({ href: l.url, label: corriger(l.label ?? l.title ?? l.url) }));

  const sectionsRetenues = (post.sections ?? []).filter((section) => {
    const brut = `${section.heading ?? ''} ${section.body ?? ''}`;
    if (MARQUES_TIERCES.test(brut)) {
      sectionsRetirees += 1;
      return false;
    }
    return true;
  });

  const corps = sectionsRetenues
    .map((section) => {
      const titreSection = corriger(section.heading);
      const paragraphes = String(section.body ?? '')
        .split(/\n+/)
        .map((p) => corriger(p))
        .filter(Boolean)
        .join('\n\n');
      return `## ${titreSection}\n\n${paragraphes}`;
    })
    .join('\n\n');

  const notes = (post.workshopNotes ?? [])
    .filter((n) => !MARQUES_TIERCES.test(String(n)))
    .map(corriger);

  const bloc = notes.length
    ? `\n\n## Notes d${APOSTROPHE}atelier\n\n${notes.map((n) => `- ${n}`).join('\n')}`
    : '';

  const contenu = `${corps}${bloc}`;
  const mots = contenu.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(2, Math.round(mots / 200));

  const lignes = [
    '---',
    `titre: "${echapper(corriger(post.title))}"`,
    `seoTitle: "${echapper(corriger(post.seoTitle))}"`,
    `description: "${echapper(corriger(post.seoDescription))}"`,
    `chapo: "${echapper(corriger(post.excerpt))}"`,
    `categorie: "${config.categorie}"`,
    `datePublication: ${post.datePublished}`,
    `dateModification: ${post.dateModified}`,
    `couverture: "${config.couverture}"`,
    `couvertureAlt: "${echapper(config.couvertureAlt)}"`,
    `tempsLecture: "${minutes} min"`,
    `pilier: ${config.pilier}`,
  ];

  if (aRetenir.length) {
    lignes.push('aRetenir:');
    aRetenir.forEach((v) => lignes.push(`  - "${echapper(v)}"`));
  }
  if (reperes.length) {
    lignes.push('reperes:');
    reperes.forEach((r) => {
      lignes.push(`  - label: "${echapper(r.label)}"`);
      lignes.push(`    valeur: "${echapper(r.valeur)}"`);
    });
  }
  if (faq.length) {
    lignes.push('faq:');
    faq.forEach((f) => {
      lignes.push(`  - question: "${echapper(f.question)}"`);
      lignes.push(`    reponse: "${echapper(f.reponse)}"`);
    });
  }
  if (liens.length) {
    lignes.push('liens:');
    liens.forEach((l) => {
      lignes.push(`  - href: "${l.href}"`);
      lignes.push(`    label: "${echapper(l.label)}"`);
    });
  }

  lignes.push('---', '', contenu, '');

  await writeFile(path.join(destDir, `${post.slug}.md`), lignes.join('\n'), 'utf8');
  ecrits += 1;
  rapport.push({ slug: post.slug, categorie: config.categorie, mots, minutes });
}

console.log(`Articles repris : ${ecrits} / ${donnees.posts.length}`);
console.log(`Sections promotionnelles tierces retirées : ${sectionsRetirees}`);
console.table(rapport);
console.log(
  'Articles écartés (moins de 175 mots ou redondants) :\n  ' +
    donnees.posts
      .filter((p) => !RETENUS[p.slug])
      .map((p) => p.slug)
      .join('\n  '),
);
