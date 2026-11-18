// Glow City · verkehr-daten.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Autos ----------
const CARS=[];const MIX=[[1,10],[2,5],[3,3],[4,2],[5,1]];const VAR={1:['','b','r','','b','r','','','b','r']};
// Spuren: in +y fährt man auf x=8k+.55, in -y auf 8k+1.45, in +x auf y=8j+1.45, in -x auf 8j+.55
const SPUR=(ax,dir,k)=>ax==='y'?8*k+(dir>0?.55:1.45):8*k+(dir>0?1.45:.55);
for(const[lvl,n]of MIX)for(let i=0;i<n;i++){const ax=R()<.5?'y':'x',dir=R()<.5?1:-1,k=Math.floor(R()*6);let t=R()*40;if(t%8<2.5)t+=3;
  CARS.push({lvl,vr:(VAR[lvl]||[''])[i%((VAR[lvl]||['']).length)],ax,dir,c:SPUR(ax,dir,k),t,basis:lvl>=4?2.3:1.5+R()*.5,sp:0,col:'#c9ccd1',lift:0,ph:R()*10,plan:null,kreuz:-1})}
// Ampeln: jede Kreuzung wechselt zwischen Nord-Süd und Ost-West, leicht versetzt
const ampel=(kx,ky,ax)=>{const ph=((T+(kx*2+ky*3)*1.7)%14+14)%14;if(ax==='y')return ph<6?'g':ph<7?'y':'r';return ph<7?'r':ph<13?'g':'y'};
// Stadt-Sprites aus Blender: jedes Modell aus vier Fahrtrichtungen
// Bilder erst laden, wenn sie wirklich gezeichnet werden (2D nur noch in Innenräumen und als Ersatz ohne 3D): spart beim Start rund 5 MB
const SPR={};for(const l of['1','1b','1r','2','3','4','5']){SPR[l]={};for(const a of['0','90','180','270']){let im=null;Object.defineProperty(SPR[l],a,{get(){if(!im){im=new Image();im.src=`autos/stadt/s${l}_${a}.png`}return im}})}}
