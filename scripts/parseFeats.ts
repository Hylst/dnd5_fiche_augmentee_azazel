import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Feat {
  id: string;
  name: string;
  trad: string;
  prerequisite: string;
  descriptionHtml: string;
  source: string;
}

function parseFeatsFile(filePath: string, outputPath: string) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html);
  const feats: Feat[] = [];

  $('.bloc').each((_, element) => {
    const el = $(element);
    
    const name = el.find('h1').text().trim();
    
    let trad = el.find('.trad').text().trim();
    if (trad.startsWith('[')) trad = trad.substring(1);
    if (trad.endsWith(']')) trad = trad.substring(0, trad.length - 1);
    trad = trad.trim();

    let prerequisite = el.find('.prerequis').text().trim();
    if (prerequisite.startsWith('Prérequis :')) {
      prerequisite = prerequisite.replace('Prérequis :', '').trim();
    }

    // Get description. Sometimes there's a .resume, we'll just take .description
    const descriptionHtml = el.find('.description').html()?.trim() || '';

    const source = el.find('.source').text().trim();

    // Generate a simple ID
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    feats.push({
      id,
      name,
      trad,
      prerequisite,
      descriptionHtml,
      source
    });
  });

  fs.writeFileSync(outputPath, JSON.stringify(feats, null, 2));
  console.log(`Successfully parsed ${feats.length} feats to ${outputPath}`);
}

const featsInputPath = path.join(__dirname, '../docs/List » Feats - DnD 5e.html');
const featsOutputPath = path.join(__dirname, '../src/data/allFeats.json');

parseFeatsFile(featsInputPath, featsOutputPath);
