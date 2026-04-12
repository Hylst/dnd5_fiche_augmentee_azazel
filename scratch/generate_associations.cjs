const fs = require('fs');

const sounds = JSON.parse(fs.readFileSync('d:/0CODE/AIstudio/dnd5-azazel/src/data/sounds.json', 'utf8'));

// 1. Catégorisation Primaire (Déjà déterminée mais on rassemble les noms de fichiers par catégorie)
const primaryCategories = {};
sounds.forEach(s => {
    if (!primaryCategories[s.category]) primaryCategories[s.category] = [];
    primaryCategories[s.category].push(s.filename);
});

// 2. Catégorisation Alternative 1 : Tension & Intensité
const tensionCategories = {
    "Basse Tension (Repos & Exploration)": [],
    "Tension Moyenne (Interaction & Mystère)": [],
    "Haute Tension (Action, Peur & Combat)": []
};

// 3. Catégorisation Alternative 2 : Situation / Scène RPG
const sceneCategories = {
    "Exploration & Voyage": [],
    "Social & Taverne": [],
    "Combat & Affrontement": [],
    "Donjon & Mystère": []
};

sounds.forEach(s => {
    const fn = s.filename.toLowerCase();
    
    // Remplissage Alternative 1 (Tension)
    if (fn.match(/scream|battle|hit|punch|strike|explosion|roar|braam|monster|ghoul|zombie|vampire|pain|hurt|dramatic|thunder|scary/)) {
        tensionCategories["Haute Tension (Action, Peur & Combat)"].push(s.filename);
    } else if (fn.match(/talk|laugh|door|coin|drink|eating|step|walk|creak|chain|click|lock|unlock/)) {
        tensionCategories["Tension Moyenne (Interaction & Mystère)"].push(s.filename);
    } else {
        tensionCategories["Basse Tension (Repos & Exploration)"].push(s.filename);
    }
    
    // Remplissage Alternative 2 (Situation)
    if (fn.match(/tavern|crowd|beer|glass|bottle|laugh|coin|bard|music|lyre|clap|cheer/)) {
        sceneCategories["Social & Taverne"].push(s.filename);
    } else if (fn.match(/sword|bow|arrow|hit|punch|battle|magic|spell|hurt|pain|roar|weapon/)) {
        sceneCategories["Combat & Affrontement"].push(s.filename);
    } else if (fn.match(/door|creak|chain|scary|ghost|eerie|monster|dark|unlock|trap|clock|ticking|stone/)) {
        sceneCategories["Donjon & Mystère"].push(s.filename);
    } else {
        sceneCategories["Exploration & Voyage"].push(s.filename);
    }
});

// 4. Liste des 12 sons les plus utiles
const top12 = [
    { rank: 1, filename: sounds.find(s => s.filename.includes("dice_roll"))?.filename || "dice_roll.mp3", reason: "Indispensable pour marquer les moments de tension (jets de sauvegarde, boss...)" },
    { rank: 2, filename: sounds.find(s => s.filename.includes("sword") && s.filename.includes("slash"))?.filename || "sword-slash.mp3", reason: "Un classique pour signifier une attaque au corps à corps réussie." },
    { rank: 3, filename: sounds.find(s => s.filename.includes("magic") || s.filename.includes("spell"))?.filename || "magic-spell.mp3", reason: "Idéal pour l'incantation d'un sort ou la découverte d'un objet magique." },
    { rank: 4, filename: sounds.find(s => s.filename.includes("hurt") || s.filename.includes("pain"))?.filename || "hit-injured-man-scream-pain.mp3", reason: "Pour marquer l'encaissement de gros dégâts d'un joueur ou d'un PNJ." },
    { rank: 5, filename: sounds.find(s => s.filename.includes("crossbow") || s.filename.includes("bow"))?.filename || "crossbow-firing.mp3", reason: "Indique une attaque à distance." },
    { rank: 6, filename: sounds.find(s => s.filename.includes("door-creaking") || s.filename.includes("door"))?.filename || "door-creaking.mp3", reason: "Ouverture de la porte du boss ou entrée dans un donjon mystérieux." },
    { rank: 7, filename: sounds.find(s => s.filename.includes("tavern") || s.filename.includes("crowd"))?.filename || "crowded_place-tavern.mp3", reason: "Crée immédiatement l'ambiance lors du retour en ville." },
    { rank: 8, filename: sounds.find(s => s.filename.includes("campfire"))?.filename || "campfire.mp3", reason: "Parfait pour rythmer les repos courts et les rp de nuit de garde." },
    { rank: 9, filename: sounds.find(s => s.filename.includes("roar") || s.filename.includes("growl"))?.filename || "beast_growl.mp3", reason: "Roll d'initiative ! Un monstre approche..." },
    { rank: 10, filename: sounds.find(s => s.filename.includes("coins"))?.filename || "coins.mp3", reason: "L'équipe trouve un trésor ou effectue une transaction importante." },
    { rank: 11, filename: sounds.find(s => s.filename.includes("success") || s.filename.includes("winning"))?.filename || "happy-winning.mp3", reason: "Réussite Critique (Nat 20) ou victoire d'un combat épique." },
    { rank: 12, filename: sounds.find(s => s.filename.includes("fail") || s.filename.includes("dramatic"))?.filename || "failure.mp3", reason: "Echec Critique (Nat 1), instaure un sentiment de perte ou de danger extrême." }
];

const output = {
    "primary_structuration": primaryCategories,
    "alternative_1_tension_intensity": tensionCategories,
    "alternative_2_rpg_scenes": sceneCategories,
    "top_12_most_useful_rpg_sounds": top12
};

fs.writeFileSync('d:/0CODE/AIstudio/dnd5-azazel/src/data/sfx_associations.json', JSON.stringify(output, null, 4), 'utf8');
console.log('Done! Generated association lists in src/data/sfx_associations.json');
