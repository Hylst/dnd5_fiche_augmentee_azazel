import { useState } from 'react';
import { useCharacterStore } from '../store/characterStore';
import { Moon, Flame, Coffee } from 'lucide-react';
import { cn } from '../lib/utils';

export function RestModule() {
  const { shortRest, longRest } = useCharacterStore();
  const [animatingRest, setAnimatingRest] = useState<'short' | 'long' | null>(null);

  const handleRest = (type: 'short' | 'long') => {
    setAnimatingRest(type);
    if (type === 'short') shortRest();
    else longRest();
    
    setTimeout(() => {
      setAnimatingRest(null);
    }, 1000); // 1 second animation
  };

  return (
    <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4 border-b-2 border-or/30 pb-2">
        <Coffee className="w-6 h-6 text-pourpre-infernal" />
        <h2 className="font-title-alt text-2xl text-pourpre-infernal">Repos</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => handleRest('short')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-parchemin border-2 rounded-xl transition-all duration-300 shadow-sm group",
            animatingRest === 'short' 
              ? "border-or-vif bg-or/20 scale-95 shadow-inner" 
              : "border-or/50 hover:bg-or/10 hover:border-or-vif hover:shadow-md"
          )}
        >
          <Flame className={cn("w-8 h-8 transition-colors", animatingRest === 'short' ? "text-or-vif animate-pulse" : "text-or group-hover:text-or-vif")} />
          <div className="text-center">
            <span className="block font-title-main text-lg text-encre">Repos Court</span>
            <span className="block font-body text-xs text-cendre italic">1 heure</span>
          </div>
        </button>

        <button 
          onClick={() => handleRest('long')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-noir-velours text-parchemin border-2 rounded-xl transition-all duration-300 shadow-sm group",
            animatingRest === 'long' 
              ? "border-pourpre-infernal bg-pourpre-infernal/40 scale-95 shadow-inner" 
              : "border-pourpre-infernal/50 hover:bg-pourpre-infernal/80 hover:border-pourpre-infernal hover:shadow-md"
          )}
        >
          <Moon className={cn("w-8 h-8 transition-colors", animatingRest === 'long' ? "text-or-vif animate-pulse" : "text-or-vif/70 group-hover:text-or-vif")} />
          <div className="text-center">
            <span className="block font-title-main text-lg text-parchemin">Repos Long</span>
            <span className="block font-body text-xs text-cendre italic">8 heures</span>
          </div>
        </button>
      </div>
    </div>
  );
}
