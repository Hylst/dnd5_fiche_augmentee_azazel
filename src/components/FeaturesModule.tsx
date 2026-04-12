import React, { useState } from 'react';
import { useCharacterStore } from '../store/characterStore';
import { Plus, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { FeatDatabaseModal } from './FeatDatabaseModal';

export function FeaturesModule() {
  const { traits, feats } = useCharacterStore();
  const [isFeatModalOpen, setIsFeatModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Feats Section */}
      <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg space-y-4">
        <div className="flex justify-between items-center border-b-2 border-or/30 pb-2">
          <h3 className="font-title-alt text-2xl text-pourpre-infernal flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-or/20 flex items-center justify-center font-numbers text-xl border border-or/50">
              {feats.length}
            </span>
            Dons
          </h3>
          <button
            onClick={() => setIsFeatModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pourpre-infernal text-parchemin rounded-lg font-section text-sm uppercase hover:bg-pourpre-infernal/90 transition-colors shadow-md border border-or/30"
          >
            <Plus className="w-4 h-4" />
            Ajouter un don
          </button>
        </div>

        {feats.length === 0 ? (
          <div className="text-center py-8 text-cendre font-body italic bg-parchemin-fonce/20 rounded-xl border border-or/20">
            Vous n'avez pas encore acquis de dons.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feats.map(feat => (
              <div key={feat.id} className="bg-parchemin p-4 rounded-xl border border-or/30 shadow-md relative group">
                <h4 className="font-title-alt text-xl text-encre mb-1 pr-8">{feat.name}</h4>
                <div className="text-xs font-body italic text-cendre mb-2">[{feat.trad}]</div>
                
                {feat.prerequisite && (
                  <div className="text-[10px] font-section uppercase text-rouge-sang mb-3 border border-rouge-sang/20 bg-rouge-sang/5 inline-block px-2 py-0.5 rounded">
                    Prérequis : {feat.prerequisite}
                  </div>
                )}
                
                <div 
                  className="font-body text-sm text-encre/80 leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-strong:text-encre overflow-y-auto max-h-48 pr-2"
                  dangerouslySetInnerHTML={{ __html: feat.descriptionHtml }}
                />
                
                <div className="mt-3 pt-3 border-t border-or/10 text-[10px] font-body text-cendre italic">
                  Source : {feat.source}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Traits Section */}
      <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg space-y-4">
        <div className="flex justify-between items-center border-b-2 border-or/30 pb-2">
          <h3 className="font-title-alt text-2xl text-pourpre-infernal flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-or/20 flex items-center justify-center font-numbers text-xl border border-or/50">
              {traits.length}
            </span>
            Traits & Capacités
          </h3>
        </div>

        {traits.length === 0 ? (
          <div className="text-center py-8 text-cendre font-body italic bg-parchemin-fonce/20 rounded-xl border border-or/20">
            Aucun trait ou capacité enregistré.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {traits.map(trait => (
              <div key={trait.id} className="bg-parchemin p-4 rounded-xl border border-or/30 shadow-md relative group">
                <h4 className="font-title-alt text-xl text-encre mb-1 pr-8 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-or" />
                  {trait.name}
                </h4>
                <div className="text-[10px] font-section uppercase text-cendre mb-3 bg-noir-velours/5 inline-block px-2 py-0.5 rounded border border-or/10">
                  {trait.source}
                </div>
                
                <div 
                  className="font-body text-sm text-encre/80 leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-strong:text-encre overflow-y-auto max-h-48 pr-2"
                  dangerouslySetInnerHTML={{ __html: trait.descriptionHtml }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <FeatDatabaseModal 
        isOpen={isFeatModalOpen} 
        onClose={() => setIsFeatModalOpen(false)} 
      />
    </div>
  );
}
