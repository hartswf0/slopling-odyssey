// The player's surface. The stage is the screen; words arrive as subtitles over it, paged to fit and
// turned by the voice; choices are cards set on the stage, each showing the thing it is about, with
// the same thing badged on stage. Locked choices are cards too: touch one and the lock rattles, the
// prompter tells you why, and where a key exists he offers to take you back to where you dropped it.
import { why, propItem } from './world.js';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
const paras = s => String(s ?? '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
const sentences = p => p.split(/(?<=[.!?…:;]['’"”)*]*)\s+(?=\S)/);

// Island positions on the chart (percent of the chart area), authored to read as an archipelago.
const CHART = {
  place_paper_ledger: [17, 22], place_inbox_sea: [50, 13], place_bell_garden: [83, 22], place_oracle: [15, 51], place_vane_office: [50, 42],
  place_exile_shed: [85, 51], place_charter_room: [20, 81], place_knuthe_cave: [50, 72], place_craft_road: [80, 81], place_calibration_cave: [50, 95],
};
// wide, short chart areas (landscape phones, desktops): two staggered bands of five
const CHART_WIDE = {
  place_paper_ledger: [10, 27], place_inbox_sea: [30, 15], place_bell_garden: [50, 27], place_oracle: [70, 15], place_vane_office: [90, 27],
  place_exile_shed: [10, 77], place_charter_room: [30, 65], place_knuthe_cave: [50, 77], place_craft_road: [70, 65], place_calibration_cave: [90, 77],
};

export function makeUI({ story, staging, stage, sound, prompter }) {
  const dlg = $('#dialog'), who = dlg.querySelector('.who'), text = dlg.querySelector('.text'), acts = dlg.querySelector('.acts'), pager = dlg.querySelector('.pager'), meas = dlg.querySelector('.measure');
  const names = new Map(), beats = new Map(story.beats.map(b => [b.id, b]));
  for (const c of story.characters || []) { names.set(c.name.toLowerCase(), c.id); names.set(c.name.split(' ')[0].toLowerCase(), c.id); }
  // multiChoice choice → destination beat, so a choice can show where it goes
  const targets = new Map(); for (const b of story.beats) if (b.type === 'multiChoice') for (const c of b.parameters.choices || []) targets.set(b.id + '|' + c.id, c.target);
  // every authored choice with its siblings, so the ones ASAPS withholds can be shown with the reason
  const choiceIndex = new Map();
  for (const b of story.beats) {
    if (b.type === 'multiChoice') for (const c of b.parameters.choices || []) choiceIndex.set(b.id + '|' + c.id, { c, siblings: b.parameters.choices });
    if (b.type === 'dialogTree') (function walk(n) { if (!n) return; for (const c of n.choices || []) { choiceIndex.set(b.id + '|' + c.id, { c, siblings: n.choices });
      // ASAPS folds a continue-only node into its children's choices and joins the ids: "it_cont" + "i3" → "it_cont_i3"
      for (const cc of c.dialogNode?.choices || []) choiceIndex.set(b.id + '|' + c.id + '_' + cc.id, { c: cc, siblings: c.dialogNode.choices });
      walk(c.dialogNode); } })(b.parameters.dialogTree);
  }
  const authored = c => choiceIndex.get(beatId + '|' + String(c.id).split('.').pop());
  const placeOf = id => staging.beats[id]?.place;
  const propWords = [...new Set(Object.keys(staging.props?.names || {}).map(k => k.split('_')[0]))].filter(w => w.length > 3);
  const PROP_ALIAS = { letter: /\b(offer|letter|charter)\b/i, clementines: /clementine/i, flatwhite: /flat white/i };
  const castNames = (story.characters || []).filter(c => c.id !== 'char_player').map(c => [c.id, new RegExp(`\\b(${c.name.split(' ')[0]}|${c.name})\\b`, 'i')]);
  const fatherRe = /\b(Dad|your father|his father)\b/i;

  let current = null, beatId = null, visited = [], world = null, offered = [], lastPlace = null;
  const been = new Set(); // every beat this run has passed, rehearsed or played
  const ui = {
    sound,
    passed(id) { been.add(id); },
    setBeat(id) {
      beatId = id; been.add(id); const b = beats.get(id), place = placeOf(id);
      if (b && place && place !== lastPlace) { // a chapter slate when the scene changes, then it gets out of the way
        lastPlace = place; const s = $('#slate'); s.innerHTML = `<small>${esc((b.cluster || '').replace(/^[IVX]+\.\s*/, ''))}</small><span>${esc(b.name || '')}</span>`;
        s.classList.remove('on'); void s.offsetWidth; s.classList.add('on');
      }
    },
    setVisited(ids) { visited = ids || []; },
    setWorld(w) { world = w; },
    beat: () => beatId,
    chooseNumber(n) { current?.choose(n - 1); },
    // items a current choice uses (by its ASAPS condition, or by naming the thing), as {item name: choice number}
    usableItems() { const out = {}; offered.forEach((c, i) => { for (const k of authored(c)?.c.conditions || []) if (k.type === 'inventory') out[k.item] = i + 1; const a = ui.about(c), it = a?.kind === 'prop' && propItem(a.id); if (it && world?.inventory.some(e => e.name === it)) out[it] ||= i + 1; }); return out; },
    // the current choice about this person or thing, if any
    boundChoice(hit) { const m = (stage.marks || []).find(m => stage.same(hit, m)); if (m) return { n: m.n, text: offered[m.n - 1]?.text }; if (hit.kind === 'item') { const n = ui.usableItems()[hit.id]; if (n) return { n, text: offered[n - 1]?.text }; } return null; },
    say(t, spk) { sound.say(t, spk); },
    speakerId(s) { if (!s) return null; return names.get(String(s).toLowerCase()) || names.get(String(s).split(' ')[0].toLowerCase()) || null; },
    loading(m) { $('#loading').hidden = !m; if (m) $('#loading').textContent = m; },
    ended(m) { $('#log').insertAdjacentHTML('afterbegin', `<li class="end">Ending · ${esc(String(m).split('\n')[0].replace(/\*/g, ''))}</li>`); },
    // a changed condition, pinned to the stage for a moment
    toast(msg, good) { const el = document.createElement('div'); el.className = 'slip' + (good === false ? ' down' : ''); el.textContent = msg; $('#slips').append(el); setTimeout(() => el.remove(), 3500); },

    // What a choice is about: its destination, a prop it names, or a person it names.
    about(c) {
      const t = c.text || '', tgt = targets.get(beatId + '|' + c.id), dest = tgt && placeOf(tgt);
      if (dest && dest !== stage.place && staging.sets[dest]) return { kind: 'place', id: dest };
      for (const [k, re] of Object.entries(PROP_ALIAS)) if (re.test(t) && staging.props.names[k]) return { kind: 'prop', id: k };
      for (const w of propWords) if (new RegExp(`\\b${w}`, 'i').test(t)) return { kind: 'prop', id: Object.keys(staging.props.names).find(k => k.split('_')[0] === w) };
      for (const [id, re] of castNames) if (re.test(t)) return { kind: 'fig', id };
      if (fatherRe.test(t)) return { kind: 'fig', id: 'char_father' };
      return null;
    },

    // A card: title/speaker/body paged to fit, then the choices. Resolves with the chosen id.
    card({ title, sub, speaker, body, button, choices, timed }) {
      if (current) current.cancel();
      return new Promise(res => {
        let page = 0, pages = [], manual = -1, timer = null, idleT = null;
        const list = choices || (timed ? [] : [{ id: 'ok', text: button || 'Continue', isContinue: true }]);
        const onlyContinue = list.length === 1 && list[0].isContinue;
        const asChart = ((list.length && authored(list[0])?.siblings) || list).filter(c => { const a = ui.about(c); return a?.kind === 'place' && CHART[a.id]; }).length >= 5; // the hub stays a chart even as islands close
        who.textContent = speaker && !/^narrator$/i.test(speaker) ? speaker : ''; who.hidden = !who.textContent;
        acts.innerHTML = '';
        const marks = []; let deal = 0;
        const cardEl = (cls, html) => { const b = document.createElement('button'); b.className = 'card ' + cls; b.innerHTML = html; b.style.setProperty('--r', ((deal % 2 ? 1 : -1) * (0.6 + (deal % 3) * 0.4)).toFixed(2) + 'deg'); b.style.setProperty('--d', (deal++ * 0.07) + 's'); acts.append(b); return b; };
        if (asChart) cardEl('opt', `<span class="lbl">Unroll the chart<small>${list.length} islands within reach. Where do the winds take you?</small></span>`).onclick = () => openMap(list);
        else list.forEach((c, i) => {
          if (c.isContinue) { cardEl('cont', esc(c.text || 'Continue')).onclick = () => done(c.id); return; }
          const a = ui.about(c), b = cardEl('opt', `<span class="n">${i + 1}</span>${a ? '<span class="thumb"></span>' : ''}<span class="lbl">${md(c.text)}${c.description ? `<small>${esc(c.description)}</small>` : ''}${visited.includes(c.id) ? '<small>you have been down this road</small>' : ''}</span>`);
          b.dataset.id = c.id; b.onclick = () => done(c.id);
          if (a) { stage.thumb(a.kind, a.id, 120, 68).then(src => { const th = b.querySelector('.thumb'); if (src && th) th.style.backgroundImage = `url(${src})`; else th?.remove(); }); if (a.kind !== 'place') marks.push({ n: i + 1, kind: a.kind, id: a.id }); }
        });
        stage.marks = marks; offered = list.filter(c => !c.isContinue); ui.onChoices?.();
        // the choices ASAPS withheld: dark cards with a keyhole. Touch one to try the lock.
        const shown = new Set(list.map(c => authored(c)?.c.id ?? String(c.id).split('.').pop())), au = list.length ? authored(list[0]) : null;
        const locked = !asChart && au ? au.siblings.filter(c => c.conditions?.length && !shown.has(c.id) && !c.conditions.every(k => /^visited_/.test(k.variable || ''))) : [];
        // the card shows only the keyhole and the line: the reason is the prompter's to give, when you try it
        const lockedCard = c => { const b = cardEl('locked', `<span class="keyhole" aria-hidden="true"></span><span class="lbl">${md(c.text)}</span>`); b.setAttribute('aria-label', `Locked: ${c.text}. ${c.conditions.map(k => why(k, world, beats)).join('. ')}`); b.onclick = () => pickLock(b, c); return b; };
        locked.forEach(lockedCard);
        // page the text so nothing ever scrolls
        const html = (title ? `<h2>${esc(title)}</h2>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}` : '');
        const units = []; paras(body).forEach((p, pi) => sentences(p).forEach(s => units.push({ pi, s })));
        const render = us => { // italics can span sentences, so format whole paragraph runs; a marker orphaned by a page break is dropped
          const runs = []; for (const u of us) { if (runs.length && runs[runs.length - 1].pi === u.pi) runs[runs.length - 1].t += ' ' + u.s; else runs.push({ pi: u.pi, t: u.s }); }
          return html + runs.map(r => `<p>${md(r.t).replace(/\*/g, '')}</p>`).join(''); };
        dlg.hidden = false;
        const layout = () => {
          const wasLast = pages.length > 0 && page === pages.length - 1;
          meas.style.width = text.clientWidth + 'px'; text.style.fontSize = ''; meas.style.fontSize = '';
          const cs = getComputedStyle(dlg), full = dlg.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (who.hidden ? 0 : who.offsetHeight + 6) - pager.offsetHeight - 12;
          const withActs = full - acts.offsetHeight - 10;
          const fit = (us, h) => { meas.innerHTML = render(us); return meas.scrollHeight <= h; };
          const paginate = (us, h) => { const out = []; let cur = []; for (const u of us) { if (cur.length && !fit([...cur, u], h)) { out.push(cur); cur = []; } cur.push(u); } if (cur.length || !out.length) out.push(cur); return out; };
          pages = paginate(units, full);
          if (!fit(pages[pages.length - 1], withActs)) { const lastP = pages.pop(); pages.push(...paginate(lastP, Math.max(40, withActs))); }
          const total = units.reduce((n, u) => n + u.s.length, 0) || 1; let acc = 0;
          pages = pages.map((us, k) => { const start = acc / total; acc += us.reduce((n, u) => n + u.s.length, 0); return { us, start, h: k === pages.length - 1 ? withActs : full }; });
          show(wasLast ? pages.length - 1 : Math.min(page, pages.length - 1)); // a re-layout never takes the choices away
        };
        const show = k => {
          page = k; const p = pages[k], last = k === pages.length - 1;
          text.innerHTML = render(p.us); let fs = parseFloat(getComputedStyle(text).fontSize); while (text.scrollHeight > p.h && fs > 12) text.style.fontSize = (fs -= 1) + 'px'; // one sentence longer than the panel: smaller type, never a scrollbar
          acts.hidden = !last;
          pager.innerHTML = pages.length > 1 ? pages.map((_, i) => `<i class="${i === k ? 'on' : ''}"></i>`).join('') + (last ? '' : '<span class="tap" aria-label="Read on"></span>') : '';
          if (last) { acts.querySelector('.card.cont')?.focus({ preventScroll: true }); armIdle(); } // a choice is never pre-selected: Enter must not pick option 1
        };
        // sitting on a real choice for a long time earns a remark, at most twice
        const armIdle = () => { clearTimeout(idleT); if (offered.length < 2) return; idleT = setTimeout(() => { prompter?.say('idle'); idleT = setTimeout(() => prompter?.say('idle:2'), 70000); }, 50000); };
        const next = () => { if (page < pages.length - 1) { manual = page + 1; show(page + 1); sound.seekVoice(pages[page].start); return true; } return false; };
        const tick = () => { // the page follows the voice
          const pr = sound.voiceProgress(); if (pr == null || !pages.length) return;
          let k = 0; pages.forEach((p, i) => { if (pr >= p.start) k = i; });
          if (k > page && k > manual) show(k);
        };
        const done = id => { cleanup(); acts.innerHTML = ''; pager.innerHTML = ''; dlg.hidden = !!timed; sound.stopVoice(); sound.click(); stage.marks = []; res(id); };
        const cleanup = () => { clearInterval(timer); clearTimeout(idleT); removeEventListener('resize', layout); current = null; };
        text.onclick = pager.onclick = () => { if (!next() && onlyContinue) done(list[0].id); };
        current = { cancel: cleanup, next, pick: id => done(id), choose: n => { const b = acts.querySelectorAll('.card.opt')[n]; if (b && !acts.hidden) b.click(); }, cont: () => { if (!next()) { const b = acts.querySelector('.card.cont') || (list.length === 1 ? acts.querySelector('.card') : null); b?.click(); } }, marks };
        requestAnimationFrame(layout); addEventListener('resize', layout);
        timer = setInterval(tick, 150);
        sound.event('page');
        if (timed) setTimeout(() => { const wait = () => sound.voiceProgress() != null ? setTimeout(wait, 300) : done('timeout'); wait(); }, Math.min(timed, 8) * 1000);
      });
    },
  };

  // Try a locked door: it rattles, the prompter says why. If the key was dropped somewhere you can
  // go back to, the card turns into that offer; touching it again rewinds (everything after is undone).
  function pickLock(card, c) {
    sound.event('rattle'); card.classList.remove('rattle'); void card.offsetWidth; card.classList.add('rattle');
    if (card.classList.contains('offer') && card._rewind) { card._rewind.go(); return; } // the prompter speaks when we land
    prompter?.say(prompter.lockKey(c.conditions), { force: true });
    const rw = ui.rewindFor?.(c.conditions);
    setTimeout(() => dispatchEvent(new Event('resize')), 30); // the card may have grown: page the words again
    if (rw) { card._rewind = rw; card.classList.add('offer'); (card.querySelector('small') || card.querySelector('.lbl').appendChild(document.createElement('small'))).textContent = `Touch again to go back to ${rw.name.replace(/\.$/, '')}. Everything after it is undone.`; }
  }
  ui.pickLock = pickLock;

  // ---------- the chart (choose an island) and the journey map ----------
  const map = $('#map');
  function openMap(choices) {
    const pick = !!choices; map.hidden = false; map.classList.toggle('choose', pick);
    const body = map.querySelector('.mapbody'); map.querySelector('h2').textContent = pick ? 'The Chart of Islands' : 'Your journey';
    map.querySelector('.hint').textContent = pick ? 'Touch an island to sail there.' : 'Where you have been is lit. The rest is still dark.';
    if (pick) {
      body.innerHTML = '<div class="chart"></div>'; const ch = body.firstChild, POS = ch.clientWidth / Math.max(1, ch.clientHeight) > 1.3 ? CHART_WIDE : CHART;
      const au = authored(choices[0]), all = au ? au.siblings : choices;
      all.forEach(c => {
        const i = choices.findIndex(x => x.id === c.id), open = i >= 0, a = ui.about(c), pos = a && POS[a.id] || [10 + (all.indexOf(c) % 5) * 20, 30 + Math.floor(all.indexOf(c) / 5) * 40];
        const closed = !open && (c.conditions || []).filter(k => !/^visited_/.test(k.variable || '')), wasHere = !open && !closed.length;
        const b = document.createElement('button'); b.className = 'isle' + (open ? '' : wasHere ? ' seen' : ' shut'); b.style.left = pos[0] + '%'; b.style.top = pos[1] + '%';
        const [name, ...rest] = c.text.split(/,\s*/);
        b.innerHTML = `<span class="img"></span><span class="nm">${open ? `<b>${i + 1}</b> ` : ''}${esc(name)}</span><small>${esc(open ? rest.join(', ') : wasHere ? 'you have been' : closed.map(k => why(k, world, beats)).join('. '))}</small>`;
        b.onclick = () => { if (open) { closeMap(); current?.pick(c.id); } else { sound.event('rattle'); prompter?.say(wasHere ? 'var:visited' : prompter.lockKey(closed), { force: true }); } };
        if (open) b.dataset.open = '1';
        if (a) stage.thumb('place', a.id, 200, 112).then(src => { if (src) b.querySelector('.img').style.backgroundImage = `url(${src})`; });
        ch.append(b);
      });
    } else {
      const seenPlaces = new Set([...been].map(placeOf).filter(Boolean)); if (stage.place) seenPlaces.add(stage.place);
      const hereAct = (beats.get(beatId)?.cluster || '').replace(/^II\. Islands$/, 'II. The Voyage');
      const acts2 = []; for (const b of story.beats) { const p = placeOf(b.id), cl = (b.cluster || '').replace(/^II\. Islands$/, 'II. The Voyage'); if (!p) continue; let a = acts2.find(x => x.name === cl); if (!a) acts2.push(a = { name: cl, places: [] }); if (!a.places.includes(p)) a.places.push(p); }
      body.innerHTML = acts2.map(a => `<section><h3>${esc(a.name)}</h3><div class="row">${a.places.map(p => { const lit = seenPlaces.has(p), here = p === stage.place && a.name === hereAct; return `<div class="pl${lit ? ' lit' : ''}${here ? ' here' : ''}" data-p="${p}"><span class="img"></span><span>${lit ? esc(placeName(p)) : ''}</span>${here ? '<em>you are here</em>' : ''}</div>`; }).join('')}</div></section>`).join('');
      body.querySelectorAll('.pl.lit').forEach(el => stage.thumb('place', el.dataset.p, 160, 90).then(src => { if (src) el.querySelector('.img').style.backgroundImage = `url(${src})`; }));
    }
    map.querySelector('.close').focus({ preventScroll: true });
  }
  const placeName = p => (staging.sets[p]?.name || p.replace(/^place_/, '').replace(/_/g, ' ')).replace(/\b\w/g, c => c.toUpperCase());
  function closeMap() { map.hidden = true; }
  map.querySelector('.close').onclick = closeMap;
  map.addEventListener('click', e => { if (e.target === map) closeMap(); });
  $('#mapBtn').onclick = () => openMap(null);
  ui.openMap = openMap;

  // ---------- the stage answers touch ----------
  const cv = $('#stage');
  const toStage = e => { const r = cv.getBoundingClientRect(); return stage.toWorld((e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height); };
  cv.addEventListener('pointermove', e => { const h = stage.hitAt(...toStage(e)); stage.hover = h; cv.style.cursor = h ? 'pointer' : 'default'; });
  cv.addEventListener('pointerleave', () => { stage.hover = null; });
  let misses = [], pokes = [];
  cv.addEventListener('click', e => {
    const now = performance.now(), h = stage.hitAt(...toStage(e));
    if (!h) { misses = misses.filter(t => now - t < 6000).concat(now); if (misses.length >= 3) { misses = []; prompter?.say('scenery'); } return; } // scenery is scenery, and he will say so
    pokes = pokes.filter(p => now - p.t < 10000 && p.id === h.id).concat({ t: now, id: h.id }); if (pokes.length >= 4) { pokes = []; prompter?.say('poke'); }
    stage.poke(h); ui.onInspect?.(h); // the sheet: who or what it is, how they are, and the choice about them
  });

  // ---------- controls wake when you reach for them ----------
  const ctl = $('#controls'); let sleepT;
  const wake = () => { ctl.classList.add('awake'); clearTimeout(sleepT); sleepT = setTimeout(() => ctl.classList.remove('awake'), 2600); };
  addEventListener('pointermove', e => { if (e.clientY < 90) wake(); }); addEventListener('touchstart', e => { if (e.touches[0]?.clientY < 90) wake(); }, { passive: true });

  // ---------- keys: Space/Enter/→ read on, 1-9 choose, M map, J journal, Esc close ----------
  addEventListener('keydown', e => {
    if (e.target.closest('select, input')) return;
    if (e.key === 'Escape') { closeMap(); for (const o of ['#menu', '#sheet', '#journal']) $(o).hidden = true; return; }
    if (!$('#sheet').hidden || !$('#journal').hidden) return;
    if (e.key.toLowerCase() === 'j') { $('#journalBtn').click(); return; }
    if (!map.hidden && map.classList.contains('choose') && /^[1-9]$/.test(e.key)) { map.querySelectorAll('.isle[data-open]')[+e.key - 1]?.click(); return; }
    if (!current || !map.hidden || !$('#menu').hidden) { if (e.key.toLowerCase() === 'm' && current) openMap(null); return; }
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { if (document.activeElement?.closest('#dialog .acts') && e.key !== 'ArrowRight') return; e.preventDefault(); current.cont(); }
    else if (/^[1-9]$/.test(e.key)) current.choose(+e.key - 1);
    else if (e.key.toLowerCase() === 'm') { const c = [...acts.querySelectorAll('.card.opt')].find(b => /Unroll the chart/.test(b.textContent)); c ? c.click() : openMap(null); }
  });

  // ---------- menu ----------
  $('#menuBtn').onclick = () => { $('#menu').hidden = !$('#menu').hidden; };
  $('#menu .close').onclick = () => { $('#menu').hidden = true; };
  return ui;
}
