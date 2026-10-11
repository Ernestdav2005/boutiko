# Boutiko — statut d'exécution

Dernière vérification : 2026-10-11.

## État
- [x] Dépôt GitHub accessible : `Ernestdav2005/boutiko`, branche `main`.
- [x] Archives originales retrouvées dans la bibliothèque de fichiers de ChatGPT.
- [x] Ressources Cloudflare interrogées.
- [x] Syntaxe du Worker compilé contrôlée par `node --check`.
- [ ] Source complète de l'application commitée dans ce dépôt.
- [ ] Configuration Wrangler autonome validée.
- [ ] Déploiement automatique GitHub Actions configuré et testé.
- [ ] Worker Cloudflare remplacé par le code Boutiko réel.
- [ ] Liaisons D1 (`DB`) et R2 (`IMAGES`) confirmées.
- [ ] Sous-domaine `workers.dev` activé et URL confirmée.
- [ ] Tests fonctionnels de bout en bout terminés.
- [ ] Tests de sécurité et d'abonnement terminés.

## Ressources observées
- D1 : `boutiko-db` / `c221c290-dae8-48a3-84fc-f42b3f530b17` / 0 table applicative.
- R2 : `boutiko-photos` et `boutiko-images` (doublon à examiner).
- Worker : `boutiko`, contenu récupéré « Hello world », aucun binding, `workers.dev` désactivé.

## Blocages prioritaires
1. Le dépôt ne contient pas le code applicatif.
2. Le Worker en ligne n'est pas l'application.
3. La configuration de déploiement et les bindings ne sont pas encore validés.

Ne pas annoncer Boutiko comme disponible en production avant d'avoir coché les tests et vérifié l'URL publique.
