// Berlin City · innen.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Innenansicht: Haus wird bis aufs Erdgeschoss aufgeschnitten ----------
function etagen(b){const E=[{n:'Erdgeschoss',a:art(b),k:(b.pod.shops.map(s=>s[3]))}];
  // Berghain: zwei Raeume, Haupthalle und Darkroom hinter dem Vorhang
  if(E[0].a==='berghain'){E[0].n='Haupthalle';E[0].t='Tanzfläche, Theke, Dealer';
    E.push({n:'Darkroom',a:'darkroom',k:E[0].k,t:'Hinter dem Vorhang'});
    E.push({n:'Panorama Bar',a:'panorama',k:E[0].k,t:'Treppe hoch, Fenster nach Osten'});return E}
  if(!b.tow)return E;
  const hoch=b.tow.fl+1;if(b.top==='home')E.push({n:`${hoch}. Stock`,a:'home',k:['home'],t:'Deine Wohnung'});
  else if(b.top==='work')E.push({n:'5. Stock',a:'buero',k:['work'],t:'Dein Büro'});
  else if(b.top==='hotel'){E.push({n:'1. Stock',a:'mode',k:['designer'],t:'Designer-Etage'});E.push({n:`${hoch}. Stock`,a:'resto',k:['hotel'],t:'Rooftop-Bar'})}
  else if(b.tow.kind==='clinic')E.push({n:'2. Stock',a:'klinik',k:['klinik'],t:'Behandlungsräume'});
  else{const leute=(window.GLOW_NACHBARN?GLOW_NACHBARN.LEUTE:[]).filter(n=>n.wohnung.haus===b.title);
    if(leute.length)leute.forEach((n,i)=>E.push({n:`${Math.min(hoch,4+i*3)}. Stock`,a:'home',k:['res'],t:`Wohnung von ${n.name.split(' ')[0]}`,nachbar:n.id}));else E.push({n:`${Math.min(hoch,4)}. Stock`,a:'home',k:['res'],t:'Wohnung einer Nachbarin'})}return E}
function zeigeEtage(b){const E=etagen(b),e=E[b.stock||0];offen=b;const cb=document.getElementById('cb');
  zeige(Object.assign(Object.create(b),{pod:{shops:e.k.filter(k=>k!=='home'&&k!=='res'&&k!=='hotel'&&k!=='work').map(k=>['L',0,4,k])},top:e.k.find(k=>['home','res','hotel','work'].includes(k))||null,tow:null}));offen=b;
  document.getElementById('ct').textContent=`${b.title} · ${e.n}${e.t?' · '+e.t:''}`;
  if(e.k.includes('hotel')){const h=document.createElement('h4');h.textContent='Rooftop-Bar';const box=document.createElement('div');box.style.cssText='display:flex;flex-direction:column;gap:5px;margin-top:6px';box.append(...WS.KATALOG.filter(VERKAUF.hotel).map(zeile));cb.append(h,box)}
  if(e.a==='home'&&b.top==='home'){const hw=document.createElement('h4');hw.textContent='Einrichten';const bx=document.createElement('div');bx.style.cssText='display:flex;flex-direction:column;gap:5px;margin-top:6px';bx.append(...WS.KATALOG.filter(i=>i.kat==='wohnen').sort((a,c)=>a.rang-c.rang).map(zeile));cb.append(hw,bx);const sl=document.createElement('button');sl.className='big';sl.textContent='Schlafen: Energie auf 100';sl.onclick=()=>{ST.energie=100;save();toast('Ausgeschlafen. Energie 100');};cb.append(sl)}
  if(e.nachbar&&typeof nachbarZuHause==='function')nachbarZuHause(cb,e.nachbar);if(typeof partyBereich==='function')partyBereich(cb,b);if(typeof klubBereich==='function')klubBereich(cb,b);
  if(E.length>1){const h=document.createElement('h4');h.textContent=E[0].a==='berghain'?'Wohin im Club':'Aufzug';cb.append(h);E.forEach((x,i)=>{const bt=document.createElement('button');bt.className='big test';bt.style.marginTop='5px';bt.textContent=`${i===(b.stock||0)?'● ':''}${x.n}${x.t?' · '+x.t:''}`;bt.disabled=i===(b.stock||0);bt.onclick=()=>aufzug(b,i);cb.append(bt)})}
  const raus=document.createElement('button');raus.className='big test';raus.textContent='Haus verlassen';raus.onclick=verlassen;cb.append(raus)}
let AUFZUG=0;
function aufzug(b,i){const cl=etagen(b)[0].a==='berghain';AUFZUG=cl?0:1;toast(`${cl?'Du gehst in':'Aufzug fährt in'}: ${etagen(b)[i].n}`);setTimeout(()=>{b.stock=i;b.innen=innenLeute(b);ICH.x=b.x+2;ICH.y=b.y+3.1;zeigeEtage(b);AUFZUG=0},900)}
function betreten(b){if(b.meins==='boutique'){boutiqueAuf('laden');return}if(b.haupt){klinikAuf('praxis');return}if(typeof ortPanel==='function'&&ortPanel(b))return;setTimeout(()=>ereignis('betreten',{b}));INNEN=b;b.stock=0;ICH.x=b.x+2;ICH.y=b.y+3.1;ICH.idle=1;ICH.path=[];
  ZIEL={cx:wx(b.x+2,b.y+2),cy:wy(b.x+2,b.y+2,0)-20,z:Math.min(3.4,Math.max(2,innerWidth/420))*DPR};
  if(b.top==='home'){b.stock=etagen(b).length-1;toast('Aufzug fährt nach oben in deine Wohnung')}b.innen=innenLeute(b);const c=document.getElementById('card');c.hidden=false;document.getElementById('hint').hidden=true;zeigeEtage(b)}
function verlassen(){const b=INNEN;if(!b)return;INNEN=null;const[tx,ty]=tuer(b);ICH.x=tx;ICH.y=ty;ZIEL={cx:wx(tx,ty),cy:wy(tx,ty,0)-40,z:(innerWidth<600?1.1:1.6)*DPR};document.getElementById('card').hidden=true;offen=null}
const art=b=>{const k=b.top==='home'?'home':(b.pod.shops[0]||[])[3]||'res';return{prado:'mode',shan:'mode',zahra:'mode',doug:'beauty',star:'cafe',ross:'markt',dn:'markt',lid:'markt',mehr:'markt',sac:'taschen',motors:'autos',klinik:'klinik',lab:'klinik',mcf:'gym',borch:'resto',hug:'resto',riva:'resto',boot:'club',work:'buero',home:'home',tif:'juwel',seph:'mode',vic:'mode',lulu:'mode',spa:'klinik',salon:'klinik',apfel:'buero',nicky:'club',berg:'berghain',bout:'mode',jets:'buero',arena:'club'}[k]||'home'};
function innenLeute(b){const a=etagen(b)[b.stock||0].a,L=[];const e0=etagen(b)[b.stock||0];
  const team=CHAR_P.filter(p=>p.ort&&e0.k.includes(p.ort));team.forEach((p,i)=>{p.x=b.x+3.1-i*.7;p.y=b.y+.9+i*.25;p.idle=1;L.push(p)});const rolle={klinik:['Dr. Glatt','#ffffff',1],gym:['Trainer','#16171a',0],autos:['Verkäufer','#1d1e24',0],buero:['Kollegin','#3d405b',0],home:['',null,0],berg:['Türsteher','#0d0d0f',0],darkroom:['',null,0]}[a==='darkroom'?'darkroom':e0.k.includes('berg')?'berg':a]||['Verkäuferin','#16171a',0];
  if(rolle[0]&&!team.length){const st=human({});Object.assign(st,{x:b.x+3.1,y:b.y+.9,idle:1,top:rolle[1],leg:'#16171a',coat:rolle[2],star:1,name:rolle[0],sz:1.05});if(rolle[0]==='Türsteher'){st.klub=0;st.liste='club'}if(rolle[0]==='Dr. Glatt'){st.hair='#cfc9c0';st.hs=3}L.push(st)}
  // Bei Nachbarn zu Hause: die Person selbst und zwei Gäste, je nach Tag eine andere Szene
  if(e0.nachbar){const echt=P.find(p=>p.nachbarId===e0.nachbar);if(echt){const n=human({});Object.assign(n,{x:b.x+2.4,y:b.y+1.6,idle:1,skin:echt.skin,hair:echt.hair,top:echt.top,leg:echt.leg,c1:echt.c1,w:echt.w,dress:echt.dress,frisur:echt.frisur,name:echt.name,sz:1.05});L.push(n)}
    for(let i=0;i<2;i++){const k=human({});Object.assign(k,{x:b.x+1+i*1.3,y:b.y+2.6,idle:1,ph:i+3});L.push(k)}}
  if(a==='home'&&typeof partyGaeste==='function')partyGaeste(b,b.stock||0,L);
  if(a==='darkroom'){const platz=[[.6,.75],[.62,1.9],[.55,3.02],[.95,3.1],[1.75,.62],[1.95,.74],[2.05,3.3],[2.22,3.42],[3.3,3.3],[3.42,3.4],[2.6,1.8],[2.78,1.95],[2.95,2.1],[1.5,2.45],[1.68,2.57],[1.3,1.6],[3.5,1.2],[2.3,2.8]];
    platz.forEach(([u,v],i)=>{const k=human({});const haut=['#7d6552','#8a7465','#6b5b50','#9b8068','#5d4c42'][i%5];
      // Im Darkroom traegt keiner was, hoechstens Riemen
      Object.assign(k,{x:b.x+u,y:b.y+v,idle:1,ph:i*2.1,skin:haut,top:haut,leg:haut,c1:haut,c2:haut,hair:'#14141a',dress:0,coat:0,bag:null,bagK:null,
        outfit:i%6===0?'leder':null,muster:i%6===0?'harness':null,w:i%3?1:0,sz:.96,nackt:1,
        klub:i%KLUB_DARK.length,liste:'dark',paar:[3,5,7,9,12,14].includes(i)?1:0,takt:i});L.push(k)});return L}
  if(a==='panorama'){const sitz=[[.6,1.2],[.6,1.9],[.65,2.6],[1.5,3.3],[2.3,3.35],[3.1,3.3],[2.6,.7],[3.2,1.5],[1.3,.8],[2.0,1.6],[1.0,2.4],[2.9,2.5]];
    sitz.forEach(([u,v],i)=>{const k=human({});Object.assign(k,{x:b.x+u,y:b.y+v,idle:1,ph:i*1.3,top:['#15151b','#2a2a32','#3a2a2a','#1d2430'][i%4],leg:'#15151b',dress:i%4===0?1:0,w:i%3?1:0,hs:i%4,sz:.95+Math.random()*.12,klub:i%KLUB_PANO.length,liste:'pano'});L.push(k)});
    const bk=human({});Object.assign(bk,{x:b.x+3.4,y:b.y+.8,idle:1,ph:2,top:'#0f0f12',leg:'#0f0f12',w:1,star:1,name:'Barfrau',sz:1.04,klub:0,liste:'pano'});L.push(bk);return L}
  const berg=e0.k.includes('berg');
  if(berg){// 44 Leute auf der Tanzflaeche, die meisten Frauen, alle in Schwarz
    for(let i=0;i<44;i++){const k=human({});Object.assign(k,{x:b.x+.3+(i%8)*.46+Math.random()*.16,y:b.y+.5+Math.floor(i/8)*.42+Math.random()*.16,idle:1,ph:i*1.7,
      top:['#0d0d0f','#1b1b1f','#2a2a2e','#3a0c0c'][i%4],leg:'#0d0d0f',dress:i%5===0?1:0,w:i%4?1:0,hs:i%4,tanzt:1,sz:.88+Math.random()*.2,
      klub:2+(i%(KLUB_LEUTE.length-2)),liste:'club'});L.push(k)}
    // Swinger-Ecke vorne links: drei Paare auf dem Podest, dicht beieinander
    [[.85,3.05],[1.25,3.4],[1.62,3.12]].forEach(([u,v],i)=>{for(let j=0;j<2;j++){const k=human({});Object.assign(k,{x:b.x+u+j*.16,y:b.y+v+j*.12,idle:1,ph:i*2+j,
      top:'#0b0b0d',leg:'#0b0b0d',skin:j?'#8a6e5c':'#c69a7c',hair:'#0b0b0d',dress:0,w:j,sz:.97,paar:1,takt:i,klub:2+((i+5)%(KLUB_LEUTE.length-2)),liste:'club'});L.push(k)}});
    const dl=human({});Object.assign(dl,{x:b.x+3.45,y:b.y+3.6,idle:1,ph:3,top:'#171a1f',leg:'#15151a',coat:1,dress:0,w:0,star:1,name:'Dealer',sz:1.05,klub:1,liste:'club'});L.push(dl);return L}
  for(let i=0;i<(a==='home'?0:3);i++){const k=human({});Object.assign(k,{x:b.x+.8+i*1.1,y:b.y+2+(i%2)*.8,idle:1,ph:i});if(i===1)k.bagK=['lady','speedi','birkinn'][Math.floor(Math.random()*3)];L.push(k)}
  return L}
function kiste(x,y,w,d,h,c,z0=0){const f={x,y,w,d};fL(f,0,w,z0,z0+h,sh(c,.92));fR(f,0,d,z0,z0+h,sh(c,.72));top4(x,y,w,d,z0+h,sh(c,1.08))}
function einrichtung(b){const a=etagen(b)[b.stock||0].a,x=b.x,y=b.y,O=[];const add=(t,ox,oy,f)=>O.push({x:x+ox,y:y+oy,f});
  const K=(ox,oy,w,d,h,c,z)=>add('k',ox+w/2,oy+d/2,()=>kiste(x+ox,y+oy,w,d,h,c,z));
  if(a==='mode'){for(let i=0;i<3;i++){K(.5,.6+i*1.1,2.2,.1,22,'#c9c4bc');for(let j=0;j<6;j++)K(.6+j*.34,.55+i*1.1,.22,.2,14,['#16171a','#f2eee8','#c9b48a','#8c2f39','#e8d5c4','#3d405b'][(i+j)%6],6)}
    K(2.9,.3,.9,.5,16,'#1b1b1d');[[3.3,2.4],[3.4,3.4]].forEach(([u,v],i)=>{const m=human({});Object.assign(m,{x:x+u,y:y+v,idle:1,skin:'#e9e4dc',hair:'#e9e4dc',hs:3,dress:1,top:['#16171a','#e8d5c4'][i],leg:'#e9e4dc'});add('p',u,v,()=>person(m))})}
  else if(a==='juwel'){for(let i=0;i<3;i++){K(.5+i*1.1,.6,.8,.5,13,'#e8f4f3');K(.55+i*1.1,.65,.7,.4,3,'#81d8d0',13);add('g',.9+i*1.1,.85,()=>{const[px,py]=pt(x+.9+i*1.1,y+.85,17);g.fillStyle=`rgba(255,215,120,${.6+.4*Math.sin(T*5+i)})`;g.beginPath();g.arc(px,py,2.2*Z,0,7);g.fill()})}K(.5,2.6,2.6,.5,13,'#e8f4f3');K(3.1,3,.6,.6,22,'#4b5d4f')}
  else if(a==='taschen'){const ks=(typeof ALLE_TASCHEN!=='undefined'?ALLE_TASCHEN.map(t=>t.id):['speedi','jackie','lady','flap','birkinn','baguetta']).slice(0,24);
    for(let r=0;r<3;r++){K(.35,.45+r*1.15,3.3,.32,20,'#f4efe6');K(.35,.45+r*1.15,3.3,.32,.6,'#b59a6a',9.5)}
    ks.forEach((k,i)=>{const r=Math.floor(i/8),c=i%8,u=.55+c*.4,v=.55+r*1.15,z=i%2?10.1:.6;add('t',u,v+.1,()=>{const t=FG.TASCHE[k];if(!t)return;const[px,py]=pt(x+u,y+v+.12,z+(i%2?0:20));FG.tasche(g,t,px,py-6*Z,Z*.75)})});K(3.1,3.2,.7,.45,16,'#2a2218')}
  else if(a==='autos'){[['3',.4,.6],['4',.4,2.2]].forEach(([l,u,v])=>add('a',u+1.2,v+.4,()=>{const im=SPR[l]&&SPR[l]['90'];if(im&&im.naturalWidth){const[px,py]=pt(x+u+1.2,y+v+.4,0);const sc=.14*Z;g.drawImage(im,px-im.naturalWidth*sc/2,py-im.naturalHeight*sc/2,im.naturalWidth*sc,im.naturalHeight*sc)}}));K(3,.3,.8,.5,15,'#e8eef5')}
  else if(a==='klinik'){[[.5,.6],[.5,2.2]].forEach(([u,v])=>{K(u,v,1.5,.6,9,'#f4f6f7');K(u+1.5,v,.3,.6,16,'#d9e3e8')});K(2.9,.3,.9,.6,16,'#ffffff');K(3.3,3.2,.4,.4,20,'#4b5d4f')}
  else if(a==='gym'){for(let i=0;i<3;i++)for(let j=0;j<2;j++){K(.5+i*1.1,.6+j*1.6,.7,.4,14,'#16171a');K(.5+i*1.1,.6+j*1.6,.7,.08,3,'#ffd400',14)}K(.4,3.4,2.8,.4,1,'#3a3b40')}
  else if(a==='markt'){for(let i=0;i<3;i++){K(.4,.5+i*1.1,2.6,.35,24,'#e9e6e0');for(let j=0;j<8;j++)K(.45+j*.32,.52+i*1.1,.22,.12,6,['#c8102e','#1f4fa0','#f2c14e','#2e8b57'][(i+j)%4],18)}K(3,2.8,.8,.6,14,'#1b1b1d')}
  else if(a==='resto'||a==='cafe'){for(let i=0;i<2;i++)for(let j=0;j<2;j++){K(.6+i*1.5,.8+j*1.4,.6,.6,11,'#f4f1ea');K(.45+i*1.5,.95+j*1.4,.12,.3,7,'#7a5236');K(1.25+i*1.5,.95+j*1.4,.12,.3,7,'#7a5236')}K(.3,.25,3.4,.45,16,'#2a2218')}
  else if(a==='club'){for(let i=0;i<4;i++)for(let j=0;j<4;j++)add('f',.4+i*.8,.4+j*.8,()=>top4(x+.4+i*.8,y+.4+j*.8,.75,.75,.5,`hsl(${(i*40+j*70+T*90)%360},80%,${55+15*Math.sin(T*6+i+j)}%)`));K(3.1,.3,.7,.9,16,'#15161a')}
  else if(a==='berghain'){
    // Betonplatten, dunkel. Alle paar Takte ein harter weisser Blitz vom Strobo
    for(let i=0;i<5;i++)for(let j=0;j<5;j++)add('f',.2+i*.78,.2+j*.78,()=>{const bl=Math.sin(T*9+(i+j)*.25)>.88?.45:0;top4(x+.2+i*.78,y+.2+j*.78,.74,.74,.35,`rgba(214,219,228,${.045+bl})`)});
    // Vier Stahlstuetzen, die durch die ganze Halle gehen
    for(const[u,v]of[[1.15,1.15],[2.85,1.15],[1.15,2.85],[2.85,2.85]])K(u-.13,v-.13,.26,.26,46,'#6e6b66');
    // DJ-Kanzel hinten, links und rechts davon je ein Boxenstapel
    K(1.5,.22,1,.5,15,'#0f0f12');K(1.63,.3,.74,.34,1.6,'#2a2a30',15);
    K(.42,.22,.66,.62,31,'#0b0b0d');K(2.92,.22,.66,.62,31,'#0b0b0d');
    for(let k2=0;k2<4;k2++){K(.47,.27,.56,.5,.4,'#1d1d22',4+k2*7);K(2.97,.27,.56,.5,.4,'#1d1d22',4+k2*7)}
    // Rote Roehren ueber der Kanzel
    add('g',2,.21,()=>{for(let i=0;i<3;i++){const[px,py]=pt(x+1.2+i*.8,y+.21,41);g.fillStyle=`rgba(255,62,42,${.34+.22*Math.sin(T*2+i)})`;g.fillRect(px-7*Z,py,14*Z,1.6*Z)}});
    // Stahltheke rechts, Flaschen drauf
    K(3.18,1.4,.52,1.9,13,'#56565a');K(3.18,1.4,.52,1.9,.28,'#8e8e92',13);
    for(let i=0;i<6;i++)K(3.3,1.55+i*.3,.14,.14,4,'#2f3a33',13.3);
    // Darkroom: schwarzer Vorhang in der Ecke, dahinter glimmt es rot
    K(.22,3.05,1.6,.1,40,'#0a0a0c');K(1.78,3.05,.1,.95,40,'#0a0a0c');
    add('g',.9,3.4,()=>{const[px,py]=pt(x+.9,y+3.45,13);g.fillStyle=`rgba(255,42,30,${.16+.11*Math.sin(T*1.3)})`;g.beginPath();g.arc(px,py,17*Z,0,7);g.fill()});
    // Hinter dem Vorhang zwei Schatten im Dunkeln, durch den Schlitz nur zu erahnen
    K(.86,.95,.14,1.25,.26,'#4a4a4e',38);K(.9,1.0,.1,.5,34,'#08080a');K(.9,1.72,.1,.46,34,'#08080a');
    const SCH=[human({}),human({})];SCH.forEach((m,i)=>Object.assign(m,{x:x+.4+i*.14,y:y+1.52+i*.1,idle:1,ph:i*2,top:'#0b0b0d',leg:'#0b0b0d',dress:0,skin:'#2b2521',hair:'#0b0b0d',sz:.98}));
    SCH.forEach((m,i)=>add('p',.4+i*.14,1.52+i*.1,()=>{const d=Math.sin(T*2.4)*.07*(i?1:-1);m.y+=d;person(m);m.y-=d}));
    add('g',.45,1.55,()=>{const[px,py]=pt(x+.45,y+1.55,10);g.fillStyle=`rgba(255,42,30,${.1+.06*Math.sin(T*1.1)})`;g.beginPath();g.arc(px,py,13*Z,0,7);g.fill()});
    // Andreaskreuz an der linken Wand, Fesseln an den vier Enden
    add('g',.04,2.6,()=>{poly([pt(x,y+2.4,6),pt(x,y+2.54,6),pt(x,y+3.3,34),pt(x,y+3.16,34)],'#6b6864');poly([pt(x,y+3.16,6),pt(x,y+3.3,6),pt(x,y+2.54,34),pt(x,y+2.4,34)],'#57544f');
      for(const[v,z]of[[2.47,7],[3.23,7],[2.47,32],[3.23,32]])poly([pt(x,y+v-.07,z),pt(x,y+v+.07,z),pt(x,y+v+.07,z+2),pt(x,y+v-.07,z+2)],'#b9b2a6')});
    // Swinger-Ecke vorne links: Podest mit Matten, niedriges Gelaender, rotes Licht
    K(.6,2.85,1.5,1.05,2.4,'#1a171c');K(.7,2.95,1.3,.85,.5,'#2a2228',2.4);
    K(.6,2.85,.08,1.05,7,'#46433f');K(2.02,2.85,.08,1.05,7,'#46433f');K(.6,3.82,1.5,.08,7,'#46433f');
    add('g',1.35,3.28,()=>{const[px,py]=pt(x+1.35,y+3.3,8);g.fillStyle=`rgba(214,38,54,${.13+.07*Math.sin(T*1.2)})`;g.beginPath();g.arc(px,py,21*Z,0,7);g.fill()});
    // Kaefig vorne rechts, einer steht drin
    for(const[u,v]of[[2.82,3.08],[3.66,3.08],[2.82,3.78],[3.66,3.78]])K(u,v,.09,.09,25,'#55524e');
    for(let i=0;i<5;i++)K(2.82,3.08+i*.175,.93,.03,.06,'#4a4743',4+i*4.4);
    add('k',3.24,3.42,()=>top4(x+2.82,y+3.08,.93,.79,25,'#3d3a37'));
    const KF=human({});Object.assign(KF,{x:x+3.24,y:y+3.42,idle:1,ph:5,top:'#0d0d10',leg:'#0d0d10',dress:0,skin:'#3a322c'});add('p',3.24,3.4,()=>person(KF));
    // Ketten von der Decke ueber der Tanzflaeche
    add('g',1.1,1.1,()=>{for(let i=0;i<4;i++){const[ax,ay]=pt(x+1.1+i*.2,y+1.1,48),[bx2,by2]=pt(x+1.1+i*.2,y+1.1,24+2*Math.sin(T*1.4+i));g.strokeStyle='rgba(150,148,142,.55)';g.lineWidth=.8*Z;g.beginPath();g.moveTo(ax,ay);g.lineTo(bx2,by2);g.stroke()}});
    // Zwei in Lederharnisch an der Theke
    [[2.55,2.35],[2.78,2.6]].forEach(([u,v],i)=>{const m=human({});Object.assign(m,{x:x+u,y:y+v,idle:1,ph:i*3,top:'#0a0a0c',leg:'#0a0a0c',dress:0,skin:'#d6b79c'});
      add('p',u,v,()=>{person(m);const[px,py]=pt(x+u,y+v,13),[qx,qy]=pt(x+u,y+v,18);g.strokeStyle='rgba(226,229,236,.5)';g.lineWidth=.9*Z;g.beginPath();g.moveTo(px-2.6*Z,py);g.lineTo(qx+2.6*Z,qy);g.moveTo(px+2.6*Z,py);g.lineTo(qx-2.6*Z,qy);g.stroke()})});
    // In der Ecke beugen sich zwei ueber einen Stahltisch und spielen mit Mehl
    K(2.38,.96,.82,.44,9,'#4e4b47');
    add('g',2.79,1.03,()=>{const[px,py]=pt(x+2.79,y+1.18,9.3);g.fillStyle='rgba(248,250,255,.85)';for(let i=0;i<3;i++)g.fillRect(px-9*Z+i*5.5*Z,py-2*Z,1.3*Z,5*Z);g.fillStyle=`rgba(248,250,255,${.35+.15*Math.sin(T*1.7)})`;g.beginPath();g.arc(px+8*Z,py-1*Z,2.6*Z,0,7);g.fill()});
    [[2.48,1.44],[3.04,1.44]].forEach(([u,v],i)=>{const m=human({});Object.assign(m,{x:x+u,y:y+v,idle:1,ph:i*4,top:'#101016',leg:'#101016',dress:0});
      add('p',u,v,()=>{const d=Math.max(0,Math.sin(T*1.6+i*2.2))*.09;m.y-=d;person(m);m.y+=d})});
    // Nebel zieht knapp ueber dem Boden durch
    add('f',2,2.05,()=>{for(let i=0;i<3;i++){const[px,py]=pt(x+1+i*1.05,y+1.7+((T*.18+i*.5)%2.1),2);g.fillStyle='rgba(198,204,214,.065)';g.beginPath();g.ellipse(px,py,27*Z,7*Z,0,0,7);g.fill()}})}
  else if(a==='darkroom'){
    // Keine Deko, nur Geraet: Trennwaende, Gloryhole-Wand, Fickbank, Andreaskreuz, Kaefig, Sling, Haken mit Werkzeug, Wanne, Gully
    K(.18,.4,.14,3.2,34,'#08080a');K(2.0,.26,1.9,.12,34,'#08080a');
    // Gloryhole-Wand quer durch den Raum, drei Loecher
    K(1.1,1.95,1.9,.12,30,'#0b0b0e');
    for(let i=0;i<3;i++)add('g',1.35+i*.55,1.98,()=>{const[px,py]=pt(x+1.35+i*.55,y+1.98,13);g.fillStyle='#000';g.beginPath();g.ellipse(px,py,3.2*Z,4.2*Z,0,0,7);g.fill();g.strokeStyle='rgba(150,146,140,.5)';g.lineWidth=.5*Z;g.stroke()});
    // Nischen mit Matratzen links
    for(let i=0;i<3;i++){K(.3,.5+i*1.1,.6,.82,5,'#141318');K(.3,.5+i*1.1,.6,.1,13,'#1d1a20')}
    // Fickbank vorne links: gepolstert, Kniestuetzen, Fesseln
    K(.55,3.0,1.0,.5,8,'#1c1a1f');K(.55,3.0,1.0,.5,.22,'#2b2229',8);K(.55,3.5,.14,.14,5,'#46433f');K(1.41,3.5,.14,.14,5,'#46433f');
    // Andreaskreuz an der hinteren Wand
    add('g',.05,.9,()=>{poly([pt(x,y+.7,6),pt(x,y+.84,6),pt(x,y+1.6,34),pt(x,y+1.46,34)],'#55524d');poly([pt(x,y+1.46,6),pt(x,y+1.6,6),pt(x,y+.84,34),pt(x,y+.7,34)],'#46433f');
      for(const[v,z]of[[.77,7],[1.53,7],[.77,32],[1.53,32]])poly([pt(x,y+v-.07,z),pt(x,y+v+.07,z),pt(x,y+v+.07,z+2),pt(x,y+v-.07,z+2)],'#b9b2a6')});
    // Sling an vier Ketten
    K(2.3,1.5,.12,.12,28,'#46433f');K(3.3,1.5,.12,.12,28,'#46433f');K(2.3,2.4,.12,.12,28,'#46433f');K(3.3,2.4,.12,.12,28,'#46433f');
    K(2.44,1.64,.86,.76,.2,'#201d1b',12);
    add('g',2.85,2.0,()=>{for(const[u,v]of[[2.36,1.56],[3.36,1.56],[2.36,2.46],[3.36,2.46]]){const[ax,ay]=pt(x+u,y+v,28),[bx2,by2]=pt(x+u,y+v,12.3);g.strokeStyle='rgba(150,148,142,.5)';g.lineWidth=.7*Z;g.beginPath();g.moveTo(ax,ay);g.lineTo(bx2,by2);g.stroke()}});
    // Kaefig vorne rechts, Gitter und einer drin
    for(const[u,v]of[[2.85,3.05],[3.7,3.05],[2.85,3.8],[3.7,3.8]])K(u,v,.08,.08,24,'#4f4c48');
    for(let i=0;i<5;i++)K(2.85,3.05+i*.19,.93,.03,.05,'#46433f',4+i*4.2);
    add('k',3.28,3.4,()=>top4(x+2.85,y+3.05,.93,.83,24,'#35322f'));
    // Wandhaken mit Werkzeug neben dem Kreuz
    K(1.3,.3,.9,.1,22,'#0e0e11');
    add('g',1.75,.33,()=>{for(let i=0;i<5;i++){const[px,py]=pt(x+1.4+i*.17,y+.33,21);g.strokeStyle='rgba(120,116,110,.75)';g.lineWidth=.55*Z;g.beginPath();g.moveTo(px,py);g.lineTo(px+(i%2?1.2:-1.2)*Z,py+(5+i)*Z);g.stroke()}});
    // Wanne und Gully im Boden
    K(2.5,.45,1.1,.52,6,'#44484b');K(2.56,.5,.98,.42,.3,'#101314',5.6);
    add('f',2.0,2.9,()=>{const[px,py]=pt(x+2.0,y+2.9,.2);g.fillStyle='#17181a';g.beginPath();g.ellipse(px,py,5*Z,2.6*Z,0,0,7);g.fill();g.strokeStyle='rgba(120,120,124,.5)';g.lineWidth=.35*Z;for(let i=-2;i<3;i++){g.beginPath();g.moveTo(px-4*Z,py+i*Z);g.lineTo(px+4*Z,py+i*Z);g.stroke()}});
    // Licht: drei rote Funzeln und eine Lampe, die flackert
    for(const[u,v]of[[.62,.34],[3.3,.6],[1.25,3.5]])add('g',u,v,()=>{const[px,py]=pt(x+u,y+v,24);g.fillStyle='rgba(190,26,16,.12)';g.beginPath();g.arc(px,py,13*Z,0,7);g.fill();g.fillStyle=`rgba(232,58,38,${.4+.2*Math.sin(T*1.5+u)})`;g.beginPath();g.arc(px,py,2.4*Z,0,7);g.fill()});
    add('g',3.6,1.1,()=>{const an=Math.sin(T*7)>-.3?1:0;if(!an)return;const[px,py]=pt(x+3.6,y+1.1,26);g.fillStyle='rgba(226,214,190,.5)';g.beginPath();g.arc(px,py,1.8*Z,0,7);g.fill();g.fillStyle='rgba(226,214,190,.07)';g.beginPath();g.arc(px,py,16*Z,0,7);g.fill()});
    // Nebel und Dampf bleiben in Bodennaehe haengen
    add('f',2.0,2.2,()=>{for(let i=0;i<4;i++){const[px,py]=pt(x+.8+i*.85,y+1.6+((T*.14+i*.5)%2.3),1.5);g.fillStyle='rgba(170,174,184,.05)';g.beginPath();g.ellipse(px,py,24*Z,6*Z,0,0,7);g.fill()}})}
  else if(a==='panorama'){
    // Lange Theke, Hocker, niedrige Baenke an der Fensterfront, Rauch im Gegenlicht
    K(2.3,.3,1.5,.5,13,'#4e4942');K(2.3,.3,1.5,.5,.3,'#8d8577',13);
    for(let i=0;i<4;i++)K(2.45+i*.36,.9,.26,.26,9,'#2a2722');
    for(let i=0;i<3;i++){K(.3,1.0+i*1.0,.5,.78,5,'#3a332c');K(.3,1.0+i*1.0,.5,.12,11,'#473e35')}
    for(let i=0;i<3;i++)K(1.25+i*.85,3.3,.68,.5,5,'#3a332c');
    K(1.35,1.65,1.25,.95,3.4,'#2f2a24');
    for(const[u,v]of[[.95,.45],[3.55,2.95]])K(u,v,.32,.32,24,'#564f45');
    add('g',2.0,2.1,()=>{for(let i=0;i<5;i++){const[px,py]=pt(x+1.4+i*.3,y+2.1,18+((T*6+i*9)%26));g.fillStyle='rgba(226,214,192,.11)';g.beginPath();g.arc(px,py,2.4*Z,0,7);g.fill()}})}
  else if(a==='buero'){for(let i=0;i<2;i++)for(let j=0;j<3;j++){K(.5+i*1.6,.5+j*1.1,1.1,.5,11,'#f4f1ea');K(.7+i*1.6,.55+j*1.1,.5,.06,7,'#1d2a36',11)}}
  else if(b.top==='home'){const own=WS.KATALOG.filter(i=>i.kat==='wohnen'&&ST.besitz[i.id]);if(!own.some(i=>i.id==='w-bett'))K(2.4,.4,1.4,1.6,6,'#d9d2c8');if(!own.some(i=>i.id==='w-sofa'))K(.4,2.6,1.6,.6,6,'#9a9aa2');
    for(const i of own){if(!i.platz)continue;const[u,v,w,d,h,z]=i.platz;K(u,v,w,d,h,i.farbe,z||0);if(i.id==='w-bett'){K(u,v,w,.12,24,'#d8c39a');K(u+w-.08,v,.08,d,24,'#d8c39a');K(u+.1,v+.2,w-.2,.3,3,'#ff7eb6',h)}if(i.id==='w-sofa')K(u,v,w,.18,13,i.farbe);if(i.id==='w-bar')add('g',u+.25,v+.4,()=>{const[px,py]=pt(x+u+.25,y+v+.4,16);g.drawImage(glut('#ffd166'),px-8*Z,py-8*Z,16*Z,16*Z)});if(i.id==='w-aquarium')add('f',u,v,()=>{for(let k=0;k<5;k++){const[px,py]=pt(x+u+.06,y+v+.2+((T*.3+k*.3)%1.4),8+k*3);g.fillStyle=['#ffd166','#ff7eb6','#7ef7ff'][k%3];g.fillRect(px,py,3*Z,1.5*Z)}})}}
  else{K(.4,.4,1.6,2.1,8,'#f2eee8');K(.4,.4,1.6,.25,16,'#c9b48a');K(2.4,.4,1.4,.6,9,'#8a8f96');K(2.6,2,.9,.9,7,'#c9b48a');K(3.4,3.3,.35,.35,22,'#4b5d4f')}
  if(typeof partyEinrichtung==='function')partyEinrichtung(b,x,y,add,K);
  return O}
function innen(b){const x=b.x,y=b.y;const ee=etagen(b)[b.stock||0];const k=ee.k.find(v=>v!=='res')||(ee.a==='home'?'home':null);const DARK=ee.a==='darkroom',PANO=ee.a==='panorama',BERG=k==='berg'&&!DARK&&!PANO,T=performance.now()/1000;const WH=BERG?84:PANO?62:58;
  /* Berghain: Beton, Dunkelheit, Tanzfläche im Takt (128 BPM), rote Leuchtbänder, Stroboskop */
  const PAL=PANO?['#3b3934','#343029','#55504a','#443f39','#e8b26a','#bb7f3f']:DARK?['#09090b','#0c0c0e','#121214','#0e0e10','#8c1008','#5e0b05']:BERG?['#16161a','#1e1e23','#2c2b2f','#232226','#ff3b2f','#b8261d']:['#efe6dc','#e6dbcf','#f4efe8','#dcd3c8','#ff7eb6','#e0609c'];const takt=Math.floor(T*128/60);
  top4(x,y,4,4,0,PAL[0]);for(let i=0;i<4;i++)for(let j=0;j<4;j++){if((i+j)%2)top4(x+i,y+j,1,1,0,PAL[1]);if(BERG&&(i*7+j*3+takt)%5===0)top4(x+i+.05,y+j+.05,.9,.9,0,['rgba(255,59,47,.5)','rgba(255,18,10,.34)','rgba(240,244,250,.18)'][(i+j+takt)%3])}
  poly([pt(x,y,0),pt(x+4,y,0),pt(x+4,y,WH),pt(x,y,WH)],PAL[2]);poly([pt(x,y,0),pt(x,y+4,0),pt(x,y+4,WH),pt(x,y,WH)],PAL[3]);
  poly([pt(x,y,WH-6),pt(x+4,y,WH-6),pt(x+4,y,WH),pt(x,y,WH)],PAL[4]);poly([pt(x,y,WH-6),pt(x,y+4,WH-6),pt(x,y+4,WH),pt(x,y,WH)],PAL[5]);
  if(BERG){for(let i=0;i<4;i++){poly([pt(x+.4+i,y,10),pt(x+.6+i,y,10),pt(x+.6+i,y,WH-8),pt(x+.4+i,y,WH-8)],'rgba(255,59,47,'+(.25+.25*Math.sin(T*6+i))+')')}if(takt%8<1)poly([pt(x,y,0),pt(x+4,y,0),pt(x+4,y+4,0),pt(x,y+4,0)],'rgba(255,255,255,.12)')}
  if(PANO){// Fensterfront nach Osten, Sonntagmorgen
    for(let i=0;i<4;i++){const u=x+.3+i*.95;poly([pt(u,y,16),pt(u+.8,y,16),pt(u+.8,y,52),pt(u,y,52)],'rgba(255,206,140,.3)');poly([pt(u+.38,y,16),pt(u+.42,y,16),pt(u+.42,y,52),pt(u+.38,y,52)],'#51493f')}
    for(let i=0;i<3;i++){const v=y+.9+i*1.05;poly([pt(x,v,16),pt(x,v+.8,16),pt(x,v+.8,52),pt(x,v,52)],'rgba(255,196,124,.22)')}
    const[sx,sy]=pt(x+1.6,y+.2,34);const gr3=g.createRadialGradient(sx,sy,2,sx,sy,90*Z);gr3.addColorStop(0,'rgba(255,196,120,.3)');gr3.addColorStop(1,'rgba(255,196,120,0)');g.fillStyle=gr3;g.beginPath();g.arc(sx,sy,90*Z,0,7);g.fill()}
  if(BERG){for(let i=1;i<8;i++){poly([pt(x+i*.5,y,0),pt(x+i*.5+.03,y,0),pt(x+i*.5+.03,y,WH),pt(x+i*.5,y,WH)],'rgba(0,0,0,.22)');poly([pt(x,y+i*.5,0),pt(x,y+i*.5+.03,0),pt(x,y+i*.5+.03,WH),pt(x,y+i*.5,WH)],'rgba(0,0,0,.22)')}
    for(let i=0;i<4;i++){const u=x+.45+i*.9;poly([pt(u,y,26),pt(u+.52,y,26),pt(u+.52,y,50),pt(u,y,50)],'rgba(168,186,205,.15)');poly([pt(u+.24,y,26),pt(u+.28,y,26),pt(u+.28,y,50),pt(u+.24,y,50)],'#4a4845')}
    for(let i=0;i<3;i++){const v=y+1.4+i*.9;poly([pt(x,v,26),pt(x,v+.52,26),pt(x,v+.52,50),pt(x,v,50)],'rgba(150,168,188,.11)')}}
  if(etagen(b).length>1){poly([pt(x,y+2.9,0),pt(x,y+3.7,0),pt(x,y+3.7,34),pt(x,y+2.9,34)],'#9aa3ad');poly([pt(x,y+3.28,0),pt(x,y+3.32,0),pt(x,y+3.32,34),pt(x,y+3.28,34)],'#5a636d');poly([pt(x,y+3.1,38),pt(x,y+3.5,38),pt(x,y+3.5,42),pt(x,y+3.1,42)],AUFZUG?'#ff4fa3':'#2fe0d2')}
  if(k&&!BERG){const[cx,cy]=pt(x+2,y,WH-20);const s=Math.min(Z/DPR,2)*DPR;g.setTransform(s*.9,s*.45,0,s,cx,cy);brand(k,120,22);g.setTransform(1,0,0,1,0,0)}
  if(DARK){const[gx,gy]=pt(x+2,y+2,6);const gr2=g.createRadialGradient(gx,gy,2,gx,gy,70*Z);gr2.addColorStop(0,'rgba(190,24,14,.22)');gr2.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr2;g.beginPath();g.arc(gx,gy,70*Z,0,7);g.fill()}
  const O=einrichtung(b);const mitTanz=p=>()=>{if(p.paar){const d2=Math.sin(T*2.3+(p.takt||0))*.07*((p.ph||0)%2?1:-1);p.y+=d2;person(p);p.y-=d2;return}const d=(p.tanzt||(p.tanzBis||0)>Date.now())?Math.abs(Math.sin(T*6.7+(p.ph||0)))*.12:0;p.y-=d;p.x-=d;person(p);p.y+=d;p.x+=d};
  const LIVE=typeof window.liveImRaum==='function'?window.liveImRaum(b):[];for(const p of[...(b.innen||[]),...LIVE])O.push({x:p.x,y:p.y,f:mitTanz(p)});O.push({x:ICH.x,y:ICH.y,f:mitTanz(ICH)});
  O.sort((a,c)=>(a.x+a.y)-(c.x+c.y)).forEach(o=>o.f());
  // Schnittkante vorne: niedrige Glasbrüstung
  const f={x,y,w:4,d:4};fL(f,0,4,0,5,BERG?'rgba(54,56,62,.5)':'rgba(220,230,240,.5)');fR(f,0,4,0,5,BERG?'rgba(40,42,48,.5)':'rgba(200,215,230,.5)');fL(f,0,4,5,6,PAL[4]);fR(f,0,4,5,6,PAL[5])}

// ---------- Leute im Club ansprechen: jede Figur hat ihren eigenen Faden ----------
const KLUB_LEUTE=[
 {n:'Sven',t:'Türsteher',s:'Er sieht dich an und sagt erstmal gar nichts.',a:[
   ['Einfach zurückgucken','Er nickt knapp zur Seite. Du bist drin.',{fol:20}],
   ['„Ich kenne den DJ."','„Alle kennen den DJ."',{stil:-3}],
   ['Nach der Garderobe fragen','„Links. Und das Handy klebt dir gleich einer zu."',{}]]},
 {n:'Dealer',t:'steht am Klo',s:'„Alles gut bei dir? Brauchst du was?"',a:[
   ['„Was hast du da?"','„Was du willst. Preis steht, gewechselt wird nicht."',{}],
   ['„Nur Wasser."','„Fünf Euro. Flasche bleibt hier."',{geld:-5,energie:10}],
   ['Kopf schütteln','„Später vielleicht." Er steht schon wieder woanders.',{}]]},
 {n:'Nike',t:'tanzt seit vier Stunden',s:'Sie tanzt mit geschlossenen Augen und merkt dich erst beim zweiten Mal.',a:[
   ['Mittanzen','„Endlich jemand, der nicht quatscht."',{fol:35,energie:-8}],
   ['„Wie lange bist du schon hier?"','„Keine Ahnung. Es war hell, als ich kam."',{}],
   ['Wasser anbieten','Sie trinkt die halbe Flasche und gibt sie dir zurück.',{stil:2,energie:-4}]]},
 {n:'Jonas',t:'zum ersten Mal hier',s:'„Ey, ist das hier wirklich das Berghain? Ich bin extra aus München."',a:[
   ['„Ja. Und jetzt leise."','„Sorry. Sorry!" Er flüstert den Rest der Nacht.',{stil:3}],
   ['Ihm die Panorama Bar zeigen','„Alter. Danke." Er läuft sofort die Treppe hoch.',{fol:15}],
   ['„Handy weg."','Er klebt den Sticker selbst drauf.',{stil:2}]]},
 {n:'Mirela',t:'DJ, gerade Pause',s:'Sie steht an der Säule und hört von draußen ihrem eigenen Set zu.',a:[
   ['„Starkes Set."','„Die nächste Stunde wird besser."',{fol:60}],
   ['Nach einem Track fragen','„Frag mich Dienstag, jetzt weiß ich gar nichts."',{}],
   ['Nichts sagen, danebenstehen','Nach zwei Minuten reicht sie dir wortlos ihr Wasser.',{stil:5}]]},
 {n:'Frau mit Sonnenbrille',t:'seit gestern hier',s:'Drinnen, nachts, Sonnenbrille. Sie findet das völlig normal.',a:[
   ['„Siehst du überhaupt was?"','„Genug."',{}],
   ['Brille loben','„Die ist von meiner Mutter." Sie lächelt zum ersten Mal.',{stil:4}],
   ['Nach der Uhrzeit fragen','„Sowas fragt man hier nicht."',{stil:-2}]]},
 {n:'Typ im Harnisch',t:'kommt aus dem Darkroom',s:'Er lehnt an der Theke und sieht aus, als hätte er die Nacht schon gewonnen.',a:[
   ['„Woher hast du den?"','„Unten. Kostet 240, hält ewig."',{}],
   ['„Wie ist es da unten?"','„Dunkel. Und keiner fragt was."',{fol:10}],
   ['Ihm einen Drink ausgeben','„Du bist in Ordnung." Er stellt sich zu dir.',{geld:-12,fol:25}]]},
 {n:'Lena',t:'sucht ihre Freundinnen',s:'„Hast du drei Frauen gesehen, eine mit rotem Mantel?"',a:[
   ['„Oben an der Bar."','„Du rettest mein Leben." Sie rennt los.',{fol:20}],
   ['„Nein, aber bleib hier."','Sie bleibt. Zwei Stunden.',{fol:45,energie:-10}],
   ['Mithelfen suchen','Ihr findet alle drei im Darkroom. Sie wollten nicht gefunden werden.',{fol:30,stil:2}]]},
 {n:'Bastian',t:'erklärt dir Berlin',s:'„Früher war das hier ein Heizkraftwerk, weißt du das?"',a:[
   ['„Ja, wusste ich."','„Oh." Pause. „Und das Dach?"',{}],
   ['„Erzähl."','Zwanzig Minuten später weißt du alles über Fernwärme.',{stil:-4,energie:-6}],
   ['Weitergehen','Er redet trotzdem weiter.',{}]]},
 {n:'Alex',t:'raucht an der Säule',s:'„Feuer?"',a:[
   ['Feuer geben','„Danke." Mehr kommt nicht, und das ist okay.',{stil:1}],
   ['„Rauche nicht."','„Auch gut." Er dreht sich weg.',{}],
   ['Mitrauchen','Ihr steht zehn Minuten schweigend nebeneinander. Bester Teil der Nacht.',{stil:3,energie:-3}]]},
 {n:'Kati',t:'hat zu wenig getrunken',s:'„Weißt du, wo es Leitungswasser gibt?"',a:[
   ['Zur Theke bringen','Sie trinkt zwei Gläser und ist wieder da.',{fol:15,stil:2}],
   ['Deine Flasche geben','„Du bist ein Engel."',{fol:20,energie:-5}],
   ['„Der Dealer verkauft welches."','„Fünf Euro? Ernsthaft?"',{}]]},
 {n:'Robin',t:'guckt auf dein Outfit',s:'„Das ist gut. Wo ist das her?"',a:[
   ['„Unten im Laden."','„Dachte ich mir." Er geht sofort runter.',{fol:25}],
   ['„Gehört meiner Ex."','„Noch besser."',{stil:5}],
   ['Nichts verraten','„Verstehe." Er nickt anerkennend.',{stil:3}]]},
 {n:'Sonja',t:'muss Montag arbeiten',s:'„Ich wollte um zwei zu Hause sein. Es ist halb sechs."',a:[
   ['„Dann bleib ganz."','„Das sagen alle." Sie bleibt.',{fol:30,energie:-12}],
   ['„Fahr nach Hause."','„Du hast ja recht." Sie bleibt trotzdem.',{}],
   ['Nach ihrem Job fragen','„Zahnarztpraxis. Bitte frag nicht weiter."',{stil:1}]]},
 {n:'Mo',t:'macht das Licht',s:'„Guck mal hoch. Gleich geht das Rote an."',a:[
   ['Hochgucken','Das ganze Dach wird rot. Alle schreien.',{fol:70,stil:4}],
   ['„Mach mal heller."','„Niemals."',{stil:-2}],
   ['„Wie lange machst du das schon?"','„Länger als du lebst."',{}]]}];
const KLUB_DARK=[
 {n:'Jemand im Dunkeln',t:'wartet seit einer Weile',s:'Eine Hand findet deine und hält sie fest. Sie wartet, ob du sie wegziehst.',a:[
   ['Hand halten und mitgehen','Ihr verschwindet in der ersten Nische. Danach weißt du nicht mehr, wie spät es ist.',{fol:30,energie:-15,stil:-5}],
   ['In den Sling','Ihr braucht eine Weile, bis die Ketten richtig hängen. Danach geht es schnell.',{fol:40,energie:-20}],
   ['„Erst sagen, wie du heißt."','„Hier heißt keiner irgendwie." Aber die Hand bleibt.',{stil:3}],
   ['Nur zugucken','Du lehnst dich an die Wand und siehst zu. Auch eine Art Abend.',{fol:10,energie:-5}],
   ['Hand wegziehen','Sofort weg, kein Wort. So läuft das hier.',{stil:2}]]},
 {n:'Zwei an der Wand',t:'suchen einen Dritten',s:'Sie machen Platz zwischen sich und sehen dich an.',a:[
   ['Dazwischen stellen','Du kommst zwei Stunden später wieder raus.',{fol:60,energie:-25,stil:-8}],
   ['„Nur ihr beide, ich guck."','„Auch gut." Sie drehen sich wieder zueinander.',{fol:15,energie:-5}],
   ['Einen von beiden mitnehmen','Der andere bleibt an der Wand und wartet auf den nächsten.',{fol:35,energie:-15}],
   ['Nach Regeln fragen','„Fragen vorher, aufhören auf Wort. Sonst alles."',{stil:5}],
   ['Kopfschütteln','Sie nicken und machen weiter.',{}]]},
 {n:'Mann im Sling',t:'liegt schon drin',s:'„Ich liege hier seit zwanzig Minuten. Willst du oder soll ich den Nächsten fragen?"',a:[
   ['„Ich will."','Jemand hält dir wortlos Handschuhe hin. Danach ist deine Nacht gelaufen.',{fol:55,energie:-25,stil:-10}],
   ['„Zu zweit?"','Er ruft jemanden aus der Nische dazu.',{fol:45,energie:-20}],
   ['Ihm Wasser holen','„Du bist mir der Liebste." Er trinkt und bleibt liegen.',{stil:4,geld:-5}],
   ['„Nur die Ketten richten."','Du hängst ihn eine Stufe höher. Er bedankt sich ernsthaft.',{stil:3}],
   ['„Frag den Nächsten."','„Mach ich." Kein Drama.',{}]]},
 {n:'Frau an der Bank',t:'klopft neben sich',s:'Sie klopft auf die Bank neben sich und sagt nichts dazu.',a:[
   ['Hinsetzen','Es bleibt nicht beim Sitzen.',{fol:40,energie:-18,stil:-4}],
   ['„Was magst du?"','Sie sagt es dir direkt ins Ohr. Du nickst.',{fol:35,energie:-15}],
   ['Zu ihrer Freundin rübergucken','Die winkt. Jetzt seid ihr zu dritt.',{fol:50,energie:-22}],
   ['Nur danebensetzen','Ihr sitzt zehn Minuten im Dunkeln. Dann geht sie.',{energie:6}],
   ['Weitergehen','Sie klopft schon beim Nächsten.',{}]]},
 {n:'Typ im Harnisch',t:'steht am Kreuz',s:'„Ich hänge gleich da vorne. Machst du mit oder guckst du?"',a:[
   ['Ihn festschnallen','Du kriegst genaue Ansagen und hältst dich dran.',{fol:45,energie:-15,stil:-5}],
   ['Tauschen, du gehst ans Kreuz','Er schnallt dich fest. Das Wort zum Aufhören vereinbart ihr vorher.',{fol:65,energie:-28,stil:-12}],
   ['„Zeig mir das Werkzeug."','Er geht die Haken durch wie eine Speisekarte.',{stil:6}],
   ['Zugucken','Nach fünf Minuten steht eine ganze Reihe neben dir.',{fol:20}],
   ['„Nicht heute."','„Dann nächstes Mal." Er hängt sich selbst ein.',{}]]},
 {n:'Rico',t:'Security mit Lampe',s:'Er leuchtet knapp an dir vorbei, nie ins Gesicht.',a:[
   ['Nicken','Er nickt zurück und geht weiter.',{}],
   ['„Alles ruhig?"','„Immer. Deshalb stehe ich hier."',{stil:2}],
   ['„Was ist hier verboten?"','„Handy, Kamera, und wenn einer Nein sagt."',{stil:5}],
   ['„Kann ich hier schlafen?"','„Nein."',{}],
   ['Nach dem Ausgang fragen','„Links halten, dann die Treppe. Oben gibt es Wasser."',{}]]}];
const KLUB_PANO=[
 {n:'Barfrau',t:'Panorama Bar',s:'„Von hier siehst du die Sonne aufgehen. Dauert noch zwanzig Minuten."',a:[
   ['Mate bestellen','„Vier Euro. Und trink was Richtiges dazu."',{geld:-4,energie:12}],
   ['„Was nimmst du selbst?"','„Kaffee. Immer Kaffee."',{stil:1}],
   ['Auf die Sonne warten','Sie stellt dir ungefragt ein Wasser hin.',{energie:8,stil:3}]]},
 {n:'Zwei am Fenster',t:'reden seit Stunden',s:'Sie reden über Wohnungen. Seit drei Uhr.',a:[
   ['Zuhören','Du erfährst, was Mitte wirklich kostet. Es tut weh.',{stil:-2}],
   ['Mitreden','„Sag das nochmal, genau so!"',{fol:20}],
   ['Weitergehen','Sie merken es nicht.',{}]]},
 {n:'Mann mit Kaffee',t:'war schon arbeiten',s:'„Ich komme morgens her, wenn alle gehen. Beste Zeit."',a:[
   ['„Warum?"','„Weil dann keiner mehr etwas beweisen will."',{stil:5}],
   ['Kaffee holen','Ihr trinkt zusammen und sagt nichts.',{energie:10}],
   ['„Verrückt."','„Du bist doch auch noch hier."',{}]]},
 {n:'Frau mit Decke',t:'friert',s:'„Ist dir auch kalt oder bin das nur ich?"',a:[
   ['Jacke anbieten','„Du kriegst sie wieder. Irgendwann."',{stil:4,fol:15}],
   ['„Nur du."','Sie lacht und rückt näher ans Fenster.',{fol:10}],
   ['Heizung suchen','Es gibt keine. Ihr setzt euch in die Sonne.',{energie:6}]]},
 {n:'Jemand am Handy',t:'sucht Netz',s:'„Kein Empfang hier oben, oder?"',a:[
   ['„Gott sei Dank."','„Stimmt eigentlich."',{stil:3}],
   ['Beim Suchen helfen','Am Fenster geht ein Balken. Mehr nicht.',{}],
   ['„Leg weg."','Er legt es weg. Sieht erleichtert aus.',{stil:4,fol:10}]]}];
const klubListe=p=>p.liste==='dark'?KLUB_DARK:p.liste==='pano'?KLUB_PANO:KLUB_LEUTE;
function klubGespraech(p){const L=klubListe(p),d=L[p.klub%L.length],b=INNEN;
  const cb=panel(`${d.n} · ${d.t}`);const s1=document.createElement('p');s1.className='hin';s1.textContent=d.s;cb.append(s1);
  for(const[frage,antwort,w]of d.a){const bt=document.createElement('button');bt.className='big test';bt.style.marginTop='5px';bt.textContent=frage;
    bt.onclick=()=>{const c2=panel(`${d.n} · ${d.t}`);const q=document.createElement('p');q.className='hin';q.textContent='Du: '+frage;
      const a2=document.createElement('p');a2.textContent=`${d.n}: ${antwort}`;c2.append(q,a2);
      if(w){if(w.fol)ST.follower=(ST.follower||0)+w.fol;if(w.stil)ST.stil=(ST.stil||0)+w.stil;if(w.geld)ST.geld+=w.geld;
        if(w.energie)ST.energie=Math.max(0,Math.min(100,(ST.energie??70)+w.energie));save();hud();
        const txt=[w.fol?`Follower ${w.fol>0?'+':''}${w.fol}`:'',w.stil?`Stil ${w.stil>0?'+':''}${w.stil}`:'',w.geld?`${w.geld>0?'+':''}${euro(w.geld)}`:'',w.energie?`Energie ${w.energie>0?'+':''}${w.energie}`:''].filter(Boolean).join(' · ');
        if(txt){const e3=document.createElement('p');e3.className='hin';e3.textContent=txt;c2.append(e3)}}
      const zu=document.createElement('button');zu.className='big';zu.textContent='Zurück in den Club';zu.onclick=()=>zeigeEtage(b);c2.append(zu)};
    cb.append(bt)}
  const w2=document.createElement('button');w2.className='big test';w2.textContent='Weitergehen';w2.onclick=()=>zeigeEtage(b);cb.append(w2)}
// Antippen im Club: zuerst auf dem Bildschirm pruefen (da steht die Figur), sonst ueber den Bodenpunkt
function klubOeffnen(p){document.getElementById('card').hidden=false;klubGespraech(p);return true}
window.klubAntippen=(wx2,wy2,cx,cy)=>{const b=INNEN;if(!b||!b.innen)return false;
  const leute=b.innen.filter(q=>q.klub!=null);if(!leute.length)return false;
  if(cx!=null&&typeof pt==='function'){const px=cx*DPR,py=cy*DPR;let best=null,bd=1e9;
    for(const q of leute){const[ax,ay]=pt(q.x,q.y,11);const d=Math.hypot(ax-px,ay-py);if(d<bd){bd=d;best=q}}
    if(best&&bd<26*Z)return klubOeffnen(best)}
  let best=null,bd=.75;for(const q of leute){const d=Math.hypot(q.x-wx2,q.y-wy2);if(d<bd){bd=d;best=q}}
  return best?klubOeffnen(best):false};
// Tanzen: die eigene Figur tanzt sichtbar, auch fuer alle Mitspieler im Raum
function klubBereich(cb,b){const E=etagen(b);if(E[0].a!=='berghain')return;
  const h=document.createElement('h4');h.textContent='Im Club';cb.append(h);
  const t=document.createElement('button');t.className='big';const tanzt=(ICH.tanzBis||0)>Date.now();
  t.textContent=tanzt?'Du tanzt gerade':'💃 Tanzen';t.disabled=tanzt;
  t.onclick=()=>{ICH.tanzBis=Date.now()+30000;if(typeof PARTY!=='undefined'&&PARTY)PARTY.tanzBis=ICH.tanzBis;
    ST.follower=(ST.follower||0)+15;ST.energie=Math.max(0,(ST.energie??70)-5);save();hud();toast('Du tanzt. Alle im Raum sehen es.');zeigeEtage(b)};
  cb.append(t);
  const hin=document.createElement('p');hin.className='hin';hin.textContent='Tippe jemanden im Raum an oder nimm die Liste. Jede Person sagt etwas anderes.';cb.append(hin);
  const leute=(b.innen||[]).filter(q=>q.klub!=null);
  if(leute.length){const h2=document.createElement('h4');h2.textContent='Ansprechen';cb.append(h2);
    const nah=leute.map(q=>[Math.hypot(q.x-ICH.x,q.y-ICH.y),q]).sort((a,c)=>a[0]-c[0]).slice(0,8);
    const gesehen=new Set();
    for(const[,q]of nah){const L=klubListe(q),d=L[q.klub%L.length];if(gesehen.has(d.n))continue;gesehen.add(d.n);
      const bt=document.createElement('button');bt.className='big test';bt.style.marginTop='5px';bt.textContent=`${d.n} · ${d.t}`;bt.onclick=()=>klubGespraech(q);cb.append(bt)}}}
