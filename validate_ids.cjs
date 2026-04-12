const fs = require('fs');

const charData = JSON.parse(fs.readFileSync('src/data/db/character_azazel.json', 'utf8'));
const spellsData = JSON.parse(fs.readFileSync('src/data/allSpells.json', 'utf8'));
const featsData = JSON.parse(fs.readFileSync('src/data/allFeats.json', 'utf8'));
const traitsData = JSON.parse(fs.readFileSync('src/data/db/traits.json', 'utf8'));
const itemsData = JSON.parse(fs.readFileSync('src/data/db/items.json', 'utf8'));

const spellIds = new Set(spellsData.map(s => s.id));
const featIds = new Set(featsData.map(f => f.id));
const traitIds = new Set(traitsData.map(t => t.id));
const itemIds = new Set(itemsData.map(i => i.id));

console.log("Missing Spells:");
charData.knownSpellsIds.forEach(id => {
  if (!spellIds.has(id)) console.log(`- ${id}`);
});

console.log("\nMissing Feats:");
charData.knownFeatsIds.forEach(id => {
  if (!featIds.has(id)) console.log(`- ${id}`);
});

console.log("\nMissing Traits:");
charData.knownTraitsIds.forEach(id => {
  if (!traitIds.has(id)) console.log(`- ${id}`);
});

console.log("\nMissing Items:");
charData.inventory.forEach(i => {
  if (!itemIds.has(i.itemId)) console.log(`- ${i.itemId}`);
});
