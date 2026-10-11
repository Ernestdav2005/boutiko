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

La base de données (D1) et le stockage des photos (R2) sont créés automatiquement au premier déploiement.
Si Cloudflare affiche une erreur à ce sujet :
- créer à la main une base D1 et un bucket R2 (noms libres) ;
- dans l'application → **Settings** → **Bindings** : ajouter une base D1 avec le nom de variable `DB`, et un bucket R2 avec le nom de variable `IMAGES` ;
- relancer un déploiement.

## Premier démarrage

1. Ouvrir l'adresse de l'application (de la forme `https://boutiko.xxxxx.workers.dev`) puis `/app`.
2. **Créer tout de suite le premier compte** : le premier compte créé devient l'administrateur (formule Pro, sans expiration). Faire cela avant de partager l'adresse à qui que ce soit.
3. L'espace administrateur est à l'adresse `/admin`.

## Changer le nom de la plateforme

Dans `wrangler.jsonc`, modifier la valeur de `PLATFORM_NAME` (par exemple `"MonNom"`), puis publier.

## Formules (réglées dans `src/index.js`, section PLANS)

| Formule | Prix | Produits | Photos par produit | Espace photos | Logo et bannière |
|---|---|---|---|---|---|
| Essentiel | 2 000 FCFA | 30 | 1 | 10 Mo | non |
| Standard | 5 000 FCFA | 100 | 3 | 60 Mo | oui |
| Pro | 10 000 FCFA | 300 | 3 | 160 Mo | oui, sans mention de la plateforme |

Un nouveau commerçant démarre en Essentiel avec 7 jours d'essai. Dans l'espace administrateur : **Paiement reçu +30 jours** prolonge l'abonnement, on peut changer la formule, suspendre ou réactiver une boutique, et créer un mot de passe temporaire si un commerçant a oublié le sien.

## Limites de l'offre gratuite Cloudflare à surveiller

- 100 000 requêtes par jour pour toute l'application. Une visite d'une boutique compte une requête pour la page, plus une par photo affichée.
- 10 millisecondes de calcul par requête.
- 5 Go de base de données, 10 Go de photos.
