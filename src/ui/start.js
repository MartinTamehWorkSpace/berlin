// Berlin City · start.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Startbildschirm und Figur ----------
const LOOK={skin:['#f6dcc8','#f1d0b5','#e4b997','#c99a76','#8d5b3d','#5c3b29'],frisur:[['welle','Wellen'],['glatt','Lang glatt'],['bob','Bob'],['dutt','Dutt'],['zopf','Zopf'],['locken','Locken'],['kurz','Kurz']],
  hair:['#141414','#3a2416','#6b4630','#a8562a','#e6d3a3','#f4f0e6','#b5462c'],out:['#f4efe6','#16171a','#ff4fa3','#c9b48a','#1d3557','#2e8b57','#c8b6e2']};
ST.profil=ST.profil||{handle:'',skin:'#e4b997',frisur:'welle',hair:'#3a2416',c1:'#f4efe6'};
function lookAnwenden(){const pr=ST.profil;Object.assign(ICH,{skin:pr.skin,frisur:pr.frisur,hair:pr.hair,top:pr.c1,c1:pr.c1,w:pr.frisur==='kurz'?0:1});ICH.handle=pr.handle}
function startZeichnen(){const cv=document.getElementById('vorschau');const g2=cv.getContext('2d');g2.clearRect(0,0,cv.width,cv.height);const pr=ST.profil;
  FG.zeichne(g2,110,288,8.4,{skin:pr.skin,frisur:pr.frisur,hair:pr.hair,c1:pr.c1,c2:'#16171a',outfit:pr.frisur==='kurz'?'anzug':'kleid',w:pr.frisur==='kurz'?0:1,acc:['creolen'],mimik:'laecheln',ph:1},T,false)}
function startAufbauen(){const pr=ST.profil;const sw=(id,list,key)=>{const el=document.getElementById(id);el.replaceChildren(...list.map(c=>{const b=document.createElement('button');b.style.background=c;b.setAttribute('aria-label',c);b.setAttribute('aria-pressed',pr[key]===c);b.onclick=()=>{pr[key]=c;startAufbauen()};return b}))};
  sw('sSkin',LOOK.skin,'skin');sw('sHair',LOOK.hair,'hair');sw('sOut',LOOK.out,'c1');
  document.getElementById('sFrisur').replaceChildren(...LOOK.frisur.map(([k,l])=>{const b=document.createElement('button');b.textContent=l;b.setAttribute('aria-pressed',pr.frisur===k);b.onclick=()=>{pr.frisur=k;startAufbauen()};return b}));
  const h=document.getElementById('sHandle');if(document.activeElement!==h)h.value=pr.handle||'';startZeichnen()}
document.getElementById('sHandle').oninput=e=>{ST.profil.handle=e.target.value.replace(/[^\wäöüÄÖÜß.@-]/g,'').slice(0,20)};
document.getElementById('sLos').onclick=()=>{let h=(ST.profil.handle||'').trim();if(!h){document.getElementById('sHandle').focus();toast('Gib dir einen Namen für die Stadt');return}if(h[0]!=='@')h='@'+h;ST.profil.handle=h;
  save();lookAnwenden();document.getElementById('start').hidden=true;karten();hud();toast(`Willkommen in Berlin City, ${h}`)};
startAufbauen();lookAnwenden();
(function startTick(){if(!document.getElementById('start').hidden){startZeichnen();requestAnimationFrame(startTick)}})();
