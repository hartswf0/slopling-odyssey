// Play the real UI to an ending with random choices, as a player would (taps, reading on, the chart),
// and report any route that stalls or errors. Usage: node player/tests/fuzz-ui.mjs <preset> <runs> <seed>
// Needs a static server on player/ at :8765. PLAYWRIGHT=<path to playwright's index.mjs> if not installed.
const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright');
const [preset = 'start', runs = 3, seed0 = 1] = process.argv.slice(2);
const b = await chromium.launch();
for (let run = 0; run < +runs; run++) {
  let s = +seed0 + run * 7919; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 140))); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });
  await p.goto('http://localhost:8765/index.html#' + preset); await p.waitForFunction(() => window.__player);
  await p.evaluate(() => { window.__player.sound.prefs.voice = false; window.__player.sound.prefs.music = false; });
  await p.click('#start');
  const path = []; let stuck = null, ending = null, idle = 0, last = '';
  for (let step = 0; step < 400; step++) {
    await p.waitForTimeout(250);
    const st = await p.evaluate(() => { const d = document.querySelector('#dialog'), m = document.querySelector('#map');
      return { beat: document.querySelector('#beat').textContent, dlg: !d.hidden, more: !!d.querySelector('.pager .tap'), btns: [...d.querySelectorAll('.acts button')].map(b => b.innerText.split('\n').pop().slice(0, 50)),
        chart: !m.hidden && m.classList.contains('choose'), isles: [...m.querySelectorAll('.isle:not([disabled])')].length, ended: [...document.querySelectorAll('#log li.end')].map(l => l.textContent)[0], ff: !document.querySelector('#ff').hidden }; });
    if (st.ended) { ending = st.ended; break; }
    const sig = st.beat + st.btns.join('|') + st.more + st.chart;
    if (sig === last && !st.ff) idle++; else { idle = 0; last = sig; }
    if (idle > 60) { stuck = st; break; } // 15 s with nothing changing and nothing to press
    if (st.ff) continue;
    if (st.chart) { const k = Math.floor(rnd() * st.isles); path.push('isle#' + k); await p.click(`.isle:not([disabled]) >> nth=${k}`); continue; }
    if (!st.dlg || !st.btns.length) continue;
    if (st.more) { await p.click('#dialog .text'); continue; }
    if (st.btns.length === 1) { path.push(st.btns[0]); await p.click('#dialog .acts button:not(.locked)', { timeout: 4000 }).catch(() => p.click('#dialog .text').catch(() => {})); continue; }
    const k = Math.floor(rnd() * st.btns.length); path.push(`${st.beat.split(' ')[0]}:${st.btns[k]}`);
    try { await p.click(`#dialog .acts button:not(.locked) >> nth=${k}`, { timeout: 4000 }); } catch (e) {
      console.log('UNCLICKABLE', JSON.stringify(await p.evaluate(() => { const d = document.querySelector('#dialog'), a = d.querySelector('.acts'), r = el => { const q = el.getBoundingClientRect(); return [Math.round(q.top), Math.round(q.bottom)]; };
        return { actsHidden: a.hidden, dlg: r(d), acts: r(a), btns: [...a.querySelectorAll('button')].map(r), text: r(d.querySelector('.text')), pager: d.querySelector('.pager').innerHTML.slice(0, 80), dlgH: d.clientHeight, vh: innerHeight }; })));
      // the panel re-paged since we looked: read on, like a player would; only a second failure counts
      await p.click('#dialog .text').catch(() => {}); path.push('(read on)'); if (path.filter(x => x === '(read on)').length > 20) { stuck = { unclickable: st.btns[k] }; break; } }
  }
  console.log(`run ${run} ${preset}: ${ending ? 'ENDING ' + ending : stuck ? 'STUCK at ' + JSON.stringify(stuck) : 'step limit'} · ${path.length} actions · errors ${errs.length}`);
  for (const e of [...new Set(errs)].slice(0, 4)) console.log('   ', e);
  if (stuck) console.log('   last actions:', path.slice(-6).join(' → '));
  await p.close();
}
await b.close();
