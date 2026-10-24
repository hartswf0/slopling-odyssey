"""Pre-render every spoken line of the story with Kokoro (82M, Apache-2.0) into player/voices/.

The player looks a line up by voice_key(text): the FNV-1a hash of the text as ASAPS renders it,
with markdown stripped and whitespace collapsed (same function in player/sound.js). Lines with
${variables} are expanded over every value the story can set, so lookup stays an exact match.

Each manifest entry also carries a loudness envelope (one digit 0-9 per 50 ms) so the stage can
drive gesture accents from the voice without analysing audio at runtime.

Setup (once):
  python3 -m venv .kvenv && .kvenv/bin/pip install kokoro-onnx soundfile
  curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
Run (resumable; existing files are kept):
  .kvenv/bin/python tools/render_voices.py --model kokoro-v1.0.onnx --voices voices-v1.0.bin
"""
import argparse, itertools, json, os, re, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STORY = ROOT / 'player/story/odyssey-tragic-comedy.json'
OUT = ROOT / 'player/voices'

NARRATOR = ('bm_fable', 1.0)
# speaker as ASAPS renders it -> (Kokoro voice, speed). One voice per role; the player's own lines stay unvoiced.
CAST = {
    '': NARRATOR, 'Narrator': NARRATOR,
    'Lars': ('bm_george', 0.9), 'Dana': ('af_heart', 1.05),
    'Andrei Karpathi': ('am_puck', 1.0), 'Fred Brookes': ('bm_lewis', 0.92), 'Linos Torwald': ('am_eric', 1.0),
    'Ken Tomson': ('am_santa', 0.95), 'Claude Shanning': ('am_liam', 1.05), 'Ilya Sutskov': ('am_echo', 0.95),
    'Gabe Newall': ('am_adam', 1.0), 'Jon Carmick': ('am_michael', 1.08), 'Denis Hassaby': ('bm_daniel', 1.0),
    'Don Knuthe': ('am_onyx', 0.9), 'Ajax': ('am_fenrir', 0.9),
    'Prompter': ('bf_emma', 1.04),  # the theatre's prompter: the asides in player/asides.json
}
VALUES = {'roleHolderName': ['you', 'nobody', 'Ines', 'Dougie', 'Chad', 'nobody yet'], 'islandsVisited': [str(i) for i in range(7)]}


def normal(text):
    return re.sub(r'\s+', ' ', re.sub(r'[*_`]', '', text)).strip()


def voice_key(text):
    h = 0x811c9dc5
    for ch in normal(text):
        h ^= ord(ch); h = (h * 0x01000193) & 0xffffffff
    return f'{h:08x}'


def speakable(text):
    lines = []
    for para in re.sub(r'[*_`]', '', text).split('\n'):
        para = para.strip()
        if para and not re.search(r'[.!?:;,"\')]$', para): para += '.'  # headings like "Laertes's Orchard" get a full stop
        if para: lines.append(para)
    return '\n'.join(lines)


def lines_of(story):
    out = []
    def tree(n):
        if isinstance(n, dict):
            if n.get('text'): out.append((n.get('speaker') or '', n['text']))
            for c in n.get('choices') or []: tree(c.get('dialogNode'))
    for b in story['beats']:
        p = b.get('parameters', {})
        t = b['type']
        if t in ('infoText', 'durScreen'): out.append(('', p.get('text', '')))
        elif t == 'multiChoice': out.append(('', p.get('question', '')))
        elif t == 'endScreen': out.append(('', p.get('message', '')))
        elif t == 'aiInfoText': out.append(('', p.get('fallbackText', '')))
        elif t == 'dialogTree': tree(p.get('dialogTree'))
    expanded = []
    for spk, text in out:
        names = sorted(set(re.findall(r'\$\{(\w+)\}', text)))
        for combo in itertools.product(*[VALUES[n] for n in names]):
            t = text
            for n, v in zip(names, combo): t = t.replace('${%s}' % n, v)
            if normal(t): expanded.append((spk, t))
    asides = ROOT / 'player/asides.json'  # the prompter's fourth-wall asides
    if asides.exists(): expanded += [('Prompter', t) for t in json.load(open(asides))['lines'].values()]
    return expanded


def envelope(audio, sr, hop=0.05):
    import numpy as np
    n = int(sr * hop); frames = [float(np.sqrt(np.mean(audio[i:i + n] ** 2))) for i in range(0, len(audio), n)]
    peak = max(frames) or 1
    return ''.join(str(min(9, int(10 * f / peak))) for f in frames)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True); ap.add_argument('--voices', required=True)
    ap.add_argument('--limit', type=int, default=0)
    a = ap.parse_args()
    from kokoro_onnx import Kokoro
    import soundfile as sf
    k = Kokoro(a.model, a.voices)
    story = json.load(open(STORY))['story']
    OUT.mkdir(exist_ok=True)
    mpath = OUT / 'manifest.json'
    man = json.load(open(mpath)) if mpath.exists() else {'engine': 'Kokoro-82M v1.0 via kokoro-onnx', 'license': 'Apache-2.0 (model and voices)', 'cast': {}, 'lines': {}}
    man['cast'] = {s: {'voice': v, 'speed': sp} for s, (v, sp) in CAST.items()}
    todo = lines_of(story)
    seen = set()
    for i, (spk, text) in enumerate(todo):
        key = voice_key(text)
        if key in seen: continue
        seen.add(key)
        if key in man['lines'] and (OUT / man['lines'][key]['file']).exists(): continue
        if a.limit and len(seen) > a.limit: break
        voice, speed = CAST.get(spk, NARRATOR)
        if spk not in CAST: print('uncast speaker, using narrator:', spk, file=sys.stderr)
        audio, sr = k.create(speakable(text), voice=voice, speed=speed, lang='en-gb' if voice.startswith('b') else 'en-us')
        with tempfile.NamedTemporaryFile(suffix='.wav') as w:
            sf.write(w.name, audio, sr)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', w.name, '-ac', '1', '-ar', '24000', '-b:a', '40k', str(OUT / f'{key}.mp3')], check=True)
        man['lines'][key] = {'file': f'{key}.mp3', 'speaker': spk or 'Narrator', 'voice': voice, 'dur': round(len(audio) / sr, 2), 'env': envelope(audio, sr), 'text': normal(text)[:80]}
        print(f'{len(seen)}/{len(todo)} {key} {spk or "Narrator"} {len(audio) / sr:.1f}s', flush=True)
        if len(seen) % 10 == 0: json.dump(man, open(mpath, 'w'), indent=0)
    # drop files for lines the story no longer has
    for key in ([] if a.limit else [k2 for k2 in man['lines'] if k2 not in seen]):
        (OUT / man['lines'][key]['file']).unlink(missing_ok=True); del man['lines'][key]
    json.dump(man, open(mpath, 'w'), indent=0)
    print('lines', len(man['lines']), 'seconds', round(sum(l['dur'] for l in man['lines'].values())))


if __name__ == '__main__':
    main()
