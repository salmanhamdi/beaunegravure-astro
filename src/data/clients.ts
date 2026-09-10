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
  { fichier: 'allianz.svg', nom: 'Allianz — C & J Lestrade', hauteur: 25.3, ratio: 3.8 },
  { fichier: 'bobard-freres.svg', nom: 'Bobard Frères', hauteur: 30.2, ratio: 3.235 },
  { fichier: 'besancenot.svg', nom: 'Domaine Besancenot', hauteur: 25.4, ratio: 7.615 },
  { fichier: 'crossfit-beaune.svg', nom: 'CrossFit Beaune', hauteur: 42.8, ratio: 1.4 },
  { fichier: 'millisime.svg', nom: 'Mon Millésime', hauteur: 29.2, ratio: 5.016 },
  { fichier: 'ville-de-beaune.svg', nom: 'Ville de Beaune', hauteur: 37.5, ratio: 3.03 },
  { fichier: 'andre-le-groupe.svg', nom: 'André le Groupe', hauteur: 45.1, ratio: 0.782 },
  { fichier: 'antonin-cosnier.svg', nom: 'Antonin Cosnier', hauteur: 31, ratio: 6.104 },
  { fichier: 'le-gout-du-vin.svg', nom: 'Le Goût du Vin', hauteur: 39.8, ratio: 2.499 },
  { fichier: 'horizon-job.svg', nom: 'Horizon Job', hauteur: 45.4, ratio: 1.121 },
  { fichier: 'le-vintage.svg', nom: 'Le Vintage', hauteur: 32.2, ratio: 4.292 },
  { fichier: 'bouchard-pere-et-fils.svg', nom: 'Bouchard Père & Fils', hauteur: 43.3, ratio: 2.559 },
  { fichier: 'amc-augey.svg', nom: 'Augey', hauteur: 43.5, ratio: 2.095 },
  { fichier: 'vignoble-picard.svg', nom: 'Vignobles & Vins Picard', hauteur: 47.7, ratio: 1.48 },
  { fichier: 'verrissimo.svg', nom: 'Verrissimo', hauteur: 36.7, ratio: 3.766 },
  { fichier: 'drouhin-laroze.svg', nom: 'Domaine Drouhin-Laroze', hauteur: 48.9, ratio: 3.026 },
  { fichier: 'boerl-et-kroff.svg', nom: 'Boërl & Kroff', hauteur: 44.8, ratio: 2.011 },
  { fichier: 'le-cedre-beaune.svg', nom: 'Hostellerie Le Cèdre', hauteur: 51.2, ratio: 1.331 },
];
