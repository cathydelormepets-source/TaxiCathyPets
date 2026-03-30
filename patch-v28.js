/* ═══ PATCH V28 : Articles Devis + QR Fix + Fidélisation ═══ */

// ========= 1. FIX QR CODE → https://www.cathypetsitter.com/ =========
if(typeof getVitrineUrl === 'function'){
  window.getVitrineUrl = function(refOrId){ return 'https://www.cathypetsitter.com/'; };
}

// ========= 2. FIX FIDÉLISATION : compatibilité champs factures =========
window.facGetStatus = function(f){ return f.statut || f.status || ''; };
window.facGetTTC = function(f){ return parseFloat(f.ttc) || parseFloat(f.total) || 0; };
window.facIsPaid = function(f){ var s = window.facGetStatus(f); return s === 'payee' || s === 'payée'; };

// Patch refreshScoring
(function(){
  var origScoring = window.refreshScoring;
  window.refreshScoring = function(){
    var clients = act(db.clients);
    var now = new Date();
    var yearAgo = new Date(now.getFullYear()-1, now.getMonth(), now.getDate());
    var scores = clients.map(function(c){
      var factures = act(db.factures).filter(function(f){ return f.clientId === c.id && facIsPaid(f); });
      var caTotal = factures.reduce(function(sum, f){ return sum + facGetTTC(f); }, 0);
      var ca12m = factures.filter(function(f){ return new Date(f.date) >= yearAgo; }).reduce(function(sum, f){ return sum + facGetTTC(f); }, 0);
      var transports = act(db.transports).filter(function(t){ return t.clientId === c.id; }).length;
      var lastTr = act(db.transports).filter(function(t){ return t.clientId === c.id; }).sort(function(a,b){ return new Date(b.date)-new Date(a.date); })[0];
      var tier = 'new';
      if(ca12m >= 2000) tier = 'vip';
      else if(ca12m >= 1000) tier = 'gold';
      else if(ca12m >= 500) tier = 'silver';
      else if(ca12m > 0) tier = 'bronze';
      return { client: c, caTotal: caTotal, ca12m: ca12m, transports: transports, lastActivity: lastTr ? lastTr.date : '—', tier: tier };
    }).sort(function(a,b){ return b.ca12m - a.ca12m; });
    document.getElementById('sc_vip').textContent = scores.filter(function(s){ return s.tier === 'vip'; }).length;
    document.getElementById('sc_gold').textContent = scores.filter(function(s){ return s.tier === 'gold'; }).length;
    document.getElementById('sc_silver').textContent = scores.filter(function(s){ return s.tier === 'silver'; }).length;
    document.getElementById('sc_bronze').textContent = scores.filter(function(s){ return s.tier === 'bronze'; }).length;
    var h = '';
    scores.forEach(function(s){
      var tierBadge = '<span class="score-badge '+s.tier+'">'+(s.tier==='vip'?'👑 VIP':s.tier==='gold'?'🥇 Gold':s.tier==='silver'?'🥈 Silver':s.tier==='bronze'?'🥉 Bronze':'🆕 Nouveau')+'</span>';
      h += '<tr><td><b>'+s.client.nom+'</b> '+(s.client.prenom||'')+'</td><td>'+euro(s.caTotal)+'</td><td style="color:var(--a2);font-weight:700">'+euro(s.ca12m)+'</td><td>'+s.transports+'</td><td>'+s.lastActivity+'</td><td>'+tierBadge+'</td></tr>';
    });
    document.getElementById('scoringBody').innerHTML = h;
    var chartH = '';
    scores.slice(0,10).forEach(function(s){
      var maxCA = scores[0].ca12m || 1;
      var pct = (s.ca12m / maxCA * 100);
      var color = s.tier === 'vip' ? '#d4a843' : s.tier === 'gold' ? '#f59e0b' : s.tier === 'silver' ? '#9ca3af' : '#b45309';
      chartH += '<div style="flex:1;display:flex;flex-direction:column;align-items:center"><div style="height:'+pct+'%;max-height:150px;width:100%;background:'+color+';border-radius:4px 4px 0 0;min-height:10px"></div><div style="font-size:9px;margin-top:4px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60px">'+s.client.nom.split(' ')[0]+'</div></div>';
    });
    document.getElementById('scoringChart').innerHTML = chartH;
  };
})();

// Patch loadComparison
(function(){
  window.loadComparison = function(){
    var period = document.getElementById('cmp_period').value;
    var now = new Date();
    var startCurrent, endCurrent, startPrev, endPrev;
    if(period === 'mois'){
      startCurrent = new Date(now.getFullYear(), now.getMonth(), 1); endCurrent = now;
      startPrev = new Date(now.getFullYear()-1, now.getMonth(), 1); endPrev = new Date(now.getFullYear()-1, now.getMonth()+1, 0);
    } else if(period === 'trim'){
      var q = Math.floor(now.getMonth()/3);
      startCurrent = new Date(now.getFullYear(), q*3, 1); endCurrent = now;
      startPrev = new Date(now.getFullYear()-1, q*3, 1); endPrev = new Date(now.getFullYear()-1, (q+1)*3, 0);
    } else {
      startCurrent = new Date(now.getFullYear(), 0, 1); endCurrent = now;
      startPrev = new Date(now.getFullYear()-1, 0, 1); endPrev = new Date(now.getFullYear()-1, 11, 31);
    }
    var facCurrent = act(db.factures).filter(function(f){ var d = new Date(f.date); return d >= startCurrent && d <= endCurrent && facIsPaid(f); });
    var facPrev = act(db.factures).filter(function(f){ var d = new Date(f.date); return d >= startPrev && d <= endPrev && facIsPaid(f); });
    var caCurrent = facCurrent.reduce(function(s,f){ return s + facGetTTC(f); }, 0);
    var caPrev = facPrev.reduce(function(s,f){ return s + facGetTTC(f); }, 0);
    document.getElementById('cmp_ca_now').textContent = euro(caCurrent);
    document.getElementById('cmp_ca_prev').textContent = euro(caPrev);
    setDelta('cmp_ca_delta', caCurrent, caPrev);
    var trCurrent = act(db.transports).filter(function(t){ var d = new Date(t.date); return d >= startCurrent && d <= endCurrent; }).length;
    var trPrev = act(db.transports).filter(function(t){ var d = new Date(t.date); return d >= startPrev && d <= endPrev; }).length;
    document.getElementById('cmp_tr_now').textContent = trCurrent;
    document.getElementById('cmp_tr_prev').textContent = trPrev;
    setDelta('cmp_tr_delta', trCurrent, trPrev);
    var cliCurrent = act(db.clients).filter(function(c){ var d = new Date(c.dateCreation || '2020-01-01'); return d >= startCurrent && d <= endCurrent; }).length;
    var cliPrev = act(db.clients).filter(function(c){ var d = new Date(c.dateCreation || '2020-01-01'); return d >= startPrev && d <= endPrev; }).length;
    document.getElementById('cmp_cli_now').textContent = cliCurrent;
    document.getElementById('cmp_cli_prev').textContent = cliPrev || '—';
    setDelta('cmp_cli_delta', cliCurrent, cliPrev);
    var pmCurrent = trCurrent > 0 ? caCurrent / trCurrent : 0;
    var pmPrev = trPrev > 0 ? caPrev / trPrev : 0;
    document.getElementById('cmp_pm_now').textContent = euro(pmCurrent);
    document.getElementById('cmp_pm_prev').textContent = euro(pmPrev);
    setDelta('cmp_pm_delta', pmCurrent, pmPrev);
    renderCompareChart();
  };
})();

// ========= 3. LIGNES ARTICLES DEVIS =========
(function(){
  var qNoEl = document.getElementById('q_no');
  if(qNoEl){
    var parent = qNoEl.closest('.fd');
    if(parent && parent.nextElementSibling){
      var artZone = document.createElement('div');
      artZone.innerHTML = '<div style="font-size:11px;font-weight:800;color:var(--mt);text-transform:uppercase;letter-spacing:.1em;margin:8px 0 6px">📦 Articles / Lignes du devis</div>'+
        '<div id="q_lignes"></div>'+
        '<button class="btn sm bu" onclick="devAddLigne()" style="margin-bottom:10px">➕ Ajouter un article</button>'+
        '<div class="row"><div class="c4 fd"><label>Remise %</label><input id="q_remise" type="number" min="0" max="100" step="1" value="0" oninput="devCalcTotal()"></div>'+
        '<div class="c4 fd"><label>TVA %</label><select id="q_tva" onchange="devCalcTotal()" style="background:#080f1a;border:1px solid var(--ln);color:var(--tx);border-radius:10px;padding:10px 12px;font:inherit;font-size:13px;width:100%">'+
        '<option value="20">20%</option><option value="10">10%</option><option value="5.5">5,5%</option><option value="0">0% (exo)</option></select></div>'+
        '<div class="c4 fd"><label>Total TTC calculé €</label><input id="q_to_calc" type="number" step="0.01" readonly style="color:var(--gd);font-weight:800;font-size:15px"></div></div>'+
        '<div id="q_recap" style="padding:10px 14px;background:#0f1f33;border-radius:8px;font-size:12px;margin-bottom:10px;display:none"></div>';
      parent.parentNode.insertBefore(artZone, parent.nextElementSibling);
    }
  }
  window._devLigneCount = 0;
  window.devAddLigne = function(desc, qty, pu){
    var i = window._devLigneCount++;
    var box = document.getElementById('q_lignes');
    if(!box) return;
    var row = document.createElement('div');
    row.id = 'q_lg_row_'+i;
    row.style.cssText = 'display:grid;grid-template-columns:1fr 70px 90px 36px;gap:6px;margin-bottom:6px;align-items:center';
    row.innerHTML =
      '<input id="q_lg_d_'+i+'" placeholder="Description article..." value="'+(desc||'')+'" oninput="devCalcTotal()" style="background:#080f1a;border:1px solid var(--ln);color:var(--tx);border-radius:8px;padding:7px 8px;font:inherit;font-size:12px">'+
      '<input id="q_lg_q_'+i+'" type="number" min="0.5" step="0.5" value="'+(qty||1)+'" oninput="devCalcTotal()" style="background:#080f1a;border:1px solid var(--ln);color:var(--tx);border-radius:8px;padding:7px 8px;font:inherit;font-size:12px;text-align:center" placeholder="Qté">'+
      '<input id="q_lg_p_'+i+'" type="number" step="0.01" min="0" value="'+(pu||'')+'" oninput="devCalcTotal()" style="background:#080f1a;border:1px solid var(--ln);color:var(--tx);border-radius:8px;padding:7px 8px;font:inherit;font-size:12px" placeholder="PU HT €">'+
      '<button class="btn sm rd" onclick="devDelLigne('+i+')" style="padding:5px 8px">✕</button>';
    box.appendChild(row);
    devCalcTotal();
  };
  window.devDelLigne = function(i){ var row = document.getElementById('q_lg_row_'+i); if(row) row.remove(); devCalcTotal(); };
  window.devGetLignes = function(){
    var lignes = [];
    for(var i = 0; i < window._devLigneCount+5; i++){
      var dEl = document.getElementById('q_lg_d_'+i);
      var qEl = document.getElementById('q_lg_q_'+i);
      var pEl = document.getElementById('q_lg_p_'+i);
      if(dEl && qEl && pEl){
        var d = dEl.value.trim(), q = parseFloat(qEl.value)||0, p = parseFloat(pEl.value)||0;
        if(d || p > 0) lignes.push({desc:d, qty:q, pu:p, montant:q*p});
      }
    }
    return lignes;
  };
  window.devCalcTotal = function(){
    var lignes = devGetLignes();
    var totalHT = lignes.reduce(function(s,l){ return s + l.montant; }, 0);
    var remise = parseFloat((document.getElementById('q_remise')||{}).value||0)||0;
    var tva = parseFloat((document.getElementById('q_tva')||{}).value||20)||20;
    var htApresRemise = totalHT * (1 - remise/100);
    var tvaM = htApresRemise * tva / 100;
    var ttc = htApresRemise + tvaM;
    var calcEl = document.getElementById('q_to_calc');
    if(calcEl) calcEl.value = ttc.toFixed(2);
    var toEl = document.getElementById('q_to');
    if(toEl && lignes.length > 0) toEl.value = ttc.toFixed(2);
    var recap = document.getElementById('q_recap');
    if(recap && lignes.length > 0){
      recap.style.display = 'block';
      recap.innerHTML = '<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>Total HT lignes</span><b>'+euro(totalHT)+'</b></div>'+
        (remise > 0 ? '<div style="display:flex;justify-content:space-between;margin-bottom:4px;color:var(--or)"><span>Remise '+remise+'%</span><b>-'+euro(totalHT*remise/100)+'</b></div>' : '')+
        '<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>HT après remise</span><b>'+euro(htApresRemise)+'</b></div>'+
        '<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>TVA '+tva+'%</span><b>'+euro(tvaM)+'</b></div>'+
        '<div style="display:flex;justify-content:space-between;font-size:14px;color:var(--gd)"><span><b>Total TTC</b></span><b>'+euro(ttc)+'</b></div>';
    } else if(recap){ recap.style.display = 'none'; }
  };
  var origAddDev = window.addDev;
  window.addDev = function(){
    var origPush = db.devis.push;
    db.devis.push = function(q){
      q.lignes = devGetLignes();
      q.tva = parseFloat((document.getElementById('q_tva')||{}).value||20)||20;
      q.remise = parseFloat((document.getElementById('q_remise')||{}).value||0)||0;
      var result = origPush.call(db.devis, q);
      window._devLigneCount = 0;
      var qlBox = document.getElementById('q_lignes'); if(qlBox) qlBox.innerHTML = '';
      var qRemise = document.getElementById('q_remise'); if(qRemise) qRemise.value = '0';
      var qRecap = document.getElementById('q_recap'); if(qRecap) qRecap.style.display = 'none';
      var qToCalc = document.getElementById('q_to_calc'); if(qToCalc) qToCalc.value = '';
      db.devis.push = origPush;
      return result;
    };
    origAddDev();
  };
})();

console.log('[CathyPets V28] ✅ Patch loaded: Articles Devis + QR Fix + Fidélisation calculs');
