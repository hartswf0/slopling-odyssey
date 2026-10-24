/* Watson front-view pose study. Pure Canvas 2D renderer, shared by the HTML and proof renders. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WatsonRig = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const IDENTITY = [1, 0, 0, 1, 0, 0];
  const PRESETS = {
    neutral: { label: 'Neutral', note: 'Original front-view arrangement', rotations: {} },
    arm_bend: {
      label: 'Bend arm', note: 'Viewer-left arm · small elbow study',
      rotations: { upper_arm_left: -4, forearm_left: -48, hand_left: 8 }
    },
    foot_lift: {
      label: 'Lift foot', note: 'Viewer-right leg · slight foot lift',
      rotations: { thigh_right: -20, shin_right: 40, boot_right: -20 }
    }
  };
  const EXPLODE = {
    head: [0, -115], torso: [0, -25], pelvis: [0, 45],
    upper_arm_left: [-100, -40], forearm_left: [-150, 30], hand_left: [-190, 125],
    upper_arm_right: [100, -40], forearm_right: [150, 30], hand_right: [190, 125],
    thigh_left: [-65, 80], shin_left: [-110, 180], boot_left: [-150, 290],
    thigh_right: [65, 80], shin_right: [110, 180], boot_right: [150, 290]
  };
  const frameCache = new WeakMap();

  function multiply(a, b) {
    return [
      a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
      a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]
    ];
  }
  function transformPoint(m, p) {
    return [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
  }
  function rotationAt(pivot, degrees) {
    const r = degrees * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    const [x, y] = pivot;
    return [c, s, -s, c, x - c * x + s * y, y - s * x - c * y];
  }
  function validateManifest(manifest) {
    if (!manifest || !Array.isArray(manifest.parts) || !manifest.parts.length) throw new Error('Missing rig parts.');
    const byId = new Map();
    for (const p of manifest.parts) {
      if (byId.has(p.id)) throw new Error('Duplicate part: ' + p.id);
      if (!Array.isArray(p.rect) || p.rect.length !== 4 || p.rect.some(v => !Number.isFinite(v)) || p.rect[2] <= 0 || p.rect[3] <= 0) throw new Error('Invalid part rectangle: ' + p.id);
      if (!Array.isArray(p.pivot) || p.pivot.length !== 2 || p.pivot.some(v => !Number.isFinite(v))) throw new Error('Invalid pivot: ' + p.id);
      byId.set(p.id, p);
    }
    for (const p of manifest.parts) {
      if (p.parent && !byId.has(p.parent)) throw new Error('Missing parent: ' + p.id);
      const seen = new Set([p.id]);
      let parent = p.parent;
      while (parent) {
        if (seen.has(parent)) throw new Error('Cyclic rig parent: ' + p.id);
        seen.add(parent); parent = byId.get(parent).parent;
      }
    }
    return byId;
  }
  function poseFor(preset, amount) {
    const record = PRESETS[preset] || PRESETS.neutral;
    const t = Math.max(0, Math.min(1, Number(amount) || 0));
    return Object.fromEntries(Object.entries(record.rotations).map(([id, degrees]) => [id, degrees * t]));
  }
  function computeTransforms(manifest, rotations) {
    const byId = new Map(manifest.parts.map(p => [p.id, p]));
    const matrices = {};
    function visit(id) {
      if (matrices[id]) return matrices[id];
      const p = byId.get(id), parent = p.parent ? visit(p.parent) : IDENTITY;
      return (matrices[id] = multiply(parent, rotationAt(p.pivot, Number(rotations[id]) || 0)));
    }
    manifest.parts.forEach(p => visit(p.id));
    return matrices;
  }
  function displayMatrix(part, matrices, view) {
    const m = matrices[part.id].slice();
    if (view === 'exploded') {
      const shift = EXPLODE[part.id] || [0, 0];
      m[4] += shift[0]; m[5] += shift[1];
    }
    return m;
  }
  function partCorners(p) {
    const [x, y, w, h] = p.rect;
    return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  }
  function extent(manifest, rotations, view) {
    const matrices = computeTransforms(manifest, rotations);
    const points = manifest.parts.flatMap(p => partCorners(p).map(xy => transformPoint(displayMatrix(p, matrices, view), xy)));
    return [Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1])), Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1]))];
  }
  function frameBounds(manifest, view) {
    let cached = frameCache.get(manifest);
    if (!cached) {
      const frames = Object.keys(PRESETS).flatMap(name => [0, .5, 1].map(t => extent(manifest, poseFor(name, t), 'assembled')));
      const union = [Math.min(...frames.map(b => b[0])), Math.min(...frames.map(b => b[1])), Math.max(...frames.map(b => b[2])), Math.max(...frames.map(b => b[3]))];
      const exploded = extent(manifest, {}, 'exploded');
      cached = { assembled: union, joints: union, exploded };
      frameCache.set(manifest, cached);
    }
    return cached[view] || cached.assembled;
  }
  function layerFor(p, rotations) {
    // The forearm and hand cross in front of the jacket. Shoulder tabs stay behind
    // the torso, which owns the visible shoulder brads.
    const leftAcross = ((rotations.upper_arm_left || 0) + (rotations.forearm_left || 0)) < -6;
    const rightAcross = ((rotations.upper_arm_right || 0) + (rotations.forearm_right || 0)) > 6;
    if ((leftAcross && /_left$/.test(p.id)) || (rightAcross && /_right$/.test(p.id))) {
      if (p.id.startsWith('forearm_')) return 66;
      if (p.id.startsWith('hand_')) return 76;
    }
    return Number(p.layer) || 0;
  }
  function draw(ctx, manifest, images, rotations, options) {
    options = options || {};
    const width = options.width || ctx.canvas.width, height = options.height || ctx.canvas.height;
    const view = options.view || 'assembled';
    const actualPose = view === 'exploded' ? {} : (rotations || {});
    const matrices = computeTransforms(manifest, actualPose);
    const bounds = options.bounds || frameBounds(manifest, view);
    const pad = options.padding === undefined ? .035 : options.padding;
    const scale = Math.min(width * (1 - 2 * pad) / (bounds[2] - bounds[0]), height * (1 - 2 * pad) / (bounds[3] - bounds[1]));
    const tx = (width - (bounds[0] + bounds[2]) * scale) / 2;
    const ty = (height - (bounds[1] + bounds[3]) * scale) / 2;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    if (options.background !== null) {
      ctx.fillStyle = options.background || '#f5f1e8'; ctx.fillRect(0, 0, width, height);
    }
    ctx.setTransform(scale, 0, 0, scale, tx, ty);
    ctx.imageSmoothingEnabled = true;
    // 'medium' keeps a 1:1 neutral sprite exact in both browsers and node-canvas.
    // The Skia 'high' filter softens even a unit-scale draw, obscuring source comparison.
    ctx.imageSmoothingQuality = 'medium';

    const ordered = manifest.parts.slice().sort((a, b) => layerFor(a, actualPose) - layerFor(b, actualPose));
    for (const p of ordered) {
      const bitmap = images[p.id];
      if (!bitmap) throw new Error('Missing image: ' + p.id);
      ctx.save();
      ctx.transform(...displayMatrix(p, matrices, view));
      // rect size is the source crop size. No per-part rescaling, skew, or replacement art.
      ctx.drawImage(bitmap, p.rect[0], p.rect[1], p.rect[2], p.rect[3]);
      ctx.restore();
    }

    const pivots = Object.fromEntries(manifest.parts.map(p => [p.id, transformPoint(displayMatrix(p, matrices, view), p.pivot)]));
    if (view === 'joints') {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(15,85,92,.77)'; ctx.lineWidth = 4 / Math.max(scale, .6);
      ctx.setLineDash([11, 9]);
      for (const p of manifest.parts) {
        if (!p.parent) continue;
        const a = pivots[p.parent], b = pivots[p.id];
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
      ctx.setLineDash([]);
      for (const p of manifest.parts) {
        const xy = pivots[p.id];
        ctx.beginPath(); ctx.arc(xy[0], xy[1], 11, 0, Math.PI * 2);
        ctx.fillStyle = '#fff9e6'; ctx.fill();
        ctx.strokeStyle = '#115c61'; ctx.lineWidth = 3.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(xy[0], xy[1], 3.7, 0, Math.PI * 2);
        ctx.fillStyle = '#115c61'; ctx.fill();
      }
    }
    ctx.restore();
    return { matrices, pivots, bounds: bounds.slice(), scale, tx, ty, drawOrder: ordered.map(p => p.id) };
  }
  function render(ctx, manifest, images, options) {
    options = options || {};
    return draw(ctx, manifest, images, options.rotations || poseFor(options.preset || 'neutral', options.progress === undefined ? 1 : options.progress), options);
  }
  return { PRESETS, EXPLODE, IDENTITY, validateManifest, multiply, transformPoint, rotationAt, poseFor, computeTransforms, frameBounds, layerFor, draw, render };
});
