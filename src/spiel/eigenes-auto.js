// Berlin City · eigenes-auto.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Eigenes Auto vor der Wohnung, mit Namensschild ----------
const PARK_ICH={x:4.2,y:7.6};const AUTO_SPR={twinga:'1',s5:'2',g63:'3',furioso:'4',roadster:'5',uber:'2'};
// Uber: ein schwarzer Wagen fährt über die Straßen zu dir, holt dich ab und bringt dich bis vor die Tür. 10 €.
const UBER={preis:10,bis:0,ziel:null,faehrt:false,wagen:null,tempo:5,auto:{id:'uber',name:'Uber',rang:0}};
function autoRufen(){if(!ICH.auto||RUF||ICH.faehrt||INNEN)return;const fliegt=ICH.auto.id==='roadster';
  RUF={x:PARK_ICH.x,y:PARK_ICH.y,fliegt,lift:0,path:fliegt?[[ICH.x,ICH.y]]:[...strassenWeg(PARK_ICH.x,PARK_ICH.y,ICH.x,ICH.y),[ICH.x,ICH.y]],r:'90'};ICH.path=[];
  if(!RUF.path.length)RUF.path=[[ICH.x,ICH.y]];toast(fliegt?'Dein Teslo Roadster hebt ab und fliegt zu dir':`Dein ${ICH.auto.name} ist unterwegs zu dir`);karten()}
function rufFahren(dt){uberWeiter(dt);if(!RUF)return;const[tx,ty]=RUF.path[0];const dx=tx-RUF.x,dy=ty-RUF.y,d=Math.hypot(dx,dy),v=(RUF.fliegt?7:8)*dt;
  RUF.r=Math.abs(dx)>Math.abs(dy)?(dx>0?'90':'270'):(dy>0?'0':'180');
  if(RUF.fliegt){const ges=Math.hypot(PARK_ICH.x-ICH.x,PARK_ICH.y-ICH.y)||1;RUF.lift=Math.min(60,Math.sin(Math.min(1,1-d/ges)*Math.PI)*70+(d>.6?10:0))}
  if(d<=v){RUF.x=tx;RUF.y=ty;RUF.path.shift();if(!RUF.path.length){const nach=RUF.danach;ICH.faehrt=1;ICH.x=RUF.x;ICH.y=RUF.y;PARK_ICH.x=RUF.x;PARK_ICH.y=RUF.y;RUF=null;karten();if(nach)laufeZu(...nach);else toast('Abgeholt. Tipp aufs Ziel und fahr los, Antippen des Autos parkt es.')}}
  else{RUF.x+=dx/d*v;RUF.y+=dy/d*v}}
function rufZeichnen(){if(!RUF||!ICH.auto)return;const k=AUTO_SPR[ICH.auto.id];const im=k&&SPR[k]&&SPR[k][RUF.r];const[x,y]=pt(RUF.x,RUF.y,0);
  if(RUF.fliegt){const gl=g.createRadialGradient(x,y,1,x,y,30*Z);gl.addColorStop(0,'rgba(143,227,240,.45)');gl.addColorStop(1,'rgba(143,227,240,0)');g.fillStyle=gl;g.beginPath();g.ellipse(x,y,30*Z,15*Z,0,0,7);g.fill()}
  if(im&&im.naturalWidth){const sc=.14*Z;g.drawImage(im,x-im.naturalWidth*sc/2,y-im.naturalHeight*sc/2-RUF.lift*Z,im.naturalWidth*sc,im.naturalHeight*sc)}
  else{g.fillStyle=ICH.auto.id==='vespa'?'#f3a6c6':'#1d1e24';g.beginPath();g.roundRect(x-8*Z,y-10*Z,16*Z,7*Z,3*Z);g.fill()}}
function meinAuto(o){const a=ICH.auto;if(!a||ICH.faehrt||RUF)return;const[x,y]=pt(o.x,o.y,0);const k=AUTO_SPR[a.id];
  if(k){const im=SPR[k]&&SPR[k]['90'];if(im&&im.naturalWidth){const sc=.14*Z;g.drawImage(im,x-im.naturalWidth*sc/2,y-im.naturalHeight*sc/2,im.naturalWidth*sc,im.naturalHeight*sc)}}
  else{const s=Z;g.strokeStyle='#2a2b30';g.lineWidth=1.6*s;g.beginPath();g.arc(x-6*s,y-3*s,3*s,0,7);g.arc(x+6*s,y-3*s,3*s,0,7);g.stroke();
    g.fillStyle=a.id==='vespa'?'#f3a6c6':a.id==='roller'?'#1d1e24':'#c9b48a';g.beginPath();g.roundRect(x-7*s,y-11*s,14*s,6*s,3*s);g.fill()}
  const fs=Math.max(9,10*Z/DPR)*DPR;g.font='700 '+fs+'px Inter';const t='Dein '+a.name;const tw=g.measureText(t).width;g.fillStyle='rgba(255,79,163,.92)';g.beginPath();g.roundRect(x-tw/2-6*DPR,y-34*Z-fs,tw+12*DPR,fs+8*DPR,5*DPR);g.fill();
  g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.fillText(t,x,y-34*Z-fs/2+4*DPR)}
// ---------- Auf der Straße fahren: Spur halten, an Kreuzungen abbiegen, am Ziel in die Parkbucht ----------
// Straßen liegen bei 8k bis 8k+2 (Mitte 8k+1). Rechtsverkehr: Spur je Richtung wie bei den Stadtautos (SPUR).
// Außerhalb der Stadt (Flughafen im Osten, Arena im Westen) geht es über die Zufahrtsstraße auf Höhe y 17
function strassenWeg(ax,ay,bx,by){const raus=v=>v>42.5||v<-.5;if(raus(bx)&&!raus(ax)){const rand=bx>0?41.4:.6;return[...stadtWeg(ax,ay,rand,17),[bx>0?Math.min(bx,56):Math.max(bx,-19),17],[bx,by]]}
  if(raus(ax)&&!raus(bx)){const rand=ax>0?41.4:.6;return[[ax,17],[rand,17],...stadtWeg(rand,17,bx,by)]}if(raus(ax)&&raus(bx))return[[ax,17],[bx,17],[bx,by]];return stadtWeg(ax,ay,bx,by)}
function stadtWeg(ax,ay,bx,by){const mitte=v=>8*Math.max(0,Math.min(5,Math.round((v-1)/8)))+1,klemm=v=>Math.max(.6,Math.min(41.4,v));
  const fang=(x,y)=>{const cx=mitte(x),cy=mitte(y);return Math.abs(x-cx)<=Math.abs(y-cy)?{senk:true,x:cx,y:klemm(y)}:{senk:false,x:klemm(x),y:cy}};
  const S=fang(ax,ay),E=fang(bx,by);let P=[[S.x,S.y]];
  if(S.senk&&E.senk){if(S.x!==E.x){const r=mitte((S.y+E.y)/2);P.push([S.x,r],[E.x,r])}}
  else if(S.senk&&!E.senk)P.push([S.x,E.y]);else if(!S.senk&&E.senk)P.push([E.x,S.y]);
  else if(S.y!==E.y){const c=mitte((S.x+E.x)/2);P.push([c,S.y],[c,E.y])}
  P.push([E.x,E.y]);const out=[];
  for(let i=0;i+1<P.length;i++){const[a1,b1]=P[i],[a2,b2]=P[i+1];if(Math.hypot(a2-a1,b2-b1)<.05)continue;
    const senk=Math.abs(a2-a1)<Math.abs(b2-b1),dir=senk?Math.sign(b2-b1):Math.sign(a2-a1),o=senk?(dir>0?-.45:.45):(dir>0?.45:-.45);
    if(senk){out.push([a1+o,b1],[a2+o,b2])}else{out.push([a1,b1+o],[a2,b2+o])}}
  return out}
// Parken nur in Parkbuchten: ohne Ziel-Haus fährt das Auto in die nächste Bucht
const naechsterParkplatz=(x,y)=>B.map(parkplatz).reduce((a,c)=>Math.hypot(c.x-x,c.y-y)<Math.hypot(a.x-x,a.y-y)?c:a);
function fahrZu(x,y,b){const z=b?parkplatz(b):naechsterParkplatz(x,y);ICH.path=strassenWeg(ICH.x,ICH.y,z.x,z.y);ICH.path.push([z.x,z.y]);ICH.ziel=b||null;ZIEL=null;ziehen=false;
  toast(b?`${UBER.faehrt?'Uber fährt':'Du fährst'} zu ${b.title}`:'Du fährst los')}
// Angekommen: Parkbucht, aussteigen, das letzte Stück zu Fuß
function ankommen(p){const b=p.ziel;p.faehrt=0;p.lift=0;p.richtung='90';
  if(UBER.faehrt){UBER.faehrt=false;hud();toast('Uber angekommen. Gute Fahrt gehabt?')}else{PARK_ICH.x=p.x;PARK_ICH.y=p.y;if(b)toast(`Geparkt vor ${b.title}`)}karten();
  if(b){const[tx,ty]=tuer(b);p.path=weg(p.x,p.y,tx,ty);if(!p.path.length){p.ziel=null;betreten(b)}}else p.ziel=null}
// Weite Wege: zu Fuß, eigenes Auto oder Uber
function wegWahl(x,y,b){const w=weg(ICH.x,ICH.y,x,y);let len=0;for(let i=0,px=ICH.x,py=ICH.y;i<w.length;i++){len+=Math.hypot(w[i][0]-px,w[i][1]-py);px=w[i][0];py=w[i][1]}
  if(len<7)return false;
  // Eigenes Auto: kein Zwischenschritt, es kommt oder du steigst direkt ein
  if(ICH.auto&&!UBER.faehrt){const nah=Math.hypot(ICH.x-PARK_ICH.x,ICH.y-PARK_ICH.y)<1.5;if(nah){ICH.faehrt=1;ICH.x=PARK_ICH.x;ICH.y=PARK_ICH.y;karten();laufeZu(x,y,b)}else{autoRufen();if(RUF)RUF.danach=[x,y,b]}return true}
  const cb=panel(b?`Zu ${b.title}`:'Wie willst du hin?');const min=Math.max(1,Math.round(len/TEMPO.fuss/60));
  const knopf=(t,klein,fn,an=true,haupt)=>{const k=document.createElement('button');k.className='big'+(haupt?'':' zweit');k.textContent=t;k.disabled=!an;k.onclick=()=>{document.getElementById('card').hidden=true;fn()};if(klein){const s=document.createElement('small');s.textContent=klein;k.append(s)}cb.append(k)};
  if(ICH.auto&&!UBER.faehrt){const nah=Math.hypot(ICH.x-PARK_ICH.x,ICH.y-PARK_ICH.y)<1.5;knopf(`Mit deinem ${ICH.auto.name}`,nah?'Steht direkt hier, sofort los':'Kommt zu dir und fährt dich hin',()=>{if(nah){ICH.faehrt=1;ICH.x=PARK_ICH.x;ICH.y=PARK_ICH.y;karten();laufeZu(x,y,b)}else{autoRufen();if(RUF)RUF.danach=[x,y,b]}},true,true)}
  knopf(`Uber rufen · ${euro(UBER.preis)}`,'Ein schwarzer Wagen holt dich ab und fährt dich bis vor die Tür',()=>uberRufen(x,y,b),ST.geld>=UBER.preis,!ICH.auto);
  knopf(`Zu Fuß · etwa ${min} Min.`,'Kostet nichts, dauert',()=>laufeZu(x,y,b,true));return true}
function uberRufen(x,y,b){if(ST.geld<UBER.preis||UBER.bis||UBER.faehrt)return;ST.geld-=UBER.preis;save();hud();
  // Startpunkt: eine Kreuzung etwa eine Querstraße weiter, von dort auf der Straße bis zu dir
  const kx=8*Math.max(0,Math.min(5,Math.round((ICH.x-1)/8)+(ICH.x<21?3:-3)))+1,ky=8*Math.max(0,Math.min(5,Math.round((ICH.y-1)/8)))+1;
  const pfad=strassenWeg(kx,ky,ICH.x,ICH.y);pfad.push([ICH.x,ICH.y]);UBER.wagen={x:kx,y:ky,path:pfad,r:'90'};UBER.bis=1;UBER.ziel=[x,y,b];ICH.path=[];
  toast(`Uber bestellt für ${euro(UBER.preis)}. Ein schwarzer Wagen ist unterwegs zu dir.`)}
function uberWeiter(dt=0){const el=document.getElementById('uberAnz'),w=UBER.wagen;if(!w){if(el&&!el.hidden)el.hidden=true;return}
  let rest=0,px=w.x,py=w.y;for(const[tx,ty]of w.path){rest+=Math.hypot(tx-px,ty-py);px=tx;py=ty}
  if(el){el.hidden=false;el.textContent=rest>.3?`Uber kommt in ${Math.ceil(rest/UBER.tempo)} Sek.`:'Uber ist da, steig ein'}
  let v=UBER.tempo*dt;while(v>0&&w.path.length){const[tx,ty]=w.path[0],dx=tx-w.x,dy=ty-w.y,d=Math.hypot(dx,dy);if(d>.01)w.r=Math.abs(dx)>Math.abs(dy)?(dx>0?'90':'270'):(dy>0?'0':'180');if(d<=v){w.x=tx;w.y=ty;w.path.shift();v-=d}else{w.x+=dx/d*v;w.y+=dy/d*v;v=0}}
  if(!w.path.length){UBER.wagen=null;UBER.bis=0;UBER.faehrt=true;hud();ICH.faehrt=1;ICH.richtung=w.r;ICH.path=[];const[x,y,b]=UBER.ziel;UBER.ziel=null;karten();toast('Eingestiegen. Dein Fahrer bringt dich hin.');fahrZu(x,y,b)}}
