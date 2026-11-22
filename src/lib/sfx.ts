const SFX_BASE = 'https://hylst.fr/mp3/sfx/';

/**
 * Joue un effet sonore du hub Hylst sans bloquer l'interface.
 * Le MP3 est lu par HTMLAudio : aucun CORS n'est requis pour la lecture.
 * Poser `dnd5_mute_sfx=1` dans le stockage local coupe les effets.
 */
export function playSfx(filename: string, volume = 0.6): void {
  try {
    if (localStorage.getItem('dnd5_mute_sfx') === '1') return;
    const audio = new Audio(SFX_BASE + filename);
    audio.volume = Math.min(1, Math.max(0, volume));
    audio.play().catch(() => undefined);
  } catch {
    // Audio indisponible : le jet de dés reste fonctionnel.
  }
}
