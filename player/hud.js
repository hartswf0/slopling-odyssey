// What the ASAPS engine knows, without a dashboard. The pocket holds what you carry: it shows itself
// when something arrives or a choice can use it, and is faint otherwise. Everything else is one touch
// deep: touch a person for their sheet (face, mood, feelings, thoughts, the choice about them), a thing
// for what it opens later. Thoughts appear over the people who have them, and go in the Journal.
import { FACE_LABEL, COUNTERS, VARIANT_LABEL, ITEM_PROP, propItem, moodWords, why } from './world.js';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pct = v => Math.round(Math.max(0, Math.min(1, v)) * 100);
const bar = (v, cls = '') => `<span class="bar ${cls}"><i style="width:${pct(v)}%"></i></span>`;
const firstSentences = (s, n = 2) => (String(s || '').match(/[^.!?]+[.!?]+/g) || [s || '']).slice(0, n).join(' ').trim();

export function makeHUD({ story, staging, stage, ui, sound }) {
  const pocket = $('#pocket'), beats = new Map(story.beats.map(b => [b.id, b])); let gainedAt = 0;
  let world = null, prev = null;
  const insights = []; // {who, text, kind}
  // every place an item is asked for later, so its sheet can say what picking it up opens
  const usesOf = {};
  const walk = (o, beat) => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(v => walk(v, beat));
    for (const c of o.conditions || []) if (c.type === 'inventory') (usesOf[c.item] ||= []).push({ text: o.text, beat: beat.name });
    for (const v of Object.values(o)) walk(v, beat); };
  for (const b of story.beats) walk(b.parameters, b);

  const faceSrc = id => { const im = stage.faceImage(id); try { return im?.toDataURL ? im.toDataURL() : im?.src; } catch (e) { return im?.src; } };
  const itemThumb = (name, el) => { const key = ITEM_PROP[name]; if (key) stage.thumb('prop', key, 96, 96).then(src => { if (src) el.style.backgroundImage = `url(${src})`; }); };

  function render() {
    if (!world) return; const usable = ui.usableItems?.() || {};
    pocket.innerHTML = world.inventory.map(e => `<button data-item="${esc(e.name)}" class="${usable[e.name] ? 'use' : ''}" aria-label="${esc(e.name)}${usable[e.name] ? ', usable now' : ''}">${usable[e.name] ? `<em>${usable[e.name]}</em>` : ''}</button>`).join('');
    pocket.classList.toggle('rest', !Object.keys(usable).length && performance.now() - gainedAt > 6000);
    pocket.querySelectorAll('button').forEach(el => { itemThumb(el.dataset.item, el); el.onclick = () => { const n = usable[el.dataset.item]; if (n) ui.chooseNumber(n); else openSheet({ kind: 'item', id: el.dataset.item }); }; });
  }

  function update(w, live) {
    prev = world; world = w;
    stage.faces = Object.fromEntries(Object.values(w.chars).map(c => [c.id, c.face]));
    if (live && prev) {
      for (const e of w.inventory) if (!prev.inventory.some(p => p.name === e.name)) { gainedAt = performance.now(); setTimeout(render, 6100); fly(e.name); ui.toast(`Taken: ${e.name}`, true); sound.event('lift'); }
      for (const c of Object.values(w.chars)) { const before = prev.chars[c.id]?.reflections.length || 0; for (const r of c.reflections.slice(before)) { insights.push({ who: c.id, text: r.text, kind: 'thought' }); stage.think(c.id, r.text); } }
      for (const [g, st] of Object.entries(w.goals)) if (prev.goals[g] !== st) { const goal = w.chars.char_player?.goals.find(x => x.id === g); insights.push({ who: 'char_player', text: `${goal?.name || g}: ${st}`, kind: 'goal' }); ui.toast(`Goal ${st}: ${goal?.name || g}`, st !== 'failed'); }
      $('#journalBtn').dataset.n = insights.length || '';
    }
    render();
  }
  // the item flies from where it lay on stage into its slot
  function fly(name) {
    const key = ITEM_PROP[name], h = stage.hits?.find(q => q.kind === 'prop' && key && q.id.split('_')[0] === key.split('_')[0]); if (!h) return;
    requestAnimationFrame(() => {
      const cv = $('#stage').getBoundingClientRect(), slot = pocket.querySelector(`button[data-item="${CSS.escape(name)}"]`)?.getBoundingClientRect(); if (!slot) return;
      const s = cv.width / 1280, el = document.createElement('div'); el.className = 'flyer'; itemThumb(name, el);
      Object.assign(el.style, { left: cv.left + h.r[0] * s + 'px', top: cv.top + h.r[1] * s + 'px', width: (h.r[2] - h.r[0]) * s + 'px', height: (h.r[3] - h.r[1]) * s + 'px' });
      document.body.append(el); requestAnimationFrame(() => Object.assign(el.style, { left: slot.left + 'px', top: slot.top + 'px', width: slot.width + 'px', height: slot.height + 'px', opacity: 0.4 }));
      setTimeout(() => el.remove(), 900);
    });
  }

  // ---------- sheets ----------
  const sheet = $('#sheet');
  function openSheet(hit) {
    if (!world) return; let h = '';
    const bound = ui.boundChoice?.(hit); // a current choice about this person or thing
    if (hit.kind === 'fig') {
      const c = world.chars[hit.id], face = stage.faces?.[hit.id];
      const name = c?.name || stage.labelFor(hit);
      h += `<div class="head"><img class="face" src="${faceSrc(hit.id) || ''}" alt=""><div><h2>${esc(name)}</h2>${c?.variant && VARIANT_LABEL[c.variant] ? `<p class="tag">${esc(VARIANT_LABEL[c.variant])}</p>` : ''}
        ${c ? `<p class="now">Looks <b>${esc(face ? FACE_LABEL[face] : 'at rest')}</b> · mood ${esc(moodWords(c.mood))}</p>` : ''}</div></div>`;
      if (c?.about) h += `<p class="about">${esc(firstSentences(c.about))}</p>`;
      if (hit.id === 'char_player') {
        h += `<h3>Where you stand</h3><ul class="meters">${Object.entries(COUNTERS).map(([k, L]) => `<li><span>${L}</span>${bar((world.counters[k] || 0) / 10)}<b>${world.counters[k] ?? 0}</b></li>`).join('')}</ul>`;
        h += `<h3>What you want</h3><ul class="goals">${(c?.goals || []).map(g => `<li class="${world.goals[g.id] || 'open'}"><b>${esc(g.name)}</b> · ${esc(world.goals[g.id] || 'still open')}</li>`).join('')}</ul>`;
        h += `<h3>Carrying</h3><p>${world.inventory.length ? world.inventory.map(e => esc(e.name)).join(' · ') : 'Nothing yet. Things you take on stage are kept here.'}</p>`;
      } else if (c) {
        const em = Object.entries(c.emotions).filter(([, v]) => v > 0.03).sort((a, b) => b[1] - a[1]).slice(0, 3);
        if (em.length) h += `<h3>Feeling</h3><ul class="meters">${em.map(([k, v]) => `<li><span>${esc(k)}</span>${bar(v)}<b>${v.toFixed(2)}</b></li>`).join('')}</ul>`;
        const toYou = c.sentiments.filter(s => s.toEntityRef === 'player');
        if (toYou.length) h += `<h3>Toward you</h3><ul class="meters">${toYou.map(s => `<li><span>${esc(s.emotion === 'pride' ? 'pride in the title' : s.emotion === 'recognition' ? 'sees your work' : s.emotion)}</span>${bar(s.strength, s.emotion === 'recognition' ? 'r' : 'p')}<b>${s.strength.toFixed(2)}</b></li>`).join('')}</ul>`;
        if (c.reflections.length) h += `<h3>Thinking</h3>${c.reflections.slice(-2).map(r => `<blockquote>${esc(r.text)}</blockquote>`).join('')}`;
      }
    } else { // a prop on stage, or an item you carry
      const name = hit.kind === 'item' ? hit.id : propItem(hit.id) || stage.labelFor(hit), have = world.inventory.some(e => e.name === name);
      const desc = story.beats.flatMap(b => b.parameters?.props || []).find(p => p.name === name)?.description;
      h += `<div class="head"><span class="face item"></span><div><h2>${esc(name.replace(/\b\w/, x => x.toUpperCase()))}</h2><p class="tag">${have ? 'You carry this' : hit.kind === 'prop' ? 'Here, on stage' : ''}</p></div></div>`;
      if (desc) h += `<p class="about">${esc(desc)}</p>`;
      const uses = usesOf[name] || [];
      if (uses.length) h += `<h3>${have ? 'It opens, later' : 'If you take it, it opens later'}</h3><ul class="uses">${uses.map(u => `<li>“${esc(u.text)}” <small>${esc(u.beat)}</small></li>`).join('')}</ul>`;
    }
    if (bound) h += `<button class="act" data-n="${bound.n}"><span class="num">${bound.n}</span>${esc(bound.text)}</button>`;
    sheet.querySelector('.body').innerHTML = h; sheet.hidden = false;
    const it = sheet.querySelector('.face.item'); if (it) { const name = hit.kind === 'item' ? hit.id : propItem(hit.id); if (name) itemThumb(name, it); else stage.thumb('prop', hit.id, 96, 96).then(s => { if (s) it.style.backgroundImage = `url(${s})`; }); }
    sheet.querySelector('.act')?.addEventListener('click', e => { sheet.hidden = true; ui.chooseNumber(+e.currentTarget.dataset.n); });
  }
  sheet.querySelector('.close').onclick = () => { sheet.hidden = true; };
  sheet.addEventListener('click', e => { if (e.target === sheet) sheet.hidden = true; });

  // ---------- journal: what the people in the story realised, and how your aims went ----------
  $('#journalBtn').onclick = () => {
    const j = $('#journal'); j.hidden = false;
    j.querySelector('.body').innerHTML = insights.length ? insights.slice().reverse().map(i => `<div class="ins ${i.kind}"><img src="${faceSrc(i.who) || ''}" alt=""><div><b>${esc(world.chars[i.who]?.name || '')}</b><p>${esc(i.text)}</p></div></div>`).join('')
      : '<p class="small">Nothing yet. When someone in the story realises something, or one of your aims is met or lost, it is kept here.</p>';
  };
  $('#journal .close').onclick = () => { $('#journal').hidden = true; };
  // the doors an earlier choice closed, as cards you can still try
  function openList(locked, pickLock) {
    const body = sheet.querySelector('.body'); body.innerHTML = '<h2>Closed by earlier choices</h2><div class="acts"></div>'; const acts = body.querySelector('.acts');
    for (const c of locked) { const b = document.createElement('button'); b.className = 'card locked'; b.style.animation = 'none'; b.style.opacity = 1; b.style.transform = 'none'; b.innerHTML = `<span class="keyhole" aria-hidden="true"></span><span class="lbl">${esc(c.text)}<small>${esc(c.conditions.map(k => why(k, world, beats)).join('. '))}</small></span>`;
      b.onclick = () => { const going = b.classList.contains('offer'); pickLock(b, c); if (going) sheet.hidden = true; }; acts.append(b); }
    sheet.hidden = false;
  }
  return { update, render, openSheet, openList, reset() { world = prev = null; insights.length = 0; $('#journalBtn').dataset.n = ''; } };
}
