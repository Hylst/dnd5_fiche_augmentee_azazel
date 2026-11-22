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

  // Fallback to initial mock data, en reprenant d'abord l'ancien etat Zustand
  // (`dnd-character-storage`) quand la fiche n'avait jamais ete sauvegardee
  // par l'ancienne version. Les donnees restent dans le navigateur.
  if (characterId === 'char_azazel_01') {
    const persisted = localStorage.getItem('dnd-character-storage');
    if (persisted) {
      try {
        const state = JSON.parse(persisted)?.state;
        if (state?.identity?.name && state?.stats && state?.combat) {
          return {
            id: characterId,
            identity: state.identity,
            stats: state.stats,
            combat: state.combat,
            savingThrows: state.savingThrows || [],
            skills: state.skills || [],
            resources: state.resources || [],
            spellSlots: state.spellSlots || [],
            knownSpellsIds: (state.spells || []).map((spell: any) => spell.id),
            favoriteSpellsIds: (state.spells || []).filter((spell: any) => spell.isFavorite).map((spell: any) => spell.id),
            knownFeatsIds: (state.feats || []).map((feat: any) => feat.id),
            knownTraitsIds: (state.traits || []).map((trait: any) => trait.id),
            inventory: (state.inventory || []).map((item: any) => ({
              itemId: item.id,
              quantity: item.quantity,
              equipped: item.equipped,
            })),
            currency: state.currency || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
          };
        }
      } catch {
        // Etat persiste illisible : on garde la fiche modele.
      }
    }
    return characterData;
  }
  throw new Error('Character not found');
};

export const saveCharacter = async (characterId: string, data: any): Promise<void> => {
  await delay(300); // Simulate network latency for saving
  localStorage.setItem(`character_${characterId}`, JSON.stringify(data));
  console.log(`Character ${characterId} saved to mock backend.`);
};

export interface CharacterSummary {
  id: string;
  name: string;
}

const DEFAULT_CHARACTER_ID = 'char_azazel_01';

/** Liste les personnages enregistres dans ce navigateur, sans toucher au reste du stockage. */
export const listCharacters = (): CharacterSummary[] => {
  const found = new Map<string, string>();
  const fallbackName = (characterData as any)?.identity?.name || 'Azazel Varn';
  const defaultDeleted = localStorage.getItem('dnd5_default_deleted') === '1';
  if (!defaultDeleted) found.set(DEFAULT_CHARACTER_ID, fallbackName);

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || !key.startsWith('character_')) continue;
    const id = key.slice('character_'.length);
    if (!id) continue;
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      found.set(id, data?.identity?.name || found.get(id) || id);
    } catch {
      found.set(id, found.get(id) || id);
    }
  }

  return [...found.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
};

/** Supprime la fiche d'un personnage ; les autres cles du navigateur restent intactes. */
export const deleteCharacter = (characterId: string): void => {
  localStorage.removeItem(`character_${characterId}`);
  if (characterId === DEFAULT_CHARACTER_ID) {
    localStorage.setItem('dnd5_default_deleted', '1');
  }
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
