// Glow City · ranking.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Ranking ----------
const RTABS={score:['Glow Score',p=>scoreVon(p),v=>Math.round(v).toLocaleString('de-DE')],stil:['Stil',p=>p.stil,v=>v.toLocaleString('de-DE')],verm:['Vermögen',p=>p.verm||0,v=>v>=1e6?(v/1e6).toLocaleString('de-DE',{maximumFractionDigits:1})+' Mio.':Math.round(v/1e3)+'k'],fol:['Follower',p=>p.fol,v=>v>=1e3?(v/1e3).toLocaleString('de-DE',{maximumFractionDigits:1})+'k':String(v)],glow:['Beauty',p=>p.glow||0,v=>v.toLocaleString('de-DE')]};
function panel(titel){offen=null;sel=null;const c=document.getElementById('card');c.hidden=false;document.getElementById('hint').hidden=true;document.getElementById('ct').textContent=titel;const cb=document.getElementById('cb');cb.replaceChildren();return cb}
function ranking(tab='score'){if(INNEN)return;const cb=panel('Ranking Glow City');const[lab,wert,fmt]=RTABS[tab];
  const tabs=document.createElement('div');tabs.className='tabs';for(const[k,[l]]of Object.entries(RTABS)){const b=document.createElement('button');b.textContent=l;b.setAttribute('aria-pressed',k===tab);b.onclick=()=>ranking(k);tabs.append(b)}
  const alle=[...new Set(P)].filter(q=>q.charId||q===ICH||q.bw||q.echt).map(q=>profil(q));alle.sort((a,b)=>wert(b)-wert(a));
  const meinPlatz=alle.findIndex(x=>x.p===ICH)+1,vor=alle[meinPlatz-2];
  const fomo=document.createElement('div');fomo.className='fomo';fomo.textContent=vor?`Du bist auf Platz ${meinPlatz} von ${alle.length}. Noch ${fmt(Math.max(1,Math.ceil(wert(vor)-wert(alle[meinPlatz-1]))))} ${lab} bis du ${vor.name} überholst.`:'Du bist auf Platz 1. Alle schauen auf dich.';
  const rl=document.createElement('div');rl.className='rl';
  const zeigen=alle.slice(0,15);if(meinPlatz>15)zeigen.push(alle[meinPlatz-1]);
  zeigen.forEach(pr=>{const pl=alle.indexOf(pr)+1,st=stufe(pr.stil);const r=document.createElement('div');r.className='rr'+(pr.p===ICH?' ich':'');
    r.innerHTML=`<span class="pl">${pl}</span><span class="nm"><b></b><span class="st" style="background:${st.r};color:${st.t}">${st.n}</span><small></small></span><span class="wv">${fmt(wert(pr))}</span>`;
    r.querySelector('b').textContent=pr.name+(pr.p&&pr.p.echt?' · LIVE':'');r.querySelector('small').textContent=pr.titel;r.onclick=()=>{if(pr.p!==ICH){FREMD=pr.p;karten()}};rl.append(r)});
  cb.append(tabs,fomo);if(tab==='score'&&typeof scoreAufbau==='function')scoreAufbau(cb);cb.append(rl);if(typeof einladenBereich==='function')einladenBereich(cb)}
document.getElementById('bRang').onclick=()=>ranking();
