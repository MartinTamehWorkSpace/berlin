// Glow City · boden.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Boden ----------
// Boden-Zwischenspeicher: doppelt so groß wie der Bildschirm, neu nur bei Zoom oder großem Verschieben
const BC={cv:document.createElement('canvas'),cx:0,cy:0,z:0,w:0,h:0};
function bodenZeichnen(){if(!W||!H)return; // vor dem ersten Größen-Ereignis ist die Fläche 0 breit, dann nichts zeichnen
  const gueltig=BC.z===Z&&BC.w===W&&BC.h===H&&Math.abs(BC.cx-CX)*Z<W*.45&&Math.abs(BC.cy-CY)*Z<H*.45;
  if(!gueltig){BC.cv.width=W*2;BC.cv.height=H*2;const sg=g,sw=W,sh_=H;g=BC.cv.getContext('2d');W=sw*2;H=sh_*2;ground();boden2();parkbuchten();g=sg;W=sw;H=sh_;BC.cx=CX;BC.cy=CY;BC.z=Z;BC.w=W;BC.h=H}
  g.drawImage(BC.cv,W/2+(BC.cx-CX)*Z-W,H/2+(BC.cy-CY)*Z-H)}
function ground(){
  const sd=(x0,y0,x1,y1,c,dz)=>poly([pt(x0,y1),pt(x1,y1),[pt(x1,y1)[0],pt(x1,y1)[1]+dz*Z],[pt(x0,y1)[0],pt(x0,y1)[1]+dz*Z]],c);
  sd(X0,Y0,X1,Y1,'#4f5d4a',30);poly([pt(X1,Y0),pt(X1,Y1),[pt(X1,Y1)[0],pt(X1,Y1)[1]+30*Z],[pt(X1,Y0)[0],pt(X1,Y0)[1]+30*Z]],'#3f4b3b');
  quad(X0,Y0,X1,YW,'#86a45f');
  for(let i=0;i<60;i++){const x=X0+(i*13.7)%(X1-X0),y=Y0+(i*7.9)%(YW-Y0);if(x>-1&&x<43&&y>-1)continue;quad(x,y,x+2.2,y+1.6,'rgba(110,145,80,.5)')}
  quad(-1,-1,43,42,'#efe2e2');
  for(let t=-1;t<43;t+=.5){quad(t,-1,t+.025,42,'rgba(150,120,130,.16)');quad(-1,t,43,t+.025,'rgba(150,120,130,.16)')}
  quad(X0,42,X1,43,'#d3c7b3');
  const wg=g.createLinearGradient(...pt(0,43),...pt(0,Y1));wg.addColorStop(0,'#5fb7c4');wg.addColorStop(1,'#2d6f86');quad(X0,43,X1,Y1,wg);
  // Strand vom Yachtclub
  quad(33.5,42,X1,45.2,'#f3e2c2');quad(33.5,45.2,X1,45.6,'rgba(255,255,255,.55)');for(let i=0;i<3;i++)quad(41+i*2.3,45.6,41.8+i*2.3,49.5,'#e8e3db');
  }
function bodenBewegt(){
  for(let i=0;i<70;i++){const x=X0+(i*7.3+T*.3*(i%3))%(X1-X0),y=43.5+(i*3.7)%10;quad(x,y,x+.8,y+.05,'rgba(255,255,255,.18)')}
  for(let i=0;i<160;i++){const x=X0+((i*11.3+T*(.2+(i%5)*.05))%(X1-X0)),y=43.3+(i*2.9)%10.5,a=Math.max(0,Math.sin(T*2.2+i*1.7));if(a<.4)continue;const[px,py]=pt(x,y);g.fillStyle=`rgba(255,250,235,${(a-.4)*1.2})`;g.fillRect(px-1.2*Z,py-.4*Z,2.4*Z,.8*Z)}
  for(let x=X0;x<X1;x+=.5){const o=Math.sin(x*1.3+T*1.6)*.06;quad(x,43+o,x+.5,43.18+o,'rgba(255,255,255,.55)')}
}
function boden2(){
  for(let i=0;i<8;i++){quad(1.4+i*4.1,43,2.4+i*4.1,47.6,'#b89a74');for(let j=0;j<9;j++)quad(1.4+i*4.1,43.2+j*.5,2.4+i*4.1,43.25+j*.5,'rgba(90,60,30,.35)')}
  for(let k=0;k<6;k++){quad(8*k,-1,8*k+2,42,'#2c2f35');quad(-1,8*k,43,8*k+2,'#2c2f35')}
  for(let k=0;k<6;k++)for(let t=-1;t<42;t+=1.2){
    if(t%8>=2||t<0){quad(8*k+.9,t,8*k+.95,t+1.2,'#f2c14e');quad(8*k+1.05,t,8*k+1.1,t+1.2,'#f2c14e');quad(t,8*k+.9,t+1.2,8*k+.95,'#f2c14e');quad(t,8*k+1.05,t+1.2,8*k+1.1,'#f2c14e')}}
  for(let k=0;k<6;k++)for(let j=0;j<5;j++)for(const r of[2.15,7.15])for(let i=0;i<6;i++){
    quad(8*k+.1+i*.32,8*j+r,8*k+.26+i*.32,8*j+r+.7,'rgba(240,235,225,.75)');quad(8*j+r,8*k+.1+i*.32,8*j+r+.7,8*k+.26+i*.32,'rgba(240,235,225,.75)')}
  // Fahrbahnränder leuchten leicht (digitale Stadt)
  for(let k=0;k<6;k++){quad(8*k-.04,-1,8*k+.02,42,'rgba(255,255,255,.12)');quad(8*k+1.98,-1,8*k+2.04,42,'rgba(255,255,255,.12)')}
  lots.forEach(l=>quad(l.x-.08,l.y-.08,l.x+4.08,l.y+4.08,'#c9c2b6'));
  quad(PARK.x,PARK.y,PARK.x+4,PARK.y+4,'#8fae68');
  quad(PLAZA.x,PLAZA.y,PLAZA.x+4,PLAZA.y+4,'#f6e3ea');
  for(let i=0;i<4;i++)for(let j=0;j<4;j++)if((i+j)%2)quad(PLAZA.x+i,PLAZA.y+j,PLAZA.x+i+1,PLAZA.y+j+1,'#efd3de')}
// Parkbuchten am Bordstein vor jedem Haus: hier parkt das eigene Auto, von hier geht es zu Fuß zur Tür
// Zwei Parkbuchten am Bordstein vor jedem Haus, dünn gestrichelt, mit P-Schild. Das eigene Auto parkt in der ersten.
const parkplatz=b=>({x:b.x+2.55,y:b.y+5.3});
function parkbuchten(){for(const b of B){const x0=b.x+2,y0=b.y+5.02,y1=b.y+5.58;for(let k=0;k<=2;k++)for(let t=y0;t<y1;t+=.12)quad(x0+k*1.1-.02,t,x0+k*1.1+.02,t+.06,'rgba(255,255,255,.85)');for(let t=x0;t<x0+2.2;t+=.12)quad(t,y0-.02,t+.06,y0+.02,'rgba(255,255,255,.85)')}}
