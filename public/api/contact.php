<?php
/**
 * Réception des demandes de devis — Beaune Gravure.
 *
 * Principe directeur : une demande ne doit JAMAIS être perdue silencieusement.
 * Chaque soumission valide est écrite sur disque AVANT toute tentative d'envoi
 * de courriel. Si l'envoi échoue, la demande reste consultable dans le journal
 * et le visiteur reçoit un message explicite avec les coordonnées directes.
 *
 * Le site est statique : ce fichier est le seul point d'entrée dynamique.
 *
 * Configuration : copier config.example.php en config.php sur le serveur.
 * config.php n'est jamais versionné.
 */

declare(strict_types=1);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

$config = [
    'destinataire'     => 'contact@beaunegravure.fr',
    'expediteur'       => 'site@beaunegravure.fr',
    'nom_expediteur'   => 'Site Beaune Gravure',
    'origines_autorisees' => [
        'https://beaunegravure.fr',
        'https://www.beaunegravure.fr',
        'https://dimgrey-caribou-115686.hostingersite.com',
    ],
    'max_par_heure'    => 5,
    'delai_minimal'    => 3,      // secondes entre l'affichage et l'envoi
    'repertoire_data'  => __DIR__ . '/.data',
];

$fichierConfig = __DIR__ . '/config.php';
if (is_readable($fichierConfig)) {
    /** @var array<string,mixed> $surcharge */
    $surcharge = require $fichierConfig;
    if (is_array($surcharge)) {
        $config = array_merge($config, $surcharge);
    }
}

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

/** Détermine si le client attend du JSON (soumission via fetch). */
function attendJson(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $xhr = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return str_contains($accept, 'application/json') || $xhr === 'fetch';
}

/** Termine la requête, en JSON ou par redirection selon le client. */
function repondre(int $statut, string $code, string $message, string $retour = '/contact/'): never
{
    http_response_code($statut);

    if (attendJson()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            ['ok' => $statut === 200, 'code' => $code, 'message' => $message],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        exit;
    }

    $cible = $retour . '?etat=' . rawurlencode($code) . '#formulaire';
    header('Location: ' . $cible, true, 303);
    exit;
}

function nettoyer(string $valeur, int $max = 2000): string
{
    $valeur = str_replace(["\r\n", "\r"], "\n", $valeur);
    $valeur = strip_tags($valeur);
    $valeur = trim($valeur);
    return mb_substr($valeur, 0, $max);
}

/** Neutralise les injections d'en-tête dans les champs repris dans le courriel. */
function surUneLigne(string $valeur, int $max = 200): string
{
    return mb_substr(trim(preg_replace('/[\r\n]+/', ' ', $valeur) ?? ''), 0, $max);
}

function adresseIp(): string
{
    // Hostinger place un CDN devant le site : l'IP réelle arrive dans l'en-tête.
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $cle) {
        if (!empty($_SERVER[$cle])) {
            $brut = explode(',', (string) $_SERVER[$cle])[0];
            $ip = filter_var(trim($brut), FILTER_VALIDATE_IP);
            if ($ip !== false) {
                return $ip;
            }
        }
    }
    return 'inconnue';
}

function assurerRepertoire(string $chemin): bool
{
    if (is_dir($chemin)) {
        return true;
    }
    if (!@mkdir($chemin, 0750, true) && !is_dir($chemin)) {
        return false;
    }
    // Interdit l'accès web au journal, même si le répertoire est dans public_html.
    @file_put_contents(
        $chemin . '/.htaccess',
        "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n"
    );
    @file_put_contents($chemin . '/index.html', '');
    return true;
}

// ---------------------------------------------------------------------------
// Garde-fous de la requête
// ---------------------------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    repondre(405, 'methode', 'Méthode non autorisée.');
}

// L'origine doit correspondre au site : bloque les soumissions inter-domaines.
$origine = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origine !== '' && !in_array($origine, $config['origines_autorisees'], true)) {
    repondre(403, 'origine', 'Origine non autorisée.');
}

// Pot de miel : un champ caché rempli signale un robot. On répond « envoyé »
// pour ne pas lui indiquer qu'il a été détecté, sans rien traiter.
if (trim((string) ($_POST['entreprise_web'] ?? '')) !== '') {
    repondre(200, 'envoye', 'Votre demande a bien été envoyée.');
}

// Piège temporel : un formulaire rempli en moins de trois secondes est un robot.
$horodatage = (int) ($_POST['_t'] ?? 0);
if ($horodatage > 0 && (time() - $horodatage) < (int) $config['delai_minimal']) {
    repondre(200, 'envoye', 'Votre demande a bien été envoyée.');
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

$nom      = surUneLigne(nettoyer((string) ($_POST['nom'] ?? ''), 120));
$societe  = surUneLigne(nettoyer((string) ($_POST['societe'] ?? ''), 120));
$courriel = surUneLigne(nettoyer((string) ($_POST['courriel'] ?? ''), 180));
$tel      = surUneLigne(nettoyer((string) ($_POST['telephone'] ?? ''), 40));
$projet   = surUneLigne(nettoyer((string) ($_POST['projet'] ?? ''), 80));
$quantite = surUneLigne(nettoyer((string) ($_POST['quantite'] ?? ''), 60));
$message  = nettoyer((string) ($_POST['message'] ?? ''), 5000);
$consentement = isset($_POST['consentement']);

$erreurs = [];
if (mb_strlen($nom) < 2) {
    $erreurs['nom'] = 'Merci d’indiquer votre nom.';
}
if ($courriel === '' || !filter_var($courriel, FILTER_VALIDATE_EMAIL)) {
    $erreurs['courriel'] = 'Cette adresse e-mail ne semble pas valide.';
}
if (mb_strlen($message) < 10) {
    $erreurs['message'] = 'Décrivez votre projet en quelques mots.';
}
if (!$consentement) {
    $erreurs['consentement'] = 'Votre accord est nécessaire pour traiter la demande.';
}

if ($erreurs !== []) {
    if (attendJson()) {
        http_response_code(422);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            ['ok' => false, 'code' => 'validation', 'erreurs' => $erreurs],
            JSON_UNESCAPED_UNICODE
        );
        exit;
    }
    repondre(422, 'invalide', 'Certains champs doivent être corrigés.');
}

// ---------------------------------------------------------------------------
// Limitation de débit
// ---------------------------------------------------------------------------

$ip = adresseIp();
$repertoire = (string) $config['repertoire_data'];

if (assurerRepertoire($repertoire)) {
    $fichierDebit = $repertoire . '/debit-' . sha1($ip) . '.json';
    $fenetre = [];
    if (is_readable($fichierDebit)) {
        $decode = json_decode((string) @file_get_contents($fichierDebit), true);
        if (is_array($decode)) {
            $fenetre = $decode;
        }
    }
    $maintenant = time();
    $fenetre = array_values(array_filter(
        $fenetre,
        static fn($t): bool => is_int($t) && ($maintenant - $t) < 3600
    ));

    if (count($fenetre) >= (int) $config['max_par_heure']) {
        repondre(
            429,
            'trop_de_demandes',
            'Vous avez déjà envoyé plusieurs demandes récemment. Contactez-nous directement par téléphone.'
        );
    }

    $fenetre[] = $maintenant;
    @file_put_contents($fichierDebit, json_encode($fenetre), LOCK_EX);
}

// ---------------------------------------------------------------------------
// Persistance — AVANT l'envoi, pour ne jamais perdre une demande
// ---------------------------------------------------------------------------

$demande = [
    'recu_le'   => gmdate('c'),
    'nom'       => $nom,
    'societe'   => $societe,
    'courriel'  => $courriel,
    'telephone' => $tel,
    'projet'    => $projet,
    'quantite'  => $quantite,
    'message'   => $message,
    'ip'        => $ip,
    'agent'     => surUneLigne((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 200),
    'page'      => surUneLigne((string) ($_POST['page'] ?? ''), 200),
];

$journalEcrit = false;
if (assurerRepertoire($repertoire)) {
    $fichierJournal = $repertoire . '/demandes-' . gmdate('Y-m') . '.jsonl';
    $ligne = json_encode($demande, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($ligne !== false) {
        $journalEcrit = @file_put_contents($fichierJournal, $ligne . "\n", FILE_APPEND | LOCK_EX) !== false;
    }
}

// ---------------------------------------------------------------------------
// Envoi du courriel
// ---------------------------------------------------------------------------

$sujet = sprintf('Demande de devis — %s%s', $nom, $projet !== '' ? ' — ' . $projet : '');

$corps = implode("\n", [
    'Nouvelle demande de devis depuis le site.',
    '',
    'Nom        : ' . $nom,
    'Société    : ' . ($societe !== '' ? $societe : '—'),
    'E-mail     : ' . $courriel,
    'Téléphone  : ' . ($tel !== '' ? $tel : '—'),
    'Projet     : ' . ($projet !== '' ? $projet : '—'),
    'Quantité   : ' . ($quantite !== '' ? $quantite : '—'),
    'Page       : ' . ($demande['page'] !== '' ? $demande['page'] : '—'),
    '',
    'Message :',
    $message,
    '',
    '---',
    'Reçue le ' . gmdate('d/m/Y H:i') . ' UTC · IP ' . $ip,
]);

$entetes = [
    'From: ' . sprintf('=?UTF-8?B?%s?= <%s>', base64_encode((string) $config['nom_expediteur']), $config['expediteur']),
    'Reply-To: ' . sprintf('=?UTF-8?B?%s?= <%s>', base64_encode($nom), $courriel),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: beaunegravure.fr',
];

$sujetEncode = '=?UTF-8?B?' . base64_encode($sujet) . '?=';
$envoye = @mail(
    (string) $config['destinataire'],
    $sujetEncode,
    $corps,
    implode("\r\n", $entetes),
    '-f' . $config['expediteur']
);

// ---------------------------------------------------------------------------
// Réponse
// ---------------------------------------------------------------------------

if ($envoye) {
    repondre(200, 'envoye', 'Votre demande a bien été envoyée. Nous revenons vers vous rapidement.');
}

if ($journalEcrit) {
    // La demande est conservée : le visiteur est informé sans être inquiété,
    // et l'atelier la retrouvera dans le journal.
    repondre(
        200,
        'enregistre',
        'Votre demande a bien été enregistrée. Si vous n’avez pas de retour sous 48 heures, appelez-nous directement.'
    );
}

// Ni courriel ni journal : c'est le seul cas où l'on affiche une vraie erreur.
repondre(
    500,
    'echec',
    'Votre demande n’a pas pu être transmise. Merci de nous appeler ou de nous écrire directement.'
);
