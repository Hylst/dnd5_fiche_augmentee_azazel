# Contexte & Transition : Fiches D&D 5e Augmentées (Projet Azazel)

Ce document sert de point de sauvegarde et de transition pour initier une nouvelle session de développement sur le projet.

## 📌 État Actuel du Projet
**Fiches D&D 5e Augmentées** est une Single Page Application (SPA) moderne construite avec **React 19, TypeScript, Tailwind CSS et Zustand**. 
Actuellement, l'application est conçue avec une philosophie **100% Front-End et "Offline First"**. Toutes les données du personnage (stats, inventaire, grimoire, favoris audio) sont sauvegardées localement dans le navigateur de l'utilisateur (via un wrapper `localStorage`/`IndexedDB`). 
L'application ne fait aucun appel à des bases de données externes ou à des API cloud (type IA), garantissant une confidentialité totale et une fiabilité à table, même sans connexion (bien que les médias audio soient streamés via Nginx statique).

## 🛠️ Réalisations Récentes (Dernière session)
- **Module Audio & Ambiance :** Immense mise à jour avec l'intégration d'une Soundboard (267 SFX) dont la grille "Top 12" est passée au "Top 20". Intégration d'un lecteur musical asynchrone avec 109 pistes Heroic Fantasy originales. Ajout d'un système de gestion de favoris (❤️) avec persistance.
- **Correction UX/UI :** Ajustement des layouts (boutons SFX pour éviter la superposition de l'icône lecture et du cœur). Rénovation complète de la modale d'information "À propos".
- **Déploiement Nginx (Sous-dossiers) :** Fix du routage de Vite.js (`base: './'`) et correction des chemins absolus (`/azazel.webp` en `./azazel.webp`) pour permettre d'héberger les fichiers `dist` compilés dans un sous-répertoire (ex: `https://hylst.fr/dnd5_fiche_azazel/`) sans générer d'erreurs 404 sur les assets.
- **Documentation :** Mise à jour intensive des fichiers `README.md`, `CHANGELOG.md`, `ABOUT.md` et `TODO.md`.

---

## 🎯 Objectifs de la Nouvelle Session

La prochaine étape de développement se concentrera sur 3 axes fondamentaux :

### 1. Audit et Correction des Incohérences
- Mener une revue de code (architecture, typage TS) et d'interface pour traquer les comportements inattendus, les redondances ou les "faux-positifs" React (comme les erreurs de `key` dans certains itérateurs).
- Vérifier la logique métier (calcul d'armure, de surcharge d'encombrement, et interactions entre les jets de dés et le grimoire).

### 2. Amélioration des Fonctionnalités et du Contenu
- Poursuivre le TODO actuel (Gérer les états/conditions comme *Empoisonné, Invisible*, implémenter un Dark Mode, autoriser des images d'objets persos).
- Élargir peu à peu le code pour le rendre agnostique à "Azazel", permettant de générer une fiche pour n'importe quelle autre classe à l'avenir.

### 3. Transition vers une Architecture "Backend-Ready"
- **Contrainte principale :** L'application **DOIT rester 100% Client-Side** pour le moment (aucune BDD ni serveur requis pour tourner).
- **Le chantier :** Refactoriser les services de données et le Store Zustand pour découpler totalement la logique métier de la logique de stockage locale. 
- **L'objectif :** Préparer des interfaces (API Contracts) et un pattern de type "Repository". Ainsi, le jour où nous voudrons greffer un backend (ex: NodeJS ou Supabase) pour synchroniser la fiche entre les joueurs et le Maître du Jeu, il suffira de "brancher" une nouvelle source de données sans avoir à réécrire l'interface ou les composants React.
