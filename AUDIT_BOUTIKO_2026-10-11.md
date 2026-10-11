# Audit initial Boutiko — 11 octobre 2026

## Portée et preuves examinées
- Dépôt GitHub `Ernestdav2005/boutiko`, branche `main`.
- Archive `boutiko-projet.zip` (52 779 octets) et archive `boutiko-envoi-direct.zip` (45 754 octets), retrouvées dans la bibliothèque de fichiers de la conversation.
- Ressources Cloudflare réellement interrogées : D1, Workers, R2, configuration et versions du Worker.
- L'audit statique n'est pas un test de sécurité indépendant ni un test de charge.

## Décisions produit visibles dans la source
- Application en français, responsive, destinée à permettre aux commerçants de créer une boutique en ligne et de recevoir les commandes via WhatsApp.
- Une boutique par compte commerçant, page publique par slug, produits/prix/promotion/stock, commandes, ventes directes, statistiques et export.
- QR code par boutique, servi par `GET /qr/:slug`, encodant l'URL publique de la boutique en SVG.
- Comptes par numéro de téléphone et mot de passe; le premier compte créé devient administrateur.
- Offres codées dans `src/index.js` : Essentiel 2 000 FCFA (30 produits, 1 photo, 10 Mo), Standard 5 000 FCFA (100 produits, 3 photos, 60 Mo), Pro 10 000 FCFA (300 produits, 3 photos, 160 Mo). Essai initial de 7 jours.
- Le paiement d'abonnement est administré manuellement par l'administrateur (« paiement reçu + jours »); aucune intégration de paiement automatique n'a été identifiée dans les routes inspectées.

## Archives disponibles
### `boutiko-projet.zip`
Contient `wrangler.jsonc`, `package.json`, `package-lock.json`, `README.md`, `INSTRUCTIONS_POUR_CHATGPT.md`, `src/index.js` et les quatre fichiers client `.txt` (app, admin, shop, style).
- Le serveur importe `qrcode-generator` et les fichiers clients en tant que texte.
- La configuration d'origine ne renseignait ni l'identifiant D1 ni le nom du bucket R2 : elle n'est donc pas suffisante pour un déploiement Wrangler autonome sans configuration supplémentaire.
### `boutiko-envoi-direct.zip`
Contient un fichier `worker.js` compilé et des instructions d'envoi direct.
- L'instruction « 85 contrôles réussis » est une affirmation du document; les journaux ou le détail de ces tests n'étaient pas inclus dans l'archive.
- La syntaxe JavaScript du fichier compilé a été contrôlée avec `node --check` et n'a pas produit d'erreur de syntaxe. Cela ne valide pas son comportement sur Cloudflare.

## État Cloudflare observé
- Compte utilisé : `Ernestdav2005@gmail.com's Account`.
- D1 `boutiko-db`, ID `c221c290-dae8-48a3-84fc-f42b3f530b17`; le relevé SQL ne montrait aucune table applicative, seulement `_cf_KV`.
- Deux buckets R2 existent : `boutiko-images` et `boutiko-photos`. L'archive et la configuration demandent `IMAGES` lié à `boutiko-photos`; il faut conserver un seul choix documenté.
- Worker `boutiko` existe, mais son contenu actuellement récupéré est uniquement `return new Response("Hello world")`.
- Le Worker n'a aucun binding; le sous-domaine `workers.dev` est désactivé; aucune URL publique active n'est donc confirmée.
- Deux versions du Worker sont visibles, déployées depuis le tableau de bord; aucune connexion automatique GitHub → Cloudflare n'est confirmée.
- Le dépôt GitHub est presque vide : seul `README.md` de 9 octets existe; un seul commit initial, branche `main`, taille déclarée 0.

## Risques et points à corriger avant ouverture publique
1. **Bloquant — source absente du dépôt** : la version applicative doit être versionnée dans GitHub avant d'activer un déploiement automatique fiable.
2. **Bloquant — Worker en place incorrect** : le Worker actuellement publié renvoie « Hello world », pas Boutiko.
3. **Bloquant — liaisons manquantes** : D1 et R2 doivent être liés avec les noms exacts `DB` et `IMAGES`.
4. **Bloquant — sous-domaine désactivé** : activer `workers.dev` après publication du vrai code et vérifier l'URL.
5. **Bloquant — schéma D1 vide** : le code source prévoit la création automatique des tables au premier appel, mais il faut vérifier que cette initialisation s'exécute réellement et ne pas considérer la base prête avant le test.
6. **Risque d'administration** : le premier compte créé devient administrateur. Il faut créer le compte propriétaire avant de diffuser le lien public; vérifier la course possible entre deux inscriptions initiales.
7. **Sécurité des mots de passe** : PBKDF2-SHA-256 est configuré à 10 000 itérations; ce paramètre est faible selon les standards actuels et doit être évalué avec les contraintes CPU du Worker avant la production.
8. **Paiements** : l'activation des abonnements semble manuelle; ne pas présenter Boutiko comme doté d'un paiement automatique tant que webhook, vérification serveur et tests de rejeu/échec n'existent pas.
9. **Configuration des imports** : les fichiers client portent volontairement l'extension `.txt`; la configuration de build doit les traiter comme texte.
10. **Tests absents** : aucun workflow CI, test automatisé, rapport de couverture ou journal des « 85 contrôles » n'a été trouvé dans le dépôt actuel.
11. **Ressources en double** : décider du sort de `boutiko-images` après vérification de son contenu; ne pas supprimer un bucket avant de confirmer qu'il est vide et inutilisé.
12. **Secrets** : aucun secret n'a été trouvé nécessaire dans la configuration de l'archive. Les éventuels futurs jetons de déploiement doivent rester dans les secrets GitHub, jamais dans le code.

## Plan de livraison contrôlé
1. Importer la source exacte de l'archive `boutiko-projet.zip` dans GitHub.
2. Corriger la configuration Wrangler pour relier D1 et R2 existants et traiter les imports texte.
3. Ajouter un workflow GitHub Actions qui déploie sur Cloudflare à chaque changement de source sur `main`.
4. Ajouter le secret GitHub `CLOUDFLARE_API_TOKEN` et la variable `CLOUDFLARE_ACCOUNT_ID` si elles ne sont pas déjà configurées. Ne pas publier de valeur secrète dans ce dépôt.
5. Déployer, activer `workers.dev`, vérifier la page d'accueil, les assets, `/app`, `/admin`, l'inscription du propriétaire, la création D1, l'upload R2 et le QR code.
6. Tester les flux métier et sécurité, puis conserver les résultats dans `STATUS.md`.

## Limite de ce rapport
Ce rapport décrit les faits observés au moment de l'audit. Aucun déploiement de la vraie application n'est déclaré réussi à ce stade.
