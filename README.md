# Fiches D&D 5e Augmentées

> Feuille de personnage interactive, moderne et **Offline-First** pour Dungeons & Dragons 5e.  
> Construite avec React 19, TypeScript et Tailwind CSS par **Geoffroy Streit (Hylst)**.

Aucun appel à des IA ou API externes. Tout fonctionne dans votre navigateur, avec import/export de vos données de JDR.

---

## ✨ Fonctionnalités

### Fiche de Personnage
- **Gestion Complète** : Statistiques, compétences, équipement, sorts, capacités, biographie.
- **Lanceur de Dés Intégré** : Cliquez sur n'importe quelle statistique pour lancer les dés automatiquement. Panneau flottant avec historique.
- **Grimoire Interactif** : Gestion des emplacements de sorts, filtrage par niveau/école, animations de lancement.
- **Catalogue d'Objets** : Base de données intégrée 50+ objets D&D 5e pour l'inventaire.
- **Montée de Niveau Assistée** : Modale interactive (PV, Caractéristiques, Sorts/Capacités).
- **Persistance Locale** : Sauvegarde automatique dans le navigateur (IndexedDB via Zustand).
- **Export Markdown/JSON** : Partagez votre fiche avec votre MJ.

### 🎵 Ambiance & Sons
- **Soundboard SFX** : 267 effets sonores en 4 vues (Top 20, Par Situation, Par Tension, Par Catégorie) avec système de **favoris persistants**.
- **Bibliothèque Musicale** : 109 compositions Heroic Fantasy originales (Geoffroy / Hylst) avec :
  - Lecteur "Now Playing" fixe (seekbar, loop, prev/next, volume)
  - 7 modes de tri (Alpha, Favoris, Durée, BPM, Genre, Ambiance, Usage)
  - Panneau de filtres + modal de détails avec métadonnées complètes
  - Système de **favoris musiques** persistants

---

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer en développement (http://localhost:3000)
npm run dev

# Build de production
npm run build
```

---

## 🐳 Déploiement (Docker / Nginx / Coolify)

Application SPA 100% statique — compatible avec tout hébergeur statique (Nginx, Vercel, Netlify, GitHub Pages, Coolify).

**Via Coolify :**
1. Créer un "Static Site" pointant sur ce dépôt.
2. Build Command : `npm run build` — Output Directory : `dist`

**Via Dockerfile :**
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🗂️ Structure du Projet

```
src/
├── components/          # Modules de l'application
│   ├── SoundboardModule.tsx   # Soundboard SFX + Bibliothèque Musicale
│   ├── SpellbookModule.tsx    # Grimoire interactif
│   ├── CombatModule.tsx       # Combat & attaques
│   └── ...
├── data/                # Données statiques JSON
│   ├── musics.json            # Métadonnées des 109 pistes musicales
│   ├── sfx_associations.json  # Organisation catégorielle des SFX
│   └── sounds.json            # Index des 267 effets sonores
├── store/               # Zustand (état global)
├── App.tsx              # Routing & sidebar
└── index.css            # Design system & animations
```

---

## 📄 Licence

Projet personnel — © Geoffroy Streit (Hylst). Usage libre pour sessions de JDR. Les musiques sont des compositions originales de l'auteur.
