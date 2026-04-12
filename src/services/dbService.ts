import characterData from '../data/db/character_azazel.json';
import spellsData from '../data/allSpells.json';
import featsData from '../data/allFeats.json';
import traitsData from '../data/db/traits.json';
import itemsData from '../data/db/items.json';

// Types
import { Spell, Feat, Trait, Item } from '../store/characterStore';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCharacter = async (characterId: string) => {
  await delay(500); // Simulate network latency
  
  // Check localStorage first (Backend Ready simulation)
  const savedData = localStorage.getItem(`character_${characterId}`);
  if (savedData) {
    try {
      return JSON.parse(savedData);
    } catch (e) {
      console.error("Failed to parse saved character data", e);
    }
  }

  // Fallback to initial mock data
  if (characterId === 'char_azazel_01') {
    return characterData;
  }
  throw new Error('Character not found');
};

export const saveCharacter = async (characterId: string, data: any): Promise<void> => {
  await delay(300); // Simulate network latency for saving
  localStorage.setItem(`character_${characterId}`, JSON.stringify(data));
  console.log(`Character ${characterId} saved to mock backend.`);
};

export const fetchSpellsByIds = async (spellIds: string[]): Promise<Spell[]> => {
  await delay(100);
  return (spellsData as Spell[]).filter(spell => spellIds.includes(spell.id));
};

export const fetchFeatsByIds = async (featIds: string[]): Promise<Feat[]> => {
  await delay(100);
  return (featsData as Feat[]).filter(feat => featIds.includes(feat.id));
};

export const fetchTraitsByIds = async (traitIds: string[]): Promise<Trait[]> => {
  await delay(100);
  return (traitsData as Trait[]).filter(trait => traitIds.includes(trait.id));
};

export const fetchItemsByIds = async (inventory: { itemId: string, quantity: number, equipped: boolean }[]): Promise<Item[]> => {
  await delay(100);
  const itemIds = inventory.map(i => i.itemId);
  const items = (itemsData as any[]).filter(item => itemIds.includes(item.id));
  
  return items.map(item => {
    const invItem = inventory.find(i => i.itemId === item.id);
    return {
      ...item,
      quantity: invItem?.quantity || 1,
      equipped: invItem?.equipped || false
    };
  });
};
