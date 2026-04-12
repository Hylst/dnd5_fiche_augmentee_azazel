import { useCharacterStore, calculateModifier, calculateProficiencyBonus, Stat } from '../store/characterStore';
import { cn } from '../lib/utils';
import { ShieldAlert, Dices } from 'lucide-react';

const STAT_LABELS: Record<Stat, string> = {
  FOR: 'Force',
  DEX: 'Dextérité',
  CON: 'Constitution',
  INT: 'Intelligence',
  SAG: 'Sagesse',
  CHA: 'Charisme',
};

const STAT_COLORS: Record<Stat, string> = {
  FOR: 'group-hover:text-rouge-sang group-hover:shadow-rouge-sang/20',
  DEX: 'group-hover:text-vert-emeraude group-hover:shadow-vert-emeraude/20',
  CON: 'group-hover:text-or-vif group-hover:shadow-or-vif/20',
  INT: 'group-hover:text-bleu-arcane group-hover:shadow-bleu-arcane/20',
  SAG: 'group-hover:text-teal-600 group-hover:shadow-teal-600/20',
  CHA: 'group-hover:text-pourpre-infernal group-hover:shadow-pourpre-infernal/20',
};

export function StatsModule() {
  const { stats, savingThrows, identity, rollDice } = useCharacterStore();
  const profBonus = calculateProficiencyBonus(identity.level);

  return (
    <div className="space-y-4">
      {(Object.entries(stats) as [Stat, number][]).map(([stat, value]) => {
        const modifier = calculateModifier(value);
        const isProficient = savingThrows.includes(stat);
        const saveBonus = modifier + (isProficient ? profBonus : 0);

        return (
          <div 
            key={stat}
            className="group relative flex items-center bg-noir-velours/5 border-2 border-or/30 rounded-lg p-2 transition-all duration-300 hover:bg-noir-velours/10 hover:border-or/60"
          >
            {/* Hexagon-ish background for stat name */}
            <div className="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center bg-parchemin-fonce border border-or/50 rounded-md shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 10l10-10H0l10 10z\' fill=\'%23c9933a\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] opacity-50" />
              <span className="font-section text-xs text-cendre uppercase tracking-wider z-10">{STAT_LABELS[stat].substring(0, 3)}</span>
              <span className={cn("font-numbers text-2xl text-encre z-10 transition-colors duration-300", STAT_COLORS[stat].split(' ')[0])}>
                {value}
              </span>
            </div>
            
            <div className="flex-1 flex justify-center">
              <button 
                onClick={() => rollDice(`1d20${modifier >= 0 ? '+' : ''}${modifier}`, `Jet de ${STAT_LABELS[stat]}`)}
                className={cn(
                  "w-12 h-12 rounded-full border-2 border-or/40 flex items-center justify-center bg-parchemin shadow-md transition-all duration-300 cursor-pointer hover:scale-110 relative",
                  STAT_COLORS[stat].split(' ')[1]
                )}
                title={`Lancer un jet de ${STAT_LABELS[stat]}`}
              >
                <span className="font-numbers-alt text-xl text-pourpre-infernal group-hover:opacity-0 transition-opacity">
                  {modifier >= 0 ? `+${modifier}` : modifier}
                </span>
                <Dices className="w-5 h-5 text-pourpre-infernal absolute opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <div className="w-16 flex flex-col items-center justify-center border-l border-or/20 pl-2">
              <div className="flex items-center gap-1 mb-1" title="Jet de sauvegarde">
                <ShieldAlert className={cn("w-3 h-3", isProficient ? "text-or-vif" : "text-cendre")} />
                <span className="font-section text-[10px] uppercase text-cendre">JdS</span>
              </div>
              <button 
                onClick={() => rollDice(`1d20${saveBonus >= 0 ? '+' : ''}${saveBonus}`, `Sauvegarde de ${STAT_LABELS[stat]}`)}
                className={cn(
                  "font-numbers text-lg px-2 rounded hover:bg-or/20 transition-colors cursor-pointer",
                  isProficient ? "text-encre font-bold" : "text-encre-claire"
                )}
                title={`Lancer une sauvegarde de ${STAT_LABELS[stat]}`}
              >
                {saveBonus >= 0 ? `+${saveBonus}` : saveBonus}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
