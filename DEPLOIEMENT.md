# Déploiement sur Hostinger

Le site est **entièrement statique**. Le déploiement consiste à téléverser le
contenu de `dist/` dans le `public_html` du site Hostinger. Aucun runtime
Node.js n'est nécessaire ; seul PHP est utilisé, pour le formulaire de devis.

---

## 1. Préproduction — `dimgrey-caribou-115686.hostingersite.com`

### Construire

```bash
npm ci
npm run build:staging
```

Le build produit `dist/` avec :

- `robots.txt` en `Disallow: /` ;
- `noindex, nofollow` sur toutes les pages ;
- aucun `sitemap.xml`.

La préproduction ne peut donc pas concurrencer le domaine de production dans
l'index des moteurs.

### Téléverser

**Option A — Gestionnaire de fichiers hPanel**

1. hPanel → *Fichiers* → *Gestionnaire de fichiers*.
2. Ouvrir `public_html`, supprimer son contenu existant.
3. Compresser `dist/` en `dist.zip`, le téléverser, puis l'extraire dans
   `public_html`.
4. Vérifier que `.htaccess` et `api/contact.php` sont bien présents : les
   fichiers commençant par un point sont parfois masqués par défaut.

**Option B — FTP**

```bash
# Depuis la racine du projet
lftp -u "UTILISATEUR,MOT_DE_PASSE" ftp://ftp.hostinger.com -e "
  set ftp:ssl-force yes;
  set ftp:ssl-protect-data yes;
  mirror --reverse --delete --verbose dist/ public_html/;
  bye
"
```

> `--delete` supprime les fichiers absents du build. C'est voulu : sans cette
> option, les anciens fichiers restent servis indéfiniment.

**Option C — GitHub Actions** — voir la section 4.

### Configurer le formulaire

```bash
cd public_html/api
cp config.example.php config.php
```

Éditer `config.php` :

```php
'destinataire' => 'contact@beaunegravure.fr',
'expediteur'   => 'site@beaunegravure.fr',
```

Puis créer l'adresse `site@beaunegravure.fr` dans hPanel → *E-mails*, et activer
**SPF** et **DKIM** sur le domaine (hPanel → *DNS*). Sans cela, les demandes de
devis partiront très probablement en indésirables.

### Vérifier

```bash
curl -sI https://dimgrey-caribou-115686.hostingersite.com/ | head -20
curl -s  https://dimgrey-caribou-115686.hostingersite.com/robots.txt
curl -s  https://dimgrey-caribou-115686.hostingersite.com/ | grep -o '<meta name="robots"[^>]*>'
```

Attendu : `Disallow: /` dans `robots.txt` et `noindex, nofollow` dans le HTML.

Puis, dans un navigateur :

1. envoyer une **vraie demande de devis** et confirmer sa réception ;
2. vérifier que `api/.data/` a bien été créé et n'est pas accessible en HTTP
   (`https://…/api/.data/` doit renvoyer 403) ;
3. vérifier que `https://…/api/config.php` renvoie 403.

---

## 2. Production — `beaunegravure.fr`

> **Ne pas modifier le DNS avant validation complète de la préproduction.**
> Le domaine pointe actuellement sur un site Wix qui reste en ligne.

### Construire

```bash
npm ci
npm run build:prod
```

### Basculer

1. Téléverser `dist/` dans le `public_html` du site de production.
2. Recréer `api/config.php` sur ce nouvel hébergement.
3. Faire pointer le DNS de `beaunegravure.fr` vers Hostinger.
4. Émettre le certificat SSL (hPanel → *SSL*), attendre sa propagation.
5. Dans `public_html/.htaccess`, décommenter :
   - la redirection `www` → domaine nu ;
   - l'en-tête `Strict-Transport-Security`, **seulement une fois le HTTPS
     confirmé** — cet en-tête est difficilement réversible.

### Vérifier immédiatement après le basculement

```bash
curl -s https://beaunegravure.fr/robots.txt
curl -s https://beaunegravure.fr/ | grep -o '<meta name="robots"[^>]*>'
curl -s https://beaunegravure.fr/sitemap-index.xml | head -5
curl -sI https://beaunegravure.fr/ | grep -iE 'strict-transport|x-content-type|referrer-policy'
```

Attendu : `Allow: /`, `index, follow`, un sitemap valide, et les en-têtes de
sécurité.

### Puis

- Ajouter la propriété dans **Google Search Console** et soumettre
  `https://beaunegravure.fr/sitemap-index.xml`.
- Mettre à jour l'URL du site sur la **fiche Google Business Profile**.
- Mettre à jour le lien en bio Instagram.
- Envoyer une demande de devis réelle depuis un téléphone et confirmer la
  réception.

---

## 3. Redirections depuis l'ancien site Wix

Le site Wix actuellement en ligne possède ses propres URL, qui disparaîtront au
basculement. **Avant** de modifier le DNS :

1. Lister les URL indexées du site Wix (Search Console, ou
   `site:beaunegravure.fr` dans Google).
2. Établir la correspondance vers les nouvelles pages.
3. Ajouter les redirections permanentes dans `public/.htaccess`, avant le bloc
   des URL canoniques :

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^ancienne-url-wix/?$ /services/verres-graves/ [R=301,L]
    # … une ligne par URL
</IfModule>
```

4. Reconstruire et redéployer.

Sans cette étape, l'antériorité de référencement du site Wix est perdue.

---

## 4. Déploiement automatique (facultatif)

Un workflow GitHub Actions est fourni dans
`.github/workflows/deploy-hostinger.yml`. Il est **désactivé par défaut** : il ne
se déclenche que manuellement, depuis l'onglet *Actions*.

### Secrets à créer

*Settings → Secrets and variables → Actions → New repository secret*

| Secret | Valeur |
| --- | --- |
| `HOSTINGER_HOST` | Serveur FTP indiqué dans hPanel |
| `HOSTINGER_USERNAME` | Utilisateur FTP |
| `HOSTINGER_PASSWORD` | Mot de passe FTP |
| `HOSTINGER_PATH` | Chemin cible, généralement `public_html` ou `.` |

### Utilisation

*Actions* → *Déployer sur Hostinger* → *Run workflow* → choisir la cible
`staging` ou `production`.

Le workflow refuse de partir si `astro check` ou le contrôleur qualité échoue.
Il ne touche jamais à `api/config.php` ni à `api/.data/`.

---

## 5. Ce que le déploiement ne fait pas

- Il ne modifie **pas** le DNS.
- Il ne touche **pas** au site Wix.
- Il ne crée **pas** `api/config.php` : ce fichier vit uniquement sur le
  serveur, et contient l'adresse de destination des demandes.
- Il ne purge **pas** de cache : le site étant statique et les ressources
  versionnées par empreinte, seul le HTML doit être revalidé — ce que fait
  déjà l'en-tête `Cache-Control` défini dans `.htaccess`.

---

## 6. Retour arrière

Le site précédent reste intact tant que le DNS n'a pas été modifié. Après
basculement, revenir en arrière consiste à repointer le DNS vers Wix ; prévoir
un TTL DNS court (300 s) dans les jours qui précèdent l'opération pour que le
retour soit rapide si nécessaire.

Conserver une archive du `public_html` avant chaque déploiement de production :

```bash
# Depuis le gestionnaire de fichiers hPanel : compresser public_html
# ou en FTP :
lftp -u "UTILISATEUR,MOT_DE_PASSE" ftp://ftp.hostinger.com -e "mirror public_html/ sauvegarde-$(date +%F)/; bye"
```
