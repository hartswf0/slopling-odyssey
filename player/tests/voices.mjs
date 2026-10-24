// Voice coverage: every line real ASAPS renders over rehearsal seeds 1-200 must have a Kokoro file,
// found by the same voiceKey() the player uses. Run: node player/tests/voices.mjs
import { play } from './routes.mjs';
import { voiceKey } from '../sound.js';
import fs from 'fs';
const dir = new URL('../voices/', import.meta.url), man = JSON.parse(fs.readFileSync(new URL('manifest.json', dir)));
const story = JSON.parse(fs.readFileSync(new URL('../story/odyssey-tragic-comedy.json', import.meta.url))).story;
// a multiChoice question with showSpeaker false is narration that quotes someone: the narrator reads it
const narrated = new Set(story.beats.filter(b => b.type === 'multiChoice' && b.parameters.showSpeaker === false).map(b => voiceKey(b.parameters.question)));
const NOTICE = /^AI features require configuration/; // ASAPS's own notice when no AI provider is set: not story text, left unvoiced
const spoken = new Map(); // key -> [method, speaker, text]
const SPOKEN = { renderText: a => ['', a[0]], renderDialog: a => [a[0], a[1]], renderDurScreen: a => ['', a[0]], renderEndScreen: a => ['', a[0]] };
for (let seed = 1; seed <= 200; seed++) await play(seed, { spy: (k, a) => { if (SPOKEN[k]) { const [spk, text] = SPOKEN[k](a); if (String(text || '').trim() && !NOTICE.test(text)) spoken.set(voiceKey(text), [k, spk, text]); } } });
const missing = [...spoken].filter(([k]) => !man.lines[k] || !fs.existsSync(new URL(man.lines[k].file, dir)));
const wrongVoice = [...spoken].filter(([k, [, spk]]) => man.lines[k] && spk && !narrated.has(k) && man.cast[spk] && man.cast[spk].voice !== man.lines[k].voice);
console.log(`voiced ${spoken.size - missing.length} of ${spoken.size} distinct lines rendered by ASAPS (seeds 1-200); ${Object.keys(man.lines).length} files; ${Math.round(Object.values(man.lines).reduce((s, l) => s + l.dur, 0) / 60)} min`);
for (const [k, [m, spk, t]] of missing) console.log('missing', k, m, spk || 'narration', JSON.stringify(String(t).slice(0, 70)));
for (const [k, [, spk]] of wrongVoice) console.log('wrong voice', k, spk, man.lines[k].voice);
process.exitCode = missing.length || wrongVoice.length ? 1 : 0;
