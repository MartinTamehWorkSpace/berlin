// Berlin City · kamera.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Kamera ----------
let Z=1,CX=0,CY=0,DPR=1,W=0,H=0;
const wx=(x,y)=>(x-y)*32,wy=(x,y,z)=>(x+y)*16-z;
const pt=(x,y,z=0)=>[W/2+(wx(x,y)-CX)*Z,H/2+(wy(x,y,z)-CY)*Z];
function resize(){DPR=Math.min(devicePixelRatio||1,1.25);W=cv.width=innerWidth*DPR;H=cv.height=innerHeight*DPR}
function home(){const c=PLAZA;CX=wx(c.x+2,c.y+2);CY=wy(c.x+2,c.y+2,0)-60;Z=(innerWidth<600?1.1:1.6)*DPR}
addEventListener('resize',()=>{const z=Z/DPR;resize();Z=z*DPR});resize();home();
