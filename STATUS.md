# Boutiko — statut d'exécution

Dernière vérification : 2026-10-11.

## État confirmé
- [x] Dépôt GitHub : `Ernestdav2005/boutiko`, branche `main`.
- [x] Source applicative présente dans `src/index.js` et les fichiers `src/client/*.txt`.
- [x] Pull request des améliorations fusionnée : https://github.com/Ernestdav2005/boutiko/pull/2.
- [x] Validation Wrangler en mode dry-run réussie sur la branche de fonctionnalité.
- [x] Worker Cloudflare `boutiko` actif avec un déploiement à 100 % de la version 13, publiée le 2026-10-11 à 12:17 UTC.
- [x] Binding D1 `DB` vers `boutiko-db` confirmé.
- [x] Binding R2 `IMAGES` vers `boutiko-photos` confirmé.
- [x] Sous-domaine `workers.dev` activé.
- [x] Colonnes `gallery`, `theme` et `layout` présentes dans la table `shops`.
- [x] Données D1 existantes conservées lors des vérifications en lecture seule.
- [x] Workflow GitHub amélioré : l'identifiant de compte Cloudflare est explicite et l'absence du secret est signalée clairement.
- [ ] Secret GitHub Actions `CLOUDFLARE_API_TOKEN` à ajouter dans les paramètres du dépôt pour rendre les déploiements automatiques futurs opérationnels.
- [ ] Tests de bout en bout dans un navigateur réel : parcours d'inscription/connexion, création et modification d'une boutique, galerie, commande et espace propriétaire.
- [ ] Audit de sécurité dynamique complet et vérification de tous les cas limites.

## Ressources
- URL publique : https://boutiko.ernestdav2005.workers.dev
- Espace commerçant : https://boutiko.ernestdav2005.workers.dev/app
- Espace propriétaire : https://boutiko.ernestdav2005.workers.dev/admin
- D1 : `boutiko-db` / `c221c290-dae8-48a3-84fc-f42b3f530b17`.
- R2 lié au Worker : `boutiko-photos`. Le bucket `boutiko-images` existe également et n'a pas été supprimé.

## Blocage exact du déploiement automatique
Les logs GitHub Actions ont montré que `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` étaient tous deux vides. Wrangler a échoué parce que le secret `CLOUDFLARE_API_TOKEN` n'était pas configuré. Le workflow a été corrigé pour utiliser l'identifiant du compte connu et pour signaler clairement le secret manquant.

## À ne pas confondre
Le déploiement actif de la version 13 et la présence des nouvelles colonnes sont confirmés par l'API Cloudflare. Cela ne remplace pas des tests visuels et fonctionnels complets depuis un navigateur réel. Aucun bucket n'a été supprimé et aucune donnée métier n'a été modifiée pendant les requêtes de vérification.
