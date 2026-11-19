// Berlin City · menschen.js · wird als klassisches Skript in index.html geladen (gemeinsamer globaler Bereich, Reihenfolge zählt)
// ---------- Menschen ----------
function person(p){const[x,y]=pt(p.x,p.y);const s=Z*.62*p.sz;
  if(p===ICH&&p.faehrt&&ICH.auto){const k=AUTO_SPR[ICH.auto.id];const im=k&&SPR[k]&&SPR[k][p.richtung||'90'];const lf=(p.lift||0)*Z;if(lf>1){const gl=g.createRadialGradient(x,y,1,x,y,32*Z);gl.addColorStop(0,'rgba(143,227,240,.5)');gl.addColorStop(1,'rgba(143,227,240,0)');g.fillStyle=gl;g.beginPath();g.ellipse(x,y,32*Z,16*Z,0,0,7);g.fill()}
    if(im&&im.naturalWidth){const sc=.14*Z;g.drawImage(im,x-im.naturalWidth*sc/2,y-im.naturalHeight*sc/2-lf,im.naturalWidth*sc,im.naturalHeight*sc)}
    else{g.fillStyle=ICH.auto.id==='vespa'?'#f3a6c6':'#1d1e24';g.beginPath();g.roundRect(x-8*Z,y-10*Z,16*Z,7*Z,3*Z);g.fill()}
    const by=y-34*Z-(p.lift||0)*Z+Math.sin(T*4)*2*Z;g.fillStyle='#ff4fa3';g.beginPath();g.moveTo(x,by+7*Z*.6);g.lineTo(x-5*Z*.6,by);g.lineTo(x+5*Z*.6,by);g.closePath();g.fill();return}
  if(p===ICH){const r0=g.createRadialGradient(x,y,0,x,y,16*s);r0.addColorStop(0,'rgba(255,79,163,.55)');r0.addColorStop(1,'rgba(255,79,163,0)');g.fillStyle=r0;g.beginPath();g.ellipse(x,y,16*s,8*s,0,0,7);g.fill()}
  FG.zeichne(g,x,y,s,p,T,!p.idle);
  if(p===ICH){
    g.strokeStyle='#ff4fa3';g.lineWidth=1.6*s;g.beginPath();g.ellipse(x,y,9*s,4.5*s,0,0,7);g.stroke();
    const by=y-52*s+Math.sin(T*4)*3*s;g.fillStyle='#ff4fa3';g.beginPath();g.moveTo(x,by+7*s);g.lineTo(x-5*s,by);g.lineTo(x+5*s,by);g.closePath();g.fill();g.strokeStyle='#fff';g.lineWidth=1*s;g.stroke()}
  if(p===ICH){const fs=Math.max(10,11*Z/DPR)*DPR;g.font='800 '+fs+'px Inter';const t1='DU',t2='';const w1=g.measureText(t1).width;g.font='600 '+(fs*.82)+'px Inter';const w2=t2?g.measureText(t2).width:0;
    const bw=w1+(t2?w2+14*DPR:0)+16*DPR,bx=x-bw/2,by2=y-62*s-fs;g.fillStyle='#ff4fa3';g.beginPath();g.roundRect(bx,by2,bw,fs+10*DPR,6*DPR);g.fill();
    g.textBaseline='middle';g.textAlign='left';g.fillStyle='#fff';g.font='800 '+fs+'px Inter';g.fillText(t1,bx+8*DPR,by2+(fs+10*DPR)/2);if(t2){g.font='600 '+(fs*.82)+'px Inter';g.fillStyle='rgba(255,255,255,.9)';g.fillText(t2,bx+w1+18*DPR,by2+(fs+10*DPR)/2)}g.textAlign='center';return}
  if(p.star&&!(Z/DPR>2.4||p.stil>=15000||INNEN))return;
  if(p.star){const fs=Math.max(9,9.5*Z/DPR)*DPR;g.font='600 '+fs+'px Inter';const tw=g.measureText(p.name).width;
    g.fillStyle='rgba(16,18,26,.85)';rr(x-tw/2-6*DPR,y-36*s-fs-6*DPR,tw+12*DPR,fs+8*DPR,6*DPR);g.fill();g.fillStyle='#d8c39a';g.textAlign='center';g.textBaseline='middle';g.fillText(p.name,x,y-36*s-fs/2-2*DPR)}}
