import { useCharacterStore } from '../store/characterStore';
import { Skull, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const STANDARD_CONDITIONS = [
  'Aveuglé', 'Charmé', 'Assourdi', 'Effrayé', 'Empoisonné', 
  'À terre', 'Entravé', 'Empoigné', 'Invisible', 'Paralysé', 
  'Pétrifié', 'Étourdi', 'Inconscient'
];

export function StatusModule() {
  const { combat, addCondition, removeCondition, setExhaustion } = useCharacterStore();
  const { conditions = [], exhaustion = 0 } = combat;

  const toggleCondition = (condition: string) => {
    if (conditions.includes(condition)) {
      removeCondition(condition);
    } else {
      addCondition(condition);
    }
  };

  return (
    <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z\' fill=\'%23c9933a\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')] mix-blend-multiply" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-or/20 pb-2">
          <AlertCircle className="w-6 h-6 text-rouge-sang" />
          <h2 className="font-title-main text-2xl text-encre">États & Conditions</h2>
        </div>

        {/* Exhaustion Bar */}
        <div className="space-y-2 p-3 border-2 border-pourpre-infernal/30 rounded-lg bg-pourpre-infernal/5">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <Skull className={cn("w-5 h-5", exhaustion > 0 ? "text-pourpre-infernal" : "text-cendre")} />
              <span className="font-section text-sm uppercase text-encre-claire tracking-wider">Niveau de Fatigue</span>
            </div>
            <div className="font-numbers text-2xl text-pourpre-infernal">
              {exhaustion} <span className="text-sm text-cendre">/ 6</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-1 mt-2">
            {[0, 1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                onClick={() => setExhaustion(level)}
                className={cn(
                  "flex-1 h-3 rounded-full transition-all border",
                  exhaustion >= level && level > 0 
                    ? "bg-pourpre-infernal border-pourpre-infernal" 
                    : "bg-encre/10 border-encre/20 hover:bg-pourpre-infernal/30",
                  level === 0 && "bg-transparent border-none flex-none w-6 text-xs font-numbers text-cendre hover:text-pourpre-infernal text-center"
                )}
                title={level === 0 ? "Réinitialiser" : `Fatigue ${level}`}
              >
                {level === 0 && "0"}
              </button>
            ))}
          </div>
          {exhaustion > 0 && (
            <p className="text-xs font-body text-rouge-sang pt-1">
              {exhaustion === 1 && "Désavantage aux jets de carac."}
              {exhaustion === 2 && "Vitesse réduite de moitié"}
              {exhaustion === 3 && "Désavantage aux jets d'attaque et de sauvegarde"}
              {exhaustion === 4 && "Maximum de PV réduit de moitié"}
              {exhaustion === 5 && "Vitesse réduite à 0"}
              {exhaustion === 6 && "Mort (Aïe...)"}
            </p>
          )}
        </div>

        {/* Conditions Grid */}
        <div className="flex flex-wrap gap-2">
          {STANDARD_CONDITIONS.map((cond) => {
            const isActive = conditions.includes(cond);
            return (
              <button
                key={cond}
                onClick={() => toggleCondition(cond)}
                className={cn(
                  "px-3 py-1 text-sm font-section rounded-full border transition-colors",
                  isActive
                    ? "bg-rouge-sang text-parchemin border-rouge-sang shadow-md"
                    : "bg-parchemin text-encre-claire border-or/30 hover:border-rouge-sang/50 hover:bg-rouge-sang/10"
                )}
              >
                {cond}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
