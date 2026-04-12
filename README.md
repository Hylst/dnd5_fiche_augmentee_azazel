# D&D 5e Interactive Character Sheet

Une feuille de personnage interactive, moderne et "Offline First" pour Dungeons & Dragons 5e, construite avec React, TypeScript et Tailwind CSS par **Geoffroy Streit (Hylst)**.

L'application ne fait aucun appel à des intelligences artificielles ou API externes. Tout se trouve dans votre navigateur, avec système d'import / export de vos données de JDR.

## Fonctionnalités

- **Gestion Complète du Personnage** : Statistiques, compétences, équipement, sorts, et capacités.
- **Lanceur de Dés Intégré** : Cliquez sur n'importe quelle statistique, compétence ou attaque pour lancer les dés automatiquement. Un panneau flottant garde l'historique de vos lancers.
- **Grimoire Interactif** : Gestion des emplacements de sorts, filtrage, et animations de lancement.
- **Catalogue d'Objets** : Base de données intégrée pour ajouter facilement de l'équipement standard.
- **Montée de Niveau Assistée** : Modale interactive pour guider le joueur lors du passage au niveau supérieur.
- **Persistance Locale** : Les modifications sont sauvegardées automatiquement dans le navigateur (IndexedDB).
- **Export Markdown/JSON** : Sauvegardez et partagez votre fiche de personnage avec votre maître de jeu.

## Comment tester l'application en local ?

Pour tester le projet en local sur votre machine de développement :

1. Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé.
2. Clonez le dépôt et ouvrez un terminal dans le dossier du projet.
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
5. Ouvrez l'URL fournie (généralement `http://localhost:3000` ou `http://localhost:5173`) dans votre navigateur.

## Déploiement : Compatibilité Docker / Nginx via Coolify

Cette application est une **Single Page Application (SPA) 100% frontend**, ce qui signifie qu'elle produit uniquement des fichiers HTML, CSS et JS statiques lors de son "build". 

Elle est **parfaitement compatible** pour un déploiement dans un conteneur statique Nginx géré par Coolify sur un VPS.

### Étapes pour Coolify :
1. Dans Coolify, créez un nouveau projet et ajoutez un **"Static Site"** (généralement un preset Nixpacks ou Dockerfile).
2. Pointez Coolify vers votre dépôt Git.
3. Configurez les commandes de build :
   - Build Command : `npm run build`
   - Install Command : `npm install`
   - Publish Directory / Output Directory : `dist`
4. Laissez Coolify orchestrer la création du conteneur. Il embarquera un serveur Nginx minimaliste qui servira le dossier `dist` très rapidement.
   - *Note relative au routage : Bien qu'il s'agisse d'une SPA, les vues sont toutes chargées depuis `index.html`. Un serveur Nginx statique basique configuré par Coolify effectuera les bons routages.*

### Alternative (Docker natif)
Si vous souhaitez packager l'image vous-même via un Dockerfile à exposer sur Coolify :
```dockerfile
# Étape de build
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape de production
FROM nginx:alpine
# Copie des fichiers générés
COPY --from=build /app/dist /usr/share/nginx/html
# Configuration (optionnelle, selon vos besoins de routage SPA)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
