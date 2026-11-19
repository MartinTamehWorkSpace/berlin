// Berlin City · innen.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Innenansicht: Haus wird bis aufs Erdgeschoss aufgeschnitten ----------
function etagen(b){const E=[{n:'Erdgeschoss',a:art(b),k:(b.pod.shops.map(s=>s[3]))}];if(!b.tow)return E;
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
  if(e.nachbar&&typeof nachbarZuHause==='function')nachbarZuHause(cb,e.nachbar);if(typeof partyBereich==='function')partyBereich(cb,b);
  if(E.length>1){const h=document.createElement('h4');h.textContent='Aufzug';cb.append(h);E.forEach((x,i)=>{const bt=document.createElement('button');bt.className='big test';bt.style.marginTop='5px';bt.textContent=`${i===(b.stock||0)?'● ':''}${x.n}${x.t?' · '+x.t:''}`;bt.disabled=i===(b.stock||0);bt.onclick=()=>aufzug(b,i);cb.append(bt)})}
  const raus=document.createElement('button');raus.className='big test';raus.textContent='Haus verlassen';raus.onclick=verlassen;cb.append(raus)}
let AUFZUG=0;
function aufzug(b,i){AUFZUG=1;toast(`Aufzug fährt in: ${etagen(b)[i].n}`);setTimeout(()=>{b.stock=i;b.innen=innenLeute(b);ICH.x=b.x+2;ICH.y=b.y+3.1;zeigeEtage(b);AUFZUG=0},900)}
function betreten(b){if(b.meins==='boutique'){boutiqueAuf('laden');return}if(b.haupt){klinikAuf('praxis');return}if(typeof ortPanel==='function'&&ortPanel(b))return;setTimeout(()=>ereignis('betreten',{b}));INNEN=b;b.stock=0;ICH.x=b.x+2;ICH.y=b.y+3.1;ICH.idle=1;ICH.path=[];
  ZIEL={cx:wx(b.x+2,b.y+2),cy:wy(b.x+2,b.y+2,0)-20,z:Math.min(3.4,Math.max(2,innerWidth/420))*DPR};
  if(b.top==='home'){b.stock=etagen(b).length-1;toast('Aufzug fährt nach oben in deine Wohnung')}b.innen=innenLeute(b);const c=document.getElementById('card');c.hidden=false;document.getElementById('hint').hidden=true;zeigeEtage(b)}
function verlassen(){const b=INNEN;if(!b)return;INNEN=null;const[tx,ty]=tuer(b);ICH.x=tx;ICH.y=ty;ZIEL={cx:wx(tx,ty),cy:wy(tx,ty,0)-40,z:(innerWidth<600?1.1:1.6)*DPR};document.getElementById('card').hidden=true;offen=null}
const art=b=>{const k=b.top==='home'?'home':(b.pod.shops[0]||[])[3]||'res';return{prado:'mode',shan:'mode',zahra:'mode',doug:'beauty',star:'cafe',ross:'markt',dn:'markt',lid:'markt',mehr:'markt',sac:'taschen',motors:'autos',klinik:'klinik',lab:'klinik',mcf:'gym',borch:'resto',hug:'resto',riva:'resto',boot:'club',work:'buero',home:'home',tif:'juwel',seph:'mode',vic:'mode',lulu:'mode',spa:'klinik',salon:'klinik',apfel:'buero',nicky:'club',berg:'berghain',bout:'mode',jets:'buero',arena:'club'}[k]||'home'};
function innenLeute(b){const a=etagen(b)[b.stock||0].a,L=[];const e0=etagen(b)[b.stock||0];
  const team=CHAR_P.filter(p=>p.ort&&e0.k.includes(p.ort));team.forEach((p,i)=>{p.x=b.x+3.1-i*.7;p.y=b.y+.9+i*.25;p.idle=1;L.push(p)});const rolle={klinik:['Dr. Glatt','#ffffff',1],gym:['Trainer','#16171a',0],autos:['Verkäufer','#1d1e24',0],buero:['Kollegin','#3d405b',0],home:['',null,0],berg:['Türsteher','#0d0d0f',0]}[e0.k.includes('berg')?'berg':a]||['Verkäuferin','#16171a',0];
  if(rolle[0]&&!team.length){const st=human({});Object.assign(st,{x:b.x+3.1,y:b.y+.9,idle:1,top:rolle[1],leg:'#16171a',coat:rolle[2],star:1,name:rolle[0],sz:1.05});if(rolle[0]==='Dr. Glatt'){st.hair='#cfc9c0';st.hs=3}L.push(st)}
  // Bei Nachbarn zu Hause: die Person selbst und zwei Gäste, je nach Tag eine andere Szene
  if(e0.nachbar){const echt=P.find(p=>p.nachbarId===e0.nachbar);if(echt){const n=human({});Object.assign(n,{x:b.x+2.4,y:b.y+1.6,idle:1,skin:echt.skin,hair:echt.hair,top:echt.top,leg:echt.leg,c1:echt.c1,w:echt.w,dress:echt.dress,frisur:echt.frisur,name:echt.name,sz:1.05});L.push(n)}
    for(let i=0;i<2;i++){const k=human({});Object.assign(k,{x:b.x+1+i*1.3,y:b.y+2.6,idle:1,ph:i+3});L.push(k)}}
  if(a==='home'&&typeof partyGaeste==='function')partyGaeste(b,b.stock||0,L);
  const berg=e0.k.includes('berg');for(let i=0;i<(a==='home'?0:berg?16:3);i++){const k=human({});Object.assign(k,berg?{x:b.x+.5+(i%4)*.85+Math.random()*.2,y:b.y+.6+Math.floor(i/4)*.75+Math.random()*.2,idle:1,ph:i*1.7,top:['#0d0d0f','#1b1b1f','#2a2a2e','#3a0c0c'][i%4],leg:'#0d0d0f',dress:0,tanzt:1}:{x:b.x+.8+i*1.1,y:b.y+2+(i%2)*.8,idle:1,ph:i});if(i===1)k.bagK=['lady','speedi','birkinn'][Math.floor(Math.random()*3)];L.push(k)}return L}
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
    // Stahlwanne vorne links
    K(.3,3.35,1.15,.55,7,'#7f8387');K(.38,3.4,.99,.45,.4,'#20252a',6.6);
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
  else if(a==='buero'){for(let i=0;i<2;i++)for(let j=0;j<3;j++){K(.5+i*1.6,.5+j*1.1,1.1,.5,11,'#f4f1ea');K(.7+i*1.6,.55+j*1.1,.5,.06,7,'#1d2a36',11)}}
  else if(b.top==='home'){const own=WS.KATALOG.filter(i=>i.kat==='wohnen'&&ST.besitz[i.id]);if(!own.some(i=>i.id==='w-bett'))K(2.4,.4,1.4,1.6,6,'#d9d2c8');if(!own.some(i=>i.id==='w-sofa'))K(.4,2.6,1.6,.6,6,'#9a9aa2');
    for(const i of own){if(!i.platz)continue;const[u,v,w,d,h,z]=i.platz;K(u,v,w,d,h,i.farbe,z||0);if(i.id==='w-bett'){K(u,v,w,.12,24,'#d8c39a');K(u+w-.08,v,.08,d,24,'#d8c39a');K(u+.1,v+.2,w-.2,.3,3,'#ff7eb6',h)}if(i.id==='w-sofa')K(u,v,w,.18,13,i.farbe);if(i.id==='w-bar')add('g',u+.25,v+.4,()=>{const[px,py]=pt(x+u+.25,y+v+.4,16);g.drawImage(glut('#ffd166'),px-8*Z,py-8*Z,16*Z,16*Z)});if(i.id==='w-aquarium')add('f',u,v,()=>{for(let k=0;k<5;k++){const[px,py]=pt(x+u+.06,y+v+.2+((T*.3+k*.3)%1.4),8+k*3);g.fillStyle=['#ffd166','#ff7eb6','#7ef7ff'][k%3];g.fillRect(px,py,3*Z,1.5*Z)}})}}
  else{K(.4,.4,1.6,2.1,8,'#f2eee8');K(.4,.4,1.6,.25,16,'#c9b48a');K(2.4,.4,1.4,.6,9,'#8a8f96');K(2.6,2,.9,.9,7,'#c9b48a');K(3.4,3.3,.35,.35,22,'#4b5d4f')}
  if(typeof partyEinrichtung==='function')partyEinrichtung(b,x,y,add,K);
  return O}
function innen(b){const x=b.x,y=b.y,WH=58;const ee=etagen(b)[b.stock||0];const k=ee.k.find(v=>v!=='res')||(ee.a==='home'?'home':null);const BERG=k==='berg',T=performance.now()/1000;
  /* Berghain: Beton, Dunkelheit, Tanzfläche im Takt (128 BPM), rote Leuchtbänder, Stroboskop */
  const PAL=BERG?['#16161a','#1e1e23','#2c2b2f','#232226','#ff3b2f','#b8261d']:['#efe6dc','#e6dbcf','#f4efe8','#dcd3c8','#ff7eb6','#e0609c'];const takt=Math.floor(T*128/60);
  top4(x,y,4,4,0,PAL[0]);for(let i=0;i<4;i++)for(let j=0;j<4;j++){if((i+j)%2)top4(x+i,y+j,1,1,0,PAL[1]);if(BERG&&(i*7+j*3+takt)%5===0)top4(x+i+.05,y+j+.05,.9,.9,0,['rgba(255,59,47,.5)','rgba(255,18,10,.34)','rgba(240,244,250,.18)'][(i+j+takt)%3])}
  poly([pt(x,y,0),pt(x+4,y,0),pt(x+4,y,WH),pt(x,y,WH)],PAL[2]);poly([pt(x,y,0),pt(x,y+4,0),pt(x,y+4,WH),pt(x,y,WH)],PAL[3]);
  poly([pt(x,y,WH-6),pt(x+4,y,WH-6),pt(x+4,y,WH),pt(x,y,WH)],PAL[4]);poly([pt(x,y,WH-6),pt(x,y+4,WH-6),pt(x,y+4,WH),pt(x,y,WH)],PAL[5]);
  if(BERG){for(let i=0;i<4;i++){poly([pt(x+.4+i,y,10),pt(x+.6+i,y,10),pt(x+.6+i,y,WH-8),pt(x+.4+i,y,WH-8)],'rgba(255,59,47,'+(.25+.25*Math.sin(T*6+i))+')')}if(takt%8<1)poly([pt(x,y,0),pt(x+4,y,0),pt(x+4,y+4,0),pt(x,y+4,0)],'rgba(255,255,255,.12)')}
  if(BERG){for(let i=1;i<8;i++){poly([pt(x+i*.5,y,0),pt(x+i*.5+.03,y,0),pt(x+i*.5+.03,y,WH),pt(x+i*.5,y,WH)],'rgba(0,0,0,.22)');poly([pt(x,y+i*.5,0),pt(x,y+i*.5+.03,0),pt(x,y+i*.5+.03,WH),pt(x,y+i*.5,WH)],'rgba(0,0,0,.22)')}
    for(let i=0;i<4;i++){const u=x+.45+i*.9;poly([pt(u,y,26),pt(u+.52,y,26),pt(u+.52,y,50),pt(u,y,50)],'rgba(168,186,205,.15)');poly([pt(u+.24,y,26),pt(u+.28,y,26),pt(u+.28,y,50),pt(u+.24,y,50)],'#4a4845')}
    for(let i=0;i<3;i++){const v=y+1.4+i*.9;poly([pt(x,v,26),pt(x,v+.52,26),pt(x,v+.52,50),pt(x,v,50)],'rgba(150,168,188,.11)')}}
  if(etagen(b).length>1){poly([pt(x,y+2.9,0),pt(x,y+3.7,0),pt(x,y+3.7,34),pt(x,y+2.9,34)],'#9aa3ad');poly([pt(x,y+3.28,0),pt(x,y+3.32,0),pt(x,y+3.32,34),pt(x,y+3.28,34)],'#5a636d');poly([pt(x,y+3.1,38),pt(x,y+3.5,38),pt(x,y+3.5,42),pt(x,y+3.1,42)],AUFZUG?'#ff4fa3':'#2fe0d2')}
  if(k&&!BERG){const[cx,cy]=pt(x+2,y,WH-20);const s=Math.min(Z/DPR,2)*DPR;g.setTransform(s*.9,s*.45,0,s,cx,cy);brand(k,120,22);g.setTransform(1,0,0,1,0,0)}
  const O=einrichtung(b);const mitTanz=p=>()=>{const d=(p.tanzt||(p.tanzBis||0)>Date.now())?Math.abs(Math.sin(T*6.7+(p.ph||0)))*.12:0;p.y-=d;p.x-=d;person(p);p.y+=d;p.x+=d};
  const LIVE=typeof window.liveImRaum==='function'?window.liveImRaum(b):[];for(const p of[...(b.innen||[]),...LIVE])O.push({x:p.x,y:p.y,f:mitTanz(p)});O.push({x:ICH.x,y:ICH.y,f:mitTanz(ICH)});
  O.sort((a,c)=>(a.x+a.y)-(c.x+c.y)).forEach(o=>o.f());
  // Schnittkante vorne: niedrige Glasbrüstung
  const f={x,y,w:4,d:4};fL(f,0,4,0,5,BERG?'rgba(54,56,62,.5)':'rgba(220,230,240,.5)');fR(f,0,4,0,5,BERG?'rgba(40,42,48,.5)':'rgba(200,215,230,.5)');fL(f,0,4,5,6,PAL[4]);fR(f,0,4,5,6,PAL[5])}
