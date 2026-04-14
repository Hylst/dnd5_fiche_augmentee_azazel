# TODO

> Pas sans validation éclairée et reconfirmation du propriétaire.

---

## 🏗️ Structure & Architecture
- [ ] Généralisation du dispositif en une application capable de créer de A à Z des fiches pour **n'importe quel personnage D&D 5e**, suivant les règles officielles du SRD.
- [ ] Implémenter un véritable backend (Node.js/Express ou Firebase) pour la synchronisation multi-appareils.
- [ ] Créer un mode **"Maître du Jeu"** pour superviser les fiches de plusieurs joueurs simultanément.

---

## 🎲 Gameplay D&D 5e
- [x] Compléter la base de données des sorts D&D 5e (JSON statique étendu).
- [x] Intégrer les listes complètes d'équipements, armes magiques et leurs statistiques.
- [x] Permettre la création d'équipements / objets sur mesure.
- [x] Ajouter une gestion dynamique des **conditions & statuts** (Empoisonné, Charmé, Invisible…) via le `StatusModule`.
- [x] Lier les effets des conditions aux jets de dés (désavantage automatique sur fatigue/conditions).
- [x] Tracker tactique de combat rudimentaire (Cibles, AC estimée, Durée des buffs tactiques).
- [x] Calcul automatique de la CA en fonction de l'armure, du bouclier et du modificateur de DEX.
- [ ] Permettre l'ajout d'**images personnalisées** pour les objets de l'inventaire.

---

## 🎵 Audio & Ambiance
- [x] Soundboard SFX : catégorisation en 4 modes de vue (Top 20, Par Situation, Par Tension, Par Catégorie).
- [x] Favoris SFX : cœur par son, persistence `localStorage`, onglet dédié.
- [x] Bibliothèque musicale : 109 pistes Heroic Fantasy avec lecteur avancé.
- [x] Favoris musiques : persistence `localStorage`.
- [x] Tri musiques : 7 modes (Alpha, Favoris, Durée, BPM, Genre, Ambiance, Usage).
- [ ] Ajouter un **fondu enchaîné** (crossfade) entre deux musiques lors du changement de piste.
- [x] Permettre la **lecture simultanée** d'un SFX ponctuel par-dessus la musique de fond (Dual Audio Engine).
- [x] Déclenchement d'un thème musical spécifique au clic sur le portrait.
- [ ] Créer des **playlists** personnalisées sauvegardées localement.

---

## 🖥️ UX / UI
- [x] Implémenter un **mode Sombre (Dark Mode)** complet.
- [x] Notifications visuelles pour Nat 20 / Nat 1 dans le dé roller.
- [x] Historique des jets de dés filtrable et exportable.
- [x] Améliorer l'accessibilité (ARIA labels, navigation clavier complète) sur le SoundboardModule.
- [ ] Étendre l'accessibilité ARIA aux menus globaux et barres latérales.
- [ ] Responsive mobile amélioré pour la sidebar et les modules complexes.
