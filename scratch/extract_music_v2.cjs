const fs = require('fs');

const userFilesList = [
    "ancient_dragon_s_lament.mp3","2_villagers_died_this_night.mp3","ascend_to_glory.mp3","ascendancy.mp3",
    "atmospheric_spiritual_trip.mp3","awakening_dreams.mp3","awakening_of_the_ancients_ritual.mp3","awakening_of_the_titan.mp3",
    "awakening_tension.mp3","awakening_the_earth_ritual.mp3","azul_dream.mp3","balade_de_pipin.mp3",
    "baroque_elegance_in_twilight.mp3","battle_of_minds.mp3","blessed_soldiers_and_dead_heroes.mp3","blood_moon_ritual.mp3",
    "brewmasters_dance.mp3","chasing_horizons.mp3","chasing_the_horizon.mp3","checkmate_cadence.mp3",
    "cinematic_dreams.mp3","civilization_symphony.mp3","dark_suspenseful_drama.mp3","darkness_claims_its_throne.mp3",
    "depasser_les_frontieres_et_au_dela.mp3","dignified_existence.mp3","dreams_of_prowess.mp3","dreamy_aria.mp3",
    "drifting_in_the_ethereal.mp3","drifting_through_dreams.mp3","echoes_of_the_forgotten.mp3","eclipse_of_fury.mp3",
    "elegant_reverie.mp3","elysian_harmony.mp3","elysian_meadows.mp3","empire_s_fury.mp3",
    "enchanted_quartet.mp3","esoteric_procession.mp3","eternal_horizon.mp3","eternal_reverence.mp3",
    "fantasy_fanfare.mp3","fantasy_frolic.mp3","felicite_retrouvee.mp3","festin_des_aventuriers.mp3",
    "fury_of_the_north.mp3","gare_aux_sorcieres.mp3","gentle_reverie.mp3","harmony_of_nature.mp3",
    "haunted_cello_chamber.mp3","haunted_manor.mp3","heureux_denouement.mp3","in_the_silence_of_twilight.mp3",
    "journey_into_a_wilderness.mp3","knightly_prowess.mp3","l_atelier_de_l_artisan.mp3","l_eveil_des_lycanthropes.mp3",
    "l'envol_du_dernier_phoenix.mp3","la_chanson_des_gobelins.mp3","la_halle_de_guilde_doree.mp3",
    "la_marche_des_corps_silencieux.mp3","la_marche_des_possedes.mp3","la_peste_noire.mp3",
    "le_cantique_des_profondeurs.mp3","legends_rise_together.mp3","majestic_underwater_reflections.mp3",
    "market_day_revelry.mp3","melancolie_mystique.mp3","merchant_s_harmony.mp3","mind_s_duel.mp3",
    "miniature_majesty.mp3","miniature_medley.mp3","new_age_dark_meditation.mp3","noble_ascendancy.mp3",
    "peaceful_&_graceful_moments.mp3","peaceful_citadel.mp3","quest_for_the_unknown.mp3",
    "realm_rhythms.mp3","realm_rumble.mp3","resilience_in_battle.mp3","resonant_moods.mp3",
    "rising_conflict.mp3","rising_together.mp3","romance_tragique.mp3","shadows_of_dread.mp3",
    "silent_conquest.mp3","sirenes_echoes.mp3","splendor_serenade.mp3","strategy_sonata.mp3",
    "symphony_of_mayhem.mp3","the_hand_of_the_heavens.mp3","the_monks_uprising.mp3","the_umbral_descent.mp3",
    "through_haunted_halls.mp3","time_portal_temple_discovery.mp3","treacherous_echoes.mp3","tribal_ritual.mp3",
    "unbound_legend_pulse.mp3","underneath_a_baroque_moonlight.mp3","veil_of_peril.mp3","vintage_chamber.mp3",
    "vintage_cinema.mp3","whispers_of_betrayal.mp3","whispers_of_enchantment.mp3","whispers_of_history.mp3",
    "whispers_of_home.mp3","whispers_of_the_ancient_forest.mp3","whispers_of_the_divine.mp3","whispers_of_the_tide.mp3","x-gene_awakening.mp3"
];

const targetFiles = new Set(userFilesList.map(f => f.trim()));
const content = fs.readFileSync('./mp3_online.csv', 'utf8');
const cleanContent = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
const rows = cleanContent.split('\n').filter(line => line.trim().length > 0);
const headers = rows[0].split(';');

function col(name) { return headers.findIndex(h => h.trim() === name); }

const idx = {
    title: col('Title'), artist: col('Artist'), filename: col('Filename'),
    length: col('AudioLength'), keywords: col('Keywords'), mood: col('Mood'),
    genre: col('Genre'), bpm: col('BPM'), usage: col('Usage'),
    story: col('Story'), year: col('Year'), bitrate: col('Bitrate'),
};

function parseTags(str) {
    return str ? [...new Set(str.split(',').map(s => s.trim()).filter(Boolean))] : [];
}

const results = [];
for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(';');
    if (cols.length <= idx.filename) continue;
    let filename = cols[idx.filename];
    if (!filename || !targetFiles.has(filename.trim())) continue;

    const durationSec = parseInt(cols[idx.length], 10) || 0;
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;

    const bpmRaw = cols[idx.bpm] ? cols[idx.bpm].trim() : '';
    const bpmNum = parseInt(bpmRaw, 10) || null;

    // Extract BPM from keywords if not in BPM column
    let bpmFinal = bpmNum;
    if (!bpmFinal) {
        const kwStr = cols[idx.keywords] || '';
        const bpmMatch = kwStr.match(/(\d+)\s*bpm/i);
        if (bpmMatch) bpmFinal = parseInt(bpmMatch[1], 10);
    }

    const usage = parseTags(cols[idx.usage]);
    const story = cols[idx.story] ? cols[idx.story].trim() : '';

    results.push({
        title: cols[idx.title] ? cols[idx.title].trim() : 'Unknown',
        artist: cols[idx.artist] ? cols[idx.artist].trim() : 'Hylst',
        filename: filename.trim(),
        imageName: filename.trim().replace(/\.mp3$/i, '.webp'),
        durationSec,
        duration: `${mins}:${secs.toString().padStart(2, '0')}`,
        genre: cols[idx.genre] ? cols[idx.genre].trim() : '',
        bpm: bpmFinal,
        year: cols[idx.year] ? cols[idx.year].trim() : '',
        bitrate: cols[idx.bitrate] ? parseInt(cols[idx.bitrate].trim(), 10) || null : null,
        keywords: parseTags(cols[idx.keywords]),
        mood: parseTags(cols[idx.mood]),
        usage,
        story: story || null,
    });
}

// Manual entries for missing files
const foundFiles = new Set(results.map(r => r.filename));
const manual = [
    { title: '2 Villagers Died This Night', filename: '2_villagers_died_this_night.mp3', genre: 'dark ambient', bpm: 70, year: '2025', bitrate: 192, usage: ['dramatic'], story: 'La nuit tombe sur le village. Deux âmes de plus rejoignent les ombres.' },
    { title: 'Festin des Aventuriers', filename: 'festin_des_aventuriers.mp3', genre: 'folk taverne', bpm: 118, year: '2025', bitrate: 192, usage: ['festive', 'taverne'], story: null },
    { title: 'Gare aux Sorcières', filename: 'gare_aux_sorcieres.mp3', genre: 'mystical dark', bpm: 85, year: '2025', bitrate: 192, usage: ['mystical', 'dark'], story: null },
    { title: 'La Marche des Possédés', filename: 'la_marche_des_possedes.mp3', genre: 'dark orchestral', bpm: 90, year: '2025', bitrate: 192, usage: ['combat', 'dark'], story: null },
    { title: 'La Peste Noire', filename: 'la_peste_noire.mp3', genre: 'dark ambient medieval', bpm: 65, year: '2025', bitrate: 192, usage: ['dramatic', 'dark'], story: null },
    { title: 'Whispers of the Ancient Forest', filename: 'whispers_of_the_ancient_forest.mp3', genre: 'ambient nature', bpm: 75, year: '2025', bitrate: 192, usage: ['ambient', 'exploration'], story: null },
    { title: 'Whispers of the Tide', filename: 'whispers_of_the_tide.mp3', genre: 'ambient oceanic', bpm: 72, year: '2025', bitrate: 192, usage: ['ambient', 'calm'], story: null },
];

for (const m of manual) {
    if (!foundFiles.has(m.filename)) {
        results.push({
            title: m.title, artist: 'Hylst',
            filename: m.filename,
            imageName: m.filename.replace(/\.mp3$/i, '.webp'),
            durationSec: 0, duration: '?:??',
            genre: m.genre, bpm: m.bpm, year: m.year, bitrate: m.bitrate,
            keywords: [], mood: ['cinematic'], usage: m.usage, story: m.story,
        });
    }
}

fs.writeFileSync('./src/data/musics.json', JSON.stringify(results, null, 2));
console.log('Done:', results.length, 'tracks');
// Stats
const withBpm = results.filter(r => r.bpm).length;
const withStory = results.filter(r => r.story).length;
const withUsage = results.filter(r => r.usage && r.usage.length > 0).length;
console.log(`BPM: ${withBpm}, Story: ${withStory}, Usage: ${withUsage}`);
