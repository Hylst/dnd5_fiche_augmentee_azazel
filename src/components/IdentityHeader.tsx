import { useState, useCallback } from 'react';
import { useCharacterStore, calculateModifier } from '../store/characterStore';
import { Sparkles, ArrowUpCircle, Plus, X, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { ExportModal } from './ExportModal';

const XP_THRESHOLDS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
];

export function IdentityHeader() {
  const { identity, combat, stats, toggleInspiration, addXp, levelUp, updateHpMax } = useCharacterStore();
  const [xpInput, setXpInput] = useState('');
  const [isPortraitExpanded, setIsPortraitExpanded] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [hpIncrease, setHpIncrease] = useState('');
  
  const currentLevelIndex = identity.level - 1;
  const xpForCurrentLevel = XP_THRESHOLDS[currentLevelIndex] || 0;
  const xpForNextLevel = XP_THRESHOLDS[currentLevelIndex + 1] || XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
  
  const progress = Math.max(0, Math.min(100, ((identity.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100));
  const canLevelUp = identity.xp >= xpForNextLevel && identity.level < 20;

  const handleAddXp = () => {
    const amount = parseInt(xpInput);
    if (!isNaN(amount) && amount > 0) {
      addXp(amount);
      setXpInput('');
    }
  };

  const playMelody = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playNote = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      // Simple magical/bardic arpeggio
      playNote(392.00, now, 0.5); // G4
      playNote(493.88, now + 0.2, 0.5); // B4
      playNote(587.33, now + 0.4, 0.5); // D5
      playNote(783.99, now + 0.6, 1.0); // G5
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, []);

  const handlePortraitClick = () => {
    setIsPortraitExpanded(true);
    playMelody();
  };

  const confirmLevelUp = () => {
    levelUp();
    const hpInc = parseInt(hpIncrease, 10);
    if (!isNaN(hpInc) && hpInc > 0) {
      updateHpMax(hpInc);
    }
    setIsLevelUpModalOpen(false);
    setHpIncrease('');
  };

  return (
    <div className="relative p-6 md:p-8 border-2 border-or/50 rounded-xl bg-parchemin-fonce/30 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-or rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-or rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-or rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-or rounded-br-lg" />
      
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Avatar placeholder */}
        <div 
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-or/80 bg-noir-velours flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg relative group cursor-pointer"
          onClick={handlePortraitClick}
        >
          <div className="absolute inset-0 bg-pourpre-infernal/20 group-hover:bg-pourpre-infernal/40 transition-colors z-10" />
          <img src="/azazel.webp" alt={identity.name} className="w-full h-full object-cover relative z-0 group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        <div className="flex-1 space-y-4 w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 border-b border-or/30 pb-2">
            <div>
              <h1 className="font-title-main text-4xl md:text-5xl text-pourpre-infernal drop-shadow-sm">
                {identity.name}
              </h1>
              <p className="font-section text-sm md:text-base text-encre-claire tracking-wider uppercase mt-1">
                {identity.race} ({identity.subrace}) • {identity.class} ({identity.subclass})
              </p>
            </div>
            <div className="text-left md:text-right flex flex-col items-start md:items-end">
              <div className="font-numbers text-3xl text-or-vif drop-shadow-sm flex items-center gap-2">
                Niveau {identity.level}
                {canLevelUp && (
                  <button 
                    onClick={() => setIsLevelUpModalOpen(true)}
                    className="flex items-center gap-1 text-sm bg-vert-emeraude/20 text-vert-emeraude border border-vert-emeraude/50 px-2 py-1 rounded-full hover:bg-vert-emeraude/30 transition-colors animate-pulse"
                    title="Monter de niveau !"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Level Up
                  </button>
                )}
              </div>
              <div className="font-body text-xs text-cendre uppercase tracking-widest mb-2">
                {identity.alignment}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full border bg-parchemin border-or/30 text-cendre hover:text-encre transition-colors text-sm font-section uppercase no-print"
                  title="Exporter / Imprimer"
                >
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
                <button 
                  onClick={toggleInspiration}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full border transition-colors text-sm font-section uppercase no-print",
                    combat.inspiration 
                      ? "bg-or/20 border-or text-or-vif shadow-[0_0_10px_rgba(201,147,58,0.3)]" 
                      : "bg-parchemin border-or/30 text-cendre hover:text-encre"
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  Inspiration
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-body">
            <div>
              <span className="text-cendre block text-xs uppercase tracking-wider">Âge</span>
              <span className="font-semibold">{identity.age} ans</span>
            </div>
            <div>
              <span className="text-cendre block text-xs uppercase tracking-wider">Taille / Poids</span>
              <span className="font-semibold">{identity.height} / {identity.weight}</span>
            </div>
            <div>
              <span className="text-cendre block text-xs uppercase tracking-wider">Yeux / Peau</span>
              <span className="font-semibold">{identity.eyes} / {identity.skin}</span>
            </div>
            <div>
              <span className="text-cendre block text-xs uppercase tracking-wider">Origine</span>
              <span className="font-semibold">{identity.origin}</span>
            </div>
          </div>
          
          <div className="text-sm font-body mt-2">
            <span className="text-cendre block text-xs uppercase tracking-wider">Citation</span>
            <span className="font-handwriting text-lg italic text-encre-claire">"{identity.quote}"</span>
          </div>
          
          {/* XP Bar */}
          <div className="pt-2">
            <div className="flex justify-between items-end text-xs font-numbers text-cendre mb-1">
              <div className="flex items-center gap-2">
                <span>XP: {identity.xp.toLocaleString()}</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="number" 
                    value={xpInput}
                    onChange={(e) => setXpInput(e.target.value)}
                    placeholder="+XP"
                    className="w-16 bg-parchemin border border-or/30 rounded px-1 py-0.5 text-encre focus:outline-none focus:border-or text-xs"
                  />
                  <button 
                    onClick={handleAddXp}
                    className="p-0.5 bg-or/10 hover:bg-or/20 text-or-vif rounded border border-or/30 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <span>Prochain niveau: {identity.level < 20 ? xpForNextLevel.toLocaleString() : 'Max'}</span>
            </div>
            <div className="h-2 w-full bg-encre/10 rounded-full overflow-hidden border border-or/20">
              <div 
                className={cn(
                  "h-full transition-all duration-1000 ease-out",
                  canLevelUp ? "bg-gradient-to-r from-vert-emeraude to-green-400" : "bg-gradient-to-r from-or to-or-vif"
                )}
                style={{ width: `${identity.level < 20 ? progress : 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Portrait Modal */}
      {isPortraitExpanded && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsPortraitExpanded(false)}
        >
          <div className="relative max-w-2xl w-full aspect-square md:aspect-auto md:h-[80vh] rounded-2xl overflow-hidden border-4 border-or shadow-[0_0_50px_rgba(201,147,58,0.5)] animate-in fade-in zoom-in duration-300">
            <img src="/azazel.webp" alt={identity.name} className="w-full h-full object-cover" />
            <button 
              className="absolute top-4 right-4 bg-noir-velours/50 text-parchemin p-2 rounded-full hover:bg-rouge-sang transition-colors"
              onClick={(e) => { e.stopPropagation(); setIsPortraitExpanded(false); }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Level Up Modal */}
      {isLevelUpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-parchemin-fonce border-2 border-or rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-title-main text-3xl text-pourpre-infernal mb-4 flex items-center gap-3">
              <ArrowUpCircle className="w-8 h-8 text-vert-emeraude" />
              Passage au Niveau {identity.level + 1} !
            </h2>
            
            <div className="space-y-6 font-body text-encre">
              <p className="italic text-cendre">
                Félicitations ! Votre personnage a accumulé suffisamment d'expérience pour progresser. Voici les étapes à suivre selon les règles de D&D 5e :
              </p>

              <div className="space-y-4">
                <div className="bg-parchemin p-4 rounded-lg border border-or/30">
                  <h3 className="font-title-alt text-xl text-rouge-sang mb-2">1. Points de Vie</h3>
                  <p className="text-sm mb-3">
                    Lancez votre dé de vie (<strong>{combat.hitDiceType}</strong>) ou prenez la moyenne (<strong>{Math.ceil(parseInt(combat.hitDiceType.substring(1)) / 2) + 1}</strong>), puis ajoutez votre modificateur de Constitution (<strong>{calculateModifier(stats.CON)}</strong>).
                  </p>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold">Augmenter les PV max de :</label>
                    <input 
                      type="number" 
                      value={hpIncrease}
                      onChange={(e) => setHpIncrease(e.target.value)}
                      className="w-20 bg-white border border-or/50 rounded px-2 py-1 font-numbers"
                      placeholder="ex: 6"
                    />
                  </div>
                </div>

                {[4, 8, 12, 16, 19].includes(identity.level + 1) && (
                  <div className="bg-parchemin p-4 rounded-lg border border-or/30">
                    <h3 className="font-title-alt text-xl text-or-vif mb-2">2. Amélioration de Caractéristiques ou Don</h3>
                    <p className="text-sm">
                      Vous avez atteint un palier ! Vous pouvez soit :
                    </p>
                    <ul className="list-disc list-inside text-sm ml-4 mt-2 space-y-1">
                      <li>Augmenter une caractéristique de +2</li>
                      <li>Augmenter deux caractéristiques de +1</li>
                      <li>Choisir un nouveau <strong>Don</strong> (à ajouter dans l'onglet Capacités)</li>
                    </ul>
                  </div>
                )}

                <div className="bg-parchemin p-4 rounded-lg border border-or/30">
                  <h3 className="font-title-alt text-xl text-bleu-arcane mb-2">3. Capacités de Classe & Sorts</h3>
                  <p className="text-sm">
                    Consultez le manuel des joueurs pour votre classe (<strong>{identity.class}</strong>).
                  </p>
                  <ul className="list-disc list-inside text-sm ml-4 mt-2 space-y-1">
                    <li>Ajoutez vos nouvelles capacités dans l'onglet <strong>Capacités</strong>.</li>
                    <li>Mettez à jour vos emplacements de sorts dans l'onglet <strong>Grimoire</strong>.</li>
                    <li>Apprenez de nouveaux sorts si votre classe le permet.</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-or/30">
                <button 
                  onClick={() => setIsLevelUpModalOpen(false)}
                  className="px-4 py-2 text-cendre hover:text-encre font-section uppercase text-sm transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmLevelUp}
                  className="px-6 py-2 bg-vert-emeraude text-white rounded-lg font-section uppercase text-sm hover:bg-vert-emeraude/90 transition-colors shadow-md"
                >
                  Confirmer la montée de niveau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />
    </div>
  );
}
