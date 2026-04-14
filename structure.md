# Architecture & Structure du Projet Fiches D&D 5e Augmentées (Azazel)

## 📁 Structure des fichiers (Vue d'ensemble)

Le projet suit une architecture front-end classique type React/Vite :

```
dnd5-azazel/
├── src/
│   ├── components/       # Composants d'UI (UI découpée en modules métier et fonctionnels)
│   ├── data/             # Fichiers JSON statiques (source de vérité "serveur" mockée)
│   ├── lib/              # Fonctions utilitaires, helpers
│   ├── services/         # Repository Pattern (Gestion de la persistance characterRepository.ts)
│   ├── store/            # État global Zustand (logique métier & interface de persistance)
│   ├── App.tsx           # Point d'entrée de l'application et Layout principal (Routing interne)
│   ├── main.tsx          # Point d'ancrage React vers le DOM
│   └── index.css         # Reset CSS, polices custom, et variables Tailwind
├── package.json          # Dépendances (React 19, Zustand, TailwindCSS, Dexie, Lucide-React, etc.)
├── README.md             # Documentation et notes de projet
├── ABOUT.md              # Description narrative, technologique et modules
├── CHANGELOG.md          # Historique des versions
└── custom_rules.md       # Règles de développement (Custom Instructions)
```

## 🧠 Logique et Principes Fondamentaux

1. **Frontend Only & Offline First** : Aucune base de données externe ni serveur API n'est requis. L'application tourne 100% côté client et garantit le fonctionnement sans connexion internet (Sauf pour l'audio streamé depuis Nginx statique).
2. **Gestion de l'État (Zustand)** : Le store Zustand est le cœur du projet. Les calculs (Armure, encombrement, etc.) s'y font, gardant les composants React passifs ("Dumb components").
3. **Automatisation Métier Centralisée** : La logique métier complexe (telle que l'évaluation des conditions pour les désavantages automatiques ou le compte-tours du Tracker Tactique) repose entièrement dans les actions du store plutôt que dans les composants UI.
4. **Persistance (Repository Pattern & Zustand)** : Les données du personnage sont gérées via `characterRepository.ts` qui centralise les accès au localStorage/IndexedDB. Le store Zustand reste la source de vérité en RAM et synchronise ses changements via ce repository.
5. **Dual Audio Engine & Architecture Événementielle** : Implémentation de deux instances audio indépendantes (`musicAudioRef` et `sfxAudioRef`) pour permettre la superposition de sons d'ambiance et d'effets sonores sans coupure. La communication entre composants isolés (comme l'avatar déclenchant une musique) s'effectue via un système découplé de `CustomEvent`, ce qui évite le "prop-drilling" complexe.
6. **A11y (Accessibilité)** : L'architecture privilégie désormais l'utilisation de balises sémantiques, d'attributs ARIA et d'une gestion complète de la navigation clavier sur tous les modules interactifs.
7. **Pas d'IA ou dépendances externes bloquantes** : Conformément à la philosophie, toutes les dépendances lourdes ou appels cloud sont absents pour garantir l'indépendance totale.

## 🗃️ Sources de Vérité

- **Données Initiales (Base de données statique)** : Fichiers JSON situés dans `src/data/` (`musics.json`, `sounds.json`, liste de sorts, liste d'objets, character initial `character_azazel.json`). L'application se base sur ces données au chargement ou à la réinitialisation.
- **État Utilisateur en Cours** : Le store Zustand (en RAM) durant la session de jeu.
- **Sauvegarde Permanente** : IndexedDB (via Dexie) / localStorage du navigateur de l'utilisateur servant à réhydrater Zustand au démarrage.

## 📦 Dépendances Clés

- **React 19** & **Vite** : Cœur du rendu et du build système.
- **TypeScript** : Pour un typage strict et limiter les erreurs d'incohérences de données.
- **Tailwind CSS** : Stylisation utility-first, sans fichiers CSS externes.
- **Zustand** : State manager léger, idéal pour des applications complexes comme une fiche de personnage.
- **Dexie.js** : Wrapper autour d'IndexedDB pour la persistance offline-first robuste.
- **Lucide React** : Librairie d'icônes unifiée.
