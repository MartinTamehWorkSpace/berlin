// Berlin City · stadtplan.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Viertel ----------
// Reihe 0: Wohnen und Arbeit · Reihe 1: Luxus-Boulevard · Reihe 2: Beauty und Gesundheit · Reihe 3: Hafen mit Restaurants
const lot=(bx,by)=>({x:8*bx+3,y:8*by+3,w:4,d:4});
const B=[];
function mk(bx,by,o){const l=lot(bx,by);
  // Oben genauso breit wie unten: der Turm steht auf der ganzen Grundfläche, keine Stufe
  if(o.tow)o.tow=Object.assign({},o.tow,{ox:0,oy:0,w:4,d:4,tier:null});const b={x:l.x,y:l.y,w:4,d:4,...o};b.pod=Object.assign({fl:2,frame:'#e9e5de',style:'mall'},o.pod);
  b.ph=GF+(b.pod.fl-1)*FH+PAR;b.h=b.ph+(b.tow?towH(b.tow):0);B.push(b)}
const towH=t=>t.fl*FH+(t.tier?t.tier.fl*FH:0);
mk(0,0,{title:'Spreeufer Residenz',pod:{fl:1,shops:[['L',0,4,'star']]},tow:{ox:1,oy:1,w:2,d:2,fl:9,kind:'res',crown:'#d8c39a',tier:{ins:.3,fl:2}},top:'home'});
mk(1,0,{title:'Fabrik Coworking',pod:{fl:2,shops:[['L',0,4,'work']]},tow:{ox:.5,oy:.5,w:3,d:3,fl:12,crown:'#8fe3f0',tier:{ins:.5,fl:3},spire:1,led:1},top:'work'});
mk(3,0,{title:'Maison du Sac',pod:{fl:2,shops:[['L',0,4,'sac'],['R',0,4,'sac']]},tow:{ox:1,oy:.5,w:2,d:3,fl:5,kind:'res',crown:'#d8c39a'}});
mk(0,1,{title:'Galeries Lafayetto',pod:{fl:2,shops:[['L',0,2,'prado'],['L',2,4,'shan'],['R',0,2,'doug'],['R',2,4,'star']]},tow:{ox:1,oy:1,w:2,d:2,fl:6,crown:'#d8c39a',tier:{ins:.3,fl:1}},top:'hotel'});
mk(2,1,{title:'KaDeVe',pod:{fl:2,shops:[['L',0,4,'zahra'],['R',0,2,'dn'],['R',2,4,'ross']]},tow:{ox:1,oy:1,w:2,d:2,fl:4,kind:'res',crown:'#8fe3f0'}});
mk(3,1,{title:'Markthalle Zehn',pod:{fl:1,shops:[['L',0,4,'lid']]},tow:{ox:1.2,oy:1,w:1.6,d:2,fl:3,kind:'res',crown:'#d8c39a'}});
mk(0,2,{title:'Klinik Dr. Glatt',pod:{fl:2,frame:'#f4f6f7',shops:[['L',0,4,'klinik']]},tow:{ox:.6,oy:.6,w:2.8,d:2.8,fl:4,kind:'clinic',crown:'#ffffff'}});
mk(1,2,{title:'Health Hub',pod:{fl:2,shops:[['L',0,2,'lab'],['L',2,4,'mehr']]},tow:{ox:1,oy:1,w:2,d:2,fl:2,kind:'clinic',crown:'#8fe3f0'}});
mk(2,2,{title:'Kiez Gym',pod:{fl:3,frame:'#26272b',shops:[['L',0,4,'mcf']]}});
mk(3,2,{title:'Spree Motors',pod:{fl:2,shops:[['L',0,4,'motors'],['R',0,4,'motors']]},tow:{ox:.8,oy:.8,w:2.4,d:2.4,fl:7,kind:'res',crown:'#8fe3f0',tier:{ins:.3,fl:1}}});
mk(0,4,{title:'Borchert',pod:{fl:3,style:'deko',farbe:'#ffd1dc',neon:'#ff4fa3',shops:[['L',0,4,'borch']]}});
mk(1,4,{title:"Huggo's",pod:{fl:2,style:'deko',farbe:'#bfe9e3',neon:'#2fe0d2',shops:[['L',0,4,'hug']]}});
mk(2,4,{title:'Papillong',pod:{fl:2,style:'deko',farbe:'#fff0c2',neon:'#ff7eb6',shops:[['L',0,4,'riva']]}});
mk(3,4,{title:'Grill Royale',pod:{fl:2,style:'deko',farbe:'#d9c8f4',neon:'#8f6bff',shops:[['L',0,4,'boot']]}});
// Neue Viertel: Beauty-Meile (Reihe 3), Wohnen am Park (Spalte 4), Beach Club am Wasser
mk(0,3,{title:'Tiffanny & Co.',pod:{fl:2,shops:[['L',0,4,'tif'],['R',0,4,'tif']]},tow:{fl:4,kind:'res',crown:'#81d8d0'}});
mk(1,3,{title:'Beauty Galerie',pod:{fl:2,shops:[['L',0,2,'seph'],['L',2,4,'vic'],['R',0,4,'lulu']]},tow:{fl:3,kind:'res',crown:'#ff7eb6'}});
mk(2,3,{title:'Spree Spa',pod:{fl:2,shops:[['L',0,2,'spa'],['L',2,4,'salon']]},tow:{fl:5,kind:'clinic',crown:'#e6c76a'}});
// Hauptgebäude: Alex Tower in der zweiten Reihe hinter der Promenade
mk(3,3,{title:'Alex Tower',haupt:1,pod:{fl:2,shops:[]},tow:{fl:14,kind:'res',crown:'#ff4fa3',spire:1}});
// Hauptgebäude der Stadt: Alex Tower (in 3D drei Flügel und Nadel, Anlehnung an den Burj Khalifa)
mk(4,0,{title:'Platte Friedrichshain',pod:{fl:1,shops:[['L',0,4,'dn']]},tow:{fl:6,kind:'res',crown:'#8fe3f0'}});
mk(4,1,{title:'Penthouse Mitte',pod:{fl:1,shops:[['L',0,4,'star']]},tow:{fl:13,kind:'res',crown:'#ff7eb6'}});
mk(4,2,{title:'Lofts Kreuzberg',pod:{fl:2,shops:[['L',0,4,'apfel']]},tow:{fl:11,kind:'res',crown:'#8fe3f0'}});
// Die eigene Boutique der Spielerin: jede sieht hier ihre eigene, Antippen öffnet Regale und Kasse
mk(4,3,{title:'Deine Boutique',meins:'boutique',pod:{fl:2,style:'deko',farbe:'#ffc6dd',neon:'#ff4fa3',shops:[['L',0,4,'bout'],['R',0,4,'bout']]}});
// Spree Arena: Konzerthalle im Westen, das Stadion baut src/drei/arena.js
mk(-3,1,{title:'Spree Arena',pod:{fl:2,style:'deko',farbe:'#2a2f3a',neon:'#ff8fc7',shops:[['L',0,4,'arena'],['R',0,4,'arena']]}});
// Berghain: Betonkoloss neben der Spree Arena, ehemaliges Heizkraftwerk, kein Schild an der Fassade
mk(-3,2,{title:'Berghain',pod:{fl:8,style:'beton',farbe:'#8a8781',neon:'#ff3b2f',shops:[['L',0,4,'berg'],['R',0,4,'deal']]}});
// Flughafen Tempelhoff: Privatterminal östlich der Stadt, Landebahn und Vorfeld baut src/drei/flughafen.js
mk(6,1,{title:'Flughafen Tempelhoff',pod:{fl:2,style:'deko',farbe:'#eef3f6',neon:'#e6c76a',shops:[['L',0,4,'jets'],['R',0,4,'jets']]}});
mk(4,4,{title:'Scorpius Berlin',pod:{fl:2,style:'deko',farbe:'#ffe0cc',neon:'#2fe0d2',shops:[['L',0,4,'nicky'],['R',0,4,'nicky']]}});
B.sort((a,b)=>(a.x+a.y)-(b.x+b.y));
const PARK=lot(2,0),PLAZA=lot(1,1);
