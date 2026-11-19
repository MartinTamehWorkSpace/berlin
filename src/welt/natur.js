// Berlin · natur.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Pflanzen, Brunnen, Jachten ----------
const S=[];
for(let i=0;i<16;i++)S.push({k:R()<.4?'palm':'tree',x:PARK.x+.3+R()*3.4,y:PARK.y+.3+R()*3.4,s:.8+R()*.5});
// Palmen-Alleen auf den Gehwegen
for(let k=0;k<5;k++)for(const r of[2.5,7.5])for(let t=3.4;t<42;t+=2){if(t%8<2.4)continue;S.push({k:'palm',x:8*k+r,y:t,s:.85});}
// Wiese rund um die Stadt
for(let i=0;i<150;i++){let x=X0+R()*(X1-X0),y=Y0+R()*(YW-Y0);if(x>-.5&&x<42.5&&y>-.5)continue;S.push({k:R()<.25?'palm':'tree',x,y,s:.8+R()*.6})}
for(let x=-6;x<49;x+=2.6)S.push({k:'palm',x,y:42.5,s:1});
S.push({k:'fount',x:PLAZA.x+2,y:PLAZA.y+2});
for(let kx=0;kx<6;kx++)for(let ky=0;ky<6;ky++){S.push({k:'ampel',x:8*kx-.25,y:8*ky-.25,kx,ky});S.push({k:'ampel',x:8*kx+2.25,y:8*ky+2.25,kx,ky})}
for(let k=0;k<6;k++)for(let t=4.4;t<41;t+=4){if(t%8<2.4)continue;S.push({k:'lamp',x:8*k+2.2,y:t,c:(k+Math.round(t))%2?'#ff4fa3':'#2fe0d2'});S.push({k:'lamp',x:t,y:8*k+2.2,c:(k+Math.round(t))%2?'#2fe0d2':'#ff4fa3'})}
for(let i=0;i<4;i++){S.push({k:'palm',x:PLAZA.x+.4+i*1.07,y:PLAZA.y+.4,s:.75});S.push({k:'palm',x:PLAZA.x+.4+i*1.07,y:PLAZA.y+3.6,s:.75})}
const SCHIFFE=[{x:2,y:50.5,L:6,v:.8,typ:'gross',ph:0},{x:24,y:48.4,L:3.2,v:-1.3,typ:'jacht',ph:1},{x:38,y:52.4,L:1.8,v:3.2,typ:'speed',ph:2}];
const YACHT=[];for(let i=0;i<3;i++)YACHT.push({k:'yacht',x:42+i*2.3,y:46.6+(i%2)*1.2,L:2.4,ph:i});
S.push({k:'meinejacht',x:39.2,y:46.4});
// Palmen im Beachclub von Scorpius Berlin (die Kai-Palmen stehen oben bei y 42.5)
for(const[x,y,s]of[[34.5,42.6,1],[37.6,45.6,.9],[40.6,45.4,1.05],[35.8,45.9,.85]])S.push({k:'palm',x,y,s});
// Strandliegen und Schirme
for(let i=0;i<8;i++){S.push({k:'schirm',x:34.4+i*1.75,y:43.4+(i%2)*.9,c:i%2?'#ff7eb6':'#f4efe6'})}for(let i=0;i<8;i+=2)YACHT.push({k:'yacht',x:2.6+i*4.1,y:44.2+(i/2%2)*1.6,L:1.6+R()*1.2,ph:R()*6});

// Beete, Hecken und Bänke auf den Gehwegen zwischen den Palmen
for(let k=0;k<5;k++)for(const r of[2.5,7.5])for(let t=5.4;t<42;t+=8){S.push({k:'beet',x:8*k+r-.35,y:t,quer:false});S.push({k:'beet',x:t,y:8*k+r-.35,quer:true})}
for(let k=0;k<5;k++)for(let t=6.4;t<42;t+=16)S.push({k:'bank',x:8*k+2.55,y:t})
