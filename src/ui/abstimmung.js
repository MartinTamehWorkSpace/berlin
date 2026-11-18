// Glow City · abstimmung.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Abstimmung: die Stadt entscheidet, was als Nächstes gebaut wird ----------
const VOTE_ZIEL=new Date(Date.now()+((7-new Date().getDay())%7||7)*864e5);VOTE_ZIEL.setHours(20,0,0,0);
const OPTIONEN=[['nagel','Nagelstudio „Glossy Tips“',1840],['pilates','Pilates-Studio am Wasser',1712],['sushi','Sushi-Bar auf dem Dach',1388],['juwel','Juwelier „Maison Or“',1205],['pool','Rooftop-Pool mit DJ',994]];
function abstimmung(){if(INNEN)return;const cb=panel('Abstimmung der Woche');ST.vote=ST.vote||{};const heute_=heute();const gewaehlt=ST.vote.tag===heute_?ST.vote.id:null;
  const p0=document.createElement('p');const rest=Math.max(0,VOTE_ZIEL-Date.now()),h=Math.floor(rest/36e5),d=Math.floor(h/24);p0.textContent=`Was kommt als Nächstes nach Glow City? Eine Stimme pro Tag. Gewonnen wird am Sonntag um 20 Uhr, noch ${d?d+' Tage ':''}${h%24} Std.`;
  const plus=Math.floor((Date.now()/36e5)%100);const st=OPTIONEN.map(([id,n,v],i)=>[id,n,v+plus*(5-i)+(ST.vote.zaehl&&ST.vote.zaehl[id]||0)]);const summe=st.reduce((a,x)=>a+x[2],0);
  const vo=document.createElement('div');vo.className='vo';
  st.sort((a,b)=>b[2]-a[2]).forEach(([id,n,v],i)=>{const b=document.createElement('button');if(id===gewaehlt)b.className='meins';b.disabled=!!gewaehlt;const pr=Math.round(v/summe*100);
    b.innerHTML=`<i style="width:${pr}%"></i><span><b></b><em style="font-style:normal">${pr} % · ${v.toLocaleString('de-DE')}</em></span>`;b.querySelector('b').textContent=(i===0?'Führt: ':'')+n+(id===gewaehlt?' · deine Stimme':'');
    b.onclick=()=>{setTimeout(()=>ereignis('vote'));ST.vote={tag:heute_,id,zaehl:Object.assign(ST.vote.zaehl||{},{[id]:((ST.vote.zaehl||{})[id]||0)+1})};ST.stil+=1;save();hud();toast('Stimme abgegeben. +1 Stil fürs Mitmachen');abstimmung()};vo.append(b)});
  const p1=document.createElement('p');p1.style.marginTop='8px';p1.textContent=gewaehlt?'Morgen kannst du wieder abstimmen. Teile die Abstimmung, damit deine Wahl gewinnt.':'Tipp: Wer jeden Tag abstimmt, bekommt Stil dazu.';
  cb.append(p0,vo,p1)}
document.getElementById('bVote').onclick=abstimmung;document.getElementById('bAufg').onclick=()=>aufgabenPanel();
// Fenster schließen; solange ein Fenster offen ist, macht der Chat Platz
// In einem Haus klappt × nur das Fenster ein: du bleibst drin, der Knopf „Menü“ holt es zurück. Verlassen geht über „Haus verlassen“.
document.getElementById('cardZu').onclick=()=>{document.getElementById('card').hidden=true;if(INNEN){innenMenue(true);return}offen=null};
function innenMenue(an){let m=document.getElementById('innenMenue');if(!m){m=document.createElement('button');m.id='innenMenue';m.className='innenmenue';m.textContent='🏠 Menü';m.onclick=()=>{if(INNEN){zeigeEtage(INNEN);document.getElementById('card').hidden=false}m.hidden=true};document.body.append(m)}m.hidden=!an}
setInterval(()=>{if(!INNEN){const m=document.getElementById('innenMenue');if(m)m.hidden=true}},1000);
new MutationObserver(()=>{const auf=!document.getElementById('card').hidden;document.getElementById('chat').style.visibility=auf?'hidden':''}).observe(document.getElementById('card'),{attributes:true,attributeFilter:['hidden']});
document.getElementById('bStadt').onclick=()=>{if(INNEN)verlassen();document.getElementById('card').hidden=true;offen=null;ZIEL={cx:wx(PLAZA.x+2,PLAZA.y+2),cy:wy(PLAZA.x+2,PLAZA.y+2,0)-60,z:(innerWidth<600?.8:1.15)*DPR}};
function zeige(hit){offen=hit;const cb=document.getElementById('cb');document.getElementById('ct').textContent=hit.title;
  const keys=[...new Set([...hit.pod.shops.map(s=>s[3]),...(hit.top?[hit.top]:[]),...(hit.tow&&hit.tow.kind==='res'&&!hit.top?['res']:[])])];
  cb.replaceChildren(...keys.flatMap(k=>{const m=BR[k];const h=document.createElement('h4');h.textContent=m.n;const p=document.createElement('p');p.textContent=m.t;
    if(VERKAUF[k]){const box=document.createElement('div');box.style.cssText='display:flex;flex-direction:column;gap:5px;margin-top:6px';box.append(...WS.KATALOG.filter(VERKAUF[k]).sort((a,b)=>a.rang-b.rang).map(zeile));return[h,p,box]}
    const ul=document.createElement('ul');ul.append(...m.fx.map(([a,b])=>{const li=document.createElement('li');li.append(a);const em=document.createElement('em');em.textContent=b;li.append(em);return li}));return[h,p,ul]}))}
