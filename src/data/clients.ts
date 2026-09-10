/**
 * Logos clients du bandeau d'accueil.
 *
 * DEUX CHOSES NE SONT PAS ARBITRAIRES ICI : la hauteur, et l'ordre.
 *
 * LA HAUTEUR n'est pas une valeur choisie à l'œil. Chaque SVG a été
 * rasterisé, puis on a relevé sa BOÎTE RÉELLEMENT ENCRÉE — jamais le cadre du
 * fichier — et sa MASSE D'ENCRE, c'est-à-dire la somme de l'opacité pondérée
 * par l'obscurité. Le blanc détouré d'un badge occupe donc de la surface sans
 * peser, ce qui est exactement ce que voit l'œil.
 *
 * Les proportions vont de 0,78 (André, vertical) à 7,62 (Besancenot, bandeau
 * de calligraphie) — presque dix fois. Les densités d'encre de 5,5 % à 39,2 %
 * — sept fois. Une hauteur commune était donc impossible : elle aurait rendu
 * Besancenot énorme et Le Cèdre insignifiant.
 *
 * La hauteur retenue suit `h ∝ (1 / (densité × proportion))^0,30`. Ni hauteur
 * égale, ni masse égale — cette dernière aurait fait des carrés des géants. Le
 * compromis ramène l'écart de masse perçue de 1 à 15 à 1 à 2,6.
 *
 * L'ORDRE alterne quatre familles de forme — BANDEAU, LARGE, MOYEN, COMPACT —
 * de sorte que deux voisins n'appartiennent jamais à la même. La contrainte
 * vaut aussi pour la jonction entre le dernier et le premier : la boucle n'a
 * pas de point faible.
 *
 * `ratio` sert à calculer les attributs width/height du HTML, donc à réserver
 * la place avant le chargement : aucun décalage de mise en page.
 */

export interface Client {
  /** Nom du fichier dans public/logos/. */
  fichier: string;
  /** Graphie de la marque, telle qu'elle figure sur le logo. */
  nom: string;
  /** Hauteur visuelle en pixels, à l'échelle desktop de référence. */
  hauteur: number;
  /** Proportion de la boîte encrée, largeur / hauteur. */
  ratio: number;
}

export const clients: Client[] = [
  { fichier: 'allianz.svg', nom: 'Allianz — C & J Lestrade', hauteur: 25.4, ratio: 3.8 },
  { fichier: 'crossfit-beaune.svg', nom: 'CrossFit Beaune', hauteur: 42.9, ratio: 1.4004 },
  { fichier: 'besancenot.svg', nom: 'Domaine Besancenot', hauteur: 25.5, ratio: 7.6152 },
  { fichier: 'bobard-freres.svg', nom: 'Bobard Frères', hauteur: 30.3, ratio: 3.2354 },
  { fichier: 'verrerie-de-bourgogne.svg', nom: 'Verrerie de Bourgogne', hauteur: 27.2, ratio: 3.9618 },
  { fichier: 'andre-le-groupe.svg', nom: 'André le Groupe', hauteur: 45.2, ratio: 0.7816 },
  { fichier: 'millisime.svg', nom: 'Mon Millésime', hauteur: 29.2, ratio: 5.016 },
  { fichier: 'ville-de-beaune.svg', nom: 'Ville de Beaune', hauteur: 35.5, ratio: 3.01 },
  { fichier: 'horizon-job.svg', nom: 'Horizon Job', hauteur: 45.5, ratio: 1.121 },
  { fichier: 'antonin-cosnier.svg', nom: 'Antonin Cosnier', hauteur: 31.1, ratio: 6.1044 },
  { fichier: 'le-gout-du-vin.svg', nom: 'Le Goût du Vin', hauteur: 39.9, ratio: 2.4989 },
  { fichier: 'tonnellerie-damy.svg', nom: 'Tonnellerie Damy', hauteur: 38.3, ratio: 2.2693 },
  { fichier: 'vignoble-picard.svg', nom: 'Vignobles & Vins Picard', hauteur: 47.8, ratio: 1.4795 },
  { fichier: 'le-vintage.svg', nom: 'Le Vintage', hauteur: 32.3, ratio: 4.292 },
  { fichier: 'bouchard-pere-et-fils.svg', nom: 'Bouchard Père & Fils', hauteur: 43.5, ratio: 2.5591 },
  { fichier: 'amc-augey.svg', nom: 'Augey', hauteur: 43.6, ratio: 2.0952 },
  { fichier: 'le-cedre-beaune.svg', nom: 'Hostellerie Le Cèdre', hauteur: 51.3, ratio: 1.3312 },
  { fichier: 'verrissimo.svg', nom: 'Verrissimo', hauteur: 36.8, ratio: 3.7662 },
  { fichier: 'drouhin-laroze.svg', nom: 'Domaine Drouhin-Laroze', hauteur: 49.1, ratio: 3.0261 },
  { fichier: 'boerl-et-kroff.svg', nom: 'Boërl & Kroff', hauteur: 44.9, ratio: 2.011 },
  { fichier: 'billon.svg', nom: 'Tonnellerie Billon', hauteur: 53.1, ratio: 1.002 },
];
