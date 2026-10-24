#!/usr/bin/env python3
"""Render a set layout the way player/stage.js draws it, for review without a browser.

  python3 tools/preview_set_layout.py LAYOUT.json OUT.png [--cells OUT_CELLS.png]

LAYOUT.json: {"place": "place_x", "wash": [top, bottom], "slots": [x...], "work": [x, y],
              "pieces": [[asset_id, centre_x, bottom_y, height, "back|floor|mid|front"], ...]}
Stage is 1280x720; the floor line is y=612; figure cards stand 372 px tall on the floor at
the slot x positions (slot 0 is Watson). --cells writes a numbered sheet of the place's pieces.
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw
ROOT = Path(__file__).resolve().parents[1]
P = ROOT / 'player'
st = json.loads((P / 'staging.json').read_text())

def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def render(lay, out):
    W, H, FLOOR = 1280, 720, 612
    a, b = hexrgb(lay['wash'][0]), hexrgb(lay['wash'][1])
    im = Image.new('RGBA', (W, H))
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H; d.line([(0, y), (W, y)], fill=tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3)) + (255,))
    d.rectangle([0, FLOOR, W, H], fill=(40, 26, 12, 56))
    pieces = {p['id']: p for p in st['sets'][lay['place']]['pieces']}
    def draw(layer):
        for pid, cx, by, h, ly in lay['pieces']:
            if ly != layer: continue
            src = Image.open(P / pieces[pid]['src']).convert('RGBA'); w = int(h * src.width / src.height)
            im.alpha_composite(src.resize((max(1, w), max(1, int(h)))), (int(cx - w / 2), int(by - h)))
    for layer in ('back', 'floor', 'mid'): draw(layer)
    figs = [f for f in ('char_player', 'char_dana', 'char_chad', 'char_ines') if st['figures'].get(f, {}).get('src')] or ['char_player']  # rigged cast have no card file
    for i, x in enumerate(lay.get('slots', [])[:3]):
        f = st['figures'][figs[i % len(figs)]]; src = Image.open(P / f['src']).convert('RGBA'); h = 372; w = int(h * src.width / src.height)
        im.alpha_composite(src.resize((w, h)), (int(x - w / 2), FLOOR + 8 - h))
    draw('front')
    if lay.get('work'):
        x, y = lay['work']; d = ImageDraw.Draw(im); d.ellipse([x - 6, y - 6, x + 6, y + 6], outline=(255, 230, 160, 255), width=3)
    im.convert('RGB').save(out)

def cells(place, out):
    ps = st['sets'][place]['pieces']; tiles = []
    for i, p in enumerate(ps):
        t = Image.open(P / p['src']).convert('RGBA'); t.thumbnail((300, 220)); c = Image.new('RGBA', (310, 250), (60, 80, 60, 255)); c.alpha_composite(t, (5, 5))
        ImageDraw.Draw(c).text((6, 230), f"{p['id']}  {p['w']}x{p['h']}", fill=(255, 255, 255, 255)); tiles.append(c)
    cols = 3; rows = (len(tiles) + cols - 1) // cols; S = Image.new('RGB', (cols * 310, rows * 250))
    for i, t in enumerate(tiles): S.paste(t, ((i % cols) * 310, (i // cols) * 250))
    S.save(out)

if __name__ == '__main__':
    lay = json.loads(Path(sys.argv[1]).read_text())
    render(lay, sys.argv[2])
    if '--cells' in sys.argv: cells(lay['place'], sys.argv[sys.argv.index('--cells') + 1])
