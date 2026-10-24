// The Slopling's Odyssey player: the real ASAPS engine (vendor/asaps, built from
// ASAPS Modern packages/core) drives a cardboard toy-theatre renderer.
import { StoryEngine, storyFromGeneratedJson, ASAPS_CORE_VERSION } from './vendor/asaps/asaps-core.slopling.js';
import { Stage, loadImage } from './stage.js';
import { Sound } from './sound.js';
import { makeUI } from './ui.js';

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
    this.trail.push({ id, rnd }); return id;
  }
  async choose(card) { const id = await card; this.trail.push({ id, rnd: false, live: true }); this.ui.trailChanged?.(); return id; }

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
    return this.choose(this.ui.card({ speaker: line?.speaker, body: line?.text, choices }));
  }
  async renderPropSelection(question, props) {
    if (!(await this.ready())) return this.pick(props);
    this.stage.setWatsonPose('think');
    return this.choose(this.ui.card({ body: question, choices: props.map(p => ({ id: p.id, text: p.displayName || p.name, description: p.description })) }));
  }
  async renderMovement(question, choices) { return this.renderChoices(choices.map(c => ({ id: c.id, text: c.displayText || c.text }))); }
  async renderDurScreen(text, duration) { if (!(await this.ready())) return; this.ui.say(text); await this.ui.card({ body: text, timed: duration }); }
  async renderEndScreen(message, showRestart, showCredits) {
    this.ui.ended(message); this.ui.say(message); this.ui.sound.coda(String(message).split('\n')[0]);
    return this.ui.card({ body: message, choices: [...(showCredits ? [{ id: 'credits', text: 'Sources' }] : []), { id: 'restart', text: 'Sail again' }] });
  }
  async renderCreditsPage(c) { await this.ui.card({ title: c.creditsTitle, body: c.creditsBody, button: c.creditsCloseText || 'Close' }); return 'close'; }
  async renderAISummary(d) { return this.renderEndScreen(`**${d.title}**\n\n${d.summary}`, d.showRestart, d.showCredits); }
  async renderVideo() {}
  async showChoices(c) { return this.renderChoices(c); }
  async renderInputText() { return ''; }
  async renderHyperText() { return ''; }
  async renderConversationInput() { return (await this.ready()) ? this.choose(this.ui.card({ body: 'Say something, or set sail.', choices: [{ id: 'set sail', text: 'Set sail' }] })) : this.pick([{ id: 'set sail' }]); }
}

// ---------- state → gauges / tag / light; changed counters are announced on the stage ----------
const LABELS = { craft: 'Craft', standing: 'Standing', cunning: 'Cunning', meaning: 'Meaning', leverage: 'Leverage' };
function readState(engine, stage, ui, live) {
  const ctx = engine.getContext();
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
  const images = {};
  await Promise.all(manifest.parts.map(async p => { images[p.id] = await loadImage('vendor/watson-rig/' + p.file); }));
  const stage = new Stage($('#stage'), staging, { api: window.WatsonRig, manifest, images });
  const sound = new Sound(); stage.sound = sound; window.SFX = sound;
  stage.onSound = (name, d) => sound.event(name, d); stage.onLight = a => sound.setLight(a); stage.voiceLevel = () => sound.voiceLevel();
  soundControls(sound);
  const ui = makeUI({ story: json.story, staging, stage, sound });
  $('#engine').textContent = 'ASAPS core ' + ASAPS_CORE_VERSION;
  const sel = $('#rehearse'); sel.innerHTML = Object.entries(REHEARSALS).map(([k, r]) => `<option value="${k}">${esc(r.label)}</option>`).join('');
  const startFrom = location.hash.slice(1); if (REHEARSALS[startFrom]) sel.value = startFrom;

  let engine = null, runId = 0, renderer = null, session = null;
  // run(replay): with a recorded trail of choices, replay it under the same seed, then hand over
  async function run(replay = null) {
    const my = ++runId; engine?.stop(); sound.stopVoice();
    if (!replay) { const reh = REHEARSALS[sel.value]; session = { reh, seed: reh.seed || (1 + Math.floor(Math.random() * 2e9)) }; }
    renderer = new CardboardRenderer(stage, ui);
    engine = new StoryEngine(renderer, { mockMode: true });
    const story = storyFromGeneratedJson(json);
    const rnd = prng(session.seed); Math.random = rnd; // the engine's own stream for the whole run
    stage.lastCounters = null; stage.state.tagFall = 0;
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
    renderer.onHandover = async () => { renderer.resumed = true; await handover(); };
    for (const b of story.getAllBeats()) {
      const ex = b.execute.bind(b);
      b.execute = async (ctx, r) => {
        if (my !== runId) { engine.stop(); return null; }
        renderer.beatId = b.id; ui.passed(b.id);
        if (renderer.fast && !renderer.fast.script && b.id === renderer.fast.until) await handover();
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
    ui.toast('Back to your last choice'); run(t.slice(0, last));
  };
  const start = () => { sound.init(); $('#start-screen').hidden = true; $('#menu').hidden = true; run(); };
  $('#start').onclick = start; $('#restart').onclick = start;
  // preview(beatId): stage a beat without playing (review and screenshots only)
  window.__player = { stage, sound, ui, get engine() { return engine; }, get renderer() { return renderer; }, run, select: k => { sel.value = k; }, preview: async id => { stage.state.craft = 6; await stage.setScene(id); await stage.setProps(id); } };
}
boot();
