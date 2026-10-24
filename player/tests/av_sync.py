"""A/V sync of a recorded take (tests/record-take.mjs): for each sharp animation event (clap, snip,
step, flat, prop landing, brad clicks) find the audio onset nearest to it in the recording and report
the offset. Both are on the recording's clock: the event is logged on the frame the stage draws it.
Usage: python3 player/tests/av_sync.py take.webm   (reads take.events.json beside it)
"""
import json, subprocess, sys
import numpy as np

SHARP = {'clap', 'snip', 'step', 'flat', 'prop', 'pose', 'tagDrop', 'tagLand', 'workTag', 'click'}
take = sys.argv[1]; events = json.load(open(take.rsplit('.', 1)[0] + '.events.json'))
sr = 16000
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', take, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
x = np.diff(x, prepend=0)  # emphasise transients over music and voice
hop = 80  # 5 ms
e = np.sqrt(np.convolve(x * x, np.ones(hop) / hop, 'same')[::hop])
flux = np.maximum(0, np.diff(np.log(e + 1e-5), prepend=0))
offs = []
for ev in events:
    if ev['name'] not in SHARP: continue
    i0 = int(ev['t'] * 1000 / 5)
    lo, hi = max(0, i0 - 30), min(len(flux), i0 + 30)  # ±150 ms
    if hi <= lo: continue
    j = lo + int(np.argmax(flux[lo:hi]))
    if flux[j] > 1.0: offs.append((ev['name'], (j - i0) * 5))
if not offs: print('no sharp events found'); sys.exit(1)
o = np.array([v for _, v in offs])
print(f'{len(offs)} sharp events with a clear onset; audio after picture: median {np.median(o):+.0f} ms, '
      f'p10 {np.percentile(o, 10):+.0f} ms, p90 {np.percentile(o, 90):+.0f} ms; within ±45 ms: {np.mean(np.abs(o) <= 45) * 100:.0f}%')
by = {}
for n, v in offs: by.setdefault(n, []).append(v)
print('  ' + ', '.join(f'{n} {np.median(v):+.0f} ms (n={len(v)})' for n, v in sorted(by.items())))
