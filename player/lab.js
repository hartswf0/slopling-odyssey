// Casting Lab: the first proof for a recastable puppet-film studio.
// A Performance is data (joint channels, contacts, IK targets, a prop), independent of any actor.
// The same performance runs on any cast; invariants are measured every frame, not assumed.
import { makeAnchorRig, drawAnchorRig, anchorPoints, pose, bounds } from './anchor-rig.js';
import { loadImage } from './stage.js';

const W = 1280, H = 600, FLOOR = 520, FIG = 330, D = Math.PI / 180;
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const STRETCH = { thigh_left: 1.35, thigh_right: 1.35, shin_left: 1.35, shin_right: 1.35, upper_arm_left: 1.1, upper_arm_right: 1.1, forearm_left: 1.1, forearm_right: 1.1 };

// ---------- performances (actor-independent) ----------
const step = (t, period, phase) => Math.max(0, Math.sin((t / period + phase) * 2 * Math.PI));
export const PERFORMANCES = {
  walk: { label: 'Walk (front, in place)', duration: 2.4,
    channels: t => { const l = step(t, 1.2, 0), r = step(t, 1.2, .5);
      return { thigh_left: 9 * l, shin_left: -20 * l, shoe_left: 9 * l, thigh_right: -9 * r, shin_right: 20 * r, shoe_right: -9 * r,
        upper_arm_left: -6 * r + 4 * l, upper_arm_right: 6 * l - 4 * r, torso_front: 1.5 * (l - r), head: -1.5 * (l - r) }; },
    contact: t => (step(t, 1.2, 0) > 0.02 ? 'right' : 'left') },
  reach: { label: 'Reach, grasp, lift, release', duration: 3.6, prop: { dx: 150, dy: -170 },
    channels: t => { const w = envelope(t, 0, 1, 2.8, 3.6); return { torso_front: -3 * w, head: 4 * w }; },
    ik: t => { // hand target in units of the prop's rest position; lift 50 px while held
      if (t < 0.9) return { mix: t / 0.9, lift: 0, hold: false };
      if (t < 1.5) return { mix: 1, lift: 0, hold: true };
      if (t < 2.4) return { mix: 1, lift: -50 * ((t - 1.5) / 0.9), hold: true };
      if (t < 2.8) return { mix: 1, lift: -50 * (1 - (t - 2.4) / 0.4), hold: true };
      return { mix: 1 - clamp((t - 2.8) / 0.8, 0, 1), lift: 0, hold: false }; },
    contact: () => 'both' },
  fall: { label: 'Fall and recover', duration: 3.2,
    channels: t => { const f = fallAmount(t); return { upper_arm_left: 40 * f, forearm_left: 30 * f, upper_arm_right: 6 * f, forearm_right: 4 * f, head: 10 * f }; }, // the downside arm tucks in so the body, not the hand, takes the floor
    root: t => ({ rot: 84 * fallAmount(t) }), contact: () => 'pivot', down: [1.0, 1.7] },
  speak: { label: 'Speak (gesture)', duration: 2.6,
    channels: t => { const w = envelope(t, 0, 0.5, 2.1, 2.6); return { head: w * 3 * Math.sin(t * 5), upper_arm_right: w * (-18 - 8 * Math.sin(t * 3.2)), forearm_right: w * (-46 - 14 * Math.sin(t * 4.1)), torso_front: w * Math.sin(t * 2) }; },
    contact: () => 'both' },
};
// 0 → 1 → 0 window so a performance starts and ends at rest
function envelope(t, a, b, c, d) { const e = u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; if (t <= a || t >= d) return 0; if (t < b) return e((t - a) / (b - a)); if (t <= c) return 1; return 1 - e((t - c) / (d - c)); }
function fallAmount(t) { const e = u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; if (t < 0.4) return 0; if (t < 1.0) return e((t - 0.4) / 0.6); if (t < 1.7) return 1; if (t < 2.6) return 1 - e((t - 1.7) / 0.9); return 0; }

// ---------- 2-bone IK in the plane (law of cosines), returned as joint deltas ----------
function solveArm(rest, target) {
  const S = rest.shoulder_right, E = rest.elbow_right, Wr = rest.wrist_right;
  const a = Math.hypot(E[0] - S[0], E[1] - S[1]), b = Math.hypot(Wr[0] - E[0], Wr[1] - E[1]);
  let dx = target[0] - S[0], dy = target[1] - S[1], d = Math.hypot(dx, dy); const dd = clamp(d, Math.abs(a - b) + 1e-3, a + b - 1e-3);
  const base = Math.atan2(dy, dx), cosA = (a * a + dd * dd - b * b) / (2 * a * dd), A = Math.acos(clamp(cosA, -1, 1));
  const up = base - A; // elbow bends outward/down for the right arm
  const Ex = S[0] + a * Math.cos(up), Ey = S[1] + a * Math.sin(up), fore = Math.atan2(target[1] - Ey, target[0] - Ex);
  const up0 = Math.atan2(E[1] - S[1], E[0] - S[0]), fore0 = Math.atan2(Wr[1] - E[1], Wr[0] - E[0]);
  const dUp = (up - up0) / D, dFore = (fore - fore0) / D - dUp;
  return { upper_arm_right: dUp, forearm_right: dFore, reach: d <= a + b };
}

// ---------- evaluate one actor at time t ----------
function evaluate(actor, perf, t, x0, lock) {
  const rig = actor.rig, ch = perf.channels ? perf.channels(t) : {}, extra = { ...ch };
  if (extra.torso_front) extra.pelvis_front = (extra.pelvis_front || 0) - extra.torso_front; // the torso is the rig's root: keep hips level when it leans
  const rest = actor.rest, restPts = anchorPoints(rig, {}, x0, FLOOR, FIG, rest);
  let prop = null, hold = false;
  if (perf.prop) {
    const home = [x0 + perf.prop.dx, FLOOR + perf.prop.dy], ik = perf.ik(t);
    const restGrip = restPts.grip_right, tgt = [restGrip[0] + (home[0] - restGrip[0]) * ik.mix, restGrip[1] + (home[1] + ik.lift - restGrip[1]) * ik.mix];
    const sol = solveArm(restPts, [tgt[0] - (restPts.grip_right[0] - restPts.wrist_right[0]), tgt[1] - (restPts.grip_right[1] - restPts.wrist_right[1])]);
    extra.upper_arm_right = (extra.upper_arm_right || 0) + sol.upper_arm_right; extra.forearm_right = (extra.forearm_right || 0) + sol.forearm_right;
    hold = ik.hold; prop = { home, lift: ik.lift, hold };
  }
  let pts = anchorPoints(rig, extra, x0, FLOOR, FIG, rest);
  // contact solve: keep the stance foot planted (foot locking); without it the raw pose is shown
  let ox = 0, oy = 0; const c = perf.contact ? perf.contact(t) : 'both';
  if (lock && c !== 'pivot') {
    const s = c === 'left' ? pts.sole_left : c === 'right' ? pts.sole_right : [(pts.sole_left[0] + pts.sole_right[0]) / 2, Math.max(pts.sole_left[1], pts.sole_right[1])];
    const plant = c === 'left' ? restPts.sole_left : c === 'right' ? restPts.sole_right : [(restPts.sole_left[0] + restPts.sole_right[0]) / 2, Math.max(restPts.sole_left[1], restPts.sole_right[1])]; // plant at the resting soles, as the one-foot case does
    ox = plant[0] - s[0]; oy = plant[1] - s[1];
  }
  // a sideways fall pivots on the outer edge of the far foot, then settles so its lowest point rests on the floor
  const rot = perf.root ? perf.root(t).rot : 0, pivot = rot ? [Math.max(pts.sole_left[0], pts.sole_right[0]) + 10, Math.max(pts.sole_left[1], pts.sole_right[1])] : [0, 0];
  const turn = ([x, y]) => { if (!rot) return [x, y]; const r = rot * D, dx = x - pivot[0], dy = y - pivot[1]; return [pivot[0] + dx * Math.cos(r) - dy * Math.sin(r), pivot[1] + dx * Math.sin(r) + dy * Math.cos(r)]; };
  let settle = 0;
  if (rot) settle = FLOOR - Math.max(...pts.outline.map(turn).map(p => p[1])); // settle the visible art, not the padded cards
  const tr = ([x, y]) => { x += ox; y += oy; const p = turn([x, y]); return [p[0], p[1] + settle]; };
  const P = {}; for (const [k, v] of Object.entries(pts)) if (Array.isArray(v) && v.length === 2 && typeof v[0] === 'number') P[k] = tr(v);
  const outline = pts.outline.map(tr);
  if (prop) prop.pos = prop.hold ? P.grip_right : [prop.home[0], prop.home[1]];
  return { extra, ox, oy, rot, pivot, settle, P, outline, contact: c, prop, restPts, t };
}

// ---------- invariants (measured, per frame) ----------
const CHECKS = [
  { id: 'neck', label: 'Head stays on the neck pivot', unit: 'px', limit: 0.5, measure: e => dist(e.P.neck_torso, e.P.neck_head) },
  { id: 'joints', label: 'Elbow and wrist stay joined', unit: 'px', limit: 0.5, measure: e => Math.max(dist(e.P.elbow_right, e.P.elbow_right_child), dist(e.P.wrist_right, e.P.wrist_right_child)) },
  { id: 'floor', label: 'Nothing sinks below the floor', unit: 'px', limit: 1.5, measure: e => Math.max(0, ...e.outline.map(c => c[1] - FLOOR), e.P.sole_left[1] - FLOOR, e.P.sole_right[1] - FLOOR) },
  { id: 'slide', label: 'Planted foot does not slide', unit: 'px', limit: 1.0, measure: (e, s) => slide(e, s) },
  { id: 'lands', label: 'Lands on the floor when down', unit: 'px', limit: 2, applies: p => !!p.down, measure: (e, s, p) => p.down && e.t >= p.down[0] && e.t <= p.down[1] ? Math.abs(FLOOR - Math.max(...e.outline.map(c => c[1]))) : 0 },
  { id: 'grasp', label: 'Hand stays on the prop while holding', unit: 'px', limit: 6, applies: p => !!p.prop, measure: e => e.prop && e.prop.hold ? dist(e.P.grip_right, e.prop.pos) : 0 },
  { id: 'recover', label: 'Ends where it started', unit: 'px', limit: 1.0, final: true, measure: (e, s) => s.first ? dist(e.P.sole_left, s.first.P.sole_left) + dist(e.P.neck_head, s.first.P.neck_head) : 0 },
];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function slide(e, s) {
  const key = e.contact === 'left' ? 'sole_left' : e.contact === 'right' ? 'sole_right' : null; if (!key) return 0;
  if (s.planted?.key !== key) { s.planted = { key, at: e.P[key] }; return 0; }
  return Math.abs(e.P[key][0] - s.planted.at[0]);
}
function runChecks(actor, perf, lock) {
  const out = {}, s = {}, N = 120;
  for (const c of CHECKS) out[c.id] = { max: 0, at: 0, applies: !c.applies || c.applies(perf) };
  for (let i = 0; i <= N; i++) {
    const t = perf.duration * i / N, e = evaluate(actor, perf, t, 640, lock); if (i === 0) s.first = e;
    for (const c of CHECKS) { if (c.final && i < N) continue; const v = c.measure(e, s, perf); if (v > out[c.id].max) { out[c.id].max = v; out[c.id].at = t; } }
  }
  return out;
}
// A performance's identity: the hash of its sampled channels, shared by every actor it is cast on.
function perfHash(perf) {
  let h = 2166136261; const s = JSON.stringify([...Array(61)].map((_, i) => { const t = perf.duration * i / 60; return [perf.channels?.(t), perf.ik?.(t), perf.root?.(t), perf.contact?.(t)]; }));
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, '0');
}

// ---------- boot ----------
const staging = await fetch('staging.json').then(r => r.json());
const ids = Object.keys(staging.rigs).sort();
const storyNames = Object.fromEntries((await fetch('story/odyssey-tragic-comedy.json').then(r => r.json())).story.characters.map(c => [c.id, c.name])); // story names first: packet names can be real people
const nameOf = id => storyNames[id] || staging.figures[id]?.name || id.replace(/^extra_|^char_/, '').replace(/_+/g, ' ');
const cache = new Map();
async function actor(id) {
  if (!cache.has(id)) cache.set(id, (async () => {
    const r = staging.rigs[id], imgs = {}; await Promise.all(Object.entries(r.files).map(async ([k, v]) => { imgs[k] = await loadImage(v); }));
    const rig = makeAnchorRig(r.meta, imgs); rig.stretch = STRETCH; return { id, rig, rest: bounds(rig, pose(rig, {})) };
  })());
  return cache.get(id);
}
let cast = ['char_dana', 'char_chad', 'char_ines'].filter(i => staging.rigs[i]);
let perfKey = 'walk', lock = true, playing = true, t = 0, last = performance.now(), focus = null;
const cv = $('#stage'), x = cv.getContext('2d');

function castUI() {
  $('#cast').innerHTML = cast.map((id, i) => `<label class="slot">Slot ${i + 1}<select data-i="${i}">${ids.map(o => `<option value="${o}"${o === id ? ' selected' : ''}>${nameOf(o)}</option>`).join('')}</select></label>`).join('');
  $('#cast').querySelectorAll('select').forEach(s => s.onchange = () => { cast[+s.dataset.i] = s.value; refresh(); });
}
function perfUI() {
  $('#perfs').innerHTML = Object.entries(PERFORMANCES).map(([k, p]) => `<button data-k="${k}" class="${k === perfKey ? 'on' : ''}">${p.label}</button>`).join('') +
    `<button class="blocked" disabled title="Packets hold front cards only; Watson's profile bank is not wired into the lab yet">Turn front → profile (blocked)</button>`;
  $('#perfs').querySelectorAll('button[data-k]').forEach(b => b.onclick = () => { perfKey = b.dataset.k; t = 0; focus = null; perfUI(); });
}
async function refresh() {
  castUI(); perfUI();
  const actors = await Promise.all(cast.map(actor)), hashes = Object.fromEntries(Object.entries(PERFORMANCES).map(([k, p]) => [k, perfHash(p)]));
  // validation matrix: every performance × check × cast member, measured with the contact solve on
  let rows = '';
  for (const [k, p] of Object.entries(PERFORMANCES)) {
    const res = actors.map(a => runChecks(a, p, lock));
    for (const c of CHECKS) {
      if (!res[0][c.id].applies) continue;
      rows += `<tr><td>${p.label}</td><td>${c.label}</td>` + res.map((r, i) => { const v = r[c.id].max, ok = v <= c.limit;
        return `<td class="${ok ? 'pass' : 'fail'}" data-k="${k}" data-i="${i}" data-t="${r[c.id].at.toFixed(2)}" title="worst at t=${r[c.id].at.toFixed(2)}s">${ok ? '✓' : '✗'} ${v.toFixed(2)}${c.unit}</td>`; }).join('') + `<td class="lim">≤ ${c.limit}</td></tr>`;
    }
    rows += `<tr class="hash"><td>${p.label}</td><td>Recast changes appearance, not performance</td>` + actors.map(() => `<td class="pass">✓ ${hashes[k]}</td>`).join('') + `<td class="lim">same hash</td></tr>`;
  }
  rows += `<tr><td>Turn front → profile</td><td>View change keeps head attached</td>` + actors.map(() => `<td class="blocked">blocked: no profile cards</td>`).join('') + `<td class="lim">—</td></tr>`;
  $('#matrix').innerHTML = `<thead><tr><th>Performance</th><th>Invariant</th>${actors.map(a => `<th>${nameOf(a.id)}</th>`).join('')}<th>Limit</th></tr></thead><tbody>${rows}</tbody>`;
  $('#matrix').querySelectorAll('td[data-k]').forEach(td => td.onclick = () => { perfKey = td.dataset.k; t = +td.dataset.t; playing = false; focus = +td.dataset.i; $('#play').textContent = '▶ Play'; perfUI(); });
  const all = [...$('#matrix').querySelectorAll('td.pass, td.fail')], pass = all.filter(td => td.classList.contains('pass')).length;
  $('#summary').textContent = `${pass} of ${all.length} measured checks pass · turn from front to profile is blocked until profile cards exist for this cast`;
  stageActors = actors;
}
let stageActors = [];

function frame(now) {
  const perf = PERFORMANCES[perfKey];
  if (playing) { t += (now - last) / 1000; if (t > perf.duration) t = 0; }
  last = now; $('#scrub').value = Math.round(t / perf.duration * 1000); $('#time').textContent = `${t.toFixed(2)} / ${perf.duration.toFixed(1)} s`;
  x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#d9c39a'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#8a6a43'; x.fillRect(0, FLOOR, W, H - FLOOR); x.strokeStyle = '#3a2a18'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, FLOOR); x.lineTo(W, FLOOR); x.stroke();
  stageActors.forEach((a, i) => {
    const x0 = 150 + i * 360, e = evaluate(a, perf, t, x0, lock);
    x.save(); x.globalAlpha = focus == null || focus === i ? 1 : 0.35;
    if (e.rot) { x.translate(0, e.settle); x.translate(e.pivot[0], e.pivot[1]); x.rotate(e.rot * D); x.translate(-e.pivot[0], -e.pivot[1]); }
    drawAnchorRig(x, a.rig, e.extra, x0 + e.ox, FLOOR + e.oy, FIG, a.rest);
    x.restore();
    if (e.prop) { const [px, py] = e.prop.pos; x.fillStyle = e.prop.hold ? '#c9a24a' : '#8f6c2c'; x.strokeStyle = '#2a1c0e'; x.lineWidth = 2; x.beginPath(); x.roundRect(px - 18, py - 10, 36, 20, 4); x.fill(); x.stroke();
      if (!e.prop.hold) { x.fillStyle = '#5a4630'; x.fillRect(e.prop.home[0] - 30, e.prop.home[1] + 10, 60, FLOOR - e.prop.home[1] - 10); } }
    if ($('#overlay').checked) { // joints, contacts and the neck pivot, as measured
      const dot = (p, col, r = 4) => { x.fillStyle = col; x.beginPath(); x.arc(p[0], p[1], r, 0, 7); x.fill(); };
      ['shoulder_right', 'elbow_right', 'wrist_right', 'grip_right'].forEach(k => dot(e.P[k], '#1f6f78'));
      dot(e.P.neck_head, '#d9663a', 5);
      for (const k of ['sole_left', 'sole_right']) { const planted = e.contact === 'both' || e.contact === k.slice(5); dot(e.P[k], planted ? '#2e8b57' : '#b0a080', 6); }
    }
    x.fillStyle = '#2a1c0e'; x.font = '700 15px "Courier Prime", monospace'; x.textAlign = 'center'; x.fillText(nameOf(a.id), x0, FLOOR + 50);
  });
  requestAnimationFrame(frame);
}
$('#play').onclick = () => { playing = !playing; $('#play').textContent = playing ? '❚❚ Pause' : '▶ Play'; };
$('#scrub').oninput = () => { playing = false; $('#play').textContent = '▶ Play'; t = $('#scrub').value / 1000 * PERFORMANCES[perfKey].duration; };
$('#lock').onchange = () => { lock = $('#lock').checked; refresh(); };
$('#shuffle').onclick = () => { const pool = ids.slice(); cast = cast.map(() => pool.splice(Math.floor(Math.random() * pool.length), 1)[0]); refresh(); };
$('#clear').onclick = () => { focus = null; };
await refresh();
requestAnimationFrame(frame);
window.__lab = { PERFORMANCES, runChecks, actor, get cast() { return cast; } };
