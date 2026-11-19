// Berlin City · ablauf.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Ablauf ----------
let T=0,last=performance.now(),sel=null;
const front=(o,b)=>o.x>=b.x+b.w||o.y>=b.y+b.d;
const GLUT={};function glut(c){if(GLUT[c])return GLUT[c];const k=document.createElement('canvas');k.width=k.height=64;const x=k.getContext('2d');const q=x.createRadialGradient(32,32,0,32,32,32);q.addColorStop(0,c);q.addColorStop(.25,c+'aa');q.addColorStop(1,c+'00');x.fillStyle=q;x.fillRect(0,0,64,64);return GLUT[c]=k}
function lamp(o){const[x,y]=pt(o.x,o.y);const s=Z;g.strokeStyle='#2a2b30';g.lineWidth=1.6*s;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-34*s);g.lineTo(x+6*s,y-36*s);g.stroke();
  const k=glut(o.c);g.drawImage(k,x+6*s-14*s,y-35*s-14*s,28*s,28*s);g.globalAlpha=.4;g.drawImage(k,x+4*s-18*s,y-9*s,36*s,18*s);g.globalAlpha=1}
const PADS=()=>['Spreeufer Residenz','Galeries Lafayetto','Health Hub','Fabrik Coworking'].map(t=>B.find(b=>b.title===t)).filter(Boolean).map(b=>({x:b.x+2,y:b.y+2,z:b.topZ||b.h}));
const HELIS=[{liv:'#ff4fa3',name:'GLOW AIR',a:0,b:1,t:0},{liv:'#f4f4f2',name:'NEWS',a:2,b:3,t:5}];
// Wegesuche auf einem feinen Raster: Häuser und Wasser sind gesperrt
const GS=.5,GX0=-36,GY0=-6,GWd=Math.ceil(114/GS),GHt=Math.ceil(56/GS);
let INNEN=null,ZIEL=null,RUF=null;
const frei=(cx,cy)=>{if(cx<0||cy<0||cx>=GWd||cy>=GHt)return false;const x=GX0+(cx+.5)*GS,y=GY0+(cy+.5)*GS;if(y>42.8){const k=Math.floor((x-1.4)/4.1);const ox=x-1.4-k*4.1;if(x>33.6&&y<45.1)return true;if(y<49.3&&x>41){const j=Math.floor((x-41)/2.3);const oj=x-41-j*2.3;if(j>=0&&j<3&&oj>=.05&&oj<=.75)return true}return k>=0&&k<8&&ox>=.05&&ox<=.95&&y<47.4}return!B.some(b=>x>b.x-.1&&x<b.x+b.w+.1&&y>b.y-.1&&y<b.y+b.d+.1)};
function weg(ax,ay,bx,by){const c=(x,y)=>[Math.round((x-GX0)/GS-.5),Math.round((y-GY0)/GS-.5)];const[sx,sy]=c(ax,ay);let[tx,ty]=c(bx,by);
  if(!frei(tx,ty)){let best=null,bd=1e9;for(let r=1;r<8&&!best;r++)for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++)if(frei(tx+dx,ty+dy)){const d=dx*dx+dy*dy;if(d<bd){bd=d;best=[tx+dx,ty+dy]}}if(!best)return[];[tx,ty]=best}
  const key=(x,y)=>y*GWd+x,prev=new Map([[key(sx,sy),-1]]),q=[[sx,sy]];let hit=false;
  while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty){hit=true;break}for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(prev.has(k)||!frei(nx,ny))continue;if(dx&&dy&&(!frei(x+dx,y)||!frei(x,y+dy)))continue;prev.set(k,key(x,y));q.push([nx,ny])}}
  if(!hit)return[];const out=[];let k=key(tx,ty);while(k!==-1){const x=k%GWd,y=(k/GWd)|0;out.push([GX0+(x+.5)*GS,GY0+(y+.5)*GS]);k=prev.get(k)}out.reverse();out.shift();
  // Ecken glätten: Zwischenpunkte auf gerader Linie weglassen
  return out.filter((p,i)=>{if(i===0||i===out.length-1)return true;const a=out[i-1],b=out[i+1];return Math.abs((p[0]-a[0])*(b[1]-p[1])-(p[1]-a[1])*(b[0]-p[0]))>1e-6})}
// Gehen und Fahren. Zu Fuß ist man langsam, im Auto schnell. Autos halten an roten Ampeln und hinter dem Vordermann, nur der fliegende Roadster nicht.
const TEMPO={fuss:1.3,auto:7,roadster:11};
function gehen(p,dt){if(INNEN){/* in Gebäuden: direkt zum angetippten Punkt laufen, innerhalb der Wände */const z=p.innenZiel;if(!z){p.idle=1;return}const dx=z[0]-p.x,dy=z[1]-p.y,d=Math.hypot(dx,dy);if(d<.05){p.innenZiel=null;p.idle=1;return}p.idle=0;const v=Math.min(d,1.6*dt);p.x+=dx/d*v;p.y+=dy/d*v;return}if(!p.path.length){p.idle=1;return}p.idle=0;const[tx,ty]=p.path[0];const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy),fl=p.faehrt&&p.auto&&p.auto.id==='roadster';
  let v=(fl?TEMPO.roadster:p.faehrt?TEMPO.auto:TEMPO.fuss*((ST.energie??80)<15?.6:1))*dt;
  if(p===ICH&&p.faehrt&&!fl){const ax=Math.abs(dx)>Math.abs(dy)?'x':'y',dir=(ax==='x'?dx:dy)>0?1:-1,t=ax==='x'?p.x:p.y,c=ax==='x'?p.y:p.x;p.fax=ax;p.fdir=dir;p.fc=c;
    const m=dir>0?Math.ceil((t-1.6)/8):Math.floor((t+1.6)/8),halte=dir>0?8*m-.4:8*m+2.4,dist=(halte-t)*dir;
    if(dist>0&&dist<1&&m>=0&&m<=5){const kq=Math.round((c-1)/8);if(ampel(ax==='y'?kq:m,ax==='y'?m:kq,ax)!=='g')v=Math.min(v,Math.max(0,dist-.15))}
    for(const o of CARS){if(o.ax!==ax||o.dir!==dir||Math.abs(o.c-c)>.3||o.lift>5)continue;const a=(o.t-t)*dir;if(a>0&&a<1.1)v=Math.min(v,Math.max(0,(a-.8)*dt*6))}}
  if(p===ICH&&p.faehrt){ICH.strecke=(ICH.strecke||0)+v;if(ICH.strecke>1){ereignis('fahren',{menge:1});ICH.strecke=0}if(fl&&!p.geflogen){p.geflogen=1;ST.fluege=(ST.fluege||0)+1}}if(fl&&p.flugStart){const ges=Math.hypot(tx-p.flugStart[0],ty-p.flugStart[1])||1;p.lift=Math.min(70,Math.sin(Math.min(1,1-d/ges)*Math.PI)*90+(d>.3?14:0))}p.richtung=Math.abs(dx)>Math.abs(dy)?(dx>0?'90':'270'):(dy>0?'0':'180');
  if(d<=v){p.x=tx;p.y=ty;p.path.shift();if(!p.path.length)p.lift=0;if(!p.path.length&&p.einsteigen){p.einsteigen=0;p.faehrt=1;p.x=PARK_ICH.x;p.y=PARK_ICH.y;toast(`Du fährst deinen ${p.auto.name}. Antippen zum Parken.`)}
    if(!p.path.length&&p.faehrt){ankommen(p);return}
    if(!p.path.length&&p.ziel){if(p.faehrt){p.faehrt=0;PARK_ICH.x=p.x;PARK_ICH.y=p.y}const b=p.ziel;p.ziel=null;betreten(b)}}else if(v>0){p.x+=dx/d*v;p.y+=dy/d*v}
  if(!ziehen){const zx=wx(p.x,p.y),zy=wy(p.x,p.y,0)-40;CX+=(zx-CX)*.04;CY+=(zy-CY)*.04}}
const tuer=b=>[b.x+2,b.y+b.d+.45];
function laufeZu(x,y,b,zuFuss){if(ICH.faehrt&&ICH.auto&&ICH.auto.id==='roadster'){const ziel=b?parkplatz(b):naechsterParkplatz(x,y),tx=ziel.x,ty=ziel.y;ICH.path=[[tx,ty]];ICH.ziel=b||null;ICH.flugStart=[ICH.x,ICH.y];toast(b?`Du fliegst zu ${b.title}`:'Du fliegst los');return}
  if(ICH.faehrt){fahrZu(x,y,b);return}
  if(!zuFuss&&!RUF&&!UBER.bis&&wegWahl(x,y,b))return;
  ICH.path=weg(ICH.x,ICH.y,x,y);ICH.ziel=b||null;if(!ICH.path.length){if(b&&Math.hypot(ICH.x-x,ICH.y-y)<1.2){betreten(b);return}toast('Dort kommst du nicht hin');return}ZIEL=null;ziehen=false;toast(b?`Unterwegs zu ${b.title}`:'Unterwegs')}
const welt=(sx,sy)=>{const X=(sx-W/2)/Z+CX,Y=(sy-H/2)/Z+CY,a=X/32,b=Y/16;return[(a+b)/2,(b-a)/2]};
function verkehr(dt){
  for(const c of CARS){let ziel=c.basis;
    c.lift=0; // Autos bleiben auf der Straße, keines fliegt durch Häuser
    const fliegt=c.lift>5;
    // Nächste Kreuzung vor dem Auto und Haltelinie
    const kq=c.ax==='y'?Math.round((c.c-1)/8):Math.round((c.c-1)/8);
    let m=c.dir>0?Math.ceil((c.t-1.6)/8):Math.floor((c.t+1.6)/8);const halte=c.dir>0?8*m-.4:8*m+2.4;const dist=(halte-c.t)*c.dir;
    if(!fliegt&&dist>0&&dist<1.3&&m>=0&&m<=5){const kx=c.ax==='y'?kq:m,ky=c.ax==='y'?m:kq;const l=ampel(kx,ky,c.ax);if(l!=='g')ziel=dist<.12?0:Math.min(ziel,dist*1.6)}
    // Abstand zum Vordermann auf derselben Spur
    if(!fliegt)for(const o of CARS){if(o===c||o.ax!==c.ax||o.dir!==c.dir||Math.abs(o.c-c.c)>.2||o.lift>5)continue;const a=(o.t-c.t)*c.dir;if(a>0&&a<1.15)ziel=Math.min(ziel,Math.max(0,(a-.75)*3))}
    if(!fliegt&&ICH.faehrt&&ICH.fax===c.ax&&ICH.fdir===c.dir&&Math.abs(ICH.fc-c.c)<.3){const a=((c.ax==='x'?ICH.x:ICH.y)-c.t)*c.dir;if(a>0&&a<1.15)ziel=Math.min(ziel,Math.max(0,(a-.75)*3))}
    // Rücksicht: vor Menschen auf der Fahrbahn und vor jedem Auto im Weg (auch querend) anhalten
    {const fx=c.ax==='x'?c.dir:0,fy=c.ax==='y'?c.dir:0;const halt=(ox,oy,vorn,breit)=>{const dx=ox-c.x,dy=oy-c.y,a=dx*fx+dy*fy,q=Math.abs(dx*fy-dy*fx);if(a>0&&a<vorn&&q<breit)ziel=Math.min(ziel,Math.max(0,(a-.6)*2.5))};
     for(const p of P){if(p.innen||p.drin||p.weg)continue;halt(p.x,p.y,1.6,.7)}if(!ICH.faehrt)halt(ICH.x,ICH.y,1.6,.7);
     for(const o of CARS)if(o!==c&&!(o.ax===c.ax&&o.dir===c.dir&&Math.abs(o.c-c.c)<.2))halt(o.x,o.y,1.3,.6)}
    c.sp+=(ziel-c.sp)*Math.min(1,dt*4);c.t+=c.dir*c.sp*dt;
    // In der Kreuzung: geradeaus oder abbiegen
    const mi=Math.floor(c.t/8),drin=c.t-8*mi>=0&&c.t-8*mi<=2;
    if(drin&&c.kreuz!==mi){c.kreuz=mi;const r=Math.random();c.plan=r<.55||fliegt?null:(r<.78?1:-1)}
    if(drin&&c.plan!=null){const nd=c.plan,nax=c.ax==='y'?'x':'y',nc=SPUR(nax,nd,mi);if((nc-c.t)*c.dir<=0){const alt=c.c;c.ax=nax;c.dir=nd;c.t=alt;c.c=nc;c.plan=null;c.kreuz=Math.floor(c.c/8)}}
    // Am Kartenrand wieder hereinfahren
    if(c.t>41.9)c.t=-.4;if(c.t<-.5)c.t=41.8;
    c.vert=c.ax==='y';c.v=c.dir;c.x=c.vert?c.c:c.t;c.y=c.vert?c.t:c.c}}
function heliPos(h,dt){const P=PADS();if(P.length<2)return null;const A=P[h.a%P.length],Bp=P[h.b%P.length];const d=Math.hypot(Bp.x-A.x,Bp.y-A.y),fly=d/1.6;
  const ph=[4,2.5,fly,2.5],tot=ph.reduce((a,b)=>a+b);h.t+=dt;if(h.t>tot){h.t=0;h.a=h.b;h.b=(h.b+1+Math.floor(Math.random()*2))%P.length;if(h.b===h.a)h.b=(h.a+1)%P.length;return heliPos(h,0)}
  let t=h.t,x=A.x,y=A.y,z=A.z,spin=0;const top=Math.max(A.z,Bp.z)+70;
  if(t<ph[0]){spin=t>ph[0]-1?1:.15}else if((t-=ph[0])<ph[1]){z=A.z+(top-A.z)*(t/ph[1]);spin=1}else if((t-=ph[1])<ph[2]){const u=t/ph[2],e=u*u*(3-2*u);x=A.x+(Bp.x-A.x)*e;y=A.y+(Bp.y-A.y)*e;z=top+Math.sin(u*Math.PI)*20;spin=1}else{t-=ph[2];x=Bp.x;y=Bp.y;z=top+(Bp.z-top)*(t/ph[3]);spin=1}
  return{x,y,z,spin,dir:Math.atan2(Bp.y-A.y,Bp.x-A.x)}}
let hdt=0;
function heli(h){const p=heliPos(h,hdt);if(!p)return;h.p=p;const s=Z;const[gx,gy]=pt(p.x,p.y,0);
  g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(gx,gy,22*s,9*s,0,0,7);g.fill();
  const[x,y]=pt(p.x,p.y,p.z);const dx=Math.cos(p.dir)-Math.sin(p.dir),dy=(Math.cos(p.dir)+Math.sin(p.dir))*.5;const nx=dx/Math.hypot(dx,dy),ny=dy/Math.hypot(dx,dy);
  // Heckausleger
  g.strokeStyle=h.liv;g.lineWidth=3.2*s;g.lineCap='round';g.beginPath();g.moveTo(x,y-6*s);g.lineTo(x-nx*28*s,y-6*s-ny*28*s-4*s);g.stroke();
  g.strokeStyle='#1b1c20';g.lineWidth=1.4*s;g.beginPath();g.moveTo(x-nx*28*s,y-12*s-ny*28*s);g.lineTo(x-nx*28*s,y-2*s-ny*28*s);g.stroke();
  // Kufen
  g.strokeStyle='#2a2b30';g.lineWidth=1.3*s;g.beginPath();g.moveTo(x-10*s,y+2*s);g.lineTo(x+8*s,y+6*s);g.moveTo(x-6*s,y-1*s);g.lineTo(x+12*s,y+3*s);g.stroke();
  // Rumpf mit Glaskanzel
  const bg=g.createLinearGradient(x,y-18*s,x,y);bg.addColorStop(0,'#ffffff');bg.addColorStop(.35,h.liv);bg.addColorStop(1,'#3a2a3a');g.fillStyle=bg;g.beginPath();g.ellipse(x,y-8*s,14*s,8.5*s,Math.atan2(ny,nx),0,7);g.fill();
  g.fillStyle='rgba(30,48,64,.9)';g.beginPath();g.ellipse(x+nx*7*s,y-10*s+ny*7*s,6.5*s,5*s,Math.atan2(ny,nx),0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(x+nx*8*s-2*s,y-12*s+ny*8*s,2.4*s,1.4*s,0,0,7);g.fill();
  // Rotor dreht
  const a=T*(p.spin>.5?28:4);g.strokeStyle='rgba(20,20,24,.75)';g.lineWidth=1.6*s;g.beginPath();
  for(let i=0;i<2;i++){const an=a+i*Math.PI/2;const ux=Math.cos(an)*30*s,uy=Math.sin(an)*15*s;g.moveTo(x-ux,y-19*s-uy);g.lineTo(x+ux,y-19*s+uy)}g.stroke();
  if(p.spin>.5){g.fillStyle='rgba(255,255,255,.08)';g.beginPath();g.ellipse(x,y-19*s,30*s,15*s,0,0,7);g.fill()}
  if(Math.sin(T*6)>0){g.fillStyle='#ff3b48';g.beginPath();g.arc(x-nx*28*s,y-14*s-ny*28*s,1.8*s,0,7);g.fill()}}
// GTA-Minikarte unten links
function radar(){const r=Math.min(78,innerWidth*.16)*DPR,cx=r+18*DPR,cy=H-r-74*DPR;g.save();g.beginPath();g.arc(cx,cy,r,0,7);g.clip();
  g.fillStyle='rgba(14,16,24,.88)';g.fillRect(cx-r,cy-r,2*r,2*r);
  const sc=r/36;const cxw=CX/32,cyw=CY/16;const m=(x,y)=>[cx+((x-y)-cxw)*sc*1.1,cy+((x+y)*.5-cyw*.5)*sc*1.1];
  const mq=(x0,y0,x1,y1,c)=>{g.beginPath();[m(x0,y0),m(x1,y0),m(x1,y1),m(x0,y1)].forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.closePath();g.fillStyle=c;g.fill()};
  mq(-7,-7,49,43,'#3f5a3a');mq(-7,43,49,54,'#2c6d86');mq(-1,-1,43,42,'#6d6878');
  for(let k=0;k<6;k++){mq(8*k,-1,8*k+2,42,'#d8d4dc');mq(-1,8*k,43,8*k+2,'#d8d4dc')}
  B.forEach(b=>mq(b.x+.3,b.y+.3,b.x+3.7,b.y+3.7,'#4a4458'));
  for(const h of HELIS)if(h.p){const[a,b]=m(h.p.x,h.p.y);g.fillStyle='#fff';g.beginPath();g.arc(a,b,3*DPR,0,7);g.fill()}
  if(typeof AFFAERE!=='undefined'&&AFFAERE.an)for(const q of P)if(q.nachbar){const[a,b]=m(q.x,q.y);g.fillStyle='#ff8fc7';g.font=`${10*DPR}px sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText('♥',a,b)}
  const[px,py]=m(ICH.x,ICH.y);g.fillStyle='#ff4fa3';g.beginPath();g.moveTo(px,py-6*DPR);g.lineTo(px+4.5*DPR,py+4*DPR);g.lineTo(px-4.5*DPR,py+4*DPR);g.fill();
  g.restore();g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=3*DPR;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();g.strokeStyle='#ff4fa3';g.lineWidth=1.5*DPR;g.beginPath();g.arc(cx,cy,r+3*DPR,0,7);g.stroke()}
function ampelZ(o){const[x,y]=pt(o.x,o.y);const s=Z;g.strokeStyle='#1b1c20';g.lineWidth=1.6*s;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-30*s);g.stroke();
  for(const[i,ax]of[[0,'y'],[1,'x']]){const l=ampel(o.kx,o.ky,ax);const bx=x+(i?5:-5)*s,by=y-30*s;g.fillStyle='#16171a';g.beginPath();g.roundRect(bx-2.4*s,by-8*s,4.8*s,12*s,1.5*s);g.fill();
    [['r',-5.5],['y',-1.8],['g',1.9]].forEach(([c,dy])=>{const an=l===c;g.fillStyle=an?{r:'#ff3b3b',y:'#ffc93b',g:'#3bff7a'}[c]:'rgba(255,255,255,.12)';g.beginPath();g.arc(bx,by+dy*s,1.3*s,0,7);g.fill();
      if(an){const k=glut({r:'#ff3b3b',y:'#ffc93b',g:'#3bff7a'}[c]);g.drawImage(k,bx-6*s,by+dy*s-6*s,12*s,12*s)}})}}
function schirm(o){const[x,y]=pt(o.x,o.y);const s=Z;g.fillStyle='#f4efe6';g.fillRect(x-6*s,y-2*s,12*s,2.4*s);g.fillStyle='rgba(0,0,0,.15)';g.beginPath();g.ellipse(x+3*s,y+1*s,10*s,4*s,0,0,7);g.fill();
  g.strokeStyle='#8a7a6a';g.lineWidth=1*s;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-20*s);g.stroke();g.fillStyle=o.c;g.beginPath();g.ellipse(x,y-20*s,11*s,4.5*s,0,Math.PI,0);g.fill();g.fillStyle='rgba(0,0,0,.08)';g.beginPath();g.ellipse(x,y-20*s,11*s,1.5*s,0,0,Math.PI);g.fill()}
// Eigene Jacht: die beste gekaufte liegt am Steg, mit Schild
function meineJacht(o){const j=WS.KATALOG.filter(i=>i.kat==='jacht'&&ST.besitz[i.id]).sort((a,c)=>c.rang-a.rang)[0];if(!j)return;const[x,y]=pt(o.x,o.y);
  if(!bootBild(j.boot,'90',x,y+Math.sin(T*1.3)*Z))return;const fs=Math.max(9,10*Z/DPR)*DPR;g.font='700 '+fs+'px Inter';const t='Deine '+j.name;const tw=g.measureText(t).width;
  g.fillStyle='rgba(47,224,210,.92)';g.beginPath();g.roundRect(x-tw/2-6*DPR,y-44*Z-fs,tw+12*DPR,fs+8*DPR,5*DPR);g.fill();g.fillStyle='#062026';g.textAlign='center';g.textBaseline='middle';g.fillText(t,x,y-44*Z-fs/2+4*DPR)}
function cafe(o){const[x,y]=pt(o.x,o.y);const s=Z;g.fillStyle='rgba(0,0,0,.15)';g.beginPath();g.ellipse(x+2*s,y+1*s,12*s,5*s,0,0,7);g.fill();
  for(const k of[-1,1]){g.fillStyle='#2a2b30';g.fillRect(x+k*6*s-1.5*s,y-6*s,3*s,6*s);g.fillStyle='#f4efe6';g.fillRect(x+k*6*s-2*s,y-7*s,4*s,1.4*s)}
  g.fillStyle='#d8d2c8';g.fillRect(x-.6*s,y-9*s,1.2*s,9*s);g.fillStyle='#f4f1ec';g.beginPath();g.ellipse(x,y-9*s,4.6*s,1.8*s,0,0,7);g.fill();
  if(o.gast)FG.zeichne(g,x+7*s,y+1*s,s*.62,o.gast,T,false);
  g.strokeStyle='#8a7a6a';g.lineWidth=.9*s;g.beginPath();g.moveTo(x,y-9*s);g.lineTo(x,y-26*s);g.stroke();
  g.fillStyle=o.farbe;g.beginPath();g.moveTo(x-13*s,y-20*s);g.quadraticCurveTo(x,y-31*s,x+13*s,y-20*s);g.lineTo(x+13*s,y-19*s);g.lineTo(x-13*s,y-19*s);g.fill();
  g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.moveTo(x-13*s,y-20*s);g.quadraticCurveTo(x-5*s,y-28*s,x,y-29*s);g.lineTo(x-2*s,y-20*s);g.fill()}
function beet(o){const w=o.quer?.8:.25,d=o.quer?.25:.8;const f={x:o.x,y:o.y,w,d};fL(f,0,w,0,3,'#e9e2d8');fR(f,0,d,0,3,'#d6cec3');top4(o.x,o.y,w,d,3,'#4f7a42');
  for(let i=0;i<5;i++){const[px,py]=pt(o.x+(o.quer?.1+i*.15:.12),o.y+(o.quer?.12:.1+i*.15),4);g.fillStyle=['#ff7eb6','#ffd166','#ffffff','#ff4fa3','#c8b6e2'][i];g.beginPath();g.arc(px,py,1.3*Z,0,7);g.fill()}}
function bank(o){const f={x:o.x,y:o.y,w:.18,d:.6};fL(f,0,.18,2,3,'#7a5236');fR(f,0,.6,2,3,'#6a4630');top4(o.x,o.y,.18,.6,3,'#9a6a46');const r={x:o.x-.05,y:o.y,w:.05,d:.6};fR(r,0,.6,3,6,'#7a5236');
  for(const v of[.08,.5]){const[px,py]=pt(o.x+.09,o.y+v,0);g.fillStyle='#2a2b30';g.fillRect(px-.6*Z,py-2*Z,1.2*Z,2*Z)}}
const DRAW={tree,palm,fount,yacht,lamp,ampel:ampelZ,schirm,meinejacht:meineJacht,cafe,beet,bank};
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;hdt=dt;if(ZIEL){CX+=(ZIEL.cx-CX)*.08;CY+=(ZIEL.cy-CY)*.08;Z+=(ZIEL.z-Z)*.08;if(Math.abs(ZIEL.z-Z)<.01&&Math.abs(ZIEL.cx-CX)<1)ZIEL=null}
  for(const p of P){if(p.ctrl){gehen(p,dt)}else if(p.live){const k=Math.min(1,dt*8);p.x+=(p.zx-p.x)*k;p.y+=(p.zy-p.y)*k}else if(EVENT&&EVENT.promi===p){p.idle=1}else if(p.prom){p.x+=p.v*dt;if(p.x>X1)p.x=X0;if(p.x<X0)p.x=X1}else{p.s+=p.v*dt;const[a,b]=onLoop(p.lp,p.s);p.x=a;p.y=b}}
  rufFahren(dt); bootWeiter(dt); if((frame.p=(frame.p||0)+dt)>.5){frame.p=0;partyWeiter()}
  // Setcard folgt dem Fahrzustand: aussteigen zeigt wieder "rufen"
  {const z=`${!!ICH.faehrt}|${!!RUF}|${!!INNEN}`;if(z!==frame.z){frame.z=z;karten()}}
  verkehr(dt);for(const o of SCHIFFE){o.x+=o.v*dt*.6;if(o.x>X1-1)o.x=X0+1;if(o.x<X0+1)o.x=X1-1}
  zeitWeiter(dt);wetterWeiter(dt);eventsWeiter(dt);if((frame.u=(frame.u||0)+dt)>1){frame.u=0;const k=WS.lohnStufe(ST.tage);document.getElementById('hTag').textContent=`TAG ${ST.tage+1} · ${k.titel.toUpperCase()} · ${uhrText()}`}
  // 3D-Stadt (src/drei): zeichnet alles außer Innenräumen. Die 2D-Fläche bleibt darüber für Minikarte und Regen.
  // Bis die 3D-Stadt geladen ist (höchstens 6 Sekunden), keine 2D-Stadt zeichnen: sonst lädt sie alle Autobilder umsonst
  if(!INNEN&&!(window.DREI&&DREI.an)&&(frame.warte=(frame.warte||0)+dt)<6){g.clearRect(0,0,W,H);requestAnimationFrame(frame);return}
  if(window.DREI&&DREI.an&&(!INNEN||etagen(INNEN)[INNEN.stock||0].a==='home')){cv.style.pointerEvents='none';g.clearRect(0,0,W,H);DREI.zeichne(dt);wetterZeichnen();radar();requestAnimationFrame(frame);return}
  cv.style.pointerEvents='';himmel();
  bodenZeichnen();bodenBewegt();
  const sicht=(o,m)=>{const q=pt(o.x,o.y);return q[0]>-m&&q[0]<W+m&&q[1]>-m*.6&&q[1]<H+m*1.6};
  const dyn=[...SCHIFFE.map(o=>({o,f:schiff})),...S.filter(o=>1).map(o=>({o,f:DRAW[o.k]})),...YACHT.map(o=>({o,f:yacht})),...P.filter(o=>!(INNEN&&o===ICH)).map(o=>({o,f:person})),{o:PARK_ICH,f:meinAuto},...CARS.map(o=>({o,f:car}))];
  {const m=140*Z;for(let i=dyn.length-1;i>=0;i--){const o=dyn[i].o;if(!sicht(o,o.L?420*Z:m))dyn.splice(i,1)}}
  const slots=B.map(()=>[]),post=[];
  for(const d of dyn){const k=B.findIndex(b=>!front(d.o,b));(k<0?post:slots[k]).push(d)}
  const ds=a=>a.sort((u,v)=>(u.o.x+u.o.y)-(v.o.x+v.o.y)).forEach(d=>d.f(d.o));
  B.forEach((b,i)=>{ds(slots[i]);bld(b)});ds(post);B.forEach(b=>b!==INNEN&&topSign(b));if(typeof boutiqueBlase==='function'&&!INNEN)boutiqueBlase();rufZeichnen();HELIS.forEach(heli);nacht();wetterZeichnen();eventZeichnen();if(INNEN){g.fillStyle='rgba(10,10,18,.5)';g.fillRect(0,0,W,H);innen(INNEN);if(AUFZUG){g.fillStyle='rgba(8,8,12,.6)';g.fillRect(0,0,W,H)}}radar();
  requestAnimationFrame(frame)}
