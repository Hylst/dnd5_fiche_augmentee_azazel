import React, { useState } from 'react';
import { Backpack, Coins, Shield, Sword, Gem, Plus, Trash2, Wand2, Wrench, Beaker, MoreHorizontal, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCharacterStore, Item, ItemCategory } from '../store/characterStore';
import { DND_ITEMS_DB } from '../data/itemsDb';

const categoryIcons: Record<ItemCategory, React.ReactNode> = {
  weapon: <Sword className="w-4 h-4 text-cendre" />,
  armor: <Shield className="w-4 h-4 text-or" />,
  consumable: <Beaker className="w-4 h-4 text-rouge-sang" />,
  tool: <Wrench className="w-4 h-4 text-pourpre-infernal" />,
  magic_item: <Wand2 className="w-4 h-4 text-or-vif" />,
  misc: <MoreHorizontal className="w-4 h-4 text-noir-velours" />,
};

const categoryLabels: Record<ItemCategory, string> = {
  weapon: 'Armes',
  armor: 'Armures',
  consumable: 'Consommables',
  tool: 'Outils',
  magic_item: 'Objets Magiques',
  misc: 'Divers',
};

export function InventoryModule() {
  const { inventory, currency, stats, updateCurrency, updateItemQuantity, toggleItemEquipped, removeItem, addItem } = useCharacterStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Item>>({ category: 'misc', quantity: 1 });
  const [searchTerm, setSearchTerm] = useState('');

  const handleCurrencyChange = (type: keyof typeof currency, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateCurrency({ [type]: numValue });
    } else if (value === '') {
      updateCurrency({ [type]: 0 });
    }
  };

  const handleAddItem = () => {
    if (newItem.name) {
      addItem({
        id: `item_${Date.now()}`,
        name: newItem.name,
        description: newItem.description || '',
        quantity: newItem.quantity || 1,
        weight: newItem.weight,
        category: newItem.category as ItemCategory,
        equipped: false,
        weaponStats: newItem.weaponStats,
        armorStats: newItem.armorStats,
      });
      setIsAdding(false);
      setNewItem({ category: 'misc', quantity: 1 });
    }
  };

  const handleAddFromDb = (dbItem: Omit<Item, 'id' | 'quantity' | 'equipped'>) => {
    const existing = inventory.find(i => i.name === dbItem.name);
    if (existing) {
      updateItemQuantity(existing.id, existing.quantity + 1);
    } else {
      addItem({
        ...dbItem,
        id: `item_db_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        quantity: 1,
        equipped: false
      });
    }
  };

  // Group items by category
  const groupedInventory = inventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<ItemCategory, Item[]>);

  const categories: ItemCategory[] = ['weapon', 'armor', 'magic_item', 'tool', 'consumable', 'misc'];

  const itemsWeight = inventory.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0);
  const coinsCount = Object.values(currency).reduce((sum, count) => (sum as number) + ((count as number) || 0), 0) as number;
  const coinsWeight = coinsCount * 0.01; // 100 coins = 1 kg (approx 50 coins = 1 lb)
  const totalWeight = itemsWeight + coinsWeight;
  
  // Carrying capacity: FOR * 7.5 kg (approx 15 lbs)
  const carryingCapacity = stats.FOR * 7.5;
  const isOverweight = totalWeight > carryingCapacity;

  // Visual Slots Calculation (1 slot = 5 kg)
  const slotWeight = 5;
  const maxSlots = Math.ceil(carryingCapacity / slotWeight);
  const filledSlots = Math.ceil(totalWeight / slotWeight);

  const filteredDbItems = searchTerm.trim() === '' 
    ? [] 
    : DND_ITEMS_DB.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryLabels[item.category].toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);

  return (
    <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b-2 border-or/30 pb-2">
        <h2 className="font-title-alt text-2xl text-pourpre-infernal flex items-center gap-2">
          <Backpack className="w-6 h-6 text-or" />
          Inventaire & Équipement
        </h2>
      </div>

      {/* Encumbrance Visualizer */}
      <div className="mb-6 bg-parchemin p-3 rounded-lg border border-or/20 shadow-inner">
        <div className="flex justify-between items-center mb-2">
          <span className="font-section text-xs uppercase text-cendre">Encombrement (1 case = {slotWeight} kg)</span>
          <span className={cn("font-numbers text-sm", isOverweight ? "text-rouge-sang font-bold" : "text-encre")}>
            {totalWeight.toFixed(1)} / {carryingCapacity} kg
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: Math.max(maxSlots, filledSlots) }).map((_, i) => {
            const isFilled = i < filledSlots;
            const isOver = i >= maxSlots;
            return (
              <div 
                key={i}
                className={cn(
                  "w-5 h-5 rounded-sm border transition-colors",
                  isFilled 
                    ? isOver 
                      ? "bg-rouge-sang border-rouge-sang/50 shadow-[0_0_5px_rgba(153,27,27,0.5)]" 
                      : "bg-or-vif border-or shadow-[0_0_5px_rgba(201,147,58,0.3)]"
                    : "bg-noir-velours/5 border-or/20"
                )}
                title={isFilled ? isOver ? "Surcharge" : "Rempli" : "Vide"}
              />
            );
          })}
        </div>
        {isOverweight && (
          <p className="text-xs text-rouge-sang mt-2 font-body italic">
            Vous êtes encombré ! Votre vitesse est réduite de 3m.
          </p>
        )}
      </div>

      {/* Money */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {[
          { label: 'PC', key: 'cp', value: currency.cp, color: 'text-orange-800', bg: 'bg-orange-800/10 border-orange-800/30' },
          { label: 'PA', key: 'sp', value: currency.sp, color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/30' },
          { label: 'PE', key: 'ep', value: currency.ep, color: 'text-blue-300', bg: 'bg-blue-300/10 border-blue-300/30' },
          { label: 'PO', key: 'gp', value: currency.gp, color: 'text-or-vif', bg: 'bg-or-vif/10 border-or-vif/30' },
          { label: 'PP', key: 'pp', value: currency.pp, color: 'text-purple-300', bg: 'bg-purple-300/10 border-purple-300/30' },
        ].map((coin) => (
          <div key={coin.label} className={cn("flex flex-col items-center justify-center p-2 rounded-lg border-2 shadow-sm", coin.bg)}>
            <Coins className={cn("w-5 h-5 mb-1", coin.color)} />
            <input 
              type="number" 
              value={coin.value || ''} 
              onChange={(e) => handleCurrencyChange(coin.key as any, e.target.value)}
              className="w-full bg-transparent text-center font-numbers text-lg text-encre focus:outline-none"
              min="0"
            />
            <span className="font-section text-[10px] uppercase text-cendre">{coin.label}</span>
          </div>
        ))}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 px-3 py-1.5 bg-or/10 hover:bg-or/20 border border-or/30 rounded text-sm font-section uppercase text-pourpre-infernal transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter un objet
          </button>
        </div>

        {isAdding && (
          <div className="p-4 bg-parchemin border border-or/30 rounded-lg space-y-3 shadow-inner">
            <h4 className="font-body font-bold text-pourpre-infernal text-sm border-b border-or/20 pb-1">Nouvel objet</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nom de l'objet"
                value={newItem.name || ''}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="col-span-2 bg-white/50 border border-or/20 rounded px-3 py-1.5 text-sm font-body text-encre focus:outline-none focus:border-or/50"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value as ItemCategory })}
                className="bg-white/50 border border-or/20 rounded px-3 py-1.5 text-sm font-body text-encre focus:outline-none focus:border-or/50"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <span className="text-sm font-section uppercase text-cendre">Qté:</span>
                <input
                  type="number"
                  min="1"
                  value={newItem.quantity || 1}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white/50 border border-or/20 rounded px-3 py-1.5 text-sm font-numbers text-encre focus:outline-none focus:border-or/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-section uppercase text-cendre">Poids:</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={newItem.weight || ''}
                  onChange={(e) => setNewItem({ ...newItem, weight: parseFloat(e.target.value) || undefined })}
                  className="w-full bg-white/50 border border-or/20 rounded px-3 py-1.5 text-sm font-numbers text-encre focus:outline-none focus:border-or/50"
                  placeholder="kg"
                />
              </div>
              <input
                type="text"
                placeholder="Description / Effets"
                value={newItem.description || ''}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="col-span-2 bg-white/50 border border-or/20 rounded px-3 py-1.5 text-sm font-body text-encre focus:outline-none focus:border-or/50"
              />

              {/* Weapon Stats */}
              {newItem.category === 'weapon' && (
                <div className="col-span-2 grid grid-cols-2 gap-3 p-3 bg-or/5 border border-or/20 rounded">
                  <h5 className="col-span-2 text-xs font-section uppercase text-pourpre-infernal">Attributs de l'arme</h5>
                  <input
                    type="text"
                    placeholder="Dégâts (ex: 1d8)"
                    value={newItem.weaponStats?.damageDice || ''}
                    onChange={(e) => setNewItem({ ...newItem, weaponStats: { ...newItem.weaponStats, damageDice: e.target.value } as any })}
                    className="bg-white/50 border border-or/20 rounded px-3 py-1.5 text-sm font-body text-encre focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Type (ex: Tranchant)"
                    value={newItem.weaponStats?.damageType || ''}
                    onChange={(e) => setNewItem({ ...newItem, weaponStats: { ...newItem.weaponStats, damageType: e.target.value } as any })}
                    className="bg-white/50 border border-or/20 rounded px-3 py-1.5 text-sm font-body text-encre focus:outline-none"
                  />
                  <select
                    value={newItem.weaponStats?.stat || 'FOR'}
                    onChange={(e) => setNewItem({ ...newItem, weaponStats: { ...newItem.weaponStats, stat: e.target.value as any } as any })}
                    className="bg-white/50 border border-or/20 rounded px-3 py-1.5 text-sm font-body text-encre focus:outline-none"
                  >
                    <option value="FOR">Force (FOR)</option>
                    <option value="DEX">Dextérité (DEX)</option>
                    <option value="INT">Intelligence (INT)</option>
                    <option value="SAG">Sagesse (SAG)</option>
                    <option value="CHA">Charisme (CHA)</option>
                  </select>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newItem.weaponStats?.isMagic || false}
                      onChange={(e) => setNewItem({ ...newItem, weaponStats: { ...newItem.weaponStats, isMagic: e.target.checked } as any })}
                      className="rounded border-or/20 text-pourpre-infernal focus:ring-pourpre-infernal"
                    />
                    <span className="text-sm font-body text-encre">Arme Magique</span>
                  </label>
                </div>
              )}

              {/* Armor Stats */}
              {newItem.category === 'armor' && (
                <div className="col-span-2 grid grid-cols-2 gap-3 p-3 bg-or/5 border border-or/20 rounded">
                  <h5 className="col-span-2 text-xs font-section uppercase text-pourpre-infernal">Attributs de l'armure</h5>
                  <input
                    type="number"
                    placeholder="CA de base (ex: 14)"
                    value={newItem.armorStats?.baseAc || ''}
                    onChange={(e) => setNewItem({ ...newItem, armorStats: { ...newItem.armorStats, baseAc: parseInt(e.target.value) || 0 } as any })}
                    className="bg-white/50 border border-or/20 rounded px-3 py-1.5 text-sm font-numbers text-encre focus:outline-none"
                  />
                  <select
                    value={newItem.armorStats?.type || 'light'}
                    onChange={(e) => setNewItem({ ...newItem, armorStats: { ...newItem.armorStats, type: e.target.value as any } as any })}
                    className="bg-white/50 border border-or/20 rounded px-3 py-1.5 text-sm font-body text-encre focus:outline-none"
                  >
                    <option value="light">Légère</option>
                    <option value="medium">Intermédiaire</option>
                    <option value="heavy">Lourde</option>
                    <option value="shield">Bouclier</option>
                  </select>
                  <label className="flex items-center gap-2 cursor-pointer col-span-2">
                    <input
                      type="checkbox"
                      checked={newItem.armorStats?.stealthDisadvantage || false}
                      onChange={(e) => setNewItem({ ...newItem, armorStats: { ...newItem.armorStats, stealthDisadvantage: e.target.checked } as any })}
                      className="rounded border-or/20 text-pourpre-infernal focus:ring-pourpre-infernal"
                    />
                    <span className="text-sm font-body text-encre">Désavantage en Discrétion</span>
                  </label>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-sm font-section uppercase text-cendre hover:text-encre transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.name}
                className="px-3 py-1.5 text-sm font-section uppercase bg-pourpre-infernal text-parchemin hover:bg-pourpre-infernal/90 rounded transition-colors disabled:opacity-50"
              >
                Ajouter
              </button>
            </div>
          </div>
        )}

        {categories.map((category) => {
          const items = groupedInventory[category];
          if (!items || items.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <h4 className="font-title-alt text-lg text-encre flex items-center gap-2 border-b border-or/20 pb-1">
                {categoryIcons[category]}
                {categoryLabels[category]}
              </h4>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="p-3 bg-parchemin/50 border border-or/20 rounded-lg flex items-start gap-3 hover:border-or/50 transition-colors group">
                    <div className="w-8 h-8 rounded bg-noir-velours/5 border border-or/30 flex items-center justify-center mt-1 flex-shrink-0">
                      {categoryIcons[item.category]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <h4 className="font-body text-encre font-semibold group-hover:text-pourpre-infernal transition-colors">{item.name}</h4>
                          {item.quantity > 1 && (
                            <span className="text-[10px] font-numbers bg-or/10 border border-or/20 text-cendre px-1.5 py-0.5 rounded">
                              x{item.quantity}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {item.weight !== undefined && (
                            <span className="text-[10px] font-numbers text-cendre bg-noir-velours/5 px-1.5 py-0.5 rounded border border-or/10">
                              {item.weight} kg
                            </span>
                          )}
                          {['weapon', 'armor', 'magic_item'].includes(item.category) && (
                            <button
                              onClick={() => toggleItemEquipped(item.id)}
                              className={cn(
                                "text-[10px] font-section uppercase px-2 py-0.5 rounded border transition-colors",
                                item.equipped 
                                  ? "bg-pourpre-infernal/10 border-pourpre-infernal/30 text-pourpre-infernal" 
                                  : "bg-transparent border-cendre/30 text-cendre hover:border-cendre"
                              )}
                            >
                              {item.equipped ? 'Équipé' : 'Équiper'}
                            </button>
                          )}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-rouge-sang/50 hover:text-rouge-sang p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {item.description && (
                        <p className="font-body text-xs text-encre-claire mt-1 leading-snug">{item.description}</p>
                      )}
                      
                      {/* Quantity controls */}
                      <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center bg-or/10 hover:bg-or/20 border border-or/20 text-encre rounded text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-numbers text-encre">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center bg-or/10 hover:bg-or/20 border border-or/20 text-encre rounded text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {inventory.length === 0 && (
          <p className="text-center text-cendre font-body italic py-8">
            L'inventaire est vide.
          </p>
        )}
      </div>

      {/* Database Search Section */}
      <div className="mt-6 pt-6 border-t-2 border-or/30">
        <h3 className="font-title-alt text-lg text-pourpre-infernal mb-3 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Catalogue d'objets
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un objet (ex: Épée, Potion...)"
            className="w-full bg-parchemin border border-or/30 rounded-lg px-4 py-2 font-body text-sm text-encre focus:outline-none focus:border-or/60 focus:ring-1 focus:ring-or/60"
          />
          {searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-parchemin border border-or/30 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredDbItems.length > 0 ? (
                <div className="divide-y divide-or/10">
                  {filteredDbItems.map((item, idx) => (
                    <div key={idx} className="p-3 hover:bg-or/5 flex justify-between items-center group">
                      <div>
                        <div className="font-body text-sm text-encre font-semibold flex items-center gap-2">
                          {categoryIcons[item.category]}
                          {item.name}
                        </div>
                        <div className="text-xs text-cendre italic mt-0.5">{categoryLabels[item.category]} {item.weight ? `- ${item.weight} kg` : ''}</div>
                      </div>
                      <button
                        onClick={() => {
                          handleAddFromDb(item);
                          setSearchTerm('');
                        }}
                        className="p-1.5 bg-or/10 text-pourpre-infernal rounded hover:bg-or/20 transition-colors opacity-0 group-hover:opacity-100"
                        title="Ajouter à l'inventaire"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-sm text-cendre italic text-center">
                  Aucun objet trouvé.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
