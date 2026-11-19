// Berlin City · autos.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Autos ----------
function car(c){const ra=Math.max(0,Math.min(1,Math.min(c.t+.5,41.8-c.t)/1.2));if(ra<=0)return;g.globalAlpha=ra;carInnen(c);g.globalAlpha=1}
function carInnen(c){const dirS=c.vert?(c.v>0?'0':'180'):(c.v>0?'90':'270');const im=SPR[c.lvl+c.vr]&&SPR[c.lvl+c.vr][dirS];
  if(im&&im.complete&&im.naturalWidth){const[x,y]=pt(c.x,c.y,0);const sc=.14*Z;
    if(c.lift>0){const gl=g.createRadialGradient(x,y,1,x,y,30*Z);gl.addColorStop(0,`rgba(143,227,240,${.25+c.lift/120})`);gl.addColorStop(1,'rgba(143,227,240,0)');g.fillStyle=gl;g.beginPath();g.ellipse(x,y,30*Z,15*Z,0,0,7);g.fill()}
    g.drawImage(im,x-im.naturalWidth*sc/2,y-im.naturalHeight*sc/2-c.lift*Z,im.naturalWidth*sc,im.naturalHeight*sc);return}
const x=c.x,y=c.y,dir=Math.sign(c.v);const L2=c.sport?.44:.4,W2=.19,hx=c.vert?W2:L2,hy=c.vert?L2:W2;const f={x:x-hx,y:y-hy,w:2*hx,d:2*hy};
  g.globalAlpha=.3;top4(f.x+.04,f.y+.06,f.w+.04,f.d+.04,0,'#000');g.globalAlpha=1;
  const zb=c.sport?5:6.5,col=c.col;
  // Räder
  const wheel=(wx2,wy2)=>{const[a,b]=pt(wx2,wy2,1.8);g.fillStyle='#0c0c0e';g.beginPath();g.ellipse(a,b,2.1*Z,1.6*Z,0,0,7);g.fill()};
  if(c.vert){wheel(f.x+f.w,f.y+.15);wheel(f.x+f.w,f.y+f.d-.15);wheel(f.x+.15,f.y+f.d)}else{wheel(f.x+.15,f.y+f.d);wheel(f.x+f.w-.15,f.y+f.d);wheel(f.x+f.w,f.y+.15)}
  fL(f,0,f.w,1.2,zb,grad(f,'L',1.2,zb,sh(col,1.12),sh(col,.75)));fR(f,0,f.d,1.2,zb,grad(f,'R',1.2,zb,sh(col,.9),sh(col,.55)));top4(f.x,f.y,f.w,f.d,zb,sh(col,1.15));
  // Kabine: flach, ganz aus Glas
  const ix=c.vert?.025:(c.sport?.2:.14),iy=c.vert?(c.sport?.2:.14):.025;const k={x:f.x+ix,y:f.y+iy,w:f.w-2*ix,d:f.d-2*iy};const zc=zb+(c.sport?3.2:4.6);
  fL(k,0,k.w,zb,zc,'rgba(30,48,60,.92)');fR(k,0,k.d,zb,zc,'rgba(20,34,44,.92)');top4(k.x,k.y,k.w,k.d,zc,sh(col,1.05));
  // Lichtband vorne weiß, hinten rot
  const front=c.vert?(dir>0?'L':null):(dir>0?'R':null),rear=c.vert?(dir<0?'L':null):(dir<0?'R':null);
  if(front)(front==='L'?fL:fR)(f,.03,(front==='L'?f.w:f.d)-.03,zb-2.2,zb-1.2,'rgba(230,250,255,.95)');
  if(rear)(rear==='L'?fL:fR)(f,.03,(rear==='L'?f.w:f.d)-.03,zb-2.2,zb-1.2,'rgba(255,60,70,.95)')}
