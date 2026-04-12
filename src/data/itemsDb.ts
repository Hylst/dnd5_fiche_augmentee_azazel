import { Item, Stat } from '../store/characterStore';

export const DND_ITEMS_DB: Omit<Item, 'id' | 'quantity' | 'equipped'>[] = [
  // Armes courantes (Mêlée)
  { name: "Gourdin", description: "Arme courante de mêlée.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d4", damageType: "contondant", stat: "FOR", isMagic: false, notes: "Légère" } },
  { name: "Dague", description: "Arme courante de mêlée.", weight: 0.5, category: "weapon", weaponStats: { damageDice: "1d4", damageType: "perforant", stat: "DEX", isMagic: false, range: "6m/18m", notes: "Finesse, légère, lancer" } },
  { name: "Gourdin de fer", description: "Arme courante de mêlée.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d6", damageType: "contondant", stat: "FOR", isMagic: false, notes: "Légère" } },
  { name: "Hachette", description: "Arme courante de mêlée.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d6", damageType: "tranchant", stat: "FOR", isMagic: false, range: "6m/18m", notes: "Légère, lancer" } },
  { name: "Javeline", description: "Arme courante de mêlée.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d6", damageType: "perforant", stat: "FOR", isMagic: false, range: "9m/36m", notes: "Lancer" } },
  { name: "Marteau léger", description: "Arme courante de mêlée.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d4", damageType: "contondant", stat: "FOR", isMagic: false, range: "6m/18m", notes: "Légère, lancer" } },
  { name: "Masse d'armes", description: "Arme courante de mêlée.", weight: 2, category: "weapon", weaponStats: { damageDice: "1d6", damageType: "contondant", stat: "FOR", isMagic: false } },
  { name: "Bâton", description: "Arme courante de mêlée.", weight: 2, category: "weapon", weaponStats: { damageDice: "1d6", damageType: "contondant", stat: "FOR", isMagic: false, notes: "Polyvalente (1d8)" } },
  { name: "Lance", description: "Arme courante de mêlée.", weight: 1.5, category: "weapon", weaponStats: { damageDice: "1d6", damageType: "perforant", stat: "FOR", isMagic: false, range: "6m/18m", notes: "Lancer, polyvalente (1d8)" } },
  
  // Armes courantes (Distance)
  { name: "Arbalète légère", description: "Arme courante à distance.", weight: 2.5, category: "weapon", weaponStats: { damageDice: "1d8", damageType: "perforant", stat: "DEX", isMagic: false, range: "24m/96m", notes: "Munitions, chargement, à deux mains" } },
  { name: "Arc court", description: "Arme courante à distance.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d6", damageType: "perforant", stat: "DEX", isMagic: false, range: "24m/96m", notes: "Munitions, à deux mains" } },
  { name: "Fléchette", description: "Arme courante à distance.", weight: 0.1, category: "weapon", weaponStats: { damageDice: "1d4", damageType: "perforant", stat: "DEX", isMagic: false, range: "6m/18m", notes: "Finesse, lancer" } },
  { name: "Fronde", description: "Arme courante à distance.", weight: 0, category: "weapon", weaponStats: { damageDice: "1d4", damageType: "contondant", stat: "DEX", isMagic: false, range: "9m/36m", notes: "Munitions" } },

  // Armes de guerre (Mêlée)
  { name: "Hache d'armes", description: "Arme de guerre de mêlée.", weight: 2, category: "weapon", weaponStats: { damageDice: "1d8", damageType: "tranchant", stat: "FOR", isMagic: false, notes: "Polyvalente (1d10)" } },
  { name: "Fléau d'armes", description: "Arme de guerre de mêlée.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d8", damageType: "contondant", stat: "FOR", isMagic: false } },
  { name: "Glaive", description: "Arme de guerre de mêlée.", weight: 3, category: "weapon", weaponStats: { damageDice: "1d10", damageType: "tranchant", stat: "FOR", isMagic: false, notes: "Lourde, allonge, à deux mains" } },
  { name: "Hallebarde", description: "Arme de guerre de mêlée.", weight: 3, category: "weapon", weaponStats: { damageDice: "1d10", damageType: "tranchant", stat: "FOR", isMagic: false, notes: "Lourde, allonge, à deux mains" } },
  { name: "Épée longue", description: "Arme de guerre de mêlée.", weight: 1.5, category: "weapon", weaponStats: { damageDice: "1d8", damageType: "tranchant", stat: "FOR", isMagic: false, notes: "Polyvalente (1d10)" } },
  { name: "Marteau de guerre", description: "Arme de guerre de mêlée.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d8", damageType: "contondant", stat: "FOR", isMagic: false, notes: "Polyvalente (1d10)" } },
  { name: "Rapière", description: "Arme de guerre de mêlée.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d8", damageType: "perforant", stat: "DEX", isMagic: false, notes: "Finesse" } },
  { name: "Épée courte", description: "Arme de guerre de mêlée.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d6", damageType: "perforant", stat: "DEX", isMagic: false, notes: "Finesse, légère" } },
  { name: "Épée à deux mains", description: "Arme de guerre de mêlée.", weight: 3, category: "weapon", weaponStats: { damageDice: "2d6", damageType: "tranchant", stat: "FOR", isMagic: false, notes: "Lourde, à deux mains" } },

  // Armes de guerre (Distance)
  { name: "Arc long", description: "Arme de guerre à distance.", weight: 1, category: "weapon", weaponStats: { damageDice: "1d8", damageType: "perforant", stat: "DEX", isMagic: false, range: "45m/180m", notes: "Munitions, lourde, à deux mains" } },
  { name: "Arbalète lourde", description: "Arme de guerre à distance.", weight: 9, category: "weapon", weaponStats: { damageDice: "1d10", damageType: "perforant", stat: "DEX", isMagic: false, range: "30m/120m", notes: "Munitions, chargement, lourde, à deux mains" } },
  { name: "Arbalète de poing", description: "Arme de guerre à distance.", weight: 1.5, category: "weapon", weaponStats: { damageDice: "1d6", damageType: "perforant", stat: "DEX", isMagic: false, range: "9m/36m", notes: "Munitions, chargement, légère" } },

  // Armures (Légères)
  { name: "Armure matelassée", description: "Armure légère (CA 11 + Dex). Désavantage en Discrétion.", weight: 4, category: "armor", armorStats: { baseAc: 11, type: "light", stealthDisadvantage: true } },
  { name: "Armure de cuir", description: "Armure légère (CA 11 + Dex).", weight: 5, category: "armor", armorStats: { baseAc: 11, type: "light" } },
  { name: "Cuir clouté", description: "Armure légère (CA 12 + Dex).", weight: 6.5, category: "armor", armorStats: { baseAc: 12, type: "light" } },

  // Armures (Intermédiaires)
  { name: "Peau de bête", description: "Armure intermédiaire (CA 12 + Dex max 2).", weight: 6, category: "armor", armorStats: { baseAc: 12, type: "medium" } },
  { name: "Chemise de mailles", description: "Armure intermédiaire (CA 13 + Dex max 2).", weight: 10, category: "armor", armorStats: { baseAc: 13, type: "medium" } },
  { name: "Armure d'écailles", description: "Armure intermédiaire (CA 14 + Dex max 2). Désavantage en Discrétion.", weight: 22.5, category: "armor", armorStats: { baseAc: 14, type: "medium", stealthDisadvantage: true } },
  { name: "Cuirasse", description: "Armure intermédiaire (CA 14 + Dex max 2).", weight: 10, category: "armor", armorStats: { baseAc: 14, type: "medium" } },
  { name: "Demi-plate", description: "Armure intermédiaire (CA 15 + Dex max 2). Désavantage en Discrétion.", weight: 20, category: "armor", armorStats: { baseAc: 15, type: "medium", stealthDisadvantage: true } },

  // Armures (Lourdes)
  { name: "Broigne", description: "Armure lourde (CA 14). Désavantage en Discrétion.", weight: 20, category: "armor", armorStats: { baseAc: 14, type: "heavy", stealthDisadvantage: true } },
  { name: "Cotte de mailles", description: "Armure lourde (CA 16). Force 13 requise. Désavantage en Discrétion.", weight: 27.5, category: "armor", armorStats: { baseAc: 16, type: "heavy", stealthDisadvantage: true, strengthRequirement: 13 } },
  { name: "Clibanion", description: "Armure lourde (CA 17). Force 15 requise. Désavantage en Discrétion.", weight: 30, category: "armor", armorStats: { baseAc: 17, type: "heavy", stealthDisadvantage: true, strengthRequirement: 15 } },
  { name: "Harnois", description: "Armure lourde (CA 18). Force 15 requise. Désavantage en Discrétion.", weight: 32.5, category: "armor", armorStats: { baseAc: 18, type: "heavy", stealthDisadvantage: true, strengthRequirement: 15 } },
  
  // Bouclier
  { name: "Bouclier", description: "Bouclier (+2 CA).", weight: 3, category: "armor", armorStats: { baseAc: 2, type: "shield" } },

  // Consommables
  { name: "Potion de soins", description: "Rend 2d4+2 points de vie.", weight: 0.25, category: "consumable" },
  { name: "Potion de soins majeurs", description: "Rend 4d4+4 points de vie.", weight: 0.25, category: "consumable" },
  { name: "Potion de soins supérieurs", description: "Rend 8d4+8 points de vie.", weight: 0.25, category: "consumable" },
  { name: "Potion de soins suprêmes", description: "Rend 10d4+20 points de vie.", weight: 0.25, category: "consumable" },
  { name: "Feu grégeois (flasque)", description: "Inflige 1d4 dégâts de feu par tour jusqu'à extinction.", weight: 0.5, category: "consumable" },
  { name: "Acide (fiole)", description: "Inflige 2d6 dégâts d'acide.", weight: 0.5, category: "consumable" },
  { name: "Eau bénite (flasque)", description: "Inflige 2d6 dégâts radiants à un fiélon ou mort-vivant.", weight: 0.5, category: "consumable" },
  { name: "Antitoxine (fiole)", description: "Avantage aux JdS contre le poison pendant 1 heure.", weight: 0, category: "consumable" },
  { name: "Rations (1 jour)", description: "Nourriture pour une journée.", weight: 1, category: "consumable" },

  // Outils
  { name: "Outils de voleur", description: "Permet de crocheter les serrures et désamorcer les pièges.", weight: 0.5, category: "tool" },
  { name: "Matériel de forgeron", description: "Outils d'artisan.", weight: 4, category: "tool" },
  { name: "Fournitures d'alchimiste", description: "Outils d'artisan.", weight: 4, category: "tool" },
  { name: "Ustensiles de cuisinier", description: "Outils d'artisan.", weight: 4, category: "tool" },
  { name: "Kit d'herboriste", description: "Permet de créer des potions de soins et des antidotes.", weight: 1.5, category: "tool" },
  { name: "Luth", description: "Instrument de musique.", weight: 1, category: "tool" },
  { name: "Flûte", description: "Instrument de musique.", weight: 0.5, category: "tool" },
  { name: "Kit de déguisement", description: "Permet de se créer un déguisement.", weight: 1.5, category: "tool" },
  { name: "Kit de contrefaçon", description: "Permet de créer de faux documents.", weight: 2.5, category: "tool" },

  // Équipement d'aventure (Misc)
  { name: "Sac à dos", description: "Peut contenir jusqu'à 15 kg.", weight: 2.5, category: "misc" },
  { name: "Sac de couchage", description: "Pour dormir à la belle étoile.", weight: 3.5, category: "misc" },
  { name: "Gamelle", description: "Pour cuisiner et manger.", weight: 0.5, category: "misc" },
  { name: "Boîte à amadou", description: "Pour allumer un feu.", weight: 0.5, category: "misc" },
  { name: "Torche", description: "Brûle pendant 1 heure, éclaire sur 6m.", weight: 0.5, category: "misc" },
  { name: "Corde en chanvre (15m)", description: "Corde solide.", weight: 5, category: "misc" },
  { name: "Corde en soie (15m)", description: "Corde légère et solide.", weight: 2.5, category: "misc" },
  { name: "Grappin", description: "Pour s'accrocher en hauteur.", weight: 2, category: "misc" },
  { name: "Pied-de-biche", description: "Avantage aux jets de Force pour ouvrir avec un levier.", weight: 2.5, category: "misc" },
  { name: "Piton", description: "Pour l'escalade.", weight: 0.1, category: "misc" },
  { name: "Menottes", description: "Pour entraver une créature.", weight: 3, category: "misc" },
  { name: "Outre", description: "Contient 2 litres de liquide.", weight: 2.5, category: "misc" },
  { name: "Bourse", description: "Contient jusqu'à 3 kg de pièces.", weight: 0.5, category: "misc" },
  { name: "Lanterne sourde", description: "Éclaire sur 18m, peut être masquée.", weight: 1, category: "misc" },
  { name: "Flasque d'huile", description: "Alimente une lanterne ou peut être jetée.", weight: 0.5, category: "misc" },

  // Objets magiques
  { name: "Sac sans fond", description: "Objet merveilleux, atypique. Peut contenir jusqu'à 250 kg pour un poids fixe de 7,5 kg.", weight: 7.5, category: "magic_item" },
  { name: "Cape d'elfe", description: "Objet merveilleux, atypique (harmonisation requise). Avantage en Discrétion.", weight: 0.5, category: "magic_item" },
  { name: "Bottes de sept lieues", description: "Objet merveilleux, atypique (harmonisation requise). Vitesse non réduite par l'encombrement, sauts triplés.", weight: 1.5, category: "magic_item" },
  { name: "Anneau de protection", description: "Anneau, rare (harmonisation requise). +1 à la CA et aux JdS.", weight: 0, category: "magic_item" },
  { name: "Baguette magique +1", description: "Baguette, peu commune. +1 aux jets d'attaque et de dégâts des sorts.", weight: 0.5, category: "magic_item" }
];
