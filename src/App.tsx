import { useState, useEffect, useRef } from 'react';
import { BookOpen, Shield, Swords, Sparkles, Scroll, Backpack, Settings, Menu, ScrollText, Loader2, Info, Volume2 } from 'lucide-react';
import { cn } from './lib/utils';
import { IdentityHeader } from './components/IdentityHeader';
import { StatsModule } from './components/StatsModule';
import { CombatModule } from './components/CombatModule';
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
import { saveCharacter } from './services/dbService';

type Tab = 'overview' | 'combat' | 'spells' | 'features' | 'inventory' | 'background' | 'notebook' | 'soundboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const { isLoading, loadCharacter, getSerializableState } = useCharacterStore();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Load Azazel by default for now
    loadCharacter('char_azazel_01');
  }, [loadCharacter]);

  // Auto-save logic (Backend Ready)
  useEffect(() => {
    if (isLoading) return;

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const unsubscribe = useCharacterStore.subscribe((state, prevState) => {
      // Don't save if it's just loading state changing
      if (state.isLoading !== prevState.isLoading) return;
      
      const timeoutId = setTimeout(() => {
        const dataToSave = state.getSerializableState();
        saveCharacter('char_azazel_01', dataToSave).catch(console.error);
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    });

    return () => unsubscribe();
  }, [isLoading]);

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
          <span>Azazel Varn - Collège des Murmures</span>
          <button 
            onClick={() => setIsInfoModalOpen(true)}
            className="p-1 rounded-full hover:bg-pourpre-infernal/10 hover:text-pourpre-infernal transition-colors"
            title="À propos de l'application"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b-2 border-or/30 bg-parchemin-fonce/50">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-encre" />
          </button>
          <span className="font-title-main text-xl text-pourpre-infernal">Azazel Varn</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <IdentityHeader />
            
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3">
                  <StatsModule />
                </div>
                <div className="lg:col-span-5 space-y-8">
                  <RestModule />
                  <CombatModule />
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

