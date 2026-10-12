# Boutiko 3.0 — votre commerce, votre boutique en ligne

Application complète à installer sur Cloudflare Workers, D1 et R2. Ce dossier contient l’application, ses six modèles, ses photographies de démonstration, les sources, les migrations, les tests et les guides. Aucun compte Cloudflare réel n’a été consulté pendant sa construction et aucun déploiement distant n’a été effectué.

## Commencez ici

**Ouvrez [le guide de déploiement](docs/DEPLOIEMENT_DEBUTANT.md).** Il explique comment mettre les fichiers dans GitHub et déployer depuis l’interface, sans assembler de code.

1. Vérifiez les trois ressources Cloudflare indiquées dans le guide.
2. Téléversez le contenu de ce dossier à la racine de votre dépôt, en remplaçant les anciens fichiers.
3. Configurez les deux secrets GitHub, puis lancez l’action « Déployer Boutiko (manuel) ».
4. Créez votre compte sur le site publié et lancez « Activer le compte propriétaire (manuel) » avec votre numéro.
5. Ouvrez `/admin` et renseignez le support, l’identité de l’exploitant et vos formules.

Les anciens workflows de patch ne doivent pas rester dans votre dépôt : ils pourraient remplacer le nouveau code. La procédure de remplacement est détaillée dans le guide.

## Ce que vous recevez

- Site public de présentation, galerie avec six vrais aperçus et choix ordinateur/téléphone.
- Inscription, connexion, changement de mot de passe et sessions séparées pour le propriétaire.
- Tableau de bord commerçant, progression, personnalisation, aperçu privé, publication et partage par lien/QR.
- Produits, photos, catégories, prix, promotions, stock facultatif et ventes déclarées.
- Boutiques publiques, fiches produit, catégories, recherche et panier persistant.
- Commandes intégrées ou WhatsApp enregistrées au serveur, confirmation, préparation, livraison et annulation.
- Administration des boutiques, formules, quotas, accès, support et journal des actions.
- Application installable sur Android, avec écran d’information hors connexion. Les opérations nécessitent Internet.

**Aucun paiement en ligne n’est connecté.** Les demandes sont non payées. L’IA est facultative et désactivée par défaut ; son périmètre et sa connexion future sont décrits dans [IA_ET_PAIEMENTS.md](docs/IA_ET_PAIEMENTS.md).

## Les six univers

| Modèle | Commerce | Composition |
|---|---|---|
| Épure | Mode et accessoires | Éditorial, photographie verticale et tons terre |
| Botanica | Beauté et soins | Photographie en arche, sceau et rythme botanique |
| Pulse | Électronique | Bandeau sombre, contrastes et accents techniques |
| Terroir | Alimentation et produits locaux | Tons chauds, composition gourmande et catégories |
| Intérieur | Maison et décoration | Photographie immersive et cartouche éditorial |
| Atelier | Généraliste et créateurs | Blocs colorés, formes graphiques et esprit atelier |

Les aperçus et les boutiques publiées utilisent le même moteur de rendu. Les produits et les prix d’exemple sont explicitement fictifs.

## Tester sur un ordinateur

Installez Node.js 24, ouvrez un terminal dans ce dossier, puis :

```sh
npm ci
npm run verify
npm run dev
```

Ouvrez l’adresse indiquée, généralement `http://127.0.0.1:8787`. Les données locales sont distinctes de votre base Cloudflare.

Tests complémentaires :

```sh
npm run test:runtime
npx playwright install chromium
npm run test:visual
npm run deploy -- --dry-run
```

`verify` exécute le lint, une vérification de types des modules sécurité/configuration/images/modèles, les tests unitaires et la compilation. Le reste du projet demeure en JavaScript ; il n’est pas revendiqué comme intégralement typé.

## Les documents utiles

- [Aperçus des six modèles](docs/APERCUS.md)
- [Déploiement pour débutant](docs/DEPLOIEMENT_DEBUTANT.md)
- [Actions exactes à effectuer](docs/ACTIONS_RESTANTES.md)
- [Fonctions et limites](docs/FONCTIONS_ET_LIMITES.md)
- [Rapport des tests exécutés](docs/RAPPORT_TESTS.md)
- [Architecture, données et migration](docs/ARCHITECTURE_ET_MIGRATIONS.md)
- [Module IA et préparation des paiements](docs/IA_ET_PAIEMENTS.md)
- [Coûts et quotas Cloudflare](docs/COUTS_ET_QUOTAS.md)
- [Images et provenance](docs/IMAGES_ET_PROVENANCE.md)

Les documents placés dans `docs/history` proviennent de l’archive d’origine ou de son inventaire. Leurs anciennes affirmations ne constituent pas une vérification de votre compte actuel.
