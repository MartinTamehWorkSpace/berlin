// Berlin · bedienung.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Bedienung ----------
const ptrs=new Map();let moved=0,pinch0=0,z0=1,ziehen=false;
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,[e.clientX,e.clientY]);moved=0;if(ptrs.size===2){const[a,b]=[...ptrs.values()];pinch0=Math.hypot(a[0]-b[0],a[1]-b[1]);z0=Z}});
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;const p=ptrs.get(e.pointerId);const dx=e.clientX-p[0],dy=e.clientY-p[1];ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(ptrs.size===2){const[a,b]=[...ptrs.values()];zoomTo(z0*Math.hypot(a[0]-b[0],a[1]-b[1])/pinch0);moved=99;return}
  moved+=Math.abs(dx)+Math.abs(dy);if(moved>6)ziehen=true;CX-=dx*DPR/Z;CY-=dy*DPR/Z});
cv.addEventListener('pointerup',e=>{ptrs.delete(e.pointerId);setTimeout(()=>ziehen=false,1500);if(moved<6){if(INNEN&&window.innenTippen)window.innenTippen(e.clientX,e.clientY);tap(e.clientX*DPR,e.clientY*DPR)}});
cv.addEventListener('pointercancel',e=>ptrs.delete(e.pointerId));
cv.addEventListener('wheel',e=>{e.preventDefault();zoomTo(Z*Math.exp(-e.deltaY*.0015))},{passive:false});
// Leiste unten: Jeder Knopf wirkt sofort. Offene Boutique schließen und ein Haus verlassen, bevor das neue Fenster kommt.
document.querySelector('.bar').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(!['bBout','bAlbum','bRadio'].includes(b.id)&&typeof boutiqueZu==='function')boutiqueZu();
  if(b.id!=='bKlinik'&&b.id!=='bRadio'&&typeof klinikZu==='function')klinikZu();
  if(INNEN&&!['bRadio','bChat','bFoto'].includes(b.id))verlassen();
  document.querySelectorAll('.bar button').forEach(x=>x.classList.toggle('an',x===b&&b.id!=='bRadio'&&b.id!=='bChat'))},true);
function zoomTo(z){ZIEL=null;Z=Math.max(.35*DPR,Math.min(7*DPR,z))}
document.getElementById('zich').onclick=()=>{ZIEL={cx:wx(ICH.x,ICH.y),cy:wy(ICH.x,ICH.y,0)-22,z:5*DPR}};document.getElementById('zin').onclick=()=>zoomTo(Z*1.3);document.getElementById('zout').onclick=()=>zoomTo(Z/1.3);
