// Glow City Server auf Netlify: Konten (Name und Passwort), Spielstände, Spielerliste fürs Ranking, Stadt-Chat.
// Speicher: Netlify Blobs. Passwörter nur als scrypt-Hash mit Salz. Sitzungen als zufälliges Token.
import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';
const S = n => getStore({ name: n, consistency: 'strong' });
const antwort = (daten, status = 200) => new Response(JSON.stringify(daten), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
// Öffentliche Listen (Spieler, Chat) liefert das Netlify-CDN für alle aus: die Funktion läuft dann nur alle paar Sekunden einmal, egal wie viele spielen
const geteilt = (daten, sek) => new Response(JSON.stringify(daten), { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=0, must-revalidate', 'netlify-cdn-cache-control': `public, durable, s-maxage=${sek}, stale-while-revalidate=${sek * 4}` } });
// Spielerliste: aus allen Profilen höchstens alle 30 Sekunden neu gebaut, sonst aus dem Zwischenspeicher
async function spielerListe() { const c = await S('cache').get('spieler', { type: 'json' }); if (c && Date.now() - c.t < 30000) return c.liste;
  const { blobs } = await S('profile').list(), alle = (await Promise.all(blobs.map(b => S('profile').get(b.key, { type: 'json' })))).filter(Boolean);
  const liste = alle.sort((a, b) => (b.zeit || 0) - (a.zeit || 0)).slice(0, 300); await S('cache').setJSON('spieler', { t: Date.now(), liste }); return liste }
const idVon = name => String(name || '').toLowerCase().replace(/^@/, '').replace(/[^a-z0-9äöüß._-]/g, '').slice(0, 20);
const hash = (pw, salz) => crypto.scryptSync(String(pw), salz, 32).toString('hex');
async function sitzung(req) { const t = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, ''); if (!/^[a-f0-9]{48}$/.test(t)) return null; return await S('sitzungen').get(t, { type: 'json' }) }
async function neueSitzung(id, name) { const t = crypto.randomBytes(24).toString('hex'); await S('sitzungen').setJSON(t, { id, name, t: Date.now() }); return t }
export default async (req) => {
  const url = new URL(req.url), weg = url.pathname.replace(/^\/api\/?/, ''), m = req.method;
  try {
    if (weg === 'registrieren' && m === 'POST') { const { name, passwort, ref } = await req.json(), id = idVon(name), refId = idVon(ref);
      if (id.length < 3) return antwort({ fehler: 'Name mit mindestens 3 Zeichen' }, 400); if (String(passwort || '').length < 4) return antwort({ fehler: 'Passwort mit mindestens 4 Zeichen' }, 400);
      if (await S('konten').get(id)) return antwort({ fehler: 'Name ist schon vergeben' }, 409);
      const salz = crypto.randomBytes(16).toString('hex'); const ALIAS = { martin: 'martintameh' }, refEcht = ALIAS[refId] || refId; /* kurze Einladungsnamen */ const geworben = refEcht && refEcht !== id && await S('konten').get(refEcht) ? refEcht : null;
      await S('konten').setJSON(id, { id, name: String(name).slice(0, 20), salz, hash: hash(passwort, salz), erstellt: Date.now(), ref: geworben });
      if (geworben) { const e = (await S('empfehlungen').get(geworben, { type: 'json' })) || []; e.push({ id, t: Date.now() }); await S('empfehlungen').setJSON(geworben, e) }
      return antwort({ token: await neueSitzung(id, name), id, name }) }
    if (weg === 'anmelden' && m === 'POST') { const { name, passwort } = await req.json(), id = idVon(name), k = await S('konten').get(id, { type: 'json' });
      if (!k) return antwort({ fehler: 'Konto nicht gefunden' }, 404); const ok = crypto.timingSafeEqual(Buffer.from(hash(passwort, k.salz), 'hex'), Buffer.from(k.hash, 'hex'));
      if (!ok) return antwort({ fehler: 'Passwort stimmt nicht' }, 401); return antwort({ token: await neueSitzung(id, k.name), id, name: k.name }) }
    if (weg === 'spieler' && m === 'GET') return geteilt({ spieler: await spielerListe() }, 20);
    if (weg === 'statistik' && m === 'GET') { const { blobs } = await S('konten').list(), alle = (await Promise.all(blobs.map(b => S('konten').get(b.key, { type: 'json' })))).filter(Boolean), tag = 864e5, jetzt = Date.now();
      const p = await spielerListe(); return geteilt({ konten: alle.length, heute: alle.filter(k => jetzt - (k.erstellt || 0) < tag).length, woche: alle.filter(k => jetzt - (k.erstellt || 0) < 7 * tag).length, geworben: alle.filter(k => k.ref).length, aktiv24h: p.filter(x => jetzt - (x.zeit || 0) < tag).length, stand: new Date().toISOString() }, 60) }
    if (weg === 'chat' && m === 'GET') return geteilt({ nachrichten: (await S('chat').get('log', { type: 'json' })) || [] }, 3);
    // Wartung nur mit Einmal-Schlüssel aus der Umgebung (WARTUNG_KEY), wird nach Gebrauch wieder gelöscht: Konto umbenennen (zieht alle Daten mit) und Passwort setzen
    if (weg.startsWith('wartung/') && m === 'POST') { const key = process.env.WARTUNG_KEY; if (!key || req.headers.get('x-wartung') !== key) return antwort({ fehler: 'Kein Zugang' }, 403); const d = await req.json();
      if (weg === 'wartung/umbenennen') { const alt = idVon(d.alt), neu = idVon(d.name), k = await S('konten').get(alt, { type: 'json' }); if (!k) return antwort({ fehler: 'Konto nicht gefunden' }, 404); if (alt !== neu && await S('konten').get(neu)) return antwort({ fehler: 'Name vergeben' }, 409);
        k.id = neu; k.name = String(d.name).slice(0, 20); await S('konten').setJSON(neu, k); for (const st of ['staende', 'profile', 'empfehlungen']) { const v = await S(st).get(alt); if (v != null) { let w = v; if (st !== 'empfehlungen') { try { const o = JSON.parse(v); if (st === 'profile') o.id = neu; o.handle = '@' + k.name; if (o.stand) { const sd = JSON.parse(o.stand); if (sd.profil) sd.profil.handle = '@' + k.name; o.stand = JSON.stringify(sd) } w = JSON.stringify(o) } catch (e) {} } await S(st).set(neu, w); if (alt !== neu) await S(st).delete(alt) } }
        if (alt !== neu) await S('konten').delete(alt); await S('cache').delete('spieler'); return antwort({ ok: true, id: neu }) }
      if (weg === 'wartung/passwort') { const k = await S('konten').get(idVon(d.id), { type: 'json' }); if (!k) return antwort({ fehler: 'Konto nicht gefunden' }, 404); k.salz = crypto.randomBytes(16).toString('hex'); k.hash = hash(d.passwort, k.salz); await S('konten').setJSON(k.id, k); return antwort({ ok: true }) } }
    const s = await sitzung(req); if (!s) return antwort({ fehler: 'Bitte anmelden' }, 401);
    // Admin (Konten aus ADMIN_IDS): alle Spieler mit Werten, wer online ist, Passwort neu setzen. Passwörter liegen nur verschlüsselt vor und werden nie angezeigt.
    const admin = (process.env.ADMIN_IDS || '').split(',').map(x => x.trim()).includes(s.id);
    if (weg === 'admin/spieler' && m === 'GET') { if (!admin) return antwort({ fehler: 'Kein Zugang' }, 403); const { blobs } = await S('konten').list(), jetzt = Date.now();
      const liste = await Promise.all(blobs.map(async b => { const k = await S('konten').get(b.key, { type: 'json' }), p = (await S('profile').get(b.key, { type: 'json' })) || {}; let st = {}; try { const roh = await S('staende').get(b.key, { type: 'json' }); st = roh && roh.stand ? JSON.parse(roh.stand) : {} } catch (e) {}
        return k && { id: k.id, name: k.name, handle: p.handle || '', erstellt: k.erstellt, zuletzt: p.zeit || 0, online: jetzt - (p.zeit || 0) < 120000, geld: Math.round(st.geld || 0), score: p.score || 0, follower: st.follower || 0, stil: st.stil || 0, behandelt: (st.klinik && st.klinik.behandelt) || 0, tage: st.tage || 0, geworben: k.ref || '' } }));
      return antwort({ spieler: liste.filter(Boolean).sort((a, b) => b.zuletzt - a.zuletzt) }) }
    if (weg === 'admin/passwort' && m === 'POST') { if (!admin) return antwort({ fehler: 'Kein Zugang' }, 403); const { id, passwort } = await req.json(), k = await S('konten').get(idVon(id), { type: 'json' }); if (!k) return antwort({ fehler: 'Konto nicht gefunden' }, 404); if (String(passwort || '').length < 4) return antwort({ fehler: 'Mindestens 4 Zeichen' }, 400);
      k.salz = crypto.randomBytes(16).toString('hex'); k.hash = hash(passwort, k.salz); await S('konten').setJSON(k.id, k); return antwort({ ok: true }) }
    if (weg === 'ich' && m === 'GET') { const k = (await S('konten').get(s.id, { type: 'json' })) || {}, e = (await S('empfehlungen').get(s.id, { type: 'json' })) || []; return antwort({ id: s.id, name: s.name, ref: k.ref || null, freunde: e.length, admin }) }
    if (weg === 'stand' && m === 'GET') { const d = await S('staende').get(s.id, { type: 'json' }); return antwort(d || {}) }
    if (weg === 'stand' && m === 'PUT') { const roh = await req.text(); if (roh.length > 900000) return antwort({ fehler: 'Spielstand zu groß' }, 413); const d = JSON.parse(roh);
      // Ein älterer Spielstand (anderes Gerät, alter Tab) überschreibt nie einen neueren
      try { const alt = await S('staende').get(s.id, { type: 'json' }), ta = alt && alt.stand ? JSON.parse(alt.stand).gespeichert || 0 : 0, tn = d.stand ? JSON.parse(d.stand).gespeichert || 0 : 0; if (ta && tn && tn < ta) return antwort({ ok: false, aelter: true }, 409) } catch (e) {}
      await S('staende').set(s.id, roh); const { stand, ...profil } = d; await S('profile').setJSON(s.id, { ...profil, id: s.id, zeit: Date.now() }); return antwort({ ok: true }) }
    if (weg === 'chat' && m === 'POST') { const { handle, text } = await req.json(), t = String(text || '').trim().slice(0, 140); if (!t) return antwort({ fehler: 'Leer' }, 400);
      const log = (await S('chat').get('log', { type: 'json' })) || []; log.push({ id: s.id, handle: String(handle || s.name).slice(0, 24), text: t, t: Date.now() }); await S('chat').setJSON('log', log.slice(-80)); return antwort({ ok: true }) }
    return antwort({ fehler: 'Unbekannt' }, 404)
  } catch (e) { return antwort({ fehler: 'Serverfehler' }, 500) }
};
export const config = { path: '/api/*' };
