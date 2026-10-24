import { makeAnchorRig, drawAnchorRig, pose, bounds } from './anchor-rig.js';
// Cardboard toy-theatre stage for the ASAPS player.
// Everyone but Watson is a single scale-matched figure card on a wire (Pollock-style
// toy theatre). Watson is the one jointed puppet: the working 15-card front rig.
// State the ladder cannot see is drawn: Craft as a line of light, Standing as a tag.

const W = 1280, H = 720, FLOOR = 612, FIG_H = 372;
// The scale-matched cards assemble squat (short legs, big heads). Lengthen limb cards along
// their own axis at the recorded anchors; see player/tests/proportion-test.html.
const STRETCH = { thigh_left: 1.35, thigh_right: 1.35, shin_left: 1.35, shin_right: 1.35, upper_arm_left: 1.1, upper_arm_right: 1.1, forearm_left: 1.1, forearm_right: 1.1 };
const TAU = Math.PI * 2;
// Crowds have no ASAPS emotion of their own, so their faces follow what they are doing.
const CHORUS_FACE = { clap: 'E06', chant: 'E01', shade: 'E17', still: 'E01' };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
// the stage's own random source: Math.random belongs to the ASAPS engine, so a replayed run (undo) takes the same branches
let seed = 7; const rand = () => ((seed = Math.imul(seed ^ (seed >>> 15), 0x2c1b3c6d) + 0x6d2b79f5 | 0) >>> 0) / 4294967296;

const imgCache = new Map();
const trimCache = new Map();
// Native props sit on large transparent canvases; trim each to its visible card once.
export function loadTrimmed(src) {
  if (!trimCache.has(src)) trimCache.set(src, loadImage(src).then(im => {
    if (!im) return null; const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
    const g = c.getContext('2d'); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) if (d[(y * c.width + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 <= x0) return im; const o = document.createElement('canvas'); o.width = x1 - x0 + 2; o.height = y1 - y0 + 2;
    o.getContext('2d').drawImage(c, -x0, -y0); return o;
  }));
  return trimCache.get(src);
}
// Grey copies for the Underworld's shades, made once per card. (ctx.filter cost seconds per frame
// on software-rendered canvases and does nothing in Safari, so the stage never uses it.)
const greys = new WeakMap();
function greyOf(im) {
  if (!im) return im; if (greys.has(im)) return greys.get(im);
  const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height), a = d.data;
  for (let i = 0; i < a.length; i += 4) { const l = (a[i] * 0.3 + a[i + 1] * 0.59 + a[i + 2] * 0.11) * 0.8; a[i] = l; a[i + 1] = l; a[i + 2] = l * 1.08; }
  g.putImageData(d, 0, 0); greys.set(im, c); return c;
}
// Odie's head card is drawn smaller than the anchor-rig cast's (measured in tests/heads-lineup.html);
// enlarge it about its neck pivot so every head on stage is the same size. A copy of the manifest, not new art.
export const WATSON_HEAD_SCALE = 1.28;
export function scaleWatsonHead(manifest, k = WATSON_HEAD_SCALE) {
  return { ...manifest, parts: manifest.parts.map(p => { if (p.id !== 'head') return p; const [px, py] = p.pivot, [x, y, w, h] = p.rect; return { ...p, rect: [px - (px - x) * k, py - (py - y) * k, w * k, h * k] }; }) };
}
if (typeof window !== 'undefined') window.scaleWatsonHead = scaleWatsonHead;
export function loadImage(src) {
  if (!imgCache.has(src)) {
    imgCache.set(src, new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }));
  }
  return imgCache.get(src);
}

// Authored layouts (x = centre, y = bottom edge, h = drawn height). Places without one
// use autoLayout, which is a placeholder arrangement and is labelled as such.
export const LAYOUTS = {
  place_orchard: {
    wash: ['#d9b77f', '#8d6a3e'], slots: [470, 830, 1010], work: [930, 215],
    pieces: [
      ['orchard_stage_distant_orchard_sky', 640, 360, 1280 * 217 / 1519, 'back'],
      ['orchard_stage_house_doorway', 150, 470, 250, 'back'],
      ['orchard_stage_tree_bramley', 330, 560, 330, 'mid'],
      ['orchard_stage_tree_discovery', 560, 548, 300, 'mid'],
      ['orchard_stage_tree_committee', 880, 556, 360, 'mid'],
      ['orchard_stage_tree_pear_no_fruit', 1130, 552, 318, 'mid'],
      ['orchard_stage_ground_path', 640, 720, 1280 * 132 / 1517 * 1.55, 'floor'],
      ['orchard_stage_bench_back', 160, 600, 70, 'mid'],
      ['orchard_stage_bench_seat', 160, 628, 62, 'mid'],
      ['orchard_stage_foreground_leaf_strip', 1120, 735, 150, 'front'],
    ],
    labels: { orchard_stage_tree_bramley: 'Bramley', orchard_stage_tree_discovery: 'Discovery ×3', orchard_stage_tree_committee: 'The Committee', orchard_stage_tree_pear_no_fruit: 'The pear' },
  },
};

function autoLayout(set) {
  // Placeholder: backdrop flats along the back wall, wide low cells as floor, the rest as props.
  const ps = set.pieces.slice().sort((a, b) => b.w * b.h - a.w * a.h);
  const out = []; let bx = 0, px = 0;
  const backs = ps.filter(p => p.w / p.h > 1.25 && p.w / p.h < 2.6).slice(0, 2);
  const floors = ps.filter(p => p.w / p.h >= 2.6).slice(0, 1);
  const props = ps.filter(p => !backs.includes(p) && !floors.includes(p)).slice(0, 5);
  backs.forEach((p, i) => out.push([p.id, 640 + (i ? 330 : -230), 455, 250, 'back']));
  floors.forEach(p => out.push([p.id, 640, 700, 130, 'floor']));
  const xs = [150, 1130, 300, 980, 70];
  props.forEach((p, i) => { out.push([p.id, xs[i], FLOOR + 6, clamp(170 * p.h / 300, 90, 200), i < 2 ? 'mid' : 'front']); });
  return { wash: ['#c9a777', '#6e5236'], slots: [430, 780, 1000, 1150], pieces: out, auto: true };
}

export class Stage {
  constructor(canvas, staging, rig) {
    this.cv = canvas; this.x = canvas.getContext('2d');
    this.staging = staging; this.rig = rig && { ...rig, manifest: scaleWatsonHead(rig.manifest) }; // {api, manifest, images}; Odie's head matched to the cast
    this.place = null; this.cast = []; this.speaker = null; this.motifs = [];
    this.figures = new Map(); // id -> {img, x, tx, a, ta, lean}
    this.watson = { x: 430, tx: 430, a: 1, pose: 'idle', poseT: 0, from: {}, to: {} };
    this.state = { craft: 0, standing: 0, tag: null, tagFall: 0, recognition: 0 };
    this.setImgs = new Map(); this.t0 = performance.now(); this.lastSwitch = 0;
    this.rigCanvas = document.createElement('canvas'); this.rigCanvas.width = 340; this.rigCanvas.height = 520;
    this.rigs = {}; this.workTags = 0; this.surge = 0;
    if (staging.nativeProps?.hand_shoulder) loadTrimmed(staging.nativeProps.hand_shoulder).then(im => { this.shoulderHand = im; });
    for (const [id, r] of Object.entries(staging.rigs || {})) {
      Promise.all(Object.entries(r.files).map(async ([k, v]) => [k, await loadImage(v)])).then(es => { const rig = makeAnchorRig(r.meta, Object.fromEntries(es)); if (rig.ok) this.rigs[id] = rig; });
    }
    this.onFrame = this.onFrame.bind(this); requestAnimationFrame(this.onFrame);
  }
  // animation events for the sound engine; nothing is emitted while a rehearsal fast-forwards
  emit(name, d) { if (!this.quiet) this.onSound?.(name, d); }
  layoutFor(place) { const set = this.staging.sets[place]; if (!set) return null; return LAYOUTS[place] || this.staging.layouts?.[place] || autoLayout(set); }
  async setScene(beatId) {
    const b = this.staging.beats[beatId]; if (!b) return;
    this.beatId = beatId; clearInterval(this.panTimer);
    if (b.panorama) {
      // The Road: slide through each tradition's set while the passage is read.
      let i = 0; const step = async () => {
        if (this.beatId !== beatId) return clearInterval(this.panTimer);
        const seg = b.panorama[i % b.panorama.length]; i++;
        this.panLabel = seg.label;
        if (i > 1) this.emit('pan');
        await this.applyStage({ ...b, place: seg.place, cast: ['char_player', ...seg.cast], panoProps: seg.place });
      };
      await step(); this.panTimer = setInterval(step, 7000); return;
    }
    this.panLabel = null;
    await this.applyStage(b);
  }
  async applyStage(b) {
    this.memory = !!b.memory; this.chorusMode = b.chorusMode || 'idle';
    if (b.place !== this.place) {
      if (this.place) this.emit('flat');
      this.place = b.place; this.lastSwitch = performance.now(); this.treeT = 0; this.workTags = 0; this.state.dim = false;
      for (const f of this.figures.values()) { f.held = false; f.arm = 0; f.front = false; f.flip = false; f.ttilt = 0; f.slow = false; }
      const set = this.staging.sets[b.place];
      if (set) await Promise.all(set.pieces.map(async p => this.setImgs.set(p.id, await loadImage(p.src))));
    }
    if (b.panoProps) this.panoProps = b.panoProps; else this.panoProps = null;
    this.motifs = b.motifs || [];
    const want = b.cast.filter(c => c !== 'char_player'), chorus = (b.chorus || []).filter(c => !want.includes(c));
    this.hasWatson = b.cast.includes('char_player');
    const lay = this.layoutFor(this.place) || { slots: [430, 780, 1000, 1150] };
    this.watson.tx = this.hasWatson ? lay.slots[0] : this.watson.tx;
    for (const [id, f] of this.figures) if (!want.includes(id) && !chorus.includes(id) && !this.motifs.includes(id)) { if (!f.leaving) this.emit('leave', { x: f.x }); f.tx = f.x > 640 ? W + 260 : -260; f.leaving = true; }
    const slotFor = (i) => this.hasWatson ? lay.slots[Math.min(i + 1, lay.slots.length - 1)] + (i >= lay.slots.length - 1 ? (i - lay.slots.length + 2) * 120 : 0) : lay.slots[Math.min(i, lay.slots.length - 1)];
    // the chorus stands a step upstage, spread across the back
    const backX = (i, n) => 230 + (n === 1 ? 0.5 : i / (n - 1)) * 820 + (i % 2 ? 24 : -24);
    const entries = [...want.map((id, i) => [id, slotFor(i), false]), ...chorus.map((id, i) => [id, backX(i, chorus.length), true]), ...this.motifs.map((id, i) => [id, i % 2 ? 1060 : 180, false])];
    for (const [id, tx, isChorus] of entries) {
      const fig = this.staging.figures[id]; if (!fig) continue;
      const img = fig.src ? await loadImage(fig.src) : null;
      const f = this.figures.get(id);
      if (f && !f.leaving) { if (!f.held) f.tx = tx; f.chorus = isChorus; continue; }
      this.figures.set(id, { id, img, w: fig.w, h: fig.h, x: tx > 640 ? W + 260 : -260, tx, lean: 0, motif: this.motifs.includes(id), chorus: isChorus, leaving: false, arm: 0, armA: 74, phase: rand() * 6 });
      this.emit('enter', { x: tx, chorus: isChorus });
    }
  }
  setSpeaker(id) { this.speaker = id; }
  // Story props: per-beat placements from props.json, plus props a stage cue brings on.
  async setProps(beatId) {
    const P = this.staging.props; if (!P) return;
    const list = (P.beats[beatId] || []).map(p => ({ key: p[0], at: p.slice(1, 5), lift: p[5] === 'lift' }));
    for (const p of list) p.img = await this.propImage(p.key);
    if (this.staging.beats[beatId]?.panorama) for (const seg of this.staging.beats[beatId].panorama)
      for (const p of P.panorama?.[seg.place] || []) list.push({ key: p[0], at: p.slice(1, 5), img: await this.propImage(p[0]), pano: seg.place });
    const prevKeys = new Set((this.props || []).map(p => p.key));
    for (const p of list) p.born = prevKeys.has(p.key) ? 0 : performance.now();
    this.props = list.concat((this.props || []).filter(p => p.cue && this.place === p.place));
  }
  async cueProp(name) {
    const P = this.staging.props, c = P?.cues?.[name]; if (!c || (this.props || []).some(p => p.key === c[0])) return;
    const img = await this.propImage(c[0]); (this.props ||= []).push({ key: c[0], at: c.slice(1, 5), img, cue: true, place: this.place, born: performance.now() });
  }
  propImage(name) {
    const v = this.staging.props?.names?.[name]; if (!v) return Promise.resolve(null);
    return v.startsWith('native:') ? loadTrimmed(this.staging.nativeProps?.[v.slice(7)]) : loadImage(v);
  }
  drawProps(layer, t) {
    for (const p of this.props || []) {
      const [cx, by, h, ly] = p.at; if (ly !== layer || !p.img || (p.pano && p.pano !== this.place)) continue;
      const u = p.born ? clamp((performance.now() - p.born) / 500, 0, 1) : 1, w = h * p.img.width / p.img.height;
      if (p.born && u >= 1) this.once('prop' + p.born + p.key, p.lift ? 'lift' : 'prop', { x: cx, h }); // lands when the fade-in drop finishes
      const lift = p.lift ? 26 + Math.sin(t * 2.4) * 4 : 0, x = this.x;
      x.save(); x.globalAlpha = u; x.translate(cx, by - lift - (1 - u) * 40);
      if (p.lift) { x.globalCompositeOperation = 'source-over'; x.shadowColor = 'rgba(255,230,160,.8)'; x.shadowBlur = 22; }
      else { x.shadowColor = 'rgba(20,10,0,.45)'; x.shadowBlur = 10; x.shadowOffsetY = 6; }
      x.drawImage(p.img, -w / 2, -h, w, h); x.restore();
      this.hits.push({ kind: 'prop', id: p.key, r: [cx - w / 2, by - lift - h, cx + w / 2, by - lift] });
    }
  }
  // Stage cues: physical events the story text names, performed by the cards.
  cue(name, who = 'char_father') {
    const f = this.figures.get(who), w = this.watson;
    if (name === 'nameTrees') { this.treeT = performance.now(); this.setWatsonPose('point'); }
    if (name === 'nameWork') { this.workTags = performance.now(); this.surge = performance.now(); this.setWatsonPose('point'); this.emit('surge'); }
    // The father crosses to his son; his near arm rises until the hand rests on Watson's shoulder.
    if ((name === 'approach' || name === 'hug') && this.props) this.props = this.props.filter(p => !(p.cue && p.key === 'journal_open')); // he hands the journal back
    if (name === 'approach' && f) { f.tx = w.tx + 205; f.slow = true; f.front = true; f.held = true; f.reach = true; this.setWatsonPose('turn'); }
    if (name === 'hug' && f) { f.tx = w.tx + 150; f.slow = true; f.front = true; f.held = true; f.reach = true; this.setWatsonPose('turn'); }
    if (name === 'cutTag') this.state.tagFall = performance.now();
    if (name === 'turnAway' && f) { f.tx = 1130; f.slow = true; f.flip = true; f.front = false; f.held = true; f.ttilt = 0; f.reach = false; }
    if (name === 'still') { this.emit('still'); this.setWatsonPose('low'); if (f) { f.ttilt = 0; f.front = false; } this.state.dim = true; }
  }
  drawTreeTags(lay, t) {
    if (!this.treeT || !lay.labels) return; const x = this.x, el = (performance.now() - this.treeT) / 1000;
    Object.entries(lay.labels).forEach(([id, txt], i) => {
      const p = lay.pieces.find(q => q[0] === id); if (!p) return; const u = clamp((el - i * 1.1) / .6, 0, 1); if (!u) return;
      this.once('tree' + this.treeT + i, 'tagDrop', { x: p[1] });
      const drop = 1 - Math.pow(1 - u, 3), cx = p[1], top = p[2] - p[3] + 30;
      x.save(); x.translate(cx, top - 170 + drop * 60); x.rotate(Math.sin(t * 1.6 + i) * .05);
      x.strokeStyle = 'rgba(250,240,220,.8)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(0, -200); x.lineTo(0, 0); x.stroke();
      x.font = '700 16px "Courier Prime", monospace'; const tw = x.measureText(txt).width + 26;
      x.fillStyle = '#efe1c4'; x.strokeStyle = '#9b7a4c'; x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 6;
      x.beginPath(); x.rect(-tw / 2, 0, tw, 30); x.fill(); x.stroke(); x.shadowBlur = 0;
      x.fillStyle = '#2a1c0e'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, 15); x.restore();
    });
  }
  // The invisible work, hung as small grafted tags on the tree he and his father share.
  drawWorkTags(lay, t) {
    if (!this.workTags || !lay.work) return; const x = this.x, el = (performance.now() - this.workTags) / 1000;
    [['the VAT bug', -120, 70], ['the Québec refactor', 10, 20], ['the retry loop', 130, 80]].forEach(([txt, dx, dy], i) => {
      const u = clamp((el - .4 - i * .9) / .5, 0, 1); if (!u) return;
      const cx = lay.work[0] + dx * 1.25, cy = lay.work[1] - 55 + dy * 0.5;
      this.once('work' + this.workTags + i, 'workTag', { x: cx, i });
      x.save(); x.globalAlpha = u; x.translate(cx, cy - (1 - u) * 30); x.rotate(Math.sin(t * 2 + i) * .08);
      x.strokeStyle = 'rgba(70,50,30,.8)'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, -22); x.lineTo(0, 0); x.stroke();
      x.font = 'italic 13px "Courier Prime", monospace'; const tw = x.measureText(txt).width + 18;
      x.fillStyle = '#f6ecd6'; x.strokeStyle = '#9b7a4c'; x.beginPath(); x.rect(-tw / 2, 0, tw, 22); x.fill(); x.stroke();
      x.fillStyle = '#3a2410'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, 11); x.restore();
    });
  }
  setWatsonPose(pose) {
    if (pose === this.watson.pose) return; const from = this.currentRotations(), to = this.poseTable(pose);
    const delta = [...new Set([...Object.keys(from), ...Object.keys(to)])].reduce((s, k) => s + Math.abs((to[k] || 0) - (from[k] || 0)), 0);
    this.watson.from = from; this.watson.pose = pose; this.watson.poseT = performance.now();
    if (this.hasWatson && delta > 3) this.emit('pose', { x: this.watson.x, delta });
  }
  once(key, name, d) { (this.sounded ||= new Set()); if (!this.sounded.has(key)) { this.sounded.add(key); this.emit(name, d); } }
  poseTable(pose) {
    return ({
      idle: {},
      listen: { head: 3 },
      choose: { upper_arm_left: -4, forearm_left: -48, hand_left: 8, head: -2 },
      think: { upper_arm_right: 8, forearm_right: 62, hand_right: -14, head: 4 },
      open: { upper_arm_left: 10, forearm_left: -14, upper_arm_right: -10, forearm_right: 14, head: -3 },
      low: { head: 6, upper_arm_left: 2, upper_arm_right: -2 },
      point: { upper_arm_right: -68, forearm_right: -14, hand_right: -6, head: -4 },
      turn: { head: -5, torso: -1.5, upper_arm_right: -8, forearm_right: 10 },
    })[pose] || {};
  }
  currentRotations() {
    const w = this.watson, u = ease(clamp((performance.now() - w.poseT) / 650, 0, 1)), to = this.poseTable(w.pose), out = {};
    for (const k of new Set([...Object.keys(w.from || {}), ...Object.keys(to)])) out[k] = (w.from[k] || 0) + ((to[k] || 0) - (w.from[k] || 0)) * u;
    return out;
  }
  onFrame(now) {
    const x = this.x, t = (now - this.t0) / 1000;
    const CH = this.cv.height, oy = 0;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, CH); this.hits = [];
    const lay = this.layoutFor(this.place) || { wash: ['#c9a777', '#6e5236'], pieces: [] };
    // the camera: eases in on whoever speaks, closer on the touch, and back out when no one does.
    // On a tall screen the scene fills the frame and the camera holds on one person at a time, as vertical film does.
    const tg = this.camTarget(t), c = this.cam ||= { ...tg };
    c.s += (tg.s - c.s) * 0.025; c.x += (tg.x - c.x) * 0.03; c.y += (tg.y - c.y) * 0.03;
    const hw = W / (2 * c.s), hh = CH / (2 * c.s); c.x = clamp(c.x, hw, W - hw); if (!this.tall) c.y = clamp(c.y, hh, H - hh);
    x.save();
    x.setTransform(c.s, 0, 0, c.s, W / 2 - c.x * c.s, CH / 2 - c.y * c.s);
    if (this.tall) { // the set continues past its own edges: sky above, boards below, so a tall frame is never blank
      x.fillStyle = lay.wash[0]; x.fillRect(-W, -3000, 3 * W, 3000);
      const fl = x.createLinearGradient(0, H, 0, H + 900); fl.addColorStop(0, lay.wash[1]); fl.addColorStop(1, '#120c07'); x.fillStyle = fl; x.fillRect(-W, H - 1, 3 * W, 3000);
    }
    // wash + proscenium board
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, lay.wash[0]); g.addColorStop(1, lay.wash[1]); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = 'rgba(40,26,12,.22)'; x.fillRect(0, FLOOR, W, H - FLOOR);
    const draw = (layer) => lay.pieces.filter(p => p[4] === layer).forEach(([id, cx, by, h]) => {
      const im = this.setImgs.get(id); if (!im) return; const w = h * im.width / im.height;
      x.save(); x.shadowColor = 'rgba(20,10,0,.45)'; x.shadowBlur = 12; x.shadowOffsetY = 8; x.drawImage(im, cx - w / 2, by - h, w, h); x.restore();
    });
    draw('back'); this.drawProps('back', t); draw('floor'); draw('mid'); this.drawProps('mid', t);
    // motifs and figure cards
    const drawFig = (id, f) => {
      const speaking = this.speaker === id, rig = this.rigs[id], lvl = speaking ? this.voiceLevel?.() ?? null : null;
      const depth = f.chorus ? 0.84 : 1, mode = f.chorus ? this.chorusMode : 'cast';
      const h = (f.motif ? 330 : FIG_H) * depth, w = h * f.w / f.h, bob = speaking ? (lvl != null ? -lvl * 3.2 : Math.sin(t * 9) * 1.6) : 0;
      const lift = f.reach ? 0 : f.lean * 12, tilt = f.reach ? 0 : (f.x < 640 ? 1 : -1) * f.lean * 0.04 + (f.tilt || 0);
      const footY = FLOOR + 8 - (f.chorus ? 30 : 0);
      this.hits.push({ kind: 'fig', id, r: [f.x - w * 0.42, footY - h, f.x + w * 0.42, footY] });
      x.save(); x.translate(f.x, footY - lift + bob); x.rotate(tilt);
      const shade = mode === 'shade'; if (shade) x.globalAlpha = 0.5;
      x.strokeStyle = 'rgba(30,22,14,.55)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, -4); x.lineTo(f.x < 640 ? -160 : 160, 40); x.stroke();
      if (!shade && !f.chorus) { x.shadowColor = 'rgba(15,8,0,.5)'; x.shadowBlur = 14; x.shadowOffsetX = 6; x.shadowOffsetY = 10; } // shades cast none
      if (f.flip) x.scale(-1, 1);
      if (rig) {
        // jointed father: his screen-left arm rises toward Watson when reaching
        f.arm += ((f.reach ? 1 : 0) - f.arm) * 0.04;
        const a = f.arm, g = speaking ? (lvl != null ? Math.min(1, lvl * 1.6) : 1) : 0; f.talk = (f.talk || 0) + (g - (f.talk || 0)) * 0.06;
        const ph = t + (f.phase || 0), pk = f.poke ? clamp(1 - (performance.now() - f.poke) / 900, 0, 1) : 0;
        let extra = { upper_arm_left: a * f.armA, forearm_left: a * 24, hand_left_relaxed: -a * 12,
          forearm_right: -f.talk * (38 + Math.sin(t * 3.1) * 10), head: Math.sin(t * 1.3 + f.x) * 1.2 + Math.sin(pk * 14) * 7 * pk, upper_arm_right: -f.talk * (14 + Math.sin(t * 2.3) * 6) - Math.sin(pk * Math.PI) * 20 };
        // crowd actions: the Greeks' applause, the Oracle's chant, the shades' drift; Mau and the learner stay still
        if (mode === 'clap') { const c = (Math.sin(ph * 9) + 1) / 2; if (c > 0.97 && !(f.cPrev > 0.97)) this.emit('clap', { x: f.x }); f.cPrev = c; extra = { upper_arm_left: 22, forearm_left: 92 + c * 16, upper_arm_right: -22, forearm_right: -92 - c * 16, head: -2 }; }
        if (mode === 'chant') { const c = Math.sin(ph * 2.4); if (c > 0.98 && !(f.cPrev > 0.98)) this.emit('chant', { x: f.x }); f.cPrev = c; extra = { upper_arm_left: 150 + c * 10, forearm_left: 10, upper_arm_right: -150 - c * 10, forearm_right: -10, head: -6 }; }
        if (mode === 'shade') extra = { head: Math.sin(ph * .6) * 3, upper_arm_left: 3, upper_arm_right: -3 };
        if (mode === 'still') extra = {};
        if (mode === 'idle') extra = { head: Math.sin(ph * 1.1) * 1.5 };
        rig.stretch = STRETCH; rig.rest ||= bounds(rig, pose(rig, {}));
        const code = f.chorus ? CHORUS_FACE[mode] : this.faces?.[id];
        if (code !== f.face) { if (f.faceSeen && !f.chorus) this.emit('face', { x: f.x }); f.face = code; f.faceSeen = true; }
        let R = this.faceRig(id, rig, code); if (shade) R = (R.grey ||= { ...R, images: Object.fromEntries(Object.entries(R.images).map(([k, v]) => [k, greyOf(v)])) });
        const pts = drawAnchorRig(x, R, extra, 0, 0, h + 6, rig.rest);
        f.hand = [f.x + (f.flip ? -1 : 1) * pts.hand_left[0], FLOOR + 8 + pts.hand_left[1]];
      } else if (f.img) { const pk = f.poke ? clamp(1 - (performance.now() - f.poke) / 600, 0, 1) : 0; x.drawImage(shade ? greyOf(f.img) : f.img, -w / 2, -h - Math.sin(pk * Math.PI) * 14, w, h); }
      x.restore();
      const plaque = this.staging.thinkers?.[id];
      if (plaque) { // thinkers carry a name plaque at their feet
        x.save(); x.font = '700 14px "Courier Prime", monospace'; const tw = x.measureText(plaque).width + 20;
        x.translate(f.x, footY + 4); x.fillStyle = '#f2e6cc'; x.strokeStyle = '#8a6a43'; x.lineWidth = 1.5; x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 5;
        x.beginPath(); x.rect(-tw / 2, 0, tw, 24); x.fill(); x.stroke(); x.shadowBlur = 0;
        x.fillStyle = '#2a1c0e'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(plaque, 0, 12); x.restore();
      }
      // contact: steer so the hand lands on Watson's near shoulder, and hold it there
      if (rig && f.reach && this.watsonPts && f.arm > 0.6) {
        const [sx, sy] = this.watsonPts.shoulder, [hx, hy] = f.hand;
        f.tx += (sx + 6 - hx) * 0.08; f.armA = clamp(f.armA + (hy - (sy - 26)) * 0.04, 40, 115);
      }
    };
    const order = [...this.figures].sort((p, q) => (q[1].chorus ? 1 : 0) - (p[1].chorus ? 1 : 0));
    for (const [id, f] of order) {
      const dx = (f.tx - f.x) * (f.slow ? 0.025 : 0.09); f.x += dx;
      if (f.slow && !f.chorus && !(f.reach && this.touching)) { f.walked = (f.walked || 0) + Math.abs(dx); if (Math.abs(dx) > 0.35 && f.walked > 46) { f.walked = 0; this.emit('step', { x: f.x, heavy: id === 'char_father' }); } } f.tilt = (f.tilt || 0) + ((f.ttilt || 0) - (f.tilt || 0)) * 0.05; // no steps while the hand steers onto the shoulder
      if (f.leaving && Math.abs(f.x - f.tx) < 4) { this.figures.delete(id); continue; }
      const speaking = this.speaker === id;
      f.lean += ((speaking ? 1 : 0) - f.lean) * 0.12;
      if (!f.front) drawFig(id, f);
    }
    // Watson
    if (this.hasWatson && this.rig) this.drawWatson(t); else this.onLight?.(0);
    for (const [id, f] of this.figures) if (f.front) drawFig(id, f);
    this.drawTreeTags(lay, t); this.drawWorkTags(lay, t);
    draw('front'); this.drawProps('front', t);
    if (lay.auto) { x.fillStyle = 'rgba(30,20,10,.55)'; x.font = '12px "Courier Prime", monospace'; x.fillText('placeholder set layout', 14, 22); }
    if (this.memory) { // the Hendry works, remembered: desaturate, then warm (blend modes, not filters)
      x.save(); x.globalCompositeOperation = 'saturation'; x.globalAlpha = 0.8; x.fillStyle = 'hsl(0,0%,50%)'; x.fillRect(0, 0, W, H);
      x.globalCompositeOperation = 'multiply'; x.globalAlpha = 1; x.fillStyle = '#f2d6a6'; x.fillRect(0, 0, W, H); x.restore();
    }
    if (this.touching && this.shoulderHand && this.watsonPts) { // the father's hand, resting on the shoulder
      const [sx, sy] = this.watsonPts.shoulder, im = this.shoulderHand, w = 78, h = w * im.height / im.width;
      x.save(); x.translate(sx + 4, sy - 14); x.rotate(0.25); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 8; x.drawImage(im, -w / 2, -h / 2, w, h); x.restore();
    }
    if (this.panLabel) { x.save(); x.font = '700 20px "Courier Prime", monospace'; const tw = x.measureText(this.panLabel).width + 40;
      x.translate(W / 2, 26); x.fillStyle = '#f2e6cc'; x.strokeStyle = '#8a6a43'; x.lineWidth = 2; x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 8;
      x.beginPath(); x.rect(-tw / 2, 0, tw, 38); x.fill(); x.stroke(); x.shadowBlur = 0; x.fillStyle = '#2a1c0e'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(this.panLabel, 0, 19); x.restore(); }
    this.drawAffordances(t);
    x.restore(); x.setTransform(1, 0, 0, 1, 0, 0);
    if (this.tall) this.drawValance(CH, t);
    // grain/vignette, over the whole frame
    const v = x.createRadialGradient(W / 2, CH / 2, Math.min(W, CH) * .35, W / 2, CH / 2, Math.max(W, CH) * .75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.38)'); x.fillStyle = v; x.fillRect(0, 0, W, CH);
    // scene change wipe
    const since = now - this.lastSwitch; if (since < 420) { x.fillStyle = `rgba(18,12,6,${1 - since / 420})`; x.fillRect(0, 0, W, CH); }
    requestAnimationFrame(this.onFrame);
  }
  // ---------- faces: the packets' E01-E17 replacement heads, each hung at its own neck anchor ----------
  faceRig(id, rig, code) {
    const src = code && this.staging.rigs[id]?.faces?.[code]; if (!src) return rig;
    rig.faceRigs ||= {}; if (code in rig.faceRigs) return rig.faceRigs[code] || rig;
    rig.faceRigs[code] = null; // loading: keep the current head until it arrives
    const part = this.staging.rigs[id].meta.parts.find(p => p.file === `expressions/${code}.png`);
    loadImage(src).then(im => { if (im && part) rig.faceRigs[code] = { ...rig, parts: { ...rig.parts, head: part }, images: { ...rig.images, head: im }, faceRigs: null }; });
    return rig;
  }
  // Odie's faces come from a differently framed bank: lay the trimmed head over his head card, keeping its neck and collar
  watsonImages(code) {
    const src = code && this.staging.watsonFaces?.[code], base = this.rig.images; if (!src) return base;
    this.wfaces ||= {}; if (code in this.wfaces) return this.wfaces[code] || base;
    this.wfaces[code] = null;
    loadTrimmed(src).then(e => { if (!e) return; const h = base.head, c = document.createElement('canvas'); c.width = h.width; c.height = h.height; const g = c.getContext('2d');
      g.drawImage(h, 0, 0); const w = 250 / 253 * h.width, k = w / e.width; g.drawImage(e, 123 / 253 * h.width - w / 2, -12 / 338 * h.height, w, e.height * k);
      this.wfaces[code] = { ...base, head: c }; });
    return base;
  }
  // the head as currently worn, for the HUD and character sheets
  faceImage(id) {
    if (id === 'char_player') return this.watsonImages(this.faces?.char_player).head;
    const rig = this.rigs[id]; if (!rig) return null; const f = this.faceRig(id, rig, this.faces?.[id]); return f.images.head;
  }

  // A tall screen gets a tall frame, and the scene is zoomed to fill it (see camTarget).
  setFrame(cssW, cssH) {
    const tall = cssH > cssW * 0.75, CH = tall ? Math.round(W * cssH / cssW) : H;
    if (this.cv.height !== CH) this.cv.height = CH;
    if (this.tall !== tall) this.cam = null; // a new frame shape: the camera cuts rather than drifts
    this.oy = 0; this.tall = tall; this.baseZoom = 1;
    return { bandTop: 0, apronTop: 1 };
  }
  // A toy theatre's proscenium valance, hung across the top of a tall frame: the theatre's own
  // architecture where a narrow screen would otherwise show bare wall above the set.
  drawValance(CH, t) {
    const x = this.x, h = this.valanceH = Math.round(CH * 0.13), sw = W / 7;
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2a0707'); g.addColorStop(0.55, '#6b1616'); g.addColorStop(1, '#4a0f0f');
    x.save(); x.fillStyle = g; x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 30; x.shadowOffsetY = 12;
    x.beginPath(); x.moveTo(0, 0); x.lineTo(W, 0); x.lineTo(W, h - 40);
    for (let i = 7; i > 0; i--) x.quadraticCurveTo(i * sw - sw / 2, h + 34, (i - 1) * sw, h - 40); // scallops
    x.closePath(); x.fill(); x.shadowBlur = 0; x.shadowOffsetY = 0;
    x.strokeStyle = '#c9a24a'; x.lineWidth = 6; x.beginPath(); x.moveTo(0, h - 40);
    for (let i = 0; i < 7; i++) x.quadraticCurveTo(i * sw + sw / 2, h + 34, (i + 1) * sw, h - 40);
    x.stroke();
    x.strokeStyle = 'rgba(0,0,0,.22)'; x.lineWidth = 3; for (let i = 1; i < 14; i++) { const px = i * W / 14; x.beginPath(); x.moveTo(px, 0); x.lineTo(px + Math.sin(t * 0.4 + i) * 3, h - 50); x.stroke(); } // folds
    x.fillStyle = '#c9a24a'; x.fillRect(0, Math.round(h * 0.42), W, 5);
    x.restore();
  }
  camTarget(t) {
    const breathe = 0.008 * Math.sin(t * 0.09); // a slow breath, so a held scene is never quite still
    if (this.tall) { // vertical film: a shot that holds everyone who matters, feet at three-fifths of the frame (words and cards sit below)
      const CH = this.cv.height, xs = [];
      if (this.touching && this.watsonPts) xs.push(this.watsonPts.shoulder[0] - 90, this.watsonPts.shoulder[0] + 160);
      else { if (this.hasWatson) xs.push(this.watson.x); for (const [id, f] of this.figures) if (!f.chorus && !f.leaving && !f.motif && (id === this.speaker || xs.length < 2)) xs.push(f.x); }
      if (!xs.length) xs.push(W / 2);
      const lo = Math.min(...xs), hi = Math.max(...xs), s = clamp(W / (hi - lo + 250), 1.6, 3.1) * (1 + breathe);
      return { s, x: (lo + hi) / 2, y: FLOOR - 0.15 * CH / s };
    }
    const z = this.baseZoom || 1;
    if (this.touching && this.watsonPts) return { s: 1.12 * z, x: this.watsonPts.shoulder[0] + 60, y: FLOOR - FIG_H * 0.6 };
    const f = this.speaker && this.figures.get(this.speaker);
    if (f && !f.leaving) return { s: (1.06 + breathe) * z, x: f.x, y: FLOOR - FIG_H * 0.55 };
    if (z > 1.3 && this.hasWatson) return { s: z + Math.max(0, breathe), x: this.watson.x, y: H / 2 }; // tall screen, no one speaking: hold on Odie
    return { s: z + Math.max(0, breathe), x: W / 2, y: H / 2 };
  }
  // screen pixels → stage pixels, through the camera
  toWorld(px, py) { const c = this.cam || { s: 1, x: W / 2, y: H / 2 }, CH = this.cv.height; return [(px - (W / 2 - c.x * c.s)) / c.s, (py - (CH / 2 - c.y * c.s)) / c.s]; }
  // ---------- what you can click ----------
  // hit test in stage pixels; topmost first. Empty stage answers nothing.
  hitAt(px, py) { for (let i = this.hits.length - 1; i >= 0; i--) { const h = this.hits[i], [a, b, c, d] = h.r; if (px >= a && px <= c && py >= b && py <= d) return h; } return null; }
  think(id, text) { (this.thoughts ||= []).push({ id, text, t: performance.now() }); this.emit('lift'); }
  same(a, b) { return a && b && a.kind === b.kind && (a.id === b.id || (a.kind === 'prop' && b.id && a.id.split('_')[0] === b.id.split('_')[0])); }
  poke(hit) {
    if (hit.kind === 'fig') { if (hit.id === 'char_player') { this.setWatsonPose('open'); setTimeout(() => this.setWatsonPose('idle'), 900); } else { const f = this.figures.get(hit.id); if (f) f.poke = performance.now(); } }
    this.inspect = { hit, t: performance.now() }; this.emit(hit.kind === 'prop' ? 'prop' : 'pose', { x: (hit.r[0] + hit.r[2]) / 2, h: 60, delta: 30 });
  }
  labelFor(hit) {
    if (hit.kind === 'prop') return hit.id.replace(/_(native|open|glow|strung|unstrung)$/, '').replace(/_/g, ' ');
    if (hit.id === 'char_player') return 'Odie (you)';
    return this.charNames?.[hit.id] || this.staging.thinkers?.[hit.id] || this.staging.figures[hit.id]?.name || hit.id.replace(/^char_|^extra_/, '').replace(/_+/g, ' ');
  }
  // numbered badges over objects a current choice is about; hover ring; the inspect tag
  drawAffordances(t) {
    const x = this.x, tag = (cx, cy, txt, fill, ink) => {
      x.font = '600 19px "Fraunces", Georgia, serif'; const tw = Math.max(30, x.measureText(txt).width + 18);
      x.save(); x.fillStyle = fill; x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 8; x.beginPath(); x.roundRect(cx - tw / 2, cy - 15, tw, 30, 3); x.fill(); x.shadowBlur = 0;
      x.fillStyle = ink; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, cx, cy + 1); x.restore();
    };
    const top = h => [(h.r[0] + h.r[2]) / 2, Math.max(24, h.r[1] - 22)];
    if (this.hover && !this.marks?.some(m => this.same(this.hover, m))) { const [cx, cy] = top(this.hover); x.save(); x.strokeStyle = 'rgba(255,240,200,.85)'; x.lineWidth = 3; x.setLineDash([8, 6]); x.beginPath(); x.ellipse(cx, this.hover.r[3] + 4, (this.hover.r[2] - this.hover.r[0]) / 2, 12, 0, 0, TAU); x.stroke(); x.restore(); }
    for (const m of this.marks || []) {
      const h = this.hits.find(q => this.same(q, m)); if (!h) continue; const [cx, cy] = top(h), pulse = 0.5 + 0.5 * Math.sin(t * 4);
      x.save(); x.strokeStyle = `rgba(255,230,180,${0.25 + pulse * 0.35})`; x.lineWidth = 2.5; x.beginPath(); x.ellipse(cx, h.r[3] + 4, (h.r[2] - h.r[0]) / 2 + pulse * 6, 14 + pulse * 3, 0, 0, TAU); x.stroke(); x.restore();
    }
    // thought bubbles: what an ASAPS reflection says this person has just realised
    this.thoughts = (this.thoughts || []).filter(th => performance.now() - th.t < 9000);
    for (const th of this.thoughts) {
      const h = this.hits.find(q => q.kind === 'fig' && q.id === th.id); if (!h) continue; const el = (performance.now() - th.t) / 1000, a = Math.min(1, el * 3, (9 - el) * 1.5);
      x.save(); x.globalAlpha = a; x.font = 'italic 21px "Atkinson Hyperlegible", system-ui, sans-serif';
      const words = th.text.split(' '), lines = []; let l = ''; for (const wd of words) { if (x.measureText(l + ' ' + wd).width > 360 && l) { lines.push(l); l = wd; } else l = l ? l + ' ' + wd : wd; } lines.push(l);
      const bw = Math.max(...lines.map(t => x.measureText(t).width)) + 34, bh = lines.length * 27 + 22, cx = clamp((h.r[0] + h.r[2]) / 2, bw / 2 + 10, W - bw / 2 - 10), by = Math.max(10, h.r[1] - bh - 34);
      x.fillStyle = 'rgba(255,250,236,.97)'; x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 12; x.beginPath(); x.roundRect(cx - bw / 2, by, bw, bh, 18); x.fill();
      for (const [dx, dy, r] of [[0, bh + 10, 7], [10, bh + 24, 4.5]]) { x.beginPath(); x.arc((h.r[0] + h.r[2]) / 2 + dx * 0 + (cx > (h.r[0] + h.r[2]) / 2 ? 8 : -8), by + dy, r, 0, TAU); x.fill(); }
      x.shadowBlur = 0; x.fillStyle = '#2a1c0e'; x.textAlign = 'center'; x.textBaseline = 'top'; lines.forEach((t, i) => x.fillText(t, cx, by + 12 + i * 27)); x.restore();
    }
    const sp = this.spotlight; if (sp && performance.now() - sp.t < 10000) { // what you came back for
      const h = this.hits.find(q => q.kind === sp.kind && q.id.split('_')[0] === sp.id), pulse = 0.5 + 0.5 * Math.sin(t * 5);
      if (h) { const [cx] = top(h); x.save(); x.strokeStyle = `rgba(255,236,190,${0.45 + pulse * 0.5})`; x.lineWidth = 4; x.shadowColor = 'rgba(255,220,150,.9)'; x.shadowBlur = 18; x.beginPath(); x.ellipse(cx, (h.r[1] + h.r[3]) / 2, (h.r[2] - h.r[0]) / 2 + 18 + pulse * 6, (h.r[3] - h.r[1]) / 2 + 14 + pulse * 4, 0, 0, TAU); x.stroke(); x.restore(); }
    }
    const ins = this.inspect; if (ins && performance.now() - ins.t < 2600) { const h = this.hits.find(q => this.same(q, ins.hit)) || ins.hit, [cx, cy] = top(h); tag(cx, cy - (this.marks?.some(m => this.same(h, m)) ? 40 : 0), this.labelFor(ins.hit), 'rgba(242,230,204,.96)', '#2a1c0e'); }
  }
  // thumbnails drawn from the real assets: a set at its authored layout, a figure's head, a prop
  async thumb(kind, id, w = 240, h = 135) {
    const key = kind + ':' + id + ':' + w; (this.thumbs ||= new Map()); if (this.thumbs.has(key)) return this.thumbs.get(key);
    const make = (async () => {
      const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
      if (kind === 'place') {
        const lay = this.layoutFor(id), set = this.staging.sets[id]; if (!lay || !set) return null;
        const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, lay.wash[0]); gr.addColorStop(1, lay.wash[1]); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.scale(w / W, h / H);
        for (const layer of ['back', 'floor', 'mid', 'front']) for (const [pid, cx, by, ph, ly] of lay.pieces) { if (ly !== layer) continue; const src = set.pieces.find(p => p.id === pid)?.src; const im = src && await loadImage(src); if (im) { const pw = ph * im.width / im.height; g.drawImage(im, cx - pw / 2, by - ph, pw, ph); } }
        return c.toDataURL('image/jpeg', 0.8);
      }
      let im = null;
      if (kind === 'fig') im = this.staging.rigs?.[id] ? await loadImage(this.staging.rigs[id].files.head) : id === 'char_player' ? this.rig.images.head : this.staging.figures[id]?.src ? await loadImage(this.staging.figures[id].src) : null;
      if (kind === 'prop') im = await this.propImage(id);
      if (!im) return null; const k = Math.min(w / im.width, h / im.height) * 0.92; g.drawImage(im, (w - im.width * k) / 2, (h - im.height * k) / 2, im.width * k, im.height * k);
      return c.toDataURL('image/png');
    })();
    this.thumbs.set(key, make); return make;
  }
  drawWatson(t) {
    const x = this.x, w = this.watson, { api, manifest, images } = this.rig;
    w.x += (w.tx - w.x) * 0.08;
    const rot = this.currentRotations();
    rot.torso = (rot.torso || 0) + Math.sin(t * 1.7) * 0.5; rot.head = (rot.head || 0) + Math.sin(t * 1.1 + 1) * 0.8;
    const rc = this.rigCanvas, rx = rc.getContext('2d');
    const wcode = this.faces?.char_player; if (wcode !== this.watsonFace) { if (this.watsonFace !== undefined) this.emit('face', { x: w.x }); this.watsonFace = wcode; }
    const info = api.draw(rx, manifest, this.watsonImages(wcode), rot, { background: null, padding: 0.02 });
    const [bx0, by0, bx1, by1] = info.bounds, s = info.scale;
    const figTop = by0 * s + info.ty, figBot = by1 * s + info.ty, drawn = figBot - figTop;
    const k = (FIG_H + 6) / drawn; // same height as the figure cards
    const dw = rc.width * k, dh = rc.height * k, dx = w.x - dw / 2, dy = FLOOR + 8 - figBot * k;
    x.save(); x.shadowColor = 'rgba(15,8,0,.5)'; x.shadowBlur = 14; x.shadowOffsetX = 6; x.shadowOffsetY = 10; x.drawImage(rc, dx, dy, dw, dh); x.restore();
    const map = ([px, py]) => [dx + (px * s + info.tx) * k, dy + (py * s + info.ty) * k];
    this.watsonPts = { shoulder: map(info.pivots.upper_arm_right), head: map(info.pivots.head) };
    this.hits.push({ kind: 'fig', id: 'char_player', r: [w.x - 70, FLOOR + 8 - FIG_H, w.x + 70, FLOOR + 8] });
    // Craft: line of light from his working hand, strength from the craft counter.
    const surge = this.surge ? clamp(1 - (performance.now() - this.surge) / 5000, 0, 1) : 0;
    const touching = [...this.figures.values()].some(f => f.reach && f.arm > 0.85);
    if (touching && !this.touching) this.emit('touch', { x: this.watsonPts.shoulder[0] }); this.touching = touching;
    if (this.craftSeen !== this.state.craft) { this.craftSeen = this.state.craft; this.craftAt = performance.now(); } // Craft shows itself when it changes, then rests
    const lit = Math.max(surge, clamp(1 - (performance.now() - (this.craftAt || 0) - 4000) / 2500, 0, 1));
    const a = clamp(this.state.craft / 8 + surge, 0, 1.6) * lit * (this.state.dim ? 0.25 : 1) * (touching ? 0.2 : 1);
    this.onLight?.(this.quiet ? 0 : a);
    if (a > 0.02) {
      const [hx, hy] = map(this.watson.pose === 'point' ? info.pivots.hand_right : info.pivots.hand_left);
      const lay = this.layoutFor(this.place) || {}; const [wx, wy] = lay.work || [w.x - 150, 140];
      const mx = (hx + wx) / 2, my = Math.min(hy, wy) - 70 + Math.sin(t * 1.6) * 8;
      x.save(); x.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 3; i++) { x.strokeStyle = `rgba(255,226,160,${a * (i ? .12 : .55)})`; x.lineWidth = i ? 3 + i * 3 : 1.2; x.beginPath(); x.moveTo(hx, hy + 24); x.quadraticCurveTo(mx, my, wx, wy); x.stroke(); }
      const u = (t * .35) % 1, bx = (1 - u) * (1 - u) * hx + 2 * (1 - u) * u * mx + u * u * wx, by = (1 - u) * (1 - u) * (hy + 24) + 2 * (1 - u) * u * my + u * u * wy;
      x.fillStyle = `rgba(255,244,210,${a})`; x.beginPath(); x.arc(bx, by, 2.6, 0, TAU); x.fill();
      x.restore();
    }
    // Standing: a paper tag on a string over his head.
    const tag = this.state.tag;
    if (tag) {
      const [hx, hy] = map(info.pivots.head), top = hy - 190, el = this.state.tagFall ? (performance.now() - this.state.tagFall) / 1000 : 0;
      const land = FLOOR + 22 - top, drop = Math.min(land, el * el * 520), lying = drop >= land;
      if (el) { this.once('snip' + this.state.tagFall, 'snip', { x: hx }); this.once('flutter' + this.state.tagFall, 'flutter', { x: hx }); }
      if (lying) this.once('land' + this.state.tagFall, 'tagLand', { x: hx + 70 });
      const rot = el ? Math.sin(el * 7) * .5 * Math.max(0, 1 - el) + 0.1 : Math.sin(t * 1.8) * .06;
      const tx = el ? hx + Math.min(70, el * 60) : hx;
      x.save();
      if (!el) { x.strokeStyle = 'rgba(250,240,220,.75)'; x.lineWidth = 1.3; x.beginPath(); x.moveTo(hx, 0); x.lineTo(hx, top); x.stroke(); }
      else { // the cut string: a loose end above, a spark at the cut
        x.strokeStyle = 'rgba(250,240,220,.75)'; x.lineWidth = 1.3; x.beginPath(); x.moveTo(hx, 0); x.lineTo(hx, top - 40); x.stroke();
        if (el < .35) { x.globalCompositeOperation = 'lighter'; x.fillStyle = `rgba(255,236,190,${1 - el / .35})`; x.beginPath(); x.arc(hx, top - 38, 10, 0, TAU); x.fill(); x.globalCompositeOperation = 'source-over'; }
      }
      x.translate(tx, top + drop); x.rotate(lying ? 0.1 : rot);
      x.font = '700 17px "Courier Prime", monospace'; const tw = x.measureText(tag).width + 28;
      x.fillStyle = '#efe1c4'; x.strokeStyle = '#9b7a4c'; x.lineWidth = 1.5; x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 6;
      x.beginPath(); x.moveTo(-tw / 2 + 10, 0); x.lineTo(tw / 2, 0); x.lineTo(tw / 2, 34); x.lineTo(-tw / 2, 34); x.lineTo(-tw / 2, 10); x.closePath(); x.fill(); x.stroke();
      x.shadowBlur = 0; x.fillStyle = '#2a1c0e'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(tag, 4, 17); x.restore();
    }
  }
}
