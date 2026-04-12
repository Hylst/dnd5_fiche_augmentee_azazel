import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Square, Volume2, Star, Activity, Map as MapIcon,
  FolderTree, AlertCircle, Music2, Search, ChevronDown,
  Disc3, Clock, Pause
} from 'lucide-react';
import { cn } from '../lib/utils';
import soundsData from '../data/sounds.json';
import associationsData from '../data/sfx_associations.json';
import musicsData from '../data/musics.json';

// ─── Types ────────────────────────────────────────────────────────────────────

type SoundData = {
  filename: string;
  frenchName: string;
  sizeBytes: number;
  duration: string;
  category: string;
};

type MusicTrack = {
  title: string;
  filename: string;
  imageName: string;
  duration: string;
  genre: string;
  keywords: string[];
  mood: string[];
};

type ViewMode = 'top12' | 'tension' | 'scene' | 'category';
type Section = 'sfx' | 'music';

// ─── Data ─────────────────────────────────────────────────────────────────────

const soundsIndex = new Map<string, string>();
(soundsData as SoundData[]).forEach(s => soundsIndex.set(s.filename, s.frenchName));

const musicTracks = musicsData as MusicTrack[];
const SFX_BASE_URL = 'https://hylst.fr/mp3/sfx/';
const MUSIC_BASE_URL = 'https://hylst.fr/hml/';

// Collect all unique moods for filter chips
const allMoods = Array.from(
  new Set(musicTracks.flatMap(t => t.mood.map(m => m.toLowerCase())).filter(Boolean))
).sort();

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Volume slider shared between sections */
function VolumeControl({ volume, onChange }: { volume: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2 text-encre">
      <Volume2 className="w-5 h-5 text-pourpre-infernal shrink-0" />
      <input
        type="range" min="0" max="1" step="0.05"
        value={volume}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-24 md:w-32 accent-pourpre-infernal"
      />
    </div>
  );
}

/** SFX play button tile */
function SoundButton({
  filename,
  reason,
  playingTrack,
  onPlay,
}: {
  filename: string;
  reason?: string;
  playingTrack: string | null;
  onPlay: (f: string) => void;
}) {
  const isPlaying = playingTrack === filename;
  const displayName = soundsIndex.get(filename) || filename;

  return (
    <button
      onClick={() => onPlay(filename)}
      className={cn(
        'flex flex-col items-start p-3 rounded-lg border transition-all text-left w-full h-full',
        isPlaying
          ? 'border-or-vif bg-or/20 text-pourpre-infernal shadow-[inset_0_0_10px_rgba(201,147,58,0.3)] animate-pulse'
          : 'border-or/30 hover:border-or/70 hover:bg-black/5 text-encre bg-parchemin-clair'
      )}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <span className="font-title-main text-sm md:text-base leading-tight">{displayName}</span>
        {isPlaying
          ? <Square fill="currentColor" className="w-4 h-4 text-or-vif shrink-0" />
          : <Play className="w-4 h-4 text-cendre shrink-0" />
        }
      </div>
      {reason && <span className="text-xs text-cendre italic mt-auto leading-tight">{reason}</span>}
    </button>
  );
}

/** Music library card with album art */
function MusicCard({
  track,
  playingTrack,
  onPlay,
}: {
  track: MusicTrack;
  playingTrack: string | null;
  onPlay: (f: string) => void;
}) {
  const isPlaying = playingTrack === track.filename;
  const [imgError, setImgError] = useState(false);
  const imgUrl = `${MUSIC_BASE_URL}${track.imageName}`;

  return (
    <article
      onClick={() => onPlay(track.filename)}
      className={cn(
        'group relative flex flex-col rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-300',
        isPlaying
          ? 'border-or-vif shadow-[0_0_20px_rgba(201,147,58,0.4)] scale-[1.02]'
          : 'border-or/20 hover:border-or/60 hover:shadow-md hover:scale-[1.01]'
      )}
    >
      {/* Album art */}
      <div className="relative aspect-square bg-pourpre-infernal/10 overflow-hidden">
        {!imgError ? (
          <img
            src={imgUrl}
            alt={track.title}
            onError={() => setImgError(true)}
            className={cn(
              'w-full h-full object-cover transition-transform duration-500',
              'group-hover:scale-105',
              isPlaying && 'scale-105'
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pourpre-infernal/40 to-encre/60">
            <Disc3 className={cn('w-12 h-12 text-or-vif opacity-60', isPlaying && 'animate-spin')} />
          </div>
        )}

        {/* Play overlay */}
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200',
          isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          {isPlaying
            ? <Pause fill="white" className="w-10 h-10 text-white drop-shadow-lg" />
            : <Play fill="white" className="w-10 h-10 text-white drop-shadow-lg" />
          }
        </div>

        {/* Playing indicator */}
        {isPlaying && (
          <div className="absolute top-2 right-2 flex gap-0.5 items-end h-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-1 bg-or-vif rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s`, height: `${40 + i * 20}%` }} />
            ))}
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className={cn(
        'p-3 flex flex-col gap-1 flex-1',
        isPlaying ? 'bg-or/10' : 'bg-parchemin-clair'
      )}>
        <h4 className="font-title-main text-sm leading-tight line-clamp-2 text-encre">{track.title}</h4>
        <p className="text-xs text-cendre italic truncate">{track.genre}</p>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-1 text-xs text-cendre">
            <Clock className="w-3 h-3" />
            <span>{track.duration}</span>
          </div>
          {track.mood[0] && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pourpre-infernal/10 text-pourpre-infernal font-medium capitalize">
              {track.mood[0]}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}


// ─── Main Component ───────────────────────────────────────────────────────────

export function SoundboardModule() {
  const [section, setSection] = useState<Section>('sfx');

  // SFX state
  const [activeMode, setActiveMode] = useState<ViewMode>('top12');

  // Music state
  const [musicSearch, setMusicSearch] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);

  // Audio state (shared)
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Init audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setPlayingTrack(null);
      audioRef.current.onerror = () => {
        console.error('Erreur de chargement audio');
        setPlayingTrack(null);
      };
    }
  }, []);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = useCallback((filename: string, baseUrl: string) => {
    if (!audioRef.current) return;
    if (playingTrack === filename) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingTrack(null);
      return;
    }
    audioRef.current.src = `${baseUrl}${filename}`;
    audioRef.current.play().catch(e => {
      console.error('Lecture impossible:', e);
      setPlayingTrack(null);
    });
    setPlayingTrack(filename);
  }, [playingTrack]);

  const playSfx = useCallback((f: string) => playTrack(f, SFX_BASE_URL), [playTrack]);
  const playMusic = useCallback((f: string) => playTrack(f, MUSIC_BASE_URL), [playTrack]);

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingTrack(null);
  };

  // Filtered music tracks
  const filteredMusic = musicTracks.filter(t => {
    const q = musicSearch.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.genre.toLowerCase().includes(q) ||
      t.keywords.some(k => k.toLowerCase().includes(q)) || t.mood.some(m => m.toLowerCase().includes(q));
    const matchMood = !selectedMood || t.mood.some(m => m.toLowerCase() === selectedMood);
    return matchSearch && matchMood;
  });

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-title-main text-3xl text-pourpre-infernal mb-2">Ambiance & Sons</h2>
          <p className="text-cendre italic font-handwriting text-lg">
            Effets sonores & bibliothèque musicale Heroic Fantasy.
          </p>
        </div>

        {/* Master Controls */}
        <div className="flex items-center gap-4 bg-parchemin-clair p-3 rounded-xl border-2 border-or/30 w-full md:w-auto">
          <button
            onClick={stopAll}
            disabled={!playingTrack}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg font-title-main text-sm transition-colors',
              playingTrack
                ? 'bg-red-900/10 text-red-800 hover:bg-red-900/20'
                : 'text-cendre opacity-50 cursor-not-allowed'
            )}
          >
            <Square fill="currentColor" className="w-4 h-4" /> Arrêter
          </button>

          <div className="border-l border-or/30 pl-4">
            <VolumeControl volume={volume} onChange={setVolume} />
          </div>
        </div>
      </header>

      {/* Section switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setSection('sfx')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-lg font-section text-sm transition-all border-2',
            section === 'sfx'
              ? 'border-or bg-or/10 text-pourpre-infernal shadow-sm'
              : 'border-or/20 text-encre-claire hover:border-or/40'
          )}
        >
          <Activity className="w-4 h-4" />
          Effets Sonores
        </button>
        <button
          onClick={() => setSection('music')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-lg font-section text-sm transition-all border-2',
            section === 'music'
              ? 'border-or bg-or/10 text-pourpre-infernal shadow-sm'
              : 'border-or/20 text-encre-claire hover:border-or/40'
          )}
        >
          <Music2 className="w-4 h-4" />
          Bibliothèque Musicale
          <span className="ml-1 text-[10px] bg-pourpre-infernal text-parchemin px-1.5 py-0.5 rounded-full font-bold">
            {musicTracks.length}
          </span>
        </button>
      </div>

      {/* ── SFX Section ── */}
      {section === 'sfx' && (
        <div className="space-y-4">
          {/* SFX sub-tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-b-2 border-or/30 pb-4">
            {([
              { id: 'top12', label: 'Top 12 Indispensable', icon: Star },
              { id: 'scene', label: 'Par Situation', icon: MapIcon },
              { id: 'tension', label: 'Par Tension', icon: Activity },
              { id: 'category', label: 'Par Catégorie', icon: FolderTree },
            ] as const).map(tab => {
              const Icon = tab.icon;
              const isActive = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMode(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-t-lg font-section text-sm transition-colors border-2 border-b-0',
                    isActive
                      ? 'border-or/50 bg-or/10 text-pourpre-infernal'
                      : 'border-transparent text-encre-claire hover:bg-black/5'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive && 'text-or-vif')} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Notice */}
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-900/10 text-yellow-800 border border-yellow-900/20 rounded-md text-sm font-body">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>Les fichiers audios sont streamés à la volée. Une légère latence peut exister selon la connexion.</p>
          </div>

          {/* SFX Content */}
          <div className="min-h-[400px]">
            {activeMode === 'top12' && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {associationsData.top_12_most_useful_rpg_sounds.map(item => (
                  <SoundButton
                    key={item.filename} filename={item.filename}
                    reason={item.reason} playingTrack={playingTrack} onPlay={playSfx}
                  />
                ))}
              </div>
            )}

            {activeMode === 'scene' && (
              <div className="space-y-6">
                {Object.entries(associationsData.alternative_2_rpg_scenes).map(([scene, files]) => (
                  <div key={scene}>
                    <h3 className="font-title-main text-xl text-or-vif mb-3 border-b border-or/20 pb-1">{scene}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {files.map(f => (
                        <SoundButton key={f} filename={f as string} playingTrack={playingTrack} onPlay={playSfx} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeMode === 'tension' && (
              <div className="space-y-6">
                {Object.entries(associationsData.alternative_1_tension_intensity).map(([tension, files]) => (
                  <div key={tension}>
                    <h3 className="font-title-main text-xl text-pourpre-infernal mb-3 border-b border-or/20 pb-1">{tension}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {files.map(f => (
                        <SoundButton key={f} filename={f as string} playingTrack={playingTrack} onPlay={playSfx} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeMode === 'category' && (
              <div className="space-y-6">
                {Object.entries(associationsData.primary_structuration).map(([category, files]) => (
                  <div key={category}>
                    <h3 className="font-title-main text-xl text-encre mb-3 border-b border-or/20 pb-1">{category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {files.map(f => (
                        <SoundButton key={f} filename={f as string} playingTrack={playingTrack} onPlay={playSfx} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Music Library Section ── */}
      {section === 'music' && (
        <div className="space-y-5">
          {/* Header + description */}
          <div className="flex flex-col gap-1">
            <h3 className="font-title-main text-2xl text-or-vif flex items-center gap-2">
              <Music2 className="w-6 h-6" />
              Heroic Fantasy Music Library
            </h3>
            <p className="text-sm text-cendre italic font-body">
              Compositions originales par <span className="not-italic font-semibold text-encre">Geoffroy (Hylst)</span> — {musicTracks.length} pistes pour enrichir vos sessions de jeu.
            </p>
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cendre" />
              <input
                type="text"
                placeholder="Rechercher titre, genre, ambiance..."
                value={musicSearch}
                onChange={e => setMusicSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border-2 border-or/30 bg-parchemin-clair text-encre placeholder:text-cendre text-sm focus:outline-none focus:border-or/60 font-body"
              />
            </div>

            {/* Mood filter */}
            <div className="relative">
              <button
                onClick={() => setShowMoodDropdown(v => !v)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-section transition-colors',
                  selectedMood
                    ? 'border-or-vif bg-or/10 text-pourpre-infernal'
                    : 'border-or/30 text-encre-claire hover:border-or/50 bg-parchemin-clair'
                )}
              >
                {selectedMood ? <><span className="capitalize">{selectedMood}</span> ×</> : 'Filtrer par humeur'}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showMoodDropdown && (
                <div className="absolute right-0 top-full mt-1 z-30 bg-parchemin border-2 border-or/30 rounded-xl shadow-xl p-2 w-56 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => { setSelectedMood(null); setShowMoodDropdown(false); }}
                    className="w-full text-left px-3 py-1.5 text-sm rounded-lg hover:bg-or/10 text-cendre font-body"
                  >
                    Toutes les ambiances
                  </button>
                  {allMoods.map(mood => (
                    <button
                      key={mood}
                      onClick={() => { setSelectedMood(mood); setShowMoodDropdown(false); }}
                      className={cn(
                        'w-full text-left px-3 py-1.5 text-sm rounded-lg capitalize font-body transition-colors',
                        selectedMood === mood
                          ? 'bg-or/20 text-pourpre-infernal font-semibold'
                          : 'hover:bg-or/10 text-encre'
                      )}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs text-cendre font-body">
            {filteredMusic.length} piste{filteredMusic.length > 1 ? 's' : ''} affichée{filteredMusic.length > 1 ? 's' : ''}
            {(musicSearch || selectedMood) && (
              <button
                onClick={() => { setMusicSearch(''); setSelectedMood(null); }}
                className="ml-2 text-pourpre-infernal hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </p>

          {/* Grid */}
          {filteredMusic.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredMusic.map(track => (
                <MusicCard
                  key={track.filename}
                  track={track}
                  playingTrack={playingTrack}
                  onPlay={playMusic}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-cendre">
              <Music2 className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-title-main text-lg">Aucune piste trouvée</p>
              <p className="text-sm italic mt-1">Essayez un autre terme de recherche.</p>
            </div>
          )}

          {/* Currently playing bar */}
          {playingTrack && musicTracks.some(t => t.filename === playingTrack) && (() => {
            const current = musicTracks.find(t => t.filename === playingTrack)!;
            return (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4
                bg-gradient-to-r from-pourpre-infernal to-encre text-parchemin
                px-5 py-3 rounded-2xl shadow-2xl border border-or/30 backdrop-blur-sm min-w-[300px] max-w-[90vw]">
                <div className="flex gap-0.5 items-end h-4 shrink-0">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1 bg-or-vif rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s`, height: `${30 + i * 20}%` }} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-title-main text-sm truncate">{current.title}</p>
                  <p className="text-xs text-or-vif/70 italic truncate">{current.genre}</p>
                </div>
                <VolumeControl volume={volume} onChange={setVolume} />
                <button onClick={stopAll} className="shrink-0 hover:text-or-vif transition-colors">
                  <Square fill="currentColor" className="w-5 h-5" />
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showMoodDropdown && (
        <div className="fixed inset-0 z-20" onClick={() => setShowMoodDropdown(false)} />
      )}
    </div>
  );
}
