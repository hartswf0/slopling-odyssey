// Sound for the cardboard stage. Half of what sells a cutout is what you hear when it moves, so
// effects are driven by the stage's own animation events (stage.onSound), never placed by hand:
// a card sliding in on its wire, brads clicking when a pose changes, steps measured from distance
// walked, claps on the frame the hands meet, the snip and flutter of the cut tag.
// Voices are Kokoro renders (tools/render_voices.py) looked up by voiceKey(text); their loudness
// envelopes drive the speaking figure's gesture. Music is a small procedural score keyed to place
// and ASAPS state. Everything random uses its own PRNG: Math.random is seeded during rehearsals.

export function voiceKey(text) { // same as tools/render_voices.py voice_key
  const t = String(text ?? '').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
  let h = 0x811c9dc5; for (const ch of t) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function prng(seed) { let s = seed; return () => ((s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x6d2b79f5 | 0) >>> 0) / 4294967296; }

// place → ambience bed and music theme
const FAMILY = [
  [/olympus|work_office|charter|vane|underworld_conference/, 'office'], [/underworld|vision_/, 'underworld'],
  [/orchard|bell_garden/, 'orchard'], [/hendry|forge|exile_shed|knuthe_cave/, 'workshop'],
  [/sea|voyage/, 'sea'], [/train/, 'train'], [/oracle/, 'temple'], [/./, 'interior'],
];
export const familyOf = place => place ? FAMILY.find(([re]) => re.test(place))[1] : null;

export class Sound {
  constructor() {
    this.prefs = { voice: true, music: true, sfx: true, vol: 0.8 };
    try { Object.assign(this.prefs, JSON.parse(localStorage.getItem('slopling.sound') || '{}')); } catch (e) {}
    this.r = prng(20240611); this.log = []; this.manifest = null; this.cur = null; this.scene = {}; this.st = { craft: 0, standing: 0, recognition: 0 };
    this.manifestReady = fetch('voices/manifest.json').then(r => r.ok ? r.json() : null).then(m => (this.manifest = m)).catch(() => null);
  }
  save() { try { localStorage.setItem('slopling.sound', JSON.stringify(this.prefs)); } catch (e) {} this.applyLevels(); }
  init() {
    if (this.A) { this.A.resume?.(); return; }
    try { this.A = new AudioContext(); } catch (e) { return; }
    const A = this.A, comp = A.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3;
    this.master = A.createGain(); this.master.connect(comp); comp.connect(A.destination);
    this.tap = A.createMediaStreamDestination?.(); if (this.tap) comp.connect(this.tap); // for recording a take
    this.bus = {}; for (const k of ['room', 'music', 'sfx', 'voice']) { this.bus[k] = A.createGain(); this.bus[k].connect(this.master); }
    this.applyLevels();
    this.noiseBuf = this.makeNoise(2); this.ks = new Map();
    this.next = A.currentTime + 0.1; this.step = 0; setInterval(() => this.schedule(), 50);
  }
  applyLevels() {
    if (!this.A) return; const p = this.prefs, t = this.A.currentTime, duck = this.cur ? 1 : 0;
    this.master.gain.setTargetAtTime(p.vol, t, 0.05);
    this.bus.voice.gain.setTargetAtTime(p.voice ? 1 : 0, t, 0.05);
    this.bus.sfx.gain.setTargetAtTime(p.sfx ? 0.9 : 0, t, 0.05);
    this.bus.room.gain.setTargetAtTime(p.sfx ? (duck ? 0.3 : 0.55) : 0, t, 0.25);
    this.bus.music.gain.setTargetAtTime(p.music && !this.scene.still ? (duck ? 0.11 : 0.34) : 0, t, duck ? 0.12 : 0.6); // voice ducks the score about 10 dB
  }

  // ---------- building blocks ----------
  makeNoise(sec) { const A = this.A, b = A.createBuffer(1, A.sampleRate * sec, A.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = this.r() * 2 - 1; return b; }
  out(node, x, bus = 'sfx') { // pan by stage x (0..1280)
    if (x == null) { node.connect(this.bus[bus]); return; }
    const p = this.A.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, (x / 1280) * 2 - 1)) * 0.7; node.connect(p); p.connect(this.bus[bus]);
  }
  env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  noise(t, dur, { type = 'bandpass', f = 1000, f2 = null, q = 1, a = 0.003, peak = 0.2, x = null, bus = 'sfx' } = {}) {
    const A = this.A, s = A.createBufferSource(), fl = A.createBiquadFilter(), g = A.createGain();
    s.buffer = this.noiseBuf; fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + a + dur);
    this.env(g, t, a, peak, dur); s.connect(fl); fl.connect(g); this.out(g, x, bus); s.start(t, this.r() * 1.5); s.stop(t + a + dur + 0.05);
  }
  tone(t, f, dur, { type = 'sine', f2 = null, a = 0.002, peak = 0.2, x = null, bus = 'sfx', lp = null } = {}) {
    const A = this.A, o = A.createOscillator(), g = A.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + a + dur);
    this.env(g, t, a, peak, dur); let n = o; if (lp) { const fl = A.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl); n = fl; }
    n.connect(g); this.out(g, x, bus); o.start(t); o.stop(t + a + dur + 0.05);
  }
  pluck(t, m, vel = 0.3, x = null) { // Karplus-Strong, rendered once per pitch
    const A = this.A; if (!this.ks.has(m)) {
      const sr = A.sampleRate, N = Math.round(sr / mtof(m)), b = A.createBuffer(1, sr * 1.6, sr), d = b.getChannelData(0), r = prng(m);
      for (let i = 0; i < N; i++) d[i] = r() * 2 - 1;
      for (let i = N; i < d.length; i++) d[i] = 0.996 * 0.5 * (d[i - N] + d[i - N - 1 < 0 ? 0 : i - N - 1]);
      this.ks.set(m, b);
    }
    const s = A.createBufferSource(), g = A.createGain(), fl = A.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 2400;
    s.buffer = this.ks.get(m); g.gain.value = vel; s.connect(fl); fl.connect(g); this.out(g, x, 'music'); s.start(t);
  }
  bell(t, m, vel = 0.12, bus = 'music') { [[1, 1], [2.01, .3], [4.07, .12]].forEach(([k, a]) => this.tone(t, mtof(m) * k, 1.4 / k, { peak: vel * a, bus })); }
  pizz(t, m, vel = 0.22) { this.tone(t, mtof(m), 0.34, { type: 'triangle', peak: vel, lp: 900, bus: 'music' }); }
  pad(t, ms, dur, vel = 0.05, cut = 700) {
    const A = this.A; for (const m of ms) for (const det of [-6, 6]) {
      const o = A.createOscillator(), g = A.createGain(), fl = A.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = det;
      fl.type = 'lowpass'; fl.frequency.value = cut; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel, t + Math.min(0.8, dur / 3)); g.gain.setValueAtTime(vel, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.6);
      o.connect(fl); fl.connect(g); g.connect(this.bus.music); o.start(t); o.stop(t + dur + 0.7);
    }
  }
  woodblock(t, vel = 0.12) { this.tone(t, 880, 0.05, { peak: vel, bus: 'music' }); this.noise(t, 0.03, { f: 1600, q: 6, peak: vel * 0.6, bus: 'music' }); }

  // ---------- animation events (stage.onSound) ----------
  event(name, d = {}) {
    if (!this.A) return; const t = this.A.currentTime + 0.005, x = d.x, r = this.r;
    this.log.push({ name, at: performance.now(), audio: t });
    const E = {
      enter: () => { this.noise(t, 0.42, { f: 650, f2: 1800, q: 2.5, a: 0.12, peak: d.chorus ? 0.05 : 0.11, x }); this.tone(t + 0.05, 2300, 0.08, { f2: 2700, peak: 0.012, x }); },
      leave: () => this.noise(t, 0.38, { f: 1700, f2: 600, q: 2.5, a: 0.1, peak: 0.08, x }),
      flat: () => { this.tone(t, 74, 0.28, { f2: 48, peak: 0.32 }); this.noise(t, 0.22, { type: 'lowpass', f: 420, peak: 0.3 }); this.noise(t + 0.02, 0.5, { f: 900, f2: 500, q: 1, a: 0.05, peak: 0.05 }); },
      pose: () => { const n = Math.min(4, Math.max(1, Math.round((d.delta || 20) / 22))); for (let i = 0; i < n; i++) { const u = t + i * (0.03 + r() * 0.04); this.noise(u, 0.025, { f: 2600 + r() * 1800, q: 7, peak: 0.12, x }); this.tone(u, 3200 + r() * 1600, 0.05, { peak: 0.02, x }); }
        if ((d.delta || 0) > 40) this.noise(t, 0.18, { f: 380, f2: 520, q: 4, a: 0.04, peak: 0.05, x }); },
      step: () => { const p = d.heavy ? 0.32 : 0.2; this.tone(t, 120 + r() * 20, 0.09, { f2: 58, peak: p, x }); this.noise(t, 0.035, { type: 'lowpass', f: 1300, peak: p * 0.6, x }); },
      clap: () => this.noise(t, 0.045 + r() * 0.02, { type: 'bandpass', f: 1100 + r() * 700, q: 1.2, a: 0.001, peak: 0.07 + r() * 0.05, x }),
      chant: () => { for (const [f0, fm] of [[110, 700], [138.6, 1100]]) { const o = this.A.createOscillator(), fl = this.A.createBiquadFilter(), g = this.A.createGain(); o.type = 'sawtooth'; o.frequency.value = f0; fl.type = 'bandpass'; fl.frequency.value = fm; fl.Q.value = 5; this.env(g, t, 0.15, 0.06, 0.55); o.connect(fl); fl.connect(g); this.out(g, x); o.start(t); o.stop(t + 0.8); } },
      snip: () => { this.noise(t, 0.03, { f: 6200, q: 8, peak: 0.25 }); this.noise(t + 0.075, 0.03, { f: 5600, q: 8, peak: 0.28 }); this.tone(t + 0.075, 940, 0.32, { f2: 690, peak: 0.05, type: 'triangle' }); },
      flutter: () => { for (let i = 0; i < 9; i++) this.noise(t + i * 0.07 + r() * 0.02, 0.04, { f: 1800 + r() * 900, q: 2, peak: 0.05 * (1 - i / 10), x }); },
      tagLand: () => { this.noise(t, 0.06, { type: 'lowpass', f: 1500, peak: 0.14, x }); this.tone(t, 210, 0.06, { peak: 0.06, x }); },
      touch: () => { this.noise(t, 0.16, { type: 'lowpass', f: 480, a: 0.02, peak: 0.3, x }); this.cadence(); },
      tagDrop: () => { this.noise(t, 0.05, { f: 2100, q: 2, peak: 0.08, x }); this.tone(t + 0.12, 520, 0.12, { peak: 0.09, x }); this.noise(t + 0.12, 0.03, { f: 800, q: 5, peak: 0.08, x }); },
      workTag: () => { this.noise(t, 0.035, { f: 2400, q: 3, peak: 0.07, x }); this.bell(t + 0.02, [79, 83, 86][d.i % 3], 0.1, 'sfx'); },
      surge: () => { for (const [f, k] of [[1320, 1], [1980, .6], [2640, .35]]) this.tone(t, f, 3.2, { a: 0.9, peak: 0.035 * k }); },
      prop: () => { this.tone(t, 170 - Math.min(80, (d.h || 100) / 3), 0.1, { f2: 70, peak: 0.16, x }); this.noise(t, 0.05, { f: 1500, q: 1.5, peak: 0.07, x }); },
      lift: () => this.bell(t + 0.1, 91, 0.05, 'sfx'),
      pan: () => this.noise(t, 0.9, { f: 500, f2: 1600, q: 1.2, a: 0.3, peak: 0.07 }),
      page: () => this.noise(t, 0.2, { f: 2400, f2: 1300, q: 0.8, a: 0.03, peak: 0.035 }),
      click: () => this.noise(t, 0.04, { f: 3000, q: 4, peak: 0.2 }),
      still: () => { this.scene.still = true; this.applyLevels(); }, // silence lets the thought land
    };
    (E[name] || (() => {}))();
  }
  click() { this.event('click'); }
  slide() { this.event('enter'); }

  // Craft, sonified: no standing hum (it read as a drone); the line of light chimes when it grows.
  setLight(a) { if (!this.A) return; if (a > (this.lightA || 0) + 0.15) { const t = this.A.currentTime; [[1318.5, 1], [1975.5, .5]].forEach(([f, k], i) => this.tone(t + i * 0.08, f, 1.6, { a: 0.3, peak: 0.02 * k })); } this.lightA = a; }

  // ---------- voices ----------
  async say(text, speaker) {
    this.stopVoice(); const my = this.sayId = (this.sayId || 0) + 1;
    await this.manifestReady; const e = this.manifest?.lines?.[voiceKey(text)];
    if (!this.A || !e || !this.prefs.voice) return null;
    try {
      const buf = await this.A.decodeAudioData(await (await fetch('voices/' + e.file)).arrayBuffer());
      if (my !== this.sayId) return null;
      this.play(buf, e, 0); return e;
    } catch (err) { return null; }
  }
  play(buf, e, offset) {
    const s = this.A.createBufferSource(); s.buffer = buf; s.connect(this.bus.voice);
    const start = this.A.currentTime + 0.08; s.start(start, offset);
    this.cur = { s, buf, start: start - offset, e }; s.onended = () => { if (this.cur?.s === s) { this.cur = null; this.applyLevels(); } };
    this.applyLevels();
  }
  // jump the line now playing to a fraction of its length (the text pager keeps voice and page together)
  seekVoice(frac) { const c = this.cur; if (!c) return; try { c.s.onended = null; c.s.stop(); } catch (e) {} this.play(c.buf, c.e, Math.max(0, Math.min(c.e.dur - 0.05, frac * c.e.dur))); }
  voiceProgress() { const c = this.cur; return c ? Math.max(0, (this.A.currentTime - c.start) / c.e.dur) : null; }
  stopVoice() { this.sayId = (this.sayId || 0) + 1; if (this.cur) { try { this.cur.s.stop(); } catch (e) {} this.cur = null; this.applyLevels(); } }
  // 0..1 loudness of the line now playing (from its rendered envelope); null when nothing is voiced
  voiceLevel() { const c = this.cur; if (!c) return null; const i = Math.floor((this.A.currentTime - c.start) / 0.05); return i < 0 ? 0 : (+c.e.env[i] || 0) / 9; }

  // ---------- ambience and score ----------
  setScene({ place, memory = false, chorusMode = 'idle', still = false }) {
    const fam = memory ? 'memory' : familyOf(place), changed = fam !== this.scene.fam;
    this.scene = { place, fam, chorusMode, still, memory };
    if (!this.A) return; this.applyLevels();
    if (changed) { this.bedFade?.(); this.bedFade = this.bed(fam); this.step = 0; }
  }
  setState(s) { Object.assign(this.st, s); }
  bed(fam) { // looping room beds; returns a fade-out
    const A = this.A, t = A.currentTime, out = A.createGain(); out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(1, t + 1.5); out.connect(this.bus.room);
    const loop = (type, f, q, lvl, lfoHz = 0, lfoAmt = 0) => { const s = A.createBufferSource(), fl = A.createBiquadFilter(), g = A.createGain(); s.buffer = this.noiseBuf; s.loop = true; fl.type = type; fl.frequency.value = f; fl.Q.value = q; g.gain.value = lvl;
      if (lfoHz) { const l = A.createOscillator(), lg = A.createGain(); l.frequency.value = lfoHz; lg.gain.value = lfoAmt; l.connect(lg); lg.connect(g.gain); l.start(); } s.connect(fl); fl.connect(g); g.connect(out); s.start(); return s; };
        // No standing tones or hums: a bed has to move (waves, wind) or it reads as a drone. Most places are carried by sparse room events instead.
    const srcs = [];
    if (fam === 'sea') srcs.push(loop('lowpass', 520, 0.6, 0.05, 0.11, 0.05));
    if (fam === 'orchard') srcs.push(loop('bandpass', 420, 0.5, 0.025, 0.07, 0.025));
    return () => { const u = A.currentTime; out.gain.setTargetAtTime(0.0001, u, 0.4); srcs.forEach(s => s.stop(u + 2)); };
  }
  // look-ahead scheduler: themes are step functions (one step = a 16th or 8th), plus sparse room events
  schedule() {
    const A = this.A; if (!A) return; const th = THEMES[this.scene.fam]; const spb = th ? 60 / th.bpm / th.div : 0.25;
    while (this.next < A.currentTime + 0.25) {
      const t = this.next, i = this.step++;
      const phrase = Math.floor(i / (th ? th.div * 32 : 1)) % 2 === 1; // eight bars of music, then eight bars of rest
      if (th && this.prefs.music && !this.scene.still && !phrase) th.step(this, t, i, this.st);
      this.roomEvents(t, spb);
      this.next += spb;
    }
  }
  roomEvents(t, dt) { const f = this.scene.fam, r = this.r, p = dt;
    if (f === 'office' && r() < p * 0.9) for (let k = 0, n = 1 + Math.floor(r() * 5); k < n; k++) this.noise(t + k * 0.09, 0.02, { f: 3500, q: 3, peak: 0.02, bus: 'room' }); // keyboards
    if (f === 'orchard' && r() < p * 0.12) { const f0 = 2400 + r() * 1400; for (let k = 0; k < 3; k++) this.tone(t + k * 0.11, f0, 0.07, { f2: f0 * 1.3, peak: 0.012, bus: 'room' }); } // a bird
    if ((f === 'workshop' || f === 'memory') && r() < p * 0.8) this.tone(t, 90, 0.12, { f2: 55, peak: 0.05, bus: 'room' }); // the press, far off
    if (f === 'train' && this.step % 8 === 0) { this.tone(t, 80, 0.08, { peak: 0.1, bus: 'room' }); this.tone(t + 0.14, 76, 0.08, { peak: 0.08, bus: 'room' }); }
    if (f === 'memory' && r() < p * 3) this.noise(t, 0.004, { type: 'highpass', f: 3000, peak: 0.03, bus: 'room' }); // crackle
  }
  // the father's cadence when his hand reaches the shoulder: the orchard theme resolves
  cadence() { const t = this.A.currentTime + 0.05; this.pad(t, [43, 55, 59, 62], 4, 0.035, 900); this.bell(t + 0.3, 79, 0.1); this.bell(t + 0.9, 74, 0.08); this.bell(t + 1.6, 71, 0.08); }
  coda(title) { if (!this.A) return; const t = this.A.currentTime + 0.1, warm = /Orchard|Telemachus/.test(title);
    this.pad(t, warm ? [43, 50, 59] : [45, 52, 60], 6, 0.03, 800); (warm ? [71, 69, 67, 62, 67] : [69, 67, 64, 62, 57]).forEach((m, i) => this.bell(t + 0.6 + i * 0.9, m, 0.08)); }
}

// Themes. ladder = the climb (comic pizzicato and a rising music-box arpeggio); sea = plucked lyre in D dorian;
// orchard = the father (low pad, a falling fourth, warmer when he sees his son); underworld = drone and silence.
const THEMES = {
  office: { bpm: 104, div: 4, step(s, t, i, st) { const bar = Math.floor(i / 16), k = i % 16, prog = [[36, 43, 45, 40], [38, 45, 47, 41]][bar % 2];
    if (k % 4 === 0) s.pizz(t, prog[k / 4] + 12, 0.2);
    if (k % 4 === 2) s.woodblock(t, 0.06);
    if (bar % 4 === 3 && k % 2 === 0 && k < 8) s.bell(t, [72, 76, 79, 84][k / 2], 0.07);
    if ((st.standing || 0) >= 6 && bar % 2 === 0 && k === 0) s.pad(t, [60, 64, 67], 0.25, 0.03, 1800); } },
  sea: { bpm: 66, div: 3, step(s, t, i) { const bar = Math.floor(i / 6), k = i % 6, arp = bar % 2 ? [60, 67, 72, 76, 74, 69] : [62, 69, 74, 77, 76, 72];
    s.pluck(t, arp[k] - 12, k === 0 ? 0.3 : 0.18, 640 + (k - 2.5) * 120); } },
  orchard: { bpm: 58, div: 2, step(s, t, i, st) { const bar = Math.floor(i / 8), k = i % 8, root = [43, 48, 43, 38][bar % 4];
    if (k === 0 && bar % 2 === 0) s.pad(t, (st.recognition || 0) > 0.5 ? [root, root + 7, root + 16] : [root, root + 7], 3, 0.022, 600);
    if (bar % 2 === 1 && k % 2 === 0) s.bell(t, [71, 69, 67, 62][k / 2], 0.07); } },
  memory: { bpm: 46, div: 2, step(s, t, i) { const k = i % 16; const m = [71, null, 69, null, 67, null, 62, null, 64, null, 67, null, 66, null, null, null][k]; if (m) s.bell(t, m + (s.r() - 0.5) * 0.15, 0.06); } },
  underworld: { bpm: 40, div: 2, step(s, t, i) { if (s.r() < 0.12) s.pluck(t, [45, 48, 50, 52, 55][Math.floor(s.r() * 5)] - 12, 0.2); } },
  workshop: { bpm: 72, div: 2, step(s, t, i) { if (i % 8 === 0) s.pizz(t, 38, 0.16); if (i % 16 === 6) s.bell(t, 74, 0.04); } },
  temple: { bpm: 50, div: 2, step(s, t, i) { if (i % 16 === 0) s.bell(t, 57, 0.05); if (i % 16 === 6) s.bell(t, 64, 0.035); } },
  interior: { bpm: 60, div: 2, step(s, t, i) { if (i % 32 === 0) s.bell(t, 72, 0.035); if (i % 32 === 12) s.bell(t, 67, 0.03); } },
  train: { bpm: 60, div: 2, step(s, t, i) { if (i % 32 === 0) s.bell(t, 69, 0.03); } },
};
