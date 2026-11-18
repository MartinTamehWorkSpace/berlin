// Glow City · server.js · Eigene Konten außerhalb von Claude (Netlify): Anmeldefenster mit Name und Passwort, dann Spielstand, Spielerliste und Chat über /api.
// Stellt dieselbe Schnittstelle bereit wie Claude (claude.use: db, user, room), damit konto.js unverändert bleibt. Auf claude.ai greift das nicht.
(function () { if (window.claude || typeof location === 'undefined' || !/^https?:$/.test(location.protocol) || /claude\.ai|claudeusercontent/.test(location.host)) return;
  const TOKEN = 'berlinToken'; let token = null, ich = null;
  // Einladungslink ?ref=name: merken, bis sich jemand ein Konto anlegt
  try { const r = new URLSearchParams(location.search).get('ref'); if (r) localStorage.setItem('berlinRef', r) } catch (e) {}
  try { token = localStorage.getItem(TOKEN) } catch (e) {}
  async function api(methode, pfad, daten, offen) { const r = await fetch(pfad, { method: methode, headers: Object.assign({ 'content-type': 'application/json' }, token && !offen ? { authorization: 'Bearer ' + token } : {}), body: daten == null ? undefined : JSON.stringify(daten) });
    const j = await r.json().catch(() => ({})); if (!r.ok) { const f = new Error(j.fehler || 'Fehler'); f.status = r.status; throw f } return j }
  // Anmeldefenster über dem Startbildschirm
  function fenster() { return new Promise(fertig => { const d = document.createElement('div'); d.className = 'login'; d.innerHTML = `<div class="loginbox"><div class="loginlogo">Glow <span>City</span></div><p>Melde dich an oder leg dein Konto an. Dein Spielstand wird gespeichert, auf jedem Gerät.</p>
      <label>Name<input id="lName" autocomplete="username" maxlength="20" placeholder="z. B. lena.glow"></label><label>Passwort<input id="lPw" type="password" autocomplete="current-password" maxlength="60" placeholder="mindestens 4 Zeichen"></label>
      <div class="loginfehler" id="lFehler"></div><button class="cta" id="lAn">Anmelden</button><button class="zweit" id="lNeu">Neues Konto anlegen</button><button class="gast" id="lGast">Ohne Konto spielen</button></div>`;
    document.body.append(d); const f = d.querySelector('#lFehler'), feld = () => ({ name: d.querySelector('#lName').value.trim(), passwort: d.querySelector('#lPw').value });
    const los = async neu => { f.textContent = ''; const daten = feld(); if (!daten.name || !daten.passwort) { f.textContent = 'Name und Passwort eingeben'; return }
      try { let ref = null; try { ref = localStorage.getItem('berlinRef') } catch (e) {} const r = await api('POST', neu ? '/api/registrieren' : '/api/anmelden', neu ? Object.assign({ ref }, daten) : daten); token = r.token; ich = r; if (neu) { try { ich = await api('GET', '/api/ich') } catch (e) {} } try { localStorage.setItem(TOKEN, token) } catch (e) {} d.remove(); fertig(true) } catch (e) { f.textContent = e.message } };
    d.querySelector('#lAn').onclick = () => los(false); d.querySelector('#lNeu').onclick = () => los(true); d.querySelector('#lPw').onkeydown = e => { if (e.key === 'Enter') los(false) };
    d.querySelector('#lGast').onclick = () => { d.remove(); fertig(false) } }) }
  const angemeldet = (async () => { if (token) { try { ich = await api('GET', '/api/ich'); return true } catch (e) { token = null; try { localStorage.removeItem(TOKEN) } catch (x) {} } } return await fenster() })();
  angemeldet.then(ok => { window.KONTO_ICH = ok ? ich : null; });
  angemeldet.then(ok => { if (ok && ich && typeof ST !== 'undefined' && ST.profil && !ST.profil.handle) { ST.profil.handle = '@' + ich.name.replace(/^@/, ''); const h = document.getElementById('sHandle'); if (h) h.value = ST.profil.handle } });
  // Abmelden-Knopf für geteilte Geräte
  window.glowAbmelden = () => { try { localStorage.removeItem(TOKEN); localStorage.removeItem('berlin') } catch (e) {} location.reload() };
  // Sparsam mit dem Server: nur sichtbare Tabs fragen nach, eine gemeinsame Spielerliste für Ranking und Anwesenheit
  const sichtbar = () => typeof document === 'undefined' || !document.hidden;
  let liste = null, listeZeit = 0, listeHol = null; const SPIELER_HOER = [];
  async function spielerHolen() { if (listeHol) return listeHol; listeHol = api('GET', '/api/spieler', null, true).then(r => { liste = r.spieler; listeZeit = Date.now(); SPIELER_HOER.forEach(f => f(liste)); return liste }).finally(() => { listeHol = null }); return listeHol }
  setInterval(() => { if (sichtbar() && SPIELER_HOER.length && Date.now() - listeZeit > 25000) spielerHolen().catch(() => {}) }, 5000);
  // Spielstand nur schreiben, wenn sich etwas geändert hat, höchstens alle 20 Sekunden, und beim Verlassen der Seite
  let zuletztStand = '', offenStand = null, standZeit = 0, standTimer = null;
  function standSenden() { standTimer = null; if (!offenStand) return Promise.resolve(); const d = offenStand; offenStand = null; standZeit = Date.now(); return api('PUT', '/api/stand', d) }
  function standMerken(d) { const { zeit, ...rest } = d, k = JSON.stringify(rest); if (k === zuletztStand) return Promise.resolve(); zuletztStand = k; offenStand = d;
    const warte = Math.max(0, 20000 - (Date.now() - standZeit)); if (!warte) return standSenden(); if (!standTimer) standTimer = setTimeout(standSenden, warte); return Promise.resolve() }
  if (typeof addEventListener === 'function') addEventListener('pagehide', () => { if (offenStand && token) fetch('/api/stand', { method: 'PUT', keepalive: true, headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: JSON.stringify(offenStand) }).catch(() => {}) });
  const db = { doc: () => ({ get: async () => { const d = await api('GET', '/api/stand'); if (d.stand) { const { zeit, ...rest } = d; zuletztStand = JSON.stringify(rest) } return { exists: !!d.stand, data: () => d } }, set: standMerken }),
    collection: () => ({ onSnapshot(cb, fehler) { SPIELER_HOER.push(l => cb({ docs: l.map(x => ({ id: x.id, data: () => x })) })); spielerHolen().catch(e => fehler && fehler(e)) } }) };
  const user = { id: async () => ich.id, can: async () => true, isOwner: () => false, canEdit: () => false, me: async () => ({ id: ich.id, name: ich.name }) };
  const room = { on(thema, fn) { if (thema !== 'chat') return; let seit = Date.now() - 5 * 60000; const hol = async () => { if (!sichtbar()) return; try { const r = await api('GET', '/api/chat', null, true); for (const m of r.nachrichten) { if (m.t <= seit) continue; seit = m.t; fn({ data: { handle: m.handle, text: m.text, t: m.t }, isMe: m.id === ich.id, sameTab: m.id === ich.id }) } } catch (e) {} }; hol(); setInterval(hol, 4000) },
    emit: (thema, d) => thema === 'chat' ? api('POST', '/api/chat', d) : Promise.resolve(), presence() {},
    onPeers(fn) { const zeigen = l => fn(l.filter(x => Date.now() - (x.zeit || 0) < 120000).map(x => ({ isMe: x.id === ich.id, state: { handle: x.handle } }))); SPIELER_HOER.push(zeigen); if (liste) zeigen(liste); else spielerHolen().catch(() => {}) } };
  window.claude = { use: async name => (await angemeldet) ? ({ db, user, room })[name] || null : null } })();
