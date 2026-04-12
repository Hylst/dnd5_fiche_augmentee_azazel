import { useState, ReactNode } from 'react';
import { useCharacterStore, Spell, calculateModifier, calculateProficiencyBonus } from '../store/characterStore';
import { Sparkles, Star, BookOpen, Flame, Droplet, Moon, Eye, Gem, Plus, Trash2, Target, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { SpellDatabaseModal } from './SpellDatabaseModal';

const SCHOOL_ICONS: Record<string, ReactNode> = {
  Transmutation: <Sparkles className="w-4 h-4" />,
  Enchantement: <Eye className="w-4 h-4" />,
  Évocation: <Flame className="w-4 h-4" />,
  Illusion: <Moon className="w-4 h-4" />,
};

export function SpellsModule() {
  const { spells, spellSlots, castSpell, toggleSpellFavorite, toggleSpellPrepared, removeSpell, toggleSpellSlot, identity, stats } = useCharacterStore();
  const [filter, setFilter] = useState<'all' | 'prepared' | 'favorites'>('all');
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animatingSpellId, setAnimatingSpellId] = useState<string | null>(null);

  const handleCastSpell = (spellId: string, level: number) => {
    setAnimatingSpellId(spellId);
    castSpell(spellId, level);
    setTimeout(() => {
      setAnimatingSpellId(null);
    }, 1000); // 1 second animation
  };

  const filteredSpells = spells.filter(spell => {
    if (filter === 'prepared' && !spell.isPrepared) return false;
    if (filter === 'favorites' && !spell.isFavorite) return false;
    if (levelFilter !== 'all' && spell.level !== levelFilter) return false;
    return true;
  });

  // Group spells by level
  const groupedSpells = filteredSpells.reduce((acc, spell) => {
    const level = spell.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(spell);
    return acc;
  }, {} as Record<number, Spell[]>);

  const levels = Object.keys(groupedSpells).map(Number).sort((a, b) => a - b);

  // Calculate Spellcasting Stats
  const spellcastingAbility = identity.spellcastingAbility || 'CHA';
  const profBonus = calculateProficiencyBonus(identity.level);
  const spellMod = calculateModifier(stats[spellcastingAbility]);
  const spellAttackBonus = profBonus + spellMod;
  const spellSaveDC = 8 + profBonus + spellMod;

  return (
    <div className="space-y-8">
      {/* Spellcasting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center p-4 border-2 border-or/40 rounded-xl bg-parchemin shadow-md">
          <span className="font-section text-xs uppercase text-cendre mb-1">Caractéristique</span>
          <span className="font-title-main text-2xl text-pourpre-infernal">{spellcastingAbility}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-2 border-or/40 rounded-xl bg-parchemin shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-cendre" />
            <span className="font-section text-xs uppercase text-cendre">DD de Sauvegarde</span>
          </div>
          <span className="font-numbers-alt text-3xl text-encre">{spellSaveDC}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-2 border-or/40 rounded-xl bg-parchemin shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-cendre" />
            <span className="font-section text-xs uppercase text-cendre">Bonus d'Attaque</span>
          </div>
          <span className="font-numbers-alt text-3xl text-encre">+{spellAttackBonus}</span>
        </div>
      </div>

      {/* Filters & Slots Header */}
      <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2 bg-parchemin p-1 rounded-lg border border-or/30 shadow-inner">
            <button 
              onClick={() => setFilter('all')}
              className={cn("px-4 py-2 rounded-md font-section text-sm uppercase transition-colors", filter === 'all' ? "bg-or/20 text-pourpre-infernal shadow-sm" : "text-cendre hover:text-encre")}
            >
              Tous
            </button>
            <button 
              onClick={() => setFilter('prepared')}
              className={cn("px-4 py-2 rounded-md font-section text-sm uppercase transition-colors", filter === 'prepared' ? "bg-or/20 text-pourpre-infernal shadow-sm" : "text-cendre hover:text-encre")}
            >
              Préparés
            </button>
            <button 
              onClick={() => setFilter('favorites')}
              className={cn("px-4 py-2 rounded-md font-section text-sm uppercase transition-colors", filter === 'favorites' ? "bg-or/20 text-pourpre-infernal shadow-sm" : "text-cendre hover:text-encre")}
            >
              Favoris
            </button>
          </div>
          <div className="flex gap-2">
            <select 
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-4 py-2 bg-parchemin border border-or/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-or/50 font-section text-sm uppercase text-encre shadow-sm"
            >
              <option value="all">Tous les niveaux</option>
              <option value={0}>Tours de magie</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => (
                <option key={lvl} value={lvl}>Niveau {lvl}</option>
              ))}
            </select>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pourpre-infernal text-parchemin rounded-lg font-section text-sm uppercase hover:bg-pourpre-infernal/90 transition-colors shadow-md border border-or/30"
            >
              <Plus className="w-4 h-4" />
              Ajouter un sort
            </button>
          </div>
        </div>

        {/* Spell Slots Tracker */}
        <div className="flex gap-4">
          {spellSlots.map(slot => (
            <div key={slot.level} className="flex flex-col items-center bg-noir-velours/5 p-2 rounded-lg border border-or/20">
              <span className="font-section text-[10px] uppercase text-cendre mb-1">Niveau {slot.level}</span>
              <div className="flex gap-1">
                {Array.from({ length: slot.max }).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => toggleSpellSlot(slot.level, i)}
                    className={cn(
                      "w-3 h-3 rounded-full border transition-all duration-300 cursor-pointer hover:scale-125",
                      i < slot.current ? "bg-bleu-arcane border-bleu-arcane/50 shadow-[0_0_5px_rgba(26,42,108,0.5)]" : "bg-cendre/20 border-cendre/50"
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spells List */}
      <div className="space-y-8">
        {levels.map(level => (
          <div key={level} className="space-y-4">
            <h3 className="font-title-alt text-2xl text-pourpre-infernal border-b-2 border-or/30 pb-2 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-or/20 flex items-center justify-center font-numbers text-xl border border-or/50">
                {level}
              </span>
              {level === 0 ? 'Tours de Magie (Cantrips)' : `Sorts de Niveau ${level}`}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {groupedSpells[level].map(spell => (
                <div 
                  key={spell.id}
                  className={cn(
                    "group relative p-5 border-2 rounded-xl bg-parchemin shadow-md transition-all duration-300 overflow-hidden flex flex-col",
                    animatingSpellId === spell.id 
                      ? "border-or-vif shadow-[0_0_15px_rgba(232,168,50,0.5)] scale-[0.98]" 
                      : "border-or/30 hover:shadow-lg hover:border-or/60"
                  )}
                >
                  {/* Decorative background element */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-or/5 rounded-full blur-xl group-hover:bg-or/10 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div>
                      <h4 className="font-title-main text-xl text-encre leading-tight group-hover:text-pourpre-infernal transition-colors">
                        {spell.name}
                      </h4>
                      <div className="text-xs font-body italic text-cendre mb-1">[{spell.trad}]</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-section text-[10px] uppercase text-cendre flex items-center gap-1">
                          {SCHOOL_ICONS[spell.school] || <BookOpen className="w-3 h-3" />}
                          {spell.school}
                        </span>
                        {spell.isRitual && (
                          <span className="font-section text-[9px] uppercase px-2 py-0.5 rounded-full border bg-or/10 text-or border-or/20">
                            Rituel
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => toggleSpellFavorite(spell.id)} className="p-1 hover:bg-or/10 rounded transition-colors" title="Favori">
                        <Star className={cn("w-5 h-5", spell.isFavorite ? "text-or-vif fill-or-vif" : "text-cendre")} />
                      </button>
                      <button onClick={() => removeSpell(spell.id)} className="p-1 hover:bg-rouge-sang/10 rounded transition-colors group/delete" title="Supprimer">
                        <Trash2 className="w-5 h-5 text-cendre group-hover/delete:text-rouge-sang" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-body text-encre-claire relative z-10">
                    <div><span className="font-semibold text-encre">Temps:</span> {spell.castingTime}</div>
                    <div><span className="font-semibold text-encre">Portée:</span> {spell.range}</div>
                    <div><span className="font-semibold text-encre">Comp:</span> {spell.components}</div>
                    <div>
                      <span className="font-semibold text-encre">Durée:</span> {spell.duration}
                      {spell.concentration && <span className="ml-1 text-[10px] px-1 bg-rouge-sang/10 text-rouge-sang rounded border border-rouge-sang/20 uppercase font-section">Conc</span>}
                    </div>
                  </div>

                  <div 
                    className="font-body text-sm text-encre/80 flex-1 relative z-10 leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-strong:text-encre overflow-y-auto max-h-48 pr-2"
                    dangerouslySetInnerHTML={{ __html: spell.descriptionHtml }}
                  />

                  <div className="mt-3 pt-3 border-t border-or/10 text-[10px] font-body text-cendre flex flex-col gap-1 relative z-10">
                    <div><strong className="text-encre-claire">Classes:</strong> {spell.classes.join(', ')}</div>
                    <div className="italic">{spell.source}</div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-or/20 flex justify-between items-center relative z-10">
                    <label className="flex items-center gap-2 cursor-pointer group/label">
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={spell.isPrepared}
                        onChange={() => toggleSpellPrepared(spell.id)}
                      />
                      <div className={cn(
                        "w-4 h-4 rounded-sm border flex items-center justify-center transition-colors",
                        spell.isPrepared ? "bg-vert-emeraude border-vert-emeraude" : "bg-parchemin-fonce border-cendre group-hover/label:border-or"
                      )}>
                        {spell.isPrepared && <span className="text-parchemin text-[10px]">✓</span>}
                      </div>
                      <span className="font-section text-[10px] uppercase text-cendre group-hover/label:text-encre">Préparé</span>
                    </label>

                    <button 
                      onClick={() => handleCastSpell(spell.id, spell.level)}
                      disabled={spell.level > 0 && (!spellSlots.find(s => s.level === spell.level) || spellSlots.find(s => s.level === spell.level)!.current === 0)}
                      className={cn(
                        "px-4 py-1.5 font-section text-xs uppercase rounded transition-all shadow-sm flex items-center gap-2",
                        animatingSpellId === spell.id
                          ? "bg-or-vif text-parchemin scale-95"
                          : "bg-rouge-sang text-parchemin hover:bg-rouge-sang/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                    >
                      <Sparkles className={cn("w-3 h-3", animatingSpellId === spell.id && "animate-spin")} />
                      Lancer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SpellDatabaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
