// The Slopling's Odyssey player: the real ASAPS engine (vendor/asaps, built from
// ASAPS Modern packages/core) drives a cardboard toy-theatre renderer.
import { StoryEngine, storyFromGeneratedJson, ASAPS_CORE_VERSION } from './vendor/asaps/asaps-core.slopling.js';
import { Stage, loadImage } from './stage.js';
import { Sound } from './sound.js';
import { makeUI } from './ui.js';
import { makeHUD } from './hud.js';
import { readWorld, ITEM_PROP } from './world.js';
import { makePrompter } from './prompter.js';
import { makeMemory, ENDINGS } from './memory.js';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- seeded random: rehearsals pick choices with it, and the engine draws from it for the whole run,
// so a run can be replayed exactly (that is how Back works) ----------
function prng(seed) { let s = seed % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// Lines in the story that name a physical event, and the cue that performs it.
const CUES = [
  [/You name them/, 'nameTrees'],
  [/you name the other things/, 'nameWork'],
  [/puts a hand on your shoulder|hand on your shoulder/, 'approach'],
  [/not on your title/, 'cutTag'],
  [/pulls you into a hug/, 'hug'],
  [/doesn't ask about the work|doesn't\. Not yet/, 'turnAway'],
  [/So you stop\. You say nothing/, 'still'],
  [/lathe/i, 'prop:lathe'],
  [/takes it and reads/, 'prop:reads'],
  [/wipes his hands/, 'prop:rag'],
  [/journal/i, 'prop:journal'],
];
function cuesFor(stage, text) {
  for (const [re, name] of CUES) if (re.test(text || '')) setTimeout(() => name.startsWith('prop:') ? stage.cueProp(name.slice(5)) : stage.cue(name), { cutTag: 3400, nameWork: 4200 }[name] ?? 250);
}

class CardboardRenderer {
  // fast: {rnd, until, script} while rehearsing or replaying; null when live. trail: every choice taken, in order.
  constructor(stage, ui) { this.stage = stage; this.ui = ui; this.state = {}; this.fast = null; this.visited = []; this.trail = []; }
  get live() { return !this.fast; }
  setState(k, v) { this.state[k] = v; }
  getState(k) { return this.state[k]; }
  setVisitedChoiceIds(ids) { this.visited = ids || []; this.ui.setVisited(this.visited); }
  clearChatHistory() {}
  clear() {}
  prepareTransition() {}
  async applyTransition() {}
  async playSound() {}
  async waitForUserInput() {}
  renderLoading(m) { if (this.live) this.ui.loading(m); }
  hideLoading() { this.ui.loading(null); }
  // A replay (Back) follows the recorded script; when it runs out, the player takes over at this very choice.
  async ready() { if (this.fast?.script && !this.fast.script.length) await this.onHandover(); return this.live; }
  pick(list) {
    const f = this.fast; let id, rnd = false;
    if (f.script?.length) { const s = f.script.shift(); if (s.rnd) f.rnd(); this.trail.push({ ...s }); return s.id; } // a rehearsal pick drew one number: draw it again so the engine's stream lines up
    else { rnd = true; const fresh = list.filter(c => !this.visited.includes(c.id)); const pool = fresh.length ? fresh : list; id = pool[Math.floor(f.rnd() * pool.length)].id; }
    this.trail.push({ id, n: list.findIndex(c => c.id === id), rnd, beat: this.beatId }); return id;
  }
  // a live choice, yours or the prompter's; n (its place in the list) is what a sent odyssey carries
  async choose(card, list) {
    const id = await card; this.trail.push({ id, n: list ? list.findIndex(c => c.id === id) : 0, rnd: false, live: true, beat: this.beatId });
    this.ui.memory?.took(this.beatId, id); this.ui.trailChanged?.(); return id;
  }
  // While the prompter plays: the choice he will take. A sent odyssey is followed step by step (a step the sender's
  // rehearsal drew a number for draws it again, so the engine's stream lines up); otherwise he prefers roads
  // this browser has never taken, then roads not taken this run.
  autoPick(list) {
    const a = this.auto; if (!a || !this.ui.watching || !list?.length) return undefined;
    if (a.script?.length) { const s = a.script.shift(); if (s.rnd) Math.random(); return (list[s.n] || list[0]).id; }
    a.script = null;
    const m = this.ui.memory, never = list.filter(c => !m?.hasTaken(this.beatId, c.id)), fresh = list.filter(c => !this.visited.includes(c.id));
    const pool = never.length ? never : fresh.length ? fresh : list, c = pool[Math.floor(a.rnd() * pool.length)];
    if (list.length > 1 && a.rnd() < 0.35) this.ui.prompter?.say('watch:pick:' + (1 + Math.floor(a.rnd() * 4)));
    return c.id;
  }

  async renderTitleScreen(title, author, buttonText) { if (!(await this.ready())) return; await this.ui.card({ title, sub: author, button: buttonText || 'Begin' }); }
  async renderText(text, buttonText) { if (!(await this.ready())) return; this.ui.say(text); this.stage.setSpeaker(null); this.stage.setWatsonPose('think'); cuesFor(this.stage, text); await this.ui.card({ body: text, button: buttonText || 'Continue' }); }
  async renderDialog(speaker, text) {
    this.line = { speaker, text };
    if (!this.live) return;
    const id = this.ui.speakerId(speaker); this.ui.say(text, speaker);
    this.stage.setSpeaker(id); this.stage.setWatsonPose(id ? 'listen' : 'idle'); cuesFor(this.stage, text);
  }
  async renderChoices(choices) {
    const line = this.line; this.line = null;
    if (!(await this.ready())) return this.pick(choices);
    if (this.resumed) { this.resumed = false; if (line?.text) { this.ui.say(line.text, line.speaker); this.stage.setSpeaker(this.ui.speakerId(line.speaker)); } } // after Back: the line before the choice is heard again
    if (!line?.speaker || /^narrator$/i.test(line.speaker)) this.stage.setSpeaker(null);
    if (!choices.every(c => c.isContinue)) this.stage.setWatsonPose('choose');
    return this.choose(this.ui.card({ speaker: line?.speaker, body: line?.text, choices, auto: this.autoPick(choices) }), choices);
  }
  async renderPropSelection(question, props) {
    if (!(await this.ready())) return this.pick(props);
    this.stage.setWatsonPose('think');
    const list = props.map(p => ({ id: p.id, text: p.displayName || p.name, description: p.description }));
    return this.choose(this.ui.card({ body: question, choices: list, auto: this.autoPick(list) }), list);
  }
  async renderMovement(question, choices) { return this.renderChoices(choices.map(c => ({ id: c.id, text: c.displayText || c.text }))); }
  async renderDurScreen(text, duration) { if (!(await this.ready())) return; this.ui.say(text); await this.ui.card({ body: text, timed: duration }); }
  // An ending: the browser remembers it, the card counts the endings found, and the prompter teases one
  // still unseen once the narrator has finished. From here: sail again, watch him play, or send this odyssey.
  async renderEndScreen(message, showRestart, showCredits) {
    const ui = this.ui, title = String(message).split('\n')[0].replace(/\*/g, '').trim();
    ui.ended(message); ui.say(message); ui.sound.coda(String(message).split('\n')[0]); ui.setWatching(false);
    const m = ui.memory; m?.ended(title); const found = m ? m.found().length : 1, unseen = m ? m.unseen() : [];
    const tally = `\n\n*${found} of ${ENDINGS.length} endings found.*`; // the teases are the prompter's, and the start screen's
    const tease = unseen.length ? 'end:unseen:' + unseen[Date.now() % unseen.length].title : 'end';
    const wait = () => ui.sound.voiceProgress() != null ? setTimeout(wait, 400) : setTimeout(() => ui.prompter?.say(tease, { force: true }), 900); setTimeout(wait, 1500);
    const share = this.shareLink?.();
    for (let body = message + tally; ;) {
      const id = await ui.card({ body, choices: [{ id: 'restart', text: 'Sail again' }, { id: 'watch', text: 'Watch him play' }, ...(share ? [{ id: 'share', text: 'Send this odyssey' }] : []), ...(showCredits ? [{ id: 'credits', text: 'Sources' }] : [])].map(c => ({ ...c, isContinue: true })) }); // tickets, so the ending keeps its room
      if (id === 'share') { await this.onShare?.(share); body = tally; continue; } // back to the buttons, not the whole ending again
      if (id === 'restart' || id === 'watch') { (id === 'watch' ? this.onWatch : this.onRestart)?.(); return new Promise(() => {}); } // a new run takes over; this engine is stopped
      return id;
    }
  }
  async renderCreditsPage(c) { await this.ui.card({ title: c.creditsTitle, body: c.creditsBody, button: c.creditsCloseText || 'Close' }); return 'close'; }
  async renderAISummary(d) { return this.renderEndScreen(`**${d.title}**\n\n${d.summary}`, d.showRestart, d.showCredits); }
  async renderVideo() {}
  async showChoices(c) { return this.renderChoices(c); }
  async renderInputText() { return ''; }
  async renderHyperText() { return ''; }
  async renderConversationInput() { const list = [{ id: 'set sail', text: 'Set sail' }]; return (await this.ready()) ? this.choose(this.ui.card({ body: 'Say something, or set sail.', choices: list, auto: this.autoPick(list) }), list) : this.pick(list); }
}

// ---------- state → gauges / tag / light; changed counters are announced on the stage ----------
const LABELS = { craft: 'Craft', standing: 'Standing', cunning: 'Cunning', meaning: 'Meaning', leverage: 'Leverage' };
function readState(engine, stage, ui, live) {
  const ctx = engine.getContext();
  const world = readWorld(ctx, ui.story); ui.setWorld(world); ui.hud?.update(world, live);
  const c = ctx.getCharacterCountersFor('char_player') || {};
  const call = ctx.getVariable('callChoice'), variant = ctx.getActiveCharacterVariant('char_player');
  const rec = ctx.getSentimentTo('char_father', 'player', 'recognition') || 0, pride = ctx.getSentimentTo('char_father', 'player', 'pride') || 0;
  if (live && stage.lastCounters) for (const [k, v] of Object.entries(c)) { const d = (v || 0) - (stage.lastCounters[k] || 0); if (d && LABELS[k]) ui.toast(`${d > 0 ? '+' : ''}${d} ${LABELS[k]}`, d > 0); }
  stage.lastCounters = { ...c };
  stage.state.craft = c.craft || 0; stage.state.recognition = rec; stage.sound?.setState({ craft: c.craft || 0, standing: c.standing || 0, recognition: rec });
  stage.state.tag = variant === 'odie_lead' || call === 'accept' ? 'TEAM LEAD' : call === 'renegotiated' ? 'SENIOR CRAFT LEAD' : call === 'decline' ? 'LACKS AMBITION?' : null;
  const rows = [['Craft', c.craft], ['Standing', c.standing], ['Cunning', c.cunning], ['Meaning', c.meaning], ['Leverage', c.leverage]];
  $('#gauges').innerHTML = rows.map(([k, v]) => `<li><span>${k}</span><meter min="-4" max="10" value="${v || 0}"></meter><b>${v || 0}</b></li>`).join('') +
    `<li class="father"><span>Father sees the title</span><meter min="0" max="1" value="${pride.toFixed(2)}"></meter><b>${pride.toFixed(2)}</b></li>` +
    `<li class="father"><span>Father sees him</span><meter min="0" max="1" value="${rec.toFixed(2)}"></meter><b>${rec.toFixed(2)}</b></li>`;
}

// Same snapshot as player/tests/routes.mjs, so a rehearsal can be checked against Node.
function handoverState(engine) { const c = engine.getContext(); return { counters: c.getCharacterCountersFor('char_player'), callChoice: c.getVariable('callChoice'), roleHolder: c.getVariable('roleHolderName'), knowsFatherCraft: c.getVariable('knowsFatherCraft'), recognition: +(c.getSentimentTo('char_father', 'player', 'recognition') || 0).toFixed(2), pride: +(c.getSentimentTo('char_father', 'player', 'pride') || 0).toFixed(2) }; }

// ---------- sound controls (menu): voices, music, effects, volume (remembered per browser) ----------
function soundControls(sound) {
  const p = sound.prefs, box = $('#sound'); if (!box) return;
  box.innerHTML = ['voice', 'music', 'sfx'].map(k => `<label><input type="checkbox" data-k="${k}"${p[k] ? ' checked' : ''}> ${{ voice: 'Voices', music: 'Music', sfx: 'Effects' }[k]}</label>`).join('') +
    `<label class="vol">Volume <input type="range" min="0" max="1" step="0.05" value="${p.vol}" aria-label="Volume"></label>`;
  box.querySelectorAll('input[type=checkbox]').forEach(i => i.onchange = () => { p[i.dataset.k] = i.checked; if (i.dataset.k === 'voice' && !i.checked) sound.stopVoice(); sound.save(); });
  box.querySelector('input[type=range]').oninput = e => { p.vol = +e.target.value; sound.save(); };
}

// ---------- boot ----------
const REHEARSALS = {
  start: { label: 'From the beginning', until: null },
  call: { label: 'The Call (Olympus, 10 a.m.)', until: 'beat_11', seed: 7 },
  voyage: { label: 'The Voyage (the chart of islands)', until: 'beat_24', seed: 7 },
  underworld: { label: 'The Underworld (Ajax)', until: 'beat_70', seed: 37 },
  ithaca: { label: 'Ithaca, carrying the calipers (declined the role)', until: 'beat_93', seed: 37 },
  ithaca_ladder: { label: 'Ithaca, after taking the chair', until: 'beat_93', seed: 2 },
};

async function boot() {
  const [json, staging, manifest, layouts] = await Promise.all(['story/odyssey-tragic-comedy.json', 'staging.json', 'vendor/watson-rig/manifest.json', 'layouts.json'].map(u => fetch(u).then(r => r.json())));
  staging.layouts = layouts.layouts;
  staging.props = await fetch('props.json').then(r => r.json());
  staging.shots = await fetch('shots.json').then(r => r.json()).then(j => j.shots).catch(() => ({}));
  const images = {};
  await Promise.all(manifest.parts.map(async p => { images[p.id] = await loadImage('vendor/watson-rig/' + p.file); }));
  const stage = new Stage($('#stage'), staging, { api: window.WatsonRig, manifest, images });
  const sound = new Sound(); stage.sound = sound; window.SFX = sound;
  stage.onSound = (name, d) => sound.event(name, d); stage.onLight = a => sound.setLight(a); stage.voiceLevel = () => sound.voiceLevel();
  soundControls(sound);
  const prompter = makePrompter({ sound });
  const memory = makeMemory();
  const ui = makeUI({ story: json.story, staging, stage, sound, prompter }); ui.story = json.story; ui.prompter = prompter; ui.memory = memory;
  stage.charNames = Object.fromEntries(json.story.characters.map(c => [c.id, c.name])); // the story's names, never a packet's
  const hud = ui.hud = makeHUD({ story: json.story, staging, stage, ui, sound });
  ui.onInspect = hit => hud.openSheet(hit);
  ui.onLocked = (locked, pick) => hud.openList(locked, pick);
  // Where each key lives: the beat that offers an item, sets a variable, or leads to a place. A locked
  // door can then take you back to the last time you stood there (a replay, so everything after is undone).
  const keys = { item: {}, var: {}, beat: {} }, add = (m, k, b) => (m[k] ||= new Set()).add(b);
  for (const b of json.story.beats) (function walk(o) { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(walk);
    if (o.type === 'setVariable' && o.target) add(keys.var, o.target, b.id);
    if (b.type === 'pickProp' && o.name && o.target) add(keys.item, o.name, b.id);
    if (typeof o.target === 'string' && o.target.startsWith('beat_')) add(keys.beat, o.target, b.id);
    Object.values(o).forEach(walk); })(b.parameters);
  ui.rewindFor = conds => {
    const t = renderer?.trail || [];
    for (const k of conds || []) {
      const where = k.type === 'inventory' ? keys.item[k.item] : k.type === 'variable' && !/^visited_/.test(k.variable) ? keys.var[k.variable] : k.type === 'visitedBeat' ? keys.beat[k.beatId] : null;
      if (!where) continue;
      for (let i = t.length - 1; i >= 0; i--) if (where.has(t[i].beat)) { const name = json.story.beats.find(b => b.id === t[i].beat)?.name || 'that moment';
        return { name, go: () => { rewound = { item: k.type === 'inventory' ? k.item : null }; run(t.slice(0, i)); } }; }
    }
    return null;
  }; ui.onChoices = () => hud.render();
  $('#engine').textContent = 'ASAPS core ' + ASAPS_CORE_VERSION;
  const sel = $('#rehearse'); sel.innerHTML = Object.entries(REHEARSALS).map(([k, r]) => `<option value="${k}">${esc(r.label)}</option>`).join('');
  const startFrom = location.hash.slice(1); if (REHEARSALS[startFrom]) sel.value = startFrom;
  // A sent odyssey: #w1.<seed>.<one character per choice: its place in the list, a-j where the sender's
  // rehearsal drew a number for it>. Played from the top under the same seed, it is the same show.
  const sent = (m => m && { seed: parseInt(m[1], 36), script: [...m[2]].map(ch => /[a-j]/.test(ch) ? { n: ch.charCodeAt(0) - 97, rnd: true } : { n: +ch, rnd: false }) })(location.hash.match(/^#w1\.([0-9a-z]+)\.([0-9a-j]*)$/));

  let engine = null, runId = 0, renderer = null, session = null;
  // run(replay): with a recorded trail of choices, replay it under the same seed, then hand over
  // run(replay, {watch, seed, script}): watch lets the prompter play, following script if one was sent
  async function run(replay = null, opts = {}) {
    const my = ++runId; engine?.stop(); sound.stopVoice(); ui.setWatching(!replay && !!opts.watch);
    if (!replay) { const reh = opts.watch ? REHEARSALS.start : REHEARSALS[sel.value]; session = { reh, seed: opts.seed || reh.seed || (1 + Math.floor(Math.random() * 2e9)) }; }
    renderer = new CardboardRenderer(stage, ui);
    if (ui.watching) renderer.auto = { script: opts.script ? opts.script.map(x => ({ ...x })) : null, rnd: prng(session.seed + 101) };
    renderer.onRestart = () => begin(); renderer.onWatch = () => begin({ watch: true });
    renderer.shareLink = () => { const t = renderer.trail; if (!t.length || t.some(x => !(x.n >= 0 && x.n <= 9))) return null;
      return location.origin + location.pathname + '#w1.' + session.seed.toString(36) + '.' + t.map(x => x.rnd ? String.fromCharCode(97 + x.n) : x.n).join(''); };
    renderer.onShare = async link => { try { if (navigator.share && matchMedia('(pointer: coarse)').matches) await navigator.share({ title: "The Slopling's Odyssey", url: link }); else await navigator.clipboard.writeText(link); prompter.say('share', { force: true }); } catch { ui.toast('Could not copy the link'); } };
    engine = new StoryEngine(renderer, { mockMode: true });
    const story = storyFromGeneratedJson(json);
    const rnd = prng(session.seed); Math.random = rnd; // the engine's own stream for the whole run
    stage.lastCounters = null; stage.state.tagFall = 0; if (!replay) hud.reset();
    if (replay || session.reh.until) {
      renderer.fast = { rnd, until: replay ? null : session.reh.until, script: replay ? replay.map(s => ({ ...s })) : null };
      stage.quiet = true; $('#ff').hidden = false; $('#ff').textContent = replay ? 'Going back to your last choice…' : 'Rehearsing the route so far…';
    }
    const handover = async () => {
      renderer.fast = null; stage.quiet = false; $('#ff').hidden = true;
      window.__player.handover = handoverState(engine);
      await stage.setScene(renderer.beatId); await stage.setProps(renderer.beatId); ui.setBeat(renderer.beatId);
      sound.setScene({ place: stage.place, memory: stage.memory, chorusMode: stage.chorusMode });
      readState(engine, stage, ui, false); trailChanged();
    };
    renderer.onHandover = async () => { renderer.resumed = true; await handover();
      if (rewound) { // landed: the prompter says so, and the thing you came back for is lit on stage
        const r = rewound; rewound = null; prompter.say('rewind:go', { force: true });
        if (r.item) stage.spotlight = { kind: 'prop', id: (ITEM_PROP[r.item] || r.item).split('_')[0], t: performance.now() };
      } };
    for (const b of story.getAllBeats()) {
      const ex = b.execute.bind(b);
      b.execute = async (ctx, r) => {
        if (my !== runId) { engine.stop(); return null; }
        renderer.beatId = b.id; ui.passed(b.id);
        if (renderer.fast && !renderer.fast.script && b.id === renderer.fast.until) await handover();
        if (renderer.live) memory.passed(staging.beats[b.id]?.place);
        if (renderer.live) { await stage.setScene(b.id); await stage.setProps(b.id); sound.setScene({ place: stage.place, memory: stage.memory, chorusMode: stage.chorusMode }); ui.setBeat(b.id); } // skipped beats are not staged
        if (renderer.live) $('#log').insertAdjacentHTML('afterbegin', `<li><code>${b.id}</code> ${esc(b.type)} · ${esc(b.name || '')}</li>`);
        $('#beat').textContent = `${b.id} · ${b.type}`;
        const next = await ex(ctx, r);
        readState(engine, stage, ui, renderer.live);
        return next;
      };
    }
    await engine.loadStory(story);
    readState(engine, stage, ui, false); trailChanged();
    try { await engine.start(); } catch (e) { console.error(e); $('#beat').textContent = 'Engine error: ' + e.message; }
  }
  // Back: shown only while there is a choice of yours to return to
  const trailChanged = () => { $('#undo').hidden = !renderer?.trail.some(s => s.live); };
  ui.trailChanged = trailChanged;
  $('#undo').onclick = () => {
    const t = renderer.trail, last = t.map(s => !!s.live).lastIndexOf(true); if (last < 0) return;
    backs++; if (backs >= 3) { backs = 0; prompter.say('back:again', { force: true }); } else ui.toast('Back to your last choice');
    run(t.slice(0, last));
  };
  let backs = 0, rewound = null;
  // the opening: the theatre already lit on the orchard, the passage everything else leads to; no controls until there is a journey
  $('#controls').hidden = true; stage.quiet = true; stage.state.craft = 4; stage.craftSeen = 4; // the poster is still: no streak of light
  stage.setScene('beat_93').then(() => stage.setProps('beat_93')).then(() => { stage.quiet = false; });
  // the curtain goes up: as yourself, or with the prompter playing (a sent odyssey is always watched first)
  const begin = (opts = {}) => {
    sound.init(); $('#start-screen').hidden = true; $('#menu').hidden = true; $('#controls').hidden = false; backs = 0;
    const greet = opts.script ? 'watch:theirs' : opts.watch ? 'watch:start' : memory.greeting(); memory.began();
    run(null, opts); setTimeout(() => prompter.say(greet, { force: true }), 900);
  };
  const start = () => begin();
  ui.onTakeOver = () => { ui.toast('Your hands now'); prompter.say('watch:take', { force: true }); };
  $('#start').onclick = () => sent ? begin({ watch: true, seed: sent.seed, script: sent.script }) : start();
  $('#watch').onclick = () => sent ? start() : begin({ watch: true });
  $('#restart').onclick = start;
  // the repertory: the four endings, lit once found, the rest teased
  const found = new Set(memory.found().map(e => e.title));
  $('#repertory').innerHTML = `<span>${found.size ? `${found.size} of ${ENDINGS.length} endings found` : `${ENDINGS.length} endings`}</span>` + ENDINGS.map(e => found.has(e.title) ? `<b>${esc(e.title)}</b>` : `<i>${esc(e.tease)}</i>`).join('');
  if (sent) { $('#sent').hidden = false; $('#tagline').hidden = true; $('#start').textContent = 'Watch their odyssey'; $('#watch').textContent = 'Begin your own'; }
  // the playbill: begin anywhere in the story (ASAPS plays the beats before it with fixed choices)
  $('#playbill').innerHTML = '<span>or begin at</span>' + Object.entries(REHEARSALS).filter(([k]) => k !== 'start').map(([k, r]) => `<button data-k="${k}">${esc(r.label.replace(/ \(.*\)$/, ''))}</button>`).join('');
  $('#playbill').querySelectorAll('button').forEach(b => b.onclick = () => { sel.value = b.dataset.k; start(); });
  // the frame follows the screen: a tall screen gets a stage apron where the words and cards rest
  const fitFrame = () => { const f = $('.fit'), r = f.getBoundingClientRect(), fr = stage.setFrame(r.width, r.height); f.style.setProperty('--band-top', (fr.bandTop * 100) + '%'); f.style.setProperty('--apron-top', (fr.apronTop * 100) + '%'); f.style.setProperty('--valance', (stage.tall ? r.height * 0.13 : 0) + 'px'); };
  addEventListener('resize', fitFrame); fitFrame();
  // preview(beatId): stage a beat without playing (review and screenshots only)
  window.__player = { stage, sound, ui, memory, get engine() { return engine; }, get renderer() { return renderer; }, run, begin, select: k => { sel.value = k; }, preview: async id => { stage.state.craft = 6; await stage.setScene(id); await stage.setProps(id); } };
}
boot();
