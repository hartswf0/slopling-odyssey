// The Slopling's Odyssey player: the real ASAPS engine (vendor/asaps, built from
// ASAPS Modern packages/core) drives a cardboard toy-theatre renderer.
import { StoryEngine, storyFromGeneratedJson, ASAPS_CORE_VERSION } from './vendor/asaps/asaps-core.slopling.js';
import { Stage, loadImage } from './stage.js';
import { Sound } from './sound.js';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

// ---------- seeded choices for rehearsal fast-forward (also seeds Math.random so random beats repeat) ----------
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
  constructor(stage, ui) { this.stage = stage; this.ui = ui; this.state = {}; this.fast = null; this.visited = []; }
  // fast-forward: {rnd, until}
  get live() { return !this.fast; }
  setState(k, v) { this.state[k] = v; }
  getState(k) { return this.state[k]; }
  setVisitedChoiceIds(ids) { this.visited = ids || []; }
  clearChatHistory() {}
  clear() {}
  prepareTransition() {}
  async applyTransition() {}
  async playSound() {}
  async waitForUserInput() {}
  renderLoading(m) { if (this.live) this.ui.loading(m); }
  hideLoading() { this.ui.loading(null); }
  pick(list) { const r = this.fast.rnd; const fresh = list.filter(c => !this.visited.includes(c.id)); const pool = fresh.length ? fresh : list; return pool[Math.floor(r() * pool.length)].id; }

  async renderTitleScreen(title, author, buttonText) { if (!this.live) return; await this.ui.card({ title, sub: author, button: buttonText || 'Begin' }); }
  async renderText(text, buttonText) { if (!this.live) return; this.ui.say(text); this.stage.setSpeaker(null); this.stage.setWatsonPose('think'); cuesFor(this.stage, text); await this.ui.card({ body: text, button: buttonText || 'Continue' }); }
  async renderDialog(speaker, text) {
    this.line = { speaker, text };
    if (!this.live) return;
    const id = this.ui.speakerId(speaker); this.ui.say(text, speaker);
    this.stage.setSpeaker(id); this.stage.setWatsonPose(id ? 'listen' : 'idle'); cuesFor(this.stage, text);
  }
  async renderChoices(choices) {
    const line = this.line; this.line = null;
    if (!this.live) return this.pick(choices);
    if (!line?.speaker || /^narrator$/i.test(line.speaker)) this.stage.setSpeaker(null);
    if (!choices.every(c => c.isContinue)) this.stage.setWatsonPose('choose');
    return this.ui.card({ speaker: line?.speaker, body: line?.text, choices });
  }
  async renderPropSelection(question, props) {
    if (!this.live) return this.pick(props);
    this.stage.setWatsonPose('think');
    return this.ui.card({ body: question, choices: props.map(p => ({ id: p.id, text: p.displayName || p.name, description: p.description })) });
  }
  async renderMovement(question, choices) { return this.renderChoices(choices.map(c => ({ id: c.id, text: c.displayText || c.text }))); }
  async renderDurScreen(text, duration) { if (!this.live) return; this.ui.say(text); await this.ui.card({ body: text, timed: duration }); }
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
  async renderConversationInput() { return this.live ? (await this.ui.card({ body: 'Say something, or set sail.', choices: [{ id: 'set sail', text: 'Set sail' }] })) : 'set sail'; }
}

// ---------- UI (DOM overlay on the stage) ----------
function makeUI(story, sound) {
  const box = $('#card'), log = $('#log');
  const names = new Map();
  for (const c of story.characters || []) { names.set(c.name.toLowerCase(), c.id); names.set(c.name.split(' ')[0].toLowerCase(), c.id); }
  return {
    sound, say(text, speaker) { sound.say(text, speaker); },
    speakerId(s) { if (!s) return null; return names.get(String(s).toLowerCase()) || names.get(String(s).split(' ')[0].toLowerCase()) || null; },
    loading(m) { $('#loading').hidden = !m; if (m) $('#loading').textContent = m; },
    ended(m) { log.insertAdjacentHTML('afterbegin', `<li class="end">Ending · ${esc(String(m).split('\n')[0].replace(/\*/g, ''))}</li>`); },
    card({ title, sub, speaker, body, button, choices, timed }) {
      return new Promise(res => {
        let h = '';
        if (title) h += `<h2>${esc(title)}</h2>`;
        if (sub) h += `<p class="sub">${esc(sub)}</p>`;
        if (speaker && !/^narrator$/i.test(speaker)) h += `<div class="who">${esc(speaker)}</div>`;
        if (body) h += `<div class="body">${md(body)}</div>`;
        h += '<div class="acts">';
        if (choices) h += choices.map(c => `<button data-id="${esc(c.id)}" class="${c.isContinue ? 'cont' : 'opt'}">${esc(c.isContinue ? (c.text || 'Continue') + ' ›' : c.text)}${c.description ? `<small>${esc(c.description)}</small>` : ''}</button>`).join('');
        else if (!timed) h += `<button data-id="ok" class="cont">${esc(button || 'Continue')} ›</button>`;
        h += '</div>';
        box.innerHTML = h; box.hidden = false; box.scrollTop = 0; sound.event('page');
        const done = id => { box.hidden = true; sound.stopVoice(); sound.click(); res(id); };
        box.querySelectorAll('button').forEach(b => b.onclick = () => done(b.dataset.id));
        const first = box.querySelector('button'); first && first.focus({ preventScroll: true });
        if (timed) setTimeout(() => done('timeout'), Math.min(timed, 8) * 1000);
      });
    },
  };
}

// ---------- state → gauges / tag / light ----------
function readState(engine, stage) {
  const ctx = engine.getContext();
  const c = ctx.getCharacterCountersFor('char_player') || {};
  const call = ctx.getVariable('callChoice'), variant = ctx.getActiveCharacterVariant('char_player');
  const rec = ctx.getSentimentTo('char_father', 'player', 'recognition') || 0, pride = ctx.getSentimentTo('char_father', 'player', 'pride') || 0;
  stage.state.craft = c.craft || 0; stage.state.recognition = rec; stage.sound?.setState({ craft: c.craft || 0, standing: c.standing || 0, recognition: rec });
  stage.state.tag = variant === 'odie_lead' || call === 'accept' ? 'TEAM LEAD' : call === 'renegotiated' ? 'SENIOR CRAFT LEAD' : call === 'decline' ? 'LACKS AMBITION?' : null;
  const rows = [['Craft', c.craft], ['Standing', c.standing], ['Cunning', c.cunning], ['Meaning', c.meaning], ['Leverage', c.leverage]];
  $('#gauges').innerHTML = rows.map(([k, v]) => `<li><span>${k}</span><meter min="-4" max="10" value="${v || 0}"></meter><b>${v || 0}</b></li>`).join('') +
    `<li class="father"><span>Father sees the title</span><meter min="0" max="1" value="${pride.toFixed(2)}"></meter><b>${pride.toFixed(2)}</b></li>` +
    `<li class="father"><span>Father sees him</span><meter min="0" max="1" value="${rec.toFixed(2)}"></meter><b>${rec.toFixed(2)}</b></li>`;
}

// Same snapshot as player/tests/routes.mjs, so a rehearsal can be checked against Node.
function handoverState(engine) { const c = engine.getContext(); return { counters: c.getCharacterCountersFor('char_player'), callChoice: c.getVariable('callChoice'), roleHolder: c.getVariable('roleHolderName'), knowsFatherCraft: c.getVariable('knowsFatherCraft'), recognition: +(c.getSentimentTo('char_father', 'player', 'recognition') || 0).toFixed(2), pride: +(c.getSentimentTo('char_father', 'player', 'pride') || 0).toFixed(2) }; }

// ---------- sound panel: voices, music, effects, volume (remembered per browser) ----------
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
  const ui = makeUI(json.story, sound);
  $('#engine').textContent = 'ASAPS core ' + ASAPS_CORE_VERSION;
  const sel = $('#rehearse'); sel.innerHTML = Object.entries(REHEARSALS).map(([k, r]) => `<option value="${k}">${esc(r.label)}</option>`).join('');
  const startFrom = location.hash.slice(1); if (REHEARSALS[startFrom]) sel.value = startFrom;

  let engine = null, runId = 0;
  async function run() {
    const my = ++runId; engine?.stop();
    const renderer = new CardboardRenderer(stage, ui);
    engine = new StoryEngine(renderer, { mockMode: true });
    const story = storyFromGeneratedJson(json);
    const reh = REHEARSALS[sel.value];
    const realRandom = Math.random;
    if (reh.until) { const r = prng(reh.seed); renderer.fast = { rnd: r }; Math.random = r; stage.quiet = true; $('#ff').hidden = false; }
    for (const b of story.getAllBeats()) {
      const ex = b.execute.bind(b);
      b.execute = async (ctx, r) => {
        if (my !== runId) { engine.stop(); return null; }
        if (renderer.fast && b.id === reh.until) { renderer.fast = null; Math.random = realRandom; stage.quiet = false; $('#ff').hidden = true; window.__player.handover = handoverState(engine); }
        if (renderer.live) { await stage.setScene(b.id); await stage.setProps(b.id); sound.setScene({ place: stage.place, memory: stage.memory, chorusMode: stage.chorusMode }); } // skipped beats are not staged
        if (renderer.live) $('#log').insertAdjacentHTML('afterbegin', `<li><code>${b.id}</code> ${esc(b.type)} · ${esc(b.name || '')}</li>`);
        $('#beat').textContent = `${b.id} · ${b.type}`;
        const next = await ex(ctx, r);
        readState(engine, stage);
        return next;
      };
    }
    await engine.loadStory(story);
    readState(engine, stage);
    try { await engine.start(); } catch (e) { console.error(e); $('#beat').textContent = 'Engine error: ' + e.message; }
    Math.random = realRandom;
  }
  $('#start').onclick = () => { sound.init(); stage.state.tagFall = 0; run(); };
  // preview(beatId): stage a beat without playing (review and screenshots only)
  window.__player = { stage, sound, get engine() { return engine; }, run, select: k => { sel.value = k; }, preview: async id => { stage.state.craft = 6; await stage.setScene(id); await stage.setProps(id); } };
}
boot();
