# Boutiko : plateforme de boutiques en ligne (commande WhatsApp)

Une seule application Cloudflare : site public des boutiques, espace du commerçant, espace administrateur.
Base de données : Cloudflare D1. Photos : Cloudflare R2. Aucun service payant ni extérieur.

## Fichiers du projet

| Fichier | Rôle |
|---|---|
| `wrangler.jsonc` | Réglages Cloudflare (nom de l'application, base de données, photos, nom de la plateforme) |
| `package.json` et `package-lock.json` | Liste des outils nécessaires (installés automatiquement) |
| `src/index.js` | Le serveur : comptes, boutiques, produits, photos, commandes, stock, administration |
| `src/client/app.txt` | Le tableau de bord du commerçant |
| `src/client/admin.txt` | L'espace administrateur |
| `src/client/shop.txt` | Le comportement de la page publique d'une boutique |
| `src/client/style.txt` | L'apparence (couleurs, boutons, mise en page téléphone) |

Les fichiers `.txt` sont du code envoyé au navigateur. Ne pas changer leur extension.

## Relier le dépôt GitHub à Cloudflare (une seule fois)

1. Dans Cloudflare : **Workers & Pages** → **Create application** → **Import a repository** (ou **Connect to Git**).
2. Choisir le compte GitHub et le dépôt de ce projet.
3. **Nom du projet : `boutiko`** (il doit être identique au champ `name` de `wrangler.jsonc`).
4. Commande de construction : laisser vide. Commande de déploiement : `npx wrangler deploy` (valeur par défaut).
5. Valider : Cloudflare publie l'application. À chaque nouvelle version envoyée sur GitHub, la publication se refait toute seule.

La base de données `boutiko-db` (D1) et le bucket `boutiko-photos` (R2) existent déjà sur le compte Cloudflare et sont déclarés dans `wrangler.jsonc`. Rien à créer.
Si le projet est déployé sur un autre compte Cloudflare, créer une base D1 et un bucket R2, puis remplacer `database_id`, `database_name` et `bucket_name` dans `wrangler.jsonc`.

## Premier démarrage et sécurité propriétaire

1. Ouvrir l'adresse de l'application (de la forme `https://boutiko.xxxxx.workers.dev`) puis `/app`.
2. Les inscriptions publiques créent uniquement des comptes commerçants : elles ne peuvent pas attribuer le rôle propriétaire.
3. Pour une **nouvelle base de données uniquement**, créer d'abord le compte propriétaire puis lui attribuer le rôle administrateur depuis la console D1, en remplaçant le numéro d'exemple par le numéro normalisé du compte :
   `UPDATE users SET is_admin=1 WHERE phone='229XXXXXXXX';`
4. L'espace propriétaire est à l'adresse `/admin` et utilise maintenant une connexion séparée de l'espace commerçant. L'accès aux données d'administration est contrôlé côté serveur ; cacher le lien ne suffit pas.

## Changer le nom de la plateforme

Dans `wrangler.jsonc`, modifier la valeur de `PLATFORM_NAME` (par exemple `"MonNom"`), puis publier.

## Formules (réglées dans `src/index.js`, section PLANS)

| Formule | Prix | Produits | Photos par produit | Espace photos | Logo et bannière |
|---|---|---|---|---|---|
| Essentiel | 2 000 FCFA | 30 | 1 | 10 Mo | logo ou photo oui; bannière non |
| Standard | 5 000 FCFA | 100 | 3 | 60 Mo | oui |
| Pro | 10 000 FCFA | 300 | 3 | 160 Mo | oui, sans mention de la plateforme |

Un nouveau commerçant démarre en Essentiel avec 7 jours d'essai. Dans l'espace administrateur : **Paiement reçu +30 jours** prolonge l'abonnement, on peut changer la formule, suspendre ou réactiver une boutique, et créer un mot de passe temporaire si un commerçant a oublié le sien.

## Limites de l'offre gratuite Cloudflare à surveiller

- 100 000 requêtes par jour pour toute l'application. Une visite d'une boutique compte une requête pour la page, plus une par photo affichée.
- 10 millisecondes de calcul par requête.
- 5 Go de base de données, 10 Go de photos.


## Personnalisation des boutiques

- Chaque commerçant peut choisir une couleur précise, un style visuel (Marché chic, Minimal, Élégant ou Audacieux) et une disposition des produits (grille, liste ou grandes cartes).
- La photo du commerçant ou le logo est disponible dans toutes les formules; la bannière reste réservée à Standard et Pro.
- La galerie de présentation peut contenir jusqu'à 5 photos du commerce, distinctes des photos de produits. Les images sont validées et rattachées au compte propriétaire de la boutique.
- Les nouvelles colonnes `gallery`, `theme` et `layout` sont ajoutées par migration D1 sans supprimer les boutiques ni les produits existants.

## Installation sur téléphone

Boutiko est une application web installable (PWA). Depuis l'accueil ou l'espace commerçant, utiliser **Installer Boutiko** / **Installer l'application** si le navigateur propose l'installation. Sur Android, Chrome permet aussi de passer par le menu ⋮ puis **Installer l'application** ou **Ajouter à l'écran d'accueil**. Il ne s'agit pas d'un fichier APK ni d'une application publiée sur le Play Store.
