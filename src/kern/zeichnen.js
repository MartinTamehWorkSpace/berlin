// Berlin · zeichnen.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Grundformen ----------
function poly(p,f){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const q of p){if(q[0]<x0)x0=q[0];if(q[0]>x1)x1=q[0];if(q[1]<y0)y0=q[1];if(q[1]>y1)y1=q[1]}if(x1<-20||x0>W+20||y1<-20||y0>H+20)return;g.beginPath();g.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)g.lineTo(p[i][0],p[i][1]);g.closePath();g.fillStyle=f;g.fill()}
const quad=(x0,y0,x1,y1,c,z=0)=>poly([pt(x0,y0,z),pt(x1,y0,z),pt(x1,y1,z),pt(x0,y1,z)],c);
function sh(hex,f){const n=parseInt(hex.slice(1),16);return'rgb('+[n>>16,n>>8&255,n&255].map(v=>Math.min(255,Math.round(v*f))).join(',')+')'}
const top4=(x,y,w,d,z,c)=>poly([pt(x,y,z),pt(x+w,y,z),pt(x+w,y+d,z),pt(x,y+d,z)],c);
// Fläche vorne links (y = y+d) und rechts (x = x+w); u läuft auf dem Bildschirm von links nach rechts
function fL(f,u0,u1,z0,z1,c){const y=f.y+f.d;poly([pt(f.x+u0,y,z0),pt(f.x+u1,y,z0),pt(f.x+u1,y,z1),pt(f.x+u0,y,z1)],c)}
function fR(f,u0,u1,z0,z1,c){const x=f.x+f.w,y=f.y+f.d;poly([pt(x,y-u0,z0),pt(x,y-u1,z0),pt(x,y-u1,z1),pt(x,y-u0,z1)],c)}
const K=1/35.78;
function faceT(f,side,u,z){const[sx,sy]=side==='L'?pt(f.x+u,f.y+f.d,z):pt(f.x+f.w,f.y+f.d-u,z);g.setTransform(32*Z*K,(side==='L'?16:-16)*Z*K,0,Z,sx,sy)}
function grad(f,side,z0,z1,c0,c1){const a=side==='L'?pt(f.x,f.y+f.d,z1):pt(f.x+f.w,f.y+f.d,z1),b=side==='L'?pt(f.x,f.y+f.d,z0):pt(f.x+f.w,f.y+f.d,z0);const gr=g.createLinearGradient(a[0],a[1],b[0],b[1]);gr.addColorStop(0,c0);gr.addColorStop(1,c1);return gr}
