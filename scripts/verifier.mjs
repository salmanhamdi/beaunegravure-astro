/**
 * Contrôle qualité du site généré.
 *
 * Analyse le contenu de dist/ sans navigateur : liens internes, métadonnées,
 * structure des titres, textes alternatifs, données structurées.
 *
 *   node scripts/verifier.mjs
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.join(process.cwd(), 'dist');
const problemes = [];
const infos = [];

function signaler(gravite, page, message) {
  problemes.push({ gravite, page, message });
}

async function listerHtml(repertoire) {
  const entrees = await readdir(repertoire, { withFileTypes: true });
  const fichiers = [];
  for (const entree of entrees) {
    const complet = path.join(repertoire, entree.name);
    if (entree.isDirectory()) {
      fichiers.push(...(await listerHtml(complet)));
    } else if (entree.name.endsWith('.html')) {
      fichiers.push(complet);
    }
  }
  return fichiers;
}

/** Convertit un chemin de fichier dist en URL du site. */
function urlDe(fichier) {
  const relatif = path.relative(DIST, fichier).replace(/\\/g, '/');
  if (relatif === 'index.html') return '/';
  if (relatif === '404.html') return '/404.html';
  return '/' + relatif.replace(/index\.html$/, '');
}

/** Vérifie qu'une URL interne correspond à un fichier réellement produit. */
function cibleExiste(href) {
  const [chemin] = href.split(/[?#]/);
  if (!chemin || chemin === '/') return existsSync(path.join(DIST, 'index.html'));
  const propre = chemin.replace(/^\//, '');
  return (
    existsSync(path.join(DIST, propre)) ||
    existsSync(path.join(DIST, propre, 'index.html')) ||
    existsSync(path.join(DIST, propre.replace(/\/$/, '') + '.html'))
  );
}

const fichiers = (await listerHtml(DIST)).sort();
const urlsConnues = new Set(fichiers.map(urlDe));

let totalLiens = 0;
let totalImages = 0;
const titres = new Map();
const descriptions = new Map();

for (const fichier of fichiers) {
  const html = await readFile(fichier, 'utf8');
  const page = urlDe(fichier);

  // ---------------------------------------------------------------- Métadonnées
  const titre = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';
  const ogImage = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? '';

  if (!titre) signaler('erreur', page, 'title absent');
  else if (titre.length > 65) signaler('avert', page, `title de ${titre.length} caractères (> 65)`);
  if (!description) signaler('erreur', page, 'meta description absente');
  else if (description.length < 80 || description.length > 165) {
    signaler('avert', page, `meta description de ${description.length} caractères (viser 110-165)`);
  }
  if (!canonical) signaler('erreur', page, 'canonical absent');
  if (!robots) signaler('erreur', page, 'meta robots absente');
  if (!ogImage) signaler('avert', page, 'og:image absente');

  if (titre) {
    if (titres.has(titre)) signaler('erreur', page, `title identique à ${titres.get(titre)}`);
    else titres.set(titre, page);
  }
  if (description) {
    if (descriptions.has(description)) {
      signaler('erreur', page, `meta description identique à ${descriptions.get(description)}`);
    } else descriptions.set(description, page);
  }

  // ------------------------------------------------------------------- Titres
  const h1 = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  if (h1.length === 0) signaler('erreur', page, 'aucun h1');
  if (h1.length > 1) signaler('erreur', page, `${h1.length} h1 sur la page`);
  for (const [, contenu] of h1) {
    if (!contenu.replace(/<[^>]*>/g, '').trim()) signaler('erreur', page, 'h1 vide');
  }

  // Saut de niveau de titre (h2 -> h4 par exemple).
  const niveaux = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < niveaux.length; i += 1) {
    if (niveaux[i] - niveaux[i - 1] > 1) {
      signaler('avert', page, `saut de niveau h${niveaux[i - 1]} → h${niveaux[i]}`);
      break;
    }
  }

  // ------------------------------------------------------------------- Images
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  totalImages += images.length;
  for (const img of images) {
    // `alt=""` est sérialisé en attribut nu (`alt`) : les deux formes sont valides.
    if (!/\balt(=|[\s>])/.test(img)) {
      signaler('erreur', page, `image sans attribut alt : ${img.slice(0, 90)}`);
    }
    if (!/\bwidth=/.test(img) || !/\bheight=/.test(img)) {
      signaler('avert', page, `image sans dimensions : ${img.slice(0, 90)}`);
    }
  }

  // -------------------------------------------------------------------- Liens
  const liens = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)];
  for (const [balise, href] of liens) {
    totalLiens += 1;

    if (href.startsWith('http')) {
      if (/target="_blank"/.test(balise) && !/rel="[^"]*noopener/.test(balise)) {
        signaler('avert', page, `lien externe en nouvel onglet sans rel="noopener" : ${href}`);
      }
      continue;
    }
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

    if (!cibleExiste(href)) {
      signaler('erreur', page, `lien interne cassé : ${href}`);
    }
    if (
      href.startsWith('/') &&
      !href.includes('#') &&
      !href.includes('?') &&
      !/\.[a-z0-9]{2,5}$/i.test(href) &&
      !href.endsWith('/')
    ) {
      signaler('avert', page, `lien interne sans slash final : ${href}`);
    }
  }

  // Lien vide ou sans intitulé accessible.
  for (const [balise] of liens) {
    const suite = html.slice(html.indexOf(balise) + balise.length);
    const texte = suite.slice(0, suite.indexOf('</a>'));
    const lisible = texte.replace(/<[^>]*>/g, '').trim();
    const aria = /aria-label="[^"]+"/.test(balise);
    const imgAlt = /<img[^>]+alt="[^"]+"/.test(texte);
    const cache = /visuellement-cache/.test(texte);
    if (!lisible && !aria && !imgAlt && !cache) {
      signaler('erreur', page, `lien sans intitulé accessible : ${balise.slice(0, 80)}`);
    }
  }

  // ------------------------------------------------------- Données structurées
  const blocs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocs.length === 0 && !page.startsWith('/404')) {
    signaler('avert', page, 'aucune donnée structurée');
  }
  for (const [, json] of blocs) {
    try {
      const objet = JSON.parse(json);
      const graphe = objet['@graph'] ?? [objet];
      for (const entite of graphe) {
        if (!entite['@type']) signaler('erreur', page, 'entité JSON-LD sans @type');
      }
      // Aucun avis ne doit être publié : le site n'en héberge pas.
      if (/aggregateRating|"Review"/.test(json)) {
        signaler('erreur', page, 'données structurées d’avis alors que le site n’en publie pas');
      }
    } catch (erreur) {
      signaler('erreur', page, `JSON-LD invalide : ${erreur.message}`);
    }
  }

  // ------------------------------------------------------------------- Divers
  if (!/<html lang="fr"/.test(html)) signaler('erreur', page, 'attribut lang manquant ou incorrect');
  if (/localhost|127\.0\.0\.1/.test(html)) signaler('erreur', page, 'référence à localhost dans le HTML');
  if (/lorem ipsum/i.test(html)) signaler('erreur', page, 'texte de remplissage détecté');
  if (/\bTODO\b|\bFIXME\b/.test(html)) signaler('avert', page, 'marqueur TODO/FIXME dans le HTML');
}

// -------------------------------------------------------------- Fichiers requis
for (const requis of ['robots.txt', 'favicon.svg', 'site.webmanifest', '.htaccess', 'api/contact.php']) {
  if (!existsSync(path.join(DIST, requis))) signaler('erreur', '(global)', `fichier absent : ${requis}`);
}

const octets = async (f) => (existsSync(path.join(DIST, f)) ? (await stat(path.join(DIST, f))).size : 0);
infos.push(`Pages HTML : ${fichiers.length}`);
infos.push(`Liens analysés : ${totalLiens}`);
infos.push(`Images analysées : ${totalImages}`);
infos.push(`Titres uniques : ${titres.size} / ${fichiers.length}`);
infos.push(`Descriptions uniques : ${descriptions.size} / ${fichiers.length}`);
infos.push(`robots.txt : ${await octets('robots.txt')} octets`);
infos.push(`URLs générées : ${[...urlsConnues].length}`);

// ------------------------------------------------------------------- Restitution
console.log('\n=== Contrôle du site généré ===\n');
infos.forEach((i) => console.log('  ' + i));

const erreurs = problemes.filter((p) => p.gravite === 'erreur');
const avertissements = problemes.filter((p) => p.gravite === 'avert');

console.log(`\n  Erreurs : ${erreurs.length}`);
console.log(`  Avertissements : ${avertissements.length}\n`);

const grouper = (liste) => {
  const parMessage = new Map();
  for (const p of liste) {
    const cle = p.message.replace(/ : .*/, '');
    if (!parMessage.has(cle)) parMessage.set(cle, []);
    parMessage.get(cle).push(p);
  }
  return parMessage;
};

for (const [etiquette, liste] of [
  ['ERREURS', erreurs],
  ['AVERTISSEMENTS', avertissements],
]) {
  if (!liste.length) continue;
  console.log(`--- ${etiquette} ---`);
  for (const [message, entrees] of grouper(liste)) {
    console.log(`  ${message} (${entrees.length})`);
    entrees.slice(0, 4).forEach((e) => console.log(`      ${e.page} — ${e.message}`));
    if (entrees.length > 4) console.log(`      … et ${entrees.length - 4} autres`);
  }
  console.log('');
}

process.exit(erreurs.length > 0 ? 1 : 0);
