/**
 * Import ponctuel des visuels retenus depuis l'ancien dépôt WordPress.
 *
 * Ce script n'est PAS exécuté au build. Il sert uniquement à documenter et à
 * rejouer la sélection des images conservées lors de la reconstruction Astro.
 *
 *   node scripts/import-assets.mjs "C:/chemin/vers/BG-clean-github"
 */
import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const source = process.argv[2];
if (!source) {
  console.error('Usage: node scripts/import-assets.mjs <chemin-du-depot-wordpress>');
  process.exit(1);
}

const themeImages = path.join(source, 'wp-content/themes/woostify-child/assets/images');
const pluginImages = path.join(source, 'wp-content/plugins/bg-custom/assets/images');
const dest = path.join(process.cwd(), 'src/assets/images');

/** Réalisations : photographies réelles de pièces produites par l'atelier. */
const REALISATIONS = [
  'badge-professionnel-grave-personnalise.webp',
  'boitier-technique-plaque-identification.webp',
  'bouteille-champagne-coffret-personnalises.webp',
  'bouteille-vin-gravee-bapteme-personnalisee.webp',
  'briquet-metal-personnalise-gravure.webp',
  'cadeau-sommelier-personnalise-coffret.webp',
  'caisse-bois-bouteille-impression-couleur.webp',
  'caisse-bois-gravee-armoiries-domaine.webp',
  'caisse-vin-bois-gravee-domaine-bruno-colin.webp',
  'caisses-bois-gravees-hospices-de-beaune.webp',
  'caisses-vin-bois-gravees-appellations-bourgogne.webp',
  'caisses-vin-bois-personnalisees-domaines.webp',
  'cles-usb-bois-personnalisees-gravure.webp',
  'coffret-sommelier-couteau-personnalise.webp',
  'coffrets-bois-graves-cadeaux-personnalises.webp',
  'coupe-trophee-plaque-gravee.webp',
  'couteaux-coffrets-viticoles-personnalises.webp',
  'couteaux-graves-appellations-vins-bourgogne.webp',
  'couteaux-personnalises-gravure-laser-fibre.webp',
  'couteaux-pliants-personnalises-serie.webp',
  'couteaux-viticoles-graves-appellations.webp',
  'couverts-inox-personnalises-prenom.webp',
  'decoupe-bois-prenoms-cercles-personnalises.webp',
  'decoupe-laser-badges-roses-serie.webp',
  'decoupe-laser-decoration-bois-personnalisee.webp',
  'decoupe-plexiglass-plaque-numero-porte.webp',
  'etiquette-plastique-qr-code-tracabilite.webp',
  'etiquettes-industrielles-donnees-variables.webp',
  'flasques-inox-personnalisees-laser.webp',
  'flutes-champagne-gravees-mariage.webp',
  'gobelets-isothermes-personnalises-laser.webp',
  'gourde-inox-gravee-laser-fibre.webp',
  'gourdes-bleues-marquees-laser-serie.webp',
  'gravure-grand-format-panneau-domaine-viticole.webp',
  'gravure-laser-etui-cuir-rouge.webp',
  'gravure-laser-fibre-montre-metal.webp',
  'gravure-laser-panneau-bois-moto-club.webp',
  'gravure-laser-plaques-vigneron-serie-atelier.webp',
  'impression-uv-bois-planches-decoratives.webp',
  'impression-uv-coffret-bois-mariage-personnalise.webp',
  'marquage-laser-composant-plastique-industriel.webp',
  'marquage-laser-fibre-outils-serie.webp',
  'marquage-laser-filtres-aluminium-serie.webp',
  'medailles-bois-decoupees-gravees-serie.webp',
  'medaillons-plexiglass-decoupes-graves.webp',
  'outil-industriel-grave-reference.webp',
  'outil-metal-marque-datamatrix-laser.webp',
  'piece-horlogerie-gravee-edition-limitee.webp',
  'piece-plastique-marquee-reference.webp',
  'pieces-inox-marquage-numero-serie.webp',
  'plaque-inox-marquee-laser-en-production.webp',
  'plaque-metal-qr-code-donnees-variables.webp',
  'plaque-plexiglass-doree-avocat-decoupee.webp',
  'plaques-metal-gravees-laser-serie.webp',
  'plaques-professionnelles-gravees-multi-finitions.webp',
  'porte-cles-metal-personnalise-gravure.webp',
  'sous-verres-liege-graves-restauration.webp',
  'stylo-professionnel-marque-logo-laser.webp',
  'stylos-bois-graves-cadeaux-entreprise.webp',
  'tire-bouchon-bois-grave-personnalise.webp',
  'trophee-verre-flute-graves-personnalises.webp',
  'trophee-verre-grave-personnalise.webp',
  'trophees-bois-graves-evenement-entreprise.webp',
  'trophees-viticoles-bois-plexiglass-personnalises.webp',
  'verre-grave-machine-laser-logo-entreprise.webp',
  'verre-vin-grave-logo-domaine-muzard.webp',
  'verre-vin-grave-logo-domaine-patrick-guillot.webp',
  'verre-vin-grave-mariage-personnalise.webp',
];

/** Réalisations stockées à la racine des images du thème. */
const REALISATIONS_RACINE = [
  'decoupe-laser-plexiglass-rose-beaune-gravure.jpg',
  'etiquette-industrielle-jaune-metal-beaune-gravure.jpg',
  'gravure-laser-bois-corton-grand-cru-beaune-gravure.webp',
  'impression-uv-tonnelet-bois-beaune-malmedy-beaune-gravure.webp',
  'plaque-professionnelle-avocat-exterieure-beaune-gravure.webp',
  'verre-grave-veuve-ambal-spritz-club.jpg',
];

/** Photographies d'atelier (équipement, poste de travail). */
const ATELIER = [
  'atelier-laser-uv-beaune-gravure-hero.jpg',
  'about-faire-simple-faire-juste.jpg',
  'contact-hero-trotec-speedy-400.jpg',
];

/** Visuels de couverture du blog. */
const BLOG = [
  'blog/atelier-laser-uv-beaune-gravure-hero.webp',
  'blog/gravure-laser-bois-corton-grand-cru-beaune-gravure.webp',
  'blog/impression-uv-tonnelet-bois-beaune-malmedy-beaune-gravure.webp',
  'blog/plaque-professionnelle-avocat-exterieure-beaune-gravure.webp',
  'blog/verre-grave-veuve-ambal-spritz-club.webp',
];

/** Identité de marque. */
const BRAND = ['beaune-gravure-logo.svg', 'beaune-gravure-mark.svg', 'favicon.svg'];

/**
 * Écartés volontairement, avec le motif.
 * Ces fichiers ne doivent pas être réimportés.
 */
const EXCLUS = {
  'gravure-laser-matieres.webp': 'visuel de synthèse / IA, ne documente pas une production réelle',
  'atelier-machines-gravure-laser-bourgogne.webp': 'montage de synthèse affichant des marques tierces',
  'atelier-machines-gravure-laser-bourgogne.png': 'doublon PNG de 1,9 Mo du fichier ci-dessus',
  'gravure-laser-atelier-hero.png': 'doublon PNG de 1,7 Mo',
  'hero-laser-machine.png': 'doublon PNG de 2,0 Mo',
  'trotec-logo.svg': 'marque déposée tierce, usage non autorisé documenté',
  'laser-head-red-compact.png': 'PNG décoratif de 489 Ko sans valeur éditoriale',
  'abstract-gold-flow.svg': 'jamais référencé',
  'eole-26cl-*.png': 'vestiges du configurateur abandonné (8 fichiers, 14,3 Mo)',
  'favorit-26cl-*.png': 'vestiges du configurateur abandonné',
  'one-32cl-*.png': 'vestiges du configurateur abandonné',
  'one-41cl-*.png': 'vestiges du configurateur abandonné',
};

async function copyList(list, fromDir, toDir) {
  await mkdir(toDir, { recursive: true });
  let ok = 0;
  let bytes = 0;
  for (const name of list) {
    const from = path.join(fromDir, name);
    const to = path.join(toDir, path.basename(name));
    if (!existsSync(from)) {
      console.warn(`  MANQUANT ${name}`);
      continue;
    }
    await cp(from, to);
    bytes += (await stat(to)).size;
    ok += 1;
  }
  return { ok, bytes };
}

const results = [];
results.push(['realisations', await copyList(REALISATIONS, path.join(themeImages, 'services'), path.join(dest, 'realisations'))]);
results.push(['realisations (racine)', await copyList(REALISATIONS_RACINE, themeImages, path.join(dest, 'realisations'))]);
results.push(['atelier', await copyList(ATELIER, themeImages, path.join(dest, 'atelier'))]);
results.push(['blog', await copyList(BLOG, pluginImages, path.join(dest, 'blog'))]);
results.push(['brand', await copyList(BRAND, themeImages, path.join(dest, 'brand'))]);

let total = 0;
for (const [label, { ok, bytes }] of results) {
  total += bytes;
  console.log(`${label.padEnd(24)} ${String(ok).padStart(3)} fichiers  ${(bytes / 1024).toFixed(0)} Ko`);
}
console.log(`\nTotal importé : ${(total / 1024 / 1024).toFixed(2)} Mo`);
console.log(`Écartés volontairement : ${Object.keys(EXCLUS).length} entrées (voir la constante EXCLUS).`);

const finalCount = (await readdir(path.join(dest, 'realisations'))).length;
console.log(`Réalisations disponibles : ${finalCount}`);
