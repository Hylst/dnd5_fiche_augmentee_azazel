import { useCharacterStore } from '../store/characterStore';
import { Book, ScrollText } from 'lucide-react';

export function BackgroundModule() {
  const { identity, updateNotes } = useCharacterStore();

  return (
    <div className="space-y-8">
      <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-or/30 pb-4">
          <div className="w-12 h-12 rounded-full bg-noir-velours flex items-center justify-center border-2 border-or/50 shadow-[0_0_15px_rgba(201,147,58,0.3)]">
            <ScrollText className="w-6 h-6 text-or-vif" />
          </div>
          <div>
            <h2 className="font-title-alt text-2xl text-pourpre-infernal leading-none">Background</h2>
            <p className="font-section text-[10px] uppercase text-cendre tracking-wider mt-1">
              Histoire & Origines
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-section text-sm uppercase text-or-vif mb-2">Description</h3>
            <p className="font-body text-encre leading-relaxed whitespace-pre-wrap bg-parchemin/50 p-4 rounded-lg border border-or/20">
              {identity.description || "Aucune description."}
            </p>
          </div>
          
          <div>
            <h3 className="font-section text-sm uppercase text-or-vif mb-2">Citation</h3>
            <blockquote className="font-handwriting text-xl text-encre-claire border-l-4 border-pourpre-infernal pl-4 py-2 italic bg-parchemin/30 rounded-r-lg">
              "{identity.quote || "..."}"
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-section text-sm uppercase text-or-vif mb-2">Traits de Personnalité</h3>
              <p className="font-body text-encre leading-relaxed bg-parchemin/50 p-3 rounded-lg border border-or/20">
                {identity.personalityTraits || "Aucun."}
              </p>
            </div>
            <div>
              <h3 className="font-section text-sm uppercase text-or-vif mb-2">Idéaux</h3>
              <p className="font-body text-encre leading-relaxed bg-parchemin/50 p-3 rounded-lg border border-or/20">
                {identity.ideals || "Aucun."}
              </p>
            </div>
            <div>
              <h3 className="font-section text-sm uppercase text-or-vif mb-2">Liens</h3>
              <p className="font-body text-encre leading-relaxed bg-parchemin/50 p-3 rounded-lg border border-or/20">
                {identity.bonds || "Aucun."}
              </p>
            </div>
            <div>
              <h3 className="font-section text-sm uppercase text-or-vif mb-2">Défauts</h3>
              <p className="font-body text-encre leading-relaxed bg-parchemin/50 p-3 rounded-lg border border-or/20">
                {identity.flaws || "Aucun."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-or/30 pb-4">
          <div className="w-12 h-12 rounded-full bg-noir-velours flex items-center justify-center border-2 border-or/50 shadow-[0_0_15px_rgba(201,147,58,0.3)]">
            <Book className="w-6 h-6 text-or-vif" />
          </div>
          <div>
            <h2 className="font-title-alt text-2xl text-pourpre-infernal leading-none">Notes</h2>
            <p className="font-section text-[10px] uppercase text-cendre tracking-wider mt-1">
              Journal d'aventure
            </p>
          </div>
        </div>

        <textarea 
          className="w-full h-64 bg-parchemin border-2 border-or/40 rounded-lg p-4 font-body text-encre focus:outline-none focus:border-or focus:shadow-[0_0_10px_rgba(201,147,58,0.2)] transition-all resize-y"
          placeholder="Écrivez vos notes de campagne ici..."
          value={identity.notes}
          onChange={(e) => updateNotes(e.target.value)}
        />
      </div>
    </div>
  );
}
