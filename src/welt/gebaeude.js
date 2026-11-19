// Berlin City · gebaeude.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Gebäude ----------
const lit=(a,b,c)=>((a*7+b*3+c*5)%5)>1;
function glassFace(f,side,z0,z1,kind){const len=side==='L'?f.w:f.d;const F=side==='L'?fL:fR;
  const pal=kind==='clinic'?(side==='L'?['#cfe0ec','#7d98ae']:['#a3bccf','#5a748a']):(side==='L'?['#a9c3d8','#3f5870']:['#7f9bb3','#2c4257']);
  F(f,0,len,z0,z1,grad(f,side,z0,z1,pal[0],pal[1]));
  const n=Math.round((z1-z0)/FH);
  for(let fl=0;fl<n;fl++){const z=z0+fl*FH;for(let i=0;i<len*2;i++)if(lit(fl,i,Math.round(f.x*3+f.y)+(side==='L'?0:7))){if((fl*3+i)%3!==1)F(f,i*.5+.04,i*.5+.46,z+3,z+FH-3,side==='L'?'rgba(255,226,180,.45)':'rgba(255,226,180,.32)')}
    F(f,0,len,z+FH-1.4,z+FH,'#05070a')}
  g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=Math.max(.6,.6*Z);g.beginPath();
  for(let i=0;i<=len*2;i++){const[a,b]=side==='L'?pt(f.x+i*.5,f.y+f.d,z0):pt(f.x+f.w,f.y+f.d-i*.5,z0);const[c,d]=side==='L'?pt(f.x+i*.5,f.y+f.d,z1):pt(f.x+f.w,f.y+f.d-i*.5,z1);g.moveTo(a,b);g.lineTo(c,d)}g.stroke();
  sheen(f,side,z0,z1);edges(f,side,z0,z1)}
// Glanz: ein weicher diagonaler Lichtstreif, wie poliertes Glas
function sheen(f,side,z0,z1){const len=side==='L'?f.w:f.d,F=side==='L'?fL:fR;const u=len*.62,w=len*.16;
  F(f,u,u+w,z0,z1,side==='L'?'rgba(255,255,255,.13)':'rgba(255,255,255,.08)');F(f,u+w*.25,u+w*.45,z0,z1,'rgba(255,255,255,.12)')}
// Schwarze, glänzende Kanten an den Ecken
function edges(f,side,z0,z1){const len=side==='L'?f.w:f.d,F=side==='L'?fL:fR;F(f,0,.07,z0,z1,'#07090c');F(f,len-.07,len,z0,z1,'#0b0e12');F(f,len-.05,len-.03,z0,z1,'rgba(255,255,255,.18)')}
// Schatten der Sonne: Richtung und Länge nach Uhrzeit, ein Pfad, damit sich nichts doppelt abdunkelt
function schatten(b){const h=typeof stunde==='function'?stunde():15;if(h<6.5||h>19.8)return;const u=(h-6.5)/13.3,hoch=Math.sin(u*Math.PI);
  const len=Math.min(14,b.h/(hoch*55+9)),dx=(u-.5)*-2*len,dy=len*.55,x=b.x,y=b.y;
  const P=[[x,y],[x+4,y],[x+4,y+4],[x,y+4]],Q=P.map(([a,c])=>[a+dx,c+dy]);g.beginPath();
  const pfad=pk=>{const s=pk.map(([a,c])=>pt(a,c));g.moveTo(s[0][0],s[0][1]);for(let i=1;i<s.length;i++)g.lineTo(s[i][0],s[i][1]);g.closePath()};
  pfad(Q);for(let i=0;i<4;i++){const j=(i+1)%4;pfad([P[i],P[j],Q[j],Q[i]])}
  g.fillStyle=`rgba(40,20,70,${.16+.1*(1-hoch)})`;g.fill('nonzero')}
function podium(b){const p=b.pod,f=b,top=b.ph;
  quad(f.x-.35,f.y-.35,f.x+4.35,f.y+4.35,'rgba(30,20,40,.10)');quad(f.x-.15,f.y-.15,f.x+4.15,f.y+4.15,'rgba(30,20,40,.12)');
  schatten(b);
  if(p.style==='beton'){beton(b);return}
  if(p.style==='deko'){deko(b);return}
  // Durchgehend Glas: Einkaufszentrum unten im selben Blau wie der Turm, Läden innen warm beleuchtet
  for(const side of['L','R']){const F=side==='L'?fL:fR;
    F(f,0,4,0,top-PAR,grad(f,side,0,top-PAR,side==='L'?'#9fb9cf':'#7a95ac',side==='L'?'#3a5269':'#283c50'));
    for(let fl=0;fl<p.fl;fl++){const z0=fl?GF+(fl-1)*FH:0,z1=fl?z0+FH:GF;
      if(fl===0)F(f,.04,3.96,z0+1,z1-2,grad(f,side,z0+1,z1-2,'rgba(30,40,50,.25)',side==='L'?'rgba(255,214,160,.9)':'rgba(255,214,160,.7)'));
      else for(let i=0;i<8;i++)if((fl+i)%3===0)F(f,i*.5+.04,i*.5+.46,z0+3,z1-3,'rgba(255,214,160,.28)');
      F(f,0,4,z1-1.4,z1,'#05070a')}
    g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=Math.max(.6,.6*Z);g.beginPath();
    for(let i=0;i<=8;i++){const[a,c]=side==='L'?pt(f.x+i*.5,f.y+4,0):pt(f.x+4,f.y+4-i*.5,0);const[d,e]=side==='L'?pt(f.x+i*.5,f.y+4,top-PAR):pt(f.x+4,f.y+4-i*.5,top-PAR);g.moveTo(a,c);g.lineTo(d,e)}g.stroke();
    F(f,0,4,top-PAR,top,grad(f,side,top-PAR,top,'#2a2e34','#050608'));F(f,0,4,top-PAR,top-PAR+.9,'#ff5a8f');F(f,0,4,top-1,top,'#ff5a8f');
    sheen(f,side,0,top);edges(f,side,0,top)}
  // Ladenschilder auf der Fassade
  const gross=b.tow||p.fl>=2;for(const[side,u0,u1,br]of p.shops){if(gross&&GLOW[br])continue;faceT(f,side,(u0+u1)/2,top-PAR/2-.5);brand(br,(u1-u0)*35.78*.86,11);g.setTransform(1,0,0,1,0,0)}
  solar(f.x,f.y,4,4,top)}
// Beton am Gleis: Koloss aus einem alten Heizkraftwerk, fast fensterlos, hohe schmale Schlitze, Treppenturm, rotes Licht über der Tür
function beton(b){const p=b.pod,f=b,top=b.ph,c=p.farbe||'#8a8781',neon=p.neon||'#ff3b2f';
  for(const side of['L','R']){const F=side==='L'?fL:fR;
    F(f,0,4,0,top,grad(f,side,0,top,sh(c,side==='L'?1.04:.88),sh(c,side==='L'?.84:.70)));
    for(let i=1;i<8;i++)F(f,i*.5-.03,i*.5+.03,2.4,top-PAR,'rgba(0,0,0,.16)');
    for(let i=1;i<7;i+=2)F(f,i*.5+.14,i*.5+.36,top*.5,top-PAR-2,i%4===1?`rgba(255,70,45,${.3+.14*Math.sin(T*2+i)})`:`rgba(255,186,104,${.44+.12*Math.sin(T*1.6+i)})`);
    F(f,0,4,0,2.4,sh(c,.6));F(f,0,4,top-PAR,top,sh(c,.76));F(f,0,4,top-1.1,top,sh(c,1.1))}
  fL(f,1.4,2.4,0,9,'#15141a');fL(f,1.4,2.4,8.6,9,neon);
  const tt={x:f.x+.2,y:f.y+.2,w:1.1,d:1.1};fL(tt,0,1.1,0,top+16,sh(c,.98));fR(tt,0,1.1,0,top+16,sh(c,.78));top4(tt.x,tt.y,1.1,1.1,top+16,sh(c,1.06));
  top4(f.x,f.y,4,4,top,sh(c,1.02));top4(f.x+.25,f.y+.25,3.5,3.5,top,sh(c,.88))}
// Art déco an der Promenade: Pastellfassade, weiße Gesimsbänder, Bullaugen, abgestufte Attika, Neonkante und Neon-Turm
function deko(b){const p=b.pod,f=b,top=b.ph,c=p.farbe,neon=p.neon;
  for(const side of['L','R']){const F=side==='L'?fL:fR;
    F(f,0,4,0,top,grad(f,side,0,top,sh(c,side==='L'?1.06:.92),sh(c,side==='L'?.92:.8)));
    for(let fl=0;fl<p.fl;fl++){const z0=fl?GF+(fl-1)*FH:0,z1=fl?z0+FH:GF;
      if(fl===0){for(let i=0;i<4;i++)F(f,i+.12,i+.88,z0+2,z1-6,grad(f,side,z0+2,z1-6,'rgba(30,60,80,.55)','rgba(255,214,160,.9)'))}
      else{F(f,.3,3.7,z0+6,z0+13,'rgba(30,60,90,.75)');for(let i=0;i<3;i++)F(f,.6+i*1.4,.85+i*1.4,z0+6,z0+13,sh(c,1.08))}
      F(f,0,4,z1-2.2,z1,'#ffffff')}
    F(f,0,4,top-PAR,top,'#ffffff');F(f,.3,3.7,top-PAR+3,top-PAR+5,sh(c,.9));
    F(f,0,4,top-1.2,top,neon)}
  // abgestufte Attika in der Mitte
  const m={x:f.x+1.2,y:f.y+1.2,w:1.6,d:1.6};fL(m,0,1.6,top,top+14,'#ffffff');fR(m,0,1.6,top,top+14,'#ece6ea');top4(m.x,m.y,1.6,1.6,top+14,sh(c,1.05));
  fL(m,0,1.6,top+12,top+14,neon);fR(m,0,1.6,top+12,top+14,neon);
  top4(f.x,f.y,4,4,top,sh(c,1.12));top4(f.x+.2,f.y+.2,3.6,3.6,top,'#e9dccf');
  for(const[u,v]of[[.5,.5],[3.3,.6],[.6,3.2]]){const k={x:f.x+u,y:f.y+v,w:.3,d:.3};fL(k,0,.3,top,top+4,'#f4efe6');fR(k,0,.3,top,top+4,'#ddd6cc');palm({x:k.x+.15,y:k.y+.15,z:top+4,s:.55})}
  // Neon-Turm an der Vorderkante
  const t={x:f.x+3.75,y:f.y+3.75,w:.25,d:.25};fL(t,0,.25,top,top+38,'#ffffff');fR(t,0,.25,top,top+38,'#e6e0e4');fL(t,.05,.2,top+4,top+36,neon);fR(t,.05,.2,top+4,top+36,neon);
  const[nx,ny]=pt(f.x+4,f.y+4,top+20);g.save();g.globalCompositeOperation='lighter';g.globalAlpha=.55;g.drawImage(glut(neon),nx-14*Z,ny-26*Z,28*Z,52*Z);g.restore();
  const gross=b.tow||p.fl>=2;for(const[side,u0,u1,br]of p.shops){if(gross&&GLOW[br])continue;faceT(f,side,(u0+u1)/2,top-PAR/2-.5);brand(br,(u1-u0)*35.78*.86,11);g.setTransform(1,0,0,1,0,0)}}
// Solardach: dunkelblaue Module im Raster
function solar(x,y,w,d,z){top4(x,y,w,d,z,'#d9dde2');top4(x+.1,y+.1,w-.2,d-.2,z,'#1a2533');
  const n=Math.max(1,Math.round((w-.2)/.5)),m=Math.max(1,Math.round((d-.2)/.5)),cw=(w-.2)/n,cd=(d-.2)/m;
  for(let i=0;i<n;i++)for(let j=0;j<m;j++)top4(x+.1+i*cw+.03,y+.1+j*cd+.03,cw-.06,cd-.06,z,(i+j)%4?'#25405f':'#2f5076')}
function balkone(f,z0,fl){for(let i=1;i<fl;i+=2){const z=z0+i*FH;const s={x:f.x,y:f.y+f.d,w:f.w,d:.22},r={x:f.x+f.w,y:f.y,w:.22,d:f.d};
  top4(f.x,f.y+f.d,f.w,.22,z,'#efe9e2');fL(s,0,f.w,z-1.4,z,'#d9d2c8');fL(s,0,f.w,z,z+5,'rgba(190,225,245,.35)');fL(s,0,f.w,z+4.6,z+5.2,'#ffffff');
  top4(f.x+f.w,f.y,.22,f.d,z,'#e3ddd5');fR(r,0,f.d,z-1.4,z,'#c9c2b8');fR(r,0,f.d,z,z+5,'rgba(170,205,230,.3)');fR(r,0,f.d,z+4.6,z+5.2,'#f4f1ec');
  if((i+Math.round(f.x))%4===1){const[px,py]=pt(f.x+.4,f.y+f.d+.1,z+5);g.fillStyle='#4f8a46';g.beginPath();g.arc(px,py,2.6*Z,0,7);g.arc(px+5*Z,py+1*Z,2.2*Z,0,7);g.fill()}}}
function tower(b){const t=b.tow;let f={x:b.x+t.ox,y:b.y+t.oy,w:t.w,d:t.d};let z0=b.ph,z1=z0+t.fl*FH;
  glassFace(f,'L',z0,z1,t.kind);glassFace(f,'R',z0,z1,t.kind);if(t.kind==='res')balkone(f,z0,t.fl);
  if(t.led){const u0=.25,u1=f.w-.25,za=z0+FH*2,zb=z0+FH*7;fL(f,u0,u1,za,zb,'#0b1016');
    faceT(f,'L',u0,zb);g.save();g.beginPath();g.rect(0,0,(u1-u0)*35.78,zb-za);g.clip();
    g.fillStyle='#8fe3f0';g.font='700 15px Inter';g.textBaseline='middle';const msg='RANKING HEUTE   #1 @valentina 9.840 STIL   #2 @mila 9.512   #3 @jonas.lift 8.990   NEU: ABSTIMMUNG LÄUFT   ';
    const w=g.measureText(msg).width,o=-(T*40%w);g.fillText(msg+msg,o,(zb-za)*.35);g.fillStyle='#d8c39a';g.font='500 22px Bodoni Moda';g.fillText('Berlin City',8+((T*12)%60),(zb-za)*.75);g.restore();g.setTransform(1,0,0,1,0,0)}
  if(t.tier){fL(f,0,f.w,z1-1,z1+1,t.crown);fR(f,0,f.d,z1-1,z1+1,t.crown);top4(f.x,f.y,f.w,f.d,z1,'#4a5a64');
    const i=t.tier.ins;f={x:f.x+i,y:f.y+i,w:f.w-2*i,d:f.d-2*i};z0=z1;z1=z0+t.tier.fl*FH;glassFace(f,'L',z0,z1,t.kind);glassFace(f,'R',z0,z1,t.kind)}
  // leuchtende Krone
  fL(f,0,f.w,z1-4,z1,'#0a0c0f');fR(f,0,f.d,z1-4,z1,'#06080a');fL(f,0,f.w,z1-1,z1,'#ff5a8f');fR(f,0,f.d,z1-1,z1,'#e0609c');
  if(t.kind==='res'&&(b.x+b.y)%16!==3){top4(f.x,f.y,f.w,f.d,z1,'#ece6dd');top4(f.x+.5,f.y+.5,f.w-1,1.6,z1,'#ffffff');const pg=g.createLinearGradient(...pt(f.x+.6,f.y+.6,z1),...pt(f.x+f.w-.6,f.y+2,z1));pg.addColorStop(0,'#4fd6e6');pg.addColorStop(1,'#1d9db8');top4(f.x+.6,f.y+.6,f.w-1.2,1.4,z1,pg);
    for(let i=0;i<3;i++){const[a,c]=pt(f.x+.9+i*.8,f.y+1.1,z1);g.fillStyle=`rgba(255,255,255,${.3+.3*Math.sin(T*2+i)})`;g.fillRect(a-3*Z,c,6*Z,.8*Z)}
    for(let i=0;i<3;i++)kiste(f.x+.6+i*.9,f.y+2.5,.6,.25,2,i%2?'#ff5a8f':'#f4efe6',z1);solar(f.x+.4,f.y+3,f.w-.8,f.d-3.4,z1)}
  else solar(f.x,f.y,f.w,f.d,z1);
  if(t.spire){const[a,c]=pt(f.x+f.w/2,f.y+f.d/2,z1),[d,e]=pt(f.x+f.w/2,f.y+f.d/2,z1+90);g.strokeStyle='#cfd8de';g.lineWidth=2*Z;g.beginPath();g.moveTo(a,c);g.lineTo(d,e);g.stroke();
    g.fillStyle=`rgba(255,80,80,${.5+.5*Math.sin(T*3)})`;g.beginPath();g.arc(d,e,2.4*Z,0,7);g.fill()}
  b.topZ=z1;b.topF=f}
// Werbetafeln: Bild links, Text rechts, feiner Rahmen, Lichtschimmer. Motive aus der Stadt selbst.
const WERBUNG=[
 {bg:['#0b0b0d','#1d1a22'],rand:'#e6c76a',marke:'TESLO',titel:'Er fliegt.',zeile:'Roadster · ab Arbeitstag 730',f:'#ffffff',bild:'auto5'},
 {bg:['#f6efe4','#e8dccb'],rand:'#b5793a',marke:'MAISON DU SAC',titel:'Hermez Birkinn',zeile:'Nur 3 diese Woche · Warteliste',f:'#2a1d12',bild:'birkinn'},
 {bg:['#1a0c18','#3a1430'],rand:'#ff4fa3',marke:'GLOW CITY',titel:'Black Card',zeile:'Valentina hat sie. Und du?',f:'#ffffff',bild:'valentina'},
 {bg:['#0e1f22','#0b2e33'],rand:'#81d8d0',marke:'TIFFANNY & CO.',titel:'Diamant 3 Karat',zeile:'Warteliste 21 Tage',f:'#e9fbf9',bild:'diamant'},
 {bg:['#f4f6f7','#dfe6ea'],rand:'#9fb6bf',marke:'DR. GLATT',titel:'Dein bester Glow',zeile:'Botox ab 390 € · fast ausgebucht',f:'#1d2b33',bild:'flakon'},
 {bg:['#140c12','#2a0f1d'],rand:'#ff5a8f',marke:'LAMBORGIA',titel:'Furioso in Rosa',zeile:'Jetzt bei Spree Motors',f:'#ffffff',bild:'auto4'},
 {bg:['#0a2a2c','#064046'],rand:'#2fe0d2',marke:'SCORPIUS',titel:'Sunset Club',zeile:'Jacht-Charter ab 2.500 €',f:'#ffffff',bild:'sonne'}];
const TAFELN=new Set(['Scorpius Berlin','Villa Palms','Borchert',"Ryotei 398",'Papillong','Grill Royale','Kiez Gym','Health Hub','Markthalle Zehn']);
function werbeBild(w,x0,y0,bw,bh){g.save();g.beginPath();g.rect(x0,y0,bw,bh);g.clip();
  const sp=SPR;const cx=x0+bw/2,cy=y0+bh/2;
  if(w.bild==='auto5'||w.bild==='auto4'){const im=sp[w.bild==='auto5'?'5':'4']&&sp[w.bild==='auto5'?'5':'4']['90'];
    const gl=g.createRadialGradient(cx,cy+bh*.25,1,cx,cy+bh*.25,bw*.6);gl.addColorStop(0,w.rand+'88');gl.addColorStop(1,w.rand+'00');g.fillStyle=gl;g.fillRect(x0,y0,bw,bh);
    if(im&&im.naturalWidth){const sc=bw*1.15/im.naturalWidth;g.drawImage(im,cx-im.naturalWidth*sc/2,cy-im.naturalHeight*sc/2+bh*.06,im.naturalWidth*sc,im.naturalHeight*sc)}}
  else if(w.bild==='birkinn'){g.fillStyle='rgba(181,121,58,.18)';g.beginPath();g.ellipse(cx,cy+bh*.36,bw*.38,bh*.06,0,0,7);g.fill();FG.tasche(g,FG.TASCHE.birkinn,cx,cy-bh*.12,bh/8.4)}
  else if(w.bild==='valentina'){const v=FG.CHARS.find(c=>c.id==='valentina');FG.zeichne(g,cx,y0+bh*1.18,bh/24,Object.assign({ph:1},v),T,false)}
  else if(w.bild==='diamant'){const r=bh*.3;g.save();g.translate(cx,cy);g.strokeStyle='#f2c14e';g.lineWidth=bh*.05;g.beginPath();g.arc(0,r*.55,r*.55,0,7);g.stroke();
    g.fillStyle='#e9fbf9';g.beginPath();g.moveTo(-r*.45,-r*.2);g.lineTo(r*.45,-r*.2);g.lineTo(0,r*.25);g.closePath();g.fill();g.fillStyle='#bfeee9';g.beginPath();g.moveTo(-r*.45,-r*.2);g.lineTo(-r*.25,-r*.5);g.lineTo(r*.25,-r*.5);g.lineTo(r*.45,-r*.2);g.fill();
    for(let i=0;i<4;i++){const a=T*1.5+i*1.6;g.fillStyle=`rgba(255,255,255,${.5+.5*Math.sin(T*4+i)})`;g.beginPath();g.arc(Math.cos(a)*r*.7,Math.sin(a)*r*.5-r*.3,bh*.02,0,7);g.fill()}g.restore()}
  else if(w.bild==='flakon'){g.save();g.translate(cx,cy);const h=bh*.55;const gr=g.createLinearGradient(-h*.3,0,h*.3,0);gr.addColorStop(0,'#cfdde4');gr.addColorStop(.5,'#ffffff');gr.addColorStop(1,'#a9bec9');
    g.fillStyle=gr;g.beginPath();g.roundRect(-h*.28,-h*.15,h*.56,h*.62,h*.08);g.fill();g.fillStyle='#e6c76a';g.fillRect(-h*.1,-h*.32,h*.2,h*.17);g.fillStyle='#1d2b33';g.font=`600 ${h*.09}px Inter`;g.textAlign='center';g.fillText('GLOW',0,h*.2);g.restore()}
  else if(w.bild==='sonne'){const gr=g.createLinearGradient(0,y0,0,y0+bh);gr.addColorStop(0,'#ff5a8f');gr.addColorStop(.55,'#ffd166');gr.addColorStop(.56,'#2fe0d2');gr.addColorStop(1,'#064046');g.fillStyle=gr;g.fillRect(x0,y0,bw,bh);
    g.fillStyle='#fff3c4';g.beginPath();g.arc(cx,y0+bh*.55,bh*.22,Math.PI,0);g.fill();g.fillStyle='rgba(6,64,70,.9)';for(let i=0;i<4;i++)g.fillRect(x0,y0+bh*(.6+i*.09),bw,bh*.025)}
  g.restore()}
function tafel(b){if(!TAFELN.has(b.title))return;const z0=(b.topZ||b.ph),bw=3.5,bh=40,f={x:b.x+.25,y:b.y+.9,w:bw,d:0},zl=z0+10;
  // Gerüst: zwei Stützen, Laufsteg
  g.strokeStyle='#26272c';g.lineWidth=2.2*Z;g.beginPath();for(const u of[.5,bw-.5]){const[a,c]=pt(f.x+u,f.y,z0),[d_,e]=pt(f.x+u,f.y,zl);g.moveTo(a,c);g.lineTo(d_,e)}g.stroke();
  fL(f,-.1,bw+.1,zl-3,zl-1.5,'#2a2b30');
  const i=(Math.floor(T/7)+[...b.title].length)%WERBUNG.length,w=WERBUNG[i];
  fL(f,-.08,bw+.08,zl-1,zl+bh+1,'#0d0d10');faceT(f,'L',0,zl+bh);const W_=bw*35.78;
  const gr=g.createLinearGradient(0,0,W_,bh);gr.addColorStop(0,w.bg[0]);gr.addColorStop(1,w.bg[1]);g.fillStyle=gr;g.fillRect(0,0,W_,bh);
  werbeBild(w,0,0,W_*.44,bh);
  // Text rechts: Marke klein gesperrt, Titel in Bodoni, Zeile darunter
  const tx=W_*.48,tw=W_*.48;g.textAlign='left';g.textBaseline='alphabetic';
  const fit=(t,font,size,max)=>{g.font=font.replace('S',size+'px');const m=g.measureText(t).width;if(m>max)g.font=font.replace('S',size*max/m+'px')};
  g.fillStyle=w.rand;g.letterSpacing='1.4px';fit(w.marke,'700 S Inter',4.6,tw);g.fillText(w.marke,tx,bh*.28);g.letterSpacing='0px';
  g.fillStyle=w.f;fit(w.titel,'500 S Bodoni Moda',11,tw);g.fillText(w.titel,tx,bh*.6);
  g.globalAlpha=.85;fit(w.zeile,'500 S Inter',4.4,tw);g.fillText(w.zeile,tx,bh*.82);g.globalAlpha=1;
  // Rahmen und Lichtschimmer
  g.strokeStyle=w.rand;g.lineWidth=.8;g.strokeRect(1.4,1.4,W_-2.8,bh-2.8);
  const sx=((T*18)%(W_*2.2))-W_*.6;const sh_=g.createLinearGradient(sx,0,sx+W_*.25,bh);sh_.addColorStop(0,'rgba(255,255,255,0)');sh_.addColorStop(.5,'rgba(255,255,255,.16)');sh_.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=sh_;g.fillRect(0,0,W_,bh);
  g.setTransform(1,0,0,1,0,0);
  // Strahler auf dem Laufsteg leuchten nach oben
  for(const u of[.4,bw/2,bw-.4]){const[lx,ly]=pt(f.x+u,f.y,zl);g.fillStyle='#1b1c20';g.fillRect(lx-2*Z,ly-2*Z,4*Z,3*Z);const q=g.createRadialGradient(lx,ly-12*Z,0,lx,ly-12*Z,18*Z);q.addColorStop(0,'rgba(255,244,225,.35)');q.addColorStop(1,'rgba(255,244,225,0)');g.fillStyle=q;g.beginPath();g.arc(lx,ly-12*Z,18*Z,0,7);g.fill()}}
function bld(b){if(b===INNEN)return;{const a=pt(b.x,b.y+4),c=pt(b.x+4,b.y),t=pt(b.x+4,b.y+4,0),o=pt(b.x,b.y,b.h+90);if(c[0]<-30||a[0]>W+30||t[1]<-30||o[1]>H+30)return}const hinter=!INNEN&&ICH.x<b.x+b.w+.2&&ICH.y<b.y+b.d+.2&&ICH.x>b.x-7&&ICH.y>b.y-7&&Math.abs((ICH.x-ICH.y)-(b.x-b.y))<5;if(hinter)g.globalAlpha=.32;podium(b);if(b.tow)tower(b);bigSigns(b);eingang(b);tafel(b);g.globalAlpha=1;if(sel===b)top4(b.x,b.y,4,4,b.ph,'rgba(143,227,240,.25)')}
// Eingang: Vordach mit warmem Licht darunter, zwei Pflanzkübel mit Buchs
function eingang(b){const x=b.x+1.45,y=b.y+4,w=1.1,z=GF-5;const d={x,y,w,d:.38};
  top4(x,y,w,.38,z,'#16171a');fL(d,0,w,z-1.2,z,'#0b0c0f');fL(d,0,w,z-1.2,z-.6,b.pod.neon||'#d8c39a');
  const[lx,ly]=pt(x+w/2,y+.2,z-2);g.save();g.globalCompositeOperation='lighter';g.globalAlpha=.5;g.drawImage(glut('#ffd9a0'),lx-16*Z,ly-6*Z,32*Z,22*Z);g.restore();
  for(const u of[-.3,w+.05]){const k={x:x+u,y:y+.08,w:.25,d:.25};fL(k,0,.25,0,4,'#f4efe6');fR(k,0,.25,0,4,'#ddd6cc');top4(k.x,k.y,.25,.25,4,'#3f6b3a');const[px,py]=pt(k.x+.12,k.y+.12,4);g.fillStyle='#4f8a46';g.beginPath();g.arc(px,py-2*Z,3.4*Z,0,7);g.fill()}}
// Große Leuchtreklame: pro Laden ein Markenemblem über den Schaufenstern, leuchtend
const GLOW={arena:'#ff6f9c',jets:'#e6c76a',tif:'#81d8d0',seph:'#ffffff',vic:'#ff6f9c',lulu:'#ff5a5a',spa:'#e6c76a',salon:'#f4efe6',apfel:'#ffffff',nicky:'#2fe0d2',bout:'#ff4fa3',motors:'#e8eef5',sac:'#e8d5a8',prado:'#e8d5a8',shan:'#ffffff',zahra:'#ffffff',doug:'#9ad8c8',star:'#4fd19a',klinik:'#cfe8f5',lab:'#ff8a80',mehr:'#ffffff',mcf:'#ffd400',ross:'#ff5a6e',dn:'#ffc94d',lid:'#ffd400',borch:'#e8d5a8',hug:'#ffb3b3',riva:'#bfe0ff',boot:'#b9a6ff'};
function bigSigns(b){const p=b.pod;let za,zb;
  if(b.tow){za=b.ph+3;zb=b.ph+2*FH-3}else if(p.fl>=2){za=GF+2;zb=b.ph-PAR-2}else return;
  for(const[side,u0,u1,br]of p.shops){if(!GLOW[br])continue;const f={x:b.x,y:b.y,w:4,d:4};const w=(u1-u0)*35.78*.84,h=Math.min(zb-za,w*.42);
    const F=side==='L'?fL:fR;F(f,u0+.12,u1-.12,(za+zb)/2-h/2-2,(za+zb)/2+h/2+2,'rgba(8,10,14,.9)');
    faceT(f,side,(u0+u1)/2,(za+zb)/2);g.shadowColor=GLOW[br];g.shadowBlur=14*Z;brand(br,w*.94,h*.86);g.shadowBlur=0;g.setTransform(1,0,0,1,0,0)}}
function rr(x,y,w,h,r){g.beginPath();g.roundRect(x,y,w,h,r)}
// Markenzeichen, gezeichnet um den Mittelpunkt (0,0), Breite w, Höhe h
function brand(k,w,h){g.textAlign='center';g.textBaseline='middle';
  const plate=(bg,line)=>{g.fillStyle=bg;rr(-w/2,-h/2,w,h,1.5);g.fill();if(line){g.fillStyle=line;g.fillRect(-w/2,h/2-1.2,w,1.2)}};
  const txt=(t,font,c,sp=0,y=.5,size=h*.62)=>{g.font=font.replace('S',size.toFixed(1)+'px');g.letterSpacing=sp+'px';let m=g.measureText(t).width;if(m>w*.84){size*=w*.84/m;g.font=font.replace('S',size.toFixed(1)+'px')}g.fillStyle=c;g.fillText(t,0,y);g.letterSpacing='0px'};
  switch(k){
   case'prado':plate('#111','#c9b48a');txt('PRADO','600 S Bodoni Moda','#fff',3);break;
   case'shan':plate('#f6f3ee');txt('SHANELL','500 S Inter','#111',3);break;
   case'zahra':plate('#141416');txt('ZAHRA','500 S Bodoni Moda','#fff',4);break;
   case'doug':plate('#111','#9ad8c8');txt('DOUGLESS','500 S Inter','#fff',2);break;
   case'star':plate('#1e6b4a');txt('CAFÉ ZWEISTEIN','800 S Inter','#fff',1);break;
   case'klinik':plate('#ffffff','#9fb6bf');txt('Dr. Glatt  ·  Ästhetik Klinik','500 S Bodoni Moda','#1d2b33',.5);break;
   case'lab':plate('#ffffff','#d6453d');txt('WERTE-LABOR','700 S Inter','#2a7f74',1);break;
   case'mehr':plate('#111');txt('MEHR nutrition','900 S Inter','#fff',.5);break;
   case'mcf':plate('#111','#ffd400');txt('KIEZ GYM','900 S Inter','#ffd400',2);break;
   case'ross':plate('#fff');txt('ROSSFRAU','800 S Inter','#c8102e',1);break;
   case'dn':plate('#fff','#f2a900');txt('dn markt','800 S Inter','#1f3f8a');break;
   case'lid':plate('#1f4fa0','#ffd400');txt('Liddl','800 S Inter','#ffd400');break;
   case'borch':plate('#22392d','#c9b48a');txt('Borchert','italic 500 S Bodoni Moda','#d8c39a');break;
   case'hug':plate('#141416');g.shadowColor='#ff2a2a';g.shadowBlur=8;txt('398','700 S Inter','#ff2a2a');break;
   case'riva':plate('#1d3557','#cfe0ee');txt('PAPILLONG','500 S Bodoni Moda','#fff',5);break;
   case'boot':plate('#15161a');g.shadowColor='#b9a6ff';g.shadowBlur=6;txt('GRILL ROYALE','700 S Inter','#cbbcff',3);g.shadowBlur=0;break;
   case'work':plate('#0b1016','#8fe3f0');txt('FABRIK COWORKING','600 S Inter','#8fe3f0',2);break;
   case'hotel':plate('#111','#d8c39a');txt('HOTEL ADLONG','500 S Bodoni Moda','#d8c39a',2);break;
   case'motors':plate('#0c0d10','#cfd6de');txt('SPREE MOTORS','600 S Inter','#e8eef5',3);break;
   case'sac':plate('#f4efe6','#b59a6a');txt('Maison du Sac','italic 500 S Bodoni Moda','#2a2218',1);break;
   case'tif':plate('#81d8d0','#ffffff');txt('TIFFANNY & CO.','500 S Bodoni Moda','#0b3b38',2);break;
   case'seph':plate('#0b0b0d','#ffffff');txt('SEPHORRA','700 S Inter','#ffffff',4);break;
   case'vic':plate('#f7c6da','#d81b60');txt("Victoria's Secrett",'italic 500 S Bodoni Moda','#7a1440');break;
   case'lulu':plate('#ffffff','#d22630');txt('lulu lemonn','800 S Inter','#d22630',1);break;
   case'spa':plate('#f4efe6','#e6c76a');txt('Spree Spa','italic 500 S Bodoni Moda','#5a4a2a',1);break;
   case'salon':plate('#16171a','#e6c76a');txt('SALON BLOND','600 S Inter','#f2e2b8',3);break;
   case'apfel':plate('#f4f5f7','#c9ccd1');txt('Apfel Store','600 S Inter','#1d1d1f');break;
   case'arena':plate('#0d0e12','#ff6f9c');txt('SPREE ARENA','800 S Inter','#ffffff',3);break;
   case'jets':plate('#16171a','#e6c76a');txt('TEMPELHOFF','700 S Inter','#e6c76a',3);break;
   case'nicky':plate('#2fe0d2','#ffffff');txt('Scorpius Berlin','400 S Yellowtail','#073b3a');break;
   case'bout':plate('#ff4fa3','#ffffff');txt('Boutique '+((typeof ST!=='undefined'&&ST.profil&&ST.profil.handle)||'Glow'),'italic 500 S Bodoni Moda','#ffffff',.5);break;
   case'home':plate('#d8c39a');txt('DEIN ZUHAUSE','700 S Inter','#15161a',1);break}}
function topSign(b){if(!b.top||!b.topF)return;const f=b.topF;const[cx,cy]=pt(f.x+f.w/2,f.y+f.d/2,b.topZ);const s=Math.min(Z/DPR,1.4)*DPR;
  g.setTransform(s,0,0,s,cx,cy-20*s);brand(b.top,110,20);g.setTransform(1,0,0,1,0,0)}
