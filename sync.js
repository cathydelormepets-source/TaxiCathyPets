(function(){
var API="https://cathydelormepets-source-cathy-pets.vercel.app/api/sync";
var w=document.createElement("div");
w.id="syncWrap";
document.body.appendChild(w);

var btn=document.createElement("div");
btn.id="syncBtn";
btn.textContent="🔄 Sync Plateforme";
btn.style.cssText="position:fixed;top:10px;right:10px;z-index:99999;cursor:pointer;background:linear-gradient(135deg,#1F4F4A,#2a6b63);color:white;border-radius:14px;padding:10px 16px;font-size:13px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.2);font-family:sans-serif";
w.appendChild(btn);

var panel=document.createElement("div");
panel.id="syncPanel";
panel.style.cssText="position:fixed;top:60px;right:10px;z-index:99999;background:white;border-radius:16px;padding:16px;font-size:13px;box-shadow:0 4px 20px rgba(0,0,0,0.2);width:340px;max-height:80vh;overflow-y:auto;display:none;font-family:sans-serif;border:2px solid #1F4F4A";
w.appendChild(panel);

btn.onclick=async function(){
panel.style.display="block";
panel.textContent="⏳ Synchronisation...";
btn.style.opacity="0.6";
try{
var raw=localStorage.getItem("cathypets_v20");
if(!raw){for(var i=19;i>=10;i--){raw=localStorage.getItem("cathypets_v"+i);if(raw)break;}}
var pm="";
if(raw){
var db=JSON.parse(raw);
var tr=(db.transports||[]).filter(function(t){return t.status!=="annule";});
if(tr.length>0){
var pr=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({transports:tr})});
var pd=await pr.json();
pm=pd.success?"✅ "+pd.message:"❌ "+(pd.error||"Erreur");
}else pm="Aucun transport";
}else pm="⚠️ Donnees V77 non trouvees";

var r=await fetch(API+"?type=all");
var data=await r.json();
var lines=[];
lines.push("🔄 SYNCHRONISATION");
lines.push("━━━━━━━━━━━━━━━━━");
lines.push("📤 V77 → Plateforme : "+pm);
lines.push("");
if(data.success){
var trips=data.trips||[],reqs=data.requests||[];
var pT=trips.filter(function(t){return !t.source||t.source!=="v77";});
var vT=trips.filter(function(t){return t.source==="v77";});
lines.push("📥 "+vT.length+" trajets V77 en ligne / "+pT.length+" trajets plateforme");
lines.push("");
if(pT.length>0){
lines.push("📍 TRAJETS PLATEFORME :");
pT.forEach(function(t){
var st=t.status==="available"?"🟢 Disponible":t.status==="confirmed"?"🔵 Confirmé":t.status==="completed"?"⚫ Terminé":"🟡 "+t.status;
var dt="";try{dt=new Date(t.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});}catch(e){}
lines.push("  "+(t.origin||"?")+" → "+(t.destination||"?")+" | "+st+" | "+dt);
});
lines.push("");
}
var pen=reqs.filter(function(r){return r.status==="pending";});
var acc=reqs.filter(function(r){return r.status==="accepted";});
lines.push("📋 DEMANDES CLIENTS ("+reqs.length+") :");
if(pen.length>0){
lines.push("⏳ "+pen.length+" en attente :");
pen.forEach(function(r){lines.push("  "+(r.affreteurName||"Client")+" | "+(r.origin||"?")+" → "+(r.destination||"?")+(r.proposedPrice?" | "+r.proposedPrice+"€":""));});
}
if(acc.length>0){
lines.push("✅ "+acc.length+" validée(s) :");
acc.forEach(function(r){lines.push("  "+(r.affreteurName||"Client")+" | "+(r.origin||"?")+" → "+(r.destination||"?"));});
}
if(reqs.length===0) lines.push("  Aucune demande");
}
panel.innerText=lines.join("\n");
}catch(e){panel.textContent="❌ Erreur : "+e.message;}
btn.style.opacity="1";
var closeBtn=document.createElement("div");
closeBtn.textContent="✕ Fermer";
closeBtn.style.cssText="text-align:right;margin-top:12px;cursor:pointer;color:#888;font-size:12px";
closeBtn.onclick=function(){panel.style.display="none";};
panel.appendChild(closeBtn);
}; 
setInterval(function(){if(!document.getElementById("syncBtn"))document.body.appendChild(w);},2000);
})();
