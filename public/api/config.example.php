<?php
/**
 * Configuration du point d'entrée de contact — MODÈLE.
 *
 * NE JAMAIS RENSEIGNER DE MOT DE PASSE DANS CE FICHIER : il est versionné et
 * déployé avec le site. Il ne sert qu'à documenter les clés disponibles.
 *
 * DEUX EMPLACEMENTS POSSIBLES SUR LE SERVEUR, par ordre de préférence :
 *
 *   1. RECOMMANDÉ — hors de la racine web :
 *          ~/bg-config/contact.php     (répertoire en 700, fichier en 600)
 *      Aucune requête HTTP ne peut l'atteindre, et le miroir de déploiement
 *      ne le voit même pas : il n'agit que dans la racine web.
 *
 *   2. REPLI — dans la racine web :
 *          api/config.php
 *      Exclu de Git et du déploiement, mais situé sous la racine web.
 *
 * Le script remonte l'arborescence depuis `api/` à la recherche d'un
 * `bg-config/contact.php`, en IGNORANT tout candidat situé à l'intérieur de la
 * racine web. La source trouvée hors racine web l'emporte sur `api/config.php`,
 * qui l'emporte lui-même sur les valeurs par défaut du script.
 *
 * Seules les clés que l'on souhaite modifier ont besoin d'être déclarées.
 */

declare(strict_types=1);

return [
    // -----------------------------------------------------------------------
    // Adresses
    // -----------------------------------------------------------------------

    // Adresse qui reçoit les demandes de devis.
    'destinataire' => 'contact@beaunegravure.fr',

    // Expéditeur technique. DOIT appartenir au domaine du site pour que le
    // message soit aligné : ne jamais mettre l'adresse du visiteur ici.
    // C'est un alias du compte authentifié déclaré plus bas.
    'expediteur' => 'site@beaunegravure.fr',
    'nom_expediteur' => 'Site Beaune Gravure',

    // -----------------------------------------------------------------------
    // Envoi SMTP authentifié (Google Workspace)
    // -----------------------------------------------------------------------
    //
    // TANT QUE `smtp_motdepasse` EST VIDE : l'envoi passe par la fonction
    // mail() de l'hébergement, exactement comme avant la bascule. C'est le
    // mode de préparation, qui permet de déployer le code sans rien changer
    // au comportement.
    //
    // DÈS QUE `smtp_motdepasse` EST RENSEIGNÉ : le SMTP devient OBLIGATOIRE.
    // Un échec n'est jamais rattrapé par mail() — le message partirait sans
    // authentification et serait rejeté par la politique DMARC du domaine.
    // La demande reste écrite dans le journal, et le visiteur reçoit le
    // message « demande enregistrée » avec les coordonnées directes.

    'smtp_hote' => 'smtp.gmail.com',
    'smtp_port' => 587,

    // « tls » = STARTTLS sur le port 587 (recommandé).
    // « ssl » = TLS implicite sur le port 465 (secours).
    'smtp_chiffrement' => 'tls',

    // LE COMPTE RÉEL, jamais un alias : on ne s'authentifie pas avec un alias.
    'smtp_utilisateur' => 'contact@beaunegravure.fr',

    // Mot de passe d'application Google (16 caractères), à créer depuis
    // https://myaccount.google.com/apppasswords avec le compte ci-dessus,
    // validation en deux étapes activée.
    //
    // À SAISIR UNIQUEMENT DANS LE FICHIER SERVEUR — jamais ici, jamais dans
    // Git, jamais dans un secret GitHub : il finirait déployé avec le site.
    'smtp_motdepasse' => '',

    // Délai maximal d'attente de la connexion SMTP, en secondes. Court
    // volontairement : au-delà, mieux vaut enregistrer la demande que de
    // faire patienter le visiteur.
    'smtp_delai' => 10,

    // -----------------------------------------------------------------------
    // Garde-fous
    // -----------------------------------------------------------------------

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

    // Répertoire des journaux. Le script y crée un .htaccess interdisant
    // l'accès web, et y écrit deux fichiers :
    //   demandes-AAAA-MM.jsonl  toutes les demandes, AVANT toute tentative
    //                           d'envoi — aucune n'est jamais perdue ;
    //   erreurs-AAAA-MM.jsonl   date, code et motif technique des échecs
    //                           d'envoi, sans donnée personnelle ni secret.
    // Le placer hors de public_html est encore mieux :
    //   'repertoire_data' => dirname(__DIR__, 3) . '/bg-demandes',
    'repertoire_data' => __DIR__ . '/.data',
];
