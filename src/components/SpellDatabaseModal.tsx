import { useState } from 'react';
import { Search, X, Plus, Check } from 'lucide-react';
import { useCharacterStore, Spell } from '../store/characterStore';
import { allSpells } from '../data/allSpells';
import { cn } from '../lib/utils';

interface SpellDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpellDatabaseModal({ isOpen, onClose }: SpellDatabaseModalProps) {
  const { spells, addSpell, identity } = useCharacterStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');
  const [classFilter, setClassFilter] = useState<string>(identity.class || 'all');

  if (!isOpen) return null;

  const filteredSpells = allSpells.filter(spell => {
    if (searchQuery && !spell.name.toLowerCase().includes(searchQuery.toLowerCase()) && !spell.trad.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (levelFilter !== 'all' && spell.level !== levelFilter) return false;
    if (classFilter !== 'all' && !spell.classes.includes(classFilter)) return false;
    return true;
  });

  const isSpellKnown = (spellId: string) => spells.some(s => s.id === spellId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir-velours/80 backdrop-blur-sm">
      <div className="bg-parchemin w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl border-2 border-or/40 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b-2 border-or/20 flex justify-between items-center bg-parchemin-fonce/30">
          <h2 className="font-title text-3xl text-pourpre-infernal">Grimoire des Sorts</h2>
          <button 
            onClick={onClose}
            className="p-2 text-cendre hover:text-pourpre-infernal transition-colors rounded-full hover:bg-or/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-or/20 flex flex-col sm:flex-row gap-4 bg-parchemin/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cendre" />
            <input 
              type="text" 
              placeholder="Rechercher un sort (nom ou trad)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-or/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-or/50 font-body text-encre"
            />
          </div>
          <select 
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-4 py-2 bg-white/50 border border-or/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-or/50 font-section text-encre"
          >
            <option value="all">Toutes les classes</option>
            <option value="Barde">Barde</option>
            <option value="Clerc">Clerc</option>
            <option value="Druide">Druide</option>
            <option value="Ensorceleur">Ensorceleur</option>
            <option value="Magicien">Magicien</option>
            <option value="Occultiste">Occultiste</option>
            <option value="Paladin">Paladin</option>
            <option value="Rôdeur">Rôdeur</option>
          </select>
          <select 
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-4 py-2 bg-white/50 border border-or/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-or/50 font-section text-encre"
          >
            <option value="all">Tous les niveaux</option>
            <option value={0}>Tours de magie</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(lvl => (
              <option key={lvl} value={lvl}>Niveau {lvl}</option>
            ))}
          </select>
        </div>

        {/* Spells List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredSpells.length === 0 ? (
            <div className="text-center text-cendre py-12 font-body italic">
              Aucun sort ne correspond à votre recherche.
            </div>
          ) : (
            filteredSpells.map(spell => {
              const known = isSpellKnown(spell.id);
              return (
                <div key={spell.id} className="bg-white/40 border border-or/20 rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover:border-or/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-title-alt text-xl text-encre">{spell.name}</h3>
                      <span className="text-sm font-body italic text-cendre">[{spell.trad}]</span>
                      <span className="px-2 py-0.5 rounded text-xs font-section uppercase bg-parchemin-fonce text-cendre border border-or/20">
                        Niv. {spell.level}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-section uppercase bg-bleu-arcane/10 text-bleu-arcane border border-bleu-arcane/20">
                        {spell.school}
                      </span>
                      {spell.isRitual && (
                        <span className="px-2 py-0.5 rounded text-xs font-section uppercase bg-or/10 text-or border border-or/20">
                          Rituel
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-body text-cendre mb-2 flex flex-wrap gap-x-4 gap-y-1">
                      <span><strong className="text-encre">Temps:</strong> {spell.castingTime}</span>
                      <span><strong className="text-encre">Portée:</strong> {spell.range}</span>
                      <span><strong className="text-encre">Comp.:</strong> {spell.components}</span>
                      <span><strong className="text-encre">Durée:</strong> {spell.duration} {spell.concentration && '(C)'}</span>
                    </div>
                    <div 
                      className="text-sm font-body text-encre/80 line-clamp-2 prose prose-sm max-w-none prose-p:my-1 prose-strong:text-encre"
                      dangerouslySetInnerHTML={{ __html: spell.descriptionHtml }}
                    />
                    <div className="mt-2 text-[10px] font-body text-cendre flex flex-col gap-0.5">
                      <div><strong className="text-encre-claire">Classes:</strong> {spell.classes.join(', ')}</div>
                      <div className="italic">{spell.source}</div>
                    </div>
                  </div>
                  <div className="flex items-center sm:pl-4 sm:border-l border-or/20">
                    <button
                      onClick={() => !known && addSpell(spell)}
                      disabled={known}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-section text-sm uppercase transition-all w-full sm:w-auto justify-center",
                        known 
                          ? "bg-vert-emeraude/20 text-vert-emeraude border border-vert-emeraude/30 cursor-not-allowed" 
                          : "bg-or/20 text-pourpre-infernal border border-or/40 hover:bg-or/30 hover:scale-105"
                      )}
                    >
                      {known ? (
                        <>
                          <Check className="w-4 h-4" />
                          Acquis
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Ajouter
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
