import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchCharacter, fetchSpellsByIds, fetchFeatsByIds, fetchTraitsByIds, fetchItemsByIds } from '../services/dbService';

export type Stat = 'FOR' | 'DEX' | 'CON' | 'INT' | 'SAG' | 'CHA';
export type SkillType = 'EXP' | 'MAI' | 'TAT' | 'NONE';

export interface Skill {
  name: string;
  stat: Stat;
  type: SkillType;
  customBonus?: number;
}

export interface Resource {
  id: string;
  name: string;
  max: number;
  current: number;
  rechargeType: 'LR' | 'SR' | 'DAY';
  icon?: string;
}

export interface Spell {
  id: string;
  name: string;
  trad: string;
  level: number;
  school: string;
  isRitual: boolean;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  concentration: boolean;
  descriptionHtml: string;
  classes: string[];
  source: string;
  isPrepared: boolean;
  isFavorite: boolean;
}

export interface Trait {
  id: string;
  name: string;
  source: string; // e.g., 'Racial', 'Class', 'Background'
  descriptionHtml: string;
}

export interface Feat {
  id: string;
  name: string;
  trad: string;
  prerequisite: string;
  descriptionHtml: string;
  source: string;
}

export type ItemCategory = 'weapon' | 'armor' | 'consumable' | 'tool' | 'magic_item' | 'misc';

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  weight?: number;
  category: ItemCategory;
  equipped?: boolean;
  weaponStats?: {
    damageDice: string;
    damageType: string;
    stat: Stat;
    isMagic?: boolean;
    range?: string;
    notes?: string;
  };
  armorStats?: {
    baseAc: number;
    type: 'light' | 'medium' | 'heavy' | 'shield';
    stealthDisadvantage?: boolean;
    strengthRequirement?: number;
  };
}

export interface Currency {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface RollResult {
  id: string;
  timestamp: number;
  notation: string;
  result: number;
  rolls: number[];
  reason: string;
  isCriticalSuccess?: boolean;
  isCriticalFail?: boolean;
}

export type NotificationType = 'info' | 'critical' | 'critical-fail';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timestamp: number;
}

export interface CharacterState {
  identity: {
    name: string;
    nickname: string;
    race: string;
    subrace: string;
    class: string;
    subclass: string;
    level: number;
    xp: number;
    alignment: string;
    age: number;
    height: string;
    weight: string;
    eyes: string;
    skin: string;
    hair: string;
    origin: string;
    player: string;
    description: string;
    quote: string;
    notes: string;
    personalityTraits: string;
    ideals: string;
    bonds: string;
    flaws: string;
    spellcastingAbility?: Stat;
    proficiencies: {
      armor: string;
      weapons: string;
      tools: string;
      languages: string;
    };
  };
  stats: Record<Stat, number>;
  combat: {
    hpMax: number;
    hpCurrent: number;
    hpTemp: number;
    acBase: number;
    acBonus: number;
    initiativeBonus: number;
    speed: number;
    hitDiceMax: number;
    hitDiceCurrent: number;
    hitDiceType: string;
    inspiration: boolean;
  };
  skills: Skill[];
  savingThrows: Stat[]; // Proficient saving throws
  resources: Resource[];
  spells: Spell[];
  feats: Feat[];
  traits: Trait[];
  spellSlots: {
    level: number;
    max: number;
    current: number;
  }[];
  inventory: Item[];
  currency: Currency;
  isLoading: boolean;
  diceRolls: RollResult[];
  notifications: Notification[];
  
  // Actions
  addNotification: (message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
  loadCharacter: (id: string) => Promise<void>;
  loadCharacterFromJson: (data: any) => Promise<void>;
  getSerializableState: () => any;
  addXp: (amount: number) => void;
  levelUp: () => void;
  updateHp: (amount: number) => void;
  updateHpMax: (amount: number) => void;
  updateTempHp: (amount: number) => void;
  toggleInspiration: () => void;
  updateStat: (stat: Stat, value: number) => void;
  useResource: (id: string, amount?: number) => void;
  shortRest: () => void;
  longRest: () => void;
  castSpell: (spellId: string, slotLevel?: number) => void;
  toggleSpellFavorite: (spellId: string) => void;
  toggleSpellPrepared: (spellId: string) => void;
  toggleSpellSlot: (level: number, index: number) => void;
  addSpell: (spell: Spell) => void;
  removeSpell: (spellId: string) => void;
  addFeat: (feat: Feat) => void;
  removeFeat: (featId: string) => void;
  addTrait: (trait: Trait) => void;
  removeTrait: (traitId: string) => void;
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  toggleItemEquipped: (itemId: string) => void;
  updateCurrency: (currency: Partial<Currency>) => void;
  updateNotes: (notes: string) => void;
  rollDice: (notation: string, reason: string) => void;
  clearRolls: () => void;
}

const defaultState: Omit<CharacterState, 'addNotification' | 'removeNotification' | 'loadCharacter' | 'loadCharacterFromJson' | 'getSerializableState' | 'addXp' | 'levelUp' | 'updateHp' | 'updateHpMax' | 'updateTempHp' | 'toggleInspiration' | 'updateStat' | 'useResource' | 'shortRest' | 'longRest' | 'castSpell' | 'toggleSpellFavorite' | 'toggleSpellPrepared' | 'addSpell' | 'removeSpell' | 'toggleSpellSlot' | 'addFeat' | 'removeFeat' | 'addTrait' | 'removeTrait' | 'addItem' | 'removeItem' | 'updateItemQuantity' | 'toggleItemEquipped' | 'updateCurrency' | 'updateNotes' | 'rollDice' | 'clearRolls'> = {
  isLoading: true,
  notifications: [],
  identity: {
    name: '',
    nickname: '',
    race: '',
    subrace: '',
    class: '',
    subclass: '',
    level: 1,
    xp: 0,
    alignment: '',
    age: 0,
    height: '',
    weight: '',
    eyes: '',
    skin: '',
    hair: '',
    origin: '',
    player: '',
    description: '',
    quote: '',
    notes: '',
    personalityTraits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    spellcastingAbility: 'CHA',
    proficiencies: {
      armor: '',
      weapons: '',
      tools: '',
      languages: ''
    }
  },
  stats: {
    FOR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    SAG: 10,
    CHA: 10,
  },
  combat: {
    hpMax: 10,
    hpCurrent: 10,
    hpTemp: 0,
    acBase: 10,
    acBonus: 0,
    initiativeBonus: 0,
    speed: 9,
    hitDiceMax: 1,
    hitDiceCurrent: 1,
    hitDiceType: 'd8',
    inspiration: false,
  },
  savingThrows: [],
  skills: [],
  resources: [],
  spellSlots: [],
  spells: [],
  feats: [],
  traits: [],
  inventory: [],
  currency: {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: 200,
    pp: 0
  },
  diceRolls: []
};

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      
      loadCharacter: async (id: string) => {
        set({ isLoading: true });
        try {
          const charData = await fetchCharacter(id);
          const spells = await fetchSpellsByIds(charData.knownSpellsIds);
          
          // Set favorite/prepared status based on character data
          const hydratedSpells = spells.map(s => ({
            ...s,
            isFavorite: charData.favoriteSpellsIds?.includes(s.id) || false,
            isPrepared: true // Assuming all known are prepared for now, or add logic
          }));

          const feats = await fetchFeatsByIds(charData.knownFeatsIds);
          const traits = await fetchTraitsByIds(charData.knownTraitsIds);
          const inventory = await fetchItemsByIds(charData.inventory);

          set({
            identity: charData.identity,
            stats: charData.stats as Record<Stat, number>,
            combat: charData.combat,
            savingThrows: charData.savingThrows as Stat[],
            skills: charData.skills as any[],
            resources: charData.resources as any[],
            spellSlots: charData.spellSlots,
            currency: charData.currency,
            spells: hydratedSpells,
            feats,
            traits,
            inventory,
            isLoading: false
          });
        } catch (error) {
          console.error("Failed to load character:", error);
          set({ isLoading: false });
        }
      },

      loadCharacterFromJson: async (charData: any) => {
        set({ isLoading: true });
        try {
          const spells = await fetchSpellsByIds(charData.knownSpellsIds || []);
          
          const hydratedSpells = spells.map(s => ({
            ...s,
            isFavorite: charData.favoriteSpellsIds?.includes(s.id) || false,
            isPrepared: true
          }));

          const feats = await fetchFeatsByIds(charData.knownFeatsIds || []);
          const traits = await fetchTraitsByIds(charData.knownTraitsIds || []);
          const inventory = await fetchItemsByIds(charData.inventory || []);

          set({
            identity: charData.identity,
            stats: charData.stats as Record<Stat, number>,
            combat: charData.combat,
            savingThrows: charData.savingThrows as Stat[],
            skills: charData.skills as any[],
            resources: charData.resources as any[],
            spellSlots: charData.spellSlots,
            currency: charData.currency,
            spells: hydratedSpells,
            feats,
            traits,
            inventory,
            isLoading: false
          });
        } catch (error) {
          console.error("Failed to load character from JSON:", error);
          set({ isLoading: false });
        }
      },

      getSerializableState: () => {
        const state = get();
        return {
          id: "char_azazel_01", // Or dynamic if we support multiple characters
          identity: state.identity,
          stats: state.stats,
          combat: state.combat,
          savingThrows: state.savingThrows,
          skills: state.skills,
          resources: state.resources,
          spellSlots: state.spellSlots,
          knownSpellsIds: state.spells.map(s => s.id),
          favoriteSpellsIds: state.spells.filter(s => s.isFavorite).map(s => s.id),
          knownFeatsIds: state.feats.map(f => f.id),
          knownTraitsIds: state.traits.map(t => t.id),
          inventory: state.inventory.map(i => ({ itemId: i.id, quantity: i.quantity, equipped: i.equipped })),
          currency: state.currency
        };
      },

      addXp: (amount: number) => set((state) => ({
        identity: { ...state.identity, xp: state.identity.xp + amount }
      })),

      levelUp: () => set((state) => ({
        identity: { ...state.identity, level: state.identity.level + 1 }
      })),

      updateHp: (amount) => set((state) => {
        let newHp = state.combat.hpCurrent + amount;
        if (newHp > state.combat.hpMax) newHp = state.combat.hpMax;
        if (newHp < 0) newHp = 0;
        return { combat: { ...state.combat, hpCurrent: newHp } };
      }),
      
      updateHpMax: (amount) => set((state) => ({
        combat: { 
          ...state.combat, 
          hpMax: state.combat.hpMax + amount,
          hpCurrent: state.combat.hpCurrent + amount 
        }
      })),

      updateTempHp: (amount) => set((state) => ({
        combat: { ...state.combat, hpTemp: amount }
      })),
      
      toggleInspiration: () => set((state) => ({
        combat: { ...state.combat, inspiration: !state.combat.inspiration }
      })),
      
      updateStat: (stat, value) => set((state) => ({
        stats: { ...state.stats, [stat]: value }
      })),
      
      useResource: (id, amount = 1) => set((state) => ({
        resources: state.resources.map(r => 
          r.id === id ? { ...r, current: Math.min(r.max, Math.max(0, r.current - amount)) } : r
        )
      })),
      
      shortRest: () => set((state) => ({
        resources: state.resources.map(r => 
          r.rechargeType === 'SR' ? { ...r, current: r.max } : r
        )
      })),
      
      longRest: () => set((state) => ({
        combat: { ...state.combat, hpCurrent: state.combat.hpMax, hpTemp: 0 },
        resources: state.resources.map(r => ({ ...r, current: r.max })),
        spellSlots: state.spellSlots.map(s => ({ ...s, current: s.max }))
      })),
      
      castSpell: (spellId, slotLevel) => set((state) => {
        if (!slotLevel || slotLevel === 0) return state; // Cantrips don't use slots
        
        return {
          spellSlots: state.spellSlots.map(s => 
            s.level === slotLevel && s.current > 0 
              ? { ...s, current: s.current - 1 } 
              : s
          )
        };
      }),
      
      toggleSpellFavorite: (spellId) => set((state) => ({
        spells: state.spells.map(s => 
          s.id === spellId ? { ...s, isFavorite: !s.isFavorite } : s
        )
      })),
      
      toggleSpellPrepared: (spellId) => set((state) => ({
        spells: state.spells.map(s => 
          s.id === spellId ? { ...s, isPrepared: !s.isPrepared } : s
        )
      })),

      toggleSpellSlot: (level, index) => set((state) => ({
        spellSlots: state.spellSlots.map(s => {
          if (s.level !== level) return s;
          // If clicking an active slot, decrement current. If clicking an inactive slot, increment current.
          // Wait, a better way is to set current to index + 1 if clicking an inactive slot, 
          // or if clicking the highest active slot, decrement.
          // Let's just do: if index < current, set current to index. If index >= current, set current to index + 1.
          const newCurrent = index < s.current ? index : index + 1;
          return { ...s, current: newCurrent };
        })
      })),

      addNotification: (message, type = 'info') => set((state) => ({
        notifications: [...state.notifications, {
          id: Math.random().toString(36).substring(2, 9),
          message,
          type,
          timestamp: Date.now()
        }]
      })),

      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      addSpell: (spell) => set((state) => {
        if (state.spells.some(s => s.id === spell.id)) return state;
        return { spells: [...state.spells, spell] };
      }),

      removeSpell: (spellId) => set((state) => ({
        spells: state.spells.filter(s => s.id !== spellId)
      })),

      addFeat: (feat) => set((state) => {
        if (state.feats.some(f => f.id === feat.id)) return state;
        return { feats: [...state.feats, feat] };
      }),

      removeFeat: (featId) => set((state) => ({
        feats: state.feats.filter(f => f.id !== featId)
      })),

      addTrait: (trait) => set((state) => {
        if (state.traits.some(t => t.id === trait.id)) return state;
        return { traits: [...state.traits, trait] };
      }),

      removeTrait: (traitId) => set((state) => ({
        traits: state.traits.filter(t => t.id !== traitId)
      })),

      addItem: (item) => set((state) => {
        if (state.inventory.some(i => i.id === item.id)) return state;
        return { inventory: [...state.inventory, item] };
      }),

      removeItem: (itemId) => set((state) => ({
        inventory: state.inventory.filter(i => i.id !== itemId)
      })),

      updateItemQuantity: (itemId, quantity) => set((state) => ({
        inventory: state.inventory.map(i => 
          i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
        )
      })),

      toggleItemEquipped: (itemId) => set((state) => ({
        inventory: state.inventory.map(i => 
          i.id === itemId ? { ...i, equipped: !i.equipped } : i
        )
      })),

      updateCurrency: (currency) => set((state) => ({
        currency: { ...state.currency, ...currency }
      })),

      updateNotes: (notes) => set((state) => ({
        identity: { ...state.identity, notes }
      })),

      rollDice: (notation: string, reason: string) => set((state) => {
        // Simple parser for XdY+Z or XdY-Z
        const match = notation.replace(/\s+/g, '').match(/^(\d+)d(\d+)(?:([+-])(\d+))?$/i);
        if (!match) return state;

        const numDice = parseInt(match[1], 10);
        const diceFaces = parseInt(match[2], 10);
        const modifierSign = match[3];
        const modifier = match[4] ? parseInt(match[4], 10) : 0;

        const rolls = [];
        let total = 0;
        for (let i = 0; i < numDice; i++) {
          const r = Math.floor(Math.random() * diceFaces) + 1;
          rolls.push(r);
          total += r;
        }

        if (modifierSign === '+') total += modifier;
        if (modifierSign === '-') total -= modifier;

        let isCriticalSuccess = false;
        let isCriticalFail = false;
        
        if (diceFaces === 20) {
          if (rolls.includes(20)) isCriticalSuccess = true;
          if (rolls.includes(1)) isCriticalFail = true;
        }

        const newRoll: RollResult = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          notation,
          result: total,
          rolls,
          reason,
          isCriticalSuccess,
          isCriticalFail
        };

        const newNotifications = [...state.notifications];
        if (isCriticalSuccess) {
          newNotifications.push({
            id: Math.random().toString(36).substring(2, 9),
            message: `Réussite Critique ! (${reason})`,
            type: 'critical',
            timestamp: Date.now()
          });
        } else if (isCriticalFail) {
          newNotifications.push({
            id: Math.random().toString(36).substring(2, 9),
            message: `Échec Critique... (${reason})`,
            type: 'critical-fail',
            timestamp: Date.now()
          });
        }

        return { 
          diceRolls: [newRoll, ...state.diceRolls],
          notifications: newNotifications
        };
      }),

      clearRolls: () => set({ diceRolls: [] }),
    }),
    {
      name: 'dnd-character-storage',
    }
  )
);

export const calculateModifier = (score: number) => Math.floor((score - 10) / 2);
export const calculateProficiencyBonus = (level: number) => Math.ceil(level / 4) + 1;
