// Headless conformance runs: the vendored ASAPS engine plays the story with the
// player's own rehearsal picker (seeded; prefers choices not yet taken in a beat).
// Usage: node player/tests/routes.mjs [seedFrom] [seedTo]   → JSON lines, one per seed.
import { StoryEngine, storyFromGeneratedJson } from '../vendor/asaps/asaps-core.slopling.js';
import fs from 'fs';
const json = JSON.parse(fs.readFileSync(new URL('../story/odyssey-tragic-comedy.json', import.meta.url)));
function prng(seed) { let s = seed % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const quiet = { log: console.log, warn: console.warn, error: console.error };
export async function play(seed, { until = null, maxBeats = 600, spy = null } = {}) { // spy(method, args) sees every renderer call
  const rnd = prng(seed), realRandom = Math.random; Math.random = rnd;
  console.log = console.warn = console.error = () => {};
  const st = {}; let visited = [], snap = null, end = null, steps = 0;
  const pick = (list) => { const fresh = list.filter(c => !visited.includes(c.id)); const pool = fresh.length ? fresh : list; return pool[Math.floor(rnd() * pool.length)].id; };
  let engine;
  const R = new Proxy({
    setState(k, v) { st[k] = v; }, getState(k) { return st[k]; }, setVisitedChoiceIds(ids) { visited = ids || []; },
    async renderChoices(c) { return pick(c); }, async renderPropSelection(q, p) { return pick(p); },
    async renderMovement(q, c) { return pick(c); }, async showChoices(c) { return pick(c); },
    async renderEndScreen(m) { end = String(m).split('\n')[0].replace(/\*/g, ''); snap = state(); engine.stop(); return 'exit'; },
    async renderAISummary(d) { end = d.title; snap = state(); engine.stop(); return 'exit'; },
    async renderConversationInput() { return 'set sail'; }, async renderInputText() { return ''; }, async renderCreditsPage() { return 'close'; },
  }, { get: (t, k) => { const f = t[k] ?? (async () => {}); return spy && typeof k === 'string' && k.startsWith('render') ? (...a) => { spy(k, a); return f(...a); } : f; } });
  engine = new StoryEngine(R, { mockMode: true });
  const story = storyFromGeneratedJson(json); const path = [];
  for (const b of story.getAllBeats()) { const ex = b.execute.bind(b); b.execute = async (c, r) => { path.push(b.id); if (++steps > maxBeats || b.id === until) { snap = state(); engine.stop(); return null; } return ex(c, r); }; }
  function state() { const c = engine.getContext(); return { counters: c.getCharacterCountersFor('char_player'), callChoice: c.getVariable('callChoice'), roleHolder: c.getVariable('roleHolderName'), knowsFatherCraft: c.getVariable('knowsFatherCraft'), recognition: +(c.getSentimentTo('char_father', 'player', 'recognition') || 0).toFixed(2), pride: +(c.getSentimentTo('char_father', 'player', 'pride') || 0).toFixed(2) }; }
  await engine.loadStory(story);
  try { await engine.start(); } catch (e) { end = 'ERROR ' + e.message; }
  Math.random = realRandom; Object.assign(console, quiet);
  return { seed, end, beats: path.length, looped: steps > maxBeats, state: snap, path };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const a = +(process.argv[2] || 1), b = +(process.argv[3] || 20);
  for (let s = a; s <= b; s++) { const r = await play(s); delete r.path; process.stdout.write(JSON.stringify(r) + '\n'); }
}
