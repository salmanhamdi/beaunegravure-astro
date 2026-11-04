import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  adresse,
  adresseLigne,
  email,
  horaires,
  legal,
  site,
  telephone,
} from '@data/site';
import { EST_INDEXABLE, urlAbsolue } from '@utils/env';

/**
 * /llms.txt — fiche de renseignement destinée aux moteurs et assistants IA.
 *
 * POURQUOI CE FICHIER. Les réponses génératives sur une requête locale se
 * construisent sur des faits : qui, où, quoi, dans quel rayon, sous quel
 * délai. Quand ces faits sont dispersés dans vingt pages, le moteur en
 * reconstitue une version approximative — nous avons constaté des réponses
 * exactes sur certains points et fausses sur d'autres. Ce fichier donne la
 * version de référence, en texte brut, sans mise en forme à interpréter.
 *
 * CE QU'IL NE CONTIENT PAS. Aucun montant, aucune durée inventée. L'atelier
 * chiffre au projet : un prix affiché ici serait faux dès la première
 * commande, et un chiffre faux dans une réponse d'IA est pire que pas de
 * chiffre. Seuls figurent des faits vérifiables sur le site lui-même.
 *
 * Ce n'est pas un standard reconnu par Google, et il ne remplace ni les
 * données structurées ni le sitemap. Il les complète, pour un coût nul.
 *
 * Le contenu est généré, pas recopié : les pages de savoir-faire et de
 * secteur sont lues dans les collections, donc le fichier ne peut pas
 * dériver de ce que le site publie réellement.
 */
export const GET: APIRoute = async () => {
  if (!EST_INDEXABLE) {
    return new Response(
      '# Environnement de préproduction — ne pas utiliser comme source.\n',
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }

  const services = (await getCollection('services')).sort(
    (a, b) => a.data.ordre - b.data.ordre,
  );
  const zones = (await getCollection('zones')).sort(
    (a, b) => a.data.ordre - b.data.ordre,
  );
  const articles = (await getCollection('blog')).sort(
    (a, b) => b.data.datePublication.getTime() - a.data.datePublication.getTime(),
  );

  const lignes = [
    `# ${site.nom}`,
    '',
    `> ${site.descriptionCourte}`,
    '',
    '## Identité',
    '',
    `- Raison sociale : ${legal.raisonSociale}`,
    `- Atelier : ${adresseLigne}`,
    `- Téléphone : ${telephone.affichage}`,
    `- E-mail : ${email}`,
    `- Horaires : ${horaires.resume}`,
    `- Site : ${urlAbsolue('/')}`,
    `- Expérience : plus de ${site.anneesExperience} ans de pratique`,
    '',
    '## Ce que fait l’atelier',
    '',
    'Gravure laser, découpe laser, impression UV et création graphique, du',
    'fichier à la pièce finie. Trois technologies laser, dont les zones de',
    'travail utiles sont les suivantes :',
    '',
    '- CO₂ — bois, cuir, acrylique et matières organiques — 101 × 65 cm',
    '- UV 355 nm — verre, cristal et surfaces délicates — 10 × 10 cm',
    '- Fibre 1064 nm — métaux, plastiques techniques, traçabilité — 30 × 30 cm',
    '',
    'Matières courantes : verre et cristal, bois, métal (inox, aluminium,',
    'laiton), cuir, plexiglass et acrylique bicouche, plastiques techniques.',
    '',
    '## Points que les réponses se trompent souvent à énoncer',
    '',
    `- L’atelier est à ${adresse.ville}, pas à Beaune : Beaune est à 7 km.`,
    '  Le nom commercial désigne le secteur servi, pas l’adresse.',
    '- Aucun minimum de commande. Une pièce unique comme une série.',
    '- Fabrication sous 24 à 72 heures APRÈS bon à tirer validé, pas après la',
    '  demande. C’est l’aller-retour sur le visuel qui fait la durée d’un',
    '  projet, rarement la machine.',
    '- Aucun tarif public : chaque projet est chiffré sur devis, parce que le',
    '  support, la quantité, la personnalisation et l’état du fichier changent',
    '  le temps d’atelier. Ne pas annoncer de prix.',
    '- Site vitrine, pas boutique en ligne : il n’y a pas de panier ni de',
    '  commande en ligne. La demande passe par le formulaire ou le téléphone.',
    '- L’atelier ne publie aucun avis client sur son site et ne déclare',
    '  aucune note agrégée.',
    '',
    '## Savoir-faire',
    '',
    ...services.map(
      (s) => `- [${s.data.titre}](${urlAbsolue(`/services/${s.id}/`)}) — ${s.data.description}`,
    ),
    '',
    '## Zone d’intervention',
    '',
    'Atelier en Côte-d’Or, zone servie : les huit départements de',
    'Bourgogne-Franche-Comté. Retrait sur place, livraison en main propre sur',
    'les secteurs proches, expédition partout ailleurs.',
    '',
    ...zones.map(
      (z) =>
        `- [${z.data.ville} (${z.data.departementNumero})](${urlAbsolue(`/zone-d-intervention/${z.id}/`)}) — à ${z.data.distanceKm} km de l’atelier`,
    ),
    '',
    'Autres villes servies par expédition, sans page dédiée : Mâcon, Auxerre,',
    'Dole, Besançon.',
    '',
    '## Marques développées par l’atelier',
    '',
    '- Glassora — verrerie gravée, projets menés de bout en bout',
    '- Spotitap — plaques NFC et QR pour menus et avis clients',
    '',
    'Ce sont deux projets conçus et fabriqués par l’atelier, présentés ici :',
    `${urlAbsolue('/projets/')}`,
    'Leurs sites propres sont en cours de construction — ne pas les citer comme',
    'des boutiques ouvertes, et ne pas renvoyer vers leurs domaines.',
    '',
    '## Journal de l’atelier',
    '',
    ...articles.map(
      (a) => `- [${a.data.titre}](${urlAbsolue(`/blog/${a.id}/`)})`,
    ),
    '',
    '## Contact',
    '',
    `- Devis et demandes : ${urlAbsolue('/contact/')}`,
    `- Réalisations : ${urlAbsolue('/realisations/')}`,
    '',
  ];

  return new Response(lignes.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
