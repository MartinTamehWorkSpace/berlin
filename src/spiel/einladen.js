// Berlin · einladen.js · Freundinnen einladen: eigener Link (?ref=konto). Wer darüber ein Konto anlegt, bekommt 1 Mio. € Startbonus,
// wer eingeladen hat, bekommt 2 Mio. € je neuer Freundin. Gezählt wird auf dem Server (netlify/functions/api.mjs), ausgezahlt hier einmalig.
const EINLADEN = { bonusNeu: 1000000, bonusFreundin: 2000000 };
function einladenPruefen() { const ich = window.KONTO_ICH; if (!ich || !document.getElementById('start').hidden) return;
  if (ich.ref && !ST.refBonus) { ST.refBonus = 1; ST.geld += EINLADEN.bonusNeu; banner('🎁 WILLKOMMEN', `Eingeladen von @${ich.ref}`, `+${euro(EINLADEN.bonusNeu)} Startbonus`); save(); hud() }
  const neu = (ich.freunde || 0) - (ST.refGezahlt || 0); if (neu > 0) { ST.refGezahlt = ich.freunde; ST.geld += neu * EINLADEN.bonusFreundin; banner('💌 FREUNDIN DABEI', `${neu} neue ${neu === 1 ? 'Freundin' : 'Freundinnen'} über deinen Link`, `+${euro(neu * EINLADEN.bonusFreundin)}`); save(); hud() } }
setInterval(einladenPruefen, 5000);
function einladenBereich(cb) { const ich = window.KONTO_ICH; cb.append(el_('h4', null, '💌 Freundinnen einladen'));
  if (!ich) { cb.append(el_('p', 'hin', 'Mit Konto bekommst du deinen eigenen Einladungslink.')); return }
  const link = `${location.origin}/m/${encodeURIComponent(ich.id)}`; cb.append(el_('p', 'hin', `Für jede Freundin, die sich über deinen Link anmeldet: ${euro(EINLADEN.bonusFreundin)} für dich, ${euro(EINLADEN.bonusNeu)} für sie. Bisher dabei: ${ich.freunde || 0}.`));
  const feld = el_('input', 'einladelink'); feld.value = link; feld.readOnly = true; feld.onclick = () => feld.select(); const r = el_('div', 'partygaeste');
  const kopie = el_('button', 'zweit', '📋 Link kopieren'); kopie.onclick = () => { navigator.clipboard && navigator.clipboard.writeText(link).then(() => toast('Link kopiert')).catch(() => feld.select()) };
  r.append(kopie); if (navigator.share) { const teil = el_('button', 'zweit', '📤 Teilen'); teil.onclick = () => navigator.share({ title: 'Berlin', text: 'Bau mit mir deine Beauty-Klinik in Berlin 💖', url: link }).catch(() => {}); r.append(teil) }
  if (ich.admin) { const a = el_('button', 'zweit', '📊 Dashboard öffnen'); a.onclick = () => open('/dashboard.html', '_blank'); r.append(a) } cb.append(feld, r) }
