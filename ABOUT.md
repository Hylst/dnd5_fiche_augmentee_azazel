# À Propos

L'application **D&D 5e - Fiche Interactive** a été conçue par **Geoffroy Streit (alias Hylst)**. 

Initialement créée pour concevoir la feuille de personnage d'Azazel Varn avec une mise en page soignée, son but principal est d'offrir une expérience de jeu fluide, interactive et immersive aux joueurs de Dungeons & Dragons 5e. 

Elle est développée dans le but d'évoluer vers un système complet pouvant accueillir et générer des fiches de personnage pour n'importe quelle classe ou race, en respectant purement les règles officielles du SRD 5e, tout en conservant une fluidité "Single Page Application".

L'interface s'inspire d'un design "Apple-like" croisé avec le monde du JDR : ombres douces, bords arrondis, et une palette de couleurs thématique (parchemin, or, encre, pourpre infernal) pour correspondre à l'ambiance du jeu tout en restant claire et lisible.

## Technologies Utilisées
- React 19 (Frontend performant)
- TypeScript (Typage robuste)
- Tailwind CSS (Styles et Design System)
- Zustand (Gestion d'état global complexe)
- Dexie (Interfaçage IndexedDB pour la persistance locale)
- Lucide React (Icônes UI)
- Vite (Outil de build)

## Architectures et Principes
L'application fonctionne en "Client-Side" complet, "Offline-First" et ne fait *aucun appel API externe* ni requête à des intelligences artificielles ou serveurs tiers. 

- **Persistance des données** : Les modifications de la fiche (Points de Vie, lancement de sorts, repos, ajout d'objets) sont sauvegardées de façon persistante dans le stockage local du navigateur (LocalStorage / IndexedDB via Zustand Persist).
- **Import/Export** : L'app intègre la possibilité d'exporter ses données en format JSON brut (pour transfert à une autre machine) ou en Markdown structuré pour de la lecture.

## Hébergement
L'application est conçue pour être hébergée sur n'importe quel service d'hébergement statique (Nginx, Vercel, Netlify, GitHub Pages) ou via un conteneur standard. Elle ne nécessite ni backend, ni base de données serveur.
