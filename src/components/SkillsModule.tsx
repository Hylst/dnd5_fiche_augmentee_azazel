import { useCharacterStore, calculateModifier, calculateProficiencyBonus, SkillType } from '../store/characterStore';
import { Star, StarHalf, Eye, Dices } from 'lucide-react';
import { cn } from '../lib/utils';
import { ReactNode } from 'react';

const TYPE_ICONS: Record<SkillType, ReactNode> = {
  EXP: <div className="flex -space-x-1"><Star className="w-3 h-3 text-or-vif fill-or-vif" /><Star className="w-3 h-3 text-or-vif fill-or-vif" /></div>,
  MAI: <Star className="w-3 h-3 text-or-vif fill-or-vif" />,
  TAT: <StarHalf className="w-3 h-3 text-cendre fill-cendre" />,
  NONE: <div className="w-3 h-3 rounded-full border border-cendre/50" />,
};

export function SkillsModule() {
  const { skills, stats, identity, rollDice } = useCharacterStore();
  const profBonus = calculateProficiencyBonus(identity.level);

  // Calculate passive perception
  const perceptionSkill = skills.find(s => s.name === 'Perception');
  const sagMod = calculateModifier(stats.SAG);
  let passivePerception = 10 + sagMod;
  if (perceptionSkill) {
    if (perceptionSkill.type === 'EXP') passivePerception += profBonus * 2;
    else if (perceptionSkill.type === 'MAI') passivePerception += profBonus;
    else if (perceptionSkill.type === 'TAT') passivePerception += Math.floor(profBonus / 2);
  }

  return (
    <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 border-b-2 border-or/30 pb-2">
        <h2 className="font-title-alt text-2xl text-pourpre-infernal">Compétences</h2>
        <div className="flex items-center gap-2 bg-parchemin border border-or/40 px-3 py-1 rounded-full shadow-sm">
          <Eye className="w-4 h-4 text-bleu-arcane" />
          <span className="font-section text-xs uppercase text-cendre">Passive</span>
          <span className="font-numbers text-lg text-encre">{passivePerception}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-1">
        {skills.map((skill) => {
          const statMod = calculateModifier(stats[skill.stat]);
          let totalBonus = statMod + (skill.customBonus || 0);
          
          if (skill.type === 'EXP') totalBonus += profBonus * 2;
          else if (skill.type === 'MAI') totalBonus += profBonus;
          else if (skill.type === 'TAT') totalBonus += Math.floor(profBonus / 2);

          return (
            <div 
              key={skill.name}
              className="group flex items-center justify-between p-2 rounded hover:bg-or/10 transition-colors border border-transparent hover:border-or/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 flex justify-center" title={skill.type}>
                  {TYPE_ICONS[skill.type]}
                </div>
                <span className={cn(
                  "font-body text-sm",
                  skill.type === 'EXP' || skill.type === 'MAI' ? "text-encre font-semibold" : "text-encre-claire"
                )}>
                  {skill.name}
                </span>
                <span className="font-section text-[10px] text-cendre uppercase">({skill.stat})</span>
              </div>
              
              <button 
                onClick={() => rollDice(`1d20${totalBonus >= 0 ? '+' : ''}${totalBonus}`, `Jet de ${skill.name}`)}
                className={cn(
                  "w-8 h-8 rounded flex items-center justify-center font-numbers text-lg border cursor-pointer hover:scale-110 transition-all relative overflow-hidden",
                  skill.type === 'EXP' ? "bg-or/20 border-or/50 text-pourpre-infernal" :
                  skill.type === 'MAI' ? "bg-parchemin border-or/30 text-encre" :
                  "bg-transparent border-transparent text-cendre group-hover:text-encre group-hover:border-or/30 group-hover:bg-parchemin"
                )}
                title={`Lancer un jet de ${skill.name}`}
              >
                <span className="group-hover:opacity-0 transition-opacity">
                  {totalBonus >= 0 ? `+${totalBonus}` : totalBonus}
                </span>
                <Dices className="w-4 h-4 text-pourpre-infernal absolute opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-or/20 flex justify-center gap-4 text-xs font-section text-cendre uppercase">
        <div className="flex items-center gap-1"><Star className="w-3 h-3 text-or-vif fill-or-vif" /> Maîtrise</div>
        <div className="flex items-center gap-1"><div className="flex -space-x-1"><Star className="w-3 h-3 text-or-vif fill-or-vif" /><Star className="w-3 h-3 text-or-vif fill-or-vif" /></div> Expertise</div>
        <div className="flex items-center gap-1"><StarHalf className="w-3 h-3 text-cendre fill-cendre" /> Touche-à-tout</div>
      </div>

      <div className="mt-6 pt-6 border-t-2 border-or/30">
        <h3 className="font-title-alt text-xl text-pourpre-infernal mb-4">Maîtrises & Langues</h3>
        <div className="space-y-3 font-body text-sm">
          <div>
            <span className="text-cendre uppercase text-xs font-section block mb-1">Armures</span>
            <span className="text-encre">{identity.proficiencies.armor}</span>
          </div>
          <div>
            <span className="text-cendre uppercase text-xs font-section block mb-1">Armes</span>
            <span className="text-encre">{identity.proficiencies.weapons}</span>
          </div>
          <div>
            <span className="text-cendre uppercase text-xs font-section block mb-1">Outils & Équipement</span>
            <span className="text-encre">{identity.proficiencies.tools}</span>
          </div>
          <div>
            <span className="text-cendre uppercase text-xs font-section block mb-1">Langues</span>
            <span className="text-encre">{identity.proficiencies.languages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
