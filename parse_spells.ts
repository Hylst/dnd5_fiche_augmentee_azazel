import fs from 'fs';

const html = fs.readFileSync('docs/List » Sorts de bardes - DnD 5e .html', 'utf8');

const spells = [];
const regex = /<div class="bloc"><h1>(.*?)<\/h1><div class="trad">\[ (.*?) \].*?<\/div><div class="ecole">niveau (\d+) - (.*?)<\/div><div><strong>Temps d'incantation<\/strong> : (.*?)<\/div><div><strong>Portée<\/strong> : (.*?)<\/div><div><strong>Composantes<\/strong> : (.*?)<\/div><div><strong>Durée<\/strong> : (.*?)<\/div><div class="description.*?">(.*?)<\/div>/g;

let match;
while ((match = regex.exec(html)) !== null) {
  const [_, name, trad, level, school, castingTime, range, components, duration, description] = match;
  
  const concentration = duration.toLowerCase().includes('concentration');
  
  spells.push({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name,
    level: parseInt(level, 10),
    school: school.trim(),
    castingTime: castingTime.trim(),
    range: range.trim(),
    components: components.trim(),
    duration: duration.trim(),
    concentration,
    description: description.replace(/<br>/g, '\n').replace(/<[^>]*>?/gm, '').trim(),
    source: 'classe',
    isPrepared: false,
    isFavorite: false
  });
}

const regex0 = /<div class="bloc"><h1>(.*?)<\/h1><div class="trad">\[ (.*?) \].*?<\/div><div class="ecole">niveau 0 - (.*?)<\/div><div><strong>Temps d'incantation<\/strong> : (.*?)<\/div><div><strong>Portée<\/strong> : (.*?)<\/div><div><strong>Composantes<\/strong> : (.*?)<\/div><div><strong>Durée<\/strong> : (.*?)<\/div><div class="description.*?">(.*?)<\/div>/g;
while ((match = regex0.exec(html)) !== null) {
  const [_, name, trad, school, castingTime, range, components, duration, description] = match;
  
  const concentration = duration.toLowerCase().includes('concentration');
  
  spells.push({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name,
    level: 0,
    school: school.trim(),
    castingTime: castingTime.trim(),
    range: range.trim(),
    components: components.trim(),
    duration: duration.trim(),
    concentration,
    description: description.replace(/<br>/g, '\n').replace(/<[^>]*>?/gm, '').trim(),
    source: 'classe',
    isPrepared: false,
    isFavorite: false
  });
}

if (!fs.existsSync('src/data')) {
  fs.mkdirSync('src/data', { recursive: true });
}
fs.writeFileSync('src/data/bardSpells.json', JSON.stringify(spells, null, 2));
console.log(`Parsed ${spells.length} spells.`);
