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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-title-main text-3xl text-pourpre-infernal">À propos de l'application</h3>
                <span className="bg-pourpre-infernal text-parchemin px-3 py-1 rounded-full text-sm font-bold shadow-sm">v1.4.0</span>
              </div>
              <p className="font-body text-lg leading-relaxed text-left">
                <strong>Fiches D&D 5e Augmentées</strong> est une application numérique moderne, de la feuille de personnage interactive jusqu'aux ambiances sonores, conçue spécifiquement pour offrir la meilleure expérience de jeu à votre table de Donjons & Dragons 5e.
              </p>
              <p className="font-body leading-relaxed text-left">
                Pensée avec une philosophie <em>"Offline First"</em> et <em>Privacy by Design</em>, toutes vos données de personnage sont stockées localement. Aucun compte, abonnement ni IA externe n'est utilisé. Seuls les médias audios sont streamés à la volée depuis nos serveurs sécurisés.
              </p>
              <div className="bg-parchemin-fonce p-4 rounded-lg border border-or/20 mt-6 shadow-inner">
                <h4 className="font-section text-xl text-or-vif mb-2">La Philosophie</h4>
                <p className="text-sm text-encre-claire">
                  L'objectif est de fluidifier les calculs et la gestion fastidieuse, tout en apportant une dimension immersive unique grâce à une régie audio professionnelle, sans jamais remplacer le lien social et l'imagination qui sont le cœur du JDR.
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
                    <strong className="text-pourpre-infernal text-lg">Lanceur de Dés Intelligent & Historique</strong>
                    <p className="text-sm mt-1">Cliquez sur vos statistiques pour lancer automatiquement les dés. Le système détecte vos conditions (Empoisonné, Fatigue...) et applique automatiquement le désavantage (2d20 garde le pire) !</p>
                  </div>
                </li>
                <li className="flex gap-4 p-3 bg-parchemin-fonce rounded border border-or/10">
                  <span className="text-or-vif font-bold">2</span>
                  <div>
                    <strong className="text-pourpre-infernal text-lg">Moteur Audio Dual & Bibliothèque</strong>
                    <p className="text-sm mt-1">Lisez simultanément vos pistes d'ambiance et vos bruitages avec des volumes indépendants ! Lecteur musical avec 109 pistes originales, et une Soundboard de 267 effets sonores classés.</p>
                  </div>
                </li>
                <li className="flex gap-4 p-3 bg-parchemin-fonce rounded border border-or/10">
                  <span className="text-or-vif font-bold">3</span>
                  <div>
                    <strong className="text-pourpre-infernal text-lg">Tracker Tactique de Combat</strong>
                    <p className="text-sm mt-1">Suivez l'AC estimée de vos cibles et gérez la durée de vos buffs tactiques grâce au compteur de tours intégré, réduisant la charge mentale en plein combat.</p>
                  </div>
                </li>
                <li className="flex gap-4 p-3 bg-parchemin-fonce rounded border border-or/10">
                  <span className="text-or-vif font-bold">4</span>
                  <div>
                    <strong className="text-pourpre-infernal text-lg">Grimoire Magique Interactif</strong>
                    <p className="text-sm mt-1">Gestion claire de vos sorts et emplacements. Filtrez par niveau ou école, suivez vos dépenses, calculez vos DD et bonus d'attaque automatiquement.</p>
                  </div>
                </li>
                <li className="flex gap-4 p-3 bg-parchemin-fonce rounded border border-or/10">
                  <span className="text-or-vif font-bold">5</span>
                  <div>
                    <strong className="text-pourpre-infernal text-lg">Montée de Niveau Guidée</strong>
                    <p className="text-sm mt-1">Une interface pas-à-pas (HP, Caractéristiques, Nouveaux Sorts) lors des fameux "Level Up" pour vous assurer de n'oublier aucune règle importante.</p>
                  </div>
                </li>
                <li className="flex gap-4 p-3 bg-parchemin-fonce rounded border border-or/10">
                  <span className="text-or-vif font-bold">6</span>
                  <div>
                    <strong className="text-pourpre-infernal text-lg">Persistance Locale & Export</strong>
                    <p className="text-sm mt-1">Toutes vos modifications sont sauvegardées via le Repository Pattern dans votre navigateur (PWA). Exportez pour archiver de façon sécurisée (Markdown ou JSON).</p>
                  </div>
                </li>
                <li className="flex gap-4 p-3 bg-parchemin-fonce rounded border border-or/10">
                  <span className="text-or-vif font-bold">7</span>
                  <div>
                    <strong className="text-pourpre-infernal text-lg">Statuts & Conditions</strong>
                    <p className="text-sm mt-1">Gérez interactivement l'état de votre personnage (Charmé, Invisible, etc.) et suivez précisément votre niveau d'épuisement (0-6) et ses conséquences.</p>
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
                  <h4 className="font-section text-or-vif mb-2 border-b border-or/10 pb-2">🎵 109 Musiques Originales</h4>
                  <p className="text-sm font-body">
                    Une bibliothèque musicale Heroic Fantasy (streamée), riche de métadonnées techniques et narratives. Modes de tri variés, filtres croisés et lecteur persistant.
                  </p>
                </div>
                
                <div className="p-4 border border-or/20 rounded bg-parchemin-fonce">
                  <h4 className="font-section text-or-vif mb-2 border-b border-or/10 pb-2">🔊 267 Effets Sonores (SFX)</h4>
                  <p className="text-sm font-body">
                    Catalogue massif d'effets sonores RPG. Classés en "Top 20" indispensables, scènes et tensions. Idéal pour ponctuer l'action à la seconde.
                  </p>
                </div>

                <div className="p-4 border border-or/20 rounded bg-parchemin-fonce">
                  <h4 className="font-section text-or-vif mb-2 border-b border-or/10 pb-2">📦 Index d'Inventaire</h4>
                  <p className="text-sm font-body">
                    Base de données d'équipements classiques pré-paramétrée (armes, armures, matériel). À ajouter en un clic, impactant dynamiquement votre charge.
                  </p>
                </div>
                
                <div className="p-4 border border-or/20 rounded bg-parchemin-fonce">
                  <h4 className="font-section text-or-vif mb-2 border-b border-or/10 pb-2">🔮 Index Magique</h4>
                  <p className="text-sm font-body">
                    Les règles des sorts principaux sont enregistrées, remplissant ainsi automatiquement le Grimoire pour vous donner tous les détails en combat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-title-main text-3xl text-pourpre-infernal mb-4">Mode d'emploi rapide</h3>
              
              <div className="space-y-3 font-body text-sm bg-parchemin-fonce p-4 rounded-lg border border-or/20">
                <p><strong>• Navigation :</strong> Utilisez le menu latéral (à gauche ou en bas sur mobile) pour naviguer entre la Vue Générale, Inventaire, Combat, Ambiance, etc.</p>
                <div className="h-px bg-or/20 w-full" />
                <p><strong>• Immersion Audio :</strong> Dans l'onglet <strong>Ambiance & Sons</strong>, naviguez dans les musiques ou les effets. Cochez les coeurs (❤) pour tout rassembler dans le dossier "Favoris", et lancez une boucle musicale de fond !</p>
                <div className="h-px bg-or/20 w-full" />
                <p><strong>• Lancer un Dé :</strong> Presque tout ce qui porte un dé ou un fond sombre est cliquable ! Lancez caractéristiques, compétences ou dégâts en un clic.</p>
                <div className="h-px bg-or/20 w-full" />
                <p><strong>• Santé et Repos :</strong> Mettez à jour vos HP sous le portrait. Cliquez sur les options "Repos Court / Long" pour automatiser la récupération de vos capacités et emplacements magiques.</p>
                <div className="h-px bg-or/20 w-full" />
                <p><strong>• Équipement & Consommables :</strong> Gérer vos munitions ou quantités via l'icône stylo ; surveillez l'icône d'encombrement qui vire au rouge si vous portez trop lourd !</p>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="font-title-main text-3xl text-pourpre-infernal mb-4">Astuces Avancées</h3>
              
              <div className="grid gap-4">
                <div className="p-3 border-l-4 border-or-vif bg-or/5 rounded-r">
                  <strong className="text-pourpre-infernal block mb-1">Double Utilisation Audio</strong>
                  <p className="text-sm">Le moteur audio permet une lecture asynchrone : lancez une Musique longue en fond (qui s'affichera dans la barre "Now Playing"), tout en ponctuant l'action d'éclairs et bruits d'épées depuis le Soundboard SFX par-dessus.</p>
                </div>
                
                <div className="p-3 border-l-4 border-pourpre-infernal bg-pourpre-infernal/5 rounded-r">
                  <strong className="text-pourpre-infernal block mb-1">Gestion de la Surcharge</strong>
                  <p className="text-sm">Votre force définit le seuil d'inventaire sans pénalité. Surveillez attentivement la jauge : si elle devient rouge vif, vous subissez les règles officielles de pénalité de déplacement.</p>
                </div>
                
                <div className="p-3 border-l-4 border-or-vif bg-or/5 rounded-r">
                  <strong className="text-pourpre-infernal block mb-1">Passage PC / Tablette Intégral</strong>
                  <p className="text-sm">Puisque l'application est "Offline First", vous pouvez créer / équiper votre personnage sur PC. Ensuite, utilisez "Gestion des Données" pour exporter le fichier de sauvegarde JSON et l'importer directement sur l'appareil que vous utiliserez à table !</p>
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
                  Développé et conçu avec passion pour offrir une alternative moderne, luxueuse et sécurisée aux fiches papier et PDF. 
                </p>
                
                <div className="bg-or/10 border border-or/20 rounded p-3 mb-6">
                  <p className="text-sm font-body font-medium text-encre text-center">
                    À l'exception des effets sonores (SFX), l'ensemble de la <strong className="text-pourpre-infernal">bibliothèque musicale des 109 pistes</strong> intégrée dans l'application est une composition originale de Geoffroy, réalisée pour amplifier vos émotions en JDR.
                  </p>
                </div>
                
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
