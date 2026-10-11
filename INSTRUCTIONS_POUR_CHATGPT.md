# Instructions pour ChatGPT : envoyer ce projet sur GitHub

Contexte : ce dossier est une application complète, testée, prête à être publiée par Cloudflare depuis GitHub. Ton rôle est uniquement de l'envoyer sur GitHub, sans rien modifier.

## À faire

1. Décompresser `boutiko-projet.zip`.
2. Envoyer **tous** les fichiers du dossier à la **racine** du dépôt GitHub indiqué par l'utilisateur, sur la branche `main`, en respectant exactement les chemins :
   - `wrangler.jsonc`
   - `package.json`
   - `package-lock.json`
   - `.gitignore`
   - `README.md`
   - `INSTRUCTIONS_POUR_CHATGPT.md`
   - `src/index.js`
   - `src/client/app.txt`
   - `src/client/admin.txt`
   - `src/client/shop.txt`
   - `src/client/style.txt`
3. Message de commit : `Boutiko : première version`.

## Règles strictes

- Ne modifie le contenu d'aucun fichier (pas de reformatage, pas de « correction », pas de renommage).
- Ne change pas l'extension des fichiers `.txt` : ce sont du code, pas des notes.
- N'ajoute aucun fichier (pas de `.env`, pas de clé secrète). Ce projet n'a besoin d'aucun secret.
- N'envoie pas les dossiers `node_modules` ni `.wrangler` s'ils existent.
- Si un fichier du dépôt porte déjà le même nom, remplace-le par la version du zip.
- Si tu ne peux pas ouvrir le zip ou envoyer un fichier, dis-le simplement à l'utilisateur sans essayer une autre méthode.

## Quand l'utilisateur apporte une correction

Il te donnera des fichiers corrigés. Remplace uniquement ces fichiers, au même chemin, avec le message de commit qu'il indique (ou `Correction`). Cloudflare republie automatiquement après chaque envoi.
