import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Play, Square, Volume2, Star, Activity, Map as MapIcon,
  FolderTree, AlertCircle, Music2, Search, ChevronDown,
  Disc3, Clock, Pause, Heart, Repeat, Repeat1,
  SkipBack, SkipForward, Gauge, Zap, Tag, Info,
  SlidersHorizontal, ArrowUpDown,
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
  artist: string;
  filename: string;
  imageName: string;
  durationSec: number;
  duration: string;
  genre: string;
  bpm: number | null;
  year: string;
  bitrate: number | null;
  keywords: string[];
  mood: string[];
  usage: string[];
  story: string | null;
};

type ViewMode = 'top12' | 'tension' | 'scene' | 'category';
type Section = 'sfx' | 'music';
type SortMode = 'alpha' | 'duration' | 'bpm' | 'genre' | 'mood' | 'favorites' | 'usage';
type LoopMode = 'none' | 'one' | 'all';

// ─── Static Data ───────────────────────────────────────────────────────────────

const soundsIndex = new Map<string, string>();
(soundsData as SoundData[]).forEach(s => soundsIndex.set(s.filename, s.frenchName));

const musicTracks = musicsData as MusicTrack[];
const SFX_BASE_URL = 'https://hylst.fr/mp3/sfx/';
const MUSIC_BASE_URL = 'https://hylst.fr/hml/';
const FAVORITES_KEY = 'dnd5_music_favorites';

// Unique values for filters
const allMoods = Array.from(new Set(musicTracks.flatMap(t => t.mood.map(m => m.toLowerCase())).filter(Boolean))).sort();
const allUsages = Array.from(new Set(musicTracks.flatMap(t => t.usage.map(u => u.toLowerCase())).filter(Boolean))).sort();
const allGenres = Array.from(new Set(musicTracks.map(t => t.genre.split(',')[0].trim().toLowerCase()).filter(Boolean))).sort();

// BPM categories
function bpmLabel(bpm: number | null): string {
  if (!bpm) return 'Inconnu';
  if (bpm < 70) return 'Lent (< 70)';
  if (bpm < 90) return 'Modéré (70-90)';
  if (bpm < 110) return 'Vif (90-110)';
  if (bpm < 130) return 'Rapide (110-130)';
  return 'Très rapide (130+)';
}

// Load/save favorites
function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}
function saveFavorites(favs: Set<string>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs]));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function VolumeControl({ volume, onChange }: { volume: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2 text-encre">
      <Volume2 className="w-5 h-5 text-pourpre-infernal shrink-0" />
      <input type="range" min="0" max="1" step="0.05" value={volume}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-24 md:w-32 accent-pourpre-infernal" />
    </div>
  );
}

function SoundButton({ filename, reason, playingTrack, onPlay }: {
  filename: string; reason?: string; playingTrack: string | null; onPlay: (f: string) => void;
}) {
  const isPlaying = playingTrack === filename;
  const displayName = soundsIndex.get(filename) || filename;
  return (
    <button onClick={() => onPlay(filename)}
      className={cn(
        'flex flex-col items-start p-3 rounded-lg border transition-all text-left w-full h-full',
        isPlaying
          ? 'border-or-vif bg-or/20 text-pourpre-infernal shadow-[inset_0_0_10px_rgba(201,147,58,0.3)] animate-pulse'
          : 'border-or/30 hover:border-or/70 hover:bg-black/5 text-encre bg-parchemin-clair'
      )}>
      <div className="flex items-center justify-between w-full mb-1">
        <span className="font-title-main text-sm md:text-base leading-tight">{displayName}</span>
        {isPlaying ? <Square fill="currentColor" className="w-4 h-4 text-or-vif shrink-0" />
          : <Play className="w-4 h-4 text-cendre shrink-0" />}
      </div>
      {reason && <span className="text-xs text-cendre italic mt-auto leading-tight">{reason}</span>}
    </button>
  );
}

function EqBars({ playing }: { playing: boolean }) {
  if (!playing) return null;
  return (
    <div className="flex gap-0.5 items-end h-3 shrink-0">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-0.5 bg-or-vif rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, height: `${30 + i * 20}%` }} />
      ))}
    </div>
  );
}

function MusicCard({ track, playingTrack, isFavorite, onPlay, onToggleFavorite, showDetail }: {
  track: MusicTrack;
  playingTrack: string | null;
  isFavorite: boolean;
  onPlay: (f: string) => void;
  onToggleFavorite: (f: string) => void;
  showDetail: (t: MusicTrack) => void;
}) {
  const isPlaying = playingTrack === track.filename;
  const [imgError, setImgError] = useState(false);

  return (
    <article className={cn(
      'group relative flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-300',
      isPlaying
        ? 'border-or-vif shadow-[0_0_20px_rgba(201,147,58,0.4)] scale-[1.02]'
        : 'border-or/20 hover:border-or/60 hover:shadow-md hover:scale-[1.01]'
    )}>
      {/* Album art */}
      <div className="relative aspect-square bg-pourpre-infernal/10 overflow-hidden cursor-pointer"
        onClick={() => onPlay(track.filename)}>
        {!imgError ? (
          <img src={`${MUSIC_BASE_URL}${track.imageName}`} alt={track.title}
            onError={() => setImgError(true)}
            className={cn('w-full h-full object-cover transition-transform duration-500',
              'group-hover:scale-105', isPlaying && 'scale-105')} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pourpre-infernal/40 to-encre/60">
            <Disc3 className={cn('w-12 h-12 text-or-vif opacity-60', isPlaying && 'animate-spin')} />
          </div>
        )}
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200',
          isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          {isPlaying ? <Pause fill="white" className="w-10 h-10 text-white drop-shadow-lg" />
            : <Play fill="white" className="w-10 h-10 text-white drop-shadow-lg" />}
        </div>
        {isPlaying && (
          <div className="absolute top-2 right-2 flex gap-0.5 items-end h-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-1 bg-or-vif rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s`, height: `${40 + i * 20}%` }} />
            ))}
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className={cn('p-3 flex flex-col gap-1 flex-1', isPlaying ? 'bg-or/10' : 'bg-parchemin-clair')}>
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-title-main text-sm leading-tight line-clamp-2 text-encre flex-1">{track.title}</h4>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => onToggleFavorite(track.filename)}
              className="p-0.5 rounded hover:bg-or/20 transition-colors"
              title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
              <Heart className={cn('w-3.5 h-3.5', isFavorite ? 'fill-red-500 text-red-500' : 'text-cendre')} />
            </button>
            <button onClick={() => showDetail(track)}
              className="p-0.5 rounded hover:bg-or/20 transition-colors" title="Détails">
              <Info className="w-3.5 h-3.5 text-cendre" />
            </button>
          </div>
        </div>

        <p className="text-xs text-cendre italic truncate">{track.genre.split(',')[0].trim()}</p>

        <div className="flex items-center justify-between mt-auto pt-1 flex-wrap gap-1">
          <div className="flex items-center gap-2 text-xs text-cendre">
            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{track.duration}</span>
            {track.bpm && <span className="flex items-center gap-0.5"><Gauge className="w-3 h-3" />{track.bpm}</span>}
          </div>
          {track.mood[0] && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pourpre-infernal/10 text-pourpre-infernal font-medium capitalize truncate max-w-[70px]">
              {track.mood[0]}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// Detail modal
function TrackDetailModal({ track, isFavorite, onToggleFavorite, onClose, onPlay, playingTrack }: {
  track: MusicTrack; isFavorite: boolean; onToggleFavorite: (f: string) => void;
  onClose: () => void; onPlay: (f: string) => void; playingTrack: string | null;
}) {
  const isPlaying = playingTrack === track.filename;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-parchemin rounded-2xl border-2 border-or/40 shadow-2xl max-w-lg w-full p-6 space-y-4"
        onClick={e => e.stopPropagation()}>
        <div className="flex gap-4">
          {/* Small cover */}
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-pourpre-infernal/10">
            <img src={`${MUSIC_BASE_URL}${track.imageName}`}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              alt={track.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-title-main text-xl text-pourpre-infernal leading-tight">{track.title}</h3>
            <p className="text-sm text-cendre">{track.artist || 'Hylst'} {track.year ? `· ${track.year}` : ''}</p>
            <p className="text-sm italic text-encre-claire mt-1">{track.genre}</p>
          </div>
        </div>

        {/* Story */}
        {track.story && (
          <div className="bg-or/5 border border-or/20 rounded-lg p-3">
            <p className="text-xs italic text-cendre leading-relaxed">{track.story}</p>
          </div>
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: 'Durée', value: track.duration, icon: Clock },
            { label: 'BPM', value: track.bpm ? `${track.bpm} bpm` : '—', icon: Gauge },
            { label: 'Bitrate', value: track.bitrate ? `${track.bitrate} kbps` : '—', icon: Zap },
            { label: 'Année', value: track.year || '—', icon: Tag },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2 bg-parchemin-clair px-3 py-2 rounded-lg">
              <Icon className="w-4 h-4 text-pourpre-infernal shrink-0" />
              <div>
                <p className="text-[10px] text-cendre uppercase tracking-wide">{label}</p>
                <p className="font-semibold text-encre text-xs">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Moods & Usage */}
        {track.mood.length > 0 && (
          <div>
            <p className="text-xs text-cendre uppercase tracking-wide mb-1.5">Ambiances</p>
            <div className="flex flex-wrap gap-1.5">
              {track.mood.map(m => (
                <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-pourpre-infernal/10 text-pourpre-infernal capitalize">{m}</span>
              ))}
            </div>
          </div>
        )}
        {track.usage.length > 0 && (
          <div>
            <p className="text-xs text-cendre uppercase tracking-wide mb-1.5">Usages RPG</p>
            <div className="flex flex-wrap gap-1.5">
              {track.usage.map(u => (
                <span key={u} className="text-xs px-2 py-0.5 rounded-full bg-encre/10 text-encre capitalize">{u}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button onClick={() => onPlay(track.filename)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-section text-sm transition-colors',
              isPlaying
                ? 'bg-red-900/10 text-red-800 border border-red-900/20'
                : 'bg-pourpre-infernal text-parchemin hover:bg-pourpre-infernal/80'
            )}>
            {isPlaying ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Écouter</>}
          </button>
          <button onClick={() => onToggleFavorite(track.filename)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-section text-sm transition-colors',
              isFavorite ? 'border-red-400 text-red-600 bg-red-50' : 'border-or/30 text-encre hover:border-or/60'
            )}>
            <Heart className={cn('w-4 h-4', isFavorite && 'fill-red-500')} />
            {isFavorite ? 'Favori' : 'Favoris'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border-2 border-or/20 text-cendre hover:text-encre text-sm">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SoundboardModule() {
  const [section, setSection] = useState<Section>('sfx');
  const [activeMode, setActiveMode] = useState<ViewMode>('top12');

  // Music filters & sort
  const [musicSearch, setMusicSearch] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedUsage, setSelectedUsage] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('alpha');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [detailTrack, setDetailTrack] = useState<MusicTrack | null>(null);

  // Favorites (persisted via localStorage)
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites());

  // Audio state
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [loopMode, setLoopMode] = useState<LoopMode>('none');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Current track object
  const currentMusicTrack = useMemo(
    () => playingTrack ? musicTracks.find(t => t.filename === playingTrack) ?? null : null,
    [playingTrack]
  );
  const isMusicPlaying = !!currentMusicTrack;

  // Init audio
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.onended = () => {
        if (loopRef.current === 'one') {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        } else if (loopRef.current === 'all') {
          playNextTrack();
        } else {
          setPlayingTrack(null);
        }
      };
      audio.onerror = () => { console.error('Audio error'); setPlayingTrack(null); setIsLoading(false); };
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.ondurationchange = () => setDuration(audio.duration || 0);
      audio.oncanplay = () => setIsLoading(false);
      audio.onwaiting = () => setIsLoading(true);
      audioRef.current = audio;
    }
  }, []);

  // Keep loopMode in a ref for onended closure
  const loopRef = useRef<LoopMode>('none');
  loopRef.current = loopMode;

  // Volume sync
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  // Persist favorites
  useEffect(() => { saveFavorites(favorites); }, [favorites]);

  // Sorted + filtered music list (used for next/prev logic too)
  const filteredMusic = useMemo(() => {
    let list = musicTracks.filter(t => {
      const q = musicSearch.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q)
        || t.genre.toLowerCase().includes(q)
        || t.keywords.some(k => k.toLowerCase().includes(q))
        || t.mood.some(m => m.toLowerCase().includes(q))
        || t.usage.some(u => u.toLowerCase().includes(q))
        || (t.story && t.story.toLowerCase().includes(q));
      const matchMood = !selectedMood || t.mood.some(m => m.toLowerCase() === selectedMood);
      const matchUsage = !selectedUsage || t.usage.some(u => u.toLowerCase() === selectedUsage);
      const matchGenre = !selectedGenre || t.genre.toLowerCase().includes(selectedGenre);
      return matchSearch && matchMood && matchUsage && matchGenre;
    });

    // Sort
    switch (sortMode) {
      case 'alpha': list.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'duration': list.sort((a, b) => (b.durationSec || 0) - (a.durationSec || 0)); break;
      case 'bpm': list.sort((a, b) => (a.bpm || 0) - (b.bpm || 0)); break;
      case 'genre': list.sort((a, b) => a.genre.localeCompare(b.genre)); break;
      case 'mood': list.sort((a, b) => (a.mood[0] || '').localeCompare(b.mood[0] || '')); break;
      case 'favorites': list.sort((a, b) => {
        const fa = favorites.has(a.filename) ? 0 : 1;
        const fb = favorites.has(b.filename) ? 0 : 1;
        return fa - fb || a.title.localeCompare(b.title);
      }); break;
      case 'usage': list.sort((a, b) => (a.usage[0] || '').localeCompare(b.usage[0] || '')); break;
    }
    return list;
  }, [musicSearch, selectedMood, selectedUsage, selectedGenre, sortMode, favorites]);

  const playNextTrack = useCallback(() => {
    const list = filteredMusic;
    const idx = list.findIndex(t => t.filename === playingTrack);
    const next = list[(idx + 1) % list.length];
    if (next) startPlaying(next.filename, MUSIC_BASE_URL);
  }, [filteredMusic, playingTrack]);

  const playPrevTrack = useCallback(() => {
    const list = filteredMusic;
    const idx = list.findIndex(t => t.filename === playingTrack);
    const prev = list[(idx - 1 + list.length) % list.length];
    if (prev) startPlaying(prev.filename, MUSIC_BASE_URL);
  }, [filteredMusic, playingTrack]);

  const startPlaying = (filename: string, baseUrl: string) => {
    if (!audioRef.current) return;
    audioRef.current.src = `${baseUrl}${filename}`;
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);
    audioRef.current.play().catch(e => { console.error('Play error:', e); setPlayingTrack(null); setIsLoading(false); });
    setPlayingTrack(filename);
  };

  const playTrack = useCallback((filename: string, baseUrl: string) => {
    if (!audioRef.current) return;
    if (playingTrack === filename) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
        setPlayingTrack(null);
      }
      return;
    }
    startPlaying(filename, baseUrl);
  }, [playingTrack]);

  const playSfx = useCallback((f: string) => playTrack(f, SFX_BASE_URL), [playTrack]);
  const playMusic = useCallback((f: string) => playTrack(f, MUSIC_BASE_URL), [playTrack]);

  const stopAll = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setPlayingTrack(null); setCurrentTime(0); setDuration(0);
  };

  const seekTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const toggleLoop = () => {
    setLoopMode(m => m === 'none' ? 'one' : m === 'one' ? 'all' : 'none');
  };

  const toggleFavorite = useCallback((filename: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });
  }, []);

  const clearFilters = () => {
    setMusicSearch(''); setSelectedMood(null); setSelectedUsage(null); setSelectedGenre(null);
  };

  const formatTime = (sec: number) => {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const hasActiveFilters = musicSearch || selectedMood || selectedUsage || selectedGenre;
  const favCount = favorites.size;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-title-main text-3xl text-pourpre-infernal mb-2">Ambiance & Sons</h2>
          <p className="text-cendre italic font-handwriting text-lg">Effets sonores & bibliothèque musicale Heroic Fantasy.</p>
        </div>
        <div className="flex items-center gap-4 bg-parchemin-clair p-3 rounded-xl border-2 border-or/30 w-full md:w-auto">
          <button onClick={stopAll} disabled={!playingTrack}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg font-title-main text-sm transition-colors',
              playingTrack ? 'bg-red-900/10 text-red-800 hover:bg-red-900/20' : 'text-cendre opacity-50 cursor-not-allowed'
            )}>
            <Square fill="currentColor" className="w-4 h-4" /> Arrêter
          </button>
          <div className="border-l border-or/30 pl-4">
            <VolumeControl volume={volume} onChange={setVolume} />
          </div>
        </div>
      </header>

      {/* Section tabs */}
      <div className="flex gap-2">
        {([
          { id: 'sfx' as Section, label: 'Effets Sonores', icon: Activity },
          { id: 'music' as Section, label: 'Bibliothèque Musicale', icon: Music2, badge: musicTracks.length },
        ]).map(({ id, label, icon: Icon, badge }) => (
          <button key={id} onClick={() => setSection(id)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg font-section text-sm transition-all border-2',
              section === id ? 'border-or bg-or/10 text-pourpre-infernal shadow-sm' : 'border-or/20 text-encre-claire hover:border-or/40'
            )}>
            <Icon className="w-4 h-4" />
            {label}
            {badge && <span className="ml-1 text-[10px] bg-pourpre-infernal text-parchemin px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
          </button>
        ))}
      </div>

      {/* ══ SFX Section ══ */}
      {section === 'sfx' && (
        <div className="space-y-4">
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
                <button key={tab.id} onClick={() => setActiveMode(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-t-lg font-section text-sm transition-colors border-2 border-b-0',
                    isActive ? 'border-or/50 bg-or/10 text-pourpre-infernal' : 'border-transparent text-encre-claire hover:bg-black/5'
                  )}>
                  <Icon className={cn('w-4 h-4', isActive && 'text-or-vif')} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-900/10 text-yellow-800 border border-yellow-900/20 rounded-md text-sm font-body">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>Les fichiers audios sont streamés à la volée. Une légère latence peut exister selon la connexion.</p>
          </div>
          <div className="min-h-[400px]">
            {activeMode === 'top12' && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {associationsData.top_12_most_useful_rpg_sounds.map(item => (
                  <SoundButton key={item.filename} filename={item.filename} reason={item.reason} playingTrack={playingTrack} onPlay={playSfx} />
                ))}
              </div>
            )}
            {activeMode === 'scene' && (
              <div className="space-y-6">
                {Object.entries(associationsData.alternative_2_rpg_scenes).map(([scene, files]) => (
                  <div key={scene}>
                    <h3 className="font-title-main text-xl text-or-vif mb-3 border-b border-or/20 pb-1">{scene}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {files.map(f => <SoundButton key={f} filename={f as string} playingTrack={playingTrack} onPlay={playSfx} />)}
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
                      {files.map(f => <SoundButton key={f} filename={f as string} playingTrack={playingTrack} onPlay={playSfx} />)}
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
                      {files.map(f => <SoundButton key={f} filename={f as string} playingTrack={playingTrack} onPlay={playSfx} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ Music Library Section ══ */}
      {section === 'music' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-title-main text-2xl text-or-vif flex items-center gap-2">
              <Music2 className="w-6 h-6" /> Heroic Fantasy Music Library
            </h3>
            <p className="text-sm text-cendre italic font-body">
              Compositions originales par <span className="not-italic font-semibold text-encre">Geoffroy (Hylst)</span> — {musicTracks.length} pistes.
              {favCount > 0 && <span className="ml-2 text-red-500 not-italic">❤ {favCount} favori{favCount > 1 ? 's' : ''}</span>}
            </p>
          </div>

          {/* Search + filter toggle */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cendre" />
              <input type="text" placeholder="Titre, genre, ambiance, usage..."
                value={musicSearch} onChange={e => setMusicSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border-2 border-or/30 bg-parchemin-clair text-encre placeholder:text-cendre text-sm focus:outline-none focus:border-or/60 font-body" />
            </div>
            <button onClick={() => setShowFilterPanel(v => !v)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-section transition-colors',
                (hasActiveFilters || showFilterPanel)
                  ? 'border-or-vif bg-or/10 text-pourpre-infernal'
                  : 'border-or/30 text-encre-claire hover:border-or/50 bg-parchemin-clair'
              )}>
              <SlidersHorizontal className="w-4 h-4" />
              Filtres {hasActiveFilters ? '•' : ''}
            </button>
          </div>

          {/* Filter panel */}
          {showFilterPanel && (
            <div className="bg-parchemin-clair border-2 border-or/30 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Mood */}
                <div>
                  <label className="text-xs text-cendre uppercase tracking-wide block mb-1.5">Ambiance</label>
                  <select value={selectedMood || ''} onChange={e => setSelectedMood(e.target.value || null)}
                    className="w-full px-3 py-1.5 rounded-lg border border-or/30 bg-parchemin text-sm text-encre focus:outline-none focus:border-or/60">
                    <option value="">Toutes</option>
                    {allMoods.map(m => <option key={m} value={m} className="capitalize">{m}</option>)}
                  </select>
                </div>
                {/* Usage */}
                <div>
                  <label className="text-xs text-cendre uppercase tracking-wide block mb-1.5">Usage RPG</label>
                  <select value={selectedUsage || ''} onChange={e => setSelectedUsage(e.target.value || null)}
                    className="w-full px-3 py-1.5 rounded-lg border border-or/30 bg-parchemin text-sm text-encre focus:outline-none focus:border-or/60">
                    <option value="">Tous</option>
                    {allUsages.map(u => <option key={u} value={u} className="capitalize">{u}</option>)}
                  </select>
                </div>
                {/* Genre */}
                <div>
                  <label className="text-xs text-cendre uppercase tracking-wide block mb-1.5">Genre</label>
                  <select value={selectedGenre || ''} onChange={e => setSelectedGenre(e.target.value || null)}
                    className="w-full px-3 py-1.5 rounded-lg border border-or/30 bg-parchemin text-sm text-encre focus:outline-none focus:border-or/60">
                    <option value="">Tous</option>
                    {allGenres.map(g => <option key={g} value={g} className="capitalize">{g}</option>)}
                  </select>
                </div>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-pourpre-infernal hover:underline">
                  ↺ Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

          {/* Sort bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <ArrowUpDown className="w-4 h-4 text-cendre shrink-0" />
            <span className="text-xs text-cendre uppercase tracking-wide">Trier :</span>
            {([
              { id: 'alpha', label: 'A-Z' },
              { id: 'favorites', label: `❤ Favoris${favCount > 0 ? ` (${favCount})` : ''}` },
              { id: 'duration', label: 'Durée' },
              { id: 'bpm', label: 'BPM' },
              { id: 'genre', label: 'Genre' },
              { id: 'mood', label: 'Ambiance' },
              { id: 'usage', label: 'Usage RPG' },
            ] as { id: SortMode; label: string }[]).map(s => (
              <button key={s.id} onClick={() => setSortMode(s.id)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-section transition-colors border',
                  sortMode === s.id
                    ? 'bg-pourpre-infernal text-parchemin border-pourpre-infernal'
                    : 'border-or/30 text-encre-claire hover:border-or/60 bg-parchemin-clair'
                )}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-cendre font-body">
            {filteredMusic.length} piste{filteredMusic.length > 1 ? 's' : ''}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="ml-2 text-pourpre-infernal hover:underline">↺ Réinitialiser</button>
            )}
          </p>

          {/* Grid */}
          {filteredMusic.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredMusic.map(track => (
                <MusicCard
                  key={track.filename} track={track}
                  playingTrack={playingTrack}
                  isFavorite={favorites.has(track.filename)}
                  onPlay={playMusic}
                  onToggleFavorite={toggleFavorite}
                  showDetail={setDetailTrack}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-cendre">
              <Music2 className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-title-main text-lg">Aucune piste trouvée</p>
              <button onClick={clearFilters} className="text-sm text-pourpre-infernal hover:underline mt-2">Réinitialiser les filtres</button>
            </div>
          )}

          {/* ── Now Playing Bar ── */}
          {isMusicPlaying && currentMusicTrack && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(680px,95vw)]
              bg-gradient-to-r from-pourpre-infernal to-encre text-parchemin
              rounded-2xl shadow-2xl border border-or/30 backdrop-blur-sm overflow-hidden">

              {/* Seek bar */}
              <div className="relative w-full h-1.5 bg-white/10 cursor-pointer group">
                <div className="absolute inset-y-0 left-0 bg-or-vif transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
                <input type="range" min="0" max={duration || 0} step="0.5" value={currentTime}
                  onChange={seekTo}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
              </div>

              <div className="flex items-center gap-3 px-4 py-3">
                {/* EQ bars */}
                <EqBars playing={!isLoading} />

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <p className="font-title-main text-sm truncate">{currentMusicTrack.title}</p>
                  <div className="flex items-center gap-3 text-xs text-or-vif/70">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-white/20">/</span>
                    <span>{formatTime(duration || currentMusicTrack.durationSec)}</span>
                    {currentMusicTrack.bpm && <span className="flex items-center gap-0.5"><Gauge className="w-3 h-3" />{currentMusicTrack.bpm} bpm</span>}
                    {isLoading && <span className="text-or-vif animate-pulse">Chargement…</span>}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button onClick={playPrevTrack} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Précédent">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button onClick={() => playMusic(currentMusicTrack.filename)}
                    className="p-2 rounded-full bg-or-vif text-encre hover:bg-or transition-colors">
                    <Pause fill="currentColor" className="w-5 h-5" />
                  </button>
                  <button onClick={playNextTrack} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Suivant">
                    <SkipForward className="w-4 h-4" />
                  </button>

                  {/* Loop button */}
                  <button onClick={toggleLoop} title={loopMode === 'none' ? 'Boucle : off' : loopMode === 'one' ? 'Boucle : piste' : 'Boucle : tout'}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors text-xs',
                      loopMode !== 'none' ? 'bg-or-vif/20 text-or-vif' : 'hover:bg-white/10 text-white/50'
                    )}>
                    {loopMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                  </button>

                  {/* Favorite */}
                  <button onClick={() => toggleFavorite(currentMusicTrack.filename)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <Heart className={cn('w-4 h-4', favorites.has(currentMusicTrack.filename) ? 'fill-red-400 text-red-400' : 'text-white/50')} />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-1 pl-2 border-l border-white/10">
                    <Volume2 className="w-4 h-4 text-white/50 shrink-0" />
                    <input type="range" min="0" max="1" step="0.05" value={volume}
                      onChange={e => setVolume(parseFloat(e.target.value))}
                      className="w-16 accent-or-vif" />
                  </div>

                  <button onClick={stopAll} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                    <Square fill="currentColor" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {detailTrack && (
        <TrackDetailModal
          track={detailTrack}
          isFavorite={favorites.has(detailTrack.filename)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setDetailTrack(null)}
          onPlay={playMusic}
          playingTrack={playingTrack}
        />
      )}
    </div>
  );
}
