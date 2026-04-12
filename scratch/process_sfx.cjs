const fs = require('fs');

const rawData = fs.readFileSync('d:/0CODE/AntiGravity/Cours_Memos/Docker/mp3/sfx_catalog.json', 'utf8');
const data = JSON.parse(rawData.replace(/^\uFEFF/, ''));

// Dictionnaire de traduction partiel pour de plus jolis noms
const dictionary = {
    "aggressive": "agressif", "dark": "sombre", "intro": "intro", "huge": "énorme",
    "hit": "coup", "future": "futuriste", "trailer": "cinématique", "punch": "frappe",
    "ancient": "antique", "lyre": "lyre", "appear": "apparition", "magic": "magie",
    "baby": "bébé", "crying": "pleurs", "band": "groupe", "hand": "main", "clap": "applaudissement",
    "battle": "bataille", "screaming": "hurlement", "solo": "seul", "moans": "gémissements",
    "old": "vieux", "men": "hommes", "beast": "bête", "growl": "grogne", "beer": "bière",
    "bottles": "bouteilles", "clink": "trinquer", "pouring": "verser", "glass": "verre",
    "strangled": "étranglé", "bone": "os", "crunching": "craquement", "bow": "arc", "release": "décoche",
    "breaking": "briser", "ice": "glace", "breath": "souffle", "stinger": "aiguillon",
    "bubbling": "bulles", "water": "eau", "burning": "en feu", "air": "air", "campfire": "feu de camp",
    "cat": "chat", "meow": "miaou", "cemetery": "cimetière", "wind": "vent", "chain": "chaîne",
    "noises": "bruits", "scary": "effrayant", "chipmunks": "écureuils", "laughs": "rires",
    "clear": "clair", "object": "objet", "clearing throat": "racle la gorge", "clock": "horloge",
    "ticking": "tic-tac", "slow": "lent", "close door": "fermer porte", "metal": "métal",
    "clown": "clown", "whistling": "sifflement", "coins": "pièces", "collision": "choc", "wood": "bois",
    "movement": "mouvement", "whoosh": "swoosh", "temple": "temple", "gongs": "gongs",
    "cooking": "cuisine", "oil": "huile", "sizzle": "grésillement", "dove": "colombe",
    "cough": "toux", "illness": "maladie", "craftef": "artisanal", "weapon": "arme",
    "crawling": "rampant", "worm": "vers", "creaking": "grincement", "noise": "bruit",
    "creepy": "effrayant", "laugh": "rire", "crossbow": "arbalète", "firing": "tir",
    "crowded": "foule", "place": "lieu", "tavern": "taverne", "crows": "corbeaux", "birds": "oiseaux",
    "footsteps": "bruits de pas", "snow": "neige", "crunchy": "croquant", "bite": "morsure",
    "man": "homme", "dagger": "dague", "drawn": "dégainer", "dart": "fléchette", "throw": "lancer",
    "deep": "profond", "sigh": "soupir", "demonic": "démoniaque", "spirit": "esprit", "voice": "voix",
    "dice": "dés", "roll": "lancer", "disappear": "disparition", "dog": "chien", "bark": "aboiement",
    "barking": "aboiement", "door": "porte", "crackling": "craquement", "opening": "ouverture",
    "drinking": "boire", "drop": "tomber", "coin": "pièce", "earth": "terre", "eerie": "étrange",
    "ghostly": "fantômatique", "event": "événement", "evil": "maléfique", "explosion": "explosion",
    "echo": "écho", "glass": "verre", "loud": "fort", "short": "court", "debris": "débris",
    "failure": "échec", "fairy": "fée", "particle": "particule", "sparkle": "scintillement",
    "fart": "pet", "female": "femme", "vampire": "vampire", "fire": "feu", "fireplace": "cheminée",
    "fist": "poing", "fight": "combat", "ghost": "fantôme", "breathing": "respiration",
    "sounds": "sons", "ghoul": "goule", "giant": "géant", "spider": "araignée", "walking": "marchant",
    "girl": "fille", "goblin": "gobelin", "grabbing": "attraper", "thing": "chose", "grass": "herbe",
    "snarl": "grognement", "hammer": "marteau", "stone": "pierre", "break": "casser",
    "happy": "heureux", "winning": "victoire", "heavy": "lourd", "unlocking": "déverrouiller",
    "sliding": "glissant", "injured": "blessé", "pain": "douleur", "reaction": "réaction",
    "horn": "cor", "grave": "grave", "announce": "annonce", "horse": "cheval", "carriage": "charrette",
    "galloping": "galop", "neigh": "hennissement", "trot": "trot", "crowd": "foule", "cheer": "célébration",
    "hurted": "blessé", "scream": "cri", "injury": "blessure", "woman": "femme", "inventory": "inventaire",
    "change": "changement", "item": "objet", "select": "sélection", "keys": "clés", "ring": "anneau",
    "catch": "attraper", "kids": "enfants", "school": "école", "kiss": "bisou", "knight": "chevalier",
    "attack": "attaque", "grunt": "grognement", "knock": "frapper", "wood": "bois", "rock": "rocher",
    "barrel": "tonneau", "crazy": "fou", "long": "long", "painful": "douloureux", "wet": "mouillé",
    "mad": "fou", "magical": "magique", "reveal": "révélation", "start": "début", "male": "mâle",
    "groan": "gémissement", "males": "mâles", "death": "mort", "material": "matériau", "underwater": "sous-marin",
    "fish": "poisson", "medieval": "médiéval", "bell": "cloche", "resonate": "résonner", "fanfare": "fanfare",
    "mischievous": "malicieux", "monster": "monstre", "biting": "mordant", "roar": "rugissement",
    "morning": "matin", "song": "chant", "move": "bouger", "cloud": "nuage", "spread": "propagation",
    "swipe": "balayage", "muffled": "étouffé", "angry": "en colère", "giggle": "gloussement",
    "munching": "mastication", "food": "nourriture", "music": "musique", "box": "boîte", "game": "jeu",
    "over": "fini", "fall": "chute", "once": "une fois", "out": "dehors", "owl": "hibou",
    "hooting": "hululement", "page": "page", "turn": "tourner", "paper": "papier", "rip": "déchirer",
    "fast": "rapide", "ripping": "déchirement", "person": "personne", "eating": "mangeant",
    "playful": "joueur", "drum": "tambour", "comedy": "comédie", "pop": "plop", "popup": "fenêtre",
    "possessed": "possédé", "power": "puissance", "powerful": "puissant", "spell": "sort",
    "purring": "ronronnement", "relieved": "soulagé", "spring": "ressort", "trap": "piège",
    "rooster": "coq", "crowing": "chantant", "scratching": "grattage", "shield": "bouclier",
    "block": "bloque", "shortsword": "épée courte", "shopkeeper": "marchand", "ethereal": "éthéré",
    "sound": "son", "splash": "éclaboussure", "shout": "cri", "tired": "fatigué", "single": "unique",
    "church": "église", "slap": "claque", "farty": "péteur", "cast": "lancement", "spin": "tourbillon",
    "squeak": "grincement", "toy": "jouet", "stomach": "estomac", "gurgle": "gargouillement",
    "strange": "étrange", "deaf": "sourd", "mystery": "mystère", "success": "succès", "sweet": "douce",
    "young": "jeune", "swing": "balancement", "sword": "épée", "fight": "combat", "sheathe": "rengainer",
    "slash": "entaille", "flesh": "chair", "unsheathe": "dégainer", "ambient": "ambiance",
    "throwing": "jetant", "clothes": "vêtements", "floor": "sol", "thunderstorm": "orage",
    "rain": "pluie", "tremor": "tremblement", "war": "guerre", "blast": "souffle", "war horn": "cor de guerre",
    "slide": "glisser", "down": "bas", "axe": "hache", "crawl": "ramper", "windy": "venteux",
    "day": "jour", "witch": "sorcière", "wolf": "loup", "howl": "hurlement", "tremble": "trembler",
    "write": "écrire", "crumple": "froisser", "writing": "écriture", "pen": "stylo", "signature": "signature",
    "zombie": "zombie", "moan": "gémissement", "bow release": "décochement d'arc"
};

function translateName(name) {
    let lowerName = name.toLowerCase();
    
    // Remplace certains tirets, etc.
    let words = lowerName.split(' ');
    let translated = words.map(w => dictionary[w] || w);
    
    // Capitalize first letter
    let finalStr = translated.join(' ');
    // Quelques corrections à la volée
    finalStr = finalStr.replace("farty", "péteur")
        .replace("toc sourd", "Toc sourd")
        .replace("pwit button", "Bouton Pwit")
        .replace("in nomine patris", "In Nomine Patris")
        .replace("hooo", "Oohh");
        
    return finalStr.charAt(0).toUpperCase() + finalStr.slice(1);
}

function categorize(filename) {
    const fn = filename.toLowerCase();
    
    if (fn.match(/magic|spell|fairy|appear|ghost|ethereal|dark-magic|crystal|myst|in-nomine/)) return "Magie & Surnaturel";
    if (fn.match(/sword|hit|punch|battle|bow|arrow|crossbow|shield|dagger|axe|fist|slap|fight|impact|weapon/)) return "Combat & Armes";
    if (fn.match(/wind|rain|storm|thunder|campfire|fire|water|ice|snow|ambient|cemetery|tavern|crowd|church|bell/)) return "Ambiance & Environnement";
    if (fn.match(/beast|growl|dog|cat|wolf|rooster|crow|bird|spider|monster|ghoul|zombie|vampire|goblin|horse|owl/)) return "Créatures & Animaux";
    if (fn.match(/door|coin|glass|bottle|beer|cooking|drink|eating|page|paper|write|pen|wood|stone|creak|chain|metal|key|clock/)) return "Objets & Interactions";
    if (fn.match(/laugh|scream|moan|cough|breath|cry|sigh|vomit|shout|fart|kiss|throat|huh|groan|voice/)) return "Voix & Émotions";
    if (fn.match(/braam|horn|lyre|drum|music|success|fanfare|dramatic|fail|ticking|event/)) return "Musique & Interface";
    
    return "Non classé";
}

const categorizedData = data.map(item => {
    return {
        filename: item.filename,
        frenchName: translateName(item.frenchName),
        sizeBytes: item.sizeBytes,
        duration: item.duration,
        category: categorize(item.filename)
    };
});

fs.writeFileSync('d:/0CODE/AIstudio/dnd5-azazel/src/data/sounds.json', JSON.stringify(categorizedData, null, 4));
console.log('Script done ! file written to d:/0CODE/AIstudio/dnd5-azazel/src/data/sounds.json');
