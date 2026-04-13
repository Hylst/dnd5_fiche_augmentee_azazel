# Changelog

## [1.2.0] - 2026-04-13
### Ajouté
- **Renommage de l'application** : Titre officiel mis à jour en **"Fiches D&D 5e Augmentées"** avec animation de défilement (marquee) dans la sidebar pour les titres longs.
- **Bibliothèque Musicale** (`SoundboardModule`) :
  - Lecteur "Now Playing" fixe en bas d'écran (seekbar, temps restant, volume, loop, prev/next).
  - **109 pistes** musicales Heroic Fantasy de Geoffroy (Hylst) streamées depuis `https://hylst.fr/hml/`.
  - Grille de cartes avec pochettes `.webp` et informations riches (BPM, genre, ambiance).
  - **7 modes de tri** : Alphabétique, Favoris, Durée, BPM, Genre, Ambiance, Usage.
  - **Panneau de filtres** : Ambiance, Usage, Genre.
  - **Modal de détails** : Toutes les métadonnées techniques et narratives.
  - **Système de favoris musiques** : Persistance via `localStorage` avec cœur interactif.
- **Effets Sonores** (`SoundboardModule`) :
  - **Top 20 indispensables** : Liste étendue de 12 à 20 sons avec 8 nouveaux (orage, hurlement de loup, dague, sort, disparition, foule, grincement, arbalète).
  - Passage à une grille 4 colonnes (lg) pour les 20 sons.
  - **Système de favoris SFX** : Cœur en coin haut-gauche de chaque bouton, persistance `localStorage`, nouvel onglet dédié "❤ Favoris (N)".
  - **Correction layout icônes** : Le cœur (haut-gauche) et le play (bas-droite) ne se superposent plus.

### Modifié
- **SEO** : `<title>`, OpenGraph et Twitter cards mis à jour avec le nouveau nom de l'application.
- **`sfx_associations.json`** : Clé `top_12_most_useful_rpg_sounds` → `top_20_most_useful_rpg_sounds`.

---

## [1.1.0] - 2026-04-12
### Ajouté
- **SEO & Opengraph** : Méta tags et icone pour le partage sur les réseaux sociaux.
- **Gestion des Données** : Module revu pour se concentrer sur l'import / export (JSON et Markdown) de la fiche, assurant un vrai mode "Offline First".

### Modifié
- **Dé-couplage IA** : Suppression des dépendances à Google GenAI et de l'intégration AI Studio pour garantir que l'application ne fait aucun appel API externe.
- **Dons, Traits et Capacités** : Rendus permanents dans l'interface (suppression des boutons de corbeille) pour éviter les erreurs.
- **Inventaire** : Montant de pièces d'or par défaut ajusté à 200 po.
- **Sauvegarde** : Mise en place d'un système de persistance locale (PWA/IndexedDB via Zustand) pour sauvegarder les modifications du personnage en toute sécurité.

---

## [1.0.0] - Initial Release
### Ajouté
- **Gestion de l'Encombrement** : Nouveau système visuel dans l'inventaire représentant le poids sous forme de cases (style RPG) avec alerte en cas de surcharge.
- **Module de Lancer de Dés (Dice Roller)** : Panneau flottant avec historique et lancers rapides (d4, d6, d8, d10, d12, d20).
- **Statistiques Interactives** : Les caractéristiques, jets de sauvegarde, compétences et attaques sont désormais cliquables pour lancer les dés automatiquement.
- **Catalogue d'Objets** : Base de données de plus de 50 objets D&D 5e intégrée à l'inventaire avec fonction de recherche.
- **Module de Repos** : Nouveau bloc centralisé dans la vue générale pour les repos courts et longs avec animations.
- **Grimoire Amélioré** : Affichage des statistiques de lancement de sorts (Caractéristique, DD, Bonus d'attaque) et animations lors du lancement.
- **Portrait Interactif** : Cliquer sur le portrait du personnage l'agrandit et joue une petite mélodie (arpège magique).
- **Montée de Niveau (Level Up)** : Nouvelle modale interactive guidant le joueur à travers les étapes de montée de niveau (PV, Caractéristiques/Dons, Sorts/Capacités).
