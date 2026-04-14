import React from 'react';
import { useCharacterStore } from '../store/characterStore';
import { generateCharacterHTML, downloadFile } from '../lib/exportUtils';
import { FileText, FileCode, FileJson, Printer, X, Download, Upload } from 'lucide-react';
import { characterRepository } from '../services/characterRepository';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const state = useCharacterStore();

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const data = state.getSerializableState();
    downloadFile(JSON.stringify(data, null, 2), `${state.identity.name.replace(/\s+/g, '_')}_data.json`, 'application/json');
    onClose();
  };

  const handleExportHTML = () => {
    const html = generateCharacterHTML(state);
    downloadFile(html, `${state.identity.name.replace(/\s+/g, '_')}_fiche.html`, 'text/html');
    onClose();
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsedData = await characterRepository.importCharacter(text);
        
        await state.loadCharacterFromJson(parsedData);
        // addNotification requires 'info' | 'success' | 'warning' | 'error' ? 
        // type: 'info' | 'success' | 'warning' | 'critical' | 'critical-fail'
        state.addNotification("Personnage importé avec succès !", "success");
        onClose();
      } catch (error) {
        state.addNotification((error as Error).message, "critical-fail");
      }
    };
    reader.readAsText(file);
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportDOC = () => {
    const html = generateCharacterHTML(state);
    downloadFile(html, `${state.identity.name.replace(/\s+/g, '_')}_fiche.doc`, 'application/msword');
    onClose();
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-parchemin-fonce border-2 border-or rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button 
          className="absolute top-4 right-4 text-cendre hover:text-rouge-sang transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="font-title-main text-3xl text-pourpre-infernal mb-6 flex items-center gap-3">
          <Download className="w-6 h-6 text-or" />
          Données du Personnage
        </h2>

        <div className="space-y-3">
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleImportJSON} 
            className="hidden" 
            id="import-json"
          />
          <label 
            htmlFor="import-json"
            className="w-full flex items-center gap-4 p-4 bg-parchemin border border-vert-emeraude/30 rounded-lg hover:bg-vert-emeraude/10 hover:border-vert-emeraude transition-all cursor-pointer group"
          >
            <div className="bg-vert-emeraude/10 p-2 rounded-full group-hover:bg-vert-emeraude/20 transition-colors">
              <Upload className="w-6 h-6 text-vert-emeraude" />
            </div>
            <div className="text-left">
              <div className="font-title-alt text-lg text-encre">Importer (.json)</div>
              <div className="font-body text-xs text-cendre">Restaurer un personnage sauvegardé précédemment.</div>
            </div>
          </label>
          <button 
            onClick={handlePrint}
            className="w-full flex items-center gap-4 p-4 bg-parchemin border border-or/30 rounded-lg hover:bg-or/10 hover:border-or transition-all group"
          >
            <div className="bg-vert-emeraude/10 p-2 rounded-full group-hover:bg-vert-emeraude/20 transition-colors">
              <Printer className="w-6 h-6 text-vert-emeraude" />
            </div>
            <div className="text-left">
              <div className="font-title-alt text-lg text-encre">Imprimer (PDF)</div>
              <div className="font-body text-xs text-cendre">Format optimisé pour l'impression papier ou sauvegarde PDF.</div>
            </div>
          </button>

          <button 
            onClick={handleExportDOC}
            className="w-full flex items-center gap-4 p-4 bg-parchemin border border-or/30 rounded-lg hover:bg-or/10 hover:border-or transition-all group"
          >
            <div className="bg-blue-500/10 p-2 rounded-full group-hover:bg-blue-500/20 transition-colors">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <div className="font-title-alt text-lg text-encre">Document Word (.doc)</div>
              <div className="font-body text-xs text-cendre">Fichier lisible et modifiable dans Microsoft Word.</div>
            </div>
          </button>

          <button 
            onClick={handleExportHTML}
            className="w-full flex items-center gap-4 p-4 bg-parchemin border border-or/30 rounded-lg hover:bg-or/10 hover:border-or transition-all group"
          >
            <div className="bg-orange-500/10 p-2 rounded-full group-hover:bg-orange-500/20 transition-colors">
              <FileCode className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-left">
              <div className="font-title-alt text-lg text-encre">Page Web (.html)</div>
              <div className="font-body text-xs text-cendre">Fichier lisible dans n'importe quel navigateur web.</div>
            </div>
          </button>

          <button 
            onClick={handleExportJSON}
            className="w-full flex items-center gap-4 p-4 bg-parchemin border border-or/30 rounded-lg hover:bg-or/10 hover:border-or transition-all group"
          >
            <div className="bg-pourpre-infernal/10 p-2 rounded-full group-hover:bg-pourpre-infernal/20 transition-colors">
              <FileJson className="w-6 h-6 text-pourpre-infernal" />
            </div>
            <div className="text-left">
              <div className="font-title-alt text-lg text-encre">Données Brutes (.json)</div>
              <div className="font-body text-xs text-cendre">Format de sauvegarde technique pour réimporter plus tard.</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
