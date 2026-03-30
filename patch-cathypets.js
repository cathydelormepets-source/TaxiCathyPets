// ═══════════════════════════════════════════════════════════════
// PATCH CATHY PETS V23 — Logo Orange + Module Animaux
// MODE D'EMPLOI : colle cette SEULE ligne juste avant </body>
// <script src="patch-cathypets.js"></script>
// ═══════════════════════════════════════════════════════════════

(function() {
'use strict';

// ─────────────────────────────────────────
// 1. LOGO SVG ORANGE
// ─────────────────────────────────────────
const LOGO_ORANGE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 120" style="max-width:420px;width:100%;height:auto">
  <g fill="none" stroke="#FF6B00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M45,95 Q35,75 38,60 Q40,50 45,45 L50,30 Q52,25 48,22 L45,18 Q50,20 53,25 L55,30 L60,22 Q62,18 58,15 Q63,17 65,22 L63,30 Q68,38 72,45 Q78,50 82,60 Q85,75 75,95"/>
    <circle cx="60" cy="42" r="14"/>
    <circle cx="55" cy="40" r="2" fill="#FF6B00"/><circle cx="65" cy="40" r="2" fill="#FF6B00"/>
    <path d="M52,45 L38,42 M52,47 L40,48 M68,45 L82,42 M68,47 L80,48"/>
    <path d="M75,85 Q90,70 95,55 Q97,48 92,50"/>
  </g>
  <g fill="none" stroke="#FF6B00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(85,0)">
    <path d="M20,95 L22,65 Q25,50 35,45 L40,42 Q45,38 50,40 Q55,38 60,40 L65,42 Q75,45 78,50 L80,65 L82,95"/>
    <ellipse cx="52" cy="35" rx="16" ry="13"/>
    <path d="M38,30 Q32,35 34,48 Q36,52 40,48"/>
    <path d="M66,30 Q72,35 70,48 Q68,52 64,48"/>
    <circle cx="48" cy="33" r="2" fill="#FF6B00"/><circle cx="58" cy="33" r="2" fill="#FF6B00"/>
    <ellipse cx="52" cy="40" rx="5" ry="3"/>
    <circle cx="52" cy="38" r="2" fill="#FF6B00"/>
    <path d="M80,55 Q88,40 92,35 Q95,30 93,28"/>
  </g>
  <g transform="translate(100,60)" fill="#FF6B00" opacity="0.3">
    <ellipse cx="0" cy="12" rx="8" ry="10"/>
    <circle cx="-7" cy="2" r="4"/><circle cx="0" cy="-2" r="4"/><circle cx="7" cy="2" r="4"/>
  </g>
  <text x="210" y="55" font-family="'Segoe UI',Arial,sans-serif" font-size="42" font-weight="700" fill="#FF6B00" letter-spacing="3">CATHY PETS</text>
  <text x="212" y="78" font-family="'Segoe UI',Arial,sans-serif" font-size="13" fill="#FF6B00" letter-spacing="5" opacity="0.8">PETSITTER &amp; TAXI ANIMALIERS</text>
  <line x1="210" y1="88" x2="550" y2="88" stroke="#FF6B00" stroke-width="1.5" opacity="0.4"/>
  <text x="212" y="105" font-family="'Segoe UI',Arial,sans-serif" font-size="10" fill="#FF6B00" opacity="0.6">SAS · SIRET 928 564 269 · cathypetsitter.com · 07.81.30.41.10</text>
</svg>`;

// ─────────────────────────────────────────
// 2. CSS AUTO-INJECTÉ
// ─────────────────────────────────────────
const css = document.createElement('style');
css.textContent = `
.animaux-module{background:var(--card-bg,#1e293b);border:1px solid var(--border,#334155);border-radius:12px;padding:16px;margin:12px 0}
.animaux-module-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.animaux-module-header h4{margin:0;color:#FF6B00;font-size:15px}
.btn-add-animal{background:linear-gradient(135deg,#FF6B00,#FF9500);color:#fff;border:none;border-radius:50%;width:36px;height:36px;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;box-shadow:0 2px 8px rgba(255,107,0,.3)}
.btn-add-animal:hover{transform:scale(1.1);box-shadow:0 4px 16px rgba(255,107,0,.5)}
.animaux-list{display:flex;flex-direction:column;gap:8px}
.animal-card{background:var(--bg,#0f172a);border:1px solid var(--border,#334155);border-left:4px solid #FF6B00;border-radius:8px;padding:12px;display:flex;justify-content:space-between;align-items:center;gap:10px;animation:acSlide .3s ease}
@keyframes acSlide{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
.animal-card-info{flex:1;display:flex;flex-wrap:wrap;gap:4px 14px;font-size:13px}
.animal-card-info span{color:#94a3b8}
.animal-card-info strong{color:#FF9500}
.animal-card-info .animal-name{color:#fff;font-weight:600;font-size:14px;min-width:100%}
.btn-remove-animal{background:none;border:none;color:#ef4444;font-size:18px;cursor:pointer;padding:4px 8px;border-radius:6px}
.btn-remove-animal:hover{background:rgba(239,68,68,.15)}
.modal-animal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.modal-animal{background:var(--card-bg,#1e293b);border:1px solid #FF6B00;border-radius:16px;padding:24px;width:90%;max-width:480px;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(255,107,0,.2)}
.modal-animal h3{color:#FF6B00;margin:0 0 20px}
.modal-animal label{display:block;color:#94a3b8;font-size:13px;margin:12px 0 4px}
.modal-animal input,.modal-animal select,.modal-animal textarea{width:100%;padding:10px 12px;border:1px solid var(--border,#334155);border-radius:8px;background:var(--bg,#0f172a);color:var(--text,#e2e8f0);font-size:14px;box-sizing:border-box}
.modal-animal input:focus,.modal-animal select:focus,.modal-animal textarea:focus{border-color:#FF6B00;outline:none;box-shadow:0 0 0 2px rgba(255,107,0,.2)}
.modal-animal-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.modal-animal-actions{display:flex;gap:10px;margin-top:20px}
.modal-animal-actions button{flex:1;padding:12px;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}
.btn-confirm-animal{background:linear-gradient(135deg,#FF6B00,#FF9500);color:#fff}
.btn-confirm-animal:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(255,107,0,.4)}
.btn-cancel-animal{background:var(--bg,#0f172a);color:#94a3b8;border:1px solid var(--border,#334155)!important}
.logo-document-header{text-align:center;padding:16px 0 12px;border-bottom:2px solid rgba(255,107,0,.2);margin-bottom:16px}
`;
document.head.appendChild(css);

// ─────────────────────────────────────────
// 3. STOCKAGE ANIMAUX PAR CONTEXTE
// ─────────────────────────────────────────
window.animauxParContexte = { devis: [], factureTransport: [], bonTransport: [] };

// ─────────────────────────────────────────
// 4. FONCTIONS GLOBALES
// ─────────────────────────────────────────

window.ouvrirModalAnimal = function(contexte) {
  let animauxExistants = '';
  if (typeof data !== 'undefined' && data.animaux && data.animaux.length > 0) {
    animauxExistants = data.animaux.map((a, i) =>
      `<option value="${i}">${a.nom || '?'} — ${a.espece || '?'} ${a.race ? '(' + a.race + ')' : ''}</option>`
    ).join('');
  }

  const modal = document.createElement('div');
  modal.className = 'modal-animal-overlay';
  modal.id = 'modal-animal-overlay';
  modal.onclick = function(e) { if (e.target === modal) fermerModalAnimal(); };
  modal.innerHTML = `
    <div class="modal-animal">
      <h3>🐾 Ajouter un animal</h3>
      ${animauxExistants ? `
        <label>📋 Sélectionner un animal existant</label>
        <select id="modal-animal-existant" onchange="remplirAnimalExistant(this.value)">
          <option value="">— Saisie manuelle —</option>
          ${animauxExistants}
        </select>
        <div style="text-align:center;color:#64748b;margin:10px 0;font-size:12px">— ou saisir manuellement —</div>
      ` : ''}
      <label>Nom de l'animal *</label>
      <input type="text" id="modal-animal-nom" placeholder="Ex: Luna, Rex...">
      <div class="modal-animal-row">
        <div>
          <label>Espèce *</label>
          <select id="modal-animal-espece">
            <option value="">— Choisir —</option>
            <option value="🐕 Chien">🐕 Chien</option>
            <option value="🐈 Chat">🐈 Chat</option>
            <option value="🦜 NAC">🦜 NAC</option>
            <option value="🐦 Oiseau">🐦 Oiseau</option>
            <option value="🦎 Reptile">🦎 Reptile</option>
            <option value="🐹 Rongeur">🐹 Rongeur</option>
            <option value="🐾 Autre">🐾 Autre</option>
          </select>
        </div>
        <div>
          <label>Race</label>
          <input type="text" id="modal-animal-race" placeholder="Ex: Labrador...">
        </div>
      </div>
      <div class="modal-animal-row">
        <div>
          <label>Poids (kg)</label>
          <input type="number" id="modal-animal-poids" step="0.1" min="0" placeholder="Ex: 12.5">
        </div>
        <div>
          <label>N° puce / tatouage</label>
          <input type="text" id="modal-animal-puce" placeholder="N° identification">
        </div>
      </div>
      <label>Carnet de vaccinations</label>
      <select id="modal-animal-vaccin">
        <option value="oui">✅ Oui — à jour</option>
        <option value="non">❌ Non</option>
        <option value="inconnu">❓ Non renseigné</option>
      </select>
      <label>Caractère / Remarques</label>
      <textarea id="modal-animal-remarques" rows="3" placeholder="Ex: Craintif en voiture, agressif avec les chats..."></textarea>
      <div class="modal-animal-actions">
        <button type="button" class="btn-cancel-animal" onclick="fermerModalAnimal()">Annuler</button>
        <button type="button" class="btn-confirm-animal" onclick="confirmerAjoutAnimal('${contexte}')">✅ Ajouter</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('modal-animal-nom')?.focus(), 100);
};

window.remplirAnimalExistant = function(index) {
  if (!index && index !== 0) return;
  const a = data.animaux[index];
  if (!a) return;
  document.getElementById('modal-animal-nom').value = a.nom || '';
  document.getElementById('modal-animal-race').value = a.race || '';
  document.getElementById('modal-animal-poids').value = a.poids || '';
  document.getElementById('modal-animal-puce').value = a.puce || a.tatouage || '';
  document.getElementById('modal-animal-remarques').value = a.remarques || a.caractere || '';
  const especeMap = { chien:'🐕 Chien', chat:'🐈 Chat', nac:'🦜 NAC', oiseau:'🐦 Oiseau', reptile:'🦎 Reptile', rongeur:'🐹 Rongeur' };
  const sel = document.getElementById('modal-animal-espece');
  const mapped = especeMap[(a.espece || '').toLowerCase()] || '';
  if (mapped) sel.value = mapped;
};

window.confirmerAjoutAnimal = function(contexte) {
  const nom = document.getElementById('modal-animal-nom').value.trim();
  const espece = document.getElementById('modal-animal-espece').value;
  if (!nom) { alert("Le nom de l'animal est obligatoire"); return; }
  if (!espece) { alert("L'espèce est obligatoire"); return; }
  animauxParContexte[contexte].push({
    id: Date.now(),
    nom, espece,
    race: document.getElementById('modal-animal-race').value.trim(),
    poids: document.getElementById('modal-animal-poids').value,
    puce: document.getElementById('modal-animal-puce').value.trim(),
    vaccin: document.getElementById('modal-animal-vaccin').value,
    remarques: document.getElementById('modal-animal-remarques').value.trim()
  });
  rafraichirListeAnimaux(contexte);
  fermerModalAnimal();
};

window.fermerModalAnimal = function() {
  const o = document.getElementById('modal-animal-overlay');
  if (o) o.remove();
};

window.supprimerAnimalDuContexte = function(contexte, id) {
  animauxParContexte[contexte] = animauxParContexte[contexte].filter(a => a.id !== id);
  rafraichirListeAnimaux(contexte);
};

function rafraichirListeAnimaux(contexte) {
  const c = document.getElementById('animaux-list-' + contexte);
  if (!c) return;
  const animaux = animauxParContexte[contexte];
  if (!animaux.length) {
    c.innerHTML = '<div style="color:#64748b;font-size:13px;text-align:center;padding:12px">Aucun animal — cliquez ➕</div>';
    return;
  }
  c.innerHTML = animaux.map(a => `
    <div class="animal-card">
      <div class="animal-card-info">
        <div class="animal-name">${a.espece.split(' ')[0]} ${a.nom}</div>
        ${a.race ? `<span>Race: <strong>${a.race}</strong></span>` : ''}
        ${a.poids ? `<span>Poids: <strong>${a.poids} kg</strong></span>` : ''}
        ${a.puce ? `<span>Puce: <strong>${a.puce}</strong></span>` : ''}
        <span>Vaccins: <strong>${a.vaccin === 'oui' ? '✅' : a.vaccin === 'non' ? '❌' : '❓'}</strong></span>
        ${a.remarques ? `<span style="min-width:100%;color:#fbbf24;font-size:12px">⚠️ ${a.remarques}</span>` : ''}
      </div>
      <button class="btn-remove-animal" onclick="supprimerAnimalDuContexte('${contexte}',${a.id})" title="Retirer">✕</button>
    </div>`).join('');
}

window.getAnimauxContexte = function(contexte) { return animauxParContexte[contexte] || []; };
window.resetAnimauxContexte = function(contexte) { animauxParContexte[contexte] = []; rafraichirListeAnimaux(contexte); };

// Pour les PDF (jsPDF)
window.ajouterLogoPDF = function(doc, x, y, w) {
  x = x || 15; y = y || 10; w = w || 80;
  doc.setTextColor(255, 107, 0);
  doc.setFontSize(22); doc.setFont('helvetica', 'bold');
  doc.text('CATHY PETS', x, y + 10);
  doc.setFontSize(9); doc.text('PETSITTER & TAXI ANIMALIERS', x, y + 17);
  doc.setFontSize(7);
  doc.text('SAS · SIRET 928 564 269 · cathypetsitter.com · 07.81.30.41.10', x, y + 23);
  doc.setDrawColor(255, 107, 0); doc.setLineWidth(0.5);
  doc.line(x, y + 26, x + w, y + 26);
  doc.setTextColor(0, 0, 0);
};

window.ajouterAnimauxPDF = function(doc, contexte, startY) {
  const animaux = getAnimauxContexte(contexte);
  if (!animaux.length) return startY;
  let y = startY;
  doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.setTextColor(255,107,0);
  doc.text('Animaux concernés', 15, y); y += 6;
  doc.setDrawColor(255,107,0); doc.setLineWidth(0.5); doc.line(15,y,195,y); y += 5;
  doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(100,100,100);
  doc.text('Nom',16,y); doc.text('Espèce',48,y); doc.text('Race',80,y);
  doc.text('Poids',115,y); doc.text('N° Puce',133,y); doc.text('Vaccins',168,y); y += 5;
  doc.setFont('helvetica','normal'); doc.setTextColor(40,40,40);
  animaux.forEach(a => {
    doc.setFontSize(9);
    doc.text(a.nom||'—',16,y); doc.text((a.espece||'').replace(/^.{2} /,''),48,y);
    doc.text(a.race||'—',80,y); doc.text(a.poids?a.poids+' kg':'—',115,y);
    doc.text(a.puce||'—',133,y); doc.text(a.vaccin==='oui'?'OK':a.vaccin==='non'?'NON':'?',168,y);
    if (a.remarques) { y+=4; doc.setFontSize(7); doc.setTextColor(180,120,0); doc.text('  → '+a.remarques.substring(0,80),16,y); doc.setTextColor(40,40,40); }
    y += 6;
  });
  return y + 3;
};

// ─────────────────────────────────────────
// 5. INJECTION AUTOMATIQUE DANS LE DOM
// ─────────────────────────────────────────

function creerModuleAnimaux(contexte, titre) {
  return `<div class="animaux-module" id="animaux-module-${contexte}">
    <div class="animaux-module-header">
      <h4>🐾 ${titre}</h4>
      <button type="button" class="btn-add-animal" onclick="ouvrirModalAnimal('${contexte}')" title="Ajouter un animal">+</button>
    </div>
    <div class="animaux-list" id="animaux-list-${contexte}">
      <div style="color:#64748b;font-size:13px;text-align:center;padding:12px">Aucun animal — cliquez ➕</div>
    </div>
  </div>`;
}

function creerLogoHeader(id) {
  return `<div class="logo-document-header" id="${id}">${LOGO_ORANGE_SVG}</div>`;
}

function injecterDansSection(texteRecherche, logoId, contexte, titreAnimaux) {
  // Cherche tous les h3, h2, divs qui contiennent le texte
  const allElements = document.querySelectorAll('h3, h2, .tab-title, [class*="title"]');
  let cible = null;

  // Méthode 1 : cherche dans les titres
  allElements.forEach(el => {
    if (el.textContent.includes(texteRecherche)) cible = el;
  });

  // Méthode 2 : cherche dans tout le body par texte
  if (!cible) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.includes(texteRecherche)) {
        cible = walker.currentNode.parentElement;
        break;
      }
    }
  }

  if (!cible) return false;

  // Trouve le conteneur parent (section/div de formulaire)
  let section = cible.closest('.tab-content, .section, [id*="tab"], [id*="section"], div[style*="display"]');
  if (!section) section = cible.parentElement;

  // Insère le logo après le titre
  const logoDiv = document.createElement('div');
  logoDiv.innerHTML = creerLogoHeader(logoId);
  cible.insertAdjacentElement('afterend', logoDiv.firstElementChild);

  // Cherche et remplace l'ancien bloc animaux dans cette section
  const ancienAnimaux = section.querySelector('[id*="animal"], [id*="animaux"]');
  if (ancienAnimaux && !ancienAnimaux.id.startsWith('animaux-module-')) {
    ancienAnimaux.outerHTML = creerModuleAnimaux(contexte, titreAnimaux);
  } else {
    // Pas trouvé d'ancien bloc → insère après le logo
    const logoEl = document.getElementById(logoId);
    if (logoEl) {
      const modDiv = document.createElement('div');
      modDiv.innerHTML = creerModuleAnimaux(contexte, titreAnimaux);
      logoEl.insertAdjacentElement('afterend', modDiv.firstElementChild);
    }
  }
  return true;
}

// ─────────────────────────────────────────
// 6. LANCEMENT AUTO
// ─────────────────────────────────────────

function initPatch() {
  console.log('🐾 Patch CathyPets V23 — Chargement...');

  // Injection dans les 3 sections
  const r1 = injecterDansSection('Nouveau devis', 'logo-devis', 'devis', 'Animaux concernés');
  const r2 = injecterDansSection('Facture Transport', 'logo-facture-transport', 'factureTransport', 'Animaux transportés');
  const r3 = injecterDansSection('bon de transport', 'logo-bon-transport', 'bonTransport', 'Animaux transportés');

  // Si l'injection auto n'a pas marché pour tout, on cherche plus large
  if (!r1 || !r2 || !r3) {
    // Fallback : cherche les textes "Animaux concernés" / "Animal(aux)" et insère à côté
    document.querySelectorAll('label, h4, h3, span, div').forEach(el => {
      const txt = el.textContent.trim();
      if (txt.includes('Animaux concernés') && !document.getElementById('animaux-module-devis')) {
        el.closest('div')?.insertAdjacentHTML('afterend', creerModuleAnimaux('devis', 'Animaux concernés'));
      }
      if (txt.includes('Animal(aux)') && !document.getElementById('animaux-module-factureTransport')) {
        el.closest('div')?.insertAdjacentHTML('afterend', creerModuleAnimaux('factureTransport', 'Animaux transportés'));
      }
      if (txt.includes('Animaux transportés') && !document.getElementById('animaux-module-bonTransport')) {
        el.closest('div')?.insertAdjacentHTML('afterend', creerModuleAnimaux('bonTransport', 'Animaux transportés'));
      }
    });
  }

  console.log('✅ Patch CathyPets V23 — OK !');
}

// Lancer dès que le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPatch);
} else {
  initPatch();
}

})();


// V28 : Chargement du patch articles devis + QR fix + fidelisation
(function(){ var s = document.createElement("script"); s.src = "patch-v28.js"; document.body.appendChild(s); })();
