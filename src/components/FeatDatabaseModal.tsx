import React, { useState } from 'react';
import { Search, X, Plus, Check } from 'lucide-react';
import { useCharacterStore } from '../store/characterStore';
import { allFeats, FeatData } from '../data/allFeats';
import { cn } from '../lib/utils';

interface FeatDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeatDatabaseModal({ isOpen, onClose }: FeatDatabaseModalProps) {
  const { feats, addFeat } = useCharacterStore();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredFeats = allFeats.filter(feat => {
    const matchesSearch = feat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          feat.trad.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir-velours/80 backdrop-blur-sm">
      <div className="bg-parchemin w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl border-2 border-or/40 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b-2 border-or/30 bg-parchemin-fonce/50 flex justify-between items-center">
          <h2 className="font-title-alt text-2xl text-pourpre-infernal">Encyclopédie des Dons</h2>
          <button 
            onClick={onClose}
            className="p-2 text-cendre hover:text-rouge-sang transition-colors rounded-lg hover:bg-rouge-sang/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-or/20 bg-parchemin-fonce/30 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cendre" />
            <input
              type="text"
              placeholder="Rechercher un don (ex: Tireur d'élite, Sharpshooter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-parchemin border border-or/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-or/50 font-body text-encre placeholder:text-cendre/70"
            />
          </div>
        </div>

        {/* Feats List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-parchemin/50">
          {filteredFeats.length === 0 ? (
            <div className="text-center py-12 text-cendre font-body italic">
              Aucun don ne correspond à votre recherche...
            </div>
          ) : (
            filteredFeats.map(feat => {
              const known = feats.some(f => f.id === feat.id);
              
              return (
                <div 
                  key={feat.id} 
                  className={cn(
                    "flex flex-col sm:flex-row gap-4 bg-parchemin p-4 rounded-xl border transition-all",
                    known ? "border-vert-emeraude/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]" : "border-or/20 hover:border-or/50 hover:shadow-md"
                  )}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                      <h3 className="font-title-alt text-xl text-encre">{feat.name}</h3>
                      <span className="font-body text-sm italic text-cendre">[{feat.trad}]</span>
                    </div>
                    
                    {feat.prerequisite && (
                      <div className="text-xs font-section uppercase text-rouge-sang mb-2 border border-rouge-sang/20 bg-rouge-sang/5 inline-block px-2 py-0.5 rounded">
                        Prérequis : {feat.prerequisite}
                      </div>
                    )}
                    
                    <div 
                      className="text-sm font-body text-encre/80 line-clamp-3 prose prose-sm max-w-none prose-p:my-1 prose-strong:text-encre"
                      dangerouslySetInnerHTML={{ __html: feat.descriptionHtml }}
                    />
                    
                    <div className="mt-2 text-[10px] font-body text-cendre italic">
                      Source : {feat.source}
                    </div>
                  </div>
                  
                  <div className="flex items-center sm:pl-4 sm:border-l border-or/20">
                    <button
                      onClick={() => !known && addFeat(feat)}
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
