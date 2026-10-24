// Assemble a scale-matched character from its loose cards at the recorded anchors
// (registry/packets/<actor>/historical_scale_metadata.json), then allow extra
// rotation at a joint. Same contract as the metadata's instructions: native sizes,
// one common scale, rotate and connect at anchors, resize the whole figure as a group.

const CHAIN = [
  // part, parent, own anchor, parent anchor
  ['torso_front', null, 'waist', null],
  ['pelvis_front', 'torso_front', 'waist', 'waist'],
  ['head', 'torso_front', 'neck', 'neck'],
  ['upper_arm_left', 'torso_front', 'proximal', 'shoulder_left'],
  ['forearm_left', 'upper_arm_left', 'proximal', 'distal'],
  ['hand_left_relaxed', 'forearm_left', 'wrist', 'distal'],
  ['upper_arm_right', 'torso_front', 'proximal', 'shoulder_right'],
  ['forearm_right', 'upper_arm_right', 'proximal', 'distal'],
  ['hand_right_relaxed', 'forearm_right', 'wrist', 'distal'],
  ['thigh_left', 'pelvis_front', 'proximal', 'hip_left'],
  ['shin_left', 'thigh_left', 'proximal', 'distal'],
  ['shoe_left', 'shin_left', 'ankle', 'distal'],
  ['thigh_right', 'pelvis_front', 'proximal', 'hip_right'],
  ['shin_right', 'thigh_right', 'proximal', 'distal'],
  ['shoe_right', 'shin_right', 'ankle', 'distal'],
];
const ORDER = ['shoe_left', 'shoe_right', 'shin_left', 'shin_right', 'thigh_left', 'thigh_right', 'pelvis_front', 'torso_front', 'head',
  'upper_arm_left', 'upper_arm_right', 'forearm_left', 'forearm_right', 'hand_left_relaxed', 'hand_right_relaxed'];
const D = Math.PI / 180;

function mul(a, b) { return [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]]; }
function pt(m, [x, y]) { return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; }

// meta: historical_scale_metadata.json; images: {part: HTMLImageElement}
export function makeAnchorRig(meta, images) {
  const parts = Object.fromEntries(meta.parts.filter(p => !p.file.includes('/')).map(p => [p.part, p]));
  images = { ...images };
  for (const side of ['left', 'right']) { // packets name the default hand "relaxed" or "open"
    const k = 'hand_' + side + '_relaxed', alt = 'hand_' + side + '_open';
    if (!parts[k] && parts[alt]) { parts[k] = parts[alt]; images[k] = images[alt]; }
  }
  return { parts, images, ok: CHAIN.every(([id]) => parts[id] && images[id]) };
}

// Matrices for each part in figure space (torso waist at origin). extra: {part: degrees}
export function pose(rig, extra = {}) {
  const M = {};
  for (const [id, parent, own, pa] of CHAIN) {
    const p = rig.parts[id], rot = (p.assembly_rotation_deg + (extra[id] || 0)) * D, [ax, ay] = p.anchors_px[own];
    // place own anchor at origin, rotate, then move to the parent's anchor
    const sy = (rig.stretch && rig.stretch[id]) || 1; // optional length factor along the card's own vertical axis
    const local = mul([Math.cos(rot), Math.sin(rot), -Math.sin(rot), Math.cos(rot), 0, 0], [1, 0, 0, sy, -ax, -ay * sy]);
    const at = parent ? pt(M[parent], rig.parts[parent].anchors_px[pa]) : [0, 0];
    // inherited rotation: rotate with the parent chain's added rotation
    const inh = parent ? inherited(rig, parent, extra) : 0;
    M[id] = mul([Math.cos(inh), Math.sin(inh), -Math.sin(inh), Math.cos(inh), at[0], at[1]], local);
  }
  return M;
}
function inherited(rig, id, extra) {
  let r = 0; for (let cur = id; cur;) { const c = CHAIN.find(x => x[0] === cur); r += (extra[cur] || 0) * D; cur = c[1]; }
  return r;
}

export function bounds(rig, M) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const id of ORDER) { const p = rig.parts[id]; for (const c of [[0, 0], [p.canvas_width_px, 0], [0, p.canvas_height_px], [p.canvas_width_px, p.canvas_height_px]]) { const [x, y] = pt(M[id], c); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } }
  return [x0, y0, x1, y1];
}

// World positions of the joints and contacts, without drawing (used by the casting lab's invariant checks).
export function anchorPoints(rig, extra, cx, footY, h, rest) {
  const M = pose(rig, extra), R = rest || bounds(rig, pose(rig, {})), k = h / (R[3] - R[1]);
  const w = ([x, y]) => [cx + (x - (R[0] + R[2]) / 2) * k, footY + (y - R[3]) * k];
  const a = (part, anchor) => w(pt(M[part], rig.parts[part].anchors_px[anchor]));
  return {
    neck_torso: a('torso_front', 'neck'), neck_head: a('head', 'neck'),
    shoulder_right: a('torso_front', 'shoulder_right'), elbow_right: a('upper_arm_right', 'distal'), wrist_right: a('forearm_right', 'distal'),
    elbow_right_child: a('forearm_right', 'proximal'), wrist_right_child: a('hand_right_relaxed', 'wrist'),
    grip_right: a('hand_right_relaxed', 'grip'), sole_left: a('shoe_left', 'sole'), sole_right: a('shoe_right', 'sole'),
    k, bounds: bounds(rig, M).map((v, i) => i % 2 ? footY + (v - R[3]) * k : cx + (v - (R[0] + R[2]) / 2) * k),
    outline: ORDER.flatMap(id => hull(rig, id).map(c => w(pt(M[id], c)))), // the visible art, not the padded card
  };
}

// Convex hull of a card's opaque pixels (alpha > 50%), in card pixels; cached on the rig. Browser only.
function hull(rig, id) {
  rig.hulls ||= {}; if (rig.hulls[id]) return rig.hulls[id];
  const p = rig.parts[id], W = p.canvas_width_px, H = p.canvas_height_px, c = document.createElement('canvas');
  c.width = W; c.height = H; const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(rig.images[id], 0, 0, W, H);
  const a = g.getImageData(0, 0, W, H).data, pts = [];
  for (let y = 0; y < H; y += 2) { let l = -1, r = -1; for (let x = 0; x < W; x++) if (a[(y * W + x) * 4 + 3] > 128) { if (l < 0) l = x; r = x; } if (l >= 0) pts.push([l, y], [r + 1, y + 1]); }
  pts.sort((u, v) => u[0] - v[0] || u[1] - v[1]);
  const cross = (o, u, v) => (u[0] - o[0]) * (v[1] - o[1]) - (u[1] - o[1]) * (v[0] - o[0]), lo = [], hi = [];
  for (const q of pts) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of pts.slice().reverse()) { while (hi.length > 1 && cross(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
  return (rig.hulls[id] = lo.slice(0, -1).concat(hi.slice(0, -1)));
}

// Draw with feet on footY, total height h at rest, centred on cx. Returns world positions of named anchors.
export function drawAnchorRig(ctx, rig, extra, cx, footY, h, rest) {
  const M = pose(rig, extra), R = rest || bounds(rig, pose(rig, {})), k = h / (R[3] - R[1]);
  ctx.save(); ctx.translate(cx, footY); ctx.scale(k, k); ctx.translate(-(R[0] + R[2]) / 2, -R[3]);
  for (const id of ORDER) { const m = M[id]; ctx.save(); ctx.transform(...m); ctx.drawImage(rig.images[id], 0, 0, rig.parts[id].canvas_width_px, rig.parts[id].canvas_height_px); ctx.restore(); }
  ctx.restore();
  const w = ([x, y]) => [cx + (x - (R[0] + R[2]) / 2) * k, footY + (y - R[3]) * k];
  return { hand_right: w(pt(M.hand_right_relaxed, rig.parts.hand_right_relaxed.anchors_px.grip)), hand_left: w(pt(M.hand_left_relaxed, rig.parts.hand_left_relaxed.anchors_px.grip)), shoulder_right: w(pt(M.torso_front, rig.parts.torso_front.anchors_px.shoulder_right)) };
}
