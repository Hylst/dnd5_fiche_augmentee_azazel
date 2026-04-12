import { useCharacterStore, calculateModifier, calculateProficiencyBonus, Stat } from '../store/characterStore';
import { Sword, Crosshair, Zap, ShieldAlert, Dices } from 'lucide-react';
import { cn } from '../lib/utils';

export function AttacksModule() {
  const { stats, identity, inventory, rollDice } = useCharacterStore();
  
  const profBonus = calculateProficiencyBonus(identity.level);
  const chaMod = calculateModifier(stats.CHA);

  const weapons = inventory
    .filter(item => item.category === 'weapon' && item.equipped && item.weaponStats)
    .map(weapon => {
      const wStats = weapon.weaponStats!;
      const statMod = calculateModifier(stats[wStats.stat]);
      const magicBonus = wStats.isMagic ? 1 : 0; // Assuming +1 for magic weapons for now, or we can add magicBonus to weaponStats
      
      const totalBonus = statMod + profBonus + magicBonus;
      const damageBonus = statMod + magicBonus;
      
      return {
        name: weapon.name,
        bonus: totalBonus,
        damageDice: wStats.damageDice,
        damageBonus: damageBonus,
        damage: `${wStats.damageDice} ${damageBonus >= 0 ? '+' : ''} ${damageBonus}`,
        type: wStats.damageType,
        range: wStats.range || '1,5m',
        notes: wStats.notes || '',
        icon: wStats.range && wStats.range.includes('/') ? <Crosshair className="w-4 h-4" /> : <Sword className="w-4 h-4" />
      };
    });

  const attacks = [
    ...weapons,
    {
      name: 'Sorts (Attaque)',
      bonus: chaMod + profBonus,
      damageDice: '',
      damageBonus: 0,
      damage: 'Varie',
      type: 'Magique',
      range: 'Varie',
      notes: 'Basé sur le Charisme',
      icon: <Zap className="w-4 h-4" />
    }
  ];

  const specialActions = [
    { name: 'Mots de terreur', type: 'Action', desc: 'Effrayer une cible (DD Sagesse 15)' },
    { name: 'Lames psychiques', type: 'Action Bonus', desc: 'Dépenser 1 Inspiration pour +3d6 dégâts psychiques' },
    { name: 'Voile de murmures', type: 'Réaction', desc: 'Capturer l\'ombre d\'un humanoïde mort à 9m' },
    { name: 'Contre-charme', type: 'Action', desc: 'Avantage aux JdS contre charme/peur à 9m' }
  ];

  return (
    <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg h-full flex flex-col">
      <h2 className="font-title-alt text-2xl text-rouge-sang mb-6 border-b-2 border-or/30 pb-2">Attaques & Actions</h2>
      
      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {/* Attacks Table */}
        <div className="space-y-3">
          <h3 className="font-section text-sm uppercase text-cendre tracking-wider">Armes & Sorts Offensifs</h3>
          <div className="bg-parchemin/50 border border-or/20 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm font-body">
              <thead className="bg-or/10 font-section text-[10px] uppercase text-cendre border-b border-or/20">
                <tr>
                  <th className="p-2">Nom</th>
                  <th className="p-2 text-center">Toucher</th>
                  <th className="p-2 text-center">Dégâts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-or/10">
                {attacks.map((atk, i) => (
                  <tr key={i} className="hover:bg-or/5 transition-colors group">
                    <td className="p-2 flex items-center gap-2 text-encre font-semibold">
                      <span className="text-rouge-sang/70">{atk.icon}</span>
                      <div>
                        {atk.name}
                        <div className="text-[10px] text-cendre italic font-normal">{atk.notes}</div>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <button 
                        onClick={() => rollDice(`1d20${atk.bonus >= 0 ? '+' : ''}${atk.bonus}`, `Attaque : ${atk.name}`)}
                        className="font-numbers text-lg text-pourpre-infernal px-3 py-1 rounded hover:bg-or/20 transition-colors cursor-pointer inline-flex items-center gap-1"
                        title={`Lancer l'attaque avec ${atk.name}`}
                      >
                        <Dices className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        +{atk.bonus}
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      {atk.damageDice ? (
                        <button 
                          onClick={() => rollDice(`${atk.damageDice}${atk.damageBonus >= 0 ? '+' : ''}${atk.damageBonus}`, `Dégâts : ${atk.name}`)}
                          className="px-3 py-1 rounded hover:bg-rouge-sang/10 transition-colors cursor-pointer inline-flex flex-col items-center"
                          title={`Lancer les dégâts de ${atk.name}`}
                        >
                          <div className="text-encre flex items-center gap-1">
                            <Dices className="w-3 h-3 text-rouge-sang opacity-0 group-hover:opacity-100 transition-opacity" />
                            {atk.damage}
                          </div>
                          <span className="text-cendre text-[10px] uppercase">{atk.type}</span>
                        </button>
                      ) : (
                        <div className="px-3 py-1 flex flex-col items-center">
                          <span className="text-encre">{atk.damage}</span>
                          <span className="text-cendre text-[10px] uppercase">{atk.type}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Special Actions */}
        <div className="space-y-3">
          <h3 className="font-section text-sm uppercase text-cendre tracking-wider">Actions Spéciales</h3>
          <div className="space-y-2">
            {specialActions.map((action, i) => (
              <div key={i} className="p-3 bg-parchemin/50 border border-or/20 rounded-lg flex justify-between items-center hover:border-or/50 transition-colors group">
                <div>
                  <h4 className="font-body text-encre font-semibold group-hover:text-rouge-sang transition-colors">{action.name}</h4>
                  <p className="font-body text-xs text-encre-claire">{action.desc}</p>
                </div>
                <span className="font-section text-[10px] uppercase px-2 py-1 bg-noir-velours/5 text-cendre rounded border border-cendre/20 whitespace-nowrap">
                  {action.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
