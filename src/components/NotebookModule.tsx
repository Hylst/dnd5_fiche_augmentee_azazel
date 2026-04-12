import { FormEvent, useRef, ChangeEvent } from 'react';
import { BookOpen, Search, Download, Upload, Save, DatabaseBackup } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCharacterStore } from '../store/characterStore';

export function NotebookModule() {
  const character = useCharacterStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportMarkdown = () => {
    const markdown = `# ${character.identity.name}
## Identité
- **Race:** ${character.identity.race} (${character.identity.subrace})
- **Classe:** ${character.identity.class} (${character.identity.subclass})
- **Niveau:** ${character.identity.level}
- **Alignement:** ${character.identity.alignment}
- **Historique:** ${character.identity.origin}
- **Âge:** ${character.identity.age} ans
- **Taille / Poids:** ${character.identity.height} / ${character.identity.weight}
- **Yeux / Peau / Cheveux:** ${character.identity.eyes} / ${character.identity.skin} / ${character.identity.hair}

## Maîtrises & Langues
- **Armures:** ${character.identity.proficiencies.armor}
- **Armes:** ${character.identity.proficiencies.weapons}
- **Outils:** ${character.identity.proficiencies.tools}
- **Langues:** ${character.identity.proficiencies.languages}

## Caractéristiques
- **FOR:** ${character.stats.FOR}
- **DEX:** ${character.stats.DEX}
- **CON:** ${character.stats.CON}
- **INT:** ${character.stats.INT}
- **SAG:** ${character.stats.SAG}
- **CHA:** ${character.stats.CHA}

## Combat
- **Points de vie:** ${character.combat.hpCurrent} / ${character.combat.hpMax}
- **Classe d'armure:** ${character.combat.acBase}
- **Vitesse:** ${character.combat.speed}m
- **Inspiration:** ${character.combat.inspiration ? 'Oui' : 'Non'}

## Traits et Capacités
${character.traits.map(t => `- **${t.name}**: ${t.descriptionHtml.replace(/<[^>]+>/g, '')}`).join('\n')}

## Dons
${character.feats.length > 0 ? character.feats.map(f => `- **${f.name}**: ${f.descriptionHtml.replace(/<[^>]+>/g, '')}`).join('\n') : 'Aucun'}

## Sorts
${character.spells.map(s => `- **${s.name}** (Niv ${s.level}): ${s.descriptionHtml.replace(/<[^>]+>/g, '')}`).join('\n')}

## Inventaire
${character.inventory.map(i => `- **${i.name}** (x${i.quantity}): ${i.description}`).join('\n')}

## Background & Notes
${character.identity.description}

### Traits de Personnalité
${character.identity.personalityTraits || 'Aucun'}

### Idéaux
${character.identity.ideals || 'Aucun'}

### Liens
${character.identity.bonds || 'Aucun'}

### Défauts
${character.identity.flaws || 'Aucun'}

### Citation
> ${character.identity.quote}

### Notes de campagne
${character.identity.notes}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.identity.name.replace(/\s+/g, '_')}_Fiche.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const normalizedData = {
      id: "char_custom_01",
      identity: character.identity,
      stats: character.stats,
      combat: character.combat,
      savingThrows: character.savingThrows,
      skills: character.skills,
      resources: character.resources,
      spellSlots: character.spellSlots,
      knownSpellsIds: character.spells.map(s => s.id),
      favoriteSpellsIds: character.spells.filter(s => s.isFavorite).map(s => s.id),
      knownFeatsIds: character.feats.map(f => f.id),
      knownTraitsIds: character.traits.map(t => t.id),
      inventory: character.inventory.map(i => ({ itemId: i.id, quantity: i.quantity, equipped: i.equipped })),
      currency: character.currency
    };

    const blob = new Blob([JSON.stringify(normalizedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.identity.name.replace(/\s+/g, '_')}_Data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        await character.loadCharacterFromJson(data);
      } catch (err) {
        console.error("Erreur lors de la lecture du fichier JSON:", err);
        alert("Erreur lors de la lecture du fichier JSON.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 border-2 border-or/30 rounded-xl bg-parchemin-fonce/20 shadow-lg h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 border-b-2 border-or/30 pb-4">
        <div className="w-12 h-12 rounded-full bg-noir-velours flex items-center justify-center border-2 border-or/50 shadow-[0_0_15px_rgba(201,147,58,0.3)]">
          <DatabaseBackup className="w-6 h-6 text-or-vif" />
        </div>
        <div>
          <h2 className="font-title-alt text-2xl text-pourpre-infernal leading-none">Gestion des Données</h2>
          <p className="font-section text-[10px] uppercase text-cendre tracking-wider mt-1">
            Sauvegarde, Import & Export de la Fiche
          </p>
        </div>
      </div>

      <div className="flex-1 bg-parchemin/50 border-2 border-or/20 rounded-lg p-6 overflow-y-auto relative flex flex-col items-center justify-center space-y-8">
        
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <DatabaseBackup className="w-64 h-64 text-encre" />
        </div>

        <div className="relative z-10 w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <h3 className="font-title-main text-xl text-encre">Synchronisation Locale</h3>
            <p className="font-body text-cendre text-sm mt-2">
              Vos données sont automatiquement enregistrées dans ce navigateur. Vous pouvez également les exporter pour les conserver ou les partager.
            </p>
          </div>

          <input
            type="file"
            accept=".json"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImportJson}
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-or/10 hover:bg-or/20 text-pourpre-infernal border-2 border-or/30 rounded-lg transition-colors font-section uppercase tracking-wider"
          >
            <Upload className="w-5 h-5" />
            Importer des données (JSON)
          </button>
          
          <button
            onClick={handleExportJson}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-or/10 hover:bg-or/20 text-pourpre-infernal border-2 border-or/30 rounded-lg transition-colors font-section uppercase tracking-wider"
          >
            <Save className="w-5 h-5" />
            Sauvegarder les données (JSON)
          </button>
          
          <button
            onClick={handleExportMarkdown}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-or/10 hover:bg-or/20 text-pourpre-infernal border-2 border-or/30 rounded-lg transition-colors font-section uppercase tracking-wider"
          >
            <Download className="w-5 h-5" />
            Exporter la Fiche Complète (Markdown)
          </button>

        </div>
      </div>
    </div>
  );
}
