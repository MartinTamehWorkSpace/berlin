// Berlin · setcard.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Visitenkarte: Stufen nach Stilpunkten ----------
const STUFEN=[{ab:0,n:'Starter',bg:'linear-gradient(135deg,#2a2c34,#1a1b21)',r:'#8a8f99',t:'#111'},{ab:100,n:'Bronze',bg:'linear-gradient(135deg,#5a3a24,#2a1c12)',r:'#cd8b55',t:'#1a0f08'},
 {ab:500,n:'Silber',bg:'linear-gradient(135deg,#6b7280,#2b2f37)',r:'#dfe3e8',t:'#15171b'},{ab:1500,n:'Gold',bg:'linear-gradient(135deg,#7a5a1e,#2e220b)',r:'#f2c14e',t:'#1e1606'},
 {ab:5000,n:'Platin',bg:'linear-gradient(135deg,#7c8a96,#28323b)',r:'#e8f1f8',t:'#10161b'},{ab:15000,n:'Diamant',bg:'linear-gradient(135deg,#2c5f7a,#16213a)',r:'#8fe3f0',t:'#06141c'},
 {ab:50000,n:'Black Card',bg:'linear-gradient(135deg,#0b0b0d,#1e1a22)',r:'#ff4fa3',t:'#fff'}];
const stufe=st=>STUFEN.reduce((a,x)=>st>=x.ab?x:a,STUFEN[0]);
const naechste=st=>STUFEN.find(x=>x.ab>st)||null;
// Werte der Bewohner: fest je Person, damit Vergleiche stabil bleiben
function meinGlow(){const b=ST.besitz;let v=6+(b.botox?.5:0)+(b.lippen?.5:0)+(b.nase?1:0);const t=WS.KATALOG.filter(i=>i.kat==='tasche'&&b[i.id]).reduce((m,i)=>Math.max(m,i.rang),0);v+=t/900;v+=Math.min(.8,Object.keys(ST.outfit||{}).length*.15);v+=Math.min(.6,(ST.energie??70)/170);return Math.min(10,Math.round(v*10)/10)}
function meinVermoegen(){return Math.round(ST.geld+WS.KATALOG.filter(i=>ST.besitz[i.id]&&i.kat!=='konsum').reduce((s,i)=>s+i.preis,0))}
function profil(p){if(p===ICH){const k=WS.lohnStufe(ST.tage);return{name:(ST.profil&&ST.profil.handle)||'Du',handle:'Deine Setcard',titel:(typeof tagTitel==='function'?tagTitel():k.titel+(typeof ruhmStufe==='function'?' · '+ruhmStufe().name:''))+(typeof influencerStufe==='function'&&influencerStufe().ab?' · '+influencerStufe().name:''),lohn:WS.tageslohn(ST.tage,ST.serie),stil:ST.stil,fol:ST.follower||0,verm:meinVermoegen(),glow:meinGlow(),tasche:ICH.bagK,auto:ICH.auto&&ICH.auto.name,p}}
  if(!p.prof&&p.charId){p.prof={name:p.name,handle:p.handle,titel:p.rolle,lohn:p.lohn,stil:p.stil,fol:p.fol,verm:p.verm,glow:p.glow,tasche:p.tasche,auto:p.auto,acc:p.acc,p}}
  if(!p.prof){const r=(p.ph*9301+49297)%233280/233280;const sterne={Valentina:62000,Mila:21000,Jonas:7400,'Dr. Glatt':3900};const stil=sterne[p.name]??Math.round(Math.pow(r,3.2)*9000+Math.random()*40);
    const tage=Math.min(900,Math.round(stil/9+Math.random()*20));const autos=WS.KATALOG.filter(i=>i.kat==='auto'&&i.preis<stil*120).sort((a,b)=>b.rang-a.rang);
    p.prof={verm:Math.round(stil*42+3000),glow:Math.round((5.5+r*3.5)*10)/10,name:p.name||(p.bw&&p.bw.name)||'Bewohnerin',handle:p.star?(p.name==='Dr. Glatt'?'Arzt · Ästhetik Klinik':'@'+p.name.toLowerCase()):(p.bw?p.bw.handle:''),titel:WS.lohnStufe(tage).titel,lohn:WS.lohnStufe(tage).lohn,stil,fol:Math.round(stil*3.4+Math.random()*200),tasche:p.bagK,auto:autos[0]&&autos[0].name,p}}return p.prof}
// Rang in der Stadt nach dem Respekt (src/spiel/glowscore.js)
function rangVon(pr){const wer=pr&&pr.p||ICH,wert=pr?scoreVon(pr):glowScore(),alle=[...new Set(P)].filter(q=>q!==wer).map(q=>scoreVon(profil(q)));return 1+alle.filter(v=>v>wert).length}
function karte(pr,fremd){const st=stufe(pr.stil),nx=naechste(pr.stil);const d=document.createElement('div');d.className='vk'+(fremd?' fremd':'');d.style.setProperty('--vkbg',st.bg);d.style.setProperty('--vkr',st.r);d.style.setProperty('--vkt',st.t);
  const p=pr.p;const av=`<div class="av" style="background:${p.skin}"><i style="background:${p.top}"></i></div>`;
  const ta=pr.tasche&&WS.KATALOG.find(i=>i.id===pr.tasche);const p_=pr.p;
  d.innerHTML=`${fremd?'<button class="zu" aria-label="Karte schließen">×</button>':''}<div class="kopf">${av}<div class="nm"></div><span class="stufe">${st.n}</span></div>
   ${!fremd?`<div class="glowz"><span>ENERGIE ${Math.round(ST.energie??80)}</span><div>${Array.from({length:10},(_,k)=>`<i class="${k<Math.round((ST.energie??80)/10)?'an':''}" style="${k<Math.round((ST.energie??80)/10)?'background:linear-gradient(90deg,#7ee0a1,#2fe0d2)':''}"></i>`).join('')}</div></div>`:''}
   <div class="glowz"><span>GLOW ${(pr.glow||0).toLocaleString('de-DE')}</span><div>${Array.from({length:10},(_,k)=>`<i class="${k<Math.round(pr.glow||0)?'an':''}"></i>`).join('')}</div></div>
   <div class="werte"><div><span>Vermögen</span><b>${pr.verm>=1e6?(pr.verm/1e6).toLocaleString('de-DE',{maximumFractionDigits:1})+' Mio':(pr.verm/1e3).toLocaleString('de-DE',{maximumFractionDigits:0})+'k'}</b></div><div><span>Einkommen</span><b>${(pr.lohn/1000).toLocaleString('de-DE',{maximumFractionDigits:1})}k/T</b></div><div><span>Stil</span><b>${pr.stil.toLocaleString('de-DE')}</b></div><div><span>Follower</span><b>${pr.fol>=1000?(pr.fol/1000).toLocaleString('de-DE',{maximumFractionDigits:1})+'k':pr.fol}</b></div><div><span>Rang</span><b>#${rangVon(pr)}</b></div></div>
   <div class="besitz"></div>${nx&&!fremd?`<div class="bar"><i style="width:${Math.min(100,(pr.stil-st.ab)/(nx.ab-st.ab)*100)}%"></i></div><div class="ziel">Noch ${(nx.ab-pr.stil).toLocaleString('de-DE')} Stil bis ${nx.n}</div>`:''}`;
  const nm=d.querySelector('.nm');nm.textContent=pr.name;const sm=document.createElement('small');sm.textContent=`${pr.titel}${pr.handle?' · '+pr.handle:''}`;nm.append(sm);
  const SCH={goldkette:'Goldkette',perlen:'Perlen',creolen:'Creolen',sonnenbrille:'Sonnenbrille',uhr:'Golduhr'};const bs=d.querySelector('.besitz');[ta&&ta.name,pr.auto,...(pr.acc||[]).map(a=>SCH[a])].filter(Boolean).forEach(t=>{const e=document.createElement('em');e.textContent=t;bs.append(e)});if(!bs.children.length){const e=document.createElement('em');e.textContent='Noch keine Luxusstücke';bs.append(e)}
  if(!fremd){const gar=WS.KATALOG.filter(i=>i.kat==='auto'&&ST.besitz[i.id]).sort((a,b)=>b.rang-a.rang);
    if(gar.length){const box=document.createElement('div');box.className='garage';
      const sel=document.createElement('div');sel.className='autos';gar.forEach(a=>{const b=document.createElement('button');b.textContent=a.name;b.setAttribute('aria-pressed',ICH.auto&&ICH.auto.id===a.id);b.onclick=()=>{ST.aktivAuto=a.id;save();if(ICH.faehrt){ICH.faehrt=0;PARK_ICH.x=ICH.x;PARK_ICH.y=ICH.y}hud();karten()};sel.append(b)});
      const ruf=document.createElement('button');ruf.className='ruf';ruf.textContent=RUF?'Auto ist unterwegs …':ICH.faehrt?'Du fährst gerade':`${(ICH.auto||gar[0]).name} rufen`;ruf.disabled=!!RUF||!!ICH.faehrt||!!INNEN;ruf.onclick=autoRufen;
      box.append(sel,ruf);d.append(box)}}
  if(fremd){d.querySelector('.zu').onclick=()=>{FREMD=null;karten()};if(pr.p&&pr.p.nachbarId&&typeof nachbarAktionen==='function')nachbarAktionen(d,pr.p)}return d}
let FREMD=null;
function karten(){const k=document.getElementById('karten');if(karten.klein===undefined){karten.klein=innerWidth<=760;k.addEventListener('click',e=>{if(e.target.closest('.kopf')&&!e.target.closest('.fremd')){karten.klein=!karten.klein;k.classList.toggle('klein',karten.klein)}})}k.classList.toggle('klein',karten.klein);k.replaceChildren(karte(profil(ICH),false),...(FREMD?[karte(profil(FREMD),true)]:[]))}
karten();hud();
