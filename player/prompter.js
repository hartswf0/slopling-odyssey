// The prompter: the toy theatre's voice from the prompt box. He holds the book, sees every choice,
// and is not above saying so. Asides break the fourth wall but never block play or cut a line short:
// they speak over a ducked scene, show as a note at the stage's edge, and keep to one remark per
// twenty seconds unless you touched a lock, which always earns an answer. Lines: asides.json.
const $ = s => document.querySelector(s);

export function makePrompter({ sound }) {
  let lines = {}; const ready = fetch('asides.json').then(r => r.json()).then(j => { lines = j.lines; }).catch(() => {});
  const note = $('#aside'), p = note.querySelector('p'); let last = -1e9, hideT = null;
  async function say(key, { force = false } = {}) {
    await ready; const t = lines[key] || lines[key.split(':')[0]] || (key.startsWith('counter') ? lines.counter : null); if (!t) return;
    const now = performance.now(); if (!force && now - last < 20000) return; last = now;
    // on a tall screen he takes the subtitle's place while he talks (nothing else is covered); otherwise he is pinned at the stage's edge
    const tall = matchMedia('(orientation: portrait)').matches, dlg = $('#dialog'), home = tall && !dlg.hidden ? dlg : $('.fit');
    if (note.parentElement !== home) { if (home === dlg) dlg.insertBefore(note, dlg.querySelector('.acts')); else home.append(note); }
    note.classList.toggle('inline', home === dlg); $('.fit').classList.toggle('aside-on', home === dlg);
    p.textContent = t; note.hidden = false; note.style.animation = 'none'; void note.offsetWidth; note.style.animation = '';
    const dur = (await sound.aside(t)) || t.length / 14;
    clearTimeout(hideT); hideT = setTimeout(() => { note.hidden = true; $('.fit').classList.remove('aside-on'); }, dur * 1000 + 1600);
  }
  // which aside answers a locked door, from its first ASAPS condition
  function lockKey(conds) {
    const k = (conds || [])[0] || {};
    if (k.type === 'inventory') return 'item:' + k.item;
    if (k.type === 'variable') return /^visited_/.test(k.variable) ? 'var:visited' : 'var:' + k.variable;
    if (k.type === 'counter') return lines['counter:' + k.variable] ? 'counter:' + k.variable : 'counter';
    if (k.type === 'visitedBeat') return 'visitedBeat';
    return 'locked';
  }
  return { say, lockKey };
}
