import { useState } from 'react';
import { Shield, Heart, Zap, Activity, Plus, X } from 'lucide-react';
import { useCharacterStore, calculateModifier, calculateProficiencyBonus } from '../store/characterStore';
import { cn } from '../lib/utils';

export function CombatModule() {
  const { combat, stats, identity, inventory, updateHp, updateTempHp } = useCharacterStore();
  const [hpInput, setHpInput] = useState('');
  
  const proficiencyBonus = calculateProficiencyBonus(identity.level);
  const dexModifier = calculateModifier(stats.DEX);
  const initiative = dexModifier + combat.initiativeBonus;
  
  const hpPercentage = Math.max(0, Math.min(100, (combat.hpCurrent / combat.hpMax) * 100));
  
  let hpColorClass = 'from-vert-emeraude to-green-600';
  if (hpPercentage <= 25) hpColorClass = 'from-rouge-sang to-red-600 animate-pulse';
  else if (hpPercentage <= 50) hpColorClass = 'from-or-vif to-orange-500';

  const handleHpChange = (amount: number) => {
    updateHp(amount);
    setHpInput('');
  };

  // Determine AC based on equipment
  let computedAC = 10 + dexModifier; // Unarmored default
  
  const equippedArmor = inventory.find(i => i.category === 'armor' && i.equipped && i.armorStats && i.armorStats.type !== 'shield');
  const equippedShield = inventory.find(i => i.category === 'armor' && i.equipped && i.armorStats && i.armorStats.type === 'shield');

  if (equippedArmor && equippedArmor.armorStats) {
    const { baseAc, type } = equippedArmor.armorStats;
    if (type === 'light') computedAC = baseAc + dexModifier;
    else if (type === 'medium') computedAC = baseAc + Math.min(2, dexModifier);
    else if (type === 'heavy') computedAC = baseAc;
  } else {
    // If we have an override in the system for base AC (Unarmored Defense like Monks) we could use combat.acBase here instead of 10.
    // For Azazel, base was 13 which is the armor, so if no armor, 10 + dex is correct.
    // We just fallback to unarmored if no armor is equipped. But if combat.acBase > 10 and no armor, maybe it's unarmored defense? Let's take max.
    computedAC = Math.max(computedAC, combat.acBase + dexModifier);
  }

  if (equippedShield && equippedShield.armorStats) {
    computedAC += equippedShield.armorStats.baseAc; // A shield baseAc is typically 2
  }

  computedAC += combat.acBonus;

  return (
    <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z\' fill=\'%23c9933a\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] mix-blend-multiply" />
      
      <div className="relative z-10 space-y-6">
        {/* Top Row: AC, Init, Speed, Prof */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center p-3 border-2 border-or/40 rounded-lg bg-parchemin shadow-md">
            <Shield className="w-5 h-5 text-cendre mb-1" />
            <span className="font-numbers-alt text-2xl text-encre">{computedAC}</span>
            <span className="font-section text-[10px] uppercase text-cendre">Armure</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 border-2 border-or/40 rounded-lg bg-parchemin shadow-md">
            <Zap className="w-5 h-5 text-cendre mb-1" />
            <span className="font-numbers-alt text-2xl text-encre">{initiative >= 0 ? `+${initiative}` : initiative}</span>
            <span className="font-section text-[10px] uppercase text-cendre">Initiative</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 border-2 border-or/40 rounded-lg bg-parchemin shadow-md">
            <Activity className="w-5 h-5 text-cendre mb-1" />
            <span className="font-numbers-alt text-2xl text-encre">{combat.speed}m</span>
            <span className="font-section text-[10px] uppercase text-cendre">Vitesse</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 border-2 border-or/40 rounded-lg bg-parchemin shadow-md">
            <span className="font-numbers-alt text-2xl text-pourpre-infernal mt-1">+{proficiencyBonus}</span>
            <span className="font-section text-[10px] uppercase text-cendre mt-1">Maîtrise</span>
          </div>
        </div>

        {/* HP Section */}
        <div className="space-y-3 p-4 border-2 border-rouge-sang/30 rounded-lg bg-noir-velours/5">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <Heart className={cn("w-6 h-6", hpPercentage <= 25 ? "text-rouge-sang animate-pulse" : "text-vert-emeraude")} />
              <span className="font-section text-sm uppercase text-encre-claire tracking-wider">Points de Vie</span>
            </div>
            <div className="font-numbers text-3xl text-encre">
              {combat.hpCurrent} <span className="text-lg text-cendre">/ {combat.hpMax}</span>
            </div>
          </div>
          
          {/* HP Bar */}
          <div className="h-4 w-full bg-encre/20 rounded-full overflow-hidden border-2 border-noir-velours/50 shadow-inner">
            <div 
              className={cn("h-full bg-gradient-to-r transition-all duration-500 ease-out", hpColorClass)}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
          
          {/* HP Controls */}
          <div className="flex gap-2 pt-2">
            <input 
              type="number" 
              value={hpInput}
              onChange={(e) => setHpInput(e.target.value)}
              placeholder="Montant..."
              className="flex-1 bg-parchemin border-2 border-or/30 rounded px-3 py-1 font-numbers text-encre focus:outline-none focus:border-or"
            />
            <button 
              onClick={() => handleHpChange(-parseInt(hpInput || '0'))}
              className="px-4 py-1 bg-rouge-sang/10 hover:bg-rouge-sang/20 text-rouge-sang border border-rouge-sang/30 rounded font-section transition-colors"
            >
              Dégâts
            </button>
            <button 
              onClick={() => handleHpChange(parseInt(hpInput || '0'))}
              className="px-4 py-1 bg-vert-emeraude/10 hover:bg-vert-emeraude/20 text-vert-emeraude border border-vert-emeraude/30 rounded font-section transition-colors"
            >
              Soin
            </button>
          </div>
          
          {/* Temp HP */}
          <div className="flex justify-between items-center pt-2 border-t border-or/20">
            <span className="font-section text-xs uppercase text-cendre">PV Temporaires</span>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={combat.hpTemp || ''}
                onChange={(e) => updateTempHp(parseInt(e.target.value || '0'))}
                className="w-16 bg-parchemin border border-or/30 rounded px-2 py-1 font-numbers text-encre text-right focus:outline-none focus:border-or"
              />
            </div>
          </div>
        </div>
        
        {/* Combat Tracker Section */}
        <div className="space-y-4 p-4 border-2 border-or/30 rounded-lg bg-noir-velours/20 mt-6 relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-or/20 pb-2">
            <h3 className="font-title text-or text-lg tracking-wider flex items-center gap-2">
              <Shield className="w-5 h-5" /> Tracker Tactique
            </h3>
            <div className="flex items-center gap-3">
              <div className="bg-encre-claire/10 px-3 py-1 rounded border border-or/20 flex items-center gap-2">
                <span className="font-section text-xs uppercase text-cendre">Tour</span>
                <span className="font-numbers text-xl text-or-vif">{combat.turnCount || 1}</span>
              </div>
              <button 
                onClick={useCharacterStore.getState().nextTurn}
                className="px-3 py-1 bg-or/10 hover:bg-or/20 text-or border border-or/30 rounded font-section text-xs transition-colors"
              >
                Tour Suivant
              </button>
              <button 
                onClick={useCharacterStore.getState().resetCombatTracker}
                className="px-2 py-1 bg-cendre/10 hover:bg-cendre/20 text-cendre border border-cendre/30 rounded font-section text-xs transition-colors"
                title="Réinitialiser le combat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cibles */}
            <div className="space-y-2">
              <h4 className="font-section text-xs uppercase text-cendre border-b border-cendre/20 pb-1 flex justify-between">
                Cibles (AC Estimée)
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {(combat.targets || []).map(t => (
                  <div key={t.id} className="flex justify-between items-center bg-encre/10 p-1.5 rounded border border-rouge-sang/20">
                    <span className="text-sm text-encre-claire truncate w-24">{t.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-numbers text-rouge-sang bg-rouge-sang/10 px-2 py-0.5 rounded text-sm border border-rouge-sang/30" title="Classe d'Armure">
                        CA {t.ac}
                      </span>
                      <button onClick={() => useCharacterStore.getState().removeTarget(t.id)} className="text-cendre hover:text-rouge-sang">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (form.elements.namedItem('tgtName') as HTMLInputElement).value;
                  const ac = (form.elements.namedItem('tgtAc') as HTMLInputElement).value;
                  if (name) {
                    useCharacterStore.getState().addTarget(name, ac || '?');
                    form.reset();
                  }
                }}
                className="flex gap-2 pt-1"
              >
                <input name="tgtName" placeholder="Nom cible..." className="flex-1 bg-parchemin border border-or/30 rounded px-2 py-1 text-xs text-encre" required maxLength={20} />
                <input name="tgtAc" placeholder="CA" className="w-12 bg-parchemin border border-or/30 rounded px-2 py-1 text-xs text-encre text-center font-numbers" maxLength={4} />
                <button type="submit" className="bg-or/20 text-or px-2 rounded hover:bg-or/30"><Plus className="w-4 h-4" /></button>
              </form>
            </div>

            {/* Buffs & Effets */}
            <div className="space-y-2">
              <h4 className="font-section text-xs uppercase text-cendre border-b border-cendre/20 pb-1 flex justify-between">
                Effets & Buffs (Tours restants)
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {(combat.buffs || []).map(b => (
                  <div key={b.id} className="flex justify-between items-center bg-encre/10 p-1.5 rounded border border-vert-emeraude/20">
                    <span className="text-sm text-encre-claire truncate max-w-[120px]">{b.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-numbers text-vert-emeraude bg-vert-emeraude/10 px-2 py-0.5 rounded text-sm border border-vert-emeraude/30">
                        {b.turnsRemaining} T
                      </span>
                      <button onClick={() => useCharacterStore.getState().removeBuff(b.id)} className="text-cendre hover:text-rouge-sang">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (form.elements.namedItem('buffName') as HTMLInputElement).value;
                  const duration = parseInt((form.elements.namedItem('buffDuration') as HTMLInputElement).value || '1', 10);
                  if (name) {
                    useCharacterStore.getState().addBuff(name, duration);
                    form.reset();
                  }
                }}
                className="flex gap-2 pt-1"
              >
                <input name="buffName" placeholder="Effet (ex: Bénédiction)" className="flex-1 bg-parchemin border border-or/30 rounded px-2 py-1 text-xs text-encre" required maxLength={25} />
                <input name="buffDuration" type="number" min="1" placeholder="Tours" defaultValue="1" className="w-14 bg-parchemin border border-or/30 rounded px-2 py-1 text-xs text-encre text-center font-numbers" required />
                <button type="submit" className="bg-or/20 text-or px-2 rounded hover:bg-or/30"><Plus className="w-4 h-4" /></button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
