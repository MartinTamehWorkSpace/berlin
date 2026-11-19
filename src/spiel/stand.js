// Berlin City · spielstand.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Spielstand und Wirtschaft ----------
const WS=window.GLOW_WIRTSCHAFT;
const KONSUM=k=>i=>i.kat==='konsum'&&i.laden===k;
const VERKAUF={designer:i=>i.laden==='designer',shan:i=>i.laden==='shan',tif:i=>i.laden==='tif',seph:KONSUM('seph'),vic:KONSUM('vic'),lulu:i=>i.laden==='lulu',spa:KONSUM('spa'),salon:KONSUM('salon'),apfel:i=>i.laden==='apfel',nicky:i=>i.kat==='konsum'&&i.laden==='nicky',yacht:i=>i.kat==='jacht',star:KONSUM('star'),borch:KONSUM('borch'),hug:KONSUM('hug'),riva:KONSUM('riva'),boot:KONSUM('boot'),lid:KONSUM('lid'),ross:KONSUM('ross'),dn:KONSUM('dn'),mehr:KONSUM('mehr'),doug:KONSUM('doug'),mcf:KONSUM('mcf'),hotel:KONSUM('hotel'),zahra:i=>i.laden==='zahra',prado:i=>i.laden==='prado',sac:i=>i.kollektion||(i.laden==='sac'&&i.kat!=='tasche'),motors:i=>i.kat==='auto',arena:KONSUM('arena'),berg:i=>i.laden==='berg',deal:i=>i.laden==='deal',jets:i=>i.kat==='jet',klinik:i=>i.kat==='beauty'};
const START={energie:80,follower:0,geld:WS.START_GELD,tage:0,serie:0,letzter:null,stil:0,besitz:{},outfit:{},warte:{}};
let ST=(()=>{try{return Object.assign({},START,JSON.parse(localStorage.getItem('berlin')||'{}'))}catch(e){return{...START}}})();
if(!ST.v2){ST.geld=Math.max(ST.geld,WS.START_GELD);ST.v2=1}
if(!ST.reset1){if(ST.profil)ST.profil.handle='';ST.reset1=1}
if(!ST.test15){ST.geld+=1500000;ST.test15=1}
// Test für Martin: 10 Mio. € und der Teslo Roadster gehören dir
if(!ST.test10){ST.geld+=10000000;ST.besitz.roadster=1;ST.test10=1}
// Einmalig für Martin am 17.11.2026: weitere 10 Mio. € und 50 Mio. € für den Jet (greift, sobald der Name feststeht)
setTimeout(function martinBonus(){if(!ST.profil||!ST.profil.handle){setTimeout(martinBonus,3000);return}if(ST.profil.handle==='@MartinTameh'&&!ST.bonus1711){ST.geld+=10000000;ST.bonus1711=1;save();hud();toast('10 Mio. € gutgeschrieben')}if(ST.profil.handle==='@MartinTameh'&&!ST.bonus50m){ST.geld+=50000000;ST.bonus50m=1;save();hud();toast('50 Mio. € gutgeschrieben, für deinen Jet')}},4000);
// Jeder Speicherstand bekommt einen Zeitstempel. Beim Laden gewinnt immer der neueste (Gerät oder Datenbank).
const save=()=>{ST.gespeichert=Math.max(Date.now(),(ST.gespeichert||0)+1);try{localStorage.setItem('berlin',JSON.stringify(ST))}catch(e){}if(typeof kontoSync==='function')kontoSync()};
addEventListener('pagehide',()=>{try{localStorage.setItem('berlin',JSON.stringify(ST))}catch(e){}if(typeof kontoSync==='function'){KONTO.zuletzt=0;kontoSync()}});
const euro=v=>v.toLocaleString('de-DE')+' €';
const heute=()=>new Date().toISOString().slice(0,10);
function hud(){const k=WS.lohnStufe(ST.tage);if(typeof karten==='function'&&document.getElementById('karten').children.length)setTimeout(()=>{karten();document.getElementById('hFol').textContent=(ST.follower||0).toLocaleString('de-DE');document.getElementById('hRang').textContent='#'+rangVon()});document.getElementById('hKonto').textContent=innerWidth<760&&ST.geld>=1e6?(ST.geld>=1e9?(ST.geld/1e9).toFixed(2).replace('.',',')+' Mrd':(ST.geld/1e6).toFixed(1).replace('.',',')+' Mio')+' €':euro(Math.round(ST.geld));/* Mobilgerät: große Beträge kurz */document.getElementById('hStil').textContent=(typeof glowScore==='function'?glowScore():ST.stil).toLocaleString('de-DE');
  document.getElementById('hLohn').textContent=euro(WS.tageslohn(ST.tage,ST.serie));document.getElementById('hTag').textContent=`TAG ${ST.tage+1} · ${(typeof tagTitel==='function'?tagTitel():k.titel).toUpperCase()}${typeof uhrText==='function'?' · '+uhrText():''}`;
  // Outfit der eigenen Figur
  for(const[id,col]of Object.entries(ST.outfit)){const it=WS.KATALOG.find(i=>i.id===id);if(!it)continue;
    if(it.look)continue;if(/kleid/.test(id)){ICH.dress=1;ICH.top=col;ICH.leg=col}else if(/shirt|blazer|mantel/.test(id))ICH.top=col;else if(/jeans/.test(id))ICH.leg=col}
  {const t=ST.traegt&&ST.besitz[ST.traegt]&&WS.KATALOG.find(i=>i.id===ST.traegt);ICH.outfit=null;ICH.muster=null;ICH.c1=null;
   if(t&&t.look){const col=(ST.outfit&&ST.outfit[t.id])||t.look.c1||(t.farben&&t.farben[0]);ICH.outfit=t.look.outfit;ICH.muster=t.look.muster||null;ICH.c1=col;ICH.top=col;ICH.c2=t.look.c2||col;ICH.leg=t.look.c2||col;ICH.dress=t.look.outfit==='kleid'}}
  const tasche=WS.KATALOG.filter(i=>i.kat==='tasche'&&ST.besitz[i.id]).sort((a,b)=>b.rang-a.rang)[0];ICH.bagK=(ST.traegtTasche&&ST.album&&ST.album[ST.traegtTasche])?ST.traegtTasche:tasche?tasche.id:null;ICH.bag=null;
  ICH.acc=WS.KATALOG.filter(i=>i.acc&&ST.besitz[i.id]).map(i=>i.acc);
  ICH.botox=!!ST.besitz.botox;ICH.lippenVoll=!!ST.besitz.lippen;ICH.straehnen=!!ST.straehnen;ICH.makeup=(ST.makeupBis||0)>((typeof UHR!=='undefined')?UHR.min:0);
  const garage=WS.KATALOG.filter(i=>i.kat==='auto'&&ST.besitz[i.id]).sort((a,b)=>b.rang-a.rang);const auto=garage.find(i=>i.id===ST.aktivAuto)||garage[0];ICH.auto=UBER.faehrt?UBER.auto:(auto||null);ICH.titel=[tasche&&tasche.name,auto&&auto.name].filter(Boolean).join(' · ')}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2600)}
// Einchecken: einmal pro Tag. Der Testknopf springt einen Tag weiter, damit man die Stufen ausprobieren kann.
function einchecken(test){const h=heute();if(!test&&ST.letzter===h)return;setTimeout(()=>ereignis('arbeit'));
  const gestern=ST.letzter&&(Date.parse(h)-Date.parse(ST.letzter)<=864e5*1.5);ST.serie=test||gestern?ST.serie+1:1;
  const lohn=WS.tageslohn(ST.tage,ST.serie);const autoStil=WS.KATALOG.filter(i=>ST.besitz[i.id]&&i.stilTag).reduce((s,i)=>s+i.stilTag,0);
  const vorher=WS.lohnStufe(ST.tage).titel;ST.tage++;ST.geld+=lohn;ST.stil+=autoStil;if(!test)ST.letzter=h;save();hud();
  const nach=WS.lohnStufe(ST.tage).titel;toast(nach!==vorher?`Beförderung: ${nach}. +${euro(lohn)}`:`Eingecheckt: +${euro(lohn)}${autoStil?` · Autos +${autoStil} Stil`:''}`);meinTag()}
function warteliste(id){const it=WS.KATALOG.find(i=>i.id===id);ST.warte=ST.warte||{};if(!it||ST.warte[id]!=null||ST.stil<(it.minStil||0))return;ST.warte[id]=ST.tage+it.warte;save();toast(`Du stehst auf der Warteliste für ${it.name}. Noch ${it.warte} Arbeitstage.`);offen&&zeigeEtage(offen)}
function verbrauchen(it){if(ST.geld<preisVon(it))return;if(it.id==='makeup'&&typeof UHR!=='undefined')ST.makeupBis=UHR.min+180;if(it.id==='balayage')ST.straehnen=1;setTimeout(()=>ereignis('kauf',{it}));ST.geld-=preisVon(it);ST.energie=Math.max(0,Math.min(100,(ST.energie??70)+(it.energie||0)));ST.stil+=it.stil||0;ST.follower=(ST.follower||0)+(it.follower||0);save();hud();
  toast([`${it.name}`,it.energie?`Energie ${it.energie>0?'+':''}${it.energie}`:'',it.follower?`Follower +${it.follower}`:'',it.stil?`Stil ${it.stil>0?'+':''}${it.stil}`:''].filter(Boolean).join(' · '));offen&&zeigeEtage(offen)}
// Admin-Konten (Martin) testen ohne Tagessperren und Wartelisten
const ADMIN_NAMEN=['@martintameh','@martin test 1','@martin test 2','@martin test1','@martin test2'];
/* Berlin (Martin, 19.11.2026): alles sofort frei, keine Wartezeiten, und jede Person bekommt einmalig 1 Mrd. € Startkapital */
const allesFrei=()=>true;
setInterval(()=>{if(typeof ST==='undefined'||ST.berlinKohle||!document.getElementById('start').hidden)return;ST.berlinKohle=1;ST.geld+=1e9;save();hud();if(typeof banner==='function')banner('💰 BERLIN','Alles ist freigeschaltet','+1 Mrd. €')},3000);
// Inzahlungnahme: kaufst du ein neues Boot oder einen neuen Jet, gibst du dein bisheriges in Zahlung und bekommst 50 % seines Preises angerechnet
const INZAHLUNG_KAT=['jacht','jet'];
const inzahlung=it=>INZAHLUNG_KAT.includes(it.kat)?WS.KATALOG.filter(i=>i.kat===it.kat&&ST.besitz[i.id]&&i.id!==it.id).reduce((s,i)=>s+Math.round(i.preis*.5),0):0;
function kaufen(id){const it0=WS.KATALOG.find(i=>i.id===id);if(it0&&it0.kat==='konsum')return verbrauchen(it0);const it=it0;const iz=it?inzahlung(it):0;if(it&&iz&&!ST.besitz[id]&&ST.geld+iz>=preisVon(it)){for(const a of WS.KATALOG.filter(i=>i.kat===it.kat&&ST.besitz[i.id]))delete ST.besitz[a.id];ST.geld+=iz;toast(`Altes ${it.kat==='jet'?'Flugzeug':'Boot'} in Zahlung gegeben: +${euro(iz)}`)}if(!it||ST.besitz[id]||ST.geld<preisVon(it)||(!allesFrei()&&ST.tage<(it.ab||0)))return;if(!allesFrei()&&it.warte&&!(ST.warte&&ST.warte[id]!=null&&ST.tage>=ST.warte[id]))return;setTimeout(()=>ereignis('kauf',{it}));
  ST.geld-=preisVon(it);ST.stil+=it.stil||0;ST.besitz[id]=1;if(it.kat==='tasche'&&typeof kaufFuerKollektion==='function')kaufFuerKollektion(id);if(it.farben)ST.outfit[id]=it.farben[0];if(it.look)ST.traegt=id;save();hud();toast(`${it.name} gekauft. +${it.stil||it.stilTag} Stil${it.stilTag?' pro Tag':''}`);offen&&zeigeEtage(offen)}
function farbe(id,col){ST.outfit[id]=col;save();hud();offen&&zeigeEtage(offen)}
function zeile(it){const d=document.createElement('div');d.className='row';const l=document.createElement('div');l.textContent=it.name;
  const sm=document.createElement('small');const pp=preisVon(it),pr=(pp%1?pp.toLocaleString('de-DE',{minimumFractionDigits:2})+' €':euro(pp))+(pp<it.preis?` statt ${euro(it.preis)}`:'');sm.textContent=it.kat==='konsum'?[it.preis?pr:'kostenlos',it.energie?`Energie ${it.energie>0?'+':''}${it.energie}`:'',it.follower?`Follower +${it.follower}`:'',it.stil?`Stil ${it.stil>0?'+':''}${it.stil}`:''].filter(Boolean).join(' · '):`${pr} · ${it.stilTag?'+'+it.stilTag+' Stil pro Tag':'+'+it.stil+' Stil'}${it.ab?` · ab ${it.ab} Arbeitstagen`:''}${it.warte?` · Warteliste ${it.warte} T.`:''}`;l.append(sm);
  if(ST.besitz[it.id]&&it.farben){const sw=document.createElement('div');sw.className='sw';for(const f of it.farben){const b=document.createElement('button');b.style.background=f;b.setAttribute('aria-label','Farbe wählen');b.setAttribute('aria-pressed',ST.outfit[it.id]===f);b.onclick=()=>farbe(it.id,f);sw.append(b)}l.append(sw)}
  if(it.kat==='schmuck'&&it.bild&&typeof schmuckBild==='function'){const bild=schmuckBild(it,58);bild.className='taschenbild';d.append(bild)}
  if(it.kollektion&&typeof taschenBild==='function'){const t=ALLE_TASCHEN.find(x=>x.id===it.id);if(t){const bild=taschenBild(t,58,true);bild.className='taschenbild';d.append(bild)}}
  d.append(l);
  if(ST.besitz[it.id]&&it.look){const b2=document.createElement('button');const an=ST.traegt===it.id;b2.textContent=an?'Trägst du':'Anziehen';b2.disabled=an;b2.onclick=()=>{ST.traegt=it.id;save();hud();karten();toast(`Du trägst jetzt ${it.name}`);offen&&zeigeEtage(offen)};d.append(b2)}
  else if(ST.besitz[it.id]&&it.kat!=='konsum'){const o=document.createElement('span');o.className='own';o.textContent='Gehört dir';d.append(o)}
  else{const b=document.createElement('button');const gesperrt=!allesFrei()&&ST.tage<(it.ab||0);const W_=allesFrei()?0:ST.warte&&ST.warte[it.id];
    if(it.warte&&!gesperrt&&W_==null){const zuWenig=ST.stil<(it.minStil||0);b.textContent=zuWenig?`ab ${it.minStil} Stil`:'Auf Warteliste';b.disabled=zuWenig;b.onclick=()=>warteliste(it.id)}
    else if(it.warte&&W_!=null&&ST.tage<W_){b.textContent=`Warteliste: noch ${W_-ST.tage} T.`;b.disabled=true}
    else{const iz=inzahlung(it);b.textContent=gesperrt?`ab Tag ${it.ab}`:ST.geld+iz<preisVon(it)?`fehlt ${euro(Math.ceil(preisVon(it)-ST.geld-iz))}`:iz?`Kaufen · altes in Zahlung −${euro(iz)}`:(it.warte?'Abholen':'Kaufen');b.disabled=gesperrt||ST.geld+iz<preisVon(it);b.onclick=()=>kaufen(it.id)}d.append(b)}
  return d}
let offen=null;
function meinTag(){offen=null;sel=null;const c=document.getElementById('card');c.hidden=false;document.getElementById('hint').hidden=true;document.getElementById('ct').textContent='Mein Tag';
  const k=WS.lohnStufe(ST.tage),n=WS.naechsteStufe(ST.tage);const cb=document.getElementById('cb');cb.replaceChildren();
  const p=document.createElement('p');p.textContent=`Du arbeitest als ${k.titel} im Fabrik Coworking. Jeder Arbeitstag zählt für die Karriere, jeder Tag am Stück erhöht den Lohn um 2 %, bis zu 30 %.`;
  const day=document.createElement('div');day.className='day';
  const box=(a,b)=>{const d=document.createElement('div');const bb=document.createElement('b');bb.textContent=b;d.append(bb,a);return d};
  day.append(box('Tageslohn heute',euro(WS.tageslohn(ST.tage,ST.serie+1))),box('Serie',`${ST.serie} Tage`),box('Arbeitstage',String(ST.tage)),box('Nächste Stufe',n?`${n.titel} in ${n.ab-ST.tage} T.`:'Höchste Stufe'));
  const b=document.createElement('button');b.className='big';const schon=ST.letzter===heute();b.textContent=schon?'Heute schon eingecheckt':'Bei der Arbeit einchecken';b.disabled=schon;b.onclick=()=>einchecken(false);
  const tg=document.createElement('button');tg.className='big test';tg.textContent='Test: +1,5 Mio. € gutschreiben';tg.onclick=()=>{ST.geld+=1500000;save();hud();toast('Test: 1,5 Mio. € gutgeschrieben')};cb.append(tg);
  const t=document.createElement('button');t.className='big test';t.textContent='Test: einen Tag vorspulen';t.onclick=()=>einchecken(true);
  cb.append(p,day,b,t)}
document.getElementById('bTag').onclick=meinTag;
