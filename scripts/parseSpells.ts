import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseSpellsFile(filePath: string, outputFileName: string) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);

  const spells: any[] = [];

  $('.bloc').each((_, el) => {
    const name = $(el).find('h1').text().trim();
    const trad = $(el).find('.trad').text().trim().replace(/\[|\]/g, '').trim();
    const ecoleText = $(el).find('.ecole').text().trim();
    
    // Parse level and school
    // e.g., "niveau 1 - abjuration" or "niveau 0 - évocation" or "niveau 1 - abjuration (rituel)"
    let level = 0;
    let school = '';
    let isRitual = false;
    
    const levelMatch = ecoleText.match(/niveau (\d+)/i);
    if (levelMatch) {
      level = parseInt(levelMatch[1], 10);
    }
    
    const schoolParts = ecoleText.split('-');
    if (schoolParts.length > 1) {
      school = schoolParts[1].trim();
      if (school.includes('(rituel)')) {
        isRitual = true;
        school = school.replace('(rituel)', '').trim();
      }
    }

    let castingTime = '';
    let range = '';
    let components = '';
    let duration = '';

    $(el).find('div').each((_, divEl) => {
      const text = $(divEl).text().trim();
      if (text.startsWith("Temps d'incantation :")) {
        castingTime = text.replace("Temps d'incantation :", "").trim();
      } else if (text.startsWith("Portée :")) {
        range = text.replace("Portée :", "").trim();
      } else if (text.startsWith("Composantes :")) {
        components = text.replace("Composantes :", "").trim();
      } else if (text.startsWith("Durée :")) {
        duration = text.replace("Durée :", "").trim();
      }
    });

    let concentration = duration.toLowerCase().includes('concentration');
    if (concentration) {
      duration = duration.replace(/concentration,\s*/i, '').trim();
    }

    // Description
    // We want to keep the HTML formatting for bold/italic if possible, or convert to markdown.
    // The user wants a rich display. Let's extract the HTML of the description.
    let descriptionHtml = $(el).find('.description').html() || '';
    descriptionHtml = descriptionHtml.trim();

    // Classes
    const classes: string[] = [];
    $(el).find('.classe').each((_, classEl) => {
      classes.push($(classEl).text().trim());
    });
    // Also check for TCoE classes
    $(el).find('.tcoe').each((_, classEl) => {
      classes.push($(classEl).text().trim());
    });

    const source = $(el).find('.source').text().trim();

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    spells.push({
      id,
      name,
      trad,
      level,
      school,
      isRitual,
      castingTime,
      range,
      components,
      duration,
      concentration,
      descriptionHtml,
      classes,
      source,
      isPrepared: false,
      isFavorite: false
    });
  });

  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'data', outputFileName),
    JSON.stringify(spells, null, 2),
    'utf-8'
  );
  console.log(`Parsed ${spells.length} spells into ${outputFileName}`);
}

// Parse all spells
parseSpellsFile(path.join(__dirname, '..', 'docs', 'List » Spells - DnD 5e.html'), 'allSpells.json');

// Parse bard spells
parseSpellsFile(path.join(__dirname, '..', 'docs', 'List » Sorts de bardes - DnD 5e .html'), 'bardSpells.json');
