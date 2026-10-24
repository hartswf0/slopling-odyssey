import { makeAnchorRig, drawAnchorRig } from './anchor-rig.js';
// Cardboard toy-theatre stage for the ASAPS player.
// Everyone but Watson is a single scale-matched figure card on a wire (Pollock-style
// toy theatre). Watson is the one jointed puppet: the working 15-card front rig.
// State the ladder cannot see is drawn: Craft as a line of light, Standing as a tag.

const W = 1280, H = 720, FLOOR = 612, FIG_H = 372;
// The scale-matched cards assemble squat (short legs, big heads). Lengthen limb cards along
// their own axis at the recorded anchors; see player/tests/proportion-test.html.
const STRETCH = { thigh_left: 1.35, thigh_right: 1.35, shin_left: 1.35, shin_right: 1.35, upper_arm_left: 1.1, upper_arm_right: 1.1, forearm_left: 1.1, forearm_right: 1.1 };
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const imgCache = new Map();
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
    this.staging = staging; this.rig = rig; // {api, manifest, images}
    this.place = null; this.cast = []; this.speaker = null; this.motifs = [];
    this.figures = new Map(); // id -> {img, x, tx, a, ta, lean}
    this.watson = { x: 430, tx: 430, a: 1, pose: 'idle', poseT: 0, from: {}, to: {} };
    this.state = { craft: 0, standing: 0, tag: null, tagFall: 0, recognition: 0 };
    this.setImgs = new Map(); this.t0 = performance.now(); this.lastSwitch = 0;
    this.rigCanvas = document.createElement('canvas'); this.rigCanvas.width = 340; this.rigCanvas.height = 520;
    this.rigs = {}; this.workTags = 0; this.surge = 0;
    for (const [id, r] of Object.entries(staging.rigs || {})) {
      Promise.all(Object.entries(r.files).map(async ([k, v]) => [k, await loadImage(v)])).then(es => { const rig = makeAnchorRig(r.meta, Object.fromEntries(es)); if (rig.ok) this.rigs[id] = rig; });
    }
    this.onFrame = this.onFrame.bind(this); requestAnimationFrame(this.onFrame);
  }
  layoutFor(place) { const set = this.staging.sets[place]; if (!set) return null; return LAYOUTS[place] || this.staging.layouts?.[place] || autoLayout(set); }
  async setScene(beatId) {
    const b = this.staging.beats[beatId]; if (!b) return;
    if (b.place !== this.place) {
      this.place = b.place; this.lastSwitch = performance.now(); this.treeT = 0; this.workTags = 0; this.state.dim = false;
      for (const f of this.figures.values()) { f.held = false; f.arm = 0; f.front = false; f.flip = false; f.ttilt = 0; f.slow = false; }
      const set = this.staging.sets[b.place];
      if (set) await Promise.all(set.pieces.map(async p => this.setImgs.set(p.id, await loadImage(p.src))));
    }
    this.motifs = b.motifs || [];
    const want = b.cast.filter(c => c !== 'char_player');
    this.hasWatson = b.cast.includes('char_player');
    const lay = this.layoutFor(this.place) || { slots: [430, 780, 1000, 1150] };
    this.watson.tx = lay.slots[0];
    // exits
    for (const [id, f] of this.figures) if (!want.includes(id) && !this.motifs.includes(id)) { f.tx = f.x > 640 ? W + 260 : -260; f.leaving = true; }
    // entrances
    const all = [...want, ...this.motifs];
    for (const [i, id] of all.entries()) {
      const fig = this.staging.figures[id]; if (!fig) continue;
      const img = await loadImage(fig.src);
      const tx = this.motifs.includes(id) ? (i % 2 ? 1060 : 180) : lay.slots[Math.min(i + 1, lay.slots.length - 1)] + (i >= lay.slots.length - 1 ? (i - lay.slots.length + 2) * 120 : 0);
      const f = this.figures.get(id);
      if (f && !f.leaving) { if (!f.held) f.tx = tx; continue; }
      this.figures.set(id, { id, img, w: fig.w, h: fig.h, x: tx > 640 ? W + 260 : -260, tx, lean: 0, motif: this.motifs.includes(id), leaving: false, arm: 0, armA: 74 });
      this.onEnter && this.onEnter();
    }
  }
  setSpeaker(id) { this.speaker = id; }
  // Story props: per-beat placements from props.json, plus props a stage cue brings on.
  async setProps(beatId) {
    const P = this.staging.props; if (!P) return;
    const list = (P.beats[beatId] || []).map(p => ({ key: p[0], at: p.slice(1, 5), lift: p[5] === 'lift' }));
    for (const p of list) p.img = await loadImage(P.names[p.key]);
    const prevKeys = new Set((this.props || []).map(p => p.key));
    for (const p of list) p.born = prevKeys.has(p.key) ? 0 : performance.now();
    this.props = list.concat((this.props || []).filter(p => p.cue && this.place === p.place));
  }
  async cueProp(name) {
    const P = this.staging.props, c = P?.cues?.[name]; if (!c || (this.props || []).some(p => p.key === c[0])) return;
    const img = await loadImage(P.names[c[0]]); (this.props ||= []).push({ key: c[0], at: c.slice(1, 5), img, cue: true, place: this.place, born: performance.now() });
  }
  drawProps(layer, t) {
    for (const p of this.props || []) {
      const [cx, by, h, ly] = p.at; if (ly !== layer || !p.img) continue;
      const u = p.born ? clamp((performance.now() - p.born) / 500, 0, 1) : 1, w = h * p.img.width / p.img.height;
      const lift = p.lift ? 26 + Math.sin(t * 2.4) * 4 : 0, x = this.x;
      x.save(); x.globalAlpha = u; x.translate(cx, by - lift - (1 - u) * 40);
      if (p.lift) { x.globalCompositeOperation = 'source-over'; x.shadowColor = 'rgba(255,230,160,.8)'; x.shadowBlur = 22; }
      else { x.shadowColor = 'rgba(20,10,0,.45)'; x.shadowBlur = 10; x.shadowOffsetY = 6; }
      x.drawImage(p.img, -w / 2, -h, w, h); x.restore();
    }
  }
  // Stage cues: physical events the story text names, performed by the cards.
  cue(name, who = 'char_father') {
    const f = this.figures.get(who), w = this.watson;
    if (name === 'nameTrees') { this.treeT = performance.now(); this.setWatsonPose('point'); }
    if (name === 'nameWork') { this.workTags = performance.now(); this.surge = performance.now(); this.setWatsonPose('point'); }
    // The father crosses to his son; his near arm rises until the hand rests on Watson's shoulder.
    if (name === 'approach' && f) { f.tx = w.tx + 205; f.slow = true; f.front = true; f.held = true; f.reach = true; this.setWatsonPose('turn'); }
    if (name === 'hug' && f) { f.tx = w.tx + 150; f.slow = true; f.front = true; f.held = true; f.reach = true; this.setWatsonPose('turn'); }
    if (name === 'cutTag') this.state.tagFall = performance.now();
    if (name === 'turnAway' && f) { f.tx = 1130; f.slow = true; f.flip = true; f.front = false; f.held = true; f.ttilt = 0; f.reach = false; }
    if (name === 'still') { this.setWatsonPose('low'); if (f) { f.ttilt = 0; f.front = false; } this.state.dim = true; }
  }
  drawTreeTags(lay, t) {
    if (!this.treeT || !lay.labels) return; const x = this.x, el = (performance.now() - this.treeT) / 1000;
    Object.entries(lay.labels).forEach(([id, txt], i) => {
      const p = lay.pieces.find(q => q[0] === id); if (!p) return; const u = clamp((el - i * 1.1) / .6, 0, 1); if (!u) return;
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
      x.save(); x.globalAlpha = u; x.translate(cx, cy - (1 - u) * 30); x.rotate(Math.sin(t * 2 + i) * .08);
      x.strokeStyle = 'rgba(70,50,30,.8)'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, -22); x.lineTo(0, 0); x.stroke();
      x.font = 'italic 13px "Courier Prime", monospace'; const tw = x.measureText(txt).width + 18;
      x.fillStyle = '#f6ecd6'; x.strokeStyle = '#9b7a4c'; x.beginPath(); x.rect(-tw / 2, 0, tw, 22); x.fill(); x.stroke();
      x.fillStyle = '#3a2410'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, 11); x.restore();
    });
  }
  setWatsonPose(pose) { if (pose === this.watson.pose) return; this.watson.from = this.currentRotations(); this.watson.pose = pose; this.watson.poseT = performance.now(); }
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
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
    const lay = this.layoutFor(this.place) || { wash: ['#c9a777', '#6e5236'], pieces: [] };
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
      const speaking = this.speaker === id, rig = this.rigs[id];
      const h = f.motif ? 330 : FIG_H, w = h * f.w / f.h, bob = speaking ? Math.sin(t * 9) * 1.6 : 0;
      const lift = f.reach ? 0 : f.lean * 12, tilt = f.reach ? 0 : (f.x < 640 ? 1 : -1) * f.lean * 0.04 + (f.tilt || 0);
      x.save(); x.translate(f.x, FLOOR + 8 - lift + bob); x.rotate(tilt);
      x.strokeStyle = 'rgba(30,22,14,.55)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, -4); x.lineTo(f.x < 640 ? -160 : 160, 40); x.stroke();
      x.shadowColor = 'rgba(15,8,0,.5)'; x.shadowBlur = 14; x.shadowOffsetX = 6; x.shadowOffsetY = 10;
      if (f.flip) x.scale(-1, 1);
      if (rig) {
        // jointed father: his screen-left arm rises toward Watson when reaching
        f.arm += ((f.reach ? 1 : 0) - f.arm) * 0.04;
        const a = f.arm, g = speaking ? 1 : 0; f.talk = (f.talk || 0) + (g - (f.talk || 0)) * 0.06;
        const extra = { upper_arm_left: a * f.armA, forearm_left: a * 24, hand_left_relaxed: -a * 12,
          upper_arm_right: -f.talk * (14 + Math.sin(t * 2.3) * 6), forearm_right: -f.talk * (38 + Math.sin(t * 3.1) * 10), head: Math.sin(t * 1.3 + f.x) * 1.2 };
        rig.stretch = STRETCH;
        const pts = drawAnchorRig(x, rig, extra, 0, 0, h + 6);
        f.hand = [f.x + (f.flip ? -1 : 1) * pts.hand_left[0], FLOOR + 8 + pts.hand_left[1]];
      } else if (f.img) x.drawImage(f.img, -w / 2, -h, w, h);
      x.restore();
      // contact: steer so the hand lands on Watson's near shoulder, and hold it there
      if (rig && f.reach && this.watsonPts && f.arm > 0.6) {
        const [sx, sy] = this.watsonPts.shoulder, [hx, hy] = f.hand;
        f.tx += (sx + 6 - hx) * 0.08; f.armA = clamp(f.armA + (hy - (sy - 26)) * 0.04, 40, 115);
      }
    };
    for (const [id, f] of this.figures) {
      f.x += (f.tx - f.x) * (f.slow ? 0.025 : 0.09); f.tilt = (f.tilt || 0) + ((f.ttilt || 0) - (f.tilt || 0)) * 0.05;
      if (f.leaving && Math.abs(f.x - f.tx) < 4) { this.figures.delete(id); continue; }
      const speaking = this.speaker === id;
      f.lean += ((speaking ? 1 : 0) - f.lean) * 0.12;
      if (!f.front) drawFig(id, f);
    }
    // Watson
    if (this.hasWatson && this.rig) this.drawWatson(t);
    for (const [id, f] of this.figures) if (f.front) drawFig(id, f);
    this.drawTreeTags(lay, t); this.drawWorkTags(lay, t);
    draw('front'); this.drawProps('front', t);
    if (lay.auto) { x.fillStyle = 'rgba(30,20,10,.55)'; x.font = '12px "Courier Prime", monospace'; x.fillText('placeholder set layout', 14, 22); }
    // grain/vignette
    const v = x.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .95); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.38)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
    // scene change wipe
    const since = now - this.lastSwitch; if (since < 420) { x.fillStyle = `rgba(18,12,6,${1 - since / 420})`; x.fillRect(0, 0, W, H); }
    requestAnimationFrame(this.onFrame);
  }
  drawWatson(t) {
    const x = this.x, w = this.watson, { api, manifest, images } = this.rig;
    w.x += (w.tx - w.x) * 0.08;
    const rot = this.currentRotations();
    rot.torso = (rot.torso || 0) + Math.sin(t * 1.7) * 0.5; rot.head = (rot.head || 0) + Math.sin(t * 1.1 + 1) * 0.8;
    const rc = this.rigCanvas, rx = rc.getContext('2d');
    const info = api.draw(rx, manifest, images, rot, { background: null, padding: 0.02 });
    const [bx0, by0, bx1, by1] = info.bounds, s = info.scale;
    const figTop = by0 * s + info.ty, figBot = by1 * s + info.ty, drawn = figBot - figTop;
    const k = (FIG_H + 6) / drawn; // same height as the figure cards
    const dw = rc.width * k, dh = rc.height * k, dx = w.x - dw / 2, dy = FLOOR + 8 - figBot * k;
    x.save(); x.shadowColor = 'rgba(15,8,0,.5)'; x.shadowBlur = 14; x.shadowOffsetX = 6; x.shadowOffsetY = 10; x.drawImage(rc, dx, dy, dw, dh); x.restore();
    const map = ([px, py]) => [dx + (px * s + info.tx) * k, dy + (py * s + info.ty) * k];
    this.watsonPts = { shoulder: map(info.pivots.upper_arm_right), head: map(info.pivots.head) };
    // Craft: line of light from his working hand, strength from the craft counter.
    const surge = this.surge ? clamp(1 - (performance.now() - this.surge) / 5000, 0, 1) : 0;
    const touching = [...this.figures.values()].some(f => f.reach && f.arm > 0.5);
    const a = clamp(this.state.craft / 8 + surge, 0, 1.6) * (this.state.dim ? 0.25 : 1) * (touching ? 0.2 : 1);
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
      const land = FLOOR + 22 - top, drop = Math.min(land, el * el * 520), lying = drop >= land, rot = el ? Math.sin(el * 7) * .5 * Math.max(0, 1 - el) + 0.1 : Math.sin(t * 1.8) * .06;
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
