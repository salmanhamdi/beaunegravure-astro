/**
 * Prévient les moteurs qui implémentent IndexNow (Bing, Yandex, Seznam,
 * Naver) que les pages du site viennent d'être republiées.
 *
 * Pourquoi ce script existe : jusqu'au 12/11/2026, les seules soumissions
 * reçues par Bing dataient de juin 2025 et venaient de Wix, qui le faisait
 * automatiquement. Depuis la migration, plus rien n'avertissait les moteurs :
 * ils découvraient les nouveautés au rythme de leur propre exploration,
 * c'est-à-dire des semaines.
 *
 * Le protocole est volontairement minimal : une requête POST, une clef
 * publique déposée à la racine du site, et la liste des adresses. Rien n'est
 * authentifié au-delà de cette clef — c'est elle qui prouve que l'émetteur
 * contrôle bien le domaine.
 *
 * Ce script ne fait jamais échouer un déploiement : les pages sont déjà en
 * ligne quand il s'exécute, et un moteur injoignable n'est pas un incident.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const HOTE = 'beaunegravure.fr';
const CLEF = process.env.INDEXNOW_KEY;
const DIST = 'dist';

if (!CLEF) {
  console.log('IndexNow : aucune clef fournie, étape ignorée.');
  process.exit(0);
}

/** Les adresses viennent du sitemap réellement construit, pas d'une liste tenue à la main. */
const urls = readdirSync(DIST)
  .filter((n) => /^sitemap-\d+\.xml$/.test(n))
  .flatMap((n) =>
    [...readFileSync(join(DIST, n), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
  );

if (urls.length === 0) {
  console.log('IndexNow : aucune adresse trouvée dans le sitemap, étape ignorée.');
  process.exit(0);
}

const reponse = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOTE,
    key: CLEF,
    keyLocation: `https://${HOTE}/${CLEF}.txt`,
    urlList: urls,
  }),
}).catch((erreur) => {
  console.log(`IndexNow : injoignable (${erreur.message}). Sans conséquence.`);
  return null;
});

if (!reponse) process.exit(0);

// 200 = accepté, 202 = accepté, clef en cours de vérification.
if (reponse.ok) {
  console.log(`IndexNow : ${urls.length} adresses soumises (HTTP ${reponse.status}).`);
} else {
  console.log(`IndexNow : refus HTTP ${reponse.status}. Les pages restent en ligne.`);
}
