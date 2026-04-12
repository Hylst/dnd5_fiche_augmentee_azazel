# D&D 5e Interactive Character Sheet - Development Rules

Ce document sert de référence (Custom Instructions) pour tout agent IA ou développeur intervenant sur ce projet. Il garantit la cohérence technique et graphique du projet.

## 1. Vision et Finalité du Projet
* **Application "Offline-First"** : L'application fonctionne intégralement côté client (SPA locale). Les données utilisateur sont persistées via le stockage du navigateur (`Zustand + local storage`).
* **Zéro Dépendance Externe / Zéro IA** : Aucune API externe, aucune intégration d'IA (les restes de Google GenAI ont été supprimés), aucun pistage ni tracking. L'applicaton est 100% statique et sécurisée en local.
* **Déploiement Simplifié** : Prête pour un hébergement statique (ex: Nginx sous Docker/Coolify). Le build doit générer un strict dossier `dist` via Vite.

## 2. Architecture des Données
* **Base de données JSON Locale** : Les données de sorts (`allSpells.json`), objets (`items.json`), traits, et du personnage inicial (`character_azazel.json`) agissent comme la seule source de vérité serveur (mockée).
* **État Local (Zustand)** : `useCharacterStore` contient *toute* la logique métier (calculs de stats, CA, repos court/long, jets de dés, gestion des HP). Garder les composants React les plus "bêtes" (UI) possible en laissant la logique dans le store.
* **Fonctions Pures pour les calculs** : L'inventaire influence directement les stats finales (ex: le calcul dynamique de la *Classe d'Armure*). Tout ajout d'un système doit être déduit logiquement des objets.

## 3. Lignes Directrices UI / Design
* **Thématique D&D "Grimdark" / Premium** : 
  * Palettes : Parchemin (fonds), Encre (Textes normaux), Or/Cuivre et Rouge Sang (accents, critiques, alertes). 
  * Évitez l'incorporation de couleurs Flashy non-diégétiques.
* **Mobile-First mais Desktop-Proof** : L'interface est conçue primitivement comme une application mobile verticale (scrolling naturel, blocs sous forme de cartes d'UI), mais doit rester parfaitement lisible sur Desktop (menus latéraux non-intrusifs).
* **Feedback Utilisateur Immédiat** : Toujours fournir un feedback visuel aux actions (Toasts de notifications pour les critiques `Nat 20/Nat 1`, animations douces de jauge d'HP, historique des dés mis à jour en temps réel).

## 4. Règles de Code Strictes
* **TypeScript** : Respect strict du typage (interfaces `Item`, `Spell`, etc.). Pas de `any` ou d'approximations.
* **Tailwind CSS Uniquement** : Pas de CSS externe custom sauf pour les `@font-face` initiaux dans `index.css`. Reposer au maximum sur les variables définies (ex: `bg-parchemin`, `text-or`, `border-sang`).
* **Icons** : L'intégration d'icônes se fait obligatoirement via `lucide-react`.

## 5. Précautions / Interdits
* Ne pas ajouter de NPM modules lourds sans nécessité absolue (ex: base de données SQL en WASM, framework backend).
* Ne pas modifier le JSON d'Azazel `character_azazel.json` pour altérer ses statistiques de base afin de contourner un bug d'UI. (Le code s'adapte aux règles, on ne triche pas sur la fiche du perso).
