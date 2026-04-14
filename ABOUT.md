# À Propos — Fiches D&D 5e Augmentées

**Fiches D&D 5e Augmentées** a été conçue par **Geoffroy Streit (alias Hylst)**.

Initialement créée pour concevoir la feuille de personnage d'**Azazel Varn**, l'application a pour ambition d'offrir une expérience de jeu fluide, interactive et immersive aux joueurs de Dungeons & Dragons 5e. Elle évolue progressivement vers un système complet, capable de créer et gérer des fiches pour n'importe quelle classe ou race, en respectant les règles officielles du SRD 5e.

L'interface s'inspire d'un design "Apple-like" croisé avec le monde du JDR : ombres douces, bords arrondis, et une palette de couleurs thématique (parchemin, or, encre, pourpre infernal) pour correspondre à l'ambiance du jeu tout en restant claire et lisible.

---

## Technologies Utilisées

| Technologie | Rôle |
|---|---|
| React 19 | Frontend performant (composants, hooks) |
| TypeScript | Typage robuste |
| Tailwind CSS | Styles et Design System |
| Zustand | Gestion d'état global complexe |
| Dexie | Interfaçage IndexedDB (persistance locale) |
| Lucide React | Icônes UI |
| Vite | Outil de build rapide |

---

## Architecture & Principes

L'application fonctionne en **Client-Side complet, Offline-First**, et ne fait *aucun appel API externe* ni requête à des intelligences artificielles.

- **Persistance des données** : Points de Vie, sorts, objets, favoris audio — tout est sauvegardé dans le navigateur (LocalStorage / IndexedDB via Zustand Persist).
- **Import/Export** : Exportez votre fiche en JSON (transfert) ou en Markdown structuré (lecture partagée).
- **Audio Dual Engine** : L'application utilise deux instances audio séparées (`musicAudioRef` et `sfxAudioRef`) pour permettre la lecture simultanée de musiques et d'effets sonores, avec des contrôles de volume distincts.
- **Audio en streaming** : Les effets sonores (267 SFX) et les musiques (109 pistes Heroic Fantasy) sont streamés depuis `hylst.fr` sans téléchargement local.

---

## Modules Principaux

- **Vue Générale** : Stats, PV, repos, inspirations, XP, portrait interactif (déclencheur audio).
- **Combat & Tracker Tactique** : Attaques, CA, initiatives, suivi des cibles, compte-tours pour les buffs tactiques.
- **Lanceur de Dés Intelligent** : Lance les dés depuis n'importe quelle statistique. Détecte les conditions et l'épuisement pour appliquer automatiquement les désavantages (2d20, garde le pire).
- **Statuts & Conditions** : Module dédié pour gérer les conditions D&D (Aveuglé, Charmé, etc.) et les 6 niveaux d'épuisement.
- **Grimoire** : Gestion des emplacements et lancement de sorts, filtres.
- **Capacités** : Dons, traits de race, aptitudes de classe.
- **Inventaire** : Équipement, poids, encombrement, catalogue d'objets.
- **Histoire & Notes** : Biographie, liens, idéaux, défauts, notes libres.
- **Ambiance & Sons** : Architecture d'événements (CustomEvents), Soundboard SFX (267 sons, 4 vues, favoris), Bibliothèque Musicale (109 pistes, 7 tris, favoris, lecteur avancé).
- **Gestion des Données** : Import/Export JSON & Markdown.

---

## Hébergement

L'application est conçue pour être hébergée sur n'importe quel service d'hébergement statique (Nginx, Vercel, Netlify, GitHub Pages) ou via un conteneur standard. Elle ne nécessite ni backend, ni base de données serveur.
