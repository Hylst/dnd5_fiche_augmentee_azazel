import { useState, useEffect, useMemo } from 'react';
import { useCharacterStore } from '../store/characterStore';
import { Dices, X, Trash2, Search, Download } from 'lucide-react';
import { cn } from '../lib/utils';

export function DiceRoller() {
  const { diceRolls, rollDice, clearRolls } = useCharacterStore();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open when a new roll is added
  useEffect(() => {
    if (diceRolls.length > 0) {
      setIsOpen(true);
    }
  }, [diceRolls.length]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRolls = useMemo(() => {
    if (!searchQuery.trim()) return diceRolls;
    const lowerQuery = searchQuery.toLowerCase();
    return diceRolls.filter(r => 
      r.reason.toLowerCase().includes(lowerQuery) || 
      r.notation.toLowerCase().includes(lowerQuery)
    );
  }, [diceRolls, searchQuery]);

  const exportHistory = () => {
    if (diceRolls.length === 0) return;
    
    let content = "# Historique des Lancers D&D 5e\n\n";
    diceRolls.forEach(r => {
      const time = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      let status = "";
      if (r.isCriticalSuccess) status = " **[RÉUSSITE CRITIQUE]**";
      if (r.isCriticalFail) status = " **[ÉCHEC CRITIQUE]**";
      
      content += `- **[${time}]** ${r.reason} : **${r.result}** (Jet: \`${r.notation}\` => [${r.rolls.join(', ')}])${status}\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique_des_${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quickRolls = [
    { label: 'd4', notation: '1d4' },
    { label: 'd6', notation: '1d6' },
    { label: 'd8', notation: '1d8' },
    { label: 'd10', notation: '1d10' },
    { label: 'd12', notation: '1d12' },
    { label: 'd20', notation: '1d20' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Panel */}
      {isOpen && (
        <div className="mb-4 w-80 bg-parchemin-fonce border-2 border-or/50 rounded-xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[60vh]">
          <div className="p-3 bg-or/10 border-b border-or/30 flex justify-between items-center">
            <h3 className="font-title-alt text-lg text-pourpre-infernal flex items-center gap-2">
              <Dices className="w-5 h-5" />
              Lancers de dés
            </h3>
            <div className="flex items-center gap-1">
              <button 
                onClick={exportHistory}
                disabled={diceRolls.length === 0}
                className="p-1.5 text-cendre hover:text-or-vif hover:bg-or/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Exporter l'historique"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={clearRolls}
                disabled={diceRolls.length === 0}
                className="p-1.5 text-cendre hover:text-rouge-sang hover:bg-rouge-sang/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Effacer l'historique"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Rolls */}
          <div className="p-3 border-b border-or/20 bg-parchemin/50 grid grid-cols-3 gap-2">
            {quickRolls.map((qr) => (
              <button
                key={qr.label}
                onClick={() => rollDice(qr.notation, `Jet de ${qr.label}`)}
                className="py-1.5 px-2 bg-parchemin border border-or/30 rounded font-numbers text-encre hover:bg-or/20 hover:text-pourpre-infernal transition-colors shadow-sm text-sm"
              >
                {qr.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          {diceRolls.length > 0 && (
            <div className="p-2 border-b border-or/20 bg-parchemin/80">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-cendre" />
                <input 
                  type="text" 
                  placeholder="Filtrer l'historique..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-parchemin-fonce border border-or/30 rounded pl-8 pr-2 py-1 text-sm font-body text-encre placeholder:text-cendre/50 focus:outline-none focus:border-or-vif"
                />
              </div>
            </div>
          )}

          {/* History */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-parchemin/30">
            {diceRolls.length === 0 ? (
              <div className="text-center py-4 text-cendre font-body text-sm italic">
                Aucun lancer récent.
              </div>
            ) : filteredRolls.length === 0 ? (
              <div className="text-center py-4 text-cendre font-body text-sm italic">
                Aucun lancer ne correspond à votre recherche.
              </div>
            ) : (
              filteredRolls.map((roll) => (
                <div 
                  key={roll.id} 
                  className={cn(
                    "bg-parchemin p-3 rounded-lg border shadow-sm transition-colors",
                    roll.isCriticalSuccess ? "border-or-vif shadow-[0_0_8px_rgba(201,147,58,0.3)] bg-or/5" :
                    roll.isCriticalFail ? "border-rouge-sang shadow-[0_0_8px_rgba(138,3,3,0.2)] bg-rouge-sang/5" :
                    "border-or/20"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "font-body text-sm font-semibold",
                      roll.isCriticalSuccess ? "text-or-vif" :
                      roll.isCriticalFail ? "text-rouge-sang" : "text-encre"
                    )}>
                      {roll.reason}
                    </span>
                    <span className="font-section text-[10px] text-cendre">
                      {new Date(roll.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="font-body text-xs text-cendre">
                      {roll.notation} <span className="text-encre-claire">[{roll.rolls.join(', ')}]</span>
                    </div>
                    <div className={cn(
                      "font-numbers text-2xl leading-none",
                      roll.isCriticalSuccess ? "text-or-vif drop-shadow-md" :
                      roll.isCriticalFail ? "text-rouge-sang drop-shadow-md" : "text-pourpre-infernal"
                    )}>
                      {roll.result}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-2",
          isOpen 
            ? "bg-parchemin border-or/50 text-pourpre-infernal" 
            : "bg-pourpre-infernal border-or text-parchemin hover:bg-pourpre-infernal/90 hover:scale-105"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Dices className="w-7 h-7" />}
      </button>
    </div>
  );
}
