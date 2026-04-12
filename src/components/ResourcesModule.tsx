import { useCharacterStore, Resource } from '../store/characterStore';
import { Moon, Sun, Flame, Droplet, Sparkles, Gem, Eye } from 'lucide-react';
import { cn } from '../lib/utils';
import { ReactNode } from 'react';

const ICONS: Record<string, ReactNode> = {
  bardic_insp: <Sparkles className="w-4 h-4 text-or-vif" />,
  hellish_rebuke: <Flame className="w-4 h-4 text-rouge-sang" />,
  darkness: <Moon className="w-4 h-4 text-pourpre-infernal" />,
  fear: <Droplet className="w-4 h-4 text-bleu-arcane" />,
  true_seeing: <Eye className="w-4 h-4 text-teal-600" />,
  ring_manip: <Gem className="w-4 h-4 text-or" />,
};

export function ResourcesModule() {
  const { resources, useResource } = useCharacterStore();

  return (
    <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg relative overflow-hidden">
      <div className="flex justify-between items-end mb-6 border-b-2 border-or/30 pb-2">
        <h2 className="font-title-alt text-2xl text-pourpre-infernal">Ressources</h2>
      </div>

      <div className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-center justify-between p-3 bg-parchemin/50 border border-or/20 rounded-lg hover:border-or/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-noir-velours/5 border border-or/30 flex items-center justify-center shadow-inner">
                {ICONS[resource.id] || <Gem className="w-4 h-4 text-cendre" />}
              </div>
              <div>
                <h3 className="font-body text-encre font-semibold leading-tight">{resource.name}</h3>
                <span className="font-section text-[10px] uppercase text-cendre tracking-wider">
                  Recharge: {resource.rechargeType === 'LR' ? 'Repos Long' : resource.rechargeType === 'SR' ? 'Repos Court' : 'Aube'}
                </span>
              </div>
            </div>

            <div className="flex gap-1">
              {Array.from({ length: resource.max }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const newCurrent = i < resource.current ? i : i + 1;
                    useResource(resource.id, resource.current - newCurrent);
                  }}
                  className={cn(
                    "w-6 h-6 rounded-sm border transform transition-all duration-200 hover:scale-110",
                    i < resource.current 
                      ? "bg-or-vif/80 border-or shadow-[0_0_8px_rgba(232,168,50,0.6)]" 
                      : "bg-cendre/20 border-cendre/50 opacity-50"
                  )}
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' // Hexagon shape
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
