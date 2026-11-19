// Berlin City · pflanzen-boote.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Pflanzen, Brunnen, Jachten ----------
function tree(t){const[x,y]=pt(t.x,t.y);const s=Z*t.s;g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(x+3*s,y,9*s,3.5*s,0,0,7);g.fill();
  g.fillStyle='#6b5340';g.fillRect(x-1.2*s,y-12*s,2.4*s,12*s);g.fillStyle='#4f6e45';g.beginPath();g.arc(x,y-19*s,8.5*s,0,7);g.fill();g.fillStyle='#6a8c58';g.beginPath();g.arc(x-2.5*s,y-22*s,5*s,0,7);g.fill()}
function palm(t){const[x,y]=pt(t.x,t.y,t.z||0);const s=Z*t.s;g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.ellipse(x+5*s,y,10*s,3.4*s,0,0,7);g.fill();
  const sway=Math.sin(T*.9+t.x)*.8*s,hx=x+2*s+sway,hy=y-30*s;
  g.strokeStyle='#8d6f50';g.lineWidth=2.6*s;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+4*s,y-15*s,hx,hy);g.stroke();
  g.strokeStyle='rgba(60,40,25,.45)';g.lineWidth=.6*s;for(let i=1;i<8;i++){const u=i/8,px=(1-u)*(1-u)*x+2*(1-u)*u*(x+4*s)+u*u*hx,py=(1-u)*(1-u)*y+2*(1-u)*u*(y-15*s)+u*u*hy;g.beginPath();g.moveTo(px-1.3*s,py);g.lineTo(px+1.3*s,py);g.stroke()}
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2+Math.sin(T*.8+t.x+i)*.06,lx=Math.cos(a)*13*s,ly=Math.sin(a)*5.5*s;
    g.strokeStyle=i%2?'#3f6b3a':'#5a8a4a';g.lineWidth=2.4*s;g.beginPath();g.moveTo(hx,hy);g.quadraticCurveTo(hx+lx*.55,hy+ly*.5-6*s,hx+lx,hy+ly+4*s);g.stroke();
    g.strokeStyle='rgba(120,170,90,.55)';g.lineWidth=.8*s;g.beginPath();g.moveTo(hx,hy);g.quadraticCurveTo(hx+lx*.55,hy+ly*.5-6*s,hx+lx,hy+ly+4*s);g.stroke()}
  g.fillStyle='#6a4a2e';g.beginPath();g.arc(hx,hy+1*s,1.6*s,0,7);g.fill()}
function fount(t){const[x,y]=pt(t.x,t.y);const s=Z;g.fillStyle='#cfc6b6';g.beginPath();g.ellipse(x,y,46*s,23*s,0,0,7);g.fill();g.fillStyle='#6cc3d0';g.beginPath();g.ellipse(x,y-2*s,40*s,20*s,0,0,7);g.fill();
  g.fillStyle='#e9e3d8';g.fillRect(x-3*s,y-22*s,6*s,20*s);g.fillStyle='rgba(220,245,250,.75)';for(let i=0;i<7;i++){g.beginPath();g.arc(x+Math.sin(T*3+i)*6*s,y-24*s-((T*22+i*5)%16)*s,1.6*s,0,7);g.fill()}}
// Boote aus Blender: Superjacht, Motorjacht, Speedboot; px pro Meter im Bild je Typ
const BOOT={gross:{k:'super',pxm:1100/40},jacht:{k:'motor',pxm:820/24},speed:{k:'speed',pxm:560/12}};const BSPR={};
for(const k of['super','motor','speed']){BSPR[k]={};for(const r of['90','270']){let im=null;Object.defineProperty(BSPR[k],r,{get(){if(!im){im=new Image();im.src=`autos/boote/b_${k}_${r}.png`}return im}})}}
function bootBild(typ,r,x,y){const t=BOOT[typ];const im=BSPR[t.k]&&BSPR[t.k][r];if(!im||!im.naturalWidth)return false;const sc=8*Z/t.pxm;g.drawImage(im,x-im.naturalWidth*sc/2,y-im.naturalHeight*sc/2,im.naturalWidth*sc,im.naturalHeight*sc);return true}
function schiff(o){g.save();const k1=pt(X0,43),k2=pt(X1,43),k3=pt(X1,Y1),k4=pt(X0,Y1);g.beginPath();g.moveTo(k1[0],k1[1]-2000);g.lineTo(k2[0],k2[1]-2000);g.lineTo(k3[0],k3[1]);g.lineTo(k4[0],k4[1]);g.closePath();g.clip();
  g.globalAlpha=Math.max(0,Math.min(1,Math.min(o.x-X0-1,X1-1-o.x)/4));schiffInnen(o);g.globalAlpha=1;g.restore()}
function schiffInnen(o){const[x0,y0]=pt(o.x,o.y);const s=Z;
  // Bugwelle und Kielwasser
  g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=1.2*s;for(let i=1;i<5;i++){const wx_=o.x-Math.sign(o.v)*(o.L*.5+i*.6);const[a,b]=pt(wx_,o.y+.25+i*.06),[c,d]=pt(wx_,o.y-.05-i*.06);g.globalAlpha=.6-i*.12;g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke()}g.globalAlpha=1;
  if(bootBild(o.typ,o.v>0?'90':'270',x0,y0-2*Z))return;
  const f={x:o.x-o.L/2,y:o.y,w:o.L,d:.6},h=o.typ==='gross'?12:o.typ==='jacht'?8:4,weiss=o.typ==='speed'?'#ff4fa3':'#f7f7f5';
  fL(f,0,o.L,0,h,weiss);fR(f,0,.6,0,h,'#d6d9dc');top4(f.x,f.y,o.L,.6,h,'#c8a57a');
  fL(f,0,o.L,h*.35,h*.5,'#1d2a33');
  if(o.typ!=='speed'){const c={x:f.x+o.L*.2,y:f.y+.08,w:o.L*.55,d:.44};fL(c,0,c.w,h,h+(o.typ==='gross'?10:6),'#f4f4f2');fR(c,0,c.d,h,h+(o.typ==='gross'?10:6),'#dcdfe2');fL(c,.1,c.w-.1,h+2,h+4.5,'#1d2a33');top4(c.x,c.y,c.w,c.d,h+(o.typ==='gross'?10:6),'#f4f4f2');
    if(o.typ==='gross'){const c2={x:c.x+c.w*.2,y:c.y+.06,w:c.w*.55,d:.32};fL(c2,0,c2.w,h+10,h+16,'#f4f4f2');fL(c2,.05,c2.w-.05,h+11.5,h+14,'#1d2a33');top4(c2.x,c2.y,c2.w,c2.d,h+16,'#ff4fa3')}}}
function yacht(o){{const[x0,y0]=pt(o.x+o.L/2,o.y+.25);if(bootBild('jacht','90',x0,y0+Math.sin(T*1.4+o.ph)*Z))return}const bob=Math.sin(T*1.4+o.ph)*1.2;const L=o.L,x=o.x,y=o.y;const f={x,y,w:L,d:.5};
  g.save();g.translate(0,bob*Z);g.globalAlpha=.2;top4(x+.1,y+.1,L,.55,-2,'#0b2a36');g.globalAlpha=1;
  fL(f,0,L,0,6,'#f4f4f2');fR(f,0,.5,0,6,'#d5d8db');top4(x,y,L,.5,6,'#b89a74');
  const c={x:x+.25,y:y+.08,w:L*.55,d:.34};fL(c,0,c.w,6,11,'#1d2a33');fR(c,0,c.d,6,11,'#141d24');top4(c.x,c.y,c.w,c.d,11,'#f4f4f2');g.restore()}
