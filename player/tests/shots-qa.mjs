// Shot check and contact sheet: every beat, framed as the stage would frame it, on one screen shape.
// A beat passes when the people who matter have their heads in the clear part of the frame: below the
// valance and above the subtitles and cards. Who matters: whoever the beat's authored shot (shots.json)
// holds; for a beat with no shot, Odie (if on stage) and whoever speaks first.
//   python3 -m http.server 8765   (in player/)
//   node tests/shots-qa.mjs phone out/shots-phone      → out/shots-phone.png, .json
//   node tests/shots-qa.mjs desk  out/shots-desk
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [frame = 'phone', out = 'shots-' + frame, base = 'http://localhost:8765/'] = process.argv.slice(2);
const view = frame === 'phone' ? { width: 390, height: 844 } : { width: 1280, height: 800 };
// where words and cards begin, as a share of the frame's height (measured from the live page)
const BAND = frame === 'phone' ? 0.56 : 0.72;

const b = await chromium.launch(); const p = await (await b.newContext({ viewport: view, deviceScaleFactor: 1 })).newPage();
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(base + 'index.html'); await p.waitForFunction(() => window.__player);
await p.waitForTimeout(3000); // the rigs load in the background
const rows = await p.evaluate(async ({ BAND }) => {
  const s = window.__player.stage, frame2 = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  document.querySelector('#start-screen').hidden = true; s.quiet = true;
  const res = [];
  for (const id of Object.keys(s.staging.beats)) {
    await s.setScene(id); await s.setProps(id); clearInterval(s.panTimer);
    const beat = s.staging.beats[id], others = (beat.cast || []).filter(c => c !== 'char_player');
    s.setSpeaker(others[0] || null);
    for (const [k, f] of s.figures) { if (f.leaving) s.figures.delete(k); else f.x = f.tx; }
    s.watson.x = s.watson.tx; s.cam = null; await frame2(); await frame2();
    const c = s.cam, W = s.cv.width, CH = s.cv.height, top = s.tall ? (s.valanceH || 0) : 0, bot = CH * BAND;
    const sx = wx => W / 2 + (wx - c.x) * c.s, sy = wy => CH / 2 + (wy - c.y) * c.s;
    const head = h => { const [a, b0, c0, d] = h.r, hb = b0 + (d - b0) * 0.22; return [sx(a), sy(b0), sx(c0), sy(hb)]; };
    const inside = ([a, b0, c0, d]) => { const w = Math.max(0, Math.min(c0, W) - Math.max(a, 0)), h = Math.max(0, Math.min(d, bot) - Math.max(b0, top)); return (w * h) / ((c0 - a) * (d - b0)); };
    // who matters: the people an authored shot holds; otherwise Odie and the first to speak
    const matter = s.shot ? s.shotSubjects(s.shot) : [...(beat.cast?.includes('char_player') ? ['char_player'] : []), ...(others[0] ? [others[0]] : [])];
    const checks = matter.map(m => { const h = s.hits.find(q => q.kind === 'fig' && q.id === m); return { id: m, box: h && head(h), seen: h ? +inside(head(h)).toFixed(2) : 0 }; });
    const inFrame = s.hits.filter(q => q.kind === 'fig').filter(q => inside(head(q)) > 0.5).length;
    // the thumbnail: the frame as drawn, the words' band shaded, each head that matters boxed
    const tw = s.tall ? 150 : 256, th = Math.round(tw * CH / W), t = document.createElement('canvas'); t.width = tw; t.height = th;
    const g = t.getContext('2d'), k = tw / W; g.drawImage(s.cv, 0, 0, tw, th);
    g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, bot * k, tw, th - bot * k);
    for (const ch of checks) if (ch.box) { const [a, b0, c0, d] = ch.box; g.lineWidth = 2; g.strokeStyle = ch.seen >= 0.7 ? '#5fd38a' : '#ff5a4f'; g.strokeRect(a * k, b0 * k, (c0 - a) * k, (d - b0) * k); }
    res.push({ id, place: beat.place, shot: s.shot || null, cast: beat.cast, checks: checks.map(({ id, seen }) => ({ id, seen })), pass: checks.every(ch => ch.seen >= 0.7), inFrame, of: s.hits.filter(q => q.kind === 'fig').length, img: t.toDataURL('image/jpeg', 0.8) });
  }
  return res;
}, { BAND });

const fails = rows.filter(r => !r.pass);
const label = r => `${r.id.replace('beat_', '')} · ${r.shot ? r.shot.size : 'auto'}`;
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:18px;background:#141110;color:#e9dcc6;font:12px/1.3 Georgia,serif}
h1{font:600 20px Georgia;margin:0 0 4px} p{margin:0 0 14px;color:#b5a58c}
.g{display:grid;grid-template-columns:repeat(auto-fill,${frame === 'phone' ? 150 : 256}px);gap:10px}
figure{margin:0} img{display:block;width:100%;border:1px solid #3a302a} figure.no img{border-color:#ff5a4f}
figcaption{display:flex;justify-content:space-between;margin-top:3px;color:#cdbb9f} figure.no figcaption{color:#ff8a80}
</style><h1>Contact sheet · ${frame === 'phone' ? 'upright phone' : 'desktop'} · ${rows.length} beats</h1>
<p>${rows.length - fails.length} pass, ${fails.length} fail. Shaded: where subtitles and cards sit. Boxes: the faces that matter (whoever the shot holds; with no authored shot, Odie and whoever speaks); green is clear, red is cut off or covered.</p>
<div class="g">${rows.map(r => `<figure class="${r.pass ? '' : 'no'}"><img src="${r.img}"><figcaption><span>${label(r)}</span><span>${r.inFrame}/${r.of}</span></figcaption></figure>`).join('')}</div>`;
mkdirSync(dirname(out) || '.', { recursive: true });
writeFileSync(out + '.html', html);
writeFileSync(out + '.json', JSON.stringify(rows.map(({ img, ...r }) => r), null, 1));
const sheet = await (await b.newContext({ viewport: { width: frame === 'phone' ? 1680 : 1650, height: 900 } })).newPage();
await sheet.goto('file://' + process.cwd() + '/' + out + '.html'); await sheet.screenshot({ path: out + '.png', fullPage: true });
console.log(`${frame}: ${rows.length - fails.length}/${rows.length} pass`, fails.length ? '· fail: ' + fails.map(r => r.id.replace('beat_', '') + '(' + r.checks.filter(c => c.seen < 0.7).map(c => c.id.replace('char_', '') + ' ' + c.seen).join(',') + ')').join(' ') : '');
await b.close();
