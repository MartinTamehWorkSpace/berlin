// Berlin City · konto.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Echte Konten: Spielstand in der Datenbank, andere Spielerinnen live ----------
const KONTO={db:null,id:null,doc:null,room:null,schreibt:false,zuletzt:0};const SPIELER=new Map();
// Gäste: klarer Weg zur Anmeldung. Konto anlegen und anmelden läuft über claude.ai, danach den Spiellink neu öffnen.
function gastHinweis(el){el.replaceChildren();const t=document.createElement('span');t.textContent='Gastmodus: Dein Spielstand bleibt nur auf diesem Gerät. Mit Konto wird er überall gespeichert, und du erscheinst im Ranking und im Live-Chat.';
  const a=document.createElement('a');a.className='anmelden';a.textContent='Anmelden oder Konto anlegen';
  // Auf Netlify öffnet der Knopf unser eigenes Anmeldefenster (server.js), auf claude.ai die Claude-Anmeldung
  if(window.glowAbmelden){a.href='#';a.onclick=e=>{e.preventDefault();location.reload()}}else{a.href='https://claude.ai/login';a.target='_blank';a.rel='noopener'}el.append(t,a)}
async function kontoStarten(){const u=window.claude&&window.claude.use;const el=document.getElementById('sKonto');
  if(!u){gastHinweis(el);return}
  const[db,user,room]=await Promise.all([u('db'),u('user'),u('room')]);
  // Live-Chat: zeigt sichtbar, ob du verbunden bist und wer gerade live da ist
  if(room){KONTO.room=room;room.on('chat',m=>{if(m.isMe&&m.sameTab)return;const d=m.data||{};const h=String(d.handle||'Spielerin').slice(0,24),t=String(d.text||'').slice(0,140);if(t){post(h,t,{live:1});if((!d.t||Date.now()-d.t<30000)&&Math.random()<.6)antworten(t,h,1)}});
    try{room.presence({handle:(ST.profil&&ST.profil.handle)||'Gast'});room.onPeers(peers=>{const echte=(peers||[]).filter(p=>!p.isMe&&!(p.kind==='agent'));KONTO.live=echte.length;const el=document.getElementById('online');if(el)el.dataset.live=echte.length;if(echte.length&&!KONTO.gemeldet){KONTO.gemeldet=1;post('',`Live-Chat verbunden. Gerade online: ${echte.map(p=>(p.state&&p.state.handle)||'Spielerin').join(', ')}`,{sys:1})}})}catch(e){}
    post('','Live-Chat verbunden: Echte Spielerinnen, die gerade online sind, sehen deine Nachrichten.',{sys:1})}
  else post('','Live-Chat nicht verbunden. Dafür musst du mit einem Claude-Konto angemeldet sein und Zugang zu Berlin City haben.',{sys:1});
  if(!db||!user){gastHinweis(el);return}
  KONTO.db=db;KONTO.id=await user.id();KONTO.doc=db.doc('spieler/'+KONTO.id);
  try{const snap=await KONTO.doc.get();if(snap.exists){const d=snap.data();if(d&&d.stand){try{const alt=JSON.parse(d.stand);const neuer=(alt.gespeichert||0)>(ST.gespeichert||0)||(!alt.gespeichert&&!ST.gespeichert&&(alt.stil||0)>=(ST.stil||0));if(neuer||!ST.profil.handle){ST=Object.assign({},START,alt);if(!ST.reset1){ST.profil.handle='';ST.reset1=1}save();hud();lookAnwenden();startAufbauen()}}catch(e){}}}}catch(e){}
  // Darf diese Person in die gemeinsame Datenbank schreiben? Zuschauer über den Link dürfen das nicht, dann bleibt alles auf dem Gerät
  let darf=null;try{darf=user.can?await user.can('data.write'):null}catch(e){}if(darf===false)KONTO.nurLokal=true;
  el.replaceChildren();const b=document.createElement('b');b.textContent='Angemeldet.';el.append(b,KONTO.nurLokal?' Name und Spielstand werden auf diesem Gerät gespeichert. Für das Speichern im Konto und das Ranking muss Martin dich als Mitwirkende einladen.':' Dein Spielstand wird gespeichert, und du stehst als echte Spielerin im Ranking.');
  db.collection('spieler').onSnapshot(q=>{const vorher=new Map(SPIELER);q.docs.forEach(d=>{if(d.id===KONTO.id)return;const x=d.data()||{},v=vorher.get(d.id);if(!v||!x.handle)return;
    if(x.tasche&&x.tasche!==v.tasche){const t=WS.KATALOG.find(i=>i.id===x.tasche);if(t)news(`${x.handle} trägt jetzt die ${t.name}`)}
    if(x.auto&&x.auto!==v.auto)news(`${x.handle} fährt jetzt ${x.auto}`);if((x.stil||0)>=1500&&(v.stil||0)<1500)news(`${x.handle} hat die Gold Card`)});SPIELER.clear();q.docs.forEach(d=>{if(d.id===KONTO.id)return;const x=d.data();if(x&&x.handle)SPIELER.set(d.id,x)});spielerFiguren();if(typeof besucheErhalten==='function')besucheErhalten()},()=>{})}
// Eigenen Stand höchstens alle 5 Sekunden schreiben
function kontoSync(){if(!KONTO.doc||KONTO.nurLokal||KONTO.schreibt||Date.now()-KONTO.zuletzt<5000)return;KONTO.schreibt=true;KONTO.zuletzt=Date.now();const pr=profil(ICH);
  KONTO.doc.set({handle:ST.profil.handle||'',look:JSON.stringify(ST.profil),stil:pr.stil,verm:pr.verm,fol:pr.fol,lohn:pr.lohn,glow:pr.glow,tasche:pr.tasche||'',auto:pr.auto||'',titel:pr.titel,score:typeof glowScore==='function'?glowScore():0,klinik:ST.klinik?{behandelt:ST.klinik.behandelt||0,sterne:ST.klinik.sterne||3,umsatz:ST.klinik.umsatz||0,team:{aerztin:!!(ST.klinik.team||{}).aerztin}}:null,liga:ST.klinik&&ST.klinik.woche?{id:ST.klinik.woche.id,umsatz:ST.klinik.woche.umsatz}:null,stand:JSON.stringify(ST),zeit:Date.now()}).catch(e=>{if(e&&/not_granted|permission|denied|refus/i.test(String(e.code||e.message||e))&&!KONTO.nurLokal){KONTO.nurLokal=true;toast('Gespeichert auf diesem Gerät. Für das Konto braucht es eine Einladung als Mitwirkende.')}}).finally(()=>{KONTO.schreibt=false})}
setInterval(kontoSync,6000);
// Echte Spielerinnen laufen als Figuren durch die Stadt
const ECHT=new Map();
function spielerFiguren(){for(const[id,x]of SPIELER){let p=ECHT.get(id);let look={};try{look=JSON.parse(x.look||'{}')}catch(e){}
  if(!p){const turm=B.find(b=>b.haupt)||PLAZA;p=Object.assign(human({}),{star:1,echt:1,lp:loop(turm,.1+Math.random()*.15),s:Math.random()*20,v:.34,ph:Math.random()*6,sz:1.08});ECHT.set(id,p);P.push(p)}
  Object.assign(p,{name:String(x.handle).slice(0,24),skin:look.skin||p.skin,frisur:look.frisur,hair:look.hair||p.hair,c1:look.c1,top:look.c1||p.top,w:look.frisur==='kurz'?0:1,bagK:x.tasche||null,stil:x.stil||0});
  p.prof={score:x.score,name:p.name,handle:'Echte Spielerin',titel:x.titel||'Spielerin',lohn:x.lohn||0,stil:x.stil||0,fol:x.fol||0,verm:x.verm||0,glow:x.glow||0,tasche:x.tasche,auto:x.auto,p}}}
kontoStarten();
