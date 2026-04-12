import { CharacterState } from '../store/characterStore';

export function generateCharacterHTML(state: CharacterState): string {
  const { identity, stats, combat, skills, feats, traits, inventory, spells } = state;

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${identity.name} - Fiche de Personnage</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #5a2020; border-bottom: 2px solid #c9933a; padding-bottom: 5px; }
        h2 { color: #5a2020; margin-top: 20px; border-bottom: 1px solid #c9933a; padding-bottom: 5px; }
        h3 { color: #333; margin-bottom: 5px; }
        .grid { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
        .stat-box { border: 1px solid #c9933a; padding: 10px 20px; text-align: center; border-radius: 5px; background-color: #fdfbf7; min-width: 80px; }
        .stat-name { font-size: 0.9em; color: #666; text-transform: uppercase; }
        .stat-value { font-size: 1.8em; font-weight: bold; color: #5a2020; }
        .info-line { margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #fdfbf7; color: #5a2020; }
        .spell-level { margin-top: 15px; font-weight: bold; color: #c9933a; }
      </style>
    </head>
    <body>
      <h1>${identity.name}</h1>
      <div class="info-line"><strong>Race :</strong> ${identity.race} (${identity.subrace})</div>
      <div class="info-line"><strong>Classe :</strong> ${identity.class} (${identity.subclass})</div>
      <div class="info-line"><strong>Niveau :</strong> ${identity.level}</div>
      <div class="info-line"><strong>Alignement :</strong> ${identity.alignment}</div>
      <div class="info-line"><strong>Origine :</strong> ${identity.origin}</div>
      
      <h2>Caractéristiques</h2>
      <div class="grid">
        ${Object.entries(stats).map(([stat, val]) => `
          <div class="stat-box">
            <div class="stat-name">${stat}</div>
            <div class="stat-value">${val}</div>
          </div>
        `).join('')}
      </div>

      <h2>Combat</h2>
      <div class="info-line"><strong>Points de Vie :</strong> ${combat.hpCurrent} / ${combat.hpMax}</div>
      <div class="info-line"><strong>Classe d'Armure :</strong> ${combat.acBase + combat.acBonus}</div>
      <div class="info-line"><strong>Vitesse :</strong> ${combat.speed}m</div>
      <div class="info-line"><strong>Initiative :</strong> +${combat.initiativeBonus}</div>

      <h2>Compétences</h2>
      <table>
        <tr><th>Compétence</th><th>Caractéristique</th><th>Maîtrise</th></tr>
        ${skills.map(s => `
          <tr>
            <td>${s.name}</td>
            <td>${s.stat}</td>
            <td>${s.type === 'EXP' ? 'Expertise' : s.type === 'MAI' ? 'Maîtrise' : 'Aucune'}</td>
          </tr>
        `).join('')}
      </table>

      <h2>Dons & Traits</h2>
      <ul>
        ${feats.map(f => `<li><strong>${f.name} :</strong> ${f.descriptionHtml.replace(/<[^>]+>/g, '')}</li>`).join('')}
        ${traits.map(t => `<li><strong>${t.name} :</strong> ${t.descriptionHtml.replace(/<[^>]+>/g, '')}</li>`).join('')}
      </ul>

      <h2>Inventaire</h2>
      <ul>
        ${inventory.map(i => `<li>${i.quantity}x ${i.name} ${i.equipped ? '(Équipé)' : ''}</li>`).join('')}
      </ul>

      <h2>Grimoire</h2>
      ${spells.length > 0 ? spells.map(s => `
        <div style="margin-bottom: 10px;">
          <strong>${s.name}</strong> (Niveau ${s.level}) - ${s.school}<br/>
          <em>Temps: ${s.castingTime} | Portée: ${s.range} | Durée: ${s.duration}</em>
        </div>
      `).join('') : '<p>Aucun sort connu.</p>'}
    </body>
    </html>
  `;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
