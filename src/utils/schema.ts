/**
 * Construction des données structurées.
 *
 * Une seule entité d'organisation existe sur tout le site : `#organization`.
 * Toutes les autres entités s'y rattachent par `@id`, afin d'éviter les
 * descriptions concurrentes de la même entreprise d'une page à l'autre.
 *
 * Aucun avis, aucune note agrégée : le site ne publie pas d'avis clients, donc
 * il n'en déclare pas.
 */
import {
  adresse,
  adresseLigne,
  email,
  geo,
  legal,
  reseaux,
  site,
  telephone,
  zones,
} from '@data/site';
import { urlAbsolue } from './env';

export const ID_ORGANISATION = urlAbsolue('/#organization');
export const ID_SITE = urlAbsolue('/#website');

export function organisation(logo: string, image?: string) {
  return {
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': ID_ORGANISATION,
    name: site.nom,
    legalName: legal.raisonSociale,
    description: site.descriptionCourte,
    url: urlAbsolue('/'),
    logo: {
      '@type': 'ImageObject',
      url: urlAbsolue(logo),
    },
    ...(image ? { image: urlAbsolue(image) } : {}),
    telephone: telephone.e164,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: adresse.rue,
      postalCode: adresse.codePostal,
      addressLocality: adresse.ville,
      addressRegion: adresse.region,
      addressCountry: adresse.paysCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    hasMap: reseaux.googleMaps,
    areaServed: zones.map((nom) => ({ '@type': 'Place', name: nom })),
    priceRange: '€€',
    knowsLanguage: 'fr-FR',
    sameAs: [reseaux.instagram, reseaux.googleMaps],
    // Les horaires ne sont pas publiés tant qu'ils n'ont pas été confirmés :
    // mieux vaut aucune donnée qu'une donnée fausse.
  };
}

export function siteWeb() {
  return {
    '@type': 'WebSite',
    '@id': ID_SITE,
    url: urlAbsolue('/'),
    name: site.nom,
    description: site.descriptionCourte,
    inLanguage: 'fr-FR',
    publisher: { '@id': ID_ORGANISATION },
  };
}

export function pageWeb(options: {
  url: string;
  titre: string;
  description: string;
  image?: string;
  datePublication?: Date;
  dateModification?: Date;
}) {
  return {
    '@type': 'WebPage',
    '@id': `${options.url}#webpage`,
    url: options.url,
    name: options.titre,
    description: options.description,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': ID_SITE },
    about: { '@id': ID_ORGANISATION },
    ...(options.image ? { primaryImageOfPage: options.image } : {}),
    ...(options.datePublication
      ? { datePublished: options.datePublication.toISOString() }
      : {}),
    ...(options.dateModification
      ? { dateModified: options.dateModification.toISOString() }
      : {}),
  };
}

export interface Miette {
  nom: string;
  href: string;
}

export function filAriane(miettes: Miette[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${urlAbsolue(miettes[miettes.length - 1]!.href)}#breadcrumb`,
    itemListElement: miettes.map((miette, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: miette.nom,
      item: urlAbsolue(miette.href),
    })),
  };
}

export function serviceSchema(options: {
  nom: string;
  description: string;
  url: string;
}) {
  return {
    '@type': 'Service',
    '@id': `${options.url}#service`,
    name: options.nom,
    description: options.description,
    url: options.url,
    serviceType: 'Gravure laser',
    provider: { '@id': ID_ORGANISATION },
    areaServed: zones.map((nom) => ({ '@type': 'Place', name: nom })),
  };
}

export function articleSchema(options: {
  url: string;
  titre: string;
  description: string;
  image: string;
  datePublication: Date;
  dateModification: Date;
  auteur: string;
}) {
  return {
    '@type': 'Article',
    '@id': `${options.url}#article`,
    headline: options.titre,
    description: options.description,
    image: options.image,
    datePublished: options.datePublication.toISOString(),
    dateModified: options.dateModification.toISOString(),
    inLanguage: 'fr-FR',
    author: { '@type': 'Organization', name: options.auteur, '@id': ID_ORGANISATION },
    publisher: { '@id': ID_ORGANISATION },
    mainEntityOfPage: { '@id': `${options.url}#webpage` },
    isPartOf: { '@id': ID_SITE },
  };
}

export function faqSchema(entrees: { question: string; reponse: string }[]) {
  if (!entrees.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: entrees.map((entree) => ({
      '@type': 'Question',
      name: entree.question,
      acceptedAnswer: { '@type': 'Answer', text: entree.reponse },
    })),
  };
}

/** Emballe les entités dans un graphe unique, plus lisible pour les moteurs. */
export function graphe(entites: unknown[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': entites.filter(Boolean),
  };
}

export { adresseLigne };
