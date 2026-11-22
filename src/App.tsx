import { useState, useEffect } from 'react';
import { BookOpen, Shield, Swords, Sparkles, Scroll, Backpack, Settings, Menu, ScrollText, Loader2, Info, Volume2, Moon, Sun, Plus, Trash2 } from 'lucide-react';
import { cn } from './lib/utils';
import { IdentityHeader } from './components/IdentityHeader';
import { StatsModule } from './components/StatsModule';
import { CombatModule } from './components/CombatModule';
import { StatusModule } from './components/StatusModule';
import { SkillsModule } from './components/SkillsModule';
import { ResourcesModule } from './components/ResourcesModule';
import { RestModule } from './components/RestModule';
import { SpellsModule } from './components/SpellsModule';
import { AttacksModule } from './components/AttacksModule';
import { FeaturesModule } from './components/FeaturesModule';
import { InventoryModule } from './components/InventoryModule';
import { NotebookModule } from './components/NotebookModule';
import { BackgroundModule } from './components/BackgroundModule';
import { SoundboardModule } from './components/SoundboardModule';
import { DiceRoller } from './components/DiceRoller';
import { InfoModal } from './components/InfoModal';
import { Notifications } from './components/Notifications';
import { useCharacterStore } from './store/characterStore';
import { useSettingsStore } from './store/settingsStore';
import { characterRepository } from './services/characterRepository';

type Tab = 'overview' | 'combat' | 'spells' | 'features' | 'inventory' | 'background' | 'notebook' | 'soundboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [characterId, setCharacterId] = useState(() => localStorage.getItem('dnd5_current_character') || 'char_azazel_01');
  const [characters, setCharacters] = useState(() => characterRepository.listCharacters());
  const [showMigrationNotice, setShowMigrationNotice] = useState(() => localStorage.getItem('dnd5_migration_notice_dismissed') !== '1');
  
  const { isLoading, loadCharacter, getSerializableState, identity } = useCharacterStore();
  const { theme, toggleTheme } = useSettingsStore();

  const refreshCharacters = () => setCharacters(characterRepository.listCharacters());

  const dismissMigrationNotice = () => {
    localStorage.setItem('dnd5_migration_notice_dismissed', '1');
    setShowMigrationNotice(false);
  };

  useEffect(() => {
    const isDark = 
      theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dnd5_current_character', characterId);
    loadCharacter(characterId);
  }, [characterId, loadCharacter]);

  useEffect(() => {
    refreshCharacters();
  }, [characterId]);

  // Auto-save logic (Backend Ready)
  useEffect(() => {
    if (isLoading) return;

    const unsubscribe = useCharacterStore.subscribe((state, prevState) => {
      // Don't save if it's just loading state changing
      if (state.isLoading !== prevState.isLoading) return;
      
      const timeoutId = setTimeout(() => {
        const dataToSave = state.getSerializableState();
        characterRepository.saveCharacter(characterId, dataToSave).catch(console.error);
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    });

    return () => unsubscribe();
  }, [isLoading, characterId]);

  const handleSwitchCharacter = async (id: string) => {
    if (id === characterId) return;
    try {
      await characterRepository.saveCharacter(characterId, getSerializableState());
    } catch (error) {
      console.error(error);
    }
    setCharacterId(id);
  };

  const handleCreateCharacter = async () => {
    const name = window.prompt('Nom du nouveau personnage ?', 'Nouveau personnage')?.trim();
    if (!name) return;
    const id = `char_${Date.now().toString(36)}`;
    const data = getSerializableState();
    data.id = id;
    data.identity = { ...data.identity, name, nickname: '', portrait: undefined };
    try {
      await characterRepository.saveCharacter(id, data);
      refreshCharacters();
      setCharacterId(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCharacter = () => {
    if (characters.length <= 1) {
      window.alert('Gardez au moins un personnage.');
      return;
    }
    const current = characters.find((character) => character.id === characterId);
    if (!window.confirm(`Supprimer la fiche « ${current?.name || characterId} » ?`)) return;
    characterRepository.deleteCharacter(characterId);
    const remaining = characterRepository.listCharacters().filter((character) => character.id !== characterId);
    const next = remaining[0]?.id || 'char_azazel_01';
    setCharacterId(next);
    refreshCharacters();
  };

  const navItems = [
    { id: 'overview', label: 'Vue Générale', icon: Scroll },
    { id: 'combat', label: 'Combat', icon: Swords },
    { id: 'spells', label: 'Grimoire', icon: Sparkles },
    { id: 'features', label: 'Capacités', icon: BookOpen },
    { id: 'inventory', label: 'Inventaire', icon: Backpack },
    { id: 'background', label: 'Histoire & Notes', icon: ScrollText },
    { id: 'soundboard', label: 'Ambiance & Sons', icon: Volume2 },
    { id: 'notebook', label: 'Gestion des Données', icon: Settings },
  ] as const;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-parchemin text-encre font-body">
        <Loader2 className="w-12 h-12 animate-spin text-pourpre-infernal mb-4" />
        <h2 className="font-title-main text-2xl text-pourpre-infernal">Chargement du grimoire...</h2>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-parchemin text-encre font-body">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-parchemin-fonce border-r-2 border-or/30 transform transition-transform duration-300 ease-in-out flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 border-b-2 border-or/30 flex justify-between items-center overflow-hidden">
          <div className="overflow-hidden flex-1 mr-2">
            <h1
              className="font-title-main text-lg text-pourpre-infernal whitespace-nowrap"
              style={{
                animation: 'marquee-title 12s linear infinite',
                display: 'inline-block',
              }}
            >
              Fiches D&D&nbsp;5e Augmentées
            </h1>
          </div>
          <button className="md:hidden shrink-0" onClick={() => setIsSidebarOpen(false)}>
            <Menu className="w-6 h-6 text-encre" />
          </button>
        </div>

        <div className="p-3 border-b border-or/20 bg-parchemin/40">
          <label htmlFor="character-select" className="block text-[10px] uppercase tracking-widest text-cendre mb-1 font-section">
            Personnage
          </label>
          <div className="flex items-center gap-1">
            <select
              id="character-select"
              value={characterId}
              onChange={(event) => handleSwitchCharacter(event.target.value)}
              className="flex-1 min-w-0 bg-parchemin border border-or/30 rounded px-2 py-1.5 text-sm font-body text-encre focus:outline-none focus:border-or-vif"
            >
              {characters.map((character) => (
                <option key={character.id} value={character.id}>{character.name}</option>
              ))}
            </select>
            <button
              onClick={handleCreateCharacter}
              title="Nouveau personnage"
              className="p-1.5 rounded border border-or/30 text-or-vif hover:bg-or/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteCharacter}
              title="Supprimer ce personnage"
              className="p-1.5 rounded border border-or/30 text-rouge-sang hover:bg-rouge-sang/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-section",
                  isActive 
                    ? "bg-or/20 text-pourpre-infernal shadow-[inset_0_0_10px_rgba(201,147,58,0.2)] border border-or/50" 
                    : "hover:bg-or/10 text-encre-claire hover:text-encre"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-or-vif" : "text-cendre")} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t-2 border-or/30 flex justify-between items-center text-xs text-cendre font-handwriting">
          <span className="truncate max-w-[60%]">{identity.name}{identity.class ? ` - ${identity.class}` : ''}</span>
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleTheme}
              className="p-1 rounded-full hover:bg-pourpre-infernal/10 hover:text-pourpre-infernal transition-colors"
              title="Changer le thème"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-or-vif" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsInfoModalOpen(true)}
              className="p-1 rounded-full hover:bg-pourpre-infernal/10 hover:text-pourpre-infernal transition-colors"
              title="À propos de l'application"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b-2 border-or/30 bg-parchemin-fonce/50">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-encre" />
          </button>
          <span className="font-title-main text-xl text-pourpre-infernal">{identity.name}</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {showMigrationNotice && (
              <div className="rounded-lg border border-or/50 bg-or/10 p-4 font-body text-sm text-encre flex flex-col md:flex-row md:items-center gap-3">
                <p className="flex-1">
                  Vous utilisiez la fiche D&D 5e sur <strong>hylst.fr</strong> ? Vos personnages sont restés dans le
                  stockage local de l'ancienne adresse. <a className="underline text-pourpre-infernal" href="https://hylst.fr/recuperation-dnd5.html">Exportez-les</a>,
                  puis <a className="underline text-pourpre-infernal" href="https://games.hylst.fr/restauration-dnd5.html">restaurez-les ici</a>.
                </p>
                <button
                  onClick={dismissMigrationNotice}
                  className="shrink-0 px-3 py-1.5 rounded border border-or/40 bg-parchemin text-cendre hover:text-encre text-xs uppercase font-section"
                >
                  Masquer
                </button>
              </div>
            )}

            <IdentityHeader />
            
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3">
                  <StatsModule />
                </div>
                <div className="lg:col-span-5 space-y-8">
                  <RestModule />
                  <CombatModule />
                  <StatusModule />
                  <ResourcesModule />
                </div>
                <div className="lg:col-span-4">
                  <SkillsModule />
                </div>
              </div>
            )}

            {activeTab === 'combat' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <CombatModule />
                  <StatusModule />
                  <ResourcesModule />
                </div>
                <div>
                  <AttacksModule />
                </div>
              </div>
            )}

            {activeTab === 'spells' && (
              <SpellsModule />
            )}
            
            {activeTab === 'features' && (
              <FeaturesModule />
            )}

            {activeTab === 'inventory' && (
              <InventoryModule />
            )}

            {activeTab === 'background' && (
              <BackgroundModule />
            )}

            {activeTab === 'soundboard' && (
              <SoundboardModule />
            )}

            {activeTab === 'notebook' && (
              <NotebookModule />
            )}
          </div>
        </div>
      </main>
      
      <DiceRoller />
      <Notifications />
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
}

