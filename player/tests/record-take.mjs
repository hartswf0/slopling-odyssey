// Record a watchable take of the player: the stage canvas with the card text burnt in as subtitles,
// plus the real audio output (voices, effects, music), in one MediaRecorder stream so picture and
// sound share a clock. Cards advance when the voice ends. Also writes the stage's sound-event log.
// Usage: node player/tests/record-take.mjs <rehearsal> <seconds> <out.webm> [baseUrl]   (SFX_ONLY=1: effects only, for sync)
//   e.g. node player/tests/record-take.mjs ithaca 120 take.webm http://localhost:8765/
// Needs a static server on player/ and Playwright's Chromium.
import fs from 'fs';
const [rehearsal = 'ithaca', secs = '90', out = 'take.webm', base = 'http://localhost:8765/'] = process.argv.slice(2);
const pw = await import(process.env.PLAYWRIGHT || 'playwright');
const browser = await pw.chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1500, height: 950 } });
page.on('pageerror', e => console.error('page error:', e.message));
await page.goto(base + 'index.html#' + rehearsal);
await page.waitForFunction(() => window.__player?.sound);
if (process.env.SFX_ONLY) await page.evaluate(() => Object.assign(window.__player.sound.prefs, { voice: false, music: false })); // clean onsets for tests/av_sync.py
await page.click('#start'); await page.waitForTimeout(1500);
await page.waitForFunction(() => window.__player.sound.A && !document.querySelector('#ff')?.offsetParent, null, { timeout: 120000 });
await page.evaluate(() => {
  const P = window.__player, stage = document.querySelector('#stage'), rc = document.createElement('canvas'); rc.width = 1280; rc.height = 720;
  const g = rc.getContext('2d'), card = document.querySelector('#card');
  const wrap = (s, n) => { const w = s.split(/\s+/), L = []; let l = ''; for (const x of w) { if ((l + ' ' + x).length > n) { L.push(l); l = x; } else l = l ? l + ' ' + x : x; } if (l) L.push(l); return L; };
  (function draw() {
    g.drawImage(stage, 0, 0, 1280, 720);
    if (!card.hidden) { // subtitle: speaker and the current voice-sized slice of the card, then the choices
      const who = card.querySelector('.who')?.textContent || '', body = card.querySelector('.body')?.innerText || card.querySelector('h2')?.innerText || '';
      const c = P.sound.cur, frac = c ? Math.max(0, (P.sound.A.currentTime - c.start) / c.e.dur) : 1;
      const lines = wrap(body.replace(/\n+/g, ' '), 88), per = 3, k = Math.min(Math.max(0, lines.length - per), Math.floor(frac * lines.length / per) * per);
      const show = (c ? lines.slice(k, k + per) : lines.slice(-per)), opts = c ? [] : [...card.querySelectorAll('.acts button')].map(b => '› ' + b.innerText.split('\n')[0]).slice(0, 3);
      const rows = [...(who ? [who.toUpperCase()] : []), ...show, ...opts], hh = 22 + rows.length * 26;
      g.fillStyle = 'rgba(20,14,8,.78)'; g.fillRect(0, 720 - hh, 1280, hh);
      g.font = '20px "Courier Prime", monospace'; g.textAlign = 'center'; rows.forEach((r, i) => { g.fillStyle = i === 0 && who ? '#c9a24a' : r.startsWith('›') ? '#d8c8a8' : '#f2e6cc'; g.fillText(r, 640, 720 - hh + 30 + i * 26); });
    }
    requestAnimationFrame(draw);
  })();
  const stream = rc.captureStream(30); for (const tr of P.sound.tap.stream.getAudioTracks()) stream.addTrack(tr);
  const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 3e6 });
  window.__rec = { rec, chunks: [], t0: performance.now(), audio0: P.sound.A.currentTime };
  rec.ondataavailable = e => window.__rec.chunks.push(e.data); rec.start(1000);
  P.sound.log.length = 0;
});
const until = Date.now() + +secs * 1000; let cards = 0;
while (Date.now() < until) {
  const st = await page.evaluate(() => { const c = document.querySelector('#card'); return { open: !c.hidden && !!c.querySelector('.acts button'), voiced: !!window.__player.sound.cur, ended: !!document.querySelector('#log li.end') }; });
  if (st.open && !st.voiced) {
    await page.waitForTimeout(1600); // a beat of silence after the line (and time for a voice to start), then choose
    if (await page.evaluate(() => !!window.__player.sound.cur || document.querySelector('#card').hidden)) continue;
    if (st.ended) { await page.waitForTimeout(2000); break; } // hold on the ending, then stop
    const n = await page.$$eval('#card .acts button', bs => bs.length);
    if (n) { await page.click(`#card .acts button >> nth=${process.env.PICK === 'cycle' ? cards % n : 0}`).catch(() => {}); cards++; } // first choice, or PICK=cycle
  }
  await page.waitForTimeout(250);
}
const res = await page.evaluate(async () => {
  const R = window.__rec; await new Promise(r => { R.rec.onstop = r; R.rec.stop(); });
  const b = new Blob(R.chunks, { type: 'video/webm' }), u8 = new Uint8Array(await b.arrayBuffer()); let s = '';
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  return { b64: btoa(s), log: window.__player.sound.log.map(e => ({ name: e.name, t: (e.at - R.t0) / 1000, audio: e.audio - R.audio0 })) };
});
fs.writeFileSync(out, Buffer.from(res.b64, 'base64'));
fs.writeFileSync(out.replace(/\.webm$/, '') + '.events.json', JSON.stringify(res.log, null, 0));
console.log(`wrote ${out} (${cards} cards advanced, ${res.log.length} sound events)`);
await browser.close();
