import { useState } from 'react';
import { X, Info, Star, Package, BookOpen, Lightbulb, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'about' | 'features' | 'content' | 'usage' | 'tips' | 'creator';

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('about');

  if (!isOpen) return null;

  const tabs = [
    { id: 'about', label: 'À propos', icon: Info },
    { id: 'features', label: 'Fonctionnalités', icon: Star },
    { id: 'content', label: 'Contenu', icon: Package },
    { id: 'usage', label: "Mode d'emploi", icon: BookOpen },
    { id: 'tips', label: 'Astuces', icon: Lightbulb },
    { id: 'creator', label: 'Créateur', icon: User },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-parchemin-fonce border-2 border-or/40 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-cendre hover:text-pourpre-infernal transition-colors z-10 bg-parchemin/50 rounded-full md:bg-transparent"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Sidebar Nav */}
        <div className="bg-parchemin/50 border-b-2 md:border-b-0 md:border-r-2 border-or/20 w-full md:w-64 flex-shrink-0 p-4 overflow-x-auto md:overflow-y-auto">
          <h2 className="font-title-main text-2xl text-pourpre-infernal mb-6 hidden md:block">Informations</h2>
          <nav className="flex md:flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-section whitespace-nowrap",
                    isActive 
                      ? "bg-or/20 text-pourpre-infernal shadow-[inset_0_0_10px_rgba(201,147,58,0.2)] border border-or/50" 
                      : "hover:bg-or/10 text-encre-claire hover:text-encre"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-or-vif" : "text-cendre")} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto min-h-[50vh] text-encre bg-parchemin">
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-title-main text-3xl text-pourpre-infernal mb-4">À propos de l'application</h3>
              <p className="font-body text-lg leading-relaxed text-left">
                <strong>D&D 5e Interactive Character Sheet</strong> est une feuille de personnage numérique moderne, conçue spécifiquement pour offrir la meilleure expérience possible lors de vos parties de Donjons & Dragons 5e édition.
              </p>
              <p className="font-body leading-relaxed text-left">
                Pensée avec une philosophie <em>"Offline First"</em> (zéro cloud obligatoire) et <em>Privacy by Design</em>, toutes vos données (personnage, inventaire, grimoire) sont stockées localement dans votre propre navigateur web sécurisé. Aucun compte à créer, aucun abonnement, aucune donnée qui fuite.
              </p>
              <div className="bg-parchemin-fonce p-4 rounded-lg border border-or/20 mt-6 shadow-inner">
                <h4 className="font-section text-xl text-or-vif mb-2">La Philosophie</h4>
                <p className="text-sm text-encre-claire">
                  L'objectif est d'avoir l'outil idéal pour un joueur autour d'une vraie table : un outil qui fluidifie les calculs et la gestion, sans pour autant remplacer le rôle du maître de jeu ni nécessiter une connexion internet permanente.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-title-main text-3xl text-pourpre-infernal mb-4">Fonctionnalités Principales</h3>
              
              <ul className="space-y-4 font-body">
                <li className="flex gap-4 p-3 bg-parchemin-fonce rounded border border-or/10">
                  <span className="text-or-vif font-bold">1</span>
                  <div>
                    <strong className="text-pourpre-infernal text-lg">Lanceur de Dés Intégré</strong>
                    <p className="text-sm mt-1">Ne perdez plus de temps : cliquez sur vos caractéristiques, compétences ou jets de sauvegarde pour lancer instantanément le bon dé avec les bons bonus. Un panneau flottant permet aussi des lancers libres.</p>
                  </div>
                </li>
                <li className="flex gap-4 p-3 bg-parchemin-fonce rounded border border-or/10">
                  <span className="text-or-vif font-bold">2</span>
                  <div>
                    <strong className="text-pourpre-infernal text-lg">Grimoire Magique</strong>
                    <p className="text-sm mt-1">Gestion interactive de tous vos sorts. Filtrez par niveau, classe ou école. Suivez facilement l'utilisation de vos emplacements de sorts.</p>
                  </div>
                </li>
                <li className="flex gap-4 p-3 bg-parchemin-fonce rounded border border-or/10">
                  <span className="text-or-vif font-bold">3</span>
                  <div>
                    <strong className="text-pourpre-infernal text-lg">Montée de Niveau Guidée</strong>
                    <p className="text-sm mt-1">Une interface pas-à-pas (HP, Caractéristiques, Nouveaux Sorts) lorsque vous gagnez en puissance pour n'oublier aucune règle importante.</p>
                  </div>
                </li>
                <li className="flex gap-4 p-3 bg-parchemin-fonce rounded border border-or/10">
                  <span className="text-or-vif font-bold">4</span>
                  <div>
                    <strong className="text-pourpre-infernal text-lg">Sauvegarde & Export</strong>
                    <p className="text-sm mt-1">Persistance automatique locale. Et module pour exporter la fiche intégrale en JSON (backup) ou au format texte lisible (pour partage DM).</p>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-title-main text-3xl text-pourpre-infernal mb-4">Contenu Inclus</h3>
              <p className="font-body">
                L'application intègre nativement des bases de données de règles dites "SRD" (System Reference Document) de base pour accélérer la complétion de votre personnage.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border border-or/20 rounded bg-parchemin-fonce">
                  <h4 className="font-section text-or-vif mb-2 border-b border-or/10 pb-2">📦 Catalogue d'Objets</h4>
                  <p className="text-sm font-body">
                    Une base de données de dizaines d'équipements classiques (armes, armures, sacs, outils). La recherche permet de les ajouter à votre inventaire en un clic, calculant automatiquement les poids.
                  </p>
                </div>
                
                <div className="p-4 border border-or/20 rounded bg-parchemin-fonce">
                  <h4 className="font-section text-or-vif mb-2 border-b border-or/10 pb-2">🔮 Liste de Sortilèges</h4>
                  <p className="text-sm font-body">
                    De nombreux sorts sont pré-enregistrés, ce qui permet à l'application de formater leur affichage proprement (DD, Jet d'Attaque) quand vous les ajoutez à votre grimoire.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-title-main text-3xl text-pourpre-infernal mb-4">Mode d'emploi rapide</h3>
              
              <div className="space-y-3 font-body text-sm bg-parchemin-fonce p-4 rounded-lg border border-or/20">
                <p><strong>• Navigation :</strong> Utilisez le menu latéral (à gauche ou en bas sur mobile) pour naviguer entre la Vue Générale, Inventaire, Combat, etc.</p>
                <div className="h-px bg-or/20 w-full" />
                <p><strong>• Lancer un Dé :</strong> Presque tout ce qui affiche un badge rouge est cliquable ! Lancez vos initiatives, vos attaques, ou compétences directement en cliquant dessus.</p>
                <div className="h-px bg-or/20 w-full" />
                <p><strong>• Santé et Dégâts :</strong> Dans le bloc "Combat", cliquez sur le <strong>"+"</strong> ou le <strong>"-"</strong> à côté de vos Points de Vie pour gérer vos blessures. Vous pouvez y ajouter des points de vie temporaires.</p>
                <div className="h-px bg-or/20 w-full" />
                <p><strong>• Repos :</strong> La vue générale propose des boutons pour effectuer des Repos Courts (dépensez vos dés de vie) ou Longs (restaure HP, capacités, et emplacements de sorts).</p>
                <div className="h-px bg-or/20 w-full" />
                <p><strong>• Récupérer :</strong> Les munitions d'armes à distance et les quantités d'objets peuvent être modifiées manuellement avec l'icône stylo.</p>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-title-main text-3xl text-pourpre-infernal mb-4">Astuces Avancées</h3>
              
              <div className="grid gap-4">
                <div className="p-3 border-l-4 border-or-vif bg-or/5 rounded-r">
                  <strong className="text-pourpre-infernal block mb-1">Double Cliquez sur l'Avatar</strong>
                  <p className="text-sm">Cliquez sur votre image de personnage pour l'afficher en grand écran, et écouter l'ambiance sonore attachée à votre profil.</p>
                </div>
                
                <div className="p-3 border-l-4 border-pourpre-infernal bg-pourpre-infernal/5 rounded-r">
                  <strong className="text-pourpre-infernal block mb-1">Gestion de la surcharge</strong>
                  <p className="text-sm">Votre force définit le nombre d'emplacements d'inventaire "sans pénalité". Si la jauge d'encombrement passe au rouge, des malus de déplacement s'appliquent selon les règles officielles !</p>
                </div>
                
                <div className="p-3 border-l-4 border-or-vif bg-or/5 rounded-r">
                  <strong className="text-pourpre-infernal block mb-1">Sauvegardes croisées</strong>
                  <p className="text-sm">Puisque l'application est "Offline", vous pouvez jouer sur PC avant la partie, utiliser l'onglet <em>"Gestion des Données"</em> pour exporter le JSON, et l'importer sur votre Tablette juste avant de jouer !</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'creator' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col items-center text-center justify-center h-full pb-8">
              <div className="w-24 h-24 bg-or/20 rounded-full flex items-center justify-center mb-4 border-2 border-or relative overflow-hidden shadow-[0_0_15px_rgba(201,147,58,0.4)]">
                <User className="w-12 h-12 text-pourpre-infernal" />
              </div>
              
              <div>
                <h3 className="font-title-main text-4xl text-pourpre-infernal">Geoffroy Streit</h3>
                <p className="font-section text-or-vif text-xl mt-1 tracking-wider">« Hylst »</p>
              </div>

              <div className="bg-parchemin-fonce p-6 rounded-xl border border-or/30 shadow-inner max-w-md w-full">
                <p className="font-body text-encre-claire mb-6 italic">
                  Développé avec passion pour l'amour du jeu de rôle, afin d'offrir une alternative qualitative, sécurisée et fluide aux Fiches PDF austères traditionnelles.
                </p>
                
                <div className="flex items-center justify-center gap-3">
                  <a 
                    href="mailto:geoffroy.streit@gmail.com"
                    className="flex items-center gap-2 bg-pourpre-infernal hover:bg-pourpre-infernal/80 text-parchemin px-6 py-3 rounded-lg font-section transition-transform hover:scale-105 active:scale-95 shadow-md"
                  >
                    <span>Me contacter</span>
                  </a>
                </div>
                <div className="mt-4 text-xs font-mono text-cendre">
                  geoffroy.streit@gmail.com
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
