// Glow City · chat.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Bewohner und Stadt-Chat ----------
// Die Stadt hat 150 feste Bewohnerinnen und Bewohner. Sie sind im Chat als Bewohner gekennzeichnet, echte Spielerinnen kommen später dazu.
const VORN=['Lena','Sophie','Mia','Emma','Hannah','Lea','Marie','Laura','Julia','Sarah','Anna','Lisa','Nina','Aylin','Selin','Elif','Zoe','Clara','Paula','Mila','Jana','Nora','Valerie','Chiara','Melina','Leonie','Amira','Yasmin','Bianca','Vanessa','Jonas','Luca','Ben','Elias','Noah','Tim','Max','Leon','Kerem','David'];
const NACH=['K.','M.','S.','B.','W.','R.','T.','A.','L.','H.'];
const BEW=[];for(let i=0;i<150;i++){const v=VORN[(i*7)%VORN.length];BEW.push({name:v+' '+NACH[(i*3)%NACH.length],handle:'@'+v.toLowerCase()+(i%3?'.'+['glow','city','style','daily','fit'][i%5]:'_'+(i+11))})}
P.filter(p=>!p.star).forEach((p,i)=>{p.bw=BEW[i%BEW.length];if(i%7===0)p.bagK=['speedi','reed','jackie','baguetta','jodie','lady','flap','birkinn'][(i/7)%8|0]});
const GC=window.GLOW_CHAT;
const msgs=document.getElementById('msgs');let chatAn=innerWidth>900;
const NFARBEN=['#ff5fa2','#3fe0d0','#b79cff','#ff8a65','#7ee0a1','#6ec6ff','#ffd166','#f78fb3'];
const farbeFuer=n=>NFARBEN[[...n].reduce((a,c)=>a+c.charCodeAt(0),0)%NFARBEN.length];
function post(name,text,{me,tag,sys,live}={}){const p=document.createElement('p');if(live){const l=document.createElement('span');l.className='live';l.textContent='LIVE';p.append(l)}if(me)p.className='me';if(sys){p.className='sys';p.textContent=text}else{const n=document.createElement('span');n.className='n';n.textContent=name;n.style.color=me?'#f2c14e':farbeFuer(name);p.append(n);if(tag){const t=document.createElement('span');t.className='npc';t.textContent='NPC';p.insertBefore(t,n)}p.append(text)}
  msgs.append(p);while(msgs.children.length>60)msgs.firstChild.remove();msgs.scrollTop=msgs.scrollHeight}
// Keine Wiederholungen: die letzten 80 Sätze werden gemerkt und nicht erneut benutzt
const ZULETZT=[];function frisch(liste){const frei=liste.filter(x=>!ZULETZT.includes(x)),aus=frei.length?frei:liste,x=aus[Math.floor(Math.random()*aus.length)];ZULETZT.push(x);if(ZULETZT.length>80)ZULETZT.shift();return x}
const zufallsBew=(ohne)=>{let b;do{b=BEW[Math.floor(Math.random()*BEW.length)]}while(b===ohne);return b};
const fuellen=t=>t.replace(/\{du\}/g,(ST.profil&&ST.profil.handle)||'du').replace(/\{n\}/g,zufallsBew().name.split(' ')[0]);
const tageszeit=()=>{const h=typeof stunde==='function'?stunde():12;return h>=5&&h<11?'morgen':h<17?'mittag':h<22?'abend':'nacht'};
// Bewohnerinnen schreiben in unregelmäßigen Abständen: mal ein Satz zur Tageszeit, mal etwas Allgemeines, mal ein kleines Gespräch
function bewohnerSagt(){const r=Math.random();
  if(r<.28){const[frage,antw]=frisch(GC.GESPRAECHE),a=zufallsBew();post(a.handle,fuellen(frage),{tag:'Bewohnerin'});let w=0;const n=1+(Math.random()<.55?1:0),genutzt=new Set();
    for(let k=0;k<n;k++){let t;do{t=antw[Math.floor(Math.random()*antw.length)]}while(genutzt.has(t)&&genutzt.size<antw.length);genutzt.add(t);const b=zufallsBew(a);w+=2500+Math.random()*4000;setTimeout(()=>post(b.handle,fuellen(t),{tag:'Bewohnerin'}),w)}}
  else{const b=zufallsBew();post(b.handle,fuellen(frisch(r<.62?GC.TAGESZEIT[tageszeit()]:GC.ALLGEMEIN)),{tag:'Bewohnerin'})}
  setTimeout(bewohnerSagt,7000+Math.random()*15000)}
post('','Willkommen in Glow City. Hier schreiben Bewohnerinnen der Stadt, bald auch echte Spielerinnen.',{sys:1});
for(let i=0;i<4;i++){const b=BEW[i*13];post(b.handle,fuellen(frisch(i%2?GC.ALLGEMEIN:GC.TAGESZEIT[tageszeit()])),{tag:'Bewohnerin'})}setTimeout(bewohnerSagt,4000);
const online=document.getElementById('online');setInterval(()=>online.textContent=`${140+Math.floor(Math.random()*10)} Bewohner unterwegs`,5000);online.textContent='146 Bewohner unterwegs';
// Stadt-News: goldene Meldungen im Chat, von echten Spielerinnen und von den Charakteren der Stadt
function news(text){const p=document.createElement('p');p.className='news';const n=document.createElement('span');n.className='live';n.style.color='#ffd166';n.textContent='NEWS';p.append(n,text);msgs.append(p);while(msgs.children.length>60)msgs.firstChild.remove();msgs.scrollTop=msgs.scrollHeight}
const PROMI_NEWS=[c=>`${c} hat gerade einen Champagner-Turm im Nicky Beach bestellt`,c=>`${c} wurde mit einer neuen Birkinn vor Maison du Sac gesehen`,c=>`${c} steht auf der Warteliste für den Diamantring 3 Karat`,c=>`${c} ist gerade mit dem Teslo über den CoWork Tower geflogen`,c=>`${c} sitzt im Borchert am Fenstertisch`,c=>`${c} hat 2.000 neue Follower nach einem Selfie im Rivva`,c=>`${c} war heute zweimal bei Dr. Glatt`];
setInterval(()=>{const c=FG.CHARS[Math.floor(Math.random()*FG.CHARS.length)];news(PROMI_NEWS[Math.floor(Math.random()*PROMI_NEWS.length)](c.name))},40000+Math.random()*30000);
document.getElementById('chatForm').onsubmit=e=>{e.preventDefault();setTimeout(()=>ereignis('chat'));const i=document.getElementById('chatIn');const t=i.value.trim();if(!t)return;post(ST.profil.handle||'Du',t,{me:1});i.value='';if(KONTO.room)KONTO.room.emit('chat',{handle:ST.profil.handle||'Gast',text:t.slice(0,140)}).catch(()=>{});
  antworten(t,ST.profil.handle)};
// Bewohnerinnen antworten dir: zwei bis drei Antworten zum Thema, ohne Wiederholung, manchmal mit Nachfrage
// Auch auf andere echte Spielerinnen: dann eine Antwort, mit Namen angesprochen
function antworten(text,wer,wenige){const thema=GC.THEMEN.find(([re])=>re.test(text));const pool=thema?thema[1]:GC.NACHFRAGEN;const anzahl=wenige?1:2+(Math.random()<.5?1:0);let warte=1500;const genutzt=new Set();
  for(let k=0;k<anzahl;k++){let t;let n=0;do{t=k===anzahl-1&&thema&&Math.random()<.35?frisch(GC.NACHFRAGEN):frisch(pool);n++}while(genutzt.has(t)&&n<8);genutzt.add(t);const b=zufallsBew();warte+=1200+Math.random()*2600;const an=wer&&(wenige||k===0)&&Math.random()<.7?wer.replace(/^@?/,'@')+' ':'';setTimeout(()=>post(b.handle,an+fuellen(t),{tag:'Bewohnerin'}),warte)}}
const chat=document.getElementById('chat');if(!chatAn)chat.classList.add('zu');
const hintOff=()=>document.getElementById('hint').hidden=!chat.classList.contains('zu');hintOff();document.getElementById('chatZu').onclick=()=>{chat.classList.add('zu');hintOff()};document.getElementById('bChat').onclick=()=>{chat.classList.toggle('zu');hintOff()};
function tap(mx,my){let hit=null;
  for(let i=B.length-1;i>=0;i--){const b=B[i];g.beginPath();[pt(b.x,b.y+4),pt(b.x+4,b.y+4),pt(b.x+4,b.y),pt(b.x+4,b.y,b.h+30),pt(b.x,b.y,b.h+30),pt(b.x,b.y+4,b.h+30)].forEach(([a,c],j)=>j?g.lineTo(a,c):g.moveTo(a,c));
    if(g.isPointInPath(mx,my)){hit=b;break}}
  // Im Haus: Menschen antippen und ansprechen
  if(INNEN){let best=null,bd=1e9;for(const q of INNEN.innen||[]){const[qx,qy]=pt(q.x,q.y);const d=Math.hypot(mx-qx,my-(qy-10*Z));if(d<bd){bd=d;best=q}}if(best&&bd<Math.max(26,18*Z)&&typeof ansprechen==='function')ansprechen(best);return}
  if(ICH.auto){const[ax,ay]=ICH.faehrt?pt(ICH.x,ICH.y):pt(PARK_ICH.x,PARK_ICH.y);if(Math.hypot(mx-ax,my-(ay-6*Z))<Math.max(18,16*Z)){
    if(ICH.faehrt){ICH.faehrt=0;PARK_ICH.x=ICH.x;PARK_ICH.y=ICH.y;ICH.x+=.35;ICH.y+=.35;ICH.path=[];toast(`${ICH.auto.name} geparkt`)}
    else{if(Math.hypot(ICH.x-PARK_ICH.x,ICH.y-PARK_ICH.y)>1.5){laufeZu(PARK_ICH.x,PARK_ICH.y,null);ICH.einsteigen=1;return}ICH.faehrt=1;ICH.x=PARK_ICH.x;ICH.y=PARK_ICH.y;toast(`Du fährst deinen ${ICH.auto.name}. Antippen zum Parken.`)}return}}
  {let best=null,bd=1e9;for(const q of P){if(q===ICH)continue;const[qx,qy]=pt(q.x,q.y);const d=Math.hypot(mx-qx,my-(qy-10*Z));if(d<bd){bd=d;best=q}}
   if(best&&bd<Math.max(14,12*Z)){FREMD=best;karten();return}}
  sel=null;document.getElementById('card').hidden=true;offen=null;
  if(hit){const[tx,ty]=tuer(hit);laufeZu(tx,ty,hit)}else{const[x,y]=welt(mx,my);laufeZu(x,y,null)}}
