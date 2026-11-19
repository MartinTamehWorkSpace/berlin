// Berlin City · bewohner.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Menschen ----------
const SK=['#f3d5bf','#e4b997','#c48f6b','#8d5b3d','#5c3b29'],HAIR=['#2b2118','#5a3d2b','#dcc28e','#141414','#8a4b2c','#cfc9c0'];
const CL=['#16171a','#f2eee8','#2f3e46','#7a6a58','#c9b48a','#3d405b','#8c2f39','#d9d2c3','#4b5d4f','#1d3557','#e8d5c4','#b8c4cc'];
const BAGS=['#111','#f2eee8','#c8102e','#d8c39a','#1e6b4a'];
const P=[];
const lots=[];for(let by=0;by<5;by++)for(let bx=0;bx<5;bx++)lots.push(lot(bx,by));
const loop=(l,pad)=>({x0:l.x-.5-pad,y0:l.y-.5-pad,w:5+2*pad});
function onLoop(l,s){const w=l.w;s=((s%(4*w))+4*w)%(4*w);
  if(s<w)return[l.x0+s,l.y0,1,0];if(s<2*w)return[l.x0+w,l.y0+s-w,0,1];if(s<3*w)return[l.x0+w-(s-2*w),l.y0+w,-1,0];return[l.x0,l.y0+w-(s-3*w),0,-1]}
const human=o=>Object.assign({skin:pick(SK),hair:pick(HAIR),hs:Math.floor(R()*4),top:pick(CL),leg:pick(CL),dress:R()<.3,coat:R()<.2,bag:R()<.35?pick(BAGS):null,ph:R()*6,sz:.92+R()*.16},o);
for(let i=0;i<240;i++)P.push(human({lp:loop(pick(lots),(R()-.5)*.35),s:R()*20,v:(R()<.5?-1:1)*(.4+R()*.35)}));
for(let i=0;i<30;i++)P.push(human({prom:1,x:X0+R()*(X1-X0),y:42.3+R()*.5,v:(R()<.5?-1:1)*(.25+R()*.3)}));
// Hauptfiguren: immer gleich, damit man sie in jedem Reel wiedererkennt
const ICH=Object.assign(human({}),{ctrl:1,idle:1,x:11.5,y:13,path:[],name:'Du',skin:'#e4b997',hair:'#5a3d2b',hs:1,frisur:'welle',w:1,top:'#d9d2c3',leg:'#2f3e56',dress:0,bag:null,star:1,ph:9,sz:1.18,mimik:'laecheln'});P.push(ICH);
// Die 20 Charaktere: Personal steht in seinem Laden, alle anderen gehen durch die Stadt
const CHAR_P=FG.CHARS.map((c,i)=>{const p=Object.assign(human({}),c,{star:1,ph:i*.9,sz:1.08,charId:c.id});if(!c.ort){p.lp=loop(i%3===0?PLAZA:pick(lots),-.05+((i%4)-1.5)*.08);p.s=i*2.3;p.v=(i%2?.34:-.34)}return p});
CHAR_P.filter(p=>!p.ort).forEach(p=>P.push(p));
// Café-Terrassen vor Restaurants und Cafés: Tische mit Schirmen in der Markenfarbe, an manchen sitzt jemand
{const CAFE={star:'#1e6b4a',borch:'#22392d',hug:'#5b2333',riva:'#1d3557',nicky:'#2fe0d2',boot:'#8f6bff'};
 for(const b of B){const k=b.pod.shops.map(s=>s[3]).find(x=>CAFE[x]);if(!k)continue;const us=b.pod.style==='deko'?[.35,1.0,3.05,3.7]:[.4,3.4];
   us.forEach((u,i)=>S.push({k:'cafe',x:b.x+u,y:b.y+4.62,farbe:CAFE[k],gast:(i+b.x)%2===0?{skin:pick(SK),hair:pick(HAIR),hs:Math.floor(R()*3),top:pick(CL),leg:pick(CL),dress:R()<.5,acc:R()<.4?['creolen']:[],ph:R()*6}:null}))}}
