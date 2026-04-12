# Changelog

## [1.1.0] - 2026-04-12
### Ajouté
- **SEO & Opengraph** : Méta tags et icone pour le partage sur les réseaux sociaux.
- **Gestion des Données** : Module revu pour se concentrer sur l'import / export (JSON et Markdown) de la fiche, assurant un vrai mode "Offline First".

### Modifié
- **Dé-couplage IA** : Suppression des dépendances à Google GenAI et de l'intégration AI Studio pour garantir que l'application ne fait aucun appel API externe.
- **Dons, Traits et Capacités** : Rendus permanents dans l'interface (suppression des boutons de corbeille) pour éviter les erreurs.
- **Inventaire** : Montant de pièces d'or par défaut ajusté à 200 po.
- **Sauvegarde** : Mise en place d'un système de persistance locale (PWA/IndexedDB via Zustand) pour sauvegarder les modifications du personnage en toute sécurité.

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
