#!/usr/bin/env python3
"""Cut story props out of the Odyssey V3 kit crops (story/odyssey-v3/images/kit_crops/*.jpg).

These props (calipers, offer letter, clementines, prompt journal, bow, lathe, ...) have no
native transparent PNG in the production packets, so per docs/ASSET_POLICY.md they are
derived here from the JPEG kit crops and recorded as derived assets with their source and box.

Method: background colour from the crop border; pixels far from it are "ink"; dilation closes
the dashed cut line; flood fill from the edge marks the outside; what remains is each card
including its dashed border, which is how a cut-out reads. Output: player/props/*.png + PROPS.json
"""
from pathlib import Path
import hashlib, json, sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'story/odyssey-v3/images/kit_crops'
OUT = ROOT / 'player/props'
CROPS = sys.argv[1:] or [
    '01.prop.vernier-calipers-3-states', '01.prop.offer-letter-charter-5-states', '01.prop.olympus-clementines-bowl',
    '01.prop.prompt-journal-and-desk-drawers', '01.prop.three-hearts-craft-ai-taskmaster', '02.prop.herb-moly-flower-12-petals',
    '02.prop.ibm-reel-rotary-phone-amphora', '02.prop.sprint-hourglasses-6-states', '03.prop.shannon-unicycle-and-theseus-mouse',
    '05.hero.great-bow-of-billing', '06.hero.hendry-metal-lathe', '01.hero.sprint-board-salt', '03.hero.knuthe-downward-ladder',
    '02.hero.black-ship-ferry', '03.hero.ibm-360-mainframe',
]


def components(mask):
    """Label 4-connected True regions (small images; iterative fill)."""
    h, w = mask.shape; lab = np.zeros((h, w), np.int32); n = 0
    for y0, x0 in zip(*np.nonzero(mask)):
        if lab[y0, x0]: continue
        n += 1; stack = [(y0, x0)]; lab[y0, x0] = n
        while stack:
            y, x = stack.pop()
            for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= yy < h and 0 <= xx < w and mask[yy, xx] and not lab[yy, xx]:
                    lab[yy, xx] = n; stack.append((yy, xx))
    return lab, n


def cut(name):
    src = SRC / (name + '.jpg'); im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(int)
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]); bg = np.median(border, axis=0)
    ink = np.sqrt(((a - bg) ** 2).sum(-1)) > 34
    closed = Image.fromarray((ink * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(7))
    # flood the outside from a padded frame
    pad = Image.new('L', (closed.width + 2, closed.height + 2), 0); pad.paste(closed, (1, 1))
    ImageDraw.floodfill(pad, (0, 0), 128, thresh=0)
    inside = (np.asarray(pad)[1:-1, 1:-1] != 128)
    inside = np.asarray(Image.fromarray((inside * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3))) > 0
    lab, n = components(inside); out = []
    for k in range(1, n + 1):
        m = lab == k; area = m.sum()
        if area < 0.012 * m.size: continue
        ys, xs = np.nonzero(m); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
        alpha = Image.fromarray((m[y0:y1, x0:x1] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
        piece = im.crop((x0, y0, x1, y1)).convert('RGBA'); piece.putalpha(alpha)
        out.append(((x0, y0, x1, y1), piece))
    out.sort(key=lambda t: (t[0][1] // 60, t[0][0]))
    recs = []
    for i, (box, piece) in enumerate(out):
        fn = f'{name}__{i + 1:02d}.png'; piece.save(OUT / fn)
        recs.append({'file': 'props/' + fn, 'source': str(src.relative_to(ROOT)), 'source_sha256': hashlib.sha256(src.read_bytes()).hexdigest(),
                     'box': [int(v) for v in box], 'w': piece.width, 'h': piece.height, 'derived': 'cut from JPEG kit crop; no native PNG exists'})
    return recs


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    allrecs = {}
    for c in CROPS:
        allrecs[c] = cut(c); print(c, len(allrecs[c]))
    (OUT / 'PROPS.json').write_text(json.dumps({'schema': 'slopling.player.props.v1', 'props': allrecs}, indent=1))
