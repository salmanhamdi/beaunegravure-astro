<?php
/**
 * Configuration du point d'entrée de contact.
 *
 * À copier en `config.php` DIRECTEMENT SUR LE SERVEUR, jamais dans Git.
 * `config.php` est listé dans .gitignore.
 *
 *   cp config.example.php config.php
 *
 * Aucune clé secrète n'est nécessaire : l'envoi passe par la fonction mail()
 * de l'hébergement. Pour une meilleure délivrabilité, configurer SPF et DKIM
 * sur le domaine depuis le hPanel Hostinger.
 */

declare(strict_types=1);

return [
    // Adresse qui reçoit les demandes de devis.
    'destinataire' => 'contact@beaunegravure.fr',

    // Expéditeur technique. DOIT appartenir au domaine du site pour que SPF
    // valide l'envoi : ne jamais mettre l'adresse du visiteur ici.
    'expediteur' => 'site@beaunegravure.fr',
    'nom_expediteur' => 'Site Beaune Gravure',

    // Origines acceptées pour la soumission du formulaire.
    'origines_autorisees' => [
        'https://beaunegravure.fr',
        'https://www.beaunegravure.fr',
        'https://dimgrey-caribou-115686.hostingersite.com',
    ],

    // Nombre maximal de demandes par adresse IP et par heure.
    'max_par_heure' => 5,

    // Délai minimal, en secondes, entre l'affichage du formulaire et l'envoi.
    'delai_minimal' => 3,

    // Répertoire du journal des demandes. Le script y crée un .htaccess
    // interdisant l'accès web. Le placer hors de public_html est encore mieux :
    //   'repertoire_data' => dirname(__DIR__, 3) . '/bg-demandes',
    'repertoire_data' => __DIR__ . '/.data',
];
